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