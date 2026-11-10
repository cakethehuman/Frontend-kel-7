const mentah = process.env.NEXT_PUBLIC_API_URL || "";

export const API_URL = mentah.replace(/\/+$/, "").replace(/\/api$/, "");

export function apiFetch(path: string, init: RequestInit = {}) {
  return fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
}
