"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Nav, Offcanvas } from "react-bootstrap";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/profit", label: "Profit" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [show, setShow] = useState(false);

  const logout = () => {
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const nav = (
    <Nav className="flex-column gap-1">
      {links.map((l) => (
        <Nav.Link
          key={l.href}
          as={Link}
          href={l.href}
          onClick={() => setShow(false)}
          className={`rounded px-3 text-light ${pathname === l.href ? "bg-secondary" : ""}`}
        >
          {l.label}
        </Nav.Link>
      ))}
      <button className="btn btn-outline-light mt-3" onClick={logout}>
        Logout
      </button>
    </Nav>
  );

  return (
    <>
      <div className="d-md-none bg-danger text-light d-flex align-items-center justify-content-between px-3 py-2">
        <span className="fw-bold">Admin Panel</span>
        <button className="btn btn-outline-light btn-sm" onClick={() => setShow(true)}>
          ☰
        </button>
      </div>

      <Offcanvas show={show} onHide={() => setShow(false)} className="bg-danger text-light">
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Admin</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{nav}</Offcanvas.Body>
      </Offcanvas>

      <aside className="d-none d-md-block bg-danger text-light p-3 min-vh-100">
        <h5 className="mb-4">Admin</h5>
        {nav}
      </aside>
    </>
  );
}
