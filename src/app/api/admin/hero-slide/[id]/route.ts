import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminUpdateHeroSlide, adminDeleteHeroSlide } from "@/lib/admin-queries";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  if (!body.badge || !body.title || !body.gambar) {
    return NextResponse.json({ error: "Badge, judul, dan gambar wajib diisi" }, { status: 400 });
  }
  try {
    await adminUpdateHeroSlide(Number(params.id), body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menyimpan slide" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  await adminDeleteHeroSlide(Number(params.id));
  return NextResponse.json({ ok: true });
}
