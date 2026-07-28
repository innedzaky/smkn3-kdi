import FadeUp from "@/components/shared/FadeUp";
import { getSiteSettings } from "@/lib/queries";

export default async function KontakSection() {
  const settings = await getSiteSettings();

  const socialLinks = [
    { url: settings.sosmed_instagram, title: "Instagram", icon: "📷" },
    { url: settings.sosmed_facebook, title: "Facebook", icon: "📘" },
    { url: settings.sosmed_youtube, title: "YouTube Channel", icon: "▶️" },
    { url: settings.sosmed_tiktok, title: "TikTok", icon: "🎵" },
  ].filter((s) => s.url && s.url.trim());

  return (
    <section className="kontak-section" id="kontak">
      <div className="section-inner">
        <FadeUp
          className="section-head"
          style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 1rem" }}
        >
          <div className="section-label">Hubungi Kami</div>
          <h2 className="section-title">Informasi Kontak</h2>
        </FadeUp>

        <FadeUp className="kontak-grid">
          <div className="kontak-item-row">
            <div className="kontak-icon-box">📍</div>
            <div>
              <div className="kontak-label">Alamat</div>
              <div className="kontak-value">{settings.alamat}</div>
            </div>
          </div>

          <div className="kontak-item-row">
            <div className="kontak-icon-box">📞</div>
            <div>
              <div className="kontak-label">Telepon &amp; Email</div>
              <div className="kontak-value">
                {settings.telepon && (
                  <>
                    <a href={`tel:${settings.telepon.replace(/[^0-9+]/g, "")}`}>{settings.telepon}</a>
                    <br />
                  </>
                )}
                {settings.email && (
                  <>
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                    <br />
                  </>
                )}
                Senin – Jumat, 07.00 – 15.00 WITA
              </div>
            </div>
          </div>

          <div className="kontak-item-row">
            <div className="kontak-icon-box">🌐</div>
            <div>
              <div className="kontak-label">Media Sosial &amp; Web</div>
              <div className="kontak-sosmed-list">
                <a
                  href="/"
                  title="Website Utama"
                  className="kontak-sosmed-icon"
                >
                  🌐
                </a>
                {socialLinks.map((s) => (
                  <a
                    key={s.title}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.title}
                    className="kontak-sosmed-icon"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
