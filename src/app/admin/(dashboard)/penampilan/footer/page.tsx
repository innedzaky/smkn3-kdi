import { adminGetPengaturan } from "@/lib/admin-queries";
import { SettingsForm, type SettingsFieldConfig } from "@/components/admin/SettingsForm";

const fields: SettingsFieldConfig[] = [
  { key: "footer_about", label: "Deskripsi Singkat Sekolah", type: "textarea", rows: 4 },
  { key: "footer_akreditasi", label: "Label Akreditasi", placeholder: "⭐ Akreditasi B" },
  { key: "sosmed_facebook", label: "Tautan Facebook", placeholder: "https://facebook.com/... (opsional)" },
  { key: "sosmed_instagram", label: "Tautan Instagram", placeholder: "https://instagram.com/... (opsional)" },
  { key: "sosmed_youtube", label: "Tautan YouTube", placeholder: "https://youtube.com/... (opsional)" },
  { key: "sosmed_tiktok", label: "Tautan TikTok", placeholder: "https://tiktok.com/@... (opsional)" },
  {
    key: "footer_copyright_html",
    label: "Teks Copyright (baris bawah footer, kiri)",
    type: "richtext",
    placeholder: "© 2026 SMK Negeri 3 Kendari. Hak cipta dilindungi undang-undang.",
    hint: "Tampil di pojok kiri bawah footer. Boleh HTML (misal tautan atau tebal/miring). Kosongkan untuk pakai teks bawaan otomatis (tahun berjalan + nama sekolah).",
  },
  {
    key: "footer_alamat_html",
    label: "Teks Alamat (baris bawah footer, kanan)",
    type: "richtext",
    placeholder: "Jl. Budi Utomo No.1, Kadia, Kendari — 0405 23421",
    hint: "Tampil di pojok kanan bawah footer. Boleh HTML (misal tautan ke Google Maps). Kosongkan untuk pakai alamat & telepon dari menu Pengaturan.",
  },
];

export default async function AdminFooterSettingsPage() {
  const settings = await adminGetPengaturan();
  return (
    <SettingsForm
      title="Pengaturan Footer"
      description="Deskripsi, tautan sosial media, label akreditasi, serta teks copyright & alamat pada baris paling bawah footer. Alamat dan telepon utama tetap diatur lewat menu Pengaturan."
      fields={fields}
      initialValues={settings}
    />
  );
}
