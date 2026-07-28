/**
 * Mengisi data awal (seed) dari database/seed.sql
 * Jalankan setelah "npm run db:migrate": npm run db:seed
 */
const fs = require("fs");
const path = require("path");
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

async function main() {
  await loadEnv();

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "smkn3_kdi",
    multipleStatements: true,
  });

  const seedPath = path.join(__dirname, "seed.sql");
  const seedSql = fs.readFileSync(seedPath, "utf-8");

  console.log("Mengisi data awal (seed.sql) ...");
  await connection.query(seedSql);
  console.log("✔ Data awal berhasil dimasukkan.");

  await connection.end();
}

main().catch((err) => {
  console.error("✘ Gagal seeding database:", err.message);
  process.exit(1);
});
