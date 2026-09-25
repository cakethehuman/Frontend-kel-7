(async function () {
    const db = await initDb();

    db.exec(`
        INSERT INTO items (image, name, description, price, stock)
        VALUES
            ('Mie India', 'Mie dengan cita rasa khas India', 15000, 20,2),
            ('Nasi Goreng', 'Nasi goreng spesial dengan telur', 18000, 15,2),
            ('Kopi Susu', 'Kopi susu gula aren', 12000, 30,2),
            ('Es Teh', 'Teh manis dingin', 5000, 50,2),
            ('Roti Bakar', 'Roti bakar dengan pilihan topping', 10000, 12,2);
    `);

    const results = db.exec(`
        SELECT * FROM items;
    `);
    
    const $menu = $('.container .row');
    const columns = results[0].columns;
    const rows = results[0].values;

    rows.forEach(row => {
        const item = Object.fromEntries(columns.map((col, i) => [col, row[i]]));

        const card = `
            <div class="col-md-4">
                <div class="menu-card bg-darker-beige rounded-4 h-100 overflow-hidden">
                    <img src="Images/placeholder.jpg" class="w-100">
                    <div class="p-4 d-flex flex-column">
                        <h5 class="fw-bold mb-2">${item.name}</h5>
                        <p class="text-muted small flex-grow-1">${item.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <div>
                                <p class="text-muted small mb-0">Harga</p>
                                <h5 class="fw-bold text-danger">Rp ${item.price}</h5>
                            </div>
                            <button class="btn btn-sm bg-primary-color text-light p-2 add-to-cart" data-item-id="${item.item_id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2..."/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        $menu.append(card);
    });
})();