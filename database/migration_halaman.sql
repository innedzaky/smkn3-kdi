-- =====================================================================
-- Migrasi: Halaman Statis (page builder)
-- Aman dijalankan berkali-kali — hanya membuat tabel jika belum ada.
-- Tabel dibuat kosong; halaman baru dibuat lewat panel admin.
-- Jalankan di: cPanel -> phpMyAdmin -> pilih database -> tab SQL
-- =====================================================================

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
