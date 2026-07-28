"use client";

import { CrudManager, type ColumnConfig, type FieldConfig } from "./CrudManager";
import type { AdminUser } from "@/lib/types";

const columns: ColumnConfig<AdminUser>[] = [
  {
    key: "name",
    label: "Nama",
    render: (u) => (
      <div>
        <div className="admin-cell-title">{u.name}</div>
        <div className="admin-cell-muted">@{u.username}</div>
      </div>
    ),
  },
  { key: "email", label: "Email" },
  {
    key: "role",
    label: "Peran",
    render: (u) => <span className="admin-badge admin-badge-accent">{u.role}</span>,
  },
  {
    key: "status",
    label: "Status",
    render: (u) => (
      <span className={`admin-badge ${u.status === "Aktif" ? "admin-badge-success" : "admin-badge-muted"}`}>{u.status}</span>
    ),
  },
  { key: "last_login", label: "Login Terakhir", render: (u) => u.last_login || "Belum pernah" },
];

const fields: FieldConfig[] = [
  { key: "name", label: "Nama Lengkap", type: "text", required: true, placeholder: "Nama lengkap pengguna" },
  { key: "username", label: "Username", type: "text", required: true, placeholder: "username" },
  { key: "email", label: "Email", type: "text", required: true, placeholder: "nama@smkn3kdi.sch.id" },
  {
    key: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    hint: "Wajib diisi saat menambah pengguna baru. Kosongkan saat mengedit jika tidak ingin mengganti password.",
  },
  {
    key: "role",
    label: "Peran",
    type: "select",
    options: [
      { value: "Administrator", label: "Administrator" },
      { value: "Editor", label: "Editor" },
      { value: "Penulis", label: "Penulis" },
      { value: "Staf", label: "Staf" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "Aktif", label: "Aktif" },
      { value: "Nonaktif", label: "Nonaktif" },
    ],
  },
];

export function PenggunaCrudClient({ initialItems }: { initialItems: AdminUser[] }) {
  return (
    <CrudManager
      resource="users"
      title="Pengguna Admin"
      description="Kelola akun yang dapat mengakses Panel Admin CMS ini."
      addLabel="Tambah Pengguna"
      emptyIcon="👥"
      emptyText="Belum ada pengguna lain."
      initialItems={initialItems}
      columns={columns}
      fields={fields}
      defaultValues={{ role: "Editor", status: "Aktif" }}
    />
  );
}
