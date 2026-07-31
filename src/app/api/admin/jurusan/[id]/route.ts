import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminSaveJurusan, adminDeleteJurusan } from "@/lib/admin-queries";

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  try {
    await adminSaveJurusan(Number(params.id), body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menyimpan" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  await adminDeleteJurusan(Number(params.id));
  return NextResponse.json({ ok: true });
}
