$(function () {
    const STORE_KEY = 'mb_chat';
    const TEASER_KEY = 'mb_chat_teaser';
    const MAX_MESSAGES = 120;
    const DEFAULT_CHIPS = ['Lihat menu', 'Jam buka', 'Sejarah Mie Belitung', 'Cara pesan', 'Lokasi toko'];
    const KNOWLEDGE = [
        {
            id: 'salam',
            keys: ['halo', 'hallo', ' hai ', 'hello', ' hi ', ' hey ', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam', 'assalamualaikum', 'permisi'],
            reply: 'Halo, selamat datang di layanan pelanggan Sahang Kitchen Belitung. Kami siap membantu Anda terkait menu, harga, jam operasional, cara pesan, maupun sejarah Mie Belitung. Ada yang bisa kami bantu?',
            next: ['Lihat menu', 'Sejarah Mie Belitung', 'Cara pesan']
        },
        {
            id: 'siapa',
            keys: ['siapa kamu', 'kamu siapa', 'siapa namamu', 'namamu', 'kamu bot', 'robot', ' bot ', ' ai ', 'asisten', 'manusia'],
            reply: 'Kami adalah perwakilan layanan pelanggan Sahang Kitchen Belitung. Kami akan membantu menjawab pertanyaan Anda berdasarkan informasi resmi seputar operasional, menu, dan budaya Mie Belitung.',
            next: ['Lihat menu', 'Apa itu Mie Belitung', 'Kontak']
        },
        {
            id: 'menu',
            keys: ['menu', 'makanan', 'minuman', 'jual apa', 'daftar makanan', 'ada apa saja'],
            reply: 'Menu andalan kami adalah Mie Belitung Special: mie kuning basah dengan kuah kaldu udang kental, udang, tahu goreng, kentang rebus, tauge, timun, dan emping.\nPendampingnya ada Es Teh Manis dan Kerupuk. Daftar lengkap beserta fotonya tersedia di halaman Menu.',
            link: { href: 'menu.html', label: 'Buka halaman Menu' },
            next: ['Harga', 'Rekomendasi', 'Cara pesan']
        },
        {
            id: 'harga',
            keys: ['harga', 'berapa', 'biaya', 'price', 'tarif'],
            reply: 'Beberapa harga standar di kedai kami:\n• Mie Belitung Rp 20.000\n• Es Jeruk Kunci Rp 10.000\n• Kopi Belitung Rp 8.000\nUntuk pesanan melalui website, terdapat pajak 10% yang dihitung otomatis di halaman Pesanan. Harga menu selengkapnya dapat dicek di halaman Menu.',
            link: { href: 'menu.html', label: 'Lihat semua harga' },
            next: ['Metode pembayaran', 'Cara pesan', 'Promo']
        },
        {
            id: 'rekomendasi',
            keys: ['rekomendasi', 'best seller', 'terlaris', 'paling enak', 'andalan', 'favorit kalian', 'bingung pilih', 'enaknya'],
            reply: 'Pilihan yang paling kami rekomendasikan adalah Mie Belitung dipadukan dengan Es Jeruk Kunci.\nSaran penyajian: nikmati selagi kuahnya hangat dan atur tingkat kepedasannya sedikit demi sedikit sesuai selera.',
            next: ['Rasanya seperti apa', 'Level pedas', 'Lihat menu']
        },
        {
            id: 'jam',
            keys: ['jam buka', 'jam', 'buka', 'tutup', 'operasional', 'libur', 'sampai jam'],
            reply: 'Jam operasional kami adalah setiap hari pukul 10.00 sampai 21.30 WIB. Datang di luar jam sibuk makan siang biasanya menawarkan suasana yang lebih tenang.',
            link: { href: 'contact.html#lokasi', label: 'Lihat info lokasi & jam buka' },
            next: ['Lokasi toko', 'Reservasi meja', 'Cara pesan']
        },
        {
            id: 'lokasi',
            keys: ['lokasi', 'alamat', 'dimana', 'di mana', 'maps', 'peta', ' arah ', 'cabang', 'tempatnya'],
            reply: 'Kedai kami berlokasi di Jl. Palembang No. 27, Air Raya, Tanjung Pandan, Kabupaten Belitung 33411.\nCiri khas bangunan kami adalah genteng merah dan ketersediaan bangku kayu panjang di area depan.',
            link: { href: 'contact.html#lokasi', label: 'Buka peta & petunjuk arah' },
            next: ['Jam buka', 'Kontak', 'Wisata Belitung']
        },
        {
            id: 'kontak',
            keys: ['kontak', 'telepon', 'telpon', 'nomor', 'whatsapp', ' wa ', 'hubungi', 'email'],
            reply: 'Anda dapat menghubungi kami melalui:\n• Telepon (Reservasi): 0817-1779-4014\n• WhatsApp (Pesan Antar/Tanya Jawab): 0878-9254-4939\n• Email (Kerja Sama): halo@sahangkitchen.id',
            link: { href: 'contact.html#hubungi', label: 'Buka halaman Kontak' },
            next: ['Reservasi meja', 'Kirim masukan', 'Jam buka']
        },
        {
            id: 'pesan',
            keys: ['cara pesan', 'pesan', 'order', 'beli', 'checkout', 'keranjang', 'memesan'],
            reply: 'Proses pemesanan melalui website:\n1. Buka halaman Menu, pilih hidangan, lalu tambahkan ke keranjang.\n2. Buka halaman Pesanan untuk memeriksa ringkasan.\n3. Lengkapi nama, WhatsApp, tipe pesanan, dan metode pembayaran.\n4. Tekan Konfirmasi Pesanan, lalu tunjukkan nomor pesanan tersebut ke kasir.',
            link: { href: 'menu.html', label: 'Mulai pesan sekarang' },
            next: ['Metode pembayaran', 'Bungkus atau makan di tempat', 'Harga']
        },
        {
            id: 'bayar',
            keys: ['bayar', 'pembayaran', 'qris', 'cash', 'tunai', 'transfer', 'pajak', 'metode'],
            reply: 'Kami menerima pembayaran secara Tunai, QRIS, dan Transfer Bank. Pajak sebesar 10% akan dihitung secara otomatis pada halaman Pesanan sebelum Anda melakukan konfirmasi.',
            next: ['Cara pesan', 'Bungkus atau makan di tempat', 'Promo']
        },
        {
            id: 'antar',
            keys: ['antar', 'delivery', 'pengiriman', 'bungkus', 'take away', 'takeaway', 'makan di tempat', 'dine in', 'gojek', 'grab'],
            reply: 'Tersedia pilihan makan di tempat (Dine In) atau dibungkus (Take Away) yang dapat dipilih pada halaman Pesanan.\nUntuk layanan pesan antar (Delivery), silakan hubungi tim kami via WhatsApp di 0878-9254-4939.',
            link: { href: 'contact.html#hubungi', label: 'Hubungi kami' },
            next: ['Cara pesan', 'Metode pembayaran', 'Jam buka']
        },
        {
            id: 'reservasi',
            keys: ['reservasi', 'booking', 'meja', 'rombongan', 'acara', 'ulang tahun', 'arisan'],
            reply: 'Untuk keperluan reservasi meja rombongan atau acara khusus, silakan hubungi 0817-1779-4014 selama jam operasional. Informasikan tanggal, waktu, dan jumlah tamu agar kami dapat menyiapkan tempat.',
            link: { href: 'contact.html#hubungi', label: 'Lihat kontak reservasi' },
            next: ['Jam buka', 'Lokasi toko', 'Kontak']
        },
        {
            id: 'apaitu',
            keys: ['apa itu', 'mie belitung itu', 'pengertian', 'definisi', 'jelaskan tentang'],
            reply: 'Mie Belitung adalah sajian mie kuning basah khas Pulau Belitung yang disiram dengan kaldu udang kental berwarna cokelat kemerahan.\nHidangan ini bercita rasa manis-gurih dan dilengkapi topping udang, tahu goreng, kentang, tauge, timun, serta emping.',
            link: { href: 'about.html', label: 'Baca selengkapnya di halaman About' },
            next: ['Sejarah Mie Belitung', 'Rahasia kuahnya', 'Daun simpor']
        },
        {
            id: 'sejarah',
            keys: ['sejarah', 'asal usul', 'awal mula', 'history', 'imigran', 'abad', 'dulu'],
            reply: 'Pada abad ke-19, pekerja tambang timah asal Tionghoa membawa tradisi mengolah mie kuning ke Belitung.\nDi sana, mie tersebut dipadukan dengan hasil laut dan rempah lokal Melayu. Pertemuan ini menghasilkan kuah kaldu udang khas yang resepnya diwariskan hingga menjadi ikon Tanjung Pandan.',
            link: { href: 'about.html#sejarah', label: 'Lihat linimasa sejarah' },
            next: ['Akulturasi budaya', 'Tradisi', 'Cerita legenda']
        },
        {
            id: 'toko',
            keys: ['toko', 'kedai', 'sahang kitchen', 'tentang kalian', 'pemilik', 'dapur kalian', 'siapa kalian'],
            reply: 'Sahang Kitchen Belitung adalah usaha kuliner keluarga di Tanjung Pandan. "Sahang" merupakan sebutan lokal untuk lada, rempah utama dalam kuliner pulau ini.\nKami berdedikasi menjaga resep otentik kaldu udang yang telah diwariskan secara turun-temurun.',
            link: { href: 'about.html', label: 'Kenali kami lebih dekat' },
            next: ['Lokasi toko', 'Jam buka', 'Rahasia kuahnya']
        },
        {
            id: 'akulturasi',
            keys: ['akulturasi', 'budaya', 'melayu', 'perpaduan', 'tionghoa', 'campuran'],
            reply: 'Bahan dasar mie kuning berasal dari tradisi kuliner Tionghoa, sementara teknik meracik kuah rempah dan penggunaan hasil laut lekat dengan budaya Melayu.\nMie Belitung adalah bentuk nyata akulturasi kedua budaya tersebut.',
            link: { href: 'about.html#sejarah', label: 'Baca soal akulturasi' },
            next: ['Sejarah Mie Belitung', 'Tradisi', 'Filosofi']
        },
        {
            id: 'kuah',
            keys: ['kuah', 'kaldu', 'rahasia', 'bumbu', 'rempah'],
            reply: 'Karakter utama kuah kami berasal dari kaldu udang murni yang direbus perlahan bersama bumbu dasar seperti lengkuas, kemiri, jahe, bawang merah, bawang putih, dan gula merah.\nHasilnya adalah kuah bertekstur kental dengan profil rasa manis-gurih.',
            link: { href: 'about.html#keunikan', label: 'Lihat keunikan kuah' },
            next: ['Resep lengkap', 'Topping', 'Rasanya seperti apa']
        },
        {
            id: 'resep',
            keys: ['resep', 'cara membuat', 'cara bikin', 'bikin sendiri', 'masak sendiri', 'bahan'],
            reply: 'Tahapan umumnya: tumis bumbu halus (bawang, jahe, kemiri, lengkuas), tuangkan kaldu udang, dan didihkan perlahan hingga mengental.\nRebus mie kuning, tata di atas piring beralas daun simpor, siram kuah, lalu tambahkan udang, tahu, kentang, tauge, timun, dan emping.',
            link: { href: 'about.html#komponen', label: 'Lihat komponen & cara penyajian' },
            next: ['Rahasia kuahnya', 'Daun simpor', 'Topping']
        },
        {
            id: 'simpor',
            keys: ['simpor', 'daun'],
            reply: 'Daun simpor merupakan tumbuhan berdaun lebar khas Belitung yang difungsikan sebagai alas piring. Saat terkena suhu panas dari mie dan kuah, daun ini akan melepaskan aroma alami yang memperkaya cita rasa hidangan.',
            link: { href: 'about.html#keunikan', label: 'Lihat keunikan lainnya' },
            next: ['Topping', 'Cara menyantap', 'Rahasia kuahnya']
        },
        {
            id: 'topping',
            keys: ['topping', 'isi', 'komponen', 'emping', 'tahu', 'tauge', 'kentang'],
            reply: 'Komposisi satu mangkuk Mie Belitung terdiri atas: mie kuning basah, udang segar, tahu goreng, kentang rebus, tauge, timun iris, dan emping melinjo. Semuanya kemudian disiram dengan kuah kaldu kental.',
            link: { href: 'about.html#komponen', label: 'Lihat komponen utama' },
            next: ['Level pedas', 'Alergi', 'Porsi']
        },
        {
            id: 'pedas',
            keys: ['pedas', 'sambal', 'cabai', 'cabe', 'level pedas'],
            reply: 'Profil rasa asli hidangan ini adalah manis-gurih, tidak pedas. Kami memisahkan sambal agar pengunjung dapat menyesuaikan tingkat kepedasan sesuai toleransi masing-masing.',
            next: ['Rasanya seperti apa', 'Cara menyantap', 'Lihat menu']
        },
        {
            id: 'rasa',
            keys: ['rasa', 'seperti apa', 'manis', 'gurih', 'tekstur', 'asin'],
            reply: 'Kombinasi rasa utamanya didominasi oleh manis-gurih dari kaldu udang, kehangatan dari jahe dan lengkuas, serta perpaduan tekstur antara kenyalnya mie, segarnya sayuran, dan renyahnya emping.',
            next: ['Level pedas', 'Rekomendasi', 'Cara menyantap']
        },
        {
            id: 'caramakan',
            keys: ['cara makan', 'cara menyantap', 'menyantap', 'santap', 'disantap', 'penyajian', 'disajikan'],
            reply: 'Kami menyarankan untuk mengaduk hidangan secara perlahan agar kuah meresap ke dalam mie. Tambahkan sambal bila perlu, dan remukkan emping di saat terakhir agar tekstur renyahnya tetap terjaga.',
            link: { href: 'about.html#komponen', label: 'Lihat cara penyajian' },
            next: ['Daun simpor', 'Level pedas', 'Alergi']
        },
        {
            id: 'tradisi',
            keys: ['tradisi', 'adat', 'hari raya', 'lebaran', 'imlek', 'kumpul keluarga'],
            reply: 'Dalam konteks budaya lokal, Mie Belitung kerap menjadi sajian utama pada acara pertemuan keluarga besar, hari raya, dan perayaan adat di Pulau Belitung.',
            link: { href: 'about.html#tradisi', label: 'Baca tradisi & legenda' },
            next: ['Cerita legenda', 'Filosofi', 'Akulturasi budaya']
        },
        {
            id: 'legenda',
            keys: ['legenda', 'mitos', 'konon', 'cerita rakyat'],
            reply: 'Masyarakat setempat meyakini bahwa resep asli kaldu udang hanya diwariskan kepada anggota keluarga internal demi menjaga otentisitas rasanya. Hal ini melahirkan variasi cita rasa yang unik di setiap kedai.',
            link: { href: 'about.html#tradisi', label: 'Baca legenda lengkapnya' },
            next: ['Rahasia kuahnya', 'Sejarah Mie Belitung', 'Filosofi']
        },
        {
            id: 'nama',
            keys: ['asal nama', 'asal mula nama', 'kenapa disebut', 'belitong', 'arti nama', 'kenapa namanya'],
            reply: 'Penamaan "Mie Belitung" merupakan representasi langsung dari daerah asalnya. Sebagian masyarakat lokal juga sering menyebutnya dengan pelafalan "Belitong".',
            link: { href: 'about.html#tradisi', label: 'Baca asal mula nama' },
            next: ['Sejarah Mie Belitung', 'Wisata Belitung', 'Perbedaan dengan mie lain']
        },
        {
            id: 'beda',
            keys: ['beda', 'perbedaan', 'bedanya', 'dibanding', 'bangka', 'mie lain', 'bakmi', 'dengan mie'],
            reply: 'Perbedaan utama terletak pada penggunaan kuah kaldu udang kental, mie basah berukuran agak tebal, serta alas daun simpor. Berbeda dengan olahan mie Nusantara lainnya yang umumnya menggunakan kuah kaldu bening berbahan daging.',
            link: { href: 'about.html#keunikan', label: 'Lihat keunikan & ciri khas' },
            next: ['Rahasia kuahnya', 'Daun simpor', 'Sejarah Mie Belitung']
        },
        {
            id: 'filosofi',
            keys: ['filosofi', 'makna', ' arti ', 'pelajaran', 'simbol'],
            reply: 'Sajian ini memiliki nilai historis yang merepresentasikan sejarah migrasi, kemampuan beradaptasi, serta harmonisasi dua kebudayaan yang berbeda di pesisir Belitung.',
            link: { href: 'about.html', label: 'Baca selengkapnya' },
            next: ['Akulturasi budaya', 'Tradisi', 'Kuliner Nusantara lain']
        },
        {
            id: 'gizi',
            keys: ['gizi', 'kalori', 'sehat', 'diet', 'nutrisi', 'lemak'],
            reply: 'Informasi nilai gizi spesifik (kalori) belum tersedia. Komposisi hidangan mencakup karbohidrat (mie, kentang), protein (udang, tahu), dan serat (tauge, timun). Jika ada pantangan kalori, kami sarankan untuk membatasi konsumsi kuah dan emping.',
            next: ['Alergi', 'Porsi', 'Lihat menu']
        },
        {
            id: 'alergi',
            keys: ['alergi', 'vegetarian', 'vegan', 'halal', 'seafood', 'kacang', 'gluten', 'pantangan'],
            reply: 'Mohon diperhatikan bahwa hidangan kami mengandung udang laut segar sehingga tidak diperuntukkan bagi yang memiliki alergi makanan laut atau menjalani pola makan vegetarian/vegan. Informasi lebih lanjut terkait komposisi dapat ditanyakan melalui WhatsApp 0878-9254-4939.',
            link: { href: 'contact.html#hubungi', label: 'Hubungi kami' },
            next: ['Topping', 'Kontak', 'Porsi']
        },
        {
            id: 'porsi',
            keys: ['porsi', 'kenyang', 'ukuran', 'besar', 'banyak'],
            reply: 'Standar penyajian satu porsi Mie Belitung dirancang cukup mengenyangkan untuk kebutuhan satu kali makan utama orang dewasa.',
            next: ['Harga', 'Cara pesan', 'Lihat menu']
        },
        {
            id: 'wisata',
            keys: ['wisata', 'liburan', 'tanjung pandan', 'pulau', 'pantai', 'laskar pelangi', 'berkunjung', 'ke belitung'],
            reply: 'Selain kulinernya, Pulau Belitung juga dikenal luas dengan destinasi wisata alamnya, terutama pantai berpasir putih dengan formasi batuan granit raksasa. Kedai kami siap menjadi perhentian bersantap Anda selama berada di Tanjung Pandan.',
            link: { href: 'contact.html#lokasi', label: 'Lihat lokasi kedai' },
            next: ['Lokasi toko', 'Jam buka', 'Sejarah Mie Belitung']
        },
        {
            id: 'nusantara',
            keys: ['nusantara', 'rendang', 'gudeg', 'rawon', 'papeda', 'coto', 'soto', 'betutu', 'daerah lain', 'kuliner lain'],
            reply: 'Mie Belitung merupakan salah satu ragam kekayaan kuliner Indonesia. Anda dapat mengeksplorasi dan mencatat daftar kuliner Nusantara lainnya melalui fitur Profil di website ini.',
            link: { href: 'profile.html#favorit', label: 'Buka daftar kuliner favorit' },
            next: ['Filosofi', 'Rekomendasi', 'Sejarah Mie Belitung']
        },
        {
            id: 'website',
            keys: ['website', 'situs', 'halaman', 'fitur', 'profil', 'profile', 'bintang'],
            reply: 'Fitur website kami meliputi halaman Home, About (profil kedai dan sejarah), Menu (pemesanan), serta Profile (catatan preferensi kuliner). Anda juga dapat menggunakan fitur penanda dan pencarian pada kotak dialog ini.',
            next: ['Lihat menu', 'Kuliner Nusantara lain', 'Kontak']
        },
        {
            id: 'promo',
            keys: ['promo', 'diskon', 'voucher', 'potongan', 'murah'],
            reply: 'Informasi mengenai promosi dan diskon khusus akan kami informasikan secara berkala. Anda dapat menanyakan program promosi yang sedang berlangsung melalui WhatsApp 0878-9254-4939.',
            next: ['Harga', 'Cara pesan', 'Kontak']
        },
        {
            id: 'komplain',
            keys: ['komplain', 'kritik', 'kecewa', 'masukan', 'ulasan', 'review', 'feedback'],
            reply: 'Kami memohon maaf apabila ada ketidaknyamanan selama pelayanan. Silakan sampaikan detail masukan Anda melalui formulir di halaman Kontak agar dapat segera ditindaklanjuti oleh manajemen.',
            link: { href: 'contact.html#ulasan', label: 'Tulis masukan' },
            next: ['Kontak', 'Jam buka', 'Lihat menu']
        },
        {
            id: 'terimakasih',
            keys: ['terima kasih', 'makasih', 'thanks', 'thank you', 'trims', ' thx '],
            reply: 'Terima kasih kembali atas kunjungan Anda. Silakan hubungi kami kembali jika ada informasi tambahan yang diperlukan.',
            next: ['Lihat menu', 'Cara pesan']
        },
        {
            id: 'pamit',
            keys: ['dadah', 'sampai jumpa', ' bye ', 'sudah cukup', 'selesai'],
            reply: 'Terima kasih atas waktu Anda. Seluruh riwayat obrolan ini akan tersimpan di sistem, sehingga Anda dapat melanjutkannya di waktu yang akan datang.',
            next: ['Lihat menu', 'Lokasi toko']
        },
        {
            id: 'humor',
            keys: ['lucu', 'jokes', ' joke ', 'lelucon', 'bercanda', 'humor'],
            reply: 'Kami berkomitmen untuk memberikan layanan yang profesional dan informatif. Ada hal terkait informasi produk yang dapat kami bantu saat ini?',
            next: ['Lihat menu', 'Rekomendasi']
        }
    ];

    const FALLBACKS = [
        'Mohon maaf, kami tidak menemukan informasi terkait kata kunci tersebut. Apakah Anda memiliki pertanyaan seputar menu, harga, jam operasional, atau cara pemesanan?',
        'Pertanyaan tersebut berada di luar basis data informasi yang kami miliki. Anda dapat menanyakan topik lain terkait layanan Sahang Kitchen Belitung.',
        'Informasi yang Anda cari belum tersedia dalam sistem kami. Anda dapat menghubungi tim layanan pelanggan kami secara langsung melalui halaman Kontak untuk bantuan lebih spesifik.'
    ];

    let fallbackIndex = 0;

    function normalize(text) {
        return ' ' + text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').replace(/^ | $/g, '') + ' ';
    }
    
    function findAnswer(text) {
        const norm = normalize(text);
        let best = null;
        let bestScore = 0;

        $.each(KNOWLEDGE, function (i, topic) {
            let score = 0;
            $.each(topic.keys, function (j, key) {
                if (norm.indexOf(key) !== -1) {
                    score += $.trim(key).length;
                }
            });
            if (score > bestScore) {
                bestScore = score;
                best = topic;
            }
        });

        if (best) return best;

        const reply = FALLBACKS[fallbackIndex % FALLBACKS.length];
        fallbackIndex++;
        return { id: 'fallback', reply: reply, link: null, next: DEFAULT_CHIPS };
    }

    let messages = [];
    let isReplying = false;
    let replyTimer = null;
    let idCounter = 0;

    if ($('link[href*="chatbot.css"]').length === 0) {
        $('head').append('<link rel="stylesheet" href="CSS/chatbot.css">');
    }
    if ($('link[href*="bootstrap-icons"]').length === 0) {
        $('head').append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">');
    }

    $('body').append('<div id="chatbot-placeholder"></div>');
    $('#chatbot-placeholder').load('chatbot.html', function (response, status) {
        if (status === 'error') return;
        initChatbot();
    });

    function loadMessages() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                if ($.isArray(data)) return data;
            }
        } catch (e) { }
        return [];
    }

    function saveMessages() {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(messages));
        } catch (e) { }
    }

    function timeLabel() {
        const now = new Date();
        const h = ('0' + now.getHours()).slice(-2);
        const m = ('0' + now.getMinutes()).slice(-2);
        return h + '.' + m;
    }

    function makeMessage(from, text, link) {
        idCounter++;
        return {
            id: Date.now() + '-' + idCounter,
            from: from,
            text: text,
            link: link || null,
            starred: false,
            time: timeLabel()
        };
    }

    function buildMessage(msg) {
        const $msg = $('<div class="cb-msg"></div>')
            .addClass(msg.from === 'user' ? 'cb-user' : 'cb-bot')
            .toggleClass('is-starred', !!msg.starred)
            .attr('data-id', msg.id);

        const $bubble = $('<div class="cb-bubble"></div>');
        $.each(msg.text.split('\n'), function (i, line) {
            $bubble.append($('<p class="cb-line"></p>').text(line));
        });

        if (msg.link) {
            const $link = $('<a class="cb-link"></a>')
                .attr('href', msg.link.href)
                .text(msg.link.label)
                .prepend('<i class="bi bi-arrow-right-circle-fill"></i> ');
            $bubble.append($link);
        }

        const $meta = $('<div class="cb-meta"></div>');
        $meta.append($('<span class="cb-time"></span>').text(msg.time));

        if (msg.from === 'bot') {
            const starIcon = msg.starred ? 'bi-star-fill' : 'bi-star';
            const $star = $('<button type="button" class="cb-act cb-star"></button>')
                .toggleClass('on', !!msg.starred)
                .attr('aria-pressed', msg.starred ? 'true' : 'false')
                .attr('aria-label', 'Tandai jawaban ini')
                .html('<i class="bi ' + starIcon + '"></i>');
            $meta.append($star);
        }

        $meta.append('<button type="button" class="cb-act cb-del" aria-label="Hapus pesan ini"><i class="bi bi-trash3"></i></button>');

        $msg.append($bubble).append($meta);
        return $msg;
    }

    function scrollBottom() {
        const $body = $('#cb-messages');
        $body.stop().animate({ scrollTop: $body[0].scrollHeight }, 250);
    }

    function renderAll() {
        $('#cb-list').empty();
        $.each(messages, function (i, msg) {
            $('#cb-list').append(buildMessage(msg));
        });
        applyFilter();
        $('#cb-messages').scrollTop($('#cb-messages')[0].scrollHeight);
    }

    function addMessage(from, text, link, isLive) {
        const msg = makeMessage(from, text, link);
        messages.push(msg);

        if (messages.length > MAX_MESSAGES) {
            messages.shift();
            $('#cb-list .cb-msg').first().remove();
        }

        saveMessages();
        $('#cb-list').append(buildMessage(msg));
        scrollBottom();

        if (isLive && from === 'bot' && !$('#cb-widget').hasClass('is-open')) {
            $('#cb-dot').addClass('show');
        }
    }

    function addWelcome() {
        addMessage('bot', 'Halo, selamat datang di layanan pelanggan interaktif Sahang Kitchen Belitung.\nSilakan sampaikan pertanyaan Anda terkait operasional kedai, daftar menu, atau informasi budaya kuliner kami. Anda juga dapat memilih dari beberapa topik yang kami sarankan di bawah ini.', null, false);
    }

    function setChips(list) {
        const $chips = $('#cb-chips').empty();
        $.each(list, function (i, label) {
            $chips.append($('<button type="button" class="cb-chip"></button>').text(label));
        });
    }

    function resetFilter() {
        $('#cb-search').val('');
        $('#cb-star-filter').removeClass('active').attr('aria-pressed', 'false');
        applyFilter();
    }

    function applyFilter() {
        const keyword = $.trim($('#cb-search').val()).toLowerCase();
        const starOnly = $('#cb-star-filter').hasClass('active');
        const filtering = keyword !== '' || starOnly;
        let shown = 0;

        $('#cb-list .cb-msg').each(function () {
            const $msg = $(this);
            const matchText = $msg.find('.cb-bubble').text().toLowerCase().indexOf(keyword) !== -1;
            const matchStar = !starOnly || $msg.hasClass('is-starred');
            const show = matchText && matchStar;
            $msg.toggleClass('cb-hidden', !show);
            if (show) shown++;
        });

        $('#cb-count').text(filtering ? shown + ' pesan cocok' : '');
        $('#cb-empty').toggleClass('cb-hidden', !(filtering && shown === 0));
    }

    function showTyping() {
        $('#cb-typing').removeClass('cb-hidden');
        scrollBottom();
    }

    function hideTyping() {
        $('#cb-typing').addClass('cb-hidden');
    }

    function sendUser(text) {
        const clean = $.trim(text);

        if (clean === '') {
            $('#cb-input').addClass('cb-shake');
            setTimeout(function () {
                $('#cb-input').removeClass('cb-shake');
            }, 400);
            return;
        }
        if (isReplying) return;

        resetFilter();
        addMessage('user', clean, null, false);
        $('#cb-input').val('');

        isReplying = true;
        $('#cb-send').prop('disabled', true);
        showTyping();

        const answer = findAnswer(clean);
        const delay = Math.min(600 + answer.reply.length * 6, 1800);

        replyTimer = setTimeout(function () {
            hideTyping();
            addMessage('bot', answer.reply, answer.link, true);
            setChips(answer.next || DEFAULT_CHIPS);
            isReplying = false;
            $('#cb-send').prop('disabled', false);
        }, delay);
    }

    function openChat() {
        $('#cb-widget').addClass('is-open');
        $('#cb-fab').attr('aria-expanded', 'true').attr('aria-label', 'Tutup layanan chat');
        $('#cb-panel').attr('aria-hidden', 'false');
        $('#cb-dot').removeClass('show');
        $('#cb-teaser').removeClass('show');
        scrollBottom();
        setTimeout(function () {
            $('#cb-input').trigger('focus');
        }, 300);
    }

    function closeChat() {
        $('#cb-widget').removeClass('is-open');
        $('#cb-fab').attr('aria-expanded', 'false').attr('aria-label', 'Buka layanan chat');
        $('#cb-panel').attr('aria-hidden', 'true');
    }

    function showTeaser() {
        let seen = false;
        try {
            seen = sessionStorage.getItem(TEASER_KEY) === '1';
        } catch (e) { }
        if (seen) return;

        setTimeout(function () {
            if ($('#cb-widget').hasClass('is-open')) return;
            $('#cb-teaser').text('Tanya informasi seputar Mie Belitung.').addClass('show');
            try {
                sessionStorage.setItem(TEASER_KEY, '1');
            } catch (e) { }
            setTimeout(function () {
                $('#cb-teaser').removeClass('show');
            }, 6000);
        }, 2000);
    }

    function initChatbot() {
        messages = loadMessages();
        if (messages.length === 0) {
            addWelcome();
        } else {
            renderAll();
        }
        setChips(DEFAULT_CHIPS);
        showTeaser();

        $('#cb-fab').on('click', function () {
            if ($('#cb-widget').hasClass('is-open')) {
                closeChat();
            } else {
                openChat();
            }
        });

        $('#cb-close').on('click', closeChat);

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $('#cb-widget').hasClass('is-open')) {
                closeChat();
            }
        });

        $('#cb-form').on('submit', function (e) {
            e.preventDefault();
            sendUser($('#cb-input').val());
        });

        $('#cb-chips').on('click', '.cb-chip', function () {
            sendUser($(this).text());
        });

        $('#cb-list').on('click', '.cb-star', function () {
            const $msg = $(this).closest('.cb-msg');
            const id = $msg.attr('data-id');
            let starred = false;

            $.each(messages, function (i, msg) {
                if (msg.id === id) {
                    msg.starred = !msg.starred;
                    starred = msg.starred;
                }
            });

            saveMessages();
            $msg.toggleClass('is-starred', starred);
            $(this).toggleClass('on', starred)
                .attr('aria-pressed', starred ? 'true' : 'false')
                .find('i').attr('class', starred ? 'bi bi-star-fill' : 'bi bi-star');
            applyFilter();
        });

        $('#cb-list').on('click', '.cb-del', function () {
            const $msg = $(this).closest('.cb-msg');
            const id = $msg.attr('data-id');

            messages = $.grep(messages, function (msg) {
                return msg.id !== id;
            });
            saveMessages();

            $msg.fadeOut(200, function () {
                $(this).remove();
                if (messages.length === 0) {
                    addWelcome();
                }
                applyFilter();
            });
        });

        $('#cb-clear').on('click', function () {
            $('#cb-clear-bar').toggleClass('cb-hidden');
        });

        $('#cb-clear-no').on('click', function () {
            $('#cb-clear-bar').addClass('cb-hidden');
        });

        $('#cb-clear-yes').on('click', function () {
            clearTimeout(replyTimer);
            hideTyping();
            isReplying = false;
            $('#cb-send').prop('disabled', false);

            messages = [];
            saveMessages();
            $('#cb-list').empty();
            resetFilter();
            addWelcome();
            setChips(DEFAULT_CHIPS);
            $('#cb-clear-bar').addClass('cb-hidden');
        });

        $('#cb-search-toggle').on('click', function () {
            const $bar = $('#cb-search-bar');
            $bar.toggleClass('cb-hidden');
            if ($bar.hasClass('cb-hidden')) {
                resetFilter();
            } else {
                $('#cb-search').trigger('focus');
            }
        });

        $('#cb-search').on('input', applyFilter);

        $('#cb-star-filter').on('click', function () {
            const active = !$(this).hasClass('active');
            $(this).toggleClass('active', active).attr('aria-pressed', active ? 'true' : 'false');
            applyFilter();
        });
    }
});