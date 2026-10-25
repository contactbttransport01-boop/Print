import { variants, defaultVariant, variantById, imageFor } from './catalog.js';
const $ = selector => document.querySelector(selector);
let selected = defaultVariant;
let favorites = new Set();
let storageAvailable = true;
let toastTimer;
try {
  const saved = JSON.parse(localStorage.getItem('print-strap-favorites') || '[]');
  if (Array.isArray(saved)) favorites = new Set(saved.filter(id => typeof id === 'string' && variantById(id)));
} catch (error) { storageAvailable = error instanceof SyntaxError; }

function notify(text) {
  $('#toast').textContent = text;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2600);
}

function updateFavorites() {
  $('#favorite-count').textContent = favorites.size;
  const saved = favorites.has(selected.id);
  $('#save-variant').setAttribute('aria-pressed', String(saved));
  $('#save-variant').innerHTML = `${saved ? 'Retirer ce coloris' : 'Garder ce coloris'} <span aria-hidden="true">${saved ? '♥' : '♡'}</span>`;
  $('.storage-note').textContent = storageAvailable ? 'Enregistrés uniquement dans ce navigateur.' : 'Stockage indisponible : cette sélection sera perdue au rechargement.';
}

function renderVariant(announce = true) {
  document.querySelectorAll('[data-series]').forEach(button => {
    const active = button.dataset.series === selected.series;
    button.setAttribute('aria-pressed', String(active));
    button.classList.toggle('active', active);
  });
  $('#color-options').innerHTML = variants.filter(item => item.series === selected.series).map(item => `<button class="color-option${item.id === selected.id ? ' active' : ''}" data-variant="${item.id}" aria-pressed="${item.id === selected.id}" aria-label="${item.label} — ${item.source}" title="${item.label}"><span class="duo base-${item.base} accent-${item.accent}" aria-hidden="true"></span></button>`).join('');
  $('#variant-image').src = imageFor(selected);
  $('#variant-image').alt = `Illustration indicative : ${selected.label}, référence ${selected.source}. Forme et teinte non contractuelles.`;
  $('#variant-label').textContent = selected.label;
  $('#variant-reference').textContent = selected.source;
  if (announce) $('#variant-status').textContent = `Modèle ${selected.series.toUpperCase()}, ${selected.label}. Référence ${selected.source}.`;
  updateFavorites();
}

function renderSaved() {
  const saved = variants.filter(item => favorites.has(item.id));
  $('#saved-variants').innerHTML = saved.length ? `<ul class="saved-list">${saved.map(item => `<li><img src="${imageFor(item)}" alt="" width="70" height="80"><button class="saved-open" data-select="${item.id}"><strong>${item.label}</strong><span>Modèle ${item.series.toUpperCase()} · ${item.source}</span></button><button class="saved-remove" data-remove="${item.id}" aria-label="Retirer ${item.source} des favoris">×</button></li>`).join('')}</ul><button class="text-link" id="clear-favorites">Effacer ma sélection</button>` : '<p class="empty-state">Pas encore de coup de cœur ? Explorez les coloris et gardez vos duos préférés avec le bouton cœur.</p><button class="button dark" id="explore-colors">Explorer les coloris <span class="arrow" aria-hidden="true"></span></button>';
  $('#explore-colors')?.addEventListener('click', () => { $('#favorites-dialog').close(); scrollToProduct(); });
  $('#clear-favorites')?.addEventListener('click', () => { favorites.clear(); persistFavorites(); renderSaved(); $('#favorites-dialog .dialog-close').focus(); notify('Votre sélection a été effacée.'); });
}

function persistFavorites() {
  try { localStorage.setItem('print-strap-favorites', JSON.stringify([...favorites])); storageAvailable = true; }
  catch { storageAvailable = false; }
  updateFavorites();
}
function scrollToProduct() {
  $('#bracelet').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}

document.querySelectorAll('[data-series]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.series === selected.series) return;
  selected = variants.find(item => item.series === button.dataset.series);
  renderVariant();
}));
$('#color-options').addEventListener('click', event => {
  const button = event.target.closest('[data-variant]');
  if (!button) return;
  selected = variantById(button.dataset.variant);
  renderVariant();
  document.querySelector(`[data-variant="${selected.id}"]`).focus({ preventScroll: true });
});
$('#save-variant').addEventListener('click', () => {
  const saved = favorites.has(selected.id);
  saved ? favorites.delete(selected.id) : favorites.add(selected.id);
  persistFavorites();
  notify(storageAvailable ? (saved ? 'Coloris retiré de votre sélection.' : 'Coloris ajouté à votre sélection.') : 'Sélection temporaire : le stockage du navigateur est indisponible.');
});
$('#show-favorites').addEventListener('click', () => { renderSaved(); $('#favorites-dialog').showModal(); });
$('#saved-variants').addEventListener('click', event => {
  const remove = event.target.closest('[data-remove]');
  const open = event.target.closest('[data-select]');
  if (remove) {
    favorites.delete(remove.dataset.remove);
    persistFavorites(); renderSaved();
    ($('#saved-variants .saved-remove') || $('#favorites-dialog .dialog-close')).focus();
  } else if (open) {
    selected = variantById(open.dataset.select);
    renderVariant(); $('#favorites-dialog').close(); scrollToProduct();
    document.querySelector(`[data-variant="${selected.id}"]`).focus({ preventScroll: true });
  }
});

const menu = $('.menu-toggle');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); $('#navigation').classList.remove('open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); $('#navigation').classList.toggle('open', open); });
$('#navigation').addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);
for (const dialog of document.querySelectorAll('dialog')) {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
}
function showInfo(title, text) { $('#info-title').textContent = title; $('#info-text').textContent = text; $('#info-dialog').showModal(); }
$('#contact-button').addEventListener('click', () => showInfo('Restons en contact.', 'La boutique est en préparation. Les coordonnées de contact seront ajoutées avant l’ouverture. Aucun message n’est envoyé depuis cette vitrine.'));
$('#legal-button').addEventListener('click', () => showInfo('À propos de Print.', 'Print est une vitrine indépendante, sans affiliation avec SUUNTO. Les informations produit proviennent d’une fiche AliExpress transmise par le propriétaire ; la compatibilité n’est pas vérifiée. Les illustrations sont non contractuelles. Aucun paiement ni suivi publicitaire n’est intégré. Vos favoris sont stockés uniquement dans ce navigateur ; utilisez « Effacer ma sélection » pour les supprimer. L’identité de l’éditeur, les coordonnées et les mentions légales doivent être complétées avant une publication commerciale.'));
$('.info-ok').addEventListener('click', () => $('#info-dialog').close());
$('#year').textContent = new Date().getFullYear();
renderVariant(false);
