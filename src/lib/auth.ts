import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { query } from "@/lib/db";
import type { AdminUser } from "@/lib/types";

export const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

const DEV_FALLBACK_SECRET = "smkn3-kdi-dev-secret-ganti-ini";

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === "production") {
    // Jangan pernah jalan di production dengan secret default yang ada di source code ini.
    throw new Error(
      "ADMIN_SESSION_SECRET belum di-set. Wajib diisi string acak & rahasia di .env.local sebelum deploy ke production."
    );
  }

  return DEV_FALLBACK_SECRET;
}

/** Hash password dengan scrypt + salt acak. Format simpan: "salt:hash" (hex). */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(new Uint8Array(candidate), new Uint8Array(expected));
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

/** Buat token sesi bertanda-tangan untuk userId tertentu. */
export function createSessionToken(userId: number): string {
  const payload = Buffer.from(
    JSON.stringify({ uid: userId, exp: Date.now() + SESSION_MAX_AGE * 1000 })
  ).toString("base64url");
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

/** Verifikasi token sesi, kembalikan userId jika valid & belum kedaluwarsa. */
export function verifySessionToken(token: string | undefined | null): number | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  if (sign(payload) !== sig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (typeof data.uid !== "number" || typeof data.exp !== "number") return null;
    if (Date.now() > data.exp) return null;
    return data.uid;
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: number) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Ambil data user yang sedang login dari cookie sesi (untuk Server Component / Route Handler). */
export async function getSessionUser(): Promise<AdminUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const uid = verifySessionToken(token);
  if (!uid) return null;

  try {
    const rows = await query<AdminUser>(
      "SELECT id, name, email, username, role, status, avatar, last_login, created_at FROM users WHERE id = ? AND status = 'Aktif' LIMIT 1",
      [uid]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}
