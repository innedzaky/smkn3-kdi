import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminGetHeroSlide, adminCreateHeroSlide } from "@/lib/admin-queries";

export async function GET() {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const data = await adminGetHeroSlide();
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  if (!body.badge || !body.title || !body.gambar) {
    return NextResponse.json({ error: "Badge, judul, dan gambar wajib diisi" }, { status: 400 });
  }
  try {
    await adminCreateHeroSlide(body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menyimpan slide" }, { status: 400 });
  }
}
