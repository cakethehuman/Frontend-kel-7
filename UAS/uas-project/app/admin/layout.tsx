import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      <AdminSidebar />
      <main className="flex-grow-1 p-3 p-md-4 bg-light">
        {children}
      </main>
    </div>
  );
}
