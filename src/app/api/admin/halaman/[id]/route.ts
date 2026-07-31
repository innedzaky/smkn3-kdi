import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminUpdateHalaman, adminDeleteHalaman } from "@/lib/admin-queries";

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  if (!body.judul || !body.slug) {
    return NextResponse.json({ error: "Judul dan slug wajib diisi" }, { status: 400 });
  }
  try {
    await adminUpdateHalaman(Number(params.id), body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const msg = err.code === "ER_DUP_ENTRY" ? "Slug sudah dipakai halaman lain" : err.message;
    return NextResponse.json({ error: msg || "Gagal menyimpan" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  await adminDeleteHalaman(Number(params.id));
  return NextResponse.json({ ok: true });
}
