"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart, useHydrated } from "@/lib/useCart";

export default function CartButton() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const items = useCart();
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  if (pathname === "/cart-info") return null;

  return (
    <Link
      href="/cart-info"
      className="shopping-cart position-fixed bottom-0 end-0 d-flex justify-content-center align-items-center mb-3 me-4 rounded-circle border-0 bg-primary-color text-white text-decoration-none"
      aria-label="Buka keranjang pesanan">
      <i className="bi bi-cart-fill"/>
      {hydrated && count > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {count}
        </span>
      )}
    </Link>
  );
}