import FeatureItem from "@/components/home/FeatureItem";
import { heroFeatures } from "@/data/home";

export default function HeroFeatureBar() {
  return (
    <div className="container">
      <footer id="footer-container-pertama">
        <div id="footer-pertama-image-and-description-wrapper">
          {heroFeatures.map((feature) => (
            <FeatureItem
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              subtitle={feature.subtitle}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
