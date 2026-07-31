/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // <-- Ditambahkan untuk ekspor aplikasi ringan tanpa node_modules penuh

  images: {
    // Sebagian besar gambar disimpan sebagai path relatif (/images/...),
    // tapi ada data lama di database yang menyimpan URL absolut ke domain
    // produksi (https://smkn3kdi.sch.id/images/...). next/image menolak
    // domain luar yang belum didaftarkan di sini, jadi domain resmi
    // sekolah perlu diizinkan supaya gambar itu tetap bisa dimuat baik di
    // lokal maupun production.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "smkn3kdi.sch.id",
      },
    ],
  },

  async headers() {
    // Header keamanan HTTP diterapkan ke semua route.
    // CATATAN:
    // - script-src & style-src pakai 'unsafe-inline' karena Next.js (App Router)
    //   mengandalkan <script> inline untuk streaming data server component ->
    //   client component (hydration), dan styled-jsx menyuntik <style> inline.
    // - 'unsafe-eval' HANYA ditambahkan saat development, karena React Fast
    //   Refresh (hot-reload di `next dev`) memakai eval(). Production build
    //   (`next build && next start`) tidak butuh eval, jadi tetap strict di sana.
    const isDev = process.env.NODE_ENV !== "production";
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Gambar di public/images/ tidak pernah berubah nama filenya saat
        // diedit (ditimpa di tempat), jadi aman diberi cache jangka panjang
        // di sisi browser -> menghemat ~835 KiB re-download di kunjungan
        // berikutnya (temuan Lighthouse/PageSpeed).
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;