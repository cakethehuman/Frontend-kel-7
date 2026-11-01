"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BsNavbar from "react-bootstrap/Navbar";
import { Badge, Button } from "react-bootstrap";

const baseLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const closeMenu = () => setExpanded(false);

  const syncAuth = () => {
    try {
      const raw = localStorage.getItem("user") || sessionStorage.getItem("currentUser");
      if (raw) {
        setCurrentUser(JSON.parse(raw));
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.error("Auth sync error:", e);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    syncAuth();

    const handleAuthEvent = () => syncAuth();
    window.addEventListener("authChange", handleAuthEvent);
    window.addEventListener("storage", handleAuthEvent);

    return () => {
      window.removeEventListener("authChange", handleAuthEvent);
      window.removeEventListener("storage", handleAuthEvent);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("user");
      sessionStorage.removeItem("currentUser");
      setCurrentUser(null);
      window.dispatchEvent(new Event("authChange"));
      closeMenu();
      router.push("/auth/login");
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div id="navbar-placeholder">
      <BsNavbar expand="lg" expanded={expanded} onToggle={setExpanded}>
        <Container fluid>
          <BsNavbar.Brand
            as={Link}
            href="/"
            onClick={closeMenu}
            className="d-flex align-items-center gap-3"
          >
            <Image
              src="/IMG/logo.webp"
              alt="Logo Mie Belitung"
              width={70}
              height={70}
              className="navbar-logo"
              priority
            />
            <div className="logo-text-container d-flex flex-column align-items-start">
              <span className="logo-main">Mie Belitung</span>
              <span className="logo-sub">Makanan Khas Belitung</span>
            </div>
          </BsNavbar.Brand>

          <BsNavbar.Toggle aria-controls="navbarNav" />

          <BsNavbar.Collapse id="navbarNav" className="justify-content-end">
            <Nav className="gap-2 align-items-lg-center">
              {baseLinks.map((link) => (
                <Nav.Link
                  key={link.href}
                  as={Link}
                  href={link.href}
                  active={isActive(link.href)}
                  onClick={closeMenu}
                >
                  {link.label}
                </Nav.Link>
              ))}

              {currentUser && currentUser.is_admin === 1 && (
                <Nav.Link
                  as={Link}
                  href="/admin"
                  active={isActive("/admin")}
                  onClick={closeMenu}
                  className="fw-bold text-danger d-flex align-items-center gap-1"
                >
                  <span>Admin Panel</span>
                </Nav.Link>
              )}

              {currentUser ? (
                <div className="d-flex align-items-center gap-2 ms-lg-2 mt-2 mt-lg-0">
                  <span className="small text-muted d-none d-xl-inline">
                    Halo, <b>{currentUser.name}</b>
                  </span>
                  {currentUser.is_admin === 1 && (
                    <Badge bg="danger" className="d-none d-lg-inline">
                      Admin
                    </Badge>
                  )}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="rounded-pill px-3"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2 ms-lg-2 mt-2 mt-lg-0">
                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className="btn btn-sm btn-outline-danger rounded-pill px-3"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={closeMenu}
                    className="btn btn-sm bg-primary-color text-light rounded-pill px-3"
                  >
                    Register
                  </Link>
                </div>
              )}
            </Nav>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>
    </div>
  );
}
