/**
 * Alamat server Express (backend), TANPA "/api" di belakangnya.
 *
 * Semua endpoint backend berada di bawah "/api" (lihat server.ts di backend),
 * jadi cara pakainya selalu:  fetch(`${API_URL}/api/auth/login`, ...)
 *
 * Atur lewat file `.env.local` di folder frontend:
 *   NEXT_PUBLIC_API_URL=http://localhost:3001
 *
 * Catatan: variabel NEXT_PUBLIC_* dibaca saat `next dev` / `next build` dijalankan,
 * jadi setelah mengubahnya server frontend harus di-restart.
 */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
).replace(/\/+$/, "");

/**
 * Membaca respons sebagai JSON dengan aman.
 *
 * Kalau server membalas sesuatu yang bukan JSON (misalnya halaman HTML 404 atau
 * teks "A server error has occurred" dari hosting), fungsi ini melempar error
 * yang menyebutkan kode status dan alamat yang dipanggil, supaya penyebabnya
 * langsung kelihatan di layar, bukan sekadar "invalid JSON".
 */
export async function readJson<T = any>(res: Response): Promise<T> {
  const text = await res.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    const cuplikan = text.replace(/\s+/g, " ").trim().slice(0, 120);
    console.error(
      `Respons bukan JSON dari ${res.url} (status ${res.status}):`,
      text,
    );
    throw new Error(
      `Server membalas bukan JSON (status ${res.status}) dari ${res.url}. ` +
      `Isi respons: "${cuplikan}". Cek apakah backend berjalan dan NEXT_PUBLIC_API_URL benar.`,
    );
  }
}

