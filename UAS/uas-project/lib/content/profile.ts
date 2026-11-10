import { opsiGambar, teksPendek } from "./helpers";
import { PageDef } from "./types";



export const profilePage: PageDef =
{
  id: "profile",
  label: "Profile",
  sections: [
    {
      id: "kartu",
      label: "Profile",
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
    {
      id: "tombol",
      label: "Tombol, statistik, dan progres",
      entries: [
        teksPendek("profile.btn.edit", "Tombol edit profil", "Edit Profil", 30),
        teksPendek("profile.btn.logout", "Tombol logout", "Logout", 30),
        teksPendek("profile.stat.total", "Statistik: total favorit", "Total Favorit"),
        teksPendek("profile.stat.done", "Statistik: sudah dicoba", "Sudah Dicoba"),
        teksPendek("profile.stat.regions", "Statistik: wilayah dijelajahi", "Wilayah Dijelajahi"),
        teksPendek("profile.progress.title", "Judul progres", "Progres Jelajah Kuliner", 50),
      ],
    },
    {
      id: "form",
      label: "Form tambah, pencarian, dan filter",
      entries: [
        teksPendek("profile.form.name_label", "Label nama kuliner", "Nama Kuliner"),
        teksPendek("profile.form.name_placeholder", "Contoh isian nama kuliner", "cth: Teh Pucuk"),
        teksPendek("profile.form.region_label", "Label asal wilayah", "Asal Wilayah"),
        teksPendek("profile.form.add", "Tombol tambah", "Tambah", 20),
        teksPendek("profile.search.placeholder", "Teks kolom pencarian", "Cari nama atau wilayah...", 50),
        teksPendek("profile.filter.all", "Filter: semua", "Semua", 20),
        teksPendek("profile.filter.todo", "Filter: belum dicoba", "Belum dicoba", 20),
        teksPendek("profile.filter.done", "Filter: sudah dicoba", "Sudah dicoba", 20),
      ],
    },
    {
      id: "pesan",
      label: "Pesan daftar kosong dan konfirmasi hapus",
      entries: [
        teksPendek(
          "profile.empty.none",
          "Pesan saat daftar masih kosong",
          "Daftarmu masih kosong. Yuk tambah kuliner pertamamu!",
          120,
        ),
        teksPendek(
          "profile.empty.nomatch",
          "Pesan saat pencarian atau filter tidak cocok",
          "Tidak ada kuliner yang cocok dengan pencarian atau filter ini.",
          120,
        ),
        teksPendek("profile.delete.title", "Judul konfirmasi hapus", "Hapus dari daftar?", 50),
        teksPendek("profile.delete.confirm", "Tombol konfirmasi hapus", "Ya, Hapus", 30),
      ],
    },

  ],
}
