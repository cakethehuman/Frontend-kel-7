"use client";

import Image from "next/image";
import Link from "next/link";
import {Col, Row, Container} from "react-bootstrap";


interface Social {
  name: string;
  icon: string;
  href: string;
}

const socials: Social[] = [
  {
    name: "Facebook",
    icon: "/IMG/cover_w32_h32_ic-facebook.webp",
    href: "https://www.facebook.com/untarjakarta/?locale=id_ID",
  },
  {
    name: "Instagram",
    icon: "/IMG/cover_w32_h32_ic-instagram.webp",
    href: "https://www.instagram.com/untarjakarta/?hl=en",
  },
  {
    name: "Twitter / X",
    icon: "/IMG/cover_w32_h32_ic-twitter.webp",
    href: "https://x.com/UntarJakarta",
  },
  {
    name: "YouTube",
    icon: "/IMG/cover_w32_h32_ic-youtube.webp",
    href: "https://www.youtube.com/channel/UCrzEyrRTTquvHwyXzEnVQCQ",
  },
  {
    name: "WhatsApp",
    icon: "/IMG/cover_w32_h32_ic-wa.webp",
    href: "https://wa.me/6287892544939?text=Halo%20Mie%20Belitung!",
  },
  {
    name: "TikTok",
    icon: "/IMG/cover_w32_h32_tiktok-icon.webp",
    href: "https://www.tiktok.com/@untarjakarta",
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <Container>
          <Row className="align-items-center gy-4 text-center">
            <Col
              xs={12}
              lg={4}
              className="order-1 d-flex justify-content-center justify-content-lg-start">
              <Link
                href="/"
                className="footer-brand d-inline-flex flex-column flex-lg-row align-items-center text-decoration-none"
                aria-label="Mie Belitung - ke beranda">
                <span className="footer-brand-logo flex-shrink-0">
                  <Image
                    src="/IMG/logo.webp"
                    alt="Logo Mie Belitung"
                    width={84}
                    height={84}/>
                </span>
              </Link>
            </Col>

            <Col
              xs={12}
              lg={4}
              className="order-2 footer-center d-flex flex-column align-items-center">
              <Link
                href="/contact"
                className="footer-menu-link text-decoration-none">
                Contact
              </Link>

              <div className="footer-contact-social d-flex flex-column align-items-center">
                <span className="footer-contact-title fw-bold">Contact us</span>
                <div className="footer-social d-flex align-items-center justify-content-center flex-wrap">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="footer-social-icon d-flex align-items-center justify-content-center rounded-circle flex-shrink-0">
                      <Image
                        src={social.icon}
                        alt={social.name}
                        width={32}
                        height={32}/>
                    </a>
                  ))}
                </div>
              </div>
            </Col>

            <Col
              xs={12}
              lg={4}
              className="order-3 d-flex justify-content-center justify-content-lg-end">
              <div className="footer-halal">
                <Image
                  src="/IMG/cover_w52_h95_ic-halal-2.webp"
                  alt="Logo Halal Indonesia"
                  width={52}
                  height={95}/>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="site-footer-bottom">
        <Container>
          <p className="footer-copyright text-center m-0">
            © 2026 Mie Belitung. All Rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}