import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";
import HeroHotspot from "@/components/home/HeroHotspot";
import HeroFeatureBar from "@/components/home/HeroFeatureBar";
import { heroHotspots } from "@/data/home";

export default function HeroSection() {
  return (
    <section className="belitung-hero">
      <div id="container-pertama" className="container">
        <div className="text-and-button-wrapper">
          <h1>
            <b>Makanan Lezat Dari Belitung</b>
          </h1>

          <h3>Rasa Makanan Terbaik</h3>

          <div className="description">
            <p>
              Temukan sensasi perpaduan bumbu rempah pilihan dan kaldu udang
              kental khas Belitung. Nikmat warisan kuliner autentik yang siap
              memanjakan lidah Anda sejak suapan pertama
            </p>
          </div>

          <ButtonLink
            href="/menu"
            className="pesan-sekarang button-container-pertama"
          >
            Pesan Sekarang
          </ButtonLink>

          <ButtonLink
            href="/about"
            className="baca-selengkapnya button-container-pertama"
          >
            Baca Selengkapnya
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

            {heroHotspots.map((hotspot) => (
              <HeroHotspot key={hotspot.infoClass} {...hotspot} />
            ))}
          </div>
        </div>
      </div>

      <HeroFeatureBar />
    </section>
  );
}
