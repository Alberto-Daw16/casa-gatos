import { pg, b, logs, shot } from './harness.mjs';
await pg.evaluate(() => { location.hash = ''; }); await pg.waitForTimeout(1200);
await pg.evaluate(() => document.querySelector('[data-view="care"]').click()); await pg.waitForTimeout(1000);
console.log(await pg.evaluate(() => [...document.querySelectorAll('#v-care .chip')].slice(0,6).map(c => c.innerText).join(',')));
await pg.evaluate(() => document.querySelector('[data-view="fin"]').click()); await pg.waitForTimeout(1000);
const el = await pg.$('#ahorroBox'); await el.scrollIntoViewIfNeeded(); await el.screenshot({path:'shots/ahorro.png'});
console.log(await pg.evaluate(() => document.getElementById('ahorroBox').innerText.replace(/\n/g,' | ')));
console.log(logs.filter(l=>/ERR/.test(l)).join('\n')); await b.close();
