"use client";

import { FormEvent } from "react";

const NOMOR_PANITIA = "6285241063842"; // ganti dengan nomor WA resmi panitia SPMB

export default function WhatsappContactForm() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const nama = (form.elements.namedItem("nama") as HTMLInputElement).value;
    const wa = (form.elements.namedItem("wa") as HTMLInputElement).value;
    const pertanyaan = (
      form.elements.namedItem("pertanyaan") as HTMLTextAreaElement
    ).value;

    const pesan = `Halo Panitia SPMB SMK Negeri 3 Kendari,%0A%0ANama: ${encodeURIComponent(
      nama
    )}%0ANo. WhatsApp: ${encodeURIComponent(
      wa
    )}%0APertanyaan: ${encodeURIComponent(pertanyaan)}`;

    window.open(`https://wa.me/${NOMOR_PANITIA}?text=${pesan}`, "_blank");
  }

  return (
    <form className="spmb-wa-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nama-siswa">Nama Calon Siswa / Orang Tua</label>
        <input
          type="text"
          id="nama-siswa"
          name="nama"
          className="form-control"
          placeholder="Masukkan nama lengkap"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="wa-siswa">Nomor WhatsApp Anda</label>
        <input
          type="tel"
          id="wa-siswa"
          name="wa"
          className="form-control"
          placeholder="Contoh: 08123456789"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="pertanyaan-siswa">Detail Pertanyaan / Kendala</label>
        <textarea
          id="pertanyaan-siswa"
          name="pertanyaan"
          className="form-control"
          placeholder="Tuliskan pertanyaan Anda secara detail..."
          style={{ height: 80, resize: "vertical" }}
          required
        />
      </div>
      <button type="submit" className="btn-wa-submit">
        💬 Kirim ke Panitia &amp; Buka WhatsApp
      </button>
    </form>
  );
}
