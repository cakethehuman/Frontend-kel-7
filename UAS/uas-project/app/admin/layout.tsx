"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Spinner } from "react-bootstrap";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("user") || sessionStorage.getItem("currentUser");
      if (!rawUser) {
        router.replace("/auth/login");
        return;
      }

      const user = JSON.parse(rawUser);
      if (user.is_admin !== 1) {
        alert("Akses ditolak: Halaman ini hanya untuk Administrator!");
        router.replace("/menu");
        return;
      }

      setAuthorized(true);
    } catch (e) {
      console.error("Auth check error in admin layout:", e);
      router.replace("/auth/login");
    } finally {
      setChecking(false);
    }
  }, [router]);

  if (checking || !authorized) {
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
