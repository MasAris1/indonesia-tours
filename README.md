# Indonesia Tours 🇮🇩 ⛵

Platform agregator dan pemesanan *open trip* terkurasi di Indonesia dengan *real-time seat lock*, transparansi operator berlisensi, perlindungan rekening bersama (escrow protection), dan simulasi pembayaran instan.

Dibangun dengan **SvelteKit (Svelte 5 Runes)**, **Tailwind CSS v4**, **TypeScript**, **Supabase (PostgreSQL + Auth + Realtime)**, dan kompatibel 100% dengan **Node.js** maupun **Bun**.

---

## ⚡ Menjalankan dengan Bun (Direkomendasikan)

Project ini **100% kompatibel dan sudah diuji dengan Bun (v1.3+)**.

### 1. Install Dependencies
```bash
bun install
```

### 2. Mode Pengembangan (Development Server)
```bash
bun run dev
```
Buka browser di [http://localhost:5173](http://localhost:5173).

### 3. Type Checking
```bash
bun run check
```

### 4. Build & Production Runtime
```bash
# Build SvelteKit bundle
bun run build

# Jalankan server produksi langsung menggunakan runtime Bun
PORT=3000 bun ./build/index.js

# Atau gunakan preview mode
bun run preview
```

---

## 🟢 Alternatif: Menjalankan dengan Node.js & npm

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev

# Build aplikasi
npm run build

# Jalankan server node
node build/index.js
```

---

## 🐳 Menjalankan dengan Docker

Aplikasi ini telah dilengkapi dengan konfigurasi **Docker multi-stage build** yang ringan dan aman.

### Cara 1: Menggunakan Docker Compose (Direkomendasikan)
```bash
# Build dan jalankan container di latar belakang
docker compose up -d --build

# Melihat log aplikasi
docker compose logs -f

# Menghentikan container
docker compose down
```
Aplikasi langsung dapat diakses di: **[http://localhost:3000](http://localhost:3000)**.

### Cara 2: Dockerfile Standalone (Node.js Alpine)
```bash
# Build image
docker build -t indonesia-tours:latest .

# Jalankan container dengan environment dari .env
docker run -d --name indonesia-tours-app -p 3000:3000 --env-file .env indonesia-tours:latest
```

### Cara 3: Dockerfile Menggunakan Runtime Bun (`Dockerfile.bun`)
Untuk performa runtime Bun di dalam Docker:
```bash
# Build image berbasis oven/bun:alpine
docker build -f Dockerfile.bun -t indonesia-tours-bun:latest .

# Jalankan container
docker run -d --name indonesia-tours-bun -p 3000:3000 --env-file .env indonesia-tours-bun:latest
```

---

## 🔐 Akun Uji Coba Demo (Multi-Role)

Tersedia akun demo untuk semua role pengguna agar memudahkan pengujian seluruh alur dan fitur platform:

| Role | Email | Password | Hak Akses & Fitur Utama |
|---|---|---|---|
| **Customer** | `demo@indonesiatours.id` | `demo123456` | Pesan tiket open trip, checkout & bayar online, akses e-tiket digital, pembatalan & refund. |
| **Mitra (Operator Tur)** | `mitra@indonesiatours.id` | `demo123456` | **Portal Mitra (`/mitra`)**: Tambah & kelola paket tur, kelola jadwal & kuota kursi, lihat manifest peserta, ajukan klaim payout rekber (escrow). |
| **Admin Platform** | `admin@indonesiatours.id` | `demo123456` | **Back-Office (`/admin`)**: Dashboard metrik GMV & komisi platform, kurasi & verifikasi legalitas mitra (NIB & lisensi HPI), otorisasi rilis payout rekber, ekspor laporan penjualan (.CSV), manajemen voucher promo. |

> **Tip:** Di halaman **[Masuk (/masuk)](http://localhost:3000/masuk)** (mode lokal/dev) juga tersedia tombol **"⚡ Uji Coba Cepat"** untuk mengisi email dan kata sandi masing-masing role secara instan dengan satu klik.

---

## 💳 Simulasi Pembayaran (Midtrans)

Saat checkout di halaman `/checkout/[code]`:
1. Pilih metode pembayaran (QRIS / Mandiri VA / BCA VA / BNI VA).
2. Klik tombol **"⚡ Simulasi Bayar Instan (Sandbox)"** untuk memverifikasi alur pembayaran langsung tanpa memerlukan webhook eksternal.
3. Anda akan diarahkan otomatis ke Digital Boarding Pass (`/pesanan/[code]`) dengan status **LUNAS (CONFIRMED)** dan QR Code tiket.
