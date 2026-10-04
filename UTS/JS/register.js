import { saveDb } from './db.js';
import { hashPassword } from "./password.js";

export async function register(db, name, email, password) {
    const stmt = db.prepare(`
        INSERT INTO users (name, email, password)
        VALUES (:name, :email, :password);
    `);

    stmt.bind({
        ':name': name,
        ':email': email,
        ':password': await hashPassword(password)
    });

    stmt.step();
    stmt.free();

    await saveDb(db);
    return true;
}