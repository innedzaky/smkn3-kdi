import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminGetKategoriBerita, adminRenameKategoriBerita } from "@/lib/admin-queries";

export async function GET() {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const data = await adminGetKategoriBerita();
  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const { oldName, newName } = await req.json();
  if (!oldName || !newName) {
    return NextResponse.json({ error: "Nama kategori tidak valid" }, { status: 400 });
  }
  await adminRenameKategoriBerita(oldName, newName);
  return NextResponse.json({ ok: true });
}
