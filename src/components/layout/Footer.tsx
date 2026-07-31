import Link from "next/link";
import { getSiteSettings } from "@/lib/queries";

export default async function Footer() {
  const settings = await getSiteSettings();

  const socialLinks = [
    { key: "sosmed_facebook", url: settings.sosmed_facebook, label: "Facebook", icon: "📘" },
    { key: "sosmed_instagram", url: settings.sosmed_instagram, label: "Instagram", icon: "📷" },
    { key: "sosmed_youtube", url: settings.sosmed_youtube, label: "YouTube", icon: "▶️" },
    { key: "sosmed_tiktok", url: settings.sosmed_tiktok, label: "TikTok", icon: "🎵" },
  ].filter((s) => s.url && s.url.trim());

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-logo-text">{settings.nama_sekolah}</div>
            <div className="footer-tagline">&quot;{settings.tagline}&quot;</div>
            <p className="footer-about">{settings.footer_about}</p>
            <div style={{ marginTop: "1rem" }}>
              {settings.footer_akreditasi && (
                <span className="footer-accred">{settings.footer_akreditasi}</span>
              )}
            </div>
            {socialLinks.length > 0 && (
              <div className="footer-social">
                {socialLinks.map((s) => (
                  <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="footer-heading">Menu Utama</div>
            <ul className="footer-links">
              <li>
                <Link href="/">Beranda</Link>
              </li>
              <li>
                <Link href="/#profil">Profil Sekolah</Link>
              </li>
              <li>
                <Link href="/#program">Kompetensi Keahlian</Link>
              </li>
              <li>
                <Link href="/#prestasi">Prestasi Siswa</Link>
              </li>
              <li>
                <Link href="/#galeri">Galeri Dokumentasi</Link>
              </li>
              <li>
                <Link href="/#kontak">Hubungi Kami</Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="footer-heading">Kompetensi</div>
            <ul className="footer-links">
              <li>
                <Link href="/jurusan/perhotelan">Perhotelan</Link>
              </li>
              <li>
                <Link href="/jurusan/tata-kecantikan-dan-spa">
                  Tata Kecantikan dan Spa
                </Link>
              </li>
              <li>
                <Link href="/jurusan/kuliner">Kuliner</Link>
              </li>
              <li>
                <Link href="/jurusan/tata-busana">Tata Busana</Link>
              </li>
              <li>
                <Link href="/jurusan/tjkt">
                  Teknik Jaringan Komputer dan Telekomunikasi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="footer-heading">Layanan</div>
            <ul className="footer-links">
              <li>
                <Link href="/spmb">SPMB 2026</Link>
              </li>
              <li>
                <Link href="/artikel">Berita &amp; Artikel</Link>
              </li>
              <li>
                <Link href="/#kontak">Bursa Kerja Khusus (BKK)</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span
            dangerouslySetInnerHTML={{
              __html:
                settings.footer_copyright_html ||
                `© ${new Date().getFullYear()} ${settings.nama_sekolah}. Hak cipta dilindungi undang-undang.`,
            }}
          />
          <span
            dangerouslySetInnerHTML={{
              __html:
                settings.footer_alamat_html ||
                `${settings.alamat}${settings.telepon ? ` — ${settings.telepon}` : ""}`,
            }}
          />
        </div>
      </div>
    </footer>
  );
}
