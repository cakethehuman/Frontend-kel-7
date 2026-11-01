import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

const TAX_RATE = 0.1;
const DAFTAR_TIPE = ["dinein", "takeaway"];
const DAFTAR_PEMBAYARAN = ["Cash", "QRIS", "Transfer"];
const DAFTAR_STATUS = ["pending", "cooking", "done", "cancelled"];

// GET /api/orders - Fetch all orders (for admin dashboard and orders page)
router.get("/", async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { order_id: "desc" },
      include: {
        order_items: {
          include: {
            menu: true,
          },
        },
      },
    });

    const formatted = orders.map((o) => ({
      id: o.order_id,
      order_id: o.order_id,
      order_number: "MB-" + String(o.order_id).padStart(4, "0"),
      customer: o.customer_name,
      customer_name: o.customer_name,
      phone: o.phone,
      type: o.order_type,
      table: o.table_number,
      payment: o.payment_method,
      note: o.note,
      total: o.total,
      status: o.status,
      created_at: o.created_at,
      items: o.order_items.map((oi) => ({
        menu_id: oi.menu_id,
        name: oi.menu?.name ?? `Item #${oi.menu_id}`,
        quantity: oi.quantity,
        price: oi.price_at_purchase,
      })),
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Gagal mengambil daftar pesanan dari database." });
  }
});

// PATCH /api/orders/:id - Update order status (pending, cooking, done, cancelled)
router.patch("/:id", async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body ?? {};

    if (!Number.isInteger(orderId)) {
      res.status(400).json({ message: "ID pesanan tidak valid." });
      return;
    }

    if (!status || !DAFTAR_STATUS.includes(status)) {
      res.status(400).json({
        message: `Status tidak valid. Pilihan: ${DAFTAR_STATUS.join(", ")}`,
      });
      return;
    }

    const updated = await prisma.order.update({
      where: { order_id: orderId },
      data: { status },
    });

    res.json({
      message: "Status pesanan berhasil diperbarui.",
      order: updated,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Gagal memperbarui status pesanan." });
  }
});

// POST /api/orders - Create new order
router.post("/", async (req, res) => {
  try {
    const body = req.body ?? {};

    const user = await prisma.user.findUnique({
      where: { user_id: Number(body.user_id) },
    });

    if (!user) {
      res.status(401).json({ message: "Kamu Harus Login Dulu." });
      return;
    }

    const nama = String(body.name ?? "").trim();
    const noHp = String(body.phone ?? "").trim();
    const tipe = String(body.type ?? "");
    const pembayaran = String(body.payment ?? "");
    const catatan = String(body.note ?? "").trim();
    const meja = Number(body.table);
    const daftarItem = Array.isArray(body.items) ? body.items : [];
    const jumlahDigit = noHp.replace(/\D/g, "").length;

    if (nama.length < 3) {
      res.status(400).json({ message: "Nama Minimal 3 Karakter." });
      return;
    }

    if (jumlahDigit < 9 || jumlahDigit > 15) {
      res.status(400).json({ message: "Nomor WhatsApp Tidak Valid." });
      return;
    }

    if (!DAFTAR_TIPE.includes(tipe)) {
      res.status(400).json({ message: "Tipe Pesanan Tidak Dikenal." });
      return;
    }

    if (!DAFTAR_PEMBAYARAN.includes(pembayaran)) {
      res.status(400).json({ message: "Metode Pembayaran Tidak Dikenal." });
      return;
    }

    if (tipe === "dinein" && (!Number.isInteger(meja) || meja < 1 || meja > 99)) {
      res.status(400).json({ message: "Nomor Meja Harus 1 Sampai 99." });
      return;
    }

    if (daftarItem.length === 0) {
      res.status(400).json({ message: "Pesanan Kosong." });
      return;
    }

    const jumlahPerSlug: Record<string, number> = {};
    for (let i = 0; i < daftarItem.length; i++) {
      const slugOrId = String(daftarItem[i]?.id ?? "");
      const jumlah = Number(daftarItem[i]?.qty);

      if (!slugOrId || !Number.isInteger(jumlah) || jumlah < 1 || jumlah > 99) {
        res.status(400).json({ message: "Ada Item Pesanan Yang Tidak Valid." });
        return;
      }

      jumlahPerSlug[slugOrId] = (jumlahPerSlug[slugOrId] ?? 0) + jumlah;
    }

    const daftarKeys = Object.keys(jumlahPerSlug);
    // Find menus matching either slug or menu_id
    const menus = await prisma.menu.findMany({
      where: {
        OR: [
          { slug: { in: daftarKeys } },
          { menu_id: { in: daftarKeys.map((k) => Number(k)).filter((n) => Number.isInteger(n) && n > 0) } },
        ],
      },
    });

    if (menus.length === 0) {
      res.status(400).json({
        message: "Menu tidak ditemukan di database. Pastikan seed sudah dijalankan.",
      });
      return;
    }

    let subtotal = 0;
    const baris = menus.map((menu) => {
      const key = menu.slug && jumlahPerSlug[menu.slug] !== undefined ? menu.slug : String(menu.menu_id);
      const jumlah = jumlahPerSlug[key] ?? 1;
      subtotal += menu.price * jumlah;
      return {
        menu_id: menu.menu_id,
        quantity: jumlah,
        price_at_purchase: menu.price,
      };
    });

    const pajak = Math.round(subtotal * TAX_RATE);
    const total = subtotal + pajak;

    const orderBaru = await prisma.order.create({
      data: {
        user_id: user.user_id,
        customer_name: nama,
        phone: noHp,
        order_type: tipe,
        table_number: tipe === "dinein" ? meja : null,
        payment_method: pembayaran,
        note: catatan || null,
        tax_rate: TAX_RATE,
        total: total,
        status: "pending",
        order_items: { create: baris },
      },
    });

    res.status(201).json({
      order_id: orderBaru.order_id,
      order_number: "MB-" + String(orderBaru.order_id).padStart(4, "0"),
      subtotal: subtotal,
      tax: pajak,
      total: total,
      status: orderBaru.status,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Terjadi kesalahan server saat memproses pesanan." });
  }
});

export default router;
