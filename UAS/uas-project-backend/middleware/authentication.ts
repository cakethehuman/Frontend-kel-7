import type { NextFunction, Request, Response } from "express";
import { COOKIE_NAME, verifyAccessToken } from "../lib/jwt";

// AUTHENTICATION: memastikan request datang dari user yang sudah login
export function loggedIn(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    res.status(401).json({ message: "Silakan login terlebih dahulu." });
    return;
  }

  try {
    res.locals.user = verifyAccessToken(token); // { user_id, is_admin }
    next();
  } catch {
    res.status(401).json({ message: "Sesi tidak valid atau sudah kedaluwarsa." });
  }
}
