"use client";

import { useState } from "react";
import { ToastStack, type ToastMessage } from "./Toast";
import { MediaLibraryModal } from "./MediaLibraryModal";
import { RichTextEditor } from "./RichTextEditor";

export interface SettingsFieldConfig {
  key: string;
  label: string;
  type?: "text" | "textarea" | "image" | "select" | "richtext";
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
  rows?: number;
  /**
   * Tampilkan field ini hanya jika field lain di form yang sama bernilai tertentu.
   * Objek biasa (bukan fungsi) supaya aman dikirim dari Server Component -> Client Component.
   */
  showIf?: { field: string; equals: string } | { field: string; notEquals: string };
}

function matchesShowIf(showIf: SettingsFieldConfig["showIf"], values: Record<string, string>): boolean {
  if (!showIf) return true;
  const current = values[showIf.field] ?? "";
  if ("equals" in showIf) return current === showIf.equals;
  return current !== showIf.notEquals;
}

let toastSeq = 1;

/**
 * Form pengaturan generik berbasis key-value (tabel `pengaturan`).
 * Dipakai ulang oleh 3 halaman: Pengaturan Umum, Penampilan -> Header,
 * Penampilan -> Footer — masing-masing hanya mengirim subset key miliknya
 * sendiri, sehingga aman dipakai bersamaan tanpa saling menimpa data.
 */
export function SettingsForm({
  title,
  description,
  fields,
  initialValues,
}: {
  title: string;
  description?: string;
  fields: SettingsFieldConfig[];
  initialValues: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [mediaPickerKey, setMediaPickerKey] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (type: ToastMessage["type"], text: string) => {
    const id = toastSeq++;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  const handleChange = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
  };

  const handleImageUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengunggah gambar");
      handleChange(key, json.url);
      pushToast("success", "Gambar berhasil diunggah");
    } catch (err: any) {
      pushToast("error", err.message || "Gagal mengunggah gambar");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      for (const f of fields) payload[f.key] = values[f.key] ?? "";
      const res = await fetch("/api/admin/pengaturan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan pengaturan");
      pushToast("success", "Pengaturan berhasil disimpan");
    } catch (err: any) {
      pushToast("error", err.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-body">
          <form onSubmit={handleSubmit}>
            {fields
              .filter((f) => matchesShowIf(f.showIf, values))
              .map((f) => (
              <div key={f.key} className="admin-form-group">
                <label htmlFor={f.key}>{f.label}</label>

                {f.type === "image" ? (
                  <div className="admin-image-field">
                    {values[f.key] ? (
                      <img src={values[f.key]} alt="" className="admin-image-preview" />
                    ) : (
                      <div className="admin-image-placeholder">🖼️</div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div className="admin-media-tabs">
                        <label className="admin-media-tab-btn">
                          Upload File
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(f.key, file);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          className="admin-media-tab-btn"
                          onClick={() => setMediaPickerKey(f.key)}
                        >
                          📚 Pustaka Media
                        </button>
                      </div>
                      {uploadingKey === f.key && <div className="admin-form-hint">Mengunggah…</div>}
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="atau tempel URL gambar"
                        value={values[f.key] ?? ""}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                        style={{ marginTop: 6 }}
                      />
                    </div>
                  </div>
                ) : f.type === "textarea" ? (
                  <textarea
                    id={f.key}
                    rows={f.rows || 4}
                    placeholder={f.placeholder}
                    value={values[f.key] ?? ""}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                  />
                ) : f.type === "richtext" ? (
                  <RichTextEditor
                    value={values[f.key] ?? ""}
                    onChange={(html) => handleChange(f.key, html)}
                    placeholder={f.placeholder}
                  />
                ) : f.type === "select" ? (
                  <select
                    id={f.key}
                    value={values[f.key] ?? ""}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                  >
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={f.key}
                    type="text"
                    placeholder={f.placeholder}
                    value={values[f.key] ?? ""}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                  />
                )}

                {f.hint && <div className="admin-form-hint">{f.hint}</div>}
              </div>
            ))}

            <div className="admin-modal-footer" style={{ padding: "16px 0 0", justifyContent: "flex-start" }}>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                {saving ? "Menyimpan…" : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <MediaLibraryModal
        open={mediaPickerKey !== null}
        onClose={() => setMediaPickerKey(null)}
        onSelect={(url) => {
          if (mediaPickerKey) handleChange(mediaPickerKey, url);
        }}
      />

      <ToastStack toasts={toasts} />
    </div>
  );
}
