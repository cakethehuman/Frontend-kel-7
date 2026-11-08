"use client";

import Container from "react-bootstrap/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { useContent } from "@/lib/siteContent";
import { tautanKontak, type JenisKontak } from "@/lib/kontak";

const JENIS: JenisKontak[] = ["telepon", "whatsapp", "email"];
const IKON = ["bi-telephone", "bi-whatsapp", "bi-envelope"];

export default function ContactList() {
  const { teks, daftar } = useContent();
  const kontak = daftar("contact.list.items");

  return (
    <section id="hubungi" className="section band">
      <Container className="wrap">
        <SectionHeading
          variant="section"
          eyebrow={teks("contact.list.eyebrow")}
          title={teks("contact.list.title")}
        />
        <div className="contact-list mt-4">
          {kontak.map((item, i) => {
            const { href, external } = tautanKontak(
              JENIS[i] ?? "email",
              item.value,
              teks("contact.list.wa_message"),
            );

            return (
              <a
                key={i}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="contact-row d-flex align-items-center gap-3 bg-white text-decoration-none py-3"
              >
                <i className={`bi ${IKON[i] ?? "bi-envelope"} contact-ico`} />
                <div>
                  <div className="contact-label d-block fw-bold">{item.label}</div>
                  <div className="contact-value d-block">{item.value}</div>
                </div>
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
