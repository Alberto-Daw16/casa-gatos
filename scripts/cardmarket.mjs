/* Gremory · Cartas: precios de Cardmarket
   ─────────────────────────────────────────────────────────────────────────
   Lo lanza GitHub Actions cada hora. Cardmarket publica su guía de precios
   (gratis y oficial) una vez al día; aquí se comprueba si hay guía nueva y,
   si la hay:
     1) monta un índice compacto de todas las cartas sueltas de Pokémon con
        precio (más barato ahora, tendencia y medias de 1, 7 y 30 días),
     2) añade el día al histórico de las cartas que seguimos,
     3) calcula el radar (chollos, las que suben y las que bajan),
     4) lo guarda todo en vuestro Worker, en privado (no en el repo público),
     5) y avisa al móvil si alguna vigilada baja de vuestro precio objetivo.
   Un solo secreto en el repo (Settings → Secrets and variables → Actions):
     GREMORY_SYNC  la URL de sincronización tal cual sale en Ajustes de la app
                   (https://….workers.dev/?k=vuestra-clave)
   ───────────────────────────────────────────────────────────────────────── */
import { gzipSync, gunzipSync } from "node:zlib";
import { readFileSync, existsSync } from "node:fs";

const GUIA = "https://downloads.s3.cardmarket.com/productCatalog/priceGuide/price_guide_6.json";
const CATALOGO = "https://downloads.s3.cardmarket.com/productCatalog/productList/products_singles_6.json";
let BASE = (process.env.GREMORY_URL || "").replace(/\/+$/, "");
let K = process.env.GREMORY_K || "";
const UP = process.env.GREMORY_UP || "";
if(process.env.GREMORY_SYNC){
  try { const u = new URL(process.env.GREMORY_SYNC.trim()); BASE = u.origin; K = u.searchParams.get("k") || K; }
  catch(e){ console.error("GREMORY_SYNC no es una URL válida"); }
}
const FORZAR = process.env.FORZAR === "1";
const LOCAL = process.env.LOCAL || "";          // pruebas: carpeta con los json ya bajados, no sube nada
const EXPANSIONES = JSON.parse(readFileSync(new URL("./cm-expansiones.json", import.meta.url), "utf8"));
/* colecciones que se siguen enteras en el histórico (30 aniversario en todos sus idiomas) */
const SEGUIDAS = new Set([6601, 6602, 6603, 6604, 6767, 6628]);
const DIAS_HIST = 400;

const w = (ruta, extra = "") => `${BASE}${ruta}?k=${encodeURIComponent(K)}${extra}`;
async function jget(url){ const r = await fetch(url, {cache: "no-store"}); if(!r.ok) throw new Error(`${url.split("?")[0]} → HTTP ${r.status}`); return r.json(); }
async function gzget(url){
  const r = await fetch(url, {cache: "no-store"});
  if(r.status === 404) return null;
  if(!r.ok) throw new Error(`${url.split("?")[0]} → HTTP ${r.status}`);
  const b = Buffer.from(await r.arrayBuffer());
  try { return JSON.parse(gunzipSync(b).toString("utf8")); } catch(e){ return JSON.parse(b.toString("utf8")); }
}
async function sube(ruta, obj, meta){
  const cuerpo = gzipSync(Buffer.from(JSON.stringify(obj)), {level: 9});
  const url = `${BASE}${ruta}?` + (UP ? "up=" + encodeURIComponent(UP) : "k=" + encodeURIComponent(K)) + (meta ? "&meta=" + encodeURIComponent(JSON.stringify(meta)) : "");
  const r = await fetch(url, {method: "PUT", body: cuerpo, headers: {"content-type": "application/gzip"}});
  if(!r.ok) throw new Error(`subir ${ruta} → HTTP ${r.status} ${await r.text()}`);
  console.log(`subido ${ruta}: ${(cuerpo.length / 1024).toFixed(0)} KB`);
}
async function avisa(titulo, cuerpo, tag){
  const r = await fetch(w("/avisa"), {method: "POST", headers: {"content-type": "application/json"},
    body: JSON.stringify({de: "", para: "todos", titulo, cuerpo, tag})});
  console.log("aviso", tag, r.status);
}
const r2 = n => n == null ? null : Math.round(n * 100) / 100;
const hoy = () => new Date().toISOString().slice(0, 10);
const eur = n => n == null ? "—" : n.toLocaleString("es-ES", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " €";

async function main(){
  if(!LOCAL && (!BASE || !K)) throw new Error("Falta el secreto GREMORY_SYNC (la URL de sincronización de Ajustes)");

  /* 1) ¿hay guía nueva? */
  let lm = "";
  if(!LOCAL){
    const h = await fetch(GUIA, {method: "HEAD"});
    lm = h.headers.get("last-modified") || "";
    const meta = await jget(w("/cm/meta")).catch(() => ({}));
    if(!FORZAR && lm && meta.lm === lm){ console.log("La guía no ha cambiado desde", lm); return; }
  }
  console.log("Guía nueva:", lm || "(local)");

  /* 2) bajar guía y catálogo */
  const guia = LOCAL ? JSON.parse(readFileSync(LOCAL + "/price_guide_6.json", "utf8")) : await jget(GUIA);
  const cat = LOCAL ? JSON.parse(readFileSync(LOCAL + "/products_singles_6.json", "utf8")) : await jget(CATALOGO);
  const P = new Map(cat.products.map(p => [p.idProduct, p]));
  const vig = LOCAL ? [] : ((await jget(w("/cm/vigila")).catch(() => ({lista: []}))).lista || []);
  const vigIds = new Set(vig.map(v => +v.id));

  /* 3) índice compacto: [id, nombre, expansión, bajo, tendencia, media1, media7, media30, bajoFoil, tendenciaFoil] */
  const filas = [], usadas = {};
  for(const g of guia.priceGuides){
    const p = P.get(g.idProduct); if(!p) continue;
    const t = g.trend ?? g.avg30 ?? g.low ?? 0;
    const tf = g["trend-holo"] ?? 0;
    if(Math.max(t, tf) < 0.5 && !SEGUIDAS.has(p.idExpansion) && !vigIds.has(p.idProduct)) continue;
    filas.push([p.idProduct, p.name, p.idExpansion, r2(g.low), r2(g.trend), r2(g.avg1), r2(g.avg7), r2(g.avg30), r2(g["low-holo"]), r2(g["trend-holo"])]);
    usadas[p.idExpansion] = EXPANSIONES[p.idExpansion] || ("Expansión " + p.idExpansion);
  }

  /* 4) radar. Ojo: "más barato" en la guía es el anuncio más barato en cualquier idioma y estado
        (un japonés destrozado a 0,02 €), así que no sirve para cazar chollos. El radar mira las
        ventas: media de ayer (a1), de la semana (a7) y del mes (a30), solo en cartas que se venden. */
  const liquidas = filas.filter(f => f[4] >= 3 && f[5] != null && f[6] != null && f[7] != null);
  const chollos = liquidas.filter(f => f[7] >= 5 && f[5] <= 0.75 * f[7])            // ayer se vendió muy por debajo de su mes
    .sort((a, b) => a[5] / a[7] - b[5] / b[7]).slice(0, 60).map(f => f[0]);
  const suben = liquidas.filter(f => f[5] / f[6] >= 1.2 && f[6] / f[7] >= 1.05)
    .sort((a, b) => b[5] / b[6] - a[5] / a[6]).slice(0, 60).map(f => f[0]);
  const bajan = liquidas.filter(f => f[6] / f[7] <= 0.8)
    .sort((a, b) => a[6] / a[7] - b[6] / b[7]).slice(0, 60).map(f => f[0]);

  const creado = guia.createdAt || new Date().toISOString();
  const indice = {v: 1, creado, lm, exp: usadas, c: filas, radar: {chollos, suben, bajan}};
  console.log(`${filas.length} cartas, ${Object.keys(usadas).length} expansiones; chollos ${chollos.length}, suben ${suben.length}, bajan ${bajan.length}`);

  /* 5) histórico por trozos (id % 32), así la app baja solo el trozo de la carta que mira:
        30 aniversario entero + vigiladas + las 1.200 de más valor que se venden */
  const dia = (creado || hoy()).slice(0, 10);
  const seguir = new Set([...vigIds]);
  filas.forEach(f => { if(SEGUIDAS.has(f[2])) seguir.add(f[0]); });
  liquidas.slice().sort((a, b) => b[4] - a[4]).slice(0, 1200).forEach(f => seguir.add(f[0]));
  const porId = new Map(filas.map(f => [f[0], f]));
  const lim = new Date(Date.now() - DIAS_HIST * 864e5).toISOString().slice(0, 10);
  const TROZOS = 32, trozos = [];
  for(let t = 0; t < TROZOS; t++) trozos.push(LOCAL ? {} : ((await gzget(w("/cm/hist/" + t))) || {}));
  for(const id of seguir){
    const f = porId.get(id); if(!f) continue;
    const h = trozos[id % TROZOS];
    const l = (h[id] || []).filter(x => x[0] !== dia && x[0] >= lim);
    l.push([dia, f[3], f[4], f[5]]);                       // [día, más barato, tendencia, media del día]
    h[id] = l;
  }
  console.log(`histórico: ${seguir.size} cartas en ${TROZOS} trozos`);
  if(LOCAL){
    console.log(JSON.stringify(indice).length / 1e6, "MB sin comprimir");
    if(process.env.LOCAL_OUT){
      const {writeFileSync, mkdirSync} = await import("node:fs"); mkdirSync(process.env.LOCAL_OUT, {recursive: true});
      writeFileSync(process.env.LOCAL_OUT + "/indice.gz", gzipSync(Buffer.from(JSON.stringify(indice)), {level: 9}));
      trozos.forEach((t, i) => writeFileSync(process.env.LOCAL_OUT + "/hist" + i + ".gz", gzipSync(Buffer.from(JSON.stringify(t)))));
    }
    return;
  }
  await sube("/cm/indice", indice, {lm, creado, n: filas.length});
  for(let t = 0; t < TROZOS; t++) await sube("/cm/hist/" + t, trozos[t]);

  /* 6) avisos de las vigiladas */
  for(const v of vig){
    const f = porId.get(+v.id); if(!f) continue;
    const [id, nombre, , bajo, tend, a1, , a30] = f;
    const corto = nombre.split(" [")[0], exp = EXPANSIONES[f[2]] || "";
    const vendida = a1 ?? tend;
    if(v.obj && vendida != null && vendida <= +v.obj)
      await avisa("Carta a tiro: " + corto, `${exp}: ayer se vendió de media a ${eur(vendida)} en Cardmarket y vuestro objetivo es ${eur(+v.obj)}.`, `cm-obj-${id}-${dia}`);
    else if(a30 && a1 != null && a1 <= 0.75 * a30)
      await avisa("Bajón: " + corto, `${exp}: ayer se vendió a ${eur(a1)} y la media del mes es ${eur(a30)}.`, `cm-caida-${id}-${dia}`);
  }
}

main().then(r => { if(LOCAL && r){ globalThis.__r = r; } }).catch(e => { console.error(e); process.exit(1); });
