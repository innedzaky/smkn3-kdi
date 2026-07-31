-- Migrasi: tambah kolom untuk fitur panel "Pengaturan Publikasi" ala WordPress
-- (Status/Jadwal Publish memakai kolom is_published & published_at yang sudah ada,
-- jadi hanya 2 kolom baru berikut yang perlu ditambahkan)
--
-- Cara pakai: jalankan file ini di HeidiSQL terhadap database `smkn3_kdi`
-- (klik database aktif -> File -> Load SQL file... -> pilih file ini -> Execute/F9)

ALTER TABLE `berita`
  ADD COLUMN `is_sticky` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_published`,
  ADD COLUMN `lock_modified_date` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_sticky`;
