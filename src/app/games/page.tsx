import type { Metadata } from 'next';
import { GameBrowser } from '@/components/game-browser';
import { JsonLd, breadcrumbJsonLd } from '@/lib/jsonld';
import { getActiveGames, getCheapestPriceByGame } from '@/lib/queries';
import { site } from '@/lib/site';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Top Up Game — Daftar Semua Game',
  description:
    'Daftar lengkap game yang bisa di-top up di Sayba Voucher: Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, Honor of Kings, Valorant, dan lainnya. Harga distributor, proses otomatis 24 jam, tanpa login akun.',
  alternates: { canonical: '/games' },
};

export default async function GamesPage() {
  const [games, cheapest] = await Promise.all([getActiveGames(), getCheapestPriceByGame()]);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Beranda', path: '/' },
            { name: 'Semua Game', path: '/games' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Daftar Game Top Up',
            numberOfItems: games.length,
            itemListElement: games.map((game, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: `Top Up ${game.name}`,
              url: `${site.url}/${game.slug}`,
            })),
          },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight text-fg">Top Up Game</h1>
        <p className="mb-7 mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
          {games.length} game siap top up dengan harga distributor. Ketik nama game di kolom
          pencarian untuk menemukannya lebih cepat. Cari kode voucher?{' '}
          <a href="/voucher" className="font-medium text-brand-strong underline">Lihat halaman voucher</a>.
        </p>
        <GameBrowser games={games} cheapest={cheapest} />
      </div>
    </>
  );
}
