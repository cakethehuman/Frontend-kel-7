"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Nav, Offcanvas, Badge } from "react-bootstrap";

const links = [
  { href: "/admin", label: "Dashboard", icon: "bi-speedometer2" },
  { href: "/admin/menu", label: "Menu", icon: "bi-cup-hot" },
  { href: "/admin/orders", label: "Orders", icon: "bi-receipt" },
  { href: "/admin/users", label: "Users", icon: "bi-people" },
  { href: "/admin/profit", label: "Profit", icon: "bi-graph-up" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("user") || sessionStorage.getItem("currentUser");
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (u.name) setAdminName(u.name);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("authChange"));
    router.replace("/auth/login");
  };

  const nav = (
    <Nav className="flex-column gap-2">

      {links.map((l) => (
        <Nav.Link
          key={l.href}
          as={Link}
          href={l.href}
          onClick={() => setShow(false)}
          className={`rounded px-3 py-2 text-light d-flex align-items-center gap-2 ${
            pathname === l.href ? "bg-dark bg-opacity-50 fw-bold border-start border-4 border-white" : "hover-bg-danger-dark"
          }`}
        >
          <span>{l.label}</span>
        </Nav.Link>
      ))}

      <button className="btn btn-outline-light mt-3 d-flex align-items-center justify-content-center gap-2" onClick={logout}>
        <i className="bi bi-box-arrow-right"></i>
        Logout
      </button>
    </Nav>
  );

  return (
    <>
      <div className="d-md-none bg-danger text-light d-flex align-items-center justify-content-between px-3 py-2 sticky-top shadow-sm">
        <div className="d-flex align-items-center gap-2">
          <span className="fw-bold">Admin Panel</span>
        </div>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => setShow(true)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>

      <Offcanvas show={show} onHide={() => setShow(false)} className="bg-danger text-light">
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="d-flex align-items-center gap-2">
            Admin Panel
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{nav}</Offcanvas.Body>
      </Offcanvas>

      <aside className="d-none d-md-block bg-danger text-light p-3 min-vh-100 shadow" style={{ width: "260px", minWidth: "260px" }}>
        <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom border-light border-opacity-25">
          <i className="bi bi-shield-lock-fill fs-4"></i>
          <div>
            <h5 className="mb-0 fw-bold">Admin Panel</h5>
          </div>
        </div>
        {nav}
      </aside>
    </>
  );
}
