import "server-only";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import type { AdminUser } from "@/lib/types";

/**
 * Pastikan request API berasal dari admin yang sudah login.
 * Kembalikan user jika valid, atau NextResponse 401 jika tidak.
 */
export async function requireAdmin(): Promise<AdminUser | NextResponse> {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return user;
}

export function isResponse(x: unknown): x is NextResponse {
  return x instanceof NextResponse;
}
