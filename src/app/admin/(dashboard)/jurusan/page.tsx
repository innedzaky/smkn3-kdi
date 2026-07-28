import { adminGetJurusan, adminGetPengaturan } from "@/lib/admin-queries";
import { JurusanCrudClient } from "@/components/admin/JurusanCrudClient";
import { SettingsForm, type SettingsFieldConfig } from "@/components/admin/SettingsForm";

const sectionFields: SettingsFieldConfig[] = [
  { key: "program_label", label: "Label Kecil", placeholder: "Kompetensi Bidang Keahlian" },
  { key: "program_judul", label: "Judul Section", placeholder: "Program Unggulan" },
  { key: "program_deskripsi", label: "Deskripsi", type: "textarea", rows: 3 },
];

export default async function AdminJurusanPage() {
  const [raw, settings] = await Promise.all([adminGetJurusan(), adminGetPengaturan()]);
  const items = raw.map((j) => ({ ...j, materiText: (j.materi || []).join("\n") }));

  return (
    <div>
      <SettingsForm
        title="Judul Section 'Program Unggulan'"
        description="Label, judul, dan deskripsi yang tampil di atas tab jurusan pada beranda."
        fields={sectionFields}
        initialValues={settings}
      />
      <div style={{ marginTop: 24 }}>
        <JurusanCrudClient initialItems={items} />
      </div>
    </div>
  );
}
