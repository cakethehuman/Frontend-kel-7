let btnBaca = document.getElementById('btnBacaSelengkapnya');
let teksTambahan = document.getElementById('aboutMoreText');
if (btnBaca && teksTambahan) {
    btnBaca.addEventListener('click', function () {
        teksTambahan.classList.toggle('show');
        btnBaca.classList.toggle('open');
        if (teksTambahan.classList.contains('show')) {
            btnBaca.innerHTML = 'Tutup <i class="bx bx-chevron-down"></i>';
        } else {
            btnBaca.innerHTML = 'Baca Selengkapnya <i class="bx bx-chevron-down"></i>';
        }
    });
}

let faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(function (item) {
    let header = item.querySelector('.faq-header');
    let body = item.querySelector('.faq-body');
    header.addEventListener('click', function () {
        let isActive = item.classList.contains('active');
        if (isActive) {
            item.classList.remove('active');
            body.style.maxHeight = null;
        } else {
            item.classList.add('active');
            body.style.maxHeight = body.scrollHeight + 'px';
        }
    });
});