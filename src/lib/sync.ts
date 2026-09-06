import 'server-only';
import { supabaseAdmin } from './supabase';
import { getProducts, type NexShopProduct } from './nexshop';
import { buildGameRow } from './game-presets';
import { calculateSellPrice } from './pricing';
import { getPricingConfig } from './queries';

/**
 * Kategori katalog NexShop yang dianggap produk game.
 *
 * Katalog memakai "Gaming" untuk top up in-game dan "Voucher Game" untuk kode
 * voucher. Kategori lain (Pulsa, Paket Data, E-Wallet, Tagihan, PLN, Hiburan)
 * sengaja tidak diambil — toko ini khusus game.
 */
const GAME_CATEGORIES = new Set(['gaming', 'voucher game', 'topup game', 'top up game']);

/**
 * Operator yang jelas bukan game atau hanya penanda internal penyedia.
 * Dicocokkan sebagai substring pada nama operator (huruf kecil).
 */
const EXCLUDED_OPERATORS = [
  'nonaktif',
  'produk nonaktif',
  'bstation',
  'hbo',
  'wifi id',
  'netflix',
  'vidio',
  'disney',
  'spotify',
  'youtube',
  'catchplay',
  'iflix',
  'viu',
];

function isGameProduct(p: NexShopProduct): boolean {
  const kategori = (p.kategori ?? '').trim().toLowerCase();
  if (!GAME_CATEGORIES.has(kategori)) return false;

  const operator = (p.operator ?? '').trim().toLowerCase();
  if (!operator) return false;
  return !EXCLUDED_OPERATORS.some((bad) => operator.includes(bad));
}

export type SyncResult = {
  fetched: number;
  gameProducts: number;
  gamesCreated: number;
  gamesTotal: number;
  operatorsMapped: number;
  productsUpserted: number;
  productsDeactivated: number;
  durationMs: number;
};

/**
 * Menarik katalog NexShop lalu menyimpannya ke Supabase.
 *
 * - Game dikelompokkan berdasarkan SLUG, bukan nama operator. Beberapa operator
 *   yang merujuk game sama (mis. "Mobile Legends" dan "Mobile Legend Kios
 *   Pintar") jatuh ke satu kartu etalase.
 * - Game baru dibuat NONAKTIF supaya kamu yang memilih mana yang dijual.
 * - Penyuntingan manual kamu (nama, slug, label input, status aktif, margin)
 *   tidak pernah ditimpa sinkronisasi berikutnya.
 * - Harga jual dihitung ulang dari `harga_reseller` terbaru, bukan disalin.
 * - Produk yang hilang dari katalog ditandai nonaktif, bukan dihapus, agar
 *   riwayat pesanan lama tetap utuh.
 */
export async function syncCatalog(): Promise<SyncResult> {
  const startedAt = Date.now();
  const db = supabaseAdmin();
  const pricing = await getPricingConfig();

  const all = await getProducts();
  const gameProducts = all.filter(isGameProduct);

  // --- 1. Kelompokkan operator katalog menjadi kandidat game ----------------
  type Candidate = ReturnType<typeof buildGameRow> & {
    operators: string[];
    kind: 'game' | 'voucher';
  };
  const bySlug = new Map<string, Candidate>();

  for (const p of gameProducts) {
    const operator = p.operator.trim();
    const row = buildGameRow(operator, Boolean(p.butuh_server_id));
    const existing = bySlug.get(row.slug);
    // Kategori NexShop menentukan bagian etalase. Sekali sebuah entri punya
    // produk "Gaming", ia diperlakukan sebagai game meski juga punya voucher.
    const kind = (p.kategori ?? '').trim().toLowerCase() === 'voucher game' ? 'voucher' : 'game';

    if (existing) {
      if (!existing.operators.includes(operator)) existing.operators.push(operator);
      // Kalau salah satu operator butuh Server ID, gamenya butuh Server ID.
      existing.needs_server_id = existing.needs_server_id || row.needs_server_id;
      if (kind === 'game') existing.kind = 'game';
    } else {
      bySlug.set(row.slug, { ...row, operators: [operator], kind });
    }
  }

  // --- 2. Sisipkan game baru, perbarui pemetaan operator game lama ----------
  // Kolom provider_operators berasal dari migrasi 03. Kalau migrasi itu belum
  // dijalankan, sinkronisasi tetap bekerja — daftar operator hanya tidak ikut
  // disimpan (pemetaannya sendiri dihitung ulang tiap kali sinkron).
  const [operatorProbe, kindProbe] = await Promise.all([
    db.from('games').select('provider_operators').limit(1),
    db.from('games').select('kind').limit(1),
  ]);
  const hasOperatorList = !operatorProbe.error;
  const hasKind = !kindProbe.error;

  const { data: existingGames } = await db.from('games').select('id, slug');
  const gameIdBySlug = new Map((existingGames ?? []).map((g) => [g.slug, g.id as string]));

  let gamesCreated = 0;
  for (const [slug, candidate] of bySlug) {
    const { operators, kind, ...row } = candidate;
    const known = gameIdBySlug.get(slug);
    const operatorFields: Record<string, unknown> = { provider_operator: operators[0] };
    if (hasOperatorList) operatorFields.provider_operators = operators;

    if (known) {
      // Game sudah ada: hanya segarkan pemetaan operator. Kolom lain — termasuk
      // `kind` yang mungkin kamu ubah manual — tidak pernah ditimpa.
      await db.from('games').update(operatorFields).eq('id', known);
      continue;
    }

    const { data: inserted } = await db
      .from('games')
      .insert({ ...row, ...operatorFields, ...(hasKind ? { kind } : {}), is_active: false })
      .select('id, slug')
      .maybeSingle();

    if (inserted) {
      gameIdBySlug.set(inserted.slug as string, inserted.id as string);
      gamesCreated++;
    }
  }

  // Peta operator -> game_id, dipakai saat menyimpan produk.
  const gameIdByOperator = new Map<string, string>();
  for (const [slug, candidate] of bySlug) {
    const id = gameIdBySlug.get(slug);
    if (!id) continue;
    for (const operator of candidate.operators) gameIdByOperator.set(operator, id);
  }

  // --- 3. Upsert produk -----------------------------------------------------
  const now = new Date().toISOString();

  // Margin per-produk dan status tampil yang sudah kamu atur harus bertahan.
  const { data: existingProducts } = await db
    .from('products')
    .select('kode_produk, margin_type, margin_value, is_active, sort_order, label, is_promo');
  const existingByCode = new Map((existingProducts ?? []).map((p) => [p.kode_produk, p]));

  const rows = gameProducts.map((p) => {
    const prev = existingByCode.get(p.kode_produk);
    const sellPrice = calculateSellPrice(p.harga_reseller, pricing, {
      margin_type: prev?.margin_type ?? null,
      margin_value: prev?.margin_value ?? null,
    });

    return {
      game_id: gameIdByOperator.get(p.operator.trim()) ?? null,
      kode_produk: p.kode_produk,
      name: p.nama,
      category: p.kategori,
      operator: p.operator,
      base_price: Math.round(p.harga_normal),
      cost_price: Math.round(p.harga_reseller),
      margin_type: prev?.margin_type ?? null,
      margin_value: prev?.margin_value ?? null,
      sell_price: sellPrice,
      needs_server_id: Boolean(p.butuh_server_id),
      provider_status: p.status ?? 'ACTIVE',
      is_active: prev?.is_active ?? true,
      is_promo: prev?.is_promo ?? false,
      label: prev?.label ?? null,
      sort_order: prev?.sort_order ?? 100,
      last_synced_at: now,
    };
  });

  let productsUpserted = 0;
  const CHUNK = 200;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error } = await db.from('products').upsert(chunk, { onConflict: 'kode_produk' });
    if (error) throw new Error(`Gagal menyimpan produk: ${error.message}`);
    productsUpserted += chunk.length;
  }

  // --- 4. Nonaktifkan produk yang sudah tidak ada di katalog ----------------
  const activeCodes = new Set(rows.map((r) => r.kode_produk));
  const stale = (existingProducts ?? [])
    .filter((p) => !activeCodes.has(p.kode_produk))
    .map((p) => p.kode_produk);

  let productsDeactivated = 0;
  if (stale.length > 0) {
    for (let i = 0; i < stale.length; i += CHUNK) {
      const chunk = stale.slice(i, i + CHUNK);
      await db.from('products').update({ provider_status: 'INACTIVE' }).in('kode_produk', chunk);
      productsDeactivated += chunk.length;
    }
  }

  await db.from('settings').upsert({
    key: 'last_sync',
    value: {
      at: now,
      fetched: all.length,
      game_products: gameProducts.length,
      games: bySlug.size,
      games_created: gamesCreated,
    },
    updated_at: now,
  });

  return {
    fetched: all.length,
    gameProducts: gameProducts.length,
    gamesCreated,
    gamesTotal: bySlug.size,
    operatorsMapped: gameIdByOperator.size,
    productsUpserted,
    productsDeactivated,
    durationMs: Date.now() - startedAt,
  };
}

/** Hitung ulang harga jual semua produk setelah margin global diubah. */
export async function recalculatePrices(): Promise<number> {
  const db = supabaseAdmin();
  const pricing = await getPricingConfig();

  const { data } = await db.from('products').select('id, cost_price, margin_type, margin_value');
  const rows = data ?? [];

  let updated = 0;
  for (const row of rows) {
    const sell = calculateSellPrice(row.cost_price, pricing, {
      margin_type: row.margin_type,
      margin_value: row.margin_value,
    });
    await db.from('products').update({ sell_price: sell }).eq('id', row.id);
    updated++;
  }
  return updated;
}
