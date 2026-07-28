import { adminGetTags } from "@/lib/admin-queries";
import { TagsManager } from "@/components/admin/TagsManager";

export default async function AdminTagsBeritaPage() {
  const data = await adminGetTags();
  return <TagsManager initialData={data} />;
}
