import { slugify } from './utils';

/**
 * Preset metadata game.
 *
 * Katalog NexShop hanya memberi kolom `operator` (mis. "Mobile Legends").
 * File ini menerjemahkan nilai itu menjadi slug URL yang SEO-friendly, label
 * form yang benar, kode game untuk /check-nickname, dan teks deskripsi.
 *
 * Game yang belum terdaftar di sini tetap ikut tersinkron — dibuat otomatis
 * dengan pengaturan default dan status NONAKTIF, sehingga kamu yang memutuskan
 * mana yang tampil di etalase lewat dashboard /admin.
 */

export type GamePreset = {
  slug: string;
  name: string;
  publisher?: string;
  /** kode_game untuk POST /check-nickname. Kosong = validasi tidak tersedia. */
  nexshopGameCode?: string;
  aliases: string[];
  needsServerId?: boolean;
  idLabel?: string;
  idPlaceholder?: string;
  serverLabel?: string;
  serverPlaceholder?: string;
  serverOptions?: { value: string; label: string }[];
  shortDescription?: string;
  howToOrder?: string[];
  featured?: boolean;
  sortOrder?: number;
};

const DEFAULT_HOW_TO = (idLabel: string) => [
  `Masukkan ${idLabel} akun kamu dengan benar.`,
  'Pilih nominal yang ingin dibeli.',
  'Pilih metode pembayaran (QRIS, e-wallet, atau transfer bank).',
  'Isi nomor WhatsApp aktif untuk menerima bukti transaksi.',
  'Selesaikan pembayaran, item masuk otomatis dalam hitungan detik.',
];

export const GAME_PRESETS: GamePreset[] = [
  {
    slug: 'mobile-legends',
    name: 'Mobile Legends: Bang Bang',
    publisher: 'Moonton',
    nexshopGameCode: 'mobile-legends',
    aliases: ['mobile legends', 'mobile legend', 'mlbb', 'ml', 'mobile legends bang bang'],
    needsServerId: true,
    idLabel: 'User ID',
    idPlaceholder: 'Contoh: 123456789',
    serverLabel: 'Zone ID (Server)',
    serverPlaceholder: 'Contoh: 2123',
    shortDescription:
      'Top up diamond Mobile Legends termurah, proses otomatis kurang dari 10 detik.',
    howToOrder: [
      'Buka Mobile Legends, ketuk foto profil di pojok kiri atas.',
      'Salin User ID dan Zone ID (angka dalam kurung).',
      'Masukkan kedua ID tersebut di form, lalu pilih nominal diamond.',
      'Pilih metode pembayaran dan selesaikan pembayaran.',
      'Diamond masuk otomatis, cek notifikasi di dalam game.',
    ],
    featured: true,
    sortOrder: 1,
  },
  {
    slug: 'free-fire',
    name: 'Free Fire',
    publisher: 'Garena',
    nexshopGameCode: 'free-fire',
    aliases: ['free fire', 'freefire', 'ff', 'garena free fire'],
    idLabel: 'User ID',
    idPlaceholder: 'Contoh: 123456789',
    shortDescription: 'Top up diamond Free Fire murah, cukup masukkan User ID tanpa login akun.',
    howToOrder: [
      'Buka Free Fire, ketuk foto profil di pojok kiri atas.',
      'Salin angka User ID / Player ID kamu.',
      'Masukkan User ID di form, lalu pilih nominal diamond.',
      'Pilih metode pembayaran dan selesaikan pembayaran.',
      'Diamond langsung masuk ke akun kamu.',
    ],
    featured: true,
    sortOrder: 2,
  },
  {
    slug: 'pubg-mobile',
    name: 'PUBG Mobile',
    publisher: 'Level Infinite',
    nexshopGameCode: 'pubg-mobile',
    aliases: ['pubg mobile', 'pubgm', 'pubg'],
    idLabel: 'Character ID',
    idPlaceholder: 'Contoh: 5123456789',
    shortDescription: 'Top up UC PUBG Mobile resmi dan murah, langsung masuk ke akun.',
    featured: true,
    sortOrder: 3,
  },
  {
    slug: 'genshin-impact',
    name: 'Genshin Impact',
    publisher: 'HoYoverse',
    nexshopGameCode: 'genshin-impact',
    aliases: ['genshin impact', 'genshin'],
    needsServerId: true,
    idLabel: 'UID',
    idPlaceholder: 'Contoh: 812345678',
    serverLabel: 'Server',
    serverPlaceholder: 'Pilih server',
    serverOptions: [
      { value: 'os_asia', label: 'Asia' },
      { value: 'os_usa', label: 'America' },
      { value: 'os_euro', label: 'Europe' },
      { value: 'os_cht', label: 'TW/HK/MO' },
    ],
    shortDescription: 'Top up Genesis Crystal & Blessing of the Welkin Moon harga hemat.',
    featured: true,
    sortOrder: 4,
  },
  {
    slug: 'honor-of-kings',
    name: 'Honor of Kings',
    publisher: 'Level Infinite',
    nexshopGameCode: 'honor-of-kings',
    aliases: ['honor of kings', 'hok'],
    idLabel: 'Player ID',
    idPlaceholder: 'Contoh: 123456789',
    shortDescription: 'Top up Token Honor of Kings cepat dan murah.',
    featured: true,
    sortOrder: 5,
  },
  {
    slug: 'valorant',
    name: 'VALORANT',
    publisher: 'Riot Games',
    nexshopGameCode: 'valorant',
    aliases: ['valorant'],
    idLabel: 'Riot ID',
    idPlaceholder: 'Contoh: NamaKamu#NA1',
    shortDescription: 'Top up VALORANT Point (VP) tanpa ribet, aman tanpa login.',
    featured: true,
    sortOrder: 6,
  },
  {
    slug: 'call-of-duty-mobile',
    name: 'Call of Duty: Mobile',
    publisher: 'Garena',
    nexshopGameCode: 'call-of-duty-mobile',
    aliases: ['call of duty mobile', 'codm', 'cod mobile', 'cod m'],
    idLabel: 'Open ID',
    idPlaceholder: 'Masukkan Open ID',
    shortDescription: 'Top up CP Call of Duty Mobile murah dan otomatis.',
    sortOrder: 7,
  },
  {
    slug: 'honkai-star-rail',
    name: 'Honkai: Star Rail',
    publisher: 'HoYoverse',
    nexshopGameCode: 'honkai-star-rail',
    aliases: ['honkai star rail', 'honkai: star rail', 'hsr', 'star rail'],
    needsServerId: true,
    idLabel: 'UID',
    idPlaceholder: 'Contoh: 812345678',
    serverLabel: 'Server',
    serverOptions: [
      { value: 'prod_official_asia', label: 'Asia' },
      { value: 'prod_official_usa', label: 'America' },
      { value: 'prod_official_eur', label: 'Europe' },
      { value: 'prod_official_cht', label: 'TW/HK/MO' },
    ],
    shortDescription: 'Top up Oneiric Shard Honkai: Star Rail dengan harga bersahabat.',
    sortOrder: 8,
  },
  {
    slug: 'roblox',
    name: 'Roblox',
    publisher: 'Roblox Corporation',
    nexshopGameCode: 'roblox',
    aliases: ['roblox', 'robux'],
    idLabel: 'Username Roblox',
    idPlaceholder: 'Contoh: playerkeren123',
    shortDescription: 'Beli Robux murah, cukup dengan username Roblox kamu.',
    sortOrder: 9,
  },
  {
    slug: 'point-blank',
    name: 'Point Blank',
    publisher: 'Zepetto',
    nexshopGameCode: 'point-blank',
    aliases: ['point blank', 'pb zepetto', 'pb'],
    idLabel: 'ID Player',
    shortDescription: 'Top up PB Cash Point Blank cepat dan aman.',
    sortOrder: 10,
  },
  {
    slug: 'arena-of-valor',
    name: 'Arena of Valor',
    publisher: 'Garena',
    nexshopGameCode: 'arena-of-valor',
    aliases: ['arena of valor', 'aov'],
    idLabel: 'Player ID',
    shortDescription: 'Top up Voucher Arena of Valor harga reseller.',
    sortOrder: 11,
  },
  {
    slug: 'clash-of-clans',
    name: 'Clash of Clans',
    publisher: 'Supercell',
    nexshopGameCode: 'clash-of-clans',
    aliases: ['clash of clans', 'coc'],
    idLabel: 'Player Tag',
    idPlaceholder: 'Contoh: #ABCD1234',
    shortDescription: 'Top up Gems Clash of Clans lewat Supercell ID.',
    sortOrder: 12,
  },
  {
    slug: 'ragnarok-m',
    name: 'Ragnarok M: Eternal Love',
    publisher: 'Gravity',
    aliases: ['ragnarok m', 'ragnarok mobile', 'ragnarok'],
    needsServerId: true,
    idLabel: 'Character ID',
    serverLabel: 'Server',
    shortDescription: 'Top up Big Cat Coin Ragnarok M dengan harga hemat.',
    sortOrder: 13,
  },
  {
    slug: 'stumble-guys',
    name: 'Stumble Guys',
    publisher: 'Scopely',
    aliases: ['stumble guys'],
    idLabel: 'Player ID',
    shortDescription: 'Top up Gems Stumble Guys murah dan instan.',
    sortOrder: 14,
  },
  {
    slug: 'sausage-man',
    name: 'Sausage Man',
    publisher: 'XD Entertainment',
    aliases: ['sausage man'],
    idLabel: 'Player ID',
    shortDescription: 'Top up Candy Sausage Man langsung masuk.',
    sortOrder: 15,
  },
  {
    slug: 'super-sus',
    name: 'Super Sus',
    publisher: 'GoGames',
    aliases: ['super sus'],
    idLabel: 'Player ID',
    shortDescription: 'Top up Golden Star Super Sus harga bersaing.',
    sortOrder: 16,
  },
];

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

const ALIAS_INDEX = new Map<string, GamePreset>();
for (const preset of GAME_PRESETS) {
  ALIAS_INDEX.set(normalize(preset.name), preset);
  ALIAS_INDEX.set(normalize(preset.slug), preset);
  for (const alias of preset.aliases) ALIAS_INDEX.set(normalize(alias), preset);
}

/** Mencari preset berdasarkan nilai `operator` dari katalog NexShop. */
export function findPreset(operator: string): GamePreset | null {
  const key = normalize(operator);
  const exact = ALIAS_INDEX.get(key);
  if (exact) return exact;

  // Cocokkan sebagian: "Topup Mobile Legends" -> mobile-legends.
  for (const [alias, preset] of ALIAS_INDEX) {
    if (alias.length >= 3 && (key.includes(alias) || alias.includes(key))) return preset;
  }
  return null;
}

/**
 * Membentuk baris tabel `games` dari nilai operator katalog.
 * Game tanpa preset dibuat nonaktif supaya kamu yang memilih untuk menjualnya.
 */
export function buildGameRow(operator: string, needsServerId: boolean) {
  const preset = findPreset(operator);
  const idLabel = preset?.idLabel ?? 'User ID';

  return {
    slug: preset?.slug ?? slugify(operator),
    name: preset?.name ?? operator,
    publisher: preset?.publisher ?? null,
    nexshop_game_code: preset?.nexshopGameCode ?? null,
    provider_operator: operator,
    short_description:
      preset?.shortDescription ??
      `Top up ${operator} murah, proses otomatis, dan aman tanpa perlu login akun.`,
    id_label: idLabel,
    id_placeholder: preset?.idPlaceholder ?? `Masukkan ${idLabel}`,
    server_label: preset?.serverLabel ?? 'Server / Zone ID',
    server_placeholder: preset?.serverPlaceholder ?? 'Masukkan Zone ID',
    needs_server_id: preset?.needsServerId ?? needsServerId,
    server_options: preset?.serverOptions ?? null,
    how_to_order: preset?.howToOrder ?? DEFAULT_HOW_TO(idLabel),
    is_featured: preset?.featured ?? false,
    sort_order: preset?.sortOrder ?? 100,
  };
}
