"use client";

import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import SectionHeading from "@/components/ui/SectionHeading";

const address =
  "Jl. Palembang No. 27, Air Raya, Tanjung Pandan, Belitung 33411";

export default function LocationSection() {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
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
              eyebrow="Lokasi"
              title="Dapur Kami di Tanjung Pandan"
            />
            <p className="section-copy">
              Kedai kami gampang ditandai: cari genteng merah dan bangku kayu panjang di depan.
            </p>

            <div className="info-item d-flex gap-3">
              <i className="bi bi-geo-alt info-icon flex-shrink-0 d-grid" />
              <div>
                <h5 className="text-uppercase">Alamat</h5>
                <p className="m-0 fw-bold">
                  Jl. Palembang No. 27, Air Raya, Tanjung Pandan, Kabupaten Belitung 33411
                </p>
                <button type="button" className="copy-btn mt-2 bg-transparent border-0 p-0" onClick={copyAddress}>
                  <i className={`bi ${copied ? "bi-check-lg" : "bi-clipboard"}`} />
                  {" "} {copied ? "Tersalin!" : "Salin Alamat"}
                </button>
              </div>
            </div>

            <div className="info-item d-flex gap-3">
              <i className="bi bi-clock-history info-icon flex-shrink-0 d-grid" />
              <div>
                <h5 className="text-uppercase">Jam Buka</h5>
                <p className="m-0 fw-bold">Setiap hari, 10.00 – 21.30 WIB</p>
              </div>
            </div>

            <Button as="a" href="https://www.google.com/maps/dir/?api=1&destination=-2.7416,107.6358" target="_blank" rel="noopener noreferrer" className="btn-app btn-solid d-inline-flex align-items-center gap-2 rounded-pill border-0 mt-3">
              <i className="bi bi-signpost-split" /> Petunjuk Arah
            </Button>
          </Col>

          <Col lg={6}>
            <div className="map-frame rounded-4 overflow-hidden">
              <iframe title="Peta lokasi Sahang Kitchen Belitung" src="https://www.google.com/maps?q=-2.7416,107.6358&z=15&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-100 border-0 d-block" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
