import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { user_id: "asc" },
      select: {
        user_id: true,
        name: true,
        email: true,
        is_admin: true,
        role: true,
        bio: true,
        tags: true,
        orders: {
          select: {
            order_id: true,
            total: true,
          },
        },
      },
    });

    const mapped = users.map((u) => ({
      id: u.user_id,
      user_id: u.user_id,
      name: u.name,
      email: u.email,
      role: u.is_admin === 1 ? "admin" : "user",
      role_title: u.role,
      is_admin: u.is_admin,
      total_orders: u.orders.length,
      total_spent: u.orders.reduce((sum, o) => sum + o.total, 0),
    }));

    res.json(mapped);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Gagal mengambil data user dari database." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId)) {
      res.status(400).json({ message: "ID user tidak valid." });
      return;
    }

    const targetUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!targetUser) {
      res.status(404).json({ message: "User tidak ditemukan." });
      return;
    }

    if (targetUser.is_admin === 1) {
      res.status(403).json({ message: "Tidak dapat menghapus akun administrator!" });
      return;
    }

    await prisma.cartItem.deleteMany({
      where: { cart: { user_id: userId } },
    });
    await prisma.cart.deleteMany({
      where: { user_id: userId },
    });
    await prisma.feedback.deleteMany({
      where: { user_id: userId },
    });
    await prisma.orderItem.deleteMany({
      where: { order: { user_id: userId } },
    });
    await prisma.order.deleteMany({
      where: { user_id: userId },
    });

    await prisma.user.delete({
      where: { user_id: userId },
    });

    res.json({ message: "User berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Gagal menghapus user dari database." });
  }
});

export default router;
