import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminGetHalaman, adminCreateHalaman } from "@/lib/admin-queries";

export async function GET() {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const data = await adminGetHalaman();
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  if (!body.judul || !body.slug) {
    return NextResponse.json({ error: "Judul dan slug wajib diisi" }, { status: 400 });
  }
  try {
    await adminCreateHalaman(body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const msg = err.code === "ER_DUP_ENTRY" ? "Slug sudah dipakai halaman lain" : err.message;
    return NextResponse.json({ error: msg || "Gagal menyimpan" }, { status: 400 });
  }
}
