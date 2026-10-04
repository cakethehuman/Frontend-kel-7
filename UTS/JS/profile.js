$(function () {
    const STORE_KEY = 'mb_favorites';
    const PROFILE_KEY = 'mb_profile';
    const DEFAULT_BIO = 'I am an Informatics Engineering student from Belitung, and I currently run tutoring classes in Python programming, piano, basketball, and taekwondo.';
    const DEFAULT_ROLE = 'Student & Programmer';
    const DEFAULT_TAGS = ['AnimLovers', 'Untarian', 'Soushin'];
    const SEED = [
        { id: 1, name: 'Mie Belitung', region: 'Sumatra', done: true },
        { id: 2, name: 'Rendang', region: 'Sumatra', done: true },
        { id: 3, name: 'Gudeg', region: 'Jawa', done: true },
        { id: 4, name: 'Rawon', region: 'Jawa', done: false },
        { id: 5, name: 'Ayam Betutu', region: 'Bali & Nusa Tenggara', done: false },
        { id: 6, name: 'Coto Makassar', region: 'Sulawesi', done: false },
        { id: 7, name: 'Papeda', region: 'Maluku & Papua', done: false },
        { id: 8, name: 'Soto Banjar', region: 'Kalimantan', done: false }
    ];

    let favorites = [];
    let activeFilter = 'all';
    let pendingDeleteId = null;
    let lastAddedId = null;
    let messageTimer = null;
    const deleteModal = new bootstrap.Modal('#deleteModal');
    const editModal = new bootstrap.Modal('#editModal');

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function loadFavorites() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                if (Array.isArray(data)) return data;
            }
        } catch (e) { }
        return SEED.slice();
    }

    function saveFavorites() {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(favorites));
        } catch (e) { }
    }

    function showMessage(text, type) {
        const $msg = $('#fav-message');
        $msg.text(text).removeClass('pf-msg-ok pf-msg-error')
            .addClass(type === 'error' ? 'pf-msg-error' : 'pf-msg-ok');
        clearTimeout(messageTimer);
        messageTimer = setTimeout(function () {
            $msg.text('');
        }, 3000);
    }

    function cardHtml(item) {
        const doneClass = item.done ? ' is-done' : '';
        const newClass = item.id === lastAddedId ? ' pf-new' : '';
        const statusText = item.done ? 'Sudah dicoba' : 'Belum dicoba';
        const markText = item.done ? 'Batal Tandai' : 'Tandai Sudah';
        const markIcon = item.done ? 'bi-arrow-counterclockwise' : 'bi-check-lg';

        return '<div class="col-md-6 col-xl-4 fav-item" data-id="' + item.id + '"' +
            ' data-name="' + escapeHtml(item.name.toLowerCase()) + '"' +
            ' data-region="' + escapeHtml(item.region.toLowerCase()) + '"' +
            ' data-done="' + item.done + '">' +
            '<article class="pf-fav-card' + doneClass + newClass + '">' +
            '<span class="pf-region"><i class="bi bi-geo-alt-fill"></i> ' + escapeHtml(item.region) + '</span>' +
            '<h3 class="pf-fav-name">' + escapeHtml(item.name) + '</h3>' +
            '<span class="pf-status">' + statusText + '</span>' +
            '<div class="pf-fav-actions">' +
            '<button type="button" class="btn btn-profile btn-mark flex-grow-1"><i class="bi ' + markIcon + '"></i> ' + markText + '</button>' +
            '<button type="button" class="btn btn-trash btn-del" aria-label="Hapus ' + escapeHtml(item.name) + '"><i class="bi bi-trash3-fill"></i></button>' +
            '</div>' +
            '</article>' +
            '</div>';
    }

    function renderList() {
        let html = '';
        $.each(favorites, function (i, item) {
            html += cardHtml(item);
        });
        $('#fav-list').html(html);
        lastAddedId = null;
        applyFilter();
        updateStats();
    }

    function applyFilter() {
        const keyword = $.trim($('#fav-search').val()).toLowerCase();
        let visible = 0;
        $('#fav-list .fav-item').each(function () {
            const $item = $(this);
            const matchText = $item.attr('data-name').indexOf(keyword) !== -1 ||
                $item.attr('data-region').indexOf(keyword) !== -1;
            const isDone = $item.attr('data-done') === 'true';
            let matchStatus = true;
            if (activeFilter === 'sudah') matchStatus = isDone;
            if (activeFilter === 'belum') matchStatus = !isDone;
            const show = matchText && matchStatus;
            $item.toggleClass('d-none', !show);
            if (show) visible++;
        });

        $('#fav-counter').text('Menampilkan ' + visible + ' dari ' + favorites.length + ' kuliner');
        if (visible === 0) {
            const text = favorites.length === 0
                ? 'Daftarmu masih kosong. Yuk tambah kuliner pertamamu!'
                : 'Tidak ada kuliner yang cocok dengan pencarian atau filter ini.';
            $('#fav-empty-text').text(text);
            $('#fav-empty').removeClass('d-none');
        } else {
            $('#fav-empty').addClass('d-none');
        }
    }

    function updateStats() {
        const total = favorites.length;
        let done = 0;
        const regions = [];
        $.each(favorites, function (i, item) {
            if (item.done) {
                done++;
                if ($.inArray(item.region, regions) === -1) regions.push(item.region);
            }
        });
        const percent = total === 0 ? 0 : Math.round(done / total * 100);
        $('#stat-total').text(total);
        $('#stat-done').text(done);
        $('#stat-region').text(regions.length);
        $('#pf-progress-text').text(percent + '%');
        $('#pf-progress-bar').css('width', percent + '%');
        $('#pf-progress').attr('aria-valuenow', percent);
    }

    function setFilter(filter) {
        activeFilter = filter;
        $('.pf-filter').removeClass('active');
        $('.pf-filter[data-filter="' + filter + '"]').addClass('active');
    }

    $('#fav-form').on('submit', function (e) {
        e.preventDefault();
        const name = $.trim($('#fav-input-name').val());
        const region = $('#fav-input-region').val();

        if (name.length < 3) {
            showMessage('Nama kuliner minimal 3 karakter ya.', 'error');
            return;
        }

        let duplicate = false;
        $.each(favorites, function (i, item) {
            if (item.name.toLowerCase() === name.toLowerCase()) duplicate = true;
        });
        if (duplicate) {
            showMessage(name + ' sudah ada di daftarmu.', 'error');
            return;
        }

        const newId = Date.now();
        favorites.unshift({ id: newId, name: name, region: region, done: false });
        lastAddedId = newId;
        saveFavorites();

        $('#fav-input-name').val('');
        $('#fav-search').val('');
        setFilter('all');
        renderList();
        showMessage(name + ' berhasil ditambahkan!', 'ok');
    });

    $('#fav-list').on('click', '.btn-mark', function () {
        const id = Number($(this).closest('.fav-item').attr('data-id'));
        $.each(favorites, function (i, item) {
            if (item.id === id) item.done = !item.done;
        });
        saveFavorites();
        renderList();
    });

    $('#fav-list').on('click', '.btn-del', function () {
        const $item = $(this).closest('.fav-item');
        pendingDeleteId = Number($item.attr('data-id'));
        $('#delete-name').text($item.find('.pf-fav-name').text());
        deleteModal.show();
    });

    $('#confirm-delete').on('click', function () {
        favorites = $.grep(favorites, function (item) {
            return item.id !== pendingDeleteId;
        });
        pendingDeleteId = null;
        saveFavorites();
        deleteModal.hide();
        renderList();
        showMessage('Kuliner berhasil dihapus.', 'ok');
    });

    $('.pf-filter').on('click', function () {
        setFilter($(this).attr('data-filter'));
        applyFilter();
    });

    $('#fav-search').on('input', applyFilter);

    function renderTags(tags) {
        let html = '';
        $.each(tags, function (i, tag) {
            html += '<span class="pf-tag">#' + escapeHtml(tag) + '</span>';
        });
        $('#pf-tags').html(html);
    }

    function parseTags(text) {
        const result = [];
        $.each(text.split(','), function (i, part) {
            const tag = $.trim(part.replace(/#/g, ''));
            if (tag !== '' && result.length < 6) result.push(tag);
        });
        return result;
    }

    function loadProfile() {
        let name = 'Wilson Hung';
        let email = 'frontend@gmail.com';
        let bio = DEFAULT_BIO;
        let role = DEFAULT_ROLE;
        let tags = DEFAULT_TAGS.slice();

        try {
            const user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
            if (user.name) name = user.name;
            if (user.email) email = user.email;
        } catch (e) { }

        try {
            const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
            if (saved.name) name = saved.name;
            if (saved.bio) bio = saved.bio;
            if (saved.role) role = saved.role;
            if ($.isArray(saved.tags)) tags = saved.tags;
        } catch (e) { }

        $('#pf-name').text(name);
        $('#pf-email').text(email);
        $('#pf-bio-text').text(bio);
        $('#pf-title').text(role);
        renderTags(tags);
        $('#pf-avatar').text(name.charAt(0).toUpperCase());
    }

    $('#editModal').on('show.bs.modal', function () {
        $('#edit-name').val($('#pf-name').text());
        $('#edit-bio').val($('#pf-bio-text').text());
        $('#edit-role').val($('#pf-title').text());
        const current = [];
        $('#pf-tags .pf-tag').each(function () {
            current.push($(this).text().replace('#', ''));
        });
        $('#edit-tags').val(current.join(', '));
        $('#edit-error').text('');
    });

    $('#save-profile').on('click', function () {
        const name = $.trim($('#edit-name').val());
        const bio = $.trim($('#edit-bio').val());
        const role = $.trim($('#edit-role').val());
        const tags = parseTags($('#edit-tags').val());

        if (name.length < 3) {
            $('#edit-error').text('Nama minimal 3 karakter ya.');
            return;
        }
        if (role.length < 3) {
            $('#edit-error').text('Role minimal 3 karakter ya.');
            return;
        }

        try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: name, bio: bio, role: role, tags: tags }));
        } catch (e) { }

        loadProfile();
        editModal.hide();
    });

    favorites = loadFavorites();
    loadProfile();
    renderList();
});

$('.btn-logout').on('click', function(){
    window.location.href = "login.html";
});
