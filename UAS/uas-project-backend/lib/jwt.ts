import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
export const COOKIE_NAME = "token";
if (!JWT_SECRET) {
  throw new Error("Please set your JWT_SECRET on the .env file!");
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
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
  jwt.verify(token, JWT_SECRET) as AuthPayload;

