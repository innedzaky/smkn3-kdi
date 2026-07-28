"use client";

import { CrudManager, type ColumnConfig, type FieldConfig } from "./CrudManager";
import type { HeroSlide } from "@/lib/types";

const columns: ColumnConfig<HeroSlide>[] = [
  {
    key: "gambar",
    label: "",
    render: (s) => <img src={s.gambar} alt="" className="admin-thumb" />,
  },
  {
    key: "title",
    label: "Judul Slide",
    render: (s) => (
      <div>
        <div className="admin-cell-title">
          {s.title} {s.title_accent}
        </div>
        <div className="admin-cell-muted">Badge: {s.badge}</div>
      </div>
    ),
  },
  { key: "urutan", label: "Urutan" },
  {
    key: "is_active",
    label: "Status",
    render: (s) => (
      <span className={`admin-badge ${s.is_active ? "admin-badge-success" : "admin-badge-muted"}`}>
        {s.is_active ? "Tampil" : "Disembunyikan"}
      </span>
    ),
  },
];

const fields: FieldConfig[] = [
  { key: "gambar", label: "Gambar Slide", type: "image", required: true, hint: "Gambar latar belakang penuh (disarankan orientasi lanskap, resolusi lebar)." },
  { key: "badge", label: "Label Badge", type: "text", required: true, placeholder: "Contoh: Perhotelan" },
  { key: "title", label: "Judul Baris Pertama", type: "text", required: true, placeholder: "Contoh: Unggul Mutu di Sektor" },
  { key: "title_accent", label: "Judul Baris Kedua (aksen warna)", type: "text", required: true, placeholder: "Contoh: Perhotelan Management" },
  { key: "deskripsi", label: "Kalimat Deskripsi", type: "textarea", required: true, rows: 3 },
  { key: "urutan", label: "Urutan Tampil", type: "number" },
  { key: "is_active", label: "Status", type: "checkbox", placeholder: "Tampilkan di slider" },
];

export function HeroSlideCrudClient({ initialItems }: { initialItems: HeroSlide[] }) {
  return (
    <CrudManager
      resource="hero-slide"
      title="Slider Hero Beranda"
      description="Kelola gambar & kalimat yang tampil bergantian di slider hero halaman depan."
      addLabel="Tambah Slide"
      emptyIcon="🖼️"
      emptyText="Belum ada slide. Tambahkan slide pertama Anda."
      initialItems={initialItems}
      columns={columns}
      fields={fields}
      defaultValues={{ is_active: true, urutan: 0 }}
    />
  );
}
