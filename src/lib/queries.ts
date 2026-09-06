import 'server-only';
import { supabaseAdmin } from './supabase';
import { DEFAULT_PRICING, type PricingConfig } from './pricing';
import type {
  Faq,
  Game,
  GameKind,
  OrderSettings,
  PaymentMethod,
  Product,
  PublicProduct,
  StoreSettings,
  Testimonial,
} from '@/types';

/** Kolom produk yang boleh keluar ke browser — harga modal sengaja tidak ikut. */
const PUBLIC_PRODUCT_COLUMNS =
  'id, kode_produk, name, sell_price, base_price, is_promo, label, needs_server_id';

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const { data } = await supabaseAdmin().from('settings').select('value').eq('key', key).maybeSingle();
  return (data?.value as T) ?? fallback;
}

export async function getStoreSettings(): Promise<StoreSettings> {
  return getSetting<StoreSettings>('store', {
    name: 'Sayba Voucher',
    tagline: 'Voucher Digital & Top Up Game Resmi',
    url: 'https://topup.sayba.id',
    whatsapp: '6281234567890',
    email: 'sayba.help@gmail.com',
    city: 'Pontianak',
    province: 'Kalimantan Barat',
    address: 'Pontianak, Kalimantan Barat',
    open_hours: '08:00-23:00 WIB',
  });
}

export function getPricingConfig(): Promise<PricingConfig> {
  return getSetting<PricingConfig>('pricing', DEFAULT_PRICING);
}

export function getOrderSettings(): Promise<OrderSettings> {
  return getSetting<OrderSettings>('order', {
    expire_minutes: 60,
    auto_process: true,
    require_whatsapp: true,
    require_email: false,
  });
}

/** Semua game aktif untuk etalase & sitemap. */
export async function getActiveGames(): Promise<Game[]> {
  const { data } = await supabaseAdmin()
    .from('games')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });
  return (data as Game[]) ?? [];
}

export async function getFeaturedGames(limit = 8): Promise<Game[]> {
  const { data } = await supabaseAdmin()
    .from('games')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit);
  return (data as Game[]) ?? [];
}

/**
 * Etalase per bagian: 'voucher' (kode voucher digital) atau 'game' (top up
 * in-game). Kalau migrasi 04 belum dijalankan, kolom `kind` belum ada — dalam
 * hal itu semua entri dianggap 'game' agar halaman tetap tampil, bukan error.
 */
export async function getGamesByKind(kind: GameKind, limit = 60): Promise<Game[]> {
  const { data, error } = await supabaseAdmin()
    .from('games')
    .select('*')
    .eq('is_active', true)
    .eq('kind', kind)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
    .limit(limit);

  if (!error) return (data as Game[]) ?? [];
  return deriveGamesByKind(kind, limit);
}

/**
 * Cadangan bila migrasi 04 belum dijalankan: bagian etalase diturunkan dari
 * kategori produknya. Hasilnya sama, hanya sedikit lebih mahal — satu query
 * tambahan — sehingga situs tetap benar sambil menunggu migrasi dipasang.
 */
async function deriveGamesByKind(kind: GameKind, limit: number): Promise<Game[]> {
  const [{ data: productRows }, games] = await Promise.all([
    supabaseAdmin()
      .from('products')
      .select('game_id, category')
      .eq('is_active', true)
      .eq('provider_status', 'ACTIVE'),
    getActiveGames(),
  ]);

  const voucherIds = new Set<string>();
  const gameIds = new Set<string>();
  for (const row of (productRows as { game_id: string | null; category: string | null }[]) ?? []) {
    if (!row.game_id) continue;
    if (row.category === 'Voucher Game') voucherIds.add(row.game_id);
    else gameIds.add(row.game_id);
  }

  return games
    .filter((game) =>
      // Entri yang punya produk in-game selalu dihitung sebagai game, meski
      // sebagian produknya berupa voucher.
      kind === 'voucher' ? voucherIds.has(game.id) && !gameIds.has(game.id) : gameIds.has(game.id),
    )
    .map((game) => ({ ...game, kind }))
    .slice(0, limit);
}

/** Game yang ditonjolkan di beranda, mengikuti urutan `site.homeGameSlugs`. */
export async function getGamesBySlugs(slugs: readonly string[]): Promise<Game[]> {
  if (slugs.length === 0) return [];
  const { data } = await supabaseAdmin()
    .from('games')
    .select('*')
    .eq('is_active', true)
    .in('slug', slugs as string[]);

  const rows = (data as Game[]) ?? [];
  // Pertahankan urutan yang ditulis di konfigurasi, bukan urutan dari database.
  return slugs
    .map((slug) => rows.find((row) => row.slug === slug))
    .filter((row): row is Game => Boolean(row));
}

/** Banner untuk carousel beranda. */
export async function getBanners(limit = 6) {
  const { data } = await supabaseAdmin()
    .from('banners')
    .select('id, title, subtitle, image_url, link_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const { data } = await supabaseAdmin()
    .from('games')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  return (data as Game) ?? null;
}

export async function getPublicProducts(gameId: string): Promise<PublicProduct[]> {
  const { data } = await supabaseAdmin()
    .from('products')
    .select(PUBLIC_PRODUCT_COLUMNS)
    .eq('game_id', gameId)
    .eq('is_active', true)
    .eq('provider_status', 'ACTIVE')
    .gt('sell_price', 0)
    .order('sell_price', { ascending: true });
  return (data as PublicProduct[]) ?? [];
}

/** Dipakai server saat membuat order — berisi harga modal, jangan diekspos. */
export async function getProductByCode(kodeProduk: string): Promise<Product | null> {
  const { data } = await supabaseAdmin()
    .from('products')
    .select('*')
    .eq('kode_produk', kodeProduk)
    .maybeSingle();
  return (data as Product) ?? null;
}

/** Harga termurah per game, untuk label "mulai dari" di kartu etalase. */
export async function getCheapestPriceByGame(): Promise<Record<string, number>> {
  const { data } = await supabaseAdmin()
    .from('products')
    .select('game_id, sell_price')
    .eq('is_active', true)
    .eq('provider_status', 'ACTIVE')
    .gt('sell_price', 0);

  const map: Record<string, number> = {};
  for (const row of (data as { game_id: string | null; sell_price: number }[]) ?? []) {
    if (!row.game_id) continue;
    if (map[row.game_id] === undefined || row.sell_price < map[row.game_id]) {
      map[row.game_id] = row.sell_price;
    }
  }
  return map;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const { data } = await supabaseAdmin()
    .from('payment_methods')
    .select(
      'id, code, name, group_name, provider, icon_url, fee_flat, fee_percent, min_amount, max_amount, instructions, account_name, account_number, qris_image_url, sort_order',
    )
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return (data as PaymentMethod[]) ?? [];
}

export async function getPaymentMethodByCode(code: string) {
  const { data } = await supabaseAdmin()
    .from('payment_methods')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .maybeSingle();
  return data;
}

export async function getTestimonials(limit = 8): Promise<Testimonial[]> {
  const { data } = await supabaseAdmin()
    .from('testimonials')
    .select('id, name, city, game, rating, message')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(limit);
  return (data as Testimonial[]) ?? [];
}

export async function getFaqs(limit = 12): Promise<Faq[]> {
  const { data } = await supabaseAdmin()
    .from('faqs')
    .select('id, question, answer, category')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(limit);
  return (data as Faq[]) ?? [];
}

/** Ringkasan transaksi sukses untuk social proof di halaman depan. */
export async function getSuccessStats(): Promise<{ total: number; today: number }> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [{ count: total }, { count: today }] = await Promise.all([
    supabaseAdmin()
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('fulfillment_status', 'SUCCESS'),
    supabaseAdmin()
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('fulfillment_status', 'SUCCESS')
      .gte('created_at', startOfDay.toISOString()),
  ]);

  return { total: total ?? 0, today: today ?? 0 };
}

/** Transaksi sukses terbaru (ID disensor) untuk ticker "baru saja top up". */
export async function getRecentSuccessOrders(limit = 10) {
  const { data } = await supabaseAdmin()
    .from('orders')
    .select('order_code, game_name, product_name, target, completed_at')
    .eq('fulfillment_status', 'SUCCESS')
    .order('completed_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}
