(function () {
  'use strict';
  var C = window.WEDDING;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  // Tham số khách: đọc cả ?… và #… (link mới để tên trong #, Messenger vẫn dùng ảnh xem trước của trang gốc)
  var QP = new URLSearchParams();
  try {
    new URLSearchParams(location.search).forEach(function (v, k) { QP.set(k, v); });
    new URLSearchParams(location.hash.replace(/^#/, '')).forEach(function (v, k) { QP.set(k, v); });
  } catch (e) {}

  // Ngôn ngữ: #lang=ja thì thiệp tiếng Nhật
  var JA = (QP.get('lang') || '').toLowerCase() === 'ja';
  function L(vi, ja) { return JA ? ja : vi; }

  // ---------- Thiệp riêng nhà trai / nhà gái (…/nha-trai/, …/nha-gai/ hoặc ?ben=trai|gai) ----------
  var SIDE = '';
  try { SIDE = (document.documentElement.getAttribute('data-side') || QP.get('ben') || '').toLowerCase(); } catch (e) {}
  var SD = SIDE && C.sides && C.sides[SIDE];
  if (SD) {
    var sd = SD.date || {};
    C.date = { day: sd.day || C.date.day, month: C.date.month, year: C.date.year, hour: sd.hour != null ? sd.hour : C.date.hour, minute: sd.minute != null ? sd.minute : C.date.minute, place: sd.place || C.date.place };
    C.secondDay = null; C.extraDays = [];
    if (SD.venues) C.venues = C.venues.filter(function (v, i) { return SD.venues.indexOf(i) > -1; });
    if (SD.schedule) C.schedule = SD.schedule;
    if (SD.venueLabel) C.venues.forEach(function (v) { v.label = SD.venueLabel; });
    document.body.classList.add('side-' + SIDE);
    document.querySelectorAll('[data-dates]').forEach(function (n) { n.textContent = n.textContent.replace('28 & 29', pad(C.date.day)); });
    if (SIDE === 'gai') {
      // Thiệp nhà gái: tên cô dâu đứng trước
      var h = $('.hero h1'), sp = h.querySelectorAll('span'); h.insertBefore(sp[1], sp[0]); h.appendChild(sp[0]);
      var es = $('.env-letter .script'); if (es) es.innerHTML = 'Thu <i>&amp;</i> Nghĩa';
      var n1 = $('.inv-names .n1'), n2 = $('.inv-names .n2'); n1.textContent = 'Hoài Thu'; n2.textContent = 'Tuấn Nghĩa';
      var sg = $('.thanks .sig'); if (sg) sg.textContent = 'Hoài Thu & Tuấn Nghĩa';
      document.title = document.title.replace('Tuấn Nghĩa & Hoài Thu', 'Hoài Thu & Tuấn Nghĩa');
    }
  }

  // ---------- Xưng hô: mặc định bạn – mình (bạn bè); ?xh=chi | anh | anhchi thì xưng em; ?xh=di thì cô dâu xưng dì, gọi khách là cháu ----------
  var XH = '';
  try { XH = JA ? '' : (QP.get('xh') || '').toLowerCase(); } catch (e) {}
  var YOU = { chi: 'chị', anh: 'anh', anhchi: 'anh chị', di: 'cháu' }[XH] || '';
  var ME = XH === 'di' ? 'dì' : 'em', WE = XH === 'di' ? 'dì' : 'tụi em', A = XH === 'di' ? '' : ' ạ';
  var P = YOU ? { you: YOU, me: ME, we: WE, a: A, nha: ' nha' } : { you: 'bạn', me: 'mình', we: 'chúng mình', a: '', nha: ' nhé' };
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  if (YOU) {
    document.documentElement.setAttribute('data-xh', XH);
    var T = function (sel, text, html) { var n = $(sel); if (n) n[html ? 'innerHTML' : 'textContent'] = text; };
    T('#heroGuest', cap(YOU)); T('#invGuest', cap(YOU));
    T('.announce', 'Sau 7 năm bên nhau, ' + WE + ' chính thức về chung một nhà');
    T('.inv-to', 'Tới chung vui<br>trong ngày cưới của ' + WE, true);
    T('#cdDone', 'Hôm nay là ngày cưới của ' + WE + '!');
    T('.venue h2', 'Hẹn gặp ' + YOU + ' tại');
    T('.rsvp h2', cap(YOU) + ' sẽ đến chứ?');
    T('.rsvp .sub', cap(YOU) + ' phản hồi giúp ' + WE + ' để ' + WE + ' chuẩn bị chu đáo hơn' + A + '.');
    T('.rsvp legend', cap(YOU) + ' sẽ tham dự chứ?');
    var sp = document.querySelectorAll('.rsvp .seg span'); if (sp.length > 1) { sp[0].textContent = 'Có, ' + YOU + ' sẽ đến'; sp[1].textContent = 'Tiếc quá, ' + YOU + ' bận mất rồi'; }
    var sideLb = $('.rsvp .row2 label:last-child'); if (sideLb && sideLb.firstChild) sideLb.firstChild.textContent = cap(YOU) + ' là khách\n          ';
    var wl = $('#wishForm label'); if (wl && wl.firstChild) wl.firstChild.textContent = 'Tên của ' + YOU;
    ['#rsvpName', '#wishName'].forEach(function (q) { var x = $(q); if (x) x.placeholder = 'Tên của ' + YOU; });
    var ta = $('#wishForm textarea'); if (ta) ta.placeholder = 'Viết đôi lời gửi ' + WE + '…';
    T('.gift .sub', 'Nếu không thể đến chung vui, ' + YOU + ' có thể gửi lời chúc phúc qua đây' + A + '.');
    T('.thanks-in p', 'Cảm ơn ' + YOU + ' đã ghé xem thiệp của ' + WE + '. Có ' + YOU + ' tới chung vui là món quà ý nghĩa nhất với ' + WE + A + '!');
    T('.nick-sub', 'Thiệp sẽ mời đúng tên này, và tên này cũng hiện cùng lời chúc của ' + YOU + '.');
    (C.chat || []).forEach(function (m) { m.text = m.text.replace('tụi mình', WE); });
  }

  if (JA) (function () {
    document.documentElement.lang = 'ja'; document.documentElement.setAttribute('data-lang', 'ja');
    var lk = document.createElement('link'); lk.rel = 'stylesheet'; lk.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;500;600&display=swap'; document.head.appendChild(lk);
    var T = function (sel, text, html, all) { (all ? document.querySelectorAll(sel) : [$(sel)]).forEach(function (n) { if (n) n[html ? 'innerHTML' : 'textContent'] = text; }); };
    var A = function (sel, attr, v) { document.querySelectorAll(sel).forEach(function (n) { n.setAttribute(attr, v); }); };
    T('.door-hint', 'シーリングをタップして開封'); T('#tapHint', 'タップして開く');
    T('.hero .eyebrow', 'ご招待'); T('#heroGuest', 'ゲストの皆さま');
    var fam = document.querySelectorAll('.fam-grid > div:not(.cheers)');
    fam.forEach(function (d) { var e = d.querySelector('.eyebrow'); if (e) e.textContent = /trai/i.test(e.textContent) ? '新郎側' : '新婦側'; });
    document.querySelectorAll('.parent').forEach(function (n) { n.textContent = n.textContent.replace(/^Ông\s+/, '父　').replace(/^Bà\s+/, '母　'); });
    T('.announce', '7年の時を経て、私たちは結婚することになりました');
    var roles = document.querySelectorAll('.couple-names .role'); if (roles.length > 1) { roles[0].textContent = '新郎'; roles[1].textContent = '新婦'; }
    T('.inv-kinh', 'ご招待'); T('#invGuest', 'ゲストの皆さま');
    T('.inv-to', '私たちの結婚披露宴に<br>ぜひお越しください', true);
    var bl = document.querySelectorAll('.banner-l'); if (bl[0]) bl[0].textContent = 'Forever'; if (bl[1]) bl[1].textContent = 'Just Married';
    T('.chat-who span', '<i></i>アクティブ', true);
    T('.q-tx', '出会ってくれてありがとう。何気ない毎日が、かけがえのない思い出になりました。');
    var cd = document.querySelectorAll('#count span'); ['日', '時間', '分', '秒'].forEach(function (t, i) { if (cd[i]) cd[i].textContent = t; });
    T('#cdDone', '今日は私たちの結婚式です！');
    T('.venue h2', 'Venue'); T('.rsvp h2', 'Will you join us?'); T('.wishes h2', 'Messages'); T('.gift h2', 'Wedding gift');
    T('.rsvp .sub', 'ご出欠をお知らせください。準備の参考にさせていただきます。');
    var rl = $('#rsvpForm label'); if (rl && rl.firstChild) rl.firstChild.textContent = 'お名前';
    T('.rsvp legend', 'ご出席いただけますか？');
    var sp = document.querySelectorAll('.rsvp .seg span'); if (sp.length > 1) { sp[0].textContent = 'はい、出席します'; sp[1].textContent = '残念ながら欠席します'; }
    var labs = document.querySelectorAll('.rsvp .row2 > label'); if (labs[0] && labs[0].firstChild) labs[0].firstChild.textContent = '人数\n          '; if (labs[1] && labs[1].firstChild) labs[1].firstChild.textContent = 'ゲスト区分\n          ';
    document.querySelectorAll('.rsvp select[name=side] option').forEach(function (o) { o.value = o.value || o.textContent; o.textContent = /trai/i.test(o.value) ? '新郎側' : '新婦側'; });
    T('#rsvpForm button[type=submit]', '送信する');
    var wl = document.querySelectorAll('#wishForm label'); if (wl[0] && wl[0].firstChild) wl[0].firstChild.textContent = 'お名前'; if (wl[1] && wl[1].firstChild) wl[1].firstChild.textContent = 'メッセージ';
    A('#rsvpName', 'placeholder', 'お名前'); A('#wishName', 'placeholder', 'お名前'); A('#wishForm textarea', 'placeholder', 'お二人へのメッセージをどうぞ…');
    T('#wishForm button[type=submit]', 'メッセージを送る');
    T('.gift .sub', 'ご祝儀はこちらからお送りいただくこともできます。'); T('#giftBtn', 'ご祝儀ボックスを開く');
    T('#giftTitle', 'ご祝儀'); T('.sheet-close', '閉じる');
    T('.thanks-in p', '招待状をご覧いただきありがとうございます。皆さまにお会いできるのを心より楽しみにしています！');
    T('#svTime', 'たった今'); T('footer', (SD ? (SIDE === 'gai' ? '2026.11.29' : '2026.11.28') : '2026.11.28 & 29') + ' · Hải Phòng');
    T('#railShare span', 'シェア'); A('#liveMsg', 'placeholder', 'メッセージを送る…');
    T('#nickTitle', 'ニックネーム'); T('.nick-sub', 'メッセージと一緒に表示されるお名前です。'); A('#nickIn', 'placeholder', '例：たなか、Mai…'); T('#nickForm button[type=submit]', '保存する');
    A('.sheet-x', 'aria-label', '閉じる');
    // Nội dung trong config
    C.chat = [
      { from: 'b', text: '私たち、日本で出会ってどれくらい経つっけ？🤔' },
      { from: 'g', text: 'もう7年だよ。異国の地で偶然出会ったあの日から 🇯🇵' },
      { from: 'b', text: '7回の桜、7回の雪…あっという間だね 🌸❄️' },
      { from: 'g', text: '一緒に学んで、働いて、ホームシックの日も乗り越えてきたね 🏠' },
      { from: 'g', text: 'これからの人生もずっと一緒にいたい。結婚してくれる？💍' },
      { from: 'b', text: 'はい、喜んで！❤️', react: '❤️' },
      { from: 'g', text: 'じゃあ、みんなをお祝いに招待しよう 🥂🎉' }
    ];
    var VN = function (pl, isHotel) { if (pl) pl.name = isHotel ? 'Hải Đăng ホテル' : '新婦の実家'; };
    C.venues.forEach(function (v) {
      var hotel = /Hải Đăng/.test(v.name);
      v.label = hotel ? '新郎側 披露宴 · 2026年11月28日（土）' : '新婦側 披露宴 · 2026年11月29日（日）';
      v.time = hotel ? '11:00 開宴' : '10:30 開宴';
      if (hotel) v.hall = 'Cung Happy Place · 1階 · Hải Đăng ウェディングセンター';
      v.name = hotel ? 'Hải Đăng ホテル' : '新婦の実家';
    });
    VN(C.date.place, /Hải Đăng/.test(C.date.place && C.date.place.name)); if (C.secondDay) VN(C.secondDay.place, false);
    var SN = ['プロポーズ 💍', '双喜 囍', 'お花畑 🌸', 'ガーデン 🤍', '夕焼け 🌇'];
    (C.stories || []).forEach(function (g, i) { if (SN[i]) g.name = SN[i]; });
    var SC = [['受付', 'ゲストのお出迎え・記念撮影'], ['挙式', '指輪の交換・乾杯'], ['披露宴', 'みんなでお祝い']];
    (C.schedule || []).forEach(function (x, i) { if (SC[i]) { x.title = SC[i][0]; x.note = SC[i][1]; } });
    C.seedWishes = [
      { name: 'Yuki', message: 'ご結婚おめでとうございます！末永くお幸せに 💐' },
      { name: '田中さん', message: 'お二人とも本当におめでとう！素敵な家庭を築いてね 🥂' },
      { name: 'Mai', message: '7年間ずっと見てきたよ。本当におめでとう！🥰' },
      { name: '佐藤', message: '写真がとても素敵です！お幸せに ✨' },
      { name: 'Ken', message: 'Congratulations! 二人の新しい門出を心からお祝いします 🎉' },
      { name: '鈴木', message: 'ご結婚おめでとう！ベトナムでの結婚式、楽しんでね 🇻🇳' },
      { name: 'Aoi', message: 'Thuちゃん、とってもきれい！おめでとう 💕' },
      { name: '山本', message: 'Nghiaさん、おめでとうございます！幸せな家庭を 🏠' },
      { name: 'Haruka', message: '東京の思い出がたくさんだね。末永くお幸せに 🌸' },
      { name: '中村', message: '心よりお祝い申し上げます。笑顔あふれる毎日を 😊' }
    ];
  })();

  // ---------- Tên khách từ link ?guestName=... (vẫn nhận ?to=... của thiệp cũ) ----------
  var guest = '';
  try {
    var q = QP;
    guest = (q.get('guestName') || q.get('to') || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  } catch (e) {}
  // Tên hiện trên thiệp: biệt danh khách tự đặt (nếu có) được ưu tiên, sau đó tới tên trên link
  function showGuest(n, flash) {
    if (!n) return;
    $('#heroGuest').textContent = n;
    $('#invGuest').textContent = n;
    var og = $('#openerGuest'); if (og) { og.textContent = L('Thân gửi ' + n, n + ' へ'); og.hidden = false; }
    var dg = $('#doorGuest'); if (dg) { dg.textContent = L('Thân gửi ' + n, n + ' へ'); dg.hidden = false; }
    document.title = L('Thân mời ', 'ご招待 · ') + n + (SIDE === 'gai' ? ' · Hoài Thu & Tuấn Nghĩa' : ' · Tuấn Nghĩa & Hoài Thu');
    var rn = $('#rsvpName'); if (rn && (!rn.value || flash)) rn.value = n;
    if (flash) ['#invGuest', '#heroGuest'].forEach(function (q) { var x = $(q); x.classList.remove('flash'); void x.offsetWidth; x.classList.add('flash'); });
  }
  showGuest(guest); // tên do người gửi đặt sẵn trên link

  // ---------- Điền thông tin từ config ----------
  C.groom.display = C.groom.fullName || C.groom.name;
  C.bride.display = C.bride.fullName || C.bride.name;
  document.querySelectorAll('[data-bind]').forEach(function (n) {
    var v = n.getAttribute('data-bind').split('.').reduce(function (o, k) { return o && o[k]; }, C);
    if (v) n.textContent = v; else n.remove();
  });

  // Câu chuyện
  // Love story dạng chat Messenger: hiện "đang nhập…" rồi tới tin nhắn, lần lượt khi cuộn tới
  (function () {
    var body = $('#chatBody'); if (!body || !C.chat) return;
    var AV = { b: 'assets/photos/thumb/81.jpg', g: 'assets/photos/thumb/80.jpg' };
    function row(m) {
      var r = el('div', 'msg-row ' + (m.from === 'g' ? 'me' : 'them'));
      if (m.from !== 'g') { var a = el('img', 'm-av'); a.src = AV.b; a.alt = ''; r.appendChild(a); }
      return r;
    }
    function run() {
      var i = 0;
      (function next() {
        if (i >= C.chat.length) { var seen = el('div', 'seen'); var a = el('img'); a.src = AV.b; a.alt = ''; seen.append(a); body.appendChild(seen); return; }
        var m = C.chat[i++], r = row(m), t = el('div', 'bubble typing'); t.innerHTML = '<i></i><i></i><i></i>'; r.appendChild(t); body.appendChild(r);
        setTimeout(function () {
          t.className = 'bubble'; t.textContent = m.text;
          if (m.react) { var rc = el('span', 'react', m.react); t.appendChild(rc); if (!calm) setTimeout(function () { heartsAt(t.getBoundingClientRect(), 8); }, 300); }
          setTimeout(next, calm ? 0 : 450);
        }, calm ? 0 : 650 + Math.min(900, m.text.length * 18));
      })();
    }
    if ('IntersectionObserver' in window) {
      var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { o.disconnect(); run(); } }, { rootMargin: '0px 0px -25% 0px' });
      o.observe(body);
    } else run();
  })();

  // Lịch trình
  var tl = $('#timeline');
  if (!C.schedule.length) tl.closest('section').style.display = 'none';
  var ICON = {
    cam: '<path d="M6 16h7l3-4h16l3 4h7v24H6z"/><circle cx="24" cy="28" r="8"/><circle cx="24" cy="28" r="4"/><path d="M10 12h5"/>',
    ring: '<circle cx="18" cy="30" r="10"/><circle cx="30" cy="30" r="10"/><path d="M14 12l4-5 4 5-4 4zM18 16v4"/><path d="M28 6l1.5 2M34 7l-1 2.2M31 4v2"/>',
    toast: '<path d="M10 6h10l-1 11a4 4 0 0 1-8 0z"/><path d="M15 21v15M10 37h10"/><path d="M27.5 6.8l9.6 2.6-3.8 10.4a4 4 0 0 1-7.7-2.1z"/><path d="M29.8 22.4l-3.9 14.5M21 35.4l9.6 2.6"/><path d="M23 3l1 2M25.5 2l-.5 2.4"/>',
    heart: '<path d="M24 40S8 30 8 18a8 8 0 0 1 16-2 8 8 0 0 1 16 2c0 12-16 22-16 22z"/>'
  };
  function iconFor(t, i) { t = (t || '').toLowerCase(); return /đón|check|chụp/.test(t) ? 'cam' : /lễ|nhẫn|thành hôn/.test(t) ? 'ring' : /tiệc|ly|khai/.test(t) ? 'toast' : ['cam', 'ring', 'toast', 'heart'][i % 4]; }
  tl.style.setProperty('--n', Math.min(C.schedule.length, 4));
  C.schedule.forEach(function (s, i) {
    var li = el('li');
    li.innerHTML = '<svg viewBox="0 0 48 48" width="58" height="58" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[iconFor(s.title, i)] + '</svg>';
    li.append(el('b', 't', s.time), el('h3', '', s.title)); if (s.note) li.append(el('p', '', s.note));
    tl.appendChild(li);
  });


  // Địa điểm
  var vbox = $('#venues');
  C.venues.forEach(function (v) {
    var a = el('article', 'venue-item');
    if (v.photo) { var f = el('figure'), im = el('img'); im.src = v.photo; im.alt = ''; im.loading = 'lazy'; if (v.photoPos) im.style.objectPosition = v.photoPos; f.append(im); a.append(f); }
    a.append(el('p', 'vlabel', v.label), el('h3', '', v.name), v.hall ? el('p', 'vhall', v.hall) : '', el('p', 'vtime', v.time), el('address', '', v.address));
    var b = el('div', 'btns'), go = el('a', 'btn solid');
    go.href = v.map; go.target = '_blank'; go.rel = 'noopener';
    go.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>' + L('Chỉ đường', '地図を開く');
    var cpl = L('Sao chép địa chỉ', '住所をコピー'), cp = el('button', 'btn', cpl); cp.type = 'button';
    cp.onclick = function () { copy(v.copy || v.address, cp, cpl); };
    b.append(go, cp); a.append(b); vbox.appendChild(a);
  });

  // ---------- Ngày cưới, âm lịch ----------
  var D = C.date;
  var DOW = JA ? ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'] : ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  function esc(t) { var d = el('div'); d.textContent = t || ''; return d.innerHTML; }
  function venueOf(p) { for (var i = 0; i < C.venues.length; i++) if (p && C.venues[i].name === p.name) return C.venues[i]; return null; }
  function dayBlock(day, hour, minute, place, label) {
    var wd = new Date(D.year, D.month - 1, day), LN = Lunar.solarToLunar(day, D.month, D.year, 7), v = venueOf(place);
    var b = el('div', 'dblock');
    b.innerHTML = (label ? '<p class="dlabel">' + esc(label) + '</p>' : '') +
      '<p class="dtime">' + pad(hour) + ':' + pad(minute) + ' · ' + DOW[wd.getDay()] + '</p>' +
      '<div class="drow"><span>' + L('Tháng ' + D.month, D.month + '月') + '</span><b>' + pad(day) + '</b><span>' + L('Năm ' + D.year, D.year + '年') + '</span></div>' +
      (JA ? '' : '<p class="dlunar">(Tức ngày ' + LN.day + ' tháng ' + LN.month + (LN.leap ? ' nhuận' : '') + ' năm ' + Lunar.yearName(LN.year) + ')</p>') +
      (place ? '<p class="dat">' + L('Tiệc cưới được tổ chức tại', '会場') + '</p><p class="dplace">' + esc(place.name) + '</p><p class="daddr">' + esc(v && v.copy || place.address) + '</p>' : '');
    if (v && v.map) {
      var a = el('a', 'dmap'); a.href = v.map; a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>' + L('Chỉ đường', '地図を開く');
      b.appendChild(a);
    }
    return b;
  }
  var days = $('#days');
  days.appendChild(dayBlock(D.day, D.hour, D.minute, D.place, C.secondDay ? L('Tiệc cưới nhà trai', '新郎側 披露宴') : ''));
  if (C.secondDay) { var S2 = C.secondDay; days.appendChild(dayBlock(S2.day, S2.hour, S2.minute, S2.place, L('Tiệc cưới nhà gái', '新婦側 披露宴'))); }

  (function cal() {
    var g = $('#cal'), html = '', days = new Date(D.year, D.month, 0).getDate();
    $('#calHead').textContent = L('Tháng ' + D.month, 'November');
    (JA ? ['月', '火', '水', '木', '金', '土', '日'] : ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']).forEach(function (d) { html += '<div class="dow">' + d + '</div>'; });
    var first = (new Date(D.year, D.month - 1, 1).getDay() + 6) % 7;
    for (var i = 0; i < first; i++) html += '<div></div>';
    for (var d = 1; d <= days; d++) {
      var col = (first + d - 1) % 7, cls = 'd' + (col === 6 ? ' sun' : '');
      if (d === D.day) cls += ' mark main'; else if ((C.extraDays || []).indexOf(d) > -1) cls += ' mark';
      html += '<div class="' + cls + '"' + (d === D.day ? ' aria-label="Ngày cưới ' + d + '"' : '') + '>' + d + '</div>';
    }
    g.innerHTML = html;
  })();

  // ---------- Đếm ngược (giờ Việt Nam UTC+7) ----------
  (function () {
    var target = Date.UTC(D.year, D.month - 1, D.day, D.hour - 7, D.minute), ids = ['d', 'h', 'm', 's'].map(function (k) { return $('#cd-' + k); });
    function tick() {
      var s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      var v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
      ids.forEach(function (n, i) { n.textContent = i ? pad(v[i]) : v[i]; });
      if (s === 0) { $('#count').hidden = true; $('#cdDone').hidden = false; }
    }
    tick(); setInterval(tick, 1000);
  })();

  // ---------- Sao chép ----------
  function copy(text, btn, label) {
    function ok() { btn.textContent = L('Đã sao chép', 'コピーしました'); setTimeout(function () { btn.textContent = label; }, 1600); }
    function fallback() {
      var t = el('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); ok(); } catch (e) { prompt('Sao chép:', text); }
      t.remove();
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, fallback); else fallback();
  }

  // ---------- Nhạc nền ----------
  var audio = $('#bgm'), mbtn = $('#musicBtn');
  audio.src = C.music;
  function setMusic(on) { mbtn.classList.toggle('on', on); mbtn.setAttribute('aria-pressed', on); mbtn.setAttribute('aria-label', on ? 'Tắt nhạc' : 'Bật nhạc'); }
  function play() { var p = audio.play(); if (p && p.then) p.then(function () { setMusic(true); }, function () { setMusic(false); }); }
  audio.addEventListener('error', function () { mbtn.hidden = true; });
  mbtn.onclick = function () { if (audio.paused) play(); else { audio.pause(); setMusic(false); } };
  document.addEventListener('visibilitychange', function () { if (document.hidden && !audio.paused) { audio.pause(); audio._resume = true; } else if (!document.hidden && audio._resume) { audio._resume = false; play(); } });

  // ---------- Mở phong bì ----------
  var opener = $('#opener'), env = $('#env'), opened = false;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PETAL = ['#ffffff', '#fde9ee', '#f9d3dc', '#e2eed6', '#c6dbb2'], SPARK = ['#f2c96b', '#e3b04f', '#ffffff', '#9cc483', '#f4b6c2'];
  function petalPath(x, p) {
    x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.scale(1, .5 + .5 * Math.abs(Math.sin(p.ph))); x.globalAlpha = p.o;
    x.beginPath(); x.moveTo(0, -p.r); x.bezierCurveTo(p.r * .9, -p.r * .8, p.r * .8, p.r * .6, 0, p.r); x.bezierCurveTo(-p.r * .8, p.r * .6, -p.r * .9, -p.r * .8, -p.r * .15, -p.r * .95); x.closePath();
    x.fillStyle = p.c; x.shadowColor = 'rgba(60,80,50,.18)'; x.shadowBlur = 3; x.fill(); x.restore();
  }
  function star(x, s) {
    x.save(); x.translate(s.x, s.y); x.rotate(s.a); x.globalAlpha = Math.max(0, s.life); x.fillStyle = s.c; x.shadowColor = s.c; x.shadowBlur = 8;
    var r = s.r; x.beginPath(); x.moveTo(0, -r); x.quadraticCurveTo(r * .18, -r * .18, r, 0); x.quadraticCurveTo(r * .18, r * .18, 0, r); x.quadraticCurveTo(-r * .18, r * .18, -r, 0); x.quadraticCurveTo(-r * .18, -r * .18, 0, -r); x.fill(); x.restore();
  }
  function canvasOf(c) {
    var x = c.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1), o = { x: x, W: 0, H: 0 };
    o.size = function () { o.W = c.clientWidth; o.H = c.clientHeight; c.width = o.W * dpr; c.height = o.H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); };
    o.size(); return o;
  }

  // Nền màn hình chờ: đốm sáng bay lên, vài cánh hoa rơi chậm; khi mở thì bung tia sáng từ dấu sáp
  var opFx = null;
  if (!calm) (function () {
    var cv = canvasOf($('#opFx')), x = cv.x, dots = [], petals = [], run = true;
    addEventListener('resize', cv.size);
    for (var i = 0; i < 26; i++) dots.push({ x: Math.random() * cv.W, y: Math.random() * cv.H, r: 1.2 + Math.random() * 2.8, vy: -(.12 + Math.random() * .35), vx: -.12 + Math.random() * .24, ph: Math.random() * 6.28, c: Math.random() < .5 ? '255,255,255' : '255,240,200' });
    function mkPetal(top) { return { x: Math.random() * cv.W, y: top ? -20 : Math.random() * cv.H, r: 4 + Math.random() * 4, vy: .35 + Math.random() * .5, vx: -.2 + Math.random() * .4, a: Math.random() * 6.28, va: -.02 + Math.random() * .04, ph: Math.random() * 6.28, o: .65 + Math.random() * .3, c: PETAL[Math.random() * PETAL.length | 0] }; }
    for (var j = 0; j < 12; j++) petals.push(mkPetal(false));
    function f() {
      if (!run) return;
      x.clearRect(0, 0, cv.W, cv.H);
      dots.forEach(function (d) {
        d.ph += .03; d.y += d.vy; d.x += d.vx; if (d.y < -10) { d.y = cv.H + 10; d.x = Math.random() * cv.W; }
        var a = .25 + .35 * (1 + Math.sin(d.ph)) / 2, g = x.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
        g.addColorStop(0, 'rgba(' + d.c + ',' + a + ')'); g.addColorStop(1, 'rgba(' + d.c + ',0)'); x.fillStyle = g; x.beginPath(); x.arc(d.x, d.y, d.r * 4, 0, 6.283); x.fill();
      });
      petals.forEach(function (p, i) { p.ph += .03; p.y += p.vy; p.x += p.vx + Math.sin(p.ph) * .5; p.a += p.va; if (p.y > cv.H + 20) petals[i] = mkPetal(true); petalPath(x, p); });
      requestAnimationFrame(f);
    }
    f();
    opFx = { stop: function () { run = false; }, W: function () { return cv.W; } };
  })();

  function sparkle(cx, cy) {
    var c = el('canvas', 'shower'); c.setAttribute('aria-hidden', 'true'); document.body.appendChild(c);
    var cv = canvasOf(c), x = cv.x, burst = [];
    for (var i = 0; i < 70; i++) {
      var a = Math.random() * 6.283, v = 2 + Math.random() * 6;
      burst.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.5, r: 2 + Math.random() * 4, a: Math.random() * 3, va: .1, life: 1, d: .012 + Math.random() * .014, c: SPARK[Math.random() * SPARK.length | 0] });
    }
    for (var j = 0; j < 18; j++) {
      var b = Math.random() * 6.283, w = 1.5 + Math.random() * 4;
      burst.push({ petal: true, x: cx, y: cy, vx: Math.cos(b) * w, vy: Math.sin(b) * w - 2, r: 5 + Math.random() * 4, a: Math.random() * 6.28, va: -.08 + Math.random() * .16, ph: Math.random() * 6.28, o: 1, life: 1, d: .008 + Math.random() * .006, c: PETAL[Math.random() * PETAL.length | 0] });
    }
    (function f() {
      x.clearRect(0, 0, cv.W, cv.H);
      for (var k = burst.length - 1; k >= 0; k--) {
        var s = burst[k]; s.x += s.vx; s.y += s.vy; s.vx *= .965; s.vy = s.vy * .965 + .05; s.a += s.va; s.life -= s.d;
        if (s.life <= 0) { burst.splice(k, 1); continue; }
        if (s.petal) { s.o = Math.min(1, s.life * 1.5); s.ph += .05; petalPath(x, s); } else star(x, s);
      }
      if (burst.length) requestAnimationFrame(f); else c.remove();
    })();
  }

  // Mưa cánh hoa phủ màn hình lúc thiệp mở ra
  function shower() {
    var c = el('canvas', 'shower'); c.setAttribute('aria-hidden', 'true'); document.body.appendChild(c);
    var cv = canvasOf(c), x = cv.x, P = [], t0 = Date.now();
    for (var i = 0; i < (cv.W < 600 ? 70 : 110); i++) P.push({ x: Math.random() * cv.W, y: -20 - Math.random() * cv.H * .9, r: 5 + Math.random() * 6, vy: 2 + Math.random() * 2.6, vx: -.6 + Math.random() * 1.2, a: Math.random() * 6.28, va: -.05 + Math.random() * .1, ph: Math.random() * 6.28, o: .8 + Math.random() * .2, c: PETAL[Math.random() * PETAL.length | 0] });
    (function f() {
      var el2 = (Date.now() - t0) / 1000;
      x.clearRect(0, 0, cv.W, cv.H);
      var alive = 0;
      P.forEach(function (p) { p.ph += .04; p.y += p.vy; p.x += p.vx + Math.sin(p.ph) * .9; p.a += p.va; if (p.y < cv.H + 20) { alive++; if (el2 > 3.2) p.o = Math.max(0, p.o - .02); petalPath(x, p); } });
      if (alive && el2 < 6) requestAnimationFrame(f); else c.remove();
    })();
  }

  function openCard() {
    if (opened) return; opened = true;
    play(); // phát nhạc ngay trong lần chạm (trình duyệt điện thoại chỉ cho phép lúc này)
    opener.classList.add('opening');
    if (!calm) {
      // Dấu sáp tách đôi + bung tia sáng
      var w = $('#openBtn'), r = w.getBoundingClientRect(), orr = opener.getBoundingClientRect();
      ['l', 'r'].forEach(function (k) {
        var h = el('div', 'wax-half ' + k); h.innerHTML = w.innerHTML;
        h.style.left = (r.left - orr.left) + 'px'; h.style.top = (r.top - orr.top) + 'px'; h.style.width = r.width + 'px'; h.style.height = r.height + 'px';
        opener.appendChild(h); requestAnimationFrame(function () { requestAnimationFrame(function () { h.classList.add('go'); }); });
      });
      sparkle(r.left + r.width / 2, r.top + r.height / 2);
    }
    setTimeout(function () { env.classList.add('open'); }, calm ? 0 : 250);
    setTimeout(function () { if (!calm) { opener.classList.add('zoom'); shower(); } }, calm ? 0 : 1500);
    setTimeout(function () {
      opener.classList.add('gone'); document.body.classList.remove('locked'); mbtn.hidden = audio.error ? true : false; startLive();
      window.scrollTo(0, 0);
    }, calm ? 900 : 1900);
    setTimeout(function () { if (opFx) opFx.stop(); opener.remove(); }, calm ? 1900 : 3000);
  }
  env.addEventListener('click', openCard);
  // Hai cánh cửa: chạm dấu sáp để mở, rồi tới phong bì
  var doors = $('#doors'), doorsOpen = false;
  function openDoors() {
    if (doorsOpen) return; doorsOpen = true;
    play();
    doors.classList.add('open');
    setTimeout(function () { doors.remove(); var b = $('#openBtn'); if (b) b.focus({ preventScroll: true }); }, calm ? 300 : 1500);
  }
  if (doors) { doors.addEventListener('click', openDoors); }
  $('#openBtn').addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(); } });

  // ---------- Hiện dần khi cuộn ----------
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.reveal').forEach(function (n) { io.observe(n); });
  } else document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('in'); });

  // ---------- Popup mừng cưới ----------
  var modal = $('#giftModal'), tabs = $('#giftTabs'), panels = $('#giftPanels');
  // Chỉ hiện tài khoản đã điền thật; thiệp riêng mỗi bên chỉ hiện QR của bên đó
  var gifts = (C.gifts || []).filter(function (g) { return g.account && !/^0+$/.test(g.account.replace(/\s/g, '')) && (!SD || !g.side || g.side === SIDE); });
  if (!gifts.length) { $('.gift').style.display = 'none'; }
  if (gifts.length < 2) tabs.style.display = 'none';
  gifts.forEach(function (g, i) {
    var t = el('button', '', JA ? (g.side === 'trai' ? '新郎' : '新婦') : g.who); t.type = 'button'; t.setAttribute('role', 'tab'); t.setAttribute('aria-selected', i === 0);
    var p = el('div'); p.setAttribute('role', 'tabpanel'); p.hidden = i !== 0;
    var img = el('img', 'qr'); img.src = g.qr; img.alt = 'Mã QR chuyển khoản ' + g.who.toLowerCase(); img.loading = 'lazy';
    var acc = el('div', 'acc'), row = el('div', 'acc-row'), num = el('code', '', g.account), cb = el('button', 'btn', L('Sao chép', 'コピー'));
    cb.type = 'button'; cb.onclick = function () { copy(g.account.replace(/\s/g, ''), cb, L('Sao chép', 'コピー')); };
    row.append(num, cb); acc.append(el('span', 'bank', g.bank), el('span', 'holder', g.name), row);
    p.append(img, acc); panels.appendChild(p);
    t.onclick = function () { [].forEach.call(tabs.children, function (x, j) { x.setAttribute('aria-selected', j === i); panels.children[j].hidden = j !== i; }); };
    tabs.appendChild(t);
  });
  function closeModal() { modal.hidden = true; document.body.style.overflow = ''; $('#giftBtn').focus(); }
  $('#giftBtn').onclick = function () { modal.hidden = false; document.body.style.overflow = 'hidden'; $('.sheet-x', modal).focus(); };
  $('.sheet-x', modal).onclick = closeModal;
  $('.sheet-close', modal).onclick = closeModal;
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  // Link có ?qr=0 thì ẩn phần mừng cưới (QR chuyển khoản)
  try { if (QP.get('qr') === '0') { $('.gift').style.display = 'none'; modal.remove(); } } catch (e) {}

  document.addEventListener('keydown', function (e) {
    if (!modal.hidden && e.key === 'Escape') closeModal();
  });

  // ---------- Google Sheets (RSVP + lời chúc) ----------
  function send(data) {
    if (!C.scriptUrl) return new Promise(function (res) { setTimeout(function () { res({ ok: true, demo: true }); }, 500); });
    // text/plain để không bị chặn CORS (Apps Script không hỗ trợ preflight)
    return fetch(C.scriptUrl, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'text/plain;charset=utf-8' } })
      .then(function (r) { return r.json(); });
  }
  function bindForm(form, build, okText, after) {
    var msg = $('.msg', form), btn = $('button[type=submit]', form), label = btn.textContent;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = build(new FormData(form));
      if (!data) return;
      msg.className = 'msg'; msg.textContent = ''; btn.disabled = true; btn.textContent = L('Đang gửi…', '送信中…');
      send(data).then(function (r) {
        if (!r || !r.ok) throw new Error((r && r.error) || 'fail');
        msg.className = 'msg ok'; msg.textContent = okText + (r.demo ? ' (chạy thử, chưa nối Google Sheets)' : '');
        if (after) after(data, r);
      }).catch(function () {
        msg.className = 'msg err'; msg.textContent = L('Chưa gửi được, ' + P.you + ' thử lại giúp ' + P.me + P.nha + '.', '送信できませんでした。もう一度お試しください。');
      }).then(function () { btn.disabled = false; btn.textContent = label; });
    });
  }
  function need(v, form, sel, text) {
    if (v) return true;
    var m = $('.msg', form); m.className = 'msg err'; m.textContent = text; $(sel, form).focus(); return false;
  }

  var gs = $('#rsvpGuests');
  for (var n = 1; n <= 10; n++) { var o = el('option', '', n); o.value = n; gs.appendChild(o); }
  var rsvpForm = $('#rsvpForm');
  if (SD) { rsvpForm.side.value = SD.name; rsvpForm.side.closest('label').hidden = true; rsvpForm.side.closest('.row2').classList.add('one'); }
  rsvpForm.addEventListener('change', function () { gs.disabled = rsvpForm.attend.value === 'Không'; });
  bindForm(rsvpForm, function (f) {
    var name = (f.get('name') || '').trim();
    if (!need(name, rsvpForm, '[name=name]', L(cap(P.you) + ' điền tên giúp ' + P.me + P.nha + '.', 'お名前を入力してください。'))) return null;
    var attend = f.get('attend');
    return { type: 'rsvp', name: name, attend: attend, guests: attend === 'Có' ? +(f.get('guests') || 1) : 0, side: f.get('side'), invitedAs: guest };
  }, L('Cảm ơn ' + P.you + ' đã xác nhận' + P.a + '!', 'ご回答ありがとうございます！'), function (d) { if (d.attend === 'Có') confetti(); });

  var wishForm = $('#wishForm'), list = $('#wishList');
  function renderWishes(items) {
    list.innerHTML = '';
    if (!items.length) { list.appendChild(el('li', 'empty', L('Hãy là người đầu tiên gửi lời chúc nhé!', '最初のメッセージを送ってください！'))); return; }
    items.forEach(function (w) {
      var li = el('li'); li.append(el('b', '', w.name), el('p', '', w.message));
      if (w.time) { var t = new Date(w.time); if (!isNaN(t)) li.append(el('time', '', pad(t.getDate()) + '/' + pad(t.getMonth() + 1) + ' · ' + pad(t.getHours()) + ':' + pad(t.getMinutes()))); }
      list.appendChild(li);
    });
  }
  var wishes = [];
  function loadWishes() {
    if (!C.scriptUrl) { renderWishes(wishes); return; }
    fetch(C.scriptUrl + (C.scriptUrl.indexOf('?') > -1 ? '&' : '?') + 'action=wishes')
      .then(function (r) { return r.json(); })
      .then(function (r) { wishes = (r && r.wishes) || []; renderWishes(wishes); })
      .catch(function () { list.innerHTML = ''; list.appendChild(el('li', 'empty', L('Chưa tải được lời chúc.', 'メッセージを読み込めませんでした。'))); });
  }
  bindForm(wishForm, function (f) {
    var name = (f.get('name') || '').trim(), message = (f.get('message') || '').trim();
    if (!need(name, wishForm, '[name=name]', L(cap(P.you) + ' điền tên giúp ' + P.me + P.nha + '.', 'お名前を入力してください。'))) return null;
    if (!need(message, wishForm, '[name=message]', L(cap(P.you) + ' viết vài lời chúc' + P.nha + '.', 'メッセージを入力してください。'))) return null;
    return { type: 'wish', name: name, message: message };
  }, L('Cảm ơn lời chúc của ' + P.you + P.a + '!', 'メッセージありがとうございます！'), function (d) {
    if (d.name && d.name !== nick) setNick(d.name);
    wishes.unshift({ name: d.name, message: d.message, time: new Date().toISOString() });
    renderWishes(wishes); wishForm.message.value = '';
  });
  loadWishes();

  // ---------- Lời chúc bay lên (kiểu livestream) + thanh gửi nhanh ----------
  var live = $('#live'), bubbles = $('#bubbles'), liveOn = true, liveTimer = 0, li0 = 0;
  // Dòng bình luận trôi lên kiểu TikTok live: dòng mới đẩy dòng cũ lên, dòng trên cùng mờ dần
  var AVC = ['#fe2c55', '#25c4ee', '#f7b500', '#8f5cf7', '#3cc47c', '#ff7a45', '#e84393'];
  function push(node) {
    var before = [].map.call(bubbles.children, function (n) { return n.getBoundingClientRect().top; });
    bubbles.appendChild(node);
    while (bubbles.children.length > 7) { bubbles.firstChild.remove(); before.shift(); }
    if (calmFx) return;
    [].forEach.call(bubbles.children, function (n, k) {
      if (n === node) return;
      var d = before[k] - n.getBoundingClientRect().top;
      if (!d) return;
      n.style.transition = 'none'; n.style.transform = 'translateY(' + d + 'px)';
      requestAnimationFrame(function () { requestAnimationFrame(function () { n.style.transition = 'transform .45s cubic-bezier(.2,.8,.2,1)'; n.style.transform = ''; }); });
    });
  }
  function bubble(w) {
    var key = w.name + '|' + w.message;
    for (var i = 0; i < bubbles.children.length; i++) if (bubbles.children[i]._k === key) return; // không lặp dòng đang hiện
    var b = el('li', 'bub'); b._k = key;
    var av = el('span', 'bav', (w.name.replace(/^(Anh|Chị|Cô|Bác|Chú|Bạn|Em|Gia đình)\s+/i, '').trim()[0] || '?').toUpperCase());
    av.style.background = AVC[(w.name.length + w.name.charCodeAt(0)) % AVC.length];
    var tx = el('span', 'btx'); tx.append(el('b', '', w.name), document.createTextNode(' ' + w.message));
    b.append(av, tx); push(b);
  }
  // Lời chúc mẫu: trộn ngẫu nhiên, hiện sau lời chúc thật của khách
  var seeds = (C.seedWishes || []).slice().sort(function () { return Math.random() - .5; });
  function startLive() {
    live.hidden = false; $('#rail').hidden = false; $('#chatN').textContent = wishes.length + seeds.length;
    var giftOk = $('.gift') && $('.gift').style.display !== 'none' && document.getElementById('giftModal');
    if (!giftOk) $('#liveGift').hidden = true;
    clearInterval(liveTimer);
    liveTimer = setInterval(function () {
      var pool = wishes.concat(seeds);
      if (!liveOn || document.hidden || !pool.length) return;
      bubble(pool[li0++ % pool.length]);
    }, 1900);
  }
  $('#liveX').onclick = function () {
    liveOn = !liveOn; bubbles.classList.toggle('off', !liveOn); this.setAttribute('aria-pressed', !liveOn);
    this.setAttribute('aria-label', liveOn ? 'Ẩn lời chúc' : 'Hiện lời chúc');
  };
  $('#liveGift').onclick = function () { $('#giftBtn').click(); };
  // ---------- Biệt danh kiểu Facebook: khách tự đặt tên hiện cùng lời chúc ----------
  var nick = '', pendingMsg = '';
  try { nick = localStorage.getItem('tn_nick') || ''; } catch (e) {}
  if (guest) nick = guest; // có tên trên link thì lời chúc gửi bằng tên đó
  var nickModal = $('#nickModal'), nickIn = $('#nickIn');
  function avColor(n) { return AVC[(n.length + n.charCodeAt(0)) % AVC.length]; }
  function initial(n) { return (n.replace(/^(Anh|Chị|Cô|Bác|Chú|Bạn|Em|Gia đình)\s+/i, '').trim()[0] || '?').toUpperCase(); }
  function paintNick() {
    var a = $('#nickAv');
    if (nick) { a.textContent = initial(nick); a.style.background = avColor(nick); a.classList.add('set'); a.setAttribute('aria-label', 'Biệt danh: ' + nick + '. Chạm để đổi'); $('#liveMsg').placeholder = L('Gửi lời chúc với tên ' + nick + '…', nick + ' としてメッセージを送る…'); }
    if (nick && !wishForm.name.value) wishForm.name.value = nick;
  }
  function setNick(n) { nick = n; try { localStorage.setItem('tn_nick', n); } catch (e) {} paintNick(); }
  function openNick(ask) {
    if (JA) { $('#nickTitle').textContent = 'ニックネーム'; $('.nick-sub').textContent = 'メッセージと一緒に表示されるお名前です。'; } else {
    $('#nickTitle').textContent = ask ? (guest ? 'Đây có phải tên ' + P.you + ' không?' : cap(P.you) + ' tên là gì?') : 'Đặt biệt danh';
    $('.nick-sub').textContent = ask ? 'Cho ' + P.we + ' biết tên hoặc biệt danh của ' + P.you + ', thiệp sẽ mời đúng tên ' + P.you + P.nha + ' 💌' : 'Thiệp sẽ mời đúng tên này, và tên này cũng hiện cùng lời chúc của ' + P.you + '.';
    }
    nickIn.value = nick || guest || ''; $('#nickMsg').textContent = '';
    var big = $('#nickBig'); big.textContent = nickIn.value ? initial(nickIn.value) : '?'; big.style.background = nickIn.value ? avColor(nickIn.value) : '#b9bfb3';
    nickModal.hidden = false; setTimeout(function () { nickIn.focus(); nickIn.select(); }, 60);
  }
  function closeNick() { nickModal.hidden = true; }
  nickIn.addEventListener('input', function () { var v = nickIn.value.trim(), big = $('#nickBig'); big.textContent = v ? initial(v) : '?'; big.style.background = v ? avColor(v) : '#b9bfb3'; });
  $('#nickAv').onclick = function () { if (guest) { toast(L('Lời chúc sẽ gửi với tên ' + guest, guest + ' としてメッセージを送ります')); return; } openNick(); };
  // Chưa biết tên (link không có tên, chưa đặt biệt danh): hỏi một lần sau khi mở thiệp
  $('.sheet-x', nickModal).onclick = function () { pendingMsg = ''; closeNick(); };
  nickModal.addEventListener('click', function (e) { if (e.target === nickModal) { pendingMsg = ''; closeNick(); } });
  $('#nickForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = nickIn.value.replace(/\s+/g, ' ').trim();
    if (v.length < 2) { $('#nickMsg').className = 'msg err'; $('#nickMsg').textContent = L(cap(P.you) + ' đặt biệt danh ít nhất 2 ký tự' + P.nha + '.', '2文字以上で入力してください。'); nickIn.focus(); return; }
    setNick(v); closeNick(); toast(L('Đã lưu biệt danh: ' + v, 'ニックネームを保存しました：' + v));
    if (pendingMsg) { var m = pendingMsg; pendingMsg = ''; postWish(m); }
  });
  function postWish(msg) {
    var w = { name: nick, message: msg, time: new Date().toISOString() };
    wishes.unshift(w); renderWishes(wishes); bubble(w); $('#chatN').textContent = wishes.length + seeds.length;
    send({ type: 'wish', name: nick, message: msg }).catch(function () {});
  }
  $('#liveBar').addEventListener('submit', function (e) {
    e.preventDefault();
    var inp = $('#liveMsg'), msg = inp.value.trim();
    if (!msg) { inp.focus(); return; }
    inp.value = ''; inp.blur();
    if (!nick) { pendingMsg = msg; openNick(); return; } // chưa có biệt danh: hỏi trước, gửi sau
    postWish(msg);
  });
  paintNick();

  // ---------- Album: xem ảnh lớn ----------
  var lb = $('#lightbox'), lbImg = $('#lbImg'), shots = [].slice.call(document.querySelectorAll('.album .ph')), cur = 0;
  function showShot(i) { cur = (i + shots.length) % shots.length; lbImg.src = shots[cur].getAttribute('data-full'); }
  shots.forEach(function (b, i) { b.onclick = function () { showShot(i); lb.hidden = false; document.body.style.overflow = 'hidden'; }; });
  function closeLb() { lb.hidden = true; lbImg.removeAttribute('src'); document.body.style.overflow = ''; }
  $('.lb-x', lb).onclick = closeLb;
  $('.lb-nav.prev', lb).onclick = function (e) { e.stopPropagation(); showShot(cur - 1); };
  $('.lb-nav.next', lb).onclick = function (e) { e.stopPropagation(); showShot(cur + 1); };
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  var tx = 0;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { var d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) showShot(cur + (d < 0 ? 1 : -1)); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb(); else if (e.key === 'ArrowRight') showShot(cur + 1); else if (e.key === 'ArrowLeft') showShot(cur - 1);
  });

  // ---------- Tin kiểu Facebook / Instagram ----------
  var calmFx = calm;
  (function () {
    var rowEl = $('#stRow'), sv = $('#sv'), groups = C.stories || [];
    if (!rowEl || !groups.length) { if (rowEl) rowEl.closest('section').remove(); return; }
    groups.forEach(function (g, gi) {
      var b = el('button', 'st'); b.type = 'button';
      b.innerHTML = '<span class="ring"><img src="assets/photos/thumb/' + g.photos[0] + '.jpg" alt="" loading="lazy"></span>';
      b.appendChild(el('span', 'st-n', g.name)); b.onclick = function () { open(gi, 0); };
      rowEl.appendChild(b);
    });
    var G = 0, P = 0, timer = 0, t0 = 0, left = 0, DUR = 4500, paused = false, raf = 0;
    function bars() {
      var bx = $('#svBars'); bx.innerHTML = '';
      groups[G].photos.forEach(function (_, i) { var b = el('i'); b.appendChild(el('b')); if (i < P) b.className = 'done'; bx.appendChild(b); });
    }
    function show() {
      var g = groups[G], im = $('#svImg');
      im.classList.remove('kb'); void im.offsetWidth; im.src = 'assets/photos/' + g.photos[P] + '.jpg'; im.classList.add('kb');
      $('#svAv').src = 'assets/photos/thumb/' + g.photos[0] + '.jpg'; $('#svName').textContent = g.name;
      $('#svCap').textContent = (SIDE === 'gai' ? 'Hoài Thu & Tuấn Nghĩa' : 'Tuấn Nghĩa & Hoài Thu');
      bars(); left = DUR; start();
    }
    function start() { t0 = performance.now(); cancelAnimationFrame(raf); tick(); }
    function tick() {
      raf = requestAnimationFrame(function () {
        if (paused) { tick(); return; }
        var el2 = performance.now() - t0, f = Math.min(1, 1 - (left - el2) / DUR), cur = $('#svBars').children[P];
        if (cur) cur.firstChild.style.width = (f * 100) + '%';
        if (el2 >= left) step(1); else tick();
      });
    }
    function step(d) {
      P += d;
      if (P >= groups[G].photos.length) { G++; P = 0; if (G >= groups.length) return close(); }
      if (P < 0) { G--; if (G < 0) { G = 0; P = 0; } else P = groups[G].photos.length - 1; }
      show();
    }
    function open(g, p) { G = g; P = p; sv.hidden = false; document.body.style.overflow = 'hidden'; show(); rowEl.children[g].classList.add('seen'); }
    function close() { cancelAnimationFrame(raf); sv.hidden = true; document.body.style.overflow = ''; }
    $('.sv-x', sv).onclick = close;
    $('.sv-tap.prev', sv).onclick = function () { step(-1); };
    $('.sv-tap.next', sv).onclick = function () { rowEl.children[G] && rowEl.children[G].classList.add('seen'); step(1); };
    sv.addEventListener('pointerdown', function () { if (!paused) { paused = true; left -= performance.now() - t0; } });
    function resume() { if (paused) { paused = false; t0 = performance.now(); } }
    sv.addEventListener('pointerup', resume); sv.addEventListener('pointercancel', resume);
    var ty = 0; sv.addEventListener('touchstart', function (e) { ty = e.touches[0].clientY; }, { passive: true });
    sv.addEventListener('touchend', function (e) { if (e.changedTouches[0].clientY - ty > 90) close(); });
    document.addEventListener('keydown', function (e) { if (sv.hidden) return; if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1); });
  })();

  // ---------- Tim bay, chạm đúp, chia sẻ, pháo giấy, thanh tiến độ ----------
  var EMO = ['❤️', '💖', '🥰', '😍', '💕', '🤍', '🎉', '💐'];
  function heartsAt(r, n) {
    if (calmFx) return;
    for (var i = 0; i < n; i++) {
      var h = el('span', 'fly', EMO[Math.random() * EMO.length | 0]);
      h.style.left = (r.left + r.width / 2 - 12 + (Math.random() * 40 - 20)) + 'px'; h.style.top = (r.top + r.height / 2 - 12) + 'px';
      h.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px'); h.style.setProperty('--r', (Math.random() * 60 - 30) + 'deg');
      h.style.animationDelay = (i * 70) + 'ms'; h.style.fontSize = (18 + Math.random() * 14) + 'px';
      document.body.appendChild(h); setTimeout(function (x) { return function () { x.remove(); }; }(h), 2200 + i * 70);
    }
  }
  var hn = 0, baseN = 0;
  try { hn = +localStorage.getItem('tn_hearts') || 0; } catch (e) {}
  baseN = 1200 + (C.seedWishes || []).length * 23; // số tim ban đầu cho rộn ràng
  function setHearts() { var v = baseN + hn; $('#heartN').textContent = v >= 1000 ? (v / 1000).toFixed(1).replace('.', ',') + 'K' : v; }
  setHearts();
  function like(r) {
    hn++; try { localStorage.setItem('tn_hearts', hn); } catch (e) {}
    setHearts(); var b = $('#railHeart'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop', 'on');
    heartsAt(r || b.getBoundingClientRect(), 6);
  }
  $('#railHeart').onclick = function () { like(); };
  $('#railChat').onclick = function () { $('#liveMsg').focus(); };
  function toast(t) { var x = $('#toast'); x.textContent = t; x.hidden = false; clearTimeout(x._t); x._t = setTimeout(function () { x.hidden = true; }, 2200); }
  $('#railShare').onclick = function () {
    // Giữ kiểu xưng hô và tuỳ chọn ẩn QR khi chia sẻ, bỏ tên khách riêng
    var keep = new URLSearchParams();
    ['xh', 'qr', 'ben', 'lang'].forEach(function (k) { var v = QP.get(k); if (v) keep.set(k, v); });
    var url = location.origin + location.pathname + (keep.toString() ? '#' + keep.toString() : ''), title = document.title.replace(/^Thân mời [^·]*· /, 'Thiệp cưới ');
    if (navigator.share) navigator.share({ title: title, url: url }).catch(function () {});
    else copyText(url, function () { toast(L('Đã sao chép link thiệp', 'リンクをコピーしました')); });
  };
  function copyText(t, ok) {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(ok, function () { prompt('Sao chép link:', t); });
    else prompt('Sao chép link:', t);
  }
  // Chạm đúp vào ảnh: tim lớn nổ ra như TikTok / Instagram
  var lastTap = 0;
  document.addEventListener('pointerup', function (e) {
    var img = e.target.closest && e.target.closest('.hero, .banner, .calph, .q-ph, .arch, .venue-item figure');
    if (!img) return;
    var now = Date.now();
    if (now - lastTap < 320) {
      e.preventDefault();
      var big = el('span', 'bigheart', '❤️'); big.style.left = e.clientX + 'px'; big.style.top = e.clientY + 'px';
      document.body.appendChild(big); setTimeout(function () { big.remove(); }, 900);
      like({ left: e.clientX, top: e.clientY, width: 0, height: 0 }); lastTap = 0;
    } else lastTap = now;
  });
  // Pháo giấy khi khách xác nhận sẽ đến
  function confetti() {
    if (calmFx) return;
    var c = el('canvas', 'shower'); document.body.appendChild(c);
    var cv = canvasOf(c), x = cv.x, P2 = [], COL = ['#2f4a34', '#8fae7a', '#f2c96b', '#e8899d', '#ffffff', '#c23d4e'];
    for (var i = 0; i < 160; i++) P2.push({ x: cv.W / 2, y: cv.H * .55, vx: (Math.random() - .5) * 16, vy: -8 - Math.random() * 10, w: 6 + Math.random() * 6, h: 3 + Math.random() * 4, a: Math.random() * 6, va: (Math.random() - .5) * .4, c: COL[i % COL.length] });
    var t0c = Date.now();
    (function f() {
      x.clearRect(0, 0, cv.W, cv.H);
      P2.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.vx *= .985; p.vy += .32; p.a += p.va; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); x.restore(); });
      if (Date.now() - t0c < 3500) requestAnimationFrame(f); else c.remove();
    })();
  }
  // Thanh tiến độ cuộn trang
  (function () {
    var bar = $('#progress');
    function upd() { var h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')'; }
    var rail = $('#rail'), rt = 0;
    addEventListener('scroll', function () { upd(); rail.classList.add('dim'); clearTimeout(rt); rt = setTimeout(function () { rail.classList.remove('dim'); }, 700); }, { passive: true }); upd();
  })();

  // ---------- Hiệu ứng trong khung ảnh: hoa anh đào rơi, pháo hoa ----------
  // Chỉ chạy khi khung ảnh đang hiện trên màn hình và tab đang mở.
  (function () {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('[data-fx]').forEach(function (box) {
      var c = el('canvas', 'fx'); c.setAttribute('aria-hidden', 'true'); box.insertBefore(c, box.querySelector('.banner-in'));
      var x = c.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1), W = 0, H = 0, visible = false, raf = 0;
      function size() { W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); }
      var step = box.dataset.fx === 'fireworks' ? fireworks() : sakura();
      function loop() { raf = 0; if (!visible || document.hidden) return; step(); raf = requestAnimationFrame(loop); }
      function kick() { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop); }
      addEventListener('resize', size);
      document.addEventListener('visibilitychange', kick);
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) { if (!W) size(); kick(); } }, { rootMargin: '80px 0px' }).observe(box);

      function sakura() {
        var P = [], COL = ['#ffd9e1', '#f9c4d0', '#fde9ee', '#ffffff', '#f5b7c6'];
        function mk(top) { return { x: Math.random() * W, y: top ? -20 : Math.random() * H, r: 5 + Math.random() * 6, vy: .5 + Math.random() * .8, vx: -.3 + Math.random() * .7, a: Math.random() * 6.28, va: -.03 + Math.random() * .06, ph: Math.random() * 6.28, o: .7 + Math.random() * .3, c: COL[Math.random() * COL.length | 0] }; }
        function petal(p) {
          x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.scale(1, .5 + .5 * Math.abs(Math.sin(p.ph))); x.globalAlpha = p.o;
          x.beginPath(); x.moveTo(0, -p.r); x.bezierCurveTo(p.r * .9, -p.r * .8, p.r * .8, p.r * .6, 0, p.r); x.bezierCurveTo(-p.r * .8, p.r * .6, -p.r * .9, -p.r * .8, -p.r * .15, -p.r * .95); x.closePath();
          x.fillStyle = p.c; x.shadowColor = 'rgba(120,40,60,.25)'; x.shadowBlur = 3; x.fill(); x.restore();
        }
        return function () {
          if (!P.length) for (var i = 0; i < (W < 600 ? 34 : 50); i++) P.push(mk(false));
          x.clearRect(0, 0, W, H);
          P.forEach(function (p, i) { p.ph += .035; p.y += p.vy; p.x += p.vx + Math.sin(p.ph) * .6; p.a += p.va; if (p.y > H + 20 || p.x < -30 || p.x > W + 30) P[i] = mk(true); petal(p); });
        };
      }

      function fireworks() {
        var R = [], S = [], t = 0, COL = ['#ffd27a', '#ff6b6b', '#ffb3c7', '#ffffff', '#ffe9a8', '#ff8fa3'];
        function launch() { R.push({ x: W * (.15 + Math.random() * .7), y: H, vy: -(H * .011 + Math.random() * H * .004), ty: H * (.08 + Math.random() * .3), c: COL[Math.random() * COL.length | 0] }); }
        function burst(r) {
          var n = 46 + (Math.random() * 30 | 0), sp = 2.1 + Math.random() * 1.8, c2 = COL[Math.random() * COL.length | 0];
          for (var i = 0; i < n; i++) { var a = i / n * 6.283 + Math.random() * .1, v = sp * (.55 + Math.random() * .45); S.push({ x: r.x, y: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, d: .010 + Math.random() * .008, c: i % 3 ? r.c : c2 }); }
        }
        return function () {
          t++;
          x.globalCompositeOperation = 'destination-out'; x.fillStyle = 'rgba(0,0,0,.22)'; x.fillRect(0, 0, W, H);
          x.globalCompositeOperation = 'lighter';
          if (t % 36 === 1 || (Math.random() < .012 && R.length < 3)) launch();
          for (var i = R.length - 1; i >= 0; i--) {
            var r = R[i]; r.y += r.vy; r.vy *= .985;
            x.fillStyle = r.c; x.beginPath(); x.arc(r.x, r.y, 1.8, 0, 6.283); x.fill();
            if (r.y <= r.ty || r.vy > -1) { burst(r); R.splice(i, 1); }
          }
          for (var j = S.length - 1; j >= 0; j--) {
            var s = S[j]; s.x += s.vx; s.y += s.vy; s.vx *= .985; s.vy = s.vy * .985 + .025; s.life -= s.d;
            if (s.life <= 0) { S.splice(j, 1); continue; }
            x.globalAlpha = Math.min(1, s.life * 1.4); x.fillStyle = s.c; x.beginPath(); x.arc(s.x, s.y, 2 * s.life + .7, 0, 6.283); x.fill();
          }
          x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
        };
      }
    });
  })();
})();
