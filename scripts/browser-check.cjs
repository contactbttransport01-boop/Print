const { chromium } = require('playwright');
const assert = require('node:assert/strict');

async function check() {
  const origin = process.env.PRINT_TEST_URL || 'http://127.0.0.1:3001';
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(origin);
    assert.equal(await page.locator('#variant-reference').innerText(), 'b-Green Black');
    const visited = new Set();
    for (const [series, count] of [['a', 10], ['b', 5], ['c', 10]]) {
      await page.locator(`[data-series="${series}"]`).click();
      assert.equal(await page.locator('[data-variant]').count(), count);
      const ids = await page.locator('[data-variant]').evaluateAll(nodes => nodes.map(node => node.dataset.variant));
      for (const id of ids) {
        await page.locator(`[data-variant="${id}"]`).click();
        visited.add(await page.locator('#variant-reference').innerText());
        assert.equal(await page.locator(`[data-variant="${id}"]`).getAttribute('aria-pressed'), 'true');
        assert.equal(await page.locator('#variant-image').evaluate(async img => { await img.decode(); return img.naturalWidth > 0; }), true);
      }
    }
    assert.equal(visited.size, 25);
    await page.locator('[data-series="b"]').click();
    await page.locator('[data-variant="b-green-black"]').click();
    await page.locator('#save-variant').click();
    assert.equal(await page.locator('#favorite-count').innerText(), '1');
    await page.locator('[data-variant="b-black-blue"]').click();
    await page.locator('#save-variant').click();
    assert.equal(await page.locator('#favorite-count').innerText(), '2');
    await page.reload();
    assert.equal(await page.locator('#favorite-count').innerText(), '2');
    await page.locator('#show-favorites').click();
    assert.equal(await page.locator('.saved-list li').count(), 2);
    await page.locator('[data-select="b-black-blue"]').click();
    assert.equal(await page.locator('#favorites-dialog').evaluate(node => node.open), false);
    assert.equal(await page.locator('#variant-reference').innerText(), 'b-Black Blue');
    await page.locator('#show-favorites').click();
    await page.locator('[data-remove="b-green-black"]').click();
    assert.equal(await page.locator('.saved-list li').count(), 1);
    await page.locator('#clear-favorites').click();
    assert.equal(await page.locator('#favorite-count').innerText(), '0');
    assert.equal(await page.locator('.empty-state').isVisible(), true);
    await page.keyboard.press('Escape');
    await page.locator('summary').first().click();
    assert.equal(await page.locator('details').first().getAttribute('open'), '');
    await page.locator('#contact-button').click();
    assert.equal(await page.locator('#info-dialog').evaluate(node => node.open), true);
    assert.match(await page.locator('#info-text').innerText(), /Aucun message n’est envoyé/);
    await page.locator('.info-ok').click();
    for (const width of [320, 375, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 950 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Débordement à ${width}px`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => scrollTo(0, 0));
    await page.locator('.menu-toggle').click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
    await page.locator('#navigation a').first().click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    await page.goto(origin);
    await page.locator('#variant-reference').waitFor();
    await page.screenshot({ path: '/tmp/print-bracelet-mobile.png', fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: '/tmp/print-bracelet-desktop.png', fullPage: true });
    for (const link of await page.locator('a[target="_blank"]').all()) {
      assert.equal(new URL(await link.getAttribute('href')).pathname, '/item/1005010153583798.html');
      assert.match(await link.getAttribute('rel'), /noopener/);
    }
    const restricted = await browser.newContext();
    await restricted.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Stockage désactivé'); } }));
    const other = await restricted.newPage();
    await other.goto(origin);
    await other.locator('#save-variant').click();
    assert.equal(await other.locator('#favorite-count').innerText(), '1');
    await other.locator('#show-favorites').click();
    assert.match(await other.locator('.storage-note').innerText(), /perdue au rechargement/);
    assert.deepEqual(errors, []);
    console.log('PASS : 25 variantes et images, favoris persistants, suppression, FAQ, contact, liens fournisseur, menu mobile, stockage désactivé et affichage de 320 à 1440 px. Aucune erreur JavaScript ou ressource en échec.');
  } finally { await browser.close(); }
}
check().catch(error => { console.error(error); process.exitCode = 1; });
