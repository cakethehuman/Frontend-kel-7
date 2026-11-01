"use client";

import { useEffect, useState } from "react";
import { Badge, Form, Table, Spinner, Alert, Button, Card } from "react-bootstrap";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Status = "pending" | "cooking" | "done" | "cancelled";

interface OrderItem {
  menu_id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  order_id: number;
  order_number: string;
  customer: string;
  customer_name: string;
  phone: string;
  type: string;
  table: number | null;
  payment: string;
  note: string | null;
  total: number;
  status: Status;
  created_at: string;
  items: OrderItem[];
}

const colors: Record<Status, string> = {
  pending: "warning",
  cooking: "info",
  done: "success",
  cancelled: "secondary",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/orders`);
      if (!res.ok) {
        throw new Error("Gagal mengambil data pesanan dari server.");
      }
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Gagal memuat pesanan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const setStatus = async (id: number, newStatus: Status) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`${API_URL}/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal memperbarui status pesanan.");
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    } catch (err: any) {
      console.error("Error updating status:", err);
      alert(err.message || "Gagal mengubah status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const rupiah = (num: number) => `Rp ${Number(num || 0).toLocaleString("id-ID")}`;

  return (
    <div className="container-fluid px-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Daftar Pesanan (Orders)</h2>
          <p className="text-muted mb-0">
            Pesanan yang dibeli pelanggan otomatis langsung masuk ke sini secara real-time.
          </p>
        </div>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={fetchOrders}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh Pesanan
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && orders.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
          <p className="mt-2 text-muted">Memuat data pesanan masuk...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card className="text-center p-5 border-0 shadow-sm rounded-3">
          <i className="bi bi-receipt fs-1 text-muted mb-2"></i>
          <h4>Belum Ada Pesanan Masuk</h4>
          <p className="text-muted">
            Saat pelanggan membeli makanan di menu dan checkout, pesanan akan muncul di sini.
          </p>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
          <Table striped hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>No. Pesanan</th>
                <th>Pemesan</th>
                <th>Tipe / Meja</th>
                <th>Detail Menu Item</th>
                <th>Pembayaran</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <div className="fw-bold text-danger">{o.order_number}</div>
                    <small className="text-muted">
                      {new Date(o.created_at).toLocaleString("id-ID", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </small>
                  </td>
                  <td>
                    <div className="fw-semibold">{o.customer}</div>
                    <small className="text-muted">{o.phone}</small>
                  </td>
                  <td>
                    <Badge bg={o.type === "dinein" ? "primary" : "secondary"}>
                      {o.type === "dinein" ? "Dine-in" : "Takeaway"}
                    </Badge>
                    {o.table && (
                      <div className="small text-muted mt-1">Meja #{o.table}</div>
                    )}
                  </td>
                  <td>
                    <ul className="list-unstyled mb-0 small">
                      {o.items?.map((it, idx) => (
                        <li key={idx}>
                          {it.name} &times; <b>{it.quantity}</b>
                        </li>
                      ))}
                    </ul>
                    {o.note && (
                      <div className="small text-muted fst-italic mt-1">
                        Catatan: "{o.note}"
                      </div>
                    )}
                  </td>
                  <td>
                    <Badge bg="dark" className="text-uppercase">
                      {o.payment}
                    </Badge>
                  </td>
                  <td>
                    <span className="fw-bold">{rupiah(o.total)}</span>
                  </td>
                  <td>
                    <Badge bg={colors[o.status] || "secondary"} className="text-capitalize">
                      {o.status}
                    </Badge>
                  </td>
                  <td>
                    <Form.Select
                      size="sm"
                      className="w-auto"
                      disabled={updatingId === o.id}
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value as Status)}
                    >
                      <option value="pending">pending</option>
                      <option value="cooking">cooking</option>
                      <option value="done">done</option>
                      <option value="cancelled">cancelled</option>
                    </Form.Select>
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
