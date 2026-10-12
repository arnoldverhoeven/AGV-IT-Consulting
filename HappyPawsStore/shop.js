  let allProducts = [];
  const urlParams = new URLSearchParams(window.location.search);

  function effectivePrice(p) {
    return (p.sale_price_cents ?? p.price_cents) / 100;
  }

  function renderFilterGroup(containerId, values, checkboxClass) {
    const container = document.getElementById(containerId);
    if (values.length === 0) {
      container.innerHTML = '<p class="mono" style="opacity:0.5;">Nog geen categorieën</p>';
      return;
    }
    container.innerHTML = values
      .map(
        (val) => `
        <label class="filter-option">
          <input type="checkbox" class="${checkboxClass}" value="${escapeHtml(val)}">
          ${escapeHtml(val)}
        </label>
      `
      )
      .join('');
    container.querySelectorAll(`.${checkboxClass}`).forEach((cb) => {
      cb.addEventListener('change', applyFilters);
    });
  }

  function renderFilters(products) {
    const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
    const subcategories = [...new Set(products.map((p) => p.subcategory).filter(Boolean))].sort();

    renderFilterGroup('category-filters', categories, 'category-checkbox');

    if (subcategories.length > 0) {
      document.getElementById('subcategory-group').style.display = 'block';
      renderFilterGroup('subcategory-filters', subcategories, 'subcategory-checkbox');
    }

    // Filters vooraf aanvinken op basis van URL-parameters (bv. vanaf de homepage)
    const categoryParam = urlParams.get('category');
    const subcategoryParam = urlParams.get('subcategory');
    const saleParam = urlParams.get('sale');

    if (categoryParam) {
      const cb = document.querySelector(`.category-checkbox[value="${CSS.escape(categoryParam)}"]`);
      if (cb) cb.checked = true;
    }
    if (subcategoryParam) {
      const cb = document.querySelector(`.subcategory-checkbox[value="${CSS.escape(subcategoryParam)}"]`);
      if (cb) cb.checked = true;
    }
    if (saleParam === '1') {
      document.getElementById('sale-only-checkbox').checked = true;
    }
  }

  function applyFilters() {
    const checkedCategories = [...document.querySelectorAll('.category-checkbox:checked')].map((cb) => cb.value);
    const checkedSubcategories = [...document.querySelectorAll('.subcategory-checkbox:checked')].map((cb) => cb.value);
    const saleOnly = document.getElementById('sale-only-checkbox').checked;
    const min = parseFloat(document.getElementById('price-min').value) || 0;
    const maxInput = document.getElementById('price-max').value;
    const max = maxInput ? parseFloat(maxInput) : Infinity;
    const sort = document.getElementById('sort-select').value;

    let filtered = allProducts.filter((p) => {
      const categoryOk = checkedCategories.length === 0 || checkedCategories.includes(p.category);
      const subcategoryOk = checkedSubcategories.length === 0 || checkedSubcategories.includes(p.subcategory);
      const saleOk = !saleOnly || !!p.sale_price_cents;
      const price = effectivePrice(p);
      const priceOk = price >= min && price <= max;
      return categoryOk && subcategoryOk && saleOk && priceOk;
    });

    if (sort === 'price-asc') filtered.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    if (sort === 'price-desc') filtered.sort((a, b) => effectivePrice(b) - effectivePrice(a));

    renderGrid(filtered);
  }

  function renderGrid(products) {
    const grid = document.getElementById('shopzo-products');
    const total = allProducts.length;

    document.getElementById('page-count-label').textContent =
      `${total} product${total === 1 ? '' : 'en'}`;
    document.getElementById('toolbar-count-label').textContent =
      `${products.length} van ${total} getoond`;

    grid.innerHTML = products.length
      ? products.map((p) => renderProductCard(p)).join('')
      : '<p class="mono" style="grid-column:1/-1; padding:40px 0; text-align:center;">Geen producten gevonden met deze filters.</p>';
  }

  document.getElementById('price-min').addEventListener('input', applyFilters);
  document.getElementById('price-max').addEventListener('input', applyFilters);
  document.getElementById('sort-select').addEventListener('change', applyFilters);
  document.getElementById('sale-only-checkbox').addEventListener('change', applyFilters);
  document.getElementById('clear-filters').addEventListener('click', () => {
    document.querySelectorAll('.category-checkbox, .subcategory-checkbox').forEach((cb) => (cb.checked = false));
    document.getElementById('sale-only-checkbox').checked = false;
    document.getElementById('price-min').value = '';
    document.getElementById('price-max').value = '';
    document.getElementById('sort-select').value = 'popular';
    applyFilters();
  });

  (async function () {
    const grid = document.getElementById('shopzo-products');
    try {
      allProducts = await shopzoFetchProducts();
      renderFilters(allProducts);
      if (allProducts.length === 0) {
        document.getElementById('page-count-label').textContent = '0 producten';
        document.getElementById('toolbar-count-label').textContent = '0 van 0 getoond';
        grid.innerHTML = '<p class="mono" style="grid-column:1/-1; padding:40px 0; text-align:center;">Nog geen producten — kom binnenkort terug.</p>';
        return;
      }
      applyFilters();
    } catch (err) {
      grid.innerHTML = '<p class="mono" style="grid-column:1/-1; padding:40px 0; text-align:center; color:var(--coral);">Producten konden niet geladen worden.</p>';
    }
  })();
