import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBeritaBySlug } from "@/lib/queries";
import { SITE_URL, SITE_NAME } from "@/lib/site";

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

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const berita = await getBeritaBySlug(params.slug);
  if (!berita) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: berita.judul,
    description: berita.deskripsi,
    openGraph: {
      type: "article",
      url: `${SITE_URL}/artikel/${berita.slug}`,
      siteName: SITE_NAME,
      title: berita.judul,
      description: berita.deskripsi,
      images: berita.gambar ? [{ url: berita.gambar }] : undefined,
    },
  };
}

export default async function ArtikelDetailPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
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
            <div className="artikel-cover">
              <Image
                src={berita.gambar}
                alt={berita.judul}
                fill
                sizes="(max-width: 900px) 100vw, 900px"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          )}

          <div
            className="artikel-body"
            dangerouslySetInnerHTML={{ __html: berita.konten || berita.deskripsi }}
          />

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
