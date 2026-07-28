/**
 * Membuat akun Administrator default untuk Panel Admin CMS.
 * Jalankan sekali setelah "npm run db:migrate": npm run db:seed-admin
 *
 * Login default setelah seed:
 *   Username: admin
 *   Password: admin123
 * (Segera ganti password ini lewat menu Pengguna > Profil setelah login pertama.)
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const mysql = require("mysql2/promise");

async function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  await loadEnv();

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "smkn3_kdi",
  });

  const [existing] = await connection.query(
    "SELECT id FROM users WHERE username = ? LIMIT 1",
    ["admin"]
  );

  if (Array.isArray(existing) && existing.length > 0) {
    console.log("ℹ Akun 'admin' sudah ada, tidak membuat duplikat.");
  } else {
    const passwordHash = hashPassword("admin123");
    await connection.query(
      `INSERT INTO users (name, email, username, password_hash, role, status)
       VALUES (?, ?, ?, ?, 'Administrator', 'Aktif')`,
      ["Administrator", "admin@smkn3kdi.sch.id", "admin", passwordHash]
    );
    console.log("✔ Akun Administrator default berhasil dibuat.");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("   Segera ganti password ini setelah login pertama.");
  }

  await connection.end();
}

main().catch((err) => {
  console.error("✘ Gagal membuat akun admin:", err.message);
  process.exit(1);
});
