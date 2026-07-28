import { adminGetMenu } from "@/lib/admin-queries";
import { MenuCrudClient } from "@/components/admin/MenuCrudClient";

export default async function AdminMenuPage() {
  const items = await adminGetMenu();
  return <MenuCrudClient initialItems={items} />;
}
