"use client";

import Image from "next/image";
import { Button, Col, Container, Row } from "react-bootstrap";
import Eyebrow from "@/components/ui/Eyebrow";

import { useSyncExternalStore } from "react";

const OPEN_HOUR = 10;
const CLOSE_HOUR = 21.5;

function isOpenNow(): boolean {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  return hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 60000);
  return () => clearInterval(timer);
}

function OpenStatus() {
  const open = useSyncExternalStore<boolean | null>(
    subscribe,
    isOpenNow,
    () => null,
  );

  if (open === null) {
    return <div className="status-pill">Memeriksa jam buka...</div>;
  }

  return (
    <div className={`status-pill ${open ? "open" : "closed"}`}>
      {open ? "Buka Sekarang" : "Tutup · Buka lagi jam 10.00"}
    </div>
  );
}

export default function ContactHero() {
  return (
    <section className="hero">
      <Container className="wrap">
        <Row className="align-items-center gy-4">
          <Col lg={7} className="hero-text">
            <Eyebrow>Kontak &amp; Lokasi - Tanjung Pandan</Eyebrow>
            <h1 className="hero-title">
              Mari Ngobrol, Sambil Sepiring <em>Mie Belitung</em>
            </h1>
            <p className="hero-lead">
              Punya saran resep, mau reservasi meja, atau cuma penasaran kami ada di mana? Semuanya ada di halaman ini.
            </p>

            <div className="hero-cta d-flex">
              <Button as="a" href="#lokasi" className="btn-app btn-solid d-inline-flex align-items-center gap-2 rounded-pill border-0">
                <i className="bi bi-geo-alt" /> Lihat Lokasi
              </Button>
              <Button as="a" href="#ulasan" className="btn-app btn-ghost d-inline-flex align-items-center gap-2 rounded-pill">
                <i className="bi bi-pencil-square" /> Tulis Masukan
              </Button>
            </div>
            <OpenStatus />
          </Col>

          <Col lg={5}>
            <div className="hero-art">
              <Image src="/IMG/gambar1_contact.webp" alt="Mie Belitung" width={1200} height={900} sizes="(max-width: 991px) 100vw, 460px" className="hero-img" priority />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
