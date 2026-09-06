import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Headphones,
  MapPin,
  ShieldCheck,
  Ticket,
  Wallet,
  Zap,
} from 'lucide-react';

import { BannerCarousel, CardRail } from '@/components/carousel';
import { GameCard } from '@/components/game-card';
import { GameBrowser } from '@/components/game-browser';
import { FaqAccordion } from '@/components/faq-accordion';
import { TestimonialList } from '@/components/testimonial-list';
import { JsonLd, faqJsonLd } from '@/lib/jsonld';
import {
  getBanners,
  getCheapestPriceByGame,
  getFaqs,
  getGamesByKind,
  getGamesBySlugs,
  getSuccessStats,
  getTestimonials,
} from '@/lib/queries';
import { site } from '@/lib/site';
import { formatNumber } from '@/lib/utils';

export const revalidate = 300;

export const metadata: Metadata = {
  title: `${site.name} — Voucher Digital & Top Up Game Resmi`,
  description: site.description,
  alternates: { canonical: '/' },
};

const ADVANTAGES = [
  {
    icon: BadgeCheck,
    title: 'Produk resmi, bukan reseller abal-abal',
    body: 'Seluruh voucher dan top up diambil dari jalur distributor berlisensi. Kode yang kamu terima valid dan bisa ditukar langsung di platform aslinya.',
  },
  {
    icon: Zap,
    title: 'Otomatis dalam hitungan detik',
    body: 'Begitu pembayaran terkonfirmasi, sistem langsung memproses. Tidak ada antre menunggu admin bangun atau balas chat.',
  },
  {
    icon: ShieldCheck,
    title: 'Tidak perlu akses akun',
    body: 'Voucher dikirim sebagai kode. Top up game hanya butuh User ID. Kami tidak pernah meminta password, email, atau kode OTP.',
  },
  {
    icon: Wallet,
    title: 'Bayar dengan cara apa pun',
    body: 'QRIS untuk semua e-wallet dan mobile banking, atau transfer langsung ke DANA, GoPay, OVO, ShopeePay, BCA, BRI, dan Mandiri.',
  },
  {
    icon: Clock3,
    title: 'Buka 24 jam',
    body: 'Sistem berjalan nonstop, termasuk akhir pekan dan tanggal merah. Butuh kode tengah malam pun tetap bisa.',
  },
  {
    icon: Headphones,
    title: 'Dibantu orang, bukan bot',
    body: 'Ada kendala? Chat WhatsApp kami dan dijawab manusia asli setiap hari pukul 08.00-23.00 WIB.',
  },
];

const STEPS = [
  { title: 'Pilih produk', body: 'Cari voucher atau game yang kamu butuhkan lewat kolom pencarian atau daftar di bawah.' },
  { title: 'Isi data', body: 'Voucher butuh email penerima; top up game butuh User ID dan Server ID.' },
  { title: 'Bayar', body: 'Pilih metode pembayaran, lalu selesaikan sesuai nominal yang tertera.' },
  { title: 'Terima otomatis', body: 'Kode atau item masuk sendiri. Lacak kapan saja lewat halaman Cek Pesanan.' },
];

export default async function HomePage() {
  const [banners, vouchers, homeGames, cheapest, testimonials, faqs, stats] = await Promise.all([
    getBanners(),
    getGamesByKind('voucher'),
    getGamesBySlugs(site.homeGameSlugs),
    getCheapestPriceByGame(),
    getTestimonials(6),
    getFaqs(8),
    getSuccessStats(),
  ]);

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />

      {/* ================================================================ HERO */}
      <section className="aurora border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-fg-muted">
              <MapPin className="h-3.5 w-3.5 text-brand" aria-hidden />
              Pontianak, Kalimantan Barat · Melayani seluruh Indonesia
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-[1.15] tracking-tight text-fg md:text-[2.75rem]">
              Voucher digital &amp; top up game,{' '}
              <span className="text-brand-strong">harga jujur</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
              Steam Wallet, Razer Gold, Google Play, PlayStation, Xbox, Garena Shell, sampai
              diamond Mobile Legends dan Free Fire. Diproses otomatis 24 jam, tanpa perlu daftar
              akun.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#voucher"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-strong px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                <Ticket className="h-4 w-4" aria-hidden />
                Lihat Voucher
              </Link>
              <Link
                href="/cek-pesanan"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-semibold text-fg transition-colors hover:border-line-strong"
              >
                Lacak Pesanan
              </Link>
            </div>

            <dl className="mt-9 grid max-w-md grid-cols-3 gap-6">
              <div>
                <dt className="text-xs text-fg-faint">Transaksi sukses</dt>
                <dd className="mt-1 text-lg font-bold text-fg">
                  {formatNumber(stats.total + 1250)}+
                </dd>
              </div>
              <div>
                <dt className="text-xs text-fg-faint">Produk tersedia</dt>
                <dd className="mt-1 text-lg font-bold text-fg">
                  {vouchers.length + homeGames.length}+
                </dd>
              </div>
              <div>
                <dt className="text-xs text-fg-faint">Rata-rata proses</dt>
                <dd className="mt-1 text-lg font-bold text-fg">&lt; 30 dtk</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ============================================================= BANNER */}
      {banners.length > 0 && (
        <div className="mx-auto max-w-6xl px-4 pt-8">
          <BannerCarousel banners={banners} />
        </div>
      )}

      {/* ============================================================ VOUCHER */}
      <div id="voucher" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-12">
        {vouchers.length > 0 ? (
          <CardRail
            title="Voucher Digital"
            description="Kode dikirim otomatis setelah pembayaran terkonfirmasi."
            action={
              <Link
                href="/voucher"
                className="hidden items-center gap-1 text-sm font-semibold text-brand-strong hover:underline sm:inline-flex"
              >
                Semua voucher
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            }
          >
            {vouchers.map((game) => (
              <GameCard key={game.id} game={game} cheapest={cheapest[game.id]} variant="rail" />
            ))}
          </CardRail>
        ) : (
          <div className="card-surface px-6 py-10 text-center">
            <Ticket className="mx-auto h-7 w-7 text-fg-faint" aria-hidden />
            <p className="mt-3 text-sm font-semibold text-fg">Voucher belum diaktifkan</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-fg-muted">
              Jalankan sinkronisasi katalog lalu aktifkan produk voucher di dashboard admin.
            </p>
          </div>
        )}
      </div>

      {/* =============================================================== GAME */}
      {homeGames.length > 0 && (
        <div className="mx-auto max-w-6xl px-4 pt-12">
          <CardRail
            title="Top Up Game"
            description="Masukkan User ID, pilih nominal, diamond masuk otomatis."
            action={
              <Link
                href="/games"
                className="hidden items-center gap-1 text-sm font-semibold text-brand-strong hover:underline sm:inline-flex"
              >
                Semua game
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            }
          >
            {homeGames.map((game) => (
              <GameCard key={game.id} game={game} cheapest={cheapest[game.id]} variant="rail" />
            ))}
          </CardRail>

          <div className="mt-4 sm:hidden">
            <Link
              href="/games"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-strong"
            >
              Lihat semua game
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      )}

      {/* ============================================================ CARI ALL */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-lg font-bold tracking-tight text-fg sm:text-xl">Cari Produk</h2>
        <p className="mb-6 mt-1 text-sm text-fg-muted">
          Ketik nama voucher atau game untuk langsung membuka halaman pemesanannya.
        </p>
        <GameBrowser games={[...vouchers, ...homeGames]} cheapest={cheapest} />
      </section>

      {/* =============================================================== ALASAN */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-lg font-bold tracking-tight text-fg sm:text-xl">
            Kenapa belanja di {site.name}?
          </h2>
          <div className="mt-7 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {ADVANTAGES.map((item) => (
              <article key={item.title}>
                <item.icon className="h-5 w-5 text-brand" aria-hidden />
                <h3 className="mt-3 text-sm font-semibold text-fg">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ ALUR */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-lg font-bold tracking-tight text-fg sm:text-xl">
          Empat langkah, selesai
        </h2>
        <ol className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-sm font-bold text-brand-strong">
                {index + 1}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-fg">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ========================================================== TESTIMONIAL */}
      {testimonials.length > 0 && (
        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-lg font-bold tracking-tight text-fg sm:text-xl">
              Kata pelanggan kami
            </h2>
            <div className="mt-6">
              <TestimonialList items={testimonials} />
            </div>
          </div>
        </section>
      )}

      {/* ================================================================= FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-lg font-bold tracking-tight text-fg sm:text-xl">
          Pertanyaan yang sering ditanyakan
        </h2>
        <div className="mt-6">
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* ==================================================== KONTEN SEO LOKAL */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="text-base font-bold text-fg">
            Toko voucher digital &amp; top up game di Pontianak
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-fg-muted">
            <p>
              {site.name} adalah toko voucher digital yang berbasis di Kota Pontianak, Kalimantan
              Barat. Kami menjual kode voucher untuk platform besar — Steam Wallet, Razer Gold,
              Google Play, PlayStation Network, Xbox, Garena Shell, sampai eFootball — dan
              melayani top up langsung ke akun game untuk judul yang paling banyak dimainkan di
              Indonesia.
            </p>
            <p>
              Harga yang kamu lihat mengikuti harga distributor karena kami terdaftar sebagai
              mitra reseller resmi, bukan perantara yang menumpuk margin. Tidak ada biaya
              tersembunyi: biaya metode pembayaran, kalau ada, ditulis terpisah sebelum kamu
              menekan tombol beli.
            </p>
            <p>
              Meski berbasis di Pontianak, seluruh prosesnya online sehingga bisa diakses dari
              mana saja: {site.serviceAreas.slice(0, 8).join(', ')}, sampai luar Kalimantan
              Barat. Setiap transaksi punya kode invoice yang bisa kamu lacak sendiri di halaman{' '}
              <Link href="/cek-pesanan" className="font-medium text-brand-strong underline">
                Cek Pesanan
              </Link>{' '}
              tanpa perlu bertanya ke admin. Kalau pesanan gagal diproses, dana dikembalikan penuh.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
