import Link from 'next/link';
import { Clock, Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { Logo } from './logo';
import { site } from '@/lib/site';
import { waLink } from '@/lib/utils';
import type { Game } from '@/types';

export function SiteFooter({ games, whatsapp }: { games: Game[]; whatsapp: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-ink-800 bg-ink-900">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              Layanan top up diamond dan voucher game resmi asal {site.address.city},{' '}
              {site.address.region}. Proses otomatis, harga transparan, tanpa perlu login akun
              game.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-ink-800 bg-ink-850 px-3 py-2 text-xs text-mint-400">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Transaksi lewat distributor berlisensi
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-sm font-bold text-ink-100">Game Populer</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {games.slice(0, 8).map((game) => (
                <li key={game.id}>
                  <Link href={`/${game.slug}`} className="text-ink-400 transition-colors hover:text-flame-400">
                    Top Up {game.name}
                  </Link>
                </li>
              ))}
              {games.length === 0 && <li className="text-ink-500">Segera hadir</li>}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-sm font-bold text-ink-100">Informasi</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/games" className="text-ink-400 hover:text-flame-400">Semua Game</Link></li>
              <li><Link href="/cek-pesanan" className="text-ink-400 hover:text-flame-400">Cek Pesanan</Link></li>
              <li><Link href="/cara-order" className="text-ink-400 hover:text-flame-400">Cara Order</Link></li>
              <li><Link href="/tentang-kami" className="text-ink-400 hover:text-flame-400">Tentang Kami</Link></li>
              <li><Link href="/kontak" className="text-ink-400 hover:text-flame-400">Kontak</Link></li>
              <li><Link href="/syarat-ketentuan" className="text-ink-400 hover:text-flame-400">Syarat & Ketentuan</Link></li>
              <li><Link href="/kebijakan-privasi" className="text-ink-400 hover:text-flame-400">Kebijakan Privasi</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-sm font-bold text-ink-100">Hubungi Kami</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-400">
              <li className="flex gap-2.5">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-flame-500" aria-hidden />
                <a href={waLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="hover:text-flame-400">
                  WhatsApp Admin
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-flame-500" aria-hidden />
                <a href={`mailto:${site.contact.email}`} className="hover:text-flame-400">
                  {site.contact.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-flame-500" aria-hidden />
                <span>{site.address.city}, {site.address.region}</span>
              </li>
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-flame-500" aria-hidden />
                <span>{site.contact.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Blok kata kunci lokal — membantu relevansi pencarian area Kalbar */}
        <div className="mt-10 border-t border-ink-800 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Wilayah Layanan
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-500">
            Melayani top up game untuk pelanggan di {site.serviceAreas.join(', ')}, dan seluruh
            Indonesia. Semua transaksi diproses online 24 jam.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-ink-800 pt-6 text-xs text-ink-500 sm:flex-row">
          <p>© {year} {site.name}. Bagian dari Sayba Arc.</p>
          <p>
            Semua merek dagang game adalah milik pemegang hak masing-masing dan tidak
            berafiliasi dengan situs ini.
          </p>
        </div>
      </div>
    </footer>
  );
}
