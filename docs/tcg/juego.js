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
  const BIENVENIDA = 3;
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
  const ICO = {
    x: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    izq: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    der: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    cambio: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13l-4-4M20 16H7l4 4"/></svg>'
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

  /* ── sobres: uno al día, tres de bienvenida y uno por cada logro nuevo ── */
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
    const dia = !A.S.tcgSobres.some(s => s.id === "dia:" + hoy() + ":" + pid);
    const pre = A.S.tcgSobres.filter(s => s.d === pid && !s.abierto && !borr()[s.id]);
    return {dia, pre, total: (dia ? 1 : 0) + pre.length};
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
  const RARA = [["Grabada",42,"SR"],["Escapada",25,"OFR"],["Firmada",14,"SP"],["Oro",9,"HR"],["Estándar",4.5,"RR"],["Gremory",3.5,"G1"],["Gremory",1.5,"G2"],["Secreta",.5,"SR"]];
  function genera(id){
    const r = rng(id), out = [];
    for(let i = 0; i < 3; i++) out.push(r() < .7 && hayPool("Estándar") ? {c: elige(r, POOL["Estándar"]), v:"R"} : hayPool("Casa") ? {c: elige(r, POOL["Casa"]), v:"CASA"} : {c: elige(r, POOL["Estándar"]), v:"R"});
    out.push({c: elige(r, POOL["Estándar"]), v: r() < .85 ? "RH" : "RR"});
    const x = r() * 100; let acc = 0, rara = null;
    for(const [t, p, v] of RARA){ acc += p; if(x < acc){ if(hayPool(t)) rara = {c: elige(r, POOL[t]), v}; break; } }
    out.push(rara || {c: elige(r, POOL["Grabada"] || POOL["Estándar"]), v: hayPool("Grabada") ? "SR" : "RR"});
    return out;
  }
  const nivel = (c, v) => c === "s01-061" || v === "G1" || v === "G2" ? 5 : v === "SP" || v === "HR" ? 4 : v === "SR" || v === "OFR" || v === "RR" ? 3 : v === "RH" ? 2 : 1;

  /* ── imágenes del Worker ── */
  function url(n){ const nb = nubeBase(); return nb ? nb.base + "/img/" + encodeURIComponent(n) + "?k=" + encodeURIComponent(nb.k) : ""; }
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
      '<button data-tab="binder" class="' + (tab === "binder" ? "on" : "") + '">Binder</button>' +
      '<button data-tab="sobres" class="' + (tab === "sobres" ? "on" : "") + '">Sobres' + (d.total ? '<i>' + d.total + '</i>' : '') + '</button>' +
      '<button data-tab="cambios" class="' + (tab === "cambios" ? "on" : "") + '">Cambios' + (ent ? '<i>' + ent + '</i>' : '') + '</button>';
    let h = "";
    if(!yo()){
      h = '<div class="tg-aviso">¿De quién es este móvil? Así sé de quién es cada sobre y cada binder.</div><div class="tg-acc">' +
        gente().map(p => '<button class="tg-btn sec" data-yo="' + p.id + '">' + esc(p.name) + '</button>').join("") + '</div>';
      cuerpo.innerHTML = h; return;
    }
    if(!nubeBase()) h += '<div class="tg-aviso">Para ver las cartas y jugar entre los dos hace falta la sincronización (Ajustes → Sincronizar).</div>';
    else if(faltanImg) h += '<div class="tg-aviso">Aún no están subidas las ilustraciones del Set 1. Súbelas una vez desde Ajustes → Gremory TCG.</div>';
    if(tab === "binder") h += binderHTML();
    else if(tab === "sobres") h += sobresHTML();
    else h += cambiosHTML();
    cuerpo.innerHTML = h;
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
    if(a === "cierra") cierraVisor();
    else if(a === "ant") otraVisor(-1);
    else if(a === "sig") otraVisor(1);
    else if(a === "ofrece"){ cierraVisor(); propuesta({doy: b.dataset.inst}); }
    else if(a === "pide"){ cierraVisor(); propuesta({pido: b.dataset.inst}); }
  }

  /* ── sobres ── */
  function sobresHTML(){
    const d = disponibles(yo());
    const motivo = d.pre.length ? d.pre[0].motivo : d.dia ? "Sobre del día" : "";
    return '<div class="tg-sobres"><div class="tg-pack' + (d.total ? '' : ' vacio') + '" data-acc="abrir"><div class="tira"></div><div class="rot"><b>Set 1</b><span>Gremory · 5 cartas</span></div></div>' +
      '<div class="tg-cuantos"><b>' + (d.total ? (d.total === 1 ? "Tienes 1 sobre" : "Tienes " + d.total + " sobres") : "Sin sobres por hoy") + '</b><span>' + (d.total ? esc(motivo) : "Mañana te espera otro") + '</span></div>' +
      (d.total ? '<button class="tg-btn" data-acc="abrir">Abrir sobre</button>' : '') +
      '<div class="tg-gana"><div><b>Cómo se consiguen</b></div><div>Uno cada día<span>' + (d.dia ? "listo" : "abierto hoy") + '</span></div>' +
        '<div>Tres de bienvenida<span>al estrenar el Set 1</span></div><div>Uno por cada logro nuevo de la casa<span>para los dos</span></div></div>' +
      '<p class="tg-nota" style="max-width:460px;text-align:center">Cada sobre trae 5 cartas: tres normales, una Reverse o Double Holo y una rara. Con suerte, una Firmada, una Oro, una Gremory o la secreta.</p></div>';
  }
  function abreSobre(){
    const pid = yo(), d = disponibles(pid);
    if(!d.total) return;
    let s;
    if(d.pre.length){ s = d.pre[0]; s.abierto = true; s.t = ahora(); }
    else { s = {id: "dia:" + hoy() + ":" + pid, d: pid, tipo: "dia", motivo: "Sobre del día", f: hoy(), abierto: true, t: ahora()}; A.S.tcgSobres.push(s); }
    const tenia = coleccion(pid), vistas = {};
    const cartas = genera(s.id).map((x, i) => {
      const k = x.c + "|" + x.v, nueva = !(tenia[x.c] && tenia[x.c].v[x.v]) && !vistas[k]; vistas[k] = 1;
      return Object.assign(x, {id: s.id + ":" + i, nueva, nivel: nivel(x.c, x.v)});
    });
    cartas.forEach(x => { if(!inst(x.id)) A.S.tcgCartas.push({id: x.id, c: x.c, v: x.v, d: pid, t: ahora(), o: "sobre"}); });
    save();
    animaSobre(cartas);
  }
  /* la apertura: rasgar, la pila boca abajo y una a una se dan la vuelta (la rara, la última) */
  function animaSobre(cartas){
    const cap = document.getElementById("tgAbre");
    cap.innerHTML = '<div class="tg-pack" id="tgPack"><div class="tira"></div><div class="rot"><b>Set 1</b><span>Gremory · 5 cartas</span></div></div><div class="tg-pista">Toca o desliza para abrir</div>';
    cap.classList.add("on");
    const pack = cap.querySelector("#tgPack"); let x0 = null, hecho = false;
    const rasga = () => {
      if(hecho) return; hecho = true;
      pack.classList.add("rasga", "baja"); cap.querySelector(".tg-pista").style.opacity = 0;
      setTimeout(() => pila(cartas, 0), 950);
    };
    pack.addEventListener("pointerdown", e => { x0 = e.clientX; });
    pack.addEventListener("pointerup", e => { if(x0 != null && Math.abs(e.clientX - x0) > 40) rasga(); x0 = null; });
    pack.addEventListener("click", rasga);
  }
  function pila(cartas, i){
    const cap = document.getElementById("tgAbre");
    if(i >= cartas.length) return resumen(cartas);
    const x = cartas[i], quedan = cartas.length - i;
    cap.innerHTML = '<div class="tg-sello" id="tgSello">&nbsp;</div>' +
      '<div class="tg-pila" data-tier="' + x.nivel + '">' + Array.from({length: quedan - 1}, (_, k) => '<div class="tg-dorso" style="transform:translate(' + ((k + 1) * 3) + 'px,' + ((k + 1) * 3) + 'px)"></div>').reverse().join("") +
      '<div class="tg-giro" id="tgGiro"><div class="tg-dorso"></div><div class="cara">' + G.carta(x.c, x.v) + '</div></div></div>' +
      '<div class="tg-pista">' + (i === 0 ? "Toca para darle la vuelta" : (cartas.length - i) + " por ver") + '</div>';
    const giro = cap.querySelector("#tgGiro"), zona = cap.querySelector(".tg-pila");
    let fase = 0;
    zona.onclick = () => {
      if(fase === 0){
        fase = 1; giro.classList.add("vuelta"); G.luz.on(zona);
        cap.querySelector("#tgSello").innerHTML = (x.nueva ? '<span class="nueva">Nueva</span>' : '') + G.nombreVer(x.c, x.v) + ' · ' + entrada(x.c).n;
        cap.querySelector(".tg-pista").textContent = i < cartas.length - 1 ? "Toca para la siguiente" : "Toca para terminar";
      } else if(fase === 1){
        fase = 2; giro.classList.add("vete"); setTimeout(() => pila(cartas, i + 1), 380);
      }
    };
  }
  function resumen(cartas){
    const cap = document.getElementById("tgAbre"), col = coleccion(yo());
    G.luz.off();
    cap.innerHTML = '<div class="tg-tit"><b>Al binder</b><span>' + cartas.filter(x => x.nueva).length + ' nuevas de 5</span></div>' +
      '<div class="tg-resumen">' + cartas.map(x => { const e = entrada(x.c); return '<div class="bd-bol"><img src="' + e.th + '" alt="">' + '<span class="bd-num">' + e.n + '</span>' + (x.nueva ? '<span class="bd-nueva">Nueva</span>' : '') + '</div>'; }).join("") + '</div>' +
      '<div class="tg-sello">' + cartas.map(x => G.nombreVer(x.c, x.v)).join(" · ") + '</div>' +
      '<div class="tg-acc"><button class="tg-btn" data-ab="fin">Hecho</button>' + (disponibles(yo()).total ? '<button class="tg-btn sec" data-ab="otro">Abrir otro</button>' : '') + '</div>';
    cap.onclick = e => { const b = e.target.closest("[data-ab]"); if(!b) return; cap.onclick = null; cap.classList.remove("on");
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
    const b = e.target.closest("[data-acc],[data-tab],[data-yo],[data-quien],[data-tapa],[data-ir],[data-cb],.bd-bol[data-id]"); if(!b) return;
    if(b.dataset.acc === "cierra") return cierra();
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
