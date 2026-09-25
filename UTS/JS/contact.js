$(document).ready(function () {

  function updateStatus() {
    const now = new Date();
    const jamSekarang = now.getHours() + now.getMinutes() / 60;
    const $pill = $('#statusPill');

    if (jamSekarang >= 10 && jamSekarang < 21.5) {
      $pill.attr('class', 'status-pill open').text('Buka Sekarang');
    } else {
      $pill.attr('class', 'status-pill closed').text('Tutup · Buka lagi jam 10.00');
    }
  }
  updateStatus();
  setInterval(updateStatus, 60000); 

  $('#btnCopy').on('click', function () {
    const alamat = 'Jl. Palembang No. 27, Air Raya, Tanjung Pandan, Belitung 33411';
    const $btn = $(this);

    navigator.clipboard.writeText(alamat).then(function () {
      $btn.html('<i class="bi bi-check-lg"></i> Tersalin!');
      setTimeout(function () {
        $btn.html('<i class="bi bi-clipboard"></i> Salin Alamat');
      }, 2000);
    });
  });

  /* ============ 3. RATING BINTANG ============ */
  const labelTeks = ['Belum dinilai', 'Kurang, nih', 'Cukup enak', 'Enak!', 'Bikin nagih', 'Luar biasa!'];
  let ratingTerpilih = 0;

  $('#stars .star').on('click', function () {
    ratingTerpilih = Number($(this).data('val'));

    $('#stars .star').each(function () {
      $(this).toggleClass('active', Number($(this).data('val')) <= ratingTerpilih);
    });
    $('#starLabel').text(labelTeks[ratingTerpilih]);
    $('#fieldRating').removeClass('has-error');
  });

  $('#pesan').on('input', function () {
    $('#charCount').text($(this).val().length + '/500');
  });

  const $form = $('#feedbackForm');
  const $formAlert = $('#formAlert');
  const $formSuccess = $('#formSuccess');
  const $btnSubmit = $('#btnSubmit');

  function tampilkanError(idField, pesanError) {
    const $field = $('#' + idField);
    $field.addClass('has-error');
    $field.find('.error-msg').text(pesanError);
  }

  function hapusSemuaError() {
    $('.field').removeClass('has-error');
  }

  $form.on('submit', function (e) {
    e.preventDefault();
    $formAlert.removeClass('show');
    hapusSemuaError();

    const nama = $.trim($('#nama').val());
    const email = $.trim($('#email').val());
    const pesan = $.trim($('#pesan').val());
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
      $formAlert.addClass('show');
      return;
    }

    $btnSubmit.prop('disabled', true);
    $btnSubmit.find('.btn-label').text('Mengirim...');

    setTimeout(function () {
      $form.hide();
      $formSuccess.addClass('show');
    }, 900);
  });

});