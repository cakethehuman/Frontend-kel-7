import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET belum diatur di file .env / environment Vercel.");
}

export const COOKIE_NAME = "token";

const isProd = process.env.NODE_ENV === "production";

// Di Vercel frontend & backend biasanya beda domain (cross-site),
// jadi di production wajib sameSite "none" + secure.
// Di localhost cukup "lax".
export const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export type AuthPayload = {
  user_id: number;
  is_admin: number;
};

export const signAccessToken = (payload: AuthPayload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

export const verifyAccessToken = (token: string) =>

