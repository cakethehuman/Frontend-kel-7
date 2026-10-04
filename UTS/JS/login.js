import { passwordMatched } from "./password.js";

export async function login(db, email, password) {
    const stmt = db.prepare(`
        SELECT name, email, password, is_admin
        FROM users
        WHERE email = :email
    `);

    stmt.bind({ ':email': email });

    let user = null;
    if (stmt.step()) {
        user = stmt.getAsObject();
    }
    stmt.free();

    if (!user) return null;

    const match = await passwordMatched(password, user.password);
    if (!match) return null;

    delete user.password;
    return user;
}
