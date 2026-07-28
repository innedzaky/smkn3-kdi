import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import {
  sejarahTimeline,
  kepemimpinanLama,
  kepemimpinanBaru,
} from "@/data/pages-content";

export const metadata: Metadata = {
  title: "Sejarah Sekolah",
  description:
    "Perjalanan panjang SMK Negeri 3 Kendari menuju lembaga pendidikan vokasi unggulan.",
};

export default function SejarahPage() {
  return (
    <main className="content-page">
      <PageHero
        label="Profil Sekolah"
        title="Sejarah Sekolah"
        breadcrumb="Sejarah Sekolah"
      />

      <section>
        <div className="section-inner">
          <div className="intro-box">
            Sejarah SMK Negeri 3 Kendari memiliki akar yang kuat dalam
            perkembangan pendidikan kejuruan daerah, mengawal perjalanan
            perubahan dari lembaga keterampilan domestik swasta hingga
            berkembang menjadi satuan pendidikan negeri unggulan.
          </div>

          <div className="timeline">
            {sejarahTimeline.map((item) => (
              <div className="timeline-item" key={item.year}>
                <div className="timeline-dot" />
                <span className="timeline-year">{item.year}</span>
                <div className="timeline-content">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="leadership-section">
            <h2>Nakhoda Jajaran Kepemimpinan</h2>

            <div className="leadership-subheading">
              Masa SKKA / SMKK Negeri Kendari
            </div>
            <ul className="leadership-grid">
              {kepemimpinanLama.map((leader) => (
                <li className="leadership-card" key={leader.nama}>
                  <div className="leader-period">{leader.periode}</div>
                  <div className="leader-name">{leader.nama}</div>
                </li>
              ))}
            </ul>

            <div className="leadership-subheading">
              Masa SMK Negeri 3 Kendari (Gedung Budi Utomo)
            </div>
            <ul className="leadership-grid">
              {kepemimpinanBaru.map((leader) => (
                <li className="leadership-card era-baru" key={leader.nama}>
                  <div className="leader-period">{leader.periode}</div>
                  <div className="leader-name">{leader.nama}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
