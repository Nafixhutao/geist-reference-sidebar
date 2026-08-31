import { AdminShell } from "@/features/admin/components/admin-shell";

/** All /admin routes share the admin-only chrome (separate from customer nav). */
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
