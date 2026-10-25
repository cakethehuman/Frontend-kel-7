import SectionHeading from "@/components/ui/SectionHeading";
import WhyUsCard from "@/components/home/WhyUsCard";
import { whyUs } from "@/data/home";

export default function WhyUsSection() {
  return (
    <div className="container why-us-section">
      <SectionHeading
        title="Kenapa Pilih Kami?"
        subtitle="Bukan sekadar mie, tapi warisan rasa Belitung yang kami jaga dari dapur sampai ke meja Anda."
      />

      <div className="row text-center g-4">
        {whyUs.map((item) => (
          <WhyUsCard key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}
