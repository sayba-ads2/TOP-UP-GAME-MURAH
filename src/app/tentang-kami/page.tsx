import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd, breadcrumbJsonLd } from '@/lib/jsonld';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Tentang Kami — Layanan Top Up Game Asal Pontianak',
  description:
    'Top Up Game Murah adalah layanan top up diamond dan voucher game milik Sayba Arc, berbasis di Pontianak, Kalimantan Barat. Kenali cara kerja, komitmen harga, dan jaminan keamanan kami.',
  alternates: { canonical: '/tentang-kami' },
};

export default function TentangKamiPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Beranda', path: '/' },
          { name: 'Tentang Kami', path: '/tentang-kami' },
        ])}
      />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-extrabold text-ink-100">Tentang {site.name}</h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink-400">
          <p>
            {site.name} adalah layanan top up game digital di bawah naungan{' '}
            <strong className="text-ink-200">Sayba Arc</strong>, berbasis di Kota Pontianak,
            Kalimantan Barat. Kami memulai layanan ini karena satu hal sederhana: harga top up di
            banyak tempat masih terlalu jauh dari harga distributor, dan prosesnya sering
            bergantung pada admin yang harus online.
          </p>

          <h2 className="pt-2 text-base font-bold text-ink-100">Bagaimana kami bekerja</h2>
          <p>
            Kami terdaftar sebagai mitra reseller pada distributor produk digital berlisensi.
            Artinya, katalog dan harga modal kami tarik langsung lewat jalur resmi, lalu kami
            tambahkan margin yang tipis dan wajar. Pesanan kamu diteruskan otomatis oleh sistem
            begitu pembayaran terkonfirmasi — tidak menunggu admin membuka ponsel.
          </p>

          <h2 className="pt-2 text-base font-bold text-ink-100">Komitmen kami</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong className="text-ink-200">Harga transparan.</strong> Angka yang tampil di
              halaman produk adalah angka yang kamu bayar. Biaya metode pembayaran, kalau ada,
              ditulis terpisah sebelum kamu menekan tombol beli.
            </li>
            <li>
              <strong className="text-ink-200">Tidak pernah meminta akses akun.</strong> Kami
              hanya butuh User ID dan Server ID. Siapa pun yang mengaku dari kami lalu meminta
              password, email, atau kode OTP akun game kamu adalah penipu.
            </li>
            <li>
              <strong className="text-ink-200">Gagal berarti uang kembali.</strong> Bila penyedia
              menolak pesanan, dana dikembalikan penuh tanpa potongan.
            </li>
            <li>
              <strong className="text-ink-200">Setiap transaksi punya jejak.</strong> Kode
              invoice bisa kamu lacak sendiri kapan saja tanpa harus bertanya ke admin.
            </li>
          </ul>

          <h2 className="pt-2 text-base font-bold text-ink-100">Kenapa Pontianak?</h2>
          <p>
            Karena di sinilah kami tinggal. Kami tahu rasanya menunggu balasan penjual yang baru
            aktif besok pagi, atau bingung mencari tempat top up yang benar-benar bisa dipercaya.
            Meski layanan ini sepenuhnya online dan bisa dipakai dari seluruh Indonesia, pelanggan
            di {site.serviceAreas.slice(0, 6).join(', ')} dan sekitarnya tetap jadi prioritas
            dukungan kami.
          </p>
        </div>

        <div className="card-surface mt-8 p-5">
          <h2 className="text-sm font-bold text-ink-100">Siap mencoba?</h2>
          <p className="mt-2 text-sm text-ink-400">
            Mulai dari nominal terkecil dulu kalau kamu masih ragu. Kami tidak keberatan.
          </p>
          <Link
            href="/games"
            className="mt-4 inline-flex rounded-lg bg-flame-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-flame-600"
          >
            Lihat Daftar Game
          </Link>
        </div>
      </article>
    </>
  );
}
