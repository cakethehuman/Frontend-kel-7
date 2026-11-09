import { Router } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/auth";

const router = Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    const cleanEmail = String(email ?? "").trim().toLowerCase();
    const cleanPassword = String(password ?? "");

    if (!cleanEmail || !cleanPassword) {
      res.status(400).json({ message: "Email dan password wajib diisi." });
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      res.status(400).json({ message: "Format email tidak valid." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      res.status(401).json({ message: "Email atau password salah." });
      return;
    }

    const isValid = verifyPassword(cleanPassword, user.password);
    if (!isValid) {
      res.status(401).json({ message: "Email atau password salah." });
      return;
    }

    res.json({
      message: "Login berhasil",
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        role: user.role,
        bio: user.bio,
        tags: user.tags,
      },
    });
  } catch (error) {
    console.error("Error saat login:", error);
    res.status(500).json({ message: "Terjadi kesalahan server saat memproses login." });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};

    const cleanName = String(name ?? "").trim();
    const cleanEmail = String(email ?? "").trim().toLowerCase();
    const cleanPassword = String(password ?? "");

    if (cleanName.length < 3) {
      res.status(400).json({ message: "Nama minimal 3 karakter." });
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      res.status(400).json({ message: "Format email tidak valid." });
      return;
    }

    if (cleanPassword.length < 6) {
      res.status(400).json({ message: "Password minimal 6 karakter demi keamanan." });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      res.status(409).json({ message: "Email ini sudah terdaftar. Silakan login." });
      return;
    }

    const saltedPassword = hashPassword(cleanPassword);

    const newUser = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: saltedPassword,
        is_admin: 0,
        role: "Pelanggan",
        bio: `Halo, saya ${cleanName}! Pecinta kuliner Mie Belitung.`,
        tags: "Kuliner,MieBelitung",
      },
    });

    res.status(201).json({
      message: "Registrasi akun berhasil.",
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        is_admin: newUser.is_admin,
        role: newUser.role,
        bio: newUser.bio,
        tags: newUser.tags,
      },
    });
  } catch (error) {
    console.error("Error saat registrasi:", error);
    res.status(500).json({ message: "Terjadi kesalahan server saat memproses registrasi." });
  }
});

router.get("/me", async (req, res) => {
  try {
    const userIdHeader = req.headers["x-user-id"];
    const userId = Number(userIdHeader);

    if (!userId || !Number.isInteger(userId)) {
      res.status(401).json({ message: "Sesi tidak valid atau belum login." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User tidak ditemukan." });
      return;
    }

    res.json({
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        role: user.role,
        bio: user.bio,
        tags: user.tags,
      },
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Gagal memeriksa sesi pengguna." });
  }
});

export default router;
