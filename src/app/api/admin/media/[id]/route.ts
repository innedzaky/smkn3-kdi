import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminDeleteMedia, adminUpdateMediaAlt } from "@/lib/admin-queries";
import fs from "fs/promises";
import path from "path";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  await adminUpdateMediaAlt(Number(params.id), body.alt_text || "");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;

  const item = await adminDeleteMedia(Number(params.id));

  // Coba hapus file fisik di public/images. Jika file tidak ada / gagal,
  // abaikan — record di database sudah terhapus, itu yang utama.
  if (item?.file_name) {
    try {
      await fs.unlink(path.join(process.cwd(), "public", "images", item.file_name));
    } catch {
      /* file mungkin sudah tidak ada, tidak masalah */
    }
  }

  return NextResponse.json({ ok: true });
}
