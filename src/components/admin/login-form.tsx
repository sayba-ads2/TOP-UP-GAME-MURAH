'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError('Email atau kata sandi salah.');
      setLoading(false);
      return;
    }

    router.push(searchParams.get('next') ?? '/admin');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface space-y-4 p-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-ink-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          className="w-full rounded-lg border border-ink-700 bg-ink-850 px-3.5 py-3 text-sm text-ink-100 focus:border-flame-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-ink-300">
          Kata Sandi
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-ink-700 bg-ink-850 px-3.5 py-3 text-sm text-ink-100 focus:border-flame-500 focus:outline-none"
        />
      </div>

      {error && (
        <p className="flex items-start gap-2 rounded-lg bg-red-500/10 px-3 py-2.5 text-xs font-medium text-red-400">
          <AlertCircle className="mt-px h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-flame-500 py-3.5 text-sm font-bold text-white transition-colors hover:bg-flame-600 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <LogIn className="h-4 w-4" aria-hidden />
        )}
        Masuk
      </button>
    </form>
  );
}
