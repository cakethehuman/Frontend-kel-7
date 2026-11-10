import type { NextFunction, Request, Response } from "express";
import { loggedIn } from "./authentication";

// AUTHORIZATION: sudah login DAN is_admin === 1.
// Berupa array, tapi Express menerima array middleware langsung,
// jadi bisa dipakai sebagai: router.post("/", requireAdmin, handler)
export const requireAdmin = [
  loggedIn,
  (_req: Request, res: Response, next: NextFunction) => {
    if (res.locals.user?.is_admin !== 1) {
      res.status(403).json({ message: "Akses ditolak: hanya untuk administrator." });
      return;
    }
    next();
  },
];
