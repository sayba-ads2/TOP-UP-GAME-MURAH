import { ImageResponse } from 'next/og';

export const runtime = 'edge';

/**
 * Gambar Open Graph 1200x630 yang dirender saat diminta.
 *
 * Dipakai sebagai pratinjau ketika tautan situs dibagikan di WhatsApp,
 * Facebook, X, dan Telegram. Tanpa berkas gambar statis, jadi tidak ada
 * aset yang bisa ketinggalan diperbarui.
 */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title')?.slice(0, 80) ?? 'Top Up Game Murah';
  const subtitle =
    searchParams.get('subtitle')?.slice(0, 120) ??
    'Top Up Diamond & Voucher Game Termurah di Pontianak';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0a0a0b 0%, #16161a 55%, #241408 100%)',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: '#1c1c21',
              border: '2px solid #26262d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 34,
              fontWeight: 900,
              color: '#f47c20',
            }}
          >
            SA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#ededf0' }}>
              topupgamemurah.sayba.id
            </span>
            <span style={{ fontSize: 18, color: '#8b8b98', marginTop: 4 }}>by Sayba Arc</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 68,
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </span>
          <span style={{ fontSize: 30, color: '#b8b8c2', marginTop: 22, lineHeight: 1.3 }}>
            {subtitle}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          {['Proses Otomatis 24 Jam', 'Tanpa Login Akun', 'QRIS & Semua E-Wallet'].map((chip) => (
            <span
              key={chip}
              style={{
                fontSize: 22,
                color: '#fdb97a',
                background: 'rgba(244,124,32,0.12)',
                border: '1px solid rgba(244,124,32,0.35)',
                borderRadius: 999,
                padding: '10px 22px',
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
