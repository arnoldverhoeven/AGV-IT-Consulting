// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Cookie banner
const COOKIE_KEY = 'cafebetty_cookie_consent';
const banner = document.getElementById('cookieBanner');
const acceptAllBtn = document.getElementById('cookieAcceptAll');
const essentialOnlyBtn = document.getElementById('cookieEssentialOnly');

function getConsent() {
  try { return localStorage.getItem(COOKIE_KEY); } catch (e) { return null; }
}
function setConsent(value) {
  try { localStorage.setItem(COOKIE_KEY, value); } catch (e) { /* ignore */ }
}

if (banner && !getConsent()) {
  banner.classList.add('is-visible');
}
if (acceptAllBtn) {
  acceptAllBtn.addEventListener('click', () => {
    setConsent('all');
    banner.classList.remove('is-visible');
  });
}
if (essentialOnlyBtn) {
  essentialOnlyBtn.addEventListener('click', () => {
    setConsent('essential');
    banner.classList.remove('is-visible');
  });
}
