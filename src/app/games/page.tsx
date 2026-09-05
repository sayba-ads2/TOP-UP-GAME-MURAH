import type { Metadata } from 'next';
import { GameBrowser } from '@/components/game-browser';
import { JsonLd, breadcrumbJsonLd } from '@/lib/jsonld';
import { getActiveGames, getCheapestPriceByGame } from '@/lib/queries';
import { site } from '@/lib/site';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Daftar Semua Game — Top Up Diamond & Voucher Murah',
  description:
    'Daftar lengkap game yang bisa di-top up di Top Up Game Murah: Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, Honor of Kings, Valorant, Roblox, dan lainnya. Harga distributor, proses otomatis 24 jam.',
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
        <h1 className="text-2xl font-extrabold text-ink-100">Semua Game</h1>
        <p className="mb-7 mt-2 max-w-2xl text-sm leading-relaxed text-ink-400">
          {games.length} game siap top up dengan harga distributor. Ketik nama game di kolom
          pencarian untuk menemukannya lebih cepat.
        </p>
        <GameBrowser games={games} cheapest={cheapest} />
      </div>
    </>
  );
}
