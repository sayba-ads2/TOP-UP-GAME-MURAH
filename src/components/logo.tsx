import Image from 'next/image';
import { cn } from '@/lib/utils';
import { site } from '@/lib/site';

/**
 * Logo Sayba.
 *
 * Berkasnya dibaca dari `public/logo.png`. Ganti berkas itu kapan saja tanpa
 * menyentuh kode — ukuran apa pun aman karena gambar diskalakan `object-contain`
 * di dalam kotak berukuran tetap. Disarankan PNG persegi 512x512 berlatar
 * transparan agar tajam di layar retina.
 */
export function LogoMark({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      priority
      className={cn('h-10 w-10 object-contain', className)}
    />
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark className="h-9 w-9 shrink-0" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-bold tracking-tight text-fg">{site.name}</span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-fg-faint">
            {site.shortTagline}
          </span>
        </span>
      )}
    </span>
  );
}
