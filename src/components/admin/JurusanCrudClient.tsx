"use client";

import { CrudManager, type ColumnConfig, type FieldConfig } from "./CrudManager";
import type { Jurusan } from "@/lib/types";

type JurusanRow = Jurusan & { materiText: string };

const columns: ColumnConfig<JurusanRow>[] = [
  { key: "icon", label: "", render: (j) => <span style={{ fontSize: 20 }}>{j.icon}</span> },
  {
    key: "nama",
    label: "Jurusan",
    render: (j) => (
      <div>
        <div className="admin-cell-title">{j.nama}</div>
        <div className="admin-cell-muted">/{j.slug}</div>
      </div>
    ),
  },
  { key: "label_badge", label: "Label Badge" },
  { key: "urutan", label: "Urutan" },
];

const fields: FieldConfig[] = [
  { key: "nama", label: "Nama Jurusan", type: "text", required: true, placeholder: "Tata Busana" },
  { key: "slug", label: "Slug URL", type: "text", required: true, placeholder: "tata-busana", hint: "Digunakan pada URL /jurusan/[slug]", slugify: true, slugSource: "nama" },
  { key: "label_badge", label: "Label Badge", type: "text", placeholder: "Kompetensi Keahlian" },
  { key: "icon", label: "Ikon Emoji", type: "text", placeholder: "🎓" },
  { key: "deskripsi", label: "Deskripsi", type: "textarea", required: true, rows: 4, placeholder: "Deskripsi lengkap jurusan" },
  { key: "hero_subtitle", label: "Subjudul Hero (opsional)", type: "textarea", rows: 2, placeholder: "Kalimat singkat di bawah judul pada cover halaman jurusan", hint: "Kosongkan jika tidak perlu." },
  { key: "gambar_url", label: "Gambar Jurusan", type: "media" },
  { key: "materiText", label: "Materi Pokok", type: "textarea", rows: 5, placeholder: "Satu materi per baris", hint: "Tulis satu materi per baris, akan tampil sebagai daftar." },
  { key: "brosur_depan_url", label: "Brosur - Halaman Depan", type: "media", hint: "Ditampilkan pada slider perbandingan brosur di halaman jurusan." },
  { key: "brosur_belakang_url", label: "Brosur - Halaman Belakang", type: "media" },
  { key: "urutan", label: "Urutan Tampil", type: "number" },
];

export function JurusanCrudClient({ initialItems }: { initialItems: JurusanRow[] }) {
  return (
    <CrudManager
      resource="jurusan"
      title="Jurusan / Kompetensi Keahlian"
      description="Kelola program jurusan yang tampil pada tab program & halaman /jurusan/[slug]."
      addLabel="Tambah Jurusan"
      emptyIcon="🎓"
      emptyText="Belum ada data jurusan."
      initialItems={initialItems}
      columns={columns}
      fields={fields}
      defaultValues={{ icon: "🎓", label_badge: "Kompetensi Keahlian" }}
    />
  );
}
