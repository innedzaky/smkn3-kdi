import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminUpdateJurusanGaleriDetail, adminDeleteJurusanGaleriDetail } from "@/lib/admin-queries";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  if (!body.jurusan_id || !body.judul || !body.foto || !body.kategori) {
    return NextResponse.json({ error: "Jurusan, kategori, judul, dan foto wajib diisi" }, { status: 400 });
  }
  try {
    await adminUpdateJurusanGaleriDetail(Number(params.id), body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menyimpan" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  await adminDeleteJurusanGaleriDetail(Number(params.id));
  return NextResponse.json({ ok: true });
}
