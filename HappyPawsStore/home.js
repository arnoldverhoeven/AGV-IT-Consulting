  (async function () {
    const staffPicksGrid = document.getElementById('staff-picks');
    const petStrip = document.getElementById('pet-tag-strip');
    const shelfGrid = document.getElementById('category-shelf');

    try {
      const products = await shopzoFetchProducts();

      // Staff picks: eerste 4 producten
      staffPicksGrid.innerHTML = products.length
        ? products.slice(0, 4).map((p) => renderProductCard(p)).join('')
        : '<p class="mono" style="grid-column:1/-1;">Nog geen producten — kom binnenkort terug.</p>';

      // Bovenste rij tags: echte categorieën uit het dashboard (bv. "Honden")
      const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
      petStrip.innerHTML = categories.length
        ? categories.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            return `<a href="shop.html?category=${encodeURIComponent(cat)}" class="pet-tag" style="display:block; text-decoration:none;">
              <div class="tag-hole"></div>
              <div class="label">${cat}</div>
              <div class="sub">${count} product${count === 1 ? '' : 'en'}</div>
            </a>`;
          }).join('')
        : '<div class="pet-tag"><div class="tag-hole"></div><div class="label">Binnenkort</div></div>';

      // Onderste rij "shelves": echte subcategorieën (bv. "Voeding & Snacks")
      const subcategories = [...new Set(products.map((p) => p.subcategory).filter(Boolean))];
      shelfGrid.innerHTML = subcategories.length
        ? subcategories.map((sub) => {
            const count = products.filter((p) => p.subcategory === sub).length;
            return `<a href="shop.html?subcategory=${encodeURIComponent(sub)}" class="shelf-card" style="text-decoration:none;">
              <h3>${sub}</h3>
              <div><div class="count">${count} product${count === 1 ? '' : 'en'}</div><div class="arrow">→</div></div>
            </a>`;
          }).join('')
        : categories.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            return `<a href="shop.html?category=${encodeURIComponent(cat)}" class="shelf-card" style="text-decoration:none;">
              <h3>${cat}</h3>
              <div><div class="count">${count} product${count === 1 ? '' : 'en'}</div><div class="arrow">→</div></div>
            </a>`;
          }).join('');
    } catch {
      staffPicksGrid.innerHTML = '<p class="mono" style="grid-column:1/-1; color:var(--coral);">Producten konden niet geladen worden.</p>';
      petStrip.innerHTML = '';
      shelfGrid.innerHTML = '';
    }
  })();
