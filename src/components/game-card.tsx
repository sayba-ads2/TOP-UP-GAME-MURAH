import Image from 'next/image';
import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import type { Game } from '@/types';

export function GameCard({ game, cheapest }: { game: Game; cheapest?: number }) {
  return (
    <Link
      href={`/${game.slug}`}
      className="card-surface card-surface-hover group block overflow-hidden"
      title={`Top up ${game.name} murah`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-ink-850">
        {game.icon_url ? (
          <Image
            src={game.icon_url}
            alt={`Ikon game ${game.name}`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-linear-to-br from-ink-800 to-ink-850">
            <Gamepad2 className="h-10 w-10 text-ink-600" aria-hidden />
          </div>
        )}
        {game.is_featured && (
          <span className="absolute left-2 top-2 rounded-md bg-flame-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Populer
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink-100">
          {game.name}
        </h3>
        <p className="mt-1 truncate text-xs text-ink-500">{game.publisher ?? 'Voucher Game'}</p>
        {cheapest ? (
          <p className="mt-2 text-xs text-ink-400">
            Mulai <span className="font-bold text-flame-400">{formatRupiah(cheapest)}</span>
          </p>
        ) : null}
      </div>
    </Link>
  );
}
