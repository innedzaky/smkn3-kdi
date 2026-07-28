import { NextResponse } from "next/server";
import { requireAdmin, isResponse } from "@/lib/api-auth";
import { adminGetMedia } from "@/lib/admin-queries";

export async function GET() {
  const user = await requireAdmin();
  if (isResponse(user)) return user;
  const data = await adminGetMedia();
  return NextResponse.json({ data });
}
