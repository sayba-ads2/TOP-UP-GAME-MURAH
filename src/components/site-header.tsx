'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, MessageCircle, Receipt, X } from 'lucide-react';
import { Logo } from './logo';
import { cn, waLink } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Beranda' },
  { href: '/voucher', label: 'Voucher' },
  { href: '/games', label: 'Top Up Game' },
  { href: '/cek-pesanan', label: 'Cek Pesanan' },
  { href: '/cara-order', label: 'Cara Order' },
];

export function SiteHeader({ whatsapp }: { whatsapp: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-surface/90 backdrop-blur-md transition-shadow',
        scrolled ? 'border-line shadow-[0_1px_3px_rgb(24_24_27/0.04)]' : 'border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" aria-label="Sayba Voucher — Beranda">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Navigasi utama">
          {NAV.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand-soft text-brand-strong'
                    : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
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
            className="hidden items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-medium text-fg transition-colors hover:border-line-strong sm:flex lg:hidden xl:flex"
          >
            <Receipt className="h-4 w-4" aria-hidden />
            Lacak
          </Link>
          <a
            href={waLink(whatsapp, 'Halo admin Sayba Voucher, saya mau tanya.')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-lg bg-brand-strong px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover sm:flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Admin
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-line text-fg lg:hidden"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-surface lg:hidden" aria-label="Navigasi seluler">
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-fg-body hover:bg-surface-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="px-3 pb-2 pt-1">
              <a
                href={waLink(whatsapp, 'Halo admin Sayba Voucher, saya mau tanya.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-brand-strong py-3 text-sm font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Chat Admin
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
