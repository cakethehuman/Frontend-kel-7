import type { NextFunction, Request, Response } from "express";
import { COOKIE_NAME, verifyAccessToken } from "../lib/jwt";

export function loggedIn(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    res.status(401).json({ message: "Silahkan login terlebih dahulu." });
    return;
  }

  try {
    res.locals.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Sesi tidak valid atau sudah kedaluwarsa" });
  }
}
