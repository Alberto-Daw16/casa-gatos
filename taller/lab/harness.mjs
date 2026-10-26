// Arnés: sirve docs/ en local, falsea el Worker (imágenes desde lab/img) y abre el TCG.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path';
const DOCS = process.env.DOCS || '/home/claude/casa-gatos/docs';
const IMG = '/home/claude/lab/img', OUT = '/home/claude/lab/shots';
const W = +(process.env.W||390), H = +(process.env.H||844);
const estado = process.env.ESTADO ? JSON.parse(fs.readFileSync(process.env.ESTADO, "utf8")) : {people:[{id:"p1",name:"Alberto"},{id:"p2",name:"Cristina"}], yo:"p1", syncUrl:"https://worker.test/?k=x", syncPass:"",
  cats:[{id:"c1",name:"Kurama"}], months:{}, care:{}, goals:{}};
const b = await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const pg = await b.newPage({viewport:{width:W,height:H}, deviceScaleFactor:+(process.env.DPR||2), hasTouch:!!process.env.MOBILE, isMobile:!!process.env.MOBILE, userAgent: process.env.MOBILE ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' : undefined});
const logs = []; pg.on('console', m => logs.push(m.type()+': '+m.text())); pg.on('pageerror', e => logs.push('ERR: '+e.message));
await pg.route('https://worker.test/**', r => {
  const u = new URL(r.request().url());
  if(u.pathname.startsWith('/img/')){ const f = path.join(IMG, decodeURIComponent(u.pathname.slice(5)));
    if(fs.existsSync(f)) return r.fulfill({status:200, headers:{'content-type':'image/webp','access-control-allow-origin':'*'}, body:fs.readFileSync(f)});
    return r.fulfill({status:404, headers:{'access-control-allow-origin':'*'}, body:''}); }
  return r.fulfill({status:404, headers:{'content-type':'application/json','access-control-allow-origin':'*'}, body:'{}'});
});
await pg.route('http://localhost:8123/**', r => {
  const u = new URL(r.request().url()); let f = path.join(DOCS, u.pathname === '/' ? 'index.html' : u.pathname);
  if(!fs.existsSync(f)) return r.fulfill({status:404, body:''});
  const ct = f.endsWith('.js') ? 'text/javascript' : f.endsWith('.css') ? 'text/css' : f.endsWith('.html') ? 'text/html' : f.endsWith('.woff2') ? 'font/woff2' : 'application/octet-stream';
  r.fulfill({status:200, headers:{'content-type':ct}, body:fs.readFileSync(f)});
});
await pg.addInitScript(e => { if(!sessionStorage.getItem('h')){ localStorage.setItem('casa-gatos-v1', JSON.stringify(e)); sessionStorage.setItem('h','1'); } }, estado);
await pg.goto('http://localhost:8123/index.html#tcg');
await pg.waitForTimeout(1500);
export { pg, b, logs, OUT, W, H };
export const shot = async n => { await pg.screenshot({path: OUT+'/'+n+'.png', timeout: 90000}); };
