import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminGetJurusanGaleriDetail, adminCreateJurusanGaleriDetail } from "@/lib/admin-queries";

export async function GET() {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const data = await adminGetJurusanGaleriDetail();
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  if (!body.jurusan_id || !body.judul || !body.foto || !body.kategori) {
    return NextResponse.json({ error: "Jurusan, kategori, judul, dan foto wajib diisi" }, { status: 400 });
  }
  try {
    await adminCreateJurusanGaleriDetail(body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menyimpan" }, { status: 400 });
  }
}
