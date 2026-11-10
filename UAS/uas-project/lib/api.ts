const mentah = process.env.NEXT_PUBLIC_API_URL || "";

export function apiFetch(path: string, init: RequestInit = {}) {
  return fetch(`${mentah}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
}
