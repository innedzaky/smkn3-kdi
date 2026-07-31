"use client";

import { useState } from "react";
import { ToastStack, type ToastMessage } from "./Toast";

interface KategoriRow {
  kategori: string;
  total: number;
}

let toastSeq = 1;

export function KategoriManager({ initialData }: { initialData: KategoriRow[] }) {
  const [rows, setRows] = useState<KategoriRow[]>(initialData);
  const [editing, setEditing] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (type: ToastMessage["type"], text: string) => {
    const id = toastSeq++;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  const startEdit = (kategori: string) => {
    setEditing(kategori);
    setValue(kategori);
  };

  const save = async (oldName: string) => {
    if (!value.trim() || value.trim() === oldName) {
      setEditing(null);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/berita/kategori", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldName, newName: value.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan");
      setRows((r) => r.map((row) => (row.kategori === oldName ? { ...row, kategori: value.trim() } : row)));
      pushToast("success", "Nama kategori berhasil diubah");
      setEditing(null);
    } catch (err: any) {
      pushToast("error", err.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Kategori Berita</h1>
          <p>Ganti nama kategori — perubahan berlaku pada semua berita yang memakainya. Kategori baru otomatis muncul di sini setelah dipakai pada sebuah berita.</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          {rows.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">🏷️</div>
              <p>Belum ada kategori. Tambahkan lewat form berita.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Kategori</th>
                  <th>Jumlah Berita</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.kategori}>
                    <td>
                      {editing === row.kategori ? (
                        <input
                          type="text"
                          className="admin-input"
                          value={value}
                          autoFocus
                          onChange={(e) => setValue(e.target.value)}
                        />
                      ) : (
                        <span className="admin-cell-title">{row.kategori}</span>
                      )}
                    </td>
                    <td className="admin-cell-muted">{row.total} berita</td>
                    <td>
                      <div className="admin-cell-actions">
                        {editing === row.kategori ? (
                          <>
                            <button className="admin-btn admin-btn-primary" disabled={saving} onClick={() => save(row.kategori)}>
                              {saving ? "Menyimpan…" : "Simpan"}
                            </button>
                            <button className="admin-btn admin-btn-secondary" onClick={() => setEditing(null)}>
                              Batal
                            </button>
                          </>
                        ) : (
                          <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={() => startEdit(row.kategori)} title="Ganti nama">
                            ✏️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ToastStack toasts={toasts} />
    </div>
  );
}
