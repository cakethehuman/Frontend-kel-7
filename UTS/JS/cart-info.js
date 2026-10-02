$(function () {
    const TAX_RATE = 0.10;
    const CATEGORY_LABEL = { main: 'Main Menu', drink: 'Drink Menu', other: 'Other Menu' };
    const confirmModal = new bootstrap.Modal('#confirmModal');
    const successModal = new bootstrap.Modal('#successModal');
    let catalog = [];
    let catalogState = 'loading';
    let placedOrder = null;

    const rupiah = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');
    const escapeHtml = s => String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

    function totals() {
        const items = CartStore.get();
        const count = items.reduce((s, i) => s + i.qty, 0);
        const sub = items.reduce((s, i) => s + i.price * i.qty, 0);
        const tax = Math.round(sub * TAX_RATE);
        return { items, count, sub, tax, total: sub + tax };
    }

    function thumb(item, cls) {
        if (!item.img) return `<div class="${cls} thumb-empty rounded-3"><i class="bi bi-cup-hot"></i></div>`;
        return `<img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.name)}" class="${cls} rounded-3">`;
    }

    function itemRow(item) {
        return `
            <div class="cart-row d-flex align-items-center gap-3 py-3" data-id="${escapeHtml(item.id)}">
                ${thumb(item, 'cart-thumb')}
                <div class="flex-grow-1 min-w-0">
                    <h3 class="h6 fw-bold mb-0">${escapeHtml(item.name)}</h3>
                    <p class="text-muted small mb-2">${rupiah(item.price)}</p>
                    <div class="qty">
                        <button type="button" class="qty-btn" data-step="-1" aria-label="Kurangi" ${item.qty <= 1 ? 'disabled' : ''}><i class="bi bi-dash-lg"></i></button>
                        <span class="qty-num">${item.qty}</span>
                        <button type="button" class="qty-btn" data-step="1" aria-label="Tambah"><i class="bi bi-plus-lg"></i></button>
                    </div>
                </div>
                <div class="text-end">
                    <div class="fw-bold text-danger line-total">${rupiah(item.price * item.qty)}</div>
                    <button type="button" class="btn btn-link link-secondary text-decoration-none small p-0 mt-2 remove-btn"><i class="bi bi-trash3"></i> Hapus</button>
                </div>
            </div>`;
    }

    function moreRow(item) {
        return `
            <div class="more-row d-flex align-items-center gap-3 py-2" data-id="${escapeHtml(item.id)}">
                ${thumb(item, 'more-thumb')}
                <div class="flex-grow-1 min-w-0">
                    <div class="fw-bold">${escapeHtml(item.name)}</div>
                    <div class="text-muted small">${rupiah(item.price)}</div>
                </div>
                <button type="button" class="btn btn-outline-brown btn-sm more-add"><i class="bi bi-plus-lg"></i> Tambah</button>
            </div>`;
    }

    function renderSummary() {
        const t = totals();
        $('#sum-count').text(t.count + ' porsi');
        $('#sum-sub').text(rupiah(t.sub));
        $('#sum-tax').text(rupiah(t.tax));
        $('#sum-total').text(rupiah(t.total));
    }

    function renderMore(items) {
        const $box = $('#more-list').empty();
        if (catalogState === 'loading') return;
        if (catalogState === 'failed') {
            $box.html('<p class="text-muted mb-0">Daftar menu belum bisa dimuat. <a href="menu.html" class="link-danger">Buka halaman menu</a></p>');
            return;
        }
        const inCart = new Set(items.map(i => i.id));
        const available = catalog.filter(c => !inCart.has(c.id));
        if (!available.length) {
            $box.html('<p class="text-muted mb-0">Semua menu yang tersedia sudah ada di pesananmu.</p>');
            return;
        }
        Object.keys(CATEGORY_LABEL).forEach(cat => {
            const group = available.filter(c => c.cat === cat);
            if (!group.length) return;
            $box.append(`<h3 class="more-group h6 text-uppercase text-muted mt-3 mb-1">${CATEGORY_LABEL[cat]}</h3>${group.map(moreRow).join('')}`);
        });
    }

    function render() {
        const t = totals();
        const empty = t.items.length === 0;
        $('#empty-state').toggleClass('d-none', !empty);
        $('#order-content').toggleClass('d-none', empty);
        if (empty) return;
        $('#item-list').html(t.items.map(itemRow).join(''));
        renderSummary();
        renderMore(t.items);
    }

    function typeText(o) {
        return o.type === 'dinein' ? 'Makan di Tempat · Meja ' + escapeHtml(o.table) : 'Bungkus';
    }

    function recapHtml(o) {
        const line = (label, value, cls) => `<div class="d-flex justify-content-between gap-3 py-1"><span class="text-muted">${label}</span><span class="fw-bold text-end ${cls || ''}">${value}</span></div>`;
        const items = o.items.map(i => `<div class="d-flex justify-content-between gap-3 py-1"><span>${i.qty}× ${escapeHtml(i.name)}</span><span>${rupiah(i.price * i.qty)}</span></div>`).join('');
        return `
            <div class="recap bg-white rounded-3 p-3 text-start">
                ${items}
                <hr class="my-2">
                ${line('Atas Nama', escapeHtml(o.name))}
                ${line('Tipe Pesanan', typeText(o))}
                ${line('Pembayaran', escapeHtml(o.payment))}
                ${o.note ? line('Catatan', escapeHtml(o.note)) : ''}
                ${line('Total Bayar', rupiah(o.total), 'text-danger')}
            </div>`;
    }

    function orderData() {
        const t = totals();
        const type = $('input[name="order-type"]:checked').val();
        return {
            name: $('#cust-name').val().trim(),
            phone: $('#cust-phone').val().trim(),
            type: type,
            table: type === 'dinein' ? $('#cust-table').val() : null,
            payment: $('input[name="payment-method"]:checked').val(),
            note: $('#order-note').val().trim(),
            items: t.items,
            count: t.count,
            total: t.total
        };
    }

    function validate() {
        const dinein = $('input[name="order-type"]:checked').val() === 'dinein';
        const phone = $('#cust-phone').val().replace(/\D/g, '');
        const table = parseInt($('#cust-table').val(), 10);
        $('#cust-name').toggleClass('is-invalid', $('#cust-name').val().trim().length < 3);
        $('#cust-phone').toggleClass('is-invalid', phone.length < 9 || phone.length > 15);
        $('#cust-table').toggleClass('is-invalid', dinein && !(table >= 1 && table <= 99));
        const $bad = $('#order-form .is-invalid');
        if ($bad.length) $bad.first()[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        return $bad.length === 0;
    }

    function nextOrderNumber() {
        let seq = 1;
        try {
            seq = Number(localStorage.getItem('mb_order_seq') || 0) + 1;
            localStorage.setItem('mb_order_seq', seq);
        } catch (e) {}
        return 'MB-' + String(seq).padStart(4, '0');
    }

    $('#item-list')
        .on('click', '.qty-btn', function () {
            const $row = $(this).closest('.cart-row');
            const id = $row.attr('data-id');
            const item = CartStore.get().find(i => i.id === id);
            if (!item) return;
            const qty = Math.min(99, Math.max(1, item.qty + Number($(this).attr('data-step'))));
            CartStore.setQty(id, qty);
            $row.find('.qty-num').text(qty);
            $row.find('.qty-btn[data-step="-1"]').prop('disabled', qty <= 1);
            $row.find('.line-total').text(rupiah(item.price * qty));
            renderSummary();
        })
        .on('click', '.remove-btn', function () {
            CartStore.remove($(this).closest('.cart-row').attr('data-id'));
            render();
        });

    $('#clear-btn').on('click', function () {
        CartStore.clear();
        render();
    });

    $('#more-list').on('click', '.more-add', function () {
        const id = $(this).closest('.more-row').attr('data-id');
        const item = catalog.find(c => c.id === id);
        if (!item) return;
        CartStore.add(item);
        render();
    });

    $('input[name="order-type"]').on('change', function () {
        const dinein = this.value === 'dinein';
        $('#table-field').toggleClass('d-none', !dinein);
        if (!dinein) $('#cust-table').removeClass('is-invalid').val('');
    });

    $('#order-form').on('input', '.form-control', function () {
        $(this).removeClass('is-invalid');
    });

    $('#checkout-btn').on('click', function () {
        if (!CartStore.get().length || !validate()) return;
        const o = orderData();
        $('#cf-count').text(o.count + ' porsi');
        $('#cf-total').text(rupiah(o.total));
        $('#cf-recap').html(recapHtml(o));
        confirmModal.show();
    });

    $('#final-confirm-btn').on('click', function () {
        if (placedOrder) return;
        placedOrder = orderData();
        placedOrder.number = nextOrderNumber();
        CartStore.clear();
        $('#confirmModal').one('hidden.bs.modal', function () {
            $('#order-number').text(placedOrder.number);
            $('#success-recap').html(recapHtml(placedOrder));
            successModal.show();
        });
        confirmModal.hide();
    });

    $('#successModal').on('hidden.bs.modal', function () {
        placedOrder = null;
        $('#order-form')[0].reset();
        $('#table-field').removeClass('d-none');
        $('#order-form .is-invalid').removeClass('is-invalid');
        render();
    });

    render();

    fetch('menu.html')
        .then(res => {
            if (!res.ok) throw new Error(res.status);
            return res.text();
        })
        .then(html => {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            catalog = $(doc).find('.menu-card').map(function () {
                return CartStore.fromCard($(this));
            }).get().filter(i => i.id);
            catalogState = 'ready';
        })
        .catch(() => {
            catalogState = 'failed';
        })
        .finally(render);
});