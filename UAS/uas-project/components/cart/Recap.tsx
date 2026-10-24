import type { Order } from "@/lib/cartTypes";
import { rupiah } from "@/lib/format";

interface LineProps {
  label: string;
  value: string;
  className?: string;
}

function Line({ label, value, className = "" }: LineProps) {
  return (
    <div className="d-flex justify-content-between gap-3 py-1">
      <span className="text-muted">{label}</span>
      <span className={`fw-bold text-end ${className}`}>{value}</span>
    </div>
  );
}

export default function Recap({ order }: { order: Order }) {
  return (
    <div className="recap bg-white rounded-3 p-3 text-start">
      {order.items.map((item) => (
        <div key={item.id} className="d-flex justify-content-between gap-3 py-1">
          <span>
            {item.qty}× {item.name}
          </span>
          <span>{rupiah(item.price * item.qty)}</span>
        </div>
      ))}
      <hr className="my-2" />
      <Line label="Atas Nama" value={order.name} />
      <Line
        label="Tipe Pesanan"
        value={
          order.type === "dinein" ? `Makan di Tempat · Meja ${order.table}` : "Bungkus"
        }
      />
      <Line label="Pembayaran" value={order.payment} />
      {order.note && <Line label="Catatan" value={order.note} />}
      <Line label="Total Bayar" value={rupiah(order.total)} className="text-danger" />
    </div>
  );
}
