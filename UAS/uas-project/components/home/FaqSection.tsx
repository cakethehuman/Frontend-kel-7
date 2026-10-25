import SectionHeading from "@/components/ui/SectionHeading";
import FaqAccordion from "@/components/FaqAccordion";

export default function FaqSection() {
  return (
    <div className="container faq-section">
      <SectionHeading title="FAQ" />
      <FaqAccordion />
    </div>
  );
}
