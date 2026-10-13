// Uit shop.html gehaald zodat de CSP geen 'unsafe-inline' nodig heeft.
  let allProducts = [];
  const urlParams = new URLSearchParams(window.location.search);

  function effectivePrice(p) { return (p.sale_price_cents ?? p.price_cents) / 100; }

  function renderCategoryPills(products) {
    const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
    const container = document.getElementById('category-filters');
    container.innerHTML = '<button type="button" class="cat-pill active" data-cat="">Alles</button>' +
      categories.map((cat) => `<button type="button" class="cat-pill" data-cat="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`).join('');

    container.querySelectorAll('.cat-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.cat-pill').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilters();
      });
    });

    const catParam = urlParams.get('category');
    if (catParam) {
      const match = [...container.querySelectorAll('.cat-pill')].find((b) => b.dataset.cat === catParam);
      if (match) {
        container.querySelectorAll('.cat-pill').forEach((b) => b.classList.remove('active'));
        match.classList.add('active');
      }
    }
    if (urlParams.get('sale') === '1') {
      document.getElementById('sale-only-checkbox').checked = true;
    }
  }

  function applyFilters() {
    const activeCat = document.querySelector('.cat-pill.active')?.dataset.cat || '';
    const saleOnly = document.getElementById('sale-only-checkbox').checked;
    const min = parseFloat(document.getElementById('price-min').value) || 0;
    const maxInput = document.getElementById('price-max').value;
    const max = maxInput ? parseFloat(maxInput) : Infinity;
    const sort = document.getElementById('sort-select').value;

    let filtered = allProducts.filter((p) => {
      const catOk = !activeCat || p.category === activeCat;
      const saleOk = !saleOnly || !!p.sale_price_cents;
      const price = effectivePrice(p);
      return catOk && saleOk && price >= min && price <= max;
    });

    if (sort === 'price-asc') filtered.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    if (sort === 'price-desc') filtered.sort((a, b) => effectivePrice(b) - effectivePrice(a));

    renderGrid(filtered);
  }

  function renderGrid(products) {
    const grid = document.getElementById('shopzo-products');
    const total = allProducts.length;
    document.getElementById('page-count-label').textContent = `${total} product${total === 1 ? '' : 'en'}`;
    document.getElementById('toolbar-count-label').textContent = `${products.length} van ${total} getoond`;
    grid.innerHTML = products.length
      ? products.map((p) => renderProductCard(p)).join('')
      : '<p style="grid-column:1/-1; padding:40px 0; color:var(--muted);">Geen producten gevonden met deze filters.</p>';
  }

  document.getElementById('price-min').addEventListener('input', applyFilters);
  document.getElementById('price-max').addEventListener('input', applyFilters);
  document.getElementById('sort-select').addEventListener('change', applyFilters);
  document.getElementById('sale-only-checkbox').addEventListener('change', applyFilters);

  (async function () {
    const grid = document.getElementById('shopzo-products');
    try {
      allProducts = await shopzoFetchProducts();
      renderCategoryPills(allProducts);
      if (allProducts.length === 0) {
        document.getElementById('page-count-label').textContent = '0 producten';
        document.getElementById('toolbar-count-label').textContent = '0 van 0 getoond';
        grid.innerHTML = '<p style="grid-column:1/-1; padding:40px 0; color:var(--muted);">Nog geen producten — kom binnenkort terug.</p>';
        return;
      }
      applyFilters();
    } catch (err) {
      grid.innerHTML = '<p style="grid-column:1/-1; padding:40px 0; color:var(--clay-dark);">Producten konden niet geladen worden.</p>';
    }
  })();
