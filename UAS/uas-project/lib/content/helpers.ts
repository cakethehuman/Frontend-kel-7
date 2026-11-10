import { OpsiGambar, TextEntry } from "./types";

export const opsiGambar: OpsiGambar[] = [
  {
    value: "/IMG/mie_belitung_muantap.webp",
    label: "Mie Belitung (foto utama)",
  },
  { value: "/IMG/Mie Belitung Close-Up.webp", label: "Mie Belitung Close-Up" },
  { value: "/IMG/Bahan Mie Belitung.webp", label: "Bahan Mie Belitung" },
  {
    value: "/IMG/Mie Belitung Daun Simpor.webp",
    label: "Mie Belitung di Daun Simpor",
  },
  { value: "/IMG/mie_belitung.webp", label: "Mie Belitung (standar)" },
  { value: "/IMG/esBelitung.webp", label: "Es Belitung" },
  { value: "/IMG/EsJerukKunci.webp", label: "Es Jeruk Kunci" },
  { value: "/IMG/kopiBelitung.webp", label: "Kopi Belitung" },
  { value: "/IMG/kerupukBelitung.webp", label: "Kerupuk Belitung" },
  { value: "/IMG/nasiTim.avif", label: "Nasi Tim" },
  { value: "/IMG/gambar1_contact.webp", label: "Foto Contact" },
];

export const teksPendek = (
  key: string,
  label: string,
  nilaiBawaan: string,
  maxLength = 40,

): TextEntry => ({
  kind: "text",
  key,
  label,
  maxLength,
  default: nilaiBawaan
});
