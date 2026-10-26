/* ══ Binder del álbum: dos hojas de 3×3 con anillas, pasar página, un binder para cada uno y la carta que entra boca abajo ══ */
(function(){
  const L = D1.LISTA, PAG = 9, NP = Math.ceil(L.length / PAG);
  const ACAB = {
    oceano:     {n:"Océano",     tapa:"#1d4f9c", hoja:"#14203a", tinta:"#9fb8e6"},
    rosa:       {n:"Rosa",       tapa:"#c4537e", hoja:"#28141e", tinta:"#f0a9c4"},
    medianoche: {n:"Medianoche", tapa:"#22253a", hoja:"#11131c", tinta:"#8f94a2"},
    perla:      {n:"Perla",      tapa:"#d9d4e4", hoja:"#ebe8f1", tinta:"#6b6880"},
    lima:       {n:"Gremory",    tapa:"#55701a", hoja:"#141a0b", tinta:"#c9f24a"},
    granate:    {n:"Granate",    tapa:"#7a1f2b", hoja:"#1c0f12", tinta:"#e7a3ad"}
  };
  const lee = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } };
  const guarda = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} };
  let quien = lee("gremory-binder-quien", "alberto");
  const acab = Object.assign({alberto:"oceano", cristina:"rosa"}, lee("gremory-binder-acab", {}));
  const movil = () => matchMedia("(max-width:760px)").matches;
  let pag = 0, girando = false;
  const P = (x) => (x * 100).toFixed(2) + "%";

  /* ── montaje ── */
  const wrap = document.createElement("div"); wrap.className = "bd-wrap";
  wrap.innerHTML =
    '<div class="bd-top"><div class="bd-quien" id="bdQuien"><button data-q="alberto">Binder de Alberto</button><button data-q="cristina">Binder de Cristina</button></div>' +
    '<div class="bd-acab" id="bdAcab"><span>Tapa</span>' + Object.entries(ACAB).map(([k, a]) => '<button data-a="' + k + '" title="' + a.n + '" aria-label="Tapa ' + a.n + '" style="--c:' + a.tapa + '"></button>').join("") + '</div></div>' +
    '<div class="bd-nav"><button id="bdAnt">‹ Anterior</button><b id="bdPags"></b><button id="bdSig">Siguiente ›</button>' +
    '<select id="bdIr" aria-label="Ir a"><option value="">Ir a…</option>' +
      [["001","Alberto"],["011","Cristina"],["021","Kurama"],["028","Sukuna"],["035","Gyukki"],["042","En grupo"],["049","La casa"],["061","Secreta"]]
        .map(([n, t]) => '<option value="' + n + '">' + t + ' · ' + n + '</option>').join("") + '</select></div>' +
    '<div class="bd" id="bd"></div>';
  document.getElementById("cuenta").after(wrap);
  const bd = document.getElementById("bd");

  /* el visor: la carta en grande, fuera de la página */
  const visor = document.createElement("div"); visor.id = "visor";
  visor.innerHTML = '<button id="vCerrar" aria-label="Cerrar"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
    '<button id="vPrev" aria-label="Carta anterior"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
    '<button id="vSig" aria-label="Carta siguiente"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button>';
  document.body.appendChild(visor);
  ["nombre"].forEach(id => visor.appendChild(document.getElementById(id)));
  const esc = document.querySelector(".escena"); visor.appendChild(esc);
  const dorso = document.createElement("div"); dorso.className = "vDorso bd-dorso"; esc.appendChild(dorso);
  ["vers", "bInm", "tintas", "emb", "giro"].forEach(id => { const e = document.getElementById(id); if(e) visor.appendChild(e); });
  const nota = document.querySelector("p.nota"); if(nota) visor.appendChild(nota);
  /* la secreta tiene reverso: la dedicatoria */
  const vGira = document.createElement("button"); vGira.id = "vGira"; vGira.textContent = "Darle la vuelta"; vGira.style.display = "none";
  (document.getElementById("vers") || esc).after(vGira);
  let atras = false;
  vGira.onclick = () => {
    const st = document.getElementById("sitio"); visor.classList.remove("entra"); st.classList.add("gira");
    setTimeout(() => { atras = !atras; st.innerHTML = atras ? cartaSecretaDorso() : carta(actual, ver); st.classList.remove("gira");
      vGira.textContent = atras ? "Ver la cara" : "Darle la vuelta"; }, 280);
  };

  /* ── pintar ── */
  function bolsillo(i){
    const e = L[i];
    if(!e) return '<div class="bd-bol" style="visibility:hidden"></div>';
    return e.ok
      ? '<div class="bd-bol" data-id="' + e.id + '" title="' + e.n + ' · ' + e.t + '"><img src="' + e.th + '" alt="' + e.t + '" loading="lazy"><span class="bd-num">' + e.n + '</span></div>'
      : '<div class="bd-bol falta" title="' + e.n + ' · ' + e.t + ' (aún no está)"><div class="bd-dorso"></div><span class="bd-num">' + e.n + '</span></div>';
  }
  function hoja(p, lado){
    if(p < 0 || p >= NP) return '<div class="bd-hoja ' + lado + ' vacia"><div class="bd-cab"><span>&nbsp;</span></div><div class="bd-grid">' + Array.from({length:PAG}, () => '<div class="bd-bol"></div>').join("") + '</div></div>';
    const a = L[p * PAG], z = L[Math.min(L.length, (p + 1) * PAG) - 1];
    let g = ""; for(let k = 0; k < PAG; k++) g += bolsillo(p * PAG + k);
    return '<div class="bd-hoja ' + lado + '"><div class="bd-cab"><span>Página ' + (p + 1) + '</span><span>' + a.n + ' – ' + z.n + '</span></div><div class="bd-grid">' + g + '</div>' +
      ((lado === "der" || movil()) && p < NP - 1 ? '<div class="bd-esquina sig" data-ir="1" title="Pasar página"></div>' : '') +
      (lado === "izq" && !movil() && p > 0 ? '<div class="bd-esquina ant" data-ir="-1" title="Página anterior"></div>' : '') + '</div>';
  }
  const lomo = '<div class="bd-lomo">' + '<div class="bd-anilla"></div>'.repeat(3) + '</div>';
  function pinta(){
    const a = ACAB[acab[quien]] || ACAB.oceano;
    wrap.style.setProperty("--tapa", a.tapa); wrap.style.setProperty("--hoja", a.hoja); wrap.style.setProperty("--tinta", a.tinta);
    document.querySelectorAll("#bdQuien button").forEach(b => b.classList.toggle("on", b.dataset.q === quien));
    document.querySelectorAll("#bdAcab button").forEach(b => b.classList.toggle("on", b.dataset.a === acab[quien]));
    if(movil()){
      bd.innerHTML = lomo + hoja(pag, "izq");
      document.getElementById("bdPags").textContent = "Página " + (pag + 1) + " de " + NP;
    } else {
      if(pag % 2) pag--;
      bd.innerHTML = hoja(pag, "izq") + lomo + hoja(pag + 1, "der");
      document.getElementById("bdPags").textContent = "Páginas " + (pag + 1) + "–" + Math.min(NP, pag + 2) + " de " + NP;
    }
    document.getElementById("bdAnt").disabled = pag <= 0;
    document.getElementById("bdSig").disabled = pag + (movil() ? 1 : 2) >= NP;
  }

  /* ── pasar página: una hoja gira sobre el lomo ── */
  function pasa(dir){
    if(girando) return;
    const paso = movil() ? 1 : 2, nueva = pag + dir * paso;
    if(nueva < 0 || nueva >= NP) return;
    if(matchMedia("(prefers-reduced-motion: reduce)").matches){ pag = nueva; pinta(); return; }
    girando = true;
    const hojas = bd.querySelectorAll(".bd-hoja"), rb = bd.getBoundingClientRect();
    const ref = movil() ? hojas[0] : (dir > 0 ? hojas[1] : hojas[0]);
    const r = ref.getBoundingClientRect();
    let delante, detras;
    if(movil()){ delante = hoja(pag, "izq"); detras = hoja(-1, "izq"); }
    else if(dir > 0){ delante = hoja(pag + 1, "der"); detras = hoja(nueva, "izq"); }
    else { delante = hoja(pag, "izq"); detras = hoja(nueva + 1, "der"); }
    /* debajo, ya lo que queda al terminar menos la hoja que gira */
    if(movil()) bd.innerHTML = lomo + hoja(nueva, "izq");
    else bd.innerHTML = dir > 0 ? hoja(pag, "izq") + lomo + hoja(nueva + 1, "der") : hoja(nueva, "izq") + lomo + hoja(pag + 1, "der");
    const g = document.createElement("div"); g.className = "bd-hojaGira";
    g.style.left = (r.left - rb.left) + "px"; g.style.top = (r.top - rb.top) + "px"; g.style.width = r.width + "px"; g.style.height = r.height + "px"; g.style.bottom = "auto";
    g.style.transformOrigin = movil() ? (dir > 0 ? "left center" : "left center") : (dir > 0 ? "left center" : "right center");
    g.innerHTML = delante.replace('class="bd-hoja', 'class="bd-hoja delantera') + detras.replace('class="bd-hoja', 'class="bd-hoja trasera');
    if(movil() && dir < 0){ g.innerHTML = hoja(nueva, "izq").replace('class="bd-hoja', 'class="bd-hoja delantera'); g.style.transform = "rotateY(-180deg)"; }
    bd.appendChild(g);
    g.getBoundingClientRect();
    g.style.transform = movil() ? (dir > 0 ? "rotateY(-180deg)" : "rotateY(0deg)") : (dir > 0 ? "rotateY(-180deg)" : "rotateY(180deg)");
    if(movil() && dir < 0){ bd.innerHTML = lomo + hoja(pag, "izq"); bd.appendChild(g); }
    const fin = () => { pag = nueva; girando = false; pinta(); };
    g.addEventListener("transitionend", fin, {once:true});
    setTimeout(() => { if(girando) fin(); }, 1100);
  }

  /* ── abrir una carta: entra boca abajo y se da la vuelta ── */
  const montadas = () => L.filter(e => e.ok).map(e => e.id);
  function abre(id){
    actual = id;
    if(typeof quieta === "function") quieta();
    window.pinta ? window.pinta() : null;
    visor.classList.add("on"); document.body.style.overflow = "hidden";
    visor.classList.remove("entra"); void visor.offsetWidth; visor.classList.add("entra");
    /* la secreta: dos latidos con la carta boca abajo y, al darse la vuelta, el estallido */
    const sec = id === "s01-061" && typeof secretaEstalla === "function";
    atras = false; vGira.textContent = "Darle la vuelta"; vGira.style.display = sec && typeof cartaSecretaDorso === "function" ? "" : "none";
    visor.classList.toggle("secreta", sec); clearTimeout(abre._t);
    if(typeof secretaLatido === "function") secretaLatido(sec ? 2 : 0);
    if(sec) abre._t = setTimeout(() => secretaEstalla(visor.querySelector(".escena")), 2050);
  }
  function cierra(){ clearTimeout(abre._t); if(typeof secretaLatido === "function") secretaLatido(0); visor.classList.remove("on", "entra", "secreta"); document.body.style.overflow = ""; }
  function otra(d){
    const m = montadas(), i = m.indexOf(actual), j = (i + d + m.length) % m.length; abre(m[j]);
    const k = L.findIndex(e => e.id === m[j]), p = Math.floor(k / PAG); pag = movil() ? p : p - (p % 2); pinta();
  }

  /* ── eventos ── */
  let arrastre = false;
  bd.addEventListener("click", e => {
    if(arrastre){ arrastre = false; return; }
    const es = e.target.closest(".bd-esquina"); if(es){ pasa(+es.dataset.ir); return; }
    const b = e.target.closest(".bd-bol[data-id]"); if(b) abre(b.dataset.id);
  });
  document.getElementById("bdAnt").onclick = () => pasa(-1);
  document.getElementById("bdSig").onclick = () => pasa(1);
  document.getElementById("bdIr").onchange = e => {
    const n = e.target.value; e.target.value = ""; if(!n) return;
    const k = L.findIndex(x => x.n === n), p = Math.floor(k / PAG), np = movil() ? p : p - (p % 2);
    if(np !== pag){ pag = np; pinta(); }
  };
  document.getElementById("bdQuien").onclick = e => { const b = e.target.closest("[data-q]"); if(!b) return; quien = b.dataset.q; guarda("gremory-binder-quien", quien); pinta(); };
  document.getElementById("bdAcab").onclick = e => { const b = e.target.closest("[data-a]"); if(!b) return; acab[quien] = b.dataset.a; guarda("gremory-binder-acab", acab); pinta(); };
  document.getElementById("vCerrar").onclick = cierra;
  document.getElementById("vPrev").onclick = () => otra(-1);
  document.getElementById("vSig").onclick = () => otra(1);
  visor.addEventListener("click", e => { if(e.target === visor) cierra(); });
  addEventListener("keydown", e => {
    if(visor.classList.contains("on")){
      if(e.key === "Escape") cierra(); else if(e.key === "ArrowLeft") otra(-1); else if(e.key === "ArrowRight") otra(1);
    } else if(!document.getElementById("pad")?.classList.contains("on")){
      if(e.key === "ArrowLeft") pasa(-1); else if(e.key === "ArrowRight") pasa(1);
    }
  });
  /* deslizar el dedo para pasar página */
  let x0 = null;
  bd.addEventListener("pointerdown", e => { x0 = e.clientX; });
  bd.addEventListener("pointerup", e => { if(x0 == null) return; const dx = e.clientX - x0; x0 = null; if(Math.abs(dx) > 60){ arrastre = true; pasa(dx < 0 ? 1 : -1); } });
  let eraMovil = movil();
  addEventListener("resize", () => { if(movil() !== eraMovil){ eraMovil = movil(); pinta(); } });

  pinta();
})();
