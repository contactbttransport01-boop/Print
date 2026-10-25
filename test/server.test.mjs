import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { makeServer } from '../server.mjs';
import { variants, imageFor } from '../public/catalog.js';

let server;
let origin;
before(async () => {
  server = makeServer(fileURLToPath(new URL('../public/', import.meta.url)));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => new Promise(resolve => server.close(resolve)));

test('la page française sert le bracelet et précise que les ventes ne sont pas ouvertes', async () => {
  const response = await fetch(origin);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  const html = await response.text();
  assert.match(html, /lang="fr"/);
  assert.match(html, /id="color-options"/);
  assert.match(html, /22 mm/);
  assert.match(html, /La vente en ligne n’est pas encore ouverte/);
});

test('tous les fichiers nécessaires sont servis avec le bon type MIME', async () => {
  for (const [path, type] of [
    ['/styles.css', 'text/css'], ['/app.js', 'text/javascript'], ['/catalog.js', 'text/javascript'],
    ['/assets/strap-hero.svg', 'image/svg+xml'], ['/assets/favicon.svg', 'image/svg+xml'],
    ...[...new Set(variants.map(imageFor))].map(path => [path, 'image/svg+xml'])
  ]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    assert.ok(response.headers.get('content-type').startsWith(type), path);
    assert.ok((await response.text()).length > 100, path);
  }
});

test('les fichiers du serveur et les chemins encodés restent inaccessibles', async () => {
  for (const path of ['/server.mjs', '/package.json', '/.git/config', '/%2e%2e%2fpackage.json', '/assets/inconnu.svg']) {
    assert.equal((await fetch(origin + path)).status, 404, path);
  }
});

test('HEAD conserve les en-têtes sans renvoyer le contenu', async () => {
  const response = await fetch(origin, { method: 'HEAD' });
  assert.equal(response.status, 200);
  assert.ok(Number(response.headers.get('content-length')) > 1000);
  assert.equal(await response.text(), '');
});

test('le serveur ne reçoit aucune soumission de formulaire', async () => {
  const response = await fetch(origin, { method: 'POST', body: 'test' });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET, HEAD');
});
