import { test } from 'node:test';
import assert from 'node:assert/strict';
import { variants, defaultVariant, supplierUrl } from '../public/catalog.js';

test('le catalogue conserve les 25 références fournisseur sans doublon ni modèle inventé', () => {
  assert.equal(variants.length, 25);
  assert.equal(new Set(variants.map(item => item.id)).size, 25);
  assert.equal(new Set(variants.map(item => item.source)).size, 25);
  assert.deepEqual(Object.fromEntries(['a', 'b', 'c'].map(series => [series, variants.filter(item => item.series === series).length])), { a: 10, b: 5, c: 10 });
  for (const item of variants) {
    assert.ok(item.source.startsWith(`${item.series}-`), item.source);
    assert.match(item.id, /^[a-z0-9-]+$/);
    assert.ok(item.label && item.base && item.accent, item.source);
  }
  assert.equal(defaultVariant.source, 'b-Green Black');
  assert.equal(new URL(supplierUrl).pathname, '/item/1005010153583798.html');
});

test('les références ne présentent ni prix de vente, ni stock, ni compatibilité validée', () => {
  for (const item of variants) {
    assert.equal(item.price, undefined);
    assert.equal(item.stock, undefined);
    assert.equal(item.compatibleModels, undefined);
  }
});
