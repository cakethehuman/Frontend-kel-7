import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res) => {
    let user = await prisma.user.findFirst();

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: "Wilson Widodo",
                email: "wilson@gmail.com",
                password: "12345",
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
    });
})

router.patch("/", async (req, res) => {
    const body = req.body;

    if (!body.name || !body.role) {
        res.status(400).json({ message: "Nama dan Role Wajib Diisi."});
        return;
    }

    const userPertama = await prisma.user.findFirst();

    if (!userPertama) {
        res.status(400).json({ message: "User Tidak Ditemukan."});
        return;
    }

    const userUpdate = await prisma.user.update({
        where: { user_id: userPertama.user_id },
        data: {
            name: body.name.trim(),
            role: body.role.trim(),
            bio: body.bio.trim(),
            tags: body.tags.trim(),
        },
    });

    res.json({
        user_id: userUpdate.user_id,
        name: userUpdate.name,
        email: userUpdate.email,
        role: userUpdate.role,
        bio: userUpdate.bio,
        tags: userUpdate.tags,
    });
});

export default router;