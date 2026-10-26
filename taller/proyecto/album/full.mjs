import pw from 'playwright';  // npm i playwright (o NODE_PATH al global) const chromium=pw.chromium;
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1200,height:900}});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://' + (process.env.ALBUM || process.env.HOME + '/Downloads/gremory-cartas/album-set1.html')); await p.waitForTimeout(2500);
await p.screenshot({path:'full.png',fullPage:false});
const t=await p.locator('#tira').boundingBox(); if(t){await p.screenshot({path:'tira.png',fullPage:true,clip:{x:0,y:t.y,width:1200,height:Math.min(t.height,1400)}});}
console.log(JSON.stringify(errs), await p.locator('#cuenta').textContent().catch(()=>'-'));
await b.close();
