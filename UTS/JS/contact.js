document.addEventListener('DOMContentLoaded', function () {

  function updateStatus() {
    const now = new Date();
    const jamSekarang = now.getHours() + now.getMinutes() / 60;
    const pill = document.getElementById('statusPill');

    if (jamSekarang >= 10 && jamSekarang < 21.5) {
      pill.className = 'status-pill open';
      pill.textContent = 'Buka Sekarang';
    } else {
      pill.className = 'status-pill closed';
      pill.textContent = 'Tutup · Buka lagi jam 10.00';
    }
  }
  updateStatus();
  setInterval(updateStatus, 60000); 

  const btnCopy = document.getElementById('btnCopy');
  btnCopy.addEventListener('click', function () {
    const alamat = 'Jl. Palembang No. 27, Air Raya, Tanjung Pandan, Belitung 33411';

    navigator.clipboard.writeText(alamat).then(function () {
      btnCopy.innerHTML = '<i class="bi bi-check-lg"></i> Tersalin!';
      setTimeout(function () {
        btnCopy.innerHTML = '<i class="bi bi-clipboard"></i> Salin Alamat';
      }, 2000);
    });
  });

  const stars = document.querySelectorAll('#stars .star');
  const starLabel = document.getElementById('starLabel');
  const labelTeks = ['Belum dinilai', 'Kurang, nih', 'Cukup enak', 'Enak!', 'Bikin nagih', 'Luar biasa!'];
  let ratingTerpilih = 0;

  stars.forEach(function (star) {
    star.addEventListener('click', function () {
      ratingTerpilih = Number(star.dataset.val);

      stars.forEach(function (s) {
        s.classList.toggle('active', Number(s.dataset.val) <= ratingTerpilih);
      });
      starLabel.textContent = labelTeks[ratingTerpilih];
      document.getElementById('fieldRating').classList.remove('has-error');
    });
  });

  const pesanInput = document.getElementById('pesan');
  const charCount = document.getElementById('charCount');

  pesanInput.addEventListener('input', function () {
    charCount.textContent = pesanInput.value.length + '/500';
  });

  const form = document.getElementById('feedbackForm');
  const formAlert = document.getElementById('formAlert');
  const formSuccess = document.getElementById('formSuccess');
  const btnSubmit = document.getElementById('btnSubmit');

  function tampilkanError(idField, pesanError) {
    const field = document.getElementById(idField);
    field.classList.add('has-error');
    field.querySelector('.error-msg').textContent = pesanError;
  }

  function hapusSemuaError() {
    document.querySelectorAll('.field').forEach(function (f) {
      f.classList.remove('has-error');
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    formAlert.classList.remove('show');
    hapusSemuaError();

    const nama = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();
    const pesan = pesanInput.value.trim();
    let valid = true;

    if (nama.length < 3) {
      tampilkanError('fieldName', 'Nama minimal 3 huruf, ya.');
      valid = false;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tampilkanError('fieldEmail', 'Format email belum benar.');
      valid = false;
    }
    if (ratingTerpilih === 0) {
      tampilkanError('fieldRating', 'Kasih bintang dulu, yuk.');
      valid = false;
    }
    if (pesan.length < 10) {
      tampilkanError('fieldPesan', 'Ceritakan sedikit lebih panjang (min. 10 karakter).');
      valid = false;
    }

    if (!valid) {
      formAlert.classList.add('show');
      return;
    }

    // Simulasi pengiriman ke server (belum ada backend)
    btnSubmit.disabled = true;
    btnSubmit.querySelector('.btn-label').textContent = 'Mengirim...';

    setTimeout(function () {
      form.style.display = 'none';
      formSuccess.classList.add('show');
    }, 900);
  });

});