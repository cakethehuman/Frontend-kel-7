import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

function formatMenuItem(item: {
  menu_id: number;
  name: string;
  description: string | null;
  item_type: string | null;
  price: number;
  image: string;
  slug: string | null;
}) {
  return {
    ...item,
    id: item.slug || String(item.menu_id),
    img: item.image,
    category: item.item_type || "Others",
  };
}

router.get("/", async (_req, res) => {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: { menu_id: "asc" },
    });
    res.json(menus.map(formatMenuItem));
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ message: "Gagal mengambil data menu dari database" });
  }
});

router.get("/type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const menus = await prisma.menu.findMany({
      where: {
        item_type: {
          equals: type,
        },
      },
      orderBy: { menu_id: "asc" },
    });
    res.json(menus.map(formatMenuItem));
  } catch (error) {
    console.error("Error fetching menu by type:", error);
    res.status(500).json({ message: "Failed to fetch menus" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const numId = Number(id);

    const menu = await prisma.menu.findFirst({
      where: Number.isInteger(numId)
        ? { OR: [{ menu_id: numId }, { slug: id }] }
        : { slug: id },
    });

    if (!menu) {
      res.status(404).json({ message: "Menu tidak ditemukan" });
      return;
    }

    res.json(formatMenuItem(menu));
  } catch (error) {
    console.error("Error fetching menu by id:", error);
    res.status(500).json({ message: "Failed to fetch menu" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description, item_type, category, price, image, img, slug } = req.body;

    const chosenType = item_type || category || "Others";
    const chosenImage = image || img || "/IMG/mie_belitung.webp";
    const generatedSlug =
      slug ||
      String(name ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const menu = await prisma.menu.create({
      data: {
        name,
        description: description || null,
        item_type: chosenType,
        price: Number(price) || 0,
        image: chosenImage,
        slug: generatedSlug,
      },
    });

    res.status(201).json(formatMenuItem(menu));
  } catch (error) {
    console.error("Failed to create menu:", error);
    res.status(500).json({ message: "Failed to create menu" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, item_type, category, price, image, img, slug } = req.body;

    const updated = await prisma.menu.update({
      where: { menu_id: id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(item_type !== undefined || category !== undefined
          ? { item_type: item_type || category }
          : {}),
        ...(price !== undefined && { price: Number(price) }),
        ...(image !== undefined || img !== undefined ? { image: image || img } : {}),
        ...(slug !== undefined && { slug }),
      },
    });

    res.json(formatMenuItem(updated));
  } catch (error) {
    console.error("Failed to update menu:", error);
    res.status(500).json({ message: "Failed to update menu" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.menu.delete({
      where: { menu_id: id },
    });
    res.json({ message: "Menu berhasil dihapus" });
  } catch (error) {
    console.error("Failed to delete menu:", error);
    res.status(500).json({ message: "Failed to delete menu" });
  }
});

export default router;
