import type { Metadata } from 'next';
import { GameBrowser } from '@/components/game-browser';
import { JsonLd, breadcrumbJsonLd } from '@/lib/jsonld';
import { getCheapestPriceByGame, getGamesByKind } from '@/lib/queries';
import { site } from '@/lib/site';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Voucher Digital — Steam, Razer Gold, Google Play, PSN, Xbox',
  description:
    'Daftar lengkap voucher digital di Sayba Voucher: Steam Wallet, Razer Gold, Google Play, PlayStation Network, Xbox, Garena Shell, eFootball, dan lainnya. Kode dikirim otomatis, bayar pakai QRIS atau e-wallet.',
  alternates: { canonical: '/voucher' },
};

export default async function VoucherPage() {
  const [vouchers, cheapest] = await Promise.all([
    getGamesByKind('voucher'),
    getCheapestPriceByGame(),
  ]);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Beranda', path: '/' },
            { name: 'Voucher Digital', path: '/voucher' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Daftar Voucher Digital',
            numberOfItems: vouchers.length,
            itemListElement: vouchers.map((game, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: game.name,
              url: `${site.url}/${game.slug}`,
            })),
          },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight text-fg">Voucher Digital</h1>
        <p className="mb-7 mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
          {vouchers.length} jenis voucher siap kirim. Kode dikirim otomatis ke halaman invoice
          dan WhatsApp kamu setelah pembayaran terkonfirmasi.
        </p>
        <GameBrowser games={vouchers} cheapest={cheapest} />
      </div>
    </>
  );
}
