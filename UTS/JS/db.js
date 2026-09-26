const DB_NAME = 'db';
const STORE_NAME = 'sqlite-file';
const DB_KEY = 'main';

function openIndexedDb() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
            req.result.createObjectStore(STORE_NAME);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function loadDbBytes() {
    const idb = await openIndexedDb();
    return new Promise((resolve, reject) => {
        const tx = idb.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(DB_KEY);
        req.onsuccess = () => resolve(req.result || null); 
        req.onerror = () => reject(req.error);
    });
}

async function saveDbBytes(bytes) {
    const idb = await openIndexedDb();
    return new Promise((resolve, reject) => {
        const tx = idb.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(bytes, DB_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function saveDb(db) {
    const bytes = db.export();
    await saveDbBytes(bytes);
}

function createSchema(db) {
    db.run(`
        CREATE TABLE users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            is_admin INTEGER NOT NULL DEFAULT 0,
            total_balance REAL NOT NULL DEFAULT 0
        );

        CREATE TABLE store (
            store_id INTEGER PRIMARY KEY AUTOINCREMENT,
            store_balance REAL NOT NULL DEFAULT 0
        );

        CREATE TABLE items (
            item_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL DEFAULT 0,
            stock INTEGER NOT NULL DEFAULT 0,
            image BLOB NOT NULL
        );

        CREATE TABLE cart (
            cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        );

        CREATE TABLE cart_items (
            cart_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
            cart_id INTEGER NOT NULL,
            item_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            FOREIGN KEY (cart_id) REFERENCES cart(cart_id),
            FOREIGN KEY (item_id) REFERENCES items(item_id),
            UNIQUE (cart_id, item_id)
        );

        CREATE TABLE orders (
            order_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total REAL NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        );

        CREATE TABLE order_items (
            order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            item_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price_at_purchase REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(order_id),
            FOREIGN KEY (item_id) REFERENCES items(item_id)
        );
    `);

}

export async function initDb() {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/${file}`
    });

    const existingBytes = await loadDbBytes();

    let db;
    if (existingBytes) {
        db = new SQL.Database(new Uint8Array(existingBytes)); 
    } else {
        db = new SQL.Database();
        createSchema(db);

        
        await saveDb(db);
    }

    return db;
}