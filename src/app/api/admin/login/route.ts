import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const LOGIN_LIMIT = 5; // Maksimal 5 percobaan login
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 menit per IP

// URL publik aplikasi production.
// Diambil dari environment variable APP_URL.
// Jika APP_URL belum tersedia, gunakan domain production sebagai fallback.
const APP_URL =
  process.env.APP_URL || "https://smkn3kdi.sch.id";

export async function POST(req: NextRequest) {
  // Jangan gunakan req.nextUrl.origin karena di server
  // LiteSpeed/Node.js dapat menghasilkan 0.0.0.0:3000.
  const origin = APP_URL.replace(/\/$/, "");

  // Ambil IP client untuk rate limiting
  const ip = getClientIp(req);

  // Batasi percobaan login
  const limitResult = rateLimit(
    `login:${ip}`,
    LOGIN_LIMIT,
    LOGIN_WINDOW_MS
  );

  // Jika melebihi batas percobaan login
  if (!limitResult.allowed) {
    return NextResponse.redirect(
      `${origin}/admin/login?error=ratelimit`,
      { status: 303 }
    );
  }

  // Ambil data form login
  const form = await req.formData();

  const username = String(
    form.get("username") || ""
  ).trim();

  const password = String(
    form.get("password") || ""
  );

  // Validasi username dan password
  if (!username || !password) {
    return NextResponse.redirect(
      `${origin}/admin/login?error=1`,
      { status: 303 }
    );
  }

  try {
    // Cari user berdasarkan username
    const rows = await query<{
      id: number;
      password_hash: string;
      status: string;
    }>(
      `
      SELECT
        id,
        password_hash,
        status
      FROM users
      WHERE username = ?
      LIMIT 1
      `,
      [username]
    );

    const user = rows[0];

    // Validasi user dan password
    if (
      !user ||
      user.status !== "Aktif" ||
      !verifyPassword(
        password,
        user.password_hash
      )
    ) {
      return NextResponse.redirect(
        `${origin}/admin/login?error=1`,
        { status: 303 }
      );
    }

    // Buat session login
    await setSessionCookie(user.id);

    // Simpan waktu login terakhir
    await query(
      "UPDATE users SET last_login = NOW() WHERE id = ?",
      [user.id]
    );

    // Login berhasil → masuk ke dashboard admin
    return NextResponse.redirect(
      `${origin}/admin`,
      { status: 303 }
    );
  } catch (err) {
    // Catat error di server
    console.error("Login error:", err);

    // Redirect ke halaman login dengan error database
    return NextResponse.redirect(
      `${origin}/admin/login?error=db`,
      { status: 303 }
    );
  }
}