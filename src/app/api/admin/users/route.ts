import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminGetUsers, adminCreateUser } from "@/lib/admin-queries";

export async function GET() {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const data = await adminGetUsers();
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();

  if (!body.name || !body.email || !body.username || !body.password) {
    return NextResponse.json({ error: "Semua kolom wajib diisi" }, { status: 400 });
  }

  try {
    await adminCreateUser(body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const msg = err.code === "ER_DUP_ENTRY" ? "Email atau username sudah dipakai" : err.message;
    return NextResponse.json({ error: msg || "Gagal menyimpan" }, { status: 400 });
  }
}
