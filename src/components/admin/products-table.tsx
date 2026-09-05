'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { toggleProductActive, updateProductMargin } from '@/app/admin/actions';
import { formatRupiah } from '@/lib/utils';
import type { Game, Product } from '@/types';

function MarginCell({ product }: { product: Product }) {
  const [type, setType] = useState<'percent' | 'fixed' | ''>(product.margin_type ?? '');
  const [value, setValue] = useState(product.margin_value != null ? String(product.margin_value) : '');
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  function save() {
    startTransition(async () => {
      const result = await updateProductMargin(product.id, type, value);
      if (result.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={type}
        onChange={(e) => setType(e.target.value as 'percent' | 'fixed' | '')}
        aria-label={`Jenis margin ${product.name}`}
        className="rounded-lg border border-ink-700 bg-ink-900 px-2 py-1.5 text-xs text-ink-200 focus:border-flame-500 focus:outline-none"
      >
        <option value="">Global</option>
        <option value="percent">%</option>
        <option value="fixed">Rp</option>
      </select>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={type === ''}
        inputMode="decimal"
        aria-label={`Nilai margin ${product.name}`}
        className="w-20 rounded-lg border border-ink-700 bg-ink-900 px-2 py-1.5 text-xs text-ink-100 focus:border-flame-500 focus:outline-none disabled:opacity-40"
      />
      <button
        type="button"
        onClick={save}
        disabled={pending}
        className="rounded-lg border border-ink-700 px-2 py-1.5 text-xs font-semibold text-ink-300 hover:border-flame-500 hover:text-flame-400 disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        ) : saved ? (
          <Check className="h-3.5 w-3.5 text-mint-400" aria-hidden />
        ) : (
          'Simpan'
        )}
      </button>
    </div>
  );
}

export function ProductsTable({
  games,
  products,
  selectedGameId,
}: {
  games: Game[];
  products: Product[];
  selectedGameId: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const totalProfit = products.reduce((sum, p) => sum + (p.sell_price - p.cost_price), 0);
  const avgProfit = products.length ? Math.round(totalProfit / products.length) : 0;

  return (
    <div className="card-surface overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-800 p-3">
        <label className="flex items-center gap-2 text-xs text-ink-400">
          Game:
          <select
            value={selectedGameId ?? ''}
            onChange={(e) => router.push(`/admin/products?game=${e.target.value}`)}
            className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-ink-100 focus:border-flame-500 focus:outline-none"
          >
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.is_active ? '● ' : '○ '}
                {game.name}
              </option>
            ))}
          </select>
        </label>
        <span className="text-xs text-ink-500">
          {products.length} produk · rata-rata laba {formatRupiah(avgProfit)} per transaksi
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-850 text-[11px] uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Produk</th>
              <th className="px-4 py-2.5 font-semibold">Kode</th>
              <th className="px-4 py-2.5 font-semibold">Modal</th>
              <th className="px-4 py-2.5 font-semibold">Harga Jual</th>
              <th className="px-4 py-2.5 font-semibold">Laba</th>
              <th className="px-4 py-2.5 font-semibold">Margin Khusus</th>
              <th className="px-4 py-2.5 font-semibold">Tampil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800">
            {products.map((product) => {
              const profit = product.sell_price - product.cost_price;
              return (
                <tr key={product.id} className="hover:bg-ink-850/60">
                  <td className="px-4 py-3 text-ink-200">{product.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-500">{product.kode_produk}</td>
                  <td className="px-4 py-3 text-ink-400">{formatRupiah(product.cost_price)}</td>
                  <td className="px-4 py-3 font-semibold text-flame-400">
                    {formatRupiah(product.sell_price)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-mint-400">{formatRupiah(profit)}</td>
                  <td className="px-4 py-3">
                    <MarginCell product={product} />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={product.is_active}
                      disabled={pending}
                      aria-label={`Tampilkan ${product.name}`}
                      onChange={(e) =>
                        startTransition(async () => {
                          await toggleProductActive(product.id, e.target.checked);
                          router.refresh();
                        })
                      }
                    />
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-ink-500">
                  Belum ada produk untuk game ini. Jalankan sinkronisasi katalog lebih dulu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
