export function login(db, email, password){
    db.run(`INSERT INTO users (name, email, password) VALUES ('Test User', 'john@gmail.com', 'Password')`);
    console.log("Done")
    const stmt = db.prepare(`
        SELECT name, email, is_admin
        FROM users
        WHERE email = :email AND password = :password
    `);

    stmt.bind({ ':email': email, ':password': password });

    let user = null;
    if (stmt.step()) {
        user = stmt.getAsObject();
    }
    stmt.free();

    return user; 
}

