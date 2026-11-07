"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import WhyUsCard from "@/components/home/WhyUsCard";
import { useContent } from "@/lib/siteContent";

export default function WhyUsSection() {
  const { teks, daftar } = useContent();

  return (
    <div className="container why-us-section">
      <SectionHeading
        title={teks("home.whyus.title")}
        subtitle={teks("home.whyus.subtitle")}
      />

      <div className="row text-center g-4">
        {daftar("home.whyus.cards").map((item, i) => (
          <WhyUsCard
            key={i}
            icon={item.icon}
            title={item.title}
            text={item.text}
          />
        ))}
      </div>
    </div>
  );
}
