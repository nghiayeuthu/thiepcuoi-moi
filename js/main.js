(function () {
  'use strict';
  var C = window.WEDDING;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  // ---------- Thiệp riêng nhà trai / nhà gái (…/nha-trai/, …/nha-gai/ hoặc ?ben=trai|gai) ----------
  var SIDE = '';
  try { SIDE = (document.documentElement.getAttribute('data-side') || new URLSearchParams(location.search).get('ben') || '').toLowerCase(); } catch (e) {}
  var SD = SIDE && C.sides && C.sides[SIDE];
  if (SD) {
    var sd = SD.date || {};
    C.date = { day: sd.day || C.date.day, month: C.date.month, year: C.date.year, hour: sd.hour != null ? sd.hour : C.date.hour, minute: sd.minute != null ? sd.minute : C.date.minute, place: sd.place || C.date.place };
    C.secondDay = null; C.extraDays = [];
    if (SD.venues) C.venues = C.venues.filter(function (v, i) { return SD.venues.indexOf(i) > -1; });
    if (SD.schedule) C.schedule = SD.schedule;
    document.body.classList.add('side-' + SIDE);
    document.querySelectorAll('[data-dates]').forEach(function (n) { n.textContent = n.textContent.replace('28 & 29', pad(C.date.day)); });
    if (SIDE === 'gai') {
      // Thiệp nhà gái: tên cô dâu đứng trước
      var h = $('.hero h1'), sp = h.querySelectorAll('span'); h.insertBefore(sp[1], sp[0]); h.appendChild(sp[0]);
      var es = $('.env-letter .script'); if (es) es.innerHTML = 'Thu <i>&amp;</i> Nghĩa';
      var sg = $('.thanks .sig'); if (sg) sg.textContent = 'Hoài Thu & Tuấn Nghĩa';
      document.title = document.title.replace('Tuấn Nghĩa & Hoài Thu', 'Hoài Thu & Tuấn Nghĩa');
    }
  }

  // ---------- Tên khách từ link ?guestName=... (vẫn nhận ?to=... của thiệp cũ) ----------
  var guest = '';
  try {
    var q = new URLSearchParams(location.search);
    guest = (q.get('guestName') || q.get('to') || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  } catch (e) {}
  if (guest) {
    $('#heroGuest').textContent = guest;
    $('#inviteGuest').textContent = guest;
    var og = $('#openerGuest'); og.textContent = 'Thân gửi ' + guest; og.hidden = false;
    document.title = 'Kính mời ' + guest + (SIDE === 'gai' ? ' · Hoài Thu & Tuấn Nghĩa' : ' · Tuấn Nghĩa & Hoài Thu');
    $('#rsvpName').value = guest; $('#wishName').value = guest;
  }

  // ---------- Điền thông tin từ config ----------
  C.groom.display = C.groom.fullName || C.groom.name;
  C.bride.display = C.bride.fullName || C.bride.name;
  document.querySelectorAll('[data-bind]').forEach(function (n) {
    var v = n.getAttribute('data-bind').split('.').reduce(function (o, k) { return o && o[k]; }, C);
    if (v) n.textContent = v; else n.remove();
  });

  // Câu chuyện
  var st = $('#story');
  C.story.forEach(function (s) { var li = el('li'); li.append(el('h3', '', s.when), el('p', '', s.text)); st.appendChild(li); });

  // Lịch trình
  var tl = $('#timeline');
  if (!C.schedule.length) tl.closest('section').style.display = 'none';
  C.schedule.forEach(function (s) {
    var li = el('li'), c = el('div', 'c');
    c.append(el('h3', '', s.title)); if (s.note) c.append(el('p', '', s.note));
    li.append(el('div', 't', s.time), el('div', 'bar'), c); tl.appendChild(li);
  });

  // Địa điểm
  var vbox = $('#venues');
  C.venues.forEach(function (v) {
    var a = el('article', 'venue-item');
    if (v.photo) { var f = el('figure'), im = el('img'); im.src = v.photo; im.alt = ''; im.loading = 'lazy'; if (v.photoPos) im.style.objectPosition = v.photoPos; f.append(im); a.append(f); }
    a.append(el('p', 'vlabel', v.label), el('h3', '', v.name), el('p', 'vhall', v.hall), el('p', 'vtime', v.time), el('address', '', v.address));
    var b = el('div', 'btns'), go = el('a', 'btn solid');
    go.href = v.map; go.target = '_blank'; go.rel = 'noopener';
    go.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>Chỉ đường';
    var cp = el('button', 'btn', 'Sao chép địa chỉ'); cp.type = 'button';
    cp.onclick = function () { copy(v.copy || v.address, cp, 'Sao chép địa chỉ'); };
    b.append(go, cp); a.append(b); vbox.appendChild(a);
  });

  // ---------- Ngày cưới, âm lịch, lịch tháng ----------
  var D = C.date, wd = new Date(D.year, D.month - 1, D.day);
  var DOW = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  $('#dowText').textContent = DOW[wd.getDay()];
  $('#dayNum').textContent = pad(D.day);
  $('#monthText').textContent = 'Tháng ' + D.month;
  $('#yearText').textContent = D.year;
  var h = D.hour, part = h < 11 ? 'sáng' : h < 13 ? 'trưa' : h < 18 ? 'chiều' : 'tối';
  $('#timeText').textContent = (h > 12 ? h - 12 : h) + ' giờ ' + pad(D.minute) + ' ' + part + ', ' + DOW[wd.getDay()];
  var L = Lunar.solarToLunar(D.day, D.month, D.year, 7);
  $('#lunarText').textContent = 'Tức ngày ' + L.day + ' tháng ' + L.month + (L.leap ? ' nhuận' : '') + ' năm ' + Lunar.yearName(L.year) + ' (âm lịch)';

  function placeHtml(p) { return p ? '<b>' + esc(p.name) + '</b>' + esc(p.address) : ''; }
  function esc(t) { var d = el('div'); d.textContent = t || ''; return d.innerHTML; }
  $('#placeText').innerHTML = placeHtml(C.date.place);
  if (C.secondDay) {
    var S = C.secondDay, sd = new Date(D.year, D.month - 1, S.day), sh = S.hour;
    $('#d2Dow').textContent = DOW[sd.getDay()];
    $('#d2Day').textContent = pad(S.day);
    $('#d2Month').textContent = 'Tháng ' + D.month;
    $('#d2Time').textContent = (sh > 12 ? sh - 12 : sh) + ' giờ ' + pad(S.minute) + ' ' + (sh < 11 ? 'sáng' : sh < 13 ? 'trưa' : sh < 18 ? 'chiều' : 'tối') + ', ' + DOW[sd.getDay()];
    var L2 = Lunar.solarToLunar(S.day, D.month, D.year, 7);
    $('#d2Lunar').textContent = 'Tức ngày ' + L2.day + ' tháng ' + L2.month + (L2.leap ? ' nhuận' : '') + ' năm ' + Lunar.yearName(L2.year) + ' (âm lịch)';
    $('#d2Place').innerHTML = placeHtml(S.place);
    $('#day2').hidden = false;
  }

  (function cal() {
    var g = $('#cal'), html = '', days = new Date(D.year, D.month, 0).getDate();
    $('#calHead').textContent = 'Tháng ' + D.month + ' · ' + D.year;
    ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].forEach(function (d) { html += '<div class="dow">' + d + '</div>'; });
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
    function ok() { btn.textContent = 'Đã sao chép'; setTimeout(function () { btn.textContent = label; }, 1600); }
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
  function openCard() {
    if (opened) return; opened = true;
    play(); // phát nhạc ngay trong lần chạm (trình duyệt điện thoại chỉ cho phép lúc này)
    env.classList.add('open'); $('#tapHint').style.visibility = 'hidden';
    setTimeout(function () {
      opener.classList.add('gone'); document.body.classList.remove('locked'); mbtn.hidden = audio.error ? true : false;
      window.scrollTo(0, 0);
    }, 1700);
    setTimeout(function () { opener.remove(); }, 2700);
  }
  env.addEventListener('click', openCard);
  $('#openBtn').addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(); } });

  // ---------- Hiện dần khi cuộn ----------
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.reveal').forEach(function (n) { io.observe(n); });
  } else document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('in'); });

  // ---------- Popup mừng cưới ----------
  var modal = $('#giftModal'), tabs = $('#giftTabs'), panels = $('#giftPanels');
  C.gifts.forEach(function (g, i) {
    var t = el('button', '', g.who); t.type = 'button'; t.setAttribute('role', 'tab'); t.setAttribute('aria-selected', i === 0);
    var p = el('div'); p.setAttribute('role', 'tabpanel'); p.hidden = i !== 0;
    var img = el('img', 'qr'); img.src = g.qr; img.alt = 'Mã QR chuyển khoản ' + g.who.toLowerCase(); img.loading = 'lazy';
    var acc = el('div', 'acc'), row = el('div', 'acc-row'), num = el('code', '', g.account), cb = el('button', 'btn', 'Sao chép');
    cb.type = 'button'; cb.onclick = function () { copy(g.account.replace(/\s/g, ''), cb, 'Sao chép'); };
    row.append(num, cb); acc.append(el('span', 'bank', g.bank), el('span', 'holder', g.name), row);
    p.append(img, acc); panels.appendChild(p);
    t.onclick = function () { [].forEach.call(tabs.children, function (x, j) { x.setAttribute('aria-selected', j === i); panels.children[j].hidden = j !== i; }); };
    tabs.appendChild(t);
  });
  function closeModal() { modal.hidden = true; document.body.style.overflow = ''; $('#giftBtn').focus(); }
  $('#giftBtn').onclick = function () { modal.hidden = false; document.body.style.overflow = 'hidden'; $('.sheet-x').focus(); };
  $('.sheet-x').onclick = closeModal;
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

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
      msg.className = 'msg'; msg.textContent = ''; btn.disabled = true; btn.textContent = 'Đang gửi…';
      send(data).then(function (r) {
        if (!r || !r.ok) throw new Error((r && r.error) || 'fail');
        msg.className = 'msg ok'; msg.textContent = okText + (r.demo ? ' (chạy thử, chưa nối Google Sheets)' : '');
        if (after) after(data, r);
      }).catch(function () {
        msg.className = 'msg err'; msg.textContent = 'Chưa gửi được, bạn thử lại giúp mình nhé.';
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
    if (!need(name, rsvpForm, '[name=name]', 'Bạn điền tên giúp mình nhé.')) return null;
    var attend = f.get('attend');
    return { type: 'rsvp', name: name, attend: attend, guests: attend === 'Có' ? +(f.get('guests') || 1) : 0, side: f.get('side'), invitedAs: guest };
  }, 'Cảm ơn bạn đã xác nhận!');

  var wishForm = $('#wishForm'), list = $('#wishList');
  function renderWishes(items) {
    list.innerHTML = '';
    if (!items.length) { list.appendChild(el('li', 'empty', 'Hãy là người đầu tiên gửi lời chúc nhé!')); return; }
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
      .catch(function () { list.innerHTML = ''; list.appendChild(el('li', 'empty', 'Chưa tải được lời chúc.')); });
  }
  bindForm(wishForm, function (f) {
    var name = (f.get('name') || '').trim(), message = (f.get('message') || '').trim();
    if (!need(name, wishForm, '[name=name]', 'Bạn điền tên giúp mình nhé.')) return null;
    if (!need(message, wishForm, '[name=message]', 'Bạn viết vài lời chúc nhé.')) return null;
    return { type: 'wish', name: name, message: message };
  }, 'Cảm ơn lời chúc của bạn!', function (d) {
    wishes.unshift({ name: d.name, message: d.message, time: new Date().toISOString() });
    renderWishes(wishes); wishForm.message.value = '';
  });
  loadWishes();

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
