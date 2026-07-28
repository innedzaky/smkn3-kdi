import Link from "next/link";
import { getDashboardStats } from "@/lib/admin-queries";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total Berita", value: stats.totalBerita, icon: "📰", color: "#2563eb", href: "/admin/berita" },
    { label: "Prestasi", value: stats.totalPrestasi, icon: "🏆", color: "#d97706", href: "/admin/prestasi" },
    { label: "Foto Galeri", value: stats.totalGaleri, icon: "🖼️", color: "#7c3aed", href: "/admin/galeri" },
    { label: "Agenda", value: stats.totalAgenda, icon: "📅", color: "#16a34a", href: "/admin/agenda" },
    { label: "Pengumuman Aktif", value: stats.totalPengumumanAktif, icon: "📢", color: "#dc2626", href: "/admin/pengumuman" },
    { label: "Jurusan", value: stats.totalJurusan, icon: "🎓", color: "#0891b2", href: "/admin/jurusan" },
    { label: "Pengguna Admin", value: stats.totalUsers, icon: "👥", color: "#4f46e5", href: "/admin/pengguna" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Ringkasan konten website SMK Negeri 3 Kendari.</p>
        </div>
      </div>

      <div className="admin-stat-grid">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="admin-stat-card">
            <div className="admin-stat-card-top">
              <div className="admin-stat-icon" style={{ background: `${c.color}1f`, color: c.color }}>
                {c.icon}
              </div>
            </div>
            <div className="admin-stat-value">{c.value}</div>
            <div className="admin-stat-label">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Berita Terbaru</h2>
          <Link href="/admin/berita" className="admin-btn admin-btn-secondary">
            Lihat Semua
          </Link>
        </div>
        <div className="admin-table-wrap">
          {stats.beritaTerbaru.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">📰</div>
              <p>Belum ada berita. Tambahkan berita pertama Anda.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {stats.beritaTerbaru.map((b) => (
                  <tr key={b.id}>
                    <td className="admin-cell-title">{b.judul}</td>
                    <td className="admin-cell-muted">{b.kategori}</td>
                    <td>
                      <span className={`admin-badge ${b.is_published ? "admin-badge-success" : "admin-badge-muted"}`}>
                        {b.is_published ? "Terbit" : "Draf"}
                      </span>
                    </td>
                    <td className="admin-cell-muted">{b.published_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
