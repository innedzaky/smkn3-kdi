import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import { visiSekolah, maknaVisi, misiSekolah } from "@/data/pages-content";

export const metadata: Metadata = {
  title: "Visi dan Misi Sekolah",
  description: "Visi dan misi resmi SMK Negeri 3 Kendari.",
};

export default function VisiMisiPage() {
  return (
    <main className="content-page">
      <PageHero
        label="Profil Sekolah"
        title="Visi & Misi Sekolah"
        breadcrumb="Visi & Misi"
      />

      <section>
        <div className="section-inner content-prose">
          <h2 style={{ marginTop: 0 }}>Visi</h2>
          <div className="intro-box" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.15rem" }}>
            &quot;{visiSekolah}&quot;
          </div>

          <div className="visi-misi-block">
            {maknaVisi.map((item) => (
              <div className="vm-item" key={item.judul}>
                <div className="vm-icon">🎯</div>
                <div className="vm-body">
                  <h4>{item.judul}</h4>
                  <p>{item.teks}</p>
                </div>
              </div>
            ))}
          </div>

          <h2>Misi</h2>
          <ul className="misi-list">
            {misiSekolah.map((misi, i) => (
              <li key={misi}>
                <span className="misi-number">{String(i + 1).padStart(2, "0")}</span>
                <span>{misi}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
