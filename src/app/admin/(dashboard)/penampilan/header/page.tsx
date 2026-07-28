import { adminGetPengaturan, adminGetHeroSlide } from "@/lib/admin-queries";
import { SettingsForm, type SettingsFieldConfig } from "@/components/admin/SettingsForm";
import { HeroSlideCrudClient } from "@/components/admin/HeroSlideCrudClient";

const logoFields: SettingsFieldConfig[] = [
  {
    key: "logo_type",
    label: "Jenis Logo",
    type: "select",
    options: [
      { value: "image", label: "Gambar" },
      { value: "text", label: "Teks" },
    ],
    hint: "Pilih tampilkan logo sebagai gambar (upload) atau sebagai teks saja.",
  },
  {
    key: "logo_url",
    label: "Gambar Logo",
    type: "image",
    hint: "Tampil di pojok kiri header (lingkaran emblem).",
    showIf: { field: "logo_type", notEquals: "text" },
  },
  {
    key: "logo_text",
    label: "Teks Logo",
    placeholder: "SMK Negeri 3 Kendari",
    hint: "Tampil sebagai teks di pojok kiri header, menggantikan gambar.",
    showIf: { field: "logo_type", equals: "text" },
  },
  { key: "nav_cta_text", label: "Teks Tombol CTA", placeholder: "INFO SPMB" },
  { key: "nav_cta_link", label: "Tautan Tombol CTA", placeholder: "/spmb" },
];

export default async function AdminHeaderSettingsPage() {
  const [settings, slides] = await Promise.all([adminGetPengaturan(), adminGetHeroSlide()]);

  return (
    <div>
      <SettingsForm
        title="Pengaturan Header"
        description="Logo (gambar atau teks) dan tombol ajakan (CTA) yang tampil di header situs."
        fields={logoFields}
        initialValues={settings}
      />
      <div style={{ marginTop: 24 }}>
        <HeroSlideCrudClient initialItems={slides} />
      </div>
    </div>
  );
}
