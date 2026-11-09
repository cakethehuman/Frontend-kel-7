import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/requireAdmin";


const router = Router();

const POLA_KUNCI = /^(home|profile)\.[a-z0-9._-]{1,80}$/;
const POLA_PREFIX = /^[a-z0-9._-]{1,80}$/;
const MAKS_UKURAN = 20000;

function bacaNilai(teks: string): unknown {
  try {
    return JSON.parse(teks);
  } catch {
    return teks;
  }
}

router.get("/", async (req, res) => {
  try {
    const prefix =
      typeof req.query.prefix === "string" ? req.query.prefix : "";

    if (prefix !== "" && !POLA_PREFIX.test(prefix)) {
      res.status(400).json({ message: "Prefix tidak valid." });
      return;
    }

    const rows = await prisma.siteContent.findMany({
      where: prefix ? { key: { startsWith: prefix } } : {},
      orderBy: { key: "asc" },
    });

    const hasil: Record<string, unknown> = {};
    for (const row of rows) {
      hasil[row.key] = bacaNilai(row.value);
    }

    res.json(hasil);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ message: "Gagal mengambil konten." });
  }
});

router.put("/:key", ...requireAdmin, async (req, res) => {
  try {
    const key = String(req.params.key);
    if (!POLA_KUNCI.test(key)) {
      res.status(400).json({
        message: "Kunci tidak valid. Harus diawali home. atau profile.",
      });
      return;
    }

    const value: unknown = req.body?.value;
    if (value === undefined || value === null) {
      res.status(400).json({ message: "Isi (value) wajib dikirim." });
      return;
    }

    if (typeof value === "string" && value.trim() === "") {
      res.status(400).json({ message: "Teks tidak boleh kosong." });
      return;
    }

    const teks = JSON.stringify(value);
    if (teks.length > MAKS_UKURAN) {
      res.status(400).json({ message: "Isi terlalu besar." });
      return;
    }

    const row = await prisma.siteContent.upsert({
      where: { key },
      update: { value: teks },
      create: { key, value: teks },
    });

    res.json({ key: row.key, value: bacaNilai(row.value) });
  } catch (error) {
    console.error("Error saving content:", error);
    res.status(500).json({ message: "Gagal menyimpan konten." });
  }
});

router.delete("/:key", ...requireAdmin, async (req, res) => {
  try {
    const key = String(req.params.key);
    if (!POLA_KUNCI.test(key)) {
      res.status(400).json({ message: "Kunci tidak valid." });
      return;
    }

    await prisma.siteContent.deleteMany({ where: { key } });
    res.json({ message: "Konten dikembalikan ke bawaan." });
  } catch (error) {
    console.error("Error resetting content:", error);
    res.status(500).json({ message: "Gagal mengembalikan konten." });
  }
});

export default router;
