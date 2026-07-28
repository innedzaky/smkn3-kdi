-- =====================================================================
-- Migrasi: Hero Slide (slide hero di beranda — gambar & kalimat dikelola admin)
-- Aman dijalankan berkali-kali — tabel dibuat jika belum ada, dan baris
-- default hanya diisi SEKALI saat tabel benar-benar masih kosong.
-- Jalankan di: cPanel -> phpMyAdmin -> pilih database -> tab SQL
-- =====================================================================

CREATE TABLE IF NOT EXISTS hero_slide (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  badge         VARCHAR(120) NOT NULL,
  title         VARCHAR(200) NOT NULL,
  title_accent  VARCHAR(200) NOT NULL,
  deskripsi     VARCHAR(500) NOT NULL,
  gambar        VARCHAR(500) NOT NULL,
  urutan        INT NOT NULL DEFAULT 0,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_hero_slide_urutan (urutan)
) ENGINE=InnoDB;

-- Seed 5 slide default — sama persis dengan yang sekarang tertulis hardcode
-- di src/data/fallback.ts, supaya tampilan slider tidak berubah begitu
-- migrasi ini dijalankan.
INSERT INTO hero_slide (badge, title, title_accent, deskripsi, gambar, urutan, is_active)
SELECT
    'Perhotelan',
    'Unggul Mutu di Sektor',
    'Perhotelan Management',
    'Mencetak praktisi perhotelan mumpuni menguasai sistem Front Office, Housekeeping, dan pelayanan prima hospitality standar internasional.',
    '/images/hero-perhotelan.jpg',
    1, 1
WHERE NOT EXISTS (SELECT 1 FROM hero_slide LIMIT 1);

INSERT INTO hero_slide (badge, title, title_accent, deskripsi, gambar, urutan, is_active)
SELECT
    'Tata Kecantikan dan Spa',
    'Kreativitas Estetika',
    'Tata Kecantikan dan Spa',
    'Membentuk profesional muda handal yang siap berkarir secara mandiri maupun pada korporasi spa dan salon kecantikan papan atas.',
    '/images/hero-kecantikan.jpg',
    2, 1
WHERE NOT EXISTS (SELECT 1 FROM hero_slide WHERE badge = 'Tata Kecantikan dan Spa');

INSERT INTO hero_slide (badge, title, title_accent, deskripsi, gambar, urutan, is_active)
SELECT
    'Kuliner',
    'Menuju Praktisi Kuliner',
    'Bertaraf Internasional',
    'Program Kuliner melatih siswa langsung dengan fasilitas laboratorium dapur modern penunjang standar industri kuliner global.',
    '/images/hero-kuliner.jpg',
    3, 1
WHERE NOT EXISTS (SELECT 1 FROM hero_slide WHERE badge = 'Kuliner');

INSERT INTO hero_slide (badge, title, title_accent, deskripsi, gambar, urutan, is_active)
SELECT
    'Tata Busana',
    'Inovasi Kreatif Rancang',
    'Karya Busana Terbaik',
    'Siswa dibimbing menguasai pembuatan pola pakaian, ilustrasi desain fesyen komersial, hingga manajemen bisnis clothing brand siap pakai.',
    '/images/hero-tata-busana.jpg',
    4, 1
WHERE NOT EXISTS (SELECT 1 FROM hero_slide WHERE badge = 'Tata Busana');

INSERT INTO hero_slide (badge, title, title_accent, deskripsi, gambar, urutan, is_active)
SELECT
    'Teknik Jaringan Komputer & Telekomunikasi',
    'Penguasaan Digital',
    'Teknik Jaringan Komputer & Telekomunikasi',
    'Membekali siswa dengan skill mutakhir sistem administrasi server, instalasi infrastruktur jaringan telekomunikasi, dan cloud computing.',
    '/images/hero-tjkt.jpg',
    5, 1
WHERE NOT EXISTS (SELECT 1 FROM hero_slide WHERE badge = 'Teknik Jaringan Komputer & Telekomunikasi');
