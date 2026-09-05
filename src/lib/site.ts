import { publicEnv } from './env';

/**
 * Identitas toko + kata kunci SEO. Nilai di sini dipakai untuk metadata,
 * structured data (JSON-LD), sitemap, dan teks marketing di seluruh halaman.
 */
export const site = {
  name: 'Top Up Game Murah',
  shortName: 'TopUpGameMurah',
  legalName: 'Top Up Game Murah by Sayba Arc',
  url: publicEnv.siteUrl,
  logo: `${publicEnv.siteUrl}/icon.svg`,
  /** Dirender on-the-fly oleh /api/og — tidak ada berkas statis yang perlu dijaga. */
  ogImage: `${publicEnv.siteUrl}/api/og`,
  locale: 'id_ID',
  language: 'id',
  currency: 'IDR',

  tagline: 'Top Up Game Termurah, Tercepat, & Terpercaya di Pontianak',
  description:
    'Top up game murah dan legal di Pontianak: Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, Honor of Kings, dan puluhan game lain. Proses otomatis 24 jam, bayar pakai QRIS, DANA, GoPay, OVO, ShopeePay, atau transfer bank. Tanpa perlu login akun game.',

  contact: {
    whatsapp: publicEnv.whatsapp || '6281234567890',
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

  /** Kata kunci utama (head terms + long tail lokal). */
  keywords: [
    'top up game murah',
    'top up game murah pontianak',
    'top up diamond murah pontianak',
    'top up ml murah',
    'top up mobile legends pontianak',
    'top up free fire murah pontianak',
    'top up pubg mobile murah',
    'top up genshin impact murah',
    'jual diamond ml pontianak',
    'top up game kalimantan barat',
    'top up game 24 jam',
    'top up game qris',
    'topup game murah legal',
    'top up game terpercaya pontianak',
    'sayba arc',
  ],
} as const;

export type Site = typeof site;

/** Judul halaman standar: "<judul> | Top Up Game Murah" */
export function pageTitle(title: string): string {
  return `${title} | ${site.name}`;
}

export function canonical(path = '/'): string {
  return new URL(path, site.url).toString();
}
