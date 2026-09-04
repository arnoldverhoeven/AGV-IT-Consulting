/* ================= SHOPZO INTEGRATION ================= */
// Koppelt deze webshop aan het Shopzo-platform (api.shopzo.be).

const SHOPZO_API_BASE = 'https://api.shopzo.be';
const SHOPZO_SELLER = 'loam-living';
const CART_STORAGE_KEY = 'shopzo_cart_loam-living';

const SHIPPING_THRESHOLD_CENTS = 4000; // €40 — platformbrede standaard
const SHIPPING_FEE_CENTS = 495; // €4,95

function calculateShipping(subtotalCents) {
  return subtotalCents >= SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FEE_CENTS;
}

/* ---------- Winkelmandje ---------- */

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

/* ---------- Favorieten ---------- */

const FAVORITES_STORAGE_KEY = `shopzo_favorites_${SHOPZO_SELLER}`;

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(list));
  renderFavoritesCount();
}

function isFavorite(productId) {
  return getFavorites().includes(productId);
}

function toggleFavorite(productId) {
  const list = getFavorites();
  const idx = list.indexOf(productId);
  if (idx === -1) {
    list.push(productId);
  } else {
    list.splice(idx, 1);
  }
  saveFavorites(list);
  return list.includes(productId);
}

function renderFavoritesCount() {
  const count = getFavorites().length;
  document.querySelectorAll('.favorites-count').forEach((el) => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// Wordt aangeroepen vanuit het hartje op een productkaart. Voorkomt dat de
// klik ook de kaart-link opent, en werkt enkel dat ene hartje bij i.p.v. de
// hele grid opnieuw te tekenen.
function handleFavoriteClick(event, productId, btnEl) {
  event.preventDefault();
  event.stopPropagation();
  const nowFavorite = toggleFavorite(productId);
  btnEl.classList.toggle('active', nowFavorite);
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
      // TIJDELIJK: forceert een Mollie-testbetaling, zelfde als bij Happy Paws.
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

const TAG_PALETTE = [
  { bg: '#FDE7C8', text: '#8A5A1E' },
  { bg: '#FCE79A', text: '#8A6D0E' },
  { bg: '#D7F0D2', text: '#2C6B2F' },
  { bg: '#CDEDE6', text: '#1D6B5F' },
  { bg: '#F5D2D9', text: '#8A2E43' },
  { bg: '#E4D3C4', text: '#5C4530' },
  { bg: '#D6E4F5', text: '#2C4F7C' },
  { bg: '#E6D6F5', text: '#5C2C7C' }
];

function tagColor(tag) {
  const sum = [...tag.toLowerCase()].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return TAG_PALETTE[sum % TAG_PALETTE.length];
}

function renderTagPills(tags, max = 2) {
  if (!tags || tags.length === 0) return '';
  const visible = tags.slice(0, max);
  const extra = tags.length - visible.length;

  const pills = visible.map((tag) => {
    const c = tagColor(tag);
    return `<span class="ptag" style="background:${c.bg}; color:${c.text};">${escapeHtml(tag)}</span>`;
  }).join('');

  const more = extra > 0
    ? `<span class="ptag" style="background:#EDE4D5; color:#5C4530;" title="${tags.slice(max).map(escapeHtml).join(', ')}">+${extra}</span>`
    : '';

  return pills + more;
}

// Zachte, aardse placeholder als een product nog geen foto heeft — een
// simpel fotokader-icoon in plaats van een emoji, past beter bij de stijl.
function placeholderPhoto() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="#FBF6EC" stroke-width="1.4" style="width:38px;height:38px;opacity:0.8;">
    <rect x="3" y="5" width="18" height="14" rx="2"/>
    <circle cx="9" cy="10" r="1.6"/>
    <path d="m21 15-5-4-6 5-3-2-4 3"/>
  </svg>`;
}

// Standaard hartje-icoon (omlijnd, of gevuld als het al favoriet is).
function heartIconSvg() {
  return `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
}

// Rendert één product volgens Loam Living's kaartopmaak (product-card /
// product-photo / tag-row / price-row), gevuld met echte data uit Shopzo.
function renderProductCard(product) {
  const onSale = !!product.sale_price_cents;
  const priceHtml = onSale
    ? `<span class="price price-sale">${formatEuro(product.sale_price_cents)}</span><span class="price-old">${formatEuro(product.price_cents)}</span>`
    : `<span class="price">${formatEuro(product.price_cents)}</span>`;

  const photoContent = product.image_url
    ? `<img src="${product.image_url}" alt="${escapeHtml(product.name)}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">`
    : `<div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center;">${placeholderPhoto()}</div>`;

  const saleFlag = onSale ? '<span class="sale-flag">Sale</span>' : '';
  const subLabel = product.subcategory || product.category || '';
  const tagsHtml = renderTagPills(product.tags);
  const favActive = isFavorite(product.id) ? ' active' : '';

  return `
    <a href="product.html?id=${product.id}" class="product-card">
      <div class="product-photo" style="background:linear-gradient(150deg,#D8CBB2,#93513B);">
        ${photoContent}
        ${saleFlag}
        <button type="button" class="fav-btn${favActive}" aria-label="Toevoegen aan favorieten"
          onclick="handleFavoriteClick(event, '${product.id}', this)">
          ${heartIconSvg()}
        </button>
      </div>
      ${tagsHtml ? `<div class="tag-row">${tagsHtml}</div>` : ''}
      <h3>${escapeHtml(product.name)}</h3>
      <div class="sub">${escapeHtml(subLabel)}</div>
      <div class="price-row">${priceHtml}</div>
    </a>
  `;
}

// Vult <nav id="shopzo-nav"> met de echte categorieën uit het dashboard,
// plus een vaste "Sale"-link.
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

    navEl.innerHTML = (links + saleLink) || '<a href="shop.html">Alle producten</a>';
  } catch {
    navEl.innerHTML = '<a href="shop.html">Shop</a>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCartCount();
  renderFavoritesCount();
  renderShopzoNav();
});
