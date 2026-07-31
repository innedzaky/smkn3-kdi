import Link from "next/link";

export default function NotFound() {
  return (
    <main className="content-page">
      <div className="page-hero">
        <div className="section-inner">
          <div className="section-label">404</div>
          <h1 className="section-title">Halaman Tidak Ditemukan</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", maxWidth: 500, margin: "0 auto" }}>
            Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
          </p>
        </div>
      </div>
      <section style={{ textAlign: "center" }}>
        <div className="section-inner">
          <Link href="/" className="btn-primary" style={{ background: "var(--navy)" }}>
            ← Kembali ke Beranda
          </Link>
        </div>
      </section>
    </main>
  );
}
