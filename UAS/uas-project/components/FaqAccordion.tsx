"use client";

import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function FaqAccordion() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/faqs`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFaqs(data);
        }
      })
      .catch((err) => console.error("Gagal memuat FAQ:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-3 text-muted">Memuat FAQ...</div>;
  }

  if (faqs.length === 0) {
    return <div className="text-center py-3 text-muted">Belum ada FAQ tersedia.</div>;
  }

  return (
    <Accordion className="w-100">
      {faqs.map((faq, index) => (
        <Accordion.Item eventKey={index.toString()} key={faq.id} className="mb-2 border rounded">
          <Accordion.Header className="fw-semibold">{faq.question}</Accordion.Header>
          <Accordion.Body className="text-muted">{faq.answer}</Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}