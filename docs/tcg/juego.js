/* Gremory TCG · el juego dentro de la app: binder de cada uno, sobres y cambios entre vosotros.
   Usa lo de index.html a través de window.GAPP: S, save, miId, nombreDe, apiNube, nubeBase, toast, esc, logrosTodos.
   Datos (se sincronizan con lo demás):
     A.S.tcgCartas  [{id, c:"s01-001", v:"R", d:persona, t, o:"sobre"|"cambio"}]   cada copia de una carta
     A.S.tcgSobres  [{id, d, tipo:"dia"|"premio", motivo, f, abierto, t}]            sobres ganados y abiertos
     A.S.tcgCambios [{id, de, para, doy, pido, estado, t, f}]                         cambios propuestos
     A.S.tcgBase    {f, logros:[...]}  logros que ya teníais al estrenar el juego (no dan sobre) */
(function(){
  /* lo de la app (index.html va dentro de una función: lo comparte por window.GAPP) */
  const A = window.GAPP;
  const save = () => A.save(), miId = () => A.miId(), nombreDe = id => A.nombreDe(id), apiNube = (r, m, c) => A.apiNube(r, m, c),
    nubeBase = () => A.nubeBase(), toast = m => A.toast(m), esc = x => A.esc(x), uid = () => A.uid(), logrosTodos = () => A.logrosTodos(), render = () => A.render();
  const G = window.GTCG, D1 = G.D1, L = D1.LISTA, PAG = 9, NP = Math.ceil(L.length / PAG);
  const BIENVENIDA = 3, DIARIOS = 2, SECRETA_ON = false;   /* beta: la 061 aún no sale en los sobres */
  const TAPAS = {
    oceano:     {n:"Océano",     tapa:"#1d4f9c", hoja:"#14203a", tinta:"#9fb8e6"},
    rosa:       {n:"Rosa",       tapa:"#c4537e", hoja:"#28141e", tinta:"#f0a9c4"},
    medianoche: {n:"Medianoche", tapa:"#2a2e45", hoja:"#11131c", tinta:"#8f94a2"},
    perla:      {n:"Perla",      tapa:"#cfc9de", hoja:"#e9e6f0", tinta:"#6b6880"},
    lima:       {n:"Gremory",    tapa:"#55701a", hoja:"#141a0b", tinta:"#c9f24a"},
    granate:    {n:"Granate",    tapa:"#7a1f2b", hoja:"#1c0f12", tinta:"#e7a3ad"}
  };
  const lee = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } };
  const guarda = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} };
  const ahora = () => new Date().toISOString();
  const hoy = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  /* iconos (de Valeria, RUN-ASSETS-TCG.md §5.1 y §4.4): trazo 1,75, currentColor */
  const ICO = {
    x: '<svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 5 L19 19 M19 5 L5 19" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    izq: '<svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24"><path d="M15 4 L7 12 L15 20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    der: '<svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24"><path d="M9 4 L17 12 L9 20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cambio: '<svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24"><path d="M8 3 L15 3 L15 14 L8 14 Z M12 10 L19 10 L19 21 L12 21 M4 13 Q1 6 5 4 L6 7 M20 11 Q23 18 20 21 L18 18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sonido: '<svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24"><path d="M3 9 L7 9 L12 5 L12 19 L7 15 L3 15 Z M16 8 Q21 12 16 16 M18 5 Q25 12 18 19" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    silencio: '<svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24"><path d="M3 9 L7 9 L12 5 L12 19 L7 15 L3 15 Z M16 9 L21 15 M21 9 L16 15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sobre: '<svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 4 L7 6 L9 4 L11 6 L13 4 L15 6 L17 4 L19 5 L19 20 L5 20 Z M5 8 L19 8 M8 17 L16 17" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    carpeta: '<svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24"><path d="M3 5 Q8 3 12 6 Q16 3 21 5 L21 20 Q16 18 12 21 Q8 18 3 20 Z M12 6 L12 21 M6 8 L9 8 L9 15 L6 15 Z M15 8 L18 8 L18 15 L15 15 Z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M10.5 8 L13.5 8 M10.5 12 L13.5 12 M10.5 16 L13.5 16"/></g></svg>',
    repetida: '<svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24"><path d="M8 7 L20 7 L20 21 L8 21 Z M16 7 L16 3 L4 3 L4 17 L8 17" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    reloj: '<svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 3 L19 3 M5 21 L19 21 M7 3 L7 7 Q7 10 12 12 Q17 14 17 17 L17 21 M17 3 L17 7 Q17 10 12 12 Q7 14 7 17 L7 21 M9 17 L15 17" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    candado: '<svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24"><path d="M7 10 L7 7 Q7 2 12 2 Q17 2 17 7 L17 10 M5 10 L19 10 L19 21 L5 21 Z M12 14 L12 17" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    logro: '<svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24"><path d="M8 15 L6 22 L12 19 L18 22 L16 15 M12 3 C5 3 4 14 12 16 C20 14 19 3 12 3 Z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    saltar: '<svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6 L10 12 L4 18 M11 6 L17 12 L11 18 M20 5 L20 19" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    filtro: '<svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24"><path d="M3 4 L21 4 L14 12 L14 20 L10 18 L10 12 Z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    info: '<svg width="18" height="18" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 10 L12 17 M12 7 L12 7.1" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.75"/></svg>'
  };
  const GEMA = {
    gema: '<svg width="24" height="24" aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 2 L21 9 L12 22 L3 9 Z M11 5 L6 9 L11 18 Z M13 5 L13 9 L18 9 Z"/></svg>',
    gremory: '<svg width="24" height="24" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4 L17 10 L12 21 L7 10 Z M7 9 L2 5 L3 15 L7 13 Z M17 9 L22 5 L21 15 L17 13 Z" fill="currentColor"/></svg>',
    secreta: '<svg width="24" height="24" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 6 C6 -1 0 7 5 12 L12 21 L19 12 C24 7 18 -1 12 6 Z M12 9 C9 9 9 12 11 13 L10 16 L14 16 L13 13 C15 12 15 9 12 9 Z" fill="currentColor" fill-rule="evenodd"/></svg>'
  };

  /* ── datos ── */
  function asegura(){
    A.S.tcgCartas = A.S.tcgCartas || []; A.S.tcgSobres = A.S.tcgSobres || []; A.S.tcgCambios = A.S.tcgCambios || [];
  }
  const yo = () => miId();
  const gente = () => (A.S.people || []).slice(0, 2);
  const otro = () => { const g = gente().filter(p => p.id !== yo()); return g[0] ? g[0].id : ""; };
  const nom = pid => (typeof nombreDe === "function" ? nombreDe(pid) : pid) || "?";
  const borr = () => A.S.borrados || {};
  const vivas = () => A.S.tcgCartas.filter(x => !borr()[x.id]);
  const de = pid => vivas().filter(x => x.d === pid);
  const inst = id => A.S.tcgCartas.find(x => x.id === id);
  const entrada = c => L.find(e => e.id === c) || {};
  function coleccion(pid){
    const m = {};
    de(pid).forEach(x => { const c = m[x.c] || (m[x.c] = {n:0, v:{}, inst:[]}); c.n++; c.v[x.v] = (c.v[x.v] || 0) + 1; c.inst.push(x); });
    return m;
  }
  function reservadas(){
    const r = {}; A.S.tcgCambios.filter(c => c.estado === "pendiente").forEach(c => { r[c.doy] = 1; r[c.pido] = 1; }); return r;
  }
  /* de cada carta y versión puedes dar todas las copias menos una */
  function sobrantes(pid){
    const g = {}, res = reservadas();
    de(pid).forEach(x => { (g[x.c + "|" + x.v] = g[x.c + "|" + x.v] || []).push(x); });
    const out = [];
    Object.values(g).forEach(a => { a.sort((p, q) => (p.t > q.t ? 1 : -1)); a.slice(1).forEach(x => { if(!res[x.id]) out.push(x); }); });
    return out.sort((a, b) => a.c > b.c ? 1 : a.c < b.c ? -1 : 0);
  }

  /* ── sobres: dos al día, tres de bienvenida y uno por cada logro nuevo ── */
  function premia(){
    asegura();
    const logros = typeof logrosTodos === "function" ? logrosTodos().filter(l => l.dado) : [];
    if(!A.S.tcgBase) A.S.tcgBase = {f: hoy(), logros: logros.map(l => l.k)};
    const hay = {}; A.S.tcgSobres.forEach(s => hay[s.id] = 1);
    let nuevos = 0;
    const pon = (id, d, motivo) => { if(hay[id] || borr()[id]) return; A.S.tcgSobres.push({id, d, tipo:"premio", motivo, f: hoy(), abierto:false, t: ahora()}); hay[id] = 1; nuevos++; };
    gente().forEach(p => {
      for(let i = 1; i <= BIENVENIDA; i++) pon("bienvenida:" + i + ":" + p.id, p.id, "Bienvenida al Set 1");
      logros.filter(l => A.S.tcgBase.logros.indexOf(l.k) < 0).forEach(l => pon("logro:" + l.k + ":" + p.id, p.id, "Logro: " + l.label));
    });
    return nuevos;
  }
  function disponibles(pid){
    asegura();
    const ids = Array.from({length: DIARIOS}, (_, i) => "dia:" + hoy() + ":" + pid + (i ? ":" + (i + 1) : ""));
    const libres = ids.filter(id => !A.S.tcgSobres.some(s => s.id === id)), dia = libres.length;
    const pre = A.S.tcgSobres.filter(s => s.d === pid && !s.abierto && !borr()[s.id]);
    return {dia, libres, pre, total: dia + pre.length};
  }
  /* el contenido sale de una semilla (el id del sobre): los dos móviles sacan lo mismo */
  function rng(sem){
    let h = 1779033703 ^ sem.length;
    for(let i = 0; i < sem.length; i++){ h = Math.imul(h ^ sem.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    let a = h >>> 0;
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  const POOL = {};
  L.filter(e => e.ok).forEach(e => { const t = e.n === "061" ? "Secreta" : D1.SETT[e.id]; (POOL[t] = POOL[t] || []).push(e.id); });
  const hayPool = t => POOL[t] && POOL[t].length;
  const elige = (r, a) => a[Math.floor(r() * a.length)];
  /* 5 cartas: tres normales (Holo o Casa), una Reverse o Double Holo, y la rara */
  const RARA = [["Grabada",42,"SR"],["Escapada",25,"OFR"],["Firmada",14,"SP"],["Oro",9,"HR"],["Estándar",4.5,"RR"],["Gremory",3.5,"G1"],["Gremory",2,"G2"],["Secreta",.5,"SR"]].filter(x => SECRETA_ON || x[0] !== "Secreta");
  /* tres sobres: el de cada uno trae más cartas suyas (sin quitar ninguna del resto) */
  const num = id => +String(id).slice(4);
  const DE = {
    alberto: n => (n >= 1 && n <= 10) || n === 48,
    cristina: n => (n >= 11 && n <= 20) || n === 42 || n === 43,
    gatos: n => n >= 21 && n <= 47 && n !== 46
  };
  function elige2(r, a, tipo){
    const suyas = tipo && DE[tipo] ? a.filter(id => DE[tipo](num(id))) : [];
    return suyas.length && r() < .45 ? elige(r, suyas) : elige(r, a);
  }
  function genera(id, tipo){
    const r = rng(id + (tipo ? ":" + tipo : "")), out = [];
    for(let i = 0; i < 3; i++) out.push(r() < .7 && hayPool("Estándar") ? {c: elige2(r, POOL["Estándar"], tipo), v:"R"} : hayPool("Casa") ? {c: elige(r, POOL["Casa"]), v:"CASA"} : {c: elige2(r, POOL["Estándar"], tipo), v:"R"});
    out.push({c: elige2(r, POOL["Estándar"], tipo), v: r() < .85 ? "RH" : "RR"});
    const x = r() * 100; let acc = 0, rara = null;
    for(const [t, p, v] of RARA){ acc += p; if(x < acc){ if(hayPool(t)) rara = {c: elige2(r, POOL[t], tipo), v}; break; } }
    out.push(rara || {c: elige2(r, POOL["Grabada"] || POOL["Estándar"], tipo), v: hayPool("Grabada") ? "SR" : "RR"});
    return out;
  }
  const nivel = (c, v) => c === "s01-061" || v === "G1" || v === "G2" ? 5 : v === "SP" || v === "HR" ? 4 : v === "SR" || v === "OFR" || v === "RR" ? 3 : v === "RH" ? 2 : 1;

  /* ── imágenes del Worker ── */
  const VACIA = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  function url(n){ const nb = nubeBase(); return nb ? nb.base + "/img/" + encodeURIComponent(n) + "?k=" + encodeURIComponent(nb.k) : VACIA; }
  let listo = false, faltanImg = false;
  function prepara(){
    if(listo) return Promise.resolve();
    G.ponImagenes(url); listo = true;
    const e = L.find(x => x.ok);
    if(!nubeBase() || !e) { faltanImg = true; return Promise.resolve(); }
    return fetch(e.th, {method:"GET"}).then(r => { faltanImg = !r.ok; }).catch(() => { faltanImg = true; });
  }

  /* ── montaje de la interfaz ── */
  let raiz, cuerpo, tab = "binder", quien = "", pag = 0, girando = false;
  const tapas = Object.assign({}, lee("gremory-tcg-tapas", {}));
  const tapaDe = pid => TAPAS[tapas[pid]] || (gente()[1] && gente()[1].id === pid ? TAPAS.rosa : TAPAS.oceano);
  const movil = () => matchMedia("(max-width:760px)").matches;
  function monta(){
    if(raiz) return;
    raiz = document.createElement("div"); raiz.id = "tcg";
    raiz.innerHTML = '<div class="tg-top"><h2>Gremory · Set 1</h2><button class="tg-x" data-acc="cierra" aria-label="Cerrar">' + ICO.x + '</button></div>' +
      '<div class="tg-tabs" id="tgTabs"></div><div class="tg-cuerpo" id="tgCuerpo"></div>';
    document.body.appendChild(raiz);
    cuerpo = raiz.querySelector("#tgCuerpo");
    ["tgVisor", "tgAbre", "tgProp"].forEach(id => { const c = document.createElement("div"); c.className = "tg-capa"; c.id = id; document.body.appendChild(c); });
    raiz.addEventListener("click", clic);
    document.getElementById("tgVisor").addEventListener("click", clicVisor);
    document.getElementById("tgProp").addEventListener("click", clicProp);
    let x0 = null, arr = false;
    cuerpo.addEventListener("pointerdown", e => { x0 = e.target.closest(".bd") ? e.clientX : null; });
    cuerpo.addEventListener("pointerup", e => { if(x0 == null) return; const dx = e.clientX - x0; x0 = null; if(Math.abs(dx) > 60){ arr = true; setTimeout(() => arr = false, 50); pasa(dx < 0 ? 1 : -1); } });
    cuerpo.addEventListener("click", e => { if(arr) e.stopPropagation(); }, true);
    addEventListener("keydown", e => {
      if(!raiz.classList.contains("on")) return;
      const v = document.getElementById("tgVisor");
      if(e.key === "Escape"){ if(v.classList.contains("on")) cierraVisor(); else if(!document.getElementById("tgAbre").classList.contains("on")) cierra(); }
      else if(v.classList.contains("on") && (e.key === "ArrowLeft" || e.key === "ArrowRight")) otraVisor(e.key === "ArrowLeft" ? -1 : 1);
      else if(tab === "binder" && (e.key === "ArrowLeft" || e.key === "ArrowRight")) pasa(e.key === "ArrowLeft" ? -1 : 1);
    });
    let era = movil(); addEventListener("resize", () => { if(movil() !== era){ era = movil(); if(tab === "binder") pinta(); } });
  }

  function pinta(){
    asegura();
    const d = yo() ? disponibles(yo()) : {total:0};
    const ent = A.S.tcgCambios.filter(c => c.estado === "pendiente" && c.para === yo()).length;
    raiz.querySelector("#tgTabs").innerHTML =
      '<button data-tab="binder" class="' + (tab === "binder" ? "on" : "") + '">' + ICO.carpeta + 'Binder</button>' +
      '<button data-tab="sobres" class="' + (tab === "sobres" ? "on" : "") + '">' + ICO.sobre + 'Sobres' + (d.total ? '<i>' + d.total + '</i>' : '') + '</button>' +
      '<button data-tab="cambios" class="' + (tab === "cambios" ? "on" : "") + '">' + ICO.cambio + 'Cambios' + (ent ? '<i>' + ent + '</i>' : '') + '</button>';
    let h = "";
    if(!yo()){
      h = '<div class="tg-aviso">¿De quién es este móvil? Así sé de quién es cada sobre y cada binder.</div><div class="tg-acc">' +
        gente().map(p => '<button class="tg-btn sec" data-yo="' + p.id + '">' + esc(p.name) + '</button>').join("") + '</div>';
      cuerpo.innerHTML = h; return;
    }
    if(!nubeBase()) h += '<div class="tg-vacio"><img src="' + ARTE("vacio-sin-conexion") + '" alt=""><p>Para ver las cartas y jugar entre los dos hace falta la sincronización (Ajustes → Sincronizar).</p></div>';
    else if(faltanImg) h += '<div class="tg-aviso">Aún no están subidas las ilustraciones del Set 1. Súbelas una vez desde Ajustes → Gremory TCG.</div>';
    if(tab === "binder") h += binderHTML();
    else if(tab === "sobres") h += sobresHTML();
    else h += cambiosHTML();
    cuerpo.innerHTML = h;
    if(tab === "sobres") deslizaCarrusel();
  }

  /* ── binder ── */
  function bolsillo(i, col, extra){
    const e = L[i];
    if(!e) return '<div class="bd-bol" style="visibility:hidden"></div>';
    if(!e.ok) return '<div class="bd-bol falta" title="' + e.n + '"><div class="tg-dorso"></div><span class="bd-num">' + e.n + '</span></div>';
    const c = col[e.id];
    return '<div class="bd-bol' + (c ? '' : ' no') + '" data-id="' + e.id + '" title="' + esc(e.n + ' · ' + e.t) + '"><img src="' + e.th + '" alt="" loading="lazy">' +
      '<span class="bd-num">' + e.n + '</span>' + (c && c.n > 1 ? '<span class="bd-n">×' + c.n + '</span>' : '') + (extra || "") + '</div>';
  }
  function hoja(p, lado, col){
    if(p < 0 || p >= NP) return '<div class="bd-hoja ' + lado + ' vacia"><div class="bd-cab"><span>&nbsp;</span></div><div class="bd-grid">' + '<div class="bd-bol"></div>'.repeat(PAG) + '</div></div>';
    const a = L[p * PAG], z = L[Math.min(L.length, (p + 1) * PAG) - 1];
    let g = ""; for(let k = 0; k < PAG; k++) g += bolsillo(p * PAG + k, col);
    return '<div class="bd-hoja ' + lado + '"><div class="bd-cab"><span>Página ' + (p + 1) + '</span><span>' + a.n + ' – ' + z.n + '</span></div><div class="bd-grid">' + g + '</div>' +
      ((lado === "der" || movil()) && p < NP - 1 ? '<div class="bd-esquina" data-ir="1"></div>' : '') +
      (lado === "izq" && !movil() && p > 0 ? '<div class="bd-esquina ant" data-ir="-1"></div>' : '') + '</div>';
  }
  const lomo = () => '<div class="bd-lomo">' + '<div class="bd-anilla"></div>'.repeat(3) + '</div>';
  function hojas(p, col){ return movil() ? lomo() + hoja(p, "izq", col) : hoja(p, "izq", col) + lomo() + hoja(p + 1, "der", col); }
  function binderHTML(){
    if(!quien) quien = yo();
    if(!movil() && pag % 2) pag--;
    const col = coleccion(quien), t = tapaDe(quien);
    const tiene = L.filter(e => e.ok && col[e.id]).length, rep = sobrantes(quien).length;
    const paso = movil() ? 1 : 2;
    return '<div class="tg-cab" style="--tapa:' + t.tapa + '"><div class="tg-quien">' +
        gente().map(p => '<button data-quien="' + p.id + '" class="' + (p.id === quien ? "on" : "") + '">' + (p.id === yo() ? "Mi binder" : "El de " + esc(p.name)) + '</button>').join("") + '</div>' +
        '<div class="tg-cuenta"><b>' + tiene + '</b> de ' + L.length + ' cartas · <b>' + rep + '</b> repetidas</div>' +
        (quien === yo() ? '<div class="tg-acab">' + Object.entries(TAPAS).map(([k, a]) => '<button data-tapa="' + k + '" title="' + a.n + '" aria-label="Tapa ' + a.n + '" class="' + (tapaDe(quien) === a ? "on" : "") + '" style="--c:' + a.tapa + '"></button>').join("") + '</div>' : '') + '</div>' +
      '<div class="tg-nav"><button data-ir="-1"' + (pag <= 0 ? " disabled" : "") + '>‹ Anterior</button><b>' + (movil() ? "Página " + (pag + 1) : "Páginas " + (pag + 1) + "–" + Math.min(NP, pag + 2)) + ' de ' + NP + '</b>' +
        '<button data-ir="1"' + (pag + paso >= NP ? " disabled" : "") + '>Siguiente ›</button>' +
        '<select id="tgIr" aria-label="Ir a"><option value="">Ir a…</option>' + [["001","Alberto"],["011","Cristina"],["021","Kurama"],["028","Sukuna"],["035","Gyukki"],["042","En grupo"],["049","La casa"],["061","Secreta"]].map(([n, x]) => '<option value="' + n + '">' + x + ' · ' + n + '</option>').join("") + '</select></div>' +
      '<div class="bd" id="tgBd" style="--tapa:' + t.tapa + ';--hoja:' + t.hoja + ';--tinta:' + t.tinta + '">' + hojas(pag, col) + '</div>';
  }
  function pasa(dir){
    if(girando || tab !== "binder") return;
    const paso = movil() ? 1 : 2, nueva = pag + dir * paso;
    if(nueva < 0 || nueva >= NP) return;
    const bd = document.getElementById("tgBd");
    if(!bd || matchMedia("(prefers-reduced-motion: reduce)").matches){ pag = nueva; pinta(); return; }
    girando = true;
    const col = coleccion(quien), hs = bd.querySelectorAll(".bd-hoja"), rb = bd.getBoundingClientRect();
    const ref = movil() ? hs[0] : (dir > 0 ? hs[1] : hs[0]), r = ref.getBoundingClientRect();
    let delante, detras;
    if(movil()){ delante = hoja(dir > 0 ? pag : nueva, "izq", col); detras = hoja(-1, "izq", col); }
    else if(dir > 0){ delante = hoja(pag + 1, "der", col); detras = hoja(nueva, "izq", col); }
    else { delante = hoja(pag, "izq", col); detras = hoja(nueva + 1, "der", col); }
    if(movil()) bd.innerHTML = lomo() + hoja(dir > 0 ? nueva : pag, "izq", col);
    else bd.innerHTML = dir > 0 ? hoja(pag, "izq", col) + lomo() + hoja(nueva + 1, "der", col) : hoja(nueva, "izq", col) + lomo() + hoja(pag + 1, "der", col);
    const g = document.createElement("div"); g.className = "bd-hojaGira";
    Object.assign(g.style, {left: (r.left - rb.left) + "px", top: (r.top - rb.top) + "px", width: r.width + "px", height: r.height + "px",
      transformOrigin: !movil() && dir < 0 ? "right center" : "left center"});
    g.innerHTML = delante.replace('class="bd-hoja', 'class="bd-hoja delantera') + detras.replace('class="bd-hoja', 'class="bd-hoja trasera');
    if(movil() && dir < 0) g.style.transform = "rotateY(-180deg)";
    bd.appendChild(g); g.getBoundingClientRect();
    g.style.transform = movil() ? (dir > 0 ? "rotateY(-180deg)" : "rotateY(0deg)") : (dir > 0 ? "rotateY(-180deg)" : "rotateY(180deg)");
    const fin = () => { if(!girando) return; pag = nueva; girando = false; pinta(); };
    g.addEventListener("transitionend", fin, {once:true}); setTimeout(fin, 1000);
  }

  /* ── visor ── */
  let vCarta = null, vVer = null;
  function abreVisor(c, v){
    const vs = G.versiones(c), col = coleccion(quien)[c] || {v:{}};
    vCarta = c; vVer = v || vs.find(x => col.v[x]) || vs[0];
    pintaVisor();
    const cap = document.getElementById("tgVisor"); cap.classList.add("on");
    G.luz.on(cap.querySelector(".tg-esc"));
  }
  function pintaVisor(){
    const cap = document.getElementById("tgVisor"), c = vCarta, v = vVer, e = entrada(c);
    const col = coleccion(quien)[c] || {v:{}}, mia = quien === yo(), n = col.v[v] || 0;
    const sob = mia ? sobrantes(yo()).filter(x => x.c === c && x.v === v) : [];
    const res = reservadas(), suya = !mia ? de(quien).filter(x => x.c === c && x.v === v && !res[x.id]) : [];
    cap.innerHTML = '<button class="tg-x" data-v-acc="cierra" aria-label="Cerrar">' + ICO.x + '</button>' +
      '<button class="tg-flecha izq" data-v-acc="ant" aria-label="Anterior">' + ICO.izq + '</button><button class="tg-flecha der" data-v-acc="sig" aria-label="Siguiente">' + ICO.der + '</button>' +
      '<div class="tg-tit"><b>' + e.n + ' · ' + esc(G.CARTAS[c].n) + '</b><span>' + (n ? (mia ? "Tienes " : nom(quien) + " tiene ") + n + (n > 1 ? " copias" : " copia") : (mia ? "Aún no la tienes" : nom(quien) + " no la tiene")) + '</span></div>' +
      '<div class="tg-esc' + (n ? '' : ' bloq') + '">' + G.carta(c, v) + (n ? '' : '<div class="tg-candado"><span>' + (mia ? "Te falta" : "No la tiene") + '</span></div>') + '</div>' +
      '<div class="tg-vers">' + G.versiones(c).map(x => '<button data-ver="' + x + '" class="' + (x === v ? "on" : "") + (col.v[x] ? "" : " no") + '">' + G.icono(c, x) + G.nombreVer(c, x) + (col.v[x] ? '<em>×' + col.v[x] + '</em>' : '') + '</button>').join("") + '</div>' +
      '<div class="tg-acc">' +
        (c === "s01-061" && n && G.cartaSecretaDorso ? '<button class="tg-btn sec" data-v-acc="gira">Darle la vuelta</button>' : '') +
        (sob.length && otro() ? '<button class="tg-btn sec" data-v-acc="ofrece" data-inst="' + sob[0].id + '">' + ICO.cambio + ' Ofrecérsela a ' + esc(nom(otro())) + '</button>' : '') +
        (suya.length ? '<button class="tg-btn sec" data-v-acc="pide" data-inst="' + suya[0].id + '">' + ICO.cambio + ' Pedírsela a ' + esc(nom(quien)) + '</button>' : '') + '</div>';
  }
  function otraVisor(d){
    const ok = L.filter(e => e.ok), i = ok.findIndex(e => e.id === vCarta), j = ok[(i + d + ok.length) % ok.length];
    const k = L.indexOf(j), p = Math.floor(k / PAG); pag = movil() ? p : p - (p % 2);
    abreVisor(j.id); if(tab === "binder") pinta();
  }
  function cierraVisor(){ document.getElementById("tgVisor").classList.remove("on"); G.luz.off(); }
  function clicVisor(e){
    if(e.target.id === "tgVisor") return cierraVisor();
    const b = e.target.closest("[data-v-acc],[data-ver]"); if(!b) return;
    if(b.dataset.ver){ vVer = b.dataset.ver; pintaVisor(); G.luz.on(document.querySelector("#tgVisor .tg-esc")); return; }
    const a = b.dataset.vAcc;
    if(a === "gira"){
      const z = document.querySelector("#tgVisor .tg-esc"); z.classList.add("gira");
      setTimeout(() => { const atras = b.dataset.atras !== "1"; const k = z.querySelector(".carta");
        if(k) k.outerHTML = atras ? G.cartaSecretaDorso() : G.carta(vCarta, vVer);
        b.dataset.atras = atras ? "1" : ""; b.textContent = atras ? "Ver la cara" : "Darle la vuelta"; z.classList.remove("gira"); }, 280);
      return;
    }
    if(a === "cierra") cierraVisor();
    else if(a === "ant") otraVisor(-1);
    else if(a === "sig") otraVisor(1);
    else if(a === "ofrece"){ cierraVisor(); propuesta({doy: b.dataset.inst}); }
    else if(a === "pide"){ cierraVisor(); propuesta({pido: b.dataset.inst}); }
  }

  /* ── sobres ── */
  /* ══ SOBRES (24/10/2026) ══
     Tres sobres a elegir (Alberto, Cristina, los gatos). La apertura pasa en la mesa de casa:
     se corta el sobre deslizando, se enciende el círculo mágico, las cartas salen en abanico boca abajo
     brillando del color de su rareza, y cada toque da la vuelta a una. Con sonido (se puede silenciar).
     Las ilustraciones de la escena (sobres, mesa, gatos) llegan del Worker con estos nombres; si faltan,
     se usan las de las cartas y fondos dibujados. */
  /* el set: cada cierto tiempo saldrá uno nuevo con su nombre */
  const SET = {num: 1, nombre: "Home Sweet Home"};
  const SET_TXT = "Set " + SET.num + " · " + SET.nombre;
  const SOBRES = {
    alberto:  {n:"Alberto",  sub:"Sobre de Alberto",  col:"#4f8dff", col2:"#a8d4ff", arte:["s01-006","gre"], img:"sobre-alberto.webp"},
    cristina: {n:"Cristina", sub:"Sobre de Cristina", col:"#ff5fa2", col2:"#ffc2dc", arte:["s01-012","full"], img:"sobre-cristina.webp"},
    gatos:    {n:"Los gatos", sub:"Sobre de los gatos", col:"#ff8a3d", col2:"#c9a8ff", arte:["s01-045","est"], img:"sobre-gatos.webp"}
  };
  /* el arte de Valeria sin personas va en el repo (docs/tcg/arte); las portadas con caras, privadas en el Worker */
  const VER = (document.querySelector("meta[name=build]") || {}).content || "";
  const ARTE = n => "tcg/arte/" + n + ".webp" + (VER ? "?v=" + encodeURIComponent(VER) : "");
  const TIER = {1:["#b9c2d4","Común"], 2:["#7cc7ff","Holo"], 3:["#8f7bff","Rara"], 4:["#ffcf5a","Muy rara"], 5:["#ff5fd2","Gremory"], sec:["#ff4f7d","Secreta"]};
  const tierDe = x => x.c === "s01-061" ? "sec" : x.nivel;
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const extra = {};    /* qué ilustraciones de la escena hay en el Worker */
  function miraExtra(){
    if(extra.listo) return extra.listo;
    if(!nubeBase()) return Promise.resolve();
    const prueba = (k, n) => new Promise(ok => { const i = new Image(); i.onload = () => { extra[k] = url(n); ok(); }; i.onerror = () => ok(); i.src = url(n); });
    /* las portadas de Valeria y sus máscaras de brillo (subidas al Worker desde subir-app-tcg) */
    const ps = Object.keys(SOBRES).map(k => prueba("sobre-" + k, SOBRES[k].img));
    Object.keys(SOBRES).forEach(k => ps.push(prueba("brillo-" + k, "sobre-" + k + "-brillo.webp")));
    return extra.listo = Promise.all(ps);
  }

  /* ── el sobre en 3D (tcg/sobre3d.js, con three.js) ──
     Se carga al ver la pestaña de sobres y prepara las texturas del sobre elegido. Si no hay WebGL, el usuario
     prefiere menos movimiento o aún no está listo al abrir, se usa el sobre en CSS de siempre.
     Texturas de 1000×1700 con el corte en y=250 (RUN-ASSETS-TCG.md). Mientras no lleguen las de Valeria,
     se dibujan aquí con la ilustración de una carta, el nombre y un dorso granate y oro. */
  let S3 = null, S3carga = null;
  const LIENZO = {}, TX = 1000, TY = 1700;
  function carga3d(){
    if(S3carga) return S3carga;
    if(reduce()) return S3carga = Promise.resolve(null);
    S3carga = import("./sobre3d.js?v=" + encodeURIComponent(VER)).then(m => (S3 = m.webgl() ? m : null)).catch(e => { console.warn("sobre 3D", e); return null; });
    return S3carga;
  }
  const imagen = src => new Promise(ok => { if(!src || src === VACIA) return ok(null); const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
  const fuentes = () => document.fonts && document.fonts.load ? Promise.all(['400 160px "Instrument Serif"', '700 30px "Space Mono"'].map(f => document.fonts.load(f).catch(() => null))) : Promise.resolve();
  function lienzos(k){
    if(LIENZO[k]) return LIENZO[k];
    const p = Promise.resolve(miraExtra()).then(() => {
      const S = SOBRES[k], [id, cl] = S.arte, a = (D1.ART[id] || {})[cl] || {}, propia = extra["sobre-" + k];
      return Promise.all([imagen(propia), propia ? null : imagen(cl === "gre" ? a.g2 : a.fondo), propia ? null : imagen(a.pj), imagen(propia && extra["brillo-" + k]),
        imagen(ARTE("sobre-reverso")), imagen(ARTE("sobre-reverso-brillo")), imagen(ARTE("sobre-rasgado")), imagen(ARTE("logotipo-gremory")), imagen(ARTE("sobre-sellado")),
        imagen(ARTE("sobre-arrugas")), imagen(ARTE("sobre-interior")), imagen(ARTE("destello")), fuentes()]);
    }).then(([propia, fondo, pj, brillo, rev, revBr, ras, logo, sellado, arrugas, interior, destello]) => {
      const S = SOBRES[k], frente = frenteSobre(S, propia, fondo, pj, logo, sellado);
      p.listo = {frente, dorso: dorsoSobre(rev, sellado), rasgado: ras || rasgadoSobre(), color: S.col,
        brilloF: brillo ? brilloSobre(brillo, logo) : null, brilloD: revBr, arrugas, interior, destello, propia: !!propia};
      /* la misma portada para el carrusel (solo si es la de Valeria; la provisional sigue en CSS) */
      if(propia && frente.toBlob) frente.toBlob(b => { if(!b) return; p.listo.url = URL.createObjectURL(b); if(tab === "sobres") ponPortada(k); }, "image/webp", .9);
      return p.listo;
    }).catch(e => { console.warn("texturas del sobre", e); delete LIENZO[k]; return null; });
    return LIENZO[k] = p;
  }
  function precarga3d(){ carga3d(); if(nubeBase()) lienzos(elegido).then(() => ORDEN.forEach(k => lienzos(k))); }
  function lienzo(){ const c = document.createElement("canvas"); c.width = TX; c.height = TY; return [c, c.getContext("2d")]; }
  function cubre(g, img, pos){
    const s = Math.max(TX / img.width, TY / img.height), w = img.width * s, h = img.height * s;
    g.drawImage(img, (TX - w) / 2, (TY - h) * pos, w, h);
  }
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mezcla = (a, b, t, al) => { const x = rgb(a), y = rgb(b); return "rgba(" + x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",") + "," + (al == null ? 1 : al) + ")"; };
  function espaciado(g, txt, x, y, sep){
    if("letterSpacing" in g){ g.letterSpacing = sep + "px"; g.fillText(txt, x + sep / 2, y); g.letterSpacing = "0px"; return; }
    g.fillText(txt.split("").join("\u200A"), x, y);
  }
  /* los sellados de arriba y abajo (estrías), la línea de corte perforada y el dentado */
  function remata(g, c1, c2, perfora, sellado){
    if(sellado){   /* las estrías de Valeria encima de la ilustración, arriba y (giradas) abajo */
      g.drawImage(sellado, 0, 0, TX, 56);
      g.save(); g.translate(0, TY); g.scale(1, -1); g.drawImage(sellado, 0, 0, TX, 56); g.restore();
    }
    else [[0, 56, false], [TY - 56, 56, true]].forEach(([y, h, abajo]) => {
      const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(abajo ? 1 : 0, c2); gr.addColorStop(abajo ? 0 : 1, c1);
      g.fillStyle = gr; g.fillRect(0, y, TX, h);
      for(let i = 0; i < TX; i += 8){ g.fillStyle = i % 16 ? "rgba(0,0,0,.22)" : "rgba(255,255,255,.3)"; g.fillRect(i, y, 3, h); }
    });
    if(perfora){
      g.save(); g.setLineDash([16, 11]); g.lineWidth = 3;
      g.strokeStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.moveTo(0, 252); g.lineTo(TX, 252); g.stroke();
      g.strokeStyle = "rgba(255,255,255,.7)"; g.beginPath(); g.moveTo(0, 249); g.lineTo(TX, 249); g.stroke(); g.restore();
    }
    g.save(); g.globalCompositeOperation = "destination-out"; g.fillStyle = "#000"; g.beginPath();
    const n = 30, a = 30, w = TX / n;
    for(let i = 0; i < n; i++){ const x = i * w; g.moveTo(x, 0); g.lineTo(x + w / 2, a); g.lineTo(x + w, 0); g.moveTo(x, TY); g.lineTo(x + w / 2, TY - a); g.lineTo(x + w, TY); }
    g.fill(); g.restore();
  }
  function frenteSobre(S, propia, fondo, pj, logo, sellado){
    const [c, g] = lienzo();
    g.fillStyle = "#0b0610"; g.fillRect(0, 0, TX, TY);
    if(propia) g.drawImage(propia, 0, 0, TX, TY);
    else {
      if(fondo) cubre(g, fondo, .24);
      if(pj) cubre(g, pj, .24);
      const v = g.createLinearGradient(0, 0, 0, TY);
      v.addColorStop(0, "rgba(12,4,12,.9)"); v.addColorStop(.2, "rgba(12,4,12,.35)"); v.addColorStop(.34, "rgba(12,4,12,0)"); v.addColorStop(.58, "rgba(12,4,12,0)");
      v.addColorStop(.78, mezcla(S.col, S.col, 0, .55)); v.addColorStop(.9, mezcla(S.col, "#0b0610", .6)); v.addColorStop(1, "#0b0610");
      g.fillStyle = v; g.fillRect(0, 0, TX, TY);
    }
    /* logotipo: el de Valeria si está; si no, el nombre en dorado */
    if(logo){ g.save(); g.shadowColor = "rgba(0,0,0,.55)"; g.shadowBlur = 22; g.shadowOffsetY = 6; g.drawImage(logo, 500 - 380, 410 - 110, 760, 220); g.restore(); }
    else {
      g.save(); g.textAlign = "center"; g.font = '400 200px "Instrument Serif", Georgia, serif';
      const d = g.createLinearGradient(0, 330, 0, 460); d.addColorStop(0, "#fff8de"); d.addColorStop(.6, "#f3cb6c"); d.addColorStop(1, "#b07a1e");
      g.shadowColor = "rgba(0,0,0,.8)"; g.shadowBlur = 18; g.shadowOffsetY = 5; g.fillStyle = d; g.fillText("Gremory", 500, 450);
      g.shadowBlur = 8; g.shadowOffsetY = 2; g.font = '700 26px "Space Mono", monospace'; g.fillStyle = "rgba(255,236,200,.9)";
      espaciado(g, "TRADING CARD GAME · SET 1", 500, 505, 7); g.restore();
    }
    /* abajo, el nombre del set (el de cada sobre ya no va: los tres traen lo mismo) */
    g.save(); g.textAlign = "center";
    if(propia){ const v = g.createLinearGradient(0, 1360, 0, 1640); v.addColorStop(0, "rgba(11,6,16,0)"); v.addColorStop(1, "rgba(11,6,16,.55)"); g.fillStyle = v; g.fillRect(0, 1360, TX, 280); }
    g.font = '700 28px "Space Mono", monospace'; g.fillStyle = S.col2; g.shadowColor = "rgba(0,0,0,.7)"; g.shadowBlur = 8;
    espaciado(g, "SET " + SET.num, 500, 1452, 10);
    g.font = '400 128px "Instrument Serif", Georgia, serif'; g.fillStyle = "#fff"; g.shadowColor = S.col; g.shadowBlur = 30; g.fillText(SET.nombre, 500, 1565);
    g.shadowColor = "rgba(0,0,0,.8)"; g.shadowBlur = 10; g.fillText(SET.nombre, 500, 1565);
    g.restore();
    remata(g, S.col, S.col2, true, propia ? sellado : null);
    return c;
  }
  /* la máscara de brillo de la portada, con el logotipo también metalizado */
  function brilloSobre(mascara, logo){
    const [c, g] = lienzo();
    g.drawImage(mascara, 0, 0, TX, TY);
    if(logo){
      const t = document.createElement("canvas"); t.width = 760; t.height = 220; const x = t.getContext("2d");
      x.drawImage(logo, 0, 0, 760, 220); x.globalCompositeOperation = "source-in"; x.fillStyle = "#fff"; x.fillRect(0, 0, 760, 220);
      g.drawImage(t, 500 - 380, 410 - 110);
    }
    return c;
  }
  function dorsoSobre(propio, sellado){
    const [c, g] = lienzo();
    if(propio) g.drawImage(propio, 0, 0, TX, TY);
    else {
      const r = g.createRadialGradient(500, 820, 40, 500, 850, 1100); r.addColorStop(0, "#8c1832"); r.addColorStop(.45, "#6b0f24"); r.addColorStop(1, "#2c0610");
      g.fillStyle = r; g.fillRect(0, 0, TX, TY);
      g.strokeStyle = "rgba(232,182,76,.15)"; g.lineWidth = 2;   /* trama de rombos */
      for(let i = -TY; i < TX + TY; i += 64){ g.beginPath(); g.moveTo(i, 0); g.lineTo(i + TY, TY); g.stroke(); g.beginPath(); g.moveTo(i, 0); g.lineTo(i - TY, TY); g.stroke(); }
      const s = g.createLinearGradient(465, 0, 535, 0); s.addColorStop(0, "rgba(0,0,0,.28)"); s.addColorStop(.15, "rgba(255,255,255,.1)"); s.addColorStop(.85, "rgba(255,255,255,.06)"); s.addColorStop(1, "rgba(0,0,0,.3)");
      g.fillStyle = s; g.fillRect(465, 0, 70, TY);   /* la costura del cierre */
      g.fillStyle = "rgba(255,231,163,.18)"; for(let y = 70; y < TY - 70; y += 22) g.fillRect(498, y, 4, 11);
      g.save(); g.translate(500, 850);
      g.strokeStyle = "#e8b64c"; g.lineWidth = 7; g.beginPath(); g.arc(0, 0, 168, 0, 7); g.stroke();
      g.lineWidth = 2; g.strokeStyle = "rgba(255,231,163,.6)"; g.beginPath(); g.arc(0, 0, 150, 0, 7); g.stroke();
      for(let i = 0; i < 24; i++){ const a = i / 24 * Math.PI * 2; g.beginPath(); g.moveTo(Math.cos(a) * 176, Math.sin(a) * 176); g.lineTo(Math.cos(a) * (i % 2 ? 184 : 192), Math.sin(a) * (i % 2 ? 184 : 192)); g.stroke(); }
      const d = g.createLinearGradient(0, -130, 0, 130); d.addColorStop(0, "#ffe7a3"); d.addColorStop(.55, "#e8b64c"); d.addColorStop(1, "#9a6a1a");
      g.textAlign = "center"; g.textBaseline = "middle"; g.font = '400 300px "Instrument Serif", Georgia, serif';
      g.shadowColor = "rgba(0,0,0,.6)"; g.shadowBlur = 16; g.fillStyle = d; g.fillText("G", 0, 18); g.restore();
    }
    remata(g, "#6b0f24", "#a8243f", !propio, propio ? sellado : null);
    return c;
  }
  /* el borde rasgado (1000×64): arriba transparente; abajo la capa plateada de dentro, con fibras */
  function rasgadoSobre(){
    const c = document.createElement("canvas"); c.width = TX; c.height = 64; const g = c.getContext("2d");
    let sem = 7; const r = () => (sem = (sem * 16807) % 2147483647) / 2147483647;
    const pts = []; let y = 32;
    for(let x = 0; x <= TX; x += 6){ y += (r() - .5) * 9 + (32 - y) * .12; if(r() < .05) y += (r() < .5 ? -1 : 1) * 12; y = Math.max(14, Math.min(50, y)); pts.push([x, y]); }
    pts[pts.length - 1][1] = pts[0][1];
    g.beginPath(); g.moveTo(0, 64); pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(TX, 64); g.closePath();
    const gr = g.createLinearGradient(0, 14, 0, 64); gr.addColorStop(0, "#f4f6fa"); gr.addColorStop(.5, "#e9ecf2"); gr.addColorStop(1, "#b8c0cc");
    g.fillStyle = gr; g.fill();
    g.strokeStyle = "rgba(255,255,255,.95)"; g.lineWidth = 2; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
    g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 1;
    pts.forEach(([x, y]) => { if(r() < .55){ g.beginPath(); g.moveTo(x + r() * 4, y + 1); g.lineTo(x + (r() - .5) * 5, y - 2 - r() * 6); g.stroke(); } });
    return c;
  }

  /* ── sonido: todo sintetizado, sin archivos ── */
  let actx = null, mudo = lee("gremory-tcg-mudo", false);
  function ac(){ if(mudo) return null; try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if(actx.state === "suspended") actx.resume(); return actx; } catch(e){ return null; } }
  function ruido(c, dur){ const b = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate), d = b.getChannelData(0); for(let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = c.createBufferSource(); s.buffer = b; return s; }
  function env(c, g, t0, a, peak, dec){ g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + a); g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + dec); }
  const SON = {
    corta(){ const c = ac(); if(!c) return; const t = c.currentTime, n = ruido(c, .5), f = c.createBiquadFilter(), g = c.createGain();
      f.type = "bandpass"; f.Q.value = 1.4; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(4200, t + .32);
      env(c, g, t, .01, .5, .4); n.connect(f).connect(g).connect(c.destination); n.start(t); n.stop(t + .5); },
    sube(){ const c = ac(); if(!c) return; const t = c.currentTime, n = ruido(c, .9), f = c.createBiquadFilter(), g = c.createGain();
      f.type = "lowpass"; f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(2600, t + .7);
      env(c, g, t, .25, .22, .6); n.connect(f).connect(g).connect(c.destination); n.start(t); n.stop(t + .9);
      [261.6, 392, 523.3].forEach((hz, k) => { const o = c.createOscillator(), og = c.createGain(); o.type = "triangle"; o.frequency.value = hz; env(c, og, t + .15 + k * .07, .02, .08, .9); o.connect(og).connect(c.destination); o.start(t + .15 + k * .07); o.stop(t + 1.3); }); },
    reparte(k){ const c = ac(); if(!c) return; const t = c.currentTime + k * .07, n = ruido(c, .12), f = c.createBiquadFilter(), g = c.createGain();
      f.type = "highpass"; f.frequency.value = 2500; env(c, g, t, .005, .25, .09); n.connect(f).connect(g).connect(c.destination); n.start(t); n.stop(t + .12); },
    gira(){ const c = ac(); if(!c) return; const t = c.currentTime, n = ruido(c, .16), f = c.createBiquadFilter(), g = c.createGain();
      f.type = "bandpass"; f.frequency.setValueAtTime(1800, t); f.frequency.exponentialRampToValueAtTime(5200, t + .12); env(c, g, t, .01, .35, .13); n.connect(f).connect(g).connect(c.destination); n.start(t); n.stop(t + .16); },
    rara(t0){ const c = ac(); if(!c) return; const t = c.currentTime + .05, notas = t0 >= 5 ? [523.3, 659.3, 784, 1046.5, 1318.5, 1568] : t0 >= 4 ? [659.3, 784, 1046.5, 1318.5] : [784, 987.8, 1174.7];
      if(t0 >= 5){ const o = c.createOscillator(), og = c.createGain(); o.type = "sine"; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(40, t + 1.2); env(c, og, t, .02, .6, 1.4); o.connect(og).connect(c.destination); o.start(t); o.stop(t + 1.6); }
      notas.forEach((hz, k) => { const o = c.createOscillator(), og = c.createGain(); o.type = "sine"; o.frequency.value = hz; env(c, og, t + k * .085, .01, .16, 1.1); o.connect(og).connect(c.destination); o.start(t + k * .085); o.stop(t + k * .085 + 1.3); }); },
    cruje(){ const c = ac(); if(!c) return; const t = c.currentTime, n = ruido(c, .07), f = c.createBiquadFilter(), g = c.createGain();
      f.type = "highpass"; f.frequency.value = 3000 + Math.random() * 2500; env(c, g, t, .003, .12, .05); n.connect(f).connect(g).connect(c.destination); n.start(t); n.stop(t + .07); },
    miau(){ const c = ac(); if(!c) return; const t = c.currentTime, o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
      o.type = "sawtooth"; f.type = "bandpass"; f.frequency.value = 1100; f.Q.value = 3;
      o.frequency.setValueAtTime(420, t); o.frequency.linearRampToValueAtTime(760, t + .12); o.frequency.linearRampToValueAtTime(520, t + .38);
      env(c, g, t, .04, .18, .4); o.connect(f).connect(g).connect(c.destination); o.start(t); o.stop(t + .5); }
  };
  const vibra = p => { if(navigator.vibrate) try { navigator.vibrate(p); } catch(e){} };

  /* ── el círculo mágico de Valeria (escena/circulo-magico.svg): cinco anillos que giran cada uno a su ritmo ── */
  const CIRCULO = '<svg class="gx-circulo gm" aria-hidden="true" viewBox="0 0 1000 1000"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><g class="gm-anillo-ext"><circle cx="500" cy="500" r="490" /><circle cx="500" cy="500" r="470" /><path d="M975.00 500.00 L986.00 500.00" /><path d="M972.40 549.65 L983.34 550.80" /><path d="M964.62 598.76 L975.38 601.05" /><path d="M951.75 646.78 L962.21 650.18" /><path d="M933.93 693.20 L943.98 697.67" /><path d="M911.36 737.50 L920.89 743.00" /><path d="M884.28 779.20 L893.18 785.66" /><path d="M852.99 817.84 L861.17 825.20" /><path d="M817.84 852.99 L825.20 861.17" /><path d="M779.20 884.28 L785.66 893.18" /><path d="M737.50 911.36 L743.00 920.89" /><path d="M693.20 933.93 L697.67 943.98" /><path d="M646.78 951.75 L650.18 962.21" /><path d="M598.76 964.62 L601.05 975.38" /><path d="M549.65 972.40 L550.80 983.34" /><path d="M500.00 975.00 L500.00 986.00" /><path d="M450.35 972.40 L449.20 983.34" /><path d="M401.24 964.62 L398.95 975.38" /><path d="M353.22 951.75 L349.82 962.21" /><path d="M306.80 933.93 L302.33 943.98" /><path d="M262.50 911.36 L257.00 920.89" /><path d="M220.80 884.28 L214.34 893.18" /><path d="M182.16 852.99 L174.80 861.17" /><path d="M147.01 817.84 L138.83 825.20" /><path d="M115.72 779.20 L106.82 785.66" /><path d="M88.64 737.50 L79.11 743.00" /><path d="M66.07 693.20 L56.02 697.67" /><path d="M48.25 646.78 L37.79 650.18" /><path d="M35.38 598.76 L24.62 601.05" /><path d="M27.60 549.65 L16.66 550.80" /><path d="M25.00 500.00 L14.00 500.00" /><path d="M27.60 450.35 L16.66 449.20" /><path d="M35.38 401.24 L24.62 398.95" /><path d="M48.25 353.22 L37.79 349.82" /><path d="M66.07 306.80 L56.02 302.33" /><path d="M88.64 262.50 L79.11 257.00" /><path d="M115.72 220.80 L106.82 214.34" /><path d="M147.01 182.16 L138.83 174.80" /><path d="M182.16 147.01 L174.80 138.83" /><path d="M220.80 115.72 L214.34 106.82" /><path d="M262.50 88.64 L257.00 79.11" /><path d="M306.80 66.07 L302.33 56.02" /><path d="M353.22 48.25 L349.82 37.79" /><path d="M401.24 35.38 L398.95 24.62" /><path d="M450.35 27.60 L449.20 16.66" /><path d="M500.00 25.00 L500.00 14.00" /><path d="M549.65 27.60 L550.80 16.66" /><path d="M598.76 35.38 L601.05 24.62" /><path d="M646.78 48.25 L650.18 37.79" /><path d="M693.20 66.07 L697.67 56.02" /><path d="M737.50 88.64 L743.00 79.11" /><path d="M779.20 115.72 L785.66 106.82" /><path d="M817.84 147.01 L825.20 138.83" /><path d="M852.99 182.16 L861.17 174.80" /><path d="M884.28 220.80 L893.18 214.34" /><path d="M911.36 262.50 L920.89 257.00" /><path d="M933.93 306.80 L943.98 302.33" /><path d="M951.75 353.22 L962.21 349.82" /><path d="M964.62 401.24 L975.38 398.95" /><path d="M972.40 450.35 L983.34 449.20" /></g><g class="gm-runas"><g transform="translate(500 500) rotate(0) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-3 -2 L5 13 M12 -6 L6 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(10) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-4 -2 L5 13 M12 -6 L7 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(20) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-5 -2 L5 13 M12 -6 L8 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(30) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-3 -2 L5 13 M12 -6 L9 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(40) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-4 -2 L5 13 M12 -6 L6 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(50) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-5 -2 L5 13 M12 -6 L7 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(60) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-3 -2 L5 13 M12 -6 L8 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(70) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-4 -2 L5 13 M12 -6 L9 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(80) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-5 -2 L5 13 M12 -6 L6 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(90) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-3 -2 L5 13 M12 -6 L7 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(100) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-4 -2 L5 13 M12 -6 L8 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(110) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-5 -2 L5 13 M12 -6 L9 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(120) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-3 -2 L5 13 M12 -6 L6 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(130) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-4 -2 L5 13 M12 -6 L7 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(140) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-5 -2 L5 13 M12 -6 L8 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(150) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-3 -2 L5 13 M12 -6 L9 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(160) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-4 -2 L5 13 M12 -6 L6 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(170) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-5 -2 L5 13 M12 -6 L7 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(180) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-3 -2 L5 13 M12 -6 L8 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(190) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-4 -2 L5 13 M12 -6 L9 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(200) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-5 -2 L5 13 M12 -6 L6 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(210) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-3 -2 L5 13 M12 -6 L7 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(220) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-4 -2 L5 13 M12 -6 L8 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(230) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-5 -2 L5 13 M12 -6 L9 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(240) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-3 -2 L5 13 M12 -6 L6 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(250) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-4 -2 L5 13 M12 -6 L7 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(260) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-5 -2 L5 13 M12 -6 L8 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(270) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-3 -2 L5 13 M12 -6 L9 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(280) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-4 -2 L5 13 M12 -6 L6 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(290) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-5 -2 L5 13 M12 -6 L7 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(300) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-3 -2 L5 13 M12 -6 L8 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(310) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-4 -2 L5 13 M12 -6 L9 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(320) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-5 -2 L5 13 M12 -6 L6 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(330) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-3 -2 L5 13 M12 -6 L7 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(340) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-4 -2 L5 13 M12 -6 L8 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g><g transform="translate(500 500) rotate(350) translate(0 -435)"><path d="M-13 -5 L-5 -15 L12 -6 L5 13 L-10 8 Z M-5 -15 L-5 -2 L5 13 M12 -6 L9 -1"/><circle cx="-4" cy="3" r="3"/><circle cx="15" cy="13" r="2"/></g></g><g class="gm-anillo-med"><circle cx="500" cy="500" r="390" /><path d="M500.000 120.000 L664.876 842.368 L202.904 263.074 L870.473 584.558 L129.527 584.558 L797.096 263.074 L335.124 842.368 Z" /></g><g class="gm-anillo-int"><circle cx="500" cy="500" r="230" /><circle cx="500" cy="500" r="215" /><g transform="translate(500 500) rotate(0) translate(0 -222)"><path d="M-23 0 Q0 -28 23 0 Q0 28 -23 0 Z M0 -9 L0 9" /></g><g transform="translate(500 500) rotate(120) translate(0 -222)"><path d="M-23 0 Q0 -28 23 0 Q0 28 -23 0 Z M0 -9 L0 9" /></g><g transform="translate(500 500) rotate(240) translate(0 -222)"><path d="M-23 0 Q0 -28 23 0 Q0 28 -23 0 Z M0 -9 L0 9" /></g></g><g class="gm-estrella"><path d="M572.580 385.400 L522.920 370.120 L456.070 370.120 L417.870 408.320 L417.870 585.950 L456.070 629.880 L536.290 629.880 L580.220 595.500 L580.220 515.280 L511.460 515.280 L500.000 538.200 L542.020 538.200 L542.020 585.950 L522.920 603.140 L471.350 603.140 L456.070 582.130 L456.070 415.960 L477.080 396.860 L526.740 396.860 L557.300 425.510 L572.580 446.520 Z" /></g></g></svg>';
  function circuloSVG(){ return CIRCULO; }


  /* ── un sobre ── */
  const dientes = (n, h, arriba) => "polygon(" + (arriba
    ? Array.from({length: n * 2 + 1}, (_, i) => (i / (n * 2) * 100).toFixed(2) + "% " + (i % 2 ? 0 : h) + "%").join(",") + ",100% 100%,0 100%"
    : "0 0,100% 0," + Array.from({length: n * 2 + 1}, (_, i) => (100 - i / (n * 2) * 100).toFixed(2) + "% " + (i % 2 ? 100 : 100 - h) + "%").join(",")) + ")";
  const DI_A = dientes(34, 30, true), DI_B = dientes(34, 30, false);
  function arteDe(k){
    if(extra["sobre-" + k]) return '<img class="gx-solo" src="' + extra["sobre-" + k] + '" alt="">';
    const [id, cl] = SOBRES[k].arte, a = (D1.ART[id] || {})[cl] || {}, fondo = cl === "gre" ? a.g2 : a.fondo;
    return a.pj && a.pj !== VACIA ? '<img src="' + fondo + '" alt=""><img src="' + a.pj + '" alt="">' : '';
  }
  function sobreHTML(k, clase, lista){
    const S = SOBRES[k], L = lista && LIENZO[k] && LIENZO[k].listo;
    if(L && L.url) return '<div class="gx-sobre lista ' + (clase || "") + '" data-sobre="' + k + '" style="--c:' + S.col + ';--c2:' + S.col2 + '">' +
      '<div class="gx-gira"><img class="gx-portada" src="' + L.url + '" alt=""><div class="gx-brillo"></div></div></div>';
    return '<div class="gx-sobre ' + (clase || "") + '" data-sobre="' + k + '" style="--c:' + S.col + ';--c2:' + S.col2 + '">' +
      '<div class="gx-gira"><div class="gx-cuerpo"><div class="gx-arte">' + arteDe(k) + '</div><div class="gx-velo"></div><div class="gx-foil"></div><div class="gx-luz"></div>' +
        '<div class="gx-cab"><i class="gx-logo"></i><b>Gremory</b><span>Trading Card Game · Set 1</span></div>' +
        '<div class="gx-pie"><span>Set ' + SET.num + '</span><b>' + SET.nombre + '</b></div><div class="gx-filo"></div></div>' +
      '<div class="gx-tapa" style="clip-path:' + DI_A + '"><i class="gx-raya"></i></div><div class="gx-cola" style="clip-path:' + DI_B + '"></div></div></div>';
  }

  /* ── la pestaña de sobres: los tres para elegir ── */
  /* ── la pestaña de sobres: carrusel con los tres (como en Pocket): se desliza o se toca para elegir ── */
  let elegido = lee("gremory-tcg-sobre", "gatos");
  const ORDEN = ["alberto", "gatos", "cristina"];
  function sobresHTML(){
    miraExtra(); precarga3d();
    const d = disponibles(yo()), nb = !!nubeBase(), puede = d.total && nb, i0 = ORDEN.indexOf(elegido);
    return '<div class="gx-tienda" style="--c:' + SOBRES[elegido].col + ';--c2:' + SOBRES[elegido].col2 + '"><div class="gx-cielo"></div>' +
      '<div class="gx-set"><small>Set ' + SET.num + '</small><b>' + SET.nombre + '</b></div>' +
      '<div class="gx-carrusel' + (puede ? " puede" : " apagado") + '" id="gxCarrusel">' + ORDEN.map((k, i) => { const p = i - i0; return '<button class="gx-elige' + (p ? '' : ' on') + '" data-elige="' + k + '" aria-label="' + (puede ? "Abrir sobre" : "Sobre") + '" style="' + posCarrusel(p) + '">' + sobreHTML(k, "", true) + '</button>'; }).join("") + '</div>' +
      (d.total ? '' : '<img class="gx-vacio" src="' + ARTE("vacio-sin-sobres") + '" alt="">') +
      '<div class="gx-contador' + (d.total ? '' : ' cero') + '">' + (d.total ? ICO.sobre + '<b>' + d.total + '</b>' : ICO.reloj + '<span>Mañana, dos más</span>') + '</div>' +
      (d.total && !nb ? '<p class="tg-nota" style="text-align:center">Para abrirlos, activa la sincronización en Ajustes.</p>' : '') + '</div>';
  }

  const posCarrusel = p => "transform:translateX(-50%) translateX(" + (p * 64) + "%) scale(" + (p ? .72 : 1) + ") rotate(" + (p * 4) + "deg);z-index:" + (3 - Math.abs(p));
  /* elegir sobre mueve el carrusel sin volver a pintar la pestaña (repintar recargaba las portadas y parpadeaba todo) */
  function eligeSobre(k){
    elegido = k; guarda("gremory-tcg-sobre", k);
    const c = cuerpo && cuerpo.querySelector("#gxCarrusel");
    if(!c) return pinta();
    const i0 = ORDEN.indexOf(k), S = SOBRES[k], t = cuerpo.querySelector(".gx-tienda");
    c.querySelectorAll(".gx-elige").forEach(b => { const p = ORDEN.indexOf(b.dataset.elige) - i0; b.classList.toggle("on", !p); b.style.cssText = posCarrusel(p); });
    if(t){ t.style.setProperty("--c", S.col); t.style.setProperty("--c2", S.col2); }
    lienzos(k);
  }
  /* cuando llega la portada compuesta de un sobre, se cambia solo ese sobre */
  function ponPortada(k){
    const b = cuerpo && cuerpo.querySelector('#gxCarrusel .gx-elige[data-elige="' + k + '"]');
    if(b) b.innerHTML = sobreHTML(k, "", true);
  }
  function deslizaCarrusel(){
    const c = cuerpo && cuerpo.querySelector("#gxCarrusel"); if(!c || c._ok) return; c._ok = 1;
    let x0 = null;
    c.addEventListener("pointerdown", e => { x0 = e.clientX; });
    c.addEventListener("pointerup", e => { if(x0 == null) return; const dx = e.clientX - x0; x0 = null;
      if(Math.abs(dx) > 40){ const i = ORDEN.indexOf(elegido) + (dx < 0 ? 1 : -1); if(i >= 0 && i < ORDEN.length){ c._swipe = 1; setTimeout(() => c._swipe = 0, 60); eligeSobre(ORDEN[i]); } } });
    c.addEventListener("click", e => { if(c._swipe){ e.stopPropagation(); e.preventDefault(); } }, true);
  }

  function abreSobre(){
    const pid = yo(), d = disponibles(pid);
    if(!d.total || !nubeBase()) return;
    let s;
    if(d.pre.length){ s = d.pre[0]; s.abierto = true; s.t = ahora(); s.sobre = elegido; }
    else { s = {id: d.libres[0], d: pid, tipo: "dia", motivo: "Sobre del día", f: hoy(), abierto: true, t: ahora(), sobre: elegido}; A.S.tcgSobres.push(s); }
    const tenia = coleccion(pid), vistas = {};
    const cartas = genera(s.id).map((x, i) => {   /* los tres sobres traen lo mismo: solo cambia la portada */
      const k = x.c + "|" + x.v, nueva = !(tenia[x.c] && tenia[x.c].v[x.v]) && !vistas[k]; vistas[k] = 1;
      return Object.assign(x, {id: s.id + ":" + i, nueva, nivel: nivel(x.c, x.v)});
    });
    cartas.forEach(x => { if(!inst(x.id)) A.S.tcgCartas.push({id: x.id, c: x.c, v: x.v, d: pid, t: ahora(), o: "sobre"}); });
    save();
    escena(cartas, s.sobre || elegido);
  }

  /* ══ la apertura (tercera versión: Pocket + gachas) ══
     cielo de noche con estrellas → el sobre en grande → se corta deslizando → estalla la luz y cruza una estrella fugaz
     del color de la mejor carta (azul normal, morada rara, dorada muy rara, rosa Gremory) → las cartas en pila: se pasan
     deslizando, como en Pocket → la rara, la última, boca abajo brillando: al tocarla, presentación a pantalla completa
     con el personaje, su nombre y las estrellas (como un gacha) → resumen con las cinco */
  /* marcas de rareza en el revelado: de 1 a 4 gemas, la de Gremory sola o la secreta sola */
  const MARCAS = {1: ["gema", 1], 2: ["gema", 2], 3: ["gema", 3], 4: ["gema", 4], 5: ["gremory", 1], sec: ["secreta", 1]};
  const SPLASH = {1: "holo", 2: "holo", 3: "rara", 4: "muyrara", 5: "gremory", sec: "secreta"};
  const CIELO = {1:"#3b5bdb", 2:"#3b7bdb", 3:"#6d3bdb", 4:"#c98a1a", 5:"#c2187a", sec:"#b0103a"};
  const GATOS = {"kurama":[21,27], "sukuna":[28,34], "gyukki":[35,41]};
  const gatoDe = c => { const n = num(c); for(const q in GATOS) if(n >= GATOS[q][0] && n <= GATOS[q][1]) return q; return null; };
  function capasDe(id){
    const a = D1.ART[id] || {};
    for(const k of ["gre", "oro", "firma", "full", "esc", "est"]){ const x = a[k]; if(x && x.pj && x.pj !== VACIA) return {pj: x.pj, fondo: k === "gre" ? x.g2 : x.fondo}; }
    if(a.casa && a.casa !== VACIA) return {fondo: a.casa};
    return null;
  }
  function escena(cartas, k){
    const cap = document.getElementById("tgAbre"), S = SOBRES[k];
    if(cap._s3){ cap._s3.destruye(); cap._s3 = null; }
    const mejor = cartas.reduce((m, x) => { const t = tierDe(x); return t === "sec" || (m !== "sec" && t > m) ? t : m; }, 1);
    cap.className = "tg-capa on gv"; cap.style.cssText = "--c:" + S.col + ";--c2:" + S.col2 + ";--tier:" + TIER[mejor][0] + ";--cielo:#2b3a8f";
    cap.dataset.sobre = k;
    cap.innerHTML = '<div class="gv-cielo"></div><div class="gv-estrellas"></div><div class="gv-estrellas dos"></div><div class="gv-nubes"></div><div class="gv-tejados"></div><div class="gv-bruma"></div>' +
      '<div class="gv-rayos"></div><div class="gv-magia">' + circuloSVG() + '</div>' +
      '<button class="gx-mudo" data-mudo aria-label="Sonido">' + icoSon() + '</button>' +
      '<div class="gv-centro">' + sobreHTML(k, "vivo entra") + '<div class="gv-guia"><i></i></div></div>' +
      '<div class="gv-pila" id="gvPila"></div><div class="gv-splash" id="gvSplash"></div>' +
      '<div class="gx-pista" id="gxPista">Desliza por la línea de arriba para abrirlo</div><div class="gx-final" id="gxFinal"></div>';
    cap.querySelector("[data-mudo]").onclick = e => { e.stopPropagation(); mudo = !mudo; guarda("gremory-tcg-mudo", mudo); e.currentTarget.innerHTML = icoSon(); };
    G.luz.on(cap);
    if(!pon3d(cap, cartas, mejor, k)) corte(cap, cartas, mejor);
  }
  /* el sobre en 3D en lugar del de CSS (que se queda oculto debajo, para medir dónde salen las chispas) */
  const punto = (x, y) => ({getBoundingClientRect: () => ({left: x - 1, top: y - 1, width: 2, height: 2})});
  function pon3d(cap, cartas, mejor, k){
    const L = LIENZO[k] && LIENZO[k].listo;
    if(!S3 || !L) return false;
    try {
      cap._s3 = S3.crea(cap, {frente: L.frente, dorso: L.dorso, rasgado: L.rasgado, color: L.color, tier: TIER[mejor][0],
        brilloF: L.brilloF, brilloD: L.brilloD, arrugas: L.arrugas, interior: L.interior, destello: L.destello,
        alRasgar: (p, x, y) => { SON.cruje(); chispas(cap, punto(x, y), "#fff", 3, 60, .5); },
        alAbrir: () => abierto(cap, cartas, mejor)});
    } catch(e){ console.warn("sobre 3D", e); cap._s3 = null; return false; }
    const c = cap.querySelector(".gv-centro"); c.style.visibility = "hidden";
    const g = c.querySelector(".gv-guia"); if(g) g.remove();
    cap.querySelector("#gxPista").textContent = "Desliza por la línea de arriba para abrirlo";
    return true;
  }
  /* lo que pasa al abrirse, sea el sobre en 3D o el de CSS */
  function abierto(cap, cartas, mejor){
    const sob = cap.querySelector(".gx-sobre");
    SON.corta(); vibra(25);
    const gu = cap.querySelector(".gv-centro .gv-guia"); if(gu) gu.remove();
    cap.querySelector("#gxPista").classList.add("fuera");
    setTimeout(() => { cap.classList.add("estalla"); SON.sube(); chispas(cap, sob, "#fff", 40, 240, .1); particulas(cap, sob, cap.dataset.sobre, 22); }, 200);
    setTimeout(() => estrella(cap, cartas, mejor), 900);
  }
  function icoSon(){ return mudo ? ICO.silencio : ICO.sonido; }

  function corte(cap, cartas, mejor){
    const sob = cap.querySelector(".gx-sobre"), raya = sob.querySelector(".gx-raya");
    let x0 = null, ini = 0, p = 0, hecho = false, max = 0, movido = false;
    const pon = v => { p = Math.max(p, Math.min(1, v)); raya.style.setProperty("--p", p.toFixed(3)); sob.classList.toggle("tenso", p > 0 && p < 1); };
    const fin = () => {
      if(hecho) return; hecho = true; pon(1);
      sob.classList.add("cortado"); abierto(cap, cartas, mejor);
    };
    const auto = () => { const t0 = performance.now(), v0 = p; const paso = t => { const k = Math.min(1, (t - t0) / 420); pon(v0 + (1 - v0) * k); if(k < 1) requestAnimationFrame(paso); else fin(); }; requestAnimationFrame(paso); };
    setTimeout(() => sob.classList.remove("entra"), 900);
    sob.addEventListener("pointerdown", e => { if(hecho) return; const r = sob.getBoundingClientRect(); x0 = e.clientX; ini = (e.clientX - r.left) / r.width; movido = false; try { sob.setPointerCapture(e.pointerId); } catch(_){} });
    sob.addEventListener("pointermove", e => { if(x0 == null || hecho) return; const r = sob.getBoundingClientRect(), x = (e.clientX - r.left) / r.width;
      if(Math.abs(e.clientX - x0) > 6) movido = true; max = Math.max(max, Math.abs(x - ini)); pon(max / .75); if(p >= 1) fin(); });
    sob.addEventListener("pointerup", () => { if(x0 == null) return; x0 = null; if(hecho) return; if(!movido || p > .4) auto(); });
  }
  /* la estrella fugaz: su color avisa de lo mejor que trae el sobre (como el deseo de Genshin) */
  function estrella(cap, cartas, mejor){
    cap.style.setProperty("--cielo", CIELO[mejor]);
    cap.classList.add("noche", "t" + mejor);
    const e = document.createElement("div"); e.className = "gv-fugaz" + (mejor >= 4 || mejor === "sec" ? " grande" : "");
    cap.appendChild(e);
    if(mejor >= 3 || mejor === "sec") setTimeout(() => SON.rara(mejor === "sec" ? 5 : mejor), 250);
    setTimeout(() => { cap.querySelector(".gx-sobre").classList.add("vacia"); if(cap._s3){ const s3 = cap._s3; cap._s3 = null; s3.vacia(); } }, 300);
    setTimeout(() => { e.remove(); pila(cap, cartas, 0); }, 1500);
  }
  /* 2. la pila: boca arriba, la de encima se pasa deslizando (o tocando); la rara, la última, sale boca abajo */
  function pila(cap, cartas, i){
    const pl = cap.querySelector("#gvPila"), n = cartas.length, pista = cap.querySelector("#gxPista");
    if(i >= n) return final(cap, cartas);
    const x = cartas[i], t = tierDe(x), rara = t >= 3 || t === "sec", ult = i === n - 1;
    cap.classList.add("pilando"); pl.className = "gv-pila" + (i === 0 ? " entra" : "");
    pl.innerHTML = cartas.slice(i).map((y, k) => { const ty = tierDe(y), oculta = k === 0 ? (rara && ult) : (i + k === n - 1);
      return '<div class="gv-carta' + (k === 0 ? " arriba" : "") + (oculta ? " oculta" : "") + '" data-tier="' + ty + '" style="--k:' + k + ';--tc:' + TIER[ty][0] + ';z-index:' + (10 - k) + '">' +
        '<div class="gx-voltea"><div class="tg-dorso"></div><div class="gx-cara">' + G.carta(y.c, y.v) + (y.nueva ? '<span class="gx-nueva">Nueva</span>' : '') + '</div></div></div>'; }).reverse().join("") +
      '<div class="gv-cuenta">' + (i + 1) + ' / ' + n + '</div>';
    const top = pl.querySelector(".gv-carta.arriba");
    pista.classList.remove("fuera");
    pista.textContent = rara && ult ? "La última brilla… tócala" : i === 0 ? "Desliza para pasar a la siguiente" : (ult ? "La última" : "Desliza para pasar");
    if(!(rara && ult)){ if(x.nueva) SON.reparte(0); const q = gatoDe(x.c); if(q && i > 0) {} }
    G.luz.on(top);
    let x0 = null, y0 = null, dx = 0, dy = 0, fuera = false;
    const tira = (vx, vy) => {
      if(fuera) return; fuera = true; SON.gira();
      top.style.transition = "transform .38s ease-in, opacity .38s"; top.style.transform = "translate(" + (vx * 120) + "vw," + (vy * 60) + "vh) rotate(" + (vx * 28) + "deg)"; top.style.opacity = 0;
      setTimeout(() => pila(cap, cartas, i + 1), 260);
    };
    const revela = () => { if(fuera) return; fuera = true; splash(cap, x, () => { top.classList.remove("oculta"); top.classList.add("girada"); fuera = false; SON.gira();
      pista.textContent = "Toca para ver el resumen"; top.onclick = () => final(cap, cartas); }); };
    top.addEventListener("pointerdown", e => { if(fuera) return; x0 = e.clientX; y0 = e.clientY; dx = dy = 0; top.style.transition = "none"; try { top.setPointerCapture(e.pointerId); } catch(_){} });
    top.addEventListener("pointermove", e => { if(x0 == null || fuera || top.classList.contains("oculta")) return; dx = e.clientX - x0; dy = e.clientY - y0;
      top.style.transform = "translate(" + dx + "px," + dy + "px) rotate(" + (dx / 18) + "deg)"; });
    top.addEventListener("pointerup", () => { if(x0 == null) return; x0 = null;
      if(top.classList.contains("oculta")) return revela();
      if(top.classList.contains("girada")) return;
      const d = Math.hypot(dx, dy);
      if(d > 70) tira(dx / d, dy / d);
      else if(d < 8 && !ult) tira(-1, -.15);
      else if(d < 8 && ult) final(cap, cartas);
      else { top.style.transition = "transform .3s cubic-bezier(.3,1.5,.5,1)"; top.style.transform = ""; } });
  }
  /* 3. la presentación de la rara: el personaje a pantalla completa, su nombre y las estrellas */
  function splash(cap, x, listo){
    const t = tierDe(x), sp = cap.querySelector("#gvSplash"), cs = capasDe(x.c), nom = (G.CARTAS[x.c] || {}).n || "", [marca, est] = MARCAS[t];
    cap.style.setProperty("--tier", TIER[t][0]); cap.style.setProperty("--cielo", CIELO[t]);
    cap.classList.add("revela"); if(t >= 5 || t === "sec") cap.classList.add("flash");
    SON.rara(t === "sec" ? 5 : t); vibra(t >= 4 ? [20, 50, 40] : 20);
    sp.innerHTML = '<div class="gv-sp-fondo" style="background-image:url(' + ARTE("splash-" + SPLASH[t]) + ')"></div><div class="gv-sp-rayos"></div><div class="gv-sp-magia">' + circuloSVG() + '</div><div class="gv-sp-lineas"></div>' +
      (cs && cs.pj ? '<img class="gv-sp-pj" src="' + cs.pj + '" alt="">' : cs && cs.fondo ? '<img class="gv-sp-cuadro" src="' + cs.fondo + '" alt="">' : '') +
      '<div class="gv-sp-txt"><em>' + TIER[t][1] + ' · ' + G.nombreVer(x.c, x.v) + '</em><b>' + esc(nom) + '</b><div class="gv-sp-est m-' + marca + '">' + Array.from({length: est}, (_, k) => '<i style="--k:' + k + '">' + GEMA[marca] + '</i>').join("") + '</div>' +
      (x.nueva ? '<span class="gx-nueva">Nueva</span>' : '') + '</div><div class="gv-sp-toca">Toca para continuar</div>';
    sp.classList.add("on");
    for(let k = 0; k < est; k++) setTimeout(() => SON.reparte(0), 900 + k * 160);
    const q = gatoDe(x.c); if(q) setTimeout(() => SON.miau(), 700);
    chispas(cap, sp, TIER[t][0], t >= 4 ? 60 : 36, 320);
    setTimeout(() => { sp.onclick = () => { sp.onclick = null; sp.classList.remove("on"); sp.classList.add("sale"); cap.classList.remove("flash");
      setTimeout(() => { sp.classList.remove("sale"); sp.innerHTML = ""; listo(); }, 450); }; }, 700);
  }
  function chispas(cap, el, color, n, fuerza, alto){
    if(reduce()) return;
    const r = el.getBoundingClientRect(), rc = cap.getBoundingClientRect();
    for(let k = 0; k < n; k++){
      const c = document.createElement("i"), ang = Math.random() * Math.PI * 2, d = (.4 + Math.random()) * (fuerza || 160);
      c.className = "gx-chispa" + (k % 3 ? "" : " grande") + (k % 4 ? "" : " estela");
      c.style.cssText = "left:" + (r.left - rc.left + r.width * (.2 + Math.random() * .6)) + "px;top:" + (r.top - rc.top + r.height * (alto == null ? .5 : alto)) + "px;--dx:" + (Math.cos(ang) * d).toFixed(0) + "px;--dy:" + (Math.sin(ang) * d - 70).toFixed(0) + "px;--c:" + color + ";animation-delay:" + (Math.random() * 160).toFixed(0) + "ms";
      cap.appendChild(c); setTimeout(() => c.remove(), 1700);
    }
  }
  /* partículas de cada sobre (atlas de Valeria, 4×4): gotas para Alberto, pétalos y flores para Cristina, huellas y brasas para los gatos */
  const PART = {alberto: [6, 7, 6, 1], cristina: [4, 5, 4, 13], gatos: [12, 8, 9, 10]};
  function particulas(cap, el, k, n){
    if(reduce() || !el) return;
    const r = el.getBoundingClientRect(), rc = cap.getBoundingClientRect(), celdas = PART[k] || PART.gatos;
    for(let i = 0; i < n; i++){
      const c = document.createElement("i"), cel = celdas[i % celdas.length], ang = -Math.PI / 2 + (Math.random() - .5) * 2.4, d = 160 + Math.random() * 260;
      c.className = "gx-part";
      c.style.cssText = "left:" + (r.left - rc.left + r.width * (.15 + Math.random() * .7)) + "px;top:" + (r.top - rc.top + r.height * .12) + "px;--dx:" + (Math.cos(ang) * d).toFixed(0) + "px;--dy:" + (Math.sin(ang) * d).toFixed(0) + "px;--g:" + (Math.random() * 540 - 270).toFixed(0) + "deg;--s:" + (.6 + Math.random() * .7).toFixed(2) +
        ";background-position:" + (cel % 4) * 100 / 3 + "% " + Math.floor(cel / 4) * 100 / 3 + "%;animation-delay:" + (Math.random() * 200).toFixed(0) + "ms";
      cap.appendChild(c); setTimeout(() => c.remove(), 2400);
    }
  }
  /* 4. el resumen: las cinco a la vista (como en Pocket), cómo va el binder y dos botones iguales */
  function final(cap, cartas){
    if(cap.classList.contains("fin")) return;
    if(cap._s3){ cap._s3.destruye(); cap._s3 = null; }
    const nuevas = cartas.filter(x => x.nueva).length, col = coleccion(yo()), tengo = Object.keys(col).length, total = L.filter(e => e.ok && e.n !== "061").length;
    cap.classList.remove("pilando", "revela"); cap.classList.add("fin"); G.luz.off();
    const d = disponibles(yo()).total;
    cap.querySelector("#gxPista").classList.add("fuera");
    cap.querySelector("#gvPila").innerHTML = '<div class="gv-rejilla">' + cartas.map((x, k) => { const t = tierDe(x);
      return '<div class="gv-mini" data-tier="' + t + '" style="--tc:' + TIER[t][0] + ';--k:' + k + '">' + G.carta(x.c, x.v) + (x.nueva ? '<span class="gx-nueva">Nueva</span>' : '') + '</div>'; }).join("") + '</div>';
    cap.querySelector("#gxFinal").innerHTML = '<div class="gx-resumen"><b>' + (nuevas ? (nuevas === 1 ? "+1 carta nueva" : "+" + nuevas + " cartas nuevas") : "Todas repetidas") + '</b>' +
      '<span>' + (nuevas === 5 ? "las cinco, estrenadas" : nuevas ? (5 - nuevas) + (5 - nuevas === 1 ? " repetida para cambiar" : " repetidas para cambiar") : "buenas para cambiar") + '</span>' +
      '<div class="gx-barra"><i style="width:' + Math.round(tengo / total * 100) + '%"></i></div><em>Tu binder: ' + tengo + ' de ' + total + '</em></div>' +
      '<div class="gx-botones"><button class="tg-btn sec" data-ab="fin">Al binder</button><button class="tg-btn" data-ab="otro"' + (d ? '' : ' disabled') + '>' + (d ? "Abrir otro (" + d + ")" : "No quedan") + '</button></div>';
    cap.querySelector("#gxFinal").onclick = e => { const b = e.target.closest("[data-ab]"); if(!b || b.disabled) return; cap.className = "tg-capa"; cap.innerHTML = "";
      if(b.dataset.ab === "otro") abreSobre(); else { tab = "binder"; quien = yo(); pinta(); } };
  }

  /* ── cambios ── */
  let prop = {};
  function propuesta(p){ prop = Object.assign({doy: "", pido: ""}, p); pintaProp(); document.getElementById("tgProp").classList.add("on"); }
  function miniBol(x, sel, attr){
    const e = entrada(x.c);
    return '<div class="bd-bol' + (sel ? ' sel' : '') + '" ' + attr + '="' + x.id + '"><img src="' + e.th + '" alt="" loading="lazy"><span class="bd-num">' + e.n + '</span><span class="bd-v">' + G.nombreVer(x.c, x.v) + '</span></div>';
  }
  function pintaProp(){
    const cap = document.getElementById("tgProp"), o = otro(), res = reservadas();
    const mias = sobrantes(yo());
    const vistas = {}, suyas = de(o).filter(x => !res[x.id]).filter(x => { const k = x.c + "|" + x.v; if(vistas[k]) return false; vistas[k] = 1; return true; }).sort((a, b) => a.c > b.c ? 1 : -1);
    cap.innerHTML = '<button class="tg-x" data-p="cierra" aria-label="Cerrar">' + ICO.x + '</button>' +
      '<div style="width:min(100%,720px);max-height:100%;overflow:auto;display:flex;flex-direction:column;gap:6px">' +
      '<div class="tg-tit"><b>Proponer un cambio</b><span>Una tuya repetida por una de ' + esc(nom(o)) + '</span></div>' +
      '<div class="tg-h3">Tú das (tus repetidas)</div>' + (mias.length ? '<div class="tg-elige">' + mias.map(x => miniBol(x, x.id === prop.doy, "data-doy")).join("") + '</div>' : '<p class="tg-nota">Aún no tienes repetidas. Abre sobres y vuelve.</p>') +
      '<div class="tg-h3">Te llevas (de ' + esc(nom(o)) + ')</div>' + (suyas.length ? '<div class="tg-elige">' + suyas.map(x => miniBol(x, x.id === prop.pido, "data-pido")).join("") + '</div>' : '<p class="tg-nota">' + esc(nom(o)) + ' aún no tiene cartas.</p>') +
      '<div class="tg-acc" style="margin-top:12px;position:sticky;bottom:0;padding:10px 0;background:rgba(6,5,10,.85)"><button class="tg-btn" data-p="manda"' + (prop.doy && prop.pido ? '' : ' disabled') + '>Proponer cambio</button></div></div>';
  }
  function clicProp(e){
    const cap = document.getElementById("tgProp");
    if(e.target === cap) return cap.classList.remove("on");
    const b = e.target.closest("[data-p],[data-doy],[data-pido]"); if(!b) return;
    if(b.dataset.doy){ prop.doy = b.dataset.doy; return pintaProp(); }
    if(b.dataset.pido){ prop.pido = b.dataset.pido; return pintaProp(); }
    if(b.dataset.p === "cierra") return cap.classList.remove("on");
    if(b.dataset.p === "manda" && prop.doy && prop.pido){
      const a = inst(prop.doy), z = inst(prop.pido), o = otro();
      A.S.tcgCambios.push({id: uid(), de: yo(), para: o, doy: a.id, pido: z.id, estado: "pendiente", f: hoy(), t: ahora()});
      save(); cap.classList.remove("on");
      avisa(o, "Cambio de cartas", nom(yo()) + " te ofrece su " + desc(a) + " por tu " + desc(z) + ".");
      toast("Propuesta enviada a " + nom(o)); tab = "cambios"; pinta();
    }
  }
  const desc = x => x ? G.CARTAS[x.c].n + " " + G.nombreVer(x.c, x.v) + " (" + entrada(x.c).n + ")" : "carta";
  function avisa(para, titulo, cuerpoTxt){ try { apiNube("/avisa", "POST", {de: yo(), para, titulo, cuerpo: cuerpoTxt}).catch(() => {}); } catch(e){} }
  function cambiosHTML(){
    const mios = A.S.tcgCambios.filter(c => (c.de === yo() || c.para === yo()) && !borr()[c.id]).sort((a, b) => a.t < b.t ? 1 : -1);
    const ent = mios.filter(c => c.estado === "pendiente" && c.para === yo()), sal = mios.filter(c => c.estado === "pendiente" && c.de === yo()), his = mios.filter(c => c.estado !== "pendiente").slice(0, 12);
    const fila = (c, pie) => {
      const a = inst(c.doy), z = inst(c.pido), meDa = c.para === yo();
      const izq = meDa ? a : z, der = meDa ? z : a;
      return '<div class="tg-cambio"><div class="que">' + (meDa ? '<b>' + esc(nom(c.de)) + '</b> te da su ' + esc(desc(a)) + ' por tu ' + esc(desc(z)) : 'Das tu ' + esc(desc(a)) + ' por su ' + esc(desc(z))) +
        '<small>' + (c.estado === "pendiente" ? (meDa ? "Te toca decidir" : "Esperando a " + esc(nom(c.para))) : ({aceptado:"Hecho", rechazado:"Rechazado", cancelado:"Cancelado", caducado:"Ya no se podía"}[c.estado] || c.estado)) + ' · ' + c.f + '</small></div>' +
        '<div class="par">' + (izq ? miniBol(izq, false, "data-x") : '<div></div>') + '<div class="flecha">' + ICO.cambio + '</div>' + (der ? miniBol(der, false, "data-x") : '<div></div>') + '</div>' +
        (pie ? '<div class="pie">' + pie + '</div>' : '') + '</div>';
    };
    return (otro() ? '<div class="tg-acc" style="margin:2px 0 14px"><button class="tg-btn" data-acc="propon">' + ICO.cambio + ' Proponer un cambio</button></div>' : '') +
      (ent.length ? '<div class="tg-h3">Te proponen</div><div class="tg-lista">' + ent.map(c => fila(c, '<button class="tg-btn mal" data-cb="rechaza" data-id="' + c.id + '">Rechazar</button><button class="tg-btn" data-cb="acepta" data-id="' + c.id + '">Aceptar</button>')).join("") + '</div>' : '') +
      (sal.length ? '<div class="tg-h3">Has propuesto</div><div class="tg-lista">' + sal.map(c => fila(c, '<button class="tg-btn sec" data-cb="cancela" data-id="' + c.id + '">Cancelar</button>')).join("") + '</div>' : '') +
      (his.length ? '<div class="tg-h3">Últimos</div><div class="tg-lista">' + his.map(c => fila(c, "")).join("") + '</div>' : '') +
      (!ent.length && !sal.length && !his.length ? '<p class="tg-nota" style="text-align:center;margin-top:20px">Aún no hay cambios. Abre una carta repetida en tu binder y ofrécesela, o pide una desde el binder del otro.</p>' : '');
  }
  function resuelve(id, que){
    const c = A.S.tcgCambios.find(x => x.id === id); if(!c || c.estado !== "pendiente") return;
    if(que === "acepta"){
      const a = inst(c.doy), z = inst(c.pido);
      if(!a || !z || a.d !== c.de || z.d !== c.para || borr()[a.id] || borr()[z.id]){ c.estado = "caducado"; c.t = ahora(); save(); toast("Ya no se puede: alguna de las cartas ha cambiado de dueño"); return pinta(); }
      a.d = c.para; a.t = ahora(); a.o = "cambio"; z.d = c.de; z.t = ahora(); z.o = "cambio";
      c.estado = "aceptado"; c.t = ahora(); save();
      avisa(c.de, "Cambio hecho", nom(yo()) + " ha aceptado: ya tienes su " + desc(z) + ".");
      toast("Hecho: ya está en tu binder");
    } else {
      c.estado = que === "rechaza" ? "rechazado" : "cancelado"; c.t = ahora(); save();
      if(que === "rechaza") avisa(c.de, "Cambio rechazado", nom(yo()) + " prefiere quedarse su " + desc(inst(c.pido)) + ".");
    }
    pinta();
  }

  /* ── clics de la ventana principal ── */
  function clic(e){
    const b = e.target.closest("[data-elige],[data-acc],[data-tab],[data-yo],[data-quien],[data-tapa],[data-ir],[data-cb],.bd-bol[data-id]"); if(!b) return;
    if(b.dataset.acc === "cierra") return cierra();
    if(b.dataset.elige){   /* el sobre del centro se abre al tocarlo (si quedan); los de los lados se traen al centro */
      if(b.dataset.elige === elegido){ const dd = disponibles(yo()); if(dd.total && nubeBase()) return abreSobre(); return; }
      return eligeSobre(b.dataset.elige);
    }
    if(b.dataset.acc === "abrir") return abreSobre();
    if(b.dataset.acc === "propon") return propuesta({});
    if(b.dataset.tab){ tab = b.dataset.tab; return pinta(); }
    if(b.dataset.yo){ A.S.yo = b.dataset.yo; save(); premia(); save(); quien = A.S.yo; return pinta(); }
    if(b.dataset.quien){ quien = b.dataset.quien; return pinta(); }
    if(b.dataset.tapa){ tapas[quien] = b.dataset.tapa; guarda("gremory-tcg-tapas", tapas); return pinta(); }
    if(b.dataset.ir){ return pasa(+b.dataset.ir); }
    if(b.dataset.cb) return resuelve(b.dataset.id, b.dataset.cb);
    if(b.dataset.id) return abreVisor(b.dataset.id);
  }
  document.addEventListener("change", e => {
    if(e.target.id !== "tgIr" || !e.target.value) return;
    const k = L.findIndex(x => x.n === e.target.value), p = Math.floor(k / PAG); pag = movil() ? p : p - (p % 2); pinta();
  });

  function cierra(){ raiz.classList.remove("on"); G.luz.off(); document.body.style.overflow = ""; if(typeof render === "function") try { render(); } catch(e){} }
  window.TCG = {
    abre(t){
      monta(); asegura(); if(premia()) save();
      if(t) tab = t; quien = yo() || ""; raiz.classList.add("on"); document.body.style.overflow = "hidden";
      cuerpo.innerHTML = '<p class="tg-nota" style="text-align:center;margin-top:30px">Abriendo el binder…</p>';
      prepara().then(pinta);
    },
    premia, disponibles
  };
})();
