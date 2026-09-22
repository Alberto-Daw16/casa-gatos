#!/usr/bin/env node
/**
 * Catálogos completos de los súpers que dejan leerlos sin pelea.
 * Refresca docs/precios.json con:
 *   - Mercadona: todo su catálogo (API pública de tienda.mercadona.es)
 *   - Dia: búsqueda por términos genéricos + los productos que ya teníamos
 * Carrefour y Alcampo bloquean a los robots; de esos solo llega lo que saque
 * scrape.mjs vía RadarSuper. Lidl no tiene tienda online: RadarSuper también.
 *
 * Lo que un súper no devuelve hoy se conserva del fichero anterior (con su
 * fecha vieja, para que la app lo atenúe). Sin dependencias, Node 20+.
 *
 *   node scripts/catalogos.mjs          # escribe docs/precios.json
 *   node scripts/catalogos.mjs --dry    # solo cuenta
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "docs", "precios.json");
const DRY = process.argv.includes("--dry");
const HOY = new Date().toISOString().slice(0, 10);
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36";
const log = (...a) => console.log(...a);
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
const precioOk = (n) => typeof n === "number" && isFinite(n) && n > 0.05 && n < 500;

async function getJson(url, intentos = 3) {
  for (let i = 1; i <= intentos; i++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 25000);
      const r = await fetch(url, { signal: ctrl.signal, headers: { "user-agent": UA, "accept": "application/json", "accept-language": "es-ES,es;q=0.9" } });
      clearTimeout(t);
      if (r.status === 404) return null;
      if (!r.ok) throw new Error("HTTP " + r.status);
      return await r.json();
    } catch (e) {
      if (i === intentos) { log("   ✗ " + url.slice(0, 80) + " → " + e.message); return null; }
      await espera(1500 * i);
    }
  }
  return null;
}

/* ───────── Mercadona ───────── */
const M_EXCLUIR = /maquillaje|beb[eé]/i;   // categorías que no compran
function unidadMercadona(p) {
  const pi = p.price_instructions || {};
  const tam = pi.unit_size ? String(pi.unit_size).replace(".", ",") + " " + (pi.size_format || "") : "";
  return [p.packaging, tam].filter(Boolean).join(" ").trim();
}
async function mercadona() {
  log("\n▸ Mercadona");
  const raiz = await getJson("https://tienda.mercadona.es/api/categories/");
  if (!raiz || !raiz.results) { log("   ✗ sin categorías"); return []; }
  const subs = [];
  for (const c of raiz.results) {
    if (M_EXCLUIR.test(c.name)) continue;
    for (const s of c.categories || []) subs.push({ id: s.id, nombre: c.name + " › " + s.name });
  }
  log("   " + subs.length + " subcategorías");
  const out = [], vistos = new Set();
  for (const s of subs) {
    const d = await getJson("https://tienda.mercadona.es/api/categories/" + s.id + "/");
    await espera(150);
    if (!d) continue;
    for (const c of d.categories || []) for (const p of c.products || []) {
      const pi = p.price_instructions || {};
      const precio = +pi.unit_price;
      if (!precioOk(precio) || !p.display_name || vistos.has(p.id)) continue;
      vistos.add(p.id);
      out.push({
        prod: p.display_name, unit: unidadMercadona(p), shop: "Mercadona", price: precio,
        offer: pi.price_decreased && precioOk(+pi.previous_unit_price) && +pi.previous_unit_price > precio ? precio : null,
        fecha: HOY,
      });
    }
  }
  const veces = {};
  for (const i of out) veces[norm(i.prod)] = (veces[norm(i.prod)] || 0) + 1;
  for (const i of out) if (veces[norm(i.prod)] > 1 && i.unit) i.prod = i.prod + " (" + i.unit + ")";
  log("   ✓ " + out.length + " productos");
  return out;
}

/* ───────── Dia ───────── */
const DIA_TERMINOS = ["leche", "huevos", "pollo", "pavo", "cerdo", "ternera", "carne picada", "pescado", "salmon", "merluza", "atun",
  "arroz", "pasta", "macarrones", "espaguetis", "pan", "pan de molde", "harina", "aceite de oliva", "aceite de girasol", "tomate frito",
  "legumbres", "garbanzos", "lentejas", "alubias", "patatas", "cebolla", "tomate", "pepino", "lechuga", "pimiento", "calabacin", "zanahoria",
  "manzana", "platano", "naranja", "fresas", "aguacate", "queso", "jamon", "chorizo", "yogur", "mantequilla", "cafe", "azucar", "galletas",
  "cereales", "chocolate", "zumo", "agua", "cerveza", "papel higienico", "detergente", "lavavajillas", "limpiador", "gato", "arena gatos",
  "comida gatos", "champu", "gel", "pasta de dientes", "bolsas basura", "congelados", "pizza", "helado", "verdura congelada"];
async function dia(anteriores) {
  log("\n▸ Dia");
  const consultas = new Set(DIA_TERMINOS);
  const mapa = new Map();
  let fallos = 0;
  async function busca(q) {
    const d = await getJson("https://www.dia.es/api/v1/search-back/search/reduced?q=" + encodeURIComponent(q) + "&page=1");
    await espera(250);
    if (!d || !Array.isArray(d.search_items)) { fallos++; return; }
    for (const p of d.search_items) {
      const pr = p.prices || {}, precio = +pr.price;
      if (!precioOk(precio) || !p.display_name) continue;
      const tachado = +pr.strikethrough_price;
      mapa.set(norm(p.display_name), {
        prod: p.display_name, unit: pr.price_per_unit && pr.measure_unit ? String(pr.price_per_unit).replace(".", ",") + " €/" + String(pr.measure_unit).toLowerCase() : "",
        shop: "Dia", price: precio, offer: (pr.is_promo_price || (tachado > precio + 0.005)) ? precio : null,
        fecha: HOY,
      });
    }
  }
  for (const q of consultas) { await busca(q); if (fallos > 5) break; }
  /* lo que ya teníamos de Dia y no ha salido: se busca por su nombre */
  const faltan = anteriores.filter((i) => i.shop === "Dia" && !mapa.has(norm(i.prod)) && !i.url?.includes("radarsuper"));
  log("   " + mapa.size + " por términos · " + faltan.length + " antiguos que busco por nombre");
  for (const i of faltan.slice(0, 200)) {
    if (fallos > 8) break;
    await busca(i.prod.split(" ").slice(0, 4).join(" "));
  }
  const out = [...mapa.values()];
  log("   ✓ " + out.length + " productos" + (fallos ? " (" + fallos + " búsquedas fallidas)" : ""));
  return out;
}

/* ───────── principal ───────── */
const leerJson = async (p, def) => { try { return JSON.parse(await fs.readFile(p, "utf8")); } catch { return def; } };
const anterior = await leerJson(OUT, { items: [] });
const antItems = anterior.items || [];

const nuevos = [].concat(await mercadona(), await dia(antItems));
const porShop = {};
for (const i of nuevos) porShop[i.shop] = (porShop[i.shop] || 0) + 1;

/* un súper que hoy ha respondido bien sustituye su catálogo entero; si ha
   fallado (0 o muy pocos), se conserva lo que había de ese súper */
const clave = (i) => norm(i.prod) + "|" + i.shop;
const mapa = new Map();
const refrescados = new Set(Object.keys(porShop).filter((s) => porShop[s] >= 50));
for (const i of antItems) {
  if (refrescados.has(i.shop) && !(i.url || "").includes("radarsuper")) continue;   // se sustituye por lo de hoy
  mapa.set(clave(i), i);
}
for (const i of nuevos) mapa.set(clave(i), i);

const items = [...mapa.values()]
  .filter((i) => precioOk(i.price) || precioOk(i.offer))
  .sort((a, b) => a.prod.localeCompare(b.prod, "es") || a.shop.localeCompare(b.shop, "es"));

const cuenta = {};
for (const i of items) cuenta[i.shop] = (cuenta[i.shop] || 0) + 1;
log("\n─────────────────────────────");
log("Refrescados hoy: " + [...refrescados].join(", ") || "ninguno");
log("Total: " + items.length + "  " + JSON.stringify(cuenta));
if (DRY) { log("--dry: no escribo."); process.exit(0); }
const salida = { fecha: HOY, generado: new Date().toISOString(), fuentes: ["https://tienda.mercadona.es", "https://www.dia.es", "https://radarsuper.com"], items };
await fs.writeFile(OUT, JSON.stringify(salida) + "\n");
log("✓ escrito " + path.relative(ROOT, OUT) + " (" + Math.round((await fs.stat(OUT)).size / 1024) + " KB)");
