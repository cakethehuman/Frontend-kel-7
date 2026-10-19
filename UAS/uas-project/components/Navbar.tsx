"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BsNavbar from "react-bootstrap/Navbar";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const [expanded, setExpanded] = useState(false);
  const closeMenu = () => setExpanded(false);

  return (
    // id ini dipertahankan karena navbar.css memakai selector #navbar-placeholder
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
            <Nav className="gap-3">
              {links.map((link) => (
                <Nav.Link
                  key={link.href}
                  as={Link}
                  href={link.href}
                  onClick={closeMenu}
                >
                  {link.label}
                </Nav.Link>
              ))}
            </Nav>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>
    </div>
  );
}
