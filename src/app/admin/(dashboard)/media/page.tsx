import { adminGetMedia } from "@/lib/admin-queries";
import { MediaLibraryClient } from "@/components/admin/MediaLibraryClient";

export default async function AdminMediaPage() {
  const items = await adminGetMedia();
  return <MediaLibraryClient initialItems={items} />;
}
