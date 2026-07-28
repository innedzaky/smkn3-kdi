import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminGetGaleri, adminCreateGaleri } from "@/lib/admin-queries";

export async function GET() {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const data = await adminGetGaleri();
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  await adminCreateGaleri(body);
  return NextResponse.json({ ok: true });
}
