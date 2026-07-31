"use client";

import { useEffect, useState } from "react";
import type { MediaFile } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

/** Modal pemilih gambar dari Pustaka Media (media yang sudah pernah diupload
 *  sebelumnya lewat menu manapun), dipakai baik oleh field "Gambar Sampul"
 *  maupun tombol "Add Media" di editor konten. */
export function MediaLibraryModal({ open, onClose, onSelect }: Props) {
  const [items, setItems] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    fetch("/api/admin/media")
      .then((res) => res.json())
      .then((json) => setItems(json.data || []))
      .catch(() => setError("Gagal memuat pustaka media"))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
    <div className="admin-modal-overlay" style={{ zIndex: 200 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal admin-modal-lg">
        <div className="admin-modal-header">
          <h3>Pustaka Media</h3>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="admin-modal-body">
          {loading ? (
            <div className="admin-form-hint">Memuat…</div>
          ) : error ? (
            <div className="admin-form-hint">{error}</div>
          ) : items.length === 0 ? (
            <div className="admin-form-hint">Belum ada media yang diupload sebelumnya.</div>
          ) : (
            <div className="admin-media-grid">
              {items
                .filter((m) => !m.mime_type || m.mime_type.startsWith("image/"))
                .map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    className="admin-media-card"
                    title={m.original_name || m.file_name}
                    onClick={() => {
                      onSelect(m.url);
                      onClose();
                    }}
                  >
                    <img className="admin-media-card-thumb" src={m.url} alt={m.alt_text || ""} loading="lazy" />
                  </button>
                ))}
            </div>
          )}
        </div>
        <div className="admin-modal-footer">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
