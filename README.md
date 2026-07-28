# Website SMK Negeri 3 Kendari — Next.js + MySQL

Hasil migrasi situs statis (HTML/CSS/JS + Google Sheets & Apps Script)
menjadi aplikasi **Next.js 14 (App Router, TypeScript)** dengan
**MySQL** sebagai basis data.

## ✨ Fitur

- Beranda dinamis: hero slider, sambutan kepala sekolah, tab program
  keahlian, prestasi, berita & agenda, fasilitas, ekskul, galeri, dan
  kontak.
- Halaman profil sekolah: Sejarah, Identitas Sekolah, Visi & Misi,
  Galeri Kegiatan.
- Halaman Berita/Artikel (daftar + detail per slug).
- Halaman SPMB (diarsipkan) — jadwal, dokumen wajib, dan form kontak
  panitia via WhatsApp. Form pendaftaran online di beranda sudah
  dilepas karena periode SPMB 2026 telah selesai; halaman ini kini
  berfungsi sebagai arsip informasi.
- Halaman jurusan dinamis (`/jurusan/[slug]`) + halaman khusus Tata
  Busana yang lebih lengkap.
- Seluruh konten dinamis (berita, prestasi, galeri, agenda,
  pengumuman, jurusan) diambil dari MySQL, dengan **fallback data
  statis** otomatis apabila database belum tersambung — sehingga
  proyek tetap bisa dijalankan sebelum database disiapkan.
- **Semua gambar dikonsolidasikan dalam satu folder** `public/images/`
  (tanpa sub-folder) agar rapi saat di-deploy ke hosting — lihat
  bagian "Aset Gambar" di bawah.

## 🗂️ Struktur Proyek

```
smkn3-nextjs/
├── database/
│   ├── schema.sql        # Skema tabel MySQL
│   ├── seed.sql           # Data awal (agenda, jurusan, contoh berita, dst.)
│   ├── migrate.js         # Script "npm run db:migrate"
│   └── seed.js             # Script "npm run db:seed"
├── public/
│   └── images/             # SEMUA aset gambar situs, dalam satu folder rata
│                            # (logo, hero slider, jurusan, galeri, brosur, dll.)
├── src/
│   ├── app/                        # Routing App Router
│   │   ├── layout.tsx               # Root layout (Header, Ticker, Footer)
│   │   ├── page.tsx                  # Beranda
│   │   ├── globals.css                # Seluruh styling (design system navy/gold)
│   │   ├── artikel/page.tsx             # Daftar berita
│   │   ├── artikel/[slug]/page.tsx       # Detail berita
│   │   ├── sejarah-smkn-3-kendari/        # Halaman Sejarah
│   │   ├── identitas-sekolah/              # Halaman Identitas
│   │   ├── visi-dan-misi-smk-negeri-3-kendari/
│   │   ├── galeri-kegiatan/
│   │   ├── spmb/page.tsx
│   │   ├── tata-busana/page.tsx
│   │   └── jurusan/[slug]/page.tsx
│   ├── components/
│   │   ├── layout/    (Header, Footer, Ticker)
│   │   ├── home/      (HeroSlider, ProgramTabs, PPDBForm, dst.)
│   │   └── shared/    (FadeUp, PageHero, WhatsappContactForm)
│   ├── lib/
│   │   ├── db.ts        # Connection pool mysql2
│   │   ├── queries.ts    # Seluruh query database terpusat
│   │   └── types.ts       # Tipe data TypeScript
│   └── data/
│       ├── fallback.ts       # Data cadangan bila DB belum tersambung
│       └── pages-content.ts   # Konten statis (sejarah, visi-misi, dll.)
├── .env.example
├── next.config.js
├── package.json
└── tsconfig.json
```

## 🖼️ Aset Gambar

Semua gambar situs disatukan dalam satu folder rata: **`public/images/`**
(tidak ada sub-folder), supaya rapi saat proyek di-upload ke hosting.

| File                        | Digunakan di                              |
| ---------------------------- | ------------------------------------------ |
| `logo.png`                    | Logo header                                 |
| `kepala-sekolah.jpg`           | Foto sambutan kepala sekolah (beranda)      |
| `hero-*.jpg` (5 file)           | Hero slider beranda per jurusan             |
| `jurusan-*.jpg` (5 file)         | Foto tab program & kartu jurusan            |
| `tata-busana-cover.jpg`           | Cover halaman `/tata-busana`               |
| `galeri-1.jpg` s.d. `galeri-3.jpg` | Contoh foto galeri kegiatan               |
| `brosur-ppdb.png`                   | Brosur SPMB (arsip)                       |
| `flayer-spmb.jpg`                     | Flayer halaman `/spmb`                   |

> **Catatan:** file `hero-*.jpg`, `jurusan-*.jpg`, `tata-busana-cover.jpg`,
> `kepala-sekolah.jpg`, dan `galeri-*.jpg` saat ini masih berupa
> **gambar placeholder** (dibuat otomatis) karena situs asli
> menggunakan tautan foto eksternal (Google Drive) yang tidak dapat
> diunduh otomatis saat migrasi. Silakan ganti file-file tersebut
> dengan foto asli sekolah — cukup timpa file dengan nama yang sama
> di folder `public/images/`, tidak perlu mengubah kode apa pun.

## 🚀 Instalasi & Menjalankan Proyek

### 1. Prasyarat

- Node.js 18+
- Server MySQL 8+ (lokal atau hosting)

### 2. Install dependencies

```bash
npm install
```

### 3. Konfigurasi environment

Salin `.env.example` menjadi `.env.local`, lalu sesuaikan kredensial
MySQL Anda:

```bash
cp .env.example .env.local
```

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=smkn3_kdi
NEXT_PUBLIC_SITE_URL=https://smkn3kdi.sch.id
ADMIN_SESSION_SECRET=ganti-dengan-string-acak-yang-panjang-dan-rahasia
```

### 4. Buat skema database & isi data awal

```bash
npm run db:migrate   # membuat database + seluruh tabel
npm run db:seed      # mengisi data awal (agenda, jurusan, contoh berita, dll.)
npm run db:seed-admin # membuat akun default Panel Admin CMS
```

> Anda juga bisa menjalankan `database/schema.sql` dan
> `database/seed.sql` secara manual lewat phpMyAdmin / MySQL CLI jika
> lebih nyaman.

### 5. Jalankan mode development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### 6. Build untuk produksi

```bash
npm run build
npm run start
```

## 🔐 Panel Admin CMS

Situs ini dilengkapi Panel Admin CMS untuk mengelola konten tanpa
menyentuh kode, tersedia di **`/admin`**.

- **Login:** `/admin/login` — akun default setelah menjalankan
  `npm run db:seed-admin`:
  - Username: `admin`
  - Password: `admin123`
  - ⚠️ Segera ganti password ini lewat menu **Pengguna** setelah
    login pertama.
- **Fitur yang sudah aktif (CRUD penuh, tersambung ke MySQL):**
  Dashboard ringkasan, Postingan Berita (+ kategori), Agenda,
  Pengumuman, Prestasi, Galeri (dengan unggah gambar langsung ke
  `public/images`), Jurusan (+ materi pokok), dan Pengguna admin.
- **Fitur yang masih "Segera Hadir"** (placeholder, akan diisi lain
  waktu): Halaman (page builder), Penampilan (Menu/Header/Footer),
  dan Pengaturan situs — saat ini konten tersebut masih dikelola
  langsung lewat kode seperti sebelumnya.
- Sesi login memakai cookie yang ditandatangani dengan
  `ADMIN_SESSION_SECRET` — pastikan nilai ini diganti dengan string
  acak yang panjang saat deploy ke production.


## 🗄️ Struktur Database (ringkasan)

| Tabel             | Fungsi                                                          |
| ------------------ | ---------------------------------------------------------------- |
| `berita`            | Artikel/berita sekolah (dulunya sheet "Berita")                  |
| `prestasi`          | Daftar prestasi siswa (dulunya sheet "Prestasi")                 |
| `galeri`            | Foto dokumentasi kegiatan (dulunya sheet "Galeri")                |
| `agenda`            | Jadwal SPMB / kegiatan sekolah                                    |
| `pengumuman`        | Banner pengumuman resmi (ticker berjalan)                         |
| `jurusan`           | Kompetensi keahlian (Perhotelan, Tata Boga, dst.)                  |
| `jurusan_materi`    | Materi pokok tiap jurusan (relasi ke `jurusan`)                    |
| `ppdb_pendaftar`    | Data pendaftar PPDB (dulunya dikirim ke Google Apps Script)        |
| `statistik_hero`    | Angka statistik di hero slider (jumlah jurusan, siswa, dll.)        |

Lihat detail kolom pada `database/schema.sql`.

## 🛠️ Mengelola Konten

Saat ini pengelolaan konten (tambah/edit berita, prestasi, galeri,
dll.) dilakukan langsung lewat MySQL (phpMyAdmin, Adminer, TablePlus,
atau MySQL CLI). Struktur data sudah dirancang rapi sehingga siap
dikembangkan lebih lanjut menjadi panel admin (CRUD) bila diperlukan
di kemudian hari — cukup tambahkan route `/admin` yang memanggil
fungsi-fungsi di `src/lib/queries.ts` beserta method `INSERT/UPDATE`.

## 📌 Catatan Migrasi

- **Form pendaftaran PPDB di beranda sudah dihapus** karena periode
  SPMB Tahun Ajaran 2026/2027 telah selesai. Halaman `/spmb` tetap
  dipertahankan sebagai arsip informasi (jadwal, dokumen wajib, dan
  kontak panitia via WhatsApp). Bila sekolah membuka periode
  pendaftaran baru di kemudian hari, form dapat dibangun kembali
  dengan pola yang sama seperti `WhatsappContactForm.tsx` (kirim data
  ke API Route baru yang menyimpan ke tabel `ppdb_pendaftar` — tabel
  ini tetap tersedia di skema database untuk digunakan lagi).
- Data berita/prestasi/galeri pada situs lama diambil dari Google
  Sheets via `fetch()` di sisi klien. Pada versi baru, data ini
  diambil langsung di server (Server Component) dari MySQL sehingga
  lebih cepat dan SEO-friendly.
- Desain visual (warna navy/gold, tipografi Playfair Display + DM
  Sans) dipertahankan agar identitas sekolah tetap konsisten.
