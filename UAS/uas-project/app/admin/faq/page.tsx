"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Faq {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
}

const emptyForm = { question: "", answer: "", sort_order: 0 };



export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [muatUlang, setMuatUlang] = useState(0);
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let aktif = true;

    const muat = async () => {
      try {
        const res = await fetch(`${API_URL}/faqs`, { credentials: "include" });
        if (!res.ok) throw new Error("Gagal mengambil data FAQ dari server.");
        const data: unknown = await res.json();
        if (aktif) {
          setFaqs(Array.isArray(data) ? (data as Faq[]) : []);
          setError(null);
        }
      } catch (err) {
        if (aktif) {
          setError(err instanceof Error ? err.message : "Gagal memuat FAQ.");
        }
      } finally {
        if (aktif) setLoading(false);
      }
    };

    muat();
    return () => {
      aktif = false;
    };
  }, [muatUlang]);

  const bukaTambah = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShow(true);
  };

  const bukaEdit = (faq: Faq) => {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      sort_order: faq.sort_order,
    });
    setShow(true);
  };

  const simpan = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const sedangEdit = editingId !== null;
      const res = await fetch(
        sedangEdit ? `${API_URL}/faqs/${editingId}` : `${API_URL}/faqs`,
        {
          method: sedangEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: form.question.trim(),
            answer: form.answer.trim(),
            sort_order: form.sort_order,
          }),
          credentials: "include"
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan FAQ");

      setShow(false);
      setMuatUlang((n) => n + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan FAQ");
    } finally {
      setSaving(false);
    }
  };

  const hapus = async (faq: Faq) => {
    if (!confirm(`Yakin ingin menghapus FAQ "${faq.question}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/faqs/${faq.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus FAQ");
      }

      setMuatUlang((n) => n + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus FAQ");
    }
  };

  return (
    <div className="container-fluid px-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manajemen FAQ</h2>
          <p className="text-muted mb-0">
            Tambah, edit, atau hapus pertanyaan yang tampil di halaman utama.
          </p>
        </div>
        <Button
          variant="danger"
          onClick={bukaTambah}
          className="d-flex align-items-center gap-1"
        >
          <i className="bi bi-plus-lg"></i>
          <span>Tambah FAQ</span>
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
          <p className="mt-2 text-muted">Memuat data FAQ...</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
          <Table striped hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "80px" }}>Urutan</th>
                <th>Pertanyaan</th>
                <th>Jawaban</th>
                <th className="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {faqs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    Belum ada data FAQ.
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id}>
                    <td className="fw-semibold">{faq.sort_order}</td>
                    <td className="fw-bold">{faq.question}</td>
                    <td style={{ maxWidth: "320px" }}>
                      <div
                        className="small text-muted text-truncate"
                        title={faq.answer}
                      >
                        {faq.answer}
                      </div>
                    </td>
                    <td className="text-end text-nowrap">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => bukaEdit(faq)}
                      >
                        <i className="bi bi-pencil-square me-1"></i>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => hapus(faq)}
                      >
                        <i className="bi bi-trash3 me-1"></i>
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      )}

      <Modal show={show} onHide={() => !saving && setShow(false)} centered>
        <Form onSubmit={simpan}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold text-danger">
              {editingId === null ? "Tambah FAQ Baru" : "Edit FAQ"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Pertanyaan{" "}
                <small className="text-muted fw-normal">
                  ({form.question.length}/200)
                </small>
              </Form.Label>
              <Form.Control
                required
                minLength={5}
                maxLength={200}
                placeholder="Contoh: Apakah ada tempat parkir?"
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Jawaban{" "}
                <small className="text-muted fw-normal">
                  ({form.answer.length}/1000)
                </small>
              </Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={4}
                minLength={5}
                maxLength={1000}
                placeholder="Tulis jawaban singkat dan jelas"
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
              />
            </Form.Group>

            {editingId !== null && (
              <Form.Group>
                <Form.Label className="fw-semibold">Urutan tampil</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({ ...form, sort_order: Number(e.target.value) })
                  }
                />
                <Form.Text className="text-muted">
                  Angka lebih kecil tampil lebih dulu.
                </Form.Text>
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              disabled={saving}
              onClick={() => setShow(false)}
            >
              Batal
            </Button>
            <Button variant="danger" type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan FAQ"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
