import { prisma } from "../lib/prisma";
import { menuItems } from "../data/menu";

async function main() {
  console.log("Memulai proses seeding dari data folder...");

  for (const item of menuItems) {
    await prisma.menu.upsert({
      where: { slug: item.id },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.img,
        item_type: item.category,
      },
      create: {
        slug: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.img,
        item_type: item.category,
      },
    });
  }

  console.log(`Seed selesai: ${menuItems.length} menu berhasil disimpan ke database.`);
}

main()
  .catch((e) => {
    console.error("Terjadi error saat menjalankan seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
