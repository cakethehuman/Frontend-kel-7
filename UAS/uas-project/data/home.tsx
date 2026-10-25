import type { ReactNode } from "react";
import LeafIcon from "@/components/ui/LeafIcon";

export const whyUs = [
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

export const heroHotspots = [
  {
    buttonClass: "button-first",
    infoClass: "info-num-1",
    title: "🍲 Kuah Kaldu Kental",
    description:
      "Sari udang & ebi sangrai kental manis-gurih dimasak dengan rempah rahasia.",
  },
  {
    buttonClass: "button-second",
    infoClass: "info-num-2",
    title: "🍃 Daun Simpor",
    description:
      "Alas saji daun hutan Belitung beraroma khas saat disiram kuah panas mendidih.",
  },
  {
    buttonClass: "button-third",
    infoClass: "info-num-3",
    title: "🦐 Udang Laut Segar",
    description:
      "Udang laut tangkapan nelayan lokal Belitung, direbus pas dengan rasa manis alami.",
  },
];

export const heroFeatures: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}[] = [
    {
      icon: <span className="bi bi-clock-history"></span>,
      title: "Antar 25-35 mnt",
      subtitle: "Hangat ke Lokasi",
    },
    {
      icon: <LeafIcon />,
      title: "Daun Simpor",
      subtitle: "Wangi Alami Hutan",
    },
    {
      icon: <span className="shield bi bi-shield-check"></span>,
      title: "100% Halal Segar",
      subtitle: "Udang Laut Pilihan",
    },
  ];
