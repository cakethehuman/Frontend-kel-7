"use client";

import Container from "react-bootstrap/Container";
import SectionHeading from "@/components/ui/SectionHeading";

interface ContactInfo {
  icon: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

const contacts: ContactInfo[] = [
  {
    icon: "bi-telephone",
    label: "Telepon Reservasi",
    value: "0817-1779-4014",
    href: "tel:+6281717794014",
  },
  {
    icon: "bi-whatsapp",
    label: "WhatsApp & Pesan Antar",
    value: "0878-9254-4939",
    href: "https://wa.me/6287892544939?text=Halo%20Mie%20Belitung!",
    external: true,
  },
  {
    icon: "bi-envelope",
    label: "Email & Kerja Sama",
    value: "halo@sahangkitchen.id",
    href: "mailto:halo@sahangkitchen.id",
  },
];

export default function ContactList() {
  return (
    <section id="hubungi" className="section band">
      <Container className="wrap">
        <SectionHeading
          variant="section"
          eyebrow="Hubungi Kami"
          title="Telepon Segera, Sebelum Kami Datangi"
        />
        <div className="contact-list mt-4">
          {contacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              {...(contact.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="contact-row d-flex align-items-center gap-3 bg-white text-decoration-none py-3"
            >
              <i className={`bi ${contact.icon} contact-ico`} />
              <div>
                <div className="contact-label d-block fw-bold">
                  {contact.label}
                </div>
                <div className="contact-value d-block">{contact.value}</div>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
