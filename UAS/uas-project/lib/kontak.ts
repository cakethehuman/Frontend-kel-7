"use client";

import { contentDefaults } from "@/lib/content";
import { useContent } from "@/lib/siteContent";

const POLA_JAM = /^(\d{1,2})[.:](\d{2})$/;

export function jamKeDesimal(teks: string): number | null {
  const cocok = POLA_JAM.exec(teks.trim());
  if (!cocok) return null;
  const jam = Number(cocok[1]);
  const menit = Number(cocok[2]);
  return jam > 23 || menit > 59 ? null : jam + menit / 60;
}

// Support jam tutup lewat tengah malam (misalnya buka 18.00, tutup 02.00)
export function sedangBuka(sekarang: Date, buka: number, tutup: number): boolean {
  const jam = sekarang.getHours() + sekarang.getMinutes() / 60;
  return buka <= tutup
    ? jam >= buka && jam < tutup
    : jam >= buka || jam < tutup;
}

export function useJamBuka() {
  const { teks } = useContent();

  const ambilJam = (key: string) => {
    const nilai = teks(key).trim();
    return jamKeDesimal(nilai) === null ? String(contentDefaults[key]) : nilai;
  };

  const buka = ambilJam("contact.hours.open");
  const tutup = ambilJam("contact.hours.close");

  return {
    buka,
    tutup,
    bukaDesimal: jamKeDesimal(buka) ?? 0,
    tutupDesimal: jamKeDesimal(tutup) ?? 0,
    hari: teks("contact.hours.days"),
    zona: teks("contact.hours.zone"),
  };
}

function bacaAngka(nilai: string, key: string, min: number, maks: number): number {
  const teks = nilai.trim();
  const angka = Number(teks.replace(",", "."));
  const valid = teks !== "" && Number.isFinite(angka) && angka >= min && angka <= maks;
  return valid ? angka : Number(contentDefaults[key]);
}

export function useKoordinat() {
  const { teks } = useContent();
  return {
    lat: bacaAngka(teks("contact.map.lat"), "contact.map.lat", -90, 90),
    lng: bacaAngka(teks("contact.map.lng"), "contact.map.lng", -180, 180),
  };
}

export type JenisKontak = "telepon" | "whatsapp" | "email";

// 0817-1779-4014 -> 6281717794014
function nomorInternasional(teks: string): string {
  const digit = teks.replace(/\D/g, "");
  return digit.startsWith("0") ? "62" + digit.slice(1) : digit;
}

export function tautanKontak(jenis: JenisKontak, nilai: string, pesanWa: string) {
  if (jenis === "email") {
    return { href: `mailto:${nilai.trim()}`, external: false };
  }

  const nomor = nomorInternasional(nilai);
  if (jenis === "telepon") {
    return { href: `tel:+${nomor}`, external: false };
  }

  return {
    href: `https://wa.me/${nomor}?text=${encodeURIComponent(pesanWa)}`,
    external: true,
  };
}
