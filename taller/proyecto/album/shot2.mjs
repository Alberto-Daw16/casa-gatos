import pw from 'playwright';  // npm i playwright (o NODE_PATH al global)
const b = await pw.chromium.launch();
const p = await (await b.newContext({viewport:{width:1000,height:1500}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file://' + (process.env.ALBUM || process.env.HOME + '/Downloads/gremory-cartas/album-set1.html')); await p.waitForTimeout(2500);
for(const id of process.argv.slice(2)){ await p.click('[data-id="s01-'+id+'"]'); await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(700);
  const vs=await p.$$eval('#vers button',bs=>bs.map(b=>b.dataset.v));
  for(const v of vs.slice(0,(process.env.NV|0)||2)){ await p.click('#vers [data-v="'+v+'"]'); await p.mouse.move(5,5); await p.waitForTimeout(900);
    const bb=await (await p.$('#sitio .carta')).boundingBox(); const clip={x:bb.x-20,y:bb.y-20,width:bb.width+40,height:bb.height+40};
    await p.screenshot({path:'r-'+id+'-'+v+'-0.png', clip});
    await p.mouse.move(bb.x+bb.width*.1,bb.y+bb.height*.1,{steps:5}); await p.waitForTimeout(900);
    await p.screenshot({path:'r-'+id+'-'+v+'-1.png', clip});
    await p.mouse.move(bb.x+bb.width*.9,bb.y+bb.height*.85,{steps:5}); await p.waitForTimeout(900);
    await p.screenshot({path:'r-'+id+'-'+v+'-2.png', clip});
  }}
console.log(errs.slice(0,8)); await b.close();
