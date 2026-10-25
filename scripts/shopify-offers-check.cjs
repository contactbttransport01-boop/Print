const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const theme = path.join(__dirname, '../shopify-theme');
const options = `<option value="101" data-available="true" data-unit-cents="1490" data-price="14,90 €" data-compare="19,90 €" data-min="1" data-step="1" data-max="">Vert</option><option value="102" data-available="true" data-unit-cents="1490" data-price="14,90 €" data-compare="19,90 €" data-min="1" data-step="1" data-max="">Bleu</option><option value="103" data-available="false" data-unit-cents="1490" data-price="14,90 €" data-compare="" data-min="1" data-step="1" data-max="">Épuisé</option><option value="104" data-available="true" data-unit-cents="1590" data-price="15,90 €" data-compare="" data-min="1" data-step="1" data-max="">Hors offre</option><option value="105" data-available="true" data-unit-cents="1490" data-price="14,90 €" data-compare="" data-min="1" data-step="1" data-max="1">Maximum un</option>`;
const offers = [[1,'14,90 €'],[2,'24,90 €'],[3,'34,90 €']].map(([quantity,price])=>`<label class="offer-card"><input type="radio" name="offer" data-offer value="${quantity}" data-offer-price="${price}" ${quantity===1?'checked':''}><span><strong>${quantity} bracelet${quantity>1?'s':''}</strong><small>Votre sélection</small></span><span class="offer-price">${price}</span></label>`).join('');
const extras=[2,3].map(index=>`<div data-extra-color="${index}" hidden><label for="Extra-${index}" class="field-label">Bracelet ${index}</label><select id="Extra-${index}" data-extra-variant disabled>${options}</select></div>`).join('');
const fixture = `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/theme.css"><body><main class="wrap section"><div data-product-root data-offers-enabled="true"><div class="product-config"><h1 class="product-title">Bracelet silicone 22 mm</h1><div class="product-prices"><span data-product-price class="product-price"></span><s data-compare-price></s></div><form id="TestForm" action="/fr/cart/add" method="post" data-cart-add-url="/fr/cart/add" data-cart-url="/fr/cart"><label class="field-label" for="Variant">Variante</label><select id="Variant" name="id" data-variant-select>${options}</select><fieldset class="volume-offers" data-offer-picker hidden><legend>Composez votre sélection</legend>${offers}</fieldset>${extras}<div data-quantity-field><input data-quantity name="quantity" value="1" type="number" min="1" required></div><button type="submit" data-add-to-cart class="button dark add-to-cart"><span data-add-label>Ajouter au panier</span></button><p data-availability></p><p data-purchase-error class="form-errors" role="alert" hidden></p><a data-check-cart hidden href="/fr/cart">Vérifier mon panier</a></form><div class="mobile-purchase"><span data-sticky-price></span><button type="submit" form="TestForm" data-add-sticky><span data-sticky-label></span></button></div></div></div></main><script src="/theme.js"></script></body></html>`;
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const errors=[];const payloads=[];const nativePayloads=[];let reject=false;
  await context.route('https://print-theme.test/**', async route=>{
   const request=route.request();const url=new URL(request.url());
   if(url.pathname==='/theme.js') return route.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.join(theme,'assets/theme.js'),'utf8')});
   if(url.pathname==='/theme.css') return route.fulfill({contentType:'text/css',body:fs.readFileSync(path.join(theme,'assets/theme.css'),'utf8')});
   if(url.pathname==='/fr/cart/add'){nativePayloads.push(Object.fromEntries(new URLSearchParams(request.postData())));return route.fulfill({contentType:'text/html',body:'<h1>Formulaire natif reçu</h1>'});}
   if(url.pathname==='/fr/cart/add.js'){
    payloads.push(request.postDataJSON());
    return route.fulfill({status:reject?422:200,contentType:'application/json',body:JSON.stringify(reject?{description:'Stock insuffisant.'}:{items:[]})});
   }
   return route.fulfill({contentType:'text/html',body:url.pathname==='/fr/cart'?'<h1>Panier de test</h1>':fixture});
  });
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  const reset=async()=>{await page.goto('https://print-theme.test/');await page.waitForFunction(()=>document.querySelector('[data-product-root]')?.dataset.initialized==='true');};
  await reset();
  assert.equal(await page.locator('[data-product-price]').innerText(),'14,90 €');
  assert.equal(await page.locator('[data-compare-price]').innerText(),'19,90 €');
  assert.equal(await page.locator('[data-offer-picker]').isHidden(),false);
  assert.equal(await page.locator('[data-quantity-field]').isHidden(),true);
  await Promise.all([page.waitForURL('https://print-theme.test/fr/cart/add'),page.locator('[data-add-to-cart]').click()]);
  assert.equal(nativePayloads.at(-1).id,'101');assert.equal(nativePayloads.at(-1).quantity,'1');assert.equal(payloads.length,0);
  await reset();
  await page.locator('[data-offer][value="2"]').check();
  assert.equal(await page.locator('[data-product-price]').innerText(),'24,90 €');
  assert.equal(await page.locator('[data-compare-price]').isHidden(),true);
  assert.equal(await page.locator('[data-extra-variant]').nth(0).isEnabled(),true);
  assert.equal(await page.locator('[data-extra-variant]').nth(1).isDisabled(),true);
  await page.locator('[data-extra-variant]').nth(0).selectOption('102');
  await Promise.all([page.waitForURL('https://print-theme.test/fr/cart'),page.locator('[data-add-to-cart]').click()]);
  assert.deepEqual(payloads.at(-1),{items:[{id:'101',quantity:1},{id:'102',quantity:1}]});
  await reset();
  await page.locator('[data-offer][value="3"]').check();
  assert.equal(await page.locator('[data-product-price]').innerText(),'34,90 €');
  assert.equal(await page.locator('[data-sticky-price]').innerText(),'34,90 €');
  assert.equal(await page.locator('[data-quantity]').inputValue(),'3');
  await page.screenshot({path:'/tmp/print-offers-mobile.png',fullPage:true});
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Débordement à ${width}px`);}
  await Promise.all([page.waitForURL('https://print-theme.test/fr/cart'),page.locator('[data-add-to-cart]').click()]);
  assert.deepEqual(payloads.at(-1),{items:[{id:'101',quantity:3}]});
  await reset();
  await page.locator('[data-offer][value="2"]').check();
  await page.locator('[data-extra-variant]').nth(0).selectOption('103');
  assert.equal(await page.locator('[data-add-to-cart]').isDisabled(),true);
  assert.equal(await page.locator('[data-add-sticky]').isDisabled(),true);
  const before=payloads.length;
  await page.locator('form').evaluate(form=>form.requestSubmit());
  assert.equal(payloads.length,before);
  await page.locator('[data-extra-variant]').nth(0).selectOption('104');
  assert.equal(await page.locator('[data-add-to-cart]').isDisabled(),true);
  assert.match(await page.locator('[data-availability]').innerText(),/ne fait pas partie/);
  await page.locator('[data-variant-select]').selectOption('105');
  await page.locator('[data-extra-variant]').nth(0).selectOption('105');
  assert.equal(await page.locator('[data-add-to-cart]').isDisabled(),true);
  assert.match(await page.locator('[data-availability]').innerText(),/quantité/);
  await page.locator('[data-offer][value="1"]').check();
  assert.equal(await page.locator('[data-add-to-cart]').isEnabled(),true);
  await page.locator('[data-variant-select]').selectOption('101');
  await page.locator('[data-offer][value="2"]').check();
  await page.locator('[data-extra-variant]').nth(0).selectOption('102');
  reject=true;
  await page.locator('[data-add-to-cart]').click();
  await page.waitForFunction(()=>document.querySelector('[data-purchase-error]').hidden===false);
  assert.equal(await page.locator('[data-purchase-error]').innerText(),'Stock insuffisant.');
  assert.equal(await page.locator('[data-check-cart]').isVisible(),true);
  assert.equal(await page.locator('[data-add-to-cart]').isEnabled(),true);
  assert.equal(await page.locator('form').getAttribute('aria-busy'),null);
  assert.deepEqual(errors,[]);
  assert.ok(payloads.every(payload=>Object.keys(payload).join(',')==='items'));
  console.log('PASS : prix 14,90/24,90/34,90, duo multicolore, trio regroupé, IDs et quantités envoyés à Shopify sans prix ni remise client, articles indisponibles, contraintes de quantité, erreur serveur, route française et responsive. API simulée ; remises Shopify réelles non testées.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
