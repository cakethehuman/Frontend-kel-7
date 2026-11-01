import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

const DAFTAR_KATEGORI = ["Makanan", "Pelayanan", "Tempat", "Lainnya"];
const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get("/", async (_req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Gagal mengambil daftar feedback." });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body ?? {};

<<<<<<< HEAD
    const user = await prisma.user.findUnique({
      where: { user_id: Number(body.user_id) },
    });
=======
    const user = await prisma.user.findFirst();
>>>>>>> ccc6616b6ac8732b9970fb7c473b286adefba577

    if (!user) {
      res.status(401).json({ message: "Kamu Harus Login Dulu." });
      return;
    }

    const nama = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const kategori = String(body.category ?? "");
    const pesan = String(body.message ?? "").trim();
    const rating = Number(body.rating);

    if (nama.length < 3) {
      res.status(400).json({ message: "Nama Minimal 3 Huruf." });
      return;
    }

    if (email && !POLA_EMAIL.test(email)) {
      res.status(400).json({ message: "Format Email Belum Benar." });
      return;
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      res.status(400).json({ message: "Rating Harus 1 Sampai 5." });
      return;
    }

    if (!DAFTAR_KATEGORI.includes(kategori)) {
      res.status(400).json({ message: "Kategori Tidak Dikenal." });
      return;
    }

    if (pesan.length < 10 || pesan.length > 500) {
      res.status(400).json({ message: "Pesan Harus 10 Sampai 500 Karakter." });
      return;
    }

    const feedbackBaru = await prisma.feedback.create({
      data: {
        user_id: user.user_id,
        name: nama,
        email: email || null,
        rating: rating,
        category: kategori,
        message: pesan,
      },
    });

    res.status(201).json(feedbackBaru);
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Terjadi kesalahan server saat menyimpan feedback." });
  }
});

export default router;