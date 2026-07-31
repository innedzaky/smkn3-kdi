import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/site";

// next/font/google mengunduh & meng-host sendiri file font ini saat build
// (self-hosted), sehingga TIDAK ADA request ke fonts.googleapis.com /
// fonts.gstatic.com saat runtime. Ini menghilangkan render-blocking request
// yang disebut di laporan PageSpeed (410-750ms), bukan cuma mempercepatnya
// dengan preconnect.
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display-google",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body-google",
  display: "swap",
});

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
    siteName: SITE_NAME,
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
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${playfairDisplay.variable} ${dmSans.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
