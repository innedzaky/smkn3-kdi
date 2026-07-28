import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminChangeOwnPassword } from "@/lib/admin-queries";

export async function PUT(req: NextRequest) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;

  const { currentPassword, newPassword, confirmPassword } = await req.json();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json({ error: "Semua kolom password wajib diisi" }, { status: 400 });
  }
  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: "Konfirmasi password baru tidak cocok" }, { status: 400 });
  }

  try {
    await adminChangeOwnPassword(user.id, currentPassword, newPassword);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal mengubah password" }, { status: 400 });
  }
}
