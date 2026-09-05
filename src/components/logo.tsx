import { cn } from '@/lib/utils';

/**
 * Lambang Sayba Arc: huruf "S" arang, chevron oranye sebagai puncak "A",
 * garis diagonal, dan titik penutup.
 *
 * Ini versi vektor supaya tajam di semua ukuran dan tidak menambah request
 * gambar. Kalau kamu punya berkas logo resmi, taruh di `public/logo.png`
 * (512x512) — berkas itu yang dipakai untuk favicon, OG image, dan JSON-LD.
 */
export function LogoMark({ className, monochrome = false }: { className?: string; monochrome?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-9 w-9', className)}
      aria-hidden="true"
    >
      {/* Huruf S */}
      <path
        d="M28 14H16.5a7.5 7.5 0 0 0 0 15H24a7.5 7.5 0 0 1 0 15H10"
        stroke={monochrome ? 'currentColor' : '#3a3a44'}
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Chevron oranye — puncak huruf A */}
      <path
        d="M38 27 47 17.5 56 27"
        stroke={monochrome ? 'currentColor' : 'var(--color-flame-500, #f47c20)'}
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Kaki diagonal */}
      <path
        d="M36 46 54 30"
        stroke={monochrome ? 'currentColor' : '#3a3a44'}
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Titik */}
      <circle cx="57.5" cy="42.5" r="4.5" fill={monochrome ? 'currentColor' : '#3a3a44'} />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-800 ring-1 ring-ink-700">
        <LogoMark className="h-6 w-6" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-extrabold tracking-tight text-ink-100">
            Top Up <span className="text-flame-500">Game Murah</span>
          </span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">
            by Sayba Arc
          </span>
        </span>
      )}
    </span>
  );
}
