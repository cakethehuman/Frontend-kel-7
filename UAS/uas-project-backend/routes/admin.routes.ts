import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// GET /api/admin/stats - Overview statistics for admin dashboard
router.get("/stats", async (_req, res) => {
  try {
    const [userCount, orderCount, menuCount, orders] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.menu.count(),
      prisma.order.findMany({
        orderBy: { order_id: "desc" },
        take: 5,
        include: {
          order_items: {
            include: {
              menu: true,
            },
          },
        },
      }),
    ]);

    const allOrders = await prisma.order.findMany({
      select: { total: true, status: true },
    });

    const totalRevenue = allOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    const recentOrders = orders.map((o) => ({
      id: o.order_id,
      order_number: "MB-" + String(o.order_id).padStart(4, "0"),
      customer: o.customer_name,
      total: o.total,
      status: o.status,
      created_at: o.created_at,
      item_count: o.order_items.reduce((sum, it) => sum + it.quantity, 0),
    }));

    res.json({
      user_count: userCount,
      order_count: orderCount,
      menu_count: menuCount,
      total_revenue: totalRevenue,
      recent_orders: recentOrders,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Gagal mengambil data statistik admin." });
  }
});

export default router;
