import pw from 'playwright';  // npm i playwright (o NODE_PATH al global)
const b = await pw.chromium.launch();
const p = await (await b.newContext({viewport:{width:1000,height:1400}, deviceScaleFactor:1})).newPage();
await p.goto('file://' + (process.env.ALBUM || process.env.HOME + '/Downloads/gremory-cartas/album-set1.html')); await p.waitForTimeout(2500);
const ids = await p.$$eval('#tira button[data-id]', bs => bs.map(b => b.dataset.id));
for(const id of ids){ await p.click('[data-id="'+id+'"]'); await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(500); let bb = await (await p.$('#sitio .carta')).boundingBox();
  await p.mouse.move(bb.x+bb.width/2, bb.y+bb.height/2); await p.waitForTimeout(1200); bb = await (await p.$('#sitio .carta')).boundingBox();
  await p.screenshot({path:(process.env.TH_DIR || 'th') + '/' +id.slice(4)+'.png', clip:{x:bb.x,y:bb.y,width:bb.width,height:bb.height}}); }
console.log(ids.length); await b.close();
