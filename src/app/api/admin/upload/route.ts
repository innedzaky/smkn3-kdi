import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminCreateMedia } from "@/lib/admin-queries";
import { optimizeImage } from "@/lib/image-optimize";
import fs from "fs/promises";
import path from "path";

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_DOC = ["application/pdf"];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB — dicek SEBELUM dikompres
const MAX_DOC_SIZE = 5 * 1024 * 1024; // 5MB — untuk file non-gambar (PDF), tidak dikompres

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;

  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
  }

  const isImage = ALLOWED_IMAGE.includes(file.type);
  const isDoc = ALLOWED_DOC.includes(file.type);

  if (!isImage && !isDoc) {
    return NextResponse.json({ error: "Format file tidak didukung" }, { status: 400 });
  }
  if (isImage && file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: "Ukuran gambar maksimal 2MB" }, { status: 400 });
  }
  if (isDoc && file.size > MAX_DOC_SIZE) {
    return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
  }

  const rawBuffer = Buffer.from(await file.arrayBuffer());

  let finalBuffer: Buffer = rawBuffer;
  let finalMime = file.type;
  let finalExt = path.extname(file.name) || (isImage ? ".jpg" : ".pdf");

  if (isImage) {
    try {
      // Kompres otomatis ke WebP, target di bawah 80KB dengan kualitas
      // tetap jelas (kualitas diturunkan bertahap hanya sejauh perlu).
      const optimized = await optimizeImage(rawBuffer, file.type);
      finalBuffer = optimized.buffer;
      finalMime = optimized.mimeType;
      finalExt = optimized.ext;
    } catch {
      // Kalau optimasi gagal (file gambar rusak/format tak terduga),
      // simpan file asli saja daripada menggagalkan upload.
    }
  }

  const safeBase = path
    .basename(file.name, path.extname(file.name))
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .slice(0, 40);
  const fileName = `${Date.now()}-${safeBase || "upload"}${finalExt}`;

  const targetDir = path.join(process.cwd(), "public", "images");
  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(path.join(targetDir, fileName), new Uint8Array(finalBuffer));

  const url = `/images/${fileName}`;

  let mediaId = 0;
  try {
    mediaId = await adminCreateMedia({
      file_name: fileName,
      original_name: file.name,
      url,
      mime_type: finalMime,
      size: finalBuffer.length,
      uploaded_by: user.id,
    });
  } catch {
    // File sudah tersimpan di disk; kegagalan catat ke tabel media tidak
    // menggagalkan upload (misalnya migration_media.sql belum dijalankan).
  }

  return NextResponse.json({ url, id: mediaId, name: file.name, size: finalBuffer.length });
}
