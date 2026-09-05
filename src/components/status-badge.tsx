import { cn } from '@/lib/utils';
import type { FulfillmentStatus, PaymentStatus } from '@/types';

const FULFILLMENT_LABEL: Record<FulfillmentStatus, { text: string; tone: string }> = {
  WAITING_PAYMENT: { text: 'Menunggu Pembayaran', tone: 'bg-amber-500/10 text-amber-400' },
  QUEUED: { text: 'Dalam Antrean', tone: 'bg-sky-500/10 text-sky-400' },
  PROCESSING: { text: 'Sedang Diproses', tone: 'bg-sky-500/10 text-sky-400' },
  SUCCESS: { text: 'Berhasil', tone: 'bg-mint-500/10 text-mint-400' },
  FAILED: { text: 'Gagal', tone: 'bg-red-500/10 text-red-400' },
  REFUNDED: { text: 'Dana Dikembalikan', tone: 'bg-ink-700 text-ink-300' },
};

const PAYMENT_LABEL: Record<PaymentStatus, { text: string; tone: string }> = {
  PENDING: { text: 'Belum Dibayar', tone: 'bg-amber-500/10 text-amber-400' },
  PAID: { text: 'Lunas', tone: 'bg-mint-500/10 text-mint-400' },
  EXPIRED: { text: 'Kedaluwarsa', tone: 'bg-ink-700 text-ink-300' },
  CANCELLED: { text: 'Dibatalkan', tone: 'bg-ink-700 text-ink-300' },
  REFUNDED: { text: 'Dikembalikan', tone: 'bg-ink-700 text-ink-300' },
};

export function StatusBadge({
  status,
  kind = 'fulfillment',
  className,
}: {
  status: FulfillmentStatus | PaymentStatus;
  kind?: 'fulfillment' | 'payment';
  className?: string;
}) {
  const map = kind === 'payment' ? PAYMENT_LABEL : FULFILLMENT_LABEL;
  const item = (map as Record<string, { text: string; tone: string }>)[status] ?? {
    text: status,
    tone: 'bg-ink-700 text-ink-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide',
        item.tone,
        className,
      )}
    >
      {item.text}
    </span>
  );
}
