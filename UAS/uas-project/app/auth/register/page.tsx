"use client";

import { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/app/css/constants.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 3) {
      setError("Nama minimal 3 karakter.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter demi pengukuran keamanan.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mendaftar.");
      }

      setSuccess("Pendaftaran berhasil! Mengalihkan ke halaman login...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (err: any) {
      console.error("Register error:", err);
      setError(err.message || "Terjadi kesalahan saat registrasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login">
      <Container className="d-flex justify-content-center align-items-center p-3 p-md-5 min-vh-100">
        <div className="d-flex bg-light col-12 col-md-8 col-lg-5 rounded-4 shadow-sm justify-content-center align-items-center">
          <div className="p-4 p-md-5 w-100">
            <div className="d-flex flex-column align-items-center mb-4">
              <h1 className="fs-2 text-danger fw-bold mb-1">REGISTER</h1>
              <p className="text-muted small">Buat akun baru untuk memesan Mie Belitung</p>
            </div>

            {error && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}

            {success && <Alert variant="success">{success}</Alert>}

            <Form
              id="registerForm"
              className="d-flex flex-column gap-3 w-100"
              onSubmit={handleSubmit}
            >
              <Form.Group>
                <Form.Label htmlFor="Name">Nama Lengkap</Form.Label>
                <Form.Control
                  type="text"
                  id="Name"
                  name="Name"
                  placeholder="Contoh: Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor="Email">Email</Form.Label>
                <Form.Control
                  type="email"
                  id="Email"
                  name="Email"
                  placeholder="budi@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor="Password">Password</Form.Label>
                <Form.Control
                  type="password"
                  id="Password"
                  name="Password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor="confirmPassword">
                  Konfirmasi Password
                </Form.Label>
                <Form.Control
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Ketik ulang password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                disabled={loading}
                className="bg-primary-color text-light w-100 py-2 mt-2 fw-semibold"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Mendaftarkan...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </Form>

            <div className="d-flex justify-content-center p-2 mt-3">
              <Link href="/auth/login" className="text-decoration-none small">
                Sudah punya akun? Masuk di sini
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
