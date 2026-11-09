import type { NextFunction, Request, Response } from "express";
import { prisma } from "./prisma";

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number(req.headers["x-user-id"]);

    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(401).json({ message: "Login sebagai admin diperlukan." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user || user.is_admin !== 1) {
      res
        .status(403)
        .json({ message: "Akses ditolak: hanya untuk administrator." });
      return;
    }

    next();
  } catch (error) {
    console.error("Error requireAdmin:", error);
    res.status(500).json({ message: "Gagal memeriksa hak akses." });
  }
}
