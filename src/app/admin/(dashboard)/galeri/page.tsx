import { adminGetGaleri } from "@/lib/admin-queries";
import { GaleriCrudClient } from "@/components/admin/GaleriCrudClient";

export default async function AdminGaleriPage() {
  const items = await adminGetGaleri();
  return <GaleriCrudClient initialItems={items} />;
}
