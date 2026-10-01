import { initDb } from "./db.js";

(async function () {
    const db = await initDb();
    
    db.exec(`
        INSERT INTO items (name, description, item_type, price, image)
        VALUES
            ('Mie Bangka biasa', 'Mie Biasa', 'main' ,15000, 'IMG/menu/mie_belitung.webp'), 
            ('Es Jeruk Kunci', 'Es Jeruk', 'drink' ,7000, 'IMG/menu/EsJerukKunci.webp');
    `);

    const results = db.exec(`
        SELECT * FROM items;
    `);
    
    const $menu = $('.main-menu .container .row');
    const columns = results[0].columns;
    const rows = results[0].values;
    
    rows.forEach(row => {
        const item = Object.fromEntries(columns.map((col, i) => [col, row[i]]));
        let info;

        $('')

        if(item.item_type == 'main'){
            info = `
            <div class="col-md-4">
                <div class="menu-card bg-darker-beige rounded-4 h-100 overflow-hidden">
                    <img src=${item.image} class="w-100">
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
                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>;
            `
        } else if(item.item_type == 'drink'){
            info = `
            
            
            `
        }

        $menu.append(info);
    });
})();

$(document).on('click', '.add-to-cart', function(){
    const $itemId = $(this).data('item-id');
    console.log($itemId)
})