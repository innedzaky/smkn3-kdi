"use client";

import { CrudManager, type ColumnConfig, type FieldConfig } from "./CrudManager";
import type { JurusanGuru } from "@/lib/types";

type GuruRow = JurusanGuru & { jurusan_nama?: string };

export function JurusanGuruCrudClient({
  initialItems,
  jurusanOptions,
}: {
  initialItems: GuruRow[];
  jurusanOptions: { value: string; label: string }[];
}) {
  const columns: ColumnConfig<GuruRow>[] = [
    { key: "foto", label: "", render: (g) => <img src={g.foto || ""} alt="" className="admin-thumb" /> },
    {
      key: "nama",
      label: "Nama Guru",
      render: (g) => (
        <div>
          <div className="admin-cell-title">{g.nama}</div>
          <div className="admin-cell-muted">{g.jurusan_nama} — {g.jabatan}</div>
        </div>
      ),
    },
    { key: "urutan", label: "Urutan" },
  ];

  const fields: FieldConfig[] = [
    { key: "jurusan_id", label: "Jurusan", type: "select", required: true, options: jurusanOptions },
    { key: "nama", label: "Nama Guru", type: "text", required: true, placeholder: "Nama lengkap" },
    { key: "jabatan", label: "Jabatan / Mata Pelajaran", type: "text", placeholder: "Kepala Program Tata Busana" },
    { key: "foto", label: "Foto", type: "media" },
    { key: "urutan", label: "Urutan Tampil", type: "number" },
  ];

  return (
    <CrudManager
      resource="jurusan-guru"
      title="Guru Jurusan"
      description="Daftar guru/pengajar yang tampil di halaman detail jurusan."
      addLabel="Tambah Guru"
      emptyIcon="🧑‍🏫"
      emptyText="Belum ada data guru."
      initialItems={initialItems}
      columns={columns}
      fields={fields}
      defaultValues={{}}
    />
  );
}
