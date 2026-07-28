import { getMenu, getSiteSettings } from "@/lib/queries";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const [settings, menu] = await Promise.all([getSiteSettings(), getMenu()]);
  return <HeaderClient settings={settings} menu={menu} />;
}
