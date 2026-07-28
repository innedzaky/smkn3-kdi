"use client";

import { CrudManager, type ColumnConfig, type FieldConfig } from "./CrudManager";
import type { Prestasi } from "@/lib/types";

const columns: ColumnConfig<Prestasi>[] = [
  { key: "emoji", label: "", render: (p) => <span style={{ fontSize: 20 }}>{p.emoji}</span> },
  { key: "nama", label: "Nama Siswa / Tim" },
  { key: "bidang", label: "Bidang Lomba" },
  { key: "keterangan", label: "Keterangan" },
  { key: "urutan", label: "Urutan" },
  {
    key: "is_published",
    label: "Status",
    render: (p) => (
      <span className={`admin-badge ${p.is_published ? "admin-badge-success" : "admin-badge-muted"}`}>
        {p.is_published ? "Tampil" : "Disembunyikan"}
      </span>
    ),
  },
];

const fields: FieldConfig[] = [
  { key: "nama", label: "Nama Siswa / Tim", type: "text", required: true, placeholder: "Nama siswa atau tim" },
  { key: "bidang", label: "Bidang Lomba", type: "text", required: true, placeholder: "LKS Tata Busana Tingkat Provinsi" },
  { key: "keterangan", label: "Keterangan", type: "textarea", required: true, rows: 3, placeholder: "Juara 1 tingkat provinsi tahun 2026" },
  { key: "emoji", label: "Ikon Emoji", type: "text", placeholder: "🥇" },
  { key: "urutan", label: "Urutan Tampil", type: "number" },
  { key: "is_published", label: "Status", type: "checkbox", placeholder: "Tampilkan di halaman depan" },
];

export function PrestasiCrudClient({ initialItems }: { initialItems: Prestasi[] }) {
  return (
    <CrudManager
      resource="prestasi"
      title="Prestasi Siswa"
      description="Kelola daftar prestasi siswa yang tampil pada bagian Prestasi di halaman depan."
      addLabel="Tambah Prestasi"
      emptyIcon="🏆"
      emptyText="Belum ada data prestasi."
      initialItems={initialItems}
      columns={columns}
      fields={fields}
      defaultValues={{ emoji: "🥇", is_published: true }}
    />
  );
}
