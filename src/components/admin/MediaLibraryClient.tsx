"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ToastStack, type ToastMessage } from "./Toast";
import type { MediaFile } from "@/lib/types";

let toastSeq = 1;

function isImage(mime: string | null) {
  return !!mime && mime.startsWith("image/");
}

function formatSize(bytes: number | null) {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  try {
    return new Date(iso.replace(" ", "T")).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function MediaLibraryClient({ initialItems }: { initialItems: MediaFile[] }) {
  const [items, setItems] = useState<MediaFile[]>(initialItems);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [altValue, setAltValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (type: ToastMessage["type"], text: string) => {
    const id = toastSeq++;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((m) =>
      (m.original_name || m.file_name).toLowerCase().includes(q)
    );
  }, [items, search]);

  const openDetail = (item: MediaFile) => {
    setSelected(item);
    setAltValue(item.alt_text || "");
  };

  const closeDetail = () => {
    setSelected(null);
    setAltValue("");
  };

  const copyUrl = async (url: string) => {
    try {
      const full = typeof window !== "undefined" ? window.location.origin + url : url;
      await navigator.clipboard.writeText(full);
      pushToast("success", "Tautan berhasil disalin");
    } catch {
      pushToast("error", "Gagal menyalin tautan");
    }
  };

  const saveAlt = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/media/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt_text: altValue.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan");
      setItems((list) =>
        list.map((m) => (m.id === selected.id ? { ...m, alt_text: altValue.trim() } : m))
      );
      pushToast("success", "Teks alternatif berhasil disimpan");
    } catch (err: any) {
      pushToast("error", err.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!selected) return;
    if (!window.confirm(`Hapus file "${selected.original_name || selected.file_name}"? File di server juga akan terhapus.`))
      return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/media/${selected.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menghapus");
      setItems((list) => list.filter((m) => m.id !== selected.id));
      pushToast("success", "File berhasil dihapus");
      closeDetail();
    } catch (err: any) {
      pushToast("error", err.message || "Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Pustaka Media</h1>
          <p>Semua gambar dan file yang pernah diunggah lewat panel admin, terkumpul di satu tempat.</p>
        </div>
        <Link href="/admin/media/tambah" className="admin-btn admin-btn-primary">
          ＋ Tambahkan File Media
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-media-toolbar">
          <input
            type="text"
            className="admin-media-search"
            placeholder="Cari nama file…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="admin-media-count">{filtered.length} file</span>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">🗂️</div>
            <p>
              {items.length === 0
                ? "Belum ada file media. Unggah lewat menu Tambahkan File Media, atau otomatis tercatat saat mengunggah gambar di form lain."
                : "Tidak ada file yang cocok dengan pencarian."}
            </p>
          </div>
        ) : (
          <div className="admin-media-grid">
            {filtered.map((item) => (
              <button key={item.id} type="button" className="admin-media-card" onClick={() => openDetail(item)}>
                {isImage(item.mime_type) ? (
                  <img src={item.url} alt={item.alt_text || ""} className="admin-media-card-thumb" />
                ) : (
                  <div className="admin-media-card-file">📄</div>
                )}
                <div className="admin-media-card-name">{item.original_name || item.file_name}</div>
                <div className="admin-media-card-meta">{formatSize(item.size)}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="admin-modal-overlay" onClick={closeDetail}>
          <div className="admin-modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Detail File</h3>
              <button className="admin-modal-close" onClick={closeDetail}>✕</button>
            </div>
            <div className="admin-modal-body">
              {isImage(selected.mime_type) ? (
                <img src={selected.url} alt={selected.alt_text || ""} className="admin-media-detail-preview" />
              ) : (
                <div className="admin-media-detail-file">📄</div>
              )}

              <div className="admin-media-detail-row">
                <span>Nama Berkas</span>
                <span>{selected.original_name || selected.file_name}</span>
              </div>
              <div className="admin-media-detail-row">
                <span>Ukuran</span>
                <span>{formatSize(selected.size)}</span>
              </div>
              <div className="admin-media-detail-row">
                <span>Tipe</span>
                <span>{selected.mime_type || "-"}</span>
              </div>
              <div className="admin-media-detail-row">
                <span>Diunggah</span>
                <span>
                  {formatDate(selected.created_at)}
                  {selected.uploader_name ? ` — ${selected.uploader_name}` : ""}
                </span>
              </div>

              <div className="admin-form-group">
                <label>Teks Alternatif (Alt Text)</label>
                <input
                  type="text"
                  value={altValue}
                  onChange={(e) => setAltValue(e.target.value)}
                  placeholder="Deskripsi singkat gambar untuk aksesibilitas & SEO"
                />
              </div>

              <div className="admin-form-group">
                <label>URL File</label>
                <div className="admin-media-url-row">
                  <input type="text" readOnly value={selected.url} />
                  <button type="button" className="admin-btn admin-btn-secondary" onClick={() => copyUrl(selected.url)}>
                    Salin
                  </button>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer" style={{ justifyContent: "space-between" }}>
              <button className="admin-btn admin-btn-danger" disabled={deleting} onClick={remove}>
                {deleting ? "Menghapus…" : "🗑️ Hapus File"}
              </button>
              <button className="admin-btn admin-btn-primary" disabled={saving} onClick={saveAlt}>
                {saving ? "Menyimpan…" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}
