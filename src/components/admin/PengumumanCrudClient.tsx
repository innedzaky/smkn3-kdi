"use client";

import { CrudManager, type ColumnConfig, type FieldConfig } from "./CrudManager";
import type { Pengumuman } from "@/lib/types";

const columns: ColumnConfig<Pengumuman>[] = [
  {
    key: "label",
    label: "Label",
    render: (p) => <span className="admin-badge admin-badge-warning">{p.label}</span>,
  },
  { key: "judul", label: "Judul" },
  { key: "lokasi", label: "Lokasi" },
  {
    key: "is_active",
    label: "Status",
    render: (p) => (
      <span className={`admin-badge ${p.is_active ? "admin-badge-success" : "admin-badge-muted"}`}>
        {p.is_active ? "Aktif" : "Nonaktif"}
      </span>
    ),
  },
];

const fields: FieldConfig[] = [
  { key: "label", label: "Label", type: "text", placeholder: "PENTING", hint: "Contoh: PENTING, INFO, SPMB" },
  { key: "judul", label: "Judul Pengumuman", type: "text", required: true, placeholder: "Pengumuman kelulusan SPMB 2026" },
  { key: "lokasi", label: "Lokasi (opsional)", type: "text", placeholder: "Aula Sekolah" },
  { key: "link_url", label: "Tautan (opsional)", type: "text", placeholder: "https://..." },
  { key: "is_active", label: "Status", type: "checkbox", placeholder: "Tampilkan sekarang" },
];

export function PengumumanCrudClient({ initialItems }: { initialItems: Pengumuman[] }) {
  return (
    <CrudManager
      resource="pengumuman"
      title="Pengumuman"
      description="Kelola banner pengumuman resmi yang tampil di ticker berjalan pada situs."
      addLabel="Tambah Pengumuman"
      emptyIcon="📢"
      emptyText="Belum ada pengumuman."
      initialItems={initialItems}
      columns={columns}
      fields={fields}
      defaultValues={{ label: "PENTING", is_active: true }}
    />
  );
}
