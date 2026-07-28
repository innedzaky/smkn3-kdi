"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { MenuTreeItem, SiteSettings } from "@/lib/types";

export default function HeaderClient({
  settings,
  menu,
}: {
  settings: SiteSettings;
  menu: MenuTreeItem[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo-area">
          {settings.logo_type === "text" ? (
            <div className="logo-emblem-text">{settings.logo_text || settings.nama_sekolah}</div>
          ) : (
            <div className="logo-emblem-circle">
              <Image
                src={settings.logo_url || "/images/logo.png"}
                alt={`Logo ${settings.nama_sekolah}`}
                width={52}
                height={52}
              />
            </div>
          )}
          <div className="logo-text">
            <span className="school-name">{settings.nama_sekolah}</span>
            <span className="school-sub">{settings.tagline}</span>
          </div>
        </Link>

        <button
          className="menu-toggle-btn"
          aria-label="Toggle Menu Navigasi"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={`main-nav ${menuOpen ? "show-mobile-menu" : ""}`}>
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Beranda
          </Link>

          {menu.map((item) =>
            item.children.length > 0 ? (
              <div className="dropdown-parent" key={item.id}>
                <Link href={item.url} onClick={() => setMenuOpen(false)}>
                  {item.label} ▾
                </Link>
                <ul className="dropdown-menu">
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <Link href={child.url} onClick={() => setMenuOpen(false)}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Link key={item.id} href={item.url} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            )
          )}

          {settings.nav_cta_text && settings.nav_cta_link && (
            <Link href={settings.nav_cta_link} className="nav-cta" onClick={() => setMenuOpen(false)}>
              {settings.nav_cta_text}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
