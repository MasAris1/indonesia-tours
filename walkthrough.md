# Indonesia Tours — Panduan Implementasi & Hasil Pengujian Lengkap (Fase 1, 2, 3 & 4)

Platform agregator Open & Private Trip terkurasi telah selesai dibangun secara menyeluruh sesuai dengan [prd.md](file:///home/aris-maulana/Documents/Project/Pemrograman%20Web%201/prd.md) dan [implementation_plan.md](file:///home/aris-maulana/Documents/Project/Pemrograman%20Web%201/implementation_plan.md).

---

## 1. Matriks Fitur & Status Implementasi

| Modul & Fitur | Status | Deskripsi Implementasi |
|---|---|---|
| **Fase 1: Katalog & Booking** | **Selesai** | Hero banner imersif, filter destinasi, toggle Open/Private Trip, filter Long Weekend, kuota real-time (`SeatMeter`), dan penahanan kursi 15 menit. |
| **Pencegahan Overbooking Atomik** | **Selesai** | Eksekusi via PostgreSQL function `book_seats` dengan row-level lock (`quota_booked + pax <= quota_total`). |
| **Fase 2: Pembayaran & E-Tiket** | **Selesai** | Integrasi Midtrans + Simulator lokal instan, Rekening Bersama (Escrow), E-Tiket QR Code, tautan grup WA resmi, dan alur pembatalan refund. |
| **Fase 3: Multi-Role Auth** | **Selesai** | Arsitektur 3 peran (`customer`, `partner`, `admin`) dengan SSR Route Guard di `src/hooks.server.ts` dan quick-login di `/masuk`. |
| **Fase 3: Portal Mitra Operator** | **Selesai** | Dashboard metrik (omzet kotor, escrow, payout), manajemen paket tur, penambahan jadwal keberangkatan, manifes penumpang + chat WA, klaim pencairan escrow, dan profil legalitas/rekening bank. |
| **Fase 3: Back-Office Admin** | **Selesai** | Dashboard KPI Platform (Total GMV, Komisi Platform 10%, Pax terjual), verifikasi legalitas mitra (NIB & Lisensi HPI), moderasi tur, otorisasi & rilis pencairan dana rekber, serta buku besar keuangan & ekspor CSV live. |
| **Fase 4: Promo & Diskon** | **Selesai** | Mesin voucher PostgreSQL (`validate_promo`) mendukung diskon nominal tetap dan persentase dengan batas maksimum (max cap), serta form voucher interaktif di halaman checkout. |
| **Dukungan Runtime** | **Selesai** | Kompatibel penuh dengan **Bun** dan **Node.js 22** (`@sveltejs/adapter-node`). |
| **Deployment Docker** | **Selesai** | Multi-stage build di `Dockerfile` dan `Dockerfile.bun`, orkestrasi `docker-compose.yml` di port 3000. |

---

## 2. Kredensial Akun Pengujian (Demo Accounts)

Tersedia tombol satu-klik pada halaman login (`http://localhost:3000/masuk`) untuk login instan:

| Peran (Role) | Email | Kata Sandi | Akses Portal | Fitur Utama yang Dapat Diuji |
|---|---|---|---|---|
| **Administrator** | `admin@indonesiatours.id` | `demo123456` | `/admin/dashboard` | Pantau KPI platform, verifikasi mitra, rilis payout escrow, moderasi katalog, kelola voucher, unduh CSV laporan transaksi. |
| **Mitra Operator** | `mitra@indonesiatours.id` | `demo123456` | `/mitra/dashboard` | Operator Bromo Highland Adventure: Tambah jadwal, manifes peserta + kontak WA, ajukan klaim payout rekber. |
| **Customer** | `demo@indonesiatours.id` | `demo123456` | `/` / `/pesanan` | Jelajah trip, pemesanan kuota, masukkan kode promo (`LIBURANSERU`), bayar simulasi, e-tiket, pembatalan. |

> **Widget Live Role Switcher:** Di halaman `/akun`, tersedia widget pengubah role instan untuk mempermudah pengujian alur peran tanpa perlu berulang kali logout.

---

## 3. Alur Pengujian Fitur (User Journey Walkthrough)

### Skenario A: Customer — Pesan Trip dengan Kode Diskon (Fase 1, 2 & 4)
1. Buka `http://localhost:3000/masuk`, klik **Customer: demo@indonesiatours.id**.
2. Pilih paket **Sunrise Bromo, Kawah Aktif & Madakaripura 2H1N**.
3. Pilih tanggal keberangkatan dan tentukan jumlah pax (misal 2 pax = Rp 2.500.000).
4. Klik **Pesan Sekarang**, Anda akan diarahkan ke `/checkout/[bookingCode]`.
5. Pada kotak kode voucher promo, masukkan salah satu kode berikut:
   - `LIBURANSERU` : Potongan langsung Rp 100.000.
   - `LONGWEEKEND10` : Diskon 10% (maksimal Rp 200.000).
   - `DISKONHEMAT` : Potongan langsung Rp 50.000.
6. Klik **Gunakan Voucher**. Total bayar langsung berkurang secara otomatis.
7. Pilih metode **QRIS (Instan)** dan klik **Konfirmasi Pembayaran**.
8. E-tiket boarding pass terbit dengan QR Code dan link gabung ke WhatsApp grup peserta.

### Skenario B: Mitra Operator — Kelola Tur & Klaim Payout Escrow (Fase 3)
1. Buka `http://localhost:3000/masuk`, klik **Mitra: mitra@indonesiatours.id**.
2. Buka `/mitra/dashboard`:
   - Lihat ringkasan saldo escrow tertahan, total kursi terpesan, dan payout yang telah diterima.
3. Buka `/mitra/tours`:
   - Tambah jadwal keberangkatan baru langsung dari daftar tur via modal *Tambah Jadwal*.
4. Buka `/mitra/pesanan`:
   - Lihat manifes penumpang lengkap dengan nomor WhatsApp peserta untuk koordinasi trip lapangan.
5. Buka `/mitra/payout`:
   - Ajukan klaim pencairan untuk pesanan trip yang telah berstatus `PAID` atau `COMPLETED`. Sistem akan otomatis menghitung potongan komisi platform 10% dan menampilkan estimasi dana bersih yang akan ditransfer.

### Skenario C: Administrator — Verifikasi Mitra, Rilis Dana & Laporan (Fase 3)
1. Buka `http://localhost:3000/masuk`, klik **Admin: admin@indonesiatours.id**.
2. Buka `/admin/dashboard`:
   - Pantau metrik GMV riil, komisi platform 10%, jumlah mitra terdaftar, dan klaim pencairan yang menunggu persetujuan.
3. Buka `/admin/mitra`:
   - Tinjau calon mitra `Lombok Summit & Rinjani Guide` (Status: `PENDING`), periksa NIB dan lisensi HPI, lalu klik **Setujui Mitra** untuk memverifikasi.
4. Buka `/admin/payouts`:
   - Tinjau klaim pencairan dana escrow dari mitra:
     - Klik **Otorisasi (Approve)** untuk menyetujui.
     - Klik **Rilis Dana (Transfer)** untuk mencairkan dana rekening bersama ke rekening bank mitra.
5. Buka `/admin/laporan`:
   - Periksa pembukuan keuangan transaksi lengkap.
   - Klik **Ekspor CSV (.csv)** atau akses langsung `http://localhost:3000/admin/laporan/export.csv` untuk mengunduh laporan berformat spreadsheet.
6. Buka `/admin/promos`:
   - Buat kode voucher baru atau nonaktifkan voucher promo yang sedang berjalan.

---

## 4. Cara Menjalankan Aplikasi

### Opsi 1: Menjalankan dengan Docker (Rekomendasi)
```bash
docker compose up -d --build
```
Aplikasi akan aktif di `http://localhost:3000`.

### Opsi 2: Menjalankan dengan Bun
```bash
bun install
bun run dev      # Mode development di http://localhost:5173
# atau mode production build:
bun run build
bun ./build/index.js
```

### Opsi 3: Menjalankan dengan Node.js (npm)
```bash
npm install
npm run dev      # Mode development di http://localhost:5173
# atau mode production build:
npm run build
PORT=3000 node build
```

---

## 5. Ringkasan Pengujian Kualitas & Keamanan

1. **SvelteKit & TypeScript Typecheck:**
   - Command: `bun run check`
   - Hasil: **0 errors** di seluruh 24 rute dan komponen.
2. **Build Produksi:**
   - Command: `bun run build`
   - Hasil: **Sukses 100%** menggunakan `@sveltejs/adapter-node`.
3. **Integritas Route Guard SSR:**
   - Mengakses `/admin/*` tanpa login diarahkan ke `/masuk`.
   - Mengakses `/admin/*` dengan akun customer/mitra ditolak dan diarahkan ke beranda.
   - Mengakses `/mitra/*` tanpa akun mitra diarahkan ke form pendaftaran mitra `/mitra/daftar`.
4. **Keamanan Row Level Security (RLS) PostgreSQL:**
   - Helper function `is_admin()` mengamankan seluruh tabel publik.
   - Customer hanya dapat membaca pesanan pribadi miliknya.
   - Mitra hanya dapat membaca manifes tur yang dinaunginya.
   - Admin memiliki akses audit penuh ke seluruh buku besar transaksi dan escrow.
5. **Ekspor CSV Real-Time:**
   - Endpoint `/admin/laporan/export.csv` menghasilkan output UTF-8 CSV dengan pemisahan GMV, komisi platform 10%, dan pencairan mitra.
