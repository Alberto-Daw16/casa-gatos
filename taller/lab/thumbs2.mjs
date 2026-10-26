import { pg, b, logs } from './harness.mjs';
await pg.click('#navTcg'); await pg.waitForTimeout(3500);
const ids = await pg.evaluate(() => window.GTCG.D1.LISTA.filter(e => e.ok && e.n !== '061').map(e => 's01-' + e.n));
await pg.evaluate(() => { const d = document.createElement('div'); d.id = 'thz'; d.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;background:#000;padding:0;width:520px'; document.body.appendChild(d); });
const solo = process.env.SOLO ? process.env.SOLO.split(',') : null;
for (const id of ids) {
  if (solo && !solo.includes(id.slice(4))) continue;
  if (process.env.VERS) { const v0 = await pg.evaluate(id => window.GTCG.versiones(id)[0], id); if (!process.env.VERS.split(',').includes(v0)) continue; }
  const info = await pg.evaluate(async id => { const G = window.GTCG, v = G.versiones(id)[0], d = document.getElementById('thz');
    d.innerHTML = '<div style="--w:520px;width:520px">' + G.carta(id, v) + '</div>';
    await Promise.all([...d.querySelectorAll('img')].map(i => i.decode().catch(() => {})));
    await new Promise(r => setTimeout(r, 250));
    const c = d.querySelector('.carta'), r = c.getBoundingClientRect(); return {v, cls: c.className, x: r.left, y: r.top, w: r.width, h: r.height}; }, id);
  await pg.screenshot({path: 'th2/' + id.slice(4) + '.png', clip: {x: info.x, y: info.y, width: info.w, height: info.h}, timeout: 90000});
  console.log(id, info.v, Math.round(info.w) + 'x' + Math.round(info.h), info.cls.slice(0, 60));
}
console.log(logs.filter(l => /ERR/.test(l)).join('\n')); await b.close();
