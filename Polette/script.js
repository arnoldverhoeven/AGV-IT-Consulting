// ============ Footer year ============
document.querySelectorAll('#year').forEach(el => { el.textContent = new Date().getFullYear(); });

// ============ Mobile nav toggle ============
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============ Open / closed status (Europe/Brussels local time via client clock) ============
(function openStatus() {
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  const hoursTable = document.getElementById('hours-table');
  if (!dot || !text) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const minutesNow = now.getHours() * 60 + now.getMinutes();

  const schedule = {
    0: null,               // zondag: gesloten
    1: [480, 930],         // 08:00 - 15:30
    2: [480, 930],
    3: [480, 930],
    4: [480, 930],
    5: [480, 930],
    6: [540, 900]           // zaterdag 09:00 - 15:00
  };

  const today = schedule[day];
  const isOpen = today && minutesNow >= today[0] && minutesNow < today[1];

  if (isOpen) {
    dot.classList.remove('closed');
    const closeH = String(Math.floor(today[1] / 60)).padStart(2, '0');
    const closeM = String(today[1] % 60).padStart(2, '0');
    text.textContent = `Nu open · tot ${closeH}:${closeM}`;
  } else {
    dot.classList.add('closed');
    text.textContent = 'Nu gesloten · zie openingsuren';
  }

  if (hoursTable) {
    const row = hoursTable.querySelector(`tr[data-day="${day}"]`);
    if (row) row.classList.add('today');
  }
})();

// ============ Scroll reveal (progressive enhancement) ============
// Content is visible by default in CSS. Here we opt elements into the
// hide-then-reveal animation only once we know JS + IntersectionObserver
// both work, so nothing ever gets stuck invisible.
(function reveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length || !('IntersectionObserver' in window)) return;

  items.forEach(el => el.classList.add('pre-reveal'));

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => obs.observe(el));

  // Safety net: if anything is still hidden after 2.5s (e.g. an element
  // never intersects because it's above the fold on load), reveal it anyway.
  setTimeout(() => {
    document.querySelectorAll('.reveal.pre-reveal:not(.in)').forEach(el => el.classList.add('in'));
  }, 2500);
})();

// ============ Cookie consent banner ============
(function cookieConsent() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  const acceptBtn = document.getElementById('cookie-accept');
  const necessaryBtn = document.getElementById('cookie-necessary');
  const stored = localStorage.getItem('polette_cookie_consent');

  function showBanner() {
    requestAnimationFrame(() => banner.classList.add('visible'));
  }
  function hideBanner() {
    banner.classList.remove('visible');
  }

  if (!stored) {
    showBanner();
  } else if (stored === 'all') {
    enableMaps();
  }

  acceptBtn && acceptBtn.addEventListener('click', () => {
    localStorage.setItem('polette_cookie_consent', 'all');
    localStorage.setItem('polette_maps_consent', 'yes');
    hideBanner();
    enableMaps();
  });

  necessaryBtn && necessaryBtn.addEventListener('click', () => {
    localStorage.setItem('polette_cookie_consent', 'necessary');
    hideBanner();
  });

  function enableMaps() {
    const consentEl = document.getElementById('map-consent');
    if (consentEl && localStorage.getItem('polette_maps_consent') === 'yes') {
      loadMap();
    }
  }
})();

// ============ Google Maps: load only after explicit consent ============
function loadMap() {
  const frame = document.getElementById('map-frame');
  const consentEl = document.getElementById('map-consent');
  if (!frame || frame.querySelector('iframe')) return;
  const iframe = document.createElement('iframe');
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.title = 'Kaart met de locatie van Polette, Fransenplaats 6, Antwerpen';
  iframe.src = 'https://www.google.com/maps?q=Fransenplaats+6,+2018+Antwerpen&output=embed';
  frame.appendChild(iframe);
  if (consentEl) consentEl.remove();
  localStorage.setItem('polette_maps_consent', 'yes');
}

document.addEventListener('DOMContentLoaded', () => {
  const loadMapBtn = document.getElementById('load-map');
  if (loadMapBtn) loadMapBtn.addEventListener('click', loadMap);
  if (localStorage.getItem('polette_maps_consent') === 'yes') loadMap();
});
