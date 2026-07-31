export interface Berita {
  id: number;
  slug: string;
  judul: string;
  kategori: string;
  deskripsi: string;
  konten: string | null;
  gambar: string | null;
  penulis: string | null;
  is_published: number;
  is_sticky: number;
  lock_modified_date: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export interface Tag {
  id: number;
  nama: string;
  slug: string;
}

export interface HalamanStatis {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string | null;
  konten: string | null;
  penulis: string | null;
  is_published: number;
  created_at: string;
  updated_at: string;
}

export interface Prestasi {
  id: number;
  nama: string;
  bidang: string;
  keterangan: string;
  emoji: string;
  urutan: number;
  is_published?: number;
}

export interface GaleriItem {
  id: number;
  judul_kegiatan: string;
  link_foto: string;
  urutan: number;
  is_published?: number;
}

export interface AgendaItem {
  id: number;
  tanggal: string;
  nama: string;
  lokasi: string | null;
  link_url: string | null;
  urutan: number;
}

export interface Pengumuman {
  id: number;
  label: string;
  judul: string;
  lokasi: string | null;
  link_url: string | null;
  is_active: number;
}

export interface JurusanSkill {
  id: number;
  jurusan_id: number;
  icon: string;
  judul: string;
  deskripsi: string | null;
  urutan: number;
}

export interface JurusanChip {
  id: number;
  jurusan_id: number;
  kategori: "fasilitas" | "karier";
  teks: string;
  urutan: number;
}

export interface JurusanGaleriDetail {
  id: number;
  jurusan_id: number;
  kategori: "kegiatan" | "karya";
  judul: string;
  foto: string;
  urutan: number;
}

export interface JurusanGuru {
  id: number;
  jurusan_id: number;
  nama: string;
  jabatan: string | null;
  foto: string | null;
  urutan: number;
}

export interface Jurusan {
  id: number;
  slug: string;
  nama: string;
  label_badge: string;
  deskripsi: string;
  hero_subtitle?: string | null;
  gambar_url: string | null;
  icon: string;
  urutan: number;
  materi?: string[];
  brosur_depan_url?: string | null;
  brosur_belakang_url?: string | null;
  skills?: JurusanSkill[];
  fasilitas?: string[];
  karier?: string[];
  kegiatan?: JurusanGaleriDetail[];
  karya?: JurusanGaleriDetail[];
  guru?: JurusanGuru[];
}

export interface SiteSettings {
  nama_sekolah: string;
  tagline: string;
  email: string;
  telepon: string;
  whatsapp: string;
  alamat: string;
  logo_type: "image" | "text" | string;
  logo_url: string;
  logo_text: string;
  nav_cta_text: string;
  nav_cta_link: string;
  footer_about: string;
  footer_akreditasi: string;
  footer_copyright_html: string;
  footer_alamat_html: string;
  sosmed_facebook: string;
  sosmed_instagram: string;
  sosmed_youtube: string;
  sosmed_tiktok: string;
  kepala_foto: string;
  kepala_judul: string;
  kepala_kutipan: string;
  kepala_sambutan: string;
  kepala_nama: string;
  program_label: string;
  program_judul: string;
  program_deskripsi: string;
}

export interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  title_accent: string;
  deskripsi: string;
  gambar: string;
  urutan: number;
  is_active?: number;
}

export interface MenuItem {
  id: number;
  label: string;
  url: string;
  parent_id: number | null;
  urutan: number;
  is_active: number;
}

export interface MenuTreeItem extends MenuItem {
  children: MenuItem[];
}

export interface StatistikHero {
  id: number;
  angka: string;
  label: string;
  urutan: number;
}

export interface MediaFile {
  id: number;
  file_name: string;
  original_name: string | null;
  url: string;
  mime_type: string | null;
  size: number | null;
  alt_text: string | null;
  uploaded_by: number | null;
  uploader_name?: string | null;
  created_at: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  username: string;
  role: "Administrator" | "Editor" | "Penulis" | "Staf";
  status: "Aktif" | "Nonaktif";
  avatar: string | null;
  last_login: string | null;
  created_at: string;
}

export interface PPDBFormData {
  nama: string;
  asal_sekolah: string;
  jurusan: string;
  whatsapp: string;
  _hp?: string; // honeypot anti-bot
}
