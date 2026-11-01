import { prisma } from "../lib/prisma";

const DATA_MENU = [
    { slug: "mie-belitung", name: "Mie Belitung", description: "Mie Belitung dengan kuah khas.", price: 20000, image: "/IMG/mie_belitung.webp", item_type: "Main" },
    { slug: "mie-belitung-special", name: "Mie Belitung Special", description: "Mie Belitung dengan topping spesial.", price: 28000, image: "/IMG/mie_belitung.webp", item_type: "Main" },
    { slug: "mie-belitung-complit", name: "Mie Belitung Complit", description: "Mie Belitung dengan topping complit.", price: 29000, image: "/IMG/mie_belitung.webp", item_type: "Main" },
    { slug: "es-jeruk-kunci", name: "Es Jeruk Kunci", description: "Teh jeruk kunci yang dingin yang menyegarkan.", price: 5000, image: "/IMG/EsJerukKunci.webp", item_type: "Drink" },
    { slug: "kopi-belitung", name: "Kopi Belitung", description: "Kopi khas Belitung.", price: 5000, image: "/IMG/kopiBelitung.webp", item_type: "Drink" },
    { slug: "kerupuk-belitung", name: "Kerupuk Belitung", description: "Kerupuk Belitung.", price: 3000, image: "/IMG/kerupukBelitung.webp", item_type: "Others" },
    { slug: "nasi-tim", name: "Nasi Tim", description: "Nasi tim hangat.", price: 25000, image: "/IMG/nasiTim.avif", item_type: "Others" },
    { slug: "es-belitung", name: "Es Belitung", description: "Es Belitung segar.", price: 13000, image: "/IMG/esBelitung.webp", item_type: "Others" },
];

async function main() {
    for (const menu of DATA_MENU) {
        await prisma.menu.upsert({
            where: { slug: menu.slug },
            update: menu,
            create: menu,
        });
    }

    console.log("Seed selesai: " + DATA_MENU.length + " menu.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
