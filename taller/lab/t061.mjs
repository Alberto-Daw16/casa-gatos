import { pg, b, logs, shot } from './harness.mjs';
await pg.evaluate(() => { const A = window.GAPP; A.S.yo = 'p2'; });
await pg.click('#navTcg'); await pg.waitForTimeout(3000);
await pg.evaluate(() => { const A = window.GAPP, G = window.GTCG;
  G.D1.LISTA.filter(e => e.ok && e.n !== '061').forEach((e, i) => A.S.tcgCartas.push({id: 'k' + i, c: e.id, v: G.versiones(e.id)[0], d: 'p2', t: '2026-10-24T10:00:00Z', o: 'sobre'}));
  A.S.tcgSobres.forEach(s => { if(s.d === 'p2') s.abierto = true; }); });
// cerrar y volver a abrir para que premia() vea el set completo
await pg.click('[data-acc="cierra"]'); await pg.waitForTimeout(800);
await pg.click('#navTcg'); await pg.waitForTimeout(3000);
console.log('sobres p2:', await pg.evaluate(() => JSON.stringify(window.GAPP.S.tcgSobres.filter(s => s.d === 'p2' && !s.abierto).map(s => s.id))));
await pg.click('[data-tab="binder"]'); await pg.waitForTimeout(1500);
await pg.click('[data-filtro="faltan"]'); await pg.waitForTimeout(1200); await shot('s61-faltan');
await pg.click('[data-tab="sobres"]'); await pg.waitForTimeout(2500); await shot('s61-sobres');
await pg.clock.install(); await pg.clock.pauseAt(Date.now()+1000);
const run = async ms => { for(let t=0;t<ms;t+=33) await pg.clock.runFor(33); };
const el = await pg.$('[data-elige].on') || await pg.$('[data-elige]'); await el.click(); await run(1500);
const g = await pg.evaluate(() => { const e = document.querySelector('.gv-guia3d'); if(!e) return null; const r = e.getBoundingClientRect(); return {x:r.left, y:r.top, w:r.width}; });
if (g) { await pg.mouse.move(g.x+8, g.y); await pg.mouse.down(); for(let i=1;i<=14;i++){ await pg.mouse.move(g.x+8+g.w*i/14, g.y); await run(33); } await pg.mouse.up(); }
await run(3500); await shot('s61-pila');
const c = await pg.$('.gv-carta.arriba'); if (c) { await c.click(); }
await run(1200); await shot('s61-splash1'); await run(1500); await shot('s61-splash2');
console.log('tiene061:', await pg.evaluate(() => window.GAPP.S.tcgCartas.some(x => x.c === 's01-061' && x.d === 'p2')));
console.log(logs.filter(l=>/ERR/.test(l)).join('\n')); await b.close();
