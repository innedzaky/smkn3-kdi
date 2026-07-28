import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminUpdateOwnProfile } from "@/lib/admin-queries";

export async function PUT(req: NextRequest) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;

  const body = await req.json();
  if (!body.name || !body.email || !body.username) {
    return NextResponse.json({ error: "Nama, email, dan username wajib diisi" }, { status: 400 });
  }

  try {
    await adminUpdateOwnProfile(user.id, body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const msg = err.code === "ER_DUP_ENTRY" ? "Email atau username sudah dipakai" : err.message;
    return NextResponse.json({ error: msg || "Gagal menyimpan" }, { status: 400 });
  }
}
