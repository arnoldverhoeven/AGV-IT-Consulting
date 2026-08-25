(function () {
  "use strict";

  var html = document.documentElement;

  /* ---------- Language toggle (data-lc / data-lang system) ---------- */
  var langButtons = document.querySelectorAll("[data-set-lang]");
  function setLang(lang) {
    html.setAttribute("data-lang", lang);
    langButtons.forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-set-lang") === lang);
    });
    try { localStorage.setItem("nives-lang", lang); } catch (e) {}
  }
  langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-set-lang"));
    });
  });
  (function initLang() {
    var saved = null;
    try { saved = localStorage.getItem("nives-lang"); } catch (e) {}
    if (saved === "nl" || saved === "en") { setLang(saved); return; }
    var browserLang = (navigator.language || "nl").toLowerCase();
    setLang(browserLang.indexOf("nl") === 0 ? "nl" : (browserLang.indexOf("en") === 0 ? "en" : "nl"));
  })();

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 40) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
  mainNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Highlight today's opening hours ---------- */
  var today = new Date().getDay(); // 0 = Sunday
  var row = document.querySelector('.hours-table tr[data-day="' + today + '"]');
  if (row) row.classList.add("today");

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
