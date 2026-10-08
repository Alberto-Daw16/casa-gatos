/* Gremory TCG · motor de las cartas (generado por tcg_build.py: no editar a mano) */
(function(){
const IMG = {};
const ART = {};   /* ilustraciones nuevas por rareza (base / firma / gremory) */
/* rareza → nombre, símbolo */
const VERS = {
  R:  {n:"Holo",     s:"e1"},
  RH: {n:"Reverse",      s:"r1"},
  RR: {n:"Double Holo", s:"e2"},
  SR: {n:"Etched",      s:"g2"},
  OFR:{n:"Breakout",     s:"esc"},
  SP: {n:"Signed",      s:"firma"},
  HR: {n:"Gold",          s:"o3"},
  CR: {n:"Gremory",      s:"cor"},
  G1: {n:"Gremory · Obsidian", s:"cor"},
  G2: {n:"Gremory · Cosmic",   s:"cor"},
  G3: {n:"Gremory · Encantada", s:"cor"}
};
/* iconos de rareza en SVG (sin emojis ni símbolos de texto) */
const SVGI = (p, vb) => '<svg class="ico" viewBox="' + (vb || "0 0 24 24") + '" aria-hidden="true">' + p + '</svg>';
const ESTRELLA = '<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill="currentColor"/>';
const ESTRELLA_H = '<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>';
const ICONOS = {
  e1:  SVGI(ESTRELLA),
  r1:  SVGI(ESTRELLA_H),
  e2:  SVGI(ESTRELLA) + SVGI(ESTRELLA),
  g2:  SVGI(ESTRELLA_H) + SVGI(ESTRELLA_H),
  o3:  SVGI(ESTRELLA) + SVGI(ESTRELLA) + SVGI(ESTRELLA),
  esc: SVGI('<path d="M12 1.5l2.2 7.3 7.3 2.2-7.3 2.2L12 20.5l-2.2-7.3L2.5 11l7.3-2.2z" fill="currentColor"/>'),
  firma: SVGI('<path d="M3 17.5c2.5-1.2 3.6-5.6 5.2-5.6 1.4 0 .4 4.2 1.9 4.2 1.3 0 2.2-3.1 3.4-3.1 1 0 .8 2.4 1.9 2.4.9 0 1.7-1.3 2.6-1.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 20.5h18" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".6"/>'),
  huella: SVGI('<ellipse cx="50" cy="68" rx="24" ry="20"/><ellipse cx="21" cy="41" rx="10" ry="13" transform="rotate(-20 21 41)"/><ellipse cx="40" cy="23" rx="10" ry="13" transform="rotate(-8 40 23)"/><ellipse cx="61" cy="23" rx="10" ry="13" transform="rotate(8 61 23)"/><ellipse cx="80" cy="41" rx="10" ry="13" transform="rotate(20 80 41)"/>'.replace(/\/>/g, ' fill="currentColor"/>'), "0 0 100 100"),
  cor: SVGI('<path d="M12 1.8 L20.5 12 L12 22.2 L3.5 12Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 7 L16.2 12 L12 17 L7.8 12Z" fill="currentColor"/>')
};
const icono = (id, v) => (v === "SP" && !CARTAS[id].sello.some(s => s.t === "firma")) ? ICONOS.huella : ICONOS[VERS[v].s];
const nombreVer = (id, v) => (v === "SP" && !CARTAS[id].sello.some(s => s.t === "firma")) ? "Pawprint" : VERS[v].n;

/* cartas: tipo (para los efectos), hueco del dibujo, si tiene recorte, sellos */
const CARTAS = {
  "alberto":  {n:"Alberto",  tipo:"trainer", sub:"supporter", arte:[.0306,.1266,.9694,.8675], capas:true,
               sello:[{t:"firma", q:"alberto", x:.40, y:.62, s:52, rot:-9}]},
  "cristina": {n:"Cristina", tipo:"trainer", sub:"supporter", arte:[.0306,.1266,.9694,.8675], capas:true,
               sello:[{t:"firma", q:"cristina", x:.36, y:.62, s:52, rot:-9}]},
  "kurama-ex":{n:"Kurama NOVA", tipo:"pokémon", sub:"stage 2 ex", arte:[.02,.20,.98,.84], capas:false,
               sello:[{t:"huella", x:.07, y:.64, s:15, rot:-14}]},
  "gyukki-ex":{n:"Gyukki NOVA", tipo:"pokémon", sub:"stage 2 ex", arte:[.02,.20,.98,.84], capas:false,
               sello:[{t:"huella", x:.07, y:.64, s:15, rot:-14}]},
  "kurama-gyukki-vstar":{n:"Kurama & Gyukki BOND", tipo:"pokémon", sub:"vstar", arte:[.035,.095,.965,.585], capas:true,
               sello:[{t:"huella", x:.60, y:.42, s:11, rot:-16}, {t:"huella", x:.77, y:.37, s:11, rot:12}]},
  "love-vmax":{n:"Love of My Life ETERNAL", tipo:"pokémon", sub:"vmax", arte:[.035,.118,.965,.695], capas:true, sinfoto:true,
               sello:[{t:"firma", q:"alberto", x:.08, y:.53, s:40, rot:-10}, {t:"firma", q:"cristina", x:.5, y:.58, s:40, rot:-6}]}
};
const gordas = id => id === "kurama-gyukki-vstar" || id === "love-vmax";
/* ══ identidad propia del set: clases, elementos, formas, habilidades y ataques ══ */
const VEN = [.055,.112,.945,.585];          /* hueco del dibujo en el marco base propio */
const ELEM = {
  agua:    {n:"Agua",      c:"#3b82f6",
    /* gota con una ola dentro */
    p:'<path d="M12 2.6c3 4 6.6 7.9 6.6 11.7a6.6 6.6 0 0 1-13.2 0C5.4 10.5 9 6.6 12 2.6z"/><path d="M7.6 14.6c1.5-1.1 2.9-1.1 4.4 0s2.9 1.1 4.4 0" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1.4" stroke-linecap="round"/>',
    /* olas */
    pat:'<path d="M0 8q6-6 12 0t12 0 12 0M0 22q6-6 12 0t12 0 12 0" fill="none" stroke="C" stroke-width="1"/>', pw:36, ph:28},
  hada:    {n:"Hada",      c:"#ec4899",
    /* flor de cinco pétalos con brillo */
    p:'<path d="M12 3.2c1.6 0 2.6 1.6 2.4 3.6 1.7-1.1 3.6-.9 4.1.6s-.6 3-2.6 3.7c1.8.8 2.6 2.6 1.6 3.8s-3 .9-4.3-.6c-.1 2-1.2 3.5-2.8 3.4s-2.4-1.9-2-3.8c-1.5 1.4-3.4 1.6-4.2.4s.1-2.9 2-3.6c-2-.6-3.1-2.2-2.5-3.6s2.5-1.6 4.1-.4C9.5 4.7 10.4 3.2 12 3.2z"/><circle cx="12" cy="11.4" r="2.2" fill="rgba(0,0,0,.3)"/>',
    /* pétalos y destellos */
    pat:'<path d="M10 6c3 2 3 6 0 8-3-2-3-6 0-8z" fill="none" stroke="C" stroke-width="1"/><path d="M30 26l1.2 3 3 1.2-3 1.2L30 35l-1.2-3.6-3-1.2 3-1.2z" fill="none" stroke="C" stroke-width="1"/>', pw:40, ph:40},
  fuego:   {n:"Fuego",     c:"#f97316",
    p:'<path fill-rule="evenodd" d="M12 2.4c.9 3.3 5.3 5.5 5.3 10.8A5.3 5.3 0 0 1 6.7 13c0-2.6 1.3-4.2 2.6-5.4.2 1.9 1 3 2 3.6-.5-3.2 0-6 .7-8.8zM12 13.4c-1.4 1.2-2.1 2.3-2.1 3.5a2.1 2.1 0 0 0 4.2 0c0-1.2-.7-2.3-2.1-3.5z"/>',
    /* lenguas de fuego */
    pat:'<path d="M8 32c-5-5 3-8 0-14s3-9 0-14M24 32c-4-6 4-7 1-13s2-8-1-13" fill="none" stroke="C" stroke-width="1"/>', pw:32, ph:32},
  siniestro:{n:"Siniestro", c:"#b91c1c",
    /* luna creciente con una estrella */
    p:'<path d="M15.8 3.6A8.6 8.6 0 1 0 20.4 16 7 7 0 0 1 15.8 3.6z"/><path d="M17.6 6.4l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" fill="rgba(0,0,0,.35)"/>',
    /* lunas y espinas */
    pat:'<path d="M14 6a7 7 0 1 0 4 11 5.6 5.6 0 0 1-4-11z" fill="none" stroke="C" stroke-width="1"/><path d="M28 34l3-8 3 8M36 30l-8 0" fill="none" stroke="C" stroke-width="1"/>', pw:44, ph:40},
  psiquico:{n:"Psíquico",  c:"#8b5cf6",
    p:'<path d="M7 3.5h10l4 5.5-9 11.5L3 9z"/><path d="M3 9h18M9.5 3.5 12 20.5l2.5-17M7 3.5 9.5 9 12 3.5 14.5 9 17 3.5" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1"/>',
    /* facetas */
    pat:'<path d="M0 24L14 0h28l14 24-14 24H14z M14 0l14 24L14 48 M42 0L28 24l14 24 M0 24h56" fill="none" stroke="C" stroke-width="1"/>', pw:56, ph:48},
  dragon:  {n:"Dragón",    c:"#c9a227",
    /* dos anillos entrelazados: la mezcla */
    p:'<circle cx="9" cy="12" r="5.2" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="15" cy="12" r="5.2" fill="none" stroke="#fff" stroke-width="2.4"/>',
    /* anillos entrelazados */
    pat:'<circle cx="10" cy="10" r="6" fill="none" stroke="C" stroke-width="1"/><circle cx="18" cy="10" r="6" fill="none" stroke="C" stroke-width="1"/><circle cx="34" cy="30" r="6" fill="none" stroke="C" stroke-width="1"/><circle cx="42" cy="30" r="6" fill="none" stroke="C" stroke-width="1"/>', pw:48, ph:40},
  comodin: {n:"Comodín",  c:"#9aa1ad", p:'<path d="M12 4.5l2.2 5.3 5.3 2.2-5.3 2.2L12 19.5l-2.2-5.3L4.5 12l5.3-2.2z"/>'}
};
/* trama del marco según el elemento, en el color del elemento */
const patEl = k => { const e = ELEM[k]; return "url('data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="' + e.pw + '" height="' + e.ph + '" viewBox="0 0 ' + e.pw + ' ' + e.ph + '">' + e.pat.replace(/"C"/g, '"' + e.c + '"') + '</svg>').replace(/'/g, "%27") + "')"; };
const ICO = {
  debil:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3 4.5 6v5.5c0 4.6 3.1 7.8 7.5 9.5 4.4-1.7 7.5-4.9 7.5-9.5V6z"/><path d="m12.8 6.5-2.3 4.3 2.8 1.4-2 4.6" stroke-linecap="round"/></svg>',
  aguante:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3 4.5 6v5.5c0 4.6 3.1 7.8 7.5 9.5 4.4-1.7 7.5-4.9 7.5-9.5V6z"/><path d="m8.7 12 2.3 2.3 4.4-4.6" stroke-linecap="round"/></svg>',
  siesta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M19.5 14.6A7.9 7.9 0 0 1 9.4 4.5a7.9 7.9 0 1 0 10.1 10.1z"/><path d="M15 4.5h3.5L15 8h3.5" stroke-linecap="round"/></svg>',
  chispa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l1.9 6.2 6.6 1.3-5.3 4 1.6 6.5L12 16.6l-4.8 3.9 1.6-6.5-5.3-4 6.6-1.3z"/></svg>'
};
/* ficha: info = tira bajo el dibujo · hab = habilidad · atq = [coste, nombre, daño, texto] · deb/agu = [elemento, valor] · siesta = coste de retirada · lore = texto de ambiente */
const FICHA = {
  "alberto":  {nom:"Alberto", enc:{t:.105, b:.86, x:.5}, forma:"", clase:"Resident", el:["agua"], aura:120, op:"50% 12%",
    info:"Nº001 · Humano de sofá · Manises",
    hab:["Guardián del hogar", "Tus Familiares no pueden ser dormidos. Salvo en el sofá: ahí mandan ellos."],
    atq:[["agua","comodin"], "Pedido a domicilio", "60", "Roba 2 cartas. Si es domingo, roba 3."],
    deb:["psiquico","×2"], agu:["fuego","−30"], siesta:2,
    lore:"Dicen que nunca ha perdido una discusión con un gato. Los gatos cuentan otra cosa."},
  "cristina": {nom:"Cristina", enc:{t:.105, b:.95, x:.5}, forma:"", clase:"Resident", el:["hada"], aura:120, op:"50% 10%",
    info:"Nº002 · Humana · Reina de la casa",
    hab:["Mirada que ordena", "Devuelve una carta del rival a su mano. Nadie se atreve a discutirlo."],
    atq:[["hada","hada","comodin"], "Beso de despedida", "90+", "Si Alberto está en juego, este ataque hace 30 más."],
    deb:["siniestro","×2"], agu:["dragon","−30"], siesta:1,
    lore:"Cuando entra en una habitación, hasta los gatos se sientan bien."},
  "kurama-ex":{nom:"Kurama", forma:"NOVA", clase:"Familiar", el:["fuego"], aura:170, op:"50% 30%",
    info:"Nº003 · Gato naranja · Radiador con patas",
    hab:["Okupa del sofá", "Si hay un sitio caliente, es suyo. Tu rival no puede usar su banco este turno."],
    atq:[["fuego","fuego"], "Zarpazo solar", "120", "Si tu rival tiene una manta en juego, descártala."],
    deb:["agua","×2"], agu:["hada","−30"], siesta:3,
    lore:"Nació para dormir al sol. El fuego vino después."},
  "gyukki-ex":{nom:"Gyukki", forma:"NOVA", clase:"Familiar", el:["psiquico"], aura:190, op:"50% 30%",
    info:"Nº004 · Siamesa · Alarma de las 6:00",
    hab:["Maullido de las 6:00", "Al empezar el turno del rival, lo despierta: descarta 1 carta de su mano al azar."],
    atq:[["psiquico","comodin","comodin"], "Mirada de cristal", "140", "Si el rival le sostiene la mirada, no puede atacar el próximo turno."],
    deb:["siniestro","×2"], agu:["fuego","−30"], siesta:1,
    lore:"Sus ojos guardan una galaxia entera. Y hambre. Sobre todo hambre."},
  "kurama-gyukki-vstar":{nom:"Kurama & Gyukki", enc:{t:.16, b:.66, x:.5, w:1.02}, forma:"BOND", clase:"Familiar", el:["dragon"], aura:260, op:"50% 40%",
    info:"Nº005 · Dúo felino · Inseparables (casi)",
    hab:["Colas en corazón", "Si los dos están en juego, recuperan 50 de aura cada turno. Luego te ignoran igual."],
    atq:[["fuego","psiquico","comodin"], "Ataque en pinza", "200", "Si uno está dormido, el otro hace el doble. Nunca duermen a la vez."],
    deb:["siniestro","×2"], agu:["agua","−30"], siesta:2,
    lore:"Uno es fuego y la otra, psíquica. Juntos, un problema."},
  "love-vmax":{nom:"Love of My Life", enc:{t:.13, b:.72, x:.5, w:1.1, ft:.02}, forma:"ETERNAL", clase:"Bond", el:["dragon"], aura:999, op:"50% 25%",
    info:"Nº061/060 · Secreta · Desde el primer día",
    hab:["Para siempre", "Esta carta no puede descartarse, devolverse ni barajarse. Nunca."],
    atq:[["dragon","dragon","dragon"], "Contra todo", "999", "Este daño no se puede reducir, prevenir ni esquivar."],
    deb:null, agu:null, siesta:0,
    lore:"No es la carta más rara del set. Es la más importante."}
};
const icoEl = k => '<svg viewBox="0 0 24 24" fill="#fff">' + ELEM[k].p + '</svg>';
const orbe = k => '<span class="mb-el" style="--c:' + ELEM[k].c + '">' + icoEl(k) + '</span>';
/* máscara «todo menos el hueco» para los foils que van solo en el marco */
function mascaraMarco(a){
  const W = 720, H = 1019, x = a[0]*W, y = a[1]*H, w = (a[2]-a[0])*W, h = (a[3]-a[1])*H, r = 12;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '"><path fill-rule="evenodd" fill="#fff" d="M0 0H' + W + 'V' + H + 'H0Z M' + (x+r) + ' ' + y + 'H' + (x+w-r) + 'Q' + (x+w) + ' ' + y + ' ' + (x+w) + ' ' + (y+r) + 'V' + (y+h-r) + 'Q' + (x+w) + ' ' + (y+h) + ' ' + (x+w-r) + ' ' + (y+h) + 'H' + (x+r) + 'Q' + x + ' ' + (y+h) + ' ' + x + ' ' + (y+h-r) + 'V' + (y+r) + 'Q' + x + ' ' + y + ' ' + (x+r) + ' ' + y + 'Z"/></svg>';
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
function marcoBase(id, v){
  const f = FICHA[id], w = WS[id];
  let h = '<div class="mb-velo"></div><div class="mb-panel"></div><div class="mb-trama" style="--pat:' + patEl(f.el[0]) + '"></div><div class="mb-rim"></div><div class="mb-esq"></div>';
  /* cabecera: etiqueta de clase, nombre con forma, aura y elemento */
  h += '<div class="mb-cab' + (f.nom.length > 10 ? ' largo' : '') + '"><div class="mb-nom"><em>' + f.clase + (f.forma ? ' · ' + f.forma : '') + '</em><b>' + f.nom + '</b>' +
       (f.forma ? '<i class="mb-forma">' + f.forma + '</i>' : '') + '</div>' +
       '<div class="mb-aura"><small>Aura</small><b>' + f.aura + '</b>' + f.el.map(orbe).join("") + '</div></div>';
  h += '<div class="mb-ven"></div>';
  h += '<div class="mb-info">' + f.info + '</div>';
  /* texto de juego */
  h += '<div class="mb-txt">';
  h += '<div class="mb-hab"><span class="mb-pill">' + ICO.chispa + 'Habilidad</span><b>' + f.hab[0] + '</b><p>' + f.hab[1] + '</p></div>';
  const a = f.atq;
  h += '<div class="mb-atq"><div class="mb-coste">' + a[0].map(orbe).join("") + '</div><b>' + a[1] + '</b><strong>' + a[2] + '</strong><p>' + a[3] + '</p></div>';
  h += '</div>';
  /* punto débil, aguante y siesta */
  const celda = (t, x, ic) => '<div><i class="mb-si">' + ICO[ic] + '</i><small>' + t + '</small>' + (x ? orbe(x[0]) + '<span>' + x[1] + '</span>' : '<span>—</span>') + '</div>';
  h += '<div class="mb-stats">' + celda("Punto débil", f.deb, "debil") + celda("Aguante", f.agu, "aguante") +
       '<div><i class="mb-si">' + ICO.siesta + '</i><small>Siesta</small>' + (f.siesta ? Array(f.siesta).fill(orbe("comodin")).join("") : '<span>—</span>') + '</div></div>';
  h += '<div class="mb-lore">' + f.lore + '</div>';
  h += '<div class="mb-pie"><span class="mb-set"></span><span>GRM · S01 · ' + w.num + '/006</span><span class="mb-rar">' + (v ? icono(id, v) : '') + '</span><span class="mb-ilu">Illus. Casa Gremory</span></div>';
  return h;
}

function versiones0(id){
  const c = CARTAS[id], v = [gordas(id) ? "RR" : "R", "RH", "SR"];
  if(c.capas) v.push("OFR");
  v.push("SP", "HR");
  if(c.capas) v.push("G1", "G2");
  return v;
}
function rareza(id, v){
  const c = CARTAS[id];
  return {R: c.tipo === "trainer" ? "rare holo" : "rare holo cosmos", RH:"reverse holo",
    RR: id === "love-vmax" ? "rare holo vmax" : "rare holo vstar", SR:"rare ultra", OFR:"rare rainbow alt",
    SP:"amazing rare", HR:"rare secret", CR:"rare rainbow"}[v];
}
function recortes(a){
  const P = x => (x*100).toFixed(2) + "%";
  const ins = "inset(" + P(a[1]) + " " + P(1-a[2]) + " " + P(1-a[3]) + " " + P(a[0]) + ")";
  const inv = "polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% " + P(a[3]) + "," + P(a[2]) + " " + P(a[3]) + "," + P(a[2]) + " " + P(a[1]) + "," + P(a[0]) + " " + P(a[1]) + "," + P(a[0]) + " " + P(a[3]) + ",0% " + P(a[3]) + ")";
  return "--clip:" + ins + ";--clip-stage:" + ins + ";--clip-trainer:" + ins + ";--clip-invert:" + inv + ";--clip-stage-invert:" + inv + ";--clip-trainer-invert:" + inv + ";";
}
/* ══ firmas de verdad: se firma con el dedo y se estampa en foil (oro, plata o arcoíris), como las SP de Weiß Schwarz ══ */
const NOMBRES = {alberto:"Alberto", cristina:"Cristina"};
let FIRMAS = {}; try { FIRMAS = JSON.parse(localStorage.getItem("gremory-firmas")) || {}; } catch(e){}
let TINTA = "oro";
function firmaHTML(s, b){
  const f = FIRMAS[s.q], w = s.s, alto = (w / 3).toFixed(2);
  const caja = b + "width:" + w + "cqw;height:" + alto + "cqw;";
  if(f) return '<div class="sello firma-w" style="' + caja + '"><div class="firma-m t-' + TINTA + '" style="-webkit-mask-image:url(\'' + f + '\');mask-image:url(\'' + f + '\')"></div></div>';
  /* sin firmar todavía: nombre en letra manuscrita con el mismo foil */
  return '<div class="sello firma t-' + TINTA + '" style="' + b + 'font-size:' + (w / 3.2).toFixed(1) + 'cqw">' + NOMBRES[s.q] + '</div>';
}
/* trazos → SVG con grosor según la velocidad (rápido = fino), como un rotulador de verdad */
function trazosASVG(trazos){
  let p = "";
  for(const t of trazos){
    let w = 11;
    for(let i = 1; i < t.length; i++){
      const a = t[i-1], c = t[i], d = Math.hypot(c.x - a.x, c.y - a.y), dt = Math.max(8, c.t - a.t), v = d / dt;
      w += (Math.max(4.5, Math.min(14, 15 - v * 8)) - w) * .35;
      p += '<line x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + c.x.toFixed(1) + '" y2="' + c.y.toFixed(1) + '" stroke-width="' + w.toFixed(2) + '"/>';
    }
    if(t.length === 1) p += '<circle cx="' + t[0].x.toFixed(1) + '" cy="' + t[0].y.toFixed(1) + '" r="3.5" fill="#fff"/>';
  }
  return "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200"><g stroke="#fff" stroke-linecap="round" fill="none">' + p + '</g></svg>');
}

/* ══ Gremory: plantilla propia (nada de marco de Pokémon) ══ */
const GSELLO = {
  "alberto":  [{t:"firma", q:"alberto",  x:.42, y:.6, s:50, rot:-9}],
  "cristina": [{t:"firma", q:"cristina", x:.38, y:.6, s:50, rot:-9}],
  "kurama-gyukki-vstar": [{t:"huella", x:.62, y:.66, s:10, rot:-16}, {t:"huella", x:.76, y:.62, s:10, rot:12}],
  "love-vmax": [{t:"firma", q:"alberto", x:.08, y:.62, s:40, rot:-10}, {t:"firma", q:"cristina", x:.5, y:.66, s:40, rot:-6}]
};
/* marco dorado propio: doble filete y esquinas con rombo. «corte» abre un hueco arriba para el emblema */
function marcoG(corte){
  const W = 720, H = 1019, m = 22, n = 34, r = 26;
  const esquina = (x, y, sx, sy) => '<path d="M' + x + ' ' + (y + sy*70) + ' L' + x + ' ' + (y + sy*12) + ' Q' + x + ' ' + y + ' ' + (x + sx*12) + ' ' + y + ' L' + (x + sx*70) + ' ' + y + '" fill="none" stroke="#fff" stroke-width="5"/>' +
    '<path d="M' + (x + sx*22) + ' ' + (y + sy*10) + ' l' + (sx*12) + ' ' + (sy*12) + ' l' + (-sx*12) + ' ' + (sy*12) + ' l' + (-sx*12) + ' ' + (-sy*12) + 'z" fill="#fff"/>';
  const hueco = corte === "logo" ? '<ellipse cx="360" cy="30" rx="66" ry="64" fill="#000"/>'
              : corte === "rombo" ? '<rect x="300" y="0" width="120" height="70" fill="#000"/>'
              : corte === "titulo" ? '<rect x="238" y="0" width="244" height="60" fill="#000"/>' : '';
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '">' +
    '<defs><mask id="k" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><rect width="' + W + '" height="' + H + '" fill="#fff"/>' + hueco + '</mask></defs>' +
    '<g mask="url(#k)" fill="none" stroke="#fff">' +
    '<rect x="' + m + '" y="' + m + '" width="' + (W - 2*m) + '" height="' + (H - 2*m) + '" rx="' + r + '" stroke-width="7"/>' +
    '<rect x="' + n + '" y="' + n + '" width="' + (W - 2*n) + '" height="' + (H - 2*n) + '" rx="' + (r - 10) + '" stroke-width="2.5"/></g>' +
    esquina(n + 8, n + 8, 1, 1) + esquina(W - n - 8, n + 8, -1, 1) + esquina(n + 8, H - n - 8, 1, -1) + esquina(W - n - 8, H - n - 8, -1, -1) +
    '</svg>';
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
/* emblema rombo art déco: rombo doble con rayos */
const ROMBO = (() => {
  let rayos = "";
  for(let i = 0; i < 16; i++){ const a = i / 16 * Math.PI * 2, l = i % 2 ? 44 : 58;
    rayos += '<line x1="' + (60 + Math.cos(a) * 26).toFixed(1) + '" y1="' + (60 + Math.sin(a) * 26).toFixed(1) + '" x2="' + (60 + Math.cos(a) * l).toFixed(1) + '" y2="' + (60 + Math.sin(a) * l).toFixed(1) + '" stroke="#fff" stroke-width="' + (i % 2 ? 1.6 : 2.4) + '"/>'; }
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' + rayos +
    '<path d="M60 22 L88 60 L60 98 L32 60Z" fill="#fff"/><path d="M60 34 L79 60 L60 86 L41 60Z" fill="#000" fill-opacity="1"/>' +
    '<path d="M60 42 L73 60 L60 78 L47 60Z" fill="#fff"/></svg>';
  return "data:image/svg+xml," + encodeURIComponent(svg);
})();
let EMB = "logo";
function cartaGremory(id, v){
  const c = CARTAS[id], I = IMG[id], a = c.arte, P = x => (x*100) + "%";
  const asp = (a[3] - a[1]) * 1019 / ((a[2] - a[0]) * 720);          /* alto/ancho del recorte */
  const alto = Math.min(asp * 100 / 1.4153, 78);                       /* en % del alto de la carta */
  const ancho = alto * 1.4153 / asp;
  let h = '<div class="carta gremory ' + v.toLowerCase() + ' gp" data-rarity="gremory" style="--marco:url(' + I.marco + ')">';
  const N = ART[id] && ART[id].gre;
  if(N){
    /* ilustración propia de Gremory: un escenario por variante y el personaje entero entre el emblema y la banda */
    /* ilustración propia de Gremory: los dos escenarios y el personaje comparten lienzo, así que van en la misma caja */
    const R = [0,0,1,1], caja = cajaCover(N.asp || 1024/1820, R, Object.assign(N.bb ? {cy:N.bb[1], ty:.135} : {}, N.enc || {}));
    h += '<div class="capa-clip">' + capaEn(caja, R, '<img class="fondo" src="' + (v === "G2" ? N.g2 : N.g1) + '" alt="">') + '</div>' + (v === "G1" ? '<div class="obglint"></div>' : '');
    h += '<div class="purpu"></div>';
    h += '<div class="capa-clip">' + capaEn(caja, R, '<img class="pj fuera" src="' + N.pj + '" alt="">') + '</div>';
  } else {
  h += v === "G2" ? '<div class="fondo-g"><div class="galaxia"></div><div class="estrellas"></div></div>'
                  : '<div class="fondo-g"><img class="fondo obsid" src="' + I.fondo + '" alt=""></div><div class="oblin"></div><div class="obglint"></div>';
  h += '<div class="purpu"></div>';
  h += '<div class="pj-g" style="width:' + ancho.toFixed(2) + '%;height:' + alto.toFixed(2) + '%;left:' + ((100 - ancho)/2).toFixed(2) + '%;bottom:13%"><img class="pj fuera" src="' + I.pj + '" alt=""></div>';
  }
  for(const s of (v === "G2" ? GSELLO[id] || [] : [])){
    const b = "left:" + P(s.x) + ";top:" + P(s.y) + ";transform:rotate(" + s.rot + "deg);";
    h += s.t === "firma" ? firmaHTML(s, b) : '<div class="sello huella-w" style="' + b + 'width:' + s.s + 'cqw;height:' + s.s + 'cqw"><div class="huella"></div></div>';
  }
  const mg = marcoG(EMB);
  h += '<div class="marco-g" style="-webkit-mask-image:url(\'' + mg + '\');mask-image:url(\'' + mg + '\')"></div>';
  if(EMB === "logo")  h += '<div class="emb emb-logo"><div class="oro-m"></div></div>';
  if(EMB === "rombo") h += '<div class="emb emb-rombo"><div class="oro-m" style="-webkit-mask-image:url(\'' + ROMBO + '\');mask-image:url(\'' + ROMBO + '\')"></div></div>';
  if(EMB === "titulo") h += '<div class="emb-tit">Gremory</div>';
  const corto = {"kurama-gyukki-vstar":"Kurama & Gyukki", "love-vmax":"Love of My Life"}[id] || c.n;
  const w = WS[id];
  h += '<div class="ws-nv g"><b>' + w.nv + '</b><i>' + w.coste + '</i></div>';
  h += '<div class="placa-g ws-banda-g"><div class="ws-poder">' + w.poder + '</div><div class="ws-nom"><b' + (corto.length > 11 ? ' style="font-size:6.2cqw"' : '') + '>' + corto + '</b><span>' + w.rasgos.map(r => '《' + r + '》').join(" ") + '</span></div><div class="ws-cod">GRM/S01-' + w.num + '<br>1 de 1</div></div>';
  h += '<div class="card__glare"></div>';
  const pos = [[10,14],[86,20],[12,40],[88,46],[8,62],[90,70],[26,10],[72,12],[50,30]];
  pos.forEach((p, i) => h += '<div class="brill" style="left:' + p[0] + '%;top:' + p[1] + '%;animation-delay:' + (i * .41 % 2.4).toFixed(2) + 's"></div>');
  return h + '</div>';
}
/* ══ Firmada al estilo Weiß Schwarz: plantilla propia (nivel/coste, banda de nombre con rasgos, código SP) ══ */
const WS = {
  "alberto":  {nv:3, coste:2, poder:"9500",  color:"#3b82f6", rasgos:["Gremory","Casa"],     num:"004"},
  "cristina": {nv:3, coste:2, poder:"9500",  color:"#ec4899", rasgos:["Gremory","Casa"],     num:"014"},
  "kurama-ex":{nv:2, coste:1, poder:"7000",  color:"#f97316", rasgos:["Gato","Fuego"],       num:"024"},
  "gyukki-ex":{nv:2, coste:1, poder:"7000",  color:"#8b5cf6", rasgos:["Gato","Siamesa"],     num:"038"},
  "kurama-gyukki-vstar":{nv:3, coste:2, poder:"10000", color:"#c9a227", rasgos:["Gato","Familia"], num:"044"},
  "love-vmax":{nv:3, coste:3, poder:"12000", color:"#c9a227", rasgos:["Nosotros","Casa"],    num:"061"}
};
const WSELLO = {
  "alberto":  [{t:"firma", q:"alberto",  x:.30, y:.52, s:58, rot:-8}],
  "cristina": [{t:"firma", q:"cristina", x:.26, y:.52, s:58, rot:-8}],
  "kurama-ex":[{t:"huella", x:.62, y:.54, s:18, rot:-14}],
  "gyukki-ex":[{t:"huella", x:.62, y:.54, s:18, rot:-14}],
  "kurama-gyukki-vstar":[{t:"huella", x:.58, y:.55, s:14, rot:-16}, {t:"huella", x:.76, y:.51, s:14, rot:12}],
  "love-vmax":[{t:"firma", q:"alberto", x:.05, y:.64, s:42, rot:-8}, {t:"firma", q:"cristina", x:.5, y:.66, s:42, rot:-5}]
};
const WSELLO2 = {"alberto": [{t:"firma", q:"alberto", x:.45, y:.6, s:50, rot:-8}]};
function cartaWeiss(id, modo){
  const c = CARTAS[id], I = IMG[id], w = WS[id], a = c.arte, P = x => (x*100) + "%";
  const oro = modo === "HR", efectos = oro ? '<div class="grab"></div><div class="grab2"></div><div class="purpu"></div>' : '<div class="card__shine"></div>';
  let h = '<div class="carta ws' + (oro ? ' oro' : '') + '" data-rarity="' + (oro ? 'oro' : 'amazing rare') + '" style="--ws:' + (oro ? '#c9a24a' : w.color) + '">';
  const N = ART[id] && ((modo === "HR" && ART[id].oro) || ART[id].firma);
  if(N){
    /* ilustración propia de Firmada: fondo a sangre y el personaje un pelín bajado para que el corte quede bajo la banda */
    /* ilustración propia de Firmada / Oro: fondo y personaje en la misma caja; los brillos van entre los dos */
    const R = [0,0,1,1], caja = N.asp ? cajaCover(N.asp, R, Object.assign({cy:0, ty:0}, N.enc || {})) : [0,0,1,1];
    h += '<div class="capa-clip">' + capaEn(caja, R, '<img class="fondo' + (oro ? ' dorar' : '') + '" src="' + N.fondo + '" alt="">') + '</div>' + efectos;
    h += '<div class="capa-clip">' + capaEn(caja, R, '<img class="pj fuera" src="' + N.pj + '" alt="">') + '</div>';
  } else if(c.capas){
    const asp = (a[3] - a[1]) * 1019 / ((a[2] - a[0]) * 720), alto = Math.min(asp * 100 / 1.4153, 80), ancho = alto * 1.4153 / asp;
    h += '<div class="fondo-g"><img class="fondo' + (oro ? ' dorar' : '') + '" src="' + I.fondo + '" alt=""></div>' + efectos;
    h += '<div class="pj-g" style="width:' + ancho.toFixed(2) + '%;height:' + alto.toFixed(2) + '%;left:' + ((100 - ancho)/2).toFixed(2) + '%;bottom:17%"><img class="pj fuera" src="' + I.pj + '" alt=""></div>';
  } else {
    /* sin recorte: el arte completo, recortando la cabecera y los textos de Pokémon */
    h += '<div class="fondo-g"><img class="fondo' + (oro ? ' dorar' : '') + '" src="' + I.arte + '" alt="" style="object-fit:cover;object-position:50% 40%"></div>' + efectos;
  }
  const P2 = x => (x*100) + "%";
  for(const s of (oro ? [] : (N && WSELLO2[id]) || WSELLO[id])){
    const b = "left:" + P2(s.x) + ";top:" + P2(s.y) + ";transform:rotate(" + s.rot + "deg);";
    const t0 = TINTA; if(oro) TINTA = "oro";
    h += s.t === "firma" ? firmaHTML(s, b) + dedicatoriaHTML(s) : '<div class="sello huella-w" style="' + b + 'width:' + s.s + 'cqw;height:' + s.s + 'cqw"><div class="huella"></div></div>';
    TINTA = t0;
  }
  /* marcas de nivel y coste arriba a la izquierda */
  h += '<div class="ws-nv"><b>' + w.nv + '</b><i>' + w.coste + '</i></div>';
  /* banda inferior: poder, nombre, rasgos */
  const corto = {"kurama-gyukki-vstar":"Kurama & Gyukki", "love-vmax":"Love of My Life", "kurama-ex":"Kurama", "gyukki-ex":"Gyukki"}[id] || c.n;
  h += '<div class="ws-banda"><div class="ws-poder">' + w.poder + '</div><div class="ws-nom"><b' + (corto.length > 11 ? ' style="font-size:6.2cqw"' : '') + '>' + corto + '</b><span>' + w.rasgos.map(r => '《' + r + '》').join(" ") + '</span></div></div>';
  const cod = oro ? "HR" : "SP";
  h += '<div class="ws-pie"><span>GRM/S01-' + w.num + cod + '</span><span class="sp t-' + (oro ? 'oro' : TINTA) + '">' + cod + '</span></div>';
  h += '<div class="card__glare"></div>' + (oro ? '<div class="barrido"></div>' : '');
  return h + '</div>';
}
/* dedicatoria manuscrita debajo de la firma (opcional) */
function dedicatoriaHTML(s){
  const f = FIRMAS[s.q + "-ded"]; if(!f) return "";
  const w = s.s * .8, b = "left:" + ((s.x + .06) * 100) + "%;top:" + ((s.y + .1) * 100) + "%;transform:rotate(" + (s.rot + 3) + "deg);";
  return '<div class="sello firma-w" style="' + b + 'width:' + w + 'cqw;height:' + (w/3).toFixed(2) + 'cqw"><div class="firma-m t-' + TINTA + '" style="-webkit-mask-image:url(\'' + f + '\');mask-image:url(\'' + f + '\')"></div></div>';
}
/* ══ carta base a sangre: el dibujo ocupa toda la carta y el texto va en un panel de cristal ══ */
const ARTE_BASE = [.02,.015,.98,.595];      /* zona del dibujo que queda a la vista (para los foils) */
/* coloca la capa del personaje: cabeza a la altura t, pies hacia b, centrado en x; si es muy ancho, se limita a w */
/* coloca la capa del personaje dentro de una caja [x0,y0,x1,y1] (fracciones de carta):
   cabeza a la altura t, pies hacia b, centrado en x; si es muy ancho se limita a w. Devuelve posición relativa a la caja */
function colocaPj(id, caja, enc, capa){
  const I = capa || IMG[id], b = I.bb, e = Object.assign({t:.1, b:.8, x:.5, w:.96}, enc || {});
  const CW = 720, CH = 1019, bx = caja[0]*CW, by = caja[1]*CH, bw_ = (caja[2]-caja[0])*CW, bh_ = (caja[3]-caja[1])*CH;
  let ih = (e.b - e.t) * CH / (b[3] - b[1]), iw = ih * I.asp, ancho = false;
  const bw = (b[2] - b[0]) * iw;
  if(bw > e.w * CW){ const k = e.w * CW / bw; ih *= k; iw *= k; ancho = true; }
  const top = (ancho ? e.b * CH - b[3] * ih : e.t * CH - b[1] * ih) - by;
  const left = e.x * CW - (b[0] + b[2]) / 2 * iw - bx;
  const P = (v, t) => (v / t * 100).toFixed(2) + "%";
  return "left:" + P(left, bw_) + ";top:" + P(top, bh_) + ";width:" + P(iw, bw_) + ";height:" + P(ih, bh_);
}
/* caja de una imagen a sangre dentro de la región R (fracciones de carta), como object-fit:cover pero con zoom (z)
   y con el punto (cx,cy) de la imagen llevado a (tx,ty) de la región, sin dejar nunca hueco. Devuelve [x,y,w,h] en fracciones de carta */
function cajaCover(asp, R, o){
  o = Object.assign({z:1, cx:.5, cy:.5, tx:.5, ty:.5}, o || {});
  const CW = 720, CH = 1019, rx = R[0]*CW, ry = R[1]*CH, rw = (R[2]-R[0])*CW, rh = (R[3]-R[1])*CH;
  const w = Math.max(rw, rh*asp) * o.z, h = w / asp;
  const l = Math.min(rx, Math.max(rx + rw - w, rx + rw*o.tx - o.cx*w));
  const t = Math.min(ry, Math.max(ry + rh - h, ry + rh*o.ty - o.cy*h));
  return [l/CW, t/CH, w/CW, h/CH];
}
/* la misma caja expresada dentro de un contenedor C */
function capaEn(caja, C, inner){
  const cw = C[2]-C[0], ch = C[3]-C[1], P = x => (x*100).toFixed(3) + "%";
  return '<div class="capa" style="left:' + P((caja[0]-C[0])/cw) + ';top:' + P((caja[1]-C[1])/ch) + ';width:' + P(caja[2]/cw) + ';height:' + P(caja[3]/ch) + '">' + inner + '</div>';
}
/* tres plantillas base:
   · Estándar (Destello, Reverso, Doble brillo): dibujo apaisado 3:2 enmarcado y texto de juego debajo
   · Grabada: dibujo vertical a sangre y texto en panel de cristal
   · Escapada: dibujo apaisado 3:2 más abajo; el personaje se sale del hueco por arriba, sin pasar nunca del borde de la carta */
const TPL = {
  est: {ven:[.055,.112,.945,.531]},
  full:{ven:[0,0,1,1], vis:[.02,.015,.98,.595]},
  esc: {ven:[.06,.165,.94,.58]}
};
const ESCV = new URLSearchParams(location.search).get("esc") || "c";
function cartaBase(id, v){
  const c = CARTAS[id], I = IMG[id], f = FICHA[id], N = ART[id] || {};
  const tpl = v === "SR" ? "full" : v === "OFR" ? "esc" : "est", T = TPL[tpl], a = T.vis || T.ven, P = x => (x*100).toFixed(3) + "%";
  const win = "left:" + P(T.ven[0]) + ";top:" + P(T.ven[1]) + ";width:" + P(T.ven[2]-T.ven[0]) + ";height:" + P(T.ven[3]-T.ven[1]);
  let h = '<div class="carta ' + (tpl === "full" ? "base" : tpl === "esc" ? "base esc" : tpl) + (c.sinfoto ? ' sinfoto' : '') + '" data-rarity="' + rareza(id, v) + '" data-supertype="' + c.tipo + '" data-subtypes="' + c.sub +
    '" style="' + recortes(a) + '--marco:url(' + mascaraMarco(a) + ');--el:' + ELEM[f.el[0]].c + '">';
  h += '<div class="mb-bg"></div>';
  const propio = N[tpl];                                   /* ilustración hecha a medida para esta plantilla */
  const fondo = propio ? propio.fondo : (c.capas ? I.fondo : I.arte);
  const op = propio ? "50% 50%" : (f.op || "50% 30%");
  let pj = "";
  if(propio && propio.pj){
    pj = tpl === "esc" ? (() => {
                           /* lienzo 1:1 apoyado en el pie del cuadro; si la cabeza (o un cuerno, o una oreja) sube más de lo que se ve, se baja todo */
                           const vh = T.ven[3]-T.ven[1], ch = (T.ven[2]-T.ven[0]) * 720/1019;
                           let top = T.ven[3] - ch;
                           const alto = propio.bb ? top + propio.bb[1] * ch : top, tope = T.ven[1] - .03;
                           if(alto < tope) top += tope - alto;
                           return '<img class="pj fuera fija" src="' + propio.pj + '" alt="" style="left:0;top:' + P((top - T.ven[1]) / vh) + ';width:100%;height:' + P(ch / vh) + '">';
                         })()
                       : tpl === "full" && propio.bb ? (() => {
                           /* alineado con el fondo (mismo recorte); solo se baja si la cabeza invade la cabecera */
                           const H = (1 / propio.asp) * 720 / 1019, y0 = -(H - 1) / 2, cab = y0 + propio.bb[1] * H, dy = Math.max(0, .115 - cab);
                           return '<img class="pj" src="' + propio.pj + '" alt="" style="left:0;width:100%;top:' + P(y0 + dy) + ';height:' + P(H) + '">';
                         })()
                       : '<img class="pj" src="' + propio.pj + '" alt="" style="left:0;top:0;width:100%;height:100%;object-fit:cover;object-position:' + op + '">';
  } else if(c.capas){
    const enc = Object.assign({}, f.enc || {}, (f.encTpl || {})[tpl] || {});
    if(tpl === "est") Object.assign(enc, {t:T.ven[1] + .015, b:T.ven[1] + .015 + (enc.b - enc.t) * .78});
    if(tpl === "esc") Object.assign(enc, {t:T.ven[1] - .07, b:T.ven[1] - .07 + (enc.b - enc.t) * .72});
    pj = '<img class="pj' + (tpl === "esc" ? ' fuera' : '') + '" src="' + I.pj + '" alt="" style="' + colocaPj(id, tpl === "full" ? [0,0,1,1] : T.ven, enc) + '">';
  }
  if(tpl === "esc") h += '<div class="esc-amb v-' + ESCV + '"><img src="' + fondo + '" alt=""></div>';
  /* en la variante «b» el cuadro enseña los mismos píxeles que el fondo a sangre, solo que iluminados */
  const vw = T.ven[2]-T.ven[0], vh = T.ven[3]-T.ven[1];
  const imgV = tpl === "esc" && ESCV === "b" ? '<img src="' + fondo + '" alt="" style="left:' + P(-T.ven[0]/vw) + ';top:' + P(-T.ven[1]/vh) + ';width:' + P(1/vw) + ';height:' + P(1/vh) + ';object-fit:cover">'
                                           : '<img class="fondo" src="' + fondo + '" alt="" style="object-position:' + op + '">';
  if(propio && propio.pj && propio.asp && tpl !== "esc"){
    /* fondo y personaje alineados en una sola capa: se mueven juntos y el personaje no se despega del escenario */
    const R = tpl === "full" ? [0,0,1,1] : T.ven;
    const o = Object.assign(tpl === "full" && propio.bb ? {cy:propio.bb[1], ty:.13} : {}, propio.enc || {});
    h += '<div class="ventana ' + (tpl === "full" ? "mb-full" : "mb-v") + '" style="' + win + '">' +
         capaEn(cajaCover(propio.asp, R, o), R, '<img class="fondo" src="' + propio.fondo + '" alt=""><img class="pj" src="' + propio.pj + '" alt="">') + '</div>';
  } else
  h += '<div class="ventana ' + (tpl === "full" ? "mb-full" : "mb-v") + '" style="' + win + '">' + imgV +
       (tpl !== "esc" && pj ? '<div class="pj-c">' + pj + '</div>' : '') + '</div>';
  h += marcoBase(id, v);
  /* Escapada: el personaje va por encima del marco pero recortado al borde interior de la carta y al pie del hueco */
  if(tpl === "esc" && pj) h += '<div class="esc-c" style="' + win + '"><div class="pj-c">' + pj + '</div></div>';
  h += '<div class="card__shine"></div><div class="card__glare"></div>';
  return h + '</div>';
}

function carta(id, v){
  if(v === "CASA") return cartaCasa(id);
  if(["R","RR","RH","SR","OFR"].includes(v)) return cartaBase(id, v);
  if(v === "G1" || v === "G2") return cartaGremory(id, v);
  if(v === "SP") return cartaWeiss(id);
  if(v === "HR") return cartaWeiss(id, "HR");
  const c = CARTAS[id], I = IMG[id], a = VEN, P = x => (x*100) + "%";
  const win = "left:" + P(a[0]) + ";top:" + P(a[1]) + ";width:" + P(a[2]-a[0]) + ";height:" + P(a[3]-a[1]);
  const gre = /^G\d$/.test(v);
  const oro = v === "HR", fuera = v === "OFR" || v === "CR" || gre;
  const esp = v === "HR" ? " oro" : v === "CR" ? " gremory" : gre ? " gremory " + v.toLowerCase() : "";
  const tono = v === "HR" ? "dorar" : v === "CR" ? "nacarar" : v === "G1" ? "obsid" : v === "G2" ? "cosmo" : "";
  let h = '<div class="carta' + esp + (c.sinfoto ? ' sinfoto' : '') + '" data-rarity="' + (esp ? esp.trim() : rareza(id, v)) + '" data-supertype="' + c.tipo + '" data-subtypes="' + c.sub +
    '" style="' + recortes(a) + '--marco:url(' + mascaraMarco(a) + ');--el:' + ELEM[FICHA[id].el[0]].c + ';--op:' + (FICHA[id].op || '50% 20%') + '">';
  h += '<div class="mb-bg"></div>';
  /* capas de efecto que van ENTRE el fondo/marco y el personaje */
  const medio = v === "HR" ? '<div class="grab"></div><div class="grab2"></div><div class="purpu"></div>'
              : v === "CR" ? '<div class="nacar"></div><div class="star"></div><div class="purpu"></div>'
              : v === "G1" ? '<div class="oblin"></div><div class="obglint"></div><div class="purpu"></div>'
              : v === "G2" ? '<div class="irid"></div><div class="purpu"></div>'
              : v === "G3" ? '<div class="acuarela"></div><div class="purpu"></div>' : '';
  if(!c.capas){
    h += '<div class="ventana mb-v" style="' + win + '"><img class="fondo ' + tono + '" src="' + I.arte + '" alt=""></div>' + marcoBase(id, v) + medio;
  } else {
    const pjDentro = !fuera && v !== "HR";
    if(v === "G3"){          /* Encantada: sin marco, el dibujo a sangre por toda la carta */
      h += '<div class="ventana"><img class="fondo" src="' + I.fondo + '" alt="" style="object-fit:cover"></div>' + medio;
      h += '<div class="placa">' + c.n + '</div>';
    } else if(v === "G2"){   /* Cósmica: el fondo es una galaxia con estrellas */
      h += '<div class="ventana" style="' + win + '"><div class="galaxia"></div><div class="estrellas"></div></div>';
      h += '<img class="' + tono + '" src="' + I.marco + '" alt="">' + medio;
    } else {
      h += '<div class="ventana mb-v" style="' + win + '"><img class="fondo ' + tono + '" src="' + I.fondo + '" alt="">' +
           (pjDentro ? '<img class="pj" src="' + I.pj + '" alt="">' : '') + '</div>';
      h += marcoBase(id, v) + medio;
    }
    if(v === "HR") h += '<div class="ventana" style="' + win + '"><img class="pj" src="' + I.pj + '" alt=""></div>';   /* en oro, el personaje por encima */
    if(fuera) h += '<div style="' + win + ';position:absolute;overflow:visible"><img class="pj fuera" src="' + I.pj + '" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div>';
  }
  if(!esp) h += '<div class="card__shine"></div>';
  if(v === "SP" || v === "CR" || gre) for(const s of c.sello){
    const b = "left:" + P(s.x) + ";top:" + P(s.y) + ";transform:rotate(" + s.rot + "deg);";
    h += s.t === "firma" ? firmaHTML(s, b) : '<div class="sello huella-w" style="' + b + 'width:' + s.s + 'cqw;height:' + s.s + 'cqw"><div class="huella"></div></div>';
  }
  h += '<div class="card__glare"></div>';
  if(v === "HR") h += '<div class="barrido"></div>';
  if(v === "CR" || gre){
    h += '<div class="borde"></div><div class="sello huella corona" style="left:82%;top:2.6%;width:12cqw;height:9.5cqw"></div><div class="serie">1 de 1</div>';
    const pos = [[8,8],[88,18],[14,36],[90,48],[6,64],[92,78],[20,90],[70,6],[50,94],[80,92],[30,20],[62,60]];
    pos.forEach((p, i) => h += '<div class="brill" style="left:' + p[0] + '%;top:' + p[1] + '%;animation-delay:' + (i * .37 % 2.4).toFixed(2) + 's"></div>');
  }
  return h + '</div>';
}


/* ══ Álbum del Set 1: las cartas entregadas por Codex, montadas en sus marcos ══ */
const D1 = {"CARTAS": {"s01-001": {"n": "Alberto", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "alberto", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-002": {"n": "Alberto", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "alberto", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-003": {"n": "Alberto", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "alberto", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-004": {"n": "Alberto", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "alberto", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-005": {"n": "Alberto", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "alberto", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-006": {"n": "Alberto", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "alberto", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-007": {"n": "Alberto", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "alberto", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-008": {"n": "Alberto", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "alberto", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-009": {"n": "Alberto", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "alberto", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-010": {"n": "Alberto", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "alberto", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-011": {"n": "Cristina", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "cristina", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-012": {"n": "Cristina", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "cristina", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-013": {"n": "Cristina", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "cristina", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-014": {"n": "Cristina", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "cristina", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-015": {"n": "Cristina", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "cristina", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-016": {"n": "Cristina", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "cristina", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-017": {"n": "Cristina", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "cristina", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-018": {"n": "Cristina", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "cristina", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-019": {"n": "Cristina", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "cristina", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-020": {"n": "Cristina", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "cristina", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-021": {"n": "Kurama", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-022": {"n": "Kurama", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-023": {"n": "Kurama", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-024": {"n": "Kurama", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-025": {"n": "Kurama", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-026": {"n": "Kurama", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-027": {"n": "Kurama", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-028": {"n": "Sukuna", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-029": {"n": "Sukuna", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-030": {"n": "Sukuna", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-031": {"n": "Sukuna", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-032": {"n": "Sukuna", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-033": {"n": "Sukuna", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-034": {"n": "Sukuna", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-035": {"n": "Gyukki", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-036": {"n": "Gyukki", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-037": {"n": "Gyukki", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-038": {"n": "Gyukki", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-039": {"n": "Gyukki", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-040": {"n": "Gyukki", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-041": {"n": "Gyukki", "tipo": "pok\u00e9mon", "sub": "stage 2 ex", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-042": {"n": "Cristina & Kurama", "tipo": "pok\u00e9mon", "sub": "vstar", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "cristina", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-043": {"n": "Cristina & Gyukki", "tipo": "pok\u00e9mon", "sub": "vstar", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "cristina", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-044": {"n": "Kurama & Gyukki", "tipo": "pok\u00e9mon", "sub": "vstar", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-045": {"n": "Los tres gatos", "tipo": "pok\u00e9mon", "sub": "vstar", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-046": {"n": "La familia", "tipo": "pok\u00e9mon", "sub": "vstar", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "alberto", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-047": {"n": "Kurama & Sukuna", "tipo": "pok\u00e9mon", "sub": "vstar", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "huella", "x": 0.07, "y": 0.64, "s": 15, "rot": -14}]}, "s01-048": {"n": "Alberto & Sukuna", "tipo": "pok\u00e9mon", "sub": "vstar", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "alberto", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}, "s01-049": {"n": "El arenero", "tipo": "trainer", "sub": "item", "arte": [0, 0, 1, 1], "capas": true, "sello": []}, "s01-050": {"n": "La malta", "tipo": "trainer", "sub": "item", "arte": [0, 0, 1, 1], "capas": true, "sello": []}, "s01-051": {"n": "El cepillo", "tipo": "trainer", "sub": "item", "arte": [0, 0, 1, 1], "capas": true, "sello": []}, "s01-052": {"n": "El sof\u00e1", "tipo": "trainer", "sub": "item", "arte": [0, 0, 1, 1], "capas": true, "sello": []}, "s01-053": {"n": "Manises", "tipo": "trainer", "sub": "item", "arte": [0, 0, 1, 1], "capas": true, "sello": []}, "s01-054": {"n": "La sart\u00e9n", "tipo": "trainer", "sub": "item", "arte": [0, 0, 1, 1], "capas": true, "sello": []}, "s01-055": {"n": "El rascador", "tipo": "trainer", "sub": "item", "arte": [0, 0, 1, 1], "capas": true, "sello": []}, "s01-056": {"n": "El comedero", "tipo": "trainer", "sub": "item", "arte": [0, 0, 1, 1], "capas": true, "sello": []}, "s01-057": {"n": "La encimera", "tipo": "trainer", "sub": "item", "arte": [0, 0, 1, 1], "capas": true, "sello": []}, "s01-058": {"n": "El escritorio", "tipo": "trainer", "sub": "item", "arte": [0, 0, 1, 1], "capas": true, "sello": []}, "s01-059": {"n": "La caja de sobres", "tipo": "trainer", "sub": "item", "arte": [0, 0, 1, 1], "capas": true, "sello": []}, "s01-060": {"n": "Madrid", "tipo": "trainer", "sub": "item", "arte": [0, 0, 1, 1], "capas": true, "sello": []}, "s01-061": {"n": "Love of My Life", "tipo": "trainer", "sub": "supporter", "arte": [0.0306, 0.1266, 0.9694, 0.8675], "capas": true, "sello": [{"t": "firma", "q": "alberto", "x": 0.36, "y": 0.62, "s": 52, "rot": -9}]}}, "FICHA": {"s01-001": {"base": "alberto", "nom": "Alberto", "el": ["agua"], "info": "N\u00ba001 \u00b7 Lanza la Pok\u00e9 Ball", "forma": ""}, "s01-002": {"base": "alberto", "nom": "Alberto", "el": ["agua"], "info": "N\u00ba002 \u00b7 De noche en la Ciudad de las Artes y las Ciencias de Valencia", "forma": ""}, "s01-003": {"base": "alberto", "nom": "Alberto", "el": ["agua"], "info": "N\u00ba003 \u00b7 Alarga la mano hacia c\u00e1mara", "forma": ""}, "s01-004": {"base": "alberto", "nom": "Alberto", "el": ["agua"], "info": "N\u00ba004 \u00b7 Por encima del hombro", "forma": ""}, "s01-005": {"base": "alberto", "nom": "Alberto", "el": ["agua"], "info": "N\u00ba005 \u00b7 Contrapicado sobre una roca", "forma": ""}, "s01-006": {"base": "alberto", "nom": "Alberto", "el": ["agua"], "info": "N\u00ba006 \u00b7 Contraluz \u00e9pico; la obsidiana con agua negra y vetas doradas", "forma": ""}, "s01-007": {"base": "alberto", "nom": "Alberto", "el": ["agua"], "info": "N\u00ba007 \u00b7 Programando de noche con el ordenador", "forma": ""}, "s01-008": {"base": "alberto", "nom": "Alberto", "el": ["agua"], "info": "N\u00ba008 \u00b7 Comi\u00e9ndose un chivito", "forma": ""}, "s01-009": {"base": "alberto", "nom": "Alberto", "el": ["agua"], "info": "N\u00ba009 \u00b7 Abriendo sobres de cartas en la mesa", "forma": ""}, "s01-010": {"base": "alberto", "nom": "Alberto", "el": ["agua"], "info": "N\u00ba010 \u00b7 En una hamburgueser\u00eda comi\u00e9ndose una Big Mac", "forma": ""}, "s01-011": {"base": "cristina", "nom": "Cristina", "el": ["hada"], "info": "N\u00ba011 \u00b7 En el sof\u00e1 con una manta y Mimikyu acurrucado al lado", "forma": ""}, "s01-012": {"base": "cristina", "nom": "Cristina", "el": ["hada"], "info": "N\u00ba012 \u00b7 Tumbada entre flores y p\u00e9talos rosas", "forma": ""}, "s01-013": {"base": "cristina", "nom": "Cristina", "el": ["hada"], "info": "N\u00ba013 \u00b7 Se asoma apoyada en el borde", "forma": ""}, "s01-014": {"base": "cristina", "nom": "Cristina", "el": ["hada"], "info": "N\u00ba014 \u00b7 Busto de tres cuartos", "forma": ""}, "s01-015": {"base": "cristina", "nom": "Cristina", "el": ["hada"], "info": "N\u00ba015 \u00b7 Sesi\u00f3n de moda de cuerpo entero", "forma": ""}, "s01-016": {"base": "cristina", "nom": "Cristina", "el": ["hada"], "info": "N\u00ba016 \u00b7 Contrapicado \u00e9pico", "forma": ""}, "s01-017": {"base": "cristina", "nom": "Cristina", "el": ["hada"], "info": "N\u00ba017 \u00b7 En Madrid", "forma": ""}, "s01-018": {"base": "cristina", "nom": "Cristina", "el": ["hada"], "info": "N\u00ba018 \u00b7 En una tienda Kiwoko", "forma": ""}, "s01-019": {"base": "cristina", "nom": "Cristina", "el": ["hada"], "info": "N\u00ba019 \u00b7 Paseando por la Gran V\u00eda de Madrid de noche", "forma": ""}, "s01-020": {"base": "cristina", "nom": "Cristina", "el": ["hada"], "info": "N\u00ba020 \u00b7 Tumbada en el suelo jugando con los tres gatos con una ca\u00f1a de plumas", "forma": ""}, "s01-021": {"base": "kurama", "nom": "Kurama", "el": ["fuego"], "info": "N\u00ba021 \u00b7 Salta a por algo", "forma": ""}, "s01-022": {"base": "kurama", "nom": "Kurama", "el": ["fuego"], "info": "N\u00ba022 \u00b7 Dormido hecho una bolita", "forma": ""}, "s01-023": {"base": "kurama", "nom": "Kurama", "el": ["fuego"], "info": "N\u00ba023 \u00b7 Asoma con las patas por el borde", "forma": ""}, "s01-024": {"base": "kurama", "nom": "Kurama", "el": ["fuego"], "info": "N\u00ba024 \u00b7 Primer plano de los ojos", "forma": ""}, "s01-025": {"base": "kurama", "nom": "Kurama", "el": ["fuego"], "info": "N\u00ba025 \u00b7 Sobre una roca con llamas", "forma": ""}, "s01-026": {"base": "kurama", "nom": "Kurama", "el": ["fuego"], "info": "N\u00ba026 \u00b7 Silueta en llamas", "forma": ""}, "s01-027": {"base": "kurama", "nom": "Kurama", "el": ["fuego"], "info": "N\u00ba027 \u00b7 Completamente tirado", "forma": ""}, "s01-028": {"base": "sukuna", "nom": "Sukuna", "el": ["siniestro"], "info": "N\u00ba028 \u00b7 Durmiendo raro", "forma": ""}, "s01-029": {"base": "sukuna", "nom": "Sukuna", "el": ["siniestro"], "info": "N\u00ba029 \u00b7 Debajo del ordenador", "forma": ""}, "s01-030": {"base": "sukuna", "nom": "Sukuna", "el": ["siniestro"], "info": "N\u00ba030 \u00b7 De pie sobre las patas traseras intentando llegar a la encimera", "forma": ""}, "s01-031": {"base": "sukuna", "nom": "Sukuna", "el": ["siniestro"], "info": "N\u00ba031 \u00b7 Mirando hacia arriba", "forma": ""}, "s01-032": {"base": "sukuna", "nom": "Sukuna", "el": ["siniestro"], "info": "N\u00ba032 \u00b7 Con una sart\u00e9n en la cabeza", "forma": ""}, "s01-033": {"base": "sukuna", "nom": "Sukuna", "el": ["siniestro"], "info": "N\u00ba033 \u00b7 Durmiendo panza arriba (en la c\u00f3smica", "forma": ""}, "s01-034": {"base": "sukuna", "nom": "Sukuna", "el": ["siniestro"], "info": "N\u00ba034 \u00b7 Close-up tumbado entre s\u00e1banas", "forma": ""}, "s01-035": {"base": "gyukki", "nom": "Gyukki", "el": ["psiquico"], "info": "N\u00ba035 \u00b7 Mira por encima del hombro", "forma": ""}, "s01-036": {"base": "gyukki", "nom": "Gyukki", "el": ["psiquico"], "info": "N\u00ba036 \u00b7 Dormida junto a la ventana", "forma": ""}, "s01-037": {"base": "gyukki", "nom": "Gyukki", "el": ["psiquico"], "info": "N\u00ba037 \u00b7 Salta hacia c\u00e1mara", "forma": ""}, "s01-038": {"base": "gyukki", "nom": "Gyukki", "el": ["psiquico"], "info": "N\u00ba038 \u00b7 Panza arriba vista desde arriba", "forma": ""}, "s01-039": {"base": "gyukki", "nom": "Gyukki", "el": ["psiquico"], "info": "N\u00ba039 \u00b7 Zarpazo de cristal", "forma": ""}, "s01-040": {"base": "gyukki", "nom": "Gyukki", "el": ["psiquico"], "info": "N\u00ba040 \u00b7 Contrapicado entre cristales", "forma": ""}, "s01-041": {"base": "gyukki", "nom": "Gyukki", "el": ["psiquico"], "info": "N\u00ba041 \u00b7 Comiendo de su comedero", "forma": ""}, "s01-042": {"base": "grupo", "nom": "Cristina & Kurama", "el": ["dragon"], "info": "N\u00ba042 \u00b7 Cristina con Kurama", "forma": "BOND"}, "s01-043": {"base": "grupo", "nom": "Cristina & Gyukki", "el": ["dragon"], "info": "N\u00ba043 \u00b7 Cristina con Gyukki", "forma": "BOND"}, "s01-044": {"base": "grupo", "nom": "Kurama & Gyukki", "el": ["dragon"], "info": "N\u00ba044 \u00b7 Dormidos juntos hechos una bola", "forma": "BOND"}, "s01-045": {"base": "grupo", "nom": "Los tres gatos", "el": ["dragon"], "info": "N\u00ba045 \u00b7 Los tres sentados en fila", "forma": "BOND"}, "s01-046": {"base": "grupo", "nom": "La familia", "el": ["dragon"], "info": "N\u00ba046 \u00b7 Foto de familia en el sof\u00e1", "forma": "BOND"}, "s01-047": {"base": "grupo", "nom": "Kurama & Sukuna", "el": ["dragon"], "info": "N\u00ba047 \u00b7 Kurama arriba en la encimera", "forma": "BOND"}, "s01-048": {"base": "grupo", "nom": "Alberto & Sukuna", "el": ["dragon"], "info": "N\u00ba048 \u00b7 Alberto con Sukuna en brazos", "forma": "BOND"}, "s01-049": {"nom": "El arenero", "clase": "Objeto", "hab": ["Limpieza a fondo", "Baraja tu pila de descarte en tu mazo. Cada 15 d\u00edas, obligatorio."], "lore": "Nadie lo quiere limpiar. Todos lo usan.", "el": ["comodin"]}, "s01-050": {"nom": "La malta", "clase": "Objeto", "hab": ["Fuera bolas de pelo", "Un gato recupera 30 de aura. Lo odia, pero funciona."], "lore": "Sabe a malta. Eso dicen.", "el": ["comodin"]}, "s01-051": {"nom": "El cepillo", "clase": "Objeto", "hab": ["Sesi\u00f3n de cepillado", "Quita un estado alterado a un gato. Con el pelo que sale, se teje otro."], "lore": "Cada pasada, un gato nuevo en el cepillo.", "el": ["comodin"]}, "s01-052": {"nom": "El sof\u00e1", "clase": "Lugar", "hab": ["El sitio bueno", "Mientras est\u00e9 en juego, los gatos no se pueden mover. Los humanos, tampoco."], "lore": "Tres plazas. Cinco ocupantes. Ninguna queja.", "el": ["comodin"]}, "s01-053": {"nom": "Manises", "clase": "Lugar", "hab": ["Pasa un avi\u00f3n", "Cada vez que pasa un avi\u00f3n, cada jugador roba 1 carta."], "lore": "Cer\u00e1mica, sol y el aeropuerto al lado.", "el": ["comodin"]}, "s01-054": {"nom": "La sart\u00e9n", "clase": "Objeto", "hab": ["La corona", "\u00danela a Sukuna: gana 50 de aura y nadie se r\u00ede. En voz alta."], "lore": "No es una sart\u00e9n. Es un s\u00edmbolo.", "el": ["comodin"]}, "s01-055": {"nom": "El rascador", "clase": "Objeto", "hab": ["El trono", "El gato que est\u00e1 aqu\u00ed no puede ser atacado por gatos m\u00e1s peque\u00f1os. O sea, a Sukuna nunca."], "lore": "Lo compraron para todos. Es de uno.", "el": ["comodin"]}, "s01-056": {"nom": "El comedero", "clase": "Objeto", "hab": ["Hora de comer", "Todos tus gatos pasan al puesto activo. Gyukki, la primera."], "lore": "El \u00fanico sitio de la casa con cola.", "el": ["comodin"]}, "s01-057": {"nom": "La encimera", "clase": "Lugar", "hab": ["Territorio prohibido", "Los gatos que suban aqu\u00ed vuelven a tu mano. Kurama vuelve a subir."], "lore": "Prohibido. Te\u00f3ricamente.", "el": ["comodin"]}, "s01-058": {"nom": "El escritorio", "clase": "Lugar", "hab": ["Turno de noche", "Roba 2 cartas. Este turno no puedes dormir."], "lore": "Aqu\u00ed se programa, y debajo duerme un Maine Coon.", "el": ["comodin"]}, "s01-059": {"nom": "La caja de sobres", "clase": "Objeto", "hab": ["Abre un sobre", "Mira las 5 primeras cartas de tu mazo y qu\u00e9date una."], "lore": "Siempre queda uno m\u00e1s por abrir.", "el": ["comodin"]}, "s01-060": {"nom": "Madrid", "clase": "Lugar", "hab": ["Con bocata", "Mientras Cristina est\u00e9 en juego, roba 1 carta m\u00e1s cada turno. Con bocata de calamares, 2."], "lore": "La otra casa.", "el": ["comodin"]}, "s01-061": {"base": "grupo", "nom": "Love of My Life", "el": ["dragon"], "info": "N\u00ba061 \u00b7 Love of My Life", "forma": "BOND"}}, "WS": {"s01-001": {"nv": 3, "coste": 2, "poder": "9500", "color": "#3b82f6", "rasgos": ["Gremory", "Casa"], "num": "001"}, "s01-002": {"nv": 3, "coste": 2, "poder": "9500", "color": "#3b82f6", "rasgos": ["Gremory", "Casa"], "num": "002"}, "s01-003": {"nv": 3, "coste": 2, "poder": "9500", "color": "#3b82f6", "rasgos": ["Gremory", "Casa"], "num": "003"}, "s01-004": {"nv": 3, "coste": 2, "poder": "9500", "color": "#3b82f6", "rasgos": ["Gremory", "Casa"], "num": "004"}, "s01-005": {"nv": 3, "coste": 2, "poder": "9500", "color": "#3b82f6", "rasgos": ["Gremory", "Casa"], "num": "005"}, "s01-006": {"nv": 3, "coste": 2, "poder": "9500", "color": "#3b82f6", "rasgos": ["Gremory", "Casa"], "num": "006"}, "s01-007": {"nv": 3, "coste": 2, "poder": "9500", "color": "#3b82f6", "rasgos": ["Gremory", "Casa"], "num": "007"}, "s01-008": {"nv": 3, "coste": 2, "poder": "9500", "color": "#3b82f6", "rasgos": ["Gremory", "Casa"], "num": "008"}, "s01-009": {"nv": 3, "coste": 2, "poder": "9500", "color": "#3b82f6", "rasgos": ["Gremory", "Casa"], "num": "009"}, "s01-010": {"nv": 3, "coste": 2, "poder": "9500", "color": "#3b82f6", "rasgos": ["Gremory", "Casa"], "num": "010"}, "s01-011": {"nv": 3, "coste": 2, "poder": "9500", "color": "#ec4899", "rasgos": ["Gremory", "Casa"], "num": "011"}, "s01-012": {"nv": 3, "coste": 2, "poder": "9500", "color": "#ec4899", "rasgos": ["Gremory", "Casa"], "num": "012"}, "s01-013": {"nv": 3, "coste": 2, "poder": "9500", "color": "#ec4899", "rasgos": ["Gremory", "Casa"], "num": "013"}, "s01-014": {"nv": 3, "coste": 2, "poder": "9500", "color": "#ec4899", "rasgos": ["Gremory", "Casa"], "num": "014"}, "s01-015": {"nv": 3, "coste": 2, "poder": "9500", "color": "#ec4899", "rasgos": ["Gremory", "Casa"], "num": "015"}, "s01-016": {"nv": 3, "coste": 2, "poder": "9500", "color": "#ec4899", "rasgos": ["Gremory", "Casa"], "num": "016"}, "s01-017": {"nv": 3, "coste": 2, "poder": "9500", "color": "#ec4899", "rasgos": ["Gremory", "Casa"], "num": "017"}, "s01-018": {"nv": 3, "coste": 2, "poder": "9500", "color": "#ec4899", "rasgos": ["Gremory", "Casa"], "num": "018"}, "s01-019": {"nv": 3, "coste": 2, "poder": "9500", "color": "#ec4899", "rasgos": ["Gremory", "Casa"], "num": "019"}, "s01-020": {"nv": 3, "coste": 2, "poder": "9500", "color": "#ec4899", "rasgos": ["Gremory", "Casa"], "num": "020"}, "s01-021": {"nv": 2, "coste": 1, "poder": "7000", "color": "#f97316", "rasgos": ["Gato", "Naranja"], "num": "021"}, "s01-022": {"nv": 2, "coste": 1, "poder": "7000", "color": "#f97316", "rasgos": ["Gato", "Naranja"], "num": "022"}, "s01-023": {"nv": 2, "coste": 1, "poder": "7000", "color": "#f97316", "rasgos": ["Gato", "Naranja"], "num": "023"}, "s01-024": {"nv": 2, "coste": 1, "poder": "7000", "color": "#f97316", "rasgos": ["Gato", "Naranja"], "num": "024"}, "s01-025": {"nv": 2, "coste": 1, "poder": "7000", "color": "#f97316", "rasgos": ["Gato", "Naranja"], "num": "025"}, "s01-026": {"nv": 2, "coste": 1, "poder": "7000", "color": "#f97316", "rasgos": ["Gato", "Naranja"], "num": "026"}, "s01-027": {"nv": 2, "coste": 1, "poder": "7000", "color": "#f97316", "rasgos": ["Gato", "Naranja"], "num": "027"}, "s01-028": {"nv": 2, "coste": 1, "poder": "7000", "color": "#b91c1c", "rasgos": ["Gato", "Maine Coon"], "num": "028"}, "s01-029": {"nv": 2, "coste": 1, "poder": "7000", "color": "#b91c1c", "rasgos": ["Gato", "Maine Coon"], "num": "029"}, "s01-030": {"nv": 2, "coste": 1, "poder": "7000", "color": "#b91c1c", "rasgos": ["Gato", "Maine Coon"], "num": "030"}, "s01-031": {"nv": 2, "coste": 1, "poder": "7000", "color": "#b91c1c", "rasgos": ["Gato", "Maine Coon"], "num": "031"}, "s01-032": {"nv": 2, "coste": 1, "poder": "7000", "color": "#b91c1c", "rasgos": ["Gato", "Maine Coon"], "num": "032"}, "s01-033": {"nv": 2, "coste": 1, "poder": "7000", "color": "#b91c1c", "rasgos": ["Gato", "Maine Coon"], "num": "033"}, "s01-034": {"nv": 2, "coste": 1, "poder": "7000", "color": "#b91c1c", "rasgos": ["Gato", "Maine Coon"], "num": "034"}, "s01-035": {"nv": 2, "coste": 1, "poder": "7000", "color": "#8b5cf6", "rasgos": ["Gato", "Siamesa"], "num": "035"}, "s01-036": {"nv": 2, "coste": 1, "poder": "7000", "color": "#8b5cf6", "rasgos": ["Gato", "Siamesa"], "num": "036"}, "s01-037": {"nv": 2, "coste": 1, "poder": "7000", "color": "#8b5cf6", "rasgos": ["Gato", "Siamesa"], "num": "037"}, "s01-038": {"nv": 2, "coste": 1, "poder": "7000", "color": "#8b5cf6", "rasgos": ["Gato", "Siamesa"], "num": "038"}, "s01-039": {"nv": 2, "coste": 1, "poder": "7000", "color": "#8b5cf6", "rasgos": ["Gato", "Siamesa"], "num": "039"}, "s01-040": {"nv": 2, "coste": 1, "poder": "7000", "color": "#8b5cf6", "rasgos": ["Gato", "Siamesa"], "num": "040"}, "s01-041": {"nv": 2, "coste": 1, "poder": "7000", "color": "#8b5cf6", "rasgos": ["Gato", "Siamesa"], "num": "041"}, "s01-042": {"nv": 2, "coste": 1, "poder": "7000", "color": "#c9a227", "rasgos": ["Familia", "Casa"], "num": "042"}, "s01-043": {"nv": 2, "coste": 1, "poder": "7000", "color": "#c9a227", "rasgos": ["Familia", "Casa"], "num": "043"}, "s01-044": {"nv": 2, "coste": 1, "poder": "7000", "color": "#c9a227", "rasgos": ["Familia", "Casa"], "num": "044"}, "s01-045": {"nv": 2, "coste": 1, "poder": "7000", "color": "#c9a227", "rasgos": ["Familia", "Casa"], "num": "045"}, "s01-046": {"nv": 2, "coste": 1, "poder": "7000", "color": "#c9a227", "rasgos": ["Familia", "Casa"], "num": "046"}, "s01-047": {"nv": 2, "coste": 1, "poder": "7000", "color": "#c9a227", "rasgos": ["Familia", "Casa"], "num": "047"}, "s01-048": {"nv": 2, "coste": 1, "poder": "7000", "color": "#c9a227", "rasgos": ["Familia", "Casa"], "num": "048"}, "s01-049": {"num": "049"}, "s01-050": {"num": "050"}, "s01-051": {"num": "051"}, "s01-052": {"num": "052"}, "s01-053": {"num": "053"}, "s01-054": {"num": "054"}, "s01-055": {"num": "055"}, "s01-056": {"num": "056"}, "s01-057": {"num": "057"}, "s01-058": {"num": "058"}, "s01-059": {"num": "059"}, "s01-060": {"num": "060"}, "s01-061": {"nv": 3, "coste": 2, "poder": "9500", "color": "#c9a227", "rasgos": ["Familia", "Casa"], "num": "061"}}, "WSELLO": {"s01-004": [{"t": "firma", "q": "alberto", "x": 0.3, "y": 0.52, "s": 58, "rot": -8}], "s01-014": [{"t": "firma", "q": "cristina", "x": 0.3, "y": 0.52, "s": 58, "rot": -8}], "s01-024": [{"t": "huella", "x": 0.62, "y": 0.54, "s": 18, "rot": -14}], "s01-031": [{"t": "huella", "x": 0.62, "y": 0.54, "s": 18, "rot": -14}], "s01-038": [{"t": "huella", "x": 0.62, "y": 0.54, "s": 18, "rot": -14}]}, "GSELLO": {"s01-006": [{"t": "firma", "q": "alberto", "x": 0.38, "y": 0.6, "s": 50, "rot": -9}], "s01-016": [{"t": "firma", "q": "cristina", "x": 0.38, "y": 0.6, "s": 50, "rot": -9}]}, "ART": {"s01-001": {"est": {"fondo": "IMG:s01-001-alberto-estandar-fondo.webp", "pj": "IMG:s01-001-alberto-estandar-pj.webp", "bb": [0.115, 0.265, 0.8758333333333334, 1.0], "asp": 1.5}}, "s01-002": {"full": {"fondo": "IMG:s01-002-alberto-grabada-fondo.webp", "pj": "IMG:s01-002-alberto-grabada-pj.webp", "bb": [0.325, 0.13, 0.67375, 0.55], "asp": 0.6666666666666666}}, "s01-003": {"esc": {"fondo": "IMG:s01-003-alberto-escapada-fondo.webp", "pj": "IMG:s01-003-alberto-escapada-pj.webp", "bb": [0.1455078125, 0.2490234375, 0.853515625, 0.87890625], "asp": 1.0}}, "s01-004": {"firma": {"fondo": "IMG:s01-004-alberto-firmada-fondo.webp", "pj": "IMG:s01-004-alberto-firmada-pj.webp", "bb": [0.07125, 0.0175, 0.75125, 0.7775], "asp": 0.6666666666666666}}, "s01-005": {"oro": {"fondo": "IMG:s01-005-alberto-oro-fondo.webp", "pj": "IMG:s01-005-alberto-oro-pj.webp", "bb": [0.1725, 0.1525, 0.82625, 0.7941666666666667], "asp": 0.6666666666666666}}, "s01-006": {"gre": {"pj": "IMG:s01-006-alberto-gremory-pj.webp", "g1": "IMG:s01-006-alberto-gremory-obsidiana.webp", "g2": "IMG:s01-006-alberto-gremory-cosmica.webp", "bb": [0.2512690355329949, 0.1407142857142857, 0.7474619289340102, 0.7771428571428571], "asp": 0.5628571428571428}}, "s01-007": {"est": {"fondo": "IMG:s01-007-alberto-estandar-fondo.webp", "pj": "IMG:s01-007-alberto-estandar-pj.webp", "bb": [0.2625, 0.1, 0.8441666666666666, 1.0], "asp": 1.5}}, "s01-008": {"est": {"fondo": "IMG:s01-008-alberto-estandar-fondo.webp", "pj": "IMG:s01-008-alberto-estandar-pj.webp", "bb": [0.2683333333333333, 0.0525, 0.7616666666666667, 0.72], "asp": 1.5}}, "s01-009": {"est": {"fondo": "IMG:s01-009-alberto-estandar-fondo.webp", "pj": "IMG:s01-009-alberto-estandar-pj.webp", "bb": [0.24833333333333332, 0.14375, 0.745, 0.82875], "asp": 1.5}}, "s01-010": {"est": {"fondo": "IMG:s01-010-alberto-estandar-fondo.webp", "pj": "IMG:s01-010-alberto-estandar-pj.webp", "bb": [0.29333333333333333, 0.04625, 0.7025, 0.65], "asp": 1.5}}, "s01-011": {"est": {"fondo": "IMG:s01-011-cristina-estandar-fondo.webp", "pj": "IMG:s01-011-cristina-estandar-pj.webp", "bb": [0.15166666666666667, 0.045, 0.8475, 0.7375], "asp": 1.5}}, "s01-012": {"full": {"fondo": "IMG:s01-012-cristina-grabada-fondo.webp", "pj": "IMG:s01-012-cristina-grabada-pj.webp", "bb": [0.15875, 0.11333333333333333, 0.84375, 0.5633333333333334], "asp": 0.6666666666666666}}, "s01-013": {"esc": {"fondo": "IMG:s01-013-cristina-escapada-fondo.webp", "pj": "IMG:s01-013-cristina-escapada-pj.webp", "bb": [0.2216796875, 0.2587890625, 0.7783203125, 0.87890625], "asp": 1.0}}, "s01-014": {"firma": {"fondo": "IMG:s01-014-cristina-firmada-fondo.webp", "pj": "IMG:s01-014-cristina-firmada-pj.webp", "bb": [0.0175, 0.0025, 1.0, 1.0], "asp": 0.6666666666666666}}, "s01-015": {"oro": {"fondo": "IMG:s01-015-cristina-oro-fondo.webp", "pj": "IMG:s01-015-cristina-oro-pj.webp", "bb": [0.33875, 0.11666666666666667, 0.66, 0.7583333333333333], "asp": 0.6666666666666666}}, "s01-016": {"gre": {"pj": "IMG:s01-016-cristina-gremory-pj.webp", "g1": "IMG:s01-016-cristina-gremory-obsidiana.webp", "g2": "IMG:s01-016-cristina-gremory-cosmica.webp", "bb": [0.1967005076142132, 0.1407142857142857, 0.8020304568527918, 0.7778571428571428], "asp": 0.5628571428571428}}, "s01-017": {"est": {"fondo": "IMG:s01-017-cristina-estandar-fondo.webp", "pj": "IMG:s01-017-cristina-estandar-pj.webp", "bb": [0.32666666666666666, 0.1025, 0.6725, 0.68625], "asp": 1.5}}, "s01-018": {"est": {"fondo": "IMG:s01-018-cristina-estandar-fondo.webp", "pj": "IMG:s01-018-cristina-estandar-pj.webp", "bb": [0.08416666666666667, 0.045, 0.8416666666666667, 1.0], "asp": 1.5}}, "s01-019": {"est": {"fondo": "IMG:s01-019-cristina-estandar-fondo.webp", "pj": "IMG:s01-019-cristina-estandar-pj.webp", "bb": [0.28, 0.0825, 0.72, 1.0], "asp": 1.5}}, "s01-020": {"est": {"fondo": "IMG:s01-020-cristina-estandar-fondo.webp", "pj": "IMG:s01-020-cristina-estandar-pj.webp", "bb": [0.17, 0.05875, 0.9116666666666666, 0.75], "asp": 1.5}}, "s01-021": {"est": {"fondo": "IMG:s01-021-kurama-estandar-fondo.webp", "pj": "IMG:s01-021-kurama-estandar-pj.webp", "bb": [0.1075, 0.14375, 0.7325, 0.82125], "asp": 1.5}}, "s01-022": {"full": {"fondo": "IMG:s01-022-kurama-grabada-fondo.webp", "pj": "IMG:s01-022-kurama-grabada-pj.webp", "bb": [0.27375, 0.2675, 0.74125, 0.5533333333333333], "asp": 0.6666666666666666}}, "s01-023": {"esc": {"fondo": "IMG:s01-023-kurama-escapada-fondo.webp", "pj": "IMG:s01-023-kurama-escapada-pj.webp", "bb": [0.2978515625, 0.2587890625, 0.701171875, 0.87890625], "asp": 1.0}}, "s01-024": {"firma": {"fondo": "IMG:s01-024-kurama-firmada-fondo.webp", "pj": "IMG:s01-024-kurama-firmada-pj.webp", "bb": [0.32125, 0.0975, 0.68, 0.44916666666666666], "asp": 0.6666666666666666}}, "s01-025": {"oro": {"fondo": "IMG:s01-025-kurama-oro-fondo.webp", "pj": "IMG:s01-025-kurama-oro-pj.webp", "bb": [0.24875, 0.15333333333333332, 0.90625, 0.7941666666666667], "asp": 0.6666666666666666}}, "s01-026": {"gre": {"pj": "IMG:s01-026-kurama-gremory-pj.webp", "g1": "IMG:s01-026-kurama-gremory-obsidiana.webp", "g2": "IMG:s01-026-kurama-gremory-cosmica.webp", "bb": [0.11928934010152284, 0.1407142857142857, 0.883248730964467, 0.7771428571428571], "asp": 0.5628571428571428}}, "s01-027": {"est": {"fondo": "IMG:s01-027-kurama-estandar-fondo.webp", "pj": "IMG:s01-027-kurama-estandar-pj.webp", "bb": [0.305, 0.0825, 0.6966666666666667, 0.75], "asp": 1.5}}, "s01-028": {"est": {"fondo": "IMG:s01-028-sukuna-estandar-fondo.webp", "pj": "IMG:s01-028-sukuna-estandar-pj.webp", "bb": [0.3425, 0.0975, 0.6066666666666667, 0.835], "asp": 1.5}}, "s01-029": {"full": {"fondo": "IMG:s01-029-sukuna-grabada-fondo.webp", "pj": "IMG:s01-029-sukuna-grabada-pj.webp", "bb": [0.19875, 0.27666666666666667, 0.855, 0.5408333333333334], "asp": 0.6666666666666666}}, "s01-030": {"esc": {"fondo": "IMG:s01-030-sukuna-escapada-fondo.webp", "pj": "IMG:s01-030-sukuna-escapada-pj.webp", "bb": [0.2392578125, 0.25, 0.76171875, 0.87890625], "asp": 1.0}}, "s01-031": {"firma": {"fondo": "IMG:s01-031-sukuna-firmada-fondo.webp", "pj": "IMG:s01-031-sukuna-firmada-pj.webp", "bb": [0.12, 0.2966666666666667, 0.88125, 0.7908333333333334], "asp": 0.6666666666666666}}, "s01-032": {"oro": {"fondo": "IMG:s01-032-sukuna-oro-fondo.webp", "pj": "IMG:s01-032-sukuna-oro-pj.webp", "bb": [0.1275, 0.15583333333333332, 0.9225, 0.7491666666666666], "asp": 0.6666666666666666}}, "s01-033": {"gre": {"pj": "IMG:s01-033-sukuna-gremory-pj.webp", "g1": "IMG:s01-033-sukuna-gremory-obsidiana.webp", "g2": "IMG:s01-033-sukuna-gremory-cosmica.webp", "bb": [0.10532994923857868, 0.3, 0.8946700507614214, 0.7771428571428571], "asp": 0.5628571428571428}}, "s01-034": {"est": {"fondo": "IMG:s01-034-sukuna-estandar-fondo.webp", "pj": "IMG:s01-034-sukuna-estandar-pj.webp", "bb": [0.0, 0.04625, 0.7216666666666667, 1.0], "asp": 1.5}}, "s01-035": {"est": {"fondo": "IMG:s01-035-gyukki-estandar-fondo.webp", "pj": "IMG:s01-035-gyukki-estandar-pj.webp", "bb": [0.29833333333333334, 0.045, 0.6991666666666667, 0.95625], "asp": 1.5}}, "s01-036": {"full": {"fondo": "IMG:s01-036-gyukki-grabada-fondo.webp", "pj": "IMG:s01-036-gyukki-grabada-pj.webp", "bb": [0.07125, 0.15, 0.9275, 0.5508333333333333], "asp": 0.6666666666666666}}, "s01-037": {"esc": {"fondo": "IMG:s01-037-gyukki-escapada-fondo.webp", "pj": "IMG:s01-037-gyukki-escapada-pj.webp", "bb": [0.1806640625, 0.3212890625, 0.8193359375, 0.8798828125], "asp": 1.0}}, "s01-038": {"firma": {"fondo": "IMG:s01-038-gyukki-firmada-fondo.webp", "pj": "IMG:s01-038-gyukki-firmada-pj.webp", "bb": [0.38625, 0.1075, 0.72625, 0.515], "asp": 0.6666666666666666}}, "s01-039": {"oro": {"fondo": "IMG:s01-039-gyukki-oro-fondo.webp", "pj": "IMG:s01-039-gyukki-oro-pj.webp", "bb": [0.14875, 0.1525, 0.85, 0.7941666666666667], "asp": 0.6666666666666666}}, "s01-040": {"gre": {"pj": "IMG:s01-040-gyukki-gremory-pj.webp", "g1": "IMG:s01-040-gyukki-gremory-obsidiana.webp", "g2": "IMG:s01-040-gyukki-gremory-cosmica.webp", "bb": [0.10406091370558376, 0.19357142857142856, 0.8959390862944162, 0.7778571428571428], "asp": 0.5628571428571428}}, "s01-041": {"est": {"fondo": "IMG:s01-041-gyukki-estandar-fondo.webp", "pj": "IMG:s01-041-gyukki-estandar-pj.webp", "bb": [0.14416666666666667, 0.14875, 0.8675, 0.70375], "asp": 1.5}}, "s01-042": {"est": {"fondo": "IMG:s01-042-cristina-kurama-estandar-fondo.webp", "pj": "IMG:s01-042-cristina-kurama-estandar-pj.webp", "bb": [0.2733333333333333, 0.1675, 0.8208333333333333, 1.0], "asp": 1.5}}, "s01-043": {"est": {"fondo": "IMG:s01-043-cristina-gyukki-estandar-fondo.webp", "pj": "IMG:s01-043-cristina-gyukki-estandar-pj.webp", "bb": [0.2425, 0.07875, 0.7583333333333333, 0.80875], "asp": 1.5}}, "s01-044": {"est": {"fondo": "IMG:s01-044-kurama-gyukki-estandar-fondo.webp", "pj": "IMG:s01-044-kurama-gyukki-estandar-pj.webp", "bb": [0.25, 0.17125, 0.7508333333333334, 0.65], "asp": 1.5}}, "s01-045": {"est": {"fondo": "IMG:s01-045-kurama-sukuna-gyukki-estandar-fondo.webp", "pj": "IMG:s01-045-kurama-sukuna-gyukki-estandar-pj.webp", "bb": [0.21666666666666667, 0.0625, 0.7833333333333333, 0.68125], "asp": 1.5}}, "s01-046": {"est": {"fondo": "IMG:s01-046-familia-estandar-fondo.webp", "pj": "IMG:s01-046-familia-estandar-pj.webp", "bb": [0.11666666666666667, 0.08875, 0.8708333333333333, 1.0], "asp": 1.5}}, "s01-047": {"est": {"fondo": "IMG:s01-047-kurama-sukuna-estandar-fondo.webp", "pj": "IMG:s01-047-kurama-sukuna-estandar-pj.webp", "bb": [0.33166666666666667, 0.0975, 0.8933333333333333, 0.88], "asp": 1.5}}, "s01-048": {"est": {"fondo": "IMG:s01-048-alberto-sukuna-estandar-fondo.webp", "pj": "IMG:s01-048-alberto-sukuna-estandar-pj.webp", "bb": [0.09916666666666667, 0.04375, 0.9008333333333334, 1.0], "asp": 1.5}}, "s01-049": {"casa": "IMG:s01-049-casa.webp"}, "s01-050": {"casa": "IMG:s01-050-casa.webp"}, "s01-051": {"casa": "IMG:s01-051-casa.webp"}, "s01-052": {"casa": "IMG:s01-052-casa.webp"}, "s01-053": {"casa": "IMG:s01-053-casa.webp"}, "s01-054": {"casa": "IMG:s01-054-casa.webp"}, "s01-055": {"casa": "IMG:s01-055-casa.webp"}, "s01-056": {"casa": "IMG:s01-056-casa.webp"}, "s01-057": {"casa": "IMG:s01-057-casa.webp"}, "s01-058": {"casa": "IMG:s01-058-casa.webp"}, "s01-059": {"casa": "IMG:s01-059-casa.webp"}, "s01-060": {"casa": "IMG:s01-060-casa.webp"}, "s01-061": {"full": {"fondo": "IMG:s01-061-alberto-cristina-grabada-fondo.webp", "pj": "IMG:s01-061-alberto-cristina-grabada-pj.webp", "bb": [0.1075, 0.2791666666666667, 0.8925, 0.595], "asp": 0.6666666666666666}}}, "IMG": {}, "SETT": {"s01-001": "Est\u00e1ndar", "s01-002": "Grabada", "s01-003": "Escapada", "s01-004": "Firmada", "s01-005": "Oro", "s01-006": "Gremory", "s01-007": "Est\u00e1ndar", "s01-008": "Est\u00e1ndar", "s01-009": "Est\u00e1ndar", "s01-010": "Est\u00e1ndar", "s01-011": "Est\u00e1ndar", "s01-012": "Grabada", "s01-013": "Escapada", "s01-014": "Firmada", "s01-015": "Oro", "s01-016": "Gremory", "s01-017": "Est\u00e1ndar", "s01-018": "Est\u00e1ndar", "s01-019": "Est\u00e1ndar", "s01-020": "Est\u00e1ndar", "s01-021": "Est\u00e1ndar", "s01-022": "Grabada", "s01-023": "Escapada", "s01-024": "Firmada", "s01-025": "Oro", "s01-026": "Gremory", "s01-027": "Est\u00e1ndar", "s01-028": "Est\u00e1ndar", "s01-029": "Grabada", "s01-030": "Escapada", "s01-031": "Firmada", "s01-032": "Oro", "s01-033": "Gremory", "s01-034": "Est\u00e1ndar", "s01-035": "Est\u00e1ndar", "s01-036": "Grabada", "s01-037": "Escapada", "s01-038": "Firmada", "s01-039": "Oro", "s01-040": "Gremory", "s01-041": "Est\u00e1ndar", "s01-042": "Est\u00e1ndar", "s01-043": "Est\u00e1ndar", "s01-044": "Est\u00e1ndar", "s01-045": "Est\u00e1ndar", "s01-046": "Est\u00e1ndar", "s01-047": "Est\u00e1ndar", "s01-048": "Est\u00e1ndar", "s01-049": "Casa", "s01-050": "Casa", "s01-051": "Casa", "s01-052": "Casa", "s01-053": "Casa", "s01-054": "Casa", "s01-055": "Casa", "s01-056": "Casa", "s01-057": "Casa", "s01-058": "Casa", "s01-059": "Casa", "s01-060": "Casa", "s01-061": "Grabada"}, "BASEF": {"sukuna": {"nom": "Sukuna", "forma": "NOVA", "clase": "Familiar", "el": ["siniestro"], "aura": 220, "hab": ["Rey de la casa", "Si tiene una sart\u00e9n unida, el rival no puede retirarse. Nadie se atreve a dec\u00edrselo."], "atq": [["siniestro", "siniestro", "comodin"], "Peso pesado", "160", "Si est\u00e1 durmiendo en una postura imposible, este ataque no se puede evitar."], "deb": ["hada", "\u00d72"], "agu": ["psiquico", "\u221230"], "siesta": 4, "lore": "El m\u00e1s grande de la casa. Y lo sabe."}}, "LISTA": [{"id": "s01-001", "n": "001", "ok": true, "t": "Alberto \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-001.webp"}, {"id": "s01-002", "n": "002", "ok": true, "t": "Alberto \u00b7 Grabada", "th": "IMG:s01-th-002.webp"}, {"id": "s01-003", "n": "003", "ok": true, "t": "Alberto \u00b7 Escapada", "th": "IMG:s01-th-003.webp"}, {"id": "s01-004", "n": "004", "ok": true, "t": "Alberto \u00b7 Firmada", "th": "IMG:s01-th-004.webp"}, {"id": "s01-005", "n": "005", "ok": true, "t": "Alberto \u00b7 Oro", "th": "IMG:s01-th-005.webp"}, {"id": "s01-006", "n": "006", "ok": true, "t": "Alberto \u00b7 Gremory", "th": "IMG:s01-th-006.webp"}, {"id": "s01-007", "n": "007", "ok": true, "t": "Alberto \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-007.webp"}, {"id": "s01-008", "n": "008", "ok": true, "t": "Alberto \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-008.webp"}, {"id": "s01-009", "n": "009", "ok": true, "t": "Alberto \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-009.webp"}, {"id": "s01-010", "n": "010", "ok": true, "t": "Alberto \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-010.webp"}, {"id": "s01-011", "n": "011", "ok": true, "t": "Cristina \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-011.webp"}, {"id": "s01-012", "n": "012", "ok": true, "t": "Cristina \u00b7 Grabada", "th": "IMG:s01-th-012.webp"}, {"id": "s01-013", "n": "013", "ok": true, "t": "Cristina \u00b7 Escapada", "th": "IMG:s01-th-013.webp"}, {"id": "s01-014", "n": "014", "ok": true, "t": "Cristina \u00b7 Firmada", "th": "IMG:s01-th-014.webp"}, {"id": "s01-015", "n": "015", "ok": true, "t": "Cristina \u00b7 Oro", "th": "IMG:s01-th-015.webp"}, {"id": "s01-016", "n": "016", "ok": true, "t": "Cristina \u00b7 Gremory", "th": "IMG:s01-th-016.webp"}, {"id": "s01-017", "n": "017", "ok": true, "t": "Cristina \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-017.webp"}, {"id": "s01-018", "n": "018", "ok": true, "t": "Cristina \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-018.webp"}, {"id": "s01-019", "n": "019", "ok": true, "t": "Cristina \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-019.webp"}, {"id": "s01-020", "n": "020", "ok": true, "t": "Cristina \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-020.webp"}, {"id": "s01-021", "n": "021", "ok": true, "t": "Kurama \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-021.webp"}, {"id": "s01-022", "n": "022", "ok": true, "t": "Kurama \u00b7 Grabada", "th": "IMG:s01-th-022.webp"}, {"id": "s01-023", "n": "023", "ok": true, "t": "Kurama \u00b7 Escapada", "th": "IMG:s01-th-023.webp"}, {"id": "s01-024", "n": "024", "ok": true, "t": "Kurama \u00b7 Firmada", "th": "IMG:s01-th-024.webp"}, {"id": "s01-025", "n": "025", "ok": true, "t": "Kurama \u00b7 Oro", "th": "IMG:s01-th-025.webp"}, {"id": "s01-026", "n": "026", "ok": true, "t": "Kurama \u00b7 Gremory", "th": "IMG:s01-th-026.webp"}, {"id": "s01-027", "n": "027", "ok": true, "t": "Kurama \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-027.webp"}, {"id": "s01-028", "n": "028", "ok": true, "t": "Sukuna \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-028.webp"}, {"id": "s01-029", "n": "029", "ok": true, "t": "Sukuna \u00b7 Grabada", "th": "IMG:s01-th-029.webp"}, {"id": "s01-030", "n": "030", "ok": true, "t": "Sukuna \u00b7 Escapada", "th": "IMG:s01-th-030.webp"}, {"id": "s01-031", "n": "031", "ok": true, "t": "Sukuna \u00b7 Firmada", "th": "IMG:s01-th-031.webp"}, {"id": "s01-032", "n": "032", "ok": true, "t": "Sukuna \u00b7 Oro", "th": "IMG:s01-th-032.webp"}, {"id": "s01-033", "n": "033", "ok": true, "t": "Sukuna \u00b7 Gremory", "th": "IMG:s01-th-033.webp"}, {"id": "s01-034", "n": "034", "ok": true, "t": "Sukuna \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-034.webp"}, {"id": "s01-035", "n": "035", "ok": true, "t": "Gyukki \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-035.webp"}, {"id": "s01-036", "n": "036", "ok": true, "t": "Gyukki \u00b7 Grabada", "th": "IMG:s01-th-036.webp"}, {"id": "s01-037", "n": "037", "ok": true, "t": "Gyukki \u00b7 Escapada", "th": "IMG:s01-th-037.webp"}, {"id": "s01-038", "n": "038", "ok": true, "t": "Gyukki \u00b7 Firmada", "th": "IMG:s01-th-038.webp"}, {"id": "s01-039", "n": "039", "ok": true, "t": "Gyukki \u00b7 Oro", "th": "IMG:s01-th-039.webp"}, {"id": "s01-040", "n": "040", "ok": true, "t": "Gyukki \u00b7 Gremory", "th": "IMG:s01-th-040.webp"}, {"id": "s01-041", "n": "041", "ok": true, "t": "Gyukki \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-041.webp"}, {"id": "s01-042", "n": "042", "ok": true, "t": "Cristina & Kurama \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-042.webp"}, {"id": "s01-043", "n": "043", "ok": true, "t": "Cristina & Gyukki \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-043.webp"}, {"id": "s01-044", "n": "044", "ok": true, "t": "Kurama & Gyukki \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-044.webp"}, {"id": "s01-045", "n": "045", "ok": true, "t": "Los tres gatos \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-045.webp"}, {"id": "s01-046", "n": "046", "ok": true, "t": "La familia \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-046.webp"}, {"id": "s01-047", "n": "047", "ok": true, "t": "Kurama & Sukuna \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-047.webp"}, {"id": "s01-048", "n": "048", "ok": true, "t": "Alberto & Sukuna \u00b7 Est\u00e1ndar", "th": "IMG:s01-th-048.webp"}, {"id": "s01-049", "n": "049", "ok": true, "t": "El arenero", "th": "IMG:s01-th-049.webp"}, {"id": "s01-050", "n": "050", "ok": true, "t": "La malta", "th": "IMG:s01-th-050.webp"}, {"id": "s01-051", "n": "051", "ok": true, "t": "El cepillo", "th": "IMG:s01-th-051.webp"}, {"id": "s01-052", "n": "052", "ok": true, "t": "El sof\u00e1", "th": "IMG:s01-th-052.webp"}, {"id": "s01-053", "n": "053", "ok": true, "t": "Manises", "th": "IMG:s01-th-053.webp"}, {"id": "s01-054", "n": "054", "ok": true, "t": "La sart\u00e9n", "th": "IMG:s01-th-054.webp"}, {"id": "s01-055", "n": "055", "ok": true, "t": "El rascador", "th": "IMG:s01-th-055.webp"}, {"id": "s01-056", "n": "056", "ok": true, "t": "El comedero", "th": "IMG:s01-th-056.webp"}, {"id": "s01-057", "n": "057", "ok": true, "t": "La encimera", "th": "IMG:s01-th-057.webp"}, {"id": "s01-058", "n": "058", "ok": true, "t": "El escritorio", "th": "IMG:s01-th-058.webp"}, {"id": "s01-059", "n": "059", "ok": true, "t": "La caja de sobres", "th": "IMG:s01-th-059.webp"}, {"id": "s01-060", "n": "060", "ok": true, "t": "Madrid", "th": "IMG:s01-th-060.webp"}, {"id": "s01-061", "n": "061", "ok": true, "t": "Love of My Life \u00b7 Grabada", "th": "IMG:s01-th-061.webp"}]};
VERS.CASA = {n:"Casa", s:"e1"};
Object.assign(CARTAS, D1.CARTAS); Object.assign(WS, D1.WS); Object.assign(WSELLO, D1.WSELLO); Object.assign(GSELLO, D1.GSELLO); Object.assign(ART, D1.ART);
const BF = {alberto:FICHA.alberto, cristina:FICHA.cristina, kurama:FICHA["kurama-ex"], gyukki:FICHA["gyukki-ex"], sukuna:D1.BASEF.sukuna, grupo:FICHA["kurama-gyukki-vstar"]};
for(const id in D1.FICHA){
  const f = D1.FICHA[id];
  if(f.base){ const b = BF[f.base]; FICHA[id] = Object.assign({}, b, {nom:f.nom, el:f.el, info:f.info, forma:f.forma || b.forma, op:"50% 50%"}); delete FICHA[id].enc; }
  else FICHA[id] = f;
}
for(const id in D1.CARTAS) IMG[id] = {arte:(D1.LISTA.find(e => e.id === id) || {}).th};
function versiones(id){
  return {"Estándar":["R","RH","RR"], "Grabada":["SR"], "Escapada":["OFR"], "Firmada":["SP"], "Oro":["HR"], "Gremory":["G1","G2"], "Casa":["CASA"]}[D1.SETT[id]];
}
/* Casa: el dibujo en un cuadro entre la cabecera y el texto, encuadrado en el objeto; detrás, el mismo dibujo desenfocado */
const CASA_FOCO = {"049":.40, "050":.38, "051":.34, "052":.36, "053":.42, "054":.36, "055":.40, "056":.38, "057":.33, "058":.40, "059":.37, "060":.45};
function cartaCasa(id){
  const f = FICHA[id], src = ART[id].casa, n = WS[id].num;
  /* cuadro: 90 % de ancho, del 15 % al 75 % de alto; la imagen 2:3 se ve al ancho y se encuadra en vertical */
  const v = (.60*1019) / (.90*720*1.5), fy = CASA_FOCO[n] ?? .4, p = Math.max(0, Math.min(1, (fy - v/2) / (1 - v)));
  let h = '<div class="carta casa" data-rarity="rare holo" data-supertype="trainer" data-subtypes="item" style="--el:#c9a227">';
  h += '<div class="casa-amb"><img src="' + src + '" alt=""></div>';
  h += '<div class="casa-ven"><img src="' + src + '" alt="" style="object-position:50% ' + (p*100).toFixed(1) + '%"></div>';
  h += '<div class="casa-cab"><em>' + f.clase + '</em><b>' + f.nom + '</b></div>';
  h += '<div class="casa-panel"><p class="casa-ef"><b>' + f.hab[0] + '.</b> ' + f.hab[1] + '</p><p class="casa-lore">' + f.lore + '</p>' +
       '<div class="casa-pie"><span>GRM · S01 · ' + n + '/060</span><span>Illus. Casa Gremory</span></div></div>';
  return h + '<div class="card__glare"></div></div>';
}


/* ── la luz: con el ratón sigue al puntero; en el móvil, el giroscopio; si no, un vaivén suave ── */
const RS = document.documentElement.style;
const cl = (v, a, b) => Math.max(a, Math.min(b, v)), aj = (v, a, b, c, d) => c + (d - c) * (v - a) / (b - a);
let obj = {x:0, y:0}, pos = {x:0, y:0}, vel = {x:0, y:0}, ultimo = 0, t0 = performance.now(), base = null, raf = 0, encima = false;
function orienta(e){
  if(e.gamma == null) return;
  if(!base) base = {b:e.beta, g:e.gamma};
  base.b += (e.beta - base.b) * .003; base.g += (e.gamma - base.g) * .003;
  obj = {x: cl(e.gamma - base.g, -16, 16), y: cl(e.beta - base.b, -18, 18)}; ultimo = performance.now();
}
function bucle(){
  const t = Math.max(0, performance.now() - t0) / 1000;
  if(!encima && performance.now() - ultimo > 1500) obj = {x: Math.sin(t*.9) * 6, y: Math.sin(t*.7) * 6.5};
  for(const k of ["x","y"]){ vel[k] = (vel[k] + (obj[k] - pos[k]) * .066) * .75; pos[k] += vel[k]; }
  const px = aj(pos.x, -16, 16, 0, 100), py = aj(pos.y, -18, 18, 0, 100);
  RS.setProperty("--pointer-x", px.toFixed(2) + "%"); RS.setProperty("--pointer-y", py.toFixed(2) + "%");
  RS.setProperty("--background-x", aj(pos.x, -16, 16, 37, 63).toFixed(2) + "%"); RS.setProperty("--background-y", aj(pos.y, -18, 18, 33, 67).toFixed(2) + "%");
  RS.setProperty("--pointer-from-center", cl(Math.hypot(px - 50, py - 50) / 50, 0, 1).toFixed(3));
  RS.setProperty("--pointer-from-left", (px/100).toFixed(3)); RS.setProperty("--pointer-from-top", (py/100).toFixed(3));
  RS.setProperty("--rotate-x", (-pos.x).toFixed(2) + "deg"); RS.setProperty("--rotate-y", pos.y.toFixed(2) + "deg");
  RS.setProperty("--mx", (px/100).toFixed(3)); RS.setProperty("--my", (py/100).toFixed(3));
  raf = requestAnimationFrame(bucle);
}
const luz = {
  on(zona){
    if(!raf){ addEventListener("deviceorientation", orienta); raf = requestAnimationFrame(bucle); }
    this.quieta();
    if(zona && !zona._luz){ zona._luz = 1;
      zona.addEventListener("pointermove", e => { if(e.pointerType !== "mouse") return; const c = zona.querySelector(".carta"); if(!c) return;
        const r = c.getBoundingClientRect(); obj = {x: cl(aj(e.clientX, r.left, r.right, -16, 16), -16, 16), y: cl(aj(e.clientY, r.top, r.bottom, -18, 18), -18, 18)}; encima = true; ultimo = performance.now(); });
      zona.addEventListener("pointerleave", () => { encima = false; obj = {x:0, y:0}; ultimo = performance.now(); });
    }
  },
  off(){ if(raf){ cancelAnimationFrame(raf); raf = 0; removeEventListener("deviceorientation", orienta); } },
  quieta(){ pos = {x:0, y:0}; vel = {x:0, y:0}; obj = {x:0, y:0}; ultimo = performance.now(); t0 = performance.now() + 1500; },
  pidePermiso(){ const DO = window.DeviceOrientationEvent; if(DO && typeof DO.requestPermission === "function") return DO.requestPermission().catch(() => "denied"); return Promise.resolve("granted"); }
};
/* las imágenes van como «IMG:fichero»; la app dice de dónde se sacan (el Worker, con la clave) */
function ponImagenes(url){
  const cambia = o => { for(const k in o){ const v = o[k]; if(typeof v === "string" && v.startsWith("IMG:")) o[k] = url(v.slice(4)); else if(v && typeof v === "object") cambia(v); } };
  cambia(ART); cambia(IMG); D1.LISTA.forEach(e => { if(e.th && e.th.startsWith("IMG:")) e.th = url(e.th.slice(4)); });
}
window.GTCG = {carta, versiones, nombreVer, icono, VERS, CARTAS, FICHA, D1, luz, ponImagenes,
  firmas(f){ if(f && typeof f === "object") FIRMAS = Object.assign({}, FIRMAS, f); }};

})();
