import { adminGetKategoriBerita } from "@/lib/admin-queries";
import { KategoriManager } from "@/components/admin/KategoriManager";

export default async function AdminKategoriBeritaPage() {
  const data = await adminGetKategoriBerita();
  return <KategoriManager initialData={data} />;
}
