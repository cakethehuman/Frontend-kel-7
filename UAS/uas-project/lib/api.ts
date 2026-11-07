export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function headerAdmin(): Record<string, string> {
  let userId = "";
  try {
    const raw =
      localStorage.getItem("user") || sessionStorage.getItem("currentUser");
    if (raw) userId = String(JSON.parse(raw).user_id ?? "");
  } catch {
    userId = "";
  }
  return { "Content-Type": "application/json", "x-user-id": userId };
}