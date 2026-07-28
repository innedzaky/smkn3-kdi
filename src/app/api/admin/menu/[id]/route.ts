import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminUpdateMenu, adminDeleteMenu } from "@/lib/admin-queries";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  if (!body.label || !body.url) {
    return NextResponse.json({ error: "Label dan URL wajib diisi" }, { status: 400 });
  }
  try {
    await adminUpdateMenu(Number(params.id), body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menyimpan menu" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  await adminDeleteMenu(Number(params.id));
  return NextResponse.json({ ok: true });
}
