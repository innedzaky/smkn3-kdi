-- ============================================================
-- Migrasi: Pustaka Media (menu "Media" — Perpustakaan & Tambah File Media)
-- Jalankan di cPanel -> phpMyAdmin -> tab SQL, database gysuvsda_smk3dbase
-- Aman dijalankan berkali-kali (CREATE TABLE IF NOT EXISTS).
-- Tidak menghapus data yang sudah ada.
-- ============================================================

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
