"use client";

import { useState } from "react";
import { ToastStack, type ToastMessage } from "./Toast";

export interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "select" | "image" | "password" | "tags";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
  half?: boolean;
  rows?: number;
  /** Auto-format this field's value to lowercase-with-hyphens as the user types or pastes. */
  slugify?: boolean;
  /** Key of another field (e.g. "judul") to auto-derive this slug from, until the user edits this field directly. */
  slugSource?: string;
}

export interface ColumnConfig<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  align?: "left" | "right";
}

interface Props<T extends Record<string, any>> {
  resource: string;
  title: string;
  description?: string;
  addLabel?: string;
  emptyIcon?: string;
  emptyText?: string;
  idKey?: string;
  initialItems: T[];
  columns: ColumnConfig<T>[];
  fields: FieldConfig[];
  defaultValues?: Record<string, any>;
}

let toastSeq = 1;

function slugifyText(v: string) {
  return v
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function CrudManager<T extends Record<string, any>>({
  resource,
  title,
  description,
  addLabel = "Tambah Data",
  emptyIcon = "🗂️",
  emptyText = "Belum ada data.",
  idKey = "id",
  initialItems,
  columns,
  fields,
  defaultValues = {},
}: Props<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (type: ToastMessage["type"], text: string) => {
    const id = toastSeq++;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  const buildDefaults = () => {
    const base: Record<string, any> = { ...defaultValues };
    for (const f of fields) {
      if (base[f.key] !== undefined) continue;
      base[f.key] = f.type === "checkbox" ? false : f.type === "number" ? 0 : "";
    }
    return base;
  };

  const openCreate = () => {
    setEditing(null);
    setFormData(buildDefaults());
    setSlugManual(false);
    setModalOpen(true);
  };

  const openEdit = (item: T) => {
    const data: Record<string, any> = { ...item };
    for (const f of fields) {
      if (f.type === "checkbox") data[f.key] = !!Number(data[f.key]);
      if (f.type === "tags" && Array.isArray(data[f.key])) data[f.key] = data[f.key].join(", ");
    }
    setEditing(item);
    setFormData(data);
    // Existing slug is assumed intentional — don't auto-overwrite it if the title is edited.
    setSlugManual(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleChange = (key: string, value: any) => {
    setFormData((f) => ({ ...f, [key]: value }));
  };

  /** Handles input for text fields, applying slug formatting/auto-derivation rules. */
  const handleTextFieldChange = (field: FieldConfig, rawValue: string) => {
    if (field.slugify) {
      // User is editing the slug field itself — format it and stop auto-following the title.
      setSlugManual(true);
      setFormData((f) => ({ ...f, [field.key]: slugifyText(rawValue) }));
      return;
    }
    setFormData((f) => {
      const next = { ...f, [field.key]: rawValue };
      if (!slugManual) {
        const slugField = fields.find((x) => x.slugify && x.slugSource === field.key);
        if (slugField) next[slugField.key] = slugifyText(rawValue);
      }
      return next;
    });
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

  const refetch = async () => {
    try {
      const res = await fetch(`/api/admin/${resource}`);
      const json = await res.json();
      if (res.ok) setItems(json.data);
    } catch {
      /* biarkan state lama jika gagal refetch */
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = editing !== null;
      const url = isEdit ? `/api/admin/${resource}/${editing[idKey]}` : `/api/admin/${resource}`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan data");
      pushToast("success", isEdit ? "Perubahan berhasil disimpan" : "Data baru berhasil ditambahkan");
      closeModal();
      await refetch();
    } catch (err: any) {
      pushToast("error", err.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: T) => {
    if (!window.confirm("Hapus data ini? Tindakan tidak dapat dibatalkan.")) return;
    try {
      const res = await fetch(`/api/admin/${resource}/${item[idKey]}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menghapus data");
      pushToast("success", "Data berhasil dihapus");
      setItems((prev) => prev.filter((i) => i[idKey] !== item[idKey]));
    } catch (err: any) {
      pushToast("error", err.message || "Gagal menghapus data");
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
          ＋ {addLabel}
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          {items.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">{emptyIcon}</div>
              <p>{emptyText}</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} style={{ textAlign: c.align || "left" }}>
                      {c.label}
                    </th>
                  ))}
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item[idKey]}>
                    {columns.map((c) => (
                      <td key={c.key} style={{ textAlign: c.align || "left" }}>
                        {c.render ? c.render(item) : String(item[c.key] ?? "-")}
                      </td>
                    ))}
                    <td>
                      <div className="admin-cell-actions">
                        <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={() => openEdit(item)} title="Edit">
                          ✏️
                        </button>
                        <button className="admin-btn admin-btn-danger admin-btn-icon" onClick={() => handleDelete(item)} title="Hapus">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editing ? `Edit ${title}` : addLabel}</h3>
              <button className="admin-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                {fields.map((f) => (
                  <div key={f.key} className="admin-form-group">
                    <label htmlFor={f.key}>
                      {f.label} {f.required && <span className="admin-required">*</span>}
                    </label>

                    {f.type === "text" || f.type === "password" || f.type === "tags" ? (
                      <input
                        id={f.key}
                        type={f.type === "tags" ? "text" : f.type}
                        placeholder={f.placeholder}
                        required={f.required}
                        value={formData[f.key] ?? ""}
                        onChange={(e) => handleTextFieldChange(f, e.target.value)}
                      />
                    ) : f.type === "number" ? (
                      <input
                        id={f.key}
                        type="number"
                        placeholder={f.placeholder}
                        required={f.required}
                        value={formData[f.key] ?? 0}
                        onChange={(e) => handleChange(f.key, Number(e.target.value))}
                      />
                    ) : f.type === "textarea" ? (
                      <textarea
                        id={f.key}
                        rows={f.rows || 4}
                        placeholder={f.placeholder}
                        required={f.required}
                        value={formData[f.key] ?? ""}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                      />
                    ) : f.type === "select" ? (
                      <select
                        id={f.key}
                        required={f.required}
                        value={formData[f.key] ?? ""}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                      >
                        {f.options?.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : f.type === "checkbox" ? (
                      <div className="admin-checkbox-row">
                        <input
                          id={f.key}
                          type="checkbox"
                          checked={!!formData[f.key]}
                          onChange={(e) => handleChange(f.key, e.target.checked)}
                        />
                        <label htmlFor={f.key}>{f.placeholder || "Aktifkan"}</label>
                      </div>
                    ) : f.type === "image" ? (
                      <div className="admin-image-field">
                        {formData[f.key] ? (
                          <img src={formData[f.key]} alt="" className="admin-image-preview" />
                        ) : (
                          <div className="admin-image-placeholder">🖼️</div>
                        )}
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(f.key, file);
                            }}
                          />
                          {uploadingKey === f.key && <div className="admin-form-hint">Mengunggah…</div>}
                          <input
                            type="text"
                            placeholder="atau tempel URL gambar"
                            value={formData[f.key] ?? ""}
                            onChange={(e) => handleChange(f.key, e.target.value)}
                            style={{ marginTop: 6 }}
                          />
                        </div>
                      </div>
                    ) : null}

                    {f.hint && <div className="admin-form-hint">{f.hint}</div>}
                  </div>
                ))}
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? "Menyimpan…" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}
