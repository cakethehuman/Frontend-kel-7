import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

const DATA_KULINER_AWAL = [
  { name: "Mie Belitung", region: "Sumatra", done: true },
  { name: "Rendang", region: "Sumatra", done: true },
  { name: "Gudeg", region: "Jawa", done: true },
  { name: "Rawon", region: "Jawa", done: false },
  { name: "Ayam Betutu", region: "Bali & Nusa Tenggara", done: false },
  { name: "Coto Makassar", region: "Sulawesi", done: false },
  { name: "Papeda", region: "Maluku & Papua", done: false },
  { name: "Soto Banjar", region: "Kalimantan", done: false },
];


router.get("/", async (req, res) => {
  try {
    let userId = Number(req.query.user_id);

    if (!userId) {
      const userPertama = await prisma.user.findFirst();
      if (!userPertama) {
        res.json([]);
        return;
      }
      userId = userPertama.user_id;
    }

    const jumlah = await prisma.favorite.count({
      where: { user_id: userId },
    });

    if (jumlah === 0) {
      const dataAwalUser = DATA_KULINER_AWAL.map((item) => ({
        user_id: userId,
        name: item.name,
        region: item.region,
        done: item.done,
      }));
      
      await prisma.favorite.createMany({
        data: dataAwalUser,
      });
    }

    const favorites = await prisma.favorite.findMany({
      where: { user_id: userId },
      orderBy: { id: "asc" },
    });

    res.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Gagal mengambil data favorit." });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body ?? {};
    let userId = Number(body.user_id);

    if (!userId) {
      const userPertama = await prisma.user.findFirst();
      if (!userPertama) {
        res.status(404).json({ message: "User tidak ditemukan." });
        return;
      }
      userId = userPertama.user_id;
    }

    if (!body.name || !body.region) {
      res.status(400).json({ message: "Nama kuliner dan wilayah wajib diisi." });
      return;
    }

    const itemBaru = await prisma.favorite.create({
      data: {
        user_id: userId,
        name: String(body.name).trim(),
        region: String(body.region).trim(),
        done: false,
      },
    });

    res.status(201).json(itemBaru);
  } catch (error) {
    console.error("Error creating favorite:", error);
    res.status(500).json({ message: "Gagal menambah kuliner favorit." });
  }
});

router.patch("/", async (req, res) => {
  try {
    const body = req.body ?? {};

    const itemUpdate = await prisma.favorite.update({
      where: { id: Number(body.id) },
      data: { done: Boolean(body.done) },
    });

    res.json(itemUpdate);
  } catch (error) {
    console.error("Error updating favorite:", error);
    res.status(500).json({ message: "Gagal mengubah status kuliner." });
  }
});

router.delete("/", async (req, res) => {
  try {
    const body = req.body ?? {};

    await prisma.favorite.delete({
      where: { id: Number(body.id) },
    });

    res.json({ message: "Kuliner berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({ message: "Gagal menghapus kuliner." });
  }
});

export default router;