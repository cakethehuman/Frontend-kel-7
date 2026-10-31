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

router.get ("/", async (_req, res) => {
    const jumlah = await prisma.favorite.count();

    if(jumlah === 0){
        await prisma.favorite.createMany({
            data: DATA_KULINER_AWAL,
        });
    }

    const favorites = await prisma.favorite.findMany({
        orderBy: { id: "asc"}
    });

    res.json(favorites);
});

router.post("/", async (req, res) => {
    const body = req.body;

    if (!body.name || !body.region) {
        res.status(400).json({ message: "Nama Kuliner dan Wilayah Wajib Diisi"});
        return;
    }

    const itemBaru = await prisma.favorite.create({
        data: {
            name: body.name.trim(),
            region: body.region.trim(),
            done: false,
        },
    });

    res.status(201).json(itemBaru);
});

router.patch("/", async (req, res) => {
    const body = req.body;

    const itemUpdate = await prisma.favorite.update({
        where: { id: Number(body.id) },
        data: { done: Boolean(body.done) },
    });

    res.json(itemUpdate);
});

router.delete("/", async (req, res) => {
    const body = req.body;

    await prisma.favorite.delete({
        where: { id: Number(body.id) },
    });

    res.json({ message: "Kuliner Berhasil Dihapus."});
});

export default router;