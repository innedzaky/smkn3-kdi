"use client";

import { useState } from "react";

interface Props {
  isPublished: boolean;
  publishedAt: string; // format datetime-local: "YYYY-MM-DDTHH:mm"
  isSticky: boolean;
  lockModifiedDate: boolean;
  onChange: (patch: {
    is_published?: boolean;
    published_at?: string;
    is_sticky?: boolean;
    lock_modified_date?: boolean;
  }) => void;
}

function formatDisplayDate(v: string) {
  if (!v) return "segera";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "segera";
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Panel "Pengaturan Publikasi" ala kotak Publish WordPress: Status
 *  (Draft/Terbit), jadwal publish, "Stick to front page", dan
 *  "Lock Modified Date". Dipakai khusus di form Berita lewat CrudManager. */
export function PublishBox({ isPublished, publishedAt, isSticky, lockModifiedDate, onChange }: Props) {
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const [draftStatus, setDraftStatus] = useState(isPublished);
  const [draftDate, setDraftDate] = useState(publishedAt);

  const isScheduledFuture = publishedAt && new Date(publishedAt).getTime() > Date.now();

  return (
    <div className="admin-publishbox">
      {/* Status */}
      <div className="admin-publishbox-row">
        <span>📌 Status: <strong>{isPublished ? "Terbit" : "Draf"}</strong></span>
        {!editingStatus && (
          <button
            type="button"
            className="admin-publishbox-link"
            onClick={() => {
              setDraftStatus(isPublished);
              setEditingStatus(true);
            }}
          >
            Ubah
          </button>
        )}
      </div>
      {editingStatus && (
        <div className="admin-publishbox-editrow">
          <select value={draftStatus ? "1" : "0"} onChange={(e) => setDraftStatus(e.target.value === "1")}>
            <option value="0">Draf</option>
            <option value="1">Terbit</option>
          </select>
          <button
            type="button"
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={() => {
              onChange({ is_published: draftStatus });
              setEditingStatus(false);
            }}
          >
            OK
          </button>
          <button type="button" className="admin-publishbox-link" onClick={() => setEditingStatus(false)}>
            Batal
          </button>
        </div>
      )}

      {/* Jadwal Publish */}
      <div className="admin-publishbox-row">
        <span>
          🗓️ {isScheduledFuture ? "Jadwal terbit" : "Terbitkan"}: <strong>{formatDisplayDate(publishedAt)}</strong>
        </span>
        {!editingDate && (
          <button
            type="button"
            className="admin-publishbox-link"
            onClick={() => {
              setDraftDate(publishedAt);
              setEditingDate(true);
            }}
          >
            Ubah
          </button>
        )}
      </div>
      {editingDate && (
        <div className="admin-publishbox-editrow">
          <input type="datetime-local" value={draftDate} onChange={(e) => setDraftDate(e.target.value)} />
          <button
            type="button"
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={() => {
              onChange({ published_at: draftDate });
              setEditingDate(false);
            }}
          >
            OK
          </button>
          <button type="button" className="admin-publishbox-link" onClick={() => setEditingDate(false)}>
            Batal
          </button>
        </div>
      )}
      <div className="admin-form-hint" style={{ margin: "2px 0 10px" }}>
        Isi tanggal di masa depan untuk menjadwalkan tayang otomatis nanti.
      </div>

      {/* Stick to front page */}
      <div className="admin-checkbox-row">
        <input
          id="pb-sticky"
          type="checkbox"
          checked={isSticky}
          onChange={(e) => onChange({ is_sticky: e.target.checked })}
        />
        <label htmlFor="pb-sticky">📌 Sematkan di atas daftar berita (Stick to front page)</label>
      </div>

      {/* Lock Modified Date */}
      <div className="admin-checkbox-row">
        <input
          id="pb-lock"
          type="checkbox"
          checked={lockModifiedDate}
          onChange={(e) => onChange({ lock_modified_date: e.target.checked })}
        />
        <label htmlFor="pb-lock">🔒 Kunci tanggal diubah (Lock Modified Date)</label>
      </div>
    </div>
  );
}
