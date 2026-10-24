import Button from "react-bootstrap/Button";
import Image from "next/image";
import { rupiah } from "@/lib/format";
import type { CartItem } from "@/lib/cartStore";

interface CartRowProps {
  item: CartItem;
  onStep: (item: CartItem, step: number) => void;
  onRemove: (id: string) => void;
}

export default function CartRow({ item, onStep, onRemove }: CartRowProps) {
  return (
    <div className="cart-row d-flex align-items-center gap-3 py-3">
      <Image src={item.img} alt={item.name} width={96} height={96} className="cart-thumb rounded-3" />

      <div className="flex-grow-1 min-w-0">
        <h3 className="h6 fw-bold mb-0">{item.name}</h3>
        <p className="text-muted small mb-2">{rupiah(item.price)}</p>
        <div className="qty">
          <button type="button" className="qty-btn" disabled={item.qty <= 1} onClick={() => onStep(item, -1)}>
            <i className="bi bi-dash-lg" />
          </button>
          <span className="qty-num">{item.qty}</span>
          <button type="button" className="qty-btn" onClick={() => onStep(item, 1)}>
            <i className="bi bi-plus-lg" />
          </button>
        </div>
      </div>

      <div className="text-end">
        <div className="fw-bold text-danger">{rupiah(item.price * item.qty)}</div>
        <Button variant="link" className="link-secondary text-decoration-none small p-0 mt-2" onClick={() => onRemove(item.id)}>
          <i className="bi bi-trash3" /> Hapus
        </Button>
      </div>
    </div>
  );
}
