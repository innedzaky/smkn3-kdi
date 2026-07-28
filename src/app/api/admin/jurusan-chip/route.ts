import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminGetJurusanChip, adminCreateJurusanChip } from "@/lib/admin-queries";

export async function GET() {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const data = await adminGetJurusanChip();
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  if (!body.jurusan_id || !body.teks || !body.kategori) {
    return NextResponse.json({ error: "Jurusan, kategori, dan teks wajib diisi" }, { status: 400 });
  }
  try {
    await adminCreateJurusanChip(body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menyimpan" }, { status: 400 });
  }
}
