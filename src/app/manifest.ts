import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.shortName,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f8f7',
    theme_color: '#ffffff',
    lang: 'id',
    orientation: 'portrait',
    categories: ['shopping', 'games', 'finance'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
