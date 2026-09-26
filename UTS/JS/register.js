import { saveDb } from './db.js'

export async function register(db, name, email, password) {
    const stmt = db.prepare(`
        INSERT INTO users (name, email, password)
        VALUES (:name, :email, :password);
    `);

    stmt.bind({':name': name, ':email': email, ':password': password});

    stmt.step();
    await saveDb(db);
    stmt.free();
    return true
    
}