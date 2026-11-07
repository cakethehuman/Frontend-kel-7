import { prisma } from "../lib/prisma";
import { menuItems } from "../data/menu";
import { hashPassword } from "../lib/auth";

const faqAwal = [
  {
    question: "Dari mana asal Mie Belitung?",
    answer:
      "Mie Belitung adalah kuliner khas Pulau Belitung yang terkenal dengan kuah kaldu udang kental dan disajikan di atas daun simpor.",
  },
  {
    question: "Apa saja pilihan menu yang tersedia?",
    answer:
      "Kami menyediakan beberapa varian Mie Belitung, mulai dari original hingga topping tambahan seperti udang dan kerupuk. Cek selengkapnya di halaman Menu.",
  },
  {
    question: "Bagaimana cara memesan Mie Belitung?",
    answer:
      'Klik tombol "Pesan Sekarang" di halaman utama atau buka halaman Menu, pilih menu yang diinginkan, lalu ikuti proses pemesanannya.',
  },
  {
    question: "Apakah bisa request tingkat kepedasan?",
    answer:
      "Bisa. Kamu dapat menambahkan catatan tingkat kepedasan saat melakukan pemesanan.",
  },
  {
    question: "Apakah kemasan aman untuk dibawa pulang?",
    answer:
      "Aman. Kemasan kami dirancang kedap agar kuah tidak tumpah dan makanan tetap hangat selama perjalanan.",
  },
  {
    question: "Metode pembayaran apa saja yang diterima?",
    answer:
      "Kami menerima pembayaran tunai maupun transfer/QRIS, tergantung metode yang tersedia saat checkout.",
  },
];

async function main() {
  try {
    console.log("Memulai proses seeding database...");

    const adminPasswordHash = hashPassword("admin123");
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@belitung.com" },
      update: {
        name: "Administrator",
        password: adminPasswordHash,
        is_admin: 1,
        role: "Admin Mie Belitung",
        bio: "Akun administrator resmi untuk pengelolaan operasional resto Mie Belitung.",
        tags: "Admin,MieBelitung,Manager",
      },
      create: {
        email: "admin@belitung.com",
        name: "Administrator",
        password: adminPasswordHash,
        is_admin: 1,
        role: "Admin Mie Belitung",
        bio: "Akun administrator resmi untuk pengelolaan operasional resto Mie Belitung.",
        tags: "Admin,MieBelitung,Manager",
      },
    });
    console.log(`✓ Admin user berhasil di-seed: ${adminUser.email} (password: admin123)`);

    const userPasswordHash = hashPassword("user123");
    const normalUser = await prisma.user.upsert({
      where: { email: "user@belitung.com" },
      update: {
        name: "Willson kaoruko",
        password: userPasswordHash,
        is_admin: 0,
        role: "Student & Programmer",
        bio: "I am an Informatics Engineering student from Belitung, and I love authentic Belitung culinary.",
        tags: "AnimLovers,Untarian,Soushin",
      },
      create: {
        email: "user@belitung.com",
        name: "Wilson Widodo",
        password: userPasswordHash,
        is_admin: 0,
        role: "Student & Programmer",
        bio: "I am an Informatics Engineering student from Belitung, and I love authentic Belitung culinary.",
        tags: "AnimLovers,Untarian,Soushin",
      },
    });
    console.log(`✓ Normal user berhasil di-seed: ${normalUser.email} (password: user123)`);

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
    console.log(`✓ Seed menu selesai: ${menuItems.length} menu dengan deskripsi seragam berhasil disimpan.`);

    const orderCount = await prisma.order.count();
    if (orderCount === 0) {
      const mieItem = await prisma.menu.findFirst({ where: { slug: "mie-belitung" } });
      const jerukItem = await prisma.menu.findFirst({ where: { slug: "es-jeruk-kunci" } });

      if (mieItem && jerukItem) {
        const subtotal = mieItem.price * 2 + jerukItem.price * 2;
        const tax = Math.round(subtotal * 0.1);
        const total = subtotal + tax;

        await prisma.order.create({
          data: {
            user_id: normalUser.user_id,
            customer_name: normalUser.name,
            phone: "081234567890",
            order_type: "dinein",
            table_number: 5,
            payment_method: "QRIS",
            note: "Kuah dipisah, porsi mantap.",
            status: "pending",
            tax_rate: 0.1,
            total: total,
            order_items: {
              create: [
                {
                  menu_id: mieItem.menu_id,
                  quantity: 2,
                  price_at_purchase: mieItem.price,
                },
                {
                  menu_id: jerukItem.menu_id,
                  quantity: 2,
                  price_at_purchase: jerukItem.price,
                },
              ],
            },
          },
        });
        console.log("✓ Sample pesanan awal berhasil dibuat.");
      }
    }

    const faqCount = await prisma.faq.count();
    if (faqCount === 0) {
      await prisma.faq.createMany({
        data: faqAwal.map((item, i) => ({ ...item, sort_order: i + 1 })),
      });
      console.log(`✓ Seed FAQ selesai: ${faqAwal.length} data.`);
    }

    console.log("Seeding database berhasil dan tuntas!");
  } catch (err) {
    console.error("Terjadi error saat menjalankan seed:", err);
    throw err;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch (e) {
      console.error(e);
    }
  });