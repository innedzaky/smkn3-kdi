import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminUpdateJurusanChip, adminDeleteJurusanChip } from "@/lib/admin-queries";

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  if (!body.jurusan_id || !body.teks || !body.kategori) {
    return NextResponse.json({ error: "Jurusan, kategori, dan teks wajib diisi" }, { status: 400 });
  }
  try {
    await adminUpdateJurusanChip(Number(params.id), body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menyimpan" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  await adminDeleteJurusanChip(Number(params.id));
  return NextResponse.json({ ok: true });
}
