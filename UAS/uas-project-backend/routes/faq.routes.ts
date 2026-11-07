import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../lib/requireAdmin";

const router = Router();

const MIN_PERTANYAAN = 5;
const MAKS_PERTANYAAN = 200;
const MIN_JAWABAN = 5;
const MAKS_JAWABAN = 1000;

type InputFaq =
  | { ok: true; question: string; answer: string }
  | { ok: false; message: string };

function formatFaq(faq: {
  faq_id: number;
  question: string;
  answer: string;
  sort_order: number;
}) {
  return {
    id: faq.faq_id,
    question: faq.question,
    answer: faq.answer,
    sort_order: faq.sort_order,
  };
}

function bacaInput(body: Record<string, unknown>): InputFaq {
  const question = String(body.question ?? "").trim();
  const answer = String(body.answer ?? "").trim();

  if (question.length < MIN_PERTANYAAN || question.length > MAKS_PERTANYAAN) {
    return {
      ok: false,
      message: `Pertanyaan harus ${MIN_PERTANYAAN} sampai ${MAKS_PERTANYAAN} karakter.`,
    };
  }

  if (answer.length < MIN_JAWABAN || answer.length > MAKS_JAWABAN) {
    return {
      ok: false,
      message: `Jawaban harus ${MIN_JAWABAN} sampai ${MAKS_JAWABAN} karakter.`,
    };
  }

  return { ok: true, question, answer };
}

router.get("/", async (_req, res) => {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: [{ sort_order: "asc" }, { faq_id: "asc" }],
    });
    res.json(faqs.map(formatFaq));
  } catch (error) {
    console.error("Error fetching faqs:", error);
    res.status(500).json({ message: "Gagal mengambil data FAQ." });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const input = bacaInput(req.body ?? {});
    if (!input.ok) {
      res.status(400).json({ message: input.message });
      return;
    }

    const terakhir = await prisma.faq.findFirst({
      orderBy: { sort_order: "desc" },
    });

    const faq = await prisma.faq.create({
      data: {
        question: input.question,
        answer: input.answer,
        sort_order: (terakhir?.sort_order ?? 0) + 1,
      },
    });

    res.status(201).json(formatFaq(faq));
  } catch (error) {
    console.error("Error creating faq:", error);
    res.status(500).json({ message: "Gagal menambah FAQ." });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ message: "ID FAQ tidak valid." });
      return;
    }

    const input = bacaInput(req.body ?? {});
    if (!input.ok) {
      res.status(400).json({ message: input.message });
      return;
    }

    const ada = await prisma.faq.findUnique({ where: { faq_id: id } });
    if (!ada) {
      res.status(404).json({ message: "FAQ tidak ditemukan." });
      return;
    }

    const data: { question: string; answer: string; sort_order?: number } = {
      question: input.question,
      answer: input.answer,
    };

    const urutan = Number(req.body?.sort_order);
    if (req.body?.sort_order !== undefined && Number.isInteger(urutan)) {
      data.sort_order = urutan;
    }

    const updated = await prisma.faq.update({
      where: { faq_id: id },
      data,
    });

    res.json(formatFaq(updated));
  } catch (error) {
    console.error("Error updating faq:", error);
    res.status(500).json({ message: "Gagal memperbarui FAQ." });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ message: "ID FAQ tidak valid." });
      return;
    }

    const ada = await prisma.faq.findUnique({ where: { faq_id: id } });
    if (!ada) {
      res.status(404).json({ message: "FAQ tidak ditemukan." });
      return;
    }

    await prisma.faq.delete({ where: { faq_id: id } });
    res.json({ message: "FAQ berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting faq:", error);
    res.status(500).json({ message: "Gagal menghapus FAQ." });
  }
});

export default router;
