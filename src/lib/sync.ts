import 'server-only';
import { supabaseAdmin } from './supabase';
import { getProducts, type NexShopProduct } from './nexshop';
import { buildGameRow } from './game-presets';
import { calculateSellPrice } from './pricing';
import { getPricingConfig } from './queries';

/** Hanya kategori game yang diambil — toko ini khusus top up game. */
const GAME_CATEGORIES = ['topup game', 'top up game', 'game', 'voucher game'];

function isGameProduct(p: NexShopProduct): boolean {
  const kategori = (p.kategori ?? '').toLowerCase();
  return GAME_CATEGORIES.some((c) => kategori.includes(c));
}

export type SyncResult = {
  fetched: number;
  gameProducts: number;
  gamesCreated: number;
  gamesTotal: number;
  productsUpserted: number;
  productsDeactivated: number;
  durationMs: number;
};

/**
 * Menarik katalog NexShop lalu menyimpannya ke Supabase.
 *
 * - Game baru dibuat NONAKTIF supaya kamu yang memilih mana yang dijual.
 * - Harga jual dihitung ulang dari `harga_reseller` terbaru, bukan disalin manual.
 * - Produk yang hilang dari katalog ditandai nonaktif, bukan dihapus, agar
 *   riwayat pesanan lama tetap utuh.
 */
export async function syncCatalog(): Promise<SyncResult> {
  const startedAt = Date.now();
  const db = supabaseAdmin();
  const pricing = await getPricingConfig();

  const all = await getProducts();
  const gameProducts = all.filter(isGameProduct);

  // --- 1. Pastikan setiap operator punya baris di tabel games -----------------
  const operators = new Map<string, boolean>();
  for (const p of gameProducts) {
    const needsServer = operators.get(p.operator) || p.butuh_server_id;
    operators.set(p.operator, needsServer);
  }

  const { data: existingGames } = await db.from('games').select('id, slug, provider_operator');
  const byOperator = new Map(
    (existingGames ?? []).map((g) => [g.provider_operator ?? '', g as { id: string; slug: string }]),
  );

  let gamesCreated = 0;
  for (const [operator, needsServer] of operators) {
    if (byOperator.has(operator)) continue;
    const row = buildGameRow(operator, needsServer);

    // Slug harus unik; tambahkan sufiks bila bentrok dengan game lain.
    let slug = row.slug;
    let attempt = 1;
    while ((existingGames ?? []).some((g) => g.slug === slug)) {
      slug = `${row.slug}-${++attempt}`;
    }

    const { data: inserted } = await db
      .from('games')
      .insert({ ...row, slug, is_active: false })
      .select('id, slug, provider_operator')
      .maybeSingle();

    if (inserted) {
      byOperator.set(operator, inserted as { id: string; slug: string });
      (existingGames ?? []).push(inserted as never);
      gamesCreated++;
    }
  }

  // --- 2. Upsert produk -------------------------------------------------------
  const now = new Date().toISOString();

  // Margin per-produk yang sudah kamu atur manual harus dipertahankan.
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
      game_id: byOperator.get(p.operator)?.id ?? null,
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

  // --- 3. Nonaktifkan produk yang sudah tidak ada di katalog ------------------
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
      games_created: gamesCreated,
    },
    updated_at: now,
  });

  return {
    fetched: all.length,
    gameProducts: gameProducts.length,
    gamesCreated,
    gamesTotal: operators.size,
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
