'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, MessageCircle, Receipt, X } from 'lucide-react';
import { Logo } from './logo';
import { cn, waLink } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Beranda' },
  { href: '/games', label: 'Semua Game' },
  { href: '/cek-pesanan', label: 'Cek Pesanan' },
  { href: '/cara-order', label: 'Cara Order' },
  { href: '/kontak', label: 'Kontak' },
];

export function SiteHeader({ whatsapp }: { whatsapp: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors',
        scrolled
          ? 'border-ink-800 bg-ink-950/90 backdrop-blur-lg'
          : 'border-transparent bg-ink-950',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" aria-label="Top Up Game Murah — Beranda">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          {NAV.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'bg-ink-850 text-flame-400' : 'text-ink-300 hover:text-ink-100',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cek-pesanan"
            className="hidden items-center gap-2 rounded-lg border border-ink-700 px-3 py-2 text-sm font-semibold text-ink-200 transition-colors hover:border-ink-600 hover:text-ink-100 sm:flex md:hidden lg:flex"
          >
            <Receipt className="h-4 w-4" aria-hidden />
            Lacak
          </Link>
          <a
            href={waLink(whatsapp, 'Halo admin Top Up Game Murah, saya mau tanya.')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-lg bg-flame-500 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-flame-600 sm:flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Admin
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-ink-700 text-ink-200 md:hidden"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink-800 bg-ink-900 md:hidden" aria-label="Navigasi seluler">
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-ink-200 hover:bg-ink-850"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
