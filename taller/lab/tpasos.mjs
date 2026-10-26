import { pg, b, logs, shot } from './harness.mjs';
await pg.click('#navTcg'); await pg.waitForTimeout(3000);
await pg.click('[data-tab="sobres"]'); await pg.waitForTimeout(4000);
const el = await pg.$('[data-elige].on'); await el.click(); await pg.waitForTimeout(2500);
const g = await pg.evaluate(() => { const e = document.querySelector('.gv-guia3d') || document.querySelector('.gx-sobre .gx-raya'); const r = e.getBoundingClientRect(); return {x:r.left, y:r.top+r.height/2, w:r.width}; });
await pg.mouse.move(g.x+8, g.y); await pg.mouse.down(); for(let i=1;i<=14;i++){ await pg.mouse.move(g.x+8+g.w*i/14, g.y); await pg.waitForTimeout(30); } await pg.mouse.up();
await pg.waitForTimeout(4000); await shot('pila-ligera');
for(let i=1;i<5;i++){ const c = await pg.$('.gv-carta.arriba'); const r = await c.boundingBox(); await pg.mouse.move(r.x+r.width/2, r.y+r.height/2); await pg.mouse.down(); await pg.mouse.move(r.x+r.width/2-200, r.y+r.height/2, {steps:5}); await pg.mouse.up(); await pg.waitForTimeout(900); await shot('paso'+i); console.log('paso', i, await pg.evaluate(() => [...document.querySelectorAll('.gv-pila .gv-carta')].map(e => e.dataset.n + (e.classList.contains('arriba')?'A':'') + (e.dataset.entera==='1'?'E':'h') + (e.classList.contains('oculta')?'O':'')).join(' ') + ' | ' + document.querySelector('.gv-cuenta').textContent)); }
await shot('ultima-ligera');
const c = await pg.$('.gv-carta.arriba'); await c.click(); await pg.waitForTimeout(1800); const sp = await pg.$('#gvSplash'); await sp.click(); await pg.waitForTimeout(1200);
await shot('girada-ligera'); const t = await pg.$('.gv-carta.arriba'); await t.click(); await pg.waitForTimeout(1500); await shot('final-ligera');
console.log('fin', await pg.evaluate(() => !!document.querySelector('#tgAbre.fin')));
console.log(logs.filter(l=>/ERR/.test(l)).join('\n')); await b.close();
