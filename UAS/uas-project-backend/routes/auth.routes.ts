import { Router } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/auth";
import { COOKIE_NAME, cookieOptions, signAccessToken } from "../lib/jwt";
import { loggedIn } from "../middleware/authentication";
import { buatOtp, hashOtp, otpCocok } from "../lib/otp";
import { kirimEmail } from "../lib/mailer";


const router = Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_DURATION_IN_MINUTE = 10;
const DELAY_BEFORE_NEXT_OTP_IN_SECONDS = 60;
const MAX_ATTEMPTS = 5;


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

    res.cookie(
      COOKIE_NAME,
      signAccessToken({
        user_id: user.user_id,
        is_admin: user.is_admin,
      }),
      cookieOptions
    );

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

router.get("/me", loggedIn, async (req, res) => {
  try {

    const user = await prisma.user.findUnique({
      where: { user_id: res.locals.user.user_id },
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

router.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.json({ message: "Logout berhasil" });
});

router.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();

    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ message: "Format email tidak valid." });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const terakhir = await prisma.passwordReset.findFirst({
        where: { user_id: user.user_id },
        orderBy: { created_at: "desc" },
      });

      const bolehKirim =
        !terakhir ||
        Date.now() - terakhir.created_at.getTime() > DELAY_BEFORE_NEXT_OTP_IN_SECONDS * 1000;

      if (bolehKirim) {
        const otp = buatOtp();

        // kode lama dihapus, hanya kode terbaru yang berlaku
        await prisma.$transaction([
          prisma.passwordReset.deleteMany({ where: { user_id: user.user_id } }),
          prisma.passwordReset.create({
            data: {
              user_id: user.user_id,
              otp_hash: hashOtp(user.user_id, otp),
              expires_at: new Date(Date.now() + OTP_DURATION_IN_MINUTE * 60_000),
            },
          }),
        ]);

        try {
          await kirimEmail(
            user.email,
            "Kode reset password",
            `Halo ${user.name},\n\n` +
            `Kode verifikasi untuk mereset password kamu:\n\n${otp}\n\n` +
            `Kode berlaku ${OTP_DURATION_IN_MINUTE} menit. Jangan bagikan kode ini ke siapa pun.\n` +
            `Jika kamu tidak meminta reset password, abaikan email ini.`,
          );
        } catch (error) {
          // dicatat di server saja, respons ke client tetap sama
          console.error("Gagal mengirim email reset password:", error);
        }
      }
    }

    res.json({
      message:
        "Jika email terdaftar, kode verifikasi sudah dikirim. Cek kotak masuk dan folder spam.",
    });
  } catch (error) {
    console.error("Error forgot-password:", error);
    res.status(500).json({ message: "Terjadi kesalahan server. Coba lagi nanti." });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const otp = String(req.body?.otp ?? "").trim();
    const passwordBaru = String(req.body?.new_password ?? "");

    if (!EMAIL_REGEX.test(email) || !/^\d{6}$/.test(otp)) {
      res.status(400).json({ message: "Kode verifikasi harus 6 digit angka." });
      return;
    }

    if (passwordBaru.length < 6) {
      res.status(400).json({ message: "Password minimal 6 karakter demi keamanan." });
      return;
    }

    // satu pesan untuk semua kegagalan, supaya tidak membocorkan apa pun
    const GAGAL = { message: "Kode salah atau sudah kedaluwarsa. Silakan minta kode baru." };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json(GAGAL);
      return;
    }

    const reset = await prisma.passwordReset.findFirst({
      where: { user_id: user.user_id },
      orderBy: { created_at: "desc" },
    });

    if (!reset || reset.expires_at.getTime() < Date.now()) {
      res.status(400).json(GAGAL);
      return;
    }

    // hitung percobaan lebih dulu (atomik), sehingga batas 5x tidak bisa dilewati
    // dengan mengirim banyak tebakan sekaligus
    const percobaan = await prisma.passwordReset.updateMany({
      where: { id: reset.id, attempts: { lt: MAX_ATTEMPTS } },
      data: { attempts: { increment: 1 } },
    });

    if (percobaan.count === 0 || !otpCocok(user.user_id, otp, reset.otp_hash)) {
      res.status(400).json(GAGAL);
      return;
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { user_id: user.user_id },
        data: { password: hashPassword(passwordBaru) },
      }),
      prisma.passwordReset.deleteMany({ where: { user_id: user.user_id } }),
    ]);

    res.json({ message: "Password berhasil diubah. Silakan login dengan password baru." });
  } catch (error) {
    console.error("Error reset-password:", error);
    res.status(500).json({ message: "Terjadi kesalahan server. Coba lagi nanti." });
  }
});


export default router;
