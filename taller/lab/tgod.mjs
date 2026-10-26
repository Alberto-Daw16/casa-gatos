import { pg, b, logs, shot } from './harness.mjs';
await pg.click('#navTcg'); await pg.waitForTimeout(3000);
const ids = await pg.evaluate(() => { const T = window.TCG._prueba; let god = null, pe = null, n = 0;
  for(let k = 0; k < 200000 && (!god || !pe); k++){ const id = 'prueba:' + k + ':p1'; if(!god && T.genera(id).god){ god = id; n++; }
    if(!pe){ for(let i = 0; i < 5; i++) if(T.rng(id + ':pe:' + i)() < .01 && !T.genera(id).god){ pe = id; break; } } }
  let g = 0; for(let k = 0; k < 5000; k++) if(T.genera('x' + k).god) g++;
  return {god, pe, tasa: g / 5000, cartasGod: god && T.genera(god).map(x => x.c + ':' + x.v)}; });
console.log(JSON.stringify(ids));
// sobre God Pack primero
await pg.evaluate(id => { const A = window.GAPP; A.S.tcgSobres.unshift({id, d:'p1', tipo:'dia', motivo:'prueba', f:'2026-10-26', abierto:false, t:new Date().toISOString()}); }, ids.god);
await pg.click('[data-tab="sobres"]'); await pg.waitForTimeout(3500);
console.log('pre0', await pg.evaluate(() => window.TCG.disponibles('p1').pre.map(s => s.id).slice(0,3).join(',')));
const el = await pg.$('[data-elige].on'); await el.click(); await pg.waitForTimeout(3000);
const g = await pg.evaluate(() => { const e = document.querySelector('.gv-guia3d') || document.querySelector('.gx-sobre .gx-raya'); const r = e.getBoundingClientRect(); return {x:r.left, y:r.top+r.height/2, w:r.width}; });
await pg.mouse.move(g.x+8, g.y); await pg.mouse.down(); for(let i=1;i<=14;i++){ await pg.mouse.move(g.x+8+g.w*i/14, g.y); await pg.waitForTimeout(30); } await pg.mouse.up();
for(const t of [900,1300,1800,2600]){ await pg.waitForTimeout(t === 900 ? 900 : t - [900,1300,1800,2600][[900,1300,1800,2600].indexOf(t)-1]); await shot('god-c'+t); }
await pg.waitForTimeout(1400); await shot('god-pila');
console.log('tiers', await pg.evaluate(() => [...document.querySelectorAll('.gv-pila .gv-carta')].map(c => c.dataset.tier).join(',')));
for(let i=1;i<5;i++){ const c = await pg.$('.gv-carta.arriba'); const r = await c.boundingBox(); await pg.mouse.move(r.x+r.width/2, r.y+r.height/2); await pg.mouse.down(); await pg.mouse.move(r.x+r.width/2-200, r.y+r.height/2, {steps:5}); await pg.mouse.up(); await pg.waitForTimeout(900); }
const c5 = await pg.$('.gv-carta.arriba'); await c5.click(); await pg.waitForTimeout(1800); const sp = await pg.$('#gvSplash'); await sp.click(); await pg.waitForTimeout(1200);
const t5 = await pg.$('.gv-carta.arriba'); await t5.click(); await pg.waitForTimeout(1500); await shot('god-final');
console.log('sobre god', await pg.evaluate(id => JSON.stringify(window.GAPP.S.tcgSobres.find(s => s.id === id)), ids.god));
// sobre con 1ª edición
await pg.click('[data-ab="otro"]').catch(() => {});
await pg.evaluate(() => { const c = document.getElementById('tgAbre'); c.className = 'tg-capa'; c.innerHTML = ''; });
await pg.evaluate(id => { const A = window.GAPP; A.S.tcgSobres.unshift({id, d:'p1', tipo:'dia', motivo:'prueba', f:'2026-10-26', abierto:false, t:new Date().toISOString()}); }, ids.pe);
await pg.click('[data-tab="binder"]'); await pg.waitForTimeout(800); await pg.click('[data-tab="sobres"]'); await pg.waitForTimeout(2500);
const el2 = await pg.$('[data-elige].on'); await el2.click(); await pg.waitForTimeout(3000);
const g2 = await pg.evaluate(() => { const e = document.querySelector('.gv-guia3d') || document.querySelector('.gx-sobre .gx-raya'); const r = e.getBoundingClientRect(); return {x:r.left, y:r.top+r.height/2, w:r.width}; });
await pg.mouse.move(g2.x+8, g2.y); await pg.mouse.down(); for(let i=1;i<=14;i++){ await pg.mouse.move(g2.x+8+g2.w*i/14, g2.y); await pg.waitForTimeout(30); } await pg.mouse.up();
await pg.waitForTimeout(3500);
for(let i=0;i<5;i++){ const pe = await pg.evaluate(() => { const t = document.querySelector('.gv-carta.arriba'); return t ? t.classList.contains('pe-sale') : null; }); if(pe){ await pg.waitForTimeout(500); await shot('pe-sale'); console.log('pe-sale en', i); break; }
  const c = await pg.$('.gv-carta.arriba'); if(!c || await pg.evaluate(() => !!document.querySelector('.gv-carta.arriba.oculta'))) break; const r = await c.boundingBox(); await pg.mouse.move(r.x+r.width/2, r.y+r.height/2); await pg.mouse.down(); await pg.mouse.move(r.x+r.width/2-200, r.y+r.height/2, {steps:5}); await pg.mouse.up(); await pg.waitForTimeout(900); }
console.log(logs.filter(l=>/ERR/.test(l)).join('\n')); await b.close();
