"use client";

import { useState } from "react";
import Link from "next/link";
import FadeUp from "@/components/shared/FadeUp";
import type { AgendaItem, Berita, Pengumuman } from "@/lib/types";

const BERITA_PER_HALAMAN = 4;

export default function BeritaSection({
  berita,
  agenda,
  pengumuman,
}: {
  berita: Berita[];
  agenda: AgendaItem[];
  pengumuman: Pengumuman[];
}) {
  const [halaman, setHalaman] = useState(1);
  const totalHalaman = Math.max(1, Math.ceil(berita.length / BERITA_PER_HALAMAN));
  const start = (halaman - 1) * BERITA_PER_HALAMAN;
  const beritaHalamanIni = berita.slice(start, start + BERITA_PER_HALAMAN);

  return (
    <section className="berita-section" id="berita">
      <div className="section-inner">
        <div className="pengumuman-grid">
          <FadeUp>
            <div className="section-head">
              <div className="section-label">Pembaruan Informasi</div>
              <h2 className="section-title">Berita &amp; Artikel Informasi</h2>
            </div>

            <div className="news-list">
              {beritaHalamanIni.length === 0 && (
                <div className="news-empty">Belum ada berita.</div>
              )}
              {beritaHalamanIni.map((item) => (
                <Link
                  href={`/artikel/${item.slug}`}
                  className="news-card"
                  key={item.id}
                >
                  <div
                    className="news-visual-area"
                    style={
                      item.gambar
                        ? { backgroundImage: `url('${item.gambar}')` }
                        : undefined
                    }
                  >
                    {!item.gambar && "📰"}
                  </div>
                  <div className="news-card-body">
                    <span className="news-tag">{item.kategori || "Sekolah"}</span>
                    <h3 className="news-title">{item.judul}</h3>
                    <p className="news-excerpt">{item.deskripsi}</p>
                  </div>
                </Link>
              ))}

              {totalHalaman > 1 && (
                <div className="pagination-container">
                  <button
                    className="pagination-btn"
                    disabled={halaman === 1}
                    onClick={() => setHalaman((h) => h - 1)}
                  >
                    ← Prev
                  </button>
                  <span className="pagination-info">
                    Hal {halaman} / {totalHalaman}
                  </span>
                  <button
                    className="pagination-btn"
                    disabled={halaman === totalHalaman}
                    onClick={() => setHalaman((h) => h + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </FadeUp>

          <FadeUp className="sidebar-layout">
            {pengumuman[0] && (
              <div className="agenda-box pengumuman-theme">
                <div className="agenda-box-title">📢 Pengumuman Resmi</div>
                <div className="agenda-item">
                  <div className="agenda-dot" />
                  <div>
                    <div className="agenda-label">{pengumuman[0].label}</div>
                    <Link href={pengumuman[0].link_url ?? "/spmb"} className="agenda-name">
                      {pengumuman[0].judul}
                    </Link>
                    {pengumuman[0].lokasi && (
                      <div className="agenda-loc">📍 {pengumuman[0].lokasi}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="agenda-box">
              <div className="agenda-box-title">📅 Agenda Sekolah</div>
              {agenda.map((item) => (
                <div className="agenda-item" key={item.id}>
                  <div className="agenda-dot" />
                  <div>
                    <div className="agenda-date">{item.tanggal}</div>
                    {item.link_url ? (
                      <Link href={item.link_url} className="agenda-name">
                        {item.nama}
                      </Link>
                    ) : (
                      <div className="agenda-name">{item.nama}</div>
                    )}
                    {item.lokasi && (
                      <div className="agenda-loc">📍 {item.lokasi}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
