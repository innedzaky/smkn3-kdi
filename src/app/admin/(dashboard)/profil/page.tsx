import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { ProfilForm } from "@/components/admin/ProfilForm";

export default async function AdminProfilPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return <ProfilForm user={user} />;
}
