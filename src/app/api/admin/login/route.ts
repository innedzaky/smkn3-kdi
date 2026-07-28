import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const LOGIN_LIMIT = 5; // maksimal 5 percobaan
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // per 15 menit per IP

export async function POST(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const ip = getClientIp(req);
  const limitResult = rateLimit(`login:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);

  if (!limitResult.allowed) {
    return NextResponse.redirect(`${origin}/admin/login?error=ratelimit`, { status: 303 });
  }

  const form = await req.formData();
  const username = String(form.get("username") || "").trim();
  const password = String(form.get("password") || "");

  if (!username || !password) {
    return NextResponse.redirect(`${origin}/admin/login?error=1`, { status: 303 });
  }

  try {
    const rows = await query<{ id: number; password_hash: string; status: string }>(
      "SELECT id, password_hash, status FROM users WHERE username = ? LIMIT 1",
      [username]
    );
    const user = rows[0];

    if (!user || user.status !== "Aktif" || !verifyPassword(password, user.password_hash)) {
      return NextResponse.redirect(`${origin}/admin/login?error=1`, { status: 303 });
    }

    await setSessionCookie(user.id);
    await query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]);

    return NextResponse.redirect(`${origin}/admin`, { status: 303 });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.redirect(`${origin}/admin/login?error=db`, { status: 303 });
  }
}
