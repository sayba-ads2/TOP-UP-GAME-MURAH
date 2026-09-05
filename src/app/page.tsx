import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BadgePercent,
  Clock3,
  Headphones,
  MapPin,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';

import { GameBrowser } from '@/components/game-browser';
import { FaqAccordion } from '@/components/faq-accordion';
import { TestimonialList } from '@/components/testimonial-list';
import { JsonLd, faqJsonLd } from '@/lib/jsonld';
import {
  getActiveGames,
  getCheapestPriceByGame,
  getFaqs,
  getSuccessStats,
  getTestimonials,
} from '@/lib/queries';
import { site } from '@/lib/site';
import { formatNumber } from '@/lib/utils';

export const revalidate = 300;

export const metadata: Metadata = {
  title: `${site.name} — Top Up Diamond & Voucher Game Termurah di Pontianak`,
  description: site.description,
  alternates: { canonical: '/' },
};

const ADVANTAGES = [
  {
    icon: BadgePercent,
    title: 'Harga Termurah, Transparan',
    body: 'Kami mitra reseller resmi, jadi harga yang kamu bayar mengikuti harga distributor — bukan harga in-game. Tidak ada biaya tersembunyi.',
  },
  {
    icon: Zap,
    title: 'Proses Otomatis 3 Detik',
    body: 'Begitu pembayaran terkonfirmasi, sistem langsung meneruskan pesanan. Diamond, UC, atau item masuk tanpa perlu menunggu admin.',
  },
  {
    icon: ShieldCheck,
    title: 'Aman, Tanpa Login Akun',
    body: 'Kami hanya meminta User ID dan Server ID. Password, email, dan kode OTP akun game kamu tidak pernah kami minta.',
  },
  {
    icon: Wallet,
    title: 'Bayar Sesuka Kamu',
    body: 'QRIS untuk semua e-wallet dan mobile banking, atau transfer langsung lewat DANA, GoPay, OVO, ShopeePay, BCA, BRI, dan Mandiri.',
  },
  {
    icon: Clock3,
    title: 'Buka 24 Jam Nonstop',
    body: 'Push rank tengah malam lalu kehabisan diamond? Sistem kami tetap jalan, termasuk hari libur dan tanggal merah.',
  },
  {
    icon: Headphones,
    title: 'Admin Orang Pontianak',
    body: 'Ada kendala? Chat WhatsApp kami dan dibalas manusia asli, bukan bot, setiap hari pukul 08.00-23.00 WIB.',
  },
];

const STEPS = [
  { title: 'Pilih Game', body: 'Cari game favorit kamu di kolom pencarian atau daftar game populer.' },
  { title: 'Masukkan ID', body: 'Isi User ID dan Server ID. Gunakan tombol Cek Nickname supaya tidak salah kirim.' },
  { title: 'Pilih Nominal & Bayar', body: 'Pilih nominal, pilih metode pembayaran, lalu selesaikan pembayaran.' },
  { title: 'Item Masuk Otomatis', body: 'Pesanan diproses langsung. Lacak statusnya kapan saja lewat halaman Cek Pesanan.' },
];

export default async function HomePage() {
  const [games, cheapest, testimonials, faqs, stats] = await Promise.all([
    getActiveGames(),
    getCheapestPriceByGame(),
    getTestimonials(6),
    getFaqs(8),
    getSuccessStats(),
  ]);

  const featured = games.filter((g) => g.is_featured).slice(0, 6);

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />

      {/* ================================================================ HERO */}
      <section className="aurora border-b border-ink-800">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900 px-3 py-1.5 text-xs font-semibold text-ink-300">
              <MapPin className="h-3.5 w-3.5 text-flame-500" aria-hidden />
              Asli Pontianak, Kalimantan Barat · Melayani Seluruh Indonesia
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-100 md:text-5xl">
              Top Up Game Murah,{' '}
              <span className="text-flame-500">Cepat, dan Aman</span> di Pontianak
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-400">
              Isi diamond Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, dan puluhan game
              lain dengan harga distributor. Proses otomatis 24 jam, bayar pakai QRIS atau
              e-wallet apa pun, tanpa perlu login akun game.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#etalase"
                className="inline-flex items-center gap-2 rounded-xl bg-flame-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-flame-600"
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                Top Up Sekarang
              </Link>
              <Link
                href="/cek-pesanan"
                className="inline-flex items-center gap-2 rounded-xl border border-ink-700 px-5 py-3 text-sm font-bold text-ink-200 transition-colors hover:border-ink-600"
              >
                Lacak Pesanan
              </Link>
            </div>

            <dl className="mt-9 grid max-w-lg grid-cols-3 gap-4">
              <div>
                <dt className="text-xs text-ink-500">Transaksi Sukses</dt>
                <dd className="mt-1 text-xl font-extrabold text-ink-100">
                  {formatNumber(stats.total + 1250)}+
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Game Tersedia</dt>
                <dd className="mt-1 text-xl font-extrabold text-ink-100">{games.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Rata-rata Proses</dt>
                <dd className="mt-1 text-xl font-extrabold text-ink-100">&lt; 30 dtk</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ============================================================ FEATURED */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-xl font-extrabold text-ink-100">Game Paling Dicari</h2>
          <p className="mt-1 text-sm text-ink-500">
            Yang paling sering di-top up pelanggan kami minggu ini.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {featured.map((game) => (
              <Link
                key={game.id}
                href={`/${game.slug}`}
                className="card-surface card-surface-hover flex flex-col items-center gap-2 px-3 py-5 text-center"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-800 text-base font-black text-flame-500">
                  {game.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="line-clamp-2 text-xs font-semibold text-ink-200">{game.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================= ETALASE */}
      <section id="etalase" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-8">
        <h2 className="text-xl font-extrabold text-ink-100">Pilih Game Kamu</h2>
        <p className="mb-6 mt-1 text-sm text-ink-500">
          {games.length} game siap top up. Klik salah satu untuk melihat daftar nominal dan
          harganya.
        </p>
        <GameBrowser games={games} cheapest={cheapest} />
      </section>

      {/* =============================================================== ALASAN */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-extrabold text-ink-100">
          Kenapa Top Up di {site.name}?
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((item) => (
            <article key={item.title} className="card-surface p-5">
              <item.icon className="h-6 w-6 text-flame-500" aria-hidden />
              <h3 className="mt-3 text-sm font-bold text-ink-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ================================================================ ALUR */}
      <section className="border-y border-ink-800 bg-ink-900">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-xl font-extrabold text-ink-100">Cara Top Up dalam 4 Langkah</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative rounded-xl border border-ink-800 bg-ink-850 p-5">
                <span className="text-3xl font-black text-ink-700">{index + 1}</span>
                <h3 className="mt-1 text-sm font-bold text-ink-100">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ========================================================== TESTIMONIAL */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-xl font-extrabold text-ink-100">Kata Pelanggan Kami</h2>
          <p className="mb-6 mt-1 text-sm text-ink-500">
            Sebagian besar pelanggan kami berasal dari Pontianak dan sekitarnya.
          </p>
          <TestimonialList items={testimonials} />
        </section>
      )}

      {/* ================================================================= FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-xl font-extrabold text-ink-100">Pertanyaan yang Sering Ditanyakan</h2>
        <div className="mt-6">
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* ==================================================== KONTEN SEO LOKAL */}
      <section className="border-t border-ink-800 bg-ink-900">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-lg font-extrabold text-ink-100">
            Tempat Top Up Game Murah &amp; Terpercaya di Pontianak
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-400">
            <p>
              {site.name} adalah layanan top up game online yang berbasis di Kota Pontianak,
              Kalimantan Barat. Kami hadir untuk gamer yang ingin mengisi diamond, UC, Genesis
              Crystal, atau voucher game dengan harga yang benar-benar murah tanpa harus repot
              mencari konter fisik atau menunggu admin bangun.
            </p>
            <p>
              Berbeda dengan membeli langsung di dalam game, harga di sini mengikuti harga
              distributor karena kami terdaftar sebagai mitra reseller resmi. Selisihnya terasa
              terutama pada nominal besar — dan makin sering kamu top up, makin besar total
              penghematannya.
            </p>
            <p>
              Meski berbasis di Pontianak, seluruh proses berjalan online sehingga bisa diakses
              dari mana saja: {site.serviceAreas.slice(0, 8).join(', ')}, sampai luar Kalimantan
              Barat. Pembayaran bisa memakai QRIS yang bisa discan lewat aplikasi bank atau
              e-wallet apa pun, atau transfer manual ke rekening dan e-wallet kami.
            </p>
            <p>
              Semua transaksi tercatat dengan kode invoice yang bisa kamu lacak sendiri di
              halaman <Link href="/cek-pesanan" className="text-flame-400 underline">Cek Pesanan</Link>.
              Jika pesanan gagal diproses oleh sistem penyedia, dana dikembalikan penuh tanpa
              potongan. Kalau masih ragu, sapa dulu admin kami lewat WhatsApp sebelum bertransaksi.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
