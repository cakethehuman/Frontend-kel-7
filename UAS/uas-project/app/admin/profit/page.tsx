"use client";

import { useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";

const monthly = [
  { month: "May", revenue: 3900000, cost: 2600000 },
  { month: "Jun", revenue: 4100000, cost: 2700000 },
  { month: "Jul", revenue: 4200000, cost: 2800000 },
  { month: "Aug", revenue: 4800000, cost: 3000000 },
  { month: "Sep", revenue: 5100000, cost: 3200000 },
  { month: "Oct", revenue: 5400000, cost: 3300000 },
];

const series = [
  { key: "revenue", label: "Revenue", color: "#0d6efd" },
  { key: "cost", label: "Cost", color: "#dc3545" },
  { key: "profit", label: "Profit", color: "#198754" },
] as const;

const CHART_HEIGHT = 220;

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

export default function AdminProfitPage() {
  const [range, setRange] = useState(6);

  const data = monthly.slice(-range).map((m) => ({ ...m, profit: m.revenue - m.cost }));
  const total = (key: "revenue" | "cost" | "profit") => data.reduce((sum, m) => sum + m[key], 0);
  const max = Math.max(...data.flatMap((m) => [m.revenue, m.cost, m.profit]));

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Profit</h3>
        <Form.Select style={{ width: 160 }} value={range} onChange={(e) => setRange(Number(e.target.value))}>
          <option value={3}>Last 3 months</option>
          <option value={6}>Last 6 months</option>
        </Form.Select>
      </div>

      <Row className="g-3 mb-4">
        {series.map((s) => (
          <Col key={s.key} xs={12} md={4}>
            <Card body className="shadow-sm h-100">
              <div className="text-muted small">{s.label}</div>
              <div className="fs-3 fw-semibold">{rupiah(total(s.key))}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="bg-white rounded shadow-sm p-3">
        <div className="d-flex gap-3 mb-4 small">
          {series.map((s) => (
            <span key={s.key} className="d-flex align-items-center gap-1">
              <span className="d-inline-block rounded-1"/>
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
