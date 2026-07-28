"use client";

import { CrudManager, type ColumnConfig, type FieldConfig } from "./CrudManager";
import type { JurusanSkill } from "@/lib/types";

type SkillRow = JurusanSkill & { jurusan_nama?: string };

export function JurusanSkillCrudClient({
  initialItems,
  jurusanOptions,
}: {
  initialItems: SkillRow[];
  jurusanOptions: { value: string; label: string }[];
}) {
  const columns: ColumnConfig<SkillRow>[] = [
    { key: "icon", label: "", render: (s) => <span style={{ fontSize: 20 }}>{s.icon}</span> },
    {
      key: "judul",
      label: "Keterampilan",
      render: (s) => (
        <div>
          <div className="admin-cell-title">{s.judul}</div>
          <div className="admin-cell-muted">{s.jurusan_nama}</div>
        </div>
      ),
    },
    { key: "urutan", label: "Urutan" },
  ];

  const fields: FieldConfig[] = [
    { key: "jurusan_id", label: "Jurusan", type: "select", required: true, options: jurusanOptions },
    { key: "icon", label: "Ikon Emoji", type: "text", placeholder: "👗" },
    { key: "judul", label: "Nama Keterampilan", type: "text", required: true, placeholder: "Desain Fashion" },
    { key: "deskripsi", label: "Deskripsi Singkat", type: "textarea", rows: 3, placeholder: "Membuat desain busana secara manual maupun digital." },
    { key: "urutan", label: "Urutan Tampil", type: "number" },
  ];

  return (
    <CrudManager
      resource="jurusan-skill"
      title="Keterampilan yang Dikuasai"
      description="Kartu keterampilan (ikon + judul + deskripsi) yang tampil di halaman detail jurusan."
      addLabel="Tambah Keterampilan"
      emptyIcon="🎯"
      emptyText="Belum ada data keterampilan."
      initialItems={initialItems}
      columns={columns}
      fields={fields}
      defaultValues={{ icon: "🎯" }}
    />
  );
}
