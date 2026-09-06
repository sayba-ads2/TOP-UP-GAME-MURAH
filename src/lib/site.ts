import { publicEnv } from './env';

/**
 * Identitas toko + kata kunci SEO. Nilai di sini dipakai untuk metadata,
 * structured data (JSON-LD), sitemap, dan teks marketing di seluruh halaman.
 */
export const site = {
  name: 'Sayba Voucher',
  shortName: 'SaybaVoucher',
  legalName: 'Sayba Voucher — Sayba Arc',
  shortTagline: 'Voucher & Top Up Game',
  url: publicEnv.siteUrl,
  logo: `${publicEnv.siteUrl}/logo.png`,
  /** Dirender on-the-fly oleh /api/og — tidak ada berkas statis yang perlu dijaga. */
  ogImage: `${publicEnv.siteUrl}/api/og`,
  locale: 'id_ID',
  language: 'id',
  currency: 'IDR',

  tagline: 'Voucher Digital & Top Up Game Resmi, Harga Jujur',
  description:
    'Sayba Voucher menjual voucher digital dan top up game resmi: Steam Wallet, Razer Gold, Google Play, PlayStation, Xbox, Garena Shell, sampai diamond Mobile Legends, Free Fire, dan PUBG Mobile. Proses otomatis 24 jam, bayar lewat QRIS atau e-wallet, tanpa perlu login akun.',

  contact: {
    whatsapp: publicEnv.whatsapp || '6287803445749',
    email: 'sayba.help@gmail.com',
    hours: 'Setiap hari 08.00 - 23.00 WIB (sistem otomatis 24 jam)',
  },

  address: {
    street: 'Pontianak Kota',
    city: 'Pontianak',
    region: 'Kalimantan Barat',
    postalCode: '78121',
    country: 'ID',
    latitude: -0.0263,
    longitude: 109.3425,
  },

  social: {
    instagram: 'https://instagram.com/saybaarc',
    tiktok: 'https://tiktok.com/@saybaarc',
    facebook: '',
  },

  /** Wilayah layanan utama — dipakai untuk JSON-LD areaServed & konten lokal. */
  serviceAreas: [
    'Pontianak',
    'Kubu Raya',
    'Mempawah',
    'Singkawang',
    'Sanggau',
    'Sintang',
    'Ketapang',
    'Sambas',
    'Landak',
    'Bengkayang',
    'Sekadau',
    'Melawi',
    'Kapuas Hulu',
    'Kayong Utara',
  ],

  /** Kata kunci utama: voucher lebih dulu, top up game menyusul. */
  keywords: [
    'sayba voucher',
    'voucher game murah',
    'jual voucher digital',
    'voucher steam wallet murah',
    'voucher razer gold',
    'voucher google play murah',
    'voucher playstation indonesia',
    'top up game murah',
    'top up mobile legends murah',
    'top up free fire murah',
    'top up pubg mobile murah',
    'voucher game pontianak',
    'top up game pontianak',
    'voucher game kalimantan barat',
    'voucher game qris 24 jam',
    'sayba arc',
  ],

  /**
   * Slug game yang ditonjolkan di beranda. Game lain tetap punya halaman
   * sendiri dan tetap terindeks — hanya tidak ditampilkan di bagian ini.
   */
  homeGameSlugs: ['mobile-legends', 'free-fire', 'pubg-mobile'],
} as const;

export type Site = typeof site;

/** Judul halaman standar: "<judul> | Sayba Voucher" */
export function pageTitle(title: string): string {
  return `${title} | ${site.name}`;
}

export function canonical(path = '/'): string {
  return new URL(path, site.url).toString();
}
