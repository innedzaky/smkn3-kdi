"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminUser } from "@/lib/types";

interface NavLeaf {
  href: string;
  label: string;
  icon?: string;
}

interface NavItem {
  key: string;
  label: string;
  icon: string;
  href?: string;
  children?: NavLeaf[];
}

const NAV: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: "📊", href: "/admin" },
  {
    key: "berita",
    label: "Postingan",
    icon: "📰",
    children: [
      { href: "/admin/berita", label: "Semua Berita" },
      { href: "/admin/berita/tambah", label: "Tambah Berita" },
      { href: "/admin/berita/kategori", label: "Kategori" },
      { href: "/admin/berita/tags", label: "Tags" },
    ],
  },
  { key: "agenda", label: "Agenda", icon: "📅", href: "/admin/agenda" },
  { key: "pengumuman", label: "Pengumuman", icon: "📢", href: "/admin/pengumuman" },
  { key: "prestasi", label: "Prestasi", icon: "🏆", href: "/admin/prestasi" },
  {
    key: "media",
    label: "Media",
    icon: "🗂️",
    children: [
      { href: "/admin/media", label: "Perpustakaan" },
      { href: "/admin/media/tambah", label: "Tambahkan File Media" },
    ],
  },
  { key: "galeri", label: "Galeri", icon: "🖼️", href: "/admin/galeri" },
  {
    key: "jurusan",
    label: "Jurusan",
    icon: "🎓",
    children: [
      { href: "/admin/jurusan", label: "Semua Jurusan" },
      { href: "/admin/jurusan/detail", label: "Detail Halaman Jurusan" },
    ],
  },
  {
    key: "halaman",
    label: "Halaman",
    icon: "📄",
    children: [{ href: "/admin/halaman", label: "Semua Halaman" }],
  },
  {
    key: "penampilan",
    label: "Penampilan",
    icon: "🎨",
    children: [
      { href: "/admin/penampilan/menu", label: "Menu" },
      { href: "/admin/penampilan/header", label: "Header" },
      { href: "/admin/penampilan/footer", label: "Footer" },
    ],
  },
  {
    key: "pengguna",
    label: "Pengguna",
    icon: "👥",
    children: [
      { href: "/admin/profil", label: "Profil Saya" },
      { href: "/admin/pengguna", label: "Semua Pengguna" },
      { href: "/admin/pengguna/baru", label: "Tambah Pengguna" },
    ],
  },
  { key: "pengaturan", label: "Pengaturan", icon: "⚙️", href: "/admin/pengaturan" },
];

export function AdminSidebar({
  collapsed,
  mobileOpen,
  user,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  user: AdminUser;
}) {
  const pathname = usePathname();
  const activeGroupKey = NAV.find(
    (item) => item.children && item.children.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"))
  )?.key;

  const [openGroup, setOpenGroup] = useState<string | null>(activeGroupKey || null);

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (item: NavItem) =>
    !!item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-brand-icon">🎓</div>
        {!collapsed && (
          <div className="admin-sidebar-brand-text">
            <strong>SMKN 3 Kendari</strong>
            <span>Panel Admin CMS</span>
          </div>
        )}
      </div>

      <nav className="admin-nav">
        {NAV.map((item) => {
          if (item.href) {
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`admin-nav-item ${isActive(item.href) ? "active" : ""}`}
              >
                <span className="admin-nav-item-inner">
                  <span className="admin-nav-icon">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </span>
              </Link>
            );
          }

          const open = openGroup === item.key;
          const groupActive = isGroupActive(item);

          return (
            <div key={item.key}>
              <button
                type="button"
                className={`admin-nav-group-toggle ${groupActive ? "open-active" : ""}`}
                onClick={() => setOpenGroup(open ? null : item.key)}
              >
                <span className="admin-nav-group-toggle-inner">
                  <span className="admin-nav-icon">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </span>
                {!collapsed && <span>{open ? "▾" : "▸"}</span>}
              </button>
              {!collapsed && open && item.children && (
                <div className="admin-nav-submenu">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`admin-nav-subitem ${
                        pathname === child.href || pathname.startsWith(child.href + "/") ? "active" : ""
                      }`}
                    >
                      <span>{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href="/admin/profil" className="admin-user-card" style={{ textDecoration: "none" }}>
          <div className="admin-user-avatar">
            {user.avatar ? <img src={user.avatar} alt="" /> : initials || "A"}
          </div>
          {!collapsed && (
            <div className="admin-user-card-text">
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
