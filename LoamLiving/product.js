// Uit product.html gehaald zodat de CSP geen 'unsafe-inline' nodig heeft.
  (async function () {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const loadingEl = document.getElementById('pd-loading');
    const contentEl = document.getElementById('pd-content');

    if (!productId) {
      loadingEl.innerHTML = 'Geen product opgegeven. <a href="shop.html" style="color:var(--clay-dark);">Terug naar de shop →</a>';
      return;
    }

    let product;
    try {
      product = await shopzoFetchProduct(productId);
    } catch (err) {
      loadingEl.innerHTML = 'Product niet gevonden. <a href="shop.html" style="color:var(--clay-dark);">Terug naar de shop →</a>';
      return;
    }

    document.title = `${product.name} — Loam Living`;
    document.getElementById('pd-breadcrumb').textContent = product.name;
    document.getElementById('pd-category').textContent = product.subcategory || product.category || 'Product';
    document.getElementById('pd-name').textContent = product.name;
    document.getElementById('pd-desc').textContent = product.description || '';
    document.getElementById('pd-tags').innerHTML = renderTagPills(product.tags, 99);

    const photoEl = document.getElementById('pd-photo');
    const thumbsEl = document.getElementById('pd-thumbs');
    const gallery = [product.image_url, ...(product.images || [])].filter(Boolean);

    function showPhoto(url) {
      photoEl.innerHTML = `<img src="${url}" alt="${product.name}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">`;
    }

    if (gallery.length > 0) {
      showPhoto(gallery[0]);
    } else {
      photoEl.innerHTML = `<div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center;">${placeholderPhoto()}</div>`;
    }

    if (gallery.length > 1) {
      thumbsEl.innerHTML = gallery
        .map((url, i) => `<div class="pd-thumb${i === 0 ? ' active' : ''}" data-url="${url}"><img src="${url}" alt=""></div>`)
        .join('');
      thumbsEl.querySelectorAll('.pd-thumb').forEach((thumb) => {
        thumb.addEventListener('click', () => {
          showPhoto(thumb.dataset.url);
          thumbsEl.querySelectorAll('.pd-thumb').forEach((t) => t.classList.remove('active'));
          thumb.classList.add('active');
        });
      });
    }

    const priceRow = document.getElementById('pd-price-row');
    priceRow.innerHTML = product.sale_price_cents
      ? `<span class="pd-price price-sale">${formatEuro(product.sale_price_cents)}</span><span class="price-old">${formatEuro(product.price_cents)}</span>`
      : `<span class="pd-price">${formatEuro(product.price_cents)}</span>`;

    document.getElementById('pd-stock').innerHTML = product.stock > 0
      ? '<strong>Op voorraad</strong> — verzending binnen 2-3 werkdagen'
      : '<strong style="color:var(--clay-dark);">Uitverkocht</strong>';

    let qty = 1;
    const qtyEl = document.getElementById('pd-qty');
    document.getElementById('pd-qty-minus').addEventListener('click', () => { qty = Math.max(1, qty - 1); qtyEl.textContent = qty; });
    document.getElementById('pd-qty-plus').addEventListener('click', () => { qty = Math.min(product.stock, qty + 1); qtyEl.textContent = qty; });

    const addBtn = document.getElementById('pd-add-to-cart');
    if (product.stock <= 0) {
      addBtn.disabled = true;
      addBtn.textContent = 'Uitverkocht';
      addBtn.style.opacity = '0.5';
    } else {
      addBtn.addEventListener('click', () => {
        addToCart(product.id, qty);
        window.location.href = 'cart.html';
      });
    }

    // Favorieten-knop op de productpagina
    const favBtn = document.getElementById('pd-fav-btn');
    const favIcon = document.getElementById('pd-fav-icon');
    const favLabel = document.getElementById('pd-fav-label');

    function renderFavState(active) {
      favBtn.classList.toggle('active', active);
      favIcon.innerHTML = heartIconSvg();
      favLabel.textContent = active ? 'Toegevoegd aan favorieten' : 'Toevoegen aan favorieten';
    }
    renderFavState(isFavorite(product.id));

    favBtn.addEventListener('click', () => {
      const nowActive = toggleFavorite(product.id);
      renderFavState(nowActive);
    });

    loadingEl.style.display = 'none';
    contentEl.style.display = 'grid';
  })();
