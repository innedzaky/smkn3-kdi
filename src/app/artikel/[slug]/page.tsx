import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBeritaBySlug } from "@/lib/queries";

export const revalidate = 60;

function formatTanggal(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const berita = await getBeritaBySlug(params.slug);
  if (!berita) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: berita.judul,
    description: berita.deskripsi,
    openGraph: {
      title: berita.judul,
      description: berita.deskripsi,
      images: berita.gambar ? [{ url: berita.gambar }] : undefined,
    },
  };
}

export default async function ArtikelDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const berita = await getBeritaBySlug(params.slug);
  if (!berita) notFound();

  return (
    <main className="content-page">
      <section style={{ paddingBottom: "2rem" }}>
        <div className="section-inner" style={{ maxWidth: 780 }}>
          <Link href="/artikel" className="artikel-back-link">
            ← Kembali ke daftar artikel
          </Link>

          <span className="news-tag">{berita.kategori || "Sekolah"}</span>
          <h1
            className="section-title"
            style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}
          >
            {berita.judul}
          </h1>
          <div className="artikel-meta">
            <span>🗓 {formatTanggal(berita.published_at)}</span>
            {berita.penulis && <span>✍️ {berita.penulis}</span>}
          </div>

          {berita.gambar && (
            <div
              className="artikel-cover"
              style={{ backgroundImage: `url('${berita.gambar}')` }}
            />
          )}

          <div className="artikel-body">
            {berita.konten || berita.deskripsi}
          </div>

          {berita.tags && berita.tags.length > 0 && (
            <div className="artikel-tags">
              {berita.tags.map((t) => (
                <span key={t} className="artikel-tag-pill">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
