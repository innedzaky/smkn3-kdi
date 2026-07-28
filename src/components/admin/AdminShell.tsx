"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "./Sidebar";
import type { AdminUser } from "@/lib/types";

export function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-shell">
      <AdminSidebar collapsed={collapsed} mobileOpen={mobileOpen} user={user} />

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-sidebar-toggle"
              onClick={() => {
                setCollapsed((c) => !c);
                setMobileOpen((o) => !o);
              }}
              title="Tampilkan/sembunyikan sidebar"
            >
              ☰
            </button>
            <div className="admin-topbar-title">Panel Admin CMS</div>
          </div>
          <div className="admin-topbar-right">
            <Link href="/" target="_blank" className="admin-view-site-link">
              🌐 Lihat Situs
            </Link>
            <form className="admin-logout-form" action="/api/admin/logout" method="POST">
              <button type="submit">Keluar</button>
            </form>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
