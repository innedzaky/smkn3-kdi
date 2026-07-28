-- =====================================================================
-- Migrasi: Menu Navigasi (CRUD + dropdown)
-- Aman dijalankan berkali-kali — tabel dibuat jika belum ada, dan baris
-- default hanya diisi SEKALI saat tabel benar-benar masih kosong (dicek
-- pakai NOT EXISTS), sehingga tidak akan menduplikasi data yang sudah
-- pernah Anda ubah lewat panel admin.
-- Jalankan di: cPanel -> phpMyAdmin -> pilih database -> tab SQL
-- =====================================================================

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

-- Seed menu default (mengikuti NAV_LINKS/PROFIL_LINKS yang sebelumnya hardcode
-- di Header.tsx), supaya tampilan header tidak berubah begitu menu ini
-- dijalankan pertama kali. Hanya berjalan jika tabel menu masih kosong.
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
