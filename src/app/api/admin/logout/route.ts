import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await clearSessionCookie();
  return NextResponse.redirect(`${req.nextUrl.origin}/admin/login`, { status: 303 });
}
