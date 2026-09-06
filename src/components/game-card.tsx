import Image from 'next/image';
import Link from 'next/link';
import { Gamepad2, Ticket } from 'lucide-react';
import { cn, formatRupiah } from '@/lib/utils';
import type { Game } from '@/types';

/**
 * Kartu etalase.
 *
 * `variant="rail"` memberi lebar tetap agar bisa dipakai di dalam carousel;
 * `variant="grid"` melebar mengikuti kolom grid.
 */
export function GameCard({
  game,
  cheapest,
  variant = 'grid',
}: {
  game: Game;
  cheapest?: number;
  variant?: 'grid' | 'rail';
}) {
  const Placeholder = game.kind === 'voucher' ? Ticket : Gamepad2;
  const label = game.kind === 'voucher' ? 'Beli voucher' : 'Top up';

  return (
    <Link
      href={`/${game.slug}`}
      className={cn(
        'card-surface card-surface-hover group block overflow-hidden',
        variant === 'rail' && 'w-36 sm:w-40',
      )}
      title={`${label} ${game.name}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
        {game.icon_url ? (
          <Image
            src={game.icon_url}
            alt={`Ikon ${game.name}`}
            fill
            sizes="(max-width: 640px) 45vw, 200px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-linear-to-br from-surface-2 to-surface-3">
            <Placeholder className="h-8 w-8 text-fg-faint" aria-hidden />
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-fg">
          {game.name}
        </h3>
        <p className="mt-0.5 truncate text-[11px] text-fg-faint">
          {game.publisher ?? (game.kind === 'voucher' ? 'Voucher digital' : 'Top up game')}
        </p>
        {cheapest ? (
          <p className="mt-2 text-[11px] text-fg-muted">
            Mulai <span className="font-bold text-brand-strong">{formatRupiah(cheapest)}</span>
          </p>
        ) : null}
      </div>
    </Link>
  );
}
