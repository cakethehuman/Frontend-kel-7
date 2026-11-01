"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Row, Col, Table, Badge, Button, Spinner, Alert } from "react-bootstrap";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface DashboardStats {
  user_count: number;
  order_count: number;
  menu_count: number;
  total_revenue: number;
  recent_orders: Array<{
    id: number;
    order_number: string;
    customer: string;
    total: number;
    status: string;
    created_at: string;
    item_count: number;
  }>;
}

const statusColors: Record<string, string> = {
  pending: "warning",
  cooking: "info",
  done: "success",
  cancelled: "secondary",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/admin/stats`);
      if (!res.ok) {
        throw new Error("Gagal mengambil data statistik dashboard.");
      }
      const data: DashboardStats = await res.json();
      setStats(data);
    } catch (err: any) {
      console.error("Dashboard error:", err);
      setError(err.message || "Gagal memuat ringkasan admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const rupiah = (num: number) => `Rp ${Number(num || 0).toLocaleString("id-ID")}`;

  return (
    <div className="container-fluid px-0">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Admin Dashboard</h2>
          <p className="text-muted mb-0">
            Ringkasan data operasional resto, pesanan terbaru, dan pengguna.
          </p>
        </div>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={fetchStats}
          disabled={loading}
          className="align-self-start align-self-sm-center"
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh Data
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && !stats ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
          <p className="mt-2 text-muted">Memuat ringkasan dashboard...</p>
        </div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <Row className="g-3 mb-4">
            <Col xs={12} sm={6} lg={3}>
              <Card className="border-0 shadow-sm rounded-3 h-100 border-start border-4 border-primary">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small fw-semibold text-uppercase">Total Pengguna</div>
                      <div className="fs-3 fw-bold text-dark mt-1">
                        {stats?.user_count ?? 0}
                      </div>
                    </div>
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                      <i className="bi bi-people fs-4"></i>
                    </div>
                  </div>
                  <Link href="/admin/users" className="small text-primary text-decoration-none d-inline-block mt-2">
                    Kelola Pengguna &rarr;
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <Card className="border-0 shadow-sm rounded-3 h-100 border-start border-4 border-warning">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small fw-semibold text-uppercase">Total Pesanan</div>
                      <div className="fs-3 fw-bold text-dark mt-1">
                        {stats?.order_count ?? 0}
                      </div>
                    </div>
                    <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                      <i className="bi bi-receipt fs-4"></i>
                    </div>
                  </div>
                  <Link href="/admin/orders" className="small text-warning text-decoration-none d-inline-block mt-2">
                    Lihat Semua Pesanan &rarr;
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <Card className="border-0 shadow-sm rounded-3 h-100 border-start border-4 border-danger">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small fw-semibold text-uppercase">Total Menu</div>
                      <div className="fs-3 fw-bold text-dark mt-1">
                        {stats?.menu_count ?? 0}
                      </div>
                    </div>
                    <div className="bg-danger bg-opacity-10 p-3 rounded-circle text-danger">
                      <i className="bi bi-cup-hot fs-4"></i>
                    </div>
                  </div>
                  <Link href="/admin/menu" className="small text-danger text-decoration-none d-inline-block mt-2">
                    Kelola Menu &rarr;
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <Card className="border-0 shadow-sm rounded-3 h-100 border-start border-4 border-success">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small fw-semibold text-uppercase">Total Pendapatan</div>
                      <div className="fs-4 fw-bold text-dark mt-1">
                        {rupiah(stats?.total_revenue ?? 0)}
                      </div>
                    </div>
                    <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                      <i className="bi bi-currency-dollar fs-4"></i>
                    </div>
                  </div>
                  <Link href="/admin/profit" className="small text-success text-decoration-none d-inline-block mt-2">
                    Detail Profit &rarr;
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Orders Section */}
          <Card className="border-0 shadow-sm rounded-3 mb-4">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Pesanan Terbaru</h5>
              <Link href="/admin/orders" className="btn btn-sm btn-outline-danger">
                Lihat Semua
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>No. Pesanan</th>
                    <th>Nama Pemesan</th>
                    <th>Jumlah Item</th>
                    <th>Total Bayar</th>
                    <th>Status</th>
                    <th>Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {!stats?.recent_orders || stats.recent_orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        Belum ada pesanan masuk.
                      </td>
                    </tr>
                  ) : (
                    stats.recent_orders.map((o) => (
                      <tr key={o.id}>
                        <td className="fw-semibold text-danger">{o.order_number}</td>
                        <td>{o.customer}</td>
                        <td>{o.item_count} porsi</td>
                        <td className="fw-bold">{rupiah(o.total)}</td>
                        <td>
                          <Badge bg={statusColors[o.status] || "secondary"} className="text-capitalize">
                            {o.status}
                          </Badge>
                        </td>
                        <td className="small text-muted">
                          {new Date(o.created_at).toLocaleString("id-ID", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
}
