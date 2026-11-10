import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const userIdParam = Number(req.query.user_id);
    const emailParam = req.query.email ? String(req.query.email) : "";

    let user = null;

    if (userIdParam) {
      user = await prisma.user.findUnique({
        where: { user_id: userIdParam },
      });
    } else if (emailParam) {
      user = await prisma.user.findUnique({
        where: { email: emailParam },
      });
    } else {
      user = await prisma.user.findFirst();
    }

    if (!user) {
      res.status(404).json({ message: "User tidak ditemukan." });
      return;
    }

    res.json({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      tags: user.tags,
      is_admin: user.is_admin,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Gagal mengambil data profil dari database." });
  }
});

router.patch("/", async (req, res) => {
  try {
    const body = req.body ?? {};
    const userId = Number(body.user_id);

    let targetUser = null;
    if (userId) {
      targetUser = await prisma.user.findUnique({
        where: { user_id: userId },
      });
    } else {
      targetUser = await prisma.user.findFirst();
    }

    if (!targetUser) {
      res.status(404).json({ message: "User tidak ditemukan." });
      return;
    }

    const userUpdate = await prisma.user.update({
      where: { user_id: targetUser.user_id },
      data: {
        role: body.role ? String(body.role).trim() : targetUser.role,
        bio: body.bio !== undefined ? String(body.bio).trim() : targetUser.bio,
        tags: body.tags !== undefined ? String(body.tags) : targetUser.tags,
      },
    });

    res.json({
      user_id: userUpdate.user_id,
      name: userUpdate.name,
      email: userUpdate.email,
      role: userUpdate.role,
      bio: userUpdate.bio,
      tags: userUpdate.tags,
      is_admin: userUpdate.is_admin,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Gagal memperbarui profil." });
  }
});

export default router;