import { fasilitasList } from "@/data/fallback";
import FadeUp from "@/components/shared/FadeUp";

export default function FasilitasSection() {
  return (
    <section className="fasilitas-section">
      <div className="section-inner">
        <FadeUp
          className="section-head"
          style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 2.5rem" }}
        >
          <div className="section-label">Fasilitas Modern</div>
          <h2 className="section-title">Sarana Prasarana Pusat Keunggulan</h2>
        </FadeUp>
        <div className="fasilitas-grid">
          {fasilitasList.map((item) => (
            <div className="fasilitas-item" key={item.judul}>
              <div className="fi-icon">{item.icon}</div>
              <h4>{item.judul}</h4>
              <p>{item.deskripsi}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
