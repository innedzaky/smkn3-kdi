import type {
  AgendaItem,
  Berita,
  GaleriItem,
  HeroSlide,
  Jurusan,
  MenuTreeItem,
  Pengumuman,
  Prestasi,
  SiteSettings,
  StatistikHero,
} from "@/lib/types";

/**
 * Data cadangan ini HANYA dipakai sebagai fallback bila koneksi ke MySQL
 * gagal (misalnya saat pertama kali menjalankan proyek sebelum database
 * disiapkan). Begitu database terhubung, seluruh konten berikut diganti
 * otomatis oleh data asli dari MySQL. Lihat src/lib/queries.ts.
 */

export const fallbackSiteSettings: SiteSettings = {
  nama_sekolah: "SMK Negeri 3 Kendari",
  tagline: "Unggul, Berakhlak Mulia, Profesional",
  email: "info@smkn3kdi.sch.id",
  telepon: "0401-3191136",
  whatsapp: "",
  alamat: "Jl. Budi Utomo No.1, Kadia, Kendari",
  logo_type: "image",
  logo_url: "/images/logo.png",
  logo_text: "SMK Negeri 3 Kendari",
  nav_cta_text: "INFO SPMB",
  nav_cta_link: "/spmb",
  footer_about:
    "SMK Negeri 3 Kendari adalah sekolah menengah kejuruan pusat keunggulan terkemuka di Kota Kendari yang berkomitmen melahirkan lulusan berkompeten di bidang pariwisata dan teknologi informasi.",
  footer_akreditasi: "⭐ Akreditasi B",
  sosmed_facebook: "",
  sosmed_instagram: "",
  sosmed_youtube: "",
  sosmed_tiktok: "",
  kepala_foto: "/images/kepala-sekolah.jpg",
  kepala_judul: "Selamat Datang di SMK Negeri 3 Kendari",
  kepala_kutipan:
    "Pendidikan bukan sekadar transfer ilmu, melainkan pembentukan karakter generasi penerus bangsa yang tangguh dan berintegritas.",
  kepala_sambutan:
    "Assalamualaikum Wr. Wb. Puji syukur ke hadirat Tuhan Yang Maha Esa atas limpahan rahmat dan karunia-Nya kepada kita semua. Selamat datang di website resmi SMK Negeri 3 Kendari.\n\nSMK Negeri 3 Kendari terus berkomitmen untuk memberikan layanan pendidikan terbaik yang berorientasi pada keunggulan akademik, pengembangan karakter, dan pembentukan generasi yang berjiwa Pancasila. Dengan didukung tenaga pendidik berpengalaman dan fasilitas modern, kami siap membimbing putra-putri bangsa menuju masa depan yang cerah.",
  kepala_nama: "Muhammad Kasman Said",
  program_label: "Kompetensi Bidang Keahlian",
  program_judul: "Program Unggulan",
  program_deskripsi:
    "Struktur kurikulum dirancang presisi berbasis kebutuhan industri masa kini. Silakan pilih tab jurusan di bawah untuk mempelajari materi pokok.",
};

/** Struktur menu header default — dipakai kalau tabel `menu` kosong/gagal diakses. */
export const fallbackMenu: MenuTreeItem[] = [
  {
    id: -1,
    label: "Profil",
    url: "/#profil",
    parent_id: null,
    urutan: 1,
    is_active: 1,
    children: [
      { id: -11, label: "Sejarah Sekolah", url: "/sejarah-smkn-3-kendari", parent_id: -1, urutan: 1, is_active: 1 },
      { id: -12, label: "Identitas Sekolah", url: "/identitas-sekolah", parent_id: -1, urutan: 2, is_active: 1 },
      { id: -13, label: "Visi Misi", url: "/visi-dan-misi-smk-negeri-3-kendari", parent_id: -1, urutan: 3, is_active: 1 },
      { id: -14, label: "Galeri Kegiatan", url: "/galeri-kegiatan", parent_id: -1, urutan: 4, is_active: 1 },
    ],
  },
  { id: -2, label: "Program", url: "/#program", parent_id: null, urutan: 2, is_active: 1, children: [] },
  { id: -3, label: "Prestasi", url: "/#prestasi", parent_id: null, urutan: 3, is_active: 1, children: [] },
  { id: -4, label: "Berita", url: "/#berita", parent_id: null, urutan: 4, is_active: 1, children: [] },
  { id: -5, label: "Ekskul", url: "/#ekskul", parent_id: null, urutan: 5, is_active: 1, children: [] },
  { id: -6, label: "Galeri", url: "/#galeri", parent_id: null, urutan: 6, is_active: 1, children: [] },
  { id: -7, label: "Kontak", url: "/#kontak", parent_id: null, urutan: 7, is_active: 1, children: [] },
];

export const fallbackStatistikHero: StatistikHero[] = [
  { id: 1, angka: "5", label: "Kompetensi Keahlian", urutan: 1 },
  { id: 2, angka: "1.200+", label: "Siswa Aktif", urutan: 2 },
  { id: 3, angka: "95%", label: "Terserap Industri", urutan: 3 },
  { id: 4, angka: "✓", label: "Pusat Keunggulan Nasional", urutan: 4 },
];

export const fallbackPengumuman: Pengumuman[] = [
  {
    id: 1,
    label: "INFO",
    judul:
      "Pendaftaran Peserta Didik Baru (SPMB) Tahun Ajaran 2026/2027 telah resmi ditutup. Terima kasih atas antusiasme seluruh calon peserta didik.",
    lokasi: "Lihat jadwal & arsip informasi SPMB 2026",
    link_url: "/spmb",
    is_active: 1,
  },
];

export const fallbackAgenda: AgendaItem[] = [
  { id: 1, tanggal: "22 Juni - 1 Juli 2026", nama: "Pendaftaran SPMB", lokasi: "Online (24 jam)", link_url: "/spmb", urutan: 1 },
  { id: 2, tanggal: "22 Juni - 1 Juli 2026", nama: "Verifikasi Berkas / Data Pendaftaran Online", lokasi: "SMK Negeri 3 Kendari (09.00 - 16.00)", link_url: null, urutan: 2 },
  { id: 3, tanggal: "22 Juni - 1 Juli 2026", nama: "Tes Khusus Buta Warna (tidak memiliki SKD)", lokasi: "SMK Negeri 3 Kendari (09.00 - 16.00)", link_url: null, urutan: 3 },
  { id: 4, tanggal: "22 Juni - 1 Juli 2026", nama: "Proses Seleksi SPMB Offline", lokasi: "SMK Negeri 3 Kendari (09.00 - 16.00)", link_url: null, urutan: 4 },
  { id: 5, tanggal: "3 Juli 2026", nama: "Pengumuman", lokasi: "SMK Negeri 3 Kendari Online/offline (10.00)", link_url: null, urutan: 5 },
  { id: 6, tanggal: "6-8 Juli 2026", nama: "Daftar Ulang", lokasi: "SMK Negeri 3 Kendari (09.00 - 16.00)", link_url: null, urutan: 6 },
];

export const fallbackJurusan: Jurusan[] = [
  {
    id: 1,
    slug: "perhotelan",
    nama: "Perhotelan",
    label_badge: "Hospitality",
    deskripsi:
      "Mencetak praktisi perhotelan mumpuni menguasai sistem Front Office resepsionis, Housekeeping manajemen kebersihan tata graha kamar, laundry operations, serta pelayanan prima hospitality bintang lima.",
    gambar_url:
      "/images/jurusan-perhotelan.jpg",
    icon: "🏨",
    urutan: 1,
    materi: [
      "Operasional Front Office",
      "Manajemen Tata Graha (Housekeeping)",
      "Laundry & Dry Cleaning Service",
      "Komunikasi Bisnis Perhotelan",
    ],
  },
  {
    id: 2,
    slug: "tata-kecantikan-dan-spa",
    nama: "Tata Kecantikan dan Spa",
    label_badge: "Tata Kecantikan",
    deskripsi:
      "Pembelajaran komprehensif teknik pemangkasan rambut modis, perawatan wajah klinis estetika, make up artis (MUA), perawatan refleksi, serta manajemen pengelolaan spa modern.",
    gambar_url:
      "/images/jurusan-kecantikan.jpg",
    icon: "💄",
    urutan: 2,
    materi: [
      "Rias Wajah Khusus & Panggung",
      "Perawatan Kulit Wajah & Tubuh",
      "Pangkas Rambut & Penataan",
      "Manajemen Spa & Estetika",
    ],
  },
  {
    id: 3,
    slug: "kuliner",
    nama: "Kuliner",
    label_badge: "Sektor Kuliner",
    deskripsi:
      "Menyiapkan praktisi kuliner profesional terampil teknik pengolahan makanan nusantara maupun kontinental oriental, manajemen operasional dapur pastry bakery, serta industri catering bisnis.",
    gambar_url:
      "/images/jurusan-kuliner.jpg",
    icon: "👨‍🍳",
    urutan: 3,
    materi: [
      "Pengolahan & Penyajian Makanan",
      "Produksi Pastry & Bakery",
      "Tata Hidang (Food & Beverage)",
      "Pengelolaan Usaha Kuliner",
    ],
  },
  {
    id: 4,
    slug: "tata-busana",
    nama: "Tata Busana",
    label_badge: "Fashion Design",
    deskripsi:
      "Berfokus menumbuhkan keahlian rancang mode fashion design drafting, teknik menjahit gaun kustom tingkat tinggi, pembuatan pola digital draping, serta kalkulasi industri garmen bisnis retail fesyen.",
    gambar_url:
      "/images/jurusan-tata-busana.jpg",
    icon: "👗",
    urutan: 4,
    materi: [
      "Desain Busana Kreatif (Sketsa)",
      "Pembuatan Pakaian Custom Made",
      "Teknologi Menjahit Garmen",
      "Analisis Tekstil & Bahan Kain",
    ],
  },
  {
    id: 5,
    slug: "tjkt",
    nama: "Teknik Jaringan Komputer dan Telekomunikasi (TJKT)",
    label_badge: "Bidang Teknologi",
    deskripsi:
      "Membekali siswa kecakapan instalasi jaringan telekomunikasi, konfigurasi router Cisco/Mikrotik, cloud computing, cyber security dasar, serta pemeliharaan sistem transmisi nirkabel dan fiber optik.",
    gambar_url:
      "/images/jurusan-tjkt.jpg",
    icon: "💻",
    urutan: 5,
    materi: [
      "Perencanaan & Penyusunan Jaringan",
      "Teknologi Layanan Jaringan Seluler",
      "Administrasi Infrastruktur Jaringan",
      "Sistem Keamanan Siber & IoT",
    ],
  },
];

export const fallbackPrestasi: Prestasi[] = [
  { id: 1, nama: "Juara 1 LKS Tingkat Provinsi", bidang: "Kuliner", keterangan: "Diraih pada Lomba Kompetensi Siswa (LKS) Sulawesi Tenggara tahun 2025.", emoji: "🥇", urutan: 1 },
  { id: 2, nama: "Juara 2 LKS Tingkat Provinsi", bidang: "Tata Kecantikan dan Spa", keterangan: "Cabang lomba Beauty Therapy tingkat provinsi.", emoji: "🥈", urutan: 2 },
  { id: 3, nama: "Juara Harapan 1 Tingkat Nasional", bidang: "Teknik Jaringan Komputer", keterangan: "Kompetisi jaringan komputer antar SMK se-Indonesia.", emoji: "🏅", urutan: 3 },
];

export const fallbackBerita: Berita[] = [
  {
    id: 1,
    slug: "spmb-2026-resmi-dibuka",
    judul: "Pendaftaran SPMB 2026 Resmi Dibuka",
    kategori: "SPMB",
    deskripsi:
      "Pendaftaran Peserta Didik Baru SMK Negeri 3 Kendari tahun ajaran 2026/2027 telah resmi dibuka mulai 22 Juni 2026.",
    konten:
      "Pendaftaran Peserta Didik Baru (SPMB) SMK Negeri 3 Kendari untuk tahun ajaran 2026/2027 telah resmi dibuka. Calon peserta didik dapat mendaftar secara online melalui halaman SPMB pada situs ini mulai tanggal 22 Juni hingga 1 Juli 2026.",
    gambar: null,
    penulis: "Panitia SPMB",
    is_published: 1,
    published_at: "2026-06-20 09:00:00",
    created_at: "2026-06-20 09:00:00",
    updated_at: "2026-06-20 09:00:00",
  },
  {
    id: 2,
    slug: "kunjungan-industri-perhotelan",
    judul: "Kunjungan Industri Program Perhotelan ke Hotel Berbintang",
    kategori: "Kegiatan",
    deskripsi:
      "Siswa jurusan Perhotelan melaksanakan kunjungan industri untuk memperdalam pemahaman operasional hotel bintang lima.",
    konten:
      "Dalam rangka meningkatkan wawasan dan keterampilan siswa, program keahlian Perhotelan SMK Negeri 3 Kendari melaksanakan kunjungan industri ke salah satu hotel berbintang di Kota Kendari.",
    gambar: null,
    penulis: "Humas Sekolah",
    is_published: 1,
    published_at: "2026-05-10 10:00:00",
    created_at: "2026-05-10 10:00:00",
    updated_at: "2026-05-10 10:00:00",
  },
];

export const fallbackGaleri: GaleriItem[] = [
  { id: 1, judul_kegiatan: "Praktik Tata Boga di Dapur Komersial", link_foto: "/images/galeri-1.jpg", urutan: 1 },
  { id: 2, judul_kegiatan: "Latihan Rutin Ekstrakurikuler Paskibra", link_foto: "/images/galeri-2.jpg", urutan: 2 },
  { id: 3, judul_kegiatan: "Praktik Jaringan Komputer di Laboratorium", link_foto: "/images/galeri-3.jpg", urutan: 3 },
];

export const ekskulList = [
  { icon: "🚑", nama: "PMR" },
  { icon: "🥋", nama: "Pramuka" },
  { icon: "🎖️", nama: "Paskibra" },
  { icon: "🏹", nama: "Memanah" },
  { icon: "⚔️", nama: "Silat" },
  { icon: "💃", nama: "Modern and Traditional Dance" },
  { icon: "🥋", nama: "Taekwondo" },
  { icon: "⚽", nama: "Futsal" },
  { icon: "🏀", nama: "Basket" },
  { icon: "🏐", nama: "Volly" },
];

export const fasilitasList = [
  { icon: "🏨", judul: "Mock-Up Kamar Hotel", deskripsi: "Kamar simulasi front office reception and housekeeping standar penginapan komersial." },
  { icon: "💄", judul: "Salon Estetika Klinis & Spa", deskripsi: "Ruang salon praktek lengkap penunjang pembelajaran kecantikan rambut, kulit, dan perawatan relaksasi tubuh." },
  { icon: "👨‍🍳", judul: "Dapur Komersial", deskripsi: "Fasilitas Kitchen Studio standar industri hotel bagi pengolahan makanan masal kelas kuliner." },
  { icon: "🧵", judul: "Workshop Menjahit Industri", deskripsi: "Ruang produksi konveksi yang dipersenjatai deretan mesin jahit elektrik industri." },
  { icon: "💻", judul: "Lab Sistem Telekomunikasi", deskripsi: "Laboratorium khusus perakitan, jaringan komputer, serta penataan infrastruktur telekomunikasi." },
  { icon: "📚", judul: "Perpustakaan Digital", deskripsi: "Akses perpustakaan modern penunjang literasi kejuruan buku digital siswa." },
];

export const fallbackHeroSlides: HeroSlide[] = [
  {
    id: 1,
    badge: "Perhotelan",
    title: "Unggul Mutu di Sektor",
    title_accent: "Perhotelan Management",
    deskripsi:
      "Mencetak praktisi perhotelan mumpuni menguasai sistem Front Office, Housekeeping, dan pelayanan prima hospitality standar internasional.",
    gambar: "/images/hero-perhotelan.jpg",
    urutan: 1,
  },
  {
    id: 2,
    badge: "Tata Kecantikan dan Spa",
    title: "Kreativitas Estetika",
    title_accent: "Tata Kecantikan dan Spa",
    deskripsi:
      "Membentuk profesional muda handal yang siap berkarir secara mandiri maupun pada korporasi spa dan salon kecantikan papan atas.",
    gambar: "/images/hero-kecantikan.jpg",
    urutan: 2,
  },
  {
    id: 3,
    badge: "Kuliner",
    title: "Menuju Praktisi Kuliner",
    title_accent: "Bertaraf Internasional",
    deskripsi:
      "Program Kuliner melatih siswa langsung dengan fasilitas laboratorium dapur modern penunjang standar industri kuliner global.",
    gambar: "/images/hero-kuliner.jpg",
    urutan: 3,
  },
  {
    id: 4,
    badge: "Tata Busana",
    title: "Inovasi Kreatif Rancang",
    title_accent: "Karya Busana Terbaik",
    deskripsi:
      "Siswa dibimbing menguasai pembuatan pola pakaian, ilustrasi desain fesyen komersial, hingga manajemen bisnis clothing brand siap pakai.",
    gambar: "/images/hero-tata-busana.jpg",
    urutan: 4,
  },
  {
    id: 5,
    badge: "Teknik Jaringan Komputer & Telekomunikasi",
    title: "Penguasaan Digital",
    title_accent: "Teknik Jaringan Komputer & Telekomunikasi",
    deskripsi:
      "Membekali siswa dengan skill mutakhir sistem administrasi server, instalasi infrastruktur jaringan telekomunikasi, dan cloud computing.",
    gambar: "/images/hero-tjkt.jpg",
    urutan: 5,
  },
];
