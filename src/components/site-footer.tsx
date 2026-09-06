import Link from 'next/link';
import { Clock, Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { Logo } from './logo';
import { site } from '@/lib/site';
import { waLink } from '@/lib/utils';
import type { Game } from '@/types';

export function SiteFooter({ games, whatsapp }: { games: Game[]; whatsapp: string }) {
  const year = new Date().getFullYear();
  const vouchers = games.filter((g) => g.kind === 'voucher').slice(0, 6);
  const topups = games.filter((g) => g.kind !== 'voucher').slice(0, 6);

  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
              Toko voucher digital dan top up game asal {site.address.city},{' '}
              {site.address.region}. Proses otomatis, harga transparan, tanpa perlu akses akun.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-line bg-success-soft px-3 py-2 text-xs font-medium text-success">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Distributor berlisensi
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-sm font-semibold text-fg">Voucher</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {vouchers.map((game) => (
                <li key={game.id}>
                  <Link href={`/${game.slug}`} className="text-fg-muted transition-colors hover:text-brand-strong">
                    {game.name}
                  </Link>
                </li>
              ))}
              {vouchers.length === 0 && <li className="text-fg-faint">Segera hadir</li>}
              <li>
                <Link href="/voucher" className="font-medium text-brand-strong hover:underline">
                  Lihat semua voucher
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-sm font-semibold text-fg">Top Up Game</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {topups.map((game) => (
                <li key={game.id}>
                  <Link href={`/${game.slug}`} className="text-fg-muted transition-colors hover:text-brand-strong">
                    {game.name}
                  </Link>
                </li>
              ))}
              {topups.length === 0 && <li className="text-fg-faint">Segera hadir</li>}
              <li>
                <Link href="/games" className="font-medium text-brand-strong hover:underline">
                  Semua game
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-sm font-semibold text-fg">Bantuan</h2>
            <ul className="mt-4 space-y-3 text-sm text-fg-muted">
              <li className="flex gap-2.5">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                <a href={waLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="hover:text-brand-strong">
                  WhatsApp Admin
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                <a href={`mailto:${site.contact.email}`} className="hover:text-brand-strong">
                  {site.contact.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                <span>{site.address.city}, {site.address.region}</span>
              </li>
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                <span>{site.contact.hours}</span>
              </li>
            </ul>

            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <li><Link href="/tentang-kami" className="text-fg-muted hover:text-brand-strong">Tentang</Link></li>
              <li><Link href="/kontak" className="text-fg-muted hover:text-brand-strong">Kontak</Link></li>
              <li><Link href="/syarat-ketentuan" className="text-fg-muted hover:text-brand-strong">S&amp;K</Link></li>
              <li><Link href="/kebijakan-privasi" className="text-fg-muted hover:text-brand-strong">Privasi</Link></li>
            </ul>
          </div>
        </div>

        {/* Blok kata kunci lokal — membantu relevansi pencarian area Kalbar */}
        <div className="mt-10 border-t border-line pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-fg-faint">
            Wilayah layanan
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-fg-faint">
            Melayani pembeli voucher dan top up game di {site.serviceAreas.join(', ')}, serta
            seluruh Indonesia. Semua transaksi diproses online 24 jam.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-fg-faint sm:flex-row">
          <p>© {year} {site.name}. Bagian dari Sayba Arc.</p>
          <p className="text-center sm:text-right">
            Semua merek dagang adalah milik pemegang hak masing-masing dan tidak berafiliasi
            dengan situs ini.
          </p>
        </div>
      </div>
    </footer>
  );
}
