"use client";

import { Fragment, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import TimelineItem from "@/components/about/TimelineItem";
import FeatureBox from "@/components/about/FeatureBox";
import FaqItem from "@/components/about/FaqItem";
import { useSiteContent } from "@/lib/siteContent";
import { gambarAman } from "@/lib/content";

// Mengubah **teks** menjadi <b>teks</b>
function tebal(teks: string): ReactNode[] {
  return teks
    .split(/\*\*(.+?)\*\*/g)
    .map((bagian, i) => (i % 2 === 1 ? <b key={i}>{bagian}</b> : bagian));
}

type Butir = { teks: string; sub: string[] };

function bacaKomponen(mentah: string): Butir[] {
  const hasil: Butir[] = [];
  for (const baris of mentah.split("\n")) {
    const b = baris.trim();
    if (b === "") continue;

    const isi = b.replace(/^-+\s*/, "");
    if (b.startsWith("-") && hasil.length > 0) {
      hasil[hasil.length - 1].sub.push(isi);
    } else {
      hasil.push({ teks: isi, sub: [] });
    }
  }
  return hasil;
}

function bacaBaris(mentah: string): string[] {
  return mentah
    .split("\n")
    .map((b) => b.trim())
    .filter((b) => b !== "");
}

export default function AboutPage() {
  const { teks, daftar } = useSiteContent("about");

  const gambarIntro = gambarAman("about.intro.image", teks("about.intro.image"));
  const gambarResep = gambarAman("about.recipe.image", teks("about.recipe.image"));
  const gambarPenutup = gambarAman("about.closing.image", teks("about.closing.image"));

  const [bukaSelengkapnya, setBukaSelengkapnya] = useState(false);
  const [faqAktif, setFaqAktif] = useState(0);

  function toggleBacaSelengkapnya() {
    setBukaSelengkapnya(!bukaSelengkapnya);
  }

  function klikFaq(nomor: number) {
    setFaqAktif(faqAktif === nomor ? 0 : nomor);
  }

  const paragrafLanjutan = teks("about.intro.desc_more")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p !== "");

  const komponen = bacaKomponen(teks("about.recipe.components"));
  const langkah = bacaBaris(teks("about.recipe.steps"));

  return (
    <>
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      />

      <section className="about" id="about">
        <div className="about-intro">
          <div className="about-intro-text">
            <p className="section-label">{teks("about.intro.label")}</p>
            <h1 className="about-title">
              {teks("about.intro.title_before")}{" "}
              <span>{teks("about.intro.title_highlight")}</span>
              {teks("about.intro.title_after")}
            </h1>
            <p className="about-desc">{teks("about.intro.desc")}</p>

            <p
              className={
                bukaSelengkapnya ? "about-desc-more show" : "about-desc-more"
              }
              id="aboutMoreText"
            >
              {paragrafLanjutan.map((paragraf, i) => (
                <Fragment key={i}>
                  {i > 0 && (
                    <>
                      <br />
                      <br />
                    </>
                  )}
                  {tebal(paragraf)}
                </Fragment>
              ))}
            </p>

            <button
              type="button"
              className={bukaSelengkapnya ? "btn-toggle open" : "btn-toggle"}
              id="btnBacaSelengkapnya"
              onClick={toggleBacaSelengkapnya}
            >
              {bukaSelengkapnya
                ? teks("about.intro.btn_less")
                : teks("about.intro.btn_more")}{" "}
              <i className="bx bx-chevron-down"></i>
            </button>

            <Link href="/menu" className="btn-cta">
              {teks("about.intro.cta")}
            </Link>
          </div>

          <div className="about-intro-img">
            <Image
              src={gambarIntro}
              alt={teks("about.intro.image_alt")}
              width={380}
              height={380}
              priority
            />
            <span className="doodle doodle-leaf-1">
              <i className="bx bx-leaf"></i>
            </span>
            <span className="doodle doodle-leaf-2">
              <i className="bx bx-leaf"></i>
            </span>
          </div>
        </div>

        <div className="about-history" id="sejarah">
          <h2 className="heading">{teks("about.history.title")}</h2>
          <p className="heading-desc">{teks("about.history.subtitle")}</p>

          <div className="timeline-items">
            {daftar("about.history.items").map((item, i) => (
              <TimelineItem key={i} waktu={item.waktu} judul={item.judul}>
                {item.text}
              </TimelineItem>
            ))}
          </div>
        </div>

        <div className="about-features" id="keunikan">
          <h2 className="heading">{teks("about.features.title")}</h2>
          <div className="features-container">
            {daftar("about.features.items").map((item, i) => (
              <FeatureBox key={i} icon={"bx " + item.icon} judul={item.title}>
                {item.text}
              </FeatureBox>
            ))}
          </div>
        </div>

        <div className="about-recipe" id="komponen">
          <div className="about-recipe-img">
            <Image
              src={gambarResep}
              alt={teks("about.recipe.image_alt")}
              width={600}
              height={400}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className="about-recipe-text">
            <h2 className="heading heading-left">
              {teks("about.recipe.title")}
            </h2>
            <ul className="recipe-list">
              {komponen.map((butir, i) => (
                <li key={i}>
                  {butir.teks}
                  {butir.sub.length > 0 && (
                    <ul>
                      {butir.sub.map((s, j) => (
                        <li key={j}>{s}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <h3 className="heading-small">{teks("about.recipe.steps_title")}</h3>
            <ol className="recipe-steps">
              {langkah.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="about-legend" id="tradisi">
          <h2 className="heading">{teks("about.legend.title")}</h2>
          <div className="faq-rdion" id="faqTradisi">
            {daftar("about.legend.items").map((item, i) => (
              <FaqItem
                key={i}
                judul={item.title}
                isOpen={faqAktif === i + 1}
                onClick={() => klikFaq(i + 1)}
              >
                {item.text}
              </FaqItem>
            ))}
          </div>
        </div>

        <div className="about-closing">
          <div className="about-closing-img">
            <Image
              src={gambarPenutup}
              alt={teks("about.closing.image_alt")}
              width={600}
              height={400}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className="about-closing-text">
            <h2 className="heading heading-left">
              {teks("about.closing.title")}
            </h2>
            <p>{teks("about.closing.text")}</p>
            <Link href="/menu" className="btn-cta">
              {teks("about.closing.cta")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
