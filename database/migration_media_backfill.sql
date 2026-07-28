-- ============================================================
-- Backfill Pustaka Media — daftarkan gambar yang SUDAH ADA di public/images
-- (berdasarkan isi folder public/images pada zip project sesi ini)
--
-- ⚠️ PENTING: jalankan database/migration_media.sql DULU (tabel `media`
-- harus sudah ada) sebelum menjalankan file ini.
--
-- ⚠️ Kalau di hosting Anda ada file gambar TAMBAHAN di public/images yang
-- tidak tercantum di sini (misalnya diunggah manual lewat File Manager
-- cPanel, bukan lewat zip project ini), file tersebut TIDAK akan ikut
-- terdaftar lewat SQL ini. Untuk memindai folder public/images secara
-- lengkap & otomatis (apa pun isinya), pakai cara kedua:
--   npm run db:backfill-media
-- (lihat database/backfill-media.js)
--
-- Aman dijalankan berkali-kali — setiap baris dicek dulu dengan
-- WHERE NOT EXISTS berdasarkan file_name, tidak akan menduplikasi data,
-- dan tidak mengubah struktur tabel apa pun.
-- ============================================================

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'brosur-ppdb.png', 'brosur-ppdb.png', '/images/brosur-ppdb.png', 'image/png', 467546, NULL, '2026-07-24 00:11:32'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'brosur-ppdb.png');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'flayer-spmb.jpg', 'flayer-spmb.jpg', '/images/flayer-spmb.jpg', 'image/jpeg', 209693, NULL, '2026-07-24 00:11:32'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'flayer-spmb.jpg');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'galeri-1.jpg', 'galeri-1.jpg', '/images/galeri-1.jpg', 'image/jpeg', 14961, NULL, '2026-07-24 15:32:34'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'galeri-1.jpg');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'galeri-2.jpg', 'galeri-2.jpg', '/images/galeri-2.jpg', 'image/jpeg', 16854, NULL, '2026-07-24 15:32:34'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'galeri-2.jpg');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'galeri-3.jpg', 'galeri-3.jpg', '/images/galeri-3.jpg', 'image/jpeg', 16844, NULL, '2026-07-24 15:32:34'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'galeri-3.jpg');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'hero-kecantikan.jpg', 'hero-kecantikan.jpg', '/images/hero-kecantikan.jpg', 'image/jpeg', 50281, NULL, '2026-07-24 15:32:32'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'hero-kecantikan.jpg');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'hero-kuliner.jpg', 'hero-kuliner.jpg', '/images/hero-kuliner.jpg', 'image/jpeg', 39776, NULL, '2026-07-24 15:32:32'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'hero-kuliner.jpg');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'hero-perhotelan.jpg', 'hero-perhotelan.jpg', '/images/hero-perhotelan.jpg', 'image/jpeg', 42404, NULL, '2026-07-24 15:32:32'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'hero-perhotelan.jpg');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'hero-tata-busana.jpg', 'hero-tata-busana.jpg', '/images/hero-tata-busana.jpg', 'image/jpeg', 42708, NULL, '2026-07-24 15:32:32'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'hero-tata-busana.jpg');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'hero-tjkt.jpg', 'hero-tjkt.jpg', '/images/hero-tjkt.jpg', 'image/jpeg', 52430, NULL, '2026-07-24 15:32:32'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'hero-tjkt.jpg');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'jurusan-kecantikan.jpg', 'jurusan-kecantikan.jpg', '/images/jurusan-kecantikan.jpg', 'image/jpeg', 19005, NULL, '2026-07-24 15:32:32'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'jurusan-kecantikan.jpg');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'jurusan-kuliner.jpg', 'jurusan-kuliner.jpg', '/images/jurusan-kuliner.jpg', 'image/jpeg', 14211, NULL, '2026-07-24 15:32:32'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'jurusan-kuliner.jpg');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'jurusan-perhotelan.jpg', 'jurusan-perhotelan.jpg', '/images/jurusan-perhotelan.jpg', 'image/jpeg', 15534, NULL, '2026-07-24 15:32:32'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'jurusan-perhotelan.jpg');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'jurusan-tata-busana.jpg', 'jurusan-tata-busana.jpg', '/images/jurusan-tata-busana.jpg', 'image/jpeg', 15941, NULL, '2026-07-24 15:32:32'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'jurusan-tata-busana.jpg');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'jurusan-tjkt.jpg', 'jurusan-tjkt.jpg', '/images/jurusan-tjkt.jpg', 'image/jpeg', 18858, NULL, '2026-07-24 15:32:34'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'jurusan-tjkt.jpg');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'kepala-sekolah.jpg', 'kepala-sekolah.jpg', '/images/kepala-sekolah.jpg', 'image/jpeg', 17376, NULL, '2026-07-24 15:32:34'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'kepala-sekolah.jpg');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'logo.png', 'logo.png', '/images/logo.png', 'image/png', 4997, NULL, '2026-07-24 15:32:34'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'logo.png');

INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
SELECT 'tata-busana-cover.jpg', 'tata-busana-cover.jpg', '/images/tata-busana-cover.jpg', 'image/jpeg', 38113, NULL, '2026-07-24 15:32:34'
WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_name = 'tata-busana-cover.jpg');

