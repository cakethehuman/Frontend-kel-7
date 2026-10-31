import Image from "next/image";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
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
        <h3 className="more-group h6 text-uppercase text-muted mt-3 mb-2">
          {category} Menu
        </h3>
        <Row xs={2} sm={3} className="g-3">
          {group.map((menu) => (
            <Col key={menu.id}>
              <div className="bg-white border rounded-3 overflow-hidden h-100 d-flex flex-column">
                <div className="ratio ratio-4x3">
                  <Image src={menu.img} alt={menu.name} fill sizes="(max-width: 575px) 45vw, 190px" className="object-fit-cover" />
                </div>
                <div className="p-3 d-flex flex-column flex-grow-1">
                  <div className="fw-bold lh-sm">{menu.name}</div>
                  <div className="text-muted small mb-2">{rupiah(menu.price)}</div>
                  <Button size="sm" className="btn-outline-brown mt-auto" onClick={() => onAdd(menu)}>
                    <i className="bi bi-plus-lg" /> Tambah
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  });
}