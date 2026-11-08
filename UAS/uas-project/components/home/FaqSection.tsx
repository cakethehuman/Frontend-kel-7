"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import FaqAccordion from "@/components/FaqAccordion";
import { useContent } from "@/lib/siteContent";

export default function FaqSection() {
  const { teks } = useContent();

  return (
    <div className="container faq-section">
      <SectionHeading title={teks("home.faq.title")} />
      <FaqAccordion />
    </div>
  );
}
