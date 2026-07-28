import { adminGetPengaturan } from "@/lib/admin-queries";
import { SettingsForm, type SettingsFieldConfig } from "@/components/admin/SettingsForm";

const identityFields: SettingsFieldConfig[] = [
  { key: "nama_sekolah", label: "Nama Sekolah", placeholder: "SMK Negeri 3 Kendari" },
  { key: "tagline", label: "Tagline / Motto", placeholder: "Unggul, Berakhlak Mulia, Profesional" },
  { key: "email", label: "Email Sekolah", placeholder: "info@smkn3kdi.sch.id" },
  { key: "telepon", label: "Nomor Telepon", placeholder: "0401-3191136" },
  { key: "whatsapp", label: "Nomor WhatsApp", placeholder: "62xxxxxxxxxx (opsional)" },
  { key: "alamat", label: "Alamat Sekolah", type: "textarea", rows: 2, placeholder: "Jl. Budi Utomo No.1, Kadia, Kendari" },
];

const kepalaSekolahFields: SettingsFieldConfig[] = [
  { key: "kepala_foto", label: "Foto Kepala Sekolah", type: "image", hint: "Tampil di kartu foto pada bagian Sambutan Kepala Sekolah di beranda." },
  { key: "kepala_judul", label: "Judul Sambutan", placeholder: "Selamat Datang di SMK Negeri 3 Kendari" },
  { key: "kepala_kutipan", label: "Kutipan", type: "textarea", rows: 2, hint: "Tampil sebagai kutipan bergaya (blockquote) di atas paragraf sambutan." },
  {
    key: "kepala_sambutan",
    label: "Isi Sambutan",
    type: "textarea",
    rows: 8,
    hint: "Pisahkan antar paragraf dengan baris kosong (Enter dua kali).",
  },
  { key: "kepala_nama", label: "Nama Kepala Sekolah", placeholder: "Muhammad Kasman Said", hint: "Tampil di bagian tanda tangan (\"Hormat kami, ...\")." },
];

export default async function AdminSettingsPage() {
  const settings = await adminGetPengaturan();
  return (
    <div>
      <SettingsForm
        title="Pengaturan Situs"
        description="Identitas & kontak sekolah. Data ini dipakai di berbagai bagian situs (footer, halaman kontak, dll)."
        fields={identityFields}
        initialValues={settings}
      />
      <div style={{ marginTop: 24 }}>
        <SettingsForm
          title="Sambutan Kepala Sekolah"
          description="Foto dan teks sambutan yang tampil di bagian 'Sambutan Kepala Sekolah' pada beranda."
          fields={kepalaSekolahFields}
          initialValues={settings}
        />
      </div>
    </div>
  );
}
