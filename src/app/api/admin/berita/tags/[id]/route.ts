import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminRenameTag, adminDeleteTag } from "@/lib/admin-queries";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const { nama } = await req.json();
  if (!nama || !nama.trim()) {
    return NextResponse.json({ error: "Nama tag tidak boleh kosong" }, { status: 400 });
  }
  try {
    await adminRenameTag(Number(params.id), nama);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menyimpan" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  await adminDeleteTag(Number(params.id));
  return NextResponse.json({ ok: true });
}
