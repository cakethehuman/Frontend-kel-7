"use client";

import Accordion from "react-bootstrap/Accordion";

const faqs = [
  {
    q: "Dari mana asal Mie Belitung?",
    a: "Mie Belitung adalah kuliner khas Pulau Belitung yang terkenal dengan kuah kaldu udang kental dan disajikan di atas daun simpor.",
  },
  {
    q: "Apa saja pilihan menu yang tersedia?",
    a: "Kami menyediakan beberapa varian Mie Belitung, mulai dari original hingga topping tambahan seperti udang dan kerupuk. Cek selengkapnya di halaman Menu.",
  },
  {
    q: "Bagaimana cara memesan Mie Belitung?",
    a: 'Klik tombol "Pesan Sekarang" di halaman utama atau buka halaman Menu, pilih menu yang diinginkan, lalu ikuti proses pemesanannya.',
  },
  {
    q: "Apakah bisa request tingkat kepedasan?",
    a: "Bisa. Kamu dapat menambahkan catatan tingkat kepedasan saat melakukan pemesanan.",
  },
  {
    q: "Apakah kemasan aman untuk dibawa pulang?",
    a: "Aman. Kemasan kami dirancang kedap agar kuah tidak tumpah dan makanan tetap hangat selama perjalanan.",
  },
  {
    q: "Metode pembayaran apa saja yang diterima?",
    a: "Kami menerima pembayaran tunai maupun transfer/QRIS, tergantung metode yang tersedia saat checkout.",
  },
];

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
