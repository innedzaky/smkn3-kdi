import { adminGetUsers } from "@/lib/admin-queries";
import { PenggunaCrudClient } from "@/components/admin/PenggunaCrudClient";

export default async function AdminPenggunaPage() {
  const items = await adminGetUsers();
  return <PenggunaCrudClient initialItems={items} />;
}
