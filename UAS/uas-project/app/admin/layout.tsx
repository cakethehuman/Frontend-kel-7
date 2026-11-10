"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "react-bootstrap";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/AuthContent";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const isAdmin = user?.is_admin === 1;

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth/login");
    else if (!isAdmin) router.replace("/menu");
  }, [loading, user, isAdmin, router]);

  if (loading || !isAdmin) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
        <Spinner animation="border" variant="danger" />
        <p className="mt-3 text-muted">Memeriksa hak akses admin...</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      <AdminSidebar />
      <main className="flex-grow-1 p-3 p-md-4 bg-light overflow-auto">
        {children}
      </main>
    </div>
  );
}
