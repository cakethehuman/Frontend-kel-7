const bcrypt = window.bcrypt;

/**
 * Hash a plain text password
 * @param {string} password - The password to be hashed
 * @returns {string}
 */
export async function hashPassword(password) {
  const saltRounds = 12; // untuk salt jadinya tiap kali hash password ada salt + hash, agar susah dicrack

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });

  return hashedPassword;
}

/**
 * Compares a plain text password and its hashed to determine its equality
 * Mainly use for comparing login credentials
 * @param {string} password - A plain text password
 * @param {string} hashedPassword - A hashed password
 * @returns {boolean}
 */
export async function passwordMatched(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

