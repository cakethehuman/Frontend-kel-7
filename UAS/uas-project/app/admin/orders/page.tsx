"use client";

import { useState } from "react";
import { Badge, Form, Table } from "react-bootstrap";

type Status = "pending" | "cooking" | "done";

type Order = { id: number; customer: string; total: number; status: Status };

const initial: Order[] = [
  { id: 1, customer: "Luis", total: 50000, status: "pending" },
  { id: 2, customer: "Mikel", total: 35000, status: "cooking" },
  { id: 3, customer: "Hangga", total: 72000, status: "done" },
];

const colors: Record<Status, string> = {
  pending: "warning",
  cooking: "info",
  done: "success",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(initial);

  const setStatus = (id: number, status: Status) =>
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));

  return (
    <>
      <h3 className="mb-3">Orders</h3>

      <Table striped hover responsive className="align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.customer}</td>
              <td>Rp {o.total.toLocaleString("id-ID")}</td>
              <td>
                <Badge bg={colors[o.status]}>{o.status}</Badge>
              </td>
              <td>
                <Form.Select
                  size="sm"
                  className="w-auto"
                  value={o.status}
                  onChange={(e) => setStatus(o.id, e.target.value as Status)}
                >
                  <option value="pending">pending</option>
                  <option value="cooking">cooking</option>
                  <option value="done">done</option>
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
