(() => {
  function initProducts(container = document) {
    container.querySelectorAll('[data-product-root]').forEach(root => {
      if (root.dataset.initialized) return;
      root.dataset.initialized = 'true';
      const select = root.querySelector('[data-variant-select]');
      const image = root.querySelector('.product-image');
      const add = root.querySelector('[data-add-to-cart]');
      const quantity = root.querySelector('[data-quantity]');
      const sticky = root.querySelector('[data-add-sticky]');
      function update() {
        const option = select.selectedOptions[0];
        if (!option) return;
        const available = option.dataset.available === 'true';
        root.querySelector('[data-product-price]').textContent = option.dataset.price;
        const comparison = root.querySelector('[data-compare-price]');
        comparison.textContent = option.dataset.compare;
        comparison.hidden = !option.dataset.compare;
        add.disabled = !available;
        root.querySelector('[data-add-label]').textContent = available ? 'Ajouter au panier' : 'Épuisé';
        root.querySelector('[data-availability]').textContent = available ? 'Disponible' : 'Cette variante est indisponible.';
        if (sticky) {
          sticky.disabled = !available;
          root.querySelector('[data-sticky-label]').textContent = available ? 'Ajouter au panier' : 'Épuisé';
          root.querySelector('[data-sticky-price]').textContent = option.dataset.price;
        }
        const min = Math.max(1, Number(option.dataset.min) || 1);
        const step = Math.max(1, Number(option.dataset.step) || 1);
        quantity.min = min;
        quantity.step = step;
        if (option.dataset.max) quantity.max = option.dataset.max;
        else quantity.removeAttribute('max');
        let value = Math.max(min, Number(quantity.value) || min);
        value = min + Math.ceil((value - min) / step) * step;
        if (quantity.max) value = Math.min(value, Number(quantity.max));
        quantity.value = value;
        if (option.dataset.image && image) setImage(option.dataset.image, option.dataset.imageAlt || 'Photo du produit');
      }
      function setImage(src, alt) {
        image.removeAttribute('srcset');
        image.src = src;
        image.alt = alt;
      }
      select.addEventListener('change', update);
      root.querySelectorAll('[data-image-url]').forEach(button => button.addEventListener('click', () => {
        if (image) setImage(button.dataset.imageUrl, button.dataset.imageAlt || 'Photo du produit');
      }));
      if (sticky && 'IntersectionObserver' in window) {
        let inside = false;
        let primaryVisible = false;
        const refresh = () => { root.dataset.sticky = String(inside && !primaryVisible); };
        const observer = new IntersectionObserver(entries => {
          for (const entry of entries) {
            if (entry.target === root) inside = entry.isIntersecting;
            if (entry.target === add) primaryVisible = entry.isIntersecting;
          }
          refresh();
        });
        observer.observe(root);
        observer.observe(add);
      }
      update();
    });
  }
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('MainNavigation');
  function closeMenu() { menu?.setAttribute('aria-expanded', 'false'); navigation?.classList.remove('open'); }
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    navigation?.classList.toggle('open', open);
  });
  navigation?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);
  initProducts();
  document.addEventListener('shopify:section:load', event => initProducts(event.target));
})();
