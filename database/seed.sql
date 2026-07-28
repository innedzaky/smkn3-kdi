-- =====================================================================
-- Data awal (seed) — Website SMK Negeri 3 Kendari
-- Jalankan setelah schema.sql:
--   mysql -u root -p smkn3_kdi < database/seed.sql
-- =====================================================================

USE smkn3_kdi;

-- ---------------------------------------------------------------------
-- Statistik hero slider
-- ---------------------------------------------------------------------
INSERT INTO statistik_hero (angka, label, urutan) VALUES
('5', 'Kompetensi Keahlian', 1),
('1.200+', 'Siswa Aktif', 2),
('95%', 'Terserap Industri', 3),
('✓', 'Pusat Keunggulan Nasional', 4);

-- ---------------------------------------------------------------------
-- Pengumuman resmi
-- ---------------------------------------------------------------------
INSERT INTO pengumuman (label, judul, lokasi, link_url, is_active) VALUES
('INFO', 'Pendaftaran Peserta Didik Baru (SPMB) Tahun Ajaran 2026/2027 telah resmi ditutup. Terima kasih atas antusiasme seluruh calon peserta didik.',
 'Lihat jadwal & arsip informasi SPMB 2026', '/spmb', 1);

-- ---------------------------------------------------------------------
-- Jadwal / Agenda SPMB 2026
-- ---------------------------------------------------------------------
INSERT INTO agenda (tanggal, nama, lokasi, link_url, urutan) VALUES
('22 Juni - 1 Juli 2026', 'Pendaftaran SPMB', 'Online (24 jam)', '/spmb', 1),
('22 Juni - 1 Juli 2026', 'Verifikasi Berkas / Data Pendaftaran Online', 'SMK Negeri 3 Kendari (09.00 - 16.00)', NULL, 2),
('22 Juni - 1 Juli 2026', 'Tes Khusus Buta Warna (tidak memiliki SKD)', 'SMK Negeri 3 Kendari (09.00 - 16.00)', NULL, 3),
('22 Juni - 1 Juli 2026', 'Proses Seleksi SPMB Offline', 'SMK Negeri 3 Kendari (09.00 - 16.00)', NULL, 4),
('3 Juli 2026', 'Pengumuman', 'SMK Negeri 3 Kendari Online/offline (10.00)', NULL, 5),
('6-8 Juli 2026', 'Daftar Ulang', 'SMK Negeri 3 Kendari (09.00 - 16.00)', NULL, 6);

-- ---------------------------------------------------------------------
-- Jurusan / Kompetensi Keahlian
-- ---------------------------------------------------------------------
INSERT INTO jurusan (slug, nama, label_badge, deskripsi, gambar_url, icon, urutan) VALUES
('perhotelan', 'Perhotelan', 'Hospitality',
 'Mencetak praktisi perhotelan mumpuni menguasai sistem Front Office resepsionis, Housekeeping manajemen kebersihan tata graha kamar, laundry operations, serta pelayanan prima hospitality bintang lima.',
 '/images/jurusan-perhotelan.jpg', '🏨', 1),
('tata-kecantikan-dan-spa', 'Tata Kecantikan dan Spa', 'Tata Kecantikan',
 'Pembelajaran komprehensif teknik pemangkasan rambut modis, perawatan wajah klinis estetika, make up artis (MUA), perawatan refleksi, serta manajemen pengelolaan spa modern.',
 '/images/jurusan-kecantikan.jpg', '💄', 2),
('kuliner', 'Kuliner', 'Sektor Kuliner',
 'Menyiapkan praktisi kuliner profesional terampil teknik pengolahan makanan nusantara maupun kontinental oriental, manajemen operasional dapur pastry bakery, serta industri catering bisnis.',
 '/images/jurusan-kuliner.jpg', '👨‍🍳', 3),
('tata-busana', 'Tata Busana', 'Fashion Design',
 'Berfokus menumbuhkan keahlian rancang mode fashion design drafting, teknik menjahit gaun kustom tingkat tinggi, pembuatan pola digital draping, serta kalkulasi industri garmen bisnis retail fesyen.',
 '/images/jurusan-tata-busana.jpg', '👗', 4),
('tjkt', 'Teknik Jaringan Komputer dan Telekomunikasi (TJKT)', 'Bidang Teknologi',
 'Membekali siswa kecakapan instalasi jaringan telekomunikasi, konfigurasi router Cisco/Mikrotik, cloud computing, cyber security dasar, serta pemeliharaan sistem transmisi nirkabel dan fiber optik.',
 '/images/jurusan-tjkt.jpg', '💻', 5);

INSERT INTO jurusan_materi (jurusan_id, materi, urutan) VALUES
(1, 'Operasional Front Office', 1),
(1, 'Manajemen Tata Graha (Housekeeping)', 2),
(1, 'Laundry & Dry Cleaning Service', 3),
(1, 'Komunikasi Bisnis Perhotelan', 4),
(2, 'Rias Wajah Khusus & Panggung', 1),
(2, 'Perawatan Kulit Wajah & Tubuh', 2),
(2, 'Pangkas Rambut & Penataan', 3),
(2, 'Manajemen Spa & Estetika', 4),
(3, 'Pengolahan & Penyajian Makanan', 1),
(3, 'Produksi Pastry & Bakery', 2),
(3, 'Tata Hidang (Food & Beverage)', 3),
(3, 'Pengelolaan Usaha Kuliner', 4),
(4, 'Desain Busana Kreatif (Sketsa)', 1),
(4, 'Pembuatan Pakaian Custom Made', 2),
(4, 'Teknologi Menjahit Garmen', 3),
(4, 'Analisis Tekstil & Bahan Kain', 4),
(5, 'Perencanaan & Penyusunan Jaringan', 1),
(5, 'Teknologi Layanan Jaringan Seluler', 2),
(5, 'Administrasi Infrastruktur Jaringan', 3),
(5, 'Sistem Keamanan Siber & IoT', 4);

-- ---------------------------------------------------------------------
-- Contoh Prestasi (silakan sesuaikan/ganti melalui panel admin nanti)
-- ---------------------------------------------------------------------
INSERT INTO prestasi (nama, bidang, keterangan, emoji, urutan) VALUES
('Juara 1 LKS Tingkat Provinsi', 'Kuliner', 'Diraih pada Lomba Kompetensi Siswa (LKS) Sulawesi Tenggara tahun 2025.', '🥇', 1),
('Juara 2 LKS Tingkat Provinsi', 'Tata Kecantikan dan Spa', 'Cabang lomba Beauty Therapy tingkat provinsi.', '🥈', 2),
('Juara Harapan 1 Tingkat Nasional', 'Teknik Jaringan Komputer', 'Kompetisi jaringan komputer antar SMK se-Indonesia.', '🏅', 3);

-- ---------------------------------------------------------------------
-- Contoh Berita
-- ---------------------------------------------------------------------
INSERT INTO berita (slug, judul, kategori, deskripsi, konten, penulis, is_published, published_at) VALUES
('spmb-2026-resmi-dibuka', 'Pendaftaran SPMB 2026 Resmi Dibuka', 'SPMB',
 'Pendaftaran Peserta Didik Baru SMK Negeri 3 Kendari tahun ajaran 2026/2027 telah resmi dibuka mulai 22 Juni 2026.',
 'Pendaftaran Peserta Didik Baru (SPMB) SMK Negeri 3 Kendari untuk tahun ajaran 2026/2027 telah resmi dibuka. Calon peserta didik dapat mendaftar secara online melalui halaman SPMB pada situs ini mulai tanggal 22 Juni hingga 1 Juli 2026.',
 'Panitia SPMB', 1, '2026-06-20 09:00:00'),
('kunjungan-industri-perhotelan', 'Kunjungan Industri Program Perhotelan ke Hotel Berbintang', 'Kegiatan',
 'Siswa jurusan Perhotelan melaksanakan kunjungan industri untuk memperdalam pemahaman operasional hotel bintang lima.',
 'Dalam rangka meningkatkan wawasan dan keterampilan siswa, program keahlian Perhotelan SMK Negeri 3 Kendari melaksanakan kunjungan industri ke salah satu hotel berbintang di Kota Kendari.',
 'Humas Sekolah', 1, '2026-05-10 10:00:00');

-- ---------------------------------------------------------------------
-- Contoh Galeri
-- ---------------------------------------------------------------------
INSERT INTO galeri (judul_kegiatan, link_foto, urutan) VALUES
('Praktik Tata Boga di Dapur Komersial', '/images/galeri-1.jpg', 1),
('Latihan Rutin Ekstrakurikuler Paskibra', '/images/galeri-2.jpg', 2),
('Praktik Jaringan Komputer di Laboratorium', '/images/galeri-3.jpg', 3);
