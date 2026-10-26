import { pg, b, logs, shot } from './harness.mjs';
const cdp = await pg.context().newCDPSession(pg);
await cdp.send('DOM.enable'); await cdp.send('LayerTree.enable'); let capas = [];
cdp.on('LayerTree.layerTreeDidChange', e => { if(e.layers) capas = e.layers; });
const lista = async (n) => {
  await pg.waitForTimeout(400); await cdp.send('DOM.getDocument', {depth:-1});
  const vis = capas.filter(l => l.drawsContent && !l.invisible);
  const out = {};
  for(const l of vis){ let nm = '?'; if(l.backendNodeId){ try { const d = await cdp.send('DOM.describeNode',{backendNodeId:l.backendNodeId}); const nd = d.node; nm = nd.nodeName.toLowerCase()+'.'+((nd.attributes||[]).reduce((a,v,i,arr)=> arr[i-1]==='class'? v : a,'')).split(' ').slice(0,2).join('.'); } catch(e){} }
    const k = nm; out[k] = out[k] || {n:0, mb:0}; out[k].n++; out[k].mb += l.width*l.height*36/1048576; }
  console.log('== '+n); Object.entries(out).sort((a,b)=>b[1].mb-a[1].mb).slice(0,25).forEach(([k,v]) => console.log(v.n, v.mb.toFixed(0)+'MB', k));
};
await pg.click('#navTcg'); await pg.waitForTimeout(3000);
await pg.click('[data-tab="sobres"]'); await pg.waitForTimeout(4000);
const el = await pg.$('[data-elige].on'); await el.click(); await pg.waitForTimeout(2500); await lista('sobre');
const g = await pg.evaluate(() => { const e = document.querySelector('.gv-guia3d') || document.querySelector('.gx-sobre .gx-raya'); const r = e.getBoundingClientRect(); return {x:r.left, y:r.top+r.height/2, w:r.width}; });
await pg.mouse.move(g.x+8, g.y); await pg.mouse.down(); for(let i=1;i<=14;i++){ await pg.mouse.move(g.x+8+g.w*i/14, g.y); await pg.waitForTimeout(30); } await pg.mouse.up();
await pg.waitForTimeout(3500); await lista('pila0');
for(let i=1;i<5;i++){ const c = await pg.$('.gv-carta.arriba'); const r = await c.boundingBox(); await pg.mouse.move(r.x+r.width/2, r.y+r.height/2); await pg.mouse.down(); await pg.mouse.move(r.x+r.width/2-200, r.y+r.height/2, {steps:5}); await pg.mouse.up(); await pg.waitForTimeout(900); }
await lista('ultima');
const c = await pg.$('.gv-carta.arriba'); await c.click(); await pg.waitForTimeout(1800); await lista('splash'); await shot('mem-splash');
console.log(logs.filter(l=>/ERR/.test(l)).join('\n')); await b.close();
