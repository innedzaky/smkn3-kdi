import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminUpdateJurusanSkill, adminDeleteJurusanSkill } from "@/lib/admin-queries";

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  if (!body.jurusan_id || !body.judul) {
    return NextResponse.json({ error: "Jurusan dan nama keterampilan wajib diisi" }, { status: 400 });
  }
  try {
    await adminUpdateJurusanSkill(Number(params.id), body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menyimpan" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  await adminDeleteJurusanSkill(Number(params.id));
  return NextResponse.json({ ok: true });
}
