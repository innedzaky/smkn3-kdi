/**
 * Mendaftarkan semua file yang sudah ada di public/images ke tabel `media`,
 * supaya file-file lama (yang diunggah sebelum fitur Pustaka Media dibuat,
 * atau ditaruh manual lewat FTP/cPanel) ikut muncul di menu Media > Perpustakaan.
 *
 * Aman dijalankan berkali-kali — file yang sudah tercatat (dicek dari
 * file_name) dilewati, tidak akan dobel.
 *
 * Cara pakai:
 *   1. Pastikan database/migration_media.sql sudah dijalankan di hosting.
 *   2. npm run db:backfill-media
 */
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
};

async function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

async function main() {
  await loadEnv();

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "smkn3_kdi",
  });

  const imagesDir = path.join(__dirname, "..", "public", "images");
  if (!fs.existsSync(imagesDir)) {
    console.log("Folder public/images tidak ditemukan, tidak ada yang didaftarkan.");
    await connection.end();
    return;
  }

  const [existingRows] = await connection.query("SELECT file_name FROM media");
  const existing = new Set(existingRows.map((r) => r.file_name));

  const files = fs.readdirSync(imagesDir).filter((f) => {
    const full = path.join(imagesDir, f);
    return fs.statSync(full).isFile();
  });

  let added = 0;
  let skipped = 0;

  for (const fileName of files) {
    if (existing.has(fileName)) {
      skipped++;
      continue;
    }

    const ext = path.extname(fileName).toLowerCase();
    const mimeType = MIME_BY_EXT[ext] || null;
    const fullPath = path.join(imagesDir, fileName);
    const stat = fs.statSync(fullPath);
    const url = `/images/${fileName}`;

    await connection.query(
      `INSERT INTO media (file_name, original_name, url, mime_type, size, uploaded_by, created_at)
       VALUES (?, ?, ?, ?, ?, NULL, ?)`,
      [fileName, fileName, url, mimeType, stat.size, stat.mtime]
    );
    added++;
  }

  console.log(`✔ Selesai. ${added} file baru didaftarkan ke Pustaka Media, ${skipped} file dilewati (sudah tercatat).`);
  await connection.end();
}

main().catch((err) => {
  console.error("✘ Gagal backfill media:", err.message);
  process.exit(1);
});
