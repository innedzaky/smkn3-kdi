-- =====================================================================
-- Skema Database MySQL — Website SMK Negeri 3 Kendari
-- =====================================================================
-- Jalankan file ini pada database kosong, contoh:
--   mysql -u root -p smkn3_kdi < database/schema.sql
-- =====================================================================

CREATE DATABASE IF NOT EXISTS smkn3_kdi
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE smkn3_kdi;

-- ---------------------------------------------------------------------
-- Tabel: berita  (dulunya sheet "Berita" di Google Sheets)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS berita (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(191) NOT NULL UNIQUE,
  judul         VARCHAR(255) NOT NULL,
  kategori      VARCHAR(80)  NOT NULL DEFAULT 'Sekolah',
  deskripsi     VARCHAR(500) NOT NULL,
  konten        MEDIUMTEXT   NULL,
  gambar        VARCHAR(500) NULL,
  penulis       VARCHAR(120) NULL DEFAULT 'Admin Sekolah',
  is_published  TINYINT(1)   NOT NULL DEFAULT 1,
  published_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_berita_published (is_published, published_at)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabel: tags & berita_tags  (Tags untuk Postingan/Berita, terpisah dari Kategori)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tags (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nama        VARCHAR(80)  NOT NULL,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS berita_tags (
  berita_id   INT UNSIGNED NOT NULL,
  tag_id      INT UNSIGNED NOT NULL,
  PRIMARY KEY (berita_id, tag_id),
  FOREIGN KEY (berita_id) REFERENCES berita(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabel: prestasi  (dulunya sheet "Prestasi")
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS prestasi (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nama        VARCHAR(255) NOT NULL,
  bidang      VARCHAR(120) NOT NULL,
  keterangan  VARCHAR(500) NOT NULL,
  emoji       VARCHAR(20)  NOT NULL DEFAULT '🥇',
  urutan      INT          NOT NULL DEFAULT 0,
  is_published TINYINT(1)  NOT NULL DEFAULT 1,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_prestasi_urutan (urutan)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabel: galeri  (dulunya sheet "Galeri")
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS galeri (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  judul_kegiatan  VARCHAR(255) NOT NULL,
  link_foto       VARCHAR(500) NOT NULL,
  urutan          INT          NOT NULL DEFAULT 0,
  is_published    TINYINT(1)   NOT NULL DEFAULT 1,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_galeri_urutan (urutan)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabel: agenda  (jadwal SPMB / kegiatan sekolah)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agenda (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tanggal     VARCHAR(80)  NOT NULL,
  nama        VARCHAR(255) NOT NULL,
  lokasi      VARCHAR(255) NULL,
  link_url    VARCHAR(500) NULL,
  urutan      INT          NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_agenda_urutan (urutan)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabel: pengumuman  (banner pengumuman resmi)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pengumuman (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  label       VARCHAR(80)  NOT NULL DEFAULT 'PENTING',
  judul       VARCHAR(255) NOT NULL,
  lokasi      VARCHAR(255) NULL,
  link_url    VARCHAR(500) NULL,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabel: jurusan  (kompetensi keahlian / program studi)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS jurusan (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(80)  NOT NULL UNIQUE,
  nama          VARCHAR(150) NOT NULL,
  label_badge   VARCHAR(80)  NOT NULL,
  deskripsi     TEXT         NOT NULL,
  gambar_url    VARCHAR(500) NULL,
  icon          VARCHAR(10)  NOT NULL DEFAULT '🎓',
  urutan        INT          NOT NULL DEFAULT 0,
  brosur_depan_url    VARCHAR(500) NULL,
  brosur_belakang_url VARCHAR(500) NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS jurusan_materi (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  jurusan_id  INT UNSIGNED NOT NULL,
  materi      VARCHAR(255) NOT NULL,
  urutan      INT          NOT NULL DEFAULT 0,
  FOREIGN KEY (jurusan_id) REFERENCES jurusan(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabel: ppdb_pendaftar  (dulunya form -> Google Apps Script -> Sheets)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ppdb_pendaftar (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nama_lengkap    VARCHAR(80)  NOT NULL,
  asal_sekolah    VARCHAR(80)  NOT NULL,
  jurusan_pilihan VARCHAR(120) NOT NULL,
  whatsapp        VARCHAR(20)  NOT NULL,
  status          ENUM('baru','diverifikasi','lolos','ditolak') NOT NULL DEFAULT 'baru',
  ip_address      VARCHAR(64)  NULL,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ppdb_whatsapp (whatsapp),
  INDEX idx_ppdb_created (created_at)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabel: statistik_hero  (angka pada stats bar hero slider)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS statistik_hero (
  id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  angka   VARCHAR(20)  NOT NULL,
  label   VARCHAR(120) NOT NULL,
  urutan  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabel: users  (akun untuk login Panel Admin CMS)
-- ---------------------------------------------------------------------
-- ---------------------------------------------------------------------
-- Tabel: halaman  (Halaman Statis / page builder untuk konten teks biasa)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS halaman (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  judul        VARCHAR(200) NOT NULL,
  slug         VARCHAR(200) NOT NULL UNIQUE,
  deskripsi    VARCHAR(500) NULL,
  konten       LONGTEXT NULL,
  penulis      VARCHAR(100) NULL DEFAULT 'Admin Sekolah',
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(191) NOT NULL UNIQUE,
  username      VARCHAR(80)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('Administrator','Editor','Penulis','Staf') NOT NULL DEFAULT 'Editor',
  status        ENUM('Aktif','Nonaktif') NOT NULL DEFAULT 'Aktif',
  avatar        VARCHAR(500) NULL,
  last_login    DATETIME     NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabel: pengaturan  (key-value: identitas & kontak sekolah, header, footer)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pengaturan (
  opt_key     VARCHAR(100) NOT NULL PRIMARY KEY,
  opt_value   TEXT NULL,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT IGNORE INTO pengaturan (opt_key, opt_value) VALUES
  ('nama_sekolah', 'SMK Negeri 3 Kendari'),
  ('tagline', 'Unggul, Berakhlak Mulia, Profesional'),
  ('email', 'info@smkn3kdi.sch.id'),
  ('telepon', '0401-3191136'),
  ('whatsapp', ''),
  ('alamat', 'Jl. Budi Utomo No.1, Kadia, Kendari'),
  ('logo_type', 'image'),
  ('logo_url', '/images/logo.png'),
  ('logo_text', 'SMK Negeri 3 Kendari'),
  ('nav_cta_text', 'INFO SPMB'),
  ('nav_cta_link', '/spmb'),
  ('footer_about', 'SMK Negeri 3 Kendari adalah sekolah menengah kejuruan pusat keunggulan terkemuka di Kota Kendari yang berkomitmen melahirkan lulusan berkompeten di bidang pariwisata dan teknologi informasi.'),
  ('footer_akreditasi', '⭐ Akreditasi B'),
  ('sosmed_facebook', ''),
  ('sosmed_instagram', ''),
  ('sosmed_youtube', ''),
  ('sosmed_tiktok', ''),
  ('kepala_foto', '/images/kepala-sekolah.jpg'),
  ('kepala_judul', 'Selamat Datang di SMK Negeri 3 Kendari'),
  ('kepala_kutipan', 'Pendidikan bukan sekadar transfer ilmu, melainkan pembentukan karakter generasi penerus bangsa yang tangguh dan berintegritas.'),
  ('kepala_sambutan', 'Assalamualaikum Wr. Wb. Puji syukur ke hadirat Tuhan Yang Maha Esa atas limpahan rahmat dan karunia-Nya kepada kita semua. Selamat datang di website resmi SMK Negeri 3 Kendari.\n\nSMK Negeri 3 Kendari terus berkomitmen untuk memberikan layanan pendidikan terbaik yang berorientasi pada keunggulan akademik, pengembangan karakter, dan pembentukan generasi yang berjiwa Pancasila. Dengan didukung tenaga pendidik berpengalaman dan fasilitas modern, kami siap membimbing putra-putri bangsa menuju masa depan yang cerah.'),
  ('kepala_nama', 'Muhammad Kasman Said'),
  ('program_label', 'Kompetensi Bidang Keahlian'),
  ('program_judul', 'Program Unggulan'),
  ('program_deskripsi', 'Struktur kurikulum dirancang presisi berbasis kebutuhan industri masa kini. Silakan pilih tab jurusan di bawah untuk mempelajari materi pokok.');

-- ---------------------------------------------------------------------
-- Tabel: menu  (Menu Navigasi header — CRUD + dropdown)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menu (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  label       VARCHAR(120) NOT NULL,
  url         VARCHAR(500) NOT NULL,
  parent_id   INT UNSIGNED NULL,
  urutan      INT NOT NULL DEFAULT 0,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES menu(id) ON DELETE CASCADE,
  INDEX idx_menu_urutan (urutan)
) ENGINE=InnoDB;

-- Seed menu default (mengikuti NAV_LINKS/PROFIL_LINKS lama) — hanya sekali, saat tabel masih kosong
INSERT INTO menu (label, url, parent_id, urutan, is_active)
SELECT * FROM (SELECT 'Profil' AS label, '/#profil' AS url, NULL AS parent_id, 1 AS urutan, 1 AS is_active) t
WHERE NOT EXISTS (SELECT 1 FROM menu LIMIT 1);

INSERT INTO menu (label, url, parent_id, urutan, is_active)
SELECT 'Sejarah Sekolah', '/sejarah-smkn-3-kendari', id, 1, 1 FROM menu WHERE label = 'Profil' AND parent_id IS NULL
AND NOT EXISTS (SELECT 1 FROM menu WHERE label = 'Sejarah Sekolah');

INSERT INTO menu (label, url, parent_id, urutan, is_active)
SELECT 'Identitas Sekolah', '/identitas-sekolah', id, 2, 1 FROM menu WHERE label = 'Profil' AND parent_id IS NULL
AND NOT EXISTS (SELECT 1 FROM menu WHERE label = 'Identitas Sekolah');

INSERT INTO menu (label, url, parent_id, urutan, is_active)
SELECT 'Visi Misi', '/visi-dan-misi-smk-negeri-3-kendari', id, 3, 1 FROM menu WHERE label = 'Profil' AND parent_id IS NULL
AND NOT EXISTS (SELECT 1 FROM menu WHERE label = 'Visi Misi');

INSERT INTO menu (label, url, parent_id, urutan, is_active)
SELECT 'Galeri Kegiatan', '/galeri-kegiatan', id, 4, 1 FROM menu WHERE label = 'Profil' AND parent_id IS NULL
AND NOT EXISTS (SELECT 1 FROM menu WHERE label = 'Galeri Kegiatan');

INSERT INTO menu (label, url, parent_id, urutan, is_active)
SELECT * FROM (SELECT 'Program' AS label, '/#program' AS url, NULL AS parent_id, 2 AS urutan, 1 AS is_active) t
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE label = 'Program' AND parent_id IS NULL);

INSERT INTO menu (label, url, parent_id, urutan, is_active)
SELECT * FROM (SELECT 'Prestasi' AS label, '/#prestasi' AS url, NULL AS parent_id, 3 AS urutan, 1 AS is_active) t
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE label = 'Prestasi' AND parent_id IS NULL);

INSERT INTO menu (label, url, parent_id, urutan, is_active)
SELECT * FROM (SELECT 'Berita' AS label, '/#berita' AS url, NULL AS parent_id, 4 AS urutan, 1 AS is_active) t
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE label = 'Berita' AND parent_id IS NULL);

INSERT INTO menu (label, url, parent_id, urutan, is_active)
SELECT * FROM (SELECT 'Ekskul' AS label, '/#ekskul' AS url, NULL AS parent_id, 5 AS urutan, 1 AS is_active) t
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE label = 'Ekskul' AND parent_id IS NULL);

INSERT INTO menu (label, url, parent_id, urutan, is_active)
SELECT * FROM (SELECT 'Galeri' AS label, '/#galeri' AS url, NULL AS parent_id, 6 AS urutan, 1 AS is_active) t
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE label = 'Galeri' AND parent_id IS NULL);

INSERT INTO menu (label, url, parent_id, urutan, is_active)
SELECT * FROM (SELECT 'Kontak' AS label, '/#kontak' AS url, NULL AS parent_id, 7 AS urutan, 1 AS is_active) t
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE label = 'Kontak' AND parent_id IS NULL);

-- ---------------------------------------------------------------------
-- Tabel: hero_slide  (slide hero di beranda — gambar & kalimat bisa diedit admin)
-- ---------------------------------------------------------------------
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

-- Seed 5 slide default (sama persis dengan yang sebelumnya hardcode di src/data/fallback.ts)
-- Hanya berjalan sekali, saat tabel benar-benar masih kosong.
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

-- ---------------------------------------------------------------------
-- Tabel: media  (Pustaka Media — semua file yang diunggah lewat panel admin)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  file_name     VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NULL,
  url           VARCHAR(500) NOT NULL,
  mime_type     VARCHAR(100) NULL,
  size          INT UNSIGNED NULL,
  alt_text      VARCHAR(255) NULL,
  uploaded_by   INT UNSIGNED NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
