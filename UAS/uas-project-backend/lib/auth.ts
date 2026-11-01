import crypto from "crypto";

/**
 * Hashes a password using a randomly generated 16-byte cryptographic salt and scrypt.
 * Format returned: <salt_hex>:<hash_hex>
 */
export function hashPassword(password: string): string {
  try {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Gagal mengamankan password");
  }
}

/**
 * Verifies a password against a stored salted hash using constant-time comparison.
 * Also supports legacy plaintext comparison safely if migrating.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (!storedHash || !password) {
      return false;
    }

    if (storedHash.includes(":")) {
      const [salt, key] = storedHash.split(":");
      if (!salt || !key) return false;
      const keyBuffer = Buffer.from(key, "hex");
      const derivedKey = crypto.scryptSync(password, salt, 64);
      if (keyBuffer.length !== derivedKey.length) {
        return false;
      }
      return crypto.timingSafeEqual(keyBuffer, derivedKey);
    }

    // Fallback for legacy plain-text passwords
    return password === storedHash;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}
