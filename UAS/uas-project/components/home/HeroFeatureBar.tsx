"use client";

import FeatureItem from "@/components/home/FeatureItem";
import { heroFeatures } from "@/data/home";
import { useContent } from "@/lib/siteContent";

export default function HeroFeatureBar() {
  const { daftar } = useContent();
  const fitur = daftar("home.features");

  return (
    <div className="container">
      <footer id="footer-container-pertama">
        <div id="footer-pertama-image-and-description-wrapper">
          {heroFeatures.map((feature, i) => (
            <FeatureItem
              key={i}
              icon={feature.icon}
              title={fitur[i]?.title ?? feature.title}
              subtitle={fitur[i]?.subtitle ?? feature.subtitle}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
