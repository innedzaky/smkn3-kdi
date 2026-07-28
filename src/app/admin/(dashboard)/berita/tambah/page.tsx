import { adminGetKategoriBerita, adminGetTags } from "@/lib/admin-queries";
import { BeritaAddForm } from "@/components/admin/BeritaAddForm";

export default async function AdminTambahBeritaPage() {
  const [kategoriList, tagList] = await Promise.all([adminGetKategoriBerita(), adminGetTags()]);
  return <BeritaAddForm kategoriList={kategoriList} tagList={tagList} />;
}
