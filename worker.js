/* Gremory · Worker de Cloudflare
   ─────────────────────────────────────────────────────────────────────────
   Hace dos cosas:
     1) Sincronizar: guarda el bloque (cifrado en el móvil) y lo devuelve.
        Cualquier ruta que no sea de las de abajo se trata como sincronización,
        así la URL que ya tenéis puesta en Ajustes sigue valiendo tal cual.
     2) Avisos (notificaciones push):
        GET  /vapid?k=…        → la clave pública para que el móvil se apunte
        POST /sub?k=…          → {pid, sub} el móvil se apunta (o {pid, sub:null} se borra)
        PUT  /cola?k=…         → {avisos:[{id, cuando, para, titulo, cuerpo}]} la cola programada
        POST /avisa?k=…        → {de, titulo, cuerpo} aviso inmediato al otro
        cron (cada 15 min)     → manda los avisos de la cola cuyo momento ha llegado
   Todo va con ?k=vuestra-clave. Los datos se guardan en el KV que tenga
   enlazado el Worker, se llame como se llame el binding.
   ───────────────────────────────────────────────────────────────────────── */

const CONTACTO = "https://alberto-daw16.github.io/casa-gatos/"; // lo pide el estándar VAPID: quién manda
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,PUT,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
};

function kvDe(env){
  for (const v of Object.values(env)) if (v && typeof v.get === "function" && typeof v.put === "function") return v;
  throw new Error("El Worker no tiene ningún KV enlazado (Settings → Bindings → KV namespace)");
}
function json(o, status){ return new Response(JSON.stringify(o), {status: status||200, headers:{"content-type":"application/json", ...CORS}}); }
function claveOk(env, k){
  // Si defines el secreto CLAVE en el Worker se exige esa; si no, vale cualquier k no vacía
  // (los datos van cifrados en el móvil, la k solo separa "cajones").
  if (!k) return false;
  if (env.CLAVE) return k === env.CLAVE;
  return true;
}

export default {
  async fetch(req, env, ctx){
    if (req.method === "OPTIONS") return new Response(null, {headers: CORS});
    const url = new URL(req.url), k = url.searchParams.get("k") || "";
    if (!claveOk(env, k)) return json({error:"clave"}, 403);
    const kv = kvDe(env), ruta = url.pathname.replace(/\/+$/,"");
    try {
      if (ruta === "/vapid" && req.method === "GET"){
        const v = await vapid(kv); return json({pub: v.pub});
      }
      if (ruta === "/sub" && req.method === "POST"){
        const b = await req.json();
        if (!b.pid) return json({error:"pid"}, 400);
        if (b.sub && b.sub.endpoint) await kv.put(`sub:${k}:${b.pid}`, JSON.stringify(b.sub));
        else await kv.delete(`sub:${k}:${b.pid}`);
        return json({ok:true});
      }
      if (ruta === "/cola" && req.method === "PUT"){
        const b = await req.json();
        const avisos = Array.isArray(b.avisos) ? b.avisos.slice(0, 200) : [];
        await kv.put(`cola:${k}`, JSON.stringify(avisos));
        return json({ok:true, n: avisos.length});
      }
      if (ruta === "/avisa" && req.method === "POST"){
        const b = await req.json();
        // un aviso con etiqueta (un logro) solo sale una vez aunque lo manden los dos móviles
        if (b.tag){
          const hechos = JSON.parse((await kv.get(`hechos:${k}`)) || "{}");
          if (hechos[b.tag]) return json({ok:true, enviados:0, repetido:true});
          hechos[b.tag] = Date.now();
          await kv.put(`hechos:${k}`, JSON.stringify(hechos));
        }
        const res = await manda(kv, k, {para: b.para || "todos", titulo: b.titulo, cuerpo: b.cuerpo, tag: b.tag}, b.de || null);
        return json({ok:true, enviados: res});
      }
      if (ruta === "/prueba" && req.method === "POST"){
        const b = await req.json();
        const res = await manda(kv, k, {para: b.pid || "todos", titulo:"Gremory", cuerpo:"Los avisos funcionan en este móvil", tag:"prueba"}, null);
        return json({ok:true, enviados: res});
      }
      // ── sincronización (la ruta de siempre) ──
      const clave = `datos:${k}`;
      if (req.method === "GET"){
        const v = await kv.get(clave);
        return new Response(v || '{"vacio":true}', {headers:{"content-type":"application/json", ...CORS}});
      }
      if (req.method === "PUT"){
        const cuerpo = await req.text();
        if (cuerpo.length > 20 * 1024 * 1024) return json({error:"demasiado grande"}, 413);
        await kv.put(clave, cuerpo);
        return json({ok:true});
      }
      return json({error:"ruta"}, 404);
    } catch (e){
      return json({error: String(e && e.message || e)}, 500);
    }
  },

  // el cron: Settings → Triggers → Cron Triggers → "*/15 * * * *"
  async scheduled(ev, env, ctx){
    const kv = kvDe(env);
    const lista = await kv.list({prefix:"cola:"});
    for (const {name} of lista.keys){
      const k = name.slice(5);
      ctx.waitUntil(despacha(kv, k));
    }
  }
};

/* manda los avisos de la cola que ya tocan; los ya mandados no se repiten
   aunque el móvil vuelva a subir la cola con el mismo id */
async function despacha(kv, k){
  const cola = JSON.parse((await kv.get(`cola:${k}`)) || "[]");
  const hechos = JSON.parse((await kv.get(`hechos:${k}`)) || "{}");
  const ahora = Date.now();
  let cambio = false;
  const quedan = [];
  for (const a of cola){
    const t = Date.parse(a.cuando || "");
    if (!t || t > ahora){ quedan.push(a); continue; }
    if (ahora - t > 2 * 86400e3){ cambio = true; continue; }      // rancio: fuera sin mandar
    if (!hechos[a.id]){
      await manda(kv, k, a, null);
      hechos[a.id] = ahora;
    }
    cambio = true;
  }
  if (cambio){
    for (const id of Object.keys(hechos)) if (ahora - hechos[id] > 40 * 86400e3) delete hechos[id];
    await kv.put(`cola:${k}`, JSON.stringify(quedan));
    await kv.put(`hechos:${k}`, JSON.stringify(hechos));
  }
}

/* manda un aviso a quien toque: a.para = "todos" | pid | [pid…]; menosPid no lo recibe */
async function manda(kv, k, a, menosPid){
  const subs = await kv.list({prefix:`sub:${k}:`});
  let n = 0;
  for (const {name} of subs.keys){
    const pid = name.slice(`sub:${k}:`.length);
    if (menosPid && pid === menosPid) continue;
    const para = a.para || "todos";
    if (para !== "todos" && para !== pid && !(Array.isArray(para) && para.includes(pid))) continue;
    const sub = JSON.parse((await kv.get(name)) || "null");
    if (!sub || !sub.endpoint) continue;
    try {
      const r = await push(kv, sub, {titulo: a.titulo || "Gremory", cuerpo: a.cuerpo || "", tag: a.tag || a.id || "", url: a.url || ""});
      if (r === 404 || r === 410) await kv.delete(name);   // ese móvil ya no existe
      else if (r < 300) n++;
    } catch (e) { /* un móvil caído no debe parar al otro */ }
  }
  return n;
}

/* ═══════════ Web Push: VAPID (RFC 8292) + cifrado aes128gcm (RFC 8291/8188) ═══════════ */
const enc = new TextEncoder();
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const deb64u = (s) => { s = s.replace(/-/g,"+").replace(/_/g,"/"); while (s.length % 4) s += "="; return Uint8Array.from(atob(s), c => c.charCodeAt(0)); };
function cat(...arrs){ const n = arrs.reduce((a,b)=>a+b.byteLength,0), out = new Uint8Array(n); let o = 0; for (const a of arrs){ out.set(new Uint8Array(a), o); o += a.byteLength; } return out; }

/* las claves VAPID se crean solas la primera vez y se quedan en el KV */
async function vapid(kv){
  const g = await kv.get("vapid");
  if (g) return JSON.parse(g);
  const par = await crypto.subtle.generateKey({name:"ECDSA", namedCurve:"P-256"}, true, ["sign","verify"]);
  const v = {
    priv: await crypto.subtle.exportKey("jwk", par.privateKey),
    pub: b64u(await crypto.subtle.exportKey("raw", par.publicKey)),
  };
  await kv.put("vapid", JSON.stringify(v));
  return v;
}
async function tokenVapid(kv, endpoint){
  const v = await vapid(kv);
  const key = await crypto.subtle.importKey("jwk", v.priv, {name:"ECDSA", namedCurve:"P-256"}, false, ["sign"]);
  const cab = b64u(enc.encode(JSON.stringify({typ:"JWT", alg:"ES256"})));
  const aud = new URL(endpoint).origin;
  const cuerpo = b64u(enc.encode(JSON.stringify({aud, exp: Math.floor(Date.now()/1000) + 12*3600, sub: CONTACTO})));
  const firma = await crypto.subtle.sign({name:"ECDSA", hash:"SHA-256"}, key, enc.encode(cab + "." + cuerpo));
  return {t: cab + "." + cuerpo + "." + b64u(firma), k: v.pub};
}
async function hkdf(salt, ikm, info, bits){
  const key = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return crypto.subtle.deriveBits({name:"HKDF", hash:"SHA-256", salt, info}, key, bits);
}
async function cifraPush(sub, texto){
  const uaPub = deb64u(sub.keys.p256dh), auth = deb64u(sub.keys.auth);
  const as = await crypto.subtle.generateKey({name:"ECDH", namedCurve:"P-256"}, true, ["deriveBits"]);
  const asPub = new Uint8Array(await crypto.subtle.exportKey("raw", as.publicKey));
  const uaKey = await crypto.subtle.importKey("raw", uaPub, {name:"ECDH", namedCurve:"P-256"}, false, []);
  const secreto = await crypto.subtle.deriveBits({name:"ECDH", public: uaKey}, as.privateKey, 256);
  const ikm = await hkdf(auth, secreto, cat(enc.encode("WebPush: info\0"), uaPub, asPub), 256);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, enc.encode("Content-Encoding: aes128gcm\0"), 128);
  const nonce = await hkdf(salt, ikm, enc.encode("Content-Encoding: nonce\0"), 96);
  const aes = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const claro = cat(enc.encode(texto), new Uint8Array([2]));           // 0x02: último registro
  const cifrado = await crypto.subtle.encrypt({name:"AES-GCM", iv: nonce}, aes, claro);
  const rs = new Uint8Array([0, 0, 16, 0]);                              // tamaño de registro 4096
  return cat(salt, rs, new Uint8Array([asPub.length]), asPub, cifrado);
}
async function push(kv, sub, datos){
  const cuerpo = await cifraPush(sub, JSON.stringify(datos));
  const v = await tokenVapid(kv, sub.endpoint);
  const r = await fetch(sub.endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/octet-stream",
      "content-encoding": "aes128gcm",
      "ttl": "86400",
      "urgency": "normal",
      "authorization": `vapid t=${v.t}, k=${v.k}`,
    },
    body: cuerpo,
  });
  return r.status;
}
