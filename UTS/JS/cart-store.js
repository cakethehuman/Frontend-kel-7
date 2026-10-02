const CartStore = (function () {
    const KEY = 'mb_cart';
    const CATEGORIES = ['main', 'drink', 'other'];

    function read() {
        try {
            const data = JSON.parse(sessionStorage.getItem(KEY));
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return [];
        }
    }

    function write(cart) {
        try {
            sessionStorage.setItem(KEY, JSON.stringify(cart));
        } catch (e) {}
    }

    function slug(name) {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    function parsePrice(text) {
        return Number(String(text).replace(/\D/g, '')) || 0;
    }

    function fromCard($card) {
        const name = $card.find('h5.fw-bold').first().text().trim();
        const section = ($card.closest('section').attr('id') || '').replace('-menu', '');
        return {
            id: slug(name),
            name: name,
            desc: $card.find('p.flex-grow-1').first().text().trim(),
            price: parsePrice($card.find('h5.text-danger').first().text()),
            img: ($card.find('img').first().attr('src') || '').replace(/\\/g, '/'),
            cat: CATEGORIES.indexOf(section) >= 0 ? section : 'other'
        };
    }

    function add(item) {
        const cart = read();
        const found = cart.find(function (c) { return c.id === item.id; });
        if (found) {
            found.qty = Math.min(99, found.qty + 1);
        } else {
            cart.push(Object.assign({}, item, { qty: 1 }));
        }
        write(cart);
    }

    function start(item) {
        write([Object.assign({}, item, { qty: 1 })]);
    }

    function setQty(id, qty) {
        const cart = read();
        const found = cart.find(function (c) { return c.id === id; });
        if (!found) return;
        found.qty = Math.min(99, Math.max(1, qty));
        write(cart);
    }

    function remove(id) {
        write(read().filter(function (c) { return c.id !== id; }));
    }

    function clear() {
        try {
            sessionStorage.removeItem(KEY);
        } catch (e) {}
    }

    return { get: read, fromCard: fromCard, add: add, start: start, setQty: setQty, remove: remove, clear: clear };
})();