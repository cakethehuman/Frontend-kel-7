"use client";

import { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import "@/app/css/constants.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError("Silakan isi email dan password Anda.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal masuk. Periksa kembali email dan password.");
      }

      setSuccess("Login berhasil! Mengalihkan...");

      localStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("currentUser", JSON.stringify(data.user));

      window.dispatchEvent(new Event("authChange"));

      setTimeout(() => {
        if (data.user.is_admin === 1) {
          router.push("/admin");
        } else {
          router.push("/menu");
        }
      }, 700);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Terjadi kesalahan saat login.");
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
              <h1 className="fs-2 text-danger fw-bold mb-1">LOGIN</h1>
              <p className="text-muted small">Masuk ke akun Mie Belitung Anda</p>
            </div>

            {error && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}

            {success && <Alert variant="success">{success}</Alert>}

            <Form
              id="loginForm"
              className="d-flex flex-column gap-3 w-100"
              onSubmit={handleSubmit}
            >
              <Form.Group>
                <Form.Label htmlFor="Email">Email</Form.Label>
                <Form.Control
                  type="email"
                  id="Email"
                  name="Email"
                  placeholder="cake@gmail.com"
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
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                    Memproses...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </Form>

            <div className="d-flex justify-content-center p-2 mt-3">
              <div className="d-flex flex-column gap-2 text-center small">
                <Link href="/auth/register" className="text-decoration-none">
                  Belum punya akun? Daftar di sini
                </Link>
                <Link href="/auth/forget-password" className="text-decoration-none text-muted">
                  Lupa password?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
