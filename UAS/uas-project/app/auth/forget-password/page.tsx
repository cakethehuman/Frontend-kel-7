"use client";

import { useEffect, useLayoutEffect, useState, type FormEvent } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import "@/app/css/constants.css";

const JEDA_KIRIM_ULANG = 60;

type Langkah = "email" | "reset" | "selesai";

async function panggil(path: string, body: object) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message ?? "Terjadi kesalahan. Coba lagi.");
  return data as { message?: string };
}

function pesanError(err: unknown): string {
  if (err instanceof TypeError) {
    return "Tidak bisa terhubung ke server. Pastikan backend sudah berjalan.";
  }
  return err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.";
}

export default function ForgetPasswordPage() {
  const [langkah, setLangkah] = useState<Langkah>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [jeda, setJeda] = useState(0);

  // Countdown delay untuk tombol "Kirim ulang kode"
  useEffect(() => {
    if (jeda <= 0) return;
    const timer = setTimeout(() => setJeda((n) => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [jeda]);

  useLayoutEffect(() => {
    if (langkah !== "selesai") return;
    return () => {
      setLangkah("email");
      setEmail("");
      setOtp("");
      setPasswordBaru("");
      setKonfirmasi("");
      setError("");
      setInfo("");
      setJeda(0);
    };
  }, [langkah]);

  async function kirimKode() {
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const data = await panggil("/api/auth/forgot-password", { email: email.trim() });
      setInfo(data.message ?? "Kode verifikasi dikirim.");
      setLangkah("reset");
      setJeda(JEDA_KIRIM_ULANG);
    } catch (err) {
      setError(pesanError(err));
    } finally {
      setLoading(false);
    }
  }

  function handleKirimKode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    kirimKode();
  }

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Kode verifikasi harus 6 digit angka.");
      return;
    }
    if (passwordBaru.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (passwordBaru !== konfirmasi) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);
    try {
      await panggil("/api/auth/reset-password", {
        email: email.trim(),
        otp,
        new_password: passwordBaru,
      });
      setLangkah("selesai");
    } catch (err) {
      setError(pesanError(err));
    } finally {
      setLoading(false);
    }
  }

  function gantiEmail() {
    setLangkah("email");
    setOtp("");
    setPasswordBaru("");
    setKonfirmasi("");
    setError("");
    setInfo("");
  }

  return (
    <section className="login">
      <Container className="d-flex justify-content-center align-items-center p-5 min-vh-100">
        <div className="d-flex bg-light w-50 rounded justify-content-center align-items-center">
          <div className="p-4 w-100">
            <div className="d-flex justify-content-center">
              <h1 className="fs-2">Lupa Password</h1>
            </div>

            {error && <Alert variant="danger" className="mt-3 mb-0">{error}</Alert>}
            {info && langkah === "reset" && (
              <Alert variant="success" className="mt-3 mb-0">{info}</Alert>
            )}

            {langkah === "email" && (
              <Form className="d-flex flex-column gap-3 w-100 mt-3" onSubmit={handleKirimKode}>
                <p className="text-muted mb-0">
                  Masukkan email akunmu. Kami akan mengirim kode verifikasi 6 digit.
                </p>
                <Form.Group>
                  <Form.Label htmlFor="Email">Email</Form.Label>
                  <Form.Control
                    type="email"
                    id="Email"
                    name="Email"
                    placeholder="Cake@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit" disabled={loading} className="bg-primary-color text-light w-100">
                  {loading ? "Mengirim..." : "Kirim Kode Verifikasi"}
                </Button>
              </Form>
            )}

            {langkah === "reset" && (
              <Form className="d-flex flex-column gap-3 w-100 mt-3" onSubmit={handleReset}>
                <p className="text-muted mb-0">
                  Kode dikirim ke <b>{email}</b>. Berlaku 10 menit.{" "}
                  <button type="button" className="btn btn-link p-0 align-baseline" onClick={gantiEmail}>
                    Ganti email
                  </button>
                </p>

                <Form.Group>
                  <Form.Label htmlFor="otp">Kode Verifikasi</Form.Label>
                  <Form.Control
                    id="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="6 digit"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="passwordBaru">Password Baru</Form.Label>
                  <Form.Control
                    type="password"
                    id="passwordBaru"
                    autoComplete="new-password"
                    value={passwordBaru}
                    onChange={(e) => setPasswordBaru(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="konfirmasi">Konfirmasi Password Baru</Form.Label>
                  <Form.Control
                    type="password"
                    id="konfirmasi"
                    autoComplete="new-password"
                    value={konfirmasi}
                    onChange={(e) => setKonfirmasi(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button type="submit" disabled={loading} className="bg-primary-color text-light w-100">
                  {loading ? "Memproses..." : "Ubah Password"}
                </Button>

                <Button
                  type="button"
                  variant="link"
                  disabled={jeda > 0 || loading}
                  onClick={kirimKode}
                >
                  {jeda > 0 ? `Kirim ulang kode (${jeda} dtk)` : "Kirim ulang kode"}
                </Button>
              </Form>
            )}

            {langkah === "selesai" && (
              <div className="text-center mt-3">
                <Alert variant="success">
                  Password berhasil diubah. Silakan login dengan password baru.
                </Alert>
                <Link href="/auth/login" className="btn bg-primary-color text-light w-100">
                  Ke Halaman Login
                </Link>
              </div>
            )}

            {langkah !== "selesai" && (
              <div className="d-flex justify-content-center p-2">
                <div className="d-flex flex-column gap-2 text-center">
                  <Link href="/auth/login">Kembali ke login</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
