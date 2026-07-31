import HeroSlider from "@/components/home/HeroSlider";
import AboutSection from "@/components/home/AboutSection";
import ProgramTabs from "@/components/home/ProgramTabs";
import PrestasiSection from "@/components/home/PrestasiSection";
import BeritaSection from "@/components/home/BeritaSection";
import FasilitasSection from "@/components/home/FasilitasSection";
import EkskulSection from "@/components/home/EkskulSection";
import GaleriSection from "@/components/home/GaleriSection";
import KontakSection from "@/components/home/KontakSection";
import {
  getAgenda,
  getBerita,
  getGaleri,
  getHeroSlides,
  getJurusan,
  getPengumumanAktif,
  getPrestasi,
  getSiteSettings,
} from "@/lib/queries";

// Data diambil ulang secara berkala (revalidate) agar konten dari MySQL
// (berita, prestasi, galeri, agenda) selalu segar tanpa perlu rebuild.
export const revalidate = 60;

export default async function HomePage() {
  const [slides, prestasi, berita, agenda, pengumuman, galeri, jurusan, settings] =
    await Promise.all([
      getHeroSlides(),
      getPrestasi(),
      getBerita(),
      getAgenda(),
      getPengumumanAktif(),
      getGaleri(),
      getJurusan(),
      getSiteSettings(),
    ]);

  return (
    <main>
      <HeroSlider slides={slides} />
      <AboutSection />
      <ProgramTabs
        jurusan={jurusan}
        sectionLabel={settings.program_label}
        sectionTitle={settings.program_judul}
        sectionDesc={settings.program_deskripsi}
      />
      <PrestasiSection prestasi={prestasi} />
      <BeritaSection berita={berita} agenda={agenda} pengumuman={pengumuman} />
      <FasilitasSection />
      <EkskulSection />
      <GaleriSection galeri={galeri} />
      <KontakSection />
    </main>
  );
}
