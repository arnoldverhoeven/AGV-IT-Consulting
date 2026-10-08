/* AGV IT Consulting — cookietoestemming + Google Ads-conversiemeting + Microsoft Clarity
   Niets (Google-tag, Clarity) wordt geladen vóór de bezoeker op "Accepteren" klikt.
   Geen inline script nodig: werkt binnen de strikte CSP in _headers. */
(function () {
  'use strict';

  /* ---- INSTELLINGEN ------------------------------------------------------ */
  var AW_ID = 'AW-18483138321';
  // Conversielabels uit Google Ads (het deel NA de schuine streep in send_to: 'AW-…/LABEL').
  // Zolang hier 'VERVANG' staat, wordt die conversie nog niet verstuurd.
  var LABELS = {
    form: 'VERVANG_MET_LABEL_OFFERTEFORMULIER',
    mail: 'VERVANG_MET_LABEL_EMAILKLIK'
  };
  /* ------------------------------------------------------------------------ */

  var KEY = 'agv-consent-v1';
  var NL = (document.documentElement.lang || '').slice(0, 2) === 'nl';
  var T = NL ? {
    text: 'Met jouw toestemming gebruiken we cookies van Google (meten van advertenties) en Microsoft Clarity (statistieken en sessieweergaven) om onze website en advertenties te verbeteren.',
    more: 'Privacyverklaring',
    yes: 'Accepteren',
    no: 'Weigeren',
    label: 'Cookies',
    privacy: 'Privacy',
    cookies: 'Cookies'
  } : {
    text: 'With your consent we use cookies from Google (ad measurement) and Microsoft Clarity (statistics and session replays) to improve our website and ads.',
    more: 'Privacy statement',
    yes: 'Accept',
    no: 'Decline',
    label: 'Cookies',
    privacy: 'Privacy',
    cookies: 'Cookies'
  };

  function read() { try { return window.localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { window.localStorage.setItem(KEY, v); } catch (e) { /* geen opslag: bij volgend bezoek opnieuw vragen */ } }

  var loaded = false;

  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    if (cb) { s.onload = cb; }
    document.head.appendChild(s);
  }

  function enable() {
    if (loaded) { return; }
    loaded = true;

    // Google-tag met toestemmingsmodus v2
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
      analytics_storage: 'denied', wait_for_update: 500
    });
    window.gtag('consent', 'update', {
      ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
    window.gtag('js', new Date());
    window.gtag('config', AW_ID);
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + AW_ID);

    // Microsoft Clarity
    loadScript('/assets/clarity.js', function () {
      try { window.clarity('consentv2', { ad_Storage: 'granted', analytics_Storage: 'granted' }); } catch (e) { /* negeren */ }
    });
  }

  function clearCookies() {
    var names = document.cookie.split(';').map(function (c) { return c.split('=')[0].trim(); });
    var host = location.hostname;
    var parts = host.split('.');
    var root = parts.length > 2 ? parts.slice(-2).join('.') : host;
    names.forEach(function (n) {
      if (/^(_gcl_|_ga|_gid|_clck|_clsk|CLID|ANONCHK|MR|MUID|SM|SRM_B)/.test(n)) {
        [host, '.' + host, root, '.' + root].forEach(function (d) {
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + d;
        });
        document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      }
    });
  }

  // Conversies — alleen actief na toestemming
  window.agvConversion = function (kind) {
    var label = LABELS[kind];
    if (!loaded || !window.gtag || !label || label.indexOf('VERVANG') === 0) { return; }
    window.gtag('event', 'conversion', { send_to: AW_ID + '/' + label });
  };

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="mailto:"]') : null;
    if (a) { window.agvConversion('mail'); }
  });

  /* ---- Banner ------------------------------------------------------------ */
  var banner = null;

  function injectStyle() {
    if (document.getElementById('agv-cc-style')) { return; }
    var st = document.createElement('style');
    st.id = 'agv-cc-style';
    st.textContent =
      '.agv-cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:680px;background:#0E2240;color:#fff;border:1px solid #2A4A80;border-radius:2px;padding:18px 20px;font:400 14px/1.55 Inter,Arial,sans-serif;box-shadow:0 8px 30px rgba(14,34,64,.35)}' +
      '.agv-cc p{margin:0 0 14px;color:#DCE6F7}' +
      '.agv-cc a{color:#60A5FA;text-decoration:underline}' +
      '.agv-cc .agv-cc-btns{display:flex;gap:10px;flex-wrap:wrap}' +
      '.agv-cc button{font:500 14px/1 Inter,Arial,sans-serif;min-width:120px;padding:12px 18px;border-radius:2px;cursor:pointer;border:1px solid #60A5FA;background:transparent;color:#fff}' +
      '.agv-cc button[data-a="yes"]{background:#2563EB;border-color:#2563EB}' +
      '.agv-cc button:hover{filter:brightness(1.12)}' +
      '.agv-cc button:focus-visible,.agv-cc a:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
      '@media (min-width:720px){.agv-cc{left:24px;right:auto;bottom:24px}}';
    document.head.appendChild(st);
  }

  function hide() { if (banner && banner.parentNode) { banner.parentNode.removeChild(banner); } banner = null; }

  function choose(v) {
    var prev = read();
    write(v);
    hide();
    if (v === 'granted') {
      enable();
    } else if (prev === 'granted') {
      // intrekken: cookies wissen en pagina herladen zodat er niets meer draait
      if (window.gtag) {
        window.gtag('consent', 'update', {
          ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied'
        });
      }
      clearCookies();
      location.reload();
    }
  }

  function show() {
    if (banner) { return; }
    injectStyle();
    banner = document.createElement('div');
    banner.className = 'agv-cc';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', T.label);

    var p = document.createElement('p');
    p.appendChild(document.createTextNode(T.text + ' '));
    var a = document.createElement('a');
    a.href = '/privacy/';
    a.textContent = T.more;
    p.appendChild(a);

    var btns = document.createElement('div');
    btns.className = 'agv-cc-btns';
    [['no', T.no, 'denied'], ['yes', T.yes, 'granted']].forEach(function (d) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('data-a', d[0]);
      b.textContent = d[1];
      b.addEventListener('click', function () { choose(d[2]); });
      btns.appendChild(b);
    });

    banner.appendChild(p);
    banner.appendChild(btns);
    document.body.appendChild(banner);
  }

  function footerLinks() {
    var wrap = document.querySelector('footer .wrap') || document.querySelector('footer');
    if (!wrap) { return; }
    var box = document.createElement('span');
    box.style.cssText = 'display:flex;gap:20px;flex-wrap:wrap';
    var priv = document.createElement('a');
    priv.href = '/privacy/';
    priv.textContent = T.privacy;
    var ck = document.createElement('a');
    ck.href = '#cookies';
    ck.textContent = T.cookies;
    ck.addEventListener('click', function (e) { e.preventDefault(); show(); });
    box.appendChild(priv);
    box.appendChild(ck);
    wrap.appendChild(box);
  }

  function ready() {
    footerLinks();
    if (read() === null) { show(); }
  }

  if (read() === 'granted') { enable(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
