const KEY = 'mb_cart';

function read() {
    try {
        const data = JSON.parse(localStorage.getItem(KEY));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function write(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
}

export function getCart() {
    return read();
}

export function addToCart(id, qty = 1) {
    const cart = read();
    const found = cart.find(c => c.id === id);
    if (found) {
        found.qty = Math.min(99, found.qty + qty);
    } else {
        cart.push({ id, qty });
    }
    write(cart);
}

export function setCartQty(id, qty) {
    const cart = read();
    const found = cart.find(c => c.id === id);
    if (!found) return;
    found.qty = Math.min(99, Math.max(1, qty));
    write(cart);
}

export function removeFromCart(id) {
    write(read().filter(c => c.id !== id));
}

export function clearCart() {
    localStorage.removeItem(KEY);
}