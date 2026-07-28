"use client";

import { CrudManager, type ColumnConfig, type FieldConfig } from "./CrudManager";
import type { Berita } from "@/lib/types";

const columns: ColumnConfig<Berita>[] = [
  {
    key: "gambar",
    label: "",
    render: (b) =>
      b.gambar ? (
        <img src={b.gambar} alt="" className="admin-thumb" />
      ) : (
        <div className="admin-thumb" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          📰
        </div>
      ),
  },
  {
    key: "judul",
    label: "Judul",
    render: (b) => (
      <div>
        <div className="admin-cell-title">{b.judul}</div>
        <div className="admin-cell-muted">/{b.slug}</div>
      </div>
    ),
  },
  { key: "kategori", label: "Kategori" },
  {
    key: "tags",
    label: "Tags",
    render: (b) =>
      b.tags && b.tags.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {b.tags.map((t) => (
            <span key={t} className="admin-badge admin-badge-accent" style={{ fontWeight: 500 }}>
              {t}
            </span>
          ))}
        </div>
      ) : (
        <span className="admin-cell-muted">—</span>
      ),
  },
  { key: "penulis", label: "Penulis" },
  {
    key: "is_published",
    label: "Status",
    render: (b) => (
      <span className={`admin-badge ${b.is_published ? "admin-badge-success" : "admin-badge-muted"}`}>
        {b.is_published ? "Terbit" : "Draf"}
      </span>
    ),
  },
  { key: "published_at", label: "Tanggal" },
];

const fields: FieldConfig[] = [
  { key: "judul", label: "Judul Berita", type: "text", required: true, placeholder: "Judul berita" },
  { key: "slug", label: "Slug URL", type: "text", required: true, placeholder: "judul-berita", hint: "Digunakan pada URL /artikel/[slug], huruf kecil & tanda hubung.", slugify: true, slugSource: "judul" },
  { key: "kategori", label: "Kategori", type: "text", placeholder: "Sekolah" },
  { key: "tags", label: "Tags", type: "tags", placeholder: "spmb, prestasi, olahraga", hint: "Pisahkan tiap tag dengan koma. Tag baru otomatis dibuat." },
  { key: "penulis", label: "Penulis", type: "text", placeholder: "Admin Sekolah" },
  { key: "deskripsi", label: "Deskripsi Singkat", type: "textarea", required: true, rows: 2, placeholder: "Ringkasan berita untuk daftar/cuplikan" },
  { key: "konten", label: "Konten Lengkap", type: "textarea", rows: 8, placeholder: "Isi lengkap berita" },
  { key: "gambar", label: "Gambar Sampul", type: "image" },
  { key: "is_published", label: "Status", type: "checkbox", placeholder: "Terbitkan sekarang" },
];

export function BeritaCrudClient({ initialItems }: { initialItems: Berita[] }) {
  return (
    <CrudManager
      resource="berita"
      title="Postingan Berita"
      description="Kelola berita dan artikel yang tampil di halaman depan & /artikel."
      addLabel="Tambah Berita"
      emptyIcon="📰"
      emptyText="Belum ada berita. Tambahkan berita pertama Anda."
      initialItems={initialItems}
      columns={columns}
      fields={fields}
      defaultValues={{ kategori: "Sekolah", penulis: "Admin Sekolah", is_published: true }}
    />
  );
}
