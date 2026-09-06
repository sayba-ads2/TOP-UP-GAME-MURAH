import type { MetadataRoute } from 'next';
import { getActiveGames } from '@/lib/queries';
import { site } from '@/lib/site';

export const revalidate = 3600;

/**
 * Sitemap XML di /sitemap.xml.
 * Halaman game diberi prioritas tertinggi karena itulah halaman yang
 * benar-benar menghasilkan transaksi.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await getActiveGames();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${site.url}/voucher`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${site.url}/games`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${site.url}/cara-order`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${site.url}/cek-pesanan`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${site.url}/tentang-kami`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${site.url}/kontak`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${site.url}/syarat-ketentuan`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${site.url}/kebijakan-privasi`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const gameRoutes: MetadataRoute.Sitemap = games.map((game) => ({
    url: `${site.url}/${game.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: game.is_featured ? 0.95 : 0.8,
  }));

  return [...staticRoutes, ...gameRoutes];
}
