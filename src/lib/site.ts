/** URL publik situs, dipakai untuk metadataBase & og:url di semua halaman
 *  supaya konsisten (sama seperti yang dipakai di layout.tsx). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://smkn3kdi.sch.id";

export const SITE_NAME = "SMK Negeri 3 Kendari";

/** Gambar og:image fallback kalau halaman tidak punya gambar sendiri
 *  (mis. Halaman Statis) — sama seperti default di layout.tsx. */
export const DEFAULT_OG_IMAGE = {
  url: "/images/hero-perhotelan.jpg",
  width: 1600,
  height: 900,
};
