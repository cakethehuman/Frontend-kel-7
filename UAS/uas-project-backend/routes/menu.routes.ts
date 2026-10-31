import { Router } from "express";
import { prisma } from '../lib/prisma'

const router = Router();

router.get("/", (_req, res) => {
  const menu = await prisma.Menu.findMany();
  res.json(menu);
});

export default router;

