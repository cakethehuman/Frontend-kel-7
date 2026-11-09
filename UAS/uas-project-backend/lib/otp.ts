import "dotenv/config";
import { createHmac, randomInt, timingSafeEqual } from "crypto";

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error("JWT_SECRET belum diatur. Isi di file .env atau di docker-compose.yml.");
}
const KUNCI: string = SECRET;

// 6 digit acak yang aman secara kriptografis (bukan Math.random)
export function buatOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashOtp(userId: number, otp: string): string {
  return createHmac("sha256", KUNCI).update(`${userId}:${otp}`).digest("hex");
}

// Perbandingan waktu-konstan agar tidak bisa ditebak dari lamanya respons
export function otpCocok(userId: number, otp: string, hashTersimpan: string): boolean {
  const a = Buffer.from(hashOtp(userId, otp), "hex");
  const b = Buffer.from(hashTersimpan, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
