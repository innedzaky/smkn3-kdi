import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import { identitasSekolah } from "@/data/pages-content";

export const metadata: Metadata = {
  title: "Identitas Sekolah",
  description:
    "Data identitas resmi SMK Negeri 3 Kendari: NPSN, akreditasi, alamat, dan kontak.",
};

function TableGroup({ title, rows }: { title: string; rows: { label: string; value: string }[] }) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", fontSize: "1.2rem", marginBottom: "1rem", maxWidth: 820, marginLeft: "auto", marginRight: "auto" }}>
        {title}
      </h2>
      <table className="identitas-table">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th>{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function IdentitasSekolahPage() {
  return (
    <main className="content-page">
      <PageHero
        label="Profil Sekolah"
        title="Identitas Sekolah"
        breadcrumb="Identitas Sekolah"
      />

      <section>
        <div className="section-inner">
          <TableGroup title="Data Satuan Pendidikan" rows={identitasSekolah.satuanPendidikan} />
          <TableGroup title="Perizinan & Akreditasi" rows={identitasSekolah.perizinan} />
          <TableGroup title="Sarana Pendukung" rows={identitasSekolah.sarana} />
          <TableGroup title="Kontak Resmi" rows={identitasSekolah.kontak} />
        </div>
      </section>
    </main>
  );
}
