"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiFetch } from "@/lib/api";

type User = {
  user_id: number;
  name: string;
  email: string;
  is_admin: number;
  role: string;
  bio: string;
  tags: string;
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cek ke backend: apakah cookie token masih valid?
  const refresh = useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/me");
      setUser(res.ok ? (await res.json()).user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Dijalankan sekali saat aplikasi pertama dibuka
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Opsional: kalau ada request yang dijawab 401, anggap sesi habis
  // (event ini dikirim oleh apiFetch, lihat pembahasan sebelumnya)
  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener("sessionExpired", onExpired);
    return () => window.removeEventListener("sessionExpired", onExpired);
  }, []);

  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
