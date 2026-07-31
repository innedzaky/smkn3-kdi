"use client";

import { CrudManager, type ColumnConfig, type FieldConfig } from "./CrudManager";
import type { GaleriItem } from "@/lib/types";

const columns: ColumnConfig<GaleriItem>[] = [
  {
    key: "link_foto",
    label: "",
    render: (g) => <img src={g.link_foto} alt="" className="admin-thumb" />,
  },
  { key: "judul_kegiatan", label: "Judul Kegiatan" },
  { key: "urutan", label: "Urutan" },
  {
    key: "is_published",
    label: "Status",
    render: (g) => (
      <span className={`admin-badge ${g.is_published ? "admin-badge-success" : "admin-badge-muted"}`}>
        {g.is_published ? "Tampil" : "Disembunyikan"}
      </span>
    ),
  },
];

const fields: FieldConfig[] = [
  { key: "judul_kegiatan", label: "Judul Kegiatan", type: "text", required: true, placeholder: "Kegiatan Praktik Tata Boga" },
  { key: "link_foto", label: "Foto Kegiatan", type: "media", required: true },
  { key: "urutan", label: "Urutan Tampil", type: "number" },
  { key: "is_published", label: "Status", type: "checkbox", placeholder: "Tampilkan di galeri" },
];

export function GaleriCrudClient({ initialItems }: { initialItems: GaleriItem[] }) {
  return (
    <CrudManager
      resource="galeri"
      title="Galeri Kegiatan"
      description="Kelola foto dokumentasi kegiatan yang tampil di halaman Galeri Kegiatan."
      addLabel="Tambah Foto"
      emptyIcon="🖼️"
      emptyText="Belum ada foto galeri."
      initialItems={initialItems}
      columns={columns}
      fields={fields}
      defaultValues={{ is_published: true }}
    />
  );
}
