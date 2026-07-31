"use client";

import { useState } from "react";
import { ToastStack, type ToastMessage } from "./Toast";

interface TagRow {
  id: number;
  nama: string;
  slug: string;
  total: number;
}

let toastSeq = 1;

export function TagsManager({ initialData }: { initialData: TagRow[] }) {
  const [rows, setRows] = useState<TagRow[]>(initialData);
  const [editing, setEditing] = useState<number | null>(null);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (type: ToastMessage["type"], text: string) => {
    const id = toastSeq++;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  const startEdit = (row: TagRow) => {
    setEditing(row.id);
    setValue(row.nama);
  };

  const save = async (row: TagRow) => {
    if (!value.trim() || value.trim() === row.nama) {
      setEditing(null);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/berita/tags/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: value.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan");
      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, nama: value.trim() } : x)));
      pushToast("success", "Nama tag berhasil diubah");
      setEditing(null);
    } catch (err: any) {
      pushToast("error", err.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: TagRow) => {
    if (!window.confirm(`Hapus tag "${row.nama}"? Tag akan lepas dari semua berita yang memakainya.`)) return;
    try {
      const res = await fetch(`/api/admin/berita/tags/${row.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menghapus");
      setRows((r) => r.filter((x) => x.id !== row.id));
      pushToast("success", "Tag berhasil dihapus");
    } catch (err: any) {
      pushToast("error", err.message || "Gagal menghapus");
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Tags Berita</h1>
          <p>
            Kelola tag yang dipakai pada Postingan Berita — terpisah dari Kategori. Tag baru otomatis muncul di
            sini setelah dipakai pada sebuah berita.
          </p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          {rows.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">🏷️</div>
              <p>Belum ada tag. Tambahkan lewat form berita.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tag</th>
                  <th>Jumlah Berita</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {editing === row.id ? (
                        <input
                          type="text"
                          className="admin-input"
                          value={value}
                          autoFocus
                          onChange={(e) => setValue(e.target.value)}
                        />
                      ) : (
                        <span className="admin-cell-title">{row.nama}</span>
                      )}
                    </td>
                    <td className="admin-cell-muted">{row.total} berita</td>
                    <td>
                      <div className="admin-cell-actions">
                        {editing === row.id ? (
                          <>
                            <button className="admin-btn admin-btn-primary" disabled={saving} onClick={() => save(row)}>
                              {saving ? "Menyimpan…" : "Simpan"}
                            </button>
                            <button className="admin-btn admin-btn-secondary" onClick={() => setEditing(null)}>
                              Batal
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={() => startEdit(row)} title="Ganti nama">
                              ✏️
                            </button>
                            <button className="admin-btn admin-btn-danger admin-btn-icon" onClick={() => remove(row)} title="Hapus">
                              🗑️
                            </button>
                          </>
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
