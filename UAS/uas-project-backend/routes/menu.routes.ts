import { Router } from "express";
import { prisma } from '../lib/prisma'

const router = Router();

router.get("/", async (_req, res) => {
  const menu = await prisma.menu.findMany();
  res.json(menu);
});

router.post("/", async (req, res) => {
  try {
    const { name, description, item_type, price, image } = req.body;

    const menu = await prisma.menu.create({
      data: {
        name,
        description,
        item_type,
        price: Number(price),
        image,
      },
    });

    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ message: "Failed to create menu" });
  }
});

router.get("/type/:type", async (req, res) => {
  try {
    const menu = await prisma.menu.findMany({
      where: {
        item_type: req.params.type,
      },
    });

    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menus" });
  }
});
export default router;

