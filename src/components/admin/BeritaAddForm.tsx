"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastStack, type ToastMessage } from "./Toast";
import { RichTextEditor } from "./RichTextEditor";
import { MediaLibraryModal } from "./MediaLibraryModal";
import { PublishBox } from "./PublishBox";

interface KategoriRow {
  kategori: string;
  total: number;
}

interface TagRow {
  id: number;
  nama: string;
  slug: string;
  total: number;
}

let toastSeq = 1;

function slugify(v: string) {
  return v
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function BeritaAddForm({
  kategoriList,
  tagList,
}: {
  kategoriList: KategoriRow[];
  tagList: TagRow[];
}) {
  const router = useRouter();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const pushToast = (type: ToastMessage["type"], text: string) => {
    const id = toastSeq++;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  const [judul, setJudul] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [deskripsi, setDeskripsi] = useState("");
  const [konten, setKonten] = useState("");
  const [kategori, setKategori] = useState(kategoriList[0]?.kategori || "Sekolah");
  const [penulis, setPenulis] = useState("Admin Sekolah");
  const [isPublished, setIsPublished] = useState(true);
  const [publishedAt, setPublishedAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [isSticky, setIsSticky] = useState(false);
  const [lockModifiedDate, setLockModifiedDate] = useState(false);
  const [gambar, setGambar] = useState("");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [localTags, setLocalTags] = useState<string[]>(tagList.map((t) => t.nama));

  const handleJudulChange = (v: string) => {
    setJudul(v);
    if (!slugManual) setSlug(slugify(v));
  };

  const toggleTag = (nama: string) => {
    setSelectedTags((prev) =>
      prev.includes(nama) ? prev.filter((t) => t !== nama) : [...prev, nama]
    );
  };

  const addNewTag = () => {
    const nama = newTagInput.trim();
    if (!nama) return;
    if (!localTags.some((t) => t.toLowerCase() === nama.toLowerCase())) {
      setLocalTags((prev) => [...prev, nama]);
    }
    if (!selectedTags.some((t) => t.toLowerCase() === nama.toLowerCase())) {
      setSelectedTags((prev) => [...prev, nama]);
    }
    setNewTagInput("");
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengunggah gambar");
      setGambar(json.url);
      pushToast("success", "Gambar berhasil diunggah");
    } catch (err: any) {
      pushToast("error", err.message || "Gagal mengunggah gambar");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (publish: boolean) => {
    if (!judul.trim()) {
      pushToast("error", "Judul artikel tidak boleh kosong");
      return;
    }
    if (!konten.trim()) {
      pushToast("error", "Isi konten tidak boleh kosong");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/berita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul,
          slug: slug || slugify(judul),
          deskripsi,
          konten,
          kategori,
          penulis,
          gambar,
          tags: selectedTags,
          is_published: publish,
          published_at: publishedAt,
          is_sticky: isSticky,
          lock_modified_date: lockModifiedDate,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan postingan");
      pushToast("success", publish ? "Postingan berhasil diterbitkan" : "Draf berhasil disimpan");
      setTimeout(() => router.push("/admin/berita"), 600);
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
          <h1>Tambah Postingan Baru</h1>
          <p>Isi formulir di bawah ini untuk membuat artikel/berita baru.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            disabled={saving}
            onClick={() => submit(false)}
          >
            Simpan Draf
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            disabled={saving}
            onClick={() => submit(true)}
          >
            {saving ? "Menyimpan…" : "Terbitkan Post"}
          </button>
        </div>
      </div>

      <div className="admin-form-layout">
        {/* Kolom kiri: editor utama */}
        <div className="admin-card">
          <div className="admin-card-body">
            <div className="admin-form-group">
              <label>
                Judul Artikel <span className="admin-required">*</span>
              </label>
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => handleJudulChange(e.target.value)}
                placeholder="Contoh: Pelaksanaan Penilaian Akhir Semester Berjalan Lancar..."
              />
            </div>

            <div className="admin-form-group">
              <label>URL Permalink (Slug)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugManual(true);
                }}
                placeholder="pelaksanaan-pas-2026"
              />
              <div className="admin-form-hint">/artikel/{slug || "…"}</div>
            </div>

            <div className="admin-form-group">
              <label>Ringkasan Singkat</label>
              <textarea
                rows={2}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Tulis ringkasan singkat 1-2 kalimat yang akan tampil pada kartu cuplikan berita..."
              />
            </div>

            <div className="admin-form-group">
              <label>
                Isi Konten Lengkap <span className="admin-required">*</span>
              </label>
              <RichTextEditor
                value={konten}
                onChange={setKonten}
                placeholder="Tuliskan isi berita atau artikel selengkapnya di sini..."
              />
            </div>
          </div>
        </div>

        {/* Kolom kanan: pengaturan */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Pengaturan Publikasi</h2>
            </div>
            <div className="admin-card-body">
              <div className="admin-form-group">
                <label>Penulis</label>
                <input type="text" value={penulis} onChange={(e) => setPenulis(e.target.value)} />
              </div>

              <div className="admin-form-group">
                <label>Kategori</label>
                <input
                  type="text"
                  list="kategori-suggestions"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  placeholder="Sekolah"
                />
                <datalist id="kategori-suggestions">
                  {kategoriList.map((k) => (
                    <option key={k.kategori} value={k.kategori} />
                  ))}
                </datalist>
              </div>

              <PublishBox
                isPublished={isPublished}
                publishedAt={publishedAt}
                isSticky={isSticky}
                lockModifiedDate={lockModifiedDate}
                onChange={(patch) => {
                  if (patch.is_published !== undefined) setIsPublished(patch.is_published);
                  if (patch.published_at !== undefined) setPublishedAt(patch.published_at);
                  if (patch.is_sticky !== undefined) setIsSticky(patch.is_sticky);
                  if (patch.lock_modified_date !== undefined) setLockModifiedDate(patch.lock_modified_date);
                }}
              />
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Pilih Tags</h2>
            </div>
            <div className="admin-card-body">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {localTags.map((t) => {
                  const active = selectedTags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={`admin-tag-chip ${active ? "admin-tag-chip-active" : ""}`}
                    >
                      {active ? "✓ " : ""}
                      {t}
                    </button>
                  );
                })}
                {localTags.length === 0 && <span className="admin-cell-muted">Belum ada tag.</span>}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  type="text"
                  className="admin-input"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="Tag baru…"
                  style={{ flex: 1 }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addNewTag();
                    }
                  }}
                />
                <button type="button" className="admin-btn admin-btn-secondary" onClick={addNewTag}>
                  + Tambah
                </button>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Gambar Utama</h2>
            </div>
            <div className="admin-card-body">
              <div className="admin-image-field">
                {gambar ? (
                  <img src={gambar} alt="" className="admin-image-preview" />
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
                          if (file) handleUpload(file);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="admin-media-tab-btn"
                      onClick={() => setMediaPickerOpen(true)}
                    >
                      📚 Pustaka Media
                    </button>
                  </div>
                  {uploading && <div className="admin-form-hint">Mengunggah…</div>}
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="atau tempel URL gambar"
                    value={gambar}
                    onChange={(e) => setGambar(e.target.value)}
                    style={{ marginTop: 6 }}
                  />
                </div>
              </div>
              <MediaLibraryModal
                open={mediaPickerOpen}
                onClose={() => setMediaPickerOpen(false)}
                onSelect={setGambar}
              />
            </div>
          </div>
        </div>
      </div>

      <ToastStack toasts={toasts} />
    </div>
  );
}
