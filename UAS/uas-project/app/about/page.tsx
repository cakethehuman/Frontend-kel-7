"use client";

import { useState } from "react";
import Link from "next/link";
import TimelineItem from "@/components/about/TimelineItem";
import FeatureBox from "@/components/about/FeatureBox";
import FaqItem from "@/components/about/FaqItem";

export default function AboutPage() {
  const [bukaSelengkapnya, setBukaSelengkapnya] = useState(false);
  const [faqAktif, setFaqAktif] = useState(0);

  function toggleBacaSelengkapnya() {
    if (bukaSelengkapnya === true) {
      setBukaSelengkapnya(false);
    } else {
      setBukaSelengkapnya(true);
    }
  }

  function klikFaq(nomor: number) {
    if (faqAktif === nomor) {
      setFaqAktif(0); 
    } else {
      setFaqAktif(nomor); 
    }
  }

  return (
    <>
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      />

      <section className="about" id="about">
        <div className="about-intro">
          <div className="about-intro-text">
            <p className="section-label">Kenali Lebih Dekat</p>
            <h1 className="about-title">
              Apa itu <span>Mie Belitung</span>?
            </h1>
            <p className="about-desc">
              Mie Belitung adalah warisan kuliner legendaris hasil perpaduan
              harmonis budaya Tionghoa dan Melayu di Pulau Belitung. Mie kuning
              ala Tiongkok dipadukan dengan kekayaan hasil laut lokal,
              menghasilkan kuah kaldu udang autentik yang resepnya dijaga
              turun-temurun oleh masyarakat Belitung.
            </p>

            <p
              className={
                bukaSelengkapnya ? "about-desc-more show" : "about-desc-more"
              }
              id="aboutMoreText"
            >
              Kuliner ini pertama kali populer sebagai hidangan rumahan di
              kalangan keturunan Tionghoa Belitung sebelum akhirnya menjadi ikon
              kuliner daerah yang wajib dicoba wisatawan. Ciri khasnya terletak
              pada kuah kaldu udang kental berwarna cokelat kemerahan, dengan
              rasa manis-gurih yang khas, disajikan hangat di atas{" "}
              <b>daun simpor</b> — daun besar khas Belitung yang menambah aroma
              alami pada hidangan.
              <br />
              <br />
              Dalam semangkuknya terdapat udang, tahu goreng, kentang rebus,
              taoge, mentimun, emping, mie telur, dan kuah kental berwarna
              cokelat yang dibumbui lengkuas, kemiri, jahe, bawang putih, dan
              bawang merah. Lebih dari sekadar makanan, Mie Belitung
              merefleksikan sejarah migrasi, adaptasi budaya, kreativitas
              masyarakat dalam mengolah sumber daya alam, serta menjadi simbol
              identitas dan kontinuitas tradisi kuliner Belitung dalam mozaik
              kuliner Nusantara.
            </p>

            <button
              type="button"
              className={bukaSelengkapnya ? "btn-toggle open" : "btn-toggle"}
              id="btnBacaSelengkapnya"
              onClick={toggleBacaSelengkapnya}
            >
              {bukaSelengkapnya ? "Tutup " : "Baca Selengkapnya "}
              <i className="bx bx-chevron-down"></i>
            </button>
            <br />
            <Link href="/menu" className="btn-cta">
              Pesan Sekarang
            </Link>
          </div>

          <div className="about-intro-img">
            <img
              src="/IMG/Mie Belitung Close-Up.webp"
              alt="Mie Belitung Close-Up"
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
          <h2 className="heading">Sejarah &amp; Akulturasi Budaya</h2>
          <p className="heading-desc">
            Perjalanan Mie Belitung dari dapur rumahan hingga menjadi ikon
            kuliner Pulau Belitung.
          </p>

          <div className="timeline-items">
            <TimelineItem
              waktu="Abad ke-19"
              judul="Kedatangan Imigran Tionghoa"
            >
              Imigran Tionghoa datang ke Belitung untuk bekerja di pertambangan
              timah, membawa tradisi mengolah mie kuning khas Tiongkok.
            </TimelineItem>

            <TimelineItem
              waktu="Akulturasi"
              judul="Perpaduan dengan Budaya Melayu"
            >
              Resep mie kuning berpadu dengan kekayaan hasil laut dan bumbu
              rempah khas Melayu, melahirkan kuah kaldu udang kental yang khas.
            </TimelineItem>

            <TimelineItem waktu="Turun-temurun" judul="Resep Keluarga">
              Resep dijaga dan diwariskan turun-temurun dari generasi ke
              generasi oleh warga Belitung.
            </TimelineItem>

            <TimelineItem waktu="Kini" judul="Ikon Kuliner Belitung">
              Mie Belitung menjadi hidangan wajib coba bagi wisatawan yang
              berkunjung ke Tanjung Pandan.
            </TimelineItem>
          </div>
        </div>

        <div className="about-features" id="keunikan">
          <h2 className="heading">Keunikan &amp; Ciri Khas</h2>
          <div className="features-container">
            <FeatureBox icon="bx bx-bowl-hot" judul="Kuah Kaldu Udang">
              Kuah kental berwarna cokelat kemerahan, dimasak dari kaldu udang
              asli dengan rasa manis-gurih khas.
            </FeatureBox>

            <FeatureBox icon="bx bx-leaf" judul="Daun Simpor">
              Disajikan di atas daun simpor, daun lebar khas Belitung yang
              menambah aroma alami pada hidangan.
            </FeatureBox>

            <FeatureBox icon="bx bx-restaurant" judul="Topping Melimpah">
              Dilengkapi tauge, timun, udang, dan emping yang menambah tekstur
              renyah di setiap suapan.
            </FeatureBox>

            <FeatureBox icon="bx bx-flag" judul="Warisan Budaya">
              Simbol akulturasi budaya Tionghoa dan Melayu yang hidup dalam satu
              piring hidangan.
            </FeatureBox>
          </div>
        </div>

        <div className="about-recipe" id="komponen">
          <div className="about-recipe-img">
            <img src="/IMG/Bahan Mie Belitung.webp" alt="Bahan Segar" />
          </div>
          <div className="about-recipe-text">
            <h2 className="heading heading-left">Komponen Utama</h2>
            <ul className="recipe-list">
              <li>Mie Kuning Basah</li>
              <li>
                Udang Segar
                <ul>
                  <li>Udang utuh untuk topping</li>
                  <li>Kaldu udang untuk kuah</li>
                </ul>
              </li>
              <li>Tauge Segar</li>
              <li>Timun, dipotong dadu</li>
              <li>Emping Melinjo</li>
              <li>Daun Simpor Sebagai Alas Penyajian</li>
              <li>
                Bumbu Rempah Pilihan (Bawang Putih, Bawang Merah, Gula Merah)
              </li>
            </ul>

            <h3 className="heading-small">Cara Penyajian</h3>
            <ol className="recipe-steps">
              <li>Letakkan mie kuning di atas daun simpor.</li>
              <li>Siram dengan kuah kaldu udang kental yang masih hangat.</li>
              <li>Tambahkan tauge, timun, dan udang di atasnya.</li>
              <li>Taburi dengan emping melinjo, siap disajikan.</li>
            </ol>
          </div>
        </div>

        <div className="about-legend" id="tradisi">
          <h2 className="heading">Tradisi &amp; Legenda</h2>
          <div className="faq-rdion" id="faqTradisi">
            <FaqItem
              judul='Asal Mula Nama "Mie Belitung"'
              isOpen={faqAktif === 1}
              onClick={() => klikFaq(1)}
            >
              Nama Mie Belitung diambil langsung dari nama pulau tempat kuliner
              ini lahir, sebagai bentuk kebanggaan masyarakat setempat atas
              identitas daerahnya.
            </FaqItem>

            <FaqItem
              judul="Tradisi Menyantap Bersama Keluarga"
              isOpen={faqAktif === 2}
              onClick={() => klikFaq(2)}
            >
              Mie Belitung sering dihidangkan saat berkumpul bersama keluarga
              besar, terutama pada momen hari raya dan acara adat setempat.
            </FaqItem>

            <FaqItem
              judul="Legenda Kaldu Udang Turun-temurun"
              isOpen={faqAktif === 3}
              onClick={() => klikFaq(3)}
            >
              Konon, resep kaldu udang otentik hanya diwariskan kepada anggota
              keluarga tertentu, menjaga cita rasa khas tetap terjaga hingga
              saat ini.
            </FaqItem>
          </div>
        </div>

        <div className="about-closing">
          <div className="about-closing-img">
            <img
              src="/IMG/Mie Belitung Daun Simpor.webp"
              alt="Mie Belitung Daun Simpor"
            />
          </div>
          <div className="about-closing-text">
            <h2 className="heading heading-left">Rasakan Sensasinya</h2>
            <p>
              Nikmati warisan kuliner autentik Belitung yang siap memanjakan
              lidah Anda sejak suapan pertama.
            </p>
            <Link href="/menu" className="btn-cta">
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}