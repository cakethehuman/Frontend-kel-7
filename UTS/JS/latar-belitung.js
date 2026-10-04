(function ($) {
  if (!$) return;

  var VARIAN = ['senja', 'budaya', 'batik', 'kuliner', 'malam'];
  var WARNA = ['bb-c1', 'bb-c2', 'bb-c3', 'bb-c4'];

  function acak(min, max) { return Math.round(min + Math.random() * (max - min)); }

  function gelombang(atas, amp) {
    var d = 'M-160 ' + atas + ' Q-120 ' + (atas - amp) + ' -80 ' + atas;
    for (var x = 0; x <= 1600; x += 80) d += ' T' + x + ' ' + atas;
    return d + ' V220 H-160 Z';
  }

  var P = {};
  function bacaPalet() {
    var css = getComputedStyle(document.documentElement);
    function v(nama, fallback) {
      var x = css.getPropertyValue(nama).trim();
      return x || fallback;
    }
    P.utama = v('--primary-color', '#FF3131');
    P.sekunder = v('--secondary-color', '#A49F4D');
    P.gelap = v('--text-dark', '#393A3C');
    P.abu = v('--gray-color', '#757070');
    P.tua = v('--darker-brown', '#4A2814');
    P.roast = v('--roast-brown', '#8C4B26');
    P.kaya = v('--rich-brown', '#B06A3B');
    P.muda = v('--lighter-brown', '#B08968');
    P.krem = v('--bg-light', '#FFF8EA');
    P.pinch = v('--blob-peach', '#F5D5A0');
  }

  var IKON = {
    intan: '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M12 2l7.5 10L12 22 4.5 12z" fill="currentColor"/></svg>',
    kerang: '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M12 21 3 10a9 9 0 0 1 18 0z" fill="currentColor"/><path d="M12 21V6M12 21 7 8.5M12 21l5-12.5" stroke="#FFF8EA" stroke-width="1.4" fill="none"/></svg>',
    bintang: '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M12 2l2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L12 16.2 6.2 19.8l1.6-6.6L2.6 8.8l6.8-.5z" fill="currentColor"/></svg>',
    buih: '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
    kipas: '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M12 22 3 9A11 11 0 0 1 21 9Z" fill="currentColor"/><path d="M12 22V5.5M12 22 6.6 7.4M12 22l5.4-14.6" stroke="#FFF8EA" stroke-width="1.2" fill="none"/></svg>',
    gong: '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="12" cy="12" r="2.6" fill="currentColor"/></svg>',
    mangkuk: '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M3 10h18a9 9 0 0 1-18 0Z" fill="currentColor"/><path d="M6 10q1.5-2.4 3 0t3 0 3 0 3 0" fill="none" stroke="#FFF8EA" stroke-width="1.2"/><path d="M9.5 6.5q1.6-1.8 0-3.6M14.5 6.5q1.6-1.8 0-3.6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity=".7"/></svg>',
    sumpit: '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M4 20 19 5M8.5 21.5 21 9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    cabai: '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M6.5 7C4.5 13 8 18.5 14.5 19.5c4 .6 7-1.2 8-4.2-5.5 2.6-11 .2-12.6-6.1-.2-.8-.2-1.6-.1-2.2Z" fill="currentColor"/><path d="M7 6 4.5 3.5M7 6c1.4-.8 2.8-.6 3.8.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    limau: '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="currentColor"/><path d="M12 4.5v15M4.5 12h15M6.7 6.7l10.6 10.6M17.3 6.7 6.7 17.3" stroke="#FFF8EA" stroke-width="1.2"/><circle cx="12" cy="12" r="2" fill="#FFF8EA"/></svg>',
    uap: '<svg viewBox="0 0 24 60" width="100%" height="100%" aria-hidden="true"><path d="M12 58C4 46 20 38 12 26 5 15 18 9 12 2" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity=".6"/></svg>',
    ikan: '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M2.5 12C5.5 7.8 9.5 5.8 13.5 5.8c3.2 1.6 5.2 3.8 5.2 6.2s-2 4.6-5.2 6.2C9.5 18.2 5.5 16.2 2.5 12Z" fill="currentColor"/><path d="M18.7 12 24 7.8v8.4Z" fill="currentColor"/><circle cx="7.5" cy="10.8" r="1.1" fill="#FFF8EA"/></svg>',
    gelembung: '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="9" cy="9" r="1.6" fill="currentColor" opacity=".55"/></svg>'
  };

  function penari() {
    return '<circle cx="35" cy="13" r="7" fill="' + P.tua + '"/>' +
      '<circle cx="42" cy="6.5" r="3.2" fill="' + P.tua + '"/>' +
      '<path d="M35 20C33 30 31.5 38 30.5 50L39.5 50C38.5 38 37 30 35 20Z" fill="' + P.tua + '"/>' +
      '<path d="M33.5 25C41 21 48.5 17 56 13" stroke="' + P.tua + '" stroke-width="4.5" stroke-linecap="round" fill="none"/>' +
      '<path d="M57 13 47.5 6.5A10 10 0 0 1 66.5 7.5Z" fill="' + P.utama + '"/>' +
      '<path d="M57 13 50.5 5.6M57 13 56 3.6M57 13 61.5 5" stroke="' + P.krem + '" stroke-width="1.1" fill="none"/>' +
      '<circle cx="57" cy="13" r="2" fill="' + P.tua + '"/>' +
      '<path d="M33.5 27C26.5 31.5 21.5 36.5 18.5 42" stroke="' + P.tua + '" stroke-width="4.5" stroke-linecap="round" fill="none"/>' +
      '<path d="M30.5 50C22.5 65 19.5 82 18 104L52 104C50.5 82 47.5 65 39.5 50Z" fill="' + P.tua + '"/>' +
      '<path d="M28.5 55H41.5" stroke="' + P.krem + '" stroke-width="2" opacity=".85"/>' +
      '<path d="M31 30C24 35 20 43 19.5 52" stroke="' + P.utama + '" stroke-width="2.6" fill="none" opacity=".75"/>';
  }

  function rumah() {
    return '<path d="M14 52 150 2 286 52Z" fill="' + P.tua + '"/>' +
      '<rect x="34" y="52" width="232" height="36" fill="' + P.tua + '"/>' +
      '<rect x="58" y="62" width="24" height="15" fill="' + P.krem + '"/>' +
      '<path d="M70 62V77M58 69.5H82" stroke="' + P.tua + '" stroke-width="1.4"/>' +
      '<rect x="218" y="62" width="24" height="15" fill="' + P.krem + '"/>' +
      '<path d="M230 62V77M218 69.5H242" stroke="' + P.tua + '" stroke-width="1.4"/>' +
      '<rect x="136" y="60" width="28" height="28" fill="' + P.krem + '"/>' +
      '<rect x="12" y="88" width="276" height="10" rx="3" fill="' + P.tua + '"/>' +
      '<rect x="30" y="98" width="7" height="36" fill="' + P.tua + '"/>' +
      '<rect x="92" y="98" width="7" height="36" fill="' + P.tua + '"/>' +
      '<rect x="202" y="98" width="7" height="36" fill="' + P.tua + '"/>' +
      '<rect x="264" y="98" width="7" height="36" fill="' + P.tua + '"/>' +
      '<path d="M288 100 318 136M298 100 328 136" stroke="' + P.tua + '" stroke-width="5" stroke-linecap="round" fill="none"/>' +
      '<path d="M292 112H302M299 122H309M306 132H316" stroke="' + P.tua + '" stroke-width="4" stroke-linecap="round"/>';
  }

  function gong() {
    return '<rect x="2" y="4" width="42" height="6" rx="2" fill="' + P.tua + '"/>' +
      '<rect x="6" y="8" width="5" height="52" fill="' + P.tua + '"/>' +
      '<rect x="35" y="8" width="5" height="52" fill="' + P.tua + '"/>' +
      '<rect x="0" y="58" width="16" height="4" rx="1.5" fill="' + P.tua + '"/>' +
      '<rect x="30" y="58" width="16" height="4" rx="1.5" fill="' + P.tua + '"/>' +
      '<path d="M23 10V15" stroke="' + P.tua + '" stroke-width="2"/>' +
      '<circle cx="23" cy="30" r="13" fill="' + P.tua + '"/>' +
      '<circle cx="23" cy="30" r="8.5" fill="' + P.krem + '"/>' +
      '<circle cx="23" cy="30" r="3" fill="' + P.tua + '"/>';
  }

  function bedil() {
    return '<path d="M2 20 56 15 59 26 5 31Z" fill="' + P.tua + '"/>' +
      '<rect x="0" y="16.5" width="7" height="18" rx="2.5" fill="' + P.tua + '"/>' +
      '<circle cx="63" cy="20.5" r="6.5" fill="' + P.tua + '"/>' +
      '<path d="M14 33 52 29 55 41 17 45Z" fill="' + P.tua + '"/>' +
      '<circle cx="27" cy="48" r="9.5" fill="none" stroke="' + P.tua + '" stroke-width="5"/>' +
      '<circle cx="27" cy="48" r="2" fill="' + P.tua + '"/>' +
      '<circle cx="49" cy="46" r="9.5" fill="none" stroke="' + P.tua + '" stroke-width="5"/>' +
      '<circle cx="49" cy="46" r="2" fill="' + P.tua + '"/>';
  }

  function palem(x, y) {
    return '<g><path d="M' + x + ' ' + y + ' C' + (x - 4) + ' ' + (y - 32) + ' ' + (x + 2) + ' ' + (y - 52) + ' ' + (x + 12) + ' ' + (y - 68) + '" fill="none" stroke="' + P.roast + '" stroke-width="5" stroke-linecap="round"/>' +
      '<g class="bb-angin" fill="' + P.kaya + '">' +
      '<path d="M' + (x + 12) + ' ' + (y - 68) + ' C' + (x - 8) + ' ' + (y - 76) + ' ' + (x - 28) + ' ' + (y - 72) + ' ' + (x - 42) + ' ' + (y - 60) + ' C' + (x - 24) + ' ' + (y - 68) + ' ' + (x - 4) + ' ' + (y - 68) + ' ' + (x + 10) + ' ' + (y - 62) + ' Z"/>' +
      '<path d="M' + (x + 12) + ' ' + (y - 68) + ' C' + (x + 32) + ' ' + (y - 78) + ' ' + (x + 54) + ' ' + (y - 76) + ' ' + (x + 68) + ' ' + (y - 64) + ' C' + (x + 50) + ' ' + (y - 72) + ' ' + (x + 30) + ' ' + (y - 70) + ' ' + (x + 16) + ' ' + (y - 62) + ' Z"/>' +
      '<path d="M' + (x + 12) + ' ' + (y - 68) + ' C' + (x + 4) + ' ' + (y - 86) + ' ' + (x + 6) + ' ' + (y - 100) + ' ' + (x + 16) + ' ' + (y - 112) + ' C' + (x + 8) + ' ' + (y - 96) + ' ' + (x + 6) + ' ' + (y - 80) + ' ' + (x + 8) + ' ' + (y - 66) + ' Z"/>' +
      '<path d="M' + (x + 12) + ' ' + (y - 68) + ' C' + (x + 22) + ' ' + (y - 86) + ' ' + (x + 24) + ' ' + (y - 98) + ' ' + (x + 20) + ' ' + (y - 110) + ' C' + (x + 26) + ' ' + (y - 94) + ' ' + (x + 24) + ' ' + (y - 78) + ' ' + (x + 16) + ' ' + (y - 66) + ' Z"/>' +
      '</g>' +
      '<circle cx="' + (x + 10) + '" cy="' + (y - 64) + '" r="4" fill="' + P.roast + '"/><circle cx="' + (x + 17) + '" cy="' + (y - 61) + '" r="3.4" fill="' + P.roast + '"/></g>';
  }

  function bawahSenja() {
    return '<svg viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">' +
      '<circle class="bb-halo" cx="720" cy="92" r="58" fill="' + P.utama + '"/>' +
      '<circle cx="720" cy="92" r="32" fill="' + P.utama + '"/>' +
      '<path class="bb-camar" d="M940 60Q947 53 954 60 961 53 968 60"/>' +
      '<path class="bb-camar" d="M998 42Q1004 36 1010 42 1016 36 1022 42"/>' +
      '<g class="bb-sinar"><path fill="' + P.pinch + '" fill-opacity=".5" d="M-70 -10L105 9L280 -10L280 38L105 19L-70 38Z"/></g>' +
      '<g fill="' + P.tua + '"><ellipse cx="95" cy="196" rx="170" ry="50"/><ellipse cx="55" cy="146" rx="100" ry="40"/><ellipse cx="185" cy="140" rx="78" ry="34"/><ellipse cx="105" cy="100" rx="58" ry="28"/></g>' +
      '<g fill="' + P.tua + '"><ellipse cx="1345" cy="196" rx="160" ry="46"/><ellipse cx="1420" cy="156" rx="95" ry="38"/><ellipse cx="1305" cy="150" rx="62" ry="26"/></g>' +
      '<g>' +
      '<path d="M91 80 99.5 24 110.5 24 119 80Z" fill="' + P.tua + '"/>' +
      '<path d="M94.3 58 95.5 50 114.5 50 115.7 58Z" fill="' + P.krem + '"/>' +
      '<path d="M97.1 40 98.3 32 111.7 32 112.9 40Z" fill="' + P.krem + '"/>' +
      '<rect x="101" y="65" width="8" height="15" rx="3.5" fill="' + P.krem + '"/>' +
      '<rect x="95" y="19" width="20" height="5" rx="1.5" fill="' + P.tua + '"/>' +
      '<circle class="bb-halo" cx="105" cy="14" r="14" fill="' + P.pinch + '"/>' +
      '<rect x="99.5" y="9" width="11" height="10" rx="2" fill="' + P.pinch + '"/>' +
      '<path d="M97.5 9 105 1 112.5 9Z" fill="' + P.utama + '"/>' +
      '</g>' +
      palem(1310, 150) +
      '<g class="bb-gel-a"><path fill="' + P.muda + '" opacity=".55" d="' + gelombang(150, 8) + '"/></g>' +
      '<g class="bb-drift"><g class="bb-goyang">' +
      '<path d="M960 194V148" fill="none" stroke="' + P.tua + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M963 188V152L997 188Z" fill="' + P.tua + '"/>' +
      '<path d="M920 200 900 186M1000 200 1020 186" fill="none" stroke="' + P.tua + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M905 194Q960 212 1015 194 960 202 905 194Z" fill="' + P.tua + '"/>' +
      '</g></g>' +
      '<g class="bb-gel-b"><path fill="' + P.sekunder + '" opacity=".7" d="' + gelombang(176, 9) + '"/></g>' +
      '<g class="bb-gel-c"><path fill="' + P.tua + '" d="' + gelombang(200, 7) + '"/></g>' +
      '</svg>';
  }

  function bawahBudaya() {
    return '<svg viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">' +
      '<rect x="0" y="212" width="1440" height="6" fill="' + P.tua + '"/>' +
      '<g transform="translate(300 150)">' + gong() + '</g>' +
      '<g class="bb-lenggok"><g transform="translate(430 108)">' + penari() + '</g></g>' +
      '<g transform="translate(570 76)">' + rumah() + '</g>' +
      '<g class="bb-lenggok bb-lesat"><g transform="translate(992 108) scale(-1 1)">' + penari() + '</g></g>' +
      '<g transform="translate(1040 154)">' + bedil() + '</g>' +
      '<circle cx="150" cy="208" r="2.4" fill="' + P.sekunder + '" opacity=".7"/>' +
      '<circle cx="905" cy="208" r="2.4" fill="' + P.sekunder + '" opacity=".7"/>' +
      '<circle cx="1350" cy="208" r="2.4" fill="' + P.sekunder + '" opacity=".7"/>' +
      '</svg>';
  }

  function bawahBatik() {
    return '<svg viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">' +
      '<g fill="' + P.tua + '"><ellipse cx="80" cy="215" rx="150" ry="40"/><ellipse cx="20" cy="170" rx="90" ry="30"/><ellipse cx="190" cy="180" rx="70" ry="26"/>' +
      '<ellipse cx="1370" cy="215" rx="150" ry="40"/><ellipse cx="1430" cy="172" rx="90" ry="30"/><ellipse cx="1260" cy="182" rx="66" ry="24"/></g>' +
      '</svg><span class="bb-pita bb-p2" aria-hidden="true"><i></i></span>';
  }

  function bawahKuliner() {
    return '<svg viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">' +
      '<rect x="0" y="208" width="1440" height="6" fill="' + P.tua + '"/>' +
      '<rect x="185" y="84" width="9" height="126" fill="' + P.tua + '"/>' +
      '<rect x="466" y="84" width="9" height="126" fill="' + P.tua + '"/>' +
      '<rect x="170" y="58" width="320" height="12" fill="' + P.utama + '"/>' +
      '<path d="M170 70 L478 70 L478 76 Q467 88 456 76 Q445 88 434 76 Q423 88 412 76 Q401 88 390 76 Q379 88 368 76 Q357 88 346 76 Q335 88 324 76 Q313 88 302 76 Q291 88 280 76 Q269 88 258 76 Q247 88 236 76 Q225 88 214 76 Q203 88 192 76 Q181 88 170 76 Z" fill="' + P.utama + '"/>' +
      '<path d="M192 58V70M236 58V70M280 58V70M324 58V70M368 58V70M412 58V70M456 58V70" stroke="' + P.krem + '" stroke-width="5" opacity=".5" fill="none"/>' +
      '<path d="M430 84V100" stroke="' + P.tua + '" stroke-width="2" fill="none"/>' +
      '<circle class="bb-halo" cx="430" cy="106" r="13" fill="' + P.utama + '"/>' +
      '<circle class="bb-lampu" cx="430" cy="106" r="7" fill="' + P.utama + '"/>' +
      '<rect x="215" y="150" width="230" height="12" fill="' + P.tua + '"/>' +
      '<rect x="225" y="162" width="8" height="48" fill="' + P.tua + '"/>' +
      '<rect x="427" y="162" width="8" height="48" fill="' + P.tua + '"/>' +
      '<g class="bb-uap-1"><path d="M318 112C312 104 324 98 318 90 314 84 320 80 318 74" fill="none" stroke="' + P.abu + '" stroke-width="2.2" stroke-linecap="round" opacity=".4"/></g>' +
      '<g class="bb-uap-2"><path d="M348 112C342 105 354 99 348 91 344 85 350 81 348 75" fill="none" stroke="' + P.abu + '" stroke-width="2.2" stroke-linecap="round" opacity=".4"/></g>' +
      '<path d="M285 118H381Q381 150 333 150Q285 150 285 118Z" fill="' + P.tua + '"/>' +
      '<path d="M295 120q9-8 19 0t19 0 19 0 19 0" fill="none" stroke="' + P.krem + '" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M318 108 358 96M326 112 364 100" fill="none" stroke="' + P.tua + '" stroke-width="3" stroke-linecap="round"/>' +
      '<rect x="60" y="168" width="64" height="42" rx="7" fill="' + P.tua + '"/>' +
      '<circle cx="92" cy="164" r="4" fill="' + P.tua + '"/>' +
      '<path d="M54 176q-9 9 0 18M130 176q9 9 0 18" fill="none" stroke="' + P.tua + '" stroke-width="4" stroke-linecap="round"/>' +
      '<g class="bb-uap-2"><path d="M92 156C86 148 98 142 92 134 88 128 94 124 92 118" fill="none" stroke="' + P.abu + '" stroke-width="2.2" stroke-linecap="round" opacity=".4"/></g>' +
      '<rect x="560" y="158" width="210" height="11" rx="3" fill="' + P.tua + '"/>' +
      '<rect x="575" y="169" width="8" height="41" fill="' + P.tua + '"/>' +
      '<rect x="630" y="169" width="8" height="41" fill="' + P.tua + '"/>' +
      '<rect x="685" y="169" width="8" height="41" fill="' + P.tua + '"/>' +
      '<rect x="740" y="169" width="8" height="41" fill="' + P.tua + '"/>' +
      palem(1300, 168) +
      '<g fill="' + P.tua + '"><ellipse cx="1285" cy="196" rx="60" ry="16"/><ellipse cx="1355" cy="201" rx="52" ry="14"/><ellipse cx="1240" cy="203" rx="40" ry="10"/></g>' +
      '<path class="bb-camar" d="M980 60Q987 53 994 60 1001 53 1008 60"/>' +
      '</svg>';
  }

  function bawahMalam() {
    return '<svg viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">' +
      '<g class="bb-gel-a"><path fill="' + P.abu + '" opacity=".4" d="' + gelombang(150, 8) + '"/></g>' +
      '<g fill="' + P.gelap + '"><ellipse cx="90" cy="204" rx="180" ry="44"/><ellipse cx="40" cy="168" rx="110" ry="34"/><ellipse cx="200" cy="172" rx="80" ry="28"/></g>' +
      '<g fill="' + P.gelap + '"><ellipse cx="1350" cy="204" rx="180" ry="44"/><ellipse cx="1400" cy="168" rx="110" ry="34"/><ellipse cx="1240" cy="172" rx="80" ry="28"/></g>' +
      '<g class="bb-drift"><g class="bb-goyang">' +
      '<path d="M352 194V148M352 148h16" fill="none" stroke="' + P.gelap + '" stroke-width="3" stroke-linecap="round"/>' +
      '<circle class="bb-halo" cx="368" cy="154" r="12" fill="' + P.utama + '"/>' +
      '<circle class="bb-lampu" cx="368" cy="154" r="5.5" fill="' + P.utama + '"/>' +
      '<path d="M300 194Q352 210 404 194 352 202 300 194Z" fill="' + P.gelap + '"/>' +
      '<ellipse class="bb-kilau" cx="368" cy="200" rx="13" ry="2.6" fill="' + P.utama + '"/>' +
      '</g></g>' +
      '<g class="bb-drift" style="animation-delay:-9s"><g class="bb-goyang" style="animation-delay:-2s">' +
      '<path d="M600 192V154M600 154h14" fill="none" stroke="' + P.gelap + '" stroke-width="3" stroke-linecap="round"/>' +
      '<circle class="bb-halo" cx="614" cy="160" r="10" fill="' + P.utama + '"/>' +
      '<circle class="bb-lampu" cx="614" cy="160" r="4.5" fill="' + P.utama + '"/>' +
      '<path d="M560 192Q600 206 640 192 600 199 560 192Z" fill="' + P.gelap + '"/>' +
      '<ellipse class="bb-kilau" cx="614" cy="197" rx="10" ry="2.2" fill="' + P.utama + '"/>' +
      '</g></g>' +
      '<g class="bb-gel-b"><path fill="' + P.gelap + '" opacity=".55" d="' + gelombang(176, 9) + '"/></g>' +
      '<g class="bb-gel-c"><path fill="' + P.gelap + '" d="' + gelombang(200, 7) + '"/></g>' +
      '</svg>';
  }

  function atasSenja() {
    return '<svg viewBox="0 0 1440 150" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">' +
      '<g class="bb-awan-k" fill="' + P.tua + '"><ellipse cx="150" cy="54" rx="92" ry="34"/><ellipse cx="238" cy="42" rx="60" ry="26"/><ellipse cx="78" cy="40" rx="54" ry="24"/></g>' +
      '<g class="bb-awan-k2" fill="' + P.tua + '"><ellipse cx="1205" cy="40" rx="72" ry="26"/><ellipse cx="1285" cy="32" rx="46" ry="20"/></g>' +
      '<path class="bb-camar" d="M840 46Q847 39 854 46 861 39 868 46"/>' +
      '<path class="bb-camar" d="M906 30Q912 24 918 30 924 24 930 30"/>' +
      '<circle cx="520" cy="26" r="1.8" fill="' + P.utama + '"/><circle cx="700" cy="62" r="1.5" fill="' + P.utama + '"/><circle cx="1050" cy="24" r="1.6" fill="' + P.utama + '"/><circle cx="380" cy="90" r="1.4" fill="' + P.sekunder + '"/><circle cx="1130" cy="96" r="1.4" fill="' + P.sekunder + '"/>' +
      '<g class="bb-terbang-1"><path class="bb-camar" d="M0 0Q7 -7 14 0 21 -7 28 0"/></g>' +
      '<g class="bb-terbang-2"><path class="bb-camar" d="M0 0Q6 -6 12 0 18 -6 24 0"/></g>' +
      '</svg>';
  }

  function atasBudaya() {
    var titik = [[136, 22], [282, 28], [428, 32], [574, 35], [720, 36], [866, 35], [1012, 32], [1158, 28], [1304, 22]];
    var warna = [P.utama, P.sekunder, P.tua];
    var genap = '', ganjil = '';
    for (var i = 0; i < titik.length; i++) {
      var b = '<path d="M' + titik[i][0] + ' ' + titik[i][1] + 'h24l-12 26Z" fill="' + warna[i % 3] + '"/>';
      if (i % 2 === 0) genap += b; else ganjil += b;
    }
    return '<svg viewBox="0 0 1440 150" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">' +
      '<path d="M-10 16Q720 62 1450 16" fill="none" stroke="' + P.tua + '" stroke-width="2.5"/>' +
      '<g class="bb-layu">' + genap + '</g>' +
      '<g class="bb-layu bb-lambat">' + ganjil + '</g>' +
      '<circle cx="120" cy="86" r="2" fill="' + P.utama + '"/><circle cx="720" cy="100" r="2" fill="' + P.sekunder + '"/><circle cx="1330" cy="88" r="2" fill="' + P.utama + '"/>' +
      '</svg>';
  }

  function atasBatik() {
    return '<span class="bb-pita bb-p1" aria-hidden="true"><i></i></span>';
  }

  function lentera(x, y, menyala, delay) {
    var isi = '<path d="M' + x + ' ' + y + 'v12" stroke="' + P.tua + '" stroke-width="2" fill="none"/>' +
      '<rect x="' + (x - 7) + '" y="' + (y + 12) + '" width="14" height="5" rx="2" fill="' + P.tua + '"/>';
    if (menyala) {
      isi += '<circle class="bb-halo" cx="' + x + '" cy="' + (y + 26) + '" r="14" fill="' + P.utama + '"/>' +
        '<circle class="bb-lampu" cx="' + x + '" cy="' + (y + 26) + '" r="8" fill="' + P.utama + '"/>';
    } else {
      isi += '<circle cx="' + x + '" cy="' + (y + 26) + '" r="8" fill="' + P.tua + '"/>';
    }
    return '<g class="bb-layu" style="animation-delay:' + delay + 's">' + isi + '</g>';
  }

  function atasKuliner() {
    return '<svg viewBox="0 0 1440 150" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">' +
      '<path d="M0 20Q360 60 720 28 1080 60 1440 20" fill="none" stroke="' + P.tua + '" stroke-width="2.5"/>' +
      lentera(180, 35, false, 0) +
      lentera(360, 42, true, -1.1) +
      lentera(540, 39, false, -2.2) +
      lentera(900, 39, true, -3.3) +
      lentera(1080, 42, false, -4.4) +
      lentera(1260, 35, false, -5.5) +
      '</svg>';
  }

  function atasMalam() {
    var b = '';
    var pos = [[140, 30, 1.8, 0], [320, 64, 1.4, -1.1], [520, 26, 1.9, -2.2], [660, 58, 1.4, -1.7], [860, 34, 1.7, 0], [1000, 80, 1.3, -2.6], [380, 96, 1.3, -0.8], [740, 100, 1.4, -1.9], [1340, 110, 1.5, -0.5]];
    for (var i = 0; i < pos.length; i++) {
      b += '<circle class="bb-kedip" style="animation-delay:' + pos[i][3] + 's" cx="' + pos[i][0] + '" cy="' + pos[i][1] + '" r="' + pos[i][2] + '" fill="' + P.abu + '"/>';
    }
    return '<svg viewBox="0 0 1440 150" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">' +
      b +
      '<circle class="bb-halo-b" cx="1250" cy="44" r="38" fill="' + P.sekunder + '"/>' +
      '<circle cx="1250" cy="44" r="20" fill="' + P.krem + '" stroke="' + P.gelap + '" stroke-width="3"/>' +
      '<circle cx="1243" cy="38" r="3" fill="' + P.abu + '" opacity=".5"/><circle cx="1257" cy="50" r="2.2" fill="' + P.abu + '" opacity=".5"/>' +
      '<g class="bb-awan-k" fill="' + P.gelap + '"><ellipse cx="190" cy="96" rx="70" ry="16"/><ellipse cx="250" cy="88" rx="44" ry="12"/></g>' +
      '<g class="bb-awan-k2" fill="' + P.gelap + '"><ellipse cx="880" cy="104" rx="56" ry="13"/></g>' +
      '</svg>';
  }

  function sebar($l, jenis, jml) {
    for (var i = 0; i < jml; i++) {
      var j = jenis[i % jenis.length];
      $l.append($('<span class="bb-ambang ' + WARNA[i % 4] + '"></span>').html(IKON[j]).css({
        left: acak(2, 94) + '%',
        top: acak(8, 84) + '%',
        width: acak(18, 34) + 'px',
        height: acak(18, 34) + 'px',
        opacity: (0.05 + Math.random() * 0.05).toFixed(2),
        animationDuration: acak(9, 17) + 's',
        animationDelay: '-' + acak(0, 12) + 's'
      }));
    }
  }

  function naik($l, jenis, jml, warnaKhusus) {
    for (var i = 0; i < jml; i++) {
      var j = jenis[i % jenis.length];
      var w = warnaKhusus || WARNA[i % 4];
      $l.append($('<span class="bb-naik ' + w + '"></span>').html(IKON[j]).css({
        left: acak(2, 94) + '%',
        width: acak(14, 28) + 'px',
        height: acak(30, 60) + 'px',
        opacity: (0.05 + Math.random() * 0.05).toFixed(2),
        animationDuration: acak(24, 48) + 's',
        animationDelay: '-' + acak(0, 46) + 's'
      }));
    }
  }

  function renang($l, jml) {
    for (var i = 0; i < jml; i++) {
      $l.append(
        $('<span class="bb-swim ' + (i % 2 ? 'bb-c5 ' : 'bb-c2 ') + '"></span>')
          .html(IKON.ikan)
          .css({
            top: acak(10, 62) + '%',
            width: acak(26, 40) + 'px',
            height: acak(16, 24) + 'px',
            opacity: (0.07 + Math.random() * 0.06).toFixed(2),
            animationDuration: acak(22, 40) + 's',
            animationDelay: '-' + acak(0, 30) + 's'
          })
      );
    }
  }

  function pasang() {
    if ($('.bb-latar').length) return;
    bacaPalet();
    var v = (document.body.getAttribute('data-bg') || 'senja').toLowerCase();
    if (VARIAN.indexOf(v) === -1) v = 'senja';

    var $l = $('<div class="bb-latar bb-' + v + '" aria-hidden="true"></div>');
    var atas = '', bawah = '';

    if (v === 'senja') { atas = atasSenja(); bawah = bawahSenja(); naik($l, ['kerang', 'bintang', 'buih'], 9); }
    else if (v === 'budaya') { atas = atasBudaya(); bawah = bawahBudaya(); sebar($l, ['kipas', 'intan', 'gong'], 8); }
    else if (v === 'batik') { atas = atasBatik(); bawah = bawahBatik(); sebar($l, ['intan', 'kerang', 'bintang'], 9); }
    else if (v === 'kuliner') { atas = atasKuliner(); bawah = bawahKuliner(); sebar($l, ['mangkuk', 'sumpit', 'cabai', 'limau'], 8); naik($l, ['uap'], 5, 'bb-c5'); }
    else if (v === 'malam') { atas = atasMalam(); bawah = bawahMalam(); naik($l, ['gelembung'], 6, 'bb-c5'); renang($l, 4); }

    if (atas) $l.append('<div class="bb-atas">' + atas + '</div>');
    if (bawah) $l.append('<div class="bb-bawah">' + bawah + '</div>');
    $('body').append($l);
  }

  $(pasang);

  window.BelitungOrnamen = window.BelitungOrnamen || {};
  window.BelitungOrnamen.latar = pasang;
})(window.jQuery);