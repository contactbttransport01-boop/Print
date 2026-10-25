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
      const form = select.closest('form');
      const offers = root.dataset.offersEnabled === 'true' && Boolean(root.querySelector('[data-offer-picker]'));
      const extraSelects = [...root.querySelectorAll('[data-extra-variant]')];
      let pending = false;
      if (offers) {
        root.querySelector('[data-offer-picker]').hidden = false;
        root.querySelector('[data-quantity-field]').hidden = true;
        root.querySelector(`label[for="${select.id}"]`).textContent = 'Coloris du bracelet 1';
        quantity.value = 1;
      }
      function bundle() {
        const chosen = root.querySelector('[data-offer]:checked');
        const count = Number(chosen?.value || 1);
        const selected = [select, ...extraSelects].slice(0, count).map(item => item.selectedOptions[0]);
        const groups = new Map();
        let reason = '';
        for (const option of selected) {
          if (!option || option.dataset.available !== 'true') { reason = 'Choisissez des coloris disponibles.'; continue; }
          if (Number(option.dataset.unitCents) !== 1490) reason = 'Ce coloris ne fait pas partie de l’offre.';
          const group = groups.get(option.value) || { option, count: 0 };
          group.count++;
          groups.set(option.value, group);
        }
        for (const { option, count: groupCount } of groups.values()) {
          const min = Math.max(1, Number(option.dataset.min) || 1);
          const step = Math.max(1, Number(option.dataset.step) || 1);
          const max = option.dataset.max ? Number(option.dataset.max) : Infinity;
          if (groupCount < min || groupCount > max || (groupCount - min) % step !== 0) reason = 'La quantité choisie n’est pas disponible pour ce coloris.';
        }
        return { count, chosen, valid: !reason && selected.length === count, reason, items: [...groups].map(([id, group]) => ({ id, quantity: group.count })) };
      }
      function update() {
        const option = select.selectedOptions[0];
        if (!option) return;
        const state = offers ? bundle() : null;
        const available = state ? state.valid : option.dataset.available === 'true';
        const price = state ? state.chosen.dataset.offerPrice : option.dataset.price;
        root.querySelector('[data-product-price]').textContent = price;
        const comparison = root.querySelector('[data-compare-price]');
        comparison.textContent = option.dataset.compare;
        comparison.hidden = !option.dataset.compare || Boolean(state && state.count > 1);
        const buttonText = pending ? 'Ajout en cours…' : available ? (state && state.count > 1 ? `Ajouter les ${state.count} bracelets` : 'Ajouter au panier') : 'Indisponible';
        add.disabled = pending || !available;
        root.querySelector('[data-add-label]').textContent = buttonText;
        root.querySelector('[data-availability]').textContent = pending ? 'Ajout au panier en cours.' : available ? 'Disponible' : state?.reason || 'Cette variante est indisponible.';
        if (sticky) {
          sticky.disabled = pending || !available;
          root.querySelector('[data-sticky-label]').textContent = buttonText;
          root.querySelector('[data-sticky-price]').textContent = price;
        }
        if (offers) {
          quantity.min = 1; quantity.step = 1; quantity.max = 3; quantity.value = state.count;
          extraSelects.forEach((extra, index) => {
            const active = index + 2 <= state.count;
            extra.disabled = !active;
            extra.closest('[data-extra-color]').hidden = !active;
          });
        } else {
          const min = Math.max(1, Number(option.dataset.min) || 1);
          const step = Math.max(1, Number(option.dataset.step) || 1);
          quantity.min = min; quantity.step = step;
          if (option.dataset.max) quantity.max = option.dataset.max;
          else quantity.removeAttribute('max');
          let value = Math.max(min, Number(quantity.value) || min);
          value = min + Math.ceil((value - min) / step) * step;
          if (quantity.max) value = Math.min(value, Number(quantity.max));
          quantity.value = value;
        }
        if (option.dataset.image && image) setImage(option.dataset.image, option.dataset.imageAlt || 'Photo du produit');
      }
      function setImage(src, alt) { image.removeAttribute('srcset'); image.src = src; image.alt = alt; }
      function selectionChanged() {
        const error = root.querySelector('[data-purchase-error]');
        if (error) error.hidden = true;
        const checkCart = root.querySelector('[data-check-cart]');
        if (checkCart) checkCart.hidden = true;
        update();
      }
      select.addEventListener('change', selectionChanged);
      extraSelects.forEach(extra => extra.addEventListener('change', selectionChanged));
      root.querySelectorAll('[data-offer]').forEach(radio => radio.addEventListener('change', selectionChanged));
      if (offers) form.addEventListener('submit', async event => {
        const state = bundle();
        if (!state.valid || pending) { event.preventDefault(); update(); return; }
        if (state.count === 1) return; // Native Shopify product form remains the single-item fallback.
        event.preventDefault();
        if (!form.reportValidity()) return;
        pending = true;
        form.setAttribute('aria-busy', 'true');
        update();
        try {
          const endpoint = form.dataset.cartAddUrl.replace(/\.js$/, '') + '.js';
          const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ items: state.items }) });
          if (!response.ok) {
            const result = await response.json().catch(() => ({}));
            throw new Error(typeof result.description === 'string' ? result.description : 'Ces articles n’ont pas pu être ajoutés. Vérifiez votre panier avant de réessayer.');
          }
          window.location.assign(form.dataset.cartUrl);
        } catch (error) {
          const message = root.querySelector('[data-purchase-error]');
          message.textContent = error instanceof TypeError ? 'L’ajout n’a pas pu être confirmé. Vérifiez votre panier avant de réessayer.' : error.message;
          message.hidden = false;
          root.querySelector('[data-check-cart]').hidden = false;
        } finally {
          pending = false;
          form.removeAttribute('aria-busy');
          update();
        }
      });
      root.querySelectorAll('[data-image-url]').forEach(button => button.addEventListener('click', () => { if (image) setImage(button.dataset.imageUrl, button.dataset.imageAlt || 'Photo du produit'); }));
      if (sticky && 'IntersectionObserver' in window) {
        let inside = false;
        let primaryVisible = false;
        const observer = new IntersectionObserver(entries => {
          for (const entry of entries) {
            if (entry.target === root) inside = entry.isIntersecting;
            if (entry.target === add) primaryVisible = entry.isIntersecting;
          }
          root.dataset.sticky = String(inside && !primaryVisible);
        });
        observer.observe(root); observer.observe(add);
      }
      update();
    });
  }
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('MainNavigation');
  function closeMenu() { menu?.setAttribute('aria-expanded', 'false'); navigation?.classList.remove('open'); }
  menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation?.classList.toggle('open', open); });
  navigation?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);
  initProducts();
  document.addEventListener('shopify:section:load', event => initProducts(event.target));
})();
