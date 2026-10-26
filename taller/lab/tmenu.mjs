import { pg, b, logs, shot } from './harness.mjs';
await pg.click('#navTcg'); await pg.waitForTimeout(3000);
await pg.evaluate(() => { const A = window.GAPP, G = window.GTCG; const t = new Date().toISOString();
  G.D1.LISTA.filter(e => e.ok).slice(0, 14).forEach((e, i) => A.S.tcgCartas.push({id: 'k' + i, c: e.id, v: G.versiones(e.id)[0], d: 'p1', t, o: 'sobre'})); });
await pg.click('[data-tab="sobres"]'); await pg.waitForTimeout(2500); await shot('m-sobres');
await pg.click('[data-tab="binder"]'); await pg.waitForTimeout(1500); await shot('m-binder');
console.log(await pg.evaluate(() => { const bd = document.getElementById('tgBd').getBoundingClientRect(), t = document.getElementById('tgTabs').getBoundingClientRect(); return {bdBottom: Math.round(bd.bottom), tabsTop: Math.round(t.top), cab: document.querySelector('.bd-cab').innerText}; }));
await pg.click('[data-tab="logros"]'); await pg.waitForTimeout(1200); await shot('m-logros');
console.log(logs.filter(l=>/ERR/.test(l)).join('\n')); await b.close();
