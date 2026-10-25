import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import FaqSection from "@/components/home/FaqSection";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <main className="flex-grow-1 mt-5">
      <HeroSection />
      <WhyUsSection />
      <FaqSection />
    </main>
  );
}
