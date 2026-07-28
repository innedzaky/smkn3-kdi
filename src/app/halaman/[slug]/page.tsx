import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHalamanBySlug } from "@/lib/queries";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const halaman = await getHalamanBySlug(params.slug);
  if (!halaman) return { title: "Halaman Tidak Ditemukan" };

  return {
    title: halaman.judul,
    description: halaman.deskripsi || undefined,
  };
}

export default async function HalamanStatisPage({
  params,
}: {
  params: { slug: string };
}) {
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
          <div className="artikel-body">{halaman.konten}</div>
        </div>
      </section>
    </main>
  );
}
