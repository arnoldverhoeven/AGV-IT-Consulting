/* Belle Equipe & zn. — website + planning (build 2026-10-14-1) · AGV IT Consulting */
(function () {
'use strict';

var CMS = {
  url: 'https://mlfqwuzdqpfbykkjoequ.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sZnF3dXpkcXBmYnlra2pvZXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NDgyODMsImV4cCI6MjEwNTIyNDI4M30.yN1LpuyxhBysUyPSg9VaUE4javJ6ueBPFM1j4fD15W8',
  prefix: 'belleequipe_',
  app: 'belleequipe',
  live: false // true zodra belleequipe_supabase.sql is uitgevoerd; tot dan draait alles in demomodus
};
var ISFILE = location.protocol === 'file:' || !CMS.live;
var DEMO_KEY = 'belleequipe-demo-v1';

/* ---------- helpers ---------- */
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function uid() { return (crypto.randomUUID ? crypto.randomUUID() : 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2)); }
var toastT;
function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 2800); }
function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
function ssSet(k, v) { try { if (v == null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) {} }

/* dates (local) */
var DAYS = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
var DAYS_L = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
var MON = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
function pad(n) { return (n < 10 ? '0' : '') + n; }
function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function pd(s) { var a = String(s).split('-'); return new Date(+a[0], +a[1] - 1, +a[2]); }
function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
function monday(d) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); var w = (x.getDay() + 6) % 7; return addDays(x, -w); }
function today() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
function fd(s, long) { if (!s) return '—'; var d = typeof s === 'string' ? pd(s) : s; return (long ? DAYS_L : DAYS)[d.getDay()] + ' ' + d.getDate() + ' ' + MON[d.getMonth()]; }
function hm(t) { return String(t || '').slice(0, 5); }
function addMin(t, m) { var a = hm(t).split(':'); var x = (+a[0]) * 60 + (+a[1]) + (+m || 0); return pad(Math.floor(x / 60) % 24) + ':' + pad(x % 60); }
function dur(m) { m = +m || 0; var h = Math.floor(m / 60), r = m % 60; return (h ? h + 'u' : '') + (r ? (h ? pad(r) : r + ' min') : (h ? '' : '0')); }
function isoWeek(d) { var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); var day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); var y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return Math.ceil(((t - y) / 864e5 + 1) / 7); }
function since(iso) { var m = Math.round((Date.now() - new Date(iso).getTime()) / 60000); if (m < 60) return m <= 1 ? 'net binnen' : m + ' min geleden'; var h = Math.round(m / 60); if (h < 24) return h + ' u geleden'; var dd = Math.round(h / 24); return dd === 1 ? 'gisteren' : dd + ' dagen geleden'; }
function freqWeeks(txt) { var m = String(txt || '').match(/(\d+)\s*weken/); if (m) return +m[1]; if (/kwartaal/i.test(txt)) return 13; if (/jaar/i.test(txt)) return 52; return null; }
function freqLabel(w) { if (!w) return 'Eenmalig'; if (w === 13) return 'Per kwartaal'; if (w === 52) return 'Jaarlijks'; return 'Om de ' + w + ' weken'; }
function mapsUrl(a) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(a); }
function telHref(p) { return 'tel:' + String(p || '').replace(/[^\d+]/g, ''); }
function waHref(p) { var d = String(p || '').replace(/\D/g, ''); if (d.indexOf('0') === 0) d = '32' + d.slice(1); return 'https://wa.me/' + d; }

/* =====================================================================
   PUBLIEKE SITE
   ===================================================================== */
function initSite() {
  var hdr = $('.hdr');
  var onScroll = function () { hdr.classList.toggle('scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var btn = $('#menuBtn'), nav = $('#nav');
  btn.addEventListener('click', function () { var o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }); });

  var y = $('#yr'); if (y) y.textContent = new Date().getFullYear();

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else { $$('.rv').forEach(function (el) { el.classList.add('in'); }); }

  var mcta = $('#mcta'), req = $('#aanvraag');
  if (mcta && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { mcta.classList.toggle('hide', es[0].isIntersecting); }, { threshold: .15 }).observe(req);
  }

  $$('[data-svc]').forEach(function (a) {
    a.addEventListener('click', function () {
      var v = a.getAttribute('data-svc');
      $$('#svcPick input').forEach(function (i) { if (i.value.indexOf(v) === 0 || (v === 'Ramen' && i.value === 'Ramen buiten')) i.checked = true; });
    });
  });
  initWizard();
}

function initWizard() {
  var form = $('#reqForm'); if (!form) return;
  var step = 1, max = 4;
  var titles = ['Wat mogen we reinigen?', 'Waar mogen we komen?', 'Wanneer past het?', 'Je gegevens'];
  var next = $('#wzNext'), back = $('#wzBack');
  var from = $('#f-from'); if (from) from.min = ymd(addDays(today(), 1));

  $$('input[name=client_type]', form).forEach(function (r) {
    r.addEventListener('change', function () { var b = form.client_type.value === 'bedrijf'; $('#fld-company').hidden = !b; });
  });
  $$('.fld input, .fld select, .fld textarea', form).forEach(function (el) {
    el.addEventListener('input', function () { var f = el.closest('.fld'); if (f.classList.contains('err')) checkField(el); });
    el.addEventListener('blur', function () { if (el.value) checkField(el); });
  });

  function checkField(el) {
    var f = el.closest('.fld'), msg = '', v = el.value.trim();
    if (el.required && !v) msg = 'Vul dit veld in.';
    else if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Dit e-mailadres klopt niet.';
    else if (el.type === 'tel' && v && v.replace(/\D/g, '').length < 9) msg = 'Geef een geldig telefoonnummer.';
    else if (el.name === 'postal' && v && !/^\d{4}$/.test(v)) msg = 'Een Belgische postcode heeft 4 cijfers.';
    else if (el.type === 'date' && v && v < el.min) msg = 'Kies een datum vanaf morgen.';
    if (f) { f.classList.toggle('err', !!msg); var m = $('.msg', f); if (m) m.textContent = msg; }
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    return !msg;
  }
  function validate(s) {
    var ok = true, first = null;
    var box = $('.wz-step[data-step="' + s + '"]', form);
    if (s === 1) {
      var any = $$('input[name=services]:checked', form).length > 0;
      $('#errSvc').hidden = any; if (!any) { ok = false; first = $('#svcPick input'); }
    }
    $$('input, select, textarea', box).forEach(function (el) {
      if (el.closest('[hidden]') && el.closest('[hidden]') !== box) return;
      if (el.closest('.fld') && !checkField(el)) { ok = false; if (!first) first = el; }
    });
    if (first) first.focus();
    return ok;
  }
  function data() {
    var fdta = new FormData(form);
    return {
      client_type: fdta.get('client_type') || 'particulier',
      name: (fdta.get('name') || '').trim(),
      company: fdta.get('client_type') === 'bedrijf' ? (fdta.get('company') || '').trim() : '',
      email: (fdta.get('email') || '').trim(),
      phone: (fdta.get('phone') || '').trim(),
      street: (fdta.get('street') || '').trim(),
      postal: (fdta.get('postal') || '').trim(),
      city: (fdta.get('city') || '').trim(),
      services: fdta.getAll('services'),
      frequency: fdta.get('frequency') || '',
      building: fdta.get('building') || '',
      floors: fdta.get('floors') || '',
      preferred_days: fdta.getAll('preferred_days'),
      preferred_period: fdta.get('preferred_period') || '',
      preferred_from: fdta.get('preferred_from') || null,
      message: [(fdta.get('message') || '').trim(), 'Toegang: ' + (fdta.get('presence') || '')].filter(Boolean).join('\n')
    };
  }
  function summary() {
    var d = data();
    var rows = [
      ['Diensten', d.services.join(', ')],
      ['Frequentie', d.frequency],
      ['Adres', d.street + ', ' + d.postal + ' ' + d.city],
      ['Gebouw', d.building + ' · ' + d.floors],
      ['Voorkeur', (d.preferred_days.length ? d.preferred_days.join(', ') : 'elke dag') + ' · ' + d.preferred_period + (d.preferred_from ? ' · vanaf ' + fd(d.preferred_from) : '')]
    ];
    $('#summary').innerHTML = '<dl>' + rows.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>';
  }
  function show(s) {
    step = s;
    $$('.wz-step', form).forEach(function (el) { el.hidden = +el.getAttribute('data-step') !== s; });
    $$('.wz-progress span', form).forEach(function (sp, i) { sp.classList.toggle('on', i < s); });
    $('#wzLbl').textContent = 'Stap ' + s + ' van ' + max + ' · ' + titles[s - 1];
    back.hidden = s === 1;
    next.innerHTML = s === max ? 'Aanvraag versturen' : 'Volgende →';
    if (s === max) summary();
    var top = $('#wz').getBoundingClientRect().top + window.pageYOffset - 90;
    if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: 'smooth' });
  }
  back.addEventListener('click', function () { if (step > 1) show(step - 1); });
  next.addEventListener('click', function () {
    if (!validate(step)) return;
    if (step < max) { show(step + 1); var f = $('.wz-step[data-step="' + step + '"] input, .wz-step[data-step="' + step + '"] select', form); if (f && step > 1) f.focus({ preventScroll: true }); return; }
    submit();
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); next.click(); });

  function submit() {
    var err = $('#srvErr'); err.hidden = true;
    if (form.website && form.website.value) { done(false); return; } // honeypot
    var row = data();
    next.disabled = true; back.disabled = true;
    next.innerHTML = '<span class="spin" aria-hidden="true"></span> Versturen…';
    var p;
    if (ISFILE) {
      p = DemoDB.insert('requests', Object.assign({ status: 'nieuw' }, row)).then(function () { return 'demo'; });
    } else {
      p = fetch(CMS.url + '/rest/v1/' + CMS.prefix + 'requests', {
        method: 'POST',
        headers: { apikey: CMS.key, Authorization: 'Bearer ' + CMS.key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(row)
      }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); notifyNetlify(row); return 'ok'; });
    }
    p.then(function (mode) { done(mode === 'demo'); })
     .catch(function () {
       err.innerHTML = 'Je aanvraag kon niet verstuurd worden. Probeer het straks opnieuw of bel ons op <a href="tel:+32486438286">0486 43 82 86</a> — je gegevens blijven staan.';
       err.hidden = false; next.disabled = false; back.disabled = false; next.innerHTML = 'Opnieuw versturen';
     });
  }
  function done(demo) {
    form.hidden = true; var d = $('#wzDone'); d.hidden = false;
    if (demo) $('#doneTxt').innerHTML = 'Demo: je aanvraag staat nu in de planning. Open <a href="#beheer">Beheer</a> → <b>Bekijk de demo</b> om ze in te plannen bij een team.';
    d.focus();
  }
  function notifyNetlify(r) {
    var body = new URLSearchParams({
      'form-name': 'aanvraag-melding', naam: r.name + (r.company ? ' (' + r.company + ')' : ''), email: r.email, telefoon: r.phone,
      adres: r.street + ', ' + r.postal + ' ' + r.city, diensten: r.services.join(', '), frequentie: r.frequency,
      voorkeur: (r.preferred_days.join(', ') || 'elke dag') + ' · ' + r.preferred_period + (r.preferred_from ? ' · vanaf ' + r.preferred_from : ''),
      bericht: r.message + '\n\nBeheer: ' + location.origin + '/#beheer'
    });
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() }).catch(function () {});
  }
}

/* =====================================================================
   DATA: Supabase of demo
   ===================================================================== */
var Sess = {
  get: function () { try { return JSON.parse(ssGet('be-session') || 'null'); } catch (e) { return null; } },
  set: function (s) { ssSet('be-session', s ? JSON.stringify(s) : null); }
};
function authFetch(path, opt) {
  opt = opt || {};
  return fetch(CMS.url + '/auth/v1/' + path, {
    method: opt.method || 'POST',
    headers: Object.assign({ apikey: CMS.key, 'Content-Type': 'application/json' }, opt.token ? { Authorization: 'Bearer ' + opt.token } : {}),
    body: opt.body ? JSON.stringify(opt.body) : undefined
  }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { var e = new Error(j.error_description || j.msg || j.message || ('HTTP ' + r.status)); e.status = r.status; throw e; } return j; }); });
}
function keepSession(j) {
  var s = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Math.floor(Date.now() / 1000) + (j.expires_in || 3600), user: j.user };
  Sess.set(s); return s;
}
function hasAccess(user) { var a = user && user.app_metadata && user.app_metadata.apps; return Array.isArray(a) && a.indexOf(CMS.app) >= 0; }

var Remote = {
  token: function () {
    var s = Sess.get(); if (!s) return Promise.reject(new Error('Niet ingelogd'));
    if (s.expires_at - 60 > Date.now() / 1000) return Promise.resolve(s.access_token);
    return authFetch('token?grant_type=refresh_token', { body: { refresh_token: s.refresh_token } }).then(function (j) { return keepSession(j).access_token; });
  },
  req: function (method, table, qs, body, retried) {
    return Remote.token().then(function (tok) {
      return fetch(CMS.url + '/rest/v1/' + CMS.prefix + table + (qs ? '?' + qs : ''), {
        method: method,
        headers: { apikey: CMS.key, Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: body ? JSON.stringify(body) : undefined
      });
    }).then(function (r) {
      if (r.status === 401 && !retried) { var s = Sess.get(); if (s) { s.expires_at = 0; Sess.set(s); } return Remote.req(method, table, qs, body, true); }
      return r.text().then(function (t) { var j = t ? JSON.parse(t) : null; if (!r.ok) throw new Error((j && (j.message || j.hint)) || ('HTTP ' + r.status)); return j; });
    });
  },
  list: function (t, qs) { return Remote.req('GET', t, qs || 'select=*'); },
  insert: function (t, row) { return Remote.req('POST', t, '', row).then(function (a) { return a[0]; }); },
  update: function (t, id, patch) { return Remote.req('PATCH', t, 'id=eq.' + encodeURIComponent(id), patch).then(function (a) { return a[0]; }); },
  remove: function (t, id) { return Remote.req('DELETE', t, 'id=eq.' + encodeURIComponent(id)); }
};

var DemoDB = {
  db: null,
  load: function () {
    if (DemoDB.db) return DemoDB.db;
    var raw = lsGet(DEMO_KEY); try { DemoDB.db = raw ? JSON.parse(raw) : null; } catch (e) { DemoDB.db = null; }
    if (!DemoDB.db || !DemoDB.db.teams) DemoDB.db = seed();
    return DemoDB.db;
  },
  save: function () { lsSet(DEMO_KEY, JSON.stringify(DemoDB.db)); },
  list: function (t) { return Promise.resolve(JSON.parse(JSON.stringify(DemoDB.load()[t] || []))); },
  insert: function (t, row) { var db = DemoDB.load(); var now = new Date().toISOString(); var r = Object.assign({ id: uid(), created_at: now, updated_at: now }, row); (db[t] = db[t] || []).push(r); DemoDB.save(); return Promise.resolve(JSON.parse(JSON.stringify(r))); },
  update: function (t, id, patch) { var db = DemoDB.load(); var r = (db[t] || []).find(function (x) { return x.id === id; }); if (!r) return Promise.reject(new Error('Niet gevonden')); Object.assign(r, patch, { updated_at: new Date().toISOString() }); DemoDB.save(); return Promise.resolve(JSON.parse(JSON.stringify(r))); },
  remove: function (t, id) { var db = DemoDB.load(); db[t] = (db[t] || []).filter(function (x) { return x.id !== id; }); DemoDB.save(); return Promise.resolve(); },
  reset: function () { DemoDB.db = seed(); DemoDB.save(); }
};

function seed() {
  var t0 = today(), mon = monday(t0);
  var T1 = uid(), T2 = uid();
  var teams = [
    { id: T1, name: 'Team 1', color: '#2547B8', members: 'Ploeg met bestelwagen 1', active: true, sort: 1 },
    { id: T2, name: 'Team 2', color: '#0E9F8E', members: 'Ploeg met bestelwagen 2', active: true, sort: 2 }
  ];
  var C = [
    ['Familie Peeters', '', 'particulier', 'Lindelei 14', '2930', 'Brasschaat', ['Ramen buiten', 'Ramen binnen'], 6, T1, 90],
    ['Bakkerij De Korenaar', 'Bakkerij De Korenaar', 'bedrijf', 'Dorpstraat 3', '2950', 'Kapellen', ['Ramen buiten'], 4, T1, 45],
    ['Familie Janssens', '', 'particulier', 'Heideweg 22', '2920', 'Kalmthout', ['Ramen buiten', 'Zonnepanelen'], 8, T2, 120],
    ['Kantoor Verbruggen', 'Verbruggen & Co', 'bedrijf', 'Bredabaan 410', '2900', 'Schoten', ['Ramen buiten', 'Ramen binnen'], 4, T2, 150],
    ['Familie Claes', '', 'particulier', 'Kerkstraat 9', '2040', 'Berendrecht', ['Ramen buiten', 'Veranda / koepel'], 8, T1, 90],
    ['VvE Residentie Zonneveld', 'VvE Zonneveld', 'vve', 'Boomsesteenweg 120', '2610', 'Wilrijk', ['Ramen buiten'], 13, T2, 240],
    ['Familie Wouters', '', 'particulier', 'Molenstraat 5', '2630', 'Aartselaar', ['Zonnepanelen'], 52, T1, 60],
    ['Familie De Smet', '', 'particulier', 'Lisperstraat 31', '2500', 'Lier', ['Ramen buiten', 'Rolluiken'], 6, T2, 90]
  ];
  var customers = C.map(function (c) { return { id: uid(), name: c[0], company: c[1], client_type: c[2], email: '', phone: '0470 00 00 00', street: c[3], postal: c[4], city: c[5], services: c[6], frequency_weeks: c[7], default_team: c[8], default_minutes: c[9], notes: '', active: true, created_at: new Date().toISOString() }; });
  function job(ci, dayOff, time, status) {
    var c = customers[ci]; var d = addDays(t0, dayOff); if (d.getDay() === 0) d = addDays(d, dayOff < 0 ? -1 : 1);
    return { id: uid(), team_id: c.default_team, customer_id: c.id, request_id: null, date: ymd(d), start_time: time, minutes: c.default_minutes, status: status || (d < t0 ? 'uitgevoerd' : 'bevestigd'), title: c.name, address: c.street + ', ' + c.postal + ' ' + c.city, services: c.services, notes: '', created_at: new Date().toISOString() };
  }
  var jobs = [
    job(0, -42, '08:30', 'uitgevoerd'), job(2, -54, '09:00', 'uitgevoerd'), job(4, -40, '13:00', 'uitgevoerd'), job(7, -45, '08:30', 'uitgevoerd'), job(6, -300, '10:00', 'uitgevoerd'),
    job(1, -28, '08:00', 'uitgevoerd'), job(3, -27, '08:30', 'uitgevoerd'),
    job(0, 0, '08:30'), job(1, 0, '11:00'), job(3, 0, '08:30'), job(2, 0, '13:00'),
    job(5, 1, '08:00'), job(4, 2, '10:00', 'gepland'), job(1, 28, '08:00', 'gepland'), job(3, 28, '08:30', 'gepland'), job(5, 3, '13:30', 'gepland')
  ];
  var now = Date.now();
  var requests = [
    { id: uid(), status: 'nieuw', client_type: 'particulier', name: 'Sofie Mertens', company: '', email: 'sofie@example.be', phone: '0478 12 34 56', street: 'Kapelsestraat 77', postal: '2950', city: 'Kapellen', services: ['Ramen buiten', 'Ramen binnen', 'Rolluiken'], frequency: 'Om de 6 weken', building: 'Halfopen bebouwing', floors: '2 bouwlagen', preferred_days: ['di', 'do'], preferred_period: 'Voormiddag', preferred_from: null, message: 'Grote schuifraam achteraan.\nToegang: Ja, iemand is thuis', note: '', created_at: new Date(now - 40 * 60000).toISOString() },
    { id: uid(), status: 'nieuw', client_type: 'bedrijf', name: 'Tom Van Dyck', company: 'Optiek Van Dyck', email: 'tom@example.be', phone: '03 123 45 67', street: 'Bredabaan 230', postal: '2930', city: 'Brasschaat', services: ['Ramen buiten'], frequency: 'Om de 4 weken', building: 'Winkel / handelspand', floors: 'Gelijkvloers', preferred_days: ['ma'], preferred_period: 'Voormiddag', preferred_from: null, message: 'Etalage, liefst voor opening (9u).\nToegang: Nee, enkel buiten', note: '', created_at: new Date(now - 5 * 3600000).toISOString() },
    { id: uid(), status: 'nieuw', client_type: 'particulier', name: 'Ilse Hermans', company: '', email: 'ilse@example.be', phone: '0495 98 76 54', street: 'Hoogboomsteenweg 12', postal: '2950', city: 'Kapellen', services: ['Zonnepanelen'], frequency: 'Jaarlijks', building: 'Open bebouwing / villa', floors: '2 bouwlagen', preferred_days: [], preferred_period: 'Maakt niet uit', preferred_from: ymd(addDays(t0, 10)), message: '24 panelen.\nToegang: Nee, enkel buiten', note: '', created_at: new Date(now - 28 * 3600000).toISOString() }
  ];
  return { teams: teams, customers: customers, jobs: jobs, requests: requests };
}

/* =====================================================================
   BEHEER
   ===================================================================== */
var A = {
  api: null, demo: false, user: null,
  teams: [], customers: [], requests: [], jobs: [],
  tab: 'vandaag', week: monday(today()), mday: ymd(today()), rf: 'nieuw', cf: 'alle', cq: '', hideTeams: {},
  loaded: false
};
var root;

function openAdmin() {
  root = $('#beheer');
  document.body.classList.add('admin-open'); root.hidden = false; window.scrollTo(0, 0);
  document.title = 'Beheer · Belle Equipe & zn.';
  var h = location.hash;
  if (/type=recovery/.test(h) && /access_token=/.test(h)) { recoveryScreen(h); return; }
  if (A.loaded && A.api) { render(); return; }
  if (ssGet('be-demo') === '1') return startDemo();
  var s = Sess.get();
  if (s && hasAccess(s.user)) { A.api = Remote; A.user = s.user; loadAll(); }
  else loginScreen();
}
function closeAdmin() {
  document.body.classList.remove('admin-open'); root.hidden = true; root.innerHTML = '';
  A.loaded = false; document.title = 'Belle Equipe & zn. — Glazenwasserij regio Antwerpen';
}

function loginScreen(msg) {
  root.innerHTML =
    '<div class="login"><div class="box">' +
    '<a class="brand" href="#top"><img src="img/logo-rond.png" width="46" height="46" alt=""><span><b>Belle Equipe &amp; zn.</b><small>Planning &amp; aanvragen</small></span></a>' +
    '<h2>Inloggen</h2><p>Log in om aanvragen te bekijken en je teams in te plannen.</p>' +
    (msg ? '<div class="server-err" role="alert">' + esc(msg) + '</div>' : '') +
    '<form id="lf" novalidate><div class="fld"><label for="le">E-mail</label><input id="le" type="email" autocomplete="username" required></div>' +
    '<div class="fld"><label for="lp">Wachtwoord</label><input id="lp" type="password" autocomplete="current-password" required></div>' +
    '<button class="btn btn-primary" id="lb">Inloggen</button></form>' +
    '<div class="alt"><button type="button" id="lforgot">Wachtwoord vergeten?</button><a href="#top" style="padding:6px 0;font-weight:600;text-decoration:none">← Naar de website</a></div>' +
    '<div class="or">of</div><button type="button" class="btn btn-ghost" id="ldemo">Bekijk de demo</button>' +
    '</div></div>';
  $('#lf').addEventListener('submit', function (e) {
    e.preventDefault();
    var em = $('#le').value.trim(), pw = $('#lp').value, b = $('#lb');
    if (!em || !pw) return loginScreen('Vul je e-mail en wachtwoord in.');
    b.disabled = true; b.innerHTML = '<span class="spin"></span> Inloggen…';
    authFetch('token?grant_type=password', { body: { email: em, password: pw } }).then(function (j) {
      if (!hasAccess(j.user)) { Sess.set(null); return loginScreen('Dit account heeft geen toegang tot de planning van Belle Equipe.'); }
      var s = keepSession(j); A.api = Remote; A.demo = false; A.user = s.user; ssSet('be-demo', null); loadAll();
    }).catch(function (e) { loginScreen(e.status === 400 ? 'E-mail of wachtwoord klopt niet.' : 'Inloggen lukt niet: ' + e.message); });
  });
  $('#lforgot').addEventListener('click', function () {
    var em = $('#le').value.trim(); if (!em) { $('#le').focus(); toast('Vul eerst je e-mailadres in.'); return; }
    if (ISFILE) { toast('Wachtwoord resetten werkt pas op de live website.'); return; }
    authFetch('recover?redirect_to=' + encodeURIComponent(location.origin + '/#beheer'), { body: { email: em } })
      .then(function () { toast('Check je mailbox voor de resetlink.'); }).catch(function () { toast('Versturen lukte niet. Probeer later opnieuw.'); });
  });
  $('#ldemo').addEventListener('click', startDemo);
  setTimeout(function () { var e = $('#le'); if (e) e.focus(); }, 50);
}
function recoveryScreen(h) {
  var p = new URLSearchParams(h.replace(/^#/, ''));
  var tok = p.get('access_token');
  root.innerHTML = '<div class="login"><div class="box"><h2>Nieuw wachtwoord</h2><p>Kies een nieuw wachtwoord (minstens 8 tekens).</p>' +
    '<form id="rf"><div class="fld"><label for="rp">Nieuw wachtwoord</label><input id="rp" type="password" minlength="8" autocomplete="new-password" required></div><button class="btn btn-primary">Opslaan</button></form></div></div>';
  $('#rf').addEventListener('submit', function (e) {
    e.preventDefault(); var pw = $('#rp').value; if (pw.length < 8) { toast('Minstens 8 tekens.'); return; }
    authFetch('user', { method: 'PUT', token: tok, body: { password: pw } }).then(function () {
      return authFetch('token?grant_type=refresh_token', { body: { refresh_token: p.get('refresh_token') } });
    }).then(function (j) { keepSession(j); history.replaceState(null, '', '#beheer'); toast('Wachtwoord opgeslagen.'); A.api = Remote; A.user = j.user; loadAll(); })
      .catch(function (er) { toast('Lukt niet: ' + er.message); });
  });
}
function startDemo() { A.api = DemoDB; A.demo = true; A.user = { email: 'demo' }; ssSet('be-demo', '1'); loadAll(); }
function logout() {
  if (!A.demo) { var s = Sess.get(); if (s) authFetch('logout', { token: s.access_token }).catch(function () {}); }
  Sess.set(null); ssSet('be-demo', null); A.api = null; A.loaded = false; loginScreen();
}

function loadAll() {
  root.innerHTML = shell() + '<main class="ad-main"><div class="skel"></div><div class="skel"></div><div class="skel"></div></main>';
  var from = ymd(addDays(today(), -400)), to = ymd(addDays(today(), 400));
  var api = A.api;
  Promise.all([
    api.list('teams', 'select=*&order=sort.asc,name.asc'),
    api.list('customers', 'select=*&order=name.asc'),
    api.list('requests', 'select=*&order=created_at.desc&limit=500'),
    api.list('jobs', 'select=*&date=gte.' + from + '&date=lte.' + to + '&order=date.asc,start_time.asc')
  ]).then(function (r) {
    A.teams = r[0]; A.customers = r[1]; A.requests = r[2].sort(function (a, b) { return a.created_at < b.created_at ? 1 : -1; }); A.jobs = r[3]; A.loaded = true;
    A.teams.sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
    render();
  }).catch(function (e) {
    var m = /does not exist|schema cache|404/i.test(e.message) ? 'De database van Belle Equipe is nog niet aangemaakt (belleequipe_supabase.sql uitvoeren). Bekijk ondertussen de demo.' : 'Gegevens laden lukt niet: ' + e.message;
    Sess.set(null); loginScreen(m);
  });
}

/* ---------- lookups ---------- */
function team(id) { return A.teams.find(function (t) { return t.id === id; }); }
function cust(id) { return A.customers.find(function (c) { return c.id === id; }); }
function tColor(id) { var t = team(id); return t ? t.color : '#8A94A8'; }
function tName(id) { var t = team(id); return t ? t.name : 'Niet toegewezen'; }
function activeTeams() { return A.teams.filter(function (t) { return t.active; }); }
function jobsOn(d, teamId) { return A.jobs.filter(function (j) { return j.date === d && (teamId === undefined || (j.team_id || null) === teamId); }).sort(function (a, b) { return hm(a.start_time) < hm(b.start_time) ? -1 : 1; }); }
function newCount() { return A.requests.filter(function (r) { return r.status === 'nieuw'; }).length; }
function custStatus(c) {
  var t0 = ymd(today());
  var js = A.jobs.filter(function (j) { return j.customer_id === c.id; });
  var last = js.filter(function (j) { return j.status === 'uitgevoerd'; }).map(function (j) { return j.date; }).sort().pop() || null;
  var nextP = js.filter(function (j) { return (j.status === 'gepland' || j.status === 'bevestigd') && j.date >= t0; }).map(function (j) { return j.date; }).sort()[0] || null;
  var due = null, state = 'ok';
  if (!nextP && c.frequency_weeks && c.active) {
    due = last ? ymd(addDays(pd(last), c.frequency_weeks * 7)) : t0;
    if (due < t0) state = 'over'; else if (due <= ymd(addDays(today(), 7))) state = 'soon';
  }
  return { last: last, next: nextP, due: due, state: state };
}
function dueCustomers() { return A.customers.filter(function (c) { var s = custStatus(c); return s.state === 'over' || s.state === 'soon'; }); }

/* ---------- shell ---------- */
function shell() {
  var tabs = [['vandaag', 'Vandaag'], ['aanvragen', 'Aanvragen'], ['planning', 'Planning'], ['klanten', 'Klanten'], ['teams', 'Teams']];
  var n = A.loaded ? newCount() : 0;
  return '<header class="ad-top"><div class="in">' +
    '<a class="brand" href="#top" title="Naar de website"><img src="img/logo-rond.png" width="36" height="36" alt=""><span><b>Belle Equipe</b><small>Planning</small></span></a>' +
    '<nav class="ad-tabs" aria-label="Beheer">' + tabs.map(function (t) {
      return '<button data-tab="' + t[0] + '" class="' + (A.tab === t[0] ? 'on' : '') + '">' + t[1] + (t[0] === 'aanvragen' && n ? '<span class="badge">' + n + '</span>' : '') + '</button>';
    }).join('') + '</nav>' +
    '<div class="ad-user">' + (A.demo ? '<span class="demo-flag">DEMO</span><button data-act="demo-reset" title="Demogegevens herstellen">Herstel demo</button>' : '<span class="pl-desk-only">' + esc(A.user && A.user.email) + '</span>') +
    '<button data-act="logout">' + (A.demo ? 'Sluiten' : 'Uitloggen') + '</button></div>' +
    '</div></header>';
}
function render() {
  var v = { vandaag: vToday, aanvragen: vRequests, planning: vPlanning, klanten: vCustomers, teams: vTeams }[A.tab] || vToday;
  root.innerHTML = shell() + '<main class="ad-main">' + v() + '</main>' + '<div class="ov" id="ov" hidden></div>';
  bindDnD();
}

/* ---------- views ---------- */
function jobRow(j, withTeam) {
  var c = cust(j.customer_id);
  var phone = (c && c.phone) || '';
  return '<div class="jrow ' + (j.status === 'uitgevoerd' ? 'done' : '') + '">' +
    '<div class="t">' + hm(j.start_time) + '<small>' + dur(j.minutes) + '</small></div>' +
    '<div class="w"><b>' + esc(j.title) + '</b>' + (withTeam ? '<span><i class="sw" style="background:' + tColor(j.team_id) + '"></i> ' + esc(tName(j.team_id)) + '</span>' : '') +
    (j.address ? '<a href="' + mapsUrl(j.address) + '" target="_blank" rel="noopener">' + esc(j.address) + '</a>' : '') +
    '<span>' + esc((j.services || []).join(' · ')) + '</span>' +
    (phone ? '<a href="' + telHref(phone) + '">' + esc(phone) + '</a>' : '') + '</div>' +
    '<div style="display:grid;gap:6px;justify-items:end"><span class="st st-' + j.status + '">' + j.status + '</span>' +
    (j.status !== 'uitgevoerd' && j.status !== 'geannuleerd' ? '<button class="abtn sm ok" data-act="job-done" data-id="' + j.id + '">✓ Klaar</button>' : '') +
    '<button class="abtn sm" data-act="job-edit" data-id="' + j.id + '">Open</button></div></div>';
}
function vToday() {
  var t = ymd(today()), mon = monday(today());
  var wk = A.jobs.filter(function (j) { return j.date >= ymd(mon) && j.date <= ymd(addDays(mon, 6)) && j.status !== 'geannuleerd'; }).length;
  var tj = jobsOn(t).filter(function (j) { return j.status !== 'geannuleerd'; });
  var html = '<div class="ad-h"><h2>Goeiedag! · ' + fd(today(), true) + '</h2>' +
    '<button class="abtn" data-act="print" data-date="' + t + '">🖨 Dagplanning afdrukken</button>' +
    '<button class="abtn pri" data-act="job-new" data-date="' + t + '">+ Afspraak</button></div>' +
    '<div class="kpis">' +
    '<div class="card kpi hl" data-tab="aanvragen"><b>' + newCount() + '</b><span>Nieuwe aanvragen</span></div>' +
    '<div class="card kpi" data-tab="planning"><b>' + tj.length + '</b><span>Afspraken vandaag</span></div>' +
    '<div class="card kpi" data-tab="planning"><b>' + wk + '</b><span>Deze week (week ' + isoWeek(today()) + ')</span></div>' +
    '<div class="card kpi" data-act="due"><b>' + dueCustomers().length + '</b><span>Klanten terug aan de beurt</span></div></div>';
  var lanes = activeTeams().map(function (tm) { return { id: tm.id, name: tm.name, color: tm.color, members: tm.members }; });
  if (jobsOn(t, null).length) lanes.push({ id: null, name: 'Niet toegewezen', color: '#8A94A8', members: '' });
  html += '<div class="teams-day">' + lanes.map(function (l) {
    var js = jobsOn(t, l.id); var mins = js.filter(function (j) { return j.status !== 'geannuleerd'; }).reduce(function (s, j) { return s + (+j.minutes || 0); }, 0);
    return '<section class="card tday"><h3><i class="sw" style="background:' + l.color + '"></i>' + esc(l.name) + '<small style="margin-left:auto;font:600 13px var(--fb);color:var(--muted)">' + (js.length ? js.length + (js.length === 1 ? ' afspraak · ' : ' afspraken · ') + dur(mins) : '') + '</small></h3>' +
      (js.length ? js.map(function (j) { return jobRow(j); }).join('') : '<p class="empty">Niets gepland vandaag.</p>') + '</section>';
  }).join('') + '</div>';
  return html;
}

function vRequests() {
  var fs = [['nieuw', 'Nieuw'], ['gepland', 'Ingepland'], ['afgewezen', 'Afgewezen'], ['gearchiveerd', 'Archief'], ['alle', 'Alles']];
  var list = A.requests.filter(function (r) { return A.rf === 'alle' || r.status === A.rf; });
  return '<div class="ad-h"><h2>Aanvragen</h2><div class="filters">' + fs.map(function (f) {
      var c = f[0] === 'alle' ? A.requests.length : A.requests.filter(function (r) { return r.status === f[0]; }).length;
      return '<button data-act="rf" data-v="' + f[0] + '" class="' + (A.rf === f[0] ? 'on' : '') + '">' + f[1] + ' (' + c + ')</button>';
    }).join('') + '</div></div>' +
    '<div class="reqs">' + (list.length ? list.map(function (r) {
      return '<article class="card rq" data-act="req-open" data-id="' + r.id + '"><div>' +
        '<h3>' + esc(r.name) + (r.company ? ' · ' + esc(r.company) : '') + ' <span class="st st-' + r.status + '">' + r.status + '</span></h3>' +
        '<div class="meta">' + esc(r.street + ', ' + r.postal + ' ' + r.city) + ' · ' + esc(r.frequency) + '</div>' +
        '<div class="tags">' + (r.services || []).map(function (s) { return '<span class="tag">' + esc(s) + '</span>'; }).join('') + '</div></div>' +
        '<div class="when">' + since(r.created_at) + '<br>' + esc((r.preferred_days || []).join(', ') || 'elke dag') + ' · ' + esc(r.preferred_period || '') + '</div></article>';
    }).join('') : '<div class="card empty">Geen aanvragen in deze lijst.</div>') + '</div>';
}

function weekDays() {
  var n = 6; var end = ymd(addDays(A.week, 6));
  if (A.jobs.some(function (j) { return j.date === end; })) n = 7;
  var a = []; for (var i = 0; i < n; i++) a.push(addDays(A.week, i)); return a;
}
function vPlanning() {
  var days = weekDays(), t = ymd(today());
  var lanes = activeTeams().filter(function (tm) { return !A.hideTeams[tm.id]; });
  var anyUn = A.jobs.some(function (j) { return !j.team_id && j.date >= ymd(A.week) && j.date <= ymd(addDays(A.week, 6)); });
  if (anyUn) lanes = lanes.concat([{ id: null, name: 'Niet toegewezen', color: '#8A94A8', members: '' }]);
  var html = '<div class="ad-h"><h2>Planning</h2><button class="abtn pri" data-act="job-new">+ Afspraak</button></div>' +
    '<div class="pl-bar"><button class="abtn" data-act="wk" data-v="-7" aria-label="Vorige week">‹</button>' +
    '<button class="abtn" data-act="wk" data-v="0">Vandaag</button><button class="abtn" data-act="wk" data-v="7" aria-label="Volgende week">›</button>' +
    '<span class="wk">Week ' + isoWeek(A.week) + ' · ' + A.week.getDate() + ' ' + MON[A.week.getMonth()] + ' – ' + addDays(A.week, 5).getDate() + ' ' + MON[addDays(A.week, 5).getMonth()] + '</span>' +
    '<div class="filters" style="margin-left:auto">' + activeTeams().map(function (tm) {
      return '<button data-act="tf" data-id="' + tm.id + '" class="' + (A.hideTeams[tm.id] ? '' : 'on') + '"><i class="sw" style="background:' + tm.color + ';margin-right:6px"></i>' + esc(tm.name) + '</button>';
    }).join('') + '</div></div>';
  // desktop grid
  html += '<div class="pl"><table><thead><tr><th class="tm">Team</th>' + days.map(function (d) {
    var s = ymd(d); return '<th class="' + (s === t ? 'today' : '') + '"><b>' + DAYS[d.getDay()] + ' ' + d.getDate() + '</b>' + MON[d.getMonth()] + '</th>';
  }).join('') + '</tr></thead><tbody>' + lanes.map(function (l) {
    return '<tr><th class="tm"><b><i class="sw" style="background:' + l.color + '"></i>' + esc(l.name) + '</b><small>' + esc(l.members || '') + '</small></th>' +
      days.map(function (d) {
        var s = ymd(d), js = jobsOn(s, l.id);
        var mins = js.filter(function (j) { return j.status !== 'geannuleerd'; }).reduce(function (a, j) { return a + (+j.minutes || 0); }, 0);
        var pct = Math.min(100, Math.round(mins / 480 * 100));
        return '<td class="' + (s === t ? 'today' : '') + '" data-drop="1" data-team="' + (l.id || '') + '" data-date="' + s + '"><div class="cell">' +
          '<div class="load' + (mins > 480 ? ' over' : '') + '" title="' + dur(mins) + ' van 8u gepland"><i style="width:' + pct + '%"></i></div>' +
          js.map(chip).join('') +
          '<button class="add-in" data-act="job-new" data-date="' + s + '" data-team="' + (l.id || '') + '">+ afspraak</button></div></td>';
      }).join('') + '</tr>';
  }).join('') + '</tbody></table></div>' +
  '<div class="legend pl-desk-only"><span><i style="background:repeating-linear-gradient(135deg,#fff 0 4px,#E3E9F5 4px 8px)"></i>gepland (nog te bevestigen)</span><span><i style="background:#fff"></i>bevestigd</span><span><i style="background:#fff;opacity:.5"></i>uitgevoerd ✓</span><span>Sleep een afspraak naar een andere dag of een ander team.</span></div>';
  // mobile
  if (A.mday < ymd(A.week) || A.mday > ymd(addDays(A.week, 6))) A.mday = (t >= ymd(A.week) && t <= ymd(addDays(A.week, 6))) ? t : ymd(A.week);
  html += '<div class="pl-m"><div class="daystrip">' + [0, 1, 2, 3, 4, 5, 6].map(function (i) {
    var d = addDays(A.week, i), s = ymd(d), js = jobsOn(s);
    return '<button data-act="mday" data-v="' + s + '" class="' + (A.mday === s ? 'on' : '') + '">' + DAYS[d.getDay()] + '<b>' + d.getDate() + '</b><span class="dots">' +
      js.slice(0, 4).map(function (j) { return '<i style="background:' + tColor(j.team_id) + '"></i>'; }).join('') + '</span></button>';
  }).join('') + '</div>';
  var ml = activeTeams().map(function (tm) { return { id: tm.id, name: tm.name, color: tm.color }; });
  if (jobsOn(A.mday, null).length) ml.push({ id: null, name: 'Niet toegewezen', color: '#8A94A8' });
  html += '<div style="display:grid;gap:12px">' + ml.map(function (l) {
    var js = jobsOn(A.mday, l.id);
    return '<section class="card tday"><h3><i class="sw" style="background:' + l.color + '"></i>' + esc(l.name) + '</h3>' + (js.length ? js.map(function (j) { return jobRow(j); }).join('') : '<p class="empty">Vrij</p>') +
      '<button class="abtn sm" style="margin-top:8px" data-act="job-new" data-date="' + A.mday + '" data-team="' + (l.id || '') + '">+ afspraak</button></section>';
  }).join('') + '</div></div>';
  return html;
}
function chip(j) {
  return '<button class="chip s-' + j.status + '" draggable="true" data-act="job-edit" data-id="' + j.id + '" style="--c:' + tColor(j.team_id) + '">' +
    '<b>' + hm(j.start_time) + ' ' + esc(j.title) + '</b><span>' + esc((j.address || '').split(',').pop().trim()) + ' · ' + dur(j.minutes) + '</span></button>';
}

function vCustomers() {
  var q = A.cq.toLowerCase();
  var list = A.customers.filter(function (c) {
    if (A.cf === 'beurt') { var s = custStatus(c); if (s.state !== 'over' && s.state !== 'soon') return false; }
    if (A.cf === 'bedrijf' && c.client_type === 'particulier') return false;
    if (A.cf === 'inactief') return !c.active;
    if (A.cf !== 'inactief' && !c.active) return false;
    return !q || [c.name, c.company, c.street, c.city, c.postal, c.phone, c.email].join(' ').toLowerCase().indexOf(q) >= 0;
  });
  var fs = [['alle', 'Alle'], ['beurt', 'Aan de beurt (' + dueCustomers().length + ')'], ['bedrijf', 'Bedrijven & VvE'], ['inactief', 'Inactief']];
  return '<div class="ad-h"><h2>Klanten</h2><input class="search" type="search" placeholder="Zoek op naam, straat, gemeente…" value="' + esc(A.cq) + '" data-act="cq" aria-label="Zoek klant">' +
    '<button class="abtn pri" data-act="cus-new">+ Klant</button></div>' +
    '<div class="filters" style="margin-bottom:14px">' + fs.map(function (f) { return '<button data-act="cf" data-v="' + f[0] + '" class="' + (A.cf === f[0] ? 'on' : '') + '">' + f[1] + '</button>'; }).join('') + '</div>' +
    '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr><th>Klant</th><th>Adres</th><th>Diensten</th><th>Ronde</th><th>Laatste beurt</th><th>Volgende</th><th></th></tr></thead><tbody>' +
    (list.length ? list.map(function (c) {
      var s = custStatus(c);
      var nxt = s.next ? 'Ingepland ' + fd(s.next) : (s.due ? '<span class="' + (s.state === 'over' ? 'due-over' : s.state === 'soon' ? 'due-soon' : '') + '">' + (s.state === 'over' ? 'Te laat · ' : 'Rond ') + fd(s.due) + '</span>' : '—');
      return '<tr data-act="cus-edit" data-id="' + c.id + '"><td><b>' + esc(c.name) + '</b><small>' + esc(c.phone || '') + '</small></td>' +
        '<td>' + esc(c.street) + '<small>' + esc(c.postal + ' ' + c.city) + '</small></td>' +
        '<td class="hide-m">' + esc((c.services || []).join(', ')) + '</td>' +
        '<td>' + freqLabel(c.frequency_weeks) + '<small><i class="sw" style="background:' + tColor(c.default_team) + '"></i> ' + esc(tName(c.default_team)) + '</small></td>' +
        '<td class="hide-m">' + (s.last ? fd(s.last) : '—') + '</td><td>' + nxt + '</td>' +
        '<td><button class="abtn sm" data-act="cus-plan" data-id="' + c.id + '">Plan</button></td></tr>';
    }).join('') : '<tr><td colspan="7" class="empty">Geen klanten gevonden.</td></tr>') + '</tbody></table></div>';
}

function vTeams() {
  return '<div class="ad-h"><h2>Teams</h2><button class="abtn pri" data-act="team-new">+ Team</button></div>' +
    '<p style="color:var(--muted);margin:-6px 0 16px">Elk team krijgt een eigen kleur in de planning. Een inactief team verdwijnt uit de planning, maar zijn afspraken blijven bewaard.</p>' +
    '<div class="tgrid">' + A.teams.map(function (t) {
      var n = A.jobs.filter(function (j) { return j.team_id === t.id && j.date >= ymd(today()) && j.status !== 'geannuleerd'; }).length;
      return '<form class="card tcard" data-team-form="' + t.id + '">' +
        '<div class="row" style="grid-template-columns:1fr 64px;gap:10px"><div class="fld" style="margin:0"><label>Naam</label><input name="name" value="' + esc(t.name) + '" required maxlength="60"></div>' +
        '<div class="fld" style="margin:0"><label>Kleur</label><input name="color" type="color" value="' + esc(t.color) + '" style="padding:4px;min-height:44px"></div></div>' +
        '<div class="fld" style="margin:0"><label>Leden / wagen</label><input name="members" value="' + esc(t.members || '') + '" placeholder="Bv. namen van de ploeg"></div>' +
        '<label style="display:flex;gap:8px;align-items:center;font-weight:600"><input type="checkbox" name="active"' + (t.active ? ' checked' : '') + '> Actief in de planning</label>' +
        '<div style="display:flex;justify-content:space-between;align-items:center"><small style="color:var(--muted)">' + n + ' komende afspraken</small><button class="abtn pri sm">Opslaan</button></div></form>';
    }).join('') + '</div>';
}

/* ---------- panels ---------- */
function panel(title, body, foot, onMount) {
  var ov = $('#ov');
  ov.innerHTML = '<div class="panel" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><header><h3>' + esc(title) + '</h3><button class="x" data-act="close" aria-label="Sluiten">×</button></header><div class="pb">' + body + '</div><footer>' + (foot || '') + '</footer></div>';
  ov.hidden = false;
  var f = $('input:not([type=hidden]):not([type=checkbox]), select, textarea', ov); if (f && window.innerWidth > 820) setTimeout(function () { f.focus(); }, 30);
  if (onMount) onMount($('.panel', ov));
}
function closePanel() { var ov = $('#ov'); if (ov) { ov.hidden = true; ov.innerHTML = ''; } }

var SERVICES = ['Ramen buiten', 'Ramen binnen', 'Zonnepanelen', 'Veranda / koepel', 'Rolluiken', 'Dakgoten', 'Kornissen & houtwerk'];
function svcPick(sel) { return '<div class="pick">' + SERVICES.map(function (s) { return '<label><input type="checkbox" name="services" value="' + esc(s) + '"' + ((sel || []).indexOf(s) >= 0 ? ' checked' : '') + '><span>' + esc(s) + '</span></label>'; }).join('') + '</div>'; }
function teamSel(v, allowNone) { return '<select name="team_id">' + (allowNone ? '<option value="">— Niet toegewezen —</option>' : '') + A.teams.filter(function (t) { return t.active || t.id === v; }).map(function (t) { return '<option value="' + t.id + '"' + (t.id === v ? ' selected' : '') + '>' + esc(t.name) + '</option>'; }).join('') + '</select>'; }
function minSel(v) { return '<select name="minutes">' + [30, 45, 60, 90, 120, 150, 180, 240, 300, 360, 420, 480].map(function (m) { return '<option value="' + m + '"' + (+v === m ? ' selected' : '') + '>' + dur(m) + '</option>'; }).join('') + '</select>'; }
function freqSel(v) { return '<select name="frequency_weeks"><option value="">Eenmalig / geen ronde</option>' + [4, 6, 8, 10, 12, 13, 26, 52].map(function (w) { return '<option value="' + w + '"' + (+v === w ? ' selected' : '') + '>' + freqLabel(w) + (w === 26 ? ' (halfjaarlijks)' : '') + '</option>'; }).join('') + '</select>'; }
function dayLoadHint(teamId, date, exceptId) {
  if (!teamId || !date) return '';
  var js = jobsOn(date, teamId).filter(function (j) { return j.id !== exceptId && j.status !== 'geannuleerd'; });
  if (!js.length) return tName(teamId) + ' heeft die dag nog niets gepland.';
  var m = js.reduce(function (a, j) { return a + (+j.minutes || 0); }, 0);
  return tName(teamId) + ' heeft ' + fd(date) + ' al ' + js.length + ' afspraak' + (js.length > 1 ? 'en' : '') + ' (' + dur(m) + '): ' + js.map(function (j) { return hm(j.start_time) + ' ' + j.title; }).join(', ') + '.';
}
function bindHint(p, exceptId) {
  var h = $('[data-hint]', p); if (!h) return;
  var upd = function () { h.textContent = dayLoadHint($('[name=team_id]', p).value, $('[name=date]', p).value, exceptId); };
  ['team_id', 'date'].forEach(function (n) { var e = $('[name=' + n + ']', p); if (e) e.addEventListener('change', upd); });
  upd();
}

function openRequest(id) {
  var r = A.requests.find(function (x) { return x.id === id; }); if (!r) return;
  var body =
    '<div class="qa"><a class="abtn" href="' + telHref(r.phone) + '">📞 Bellen</a><a class="abtn" href="mailto:' + esc(r.email) + '?subject=' + encodeURIComponent('Je aanvraag bij Belle Equipe') + '">✉️ Mailen</a><a class="abtn" href="' + waHref(r.phone) + '" target="_blank" rel="noopener">💬 WhatsApp</a><a class="abtn" href="' + mapsUrl(r.street + ', ' + r.postal + ' ' + r.city) + '" target="_blank" rel="noopener">📍 Kaart</a></div>' +
    '<dl class="kv"><dt>Status</dt><dd><span class="st st-' + r.status + '">' + r.status + '</span> · ' + since(r.created_at) + '</dd>' +
    '<dt>Klant</dt><dd>' + esc(r.name) + (r.company ? ' · ' + esc(r.company) : '') + ' (' + esc(r.client_type) + ')</dd>' +
    '<dt>Telefoon</dt><dd>' + esc(r.phone) + '</dd><dt>E-mail</dt><dd>' + esc(r.email) + '</dd>' +
    '<dt>Adres</dt><dd>' + esc(r.street) + ', ' + esc(r.postal + ' ' + r.city) + '</dd>' +
    '<dt>Gebouw</dt><dd>' + esc(r.building) + ' · ' + esc(r.floors) + '</dd>' +
    '<dt>Diensten</dt><dd>' + esc((r.services || []).join(', ')) + '</dd><dt>Frequentie</dt><dd>' + esc(r.frequency) + '</dd>' +
    '<dt>Voorkeur</dt><dd>' + esc((r.preferred_days || []).join(', ') || 'elke dag') + ' · ' + esc(r.preferred_period) + (r.preferred_from ? ' · vanaf ' + fd(r.preferred_from) : '') + '</dd></dl>' +
    (r.message ? '<div class="note-box">' + esc(r.message) + '</div>' : '') +
    '<div class="fld"><label for="rnote">Interne notitie</label><textarea id="rnote" name="note" placeholder="Bv. offerte doorgebeld, prijs afgesproken…">' + esc(r.note || '') + '</textarea></div>';
  var foot = (r.status !== 'nieuw' ? '<button class="abtn sm spacer" data-act="req-status" data-v="nieuw" data-id="' + r.id + '">Terug naar nieuw</button>' : '<span class="spacer"></span>') +
    (r.status !== 'gearchiveerd' ? '<button class="abtn" data-act="req-status" data-v="gearchiveerd" data-id="' + r.id + '">Archiveren</button>' : '') +
    (r.status === 'nieuw' ? '<button class="abtn danger" data-act="req-status" data-v="afgewezen" data-id="' + r.id + '">Afwijzen</button>' : '') +
    '<button class="abtn" data-act="req-note" data-id="' + r.id + '">Notitie opslaan</button>' +
    (r.status === 'nieuw' ? '<button class="abtn pri" data-act="req-plan" data-id="' + r.id + '">Inplannen →</button>' : '');
  panel('Aanvraag ' + r.name, body, foot);
}
function suggestDate(r) {
  var start = addDays(today(), 1);
  if (r.preferred_from && pd(r.preferred_from) > start) start = pd(r.preferred_from);
  var want = (r.preferred_days || []).map(function (d) { return DAYS.indexOf(d); });
  for (var i = 0; i < 21; i++) { var d = addDays(start, i); if (d.getDay() === 0) continue; if (!want.length || want.indexOf(d.getDay()) >= 0) return ymd(d); }
  return ymd(start);
}
function planRequest(id) {
  var r = A.requests.find(function (x) { return x.id === id; }); if (!r) return;
  var fw = freqWeeks(r.frequency) || (/Jaarlijks/.test(r.frequency) ? 52 : null);
  var tm = activeTeams()[0];
  var body = '<form id="pf"><p style="color:var(--muted);margin-bottom:14px">' + esc(r.name) + ' · ' + esc(r.street + ', ' + r.city) + '</p>' +
    '<div class="row"><div class="fld"><label>Team</label>' + teamSel(tm && tm.id, true) + '</div><div class="fld"><label>Datum</label><input type="date" name="date" value="' + suggestDate(r) + '" required></div></div>' +
    '<p data-hint style="margin:-4px 0 14px;font-size:14px;color:var(--blue-d);background:var(--sky);border-radius:10px;padding:10px 12px"></p>' +
    '<div class="row"><div class="fld"><label>Startuur</label><input type="time" name="start_time" step="900" value="' + (r.preferred_period === 'Namiddag' ? '13:00' : '08:30') + '" required></div><div class="fld"><label>Duur (schatting)</label>' + minSel(r.client_type === 'particulier' ? 90 : 120) + '</div></div>' +
    '<div class="fld"><label>Status</label><select name="status"><option value="gepland">Gepland (nog te bevestigen)</option><option value="bevestigd">Bevestigd met de klant</option></select></div>' +
    '<div class="fld"><label>Vaste ronde</label>' + freqSel(fw) + '</div>' +
    '<div class="fld"><label>Notitie voor het team</label><textarea name="notes" placeholder="Bv. sleutel bij de buren, parkeren op de oprit…">' + esc(r.message || '') + '</textarea></div></form>';
  panel('Inplannen', body, '<button class="abtn spacer" data-act="req-open" data-id="' + r.id + '">← Terug</button><button class="abtn pri" data-act="req-plan-save" data-id="' + r.id + '">Inplannen &amp; klant aanmaken</button>', function (p) { bindHint(p); });
}
function savePlan(id, btn) {
  var r = A.requests.find(function (x) { return x.id === id; }); var f = $('#pf');
  if (!f.date.value || !f.start_time.value) { toast('Kies een datum en startuur.'); return; }
  busy(btn, true);
  var api = A.api, c;
  var cRow = { name: r.company || r.name, company: r.company || '', client_type: r.client_type, email: r.email, phone: r.phone, street: r.street, postal: r.postal, city: r.city, services: r.services || [], frequency_weeks: f.frequency_weeks.value ? +f.frequency_weeks.value : null, default_team: f.team_id.value || null, default_minutes: +f.minutes.value, notes: r.company ? 'Contact: ' + r.name : '', active: true };
  api.insert('customers', cRow).then(function (cc) {
    c = cc; A.customers.push(c);
    return api.insert('jobs', { team_id: f.team_id.value || null, customer_id: c.id, request_id: r.id, date: f.date.value, start_time: f.start_time.value, minutes: +f.minutes.value, status: f.status.value, title: c.name, address: r.street + ', ' + r.postal + ' ' + r.city, services: r.services || [], notes: f.notes.value });
  }).then(function (j) {
    A.jobs.push(j);
    return api.update('requests', r.id, { status: 'gepland', customer_id: c.id });
  }).then(function (nr) {
    Object.assign(r, nr); closePanel(); render(); toast('Ingepland op ' + fd(f.date.value) + ' bij ' + tName(f.team_id.value || null) + '.');
  }).catch(function (e) { busy(btn, false); toast('Opslaan lukt niet: ' + e.message); });
}

function openJob(id, preset) {
  var j = id ? A.jobs.find(function (x) { return x.id === id; }) : Object.assign({ date: ymd(today()), start_time: '08:30', minutes: 60, status: 'gepland', title: '', address: '', services: [], notes: '', team_id: (activeTeams()[0] || {}).id }, preset || {});
  if (!j) return;
  var c = cust(j.customer_id);
  var body = '<form id="jf">' +
    '<div class="fld"><label>Klant</label><select name="customer_id"><option value="">— Losse afspraak (geen vaste klant) —</option>' + A.customers.filter(function (x) { return x.active || x.id === j.customer_id; }).map(function (x) { return '<option value="' + x.id + '"' + (x.id === j.customer_id ? ' selected' : '') + '>' + esc(x.name) + ' · ' + esc(x.city) + '</option>'; }).join('') + '</select></div>' +
    '<div class="fld"><label>Titel</label><input name="title" value="' + esc(j.title) + '" required placeholder="Naam klant of omschrijving"></div>' +
    '<div class="fld"><label>Adres</label><input name="address" value="' + esc(j.address || '') + '"></div>' +
    '<div class="row"><div class="fld"><label>Team</label>' + teamSel(j.team_id, true) + '</div><div class="fld"><label>Datum</label><input type="date" name="date" value="' + esc(j.date) + '" required></div></div>' +
    '<p data-hint style="margin:-4px 0 14px;font-size:14px;color:var(--blue-d);background:var(--sky);border-radius:10px;padding:10px 12px"></p>' +
    '<div class="row"><div class="fld"><label>Startuur</label><input type="time" name="start_time" step="900" value="' + hm(j.start_time) + '" required></div><div class="fld"><label>Duur</label>' + minSel(j.minutes) + '</div></div>' +
    '<div class="fld"><label>Status</label><select name="status">' + ['gepland', 'bevestigd', 'uitgevoerd', 'geannuleerd'].map(function (s) { return '<option' + (j.status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div>' +
    '<div class="fld"><label>Diensten</label>' + svcPick(j.services) + '</div>' +
    '<div class="fld"><label>Notities</label><textarea name="notes">' + esc(j.notes || '') + '</textarea></div>' +
    (c && c.phone ? '<div class="qa"><a class="abtn sm" href="' + telHref(c.phone) + '">📞 ' + esc(c.phone) + '</a>' + (j.address ? '<a class="abtn sm" href="' + mapsUrl(j.address) + '" target="_blank" rel="noopener">📍 Route</a>' : '') + '</div>' : '') +
    '</form>';
  var foot = (id ? '<button class="abtn danger spacer" data-act="job-del" data-id="' + id + '">Verwijderen</button>' : '<span class="spacer"></span>') +
    (id && c && c.frequency_weeks && j.status !== 'uitgevoerd' ? '<button class="abtn ok" data-act="job-done" data-id="' + id + '">✓ Klaar + volgende plannen</button>' : '') +
    '<button class="abtn pri" data-act="job-save" data-id="' + (id || '') + '">Opslaan</button>';
  panel(id ? 'Afspraak' : 'Nieuwe afspraak', body, foot, function (p) {
    bindHint(p, id);
    $('[name=customer_id]', p).addEventListener('change', function (e) {
      var cc = cust(e.target.value); if (!cc) return;
      p.querySelector('[name=title]').value = cc.name;
      p.querySelector('[name=address]').value = cc.street + ', ' + cc.postal + ' ' + cc.city;
      if (cc.default_team) { p.querySelector('[name=team_id]').value = cc.default_team; }
      if (cc.default_minutes) p.querySelector('[name=minutes]').value = cc.default_minutes;
      $$('[name=services]', p).forEach(function (i) { i.checked = (cc.services || []).indexOf(i.value) >= 0; });
      p.querySelector('[name=team_id]').dispatchEvent(new Event('change'));
    });
  });
}
function saveJob(id, btn) {
  var f = $('#jf');
  var row = { customer_id: f.customer_id.value || null, title: f.elements['title'].value.trim(), address: f.address.value.trim(), team_id: f.team_id.value || null, date: f.date.value, start_time: f.start_time.value, minutes: +f.minutes.value, status: f.status.value, services: $$('[name=services]:checked', f).map(function (i) { return i.value; }), notes: f.notes.value };
  if (!row.title || !row.date || !row.start_time) { toast('Vul titel, datum en startuur in.'); return; }
  busy(btn, true);
  var p = id ? A.api.update('jobs', id, row) : A.api.insert('jobs', row);
  p.then(function (j) {
    if (id) Object.assign(A.jobs.find(function (x) { return x.id === id; }), j); else A.jobs.push(j);
    closePanel(); render(); toast(id ? 'Afspraak bijgewerkt.' : 'Afspraak toegevoegd.');
  }).catch(function (e) { busy(btn, false); toast('Opslaan lukt niet: ' + e.message); });
}
function jobDone(id) {
  var j = A.jobs.find(function (x) { return x.id === id; }); if (!j) return;
  var c = cust(j.customer_id);
  A.api.update('jobs', id, { status: 'uitgevoerd' }).then(function (nj) {
    Object.assign(j, nj);
    if (c && c.frequency_weeks && c.active) {
      var has = A.jobs.some(function (x) { return x.customer_id === c.id && x.id !== j.id && x.date > j.date && (x.status === 'gepland' || x.status === 'bevestigd'); });
      if (!has) {
        var nd = addDays(pd(j.date), c.frequency_weeks * 7);
        return A.api.insert('jobs', { team_id: j.team_id, customer_id: c.id, date: ymd(nd), start_time: j.start_time, minutes: j.minutes, status: 'gepland', title: j.title, address: j.address, services: j.services, notes: '' })
          .then(function (n) { A.jobs.push(n); return 'Klaar ✓ — volgende beurt gepland op ' + fd(nd) + '.'; });
      }
    }
    return 'Afspraak afgevinkt ✓';
  }).then(function (m) { closePanel(); render(); toast(m); }).catch(function (e) { toast('Lukt niet: ' + e.message); });
}

function openCustomer(id, plan) {
  var c = id ? cust(id) : { name: '', company: '', client_type: 'particulier', email: '', phone: '', street: '', postal: '', city: '', services: [], frequency_weeks: null, default_team: (activeTeams()[0] || {}).id, default_minutes: 60, notes: '', active: true };
  if (!c) return;
  if (plan) { var s = custStatus(c); return openJob(null, { customer_id: c.id, title: c.name, address: c.street + ', ' + c.postal + ' ' + c.city, team_id: c.default_team, minutes: c.default_minutes || 60, services: c.services, date: s.due && s.due > ymd(today()) ? s.due : ymd(addDays(today(), 1)) }); }
  var st = id ? custStatus(c) : null;
  var hist = id ? A.jobs.filter(function (j) { return j.customer_id === id; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 8) : [];
  var body = '<form id="cf">' +
    '<div class="row"><div class="fld"><label>Naam</label><input name="name" value="' + esc(c.name) + '" required></div><div class="fld"><label>Type</label><select name="client_type">' + [['particulier', 'Particulier'], ['bedrijf', 'Bedrijf'], ['vve', 'VvE / appartement']].map(function (o) { return '<option value="' + o[0] + '"' + (c.client_type === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div></div>' +
    '<div class="row"><div class="fld"><label>Telefoon</label><input name="phone" type="tel" value="' + esc(c.phone) + '"></div><div class="fld"><label>E-mail</label><input name="email" type="email" value="' + esc(c.email) + '"></div></div>' +
    '<div class="fld"><label>Straat en nr.</label><input name="street" value="' + esc(c.street) + '"></div>' +
    '<div class="row"><div class="fld"><label>Postcode</label><input name="postal" value="' + esc(c.postal) + '"></div><div class="fld"><label>Gemeente</label><input name="city" value="' + esc(c.city) + '"></div></div>' +
    '<div class="row"><div class="fld"><label>Vaste ronde</label>' + freqSel(c.frequency_weeks) + '</div><div class="fld"><label>Vast team</label>' + teamSel(c.default_team, true) + '</div></div>' +
    '<div class="fld"><label>Gewone duur</label>' + minSel(c.default_minutes || 60) + '</div>' +
    '<div class="fld"><label>Diensten</label>' + svcPick(c.services) + '</div>' +
    '<div class="fld"><label>Notities (prijs, sleutel, bijzonderheden)</label><textarea name="notes">' + esc(c.notes || '') + '</textarea></div>' +
    '<label style="display:flex;gap:8px;align-items:center;font-weight:600;margin-bottom:16px"><input type="checkbox" name="active"' + (c.active ? ' checked' : '') + '> Actieve klant</label>' +
    (id ? '<h3 style="font-size:16px;margin:6px 0 8px">Historiek</h3>' + (hist.length ? hist.map(function (j) { return '<div style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-top:1px solid var(--line);font-size:14px"><span>' + fd(j.date) + ' ' + hm(j.start_time) + ' · ' + esc(tName(j.team_id)) + '</span><span class="st st-' + j.status + '">' + j.status + '</span></div>'; }).join('') : '<p class="empty">Nog geen afspraken.</p>') : '') +
    '</form>';
  panel(id ? c.name : 'Nieuwe klant', body, (id ? '<button class="abtn spacer" data-act="cus-plan" data-id="' + id + '">Plan een beurt</button>' : '<span class="spacer"></span>') + '<button class="abtn pri" data-act="cus-save" data-id="' + (id || '') + '">Opslaan</button>');
}
function saveCustomer(id, btn) {
  var f = $('#cf');
  var row = { name: f.elements['name'].value.trim(), client_type: f.client_type.value, phone: f.phone.value.trim(), email: f.email.value.trim(), street: f.street.value.trim(), postal: f.postal.value.trim(), city: f.city.value.trim(), frequency_weeks: f.frequency_weeks.value ? +f.frequency_weeks.value : null, default_team: f.team_id.value || null, default_minutes: +f.minutes.value, services: $$('[name=services]:checked', f).map(function (i) { return i.value; }), notes: f.notes.value, active: f.active.checked };
  if (!row.name) { toast('Geef een naam in.'); return; }
  busy(btn, true);
  (id ? A.api.update('customers', id, row) : A.api.insert('customers', row)).then(function (c) {
    if (id) Object.assign(cust(id), c); else A.customers.push(c);
    A.customers.sort(function (a, b) { return a.name.localeCompare(b.name); });
    closePanel(); render(); toast('Klant opgeslagen.');
  }).catch(function (e) { busy(btn, false); toast('Opslaan lukt niet: ' + e.message); });
}

function busy(b, on) { if (!b) return; b.disabled = on; if (on) { b.dataset.t = b.innerHTML; b.innerHTML = '<span class="spin" style="border-color:rgba(0,0,0,.15);border-top-color:currentColor"></span> Bezig…'; } else if (b.dataset.t) b.innerHTML = b.dataset.t; }

function printDay(date) {
  var lanes = activeTeams().map(function (t) { return t; });
  var html = lanes.map(function (t) {
    var js = jobsOn(date, t.id).filter(function (j) { return j.status !== 'geannuleerd'; });
    if (!js.length) return '';
    return '<div class="tpage"><h1>Belle Equipe &amp; zn. — ' + esc(t.name) + '</h1><p>' + fd(date, true) + ' ' + pd(date).getFullYear() + (t.members ? ' · ' + esc(t.members) : '') + '</p>' +
      '<table><thead><tr><th>Uur</th><th>Klant</th><th>Adres</th><th>Tel.</th><th>Werk</th><th>Notities</th><th>✓</th></tr></thead><tbody>' +
      js.map(function (j) { var c = cust(j.customer_id); return '<tr><td>' + hm(j.start_time) + '–' + addMin(j.start_time, j.minutes) + '</td><td>' + esc(j.title) + '</td><td>' + esc(j.address) + '</td><td>' + esc((c && c.phone) || '') + '</td><td>' + esc((j.services || []).join(', ')) + '</td><td>' + esc(j.notes || (c && c.notes) || '') + '</td><td style="width:12mm"></td></tr>'; }).join('') +
      '</tbody></table></div>';
  }).join('');
  if (!html) { toast('Er is niets gepland op ' + fd(date) + '.'); return; }
  $('#print-sheet').innerHTML = html; window.print();
}

/* ---------- events ---------- */
function onClick(e) {
  var el = e.target.closest('[data-act],[data-tab]'); if (!el || !root.contains(el)) return;
  if (el.closest('#ov') && e.target === $('#ov')) return;
  var act = el.getAttribute('data-act'), id = el.getAttribute('data-id'), v = el.getAttribute('data-v');
  if (el.hasAttribute('data-tab') && !act) { A.tab = el.getAttribute('data-tab'); render(); return; }
  switch (act) {
    case 'logout': if (A.demo) { ssSet('be-demo', null); A.api = null; A.loaded = false; location.hash = '#top'; } else logout(); break;
    case 'demo-reset': DemoDB.reset(); loadAll(); toast('Demogegevens hersteld.'); break;
    case 'close': closePanel(); break;
    case 'rf': A.rf = v; render(); break;
    case 'cf': A.cf = v; render(); break;
    case 'due': A.tab = 'klanten'; A.cf = 'beurt'; render(); break;
    case 'wk': A.week = +v === 0 ? monday(today()) : addDays(A.week, +v); if (+v === 0) A.mday = ymd(today()); render(); break;
    case 'tf': A.hideTeams[id] = !A.hideTeams[id]; render(); break;
    case 'mday': A.mday = v; render(); break;
    case 'req-open': openRequest(id); break;
    case 'req-plan': planRequest(id); break;
    case 'req-plan-save': savePlan(id, el); break;
    case 'req-note': A.api.update('requests', id, { note: $('#rnote').value }).then(function (r) { Object.assign(A.requests.find(function (x) { return x.id === id; }), r); toast('Notitie opgeslagen.'); }).catch(function (er) { toast(er.message); }); break;
    case 'req-status': A.api.update('requests', id, { status: v }).then(function (r) { Object.assign(A.requests.find(function (x) { return x.id === id; }), r); closePanel(); render(); toast('Aanvraag: ' + v + '.'); }).catch(function (er) { toast(er.message); }); break;
    case 'job-new': e.stopPropagation(); openJob(null, { date: el.getAttribute('data-date') || ymd(today()), team_id: el.hasAttribute('data-team') ? (el.getAttribute('data-team') || null) : (activeTeams()[0] || {}).id }); break;
    case 'job-edit': openJob(id); break;
    case 'job-save': saveJob(id || null, el); break;
    case 'job-done': jobDone(id); break;
    case 'job-del': if (confirm('Deze afspraak definitief verwijderen? Tip: zet ze liever op "geannuleerd" om de historiek te bewaren.')) A.api.remove('jobs', id).then(function () { A.jobs = A.jobs.filter(function (x) { return x.id !== id; }); closePanel(); render(); toast('Verwijderd.'); }).catch(function (er) { toast(er.message); }); break;
    case 'cus-new': openCustomer(null); break;
    case 'cus-edit': if (e.target.closest('[data-act=cus-plan]')) return; openCustomer(id); break;
    case 'cus-plan': e.stopPropagation(); openCustomer(id, true); break;
    case 'cus-save': saveCustomer(id || null, el); break;
    case 'team-new': A.api.insert('teams', { name: 'Team ' + (A.teams.length + 1), color: ['#2547B8', '#0E9F8E', '#C2410C', '#7C3AED', '#BE185D', '#0369A1'][A.teams.length % 6], members: '', active: true, sort: A.teams.length + 1 }).then(function (t) { A.teams.push(t); render(); toast('Team toegevoegd.'); }).catch(function (er) { toast(er.message); }); break;
    case 'print': printDay(el.getAttribute('data-date')); break;
  }
}
function onSubmit(e) {
  var f = e.target.closest('[data-team-form]'); if (!f) return; e.preventDefault();
  var id = f.getAttribute('data-team-form');
  var row = { name: f.elements['name'].value.trim() || 'Team', color: f.color.value, members: f.members.value.trim(), active: f.active.checked };
  A.api.update('teams', id, row).then(function (t) { Object.assign(team(id), t); render(); toast('Team opgeslagen.'); }).catch(function (er) { toast(er.message); });
}
function onInput(e) {
  if (e.target.matches('[data-act=cq]')) {
    A.cq = e.target.value; var pos = e.target.selectionStart; render();
    var s = $('[data-act=cq]', root); s.focus(); try { s.setSelectionRange(pos, pos); } catch (er) {}
  }
}
function bindDnD() {
  var dragId = null;
  $$('.chip[draggable]', root).forEach(function (c) {
    c.addEventListener('dragstart', function (e) { dragId = c.getAttribute('data-id'); c.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', dragId); } catch (er) {} });
    c.addEventListener('dragend', function () { c.classList.remove('dragging'); $$('td.drop', root).forEach(function (t) { t.classList.remove('drop'); }); });
  });
  $$('td[data-drop]', root).forEach(function (td) {
    td.addEventListener('dragover', function (e) { e.preventDefault(); td.classList.add('drop'); });
    td.addEventListener('dragleave', function () { td.classList.remove('drop'); });
    td.addEventListener('drop', function (e) {
      e.preventDefault(); td.classList.remove('drop');
      var id = dragId || e.dataTransfer.getData('text/plain'); var j = A.jobs.find(function (x) { return x.id === id; }); if (!j) return;
      var nt = td.getAttribute('data-team') || null, nd = td.getAttribute('data-date');
      if ((j.team_id || null) === nt && j.date === nd) return;
      var old = { team_id: j.team_id, date: j.date };
      j.team_id = nt; j.date = nd; render();
      A.api.update('jobs', id, { team_id: nt, date: nd }).then(function (r) { Object.assign(j, r); toast(j.title + ' → ' + tName(nt) + ', ' + fd(nd)); })
        .catch(function (er) { Object.assign(j, old); render(); toast('Verplaatsen lukt niet: ' + er.message); });
    });
  });
}

/* ---------- routing ---------- */
function route() {
  var h = location.hash;
  if (h === '#beheer' || /type=recovery/.test(h)) openAdmin();
  else if (document.body.classList.contains('admin-open')) closeAdmin();
}
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePanel(); });

document.addEventListener('DOMContentLoaded', function () {
  initSite();
  root = $('#beheer');
  root.addEventListener('click', onClick);
  root.addEventListener('submit', onSubmit);
  root.addEventListener('input', onInput);
  root.addEventListener('mousedown', function (e) { if (e.target.id === 'ov') closePanel(); });
  window.addEventListener('hashchange', route);
  route();
});
})();
