import { pg, b, logs, shot } from './harness.mjs';
await pg.evaluate(() => { location.hash = ''; });
await pg.waitForTimeout(1500);
await pg.evaluate(() => document.querySelector('[data-view="fin"]').click()); await pg.waitForTimeout(1200);
const el = await pg.$('#ahorroBox'); await el.scrollIntoViewIfNeeded(); await pg.waitForTimeout(800);
await el.screenshot({path: 'shots/ahorro.png'});
console.log(await pg.evaluate(() => document.getElementById('ahorroBox').innerText));
console.log(logs.filter(l=>/ERR|ahorro/i.test(l)).join('\n')); await b.close();
