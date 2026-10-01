/* Gremory · Cartas: parte diario del mercado (30 aniversario)
   ─────────────────────────────────────────────────────────────────────────
   Lo usa la tarea programada de cada mañana. Baja la guía oficial de
   Cardmarket (pública, una vez al día), la compara con el histórico de los
   días anteriores y deja dos ficheros:
     OUT/hist.json     histórico actualizado (se publica junto a la página)
     OUT/resumen.json  lo que ha cambiado, listo para escribir el parte
   Uso:  PREV=hist.json OUT=salida node parte-diario.mjs   (lo lanza cartas.yml; FORZAR=1 rehace el día)
   No necesita claves: todo son ficheros públicos.
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const S3 = "https://downloads.s3.cardmarket.com/productCatalog";
const GUIA = S3 + "/priceGuide/price_guide_6.json";
const SUELTAS = S3 + "/productList/products_singles_6.json";
const SELLADO = S3 + "/productList/products_nonsingles_6.json";
const RAW = "https://raw.githubusercontent.com/Alberto-Daw16/casa-gatos/main/scripts/";
const IDIOMA = {6601: "EN", 6602: "JP"};
const SELLADO_EXP = {6601: "EN", 6602: "JP", 6767: "EN", 6628: "EN"};
const DIAS = 60;                       // días de histórico que se guardan
/* las cartas que el estudio dejó para vigilar */
const VIGILAR = [907739, 907740, 907741, 907738, 907753, 907966, 907950, 907956, 907947, 907957, 907871];
/* una cosa para aprender cada día, en este orden (luego vuelve a empezar) */
const LECCIONES = [
  "Cómo leer la ficha de Cardmarket: desde, tendencia y medias de 1, 7 y 30 días",
  "Los estados de una carta en Cardmarket (Mint, Near Mint, Excellent...) y cuánto cambian el precio",
  "Cuánto se queda cada plataforma: Cardmarket, eBay, Wallapop y Vinted",
  "Envíos en Cardmarket: carta normal, certificado y seguimiento, y cuándo compensa cada uno",
  "Cómo detectar una carta falsa",
  "Qué es gradear (PSA, CGC, BGS), cuánto cuesta y cuándo compensa",
  "Cómo ganar reputación como vendedor nuevo en Cardmarket",
  "Fundas, toploaders y cómo mandar una carta para que llegue perfecta",
  "Por qué las colecciones nuevas bajan las primeras semanas",
  "Probabilidades de los sobres y por qué casi siempre sale más barato comprar la carta suelta",
  "Precio oficial de tienda del sellado y dónde se consigue a ese precio en España",
  "Qué es el sellado a largo plazo y qué riesgos tiene",
  "Idiomas: por qué una carta vale distinto en inglés, japonés o chino",
  "Liquidez: cómo saber si una carta se vende o se queda parada",
  "Cómo calcular el beneficio real de una venta",
  "Lotes: cómo vender cartas baratas sin perder dinero",
  "Reimpresiones y reediciones: cómo afectan al precio",
  "Qué mirar en las fotos de un anuncio antes de comprar",
  "Qué hacer si una compra llega mal o no llega",
  "Temporadas: cuándo se vende más y cuándo menos",
  "Cómo poner precio a una carta para que se venda rápido",
  "El mercado japonés: cómo se compra desde España y qué cuesta traerlo",
  "Qué son las SIR, IR, Classic Collection y Futuristic y por qué valen distinto",
  "Impuestos y papeles cuando la compraventa crece: lo básico que conviene saber",
];

const r2 = n => n == null ? null : Math.round(n * 100) / 100;
async function jget(url){ const r = await fetch(url, {cache: "no-store"}); if(!r.ok) throw new Error(url + " → HTTP " + r.status); return r.json(); }
const med = a => { const b = a.filter(x => x != null && isFinite(x)).sort((x, y) => x - y); return b.length ? b[Math.floor(b.length / 2)] : null; };
const pct = (a, b) => a != null && b ? r2((a / b - 1) * 100) : null;

const OUT = process.env.OUT || "salida";
mkdirSync(OUT, {recursive: true});
const prev = process.env.PREV && existsSync(process.env.PREV) ? JSON.parse(readFileSync(process.env.PREV, "utf8")) : {dias: [], lecciones: 0};

const [guia, sueltas, sellado, fichas] = await Promise.all([jget(GUIA), jget(SUELTAS), jget(SELLADO), jget(RAW + "cm-fichas30.json")]);
const fecha = (guia.createdAt || new Date().toISOString()).slice(0, 10);
const G = new Map(guia.priceGuides.map(g => [g.idProduct, g]));

/* catálogo: cartas EN y JP del 30 aniversario y sellado */
const cartas = {}, sel = {};
for(const p of sueltas.products){
  if(!IDIOMA[p.idExpansion]) continue;
  const f = fichas[p.idProduct];
  cartas[p.idProduct] = {n: p.name.split(" [")[0], num: f ? f[0] : "", l: IDIOMA[p.idExpansion]};
}
for(const p of sellado.products){
  if(!SELLADO_EXP[p.idExpansion]) continue;
  sel[p.idProduct] = {n: p.name, l: SELLADO_EXP[p.idExpansion], tipo: (p.categoryName || "").replace(/^Pokémon\s*/, "")};
}

/* foto del día: cartas de 1 € o más (el resto es morralla) + vigiladas, y todo el sellado */
const hoy = {f: fecha, c: {}, s: {}};
for(const id in cartas){
  const g = G.get(+id); if(!g) continue;
  if((g.trend ?? 0) < 1 && !VIGILAR.includes(+id)) continue;
  hoy.c[id] = [r2(g.low), r2(g.trend), r2(g.avg1)];
}
for(const id in sel){
  const g = G.get(+id); if(!g) continue;
  hoy.s[id] = [r2(g.low), r2(g.trend)];
}

const nuevo = !(prev.dias || []).some(d => d.f === fecha);
if(!nuevo && process.env.FORZAR !== "1"){ console.log(`guía del ${fecha} YA VISTA: no hay guía nueva, no se toca nada`); process.exit(0); }
const dias = (prev.dias || []).filter(d => d.f < fecha);
const ayer = dias[dias.length - 1] || null;
dias.push(hoy);
while(dias.length > DIAS) dias.shift();

/* termómetro del mercado, por idioma */
const mercado = {};
for(const l of ["EN", "JP"]){
  const ids = Object.keys(cartas).filter(id => cartas[id].l === l);
  const gs = ids.map(id => G.get(+id)).filter(Boolean);
  const vivas = gs.filter(g => (g.trend ?? 0) >= 1);
  mercado[l] = {
    cartas: ids.length,
    vendidasAyer: gs.filter(g => g.avg1 != null).length,
    ayerContraSemana: r2(med(vivas.map(g => g.avg1 != null && g.avg7 ? g.avg1 / g.avg7 : null))),
    semanaContraMes: r2(med(vivas.map(g => g.avg7 != null && g.avg30 ? g.avg7 / g.avg30 : null))),
    tendenciaContraAyer: ayer ? r2(med(Object.keys(hoy.c).filter(id => cartas[id].l === l && ayer.c[id]).map(id => hoy.c[id][1] / ayer.c[id][1]))) : null,
  };
}

const ficha = id => { const c = cartas[id], g = G.get(+id) || {};
  return {id: +id, nombre: c.n, num: c.num, idioma: c.l, desde: r2(g.low), normal: r2(g.trend), ayer: r2(g.avg1), semana: r2(g.avg7), mes: r2(g.avg30)}; };

/* las que más se han movido desde el último día (solo cartas de 3 € o más) */
let suben = [], bajan = [];
if(ayer){
  const mov = Object.keys(hoy.c).filter(id => ayer.c[id] && hoy.c[id][1] >= 3 && ayer.c[id][1])
    .map(id => ({...ficha(id), antes: ayer.c[id][1], cambio: pct(hoy.c[id][1], ayer.c[id][1])}))
    .filter(x => Math.abs(x.cambio) >= 5);
  suben = mov.filter(x => x.cambio > 0).sort((a, b) => b.cambio - a.cambio).slice(0, 8);
  bajan = mov.filter(x => x.cambio < 0).sort((a, b) => a.cambio - b.cambio).slice(0, 8);
}

/* vigiladas: serie de los últimos días y cómo van */
const vigiladas = VIGILAR.filter(id => cartas[id]).map(id => {
  const serie = dias.map(d => d.c[id] ? [d.f, d.c[id][1]] : null).filter(Boolean).slice(-7);
  const ref = serie.length >= 4 ? serie[serie.length - 4][1] : serie.length ? serie[0][1] : null;
  const ahora = serie.length ? serie[serie.length - 1][1] : null;
  const c = pct(ahora, ref);
  const estado = serie.length < 2 ? "sin histórico todavía" : c <= -3 ? "sigue bajando" : c >= 3 ? "sube" : "se está parando";
  return {...ficha(id), serie, cambioTresDias: c, estado};
});

/* nuevos mínimos del histórico (cartas de 3 € o más) */
const minimos = dias.length < 3 ? [] : Object.keys(hoy.c).filter(id => hoy.c[id][1] >= 3).filter(id => {
  const antes = dias.slice(0, -1).map(d => d.c[id] && d.c[id][1]).filter(x => x != null);
  return antes.length >= 2 && hoy.c[id][1] < Math.min(...antes);
}).map(ficha).slice(0, 12);

/* sellado */
const selladoHoy = Object.keys(hoy.s).map(id => {
  const [desde, normal] = hoy.s[id];
  const a = ayer && ayer.s[id];
  return {id: +id, nombre: sel[id].n, idioma: sel[id].l, tipo: sel[id].tipo, desde, normal,
    desdeAntes: a ? a[0] : null, normalAntes: a ? a[1] : null, cambioNormal: a ? pct(normal, a[1]) : null};
}).filter(x => x.normal != null || x.desde != null);
const selladoMovido = selladoHoy.filter(x => x.cambioNormal != null && Math.abs(x.cambioNormal) >= 5);

const nLec = (prev.lecciones || 0) + (nuevo ? 1 : 0);
const resumen = {
  fecha, ultimoDia: ayer ? ayer.f : null, guiaNueva: nuevo, diasDeHistorico: dias.length,
  mercado, suben, bajan, vigiladas, minimos, sellado: selladoHoy, selladoMovido,
  leccionDeHoy: LECCIONES[(nLec - 1 + LECCIONES.length) % LECCIONES.length], leccionNumero: nLec,
};
writeFileSync(OUT + "/hist.json", JSON.stringify({v: 1, lecciones: nLec, dias}));
writeFileSync(OUT + "/resumen.json", JSON.stringify(resumen, null, 1));
console.log(`guía del ${fecha} · ${nuevo ? "nueva" : "YA VISTA (la guía de hoy aún no ha salido)"} · ${dias.length} días · ${Object.keys(hoy.c).length} cartas · ${Object.keys(hoy.s).length} sellados`);
