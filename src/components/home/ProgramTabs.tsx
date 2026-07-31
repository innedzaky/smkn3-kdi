"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Jurusan } from "@/lib/types";
import FadeUp from "@/components/shared/FadeUp";

function getJurusanHref(slug: string) {
  return `/jurusan/${slug}`;
}

export default function ProgramTabs({
  jurusan,
  sectionLabel,
  sectionTitle,
  sectionDesc,
}: {
  jurusan: Jurusan[];
  sectionLabel: string;
  sectionTitle: string;
  sectionDesc: string;
}) {
  const [active, setActive] = useState(jurusan[0]?.slug ?? "");
  const activeJurusan = jurusan.find((j) => j.slug === active) ?? jurusan[0];

  return (
    <section className="program-section" id="program">
      <div className="section-inner">
        <FadeUp
          className="section-head"
          style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 2.5rem" }}
        >
          <div className="section-label">{sectionLabel}</div>
          <h2 className="section-title">{sectionTitle}</h2>
          <p className="section-desc" style={{ margin: "auto" }}>
            {sectionDesc}
          </p>
        </FadeUp>

        <FadeUp className="prodi-tabs">
          {jurusan.map((j) => (
            <button
              key={j.slug}
              className={`prodi-tab ${active === j.slug ? "active" : ""}`}
              onClick={() => setActive(j.slug)}
            >
              <span>{j.icon}</span> {j.nama}
            </button>
          ))}
        </FadeUp>

        {activeJurusan && (
          <div className="prodi-panel active">
            <div className="prodi-visual">
              {activeJurusan.gambar_url && (
                <div className="prodi-visual-bg">
                  <Image
                    src={activeJurusan.gambar_url}
                    alt={activeJurusan.nama}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
              <div className="prodi-visual-overlay" />
              <div className="prodi-visual-caption">
                <div className="prodi-visual-badge">
                  {activeJurusan.label_badge}
                </div>
                <div className="prodi-visual-title">{activeJurusan.nama}</div>
              </div>
            </div>
            <div className="prodi-detail">
              <div className="prodi-label">Kompetensi Keahlian</div>
              <div className="prodi-title">{activeJurusan.nama}</div>
              <p className="section-desc" style={{ marginBottom: "1rem" }}>
                {activeJurusan.deskripsi}
              </p>
              <div className="prodi-mapel-heading">Materi Pokok Utama</div>
              <div className="prodi-mapel-grid">
                {(activeJurusan.materi ?? []).map((materi) => (
                  <div className="prodi-mapel-item" key={materi}>
                    {materi}
                  </div>
                ))}
              </div>
              <div className="prodi-cta-box">
                <Link
                  href={getJurusanHref(activeJurusan.slug)}
                  className="map-btn"
                >
                  Selengkapnya →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
