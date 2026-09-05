'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  BadgeCheck,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { cn, formatRupiah, isValidPhone } from '@/lib/utils';
import type { Game, PaymentMethod, PublicProduct } from '@/types';

type Props = {
  game: Game;
  products: PublicProduct[];
  paymentMethods: PaymentMethod[];
  requireWhatsapp: boolean;
};

function StepHeading({ step, title, hint }: { step: number; title: string; hint?: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-flame-500 text-sm font-bold text-white">
        {step}
      </span>
      <div>
        <h2 className="text-base font-bold text-ink-100">{title}</h2>
        {hint && <p className="mt-0.5 text-xs text-ink-500">{hint}</p>}
      </div>
    </div>
  );
}

export function OrderForm({ game, products, paymentMethods, requireWhatsapp }: Props) {
  const router = useRouter();

  const [userId, setUserId] = useState('');
  const [serverId, setServerId] = useState('');
  const [nickname, setNickname] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  const [productCode, setProductCode] = useState<string | null>(null);
  const [methodCode, setMethodCode] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const product = useMemo(
    () => products.find((p) => p.kode_produk === productCode) ?? null,
    [products, productCode],
  );
  const method = useMemo(
    () => paymentMethods.find((m) => m.code === methodCode) ?? null,
    [paymentMethods, methodCode],
  );

  const fee = useMemo(() => {
    if (!product || !method) return 0;
    return Math.ceil(method.fee_flat + (product.sell_price * method.fee_percent) / 100);
  }, [product, method]);

  const total = (product?.sell_price ?? 0) + fee;

  const groupedMethods = useMemo(() => {
    const groups = new Map<string, PaymentMethod[]>();
    for (const m of paymentMethods) {
      const list = groups.get(m.group_name) ?? [];
      list.push(m);
      groups.set(m.group_name, list);
    }
    return [...groups.entries()];
  }, [paymentMethods]);

  const needsServer = game.needs_server_id;
  const canCheckNickname = Boolean(game.nexshop_game_code);

  async function handleCheckNickname() {
    setCheckError(null);
    setNickname(null);
    if (!userId.trim()) {
      setCheckError(`${game.id_label} wajib diisi.`);
      return;
    }
    if (needsServer && !serverId.trim()) {
      setCheckError(`${game.server_label ?? 'Server ID'} wajib diisi.`);
      return;
    }

    setChecking(true);
    try {
      const res = await fetch('/api/check-nickname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: game.slug, user_id: userId.trim(), zone_id: serverId.trim() }),
      });
      const json = await res.json();
      if (json.success) setNickname(json.data.username);
      else setCheckError(json.error ?? 'Akun tidak ditemukan.');
    } catch {
      setCheckError('Gagal menghubungi server. Periksa koneksi internet kamu.');
    } finally {
      setChecking(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (!userId.trim()) return setFormError(`${game.id_label} wajib diisi.`);
    if (needsServer && !serverId.trim())
      return setFormError(`${game.server_label ?? 'Server ID'} wajib diisi.`);
    if (!product) return setFormError('Pilih nominal yang ingin dibeli.');
    if (!method) return setFormError('Pilih metode pembayaran.');
    if (requireWhatsapp && !isValidPhone(whatsapp))
      return setFormError('Nomor WhatsApp tidak valid. Contoh: 081234567890');

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: game.slug,
          kode_produk: product.kode_produk,
          target: userId.trim(),
          server_id: serverId.trim() || null,
          nickname,
          payment_method: method.code,
          whatsapp: whatsapp.trim(),
          email: email.trim() || null,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setFormError(json.error ?? 'Pesanan gagal dibuat. Coba lagi.');
        setSubmitting(false);
        return;
      }
      router.push(`/invoice/${json.data.order_code}`);
    } catch {
      setFormError('Gagal menghubungi server. Coba lagi sebentar lagi.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ---------------------------------------------------------------- 1 */}
      <section className="card-surface p-5">
        <StepHeading
          step={1}
          title="Masukkan Data Akun"
          hint="Pastikan ID benar. Pesanan yang sudah masuk ke ID salah tidak bisa dibatalkan."
        />

        <div className={cn('grid gap-3', needsServer && !game.server_options && 'sm:grid-cols-2')}>
          <div>
            <label htmlFor="user-id" className="mb-1.5 block text-xs font-semibold text-ink-300">
              {game.id_label}
            </label>
            <input
              id="user-id"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setNickname(null);
              }}
              inputMode="text"
              autoComplete="off"
              placeholder={game.id_placeholder}
              className="w-full rounded-lg border border-ink-700 bg-ink-850 px-3.5 py-3 text-sm text-ink-100 placeholder:text-ink-600 focus:border-flame-500 focus:outline-none"
            />
          </div>

          {needsServer &&
            (game.server_options && game.server_options.length > 0 ? (
              <div>
                <label htmlFor="server-id" className="mb-1.5 block text-xs font-semibold text-ink-300">
                  {game.server_label}
                </label>
                <select
                  id="server-id"
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  className="w-full rounded-lg border border-ink-700 bg-ink-850 px-3.5 py-3 text-sm text-ink-100 focus:border-flame-500 focus:outline-none"
                >
                  <option value="">Pilih server</option>
                  {game.server_options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label htmlFor="server-id" className="mb-1.5 block text-xs font-semibold text-ink-300">
                  {game.server_label}
                </label>
                <input
                  id="server-id"
                  value={serverId}
                  onChange={(e) => {
                    setServerId(e.target.value);
                    setNickname(null);
                  }}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder={game.server_placeholder ?? ''}
                  className="w-full rounded-lg border border-ink-700 bg-ink-850 px-3.5 py-3 text-sm text-ink-100 placeholder:text-ink-600 focus:border-flame-500 focus:outline-none"
                />
              </div>
            ))}
        </div>

        {canCheckNickname && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCheckNickname}
              disabled={checking}
              className="inline-flex items-center gap-2 rounded-lg border border-ink-700 px-3.5 py-2 text-xs font-semibold text-ink-200 transition-colors hover:border-flame-500 hover:text-flame-400 disabled:opacity-60"
            >
              {checking ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : null}
              Cek Nickname
            </button>
            {nickname && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-mint-500/10 px-3 py-2 text-xs font-semibold text-mint-400">
                <BadgeCheck className="h-4 w-4" aria-hidden />
                {nickname}
              </span>
            )}
            {checkError && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400">
                <AlertCircle className="h-4 w-4" aria-hidden />
                {checkError}
              </span>
            )}
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------------- 2 */}
      <section className="card-surface p-5">
        <StepHeading step={2} title="Pilih Nominal" hint="Harga sudah termasuk semua biaya layanan." />

        {products.length === 0 ? (
          <p className="rounded-lg border border-ink-700 bg-ink-850 px-4 py-6 text-center text-sm text-ink-400">
            Produk untuk game ini sedang kosong. Coba lagi nanti atau hubungi admin.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {products.map((p) => {
              const selected = p.kode_produk === productCode;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProductCode(p.kode_produk)}
                  aria-pressed={selected}
                  className={cn(
                    'relative rounded-lg border p-3 text-left transition-colors',
                    selected
                      ? 'border-flame-500 bg-flame-500/10'
                      : 'border-ink-700 bg-ink-850 hover:border-ink-600',
                  )}
                >
                  {p.label && (
                    <span className="absolute right-2 top-2 rounded bg-flame-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                      {p.label}
                    </span>
                  )}
                  <span className="block pr-10 text-xs font-semibold leading-snug text-ink-100">
                    {p.name}
                  </span>
                  <span className="mt-2 block text-sm font-bold text-flame-400">
                    {formatRupiah(p.sell_price)}
                  </span>
                  {p.base_price > p.sell_price && (
                    <span className="mt-0.5 block text-[11px] text-ink-500 line-through">
                      {formatRupiah(p.base_price)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------------- 3 */}
      <section className="card-surface p-5">
        <StepHeading step={3} title="Pilih Pembayaran" />

        <div className="space-y-4">
          {groupedMethods.map(([group, methods]) => (
            <div key={group}>
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-500">
                {group}
              </h3>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {methods.map((m) => {
                  const selected = m.code === methodCode;
                  const mFee = product
                    ? Math.ceil(m.fee_flat + (product.sell_price * m.fee_percent) / 100)
                    : 0;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethodCode(m.code)}
                      aria-pressed={selected}
                      className={cn(
                        'rounded-lg border p-3 text-left transition-colors',
                        selected
                          ? 'border-flame-500 bg-flame-500/10'
                          : 'border-ink-700 bg-ink-850 hover:border-ink-600',
                      )}
                    >
                      <span className="block text-xs font-semibold text-ink-100">{m.name}</span>
                      <span className="mt-1 block text-[11px] text-ink-500">
                        {mFee > 0 ? `+ ${formatRupiah(mFee)} biaya` : 'Tanpa biaya tambahan'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- 4 */}
      <section className="card-surface p-5">
        <StepHeading
          step={4}
          title="Kontak Kamu"
          hint="Dipakai untuk mengirim bukti transaksi dan menghubungi kamu bila ada kendala."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="wa" className="mb-1.5 block text-xs font-semibold text-ink-300">
              Nomor WhatsApp{requireWhatsapp ? '' : ' (opsional)'}
            </label>
            <input
              id="wa"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              inputMode="tel"
              autoComplete="tel"
              placeholder="081234567890"
              className="w-full rounded-lg border border-ink-700 bg-ink-850 px-3.5 py-3 text-sm text-ink-100 placeholder:text-ink-600 focus:border-flame-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-ink-300">
              Email (opsional)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="nama@email.com"
              className="w-full rounded-lg border border-ink-700 bg-ink-850 px-3.5 py-3 text-sm text-ink-100 placeholder:text-ink-600 focus:border-flame-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- total */}
      <section className="card-surface sticky bottom-3 z-10 p-5 shadow-2xl shadow-black/50">
        <div className="mb-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-ink-400">
            <span>{product ? product.name : 'Belum memilih nominal'}</span>
            <span className="text-ink-200">{formatRupiah(product?.sell_price ?? 0)}</span>
          </div>
          {fee > 0 && (
            <div className="flex justify-between text-ink-400">
              <span>Biaya {method?.name}</span>
              <span className="text-ink-200">{formatRupiah(fee)}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-ink-800 pt-2.5">
            <span className="text-sm font-semibold text-ink-200">Total Bayar</span>
            <span className="text-xl font-extrabold text-flame-400">{formatRupiah(total)}</span>
          </div>
        </div>

        {formError && (
          <p className="mb-3 flex items-start gap-2 rounded-lg bg-red-500/10 px-3 py-2.5 text-xs font-medium text-red-400">
            <AlertCircle className="mt-px h-4 w-4 shrink-0" aria-hidden />
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !product || !method}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-flame-500 py-3.5 text-sm font-bold text-white transition-colors hover:bg-flame-600 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-ink-500"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Membuat pesanan…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" aria-hidden />
              Beli Sekarang
            </>
          )}
        </button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-500">
          <ShieldCheck className="h-3.5 w-3.5 text-mint-500" aria-hidden />
          Tanpa login akun game · Proses otomatis · Dana kembali bila gagal
        </p>
      </section>
    </form>
  );
}
