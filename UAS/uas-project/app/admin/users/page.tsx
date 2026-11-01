"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Table, Spinner, Alert, Card, Row, Col } from "react-bootstrap";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface User {
  id: number;
  user_id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  role_title?: string;
  is_admin: number;
  total_orders: number;
  total_spent: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/users`);
      if (!res.ok) {
        throw new Error("Gagal mengambil data pengguna dari server.");
      }
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Gagal memuat pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const remove = async (user: User) => {
    if (user.role === "admin" || user.is_admin === 1) {
      alert("Akun administrator tidak boleh dihapus!");
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.name}" (${user.email})?`)) {
      try {
        setDeletingId(user.id);
        const res = await fetch(`${API_URL}/api/users/${user.id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Gagal menghapus pengguna.");
        }

        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      } catch (err: any) {
        console.error("Error deleting user:", err);
        alert(err.message || "Gagal menghapus pengguna.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const adminCount = users.filter((u) => u.is_admin === 1 || u.role === "admin").length;
  const regularCount = users.length - adminCount;

  return (
    <div className="container-fluid px-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manajemen Pengguna (Users)</h2>
          <p className="text-muted mb-0">
            Daftar seluruh akun pengguna yang terdaftar di sistem Mie Belitung.
          </p>
        </div>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={fetchUsers}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh Pengguna
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* User Statistics Row */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={4}>
          <Card className="border-0 shadow-sm rounded-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                <i className="bi bi-people-fill fs-4"></i>
              </div>
              <div>
                <div className="text-muted small">Total Pengguna</div>
                <div className="fs-3 fw-bold">{users.length}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={4}>
          <Card className="border-0 shadow-sm rounded-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                <i className="bi bi-shield-fill-check fs-4"></i>
              </div>
              <div>
                <div className="text-muted small">Administrator</div>
                <div className="fs-3 fw-bold">{adminCount}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={4}>
          <Card className="border-0 shadow-sm rounded-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                <i className="bi bi-person-check-fill fs-4"></i>
              </div>
              <div>
                <div className="text-muted small">Pelanggan Biasa</div>
                <div className="fs-3 fw-bold">{regularCount}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading && users.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
          <p className="mt-2 text-muted">Memuat data pengguna...</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
          <Table striped hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nama Pengguna</th>
                <th>Email</th>
                <th>Role Sistem</th>
                <th>Total Pesanan</th>
                <th className="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="text-muted">#{u.id}</td>
                  <td>
                    <div className="fw-semibold">{u.name}</div>
                    {u.role_title && (
                      <small className="text-muted">{u.role_title}</small>
                    )}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <Badge bg={u.role === "admin" ? "danger" : "secondary"}>
                      {u.role === "admin" ? "Admin" : "Pelanggan"}
                    </Badge>
                  </td>
                  <td>
                    <span className="fw-semibold">{u.total_orders}</span> pesanan
                  </td>
                  <td className="text-end">
                    {u.role === "user" ? (
                      <Button
                        size="sm"
                        variant="outline-danger"
                        disabled={deletingId === u.id}
                        onClick={() => remove(u)}
                      >
                        <i className="bi bi-trash3 me-1"></i>
                        Hapus
                      </Button>
                    ) : (
                      <Badge bg="light" text="dark" className="border">
                        Dilindungi
                      </Badge>
                    )}
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
