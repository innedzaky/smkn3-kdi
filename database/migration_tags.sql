-- =====================================================================
-- Migrasi: Tags untuk Postingan/Berita (terpisah dari Kategori)
-- Aman dijalankan berkali-kali — hanya membuat tabel jika belum ada.
-- Jalankan di: cPanel -> phpMyAdmin -> pilih database -> tab SQL
-- =====================================================================

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
