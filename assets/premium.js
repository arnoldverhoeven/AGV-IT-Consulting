/* AGV IT Consulting — premium redesign: showcase animations.
   Extern bestand (CSP: script-src 'self'). Respecteert prefers-reduced-motion. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* Speelt `play(stop)` herhaald af zolang el in beeld is. */
  function whileVisible(el, play, threshold) {
    if (!('IntersectionObserver' in window)) { return; }
    var active = false, running = false;
    function stop() { return !active; }
    function again() {
      if (!active) { running = false; return; }
      Promise.resolve(play(stop)).then(function () { setTimeout(again, 60); }, function () { running = false; });
    }
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        active = e.isIntersecting;
        if (active && !running) { running = true; again(); }
      });
    }, { threshold: threshold || 0.35 }).observe(el);
  }
  function once(el, fn, threshold) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { io.disconnect(); fn(); }
    }, { threshold: threshold || 0.3 });
    io.observe(el);
  }

  function init() {
    /* ---------- header: voortgang + mobiel menu ---------- */
    var header = $('#site-header');
    var tl = $('#tl');
    function onScroll() {
      var h = root.scrollHeight - window.innerHeight;
      if (header) { header.style.setProperty('--sp', h > 0 ? (window.scrollY / h).toFixed(4) : 0); }
      if (tl) {
        var r = tl.getBoundingClientRect();
        tl.style.setProperty('--tp', clamp((window.innerHeight * 0.62 - r.top) / r.height, 0, 1).toFixed(4));
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    var tog = $('.nav-toggle');
    if (tog && header) {
      var setNav = function (open) {
        header.classList.toggle('nav-open', open);
        tog.setAttribute('aria-expanded', open ? 'true' : 'false');
        tog.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      };
      tog.addEventListener('click', function () { setNav(!header.classList.contains('nav-open')); });
      $$('#site-nav a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setNav(false); } });
      window.addEventListener('resize', function () { if (window.innerWidth > 900) { setNav(false); } });
    }

    /* ---------- hero: spotlight ---------- */
    var hero = $('.hero');
    if (hero && fine && !reduce) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    }

    /* ---------- hero: portfolio-showcase (rustige crossfade) ---------- */
    var sc = $('#showcase');
    if (sc && !reduce) {
      var imgs = $$('.sc-stage > [data-url]', sc), urlEl = $('#sc-url'), linkEl = $('#sc-link'), tagEl = $('#sc-tag'), cur = 0;
      whileVisible(sc, function (stop) {
        return wait(4800).then(function () {
          if (stop()) { return; }
          imgs[cur].classList.remove('on');
          cur = (cur + 1) % imgs.length;
          imgs[cur].classList.add('on');
          urlEl.textContent = imgs[cur].getAttribute('data-url');
          linkEl.setAttribute('href', imgs[cur].getAttribute('data-href'));
          tagEl.textContent = imgs[cur].getAttribute('data-tag');
          if (imgs[cur].hasAttribute('data-self')) { linkEl.removeAttribute('target'); linkEl.removeAttribute('rel'); linkEl.setAttribute('aria-label', 'See the full portfolio'); }
          else { linkEl.setAttribute('target', '_blank'); linkEl.setAttribute('rel', 'noopener'); linkEl.setAttribute('aria-label', 'Open this website in a new tab'); }
          imgs.forEach(function (el) { if (el.classList.contains('sc-all')) { el.setAttribute('tabindex', el === imgs[cur] ? '0' : '-1'); } });
        });
      }, 0.3);
    }

    /* ---------- tellers ---------- */
    $$('[data-count]').forEach(function (el) {
      var to = parseFloat(el.getAttribute('data-count')), fmt = el.hasAttribute('data-format');
      function paint(n) { el.textContent = fmt ? Math.round(n).toLocaleString('en-US') : Math.round(n); }
      if (reduce) { paint(to); return; }
      paint(0);
      once(el, function () {
        var t0 = null, dur = 1600;
        (function step(ts) {
          if (t0 === null) { t0 = ts; }
          var p = clamp((ts - t0) / dur, 0, 1);
          paint(to * (1 - Math.pow(1 - p, 4)));
          if (p < 1) { requestAnimationFrame(step); }
        })(performance.now());
      }, 0.6);
    });

    /* ---------- build-demo ---------- */
    var demo = $('#demo');
    if (demo) {
      var code = $('#code', demo), site = $('#site', demo);
      var lines = $$('.cl', demo), blocks = $$('.blk', demo), checks = $$('#checks li', demo);
      lines.forEach(function (l) { l.style.setProperty('--n', l.textContent.length + 1); });
      var showBlock = function (k) { blocks.forEach(function (b) { if (b.getAttribute('data-k') === k) { b.classList.add('on'); } }); };
      var resetDemo = function () {
        code.classList.add('nt');
        lines.forEach(function (l) { l.classList.remove('typed'); });
        blocks.forEach(function (b) { b.classList.remove('on'); });
        checks.forEach(function (c) { c.classList.remove('on'); });
        void code.offsetWidth;
        code.classList.remove('nt');
      };
      var finalDemo = function () {
        lines.forEach(function (l) { l.classList.add('typed'); });
        blocks.forEach(function (b) { b.classList.add('on'); });
        checks.forEach(function (c) { c.classList.add('on'); });
      };
      var playDemo = async function (stop) {
        resetDemo();
        await wait(500);
        for (var i = 0; i < lines.length; i++) {
          if (stop()) { return; }
          var l = lines[i];
          l.classList.add('typed');
          await wait(parseFloat(l.style.getPropertyValue('--n')) * 22 + 140);
          if (stop()) { return; }
          var b = l.getAttribute('data-b');
          if (b === 'checks') {
            for (var j = 0; j < checks.length; j++) { checks[j].classList.add('on'); await wait(240); }
          } else if (b) { showBlock(b); }
        }
        await wait(4600);
      };
      $$('.seg button', demo).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var m = btn.getAttribute('data-view') === 'm';
          site.classList.toggle('m', m);
          $$('.seg button', demo).forEach(function (o) { o.setAttribute('aria-pressed', o === btn ? 'true' : 'false'); });
        });
      });
      if (reduce) { finalDemo(); } else { whileVisible(demo, playDemo, 0.4); }
    }

    /* ---------- bento: assessment ---------- */
    var cks = $$('[data-ck]');
    if (cks.length) {
      if (reduce) { cks.forEach(function (c) { c.classList.add('ok'); }); }
      else {
        whileVisible(cks[0].parentNode, async function (stop) {
          cks.forEach(function (c) { c.classList.remove('ok'); });
          await wait(500);
          for (var i = 0; i < cks.length; i++) { if (stop()) { return; } cks[i].classList.add('ok'); await wait(620); }
          await wait(5200);
        }, 0.5);
      }
    }

    /* ---------- bento: terminal ---------- */
    var term = $('#term');
    if (term) {
      var tl2 = $$('.ln', term);
      if (reduce) { term.classList.add('static'); }
      else {
        whileVisible(term, async function (stop) {
          tl2.forEach(function (l) { l.classList.remove('on'); });
          await wait(500);
          var gaps = [0, 650, 800, 520, 560];
          for (var i = 0; i < tl2.length; i++) { await wait(gaps[i] || 500); if (stop()) { return; } tl2[i].classList.add('on'); }
          await wait(5000);
        }, 0.5);
      }
    }

    /* ---------- bento: webshop ---------- */
    var shop = $('#shop');
    if (shop) {
      var qEl = $('#shop-q'), tEl = $('#shop-t'), go = $('#shop-go'), msg = $('#shop-msg');
      var qty = 1, lastShop = 0;
      var fmt = function (n) { return '€ ' + n.toFixed(2).replace('.', ','); };
      var paintShop = function () { qEl.textContent = qty; tEl.textContent = fmt(24 * qty); };
      var order = function () {
        go.classList.add('press'); msg.classList.add('on');
        setTimeout(function () { go.classList.remove('press'); }, 220);
        setTimeout(function () { msg.classList.remove('on'); }, 2600);
      };
      $$('[data-q]', shop).forEach(function (b) {
        b.addEventListener('click', function () {
          lastShop = Date.now();
          qty = clamp(qty + parseInt(b.getAttribute('data-q'), 10), 1, 9);
          msg.classList.remove('on'); paintShop();
        });
      });
      go.addEventListener('click', function () { lastShop = Date.now(); order(); });
      paintShop();
      if (!reduce) {
        whileVisible(shop, async function (stop) {
          if (Date.now() - lastShop < 9000) { await wait(1000); return; }
          qty = 1; msg.classList.remove('on'); paintShop();
          await wait(1500); if (stop() || Date.now() - lastShop < 9000) { return; }
          qty = 2; paintShop();
          await wait(1000); if (stop() || Date.now() - lastShop < 9000) { return; }
          qty = 3; paintShop();
          await wait(1100); if (stop() || Date.now() - lastShop < 9000) { return; }
          order();
          await wait(3400);
        }, 0.5);
      }
    }

    /* ---------- bento: boeking ---------- */
    var cal = $('#cal');
    if (cal) {
      var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], times = ['09:00', '11:00', '14:00'];
      var taken = { '0-1': 1, '1-0': 1, '2-2': 1, '3-1': 1, '4-0': 1 };
      var bmsg = $('#book-msg'), slots = {}, selKey = null, lastBook = 0;
      days.forEach(function (d) { var h = document.createElement('div'); h.className = 'dh'; h.textContent = d; cal.appendChild(h); });
      times.forEach(function (t, ti) {
        days.forEach(function (d, di) {
          var k = di + '-' + ti, b = document.createElement('button');
          b.type = 'button'; b.className = 'slot'; b.textContent = t; b.setAttribute('aria-pressed', 'false');
          b.setAttribute('aria-label', d + ' ' + t + (taken[k] ? ' (unavailable)' : ''));
          if (taken[k]) { b.className += ' taken'; b.disabled = true; }
          else { b.addEventListener('click', function () { lastBook = Date.now(); pick(k); }); }
          slots[k] = b; cal.appendChild(b);
        });
      });
      var pick = function (k) {
        if (selKey) { slots[selKey].classList.remove('sel'); slots[selKey].setAttribute('aria-pressed', 'false'); }
        selKey = k; slots[k].classList.add('sel'); slots[k].setAttribute('aria-pressed', 'true');
        var p = k.split('-');
        bmsg.innerHTML = 'Booked: <b>' + days[+p[0]] + ' · ' + times[+p[1]] + '</b> ✓';
      };
      var seq = ['1-1', '3-2', '2-0', '4-2', '0-2'], si = 0;
      pick('3-2');
      if (!reduce) {
        whileVisible(cal, async function (stop) {
          if (Date.now() - lastBook < 9000) { await wait(1000); return; }
          await wait(2300); if (stop() || Date.now() - lastBook < 9000) { return; }
          pick(seq[si++ % seq.length]);
        }, 0.5);
      }
    }

    /* ---------- portfolio: lichtgloed volgt de muis ---------- */
    if (fine && !reduce) {
      $$('.pf-card').forEach(function (c) {
        c.addEventListener('pointermove', function (e) {
          var r = c.getBoundingClientRect();
          c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          c.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
      });
    }
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();
