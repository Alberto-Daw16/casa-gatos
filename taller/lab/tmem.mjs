import { pg, b, logs, shot } from './harness.mjs';
const cdp = await pg.context().newCDPSession(pg);
await cdp.send('LayerTree.enable'); let capas = [];
cdp.on('LayerTree.layerTreeDidChange', e => { if(e.layers) capas = e.layers; });
const mide = async (n) => {
  await pg.waitForTimeout(300);
  const dpr = 3; const vis = capas.filter(l => l.drawsContent && !l.invisible);
  const mb = vis.reduce((s,l) => s + l.width*l.height*4*dpr*dpr, 0)/1048576;
  const im = await pg.evaluate(() => { let s=0, n=0; const vistos = new Set(); document.querySelectorAll('img').forEach(i => { if(i.naturalWidth && !vistos.has(i.currentSrc)){ vistos.add(i.currentSrc); s += i.naturalWidth*i.naturalHeight*4; n++; } });
    let cv=0; document.querySelectorAll('canvas').forEach(c => cv += c.width*c.height*4);
    return {imgs:n, imgMB:(s/1048576).toFixed(0), canvasMB:(cv/1048576).toFixed(0), nodos:document.querySelectorAll('*').length, cartas:document.querySelectorAll('.gv-pila .carta').length}; });
  console.log(n.padEnd(10), 'capas', vis.length, 'capasMB', mb.toFixed(0), JSON.stringify(im));
};
await pg.click('#navTcg'); await pg.waitForTimeout(3000);
await pg.click('[data-tab="sobres"]'); await pg.waitForTimeout(4000); await mide('sobres');
const el = await pg.$('[data-elige].on'); await el.click(); await pg.waitForTimeout(2500); await mide('sobre');
const g = await pg.evaluate(() => { const e = document.querySelector('.gv-guia3d') || document.querySelector('.gx-sobre .gx-raya'); if(!e) return null; const r = e.getBoundingClientRect(); return {x:r.left, y:r.top+r.height/2, w:r.width}; });
console.log('guia', JSON.stringify(g));
if (g) { await pg.mouse.move(g.x+8, g.y); await pg.mouse.down(); for(let i=1;i<=14;i++){ await pg.mouse.move(g.x+8+g.w*i/14, g.y); await pg.waitForTimeout(30); } await pg.mouse.up(); }
await pg.waitForTimeout(3500); await mide('pila0');
console.log('tiers', await pg.evaluate(() => [...document.querySelectorAll('.gv-pila .gv-carta')].map(c => c.dataset.tier).join(',')));
for(let i=1;i<5;i++){ const c = await pg.$('.gv-carta.arriba'); const oc = await pg.evaluate(()=>!!document.querySelector('.gv-carta.arriba.oculta'));
  if(oc){ await c.click(); await pg.waitForTimeout(1500); await mide('splash'); await shot('mem-splash'); break; }
  const r = await c.boundingBox(); await pg.mouse.move(r.x+r.width/2, r.y+r.height/2); await pg.mouse.down(); await pg.mouse.move(r.x+r.width/2-200, r.y+r.height/2, {steps:5}); await pg.mouse.up(); await pg.waitForTimeout(900); await mide('pila'+i); }
console.log(logs.filter(l=>/ERR/.test(l)).join('\n')); await b.close();
