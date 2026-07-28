import "./admin.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel Admin — SMK Negeri 3 Kendari",
  description: "Panel Admin CMS Website SMK Negeri 3 Kendari",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
