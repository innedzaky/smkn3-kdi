import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/shared/PageHero";
import { getGaleri } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Galeri Kegiatan",
  description: "Dokumentasi kegiatan siswa dan sekolah SMK Negeri 3 Kendari.",
};

export const revalidate = 60;

export default async function GaleriKegiatanPage() {
  const galeri = await getGaleri();

  return (
    <main className="content-page">
      <PageHero
        label="Dokumentasi"
        title="Galeri Kegiatan"
        breadcrumb="Galeri Kegiatan"
      />

      <section>
        <div className="section-inner">
          <div className="galeri-full-grid">
            {galeri.length === 0 && (
              <div className="skeleton-loader">Belum ada foto kegiatan.</div>
            )}
            {galeri.map((item) => (
              <div className="galeri-card" key={item.id}>
                <div className="galeri-img">
                  <Image
                    src={item.link_foto}
                    alt={item.judul_kegiatan}
                    fill
                    sizes="(max-width: 700px) 50vw, 280px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="galeri-overlay" />
                <div className="galeri-body">
                  <h4>{item.judul_kegiatan}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
