import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/shared/PageHero";
import WhatsappContactForm from "@/components/shared/WhatsappContactForm";
import { jadwalSPMBLengkap, dokumenWajibSPMB } from "@/data/pages-content";
import { getJurusan } from "@/lib/queries";

export const metadata: Metadata = {
  title: "SPMB 2026",
  description:
    "Portal Informasi Sistem Penerimaan Murid Baru (SPMB) SMK Negeri 3 Kendari Tahun Ajaran 2026/2027.",
};

export const revalidate = 60;

export default async function SpmbPage() {
  const jurusan = await getJurusan();

  return (
    <main className="content-page">
      <PageHero
        label="Portal Informasi"
        title="SPMB 2026"
        breadcrumb="SPMB"
      />

      <section>
        <div className="section-inner">
          <div className="spmb-layout">
            <div>
              <Image
                src="/images/flayer-spmb.jpg"
                alt="Flayer SPMB SMKN 3 Kendari"
                width={1000}
                height={600}
                className="spmb-flyer"
              />

              <div
                style={{
                  display: "inline-block",
                  background: "#fdecea",
                  color: "var(--red)",
                  border: "1px solid rgba(192,57,43,0.25)",
                  borderRadius: 8,
                  padding: "0.6rem 1rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: "1.2rem",
                }}
              >
                🔒 Pendaftaran SPMB Tahun Ajaran 2026/2027 telah{" "}
                <strong>ditutup</strong>. Informasi di halaman ini kami
                simpan sebagai arsip. Terima kasih atas antusiasme seluruh
                calon peserta didik.
              </div>

              <p className="section-desc" style={{ maxWidth: "none" }}>
                Penerimaan Peserta Didik Baru SMK Negeri 3 Kendari untuk
                Tahun Ajaran 2026/2027 telah selesai dilaksanakan. Kami
                mengucapkan terima kasih kepada seluruh lulusan SMP/MTs
                sederajat yang telah mendaftar bergabung bersama institusi
                kejuruan pariwisata dan teknologi informasi terkemuka ini.
              </p>

              <h2 className="spmb-section-title">🌐 Alur Pendaftaran Online (Arsip)</h2>
              <ul className="spmb-list">
                <li>
                  Pendaftaran online dapat diakses langsung melalui halaman
                  utama situs ini pada bagian formulir SPMB.
                </li>
                <li>
                  Calon siswa didampingi orang tua mengisi data identitas
                  diri, nilai rapor, serta menentukan kompetensi keahlian
                  (jurusan) pilihan dengan akurat.
                </li>
                <li>
                  Pastikan nomor kontak yang diinput aktif dan terhubung ke
                  WhatsApp untuk konfirmasi nomor seleksi dan verifikasi
                  berkas.
                </li>
              </ul>

              <h2 className="spmb-section-title">
                🔁 Kelengkapan Berkas &amp; Daftar Ulang
              </h2>
              <p className="section-desc" style={{ maxWidth: "none", marginBottom: "0.5rem" }}>
                Verifikasi berkas fisik dilaksanakan sesuai jadwal kelompok
                kompetensi keahlian masing-masing demi menjaga ketertiban.
                Dokumen wajib yang diserahkan saat validasi offline:
              </p>
              <ul className="spmb-doc-list">
                {dokumenWajibSPMB.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>

              <h2 className="spmb-section-title">
                🎓 Pilihan Kompetensi Keahlian (TEFA)
              </h2>
              <p className="section-desc" style={{ maxWidth: "none", marginBottom: "1rem" }}>
                Siswa dapat memilih salah satu dari 5 program unggulan
                Teaching Factory (TEFA) yang berstandar DUDIKA:
              </p>
              {jurusan.map((j) => (
                <div className="spmb-jurusan-card" key={j.slug}>
                  <div className="spmb-jurusan-icon">{j.icon}</div>
                  <div>
                    <strong>{j.nama}</strong>
                    <span>{j.deskripsi}</span>
                  </div>
                </div>
              ))}

              <div className="spmb-btn-group">
                <Link href="/#program" className="btn-primary" style={{ background: "var(--navy)" }}>
                  👁 Lihat Semua Detail Silabus Jurusan
                </Link>
                <Link href="/#kontak" className="btn-primary">
                  💬 Hubungi Kami
                </Link>
              </div>

              <h2 className="spmb-section-title">💬 Hubungi Panitia SPMB</h2>
              <p className="section-desc" style={{ maxWidth: "none", marginBottom: "1rem" }}>
                Punya pertanyaan seputar pendaftaran? Isi formulir di bawah
                ini untuk tersambung otomatis dengan salah satu Panitia
                aktif kami melalui WhatsApp.
              </p>
              <div className="ppdb-container" style={{ margin: 0 }}>
                <WhatsappContactForm />
              </div>
            </div>

            <aside>
              <div className="spmb-widget">
                <div className="spmb-widget-title">📅 Jadwal SPMB 2026</div>
                <div style={{ overflowX: "auto" }}>
                  <table className="spmb-schedule-table">
                    <thead>
                      <tr>
                        <th>Kegiatan</th>
                        <th>Waktu</th>
                        <th>Tempat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jadwalSPMBLengkap.map((row) => (
                        <tr key={row.kegiatan}>
                          <td>
                            <strong>{row.kegiatan}</strong>
                          </td>
                          <td>{row.waktu}</td>
                          <td>{row.tempat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="spmb-widget">
                <div className="spmb-widget-title">📣 Papan Informasi</div>
                <div className="spmb-info-item">
                  🔘 Sinkronisasi database pendaftaran dengan panitia pusat
                  berjalan otomatis melalui sistem terintegrasi.
                </div>
                <div className="spmb-info-item">
                  🔘 Tidak dipungut biaya pendaftaran formulir (Gratis).
                </div>
                <div className="spmb-info-item">
                  🔘 Status Akreditasi Lembaga resmi: <strong>B</strong>.
                </div>
              </div>

              <div className="spmb-widget">
                <div className="spmb-widget-title">🏫 Sekretariat SPMB</div>
                <div className="spmb-contact-item">
                  📍 Jl. Budi Utomo No.1, Kadia, Kota Kendari
                </div>
                <div className="spmb-contact-item">
                  💬 +62 401-3191136
                </div>
                <div className="spmb-contact-item">
                  ✉️ smkn3kdi@gmail.com
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
