"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Table, Spinner, Alert, Card, Row, Col } from "react-bootstrap";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Feedback {
  feedback_id: number;
  user_id: number;
  name: string;
  email: string | null;
  rating: number;
  category: string;
  message: string;
  created_at: string;
  user?: { name: string; email: string };
}

const categoryColors: Record<string, string> = {
  Makanan: "danger",
  Pelayanan: "primary",
  Tempat: "success",
  Lainnya: "secondary",
};

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/feedback`);
      if (!res.ok) {
        throw new Error("Gagal mengambil data feedback dari server.");
      }
      const data = await res.json();
      setFeedbacks(data);
    } catch (err: any) {
      console.error("Error fetching feedbacks:", err);
      setError(err.message || "Gagal memuat feedback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const average =
    feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
      : 0;
  const positiveCount = feedbacks.filter((f) => f.rating >= 4).length;

  return (
    <div className="container-fluid px-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Feedback Pelanggan</h2>
          <p className="text-muted mb-0">
            Kritik, saran, dan penilaian yang dikirim pelanggan Mie Belitung.
          </p>
        </div>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={fetchFeedbacks}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh Feedback
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row className="g-3 mb-4">
        <Col xs={12} sm={4}>
          <Card className="border-0 shadow-sm rounded-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                <i className="bi bi-chat-dots-fill fs-4"></i>
              </div>
              <div>
                <div className="text-muted small">Total Feedback</div>
                <div className="fs-3 fw-bold">{feedbacks.length}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={4}>
          <Card className="border-0 shadow-sm rounded-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                <i className="bi bi-star-fill fs-4"></i>
              </div>
              <div>
                <div className="text-muted small">Rata-rata Rating</div>
                <div className="fs-3 fw-bold">{average.toFixed(1)} / 5</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={4}>
          <Card className="border-0 shadow-sm rounded-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                <i className="bi bi-hand-thumbs-up-fill fs-4"></i>
              </div>
              <div>
                <div className="text-muted small">Rating Positif (4–5)</div>
                <div className="fs-3 fw-bold">{positiveCount}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading && feedbacks.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
          <p className="mt-2 text-muted">Memuat data feedback...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <Card className="text-center p-5 border-0 shadow-sm rounded-3">
          <i className="bi bi-chat-dots fs-1 text-muted mb-2"></i>
          <h4>Belum Ada Feedback</h4>
          <p className="text-muted">
            Feedback yang dikirim pelanggan dari halaman kontak akan muncul di sini.
          </p>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
          <Table striped hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Pengirim</th>
                <th>Kategori</th>
                <th>Rating</th>
                <th>Pesan</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((f) => (
                <tr key={f.feedback_id}>
                  <td className="text-muted">#{f.feedback_id}</td>
                  <td>
                    <div className="fw-semibold">{f.name}</div>
                    <small className="text-muted">{f.email || f.user?.email || "-"}</small>
                  </td>
                  <td>
                    <Badge bg={categoryColors[f.category] || "secondary"}>
                      {f.category}
                    </Badge>
                  </td>
                  <td>
                    <span className="fw-bold text-warning">
                      <i className="bi bi-star-fill me-1"></i>
                      {f.rating}
                    </span>
                    <span className="text-muted small"> / 5</span>
                  </td>
                  <td style={{ minWidth: "260px", maxWidth: "420px", whiteSpace: "normal" }}>
                    {f.message}
                  </td>
                  <td>
                    <small className="text-muted">
                      {new Date(f.created_at).toLocaleString("id-ID", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
}
