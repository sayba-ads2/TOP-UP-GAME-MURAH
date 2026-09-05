'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CopyButton({
  value,
  label = 'Salin',
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard API bisa diblokir; fallback ke seleksi manual oleh pengguna.
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border border-ink-700 px-2.5 py-1.5 text-xs font-semibold text-ink-300 transition-colors hover:border-flame-500 hover:text-flame-400',
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-mint-400" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      {copied ? 'Tersalin' : label}
    </button>
  );
}
