import { redirect } from "next/navigation";

// Halaman /tata-busana sudah digabung ke template generik /jurusan/[slug].
// Redirect permanen dipertahankan supaya tautan/bookmark lama tetap jalan.
export default function TataBusanaRedirect() {
  redirect("/jurusan/tata-busana");
}
