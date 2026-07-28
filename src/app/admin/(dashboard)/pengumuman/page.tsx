import { adminGetPengumuman } from "@/lib/admin-queries";
import { PengumumanCrudClient } from "@/components/admin/PengumumanCrudClient";

export default async function AdminPengumumanPage() {
  const items = await adminGetPengumuman();
  return <PengumumanCrudClient initialItems={items} />;
}
