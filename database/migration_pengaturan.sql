-- =====================================================================
-- Migrasi: Pengaturan (identitas & kontak sekolah, header, footer)
-- Aman dijalankan berkali-kali — hanya membuat tabel & mengisi baris
-- default jika belum ada (INSERT IGNORE berdasarkan primary key opt_key).
-- Jalankan di: cPanel -> phpMyAdmin -> pilih database -> tab SQL
-- =====================================================================

CREATE TABLE IF NOT EXISTS pengaturan (
  opt_key     VARCHAR(100) NOT NULL PRIMARY KEY,
  opt_value   TEXT NULL,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Nilai default ini SAMA PERSIS dengan yang sekarang tertulis langsung (hardcode)
-- di Header.tsx / Footer.tsx, supaya tampilan situs tidak berubah begitu migrasi
-- ini dijalankan. Anda bisa mengubahnya kapan saja lewat panel admin
-- (Pengaturan / Penampilan → Header / Penampilan → Footer).
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
