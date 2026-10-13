// Uit index.html gehaald zodat de CSP geen 'unsafe-inline' nodig heeft.
  (async function () {
    const grid = document.getElementById('home-products');
    const catStrip = document.getElementById('cat-strip');
    try {
      const products = await shopzoFetchProducts();

      const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
      catStrip.innerHTML = '<a href="shop.html" class="cat-pill active">Alles</a>' +
        categories.map((cat) => `<a href="shop.html?category=${encodeURIComponent(cat)}" class="cat-pill">${cat}</a>`).join('');

      grid.innerHTML = products.length
        ? products.slice(0, 6).map((p) => renderProductCard(p)).join('')
        : '<p style="grid-column:1/-1; padding:30px 0; color:var(--muted); font-size:0.9rem;">Nog geen producten — kom binnenkort terug.</p>';
    } catch (err) {
      grid.innerHTML = '<p style="grid-column:1/-1; padding:30px 0; color:var(--clay-dark); font-size:0.9rem;">Producten konden niet geladen worden.</p>';
    }
  })();
