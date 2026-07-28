import type { Prestasi } from "@/lib/types";
import FadeUp from "@/components/shared/FadeUp";

export default function PrestasiSection({ prestasi }: { prestasi: Prestasi[] }) {
  return (
    <section className="prestasi-section" id="prestasi">
      <div className="section-inner">
        <FadeUp
          className="section-head"
          style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 3rem" }}
        >
          <div className="section-label">Kebanggaan Sekolah</div>
          <h2 className="section-title">Prestasi Siswa Terbaru</h2>
          <p className="section-desc" style={{ margin: "auto" }}>
            Pencapaian luar biasa siswa siswi dalam ajang Lomba Kompetensi
            Siswa (LKS) tingkat regional maupun nasional.
          </p>
        </FadeUp>

        <div className="prestasi-grid">
          {prestasi.length === 0 && (
            <div className="skeleton-loader">Belum ada data prestasi.</div>
          )}
          {prestasi.map((item) => (
            <FadeUp className="prestasi-card" key={item.id}>
              <div className="trophy">{item.emoji}</div>
              <h3>{item.nama}</h3>
              <span className="bidang">{item.bidang}</span>
              <p>{item.keterangan}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
