"use client";

import { CrudManager, type ColumnConfig, type FieldConfig } from "./CrudManager";
import type { JurusanChip } from "@/lib/types";

type ChipRow = JurusanChip & { jurusan_nama?: string };

const kategoriOptions = [
  { value: "fasilitas", label: "Fasilitas" },
  { value: "karier", label: "Peluang Karier" },
];

export function JurusanChipCrudClient({
  initialItems,
  jurusanOptions,
}: {
  initialItems: ChipRow[];
  jurusanOptions: { value: string; label: string }[];
}) {
  const columns: ColumnConfig<ChipRow>[] = [
    {
      key: "teks",
      label: "Teks Chip",
      render: (c) => (
        <div>
          <div className="admin-cell-title">{c.teks}</div>
          <div className="admin-cell-muted">{c.jurusan_nama}</div>
        </div>
      ),
    },
    {
      key: "kategori",
      label: "Kategori",
      render: (c) => (
        <span className={`admin-badge ${c.kategori === "fasilitas" ? "admin-badge-success" : "admin-badge-muted"}`}>
          {c.kategori === "fasilitas" ? "Fasilitas" : "Peluang Karier"}
        </span>
      ),
    },
    { key: "urutan", label: "Urutan" },
  ];

  const fields: FieldConfig[] = [
    { key: "jurusan_id", label: "Jurusan", type: "select", required: true, options: jurusanOptions },
    { key: "kategori", label: "Kategori", type: "select", required: true, options: kategoriOptions },
    { key: "teks", label: "Teks", type: "text", required: true, placeholder: "Contoh: Fashion Designer" },
    { key: "urutan", label: "Urutan Tampil", type: "number" },
  ];

  return (
    <CrudManager
      resource="jurusan-chip"
      title="Fasilitas & Peluang Karier"
      description="Daftar chip singkat (fasilitas kompetensi & peluang karier lulusan) di halaman detail jurusan."
      addLabel="Tambah Chip"
      emptyIcon="🏭"
      emptyText="Belum ada data."
      initialItems={initialItems}
      columns={columns}
      fields={fields}
      defaultValues={{ kategori: "fasilitas" }}
    />
  );
}
