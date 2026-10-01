import { initDb, saveDb } from './db.js';
import * as store from './cart-store.js';

const TAX_RATE = 0.10;

let db;
let catalog = [];
let items = [];
let busy = false;
let confirmModal, successModal, addModal, toastInstance;

const rupiah = n => 'Rp' + Math.round(n).toLocaleString('id-ID');
const escapeHtml = s => String(s ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const getSubtotal = () => items.reduce((s, i) => s + i.price * i.qty, 0);
const getTax = () => Math.round(getSubtotal() * TAX_RATE);
const getTotal = () => getSubtotal() + getTax();
const getTotalQty = () => items.reduce((s, i) => s + i.qty, 0);
const ticketEl = id => $('#item-list .ticket').filter(function () { return $(this).data('id') == id; });

function loadCatalog() {
    const res = db.exec('SELECT item_id, name, description, price, image FROM items ORDER BY item_id');
    if (!res.length) return [];
    return res[0].values.map(([id, name, desc, price, img]) => ({ id, name, desc, price, img }));
}

function buildItems() {
    const list = [];
    store.getCart().forEach(c => {
        const base = catalog.find(x => x.id === c.id);
        if (base) list.push({ ...base, qty: c.qty });
    });
    return list;
}

function animateNumber($el, to, duration = 550) {
    const from = Number($el.data('val') || 0);
    if (from === to) { $el.text(rupiah(to)); return; }
    $el.data('val', to);
    const t0 = performance.now();
    (function frame(now) {
        const p = Math.min(1, (now - t0) / duration);
        const e = 1 - Math.pow(1 - p, 3);
        $el.text(rupiah(Math.round(from + (to - from) * e)));
        if (p < 1) requestAnimationFrame(frame);
    })(performance.now());
}

$(async function () {
    confirmModal = new bootstrap.Modal('#confirmModal');
    successModal = new bootstrap.Modal('#successModal');
    addModal = new bootstrap.Modal('#addModal');
    toastInstance = new bootstrap.Toast('#liveToast', { delay: 2400 });

    bindEvents();
    initReveal();
    drawBarcode();

    db = await initDb();
    catalog = loadCatalog();
    items = buildItems();
    renderItems();
    updateSummary(false);
    syncEmptyState();
});

function bindImgFallback($scope) {
    $scope.find('img').on('error', function () {
        const cls = $(this).hasClass('pick-img') ? 'pick-img pick-img-ph' : 'ticket-img-ph';
        $(this).replaceWith(`<div class="${cls}"><i class="bi bi-cup-straw"></i></div>`);
    });
}

function ticketHtml(it, i) {
    const img = it.img
        ? `<img src="${escapeHtml(it.img)}" alt="${escapeHtml(it.name)}" class="ticket-img">`
        : `<div class="ticket-img-ph"><i class="bi bi-cup-straw"></i></div>`;
    return `
        <article class="ticket" data-id="${it.id}" style="--i:${i}">
            <div class="ticket-top">
                ${img}
                <div class="min-w-0">
                    <h3 class="ticket-name">${escapeHtml(it.name)}</h3>
                    <p class="ticket-meta mb-0">@ ${rupiah(it.price)}${it.desc ? ` <span class="text-nowrap">· ${escapeHtml(it.desc)}</span>` : ''}</p>
                </div>
                <button type="button" class="ticket-remove" aria-label="Hapus ${escapeHtml(it.name)}"><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="ticket-cut"><span class="notch notch-l"></span><span class="notch notch-r"></span></div>
            <div class="ticket-bottom">
                <div class="qty">
                    <button type="button" class="qty-btn" data-step="-1" ${it.qty <= 1 ? 'disabled' : ''} aria-label="Kurangi"><i class="bi bi-dash-lg"></i></button>
                    <span class="qty-num">${it.qty}</span>
                    <button type="button" class="qty-btn" data-step="1" aria-label="Tambah"><i class="bi bi-plus-lg"></i></button>
                </div>
                <span class="ticket-sum">${rupiah(it.price * it.qty)}</span>
            </div>
        </article>`;
}

function renderItems() {
    const $list = $('#item-list').empty();
    items.forEach((it, i) => $list.append(ticketHtml(it, i)));
    bindImgFallback($list);
}

function pickHtml(it) {
    const img = it.img
        ? `<img src="${escapeHtml(it.img)}" alt="${escapeHtml(it.name)}" class="pick-img">`
        : `<div class="pick-img pick-img-ph"><i class="bi bi-cup-straw"></i></div>`;
    return `
        <div class="pick-item" data-id="${it.id}">
            ${img}
            <div class="pick-info">
                <h4 class="pick-name">${escapeHtml(it.name)}</h4>
                ${it.desc ? `<p class="pick-meta">${escapeHtml(it.desc)}</p>` : ''}
                <span class="pick-price">${rupiah(it.price)}</span>
            </div>
            <button type="button" class="btn-main pick-add"><i class="bi bi-plus-lg"></i> Tambah</button>
        </div>`;
}

function renderPicker() {
    const available = catalog.filter(c => !items.some(i => i.id === c.id));
    const $p = $('#pick-list').empty();
    if (!available.length) {
        $p.html('<p class="pick-empty">Semua menu yang tersedia sudah ada di pesananmu.</p>');
        return;
    }
    available.forEach(it => $p.append(pickHtml(it)));
    bindImgFallback($p);
}

function updateSummary(animate = true) {
    $('#sum-count').text(getTotalQty() + ' porsi');
    const fn = animate ? animateNumber : ($el, v) => { $el.data('val', v).text(rupiah(v)); };
    fn($('#sum-sub'), getSubtotal());
    fn($('#sum-tax'), getTax());
    fn($('#sum-total'), getTotal());
    fn($('#m-total'), getTotal());
}

function syncEmptyState() {
    const empty = items.length === 0;
    $('#empty-state').toggleClass('d-none', !empty);
    $('#order-content').toggleClass('d-none', empty);
    $('#mobile-bar').toggleClass('d-none', empty);
}

function drawBarcode() {
    const $b = $('#barcode').empty();
    for (let i = 0; i < 34; i++) {
        $b.append(`<span style="width:${[2, 3, 4, 6][Math.floor(Math.random() * 4)]}px"></span>`);
    }
    $('#barcode-num').text('MB·' + Math.floor(100000 + Math.random() * 899999));
}

function initReveal() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
        });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(el => {
        el.style.transitionDelay = (el.dataset.delay || 0) + 'ms';
        io.observe(el);
    });
}

function addMenu(id) {
    const base = catalog.find(x => x.id === id);
    if (!base || items.some(i => i.id === id)) return;
    store.addToCart(id);
    const it = { ...base, qty: 1 };
    items.push(it);
    const $el = $(ticketHtml(it, 0));
    $('#item-list').append($el);
    bindImgFallback($el);
    updateSummary(true);
    syncEmptyState();
    renderPicker();
    showToast(it.name + ' ditambahkan');
}

function changeQty(id, step) {
    const it = items.find(x => x.id === id);
    if (!it) return;
    const q = Math.min(99, Math.max(1, it.qty + step));
    if (q === it.qty) return;
    it.qty = q;
    store.setCartQty(id, q);

    const $t = ticketEl(id);
    $t.find('.qty-num').text(q).removeClass('pop').addClass('pop');
    $t.find('.qty-btn[data-step="-1"]').prop('disabled', q <= 1);
    animateNumber($t.find('.ticket-sum'), it.price * q, 350);
    updateSummary(true);
}

function removeItem(id) {
    const $t = ticketEl(id);
    $t.addClass('out');
    setTimeout(() => {
        items = items.filter(x => x.id !== id);
        store.removeFromCart(id);
        $t.slideUp(220, function () { $(this).remove(); });
        updateSummary(false);
        syncEmptyState();
        showToast('Item dihapus dari pesanan');
    }, 280);
}

function clearOrder() {
    const $tickets = $('#item-list .ticket');
    if (!$tickets.length) return;
    $tickets.each(function (i) {
        setTimeout(() => $(this).addClass('out'), i * 90);
    });
    setTimeout(() => {
        items = [];
        store.clearCart();
        $('#item-list').empty();
        updateSummary(false);
        syncEmptyState();
        showToast('Pesanan dikosongkan');
    }, $tickets.length * 90 + 300);
}

function validateForm() {
    let ok = true;
    const missing = [];
    $('#order-form .form-control').removeClass('is-invalid');

    if ($('#cust-name').val().trim().length < 3) {
        $('#cust-name').addClass('is-invalid'); missing.push('nama'); ok = false;
    }
    const phone = $('#cust-phone').val().replace(/\D/g, '');
    if (phone.length < 9 || phone.length > 15) {
        $('#cust-phone').addClass('is-invalid'); missing.push('nomor WhatsApp'); ok = false;
    }
    if ($('input[name="order-type"]:checked').val() === 'dinein') {
        if (!parseInt($('#cust-table').val(), 10)) {
            $('#cust-table').addClass('is-invalid'); missing.push('nomor meja'); ok = false;
        }
    }
    if (!ok) {
        showToast('Mohon lengkapi: ' + missing.join(', '), true);
        $('.is-invalid').first()[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return ok;
}

const getTypeText = () => {
    const t = $('input[name="order-type"]:checked').val();
    return t === 'dinein'
        ? 'Makan di Tempat' + ($('#cust-table').val() ? ' · Meja ' + $('#cust-table').val() : '')
        : 'Bungkus / Takeaway';
};

function openConfirmModal() {
    if (!items.length || !validateForm()) return;
    $('#cf-count').text(getTotalQty() + ' porsi');
    $('#cf-total').text(rupiah(getTotal()));
    $('#cf-recap').html(`
        <div class="r-row"><span>Atas Nama</span><b>${escapeHtml($('#cust-name').val().trim())}</b></div>
        <div class="r-row"><span>Tipe Pesanan</span><b>${getTypeText()}</b></div>
        <div class="r-row"><span>Pembayaran</span><b>${$('input[name="payment-method"]:checked').val()}</b></div>
        <div class="r-row"><span>Estimasi Siap</span><b>&plusmn; 10–15 menit</b></div>`);
    confirmModal.show();
}

function buildPayload() {
    const type = $('input[name="order-type"]:checked').val();
    return {
        customer: {
            name: $('#cust-name').val().trim(),
            phone: $('#cust-phone').val().trim(),
            type,
            table: type === 'dinein' ? $('#cust-table').val() : null,
            payment: $('input[name="payment-method"]:checked').val(),
            note: $('#order-note').val().trim()
        },
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        subtotal: getSubtotal(),
        tax: getTax(),
        total: getTotal()
    };
}

async function saveOrder(payload) {
    const user = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
    const userId = user?.user_id ?? 0;

    db.run('INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)', [userId, payload.total, 'pending']);
    const orderId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];

    const stmt = db.prepare('INSERT INTO order_items (order_id, item_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)');
    payload.items.forEach(i => stmt.run([orderId, i.id, i.qty, i.price]));
    stmt.free();

    await saveDb(db);
    return 'MB-' + String(orderId).padStart(6, '0');
}

function resetConfirmButton() {
    $('#final-confirm-btn').prop('disabled', false)
        .html('<i class="bi bi-check2-circle"></i> Ya, Pesan!');
    busy = false;
}

async function placeOrder() {
    if (busy) return;
    busy = true;
    $('#final-confirm-btn').prop('disabled', true)
        .html('<span class="spinner-border spinner-border-sm me-2"></span>Memproses…');

    try {
        const payload = buildPayload();
        payload.orderNumber = await saveOrder(payload);
        store.clearCart();
        confirmModal.hide();
        $('#confirmModal').one('hidden.bs.modal', () => showSuccess(payload));
    } catch (err) {
        console.error(err);
        showToast('Pesanan gagal disimpan, coba lagi', true);
        resetConfirmButton();
    }
}

function showSuccess(payload) {
    $('#stamp').removeClass('show');
    typeOrderNumber(payload.orderNumber);

    const c = payload.customer;
    $('#success-recap').html(`
        <div class="r-row"><span>Atas Nama</span><b>${escapeHtml(c.name)}</b></div>
        <div class="r-row"><span>Tipe Pesanan</span><b>${c.type === 'dinein' ? 'Makan di Tempat · Meja ' + escapeHtml(c.table) : 'Bungkus'}</b></div>
        <div class="r-row"><span>Metode Bayar</span><b>${c.payment}</b></div>
        ${c.note ? `<div class="r-row"><span>Catatan</span><b>${escapeHtml(c.note)}</b></div>` : ''}
        <div class="r-row"><span>Total Bayar</span><b class="text-danger">${rupiah(payload.total)}</b></div>`);

    spawnConfetti();
    successModal.show();
    resetConfirmButton();
}

function typeOrderNumber(num) {
    const $el = $('#order-number').empty().addClass('typing');
    let i = 0;
    const t = setInterval(() => {
        $el.text(num.slice(0, ++i));
        if (i >= num.length) {
            clearInterval(t);
            $el.removeClass('typing');
            setTimeout(() => $('#stamp').addClass('show'), 250);
        }
    }, 70);
}

function spawnConfetti() {
    const $z = $('#confetti-zone').empty();
    const colors = ['#FF3131', '#B06A3B', '#F5D5A0', '#A49F4D', '#8C4B26'];
    for (let i = 0; i < 18; i++) {
        $('<span class="confetti-piece"></span>').css({
            left: Math.random() * 100 + '%',
            background: colors[i % colors.length],
            width: (6 + Math.random() * 5) + 'px',
            height: (10 + Math.random() * 8) + 'px',
            animationDelay: (Math.random() * .6) + 's',
            animationDuration: (1.6 + Math.random() * 1.2) + 's'
        }).appendTo($z);
    }
}

function bindEvents() {
    $('#item-list')
        .on('click', '.qty-btn', function () {
            changeQty($(this).closest('.ticket').data('id'), Number($(this).data('step')));
        })
        .on('click', '.ticket-remove', function () {
            removeItem($(this).closest('.ticket').data('id'));
        });

    $('#clear-btn').on('click', clearOrder);

    $('#add-more-btn').on('click', function () {
        renderPicker();
        addModal.show();
    });

    $('#pick-list').on('click', '.pick-add', function () {
        addMenu($(this).closest('.pick-item').data('id'));
    });

    $('input[name="order-type"]').on('change', function () {
        if (this.value === 'dinein') {
            $('#table-field').removeClass('d-none').hide().slideDown(250);
        } else {
            $('#table-field').slideUp(200, function () {
                $(this).addClass('d-none');
                $('#cust-table').removeClass('is-invalid').val('');
            });
        }
    });

    $('#order-form').on('input', '.form-control', function () {
        $(this).removeClass('is-invalid');
    });

    $('#checkout-btn, #m-checkout-btn').on('click', openConfirmModal);
    $('#final-confirm-btn').on('click', placeOrder);

    $('#successModal').on('hidden.bs.modal', function () {
        $('#order-form')[0].reset();
        $('input[name="order-type"]').first().prop('checked', true).trigger('change');
        $('input[name="payment-method"]').first().prop('checked', true);
        items = [];
        renderItems();
        updateSummary(false);
        syncEmptyState();
        drawBarcode();
    });
}

function showToast(msg, isWarning = false) {
    $('#toast-body').text(msg);
    $('#liveToast').css('background', isWarning ? 'var(--roast-brown)' : 'var(--darker-brown)');
    toastInstance.show();
}