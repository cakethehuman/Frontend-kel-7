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

router.get("/", async (_req, res) => {
  try {
    const jumlah = await prisma.favorite.count();

    if (jumlah === 0) {
      await prisma.favorite.createMany({
        data: DATA_KULINER_AWAL,
      });
    }

    const favorites = await prisma.favorite.findMany({
      orderBy: { id: "asc" },
    });

    res.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Gagal mengambil daftar kuliner favorit." });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body ?? {};

    if (!body.name || !body.region) {
      res.status(400).json({ message: "Nama Kuliner dan Wilayah Wajib Diisi." });
      return;
    }

    const itemBaru = await prisma.favorite.create({
      data: {
        name: String(body.name).trim(),
        region: String(body.region).trim(),
        done: false,
      },
    });

    res.status(201).json(itemBaru);
  } catch (error) {
    console.error("Error creating favorite:", error);
    res.status(500).json({ message: "Gagal menambahkan kuliner favorit." });
  }
});

router.patch("/", async (req, res) => {
  try {
    const body = req.body ?? {};
    const id = Number(body.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({ message: "ID kuliner tidak valid." });
      return;
    }

    const itemUpdate = await prisma.favorite.update({
      where: { id },
      data: { done: Boolean(body.done) },
    });

    res.json(itemUpdate);
  } catch (error) {
    console.error("Error updating favorite:", error);
    res.status(500).json({ message: "Gagal memperbarui kuliner favorit." });
  }
});

router.delete("/", async (req, res) => {
  try {
    const body = req.body ?? {};
    const id = Number(body.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({ message: "ID kuliner tidak valid." });
      return;
    }

    await prisma.favorite.delete({
      where: { id },
    });

    res.json({ message: "Kuliner Berhasil Dihapus." });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({ message: "Gagal menghapus kuliner favorit." });
  }
});

export default router;