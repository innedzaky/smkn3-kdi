"use client";

import { CrudManager, type ColumnConfig, type FieldConfig } from "./CrudManager";
import type { HalamanStatis } from "@/lib/types";

const columns: ColumnConfig<HalamanStatis>[] = [
  {
    key: "judul",
    label: "Judul",
    render: (h) => (
      <div>
        <div className="admin-cell-title">{h.judul}</div>
        <div className="admin-cell-muted">/halaman/{h.slug}</div>
      </div>
    ),
  },
  { key: "penulis", label: "Penulis" },
  {
    key: "is_published",
    label: "Status",
    render: (h) => (
      <span className={`admin-badge ${h.is_published ? "admin-badge-success" : "admin-badge-muted"}`}>
        {h.is_published ? "Terbit" : "Draf"}
      </span>
    ),
  },
  { key: "updated_at", label: "Terakhir Diubah" },
];

const fields: FieldConfig[] = [
  { key: "judul", label: "Judul Halaman", type: "text", required: true, placeholder: "Contoh: Fasilitas Sekolah" },
  { key: "slug", label: "Slug URL", type: "text", required: true, placeholder: "fasilitas-sekolah", hint: "Digunakan pada URL /halaman/[slug], huruf kecil & tanda hubung.", slugify: true, slugSource: "judul" },
  { key: "deskripsi", label: "Ringkasan Singkat", type: "textarea", rows: 2, placeholder: "Ringkasan singkat opsional" },
  { key: "konten", label: "Isi Konten", type: "richtext", required: true, placeholder: "Tulis isi lengkap halaman di sini..." },
  { key: "penulis", label: "Penulis", type: "text", placeholder: "Admin Sekolah" },
  { key: "is_published", label: "Status", type: "checkbox", placeholder: "Terbitkan sekarang" },
];

export function HalamanCrudClient({ initialItems }: { initialItems: HalamanStatis[] }) {
  return (
    <CrudManager
      resource="halaman"
      title="Halaman Statis"
      description="Kelola halaman informasi baru (Fasilitas, Kerja Sama Industri, Alumni, dll) yang tampil di /halaman/[slug]. Setelah dibuat, tambahkan link-nya lewat Penampilan → Menu Navigasi."
      addLabel="Tambah Halaman"
      emptyIcon="📄"
      emptyText="Belum ada halaman statis. Tambahkan halaman pertama Anda."
      initialItems={initialItems}
      columns={columns}
      fields={fields}
      defaultValues={{ penulis: "Admin Sekolah", is_published: true }}
    />
  );
}
