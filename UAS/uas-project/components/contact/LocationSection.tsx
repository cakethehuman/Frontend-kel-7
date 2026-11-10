"use client";

import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import SectionHeading from "@/components/ui/SectionHeading";
import { useContent } from "@/lib/siteContent";
import { useJamBuka, useKoordinat } from "@/lib/kontak";

export default function LocationSection() {
  const { teks } = useContent();
  const { hari, buka, tutup, zona } = useJamBuka();
  const { lat, lng } = useKoordinat();
  const [copied, setCopied] = useState(false);

  const alamat = teks("contact.location.address");

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(alamat);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  return (
    <section id="lokasi" className="section">
      <Container className="wrap">
        <Row className="align-items-center gy-4 gx-lg-5">
          <Col lg={6}>
            <SectionHeading
              variant="section"
              eyebrow={teks("contact.location.eyebrow")}
              title={teks("contact.location.title")}
            />
            <p className="section-copy">{teks("contact.location.copy")}</p>

            <div className="info-item d-flex gap-3">
              <i className="bi bi-geo-alt info-icon flex-shrink-0 d-grid" />
              <div>
                <h5 className="text-uppercase">{teks("contact.location.address_label")}</h5>
                <p className="m-0 fw-bold">{alamat}</p>
                <button type="button" className="copy-btn mt-2 bg-transparent border-0 p-0" onClick={copyAddress}>
                  <i className={`bi ${copied ? "bi-check-lg" : "bi-clipboard"}`} />
                  {" "} {copied ? teks("contact.location.copied") : teks("contact.location.copy_btn")}
                </button>
              </div>
            </div>

            <div className="info-item d-flex gap-3">
              <i className="bi bi-clock-history info-icon flex-shrink-0 d-grid" />
              <div>
                <h5 className="text-uppercase">{teks("contact.location.hours_label")}</h5>
                <p className="m-0 fw-bold">
                  {hari}, {buka} – {tutup} {zona}
                </p>
              </div>
            </div>

            <Button as="a" href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`} target="_blank" rel="noopener noreferrer" className="btn-app btn-solid d-inline-flex align-items-center gap-2 rounded-pill border-0 mt-3">
              <i className="bi bi-signpost-split" /> {teks("contact.location.directions_btn")}
            </Button>
          </Col>

          <Col lg={6}>
            <div className="map-frame rounded-4 overflow-hidden">
              <iframe title="Peta lokasi Mie Belitung" src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-100 border-0 d-block" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
