import type { NextFunction, Request, Response } from "express";
import { loggedIn } from "./authentication";

export const requireAdmin = [
  loggedIn,
  (_req: Request, res: Response, next: NextFunction) => {
    if (res.locals.user.is_admin !== 1) {
      res.status(403).json({ message: "Akses ditolak!" });
      return;
    }
    next();
  },
];
