import { adminGetPengaturan } from "@/lib/admin-queries";
import { SettingsForm, type SettingsFieldConfig } from "@/components/admin/SettingsForm";

const fields: SettingsFieldConfig[] = [
  { key: "footer_about", label: "Deskripsi Singkat Sekolah", type: "textarea", rows: 4 },
  { key: "footer_akreditasi", label: "Label Akreditasi", placeholder: "⭐ Akreditasi B" },
  { key: "sosmed_facebook", label: "Tautan Facebook", placeholder: "https://facebook.com/... (opsional)" },
  { key: "sosmed_instagram", label: "Tautan Instagram", placeholder: "https://instagram.com/... (opsional)" },
  { key: "sosmed_youtube", label: "Tautan YouTube", placeholder: "https://youtube.com/... (opsional)" },
  { key: "sosmed_tiktok", label: "Tautan TikTok", placeholder: "https://tiktok.com/@... (opsional)" },
];

export default async function AdminFooterSettingsPage() {
  const settings = await adminGetPengaturan();
  return (
    <SettingsForm
      title="Pengaturan Footer"
      description="Deskripsi, tautan sosial media, dan label akreditasi pada footer. Alamat, telepon, dan nama sekolah diatur lewat menu Pengaturan."
      fields={fields}
      initialValues={settings}
    />
  );
}
