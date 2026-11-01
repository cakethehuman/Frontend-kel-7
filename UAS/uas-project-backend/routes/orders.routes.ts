import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

const TAX_RATE = 0.1;
const DAFTAR_TIPE = ["dinein", "takeaway"];
const DAFTAR_PEMBAYARAN = ["Cash", "QRIS", "Transfer"];

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
        const slug = String(daftarItem[i]?.id ?? "");
        const jumlah = Number(daftarItem[i]?.qty);

        if (!slug || !Number.isInteger(jumlah) || jumlah < 1 || jumlah > 99) {
            res.status(400).json({ message: "Ada Item Pesanan Yang Tidak Valid." });
            return;
        }

        jumlahPerSlug[slug] = (jumlahPerSlug[slug] ?? 0) + jumlah;
    }

    const daftarSlug = Object.keys(jumlahPerSlug);
    const menus = await prisma.menu.findMany({
        where: { slug: { in: daftarSlug } },
    });

    if (menus.length !== daftarSlug.length) {
        const ditemukan = menus.map((menu) => menu.slug);
        const hilang = daftarSlug.filter((slug) => !ditemukan.includes(slug));
        res.status(400).json({
            message: "Menu Tidak Ditemukan Di Database: " + hilang.join(", ") + ". Sudah Menjalankan Seed?",
        });
        return;
    }

    let subtotal = 0;
    const baris = menus.map((menu) => {
        const jumlah = jumlahPerSlug[menu.slug as string] ?? 0;
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
});

export default router;
