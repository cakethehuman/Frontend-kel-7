export type FieldDef = {
  name: string;
  label: string;
  maxLength: number;
  multiline?: boolean;
  hint?: string;
};

export type TextEntry = {
  kind: "text";
  key: string;
  label: string;
  maxLength: number;
  multiline?: boolean;
  hint?: string;
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
  {
    id: "about",
    label: "About",
    sections: [
      {
        id: "intro",
        label: "Pengenalan (bagian atas)",
        entries: [
          {
            kind: "text",
            key: "about.intro.label",
            label: "Label kecil di atas judul",
            maxLength: 40,
            default: "Kenali Lebih Dekat",
          },
          {
            kind: "text",
            key: "about.intro.title_before",
            label: "Judul: kata sebelum sorotan",
            maxLength: 30,
            hint: "Judul dibaca: [sebelum] [sorotan][sesudah]. Bagian sorotan tampil berwarna.",
            default: "Apa itu",
          },
          {
            kind: "text",
            key: "about.intro.title_highlight",
            label: "Judul: kata yang disorot",
            maxLength: 40,
            default: "Mie Belitung",
          },
          {
            kind: "text",
            key: "about.intro.title_after",
            label: "Judul: tanda/kata sesudah sorotan",
            maxLength: 20,
            default: "?",
          },
          {
            kind: "text",
            key: "about.intro.desc",
            label: "Deskripsi singkat",
            maxLength: 500,
            multiline: true,
            default:
              "Mie Belitung adalah warisan kuliner legendaris hasil perpaduan harmonis budaya Tionghoa dan Melayu di Pulau Belitung. Mie kuning ala Tiongkok dipadukan dengan kekayaan hasil laut lokal, menghasilkan kuah kaldu udang autentik yang resepnya dijaga turun-temurun oleh masyarakat Belitung.",
          },
          {
            kind: "text",
            key: "about.intro.desc_more",
            label: "Deskripsi lanjutan (muncul saat Baca Selengkapnya)",
            maxLength: 1500,
            multiline: true,
            hint: "Pisahkan paragraf dengan satu baris kosong. Bungkus teks dengan **dua bintang** untuk menebalkan.",
            default:
              "Kuliner ini pertama kali populer sebagai hidangan rumahan di kalangan keturunan Tionghoa Belitung sebelum akhirnya menjadi ikon kuliner daerah yang wajib dicoba wisatawan. Ciri khasnya terletak pada kuah kaldu udang kental berwarna cokelat kemerahan, dengan rasa manis-gurih yang khas, disajikan hangat di atas **daun simpor** — daun besar khas Belitung yang menambah aroma alami pada hidangan.\n\nDalam semangkuknya terdapat udang, tahu goreng, kentang rebus, taoge, mentimun, emping, mie telur, dan kuah kental berwarna cokelat yang dibumbui lengkuas, kemiri, jahe, bawang putih, dan bawang merah. Lebih dari sekadar makanan, Mie Belitung merefleksikan sejarah migrasi, adaptasi budaya, kreativitas masyarakat dalam mengolah sumber daya alam, serta menjadi simbol identitas dan kontinuitas tradisi kuliner Belitung dalam mozaik kuliner Nusantara.",
          },
          {
            kind: "text",
            key: "about.intro.btn_more",
            label: "Label tombol buka",
            maxLength: 30,
            default: "Baca Selengkapnya",
          },
          {
            kind: "text",
            key: "about.intro.btn_less",
            label: "Label tombol tutup",
            maxLength: 30,
            default: "Tutup",
          },
          {
            kind: "text",
            key: "about.intro.cta",
            label: "Label tombol pesan",
            maxLength: 30,
            default: "Pesan Sekarang",
          },
        ],
      },
      {
        id: "history",
        label: "Sejarah & Akulturasi Budaya",
        entries: [
          {
            kind: "text",
            key: "about.history.title",
            label: "Judul section",
            maxLength: 60,
            default: "Sejarah & Akulturasi Budaya",
          },
          {
            kind: "text",
            key: "about.history.subtitle",
            label: "Subjudul section",
            maxLength: 220,
            multiline: true,
            default:
              "Perjalanan Mie Belitung dari dapur rumahan hingga menjadi ikon kuliner Pulau Belitung.",
          },
          {
            kind: "list",
            key: "about.history.items",
            label: "Linimasa",
            itemLabel: "Peristiwa",
            fixed: false,
            max: 8,
            fields: [
              { name: "waktu", label: "Waktu", maxLength: 30 },
              { name: "judul", label: "Judul", maxLength: 60 },
              {
                name: "text",
                label: "Keterangan",
                maxLength: 220,
                multiline: true,
              },
            ],
            default: [
              {
                waktu: "Abad ke-19",
                judul: "Kedatangan Imigran Tionghoa",
                text: "Imigran Tionghoa datang ke Belitung untuk bekerja di pertambangan timah, membawa tradisi mengolah mie kuning khas Tiongkok.",
              },
              {
                waktu: "Akulturasi",
                judul: "Perpaduan dengan Budaya Melayu",
                text: "Resep mie kuning berpadu dengan kekayaan hasil laut dan bumbu rempah khas Melayu, melahirkan kuah kaldu udang kental yang khas.",
              },
              {
                waktu: "Turun-temurun",
                judul: "Resep Keluarga",
                text: "Resep dijaga dan diwariskan turun-temurun dari generasi ke generasi oleh warga Belitung.",
              },
              {
                waktu: "Kini",
                judul: "Ikon Kuliner Belitung",
                text: "Mie Belitung menjadi hidangan wajib coba bagi wisatawan yang berkunjung ke Tanjung Pandan.",
              },
            ],
          },
        ],
      },
      {
        id: "features",
        label: "Keunikan & Ciri Khas",
        entries: [
          {
            kind: "text",
            key: "about.features.title",
            label: "Judul section",
            maxLength: 60,
            default: "Keunikan & Ciri Khas",
          },
          {
            kind: "list",
            key: "about.features.items",
            label: "Kotak keunikan",
            itemLabel: "Keunikan",
            fixed: false,
            max: 8,
            fields: [
              {
                name: "icon",
                label: "Ikon",
                maxLength: 40,
                hint: "Nama ikon Boxicons, contoh: bx-bowl-hot, bx-leaf, bx-restaurant, bx-flag",
              },
              { name: "title", label: "Judul", maxLength: 40 },
              {
                name: "text",
                label: "Teks",
                maxLength: 200,
                multiline: true,
              },
            ],
            default: [
              {
                icon: "bx-bowl-hot",
                title: "Kuah Kaldu Udang",
                text: "Kuah kental berwarna cokelat kemerahan, dimasak dari kaldu udang asli dengan rasa manis-gurih khas.",
              },
              {
                icon: "bx-leaf",
                title: "Daun Simpor",
                text: "Disajikan di atas daun simpor, daun lebar khas Belitung yang menambah aroma alami pada hidangan.",
              },
              {
                icon: "bx-restaurant",
                title: "Topping Melimpah",
                text: "Dilengkapi tauge, timun, udang, dan emping yang menambah tekstur renyah di setiap suapan.",
              },
              {
                icon: "bx-flag",
                title: "Warisan Budaya",
                text: "Simbol akulturasi budaya Tionghoa dan Melayu yang hidup dalam satu piring hidangan.",
              },
            ],
          },
        ],
      },
      {
        id: "recipe",
        label: "Komponen Utama dan Cara Penyajian",
        entries: [
          {
            kind: "text",
            key: "about.recipe.title",
            label: "Judul komponen",
            maxLength: 60,
            default: "Komponen Utama",
          },
          {
            kind: "text",
            key: "about.recipe.components",
            label: "Daftar komponen",
            maxLength: 600,
            multiline: true,
            hint: "Tulis satu komponen per baris. Awali baris dengan tanda - untuk menjadikannya sub-poin dari baris di atasnya.",
            default:
              "Mie Kuning Basah\nUdang Segar\n- Udang utuh untuk topping\n- Kaldu udang untuk kuah\nTauge Segar\nTimun, dipotong dadu\nEmping Melinjo\nDaun Simpor Sebagai Alas Penyajian\nBumbu Rempah Pilihan (Bawang Putih, Bawang Merah, Gula Merah)",
          },
          {
            kind: "text",
            key: "about.recipe.steps_title",
            label: "Judul cara penyajian",
            maxLength: 60,
            default: "Cara Penyajian",
          },
          {
            kind: "text",
            key: "about.recipe.steps",
            label: "Langkah penyajian",
            maxLength: 600,
            multiline: true,
            hint: "Tulis satu langkah per baris. Penomoran dibuat otomatis.",
            default:
              "Letakkan mie kuning di atas daun simpor.\nSiram dengan kuah kaldu udang kental yang masih hangat.\nTambahkan tauge, timun, dan udang di atasnya.\nTaburi dengan emping melinjo, siap disajikan.",
          },
        ],
      },
      {
        id: "legend",
        label: "Tradisi & Legenda",
        entries: [
          {
            kind: "text",
            key: "about.legend.title",
            label: "Judul section",
            maxLength: 60,
            default: "Tradisi & Legenda",
          },
          {
            kind: "list",
            key: "about.legend.items",
            label: "Item tradisi (accordion)",
            itemLabel: "Item",
            fixed: false,
            max: 8,
            fields: [
              { name: "title", label: "Judul", maxLength: 80 },
              {
                name: "text",
                label: "Isi",
                maxLength: 300,
                multiline: true,
              },
            ],
            default: [
              {
                title: 'Asal Mula Nama "Mie Belitung"',
                text: "Nama Mie Belitung diambil langsung dari nama pulau tempat kuliner ini lahir, sebagai bentuk kebanggaan masyarakat setempat atas identitas daerahnya.",
              },
              {
                title: "Tradisi Menyantap Bersama Keluarga",
                text: "Mie Belitung sering dihidangkan saat berkumpul bersama keluarga besar, terutama pada momen hari raya dan acara adat setempat.",
              },
              {
                title: "Legenda Kaldu Udang Turun-temurun",
                text: "Konon, resep kaldu udang otentik hanya diwariskan kepada anggota keluarga tertentu, menjaga cita rasa khas tetap terjaga hingga saat ini.",
              },
            ],
          },
        ],
      },
      {
        id: "closing",
        label: "Penutup",
        entries: [
          {
            kind: "text",
            key: "about.closing.title",
            label: "Judul",
            maxLength: 60,
            default: "Rasakan Sensasinya",
          },
          {
            kind: "text",
            key: "about.closing.text",
            label: "Teks",
            maxLength: 300,
            multiline: true,
            default:
              "Nikmati warisan kuliner autentik Belitung yang siap memanjakan lidah Anda sejak suapan pertama.",
          },
          {
            kind: "text",
            key: "about.closing.cta",
            label: "Label tombol",
            maxLength: 30,
            default: "Pesan Sekarang",
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
