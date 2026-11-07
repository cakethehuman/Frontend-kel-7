"use client";

import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";
import HeroHotspot from "@/components/home/HeroHotspot";
import HeroFeatureBar from "@/components/home/HeroFeatureBar";
import { heroHotspots } from "@/data/home";
import { useContent } from "@/lib/siteContent";

export default function HeroSection() {
  const { teks, daftar } = useContent();
  const hotspots = daftar("home.hotspots");

  return (
    <section className="belitung-hero">
      <div id="container-pertama" className="container">
        <div className="text-and-button-wrapper">
          <h1>
            <b>{teks("home.hero.title")}</b>
          </h1>

          <h3>{teks("home.hero.subtitle")}</h3>

          <div className="description">
            <p>{teks("home.hero.description")}</p>
          </div>

          <ButtonLink
            href="/menu"
            className="pesan-sekarang button-container-pertama"
          >
            {teks("home.hero.cta_primary")}
          </ButtonLink>

          <ButtonLink
            href="/about"
            className="baca-selengkapnya button-container-pertama"
          >
            {teks("home.hero.cta_secondary")}
          </ButtonLink>
        </div>

        <div className="image-and-content-wrapper">
          <div className="image-wrapper">
            <div className="image-clip">
              <Image
                className="round-img"
                src="/IMG/mie_belitung_muantap.webp"
                alt="Semangkuk Mie Belitung"
                width={420}
                height={420}
                priority
              />
            </div>

            {heroHotspots.map((hotspot, i) => (
              <HeroHotspot
                key={hotspot.infoClass}
                {...hotspot}
                title={hotspots[i]?.title ?? hotspot.title}
                description={hotspots[i]?.description ?? hotspot.description}
              />
            ))}
          </div>
        </div>
      </div>

      <HeroFeatureBar />
    </section>
  );
}
