"use client";

import { CrudManager, type ColumnConfig, type FieldConfig } from "./CrudManager";
import type { JurusanGaleriDetail } from "@/lib/types";

type GaleriRow = JurusanGaleriDetail & { jurusan_nama?: string };

const kategoriOptions = [
  { value: "kegiatan", label: "Galeri Kegiatan Siswa" },
  { value: "karya", label: "Galeri Karya Siswa" },
];

export function JurusanGaleriDetailCrudClient({
  initialItems,
  jurusanOptions,
}: {
  initialItems: GaleriRow[];
  jurusanOptions: { value: string; label: string }[];
}) {
  const columns: ColumnConfig<GaleriRow>[] = [
    { key: "foto", label: "", render: (g) => <img src={g.foto} alt="" className="admin-thumb" /> },
    {
      key: "judul",
      label: "Judul",
      render: (g) => (
        <div>
          <div className="admin-cell-title">{g.judul}</div>
          <div className="admin-cell-muted">{g.jurusan_nama}</div>
        </div>
      ),
    },
    {
      key: "kategori",
      label: "Kategori",
      render: (g) => (
        <span className={`admin-badge ${g.kategori === "kegiatan" ? "admin-badge-success" : "admin-badge-muted"}`}>
          {g.kategori === "kegiatan" ? "Kegiatan" : "Karya"}
        </span>
      ),
    },
    { key: "urutan", label: "Urutan" },
  ];

  const fields: FieldConfig[] = [
    { key: "jurusan_id", label: "Jurusan", type: "select", required: true, options: jurusanOptions },
    { key: "kategori", label: "Kategori", type: "select", required: true, options: kategoriOptions },
    { key: "judul", label: "Judul Foto", type: "text", required: true, placeholder: "Praktik Menjahit Industri" },
    { key: "foto", label: "Foto", type: "media", required: true },
    { key: "urutan", label: "Urutan Tampil", type: "number" },
  ];

  return (
    <CrudManager
      resource="jurusan-galeri-detail"
      title="Galeri Kegiatan & Karya Siswa"
      description="Foto kegiatan dan karya siswa yang tampil di halaman detail jurusan."
      addLabel="Tambah Foto"
      emptyIcon="📸"
      emptyText="Belum ada foto."
      initialItems={initialItems}
      columns={columns}
      fields={fields}
      defaultValues={{ kategori: "kegiatan" }}
    />
  );
}
