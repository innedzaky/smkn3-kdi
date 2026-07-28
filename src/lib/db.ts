import mysql, { type Pool } from "mysql2/promise";

/**
 * Connection pool MySQL bersama (singleton).
 * Di Next.js (dev mode) module bisa di-reload berkali-kali, sehingga
 * pool disimpan di `globalThis` supaya tidak membuat koneksi baru terus-menerus.
 */

declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: Pool | undefined;
}

function createPool(): Pool {
  return mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "smkn3_kdi",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    dateStrings: true,
  });
}

export const pool: Pool = global.__mysqlPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  global.__mysqlPool = pool;
}

/**
 * Helper query generik dengan tipe hasil.
 * Mengembalikan array baris (RowDataPacket[]) yang sudah di-cast ke tipe T.
 */
export async function query<T = unknown>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}
