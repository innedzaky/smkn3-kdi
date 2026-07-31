import "server-only";
import { query } from "@/lib/db";
import type {
  AgendaItem,
  Berita,
  GaleriItem,
  HalamanStatis,
  HeroSlide,
  Jurusan,
  JurusanSkill,
  JurusanChip,
  JurusanGaleriDetail,
  JurusanGuru,
  MenuItem,
  MenuTreeItem,
  Pengumuman,
  Prestasi,
  SiteSettings,
  StatistikHero,
} from "@/lib/types";
import {
  fallbackAgenda,
  fallbackBerita,
  fallbackGaleri,
  fallbackHeroSlides,
  fallbackJurusan,
  fallbackMenu,
  fallbackPengumuman,
  fallbackPrestasi,
  fallbackSiteSettings,
  fallbackStatistikHero,
} from "@/data/fallback";

/**
 * Semua fungsi di file ini mengambil data dari MySQL.
 * Jika koneksi database belum dikonfigurasi (misalnya saat pertama kali
 * menjalankan proyek), fungsi otomatis memakai data cadangan (fallback)
 * agar halaman tetap bisa dirender tanpa error.
 */

export async function getStatistikHero(): Promise<StatistikHero[]> {
  try {
    const rows = await query<StatistikHero>(
      "SELECT id, angka, label, urutan FROM statistik_hero ORDER BY urutan ASC"
    );
    return rows.length ? rows : fallbackStatistikHero;
  } catch {
    return fallbackStatistikHero;
  }
}

export async function getPengumumanAktif(): Promise<Pengumuman[]> {
  try {
    const rows = await query<Pengumuman>(
      "SELECT id, label, judul, lokasi, link_url, is_active FROM pengumuman WHERE is_active = 1 ORDER BY created_at DESC"
    );
    return rows.length ? rows : fallbackPengumuman;
  } catch {
    return fallbackPengumuman;
  }
}

export async function getAgenda(): Promise<AgendaItem[]> {
  try {
    const rows = await query<AgendaItem>(
      "SELECT id, tanggal, nama, lokasi, link_url, urutan FROM agenda ORDER BY urutan ASC"
    );
    return rows.length ? rows : fallbackAgenda;
  } catch {
    return fallbackAgenda;
  }
}

export async function getJurusan(): Promise<Jurusan[]> {
  try {
    const jurusanRows = await query<Jurusan>(
      "SELECT id, slug, nama, label_badge, deskripsi, hero_subtitle, gambar_url, icon, urutan, brosur_depan_url, brosur_belakang_url FROM jurusan ORDER BY urutan ASC"
    );
    if (!jurusanRows.length) return fallbackJurusan;

    const [materiRows, skillRows, chipRows, galeriRows, guruRows] = await Promise.all([
      query<{ jurusan_id: number; materi: string }>(
        "SELECT jurusan_id, materi FROM jurusan_materi ORDER BY urutan ASC"
      ),
      query<JurusanSkill>(
        "SELECT * FROM jurusan_skill ORDER BY urutan ASC, id ASC"
      ),
      query<JurusanChip>(
        "SELECT * FROM jurusan_chip ORDER BY urutan ASC, id ASC"
      ),
      query<JurusanGaleriDetail>(
        "SELECT * FROM jurusan_galeri_detail ORDER BY urutan ASC, id ASC"
      ),
      query<JurusanGuru>(
        "SELECT * FROM jurusan_guru ORDER BY urutan ASC, id ASC"
      ),
    ]);

    return jurusanRows.map((j) => ({
      ...j,
      materi: materiRows.filter((m) => m.jurusan_id === j.id).map((m) => m.materi),
      skills: skillRows.filter((s) => s.jurusan_id === j.id),
      fasilitas: chipRows
        .filter((c) => c.jurusan_id === j.id && c.kategori === "fasilitas")
        .map((c) => c.teks),
      karier: chipRows
        .filter((c) => c.jurusan_id === j.id && c.kategori === "karier")
        .map((c) => c.teks),
      kegiatan: galeriRows.filter((g) => g.jurusan_id === j.id && g.kategori === "kegiatan"),
      karya: galeriRows.filter((g) => g.jurusan_id === j.id && g.kategori === "karya"),
      guru: guruRows.filter((g) => g.jurusan_id === j.id),
    }));
  } catch {
    return fallbackJurusan;
  }
}

export async function getJurusanBySlug(slug: string): Promise<Jurusan | null> {
  const all = await getJurusan();
  return all.find((j) => j.slug === slug) ?? null;
}

export async function getPrestasi(): Promise<Prestasi[]> {
  try {
    const rows = await query<Prestasi>(
      "SELECT id, nama, bidang, keterangan, emoji, urutan FROM prestasi WHERE is_published = 1 ORDER BY urutan ASC, id DESC"
    );
    return rows.length ? rows : fallbackPrestasi;
  } catch {
    return fallbackPrestasi;
  }
}

async function attachTagsPublic(rows: Berita[]): Promise<Berita[]> {
  if (!rows.length) return rows;
  const ids = rows.map((r) => r.id);
  const placeholders = ids.map(() => "?").join(", ");
  const tagRows = await query<{ berita_id: number; nama: string }>(
    `SELECT bt.berita_id AS berita_id, t.nama AS nama
     FROM berita_tags bt
     JOIN tags t ON t.id = bt.tag_id
     WHERE bt.berita_id IN (${placeholders})
     ORDER BY t.nama ASC`,
    ids
  );
  return rows.map((r) => ({
    ...r,
    tags: tagRows.filter((t) => t.berita_id === r.id).map((t) => t.nama),
  }));
}

export async function getBerita(limit?: number): Promise<Berita[]> {
  try {
    const sql = limit
      ? "SELECT * FROM berita WHERE is_published = 1 AND published_at <= NOW() ORDER BY is_sticky DESC, published_at DESC LIMIT ?"
      : "SELECT * FROM berita WHERE is_published = 1 AND published_at <= NOW() ORDER BY is_sticky DESC, published_at DESC";
    const rows = await query<Berita>(sql, limit ? [limit] : []);
    if (!rows.length) return fallbackBerita;
    return await attachTagsPublic(rows);
  } catch {
    return fallbackBerita;
  }
}

export async function getBeritaBySlug(slug: string): Promise<Berita | null> {
  try {
    const rows = await query<Berita>(
      "SELECT * FROM berita WHERE slug = ? AND is_published = 1 LIMIT 1",
      [slug]
    );
    if (rows.length) {
      const [withTags] = await attachTagsPublic(rows);
      return withTags;
    }
    return fallbackBerita.find((b) => b.slug === slug) ?? null;
  } catch {
    return fallbackBerita.find((b) => b.slug === slug) ?? null;
  }
}

export async function getGaleri(): Promise<GaleriItem[]> {
  try {
    const rows = await query<GaleriItem>(
      "SELECT id, judul_kegiatan, link_foto, urutan FROM galeri WHERE is_published = 1 ORDER BY urutan ASC"
    );
    return rows.length ? rows : fallbackGaleri;
  } catch {
    return fallbackGaleri;
  }
}

export async function getHalamanBySlug(slug: string): Promise<HalamanStatis | null> {
  try {
    const rows = await query<HalamanStatis>(
      "SELECT * FROM halaman WHERE slug = ? AND is_published = 1 LIMIT 1",
      [slug]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function getHalamanPublished(): Promise<HalamanStatis[]> {
  try {
    return await query<HalamanStatis>(
      "SELECT * FROM halaman WHERE is_published = 1 ORDER BY judul ASC"
    );
  } catch {
    return [];
  }
}

/**
 * Ambil pengaturan situs (identitas & kontak sekolah, header, footer) dari
 * tabel key-value `pengaturan`. Kalau tabel belum ada / kosong (migrasi belum
 * dijalankan di hosting), otomatis pakai fallbackSiteSettings supaya Header
 * dan Footer tetap tampil normal seperti sebelumnya.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await query<{ opt_key: string; opt_value: string | null }>(
      "SELECT opt_key, opt_value FROM pengaturan"
    );
    if (!rows.length) return fallbackSiteSettings;
    const map = Object.fromEntries(rows.map((r) => [r.opt_key, r.opt_value ?? ""]));
    return { ...fallbackSiteSettings, ...map } as SiteSettings;
  } catch {
    return fallbackSiteSettings;
  }
}

/**
 * Ambil menu navigasi header, otomatis disusun jadi struktur pohon
 * (parent -> children) untuk dropdown. Kalau tabel belum ada / kosong,
 * pakai fallbackMenu supaya header tetap tampil seperti sebelumnya.
 */
export async function getMenu(): Promise<MenuTreeItem[]> {
  try {
    const rows = await query<MenuItem>(
      "SELECT id, label, url, parent_id, urutan, is_active FROM menu WHERE is_active = 1 ORDER BY urutan ASC, id ASC"
    );
    if (!rows.length) return fallbackMenu;
    const parents = rows.filter((r) => r.parent_id === null);
    return parents.map((p) => ({
      ...p,
      children: rows.filter((r) => r.parent_id === p.id),
    }));
  } catch {
    return fallbackMenu;
  }
}

/**
 * Ambil slide hero beranda (gambar & kalimat), otomatis pakai
 * fallbackHeroSlides kalau tabel `hero_slide` belum ada/kosong.
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const rows = await query<HeroSlide>(
      "SELECT id, badge, title, title_accent, deskripsi, gambar, urutan FROM hero_slide WHERE is_active = 1 ORDER BY urutan ASC, id ASC"
    );
    return rows.length ? rows : fallbackHeroSlides;
  } catch {
    return fallbackHeroSlides;
  }
}
