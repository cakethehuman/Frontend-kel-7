"use client";

import Accordion from "react-bootstrap/Accordion";
import { faqs } from "@/data/faq";

export default function FaqAccordion() {
  return (
    <Accordion>
      {faqs.map((faq, i) => (
        <Accordion.Item key={faq.q} eventKey={String(i)}>
          <Accordion.Header>{faq.q}</Accordion.Header>
          <Accordion.Body>{faq.a}</Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
