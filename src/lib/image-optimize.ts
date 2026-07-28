import "server-only";
import sharp from "sharp";

/**
 * Target ukuran akhir setelah optimasi. WordPress-style: setiap gambar yang
 * diunggah dikompres otomatis sebelum disimpan permanen di server.
 */
const TARGET_BYTES = 80 * 1024; // 80KB

/**
 * Lebar maksimum awal — gambar sekolah tidak perlu lebih besar dari ini
 * untuk ditampilkan di web (mengurangi kerja kompresi tanpa terasa turun
 * kualitasnya secara visual).
 */
const MAX_INITIAL_WIDTH = 1920;

interface OptimizeResult {
  buffer: Buffer;
  mimeType: string;
  ext: string;
}

/**
 * Kompres gambar ke format WebP sampai ukurannya di bawah TARGET_BYTES,
 * dengan menurunkan kualitas lalu (jika masih belum cukup) memperkecil
 * dimensi secara bertahap. Kualitas dimulai dari tinggi (80) supaya hasil
 * masih terlihat jelas/tajam, baru diturunkan kalau memang perlu.
 *
 * GIF animasi tidak diproses (supaya animasinya tidak rusak) — dikembalikan
 * apa adanya, hanya dibatasi lewat validasi ukuran upload di endpoint.
 */
export async function optimizeImage(input: Buffer, mimeType: string): Promise<OptimizeResult> {
  if (mimeType === "image/gif") {
    return { buffer: input, mimeType, ext: ".gif" };
  }

  const meta = await sharp(input, { failOn: "none" }).metadata();
  const baseWidth = Math.min(meta.width || MAX_INITIAL_WIDTH, MAX_INITIAL_WIDTH);

  const widthSteps = [1, 0.85, 0.7, 0.55, 0.4].map((f) => Math.max(200, Math.round(baseWidth * f)));
  const qualitySteps = [80, 68, 56, 46, 36, 28, 22];

  let smallest: Buffer | null = null;

  for (const width of widthSteps) {
    for (const quality of qualitySteps) {
      const buffer = await sharp(input, { failOn: "none" })
        .rotate() // ikuti orientasi EXIF lalu buang metadatanya
        .resize({ width, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer();

      if (!smallest || buffer.length < smallest.length) smallest = buffer;

      if (buffer.length <= TARGET_BYTES) {
        return { buffer, mimeType: "image/webp", ext: ".webp" };
      }
    }
  }

  // Tidak ada kombinasi yang mencapai target (jarang terjadi untuk gambar
  // biasa) — pakai hasil terkecil yang berhasil didapat.
  return { buffer: smallest as Buffer, mimeType: "image/webp", ext: ".webp" };
}
