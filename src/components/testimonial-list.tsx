import { Quote, Star } from 'lucide-react';
import type { Testimonial } from '@/types';

export function TestimonialList({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((t) => (
        <figure key={t.id} className="card-surface p-5">
          <Quote className="h-5 w-5 text-flame-600" aria-hidden />
          <blockquote className="mt-3 text-sm leading-relaxed text-ink-300">
            &ldquo;{t.message}&rdquo;
          </blockquote>
          <figcaption className="mt-4 flex items-center justify-between border-t border-ink-800 pt-3">
            <div>
              <span className="block text-xs font-bold text-ink-100">{t.name}</span>
              <span className="block text-[11px] text-ink-500">
                {[t.city, t.game].filter(Boolean).join(' · ')}
              </span>
            </div>
            <div className="flex gap-0.5" aria-label={`Rating ${t.rating} dari 5`}>
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-flame-500 text-flame-500" aria-hidden />
              ))}
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
