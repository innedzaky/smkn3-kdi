"use client";

import { useState } from "react";
import { ToastStack, type ToastMessage } from "./Toast";
import type { AdminUser } from "@/lib/types";

let toastSeq = 1;

export function ProfilForm({ user }: { user: AdminUser }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (type: ToastMessage["type"], text: string) => {
    const id = toastSeq++;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  /* --- Bagian: Informasi Profil --- */
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    username: user.username,
    avatar: user.avatar || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengunggah foto");
      setProfile((p) => ({ ...p, avatar: json.url }));
      pushToast("success", "Foto profil berhasil diunggah");
    } catch (err: any) {
      pushToast("error", err.message || "Gagal mengunggah foto");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/admin/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan");
      pushToast("success", "Profil berhasil diperbarui");
    } catch (err: any) {
      pushToast("error", err.message || "Terjadi kesalahan");
    } finally {
      setSavingProfile(false);
    }
  };

  /* --- Bagian: Ubah Password --- */
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingPwd, setSavingPwd] = useState(false);

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPwd(true);
    try {
      const res = await fetch("/api/admin/profil/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pwd),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengubah password");
      pushToast("success", "Password berhasil diubah");
      setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      pushToast("error", err.message || "Terjadi kesalahan");
    } finally {
      setSavingPwd(false);
    }
  };

  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Profil Saya</h1>
          <p>Kelola informasi akun dan password Anda sendiri.</p>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card-header">
          <h2>Informasi Profil</h2>
        </div>
        <div className="admin-card-body">
          <form onSubmit={submitProfile}>
            <div className="admin-form-group">
              <label>Foto Profil</label>
              <div className="admin-image-field">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="" className="admin-image-preview" style={{ borderRadius: "50%" }} />
                ) : (
                  <div className="admin-image-placeholder" style={{ borderRadius: "50%" }}>
                    {initials || "A"}
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarUpload(file);
                    }}
                  />
                  {uploadingAvatar && <div className="admin-form-hint">Mengunggah…</div>}
                </div>
              </div>
            </div>

            <div className="admin-form-group">
              <label>
                Nama Lengkap <span className="admin-required">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div className="admin-form-group">
              <label>
                Email <span className="admin-required">*</span>
              </label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              />
            </div>

            <div className="admin-form-group">
              <label>
                Username <span className="admin-required">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.username}
                onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
              />
            </div>

            <div className="admin-form-group">
              <label>Peran</label>
              <input type="text" value={user.role} disabled />
              <div className="admin-form-hint">Peran hanya dapat diubah oleh Administrator lain lewat menu Pengguna.</div>
            </div>

            <div className="admin-modal-footer" style={{ padding: "16px 0 0", justifyContent: "flex-start" }}>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={savingProfile}>
                {savingProfile ? "Menyimpan…" : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Ubah Password</h2>
        </div>
        <div className="admin-card-body">
          <form onSubmit={submitPassword}>
            <div className="admin-form-group">
              <label>
                Password Saat Ini <span className="admin-required">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={pwd.currentPassword}
                onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))}
              />
            </div>
            <div className="admin-form-group">
              <label>
                Password Baru <span className="admin-required">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Minimal 6 karakter"
                value={pwd.newPassword}
                onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))}
              />
            </div>
            <div className="admin-form-group">
              <label>
                Konfirmasi Password Baru <span className="admin-required">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={pwd.confirmPassword}
                onChange={(e) => setPwd((p) => ({ ...p, confirmPassword: e.target.value }))}
              />
            </div>
            <div className="admin-modal-footer" style={{ padding: "16px 0 0", justifyContent: "flex-start" }}>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={savingPwd}>
                {savingPwd ? "Menyimpan…" : "Ubah Password"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastStack toasts={toasts} />
    </div>
  );
}
