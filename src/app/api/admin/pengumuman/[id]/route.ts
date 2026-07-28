import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminUpdatePengumuman, adminDeletePengumuman } from "@/lib/admin-queries";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  await adminUpdatePengumuman(Number(params.id), body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  await adminDeletePengumuman(Number(params.id));
  return NextResponse.json({ ok: true });
}
