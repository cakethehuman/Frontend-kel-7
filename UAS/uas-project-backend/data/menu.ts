export type MenuCategory = "Main" | "Drink" | "Others";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  img: string;
  category: MenuCategory;
}

export const menuCategories: MenuCategory[] = ["Main", "Drink", "Others"];

export const menuItems: MenuItem[] = [
  {
    id: "mie-belitung",
    name: "Mie Belitung",
    description: "Mie Belitung dengan kuah khas.",
    price: 20000,
    img: "/IMG/mie_belitung.webp",
    category: "Main",
  },
  {
    id: "mie-belitung-special",
    name: "Mie Belitung Special",
    description: "Mie Belitung dengan topping spesial.",
    price: 28000,
    img: "/IMG/mie_belitung.webp",
    category: "Main",
  },
  {
    id: "mie-belitung-complit",
    name: "Mie Belitung Complit",
    description: "Mie Belitung dengan topping complit.",
    price: 29000,
    img: "/IMG/mie_belitung.webp",
    category: "Main",
  },
  {
    id: "es-jeruk-kunci",
    name: "Es Jeruk Kunci",
    description: "Teh jeruk kunci yang dingin yang menyegarkan.",
    price: 5000,
    img: "/IMG/EsJerukKunci.webp",
    category: "Drink",
  },
  {
    id: "kopi-belitung",
    name: "Kopi Belitung",
    description: "Kopi khas Belitung.",
    price: 5000,
    img: "/IMG/kopiBelitung.webp",
    category: "Drink",
  },
  {
    id: "kerupuk-belitung",
    name: "Kerupuk Belitung",
    description: "Kerupuk Belitung.",
    price: 3000,
    img: "/IMG/kerupukBelitung.webp",
    category: "Others",
  },
  {
    id: "nasi-tim",
    name: "Nasi Tim",
    description: "Nasi tim hangat.",
    price: 25000,
    img: "/IMG/nasiTim.avif",
    category: "Others",
  },
  {
    id: "es-belitung",
    name: "Es Belitung",
    description: "Es Belitung segar.",
    price: 13000,
    img: "/IMG/esBelitung.webp",
    category: "Others",
  },
];
