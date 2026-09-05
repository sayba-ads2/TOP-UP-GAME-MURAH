-- ============================================================================
-- TOP UP GAME MURAH  ·  Data awal (seed)
-- Jalankan SETELAH 01_schema.sql
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. SETTINGS TOKO
-- ---------------------------------------------------------------------------
insert into public.settings (key, value) values
  ('store', jsonb_build_object(
      'name',        'Top Up Game Murah',
      'tagline',     'Top Up Game Termurah & Tercepat di Pontianak',
      'url',         'https://topupgamemurah.sayba.id',
      'whatsapp',    '6281234567890',
      'email',       'sayba.help@gmail.com',
      'city',        'Pontianak',
      'province',    'Kalimantan Barat',
      'address',     'Pontianak, Kalimantan Barat 78121',
      'open_hours',  '08:00-23:00 WIB',
      'instagram',   'https://instagram.com/saybaarc',
      'tiktok',      'https://tiktok.com/@saybaarc'
  )),
  -- Margin default dipakai kalau produk tidak punya margin sendiri.
  -- rounding: pembulatan harga jual ke atas (100 = Rp100 terdekat).
  ('pricing', jsonb_build_object(
      'margin_type',  'percent',
      'margin_value', 6,
      'min_margin',   500,
      'rounding',     100,
      'unique_code',  true,
      'unique_code_max', 199
  )),
  ('order', jsonb_build_object(
      'expire_minutes',   60,
      'auto_process',     true,
      'require_whatsapp', true,
      'require_email',    false
  )),
  ('maintenance', jsonb_build_object('enabled', false, 'message', ''))
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- 2. METODE PEMBAYARAN
--    provider 'manual' = pembeli transfer/scan, admin konfirmasi di dashboard.
--    Ganti ke 'midtrans' / 'tripay' saat gateway sudah aktif.
-- ---------------------------------------------------------------------------
insert into public.payment_methods
  (code, name, group_name, provider, fee_flat, fee_percent, account_name, account_number, sort_order, instructions)
values
  ('QRIS', 'QRIS (Semua E-Wallet & Bank)', 'QRIS', 'manual', 0, 0.7, 'SAYBA ARC', null, 1,
   '["Buka aplikasi e-wallet atau mobile banking apa pun.","Pilih menu Scan QRIS lalu scan kode di halaman pembayaran.","Pastikan nominal SAMA PERSIS sampai 3 digit terakhir.","Selesaikan pembayaran, pesanan diproses otomatis."]'::jsonb),
  ('DANA', 'DANA', 'E-Wallet', 'manual', 0, 0, 'SAYBA ARC', '081234567890', 10,
   '["Buka aplikasi DANA lalu pilih Kirim / Transfer.","Masukkan nomor tujuan yang tertera.","Kirim nominal SAMA PERSIS termasuk kode unik.","Simpan bukti transfer bila diminta admin."]'::jsonb),
  ('GOPAY', 'GoPay', 'E-Wallet', 'manual', 0, 0, 'SAYBA ARC', '081234567890', 11,
   '["Buka Gojek/GoPay lalu pilih Bayar atau Transfer.","Masukkan nomor tujuan yang tertera.","Kirim nominal SAMA PERSIS termasuk kode unik."]'::jsonb),
  ('OVO', 'OVO', 'E-Wallet', 'manual', 0, 0, 'SAYBA ARC', '081234567890', 12,
   '["Buka aplikasi OVO lalu pilih Transfer.","Masukkan nomor tujuan yang tertera.","Kirim nominal SAMA PERSIS termasuk kode unik."]'::jsonb),
  ('SHOPEEPAY', 'ShopeePay', 'E-Wallet', 'manual', 0, 0, 'SAYBA ARC', '081234567890', 13,
   '["Buka Shopee lalu masuk ke ShopeePay.","Pilih Transfer dan masukkan nomor tujuan.","Kirim nominal SAMA PERSIS termasuk kode unik."]'::jsonb),
  ('BCA', 'Transfer Bank BCA', 'Bank Transfer', 'manual', 0, 0, 'SAYBA ARC', '1234567890', 20,
   '["Transfer ke rekening BCA yang tertera.","Nominal harus SAMA PERSIS termasuk kode unik.","Pesanan diproses setelah dana masuk."]'::jsonb),
  ('BRI', 'Transfer Bank BRI', 'Bank Transfer', 'manual', 0, 0, 'SAYBA ARC', '1234567890', 21,
   '["Transfer ke rekening BRI yang tertera.","Nominal harus SAMA PERSIS termasuk kode unik.","Pesanan diproses setelah dana masuk."]'::jsonb),
  ('MANDIRI', 'Transfer Bank Mandiri', 'Bank Transfer', 'manual', 0, 0, 'SAYBA ARC', '1234567890', 22,
   '["Transfer ke rekening Mandiri yang tertera.","Nominal harus SAMA PERSIS termasuk kode unik.","Pesanan diproses setelah dana masuk."]'::jsonb)
on conflict (code) do nothing;

-- ---------------------------------------------------------------------------
-- 3. FAQ  (juga dipakai untuk structured data FAQPage di halaman depan)
-- ---------------------------------------------------------------------------
insert into public.faqs (question, answer, sort_order) values
  ('Apakah top up di Top Up Game Murah aman?',
   'Aman. Semua transaksi diproses lewat jalur resmi distributor berlisensi, tanpa perlu login atau memberikan password akun game kamu. Kami hanya butuh User ID dan Server ID.', 1),
  ('Berapa lama proses top up-nya?',
   'Rata-rata 3-30 detik setelah pembayaran terkonfirmasi. Diamond, UC, atau item langsung masuk otomatis ke akun game kamu 24 jam nonstop.', 2),
  ('Apakah melayani pembeli di Pontianak dan Kalimantan Barat?',
   'Ya. Kami berbasis di Pontianak dan melayani seluruh Kalimantan Barat: Kubu Raya, Mempawah, Singkawang, Sanggau, Sintang, Ketapang, sampai Sambas. Prosesnya online sehingga bisa dari mana saja.', 3),
  ('Metode pembayaran apa saja yang tersedia?',
   'QRIS (semua e-wallet dan mobile banking), DANA, GoPay, OVO, ShopeePay, serta transfer bank BCA, BRI, dan Mandiri.', 4),
  ('Kenapa harganya bisa lebih murah?',
   'Kami mengambil harga distributor langsung sebagai mitra reseller resmi, sehingga margin yang kami ambil jauh lebih tipis dibanding harga in-game.', 5),
  ('Bagaimana kalau diamond tidak masuk?',
   'Buka halaman Cek Pesanan dan masukkan kode invoice kamu. Jika status FAILED, dana dikembalikan penuh. Kamu juga bisa langsung menghubungi admin lewat WhatsApp.', 6),
  ('Apakah perlu daftar atau punya akun dulu?',
   'Tidak perlu. Cukup pilih game, masukkan User ID, pilih nominal, bayar. Kode invoice untuk melacak pesanan dikirim langsung di layar dan lewat WhatsApp.', 7),
  ('Apakah bisa top up tengah malam?',
   'Bisa. Sistem berjalan otomatis 24 jam, termasuk hari libur. Admin manusia siaga pukul 08.00-23.00 WIB.', 8)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- 4. TESTIMONI AWAL (silakan ganti dengan testimoni asli pelanggan kamu)
-- ---------------------------------------------------------------------------
insert into public.testimonials (name, city, game, rating, message, sort_order) values
  ('Rizky A.',  'Pontianak',  'Mobile Legends', 5, 'Order jam 2 pagi, diamond masuk kurang dari 10 detik. Harganya paling murah se-Pontianak.', 1),
  ('Dewi P.',   'Kubu Raya',  'Free Fire',      5, 'Awalnya ragu, ternyata legit. Sudah 6x top up dan selalu lancar.', 2),
  ('Andre S.',  'Singkawang', 'PUBG Mobile',    5, 'UC langsung masuk, adminnya fast respon di WhatsApp. Recommended.', 3),
  ('Fitri N.',  'Pontianak',  'Genshin Impact', 5, 'Bayar pakai QRIS gampang banget, gak perlu daftar akun dulu.', 4),
  ('Bagas W.',  'Mempawah',   'Honor of Kings', 5, 'Selisihnya lumayan dibanding beli langsung di game. Bakal langganan.', 5)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- 5. JADIKAN DIRIMU ADMIN
--    Langkah:
--    a) Supabase Dashboard > Authentication > Users > Add user
--       (email + password, centang "Auto Confirm User")
--    b) Ganti email di bawah, lalu jalankan blok ini.
-- ---------------------------------------------------------------------------
insert into public.admin_users (id, email, full_name, role)
select id, email, 'Owner Sayba Arc', 'owner'
from auth.users
where email = 'sayba.help@gmail.com'
on conflict (id) do update set is_active = true, role = 'owner';
