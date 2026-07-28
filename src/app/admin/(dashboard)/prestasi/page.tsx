import { adminGetPrestasi } from "@/lib/admin-queries";
import { PrestasiCrudClient } from "@/components/admin/PrestasiCrudClient";

export default async function AdminPrestasiPage() {
  const items = await adminGetPrestasi();
  return <PrestasiCrudClient initialItems={items} />;
}
