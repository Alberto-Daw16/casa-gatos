import { pg, b, logs, shot } from './harness.mjs';
await pg.evaluate(() => { location.hash = ''; });
await pg.waitForTimeout(1500);
await pg.evaluate(() => document.querySelector('[data-view="fin"]').click()); await pg.waitForTimeout(1200);
await pg.evaluate(() => document.getElementById('retoBox').scrollIntoView()); await pg.waitForTimeout(600);
await shot('dinero-1');
await pg.evaluate(() => window.scrollBy(0, 700)); await pg.waitForTimeout(500); await shot('dinero-2');
// editar el gasto de la castración: debe salir marcado como puntual
await pg.evaluate(() => { document.querySelector('[data-edit][data-id="e3"]') ? document.querySelector('[data-edit][data-id="e3"]').click() : null; });
await pg.waitForTimeout(600);
console.log('punt', await pg.evaluate(() => { const c = document.getElementById('f_punt'); return c ? c.innerText + ' | on=' + c.querySelector('.on').innerText : 'sin hoja'; }));
console.log(logs.filter(l=>/ERR|ahorro|copia/i.test(l)).join('\n')); await b.close();
