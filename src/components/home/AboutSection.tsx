import FadeUp from "@/components/shared/FadeUp";
import { getSiteSettings } from "@/lib/queries";

export default async function AboutSection() {
  const settings = await getSiteSettings();
  const paragraphs = settings.kepala_sambutan
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="about-section" id="profil">
      <div className="section-inner">
        <div className="about-grid">
          <FadeUp>
            <div className="kepala-visual-card">
              <div
                className="kepala-photo-render"
                style={{ backgroundImage: `url('${settings.kepala_foto}')` }}
              />
              <div className="kepala-blue-overlay" />
              <div className="kepala-blue-gradient" />
              <div className="kepala-caption-area">
                <h3 className="kepala-title-name">{settings.nama_sekolah}</h3>
                <p className="kepala-subtitle-role">{settings.tagline}</p>
              </div>
            </div>
          </FadeUp>

          <FadeUp>
            <div className="section-label">Sambutan Kepala Sekolah</div>
            <h2 className="section-title">{settings.kepala_judul}</h2>
            {settings.kepala_kutipan && (
              <blockquote className="sambutan-quote">&quot;{settings.kepala_kutipan}&quot;</blockquote>
            )}
            {paragraphs.map((p, i) => (
              <p className="about-paragraph" key={i}>
                {p}
              </p>
            ))}
            <div className="about-signature">
              Hormat kami,
              <br />
              <strong>{settings.kepala_nama}</strong>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
