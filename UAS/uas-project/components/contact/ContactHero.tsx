"use client";

import Image from "next/image";
import { Button, Col, Container, Row } from "react-bootstrap";
import Eyebrow from "@/components/ui/Eyebrow";
import { useSyncExternalStore } from "react";
import { gambarAman } from "@/lib/content";
import { useContent } from "@/lib/siteContent";
import { sedangBuka, useJamBuka } from "@/lib/kontak";

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 60000);
  return () => clearInterval(timer);
}

function OpenStatus() {
  const { teks } = useContent();
  const { buka, bukaDesimal, tutupDesimal } = useJamBuka();

  const open = useSyncExternalStore<boolean | null>(
    subscribe,
    () => sedangBuka(new Date(), bukaDesimal, tutupDesimal),
    () => null,
  );

  if (open === null) {
    return <div className="status-pill">{teks("contact.status.checking")}</div>;
  }

  return (
    <div className={`status-pill ${open ? "open" : "closed"}`}>
      {open
        ? teks("contact.status.open")
        : `${teks("contact.status.closed")} ${buka}`}
    </div>
  );
}

export default function ContactHero() {
  const { teks } = useContent();
  const gambar = gambarAman("contact.hero.image", teks("contact.hero.image"));

  return (
    <section className="hero">
      <Container className="wrap">
        <Row className="align-items-center gy-4">
          <Col lg={7} className="hero-text">
            <Eyebrow>{teks("contact.hero.eyebrow")}</Eyebrow>
            <h1 className="hero-title">
              {teks("contact.hero.title_before")}{" "}
              <em>{teks("contact.hero.title_highlight")}</em>
            </h1>
            <p className="hero-lead">{teks("contact.hero.lead")}</p>

            <div className="hero-cta d-flex">
              <Button as="a" href="#lokasi" className="btn-app btn-solid d-inline-flex align-items-center gap-2 rounded-pill border-0">
                <i className="bi bi-geo-alt" /> {teks("contact.hero.btn_location")}
              </Button>
              <Button as="a" href="#ulasan" className="btn-app btn-ghost d-inline-flex align-items-center gap-2 rounded-pill">
                <i className="bi bi-pencil-square" /> {teks("contact.hero.btn_feedback")}
              </Button>
            </div>
            <OpenStatus />
          </Col>

          <Col lg={5}>
            <div className="hero-art">
              <Image src={gambar} alt={teks("contact.hero.image_alt")} width={1200} height={900} sizes="(max-width: 991px) 100vw, 460px" className="hero-img" priority />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
