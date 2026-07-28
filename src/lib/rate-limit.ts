import "server-only";

/**
 * Rate limiter in-memory sederhana (sliding window per key, mis. per IP).
 * Cukup untuk single-instance deployment (tanpa Redis). Kalau nanti
 * di-deploy multi-instance/serverless, ganti store ini dengan Redis
 * (mis. Upstash) supaya limit konsisten di semua instance.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Bersihkan bucket kedaluwarsa secara berkala supaya memori tidak terus tumbuh.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * @param key Identitas pemohon (biasanya IP, bisa digabung dengan route name).
 * @param limit Jumlah maksimal request yang diizinkan dalam window.
 * @param windowMs Panjang window dalam milidetik.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

/** Ambil IP pemohon dari header standar proxy (Vercel/Nginx) dengan fallback aman. */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
