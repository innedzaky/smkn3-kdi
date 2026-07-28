import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const user = await getSessionUser();
  if (user) redirect("/admin");

  const error = searchParams?.error;

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-brand-icon">🎓</div>
          <h1>Panel Admin CMS</h1>
          <p>SMK Negeri 3 Kendari</p>
        </div>

        {error && (
          <div className="admin-login-error">
            {error === "db"
              ? "Tidak dapat terhubung ke database. Periksa konfigurasi .env.local."
              : error === "ratelimit"
              ? "Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa menit."
              : "Username atau password salah."}
          </div>
        )}

        <form className="admin-login-form" action="/api/admin/login" method="POST">
          <div className="admin-form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" placeholder="admin" required autoFocus />
          </div>
          <div className="admin-form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="admin-login-submit">
            Masuk
          </button>
        </form>

        <p className="admin-login-hint">
          Login default: <strong>admin</strong> / <strong>admin123</strong> — jalankan{" "}
          <code>npm run db:seed-admin</code> jika akun belum tersedia.
        </p>
      </div>
    </div>
  );
}
