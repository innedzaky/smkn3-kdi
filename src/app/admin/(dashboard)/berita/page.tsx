import { adminGetBerita } from "@/lib/admin-queries";
import { BeritaCrudClient } from "@/components/admin/BeritaCrudClient";

export default async function AdminBeritaPage() {
  const items = await adminGetBerita();
  return <BeritaCrudClient initialItems={items} />;
}
