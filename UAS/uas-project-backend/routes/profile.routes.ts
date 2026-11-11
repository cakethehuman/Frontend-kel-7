import { Router } from "express";
import { prisma } from "../lib/prisma";
import { loggedIn } from "../middleware/authentication";

const router = Router();

router.get("/", loggedIn, async (req, res) => {
  try {
    const userIdParam = res.locals.user.user_id;

    const user = await prisma.user.findUnique({
      where: { user_id: userIdParam },
    });


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
      avatar: user.avatar ?? "",
      is_admin: user.is_admin,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Gagal mengambil data profil dari database." });
  }
});

router.patch("/", loggedIn, async (req, res) => {
  try {
    const body = req.body ?? {};
    const userId = res.locals.user.user_id;

    const targetUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!targetUser) {
      res.status(404).json({ message: "User tidak ditemukan." });
      return;
    }

    const namaBaru = body.name ? String(body.name).trim() : targetUser.name;
    if (namaBaru.length < 3) {
      res.status(400).json({ message: "Nama minimal 3 karakter."});
    }

    let avatarBaru = targetUser.avatar;
    if (body.avatar !== undefined) {
      avatarBaru = body.avatar ? String(body.avatar) : null;
    }

    const userUpdate = await prisma.user.update({
      where: { user_id: targetUser.user_id },
      data: {
        role: body.role ? String(body.role).trim() : targetUser.role,
        bio: body.bio !== undefined ? String(body.bio).trim() : targetUser.bio,
        tags: body.tags !== undefined ? String(body.tags) : targetUser.tags,
        avatar: avatarBaru,
      },
    });

    res.json({
      user_id: userUpdate.user_id,
      name: userUpdate.name,
      email: userUpdate.email,
      role: userUpdate.role,
      bio: userUpdate.bio,
      tags: userUpdate.tags,
      avatar: userUpdate.avatar ?? "",
      is_admin: userUpdate.is_admin,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Gagal memperbarui profil." });
  }
});

export default router;
