import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import PageHero from "@/components/shared/PageHero";
import BrosurSlider from "@/components/shared/BrosurSlider";
import { getJurusan, getJurusanBySlug } from "@/lib/queries";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/site";

export const revalidate = 60;

export async function generateStaticParams() {
  const jurusan = await getJurusan();
  return jurusan.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const jurusan = await getJurusanBySlug(params.slug);
  if (!jurusan) return { title: "Jurusan Tidak Ditemukan" };
  return {
    title: jurusan.nama,
    description: jurusan.deskripsi,
    openGraph: {
      type: "website",
      url: `${SITE_URL}/jurusan/${jurusan.slug}`,
      siteName: SITE_NAME,
      title: jurusan.nama,
      description: jurusan.deskripsi,
      images: jurusan.gambar_url
        ? [{ url: jurusan.gambar_url }]
        : [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function JurusanDetailPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const jurusan = await getJurusanBySlug(params.slug);
  if (!jurusan) notFound();

  const skills = jurusan.skills ?? [];
  const materi = jurusan.materi ?? [];
  const fasilitas = jurusan.fasilitas ?? [];
  const karier = jurusan.karier ?? [];
  const kegiatan = jurusan.kegiatan ?? [];
  const karya = jurusan.karya ?? [];
  const guru = jurusan.guru ?? [];
  const brosurDepan = jurusan.brosur_depan_url || null;
  const brosurBelakang = jurusan.brosur_belakang_url || null;

  return (
    <main className="content-page">
      <PageHero
        label="Kompetensi Keahlian"
        title={jurusan.nama}
        breadcrumb={jurusan.nama}
      />

      <section>
        <div className="section-inner">
          <div className="jurusan-cover jurusan-cover-tall">
            {jurusan.gambar_url && (
              <Image
                src={jurusan.gambar_url}
                alt={jurusan.nama}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                style={{ objectFit: "cover" }}
                priority
              />
            )}
            <div className="jurusan-cover-overlay" />
            <div className="jurusan-cover-text">
              <span className="jurusan-cover-badge">{jurusan.label_badge}</span>
              <h2 className="jurusan-cover-title">{jurusan.nama}</h2>
              {jurusan.hero_subtitle && (
                <p className="jurusan-cover-subtitle">{jurusan.hero_subtitle}</p>
              )}
              <div className="jurusan-cover-links">
                {skills.length > 0 && <a href="#keterampilan">Keterampilan</a>}
                {kegiatan.length > 0 && <a href="#galeri-kegiatan">Galeri Kegiatan</a>}
                {karya.length > 0 && <a href="#galeri-karya">Karya Siswa</a>}
                {guru.length > 0 && <a href="#guru-jurusan">Guru Jurusan</a>}
                {(brosurDepan || brosurBelakang) && <a href="#brosur-jurusan">Brosur Jurusan</a>}
              </div>
            </div>
          </div>

          <p className="section-desc" style={{ maxWidth: "none", marginBottom: "2.5rem" }}>
            {jurusan.deskripsi}
          </p>

          {skills.length > 0 && (
            <>
              <h2 className="spmb-section-title" id="keterampilan">
                🎨 Keterampilan yang Dikuasai
              </h2>
              <div className="jurusan-skills-grid" style={{ marginBottom: "2.5rem" }}>
                {skills.map((skill) => (
                  <div className="jurusan-skill-card" key={skill.id}>
                    <div className="jurusan-skill-icon">{skill.icon}</div>
                    <h4>{skill.judul}</h4>
                    {skill.deskripsi && <p>{skill.deskripsi}</p>}
                  </div>
                ))}
              </div>
            </>
          )}

          {(materi.length > 0 || fasilitas.length > 0 || karier.length > 0) && (
            <div className="jurusan-two-col">
              {materi.length > 0 && (
                <div>
                  <h2 className="spmb-section-title" style={{ margin: "0 0 1rem" }}>
                    Materi Pokok Utama
                  </h2>
                  <div className="jurusan-chip-list">
                    {materi.map((m) => (
                      <span className="jurusan-chip" key={m}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {fasilitas.length > 0 && (
                <div>
                  <h2 className="spmb-section-title" style={{ margin: "0 0 1rem" }}>
                    🏭 Fasilitas Lengkap &amp; Modern
                  </h2>
                  <div className="jurusan-chip-list">
                    {fasilitas.map((f) => (
                      <span className="jurusan-chip" key={f}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {karier.length > 0 && (
                <div>
                  <h2 className="spmb-section-title" style={{ margin: "0 0 1rem" }}>
                    💼 Peluang Karier Lulusan
                  </h2>
                  <div className="jurusan-chip-list">
                    {karier.map((k) => (
                      <span className="jurusan-chip" key={k}>
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {kegiatan.length > 0 && (
            <>
              <h2 className="spmb-section-title" id="galeri-kegiatan">
                📸 Galeri Kegiatan Siswa
              </h2>
              <div className="galeri-full-grid" style={{ marginBottom: "2.5rem" }}>
                {kegiatan.map((item) => (
                  <div className="galeri-card" key={item.id}>
                    <div className="galeri-img">
                      <Image
                        src={item.foto}
                        alt={item.judul}
                        fill
                        sizes="(max-width: 700px) 50vw, 280px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="galeri-overlay" />
                    <div className="galeri-body">
                      <h4>{item.judul}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {karya.length > 0 && (
            <>
              <h2 className="spmb-section-title" id="galeri-karya">
                👗 Galeri Karya Siswa
              </h2>
              <div className="galeri-full-grid" style={{ marginBottom: "2.5rem" }}>
                {karya.map((item) => (
                  <div className="galeri-card" key={item.id}>
                    <div className="galeri-img">
                      <Image
                        src={item.foto}
                        alt={item.judul}
                        fill
                        sizes="(max-width: 700px) 50vw, 280px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="galeri-overlay" />
                    <div className="galeri-body">
                      <h4>{item.judul}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {guru.length > 0 && (
            <>
              <h2 className="spmb-section-title" id="guru-jurusan">
                🧑‍🏫 Guru Jurusan
              </h2>
              <div className="jurusan-guru-grid" style={{ marginBottom: "2.5rem" }}>
                {guru.map((g) => (
                  <div className="jurusan-guru-card" key={g.id}>
                    <div className="jurusan-guru-photo">
                      {g.foto && (
                        <Image
                          src={g.foto}
                          alt={g.nama}
                          fill
                          sizes="96px"
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </div>
                    <h4>{g.nama}</h4>
                    {g.jabatan && <p>{g.jabatan}</p>}
                  </div>
                ))}
              </div>
            </>
          )}

          {(brosurDepan || brosurBelakang) && (
            <>
              <h2 className="spmb-section-title" id="brosur-jurusan">
                📄 Brosur Jurusan
              </h2>
              {brosurDepan && brosurBelakang ? (
                <>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <BrosurSlider depan={brosurDepan} belakang={brosurBelakang} />
                  </div>
                  <div className="brosur-download-group" style={{ marginBottom: "2.5rem" }}>
                    <a href={brosurDepan} download className="btn-primary" style={{ background: "var(--navy)" }}>
                      ⬇️ Unduh Halaman Depan
                    </a>
                    <a href={brosurBelakang} download className="btn-primary">
                      ⬇️ Unduh Halaman Belakang
                    </a>
                  </div>
                </>
              ) : (
                <div className="brosur-download-group" style={{ marginBottom: "2.5rem" }}>
                  <a
                    href={(brosurDepan || brosurBelakang) as string}
                    download
                    className="btn-primary"
                    style={{ background: "var(--navy)" }}
                  >
                    ⬇️ Unduh Brosur
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
