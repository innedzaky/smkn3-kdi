import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminGetBerita, adminCreateBerita } from "@/lib/admin-queries";

export async function GET() {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const data = await adminGetBerita();
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const body = await req.json();
  try {
    await adminCreateBerita(body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menyimpan" }, { status: 400 });
  }
}
