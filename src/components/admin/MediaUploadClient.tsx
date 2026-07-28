"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ToastStack, type ToastMessage } from "./Toast";

interface UploadRow {
  id: number;
  file: File;
  previewUrl: string | null;
  status: "pending" | "uploading" | "done" | "error";
  errorMessage?: string;
}

let rowSeq = 1;
let toastSeq = 1;

const ALLOWED_HINT = "JPG, PNG, WEBP, GIF (maks. 2MB) atau PDF (maks. 5MB). Gambar otomatis dikompres di bawah 80KB saat disimpan.";

export function MediaUploadClient() {
  const [rows, setRows] = useState<UploadRow[]>([]);
  const [dragging, setDragging] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const pushToast = (type: ToastMessage["type"], text: string) => {
    const id = toastSeq++;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  const uploadRow = async (row: UploadRow) => {
    setRows((list) => list.map((r) => (r.id === row.id ? { ...r, status: "uploading" } : r)));
    try {
      const fd = new FormData();
      fd.append("file", row.file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengunggah");
      setRows((list) => list.map((r) => (r.id === row.id ? { ...r, status: "done" } : r)));
    } catch (err: any) {
      setRows((list) =>
        list.map((r) =>
          r.id === row.id ? { ...r, status: "error", errorMessage: err.message || "Gagal mengunggah" } : r
        )
      );
    }
  };

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    const newRows: UploadRow[] = Array.from(fileList).map((file) => ({
      id: rowSeq++,
      file,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      status: "pending",
    }));
    setRows((list) => [...list, ...newRows]);
    newRows.forEach((row) => uploadRow(row));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const doneCount = rows.filter((r) => r.status === "done").length;
  const hasFinished = rows.length > 0 && rows.every((r) => r.status === "done" || r.status === "error");

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Tambahkan File Media</h1>
          <p>Unggah gambar atau file untuk disimpan di Pustaka Media. Bisa pilih atau seret beberapa file sekaligus.</p>
        </div>
        <Link href="/admin/media" className="admin-btn admin-btn-secondary">
          ← Pustaka Media
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-card-body">
          <div
            className={`admin-dropzone ${dragging ? "dragging" : ""}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <div className="admin-dropzone-icon">📤</div>
            <p><strong>Klik untuk pilih file</strong> atau seret &amp; lepas di sini</p>
            <p className="admin-dropzone-hint">{ALLOWED_HINT}</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              style={{ display: "none" }}
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {rows.length > 0 && (
            <div className="admin-upload-list">
              {rows.map((row) => (
                <div key={row.id} className="admin-upload-row">
                  {row.previewUrl ? (
                    <img src={row.previewUrl} alt="" className="admin-upload-row-thumb" />
                  ) : (
                    <div className="admin-upload-row-file">📄</div>
                  )}
                  <div className="admin-upload-row-name">{row.file.name}</div>
                  <div className={`admin-upload-row-status ${row.status === "done" ? "ok" : row.status === "error" ? "err" : "pending"}`}>
                    {row.status === "pending" && "Menunggu…"}
                    {row.status === "uploading" && "Mengunggah…"}
                    {row.status === "done" && "✓ Berhasil"}
                    {row.status === "error" && (row.errorMessage || "Gagal")}
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasFinished && (
            <div style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "center" }}>
              <span className="admin-form-hint">
                {doneCount} dari {rows.length} file berhasil diunggah.
              </span>
              <Link href="/admin/media" className="admin-btn admin-btn-primary">
                Lihat di Pustaka Media
              </Link>
            </div>
          )}
        </div>
      </div>

      <ToastStack toasts={toasts} />
    </div>
  );
}
