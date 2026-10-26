import { pg, b, logs, shot } from './harness.mjs';
await pg.click('#navTcg'); await pg.waitForTimeout(3000);
await pg.evaluate(() => { const A = window.GAPP, G = window.GTCG; const t = new Date().toISOString();
  ['s01-001','s01-005','s01-058'].forEach((c, i) => A.S.tcgCartas.push({id: 'k' + i, c, v: G.versiones(c)[0], d: 'p1', t, o: 'sobre'})); });
await pg.click('[data-tab="sobres"]'); await pg.waitForTimeout(400); await pg.click('[data-tab="binder"]'); await pg.waitForTimeout(1200);
console.log('filtros', await pg.evaluate(() => [...document.querySelectorAll('[data-filtro]')].map(b => b.innerText).join(',')));
for(let i = 0; i < 6; i++){ await pg.click('.tg-flechas [data-ir="1"]'); await pg.waitForTimeout(900); }
await shot('pag7');
console.log('pag7', await pg.evaluate(() => document.querySelector('.bd-cab').innerText + ' | ' + [...document.querySelectorAll('.bd-bol')].map(b => b.className.replace('bd-bol','').trim() || 'ok').join(',')));
await pg.evaluate(() => { const v = document.querySelector("#tgVisor"); }); for(let i=0;i<6;i++){ await pg.click(".tg-flechas [data-ir=\"-1\"]"); await pg.waitForTimeout(700); } await pg.click(".bd-bol[data-id=\"s01-001\"]"); await pg.waitForTimeout(1200);
const vers = await pg.evaluate(() => [...document.querySelectorAll('#tgVisor [data-ver]')].map(b => b.dataset.ver + (b.classList.contains('no') ? '-no' : '')).join(','));
console.log('vers', vers);
const no0 = await pg.$('#tgVisor [data-ver].no'); if(no0){ await no0.click(); await pg.waitForTimeout(900); await shot('visor-no'); console.log('oculta', await pg.evaluate(() => !!document.querySelector('#tgVisor .tg-oculta-v') + ' carta=' + !!document.querySelector('#tgVisor .tg-esc .carta:not(.tg-oculta-v)'))); }
await pg.click('#tgVisor [data-v-acc="sig"]'); await pg.waitForTimeout(1000);
console.log('sig ->', await pg.evaluate(() => document.querySelector('#tgVisor .tg-tit b').innerText));
await pg.click('#tgVisor [data-v-acc="ant"]'); await pg.waitForTimeout(800); await pg.click('#tgVisor [data-v-acc="ant"]'); await pg.waitForTimeout(800);
console.log('ant x2 ->', await pg.evaluate(() => document.querySelector('#tgVisor .tg-tit b').innerText));
const no = await pg.$('#tgVisor [data-ver].no'); if(no){ await no.click(); await pg.waitForTimeout(800); await shot('visor-no'); console.log('oculta', await pg.evaluate(() => !!document.querySelector('#tgVisor .tg-oculta-v') + ' carta=' + !!document.querySelector('#tgVisor .tg-esc .carta:not(.tg-oculta-v)'))); }
console.log(logs.filter(l=>/ERR/.test(l)).join('\n')); await b.close();
