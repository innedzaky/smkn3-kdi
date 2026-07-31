import "server-only";
import { revalidatePath } from "next/cache";
import { query, pool } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";

/** Kosongkan cache ISR seluruh situs publik (semua halaman yang pakai
 *  `export const revalidate = 60`) supaya perubahan dari admin langsung
 *  tampil di kunjungan berikutnya, tanpa perlu menunggu jendela 60 detik. */
function revalidatePublicSite() {
  revalidatePath("/", "layout");
}

/** Ubah string datetime dari <input type="datetime-local"> (mis. "2026-08-01T10:00")
 *  atau ISO string, menjadi format MySQL "YYYY-MM-DD HH:mm:ss". Kembalikan waktu
 *  sekarang kalau input kosong/tidak valid. */
function toMysqlDatetime(v?: string | null): string {
  if (!v) return new Date().toISOString().slice(0, 19).replace("T", " ");
  const d = new Date(v);
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 19).replace("T", " ");
  return d.toISOString().slice(0, 19).replace("T", " ");
}
import type {
  AdminUser,
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
  MediaFile,
  MenuItem,
  Pengumuman,
  Prestasi,
  SiteSettings,
  Tag,
} from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Dashboard                                                          */
/* ------------------------------------------------------------------ */

export async function getDashboardStats() {
  const [berita, prestasi, galeri, agenda, pengumuman, jurusan, users] =
    await Promise.all([
      query<{ total: number }>("SELECT COUNT(*) AS total FROM berita"),
      query<{ total: number }>("SELECT COUNT(*) AS total FROM prestasi"),
      query<{ total: number }>("SELECT COUNT(*) AS total FROM galeri"),
      query<{ total: number }>("SELECT COUNT(*) AS total FROM agenda"),
      query<{ total: number }>(
        "SELECT COUNT(*) AS total FROM pengumuman WHERE is_active = 1"
      ),
      query<{ total: number }>("SELECT COUNT(*) AS total FROM jurusan"),
      query<{ total: number }>("SELECT COUNT(*) AS total FROM users"),
    ]);

  const beritaTerbaru = await query<Berita>(
    "SELECT * FROM berita ORDER BY created_at DESC LIMIT 6"
  );

  return {
    totalBerita: berita[0]?.total ?? 0,
    totalPrestasi: prestasi[0]?.total ?? 0,
    totalGaleri: galeri[0]?.total ?? 0,
    totalAgenda: agenda[0]?.total ?? 0,
    totalPengumumanAktif: pengumuman[0]?.total ?? 0,
    totalJurusan: jurusan[0]?.total ?? 0,
    totalUsers: users[0]?.total ?? 0,
    beritaTerbaru,
  };
}

/* ------------------------------------------------------------------ */
/* Berita (Postingan)                                                 */
/* ------------------------------------------------------------------ */

export async function adminGetBerita(): Promise<Berita[]> {
  const rows = await query<Berita>("SELECT * FROM berita ORDER BY created_at DESC");
  return attachTagsToBerita(rows);
}

export async function adminGetBeritaById(id: number): Promise<Berita | null> {
  const rows = await query<Berita>("SELECT * FROM berita WHERE id = ? LIMIT 1", [id]);
  if (!rows[0]) return null;
  const [withTags] = await attachTagsToBerita(rows);
  return withTags;
}

export async function adminCreateBerita(data: Partial<Berita>) {
  const result: any = await query(
    `INSERT INTO berita (slug, judul, kategori, deskripsi, konten, gambar, penulis, is_published, is_sticky, lock_modified_date, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.slug,
      data.judul,
      data.kategori || "Sekolah",
      data.deskripsi,
      data.konten || null,
      data.gambar || null,
      data.penulis || "Admin Sekolah",
      data.is_published ? 1 : 0,
      data.is_sticky ? 1 : 0,
      data.lock_modified_date ? 1 : 0,
      toMysqlDatetime(data.published_at),
    ]
  );
  const beritaId: number = result.insertId;
  await syncBeritaTags(beritaId, data.tags);
  revalidatePublicSite();
}

export async function adminUpdateBerita(id: number, data: Partial<Berita>) {
  const params: any[] = [
    data.slug,
    data.judul,
    data.kategori || "Sekolah",
    data.deskripsi,
    data.konten || null,
    data.gambar || null,
    data.penulis || "Admin Sekolah",
    data.is_published ? 1 : 0,
    data.is_sticky ? 1 : 0,
    data.lock_modified_date ? 1 : 0,
    toMysqlDatetime(data.published_at),
  ];

  // "Lock Modified Date" aktif -> pertahankan updated_at lama, jangan biarkan
  // trigger `ON UPDATE current_timestamp()` di kolom itu menimpanya.
  let updatedAtClause = "";
  if (data.lock_modified_date) {
    const existing = await query<{ updated_at: string }>(
      "SELECT updated_at FROM berita WHERE id = ? LIMIT 1",
      [id]
    );
    if (existing[0]?.updated_at) {
      updatedAtClause = ", updated_at = ?";
      params.push(existing[0].updated_at);
    }
  }
  params.push(id);

  await query(
    `UPDATE berita SET slug=?, judul=?, kategori=?, deskripsi=?, konten=?, gambar=?, penulis=?, is_published=?, is_sticky=?, lock_modified_date=?, published_at=?${updatedAtClause}
     WHERE id = ?`,
    params
  );
  await syncBeritaTags(id, data.tags);
  revalidatePublicSite();
}

export async function adminDeleteBerita(id: number) {
  await query("DELETE FROM berita WHERE id = ?", [id]);
  revalidatePublicSite();
}

export async function adminGetKategoriBerita() {
  return query<{ kategori: string; total: number }>(
    "SELECT kategori, COUNT(*) AS total FROM berita GROUP BY kategori ORDER BY kategori ASC"
  );
}

export async function adminRenameKategoriBerita(oldName: string, newName: string) {
  await query("UPDATE berita SET kategori = ? WHERE kategori = ?", [newName, oldName]);
  revalidatePublicSite();
}

/* ------------------------------------------------------------------ */
/* Tags (Postingan) — terpisah dari Kategori, relasi many-to-many      */
/* ------------------------------------------------------------------ */

function slugifyTag(nama: string): string {
  return nama
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Terima input tags dari form: array string, atau string dipisah koma. */
function normalizeTagNames(input?: string[] | string): string[] {
  if (!input) return [];
  const raw = Array.isArray(input) ? input : input.split(",");
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of raw) {
    const nama = t.trim();
    if (!nama) continue;
    const key = nama.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(nama);
  }
  return out;
}

/** Pastikan setiap nama tag ada di tabel `tags`, kembalikan id-nya. */
async function upsertTagsByName(names: string[]): Promise<number[]> {
  const ids: number[] = [];
  for (const nama of names) {
    const slug = slugifyTag(nama);
    await query(
      `INSERT INTO tags (nama, slug) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE nama = nama`,
      [nama, slug]
    );
    const rows = await query<{ id: number }>("SELECT id FROM tags WHERE slug = ? LIMIT 1", [slug]);
    if (rows[0]) ids.push(rows[0].id);
  }
  return ids;
}

/** Sinkronkan relasi berita_tags sesuai daftar nama tag terbaru dari form. */
async function syncBeritaTags(beritaId: number, tagsInput?: string[] | string) {
  const names = normalizeTagNames(tagsInput);
  await query("DELETE FROM berita_tags WHERE berita_id = ?", [beritaId]);
  if (!names.length) return;
  const tagIds = await upsertTagsByName(names);
  if (!tagIds.length) return;
  const values = tagIds.map(() => "(?, ?)").join(", ");
  const params = tagIds.flatMap((tagId) => [beritaId, tagId]);
  await query(`INSERT IGNORE INTO berita_tags (berita_id, tag_id) VALUES ${values}`, params);
}

/** Tempelkan array nama tag ke tiap baris berita (untuk tampilan admin). */
async function attachTagsToBerita(rows: Berita[]): Promise<Berita[]> {
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

export async function adminGetTags(): Promise<(Tag & { total: number })[]> {
  return query<Tag & { total: number }>(
    `SELECT t.id, t.nama, t.slug, COUNT(bt.berita_id) AS total
     FROM tags t
     LEFT JOIN berita_tags bt ON bt.tag_id = t.id
     GROUP BY t.id, t.nama, t.slug
     ORDER BY t.nama ASC`
  );
}

export async function adminRenameTag(id: number, newName: string) {
  const nama = newName.trim();
  if (!nama) throw new Error("Nama tag tidak boleh kosong");
  const slug = slugifyTag(nama);
  await query("UPDATE tags SET nama = ?, slug = ? WHERE id = ?", [nama, slug, id]);
}

export async function adminDeleteTag(id: number) {
  await query("DELETE FROM tags WHERE id = ?", [id]);
}

/* ------------------------------------------------------------------ */
/* Agenda                                                             */
/* ------------------------------------------------------------------ */

export async function adminGetAgenda(): Promise<AgendaItem[]> {
  return query<AgendaItem>("SELECT * FROM agenda ORDER BY urutan ASC, id DESC");
}

export async function adminCreateAgenda(data: Partial<AgendaItem>) {
  await query(
    "INSERT INTO agenda (tanggal, nama, lokasi, link_url, urutan) VALUES (?, ?, ?, ?, ?)",
    [data.tanggal, data.nama, data.lokasi || null, data.link_url || null, data.urutan || 0]
  );
  revalidatePublicSite();
}

export async function adminUpdateAgenda(id: number, data: Partial<AgendaItem>) {
  await query(
    "UPDATE agenda SET tanggal=?, nama=?, lokasi=?, link_url=?, urutan=? WHERE id = ?",
    [data.tanggal, data.nama, data.lokasi || null, data.link_url || null, data.urutan || 0, id]
  );
  revalidatePublicSite();
}

export async function adminDeleteAgenda(id: number) {
  await query("DELETE FROM agenda WHERE id = ?", [id]);
  revalidatePublicSite();
}

/* ------------------------------------------------------------------ */
/* Pengumuman                                                         */
/* ------------------------------------------------------------------ */

export async function adminGetPengumuman(): Promise<Pengumuman[]> {
  return query<Pengumuman>("SELECT * FROM pengumuman ORDER BY created_at DESC");
}

export async function adminCreatePengumuman(data: Partial<Pengumuman>) {
  await query(
    "INSERT INTO pengumuman (label, judul, lokasi, link_url, is_active) VALUES (?, ?, ?, ?, ?)",
    [data.label || "PENTING", data.judul, data.lokasi || null, data.link_url || null, data.is_active ? 1 : 0]
  );
  revalidatePublicSite();
}

export async function adminUpdatePengumuman(id: number, data: Partial<Pengumuman>) {
  await query(
    "UPDATE pengumuman SET label=?, judul=?, lokasi=?, link_url=?, is_active=? WHERE id = ?",
    [data.label || "PENTING", data.judul, data.lokasi || null, data.link_url || null, data.is_active ? 1 : 0, id]
  );
  revalidatePublicSite();
}

export async function adminDeletePengumuman(id: number) {
  await query("DELETE FROM pengumuman WHERE id = ?", [id]);
  revalidatePublicSite();
}

/* ------------------------------------------------------------------ */
/* Prestasi                                                           */
/* ------------------------------------------------------------------ */

export async function adminGetPrestasi(): Promise<Prestasi[]> {
  return query<Prestasi>("SELECT * FROM prestasi ORDER BY urutan ASC, id DESC");
}

export async function adminCreatePrestasi(data: Partial<Prestasi>) {
  await query(
    "INSERT INTO prestasi (nama, bidang, keterangan, emoji, urutan, is_published) VALUES (?, ?, ?, ?, ?, ?)",
    [data.nama, data.bidang, data.keterangan, data.emoji || "🥇", data.urutan || 0, (data as any).is_published ? 1 : 0]
  );
  revalidatePublicSite();
}

export async function adminUpdatePrestasi(id: number, data: Partial<Prestasi>) {
  await query(
    "UPDATE prestasi SET nama=?, bidang=?, keterangan=?, emoji=?, urutan=?, is_published=? WHERE id = ?",
    [data.nama, data.bidang, data.keterangan, data.emoji || "🥇", data.urutan || 0, (data as any).is_published ? 1 : 0, id]
  );
  revalidatePublicSite();
}

export async function adminDeletePrestasi(id: number) {
  await query("DELETE FROM prestasi WHERE id = ?", [id]);
  revalidatePublicSite();
}

/* ------------------------------------------------------------------ */
/* Galeri                                                             */
/* ------------------------------------------------------------------ */

export async function adminGetGaleri(): Promise<GaleriItem[]> {
  return query<GaleriItem>("SELECT * FROM galeri ORDER BY urutan ASC, id DESC");
}

export async function adminCreateGaleri(data: Partial<GaleriItem>) {
  await query(
    "INSERT INTO galeri (judul_kegiatan, link_foto, urutan, is_published) VALUES (?, ?, ?, ?)",
    [data.judul_kegiatan, data.link_foto, data.urutan || 0, (data as any).is_published ? 1 : 0]
  );
  revalidatePublicSite();
}

export async function adminUpdateGaleri(id: number, data: Partial<GaleriItem>) {
  await query(
    "UPDATE galeri SET judul_kegiatan=?, link_foto=?, urutan=?, is_published=? WHERE id = ?",
    [data.judul_kegiatan, data.link_foto, data.urutan || 0, (data as any).is_published ? 1 : 0, id]
  );
  revalidatePublicSite();
}

export async function adminDeleteGaleri(id: number) {
  await query("DELETE FROM galeri WHERE id = ?", [id]);
  revalidatePublicSite();
}

/* ------------------------------------------------------------------ */
/* Jurusan (+ materi)                                                 */
/* ------------------------------------------------------------------ */

export async function adminGetJurusan(): Promise<Jurusan[]> {
  const jurusanRows = await query<Jurusan>("SELECT * FROM jurusan ORDER BY urutan ASC, id DESC");
  const materiRows = await query<{ jurusan_id: number; materi: string }>(
    "SELECT jurusan_id, materi FROM jurusan_materi ORDER BY urutan ASC"
  );
  return jurusanRows.map((j) => ({
    ...j,
    materi: materiRows.filter((m) => m.jurusan_id === j.id).map((m) => m.materi),
  }));
}

export async function adminSaveJurusan(id: number | null, data: Partial<Jurusan> & { materiText?: string }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    let jurusanId = id;
    if (id) {
      await conn.query(
        "UPDATE jurusan SET slug=?, nama=?, label_badge=?, deskripsi=?, hero_subtitle=?, gambar_url=?, icon=?, urutan=?, brosur_depan_url=?, brosur_belakang_url=? WHERE id=?",
        [data.slug, data.nama, data.label_badge, data.deskripsi, data.hero_subtitle || null, data.gambar_url || null, data.icon || "🎓", data.urutan || 0, data.brosur_depan_url || null, data.brosur_belakang_url || null, id]
      );
      await conn.query("DELETE FROM jurusan_materi WHERE jurusan_id = ?", [id]);
    } else {
      const [result]: any = await conn.query(
        "INSERT INTO jurusan (slug, nama, label_badge, deskripsi, hero_subtitle, gambar_url, icon, urutan, brosur_depan_url, brosur_belakang_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [data.slug, data.nama, data.label_badge, data.deskripsi, data.hero_subtitle || null, data.gambar_url || null, data.icon || "🎓", data.urutan || 0, data.brosur_depan_url || null, data.brosur_belakang_url || null]
      );
      jurusanId = result.insertId;
    }

    const materiList = (data.materiText || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    for (let i = 0; i < materiList.length; i++) {
      await conn.query(
        "INSERT INTO jurusan_materi (jurusan_id, materi, urutan) VALUES (?, ?, ?)",
        [jurusanId, materiList[i], i]
      );
    }

    await conn.commit();
    revalidatePublicSite();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function adminDeleteJurusan(id: number) {
  await query("DELETE FROM jurusan WHERE id = ?", [id]);
  revalidatePublicSite();
}

/* ------------------------------------------------------------------ */
/* Jurusan - Skill (kartu keterampilan)                               */
/* ------------------------------------------------------------------ */

export async function adminGetJurusanSkill(): Promise<(JurusanSkill & { jurusan_nama?: string })[]> {
  return query(
    `SELECT s.*, j.nama AS jurusan_nama FROM jurusan_skill s
     JOIN jurusan j ON j.id = s.jurusan_id
     ORDER BY j.nama ASC, s.urutan ASC, s.id ASC`
  );
}

export async function adminCreateJurusanSkill(data: Partial<JurusanSkill>) {
  await query(
    "INSERT INTO jurusan_skill (jurusan_id, icon, judul, deskripsi, urutan) VALUES (?, ?, ?, ?, ?)",
    [Number(data.jurusan_id), data.icon || "🎯", data.judul, data.deskripsi || null, data.urutan || 0]
  );
  revalidatePublicSite();
}

export async function adminUpdateJurusanSkill(id: number, data: Partial<JurusanSkill>) {
  await query(
    "UPDATE jurusan_skill SET jurusan_id=?, icon=?, judul=?, deskripsi=?, urutan=? WHERE id=?",
    [Number(data.jurusan_id), data.icon || "🎯", data.judul, data.deskripsi || null, data.urutan || 0, id]
  );
  revalidatePublicSite();
}

export async function adminDeleteJurusanSkill(id: number) {
  await query("DELETE FROM jurusan_skill WHERE id = ?", [id]);
  revalidatePublicSite();
}

/* ------------------------------------------------------------------ */
/* Jurusan - Chip (Fasilitas & Peluang Karier)                        */
/* ------------------------------------------------------------------ */

export async function adminGetJurusanChip(): Promise<(JurusanChip & { jurusan_nama?: string })[]> {
  return query(
    `SELECT c.*, j.nama AS jurusan_nama FROM jurusan_chip c
     JOIN jurusan j ON j.id = c.jurusan_id
     ORDER BY j.nama ASC, c.kategori ASC, c.urutan ASC, c.id ASC`
  );
}

export async function adminCreateJurusanChip(data: Partial<JurusanChip>) {
  await query(
    "INSERT INTO jurusan_chip (jurusan_id, kategori, teks, urutan) VALUES (?, ?, ?, ?)",
    [Number(data.jurusan_id), data.kategori, data.teks, data.urutan || 0]
  );
  revalidatePublicSite();
}

export async function adminUpdateJurusanChip(id: number, data: Partial<JurusanChip>) {
  await query(
    "UPDATE jurusan_chip SET jurusan_id=?, kategori=?, teks=?, urutan=? WHERE id=?",
    [Number(data.jurusan_id), data.kategori, data.teks, data.urutan || 0, id]
  );
  revalidatePublicSite();
}

export async function adminDeleteJurusanChip(id: number) {
  await query("DELETE FROM jurusan_chip WHERE id = ?", [id]);
  revalidatePublicSite();
}

/* ------------------------------------------------------------------ */
/* Jurusan - Galeri Detail (Kegiatan & Karya Siswa)                   */
/* ------------------------------------------------------------------ */

export async function adminGetJurusanGaleriDetail(): Promise<(JurusanGaleriDetail & { jurusan_nama?: string })[]> {
  return query(
    `SELECT g.*, j.nama AS jurusan_nama FROM jurusan_galeri_detail g
     JOIN jurusan j ON j.id = g.jurusan_id
     ORDER BY j.nama ASC, g.kategori ASC, g.urutan ASC, g.id ASC`
  );
}

export async function adminCreateJurusanGaleriDetail(data: Partial<JurusanGaleriDetail>) {
  await query(
    "INSERT INTO jurusan_galeri_detail (jurusan_id, kategori, judul, foto, urutan) VALUES (?, ?, ?, ?, ?)",
    [Number(data.jurusan_id), data.kategori, data.judul, data.foto, data.urutan || 0]
  );
  revalidatePublicSite();
}

export async function adminUpdateJurusanGaleriDetail(id: number, data: Partial<JurusanGaleriDetail>) {
  await query(
    "UPDATE jurusan_galeri_detail SET jurusan_id=?, kategori=?, judul=?, foto=?, urutan=? WHERE id=?",
    [Number(data.jurusan_id), data.kategori, data.judul, data.foto, data.urutan || 0, id]
  );
  revalidatePublicSite();
}

export async function adminDeleteJurusanGaleriDetail(id: number) {
  await query("DELETE FROM jurusan_galeri_detail WHERE id = ?", [id]);
  revalidatePublicSite();
}

/* ------------------------------------------------------------------ */
/* Jurusan - Guru                                                     */
/* ------------------------------------------------------------------ */

export async function adminGetJurusanGuru(): Promise<(JurusanGuru & { jurusan_nama?: string })[]> {
  return query(
    `SELECT g.*, j.nama AS jurusan_nama FROM jurusan_guru g
     JOIN jurusan j ON j.id = g.jurusan_id
     ORDER BY j.nama ASC, g.urutan ASC, g.id ASC`
  );
}

export async function adminCreateJurusanGuru(data: Partial<JurusanGuru>) {
  await query(
    "INSERT INTO jurusan_guru (jurusan_id, nama, jabatan, foto, urutan) VALUES (?, ?, ?, ?, ?)",
    [Number(data.jurusan_id), data.nama, data.jabatan || null, data.foto || null, data.urutan || 0]
  );
  revalidatePublicSite();
}

export async function adminUpdateJurusanGuru(id: number, data: Partial<JurusanGuru>) {
  await query(
    "UPDATE jurusan_guru SET jurusan_id=?, nama=?, jabatan=?, foto=?, urutan=? WHERE id=?",
    [Number(data.jurusan_id), data.nama, data.jabatan || null, data.foto || null, data.urutan || 0, id]
  );
  revalidatePublicSite();
}

export async function adminDeleteJurusanGuru(id: number) {
  await query("DELETE FROM jurusan_guru WHERE id = ?", [id]);
  revalidatePublicSite();
}

/* ------------------------------------------------------------------ */
/* Users (Pengguna)                                                   */
/* ------------------------------------------------------------------ */

export async function adminGetUsers(): Promise<AdminUser[]> {
  return query<AdminUser>(
    "SELECT id, name, email, username, role, status, avatar, last_login, created_at FROM users ORDER BY created_at DESC"
  );
}

export async function adminGetUserById(id: number): Promise<AdminUser | null> {
  const rows = await query<AdminUser>(
    "SELECT id, name, email, username, role, status, avatar, last_login, created_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] ?? null;
}

export async function adminCreateUser(data: {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
  status: string;
}) {
  await query(
    "INSERT INTO users (name, email, username, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?)",
    [data.name, data.email, data.username, hashPassword(data.password), data.role, data.status]
  );
}

export async function adminUpdateUser(
  id: number,
  data: { name: string; email: string; username: string; password?: string; role: string; status: string }
) {
  if (data.password && data.password.trim()) {
    await query(
      "UPDATE users SET name=?, email=?, username=?, password_hash=?, role=?, status=? WHERE id=?",
      [data.name, data.email, data.username, hashPassword(data.password), data.role, data.status, id]
    );
  } else {
    await query(
      "UPDATE users SET name=?, email=?, username=?, role=?, status=? WHERE id=?",
      [data.name, data.email, data.username, data.role, data.status, id]
    );
  }
}

export async function adminDeleteUser(id: number) {
  await query("DELETE FROM users WHERE id = ?", [id]);
}

/* ------------------------------------------------------------------ */
/* Profil Saya (self-service, dipakai oleh user yang sedang login)     */
/* ------------------------------------------------------------------ */

export async function adminUpdateOwnProfile(
  id: number,
  data: { name: string; email: string; username: string; avatar?: string | null }
) {
  await query("UPDATE users SET name=?, email=?, username=?, avatar=? WHERE id=?", [
    data.name,
    data.email,
    data.username,
    data.avatar || null,
    id,
  ]);
}

export async function adminChangeOwnPassword(
  id: number,
  currentPassword: string,
  newPassword: string
) {
  const rows = await query<{ password_hash: string }>(
    "SELECT password_hash FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  const row = rows[0];
  if (!row || !verifyPassword(currentPassword, row.password_hash)) {
    throw new Error("Password saat ini tidak cocok");
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password baru minimal 6 karakter");
  }
  await query("UPDATE users SET password_hash = ? WHERE id = ?", [hashPassword(newPassword), id]);
}

/* ------------------------------------------------------------------ */
/* Halaman Statis (page builder)                                       */
/* ------------------------------------------------------------------ */

export async function adminGetHalaman(): Promise<HalamanStatis[]> {
  return query<HalamanStatis>("SELECT * FROM halaman ORDER BY created_at DESC");
}

export async function adminGetHalamanById(id: number): Promise<HalamanStatis | null> {
  const rows = await query<HalamanStatis>("SELECT * FROM halaman WHERE id = ? LIMIT 1", [id]);
  return rows[0] ?? null;
}

export async function adminCreateHalaman(data: Partial<HalamanStatis>) {
  await query(
    `INSERT INTO halaman (judul, slug, deskripsi, konten, penulis, is_published)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.judul,
      data.slug,
      data.deskripsi || null,
      data.konten || null,
      data.penulis || "Admin Sekolah",
      data.is_published ? 1 : 0,
    ]
  );
  revalidatePublicSite();
}

export async function adminUpdateHalaman(id: number, data: Partial<HalamanStatis>) {
  await query(
    `UPDATE halaman SET judul=?, slug=?, deskripsi=?, konten=?, penulis=?, is_published=?
     WHERE id = ?`,
    [
      data.judul,
      data.slug,
      data.deskripsi || null,
      data.konten || null,
      data.penulis || "Admin Sekolah",
      data.is_published ? 1 : 0,
      id,
    ]
  );
  revalidatePublicSite();
}

export async function adminDeleteHalaman(id: number) {
  await query("DELETE FROM halaman WHERE id = ?", [id]);
  revalidatePublicSite();
}

/* ------------------------------------------------------------------ */
/* Media (Pustaka Media)                                              */
/* ------------------------------------------------------------------ */

export async function adminGetMedia(): Promise<MediaFile[]> {
  return query<MediaFile>(
    `SELECT m.*, u.name AS uploader_name
     FROM media m
     LEFT JOIN users u ON u.id = m.uploaded_by
     ORDER BY m.created_at DESC, m.id DESC`
  );
}

export async function adminGetMediaById(id: number): Promise<MediaFile | null> {
  const rows = await query<MediaFile>("SELECT * FROM media WHERE id = ? LIMIT 1", [id]);
  return rows[0] ?? null;
}

export async function adminCreateMedia(data: {
  file_name: string;
  original_name?: string | null;
  url: string;
  mime_type?: string | null;
  size?: number | null;
  uploaded_by?: number | null;
}): Promise<number> {
  const result: any = await pool.query(
    `INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.file_name,
      data.original_name || null,
      data.url,
      data.mime_type || null,
      data.size ?? null,
      data.uploaded_by ?? null,
    ]
  );
  return result[0]?.insertId ?? 0;
}

export async function adminUpdateMediaAlt(id: number, alt_text: string) {
  await query("UPDATE media SET alt_text = ? WHERE id = ?", [alt_text || null, id]);
}

export async function adminDeleteMedia(id: number): Promise<MediaFile | null> {
  const item = await adminGetMediaById(id);
  await query("DELETE FROM media WHERE id = ?", [id]);
  return item;
}

/* ------------------------------------------------------------------ */
/* Pengaturan (identitas & kontak sekolah, Header, Footer)             */
/* ------------------------------------------------------------------ */

export async function adminGetPengaturan(): Promise<Record<string, string>> {
  const rows = await query<{ opt_key: string; opt_value: string | null }>(
    "SELECT opt_key, opt_value FROM pengaturan"
  );
  return Object.fromEntries(rows.map((r) => [r.opt_key, r.opt_value ?? ""]));
}

/** Update sebagian (partial) — hanya key yang dikirim dari form halaman terkait yang disimpan. */
export async function adminUpdatePengaturan(data: Partial<SiteSettings>) {
  const entries = Object.entries(data);
  for (const [key, value] of entries) {
    await query(
      `INSERT INTO pengaturan (opt_key, opt_value) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE opt_value = VALUES(opt_value)`,
      [key, value ?? ""]
    );
  }
  revalidatePublicSite();
}

/* ------------------------------------------------------------------ */
/* Menu Navigasi (Penampilan -> Menu)                                  */
/* ------------------------------------------------------------------ */

export async function adminGetMenu(): Promise<MenuItem[]> {
  return query<MenuItem>(
    "SELECT id, label, url, parent_id, urutan, is_active FROM menu ORDER BY urutan ASC, id ASC"
  );
}

export async function adminCreateMenu(data: Partial<MenuItem>) {
  await query(
    "INSERT INTO menu (label, url, parent_id, urutan, is_active) VALUES (?, ?, ?, ?, ?)",
    [
      data.label,
      data.url,
      data.parent_id || null,
      data.urutan || 0,
      data.is_active === undefined ? 1 : data.is_active ? 1 : 0,
    ]
  );
  revalidatePublicSite();
}

export async function adminUpdateMenu(id: number, data: Partial<MenuItem>) {
  await query(
    "UPDATE menu SET label=?, url=?, parent_id=?, urutan=?, is_active=? WHERE id = ?",
    [
      data.label,
      data.url,
      data.parent_id || null,
      data.urutan || 0,
      data.is_active === undefined ? 1 : data.is_active ? 1 : 0,
      id,
    ]
  );
  revalidatePublicSite();
}

export async function adminDeleteMenu(id: number) {
  await query("DELETE FROM menu WHERE id = ?", [id]);
  revalidatePublicSite();
}

/* ------------------------------------------------------------------ */
/* Hero Slide (slider di beranda — Penampilan -> Header)               */
/* ------------------------------------------------------------------ */

export async function adminGetHeroSlide(): Promise<HeroSlide[]> {
  return query<HeroSlide>("SELECT * FROM hero_slide ORDER BY urutan ASC, id ASC");
}

export async function adminGetHeroSlideById(id: number): Promise<HeroSlide | null> {
  const rows = await query<HeroSlide>("SELECT * FROM hero_slide WHERE id = ? LIMIT 1", [id]);
  return rows[0] ?? null;
}

export async function adminCreateHeroSlide(data: Partial<HeroSlide>) {
  await query(
    `INSERT INTO hero_slide (badge, title, title_accent, deskripsi, gambar, urutan, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.badge,
      data.title,
      data.title_accent,
      data.deskripsi,
      data.gambar,
      data.urutan || 0,
      data.is_active === undefined ? 1 : data.is_active ? 1 : 0,
    ]
  );
  revalidatePublicSite();
}

export async function adminUpdateHeroSlide(id: number, data: Partial<HeroSlide>) {
  await query(
    `UPDATE hero_slide SET badge=?, title=?, title_accent=?, deskripsi=?, gambar=?, urutan=?, is_active=?
     WHERE id = ?`,
    [
      data.badge,
      data.title,
      data.title_accent,
      data.deskripsi,
      data.gambar,
      data.urutan || 0,
      data.is_active === undefined ? 1 : data.is_active ? 1 : 0,
      id,
    ]
  );
  revalidatePublicSite();
}

export async function adminDeleteHeroSlide(id: number) {
  await query("DELETE FROM hero_slide WHERE id = ?", [id]);
  revalidatePublicSite();
}
