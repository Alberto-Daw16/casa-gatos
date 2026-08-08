#!/usr/bin/env node
/**
 * Rastreador de precios para Casa & Gatos.
 * Genera docs/precios.json a partir de:
 *   1. scripts/manual.json  -> precios metidos a mano (SIEMPRE ganan)
 *   2. scripts/productos.json -> páginas públicas de comparadores (best effort)
 *   3. docs/precios.json anterior -> lo que no se haya podido refrescar se conserva
 *
 * Sin dependencias. Node 20+ (fetch nativo).
 *
 * Uso:
 *   node scripts/scrape.mjs            # rastrea y escribe docs/precios.json
 *   node scripts/scrape.mjs --dry      # no escribe, solo enseña lo que sacaría
 *   node scripts/scrape.mjs --debug    # además vuelca el HTML de la 1ª página a /tmp
 *   node scripts/scrape.mjs --solo-manual   # ni toca la red: solo manual + anterior
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "docs", "precios.json");
const ARGS = new Set(process.argv.slice(2));
const DRY = ARGS.has("--dry");
const DEBUG = ARGS.has("--debug");
const SOLO_MANUAL = ARGS.has("--solo-manual");

const SHOPS = ["Mercadona", "Lidl", "Aldi", "Carrefour", "Alcampo", "Dia", "Consum", "Eroski", "Ahorramás"];
const UA = "Mozilla/5.0 (compatible; casa-gatos-precios/1.0; uso personal doméstico)";
const HOY = new Date().toISOString().slice(0, 10);

const log = (...a) => console.log(...a);

/* ---------- red ---------- */
async function get(url, intentos = 3) {
  for (let i = 1; i <= intentos; i++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 25000);
      const r = await fetch(url, {
        signal: ctrl.signal,
        headers: { "user-agent": UA, "accept-language": "es-ES,es;q=0.9" },
      });
      clearTimeout(t);
      if (!r.ok) throw new Error("HTTP " + r.status);
      return await r.text();
    } catch (e) {
      log("   intento " + i + "/" + intentos + " falló: " + e.message);
      if (i === intentos) return null;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
  return null;
}

/* ---------- utilidades ---------- */
const precioOk = (n) => typeof n === "number" && isFinite(n) && n > 0.05 && n < 500;
function aNumero(s) {
  if (typeof s === "number") return s;
  if (typeof s !== "string") return null;
  const m = s.replace(/\s/g, "").match(/(\d{1,3}(?:[.,]\d{1,2})?)/);
  if (!m) return null;
  const n = parseFloat(m[1].replace(",", "."));
  return isFinite(n) ? n : null;
}
const norm = (s) =>
  String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
function tiendaDe(txt) {
  const t = norm(txt);
  for (const s of SHOPS) if (t.includes(norm(s))) return s;
  return null;
}

/* ---------- estrategia 1: JSON-LD ---------- */
function deJsonLd(html) {
  const out = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    let data;
    try { data = JSON.parse(m[1].trim()); } catch { continue; }
    for (const nodo of [].concat(data)) recogeLd(nodo, out);
  }
  return out;
}
function recogeLd(n, out) {
  if (!n || typeof n !== "object") return;
  if (Array.isArray(n)) return n.forEach((x) => recogeLd(x, out));
  const ofertas = [].concat(n.offers || n.Offers || []);
  for (const o of ofertas) {
    if (!o || typeof o !== "object") continue;
    const p = aNumero(o.price ?? o.lowPrice ?? o.highPrice);
    const vendedor = o.seller?.name || o.offeredBy?.name || o.name || n.brand?.name || "";
    const shop = tiendaDe(vendedor) || tiendaDe(o.url || "") || tiendaDe(n.name || "");
    if (precioOk(p) && shop) out.push({ shop, price: p });
  }
  for (const k of Object.keys(n)) if (typeof n[k] === "object") recogeLd(n[k], out);
}

/* ---------- estrategia 2: JSON incrustado (__NEXT_DATA__, __NUXT__, etc.) ---------- */
function deJsonIncrustado(html) {
  const out = [];
  const bloques = [];
  const re = /<script[^>]*>([\s\S]{200,}?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    const s = m[1];
    const i = s.indexOf("{");
    if (i < 0) continue;
    if (!/(price|precio)/i.test(s)) continue;
    try { bloques.push(JSON.parse(s.slice(i))); } catch { /* trozo no parseable */ }
  }
  for (const b of bloques) buscaPrecios(b, out);
  return out;
}
function buscaPrecios(n, out, prof = 0) {
  if (!n || typeof n !== "object" || prof > 12) return;
  if (Array.isArray(n)) return n.forEach((x) => buscaPrecios(x, out, prof + 1));
  const claves = Object.keys(n);
  const kPrecio = claves.find((k) => /^(price|precio|current_?price|amount|unit_?price)$/i.test(k));
  if (kPrecio) {
    const p = aNumero(n[kPrecio]);
    let shop = null;
    for (const k of claves) {
      if (typeof n[k] === "string") { shop = tiendaDe(n[k]); if (shop) break; }
    }
    const oferta = claves.some((k) => /(discount|oferta|promo|sale|rebaj)/i.test(k) && n[k]);
    if (precioOk(p) && shop) out.push({ shop, price: p, offer: oferta ? p : null });
  }
  for (const k of claves) if (typeof n[k] === "object") buscaPrecios(n[k], out, prof + 1);
}

/* ---------- estrategia 3: texto plano ---------- */
function deTexto(html) {
  const txt = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
  const out = [];
  for (const shop of SHOPS) {
    const re = new RegExp(norm(shop).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[^0-9]{0,60}?(\\d{1,3}[.,]\\d{2})\\s*€", "gi");
    let m;
    while ((m = re.exec(norm(txt)))) {
      const p = aNumero(m[1]);
      if (precioOk(p)) out.push({ shop, price: p });
    }
  }
  return out;
}

/* ---------- por producto ---------- */
function consolida(cands) {
  const porTienda = new Map();
  for (const c of cands) {
    if (!porTienda.has(c.shop)) porTienda.set(c.shop, []);
    porTienda.get(c.shop).push(c);
  }
  const res = [];
  for (const [shop, lista] of porTienda) {
    const cuenta = new Map();
    for (const c of lista) cuenta.set(c.price, (cuenta.get(c.price) || 0) + 1);
    const mejor = [...cuenta.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];
    const oferta = lista.find((c) => c.offer);
    res.push({ shop, price: mejor[0], offer: oferta ? oferta.offer : null });
  }
  return res;
}

async function rastrea(prod) {
  log("\n· " + prod.prod);
  const html = await get(prod.url);
  if (!html) { log("   ✗ no he podido descargar la página"); return []; }
  if (DEBUG) {
    await fs.writeFile("/tmp/casa-gatos-debug.html", html);
    log("   (HTML volcado en /tmp/casa-gatos-debug.html)");
  }
  const estrategias = [
    ["json-ld", deJsonLd],
    ["json incrustado", deJsonIncrustado],
    ["texto", deTexto],
  ];
  for (const [nombre, fn] of estrategias) {
    let cands = [];
    try { cands = fn(html); } catch (e) { log("   " + nombre + ": error " + e.message); }
    if (cands.length) {
      const res = consolida(cands);
      log("   ✓ " + nombre + ": " + res.map((r) => r.shop + " " + r.price.toFixed(2)).join(", "));
      const enRango = res.filter((r) => (!prod.min || r.price >= prod.min) && (!prod.max || r.price <= prod.max));
      const fuera = res.length - enRango.length;
      if (fuera) log("   ⚠ descartados " + fuera + " precios fuera del rango " + prod.min + "-" + prod.max + " €: " +
        res.filter((r) => !enRango.includes(r)).map((r) => r.shop + " " + r.price).join(", "));
      if (!enRango.length) { log("   – " + nombre + ": todo fuera de rango"); continue; }
      return enRango.map((r) => ({ ...r, prod: prod.prod, unit: prod.unit, url: prod.url, fecha: HOY }));
    }
    log("   – " + nombre + ": nada");
  }
  log("   ✗ ninguna estrategia ha sacado precios (la web habrá cambiado)");
  return [];
}

/* ---------- principal ---------- */
const leerJson = async (p, def) => {
  try { return JSON.parse(await fs.readFile(p, "utf8")); } catch { return def; }
};

const productos = (await leerJson(path.join(ROOT, "scripts", "productos.json"), { productos: [] })).productos || [];
const manual = (await leerJson(path.join(ROOT, "scripts", "manual.json"), { items: [] })).items || [];
const anterior = await leerJson(OUT, { items: [] });

let rastreados = [];
if (!SOLO_MANUAL) {
  for (const p of productos) {
    rastreados = rastreados.concat(await rastrea(p));
    await new Promise((r) => setTimeout(r, 1200));
  }
} else log("Modo solo-manual: no toco la red.");

/* prioridad: manual > rastreado hoy > lo que ya había */
const clave = (i) => norm(i.prod) + "|" + i.shop;
const mapa = new Map();
for (const i of anterior.items || []) mapa.set(clave(i), { ...i, origen: "anterior" });
for (const i of rastreados) {
  const prev = mapa.get(clave(i));
  mapa.set(clave(i), {
    prod: i.prod, unit: i.unit || prev?.unit || "", shop: i.shop,
    price: i.price ?? prev?.price ?? null,
    offer: i.offer ?? null,
    fecha: HOY, url: i.url, origen: "rastreado",
  });
}
for (const i of manual) {
  const prev = mapa.get(clave(i));
  mapa.set(clave(i), {
    prod: i.prod, unit: i.unit || prev?.unit || "", shop: i.shop,
    price: i.price ?? null, offer: i.offer ?? null,
    fecha: i.fecha || HOY, url: i.url || prev?.url, origen: "manual",
  });
}

const items = [...mapa.values()]
  .filter((i) => precioOk(i.price) || precioOk(i.offer))
  .sort((a, b) => a.prod.localeCompare(b.prod) || a.shop.localeCompare(b.shop));

const salida = {
  fecha: HOY,
  generado: new Date().toISOString(),
  fuentes: [...new Set(items.map((i) => i.url).filter(Boolean))],
  items: items.map(({ origen, ...resto }) => resto),
};

const nuevos = items.filter((i) => i.origen === "rastreado").length;
log("\n─────────────────────────────");
log("Productos rastreados hoy : " + nuevos);
log("Precios a mano           : " + items.filter((i) => i.origen === "manual").length);
log("Conservados de antes     : " + items.filter((i) => i.origen === "anterior").length);
log("TOTAL en precios.json    : " + items.length);
if (nuevos === 0 && !SOLO_MANUAL) {
  log("\n⚠️  El rastreador no ha sacado nada nuevo. El fichero anterior se conserva intacto,");
  log("    así que la app sigue funcionando. Pásale este log a Claude y te ajusta el parser.");
}

if (DRY) { log("\n--dry: no escribo nada."); process.exit(0); }
await fs.writeFile(OUT, JSON.stringify(salida, null, 1) + "\n");
log("\n✓ escrito " + path.relative(ROOT, OUT));
