import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Layout ini HANYA membungkus halaman publik (grup route "(site)").
// Halaman admin (/admin/...) sengaja tidak lewat sini, jadi tidak akan
// pernah menampilkan navbar & footer publik.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
