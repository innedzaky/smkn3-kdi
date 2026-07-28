-- =====================================================================
-- Migrasi: Tambah kolom brosur (halaman depan & belakang) ke tabel jurusan
-- Dipakai untuk menampilkan slider perbandingan brosur di halaman
-- /tata-busana (dan nantinya bisa dipakai jurusan lain juga).
-- Jalankan di: cPanel -> phpMyAdmin -> pilih database -> tab SQL
--
-- CATATAN: Jika muncul error "Duplicate column name", berarti migrasi
-- ini sudah pernah dijalankan sebelumnya — aman diabaikan.
-- =====================================================================

ALTER TABLE jurusan
  ADD COLUMN brosur_depan_url VARCHAR(500) NULL AFTER urutan,
  ADD COLUMN brosur_belakang_url VARCHAR(500) NULL AFTER brosur_depan_url;
