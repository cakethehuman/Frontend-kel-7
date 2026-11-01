import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const userId = Number(req.query.user_id || req.headers["x-user-id"]);

    let user = null;
    if (Number.isInteger(userId) && userId > 0) {
      user = await prisma.user.findUnique({
        where: { user_id: userId },
      });
    }

    if (!user) {
      user = await prisma.user.findFirst();
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Wilson Widodo",
          email: "wilson@gmail.com",
          password: "user123",
          is_admin: 0,
          total_balance: 0,
          role: "Student & Programmer",
          bio: "I am an Informatics Engineering student from Belitung, and I currently run tutoring classes in Python programming, piano, basketball, and taekwondo.",
          tags: "Animlovers, Untarian, Soushin",
        },
      });
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

    if (!body.name || !body.role) {
      res.status(400).json({ message: "Nama dan Role Wajib Diisi." });
      return;
    }

    const userId = Number(body.user_id || req.headers["x-user-id"]);
    let targetId = userId;

    if (!Number.isInteger(targetId) || targetId <= 0) {
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) {
        res.status(400).json({ message: "User Tidak Ditemukan." });
        return;
      }
      targetId = firstUser.user_id;
    }

    const userUpdate = await prisma.user.update({
      where: { user_id: targetId },
      data: {
        name: String(body.name).trim(),
        role: String(body.role).trim(),
        bio: String(body.bio ?? "").trim(),
        tags: String(body.tags ?? "").trim(),
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
    res.status(500).json({ message: "Gagal memperbarui profil pengguna." });
  }
});

export default router;