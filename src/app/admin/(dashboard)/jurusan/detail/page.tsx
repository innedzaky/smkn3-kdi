import {
  adminGetJurusan,
  adminGetJurusanSkill,
  adminGetJurusanChip,
  adminGetJurusanGaleriDetail,
  adminGetJurusanGuru,
} from "@/lib/admin-queries";
import { JurusanSkillCrudClient } from "@/components/admin/JurusanSkillCrudClient";
import { JurusanChipCrudClient } from "@/components/admin/JurusanChipCrudClient";
import { JurusanGaleriDetailCrudClient } from "@/components/admin/JurusanGaleriDetailCrudClient";
import { JurusanGuruCrudClient } from "@/components/admin/JurusanGuruCrudClient";

export default async function AdminJurusanDetailPage() {
  const [jurusan, skills, chips, galeri, guru] = await Promise.all([
    adminGetJurusan(),
    adminGetJurusanSkill(),
    adminGetJurusanChip(),
    adminGetJurusanGaleriDetail(),
    adminGetJurusanGuru(),
  ]);

  const jurusanOptions = jurusan.map((j) => ({ value: String(j.id), label: j.nama }));

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Detail Halaman Jurusan</h1>
          <p>
            Kelola konten tambahan yang tampil di halaman detail tiap jurusan
            (/jurusan/[slug]) — keterampilan, fasilitas, peluang karier, galeri
            kegiatan/karya siswa, dan guru jurusan. Untuk data dasar (nama,
            deskripsi, gambar, brosur), edit lewat menu Jurusan.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <JurusanSkillCrudClient initialItems={skills} jurusanOptions={jurusanOptions} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <JurusanChipCrudClient initialItems={chips} jurusanOptions={jurusanOptions} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <JurusanGaleriDetailCrudClient initialItems={galeri} jurusanOptions={jurusanOptions} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <JurusanGuruCrudClient initialItems={guru} jurusanOptions={jurusanOptions} />
      </div>
    </div>
  );
}
