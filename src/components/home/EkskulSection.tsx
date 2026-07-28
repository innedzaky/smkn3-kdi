import { ekskulList } from "@/data/fallback";
import FadeUp from "@/components/shared/FadeUp";

export default function EkskulSection() {
  return (
    <section className="ekskul-section" id="ekskul">
      <div className="section-inner">
        <FadeUp
          className="section-head"
          style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 2rem" }}
        >
          <div className="section-label">Pengembangan Diri</div>
          <h2 className="section-title">Ekstrakurikuler</h2>
          <p className="section-desc" style={{ margin: "auto" }}>
            Wadah pengembangan bakat, minat, dan karakter siswa di luar
            pembelajaran akademik yang mendukung kompetensi kejuruan.
          </p>
        </FadeUp>

        <div className="ekskul-grid">
          {ekskulList.map((item) => (
            <FadeUp className="ekskul-card" key={item.nama}>
              <div className="ekskul-icon">{item.icon}</div>
              <div className="ekskul-name">{item.nama}</div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
