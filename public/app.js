// Remplacer les exemples par le catalogue et les coordonnées réels avant publication commerciale.
const products = [
  { id: 'halo', name: 'La lampe Halo', category: 'maison', kind: 'MAISON · LUMIÈRE', price: 39.90, image: 'lamp', badge: 'Une touche de douceur', short: 'La lumière qui change l’ambiance.', description: 'Une silhouette arrondie et une teinte terracotta pour imaginer un coin lecture chaleureux. Modèle illustratif : dimensions, alimentation et caractéristiques à confirmer.', colors: ['terracotta', 'sand'] },
  { id: 'nomade', name: 'La gourde Nomade', category: 'nomade', kind: 'QUOTIDIEN · À EMPORTER', price: 24.90, image: 'bottle', badge: 'Toujours avec vous', short: 'Votre petite pause, partout.', description: 'Une gourde aux lignes épurées, imaginée pour vous suivre du bureau aux balades. Modèle illustratif : matière, contenance et performances à confirmer.', colors: ['olive', 'cream', 'black'] },
  { id: 'escapade', name: 'Le sac Escapade', category: 'nomade', kind: 'QUOTIDIEN · ESCAPADES', price: 29.90, image: 'bag', badge: 'L’esprit léger', short: 'L’essentiel tient dans un sac.', description: 'Un grand sac souple dans un ton naturel, pour les idées de sorties improvisées. Modèle illustratif : composition, dimensions et entretien à confirmer.', colors: ['sand', 'black'] },
  { id: 'pause', name: 'Le plateau Pause', category: 'maison', kind: 'MAISON · PETITS RITUELS', price: 19.90, image: 'tray', badge: 'Chaque chose à sa place', short: 'Un joli coin pour vos petits riens.', description: 'Un plateau aux courbes douces pour imaginer une entrée ordonnée ou un bureau apaisé. Modèle illustratif : matériau et dimensions à confirmer.', colors: ['cream', 'terracotta'] }
];

const $ = selector => document.querySelector(selector);
const price = value => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
const validIds = new Set(products.map(product => product.id));
let favorites = new Set();
try {
  const saved = JSON.parse(localStorage.getItem('print-favorites') || '[]');
  if (Array.isArray(saved)) favorites = new Set(saved.filter(id => validIds.has(id)));
} catch { /* La sélection reste utilisable si le stockage est indisponible. */ }
let category = 'all';
let onlyFavorites = false;
let activeProduct = null;
let toastTimer;

function notify(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2600);
}

function favoriteLabel(product) {
  return `${favorites.has(product.id) ? 'Retirer' : 'Ajouter'} ${product.name} ${favorites.has(product.id) ? 'des' : 'aux'} favoris`;
}

function render() {
  const visible = products.filter(product => (category === 'all' || category === product.category) && (!onlyFavorites || favorites.has(product.id)));
  $('#product-grid').innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image">
        <button class="product-open" data-open="${product.id}" aria-label="Découvrir ${product.name}"><img src="/assets/${product.image}.svg" alt="Illustration de ${product.name}" width="400" height="460" loading="lazy"></button>
        <span class="product-badge">${product.badge}</span>
        <button class="favorite" data-favorite="${product.id}" aria-pressed="${favorites.has(product.id)}" aria-label="${favoriteLabel(product)}">${favorites.has(product.id) ? '♥' : '♡'}</button>
      </div>
      <p class="product-kind">${product.kind}</p>
      <div class="product-line"><h3><button data-open="${product.id}">${product.name}</button></h3><span class="product-price">${price(product.price)}</span></div>
      <p class="product-desc">${product.short}</p>
      <div class="product-colors" aria-label="Palette illustrative"><span class="sr-only">Coloris illustratifs</span>${product.colors.map(color => `<span class="swatch swatch-${color}" aria-hidden="true"></span>`).join('')}</div>
    </article>`).join('');
  $('#empty-state').hidden = visible.length > 0;
  $('#favorite-count').textContent = favorites.size;
  $('#show-favorites').setAttribute('aria-pressed', String(onlyFavorites));
  $('#results-status').textContent = `${visible.length} produit${visible.length > 1 ? 's' : ''} affiché${visible.length > 1 ? 's' : ''}${onlyFavorites ? ' dans vos favoris' : ''}.`;
}

function toggleFavorite(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  const focusedFavorite = document.activeElement?.dataset.favorite;
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  try { localStorage.setItem('print-favorites', JSON.stringify([...favorites])); } catch { /* Stockage facultatif. */ }
  render();
  if (focusedFavorite) {
    const next = document.querySelector(`[data-favorite="${focusedFavorite}"]`);
    (next || $('#show-favorites')).focus({ preventScroll: true });
  }
  updateDialogFavorite();
  notify(favorites.has(id) ? 'Ajouté à votre sélection.' : 'Retiré de votre sélection.');
}

function updateDialogFavorite() {
  if (!activeProduct) return;
  const button = $('#dialog-favorite');
  button.textContent = favorites.has(activeProduct.id) ? 'Retirer de ma sélection ♡' : 'Garder dans ma sélection ♡';
  button.setAttribute('aria-pressed', String(favorites.has(activeProduct.id)));
}

function showProduct(id) {
  activeProduct = products.find(product => product.id === id);
  if (!activeProduct) return;
  $('#dialog-content').innerHTML = `<img src="/assets/${activeProduct.image}.svg" alt="Illustration de ${activeProduct.name}" width="400" height="460"><div class="dialog-copy"><p class="eyebrow">${activeProduct.kind}</p><h2 id="dialog-title">${activeProduct.name}</h2><p>${activeProduct.description}</p><p class="price">${price(activeProduct.price)}</p><p class="detail-note">Prix indicatif · Produit de démonstration</p><button class="button dark" id="dialog-favorite"></button><p class="detail-note">Achat indisponible. Les produits réels et leurs informations seront ajoutés avant l’ouverture des ventes.</p></div>`;
  updateDialogFavorite();
  $('#dialog-favorite').addEventListener('click', () => toggleFavorite(activeProduct.id));
  $('#product-dialog').showModal();
}

$('#product-grid').addEventListener('click', event => {
  const favorite = event.target.closest('[data-favorite]');
  const open = event.target.closest('[data-open]');
  if (favorite) toggleFavorite(favorite.dataset.favorite);
  else if (open) showProduct(open.dataset.open);
});

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  category = button.dataset.category;
  document.querySelectorAll('.filter').forEach(item => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  render();
}));

$('#show-favorites').addEventListener('click', () => {
  onlyFavorites = !onlyFavorites;
  category = 'all';
  document.querySelectorAll('.filter').forEach(button => {
    const active = button.dataset.category === 'all';
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  render();
  $('#selection').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});

const menu = $('.menu-toggle');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  $('#navigation').classList.remove('open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  $('#navigation').classList.toggle('open', open);
});
$('#navigation').addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);

for (const dialog of document.querySelectorAll('dialog')) {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
}
$('#product-dialog').addEventListener('close', () => {
  if (activeProduct) {
    const trigger = document.querySelector(`[data-open="${activeProduct.id}"]`);
    (trigger || $('#show-favorites')).focus({ preventScroll: true });
  }
  activeProduct = null;
});
function showInfo(title, text) {
  $('#info-title').textContent = title;
  $('#info-text').textContent = text;
  $('#info-dialog').showModal();
}
$('#contact-button').addEventListener('click', () => showInfo('Restons en contact.', 'La boutique est en préparation. Les coordonnées de contact seront ajoutées ici avant son ouverture. Ce site ne collecte aucune demande et n’envoie aucun message.'));
$('#legal-button').addEventListener('click', () => showInfo('À propos de ce site.', 'Print est une vitrine de démonstration : produits, illustrations et prix sont des exemples. Aucun paiement ni suivi publicitaire n’est intégré. Seuls vos favoris sont conservés localement dans ce navigateur ; retirez-les avec les cœurs ou les paramètres du navigateur pour les effacer. L’identité de l’éditeur, ses coordonnées et les mentions légales devront être renseignées avant une publication commerciale.'));
$('.info-ok').addEventListener('click', () => $('#info-dialog').close());
$('#year').textContent = new Date().getFullYear();
render();
