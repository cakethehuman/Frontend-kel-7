/* ============================================================
   HALAMAN PESANAN — Mie Belitung (FRONTEND ONLY)
   ============================================================
   🔗 TITIK SAMBUNG BACKEND (cuma 2 fungsi ini):
   1. getOrderItems()        → ambil isi keranjang dari DB/API
   2. sendOrderToBackend()   → kirim payload pesanan saat konfirmasi
   ============================================================ */

const TAX_RATE = 0.10;

/* ---------- DATA DUMMY (GANTI DENGAN DATA ASLI) ---------- */
const DUMMY_ITEMS = [
    { id: 1, name: 'Mie Bangka Biasa',     desc: 'Mie kering khas Bangka', price: 15000, qty: 2, img: 'https://placehold.co/300x300/FCE5C6/B06A3B/png?text=Mie+Bangka' },
    { id: 2, name: 'Es Jeruk Kunci',       desc: 'Jeruk segar asli Belitung', price: 7000,  qty: 3, img: 'https://placehold.co/300x300/B06A3B/FFF8EA/png?text=Es+Jeruk' },
    { id: 3, name: 'Mie Belitung Spesial', desc: 'Tambah seafood & ceplok',  price: 22000, qty: 1, img: 'https://placehold.co/300x300/FF3131/FFFFFF/png?text=Mie+Spesial' },
    { id: 4, name: 'Kerupuk Mile',         desc: 'Camilan renyah pendamping', price: 5000,  qty: 2, img: 'https://placehold.co/300x300/8C4B26/FFF8EA/png?text=Kerupuk' }
];

/* 🔗 HOOK 1 — sumber data keranjang */
function getOrderItems() {
    // TODO (backend): ganti dengan query ke cart/cart_items atau fetch API.
    // Format yang diharapkan: [{ id, name, desc, price, qty, img }]
    if (new URLSearchParams(location.search).has('empty')) return []; // preview empty state
    return JSON.parse(JSON.stringify(DUMMY_ITEMS));
}

/* 🔗 HOOK 2 — kirim pesanan saat dikonfirmasi */
function sendOrderToBackend(payload) {
    // TODO (backend): POST ke server / INSERT ke tabel orders & order_items.
    console.log('[ORDER PAYLOAD → backend]', payload);
    return new Promise(res => setTimeout(res, 900)); // simulasi network delay
}

/* ================= STATE & UTIL ================= */
let items = [];
let busy = false;
let confirmModal, successModal, toastInstance;

const rupiah = n => 'Rp' + Math.round(n).toLocaleString('id-ID');
const escapeHtml = s => String(s ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const getSubtotal = () => items.reduce((s, i) => s + i.price * i.qty, 0);
const getTax      = () => Math.round(getSubtotal() * TAX_RATE);
const getTotal    = () => getSubtotal() + getTax();
const getTotalQty = () => items.reduce((s, i) => s + i.qty, 0);
const ticketEl    = id => $('#item-list .ticket').filter(function () { return $(this).data('id') == id; });

/* Angka menghitung (count-up) */
function animateNumber($el, to, duration = 550) {
    const from = Number($el.data('val') || 0);
    if (from === to) { $el.text(rupiah(to)); return; }
    $el.data('val', to);
    const t0 = performance.now();
    (function frame(now) {
        const p = Math.min(1, (now - t0) / duration);
        const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
        $el.text(rupiah(Math.round(from + (to - from) * e)));
        if (p < 1) requestAnimationFrame(frame);
    })(performance.now());
}

/* ================= INIT ================= */
 $(function () {
    confirmModal  = new bootstrap.Modal('#confirmModal');
    successModal  = new bootstrap.Modal('#successModal');
    toastInstance = new bootstrap.Toast('#liveToast', { delay: 2400 });

    items = getOrderItems();
    renderItems();
    updateSummary(false);
    drawBarcode();
    syncEmptyState();
    bindEvents();
    initReveal();
});

/* ================= RENDER ================= */
function renderItems() {
    const $list = $('#item-list').empty();
    items.forEach((it, i) => {
        const img = it.img
            ? `<img src="${it.img}" alt="${escapeHtml(it.name)}" class="ticket-img">`
            : `<div class="ticket-img-ph"><i class="bi bi-cup-straw"></i></div>`;
        $list.append(`
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
            </article>`);
    });
    $list.find('.ticket-img').on('error', function () {
        $(this).replaceWith('<div class="ticket-img-ph"><i class="bi bi-cup-straw"></i></div>');
    });
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

/* Barcode dekoratif (random tiap load) */
function drawBarcode() {
    const $b = $('#barcode').empty();
    for (let i = 0; i < 34; i++) {
        $b.append(`<span style="width:${[2, 3, 4, 6][Math.floor(Math.random() * 4)]}px"></span>`);
    }
    $('#barcode-num').text('MB·' + Math.floor(100000 + Math.random() * 899999));
}

/* Reveal on scroll */
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

/* ================= AKSI KERANJANG ================= */
function changeQty(id, step) {
    const it = items.find(x => x.id === id);
    if (!it) return;
    const q = Math.min(99, Math.max(1, it.qty + step));
    if (q === it.qty) return;
    it.qty = q;

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
        $t.slideUp(220, function () { $(this).remove(); });
        updateSummary(false);
        syncEmptyState();
        showToast('Item dihapus dari pesanan');
    }, 280);
}

function clearCart() {
    const $tickets = $('#item-list .ticket');
    if (!$tickets.length) return;
    $tickets.each(function (i) {
        setTimeout(() => $(this).addClass('out'), i * 90);
    });
    setTimeout(() => {
        items = [];
        $('#item-list').empty();
        updateSummary(false);
        syncEmptyState();
        showToast('Keranjang dikosongkan');
    }, $tickets.length * 90 + 300);
}

/* ================= VALIDASI ================= */
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

/* ================= CHECKOUT ================= */
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

function buildPayload(orderNumber) {
    return {
        orderNumber,
        createdAt: new Date().toISOString(),
        customer: {
            name:   $('#cust-name').val().trim(),
            phone:  $('#cust-phone').val().trim(),
            type:   $('input[name="order-type"]:checked').val(),
            table:  $('input[name="order-type"]:checked').val() === 'dinein' ? $('#cust-table').val() : null,
            payment: $('input[name="payment-method"]:checked').val(),
            note:   $('#order-note').val().trim()
        },
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        subtotal: getSubtotal(),
        tax: getTax(),
        total: getTotal()
    };
}

function placeOrder() {
    if (busy) return;
    busy = true;
    const $btn = $('#final-confirm-btn');
    $btn.prop('disabled', true)
        .html('<span class="spinner-border spinner-border-sm me-2"></span>Memproses…');

    const orderNumber = 'MB-' + String(Math.floor(100000 + Math.random() * 899999));
    const payload = buildPayload(orderNumber);

    sendOrderToBackend(payload).then(() => {
        confirmModal.hide();
        $('#confirmModal').one('hidden.bs.modal', () => showSuccess(payload));
    });
}

/* ================= MODAL SUKSES ================= */
function showSuccess(payload) {
    $('#stamp').removeClass('show');
    typeOrderNumber(payload.orderNumber);

    const c = payload.customer;
    $('#success-recap').html(`
        <div class="r-row"><span>Atas Nama</span><b>${escapeHtml(c.name)}</b></div>
        <div class="r-row"><span>Tipe Pesanan</span><b>${c.type === 'dinein' ? 'Makan di Tempat · Meja ' + c.table : 'Bungkus'}</b></div>
        <div class="r-row"><span>Metode Bayar</span><b>${c.payment}</b></div>
        ${c.note ? `<div class="r-row"><span>Catatan</span><b>${escapeHtml(c.note)}</b></div>` : ''}
        <div class="r-row"><span>Total Bayar</span><b class="text-danger">${rupiah(payload.total)}</b></div>`);

    spawnConfetti();
    successModal.show();

    // Reset state & tombol
    $('#final-confirm-btn').prop('disabled', false)
        .html('<i class="bi bi-check2-circle"></i> Ya, Pesan!');
    busy = false;
}

/* Nomor pesanan "tercetak" per karakter, lalu stempel muncul */
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

/* ================= EVENTS ================= */
function bindEvents() {
    $('#item-list')
        .on('click', '.qty-btn', function () {
            changeQty($(this).closest('.ticket').data('id'), Number($(this).data('step')));
        })
        .on('click', '.ticket-remove', function () {
            removeItem($(this).closest('.ticket').data('id'));
        });

    $('#clear-btn').on('click', clearCart);

    // Nomor meja muncul hanya saat "Makan di Tempat"
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

    // Setelah modal sukses ditutup → keranjang kosong, form reset
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

/* ================= TOAST ================= */
function showToast(msg, isWarning = false) {
    $('#toast-body').text(msg);
    const $t = $('#liveToast');
    $t.css('background', isWarning ? 'var(--roast-brown)' : 'var(--darker-brown)');
    toastInstance.show();
}