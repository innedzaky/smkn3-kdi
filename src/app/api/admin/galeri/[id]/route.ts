import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminUpdateGaleri, adminDeleteGaleri } from "@/lib/admin-queries";

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  await adminUpdateGaleri(Number(params.id), body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  await adminDeleteGaleri(Number(params.id));
  return NextResponse.json({ ok: true });
}
