import Link from "next/link";
import Image from "next/image";
import type { GaleriItem } from "@/lib/types";
import FadeUp from "@/components/shared/FadeUp";

export default function GaleriSection({ galeri }: { galeri: GaleriItem[] }) {
  const items = galeri.slice(0, 5);

  return (
    <section className="galeri-section" id="galeri">
      <div className="section-inner">
        <div
          className="section-head"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div className="section-label">Dokumentasi</div>
            <h2 className="section-title">Galeri Kegiatan</h2>
          </div>
          <Link href="/galeri-kegiatan" className="map-btn">
            Lihat Semua →
          </Link>
        </div>

        <FadeUp className="galeri-grid">
          {items.length === 0 && (
            <div className="skeleton-loader">Belum ada foto kegiatan.</div>
          )}
          {items.map((item) => (
            <div className="galeri-card" key={item.id}>
              <div className="galeri-img">
                <Image
                  src={item.link_foto}
                  alt={item.judul_kegiatan}
                  fill
                  sizes="(max-width: 700px) 50vw, 280px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="galeri-overlay" />
              <div className="galeri-body">
                <h4>{item.judul_kegiatan}</h4>
              </div>
            </div>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}
