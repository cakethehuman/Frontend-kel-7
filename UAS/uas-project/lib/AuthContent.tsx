"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { API_URL } from "./api";

type User = {
  user_id: number; name: string; email: string;
  is_admin: number; role: string; bio: string; tags: string;
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

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });
      setUser(res.ok ? (await res.json()).user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refreshes the page when opening the page for the first time
  useEffect(() => { refresh(); }, [refresh]);

  const logout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
    setUser(null);
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
