import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminUpdateUser, adminDeleteUser } from "@/lib/admin-queries";

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  try {
    await adminUpdateUser(Number(params.id), body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const msg = err.code === "ER_DUP_ENTRY" ? "Email atau username sudah dipakai" : err.message;
    return NextResponse.json({ error: msg || "Gagal menyimpan" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  if (user.id === Number(params.id)) {
    return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri" }, { status: 400 });
  }
  await adminDeleteUser(Number(params.id));
  return NextResponse.json({ ok: true });
}
