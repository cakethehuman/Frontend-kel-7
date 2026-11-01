import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

const DAFTAR_KATEGORI = ["Makanan", "Pelayanan", "Tempat", "Lainnya"];
const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", async (req, res) => {
    const body = req.body ?? {};

    const user = await prisma.user.findUnique({
        where: { user_id: Number(body.user_id) },
    });

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
});

export default router;
