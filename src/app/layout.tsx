import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://smkn3kdi.sch.id";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SMK Negeri 3 Kendari — Sekolah Pusat Keunggulan",
    template: "%s — SMK Negeri 3 Kendari",
  },
  description:
    "Official Website Resmi SMK Negeri 3 Kendari. Pusat pendidikan kejuruan pariwisata dan teknologi informasi terkemuka.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "SMK Negeri 3 Kendari — Sekolah Pusat Keunggulan",
    description:
      "Official Website Resmi SMK Negeri 3 Kendari. Pusat pendidikan kejuruan pariwisata dan teknologi informasi terkemuka.",
    images: [
      {
        url: "/images/hero-perhotelan.jpg",
        width: 1600,
        height: 900,
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
