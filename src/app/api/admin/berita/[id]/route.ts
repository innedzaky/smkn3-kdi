import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminUpdateBerita, adminDeleteBerita } from "@/lib/admin-queries";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  try {
    await adminUpdateBerita(Number(params.id), body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menyimpan" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  await adminDeleteBerita(Number(params.id));
  return NextResponse.json({ ok: true });
}
