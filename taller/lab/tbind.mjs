import { pg, b, logs, shot } from './harness.mjs';
await pg.click('#navTcg'); await pg.waitForTimeout(3000);
await pg.evaluate(() => { const A = window.GAPP, G = window.GTCG; G.D1.LISTA.filter(e => e.ok).slice(0, 25).forEach((e, i) => A.S.tcgCartas.push({id: 'k' + i, c: e.id, v: G.versiones(e.id)[0], d: 'p1', t: new Date().toISOString(), o: 'sobre'})); });
await pg.click('[data-tab="sobres"]'); await pg.waitForTimeout(3000); await shot('n-sobres');
await pg.click('[data-tab="binder"]'); await pg.waitForTimeout(2500); await shot('n-binder');
console.log(await pg.evaluate(() => { const bd = document.getElementById('tgBd').getBoundingClientRect(), c = document.getElementById('tgCuerpo'); return {bdTop: Math.round(bd.top), bdBottom: Math.round(bd.bottom), w: Math.round(bd.width), vh: innerHeight, scroll: c.scrollHeight - c.clientHeight}; }));
await pg.click('.tg-flechas [data-ir="1"]'); await pg.waitForTimeout(1200); await shot('n-binder2');
console.log(logs.filter(l=>/ERR/.test(l)).join('\n')); await b.close();
