import Image from "next/image";
import Button from "react-bootstrap/Button";
import { menuCategories, menuItems } from "@/data/menu";
import type { MenuItem } from "@/data/menu";
import type { CartItem } from "@/lib/cartStore";
import { rupiah } from "@/lib/format";

interface MoreListProps {
  items: CartItem[];
  onAdd: (item: MenuItem) => void;
}

export default function MoreList({ items, onAdd }: MoreListProps) {
  const inCart = new Set(items.map((item) => item.id));
  const available = menuItems.filter((menu) => !inCart.has(menu.id));

  if (!available.length) {
    return (
      <p className="text-muted mb-0"> Semua menu yang tersedia sudah ada di pesananmu. </p>
    );
  }

  return menuCategories.map((category) => {
    const group = available.filter((menu) => menu.category === category);
    if (!group.length) return null;

        return (
          <div key={category}>
            <h3 className="more-group h6 text-uppercase text-muted mt-3 mb-1">
              {category} Menu
            </h3>
            {group.map((menu) => (
              <div
                key={menu.id}
                className="more-row d-flex align-items-center gap-3 py-2">
                <Image src={menu.img} alt={menu.name} width={96} height={96} className="more-thumb rounded-3" />
                <div className="flex-grow-1 min-w-0">
                  <div className="fw-bold">{menu.name}</div>
                  <div className="text-muted small">{rupiah(menu.price)}</div>
                </div>
                <Button size="sm" className="btn-outline-brown" onClick={() => onAdd(menu)}>
                  <i className="bi bi-plus-lg" /> Tambah
                </Button>
              </div>
            ))}
          </div>
        );
    });
}
