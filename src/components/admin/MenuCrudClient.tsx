"use client";

import React, { useState } from "react";
import { ToastStack, type ToastMessage } from "./Toast";
import type { MenuItem } from "@/lib/types";

let toastSeq = 1;

const emptyForm = { label: "", url: "", parent_id: "" as number | "", urutan: 0, is_active: true };

export function MenuCrudClient({ initialItems }: { initialItems: MenuItem[] }) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (type: ToastMessage["type"], text: string) => {
    const id = toastSeq++;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  const topLevel = items.filter((i) => i.parent_id === null).sort((a, b) => a.urutan - b.urutan);
  const childrenOf = (id: number) => items.filter((i) => i.parent_id === id).sort((a, b) => a.urutan - b.urutan);

  // Opsi induk hanya menu utama (level atas) — mencegah dropdown lebih dari 2 tingkat.
  const parentOptions = topLevel.filter((p) => !editing || p.id !== editing.id);

  const refetch = async () => {
    try {
      const res = await fetch("/api/admin/menu");
      const json = await res.json();
      if (res.ok) setItems(json.data);
    } catch {
      /* biarkan state lama jika gagal refetch */
    }
  };

  const openCreate = (parentId: number | null = null) => {
    setEditing(null);
    setForm({ ...emptyForm, parent_id: parentId ?? "" });
    setModalOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      label: item.label,
      url: item.url,
      parent_id: item.parent_id ?? "",
      urutan: item.urutan,
      is_active: !!item.is_active,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        label: form.label,
        url: form.url,
        parent_id: form.parent_id === "" ? null : Number(form.parent_id),
        urutan: Number(form.urutan) || 0,
        is_active: form.is_active,
      };
      const url = editing ? `/api/admin/menu/${editing.id}` : "/api/admin/menu";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan menu");
      pushToast("success", editing ? "Menu berhasil diperbarui" : "Menu baru berhasil ditambahkan");
      closeModal();
      await refetch();
    } catch (err: any) {
      pushToast("error", err.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: MenuItem) => {
    const hasChildren = childrenOf(item.id).length > 0;
    const msg = hasChildren
      ? `Hapus "${item.label}"? Semua sub-menu di bawahnya ikut terhapus. Tindakan tidak dapat dibatalkan.`
      : `Hapus "${item.label}"? Tindakan tidak dapat dibatalkan.`;
    if (!window.confirm(msg)) return;
    try {
      const res = await fetch(`/api/admin/menu/${item.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menghapus menu");
      pushToast("success", "Menu berhasil dihapus");
      await refetch();
    } catch (err: any) {
      pushToast("error", err.message || "Gagal menghapus menu");
    }
  };

  const renderRow = (item: MenuItem, isChild: boolean) => (
    <tr key={item.id} className={isChild ? "admin-menu-row-child" : undefined}>
      <td>
        {isChild ? (
          <div className="admin-menu-child-label">
            <span className="admin-menu-child-arrow">↳</span>
            {item.label}
          </div>
        ) : (
          <div className="admin-cell-title">{item.label}</div>
        )}
      </td>
      <td>
        <span className="admin-menu-url" title={item.url}>
          {item.url}
        </span>
      </td>
      <td>{item.urutan}</td>
      <td>
        <span className={`admin-badge ${item.is_active ? "admin-badge-success" : "admin-badge-muted"}`}>
          {item.is_active ? "Aktif" : "Nonaktif"}
        </span>
      </td>
      <td>
        <div className="admin-cell-actions">
          {!isChild && (
            <button
              className="admin-btn admin-btn-secondary admin-btn-icon"
              onClick={() => openCreate(item.id)}
              title="Tambah sub-menu"
            >
              ＋
            </button>
          )}
          <button className="admin-btn admin-btn-secondary admin-btn-icon" onClick={() => openEdit(item)} title="Edit">
            ✏️
          </button>
          <button className="admin-btn admin-btn-danger admin-btn-icon" onClick={() => handleDelete(item)} title="Hapus">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Menu Navigasi</h1>
          <p>Kelola menu yang tampil di header situs, termasuk sub-menu (dropdown) seperti "Profil".</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => openCreate(null)}>
          ＋ Tambah Menu
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          {topLevel.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">🧭</div>
              <p>Belum ada menu. Tambahkan menu pertama Anda.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Label</th>
                  <th>URL</th>
                  <th>Urutan</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {topLevel.map((p) => (
                  <React.Fragment key={p.id}>
                    {renderRow(p, false)}
                    {childrenOf(p.id).map((c) => renderRow(c, true))}
                  </React.Fragment>
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
              <h3>{editing ? "Edit Menu" : "Tambah Menu"}</h3>
              <button className="admin-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>
                    Label <span className="admin-required">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Profil"
                    value={form.label}
                    onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  />
                </div>
                <div className="admin-form-group">
                  <label>
                    URL / Tautan <span className="admin-required">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/halaman/fasilitas atau /#profil"
                    value={form.url}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Induk Menu</label>
                  <select
                    value={form.parent_id}
                    onChange={(e) => setForm((f) => ({ ...f, parent_id: e.target.value === "" ? "" : Number(e.target.value) }))}
                  >
                    <option value="">— Menu Utama (tanpa induk) —</option>
                    {parentOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <div className="admin-form-hint">Pilih induk untuk menjadikan ini sub-menu (dropdown), atau biarkan kosong untuk menu utama.</div>
                </div>
                <div className="admin-form-group">
                  <label>Urutan</label>
                  <input
                    type="number"
                    value={form.urutan}
                    onChange={(e) => setForm((f) => ({ ...f, urutan: Number(e.target.value) }))}
                  />
                </div>
                <div className="admin-form-group">
                  <div className="admin-checkbox-row">
                    <input
                      id="is_active"
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                    />
                    <label htmlFor="is_active">Tampilkan di header</label>
                  </div>
                </div>
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
