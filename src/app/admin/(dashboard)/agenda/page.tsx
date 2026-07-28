import { adminGetAgenda } from "@/lib/admin-queries";
import { CrudManager, type ColumnConfig, type FieldConfig } from "@/components/admin/CrudManager";
import type { AgendaItem } from "@/lib/types";

const columns: ColumnConfig<AgendaItem>[] = [
  { key: "tanggal", label: "Tanggal" },
  { key: "nama", label: "Nama Kegiatan" },
  { key: "lokasi", label: "Lokasi" },
  { key: "urutan", label: "Urutan" },
];

const fields: FieldConfig[] = [
  { key: "tanggal", label: "Tanggal", type: "text", required: true, placeholder: "12 Agustus 2026", hint: "Bebas format teks, contoh: 12 Agustus 2026" },
  { key: "nama", label: "Nama Kegiatan", type: "text", required: true, placeholder: "Pendaftaran SPMB Gelombang 1" },
  { key: "lokasi", label: "Lokasi", type: "text", placeholder: "Ruang Aula / Online" },
  { key: "link_url", label: "Tautan (opsional)", type: "text", placeholder: "https://..." },
  { key: "urutan", label: "Urutan Tampil", type: "number", hint: "Angka lebih kecil tampil lebih dulu" },
];

export default async function AdminAgendaPage() {
  const items = await adminGetAgenda();
  return (
    <CrudManager
      resource="agenda"
      title="Agenda Sekolah"
      description="Kelola daftar agenda yang tampil di kotak Agenda Sekolah pada halaman depan."
      addLabel="Tambah Agenda"
      emptyIcon="📅"
      emptyText="Belum ada agenda."
      initialItems={items}
      columns={columns}
      fields={fields}
    />
  );
}
