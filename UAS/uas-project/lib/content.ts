export type FieldDef = {
  name: string;
  label: string;
  maxLength: number;
  multiline?: boolean;
  hint?: string;
};

export type OpsiGambar = { value: string; label: string };

export type TextEntry = {
  kind: "text";
  key: string;
  label: string;
  maxLength: number;
  multiline?: boolean;
  hint?: string;
  options?: OpsiGambar[];
  default: string;
};

export type ListEntry = {
  kind: "list";
  key: string;
  label: string;
  itemLabel: string;
  fields: FieldDef[];
  default: Record<string, string>[];
  fixed: boolean;
  max: number;
  hint?: string;
};

export type Entry = TextEntry | ListEntry;
export type Section = { id: string; label: string; entries: Entry[] };
export type PageDef = { id: string; label: string; sections: Section[] };

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

export const contentPages: PageDef[] = [
  {
    id: "home",
    label: "Home",
    sections: [
      {
        id: "hero",
        label: "Hero (bagian atas)",
        entries: [
          {
            kind: "text",
            key: "home.hero.title",
            label: "Judul utama",
            maxLength: 80,
            default: "Makanan Lezat Dari Belitung",
          },
          {
            kind: "text",
            key: "home.hero.subtitle",
            label: "Subjudul",
            maxLength: 80,
            default: "Rasa Makanan Terbaik",
          },
          {
            kind: "text",
            key: "home.hero.description",
            label: "Deskripsi",
            maxLength: 400,
            multiline: true,
            default:
              "Temukan sensasi perpaduan bumbu rempah pilihan dan kaldu udang kental khas Belitung. Nikmat warisan kuliner autentik yang siap memanjakan lidah Anda sejak suapan pertama",
          },
          {
            kind: "text",
            key: "home.hero.cta_primary",
            label: "Label tombol pertama",
            maxLength: 30,
            default: "Pesan Sekarang",
          },
          {
            kind: "text",
            key: "home.hero.cta_secondary",
            label: "Label tombol kedua",
            maxLength: 30,
            default: "Baca Selengkapnya",
          },
          {
            kind: "text",
            key: "home.hero.image",
            label: "Gambar utama (bulat)",
            maxLength: 80,
            options: opsiGambar,
            hint: "Pilih dari gambar yang tersedia di folder public/IMG.",
            default: "/IMG/mie_belitung_muantap.webp",
          },
          {
            kind: "text",
            key: "home.hero.image_alt",
            label: "Teks alternatif gambar utama",
            maxLength: 120,
            hint: "Deskripsi singkat gambar untuk pembaca layar. Sesuaikan jika gambar diganti.",
            default: "Semangkuk Mie Belitung",
          },
        ],
      },
      {
        id: "hotspots",
        label: "Hotspot di gambar mie",
        entries: [
          {
            kind: "list",
            key: "home.hotspots",
            label: "Tiga hotspot (tanda +)",
            itemLabel: "Hotspot",
            fixed: true,
            max: 3,
            hint: "Jumlahnya tetap 3 karena posisinya sudah diatur di tampilan.",
            fields: [
              { name: "title", label: "Judul", maxLength: 60 },
              {
                name: "description",
                label: "Deskripsi",
                maxLength: 200,
                multiline: true,
              },
            ],
            default: [
              {
                title: "🍲 Kuah Kaldu Kental",
                description:
                  "Sari udang & ebi sangrai kental manis-gurih dimasak dengan rempah rahasia.",
              },
              {
                title: "🍃 Daun Simpor",
                description:
                  "Alas saji daun hutan Belitung beraroma khas saat disiram kuah panas mendidih.",
              },
              {
                title: "🦐 Udang Laut Segar",
                description:
                  "Udang laut tangkapan nelayan lokal Belitung, direbus pas dengan rasa manis alami.",
              },
            ],
          },
        ],
      },
      {
        id: "features",
        label: "Tiga info di bawah hero",
        entries: [
          {
            kind: "list",
            key: "home.features",
            label: "Info keunggulan",
            itemLabel: "Info",
            fixed: true,
            max: 3,
            hint: "Ikonnya tetap, hanya teks yang bisa diubah.",
            fields: [
              { name: "title", label: "Judul", maxLength: 40 },
              { name: "subtitle", label: "Subjudul", maxLength: 40 },
            ],
            default: [
              { title: "Antar 25-35 mnt", subtitle: "Hangat ke Lokasi" },
              { title: "Daun Simpor", subtitle: "Wangi Alami Hutan" },
              { title: "100% Halal Segar", subtitle: "Udang Laut Pilihan" },
            ],
          },
        ],
      },
      {
        id: "whyus",
        label: "Kenapa Pilih Kami?",
        entries: [
          {
            kind: "text",
            key: "home.whyus.title",
            label: "Judul section",
            maxLength: 60,
            default: "Kenapa Pilih Kami?",
          },
          {
            kind: "text",
            key: "home.whyus.subtitle",
            label: "Subjudul section",
            maxLength: 220,
            multiline: true,
            default:
              "Bukan sekadar mie, tapi warisan rasa Belitung yang kami jaga dari dapur sampai ke meja Anda.",
          },
          {
            kind: "list",
            key: "home.whyus.cards",
            label: "Kartu keunggulan",
            itemLabel: "Kartu",
            fixed: false,
            max: 8,
            fields: [
              {
                name: "icon",
                label: "Ikon",
                maxLength: 40,
                hint: "Nama ikon Bootstrap Icons, contoh: bi-award, bi-basket, bi-cash-coin",
              },
              { name: "title", label: "Judul", maxLength: 40 },
              {
                name: "text",
                label: "Teks",
                maxLength: 160,
                multiline: true,
              },
            ],
            default: [
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
            ],
          },
        ],
      },
      {
        id: "faq",
        label: "FAQ",
        entries: [
          {
            kind: "text",
            key: "home.faq.title",
            label: "Judul section FAQ",
            maxLength: 60,
            hint: "Isi pertanyaan dan jawabannya diatur di menu FAQ.",
            default: "FAQ",
          },
        ],
      },
    ],
  },
  {
    id: "profile",
    label: "Profile",
    sections: [
      {
        id: "kartu",
        label: "Kartu profil dan About",
        entries: [
          {
            kind: "text",
            key: "profile.cover.image",
            label: "Foto cover",
            maxLength: 80,
            options: opsiGambar,
            hint: "Pilih dari gambar yang tersedia di folder public/IMG.",
            default: "/IMG/mie_belitung_muantap.webp",
          },
          {
            kind: "text",
            key: "profile.cover.alt",
            label: "Teks alternatif foto cover",
            maxLength: 120,
            hint: "Deskripsi singkat gambar untuk pembaca layar. Sesuaikan jika gambar diganti.",
            default: "Mie Belitung, kuliner favorit utama",
          },
          {
            kind: "text",
            key: "profile.cover.caption",
            label: "Caption foto cover",
            maxLength: 40,
            default: "Favorit Utama",
          },
          {
            kind: "text",
            key: "profile.location",
            label: "Lokasi",
            maxLength: 60,
            default: "Jakarta, Indonesia",
          },
          {
            kind: "text",
            key: "profile.about.label",
            label: "Label bagian About",
            maxLength: 40,
            default: "About Me",
          },
        ],
      },
      {
        id: "favorit",
        label: "Daftar kuliner favorit",
        entries: [
          {
            kind: "text",
            key: "profile.fav.label",
            label: "Label kecil di atas judul",
            maxLength: 50,
            default: "Daftar Jelajah Kuliner",
          },
          {
            kind: "text",
            key: "profile.fav.title",
            label: "Judul",
            maxLength: 60,
            default: "Kuliner Nusantara Favoritku",
          },
          {
            kind: "text",
            key: "profile.fav.subtitle",
            label: "Subjudul",
            maxLength: 120,
            default: "Catat makanan khas daerah yang ingin kamu coba",
          },
          {
            kind: "text",
            key: "profile.regions",
            label: "Pilihan wilayah di dropdown",
            maxLength: 400,
            multiline: true,
            hint: "Tulis satu wilayah per baris.",
            default:
              "Sumatra\nJawa\nBali & Nusa Tenggara\nKalimantan\nSulawesi\nMaluku & Papua",
          },
        ],
      },
    ],
  },
];

export const contentEntries: Entry[] = contentPages.flatMap((page) =>
  page.sections.flatMap((section) => section.entries),
);

export const contentDefaults: Record<string, unknown> = Object.fromEntries(
  contentEntries.map((entry) => [entry.key, entry.default]),
);

export function gambarAman(key: string, nilai: string): string {
  const entry = contentEntries.find((e) => e.key === key);
  if (entry?.kind !== "text" || !entry.options) return nilai;

  return entry.options.some((opsi) => opsi.value === nilai)
    ? nilai
    : entry.default;
}