import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHalamanBySlug } from "@/lib/queries";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const halaman = await getHalamanBySlug(params.slug);
  if (!halaman) return { title: "Halaman Tidak Ditemukan" };

  return {
    title: halaman.judul,
    description: halaman.deskripsi || undefined,
    openGraph: {
      type: "website",
      url: `${SITE_URL}/halaman/${halaman.slug}`,
      siteName: SITE_NAME,
      title: halaman.judul,
      description: halaman.deskripsi || undefined,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function HalamanStatisPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const halaman = await getHalamanBySlug(params.slug);
  if (!halaman) notFound();

  return (
    <main className="content-page">
      <section style={{ paddingBottom: "2rem" }}>
        <div className="section-inner" style={{ maxWidth: 780 }}>
          <h1 className="section-title" style={{ marginBottom: "0.8rem" }}>
            {halaman.judul}
          </h1>
          {halaman.deskripsi && (
            <p className="artikel-meta" style={{ fontSize: "1.05rem" }}>
              {halaman.deskripsi}
            </p>
          )}
          <div
            className="artikel-body"
            dangerouslySetInnerHTML={{ __html: halaman.konten || "" }}
          />
        </div>
      </section>
    </main>
  );
}
