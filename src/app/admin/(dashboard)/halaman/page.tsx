import { adminGetHalaman } from "@/lib/admin-queries";
import { HalamanCrudClient } from "@/components/admin/HalamanCrudClient";

export default async function AdminHalamanPage() {
  const items = await adminGetHalaman();
  return <HalamanCrudClient initialItems={items} />;
}
