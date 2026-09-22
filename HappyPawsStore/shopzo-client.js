/* ================= SHOPZO INTEGRATION ================= */
// Koppelt deze webshop aan het Shopzo-platform (api.shopzo.be).
// Pas SHOPZO_SELLER aan als de slug van deze winkel ooit wijzigt.

const SHOPZO_API_BASE = 'https://api.shopzo.be';
const SHOPZO_SELLER = 'happy-paws';
const CART_STORAGE_KEY = 'shopzo_cart_happy-paws';

// Moet gelijk blijven aan SHIPPING_THRESHOLD_CENTS / SHIPPING_FEE_CENTS in
// checkout.js — dit bepaalt enkel wat hier getoond wordt, het bedrag dat
// echt aangerekend wordt, wordt altijd opnieuw server-side berekend.
const SHIPPING_THRESHOLD_CENTS = 4000; // €40
const SHIPPING_FEE_CENTS = 495; // €4,95

function calculateShipping(subtotalCents) {
  return subtotalCents >= SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FEE_CENTS;
}

/* ---------- Winkelmandje (opgeslagen in de browser, per toestel) ---------- */

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  renderCartCount();
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((line) => line.product_id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product_id: productId, quantity });
  }
  saveCart(cart);
}

function updateCartQuantity(productId, quantity) {
  let cart = getCart();
  if (quantity < 1) {
    cart = cart.filter((line) => line.product_id !== productId);
  } else {
    const line = cart.find((l) => l.product_id === productId);
    if (line) line.quantity = quantity;
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter((line) => line.product_id !== productId);
  saveCart(cart);
}

function cartItemCount() {
  return getCart().reduce((sum, line) => sum + line.quantity, 0);
}

function renderCartCount() {
  const count = cartItemCount();
  document.querySelectorAll('.cart-count').forEach((el) => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ---------- Communicatie met api.shopzo.be ---------- */

// Producten worden zowel door de navigatiebalk (categorieën) als door de
// productgrid opgevraagd — zonder cache gebeurt dat dubbel op elke pagina.
// Deze cache lost twee dingen op:
// 1. Dedup: als twee delen van de pagina tegelijk aanroepen, wacht de tweede
//    gewoon op dezelfde lopende aanvraag i.p.v. een nieuwe te starten.
// 2. Korte hergebruik-periode (5 min) via sessionStorage, zodat doorklikken
//    naar een andere pagina binnen dezelfde bezoeksessie niet telkens
//    opnieuw naar de API moet — vooral voelbaar na een "cold start" van de
//    Netlify Function, wanneer de allereerste aanvraag trager is.
const PRODUCTS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minuten
const PRODUCTS_CACHE_KEY = `shopzo_products_cache_${SHOPZO_SELLER}`;
let _productsFetchPromise = null;

async function shopzoFetchProducts() {
  if (_productsFetchPromise) return _productsFetchPromise;

  try {
    const cached = JSON.parse(sessionStorage.getItem(PRODUCTS_CACHE_KEY));
    if (cached && Date.now() - cached.timestamp < PRODUCTS_CACHE_TTL_MS) {
      return cached.products;
    }
  } catch {
    // Corrupte of ontbrekende cache-entry — gewoon vers ophalen hieronder.
  }

  _productsFetchPromise = fetch(`${SHOPZO_API_BASE}/products?seller=${SHOPZO_SELLER}`)
    .then((res) => {
      if (!res.ok) throw new Error('Producten konden niet geladen worden');
      return res.json();
    })
    .then((data) => {
      try {
        sessionStorage.setItem(
          PRODUCTS_CACHE_KEY,
          JSON.stringify({ products: data.products, timestamp: Date.now() })
        );
      } catch {
        // sessionStorage kan uitzonderlijk falen (privénavigatie, vol) —
        // geen probleem, dan wordt er gewoon niet gecachet.
      }
      return data.products;
    })
    .finally(() => {
      _productsFetchPromise = null;
    });

  return _productsFetchPromise;
}

async function shopzoFetchProduct(productId) {
  const res = await fetch(`${SHOPZO_API_BASE}/products?seller=${SHOPZO_SELLER}&id=${productId}`);
  if (!res.ok) throw new Error('Product niet gevonden');
  const data = await res.json();
  return data.product;
}

async function shopzoCheckout({ name, email }) {
  const cart = getCart();
  if (cart.length === 0) throw new Error('Je winkelmandje is leeg.');

  const res = await fetch(`${SHOPZO_API_BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      seller: SHOPZO_SELLER,
      customer: { name, email },
      items: cart.map((line) => ({ product_id: line.product_id, quantity: line.quantity })),
      redirect_url: `${window.location.origin}/thankyou.html`,
      // TIJDELIJK: forceert een Mollie-testbetaling (geen echt geld) zodat
      // de volledige flow getest kan worden terwijl het Mollie-account nog
      // niet live-goedgekeurd is. Verwijder deze regel zodra dat wel zo is.
      testmode: true
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Afrekenen is mislukt. Probeer het opnieuw.');
  return data; // { order_id, checkout_url }
}

/* ---------- Opmaak- en render-hulpfuncties ---------- */

function formatEuro(cents) {
  return (cents / 100).toLocaleString('nl-BE', { style: 'currency', currency: 'EUR' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// Zelfde kleursysteem als het dashboard, zodat een tag er overal
// hetzelfde uitziet zonder dat de verkoper zelf kleuren moet kiezen.
const TAG_PALETTE = [
  { bg: '#FDE7C8', text: '#8A5A1E' },
  { bg: '#FCE79A', text: '#8A6D0E' },
  { bg: '#D7F0D2', text: '#2C6B2F' },
  { bg: '#CDEDE6', text: '#1D6B5F' },
  { bg: '#1E9D49', text: '#FFFFFF' },
  { bg: '#F5D2D9', text: '#8A2E43' },
  { bg: '#E4D3C4', text: '#5C4530' },
  { bg: '#D6E4F5', text: '#2C4F7C' },
  { bg: '#E6D6F5', text: '#5C2C7C' }
];

function tagColor(tag) {
  const sum = [...tag.toLowerCase()].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return TAG_PALETTE[sum % TAG_PALETTE.length];
}

// Rendert tags als gekleurde pilletjes, met een "+N" bolletje voor de rest
// als er meer dan `max` tags zijn (zoals het Shopify-voorbeeld).
function renderTagPills(tags, max = 2) {
  if (!tags || tags.length === 0) return '';
  const visible = tags.slice(0, max);
  const extra = tags.length - visible.length;

  const pills = visible.map((tag) => {
    const c = tagColor(tag);
    return `<span style="display:inline-block; padding:4px 11px; border-radius:999px; font-size:0.72rem; font-weight:600; background:${c.bg}; color:${c.text};">${escapeHtml(tag)}</span>`;
  }).join('');

  const more = extra > 0
    ? `<span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:999px; background:#EDEAE2; color:var(--ink); font-size:0.72rem; font-weight:700;" title="${tags.slice(max).map(escapeHtml).join(', ')}">+${extra}</span>`
    : '';

  return `<div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px;">${pills}${more}</div>`;
}

// Rendert één product als de bestaande "hangertje"-kaart, zodat dynamische
// producten er identiek uitzien als de originele statische kaarten.
function renderProductCard(product, { linkToDetail = true } = {}) {
  const onSale = !!product.sale_price_cents;
  const priceHtml = onSale
    ? `<span class="price">${formatEuro(product.sale_price_cents)}</span><span class="price-old">${formatEuro(product.price_cents)}</span>`
    : `<span class="price">${formatEuro(product.price_cents)}</span>`;

  const thumbHtml = product.image_url
    ? `<img src="${product.image_url}" alt="${escapeHtml(product.name)}" style="width:100%;height:120px;object-fit:cover;border-radius:10px;margin-bottom:14px;">`
    : `<div class="product-thumb">🛍️</div>`;

  const badge = onSale ? '<span class="badge badge-mustard">Sale</span>' : '';
  const subLabel = product.subcategory || product.category || '';
  const tagsHtml = renderTagPills(product.tags);

  const inner = `
    <div class="string"></div>
    <div class="product-tag">
      ${badge}
      <div class="tag-hole-top"></div>
      ${thumbHtml}
      ${tagsHtml}
      <h4>${escapeHtml(product.name)}</h4>
      <div class="price-row">${priceHtml}</div>
      <div class="approved">${escapeHtml(subLabel)}</div>
    </div>
  `;

  if (linkToDetail) {
    return `<a class="product-card" href="product.html?id=${product.id}" style="display:block;">${inner}</a>`;
  }
  return `<div class="product-card">${inner}</div>`;
}

/* ---------- Dynamische navigatie op basis van echte categorieën ---------- */

// Vult <nav id="shopzo-nav"> op elke pagina met de echte category-waarden
// uit het dashboard, plus een vaste "Sale"-link. Zo hoeft de navigatie
// nergens hardcoded te staan en blijft ze altijd kloppen met wat de
// verkoper effectief heeft ingevoerd.
async function renderShopzoNav() {
  const navEl = document.getElementById('shopzo-nav');
  if (!navEl) return;

  try {
    const products = await shopzoFetchProducts();
    const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
    const hasSale = products.some((p) => p.sale_price_cents);

    const links = categories
      .map((cat) => `<a href="shop.html?category=${encodeURIComponent(cat)}">${escapeHtml(cat)}</a>`)
      .join('');
    const saleLink = hasSale ? '<a href="shop.html?sale=1">Sale</a>' : '';

    navEl.innerHTML = links + saleLink || '<a href="shop.html">Alle producten</a>';
  } catch {
    navEl.innerHTML = '<a href="shop.html">Shop</a>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCartCount();
  renderShopzoNav();
});
