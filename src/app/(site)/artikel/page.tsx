import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/shared/PageHero";
import { getBerita } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Berita & Artikel",
  description:
    "Kumpulan berita, artikel, dan informasi terbaru seputar kegiatan SMK Negeri 3 Kendari.",
};

export const revalidate = 60;

export default async function ArtikelListPage() {
  const berita = await getBerita();

  return (
    <main className="content-page">
      <PageHero
        label="Pembaruan Informasi"
        title="Berita & Artikel"
        breadcrumb="Artikel"
      />

      <section>
        <div className="section-inner">
          <div className="news-list news-list-3col">
            {berita.length === 0 && (
              <div className="news-empty">Belum ada berita yang dipublikasikan.</div>
            )}
            {berita.map((item) => (
              <Link href={`/artikel/${item.slug}`} className="news-card" key={item.id}>
                <div className="news-visual-area">
                  {item.gambar ? (
                    <Image
                      src={item.gambar}
                      alt={item.judul}
                      fill
                      sizes="(max-width: 700px) 100vw, 380px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    "📰"
                  )}
                </div>
                <div className="news-card-body">
                  <span className="news-tag">{item.kategori || "Sekolah"}</span>
                  <h3 className="news-title">{item.judul}</h3>
                  <p className="news-excerpt">{item.deskripsi}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
