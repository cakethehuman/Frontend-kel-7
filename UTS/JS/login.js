export function login(db, email, password){
    const stmt = db.prepare(`
        SELECT name, email, is_admin
        FROM users
        WHERE email = :email AND password = :password
    `);
    stmt.bind({ ':email': email, ':password': password });
        
    
    let user = null;
    if (stmt.step()) {
        user = stmt.getAsObject();
        console.log("Data User Ditemukan:");
    }
    stmt.free();

    return user; 
}

