const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://example.test/**',route=>route.fulfill({contentType:'image/svg+xml',body:fs.readFileSync(require('node:path').join(__dirname, '../shopify-theme/assets/strap-hero.svg'),'utf8')}));
  await page.setContent(`<button class="menu-toggle" aria-expanded="false" aria-controls="MainNavigation">Menu</button><nav id="MainNavigation"><a href="#product">Produit</a></nav><div data-product-root id="product"><img class="product-image" src="https://example.test/green.svg" width="100" height="100"><span data-product-price>19,90 €</span><s data-compare-price hidden></s><form id="TestForm"><select name="id" data-variant-select><option value="101" data-available="true" data-price="19,90 €" data-compare="" data-min="1" data-step="1" data-max="" data-image="https://example.test/green.svg">Vert</option><option value="102" data-available="true" data-price="24,90 €" data-compare="29,90 €" data-min="2" data-step="2" data-max="6" data-image="https://example.test/blue.svg" data-image-alt="Bleu">Bleu</option><option value="103" data-available="false" data-price="21,90 €" data-compare="" data-min="1" data-step="1" data-max="">Épuisé</option></select><input data-quantity name="quantity" type="number" value="1" min="1"><div style="height:1100px"></div><button type="submit" data-add-to-cart><span data-add-label>Ajouter</span></button></form><p data-availability></p><button type="button" data-image-url="https://example.test/detail.svg" data-image-alt="Détail">Détail</button><div class="mobile-purchase"><span data-sticky-price></span><button type="submit" form="TestForm" data-add-sticky><span data-sticky-label>Ajouter</span></button></div></div>`);
  await page.addStyleTag({path:require('node:path').join(__dirname, '../shopify-theme/assets/theme.css')});
  await page.addScriptTag({path:require('node:path').join(__dirname, '../shopify-theme/assets/theme.js')});
  await page.evaluate(()=>document.getElementById('TestForm').addEventListener('submit',e=>{e.preventDefault();window.testPayload=Object.fromEntries(new FormData(e.target));}));
  await page.selectOption('[data-variant-select]','102');
  assert.equal(await page.locator('[data-product-price]').innerText(),'24,90 €');
  assert.equal(await page.locator('[data-compare-price]').isHidden(),false);
  assert.equal(await page.locator('[data-quantity]').inputValue(),'2');
  assert.equal(await page.locator('[data-quantity]').getAttribute('max'),'6');
  assert.equal(await page.locator('.product-image').getAttribute('src'),'https://example.test/blue.svg');
  await page.waitForFunction(()=>document.querySelector('[data-product-root]').dataset.sticky==='true');
  await page.locator('[data-add-sticky]').click();
  assert.deepEqual(await page.evaluate(()=>window.testPayload),{id:'102',quantity:'2'});
  await page.selectOption('[data-variant-select]','103');
  assert.equal(await page.locator('[data-add-to-cart]').isDisabled(),true);
  assert.equal(await page.locator('[data-add-sticky]').isDisabled(),true);
  assert.equal(await page.locator('[data-compare-price]').isHidden(),true);
  assert.equal(await page.locator('[data-quantity]').getAttribute('max'),null);
  await page.selectOption('[data-variant-select]','101');
  assert.equal(await page.locator('[data-add-to-cart]').isEnabled(),true);
  await page.locator('[data-image-url]').click();
  assert.equal(await page.locator('.product-image').getAttribute('alt'),'Détail');
  await page.locator('.menu-toggle').click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  assert.deepEqual(errors,[]);
  console.log('PASS Chromium : variante, prix, remise réelle, quantité minimale, stock épuisé, photo, soumission du bon ID et de la quantité via le bouton mobile, et navigation. Données de test ; paiement Shopify non exécuté.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
