// Uit favorites.html gehaald zodat de CSP geen 'unsafe-inline' nodig heeft.
  (async function () {
    const container = document.getElementById('favorites-content');
    const favoriteIds = getFavorites();

    if (favoriteIds.length === 0) {
      document.getElementById('page-count-label').textContent = '0 producten';
      container.innerHTML = `
        <div class="empty-state">
          <div class="icon">♡</div>
          <h2>Nog geen favorieten</h2>
          <p>Klik op het hartje bij een product om het hier te bewaren.</p>
          <a href="shop.html" class="btn btn--primary">Bekijk de collectie →</a>
        </div>
      `;
      return;
    }

    try {
      const allProducts = await shopzoFetchProducts();
      const favoriteProducts = allProducts.filter((p) => favoriteIds.includes(p.id));

      document.getElementById('page-count-label').textContent =
        `${favoriteProducts.length} product${favoriteProducts.length === 1 ? '' : 'en'}`;

      container.innerHTML = favoriteProducts.length
        ? `<div class="products">${favoriteProducts.map((p) => renderProductCard(p)).join('')}</div>`
        : `<div class="empty-state">
             <div class="icon">♡</div>
             <h2>Deze favorieten zijn niet meer beschikbaar</h2>
             <p>De producten die je bewaarde staan niet meer in de collectie.</p>
             <a href="shop.html" class="btn btn--primary">Bekijk de collectie →</a>
           </div>`;
    } catch (err) {
      container.innerHTML = '<p style="color:var(--clay-dark); padding-bottom:60px;">Favorieten konden niet geladen worden.</p>';
    }
  })();
