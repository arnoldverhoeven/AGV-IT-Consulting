(function () {
  "use strict";

  /* ============================================================
     Storage
     ============================================================ */
  var STORAGE_KEY = "nives_cookie_consent";
  var CONSENT_VERSION = 1;
  var MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // re-ask after 12 months, per DPA guidance

  function loadConsent() {
    var raw;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    if (!raw) return null;
    var parsed;
    try { parsed = JSON.parse(raw); } catch (e) { return null; }
    if (!parsed || parsed.v !== CONSENT_VERSION) return null;
    if (Date.now() - parsed.ts > MAX_AGE_MS) return null;
    return parsed;
  }

  function saveConsent(categories) {
    var record = {
      necessary: true,
      functional: !!categories.functional,
      analytics: !!categories.analytics,
      marketing: !!categories.marketing,
      ts: Date.now(),
      v: CONSENT_VERSION
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(record)); } catch (e) {}
    return record;
  }

  /* ============================================================
     Gated resource loading — nothing non-essential fires
     until the relevant category is granted
     ============================================================ */
  function loadGoogleFonts() {
    if (document.getElementById("google-fonts-link")) return;
    var preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";
    var preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";
    var stylesheet = document.createElement("link");
    stylesheet.id = "google-fonts-link";
    stylesheet.rel = "stylesheet";
    stylesheet.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Work+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(preconnect1);
    document.head.appendChild(preconnect2);
    document.head.appendChild(stylesheet);
  }

  function loadMap() {
    var iframe = document.getElementById("mapIframe");
    var placeholder = document.getElementById("mapPlaceholder");
    if (!iframe || iframe.src) return;
    iframe.src = iframe.getAttribute("data-src");
    iframe.removeAttribute("hidden");
    if (placeholder) placeholder.hidden = true;
  }

  function loadAnalytics() {
    // Not yet in use on this site. When Nives adds Google Analytics (GA4) or
    // similar, inject the tag here — this function only ever runs once the
    // visitor has explicitly opted into the "analytics" category.
    // Example:
    // var s = document.createElement('script');
    // s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
    // s.async = true;
    // document.head.appendChild(s);
  }

  function loadMarketing() {
    // Not yet in use on this site. When Nives adds a Meta Pixel, Google Ads
    // tag, or similar, inject it here — gated the same way as loadAnalytics().
  }

  function applyConsent(consent) {
    if (!consent) return;
    if (consent.functional) { loadGoogleFonts(); loadMap(); }
    if (consent.analytics) { loadAnalytics(); }
    if (consent.marketing) { loadMarketing(); }
  }

  /* ============================================================
     Banner / panel UI
     ============================================================ */
  var banner = document.getElementById("consentBanner");
  var panel = document.getElementById("consentPanel");
  if (!banner) return;

  var toggleFunctional = document.getElementById("toggleFunctional");
  var toggleAnalytics = document.getElementById("toggleAnalytics");
  var toggleMarketing = document.getElementById("toggleMarketing");

  function showBanner() { banner.hidden = false; }
  function hideBanner() { banner.hidden = true; panel.hidden = true; }
  function showPanel(prefill) {
    if (prefill) {
      toggleFunctional.checked = !!prefill.functional;
      toggleAnalytics.checked = !!prefill.analytics;
      toggleMarketing.checked = !!prefill.marketing;
    }
    panel.hidden = false;
  }

  function acceptAll() {
    var consent = saveConsent({ functional: true, analytics: true, marketing: true });
    applyConsent(consent);
    hideBanner();
  }
  function rejectAll() {
    var consent = saveConsent({ functional: false, analytics: false, marketing: false });
    applyConsent(consent);
    hideBanner();
  }
  function savePreferences() {
    var consent = saveConsent({
      functional: toggleFunctional.checked,
      analytics: toggleAnalytics.checked,
      marketing: toggleMarketing.checked
    });
    applyConsent(consent);
    hideBanner();
  }

  document.getElementById("consentAccept").addEventListener("click", acceptAll);
  document.getElementById("consentAcceptPanel").addEventListener("click", acceptAll);
  document.getElementById("consentReject").addEventListener("click", rejectAll);
  document.getElementById("consentRejectPanel").addEventListener("click", rejectAll);
  document.getElementById("consentSave").addEventListener("click", savePreferences);
  document.getElementById("consentCustomize").addEventListener("click", function () {
    showPanel(loadConsent());
  });

  var settingsLink = document.getElementById("openCookieSettings");
  if (settingsLink) {
    settingsLink.addEventListener("click", function (e) {
      e.preventDefault();
      showBanner();
      showPanel(loadConsent() || { functional: false, analytics: false, marketing: false });
    });
  }

  // Click-to-load map placeholder: loading the map this way is treated as
  // specific, one-off consent for this embed only (like a YouTube facade).
  // It does not update the stored category preferences — declining
  // "Functional" in the main banner afterwards will not undo this session's
  // map view, but the placeholder returns on the visitor's next visit
  // unless they've also accepted "Functional" through the banner.
  var loadMapBtn = document.getElementById("loadMapBtn");
  if (loadMapBtn) loadMapBtn.addEventListener("click", loadMap);

  /* ============================================================
     Boot
     ============================================================ */
  var existing = loadConsent();
  if (existing) {
    applyConsent(existing);
  } else {
    showBanner();
  }
})();
