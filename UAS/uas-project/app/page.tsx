import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Home",
};

const whyUs = [
  {
    icon: "bi-award",
    title: "Resep Otentik",
    text: "Resep asli warisan keluarga Belitung yang dijaga turun-temurun.",
  },
  {
    icon: "bi-basket",
    title: "Bahan Segar",
    text: "Udang laut dan rempah pilihan yang diracik segar setiap hari.",
  },
  {
    icon: "bi-cash-coin",
    title: "Harga Terjangkau",
    text: "Kualitas rasa restoran dengan harga yang bersahabat di kantong.",
  },
  {
    icon: "bi-flower1",
    title: "Rasa Konsisten",
    text: "Tiap masakan memiliki cita rasa yang konsisten.",
  },
];

export default function Home() {
  return (
    <main className="flex-grow-1 mt-5">
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

            <Link href="/menu">
              <button className="pesan-sekarang button-container-pertama">
                Pesan Sekarang
              </button>
            </Link>

            <Link href="/about">
              <button className="baca-selengkapnya button-container-pertama">
                Baca Selengkapnya
              </button>
            </Link>
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

              <a className="plus-button button-first">
                <i className="bi bi-plus"></i>
              </a>

              <div className="info-num-1 p-2">
                <h6 className="text-warning font-weight-bold">
                  🍲 Kuah Kaldu Kental
                </h6>
                <p className="info-description text-white">
                  Sari udang &amp; ebi sangrai kental manis-gurih dimasak dengan
                  rempah rahasia.
                </p>
              </div>

              <a className="plus-button button-second">
                <i className="bi bi-plus"></i>
              </a>

              <div className="info-num-2 p-2">
                <h6 className="text-warning font-weight-bold">
                  🍃 Daun Simpor
                </h6>
                <p className="info-description text-white">
                  Alas saji daun hutan Belitung beraroma khas saat disiram kuah
                  panas mendidih.
                </p>
              </div>

              <a className="plus-button button-third">
                <i className="bi bi-plus"></i>
              </a>

              <div className="info-num-3 p-2">
                <h6 className="text-warning font-weight-bold">
                  🦐 Udang Laut Segar
                </h6>
                <p className="info-description text-white">
                  Udang laut tangkapan nelayan lokal Belitung, direbus pas
                  dengan rasa manis alami.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <footer id="footer-container-pertama">
            <div id="footer-pertama-image-and-description-wrapper">
              <div className="icon-and-text-wrapper">
                <div className="icon-wrapper p-2 rounded-circle bg-white border">
                  <span className="bi bi-clock-history"></span>
                </div>
                <div className="footer-pertama-description-wrapper">
                  <p className="paragraph-footer-description">
                    <b>Antar 25-35 mnt</b>
                  </p>
                  <p className="paragraph-footer-description lower-paragraph-description">
                    Hangat ke Lokasi
                  </p>
                </div>
              </div>

              <div className="icon-and-text-wrapper">
                <div className="icon-wrapper p-2 rounded-circle bg-white border">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="green"
                    className="bi bi-leaf-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.4 1.7c.217.289.65.84 1.725 1.274 1.093.44 2.885.774 5.834.528 2.02-.168 3.431.51 4.326 1.556C14.161 6.082 14.5 7.41 14.5 8.5q0 .344-.027.734C13.387 8.252 11.877 7.76 10.39 7.5c-2.016-.288-4.188-.445-5.59-2.045-.142-.162-.402-.102-.379.112.108.985 1.104 1.82 1.844 2.308 2.37 1.566 5.772-.118 7.6 3.071.505.8 1.374 2.7 1.75 4.292.07.298-.066.611-.354.715a.7.7 0 0 1-.161.042 1 1 0 0 1-1.08-.794c-.13-.97-.396-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.124-.887-1.889-2.095-2.39-3.383-1-2.562-1-5.536-.65-7.28L.73.806z" />
                  </svg>
                </div>
                <div className="footer-pertama-description-wrapper">
                  <p className="paragraph-footer-description">
                    <b>Daun Simpor</b>
                  </p>
                  <p className="paragraph-footer-description lower-paragraph-description">
                    Wangi Alami Hutan
                  </p>
                </div>
              </div>

              <div className="icon-and-text-wrapper">
                <div className="icon-wrapper p-2 rounded-circle bg-white border">
                  <span className="shield bi bi-shield-check"></span>
                </div>
                <div className="footer-pertama-description-wrapper">
                  <p className="paragraph-footer-description">
                    <b>100% Halal Segar</b>
                  </p>
                  <p className="paragraph-footer-description lower-paragraph-description">
                    Udang Laut Pilihan
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </section>

      <div className="container why-us-section">
        <h2 className="brand-heading fw-bold text-center mb-2">
          Kenapa Pilih Kami?
        </h2>
        <p className="text-center text-secondary col-lg-6 mx-auto mb-5">
          Bukan sekadar mie, tapi warisan rasa Belitung yang kami jaga dari
          dapur sampai ke meja Anda.
        </p>

        <div className="row text-center g-4">
          {whyUs.map((item) => (
            <div key={item.title} className="col-6 col-md-3">
              <div className="why-us-card p-4 bg-light rounded-4 shadow-sm h-100">
                <i className={`bi ${item.icon} why-us-icon`}></i>
                <h4 className="brand-heading fw-bold mt-3 mb-2">
                  {item.title}
                </h4>
                <p className="text-secondary small mb-0">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container faq-section">
        <h2 className="brand-heading fw-bold text-center mb-5">FAQ</h2>
        <FaqAccordion />
      </div>
    </main>
  );
}
