"use client"

import Image from "next/image";
import Link from "next/link";
import { Col, Row, Container} from "react-bootstrap";

interface Social {
    name: string;
    icon: string;
    href: string
}

const socials: Social[] = [
  {
    name: "Facebook",
    icon: "/IMG/cover_w32_h32_ic-facebook.webp",
    href: "https://www.facebook.com/untarjakarta/?locale=id_ID",
  },
  {
    name: "Instagram",
    icon: "/IMG/cover_w32_h32_ic-instagram.webp",
    href: "https://www.instagram.com/untarjakarta/?hl=en",
  },
  {
    name: "Twitter / X",
    icon: "/IMG/cover_w32_h32_ic-twitter.webp",
    href: "https://x.com/UntarJakarta",
  },
  {
    name: "YouTube",
    icon: "/IMG/cover_w32_h32_ic-youtube.webp",
    href: "https://www.youtube.com/channel/UCrzEyrRTTquvHwyXzEnVQCQ",
  },
  {
    name: "WhatsApp",
    icon: "/IMG/cover_w32_h32_ic-wa.webp",
    href: "https://wa.me/6287892544939?text=Halo%20Mie%20Belitung!",
  },
  {
    name: "TikTok",
    icon: "/IMG/cover_w32_h32_tiktok-icon.webp",
    href: "https://www.tiktok.com/@untarjakarta",
  },
];