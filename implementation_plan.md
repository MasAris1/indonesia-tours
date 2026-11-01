# Indonesia Tours — Implementation Plan (Fase 1, 2, 3 & 4)

Dokumen rencana kerja dan status implementasi platform Indonesia Tours sesuai [prd.md](file:///home/aris-maulana/Documents/Project/Pemrograman%20Web%201/prd.md).

---

## 📊 Status Progres Keseluruhan

| Fase | Cakupan | Status | Catatan |
|---|---|:---:|---|
| **Fase 1** | **Jelajah Trip & Pesan Kursi** | :white_check_mark: Selesai | Search destinasi, filter long weekend, atomic seat lock RPC, detail paket, kalkulasi pax |
| **Fase 2** | **Bayar Online & Pesanan Saya** | :white_check_mark: Selesai | Midtrans Sandbox (QRIS & VA), simulasi bayar instan, digital boarding pass QR, cancel & refund, Docker & Bun verified |
| **Fase 3** | **Akun, Portal Mitra & Back-Office Admin** | :white_check_mark: Selesai | Multi-role Auth (Customer/Partner/Admin), Portal Mitra (tours, jadwal, manifes + WA, klaim payout rekber), Back-office Admin (dashboard GMV, kurasi mitra NIB/HPI, otorisasi payout, laporan ekspor CSV) |
| **Fase 4** | **Promo & Diskon** | :white_check_mark: Selesai | Tabel voucher promo, validasi RPC diskon (fixed & percentage), form promo di checkout, admin management voucher |

---

## 🛠️ Rincian Pekerjaan Fase 3 & 4

### 1. Database & Autentikasi (Supabase Cloud `ljsnccdmojrywjxnadvb`)
- **Migrasi `006_roles_and_payouts`**:
  - Menambahkan kolom `role` pada tabel `profiles` (`VARCHAR(32) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'partner', 'admin'))`).
  - RPC function `verify_partner(p_partner_id uuid, p_status text, p_commission numeric)` untuk admin menyetujui / menolak mitra.
  - RPC function `request_payout(p_partner_id uuid, p_booking_id uuid)` untuk mitra mengajukan pencairan dana tiket yang sudah tuntas.
  - RPC function `authorize_payout(p_payout_id uuid)` & `release_payout(p_payout_id uuid)` untuk admin mengesahkan pelepasan dana rekber (dipotong komisi platform 10-15%).
  - Seed akun multi-role untuk kemudahan pengujian:
    - **Customer**: `demo@indonesiatours.id` / `demo123456`
    - **Mitra Operator**: `mitra@indonesiatours.id` / `mitra123456` (terhubung ke profil mitra "Bromo Adventure ID")
    - **Admin Platform**: `admin@indonesiatours.id` / `admin123456` (role: `admin`)
- **Migrasi `007_promos` (Fase 4)**:
  - Tabel `promos` (`id uuid`, `code text UNIQUE`, `discount_type ('PERCENTAGE' | 'FIXED')`, `discount_value numeric`, `min_spend numeric`, `max_discount numeric`, `quota int`, `used_count int`, `valid_until timestamptz`, `is_active boolean`, 7 default audit fields).
  - RPC function `validate_promo(p_code text, p_amount numeric)` untuk verifikasi kode voucher dan menghitung nominal potongan.
  - Seed voucher aktif: `LIBURANSERU` (diskon Rp 100.000), `LONGWEEKEND10` (diskon 10%), `DISKONHEMAT` (diskon Rp 50.000).

### 2. Route & Halaman Baru
- **/akun (Profil Pengguna)**:
  - Melihat dan mengedit profil (Nama lengkap, nomor telepon, email).
  - Tampilan peran aktif (*Customer*, *Mitra Operator*, atau *Admin*).
  - Tautan cepat berpindah ke Portal Mitra atau Admin Back-Office sesuai hak akses.
- **/mitra (Portal Mitra)**:
  - `/mitra/dashboard`: Ringkasan statistik (Trip aktif, total pemesanan masuk, total dana di rekber, riwayat payout).
  - `/mitra/tours`: Manajemen paket open trip milik mitra + form tambah paket tur baru (judul, destinasi, harga, fasilitas, itinerary harian, jadwal & kuota).
  - `/mitra/pesanan`: Manifest data peserta yang sudah memesan jadwal tur milik mitra (nama, WhatsApp, status pembayaran).
  - `/mitra/payout`: Daftar pesanan yang telah selesai dan tombol "Ajukan Klaim Payout" ke platform.
  - `/mitra/profil`: Informasi legalitas NIB, lisensi HPI, nomor rekening bank, dan status verifikasi kurasi.
- **/admin (Back-Office Admin)**:
  - `/admin/dashboard`: Dashboard metrik bisnis (Total Nilai Transaksi GMV, Pendapatan Komisi Platform 10%, Total Pesanan, Jumlah Mitra Aktif, Kursi Terjual).
  - `/admin/mitra`: Verifikasi & Kurasi mitra (Tinjau dokumen NIB & HPI, Setujui/Tolak mitra, Atur persentase komisi 10-15%).
  - `/admin/tours`: Kurasi paket tur dari seluruh mitra (aktifkan/nonaktifkan paket tayang).
  - `/admin/payouts`: Otorisasi & Rilis Pencairan Dana ke mitra setelah dipotong komisi platform secara transparan.
  - `/admin/laporan`: Rekapitulasi penjualan & tombol "Ekspor Laporan Transaksi (.CSV)".
  - `/admin/promos`: Manajemen voucher diskon (tambah/nonaktifkan promo).
- **/checkout/[code] (Peningkatan Fase 4)**:
  - Kotak input kode promo/voucher dengan validasi instan dan pengurangan total tagihan secara transparan.

### 3. Keamanan & Route Guard
- Update `src/hooks.server.ts` untuk memeriksa role pengguna di database `profiles`:
  - Rute `/mitra/*` hanya dapat diakses oleh user dengan role `partner` atau `admin`.
  - Rute `/admin/*` hanya dapat diakses oleh user dengan role `admin`.
- Penambahan tombol "Pilih Akun Demo (Customer / Mitra / Admin)" di halaman `/masuk` untuk pengujian instan bagi penguji/dosen.

---

## 🧪 Rencana Verifikasi
1. **Automated Check**: `bun run check` dan `npm run check` (0 error TypeScript & Svelte 5).
2. **Build Test**: `bun run build` sukses.
3. **Database Test**:
   - Verifikasi migrasi 006 dan 007 di Supabase cloud.
   - Panggilan RPC `verify_partner`, `request_payout`, `authorize_payout`, `release_payout`, dan `validate_promo`.
4. **End-to-End User Flow Test**:
   - Login sebagai `admin@indonesiatours.id` → buka dashboard admin → lihat metrik GMV, approve mitra baru, otorisasi payout.
   - Login sebagai `mitra@indonesiatours.id` → buka dashboard mitra → tambah paket tur baru → ajukan klaim payout.
   - Login sebagai `demo@indonesiatours.id` → checkout dengan kode promo `LIBURANSERU` → dapat potongan Rp 100.000 → bayar dan dapat tiket.
