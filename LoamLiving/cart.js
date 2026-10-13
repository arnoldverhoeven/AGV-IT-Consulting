// Uit cart.html gehaald zodat de CSP geen 'unsafe-inline' nodig heeft.
  let cartProducts = [];

  async function loadCart() {
    const cart = getCart();
    const linesEl = document.getElementById('cart-lines');
    const countLabel = document.getElementById('cart-count-label');

    if (cart.length === 0) {
      linesEl.innerHTML = 'Je winkelmandje is leeg. <a href="shop.html" style="color:var(--clay-dark);">Begin met shoppen →</a>';
      countLabel.textContent = '0 items';
      document.getElementById('cart-subtotal').textContent = formatEuro(0);
      document.getElementById('cart-total').textContent = formatEuro(0);
      document.getElementById('cart-shipping').textContent = '—';
      document.getElementById('checkout-btn').disabled = true;
      return;
    }

    try {
      const allProducts = await shopzoFetchProducts();
      cartProducts = cart
        .map((line) => {
          const product = allProducts.find((p) => p.id === line.product_id);
          return product ? { ...product, quantity: line.quantity } : null;
        })
        .filter(Boolean);
    } catch {
      linesEl.innerHTML = '<p style="color:var(--clay-dark);">Je winkelmandje kon niet geladen worden.</p>';
      return;
    }

    countLabel.textContent = `${cartProducts.reduce((n, p) => n + p.quantity, 0)} items`;

    linesEl.innerHTML = cartProducts.map((p) => {
      const unitPrice = p.sale_price_cents ?? p.price_cents;
      const thumb = p.image_url
        ? `<div class="cart-thumb"><img src="${p.image_url}" alt="" style="width:100%;height:100%;object-fit:cover;"></div>`
        : `<div class="cart-thumb">${placeholderPhoto()}</div>`;
      return `
        <div class="cart-line" data-product-id="${p.id}">
          ${thumb}
          <div>
            <h4>${p.name}</h4>
            <div class="sub">${p.category || ''}</div>
            <span class="cart-remove" role="button" tabindex="0" data-action="remove" data-id="${p.id}">Verwijderen</span>
          </div>
          <div class="qty-stepper">
            <button type="button" data-action="qty" data-id="${p.id}" data-qty="${p.quantity - 1}">–</button>
            <span>${p.quantity}</span>
            <button type="button" data-action="qty" data-id="${p.id}" data-qty="${p.quantity + 1}">+</button>
          </div>
          <div class="price">${formatEuro(unitPrice * p.quantity)}</div>
        </div>
      `;
    }).join('') + '<a href="shop.html" style="display:inline-block; margin-top:20px; font-size:0.88rem; font-weight:600; color:var(--clay-dark);">← Verder winkelen</a>';

    const subtotal = cartProducts.reduce((sum, p) => sum + (p.sale_price_cents ?? p.price_cents) * p.quantity, 0);
    const shipping = calculateShipping(subtotal);
    document.getElementById('cart-subtotal').textContent = formatEuro(subtotal);
    document.getElementById('cart-total').textContent = formatEuro(subtotal + shipping);

    const shippingEl = document.getElementById('cart-shipping');
    const hintEl = document.getElementById('cart-shipping-hint');
    if (shipping === 0) {
      shippingEl.textContent = 'Gratis';
      hintEl.textContent = '';
    } else {
      shippingEl.textContent = formatEuro(shipping);
      hintEl.textContent = `Nog ${formatEuro(SHIPPING_THRESHOLD_CENTS - subtotal)} tot gratis levering`;
    }
  }

  document.getElementById('checkout-btn').addEventListener('click', async () => {
    const errorEl = document.getElementById('checkout-error');
    errorEl.style.display = 'none';

    const name = document.getElementById('checkout-name').value.trim();
    const email = document.getElementById('checkout-email').value.trim();

    if (!name || !email) {
      errorEl.textContent = 'Vul je naam en e-mailadres in.';
      errorEl.style.display = 'block';
      return;
    }

    const btn = document.getElementById('checkout-btn');
    btn.disabled = true;
    btn.textContent = 'Doorverwijzen naar betaling…';

    try {
      const { checkout_url } = await shopzoCheckout({ name, email });
      window.location.href = checkout_url;
    } catch (err) {
      errorEl.textContent = err.message || 'Er ging iets mis. Probeer het opnieuw.';
      errorEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Afrekenen';
    }
  });

  // Verwijderen / aantal wijzigen via event-delegatie (geen inline onclick → CSP-proof)
  function handleCartAction(el) {
    if (el.dataset.action === 'remove') removeFromCart(el.dataset.id);
    if (el.dataset.action === 'qty') updateCartQuantity(el.dataset.id, Number(el.dataset.qty));
    loadCart();
  }
  document.getElementById('cart-lines').addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (el) handleCartAction(el);
  });
  document.getElementById('cart-lines').addEventListener('keydown', (e) => {
    const el = e.target.closest('[data-action="remove"]');
    if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handleCartAction(el); }
  });

  loadCart();
