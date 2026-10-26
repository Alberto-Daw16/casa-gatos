/* Gremory TCG · el sobre en 3D (24/10/2026)
   Una lámina con muchas divisiones que se abomba, se arruga, brilla al inclinarla y se rasga deslizando
   el dedo por la línea de corte. La tira sale volando con física (gravedad y un muelle que la hace
   temblar y girar, y al girar se le ve el dorso); el cuerpo se encoge un 3 % y rebota; por la abertura
   sale la luz del color de la mejor carta.
   Usa las mismas texturas que pide RUN-ASSETS-TCG.md: frente y dorso de 1000×1700 con el corte en y=250
   y el borde rasgado de 1000×64. Mientras no estén las de Valeria, juego.js las dibuja en un canvas.
   La geometría parte de sobres.html (que a su vez adapta "Builders Booster Packs", MIT, (c) 2026 Samigos).
   Se carga solo al abrir sobres; si no hay WebGL, juego.js sigue con el sobre en CSS. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js";

const W = 2.8, H = W * 1.7;                 /* el sobre mide 1000×1700 */
const CORTE = H / 2 - H * 250 / 1700;       /* la línea de corte (y=250 en la textura) */
const BANDA = H * 64 / 1700;                /* alto del borde rasgado */
const SX = 90;                              /* divisiones a lo ancho */
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const RS = document.documentElement.style;

/* la forma: abombado en el centro, pegado en los sellados y en los laterales, y arrugas suaves */
function forma(x, y){
  const lado = 1 - Math.pow(Math.abs(x) / (W / 2), 6);
  const alto = Math.sin(cl((y + H / 2) / H, 0, 1) * Math.PI);
  const bulto = .11 * lado * Math.pow(alto, .7);
  const sello = Math.exp(-(H / 2 - Math.abs(y)) * 5);          /* más arrugas cerca de los sellados */
  const arruga = (Math.sin(x * 49 + y * 2) * .0032 + Math.sin(y * 37 + x * 3) * .0036 + Math.sin(x * 7.3 + y * 5.1) * .005)
    * (.35 + .65 * (1 - lado) + 1.6 * sello);
  return .004 + Math.pow(alto, .35) * (.026 * lado + bulto) + arruga;
}
/* el filo del corte no es recto: sube y baja un poco (el mismo en la tira y en el cuerpo, para que encajen) */
const filo = x => (Math.sin(x * 61) * .6 + Math.sin(x * 23 + 1) * .4) * .011;

function lamina(y0, y1, atras, segY){
  const g = new THREE.PlaneGeometry(W, y1 - y0, SX, segY);
  g.translate(0, (y0 + y1) / 2, 0);
  const p = g.attributes.position, uv = g.attributes.uv;
  for(let i = 0; i < p.count; i++){
    const x = p.getX(i), y0i = p.getY(i);
    const y = Math.abs(y0i - CORTE) < 1e-4 ? y0i + filo(x) : y0i;
    p.setY(i, y);
    p.setZ(i, (atras ? -1 : 1) * forma(x, y));
    uv.setXY(i, atras ? 1 - (x + W / 2) / W : (x + W / 2) / W, (y + H / 2) / H);
  }
  g.computeVertexNormals();
  return g;
}
/* el borde rasgado: una franja que sigue la forma del sobre, con transparencia por columna (se ve según se rasga) */
function banda(arriba){
  const g = new THREE.PlaneGeometry(W, BANDA, SX, 2);
  g.translate(0, CORTE, 0);
  const p = g.attributes.position, uv = g.attributes.uv, col = new Float32Array(p.count * 4);
  for(let i = 0; i < p.count; i++){
    const x = p.getX(i), y = p.getY(i) + filo(x);
    p.setY(i, y); p.setZ(i, forma(x, y) + .004);
    const u = (x + W / 2) / W, v = (p.getY(i) - filo(x) - (CORTE - BANDA / 2)) / BANDA;
    uv.setXY(i, u, arriba ? 1 - v : v);
    col.set([1, 1, 1, 0], i * 4);
  }
  g.setAttribute("color", new THREE.BufferAttribute(col, 4));
  g.computeVertexNormals();
  return g;
}

function textura(fuente, renderer, datos){
  if(!fuente) return null;
  const t = fuente instanceof THREE.Texture ? fuente : new THREE.CanvasTexture(fuente);
  t.colorSpace = datos ? THREE.NoColorSpace : THREE.SRGBColorSpace; t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  t.needsUpdate = true;
  return t;
}
/* un entorno propio (sin addons): una habitación oscura con tres paneles de luz, para los reflejos del metalizado */
function entorno(renderer, tinte){
  const sc = new THREE.Scene();
  sc.add(new THREE.Mesh(new THREE.BoxGeometry(12, 12, 12), new THREE.MeshBasicMaterial({color: 0x1c1626, side: THREE.BackSide})));
  const panel = (c, k, x, y, z, a, b) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(a, b), new THREE.MeshBasicMaterial({color: new THREE.Color(c).multiplyScalar(k), side: THREE.DoubleSide}));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); sc.add(m);
  };
  panel(0xffffff, 5, -3, 4, 3.5, 4, 1.4);
  panel(0xffe2b0, 2.4, 4, 1, 3, 1.2, 4);
  panel(tinte, 2.2, 0, -4, 2, 6, 1.5);
  const pm = new THREE.PMREMGenerator(renderer), t = pm.fromScene(sc, .03).texture;
  pm.dispose();
  return t;
}
function brillo(){
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const x = c.getContext("2d"), g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(.25, "rgba(255,255,255,.55)"); g.addColorStop(.6, "rgba(255,255,255,.12)"); g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

export function webgl(){
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch(e){ return false; }
}

/* crea(capa, op)
   op.frente, op.dorso: canvas o imagen de 1000×1700 · op.rasgado: 1000×64
   op.brilloF, op.brilloD: máscaras de brillo (blanco = metalizado e iridiscente; negro = mate: caras y piel)
   op.arrugas: mapa de alturas · op.interior: 1000×420, lo que se ve por la abertura · op.destello: el estallido
   op.color: el del sobre · op.tier: el de la mejor carta
   op.alRasgar(p, x, y): mientras se rasga (para sonido y chispas) · op.alAbrir(): la tira se ha soltado */
export function crea(capa, op){
  const cvs = document.createElement("canvas");
  cvs.className = "gv-3d";
  cvs.style.cssText = "position:absolute;inset:0;width:100%;height:100%;z-index:5;touch-action:none;display:block";
  const guia = document.createElement("div");
  guia.className = "gv-guia gv-guia3d"; guia.innerHTML = "<i></i>";
  guia.style.cssText = "z-index:6;right:auto;transition:opacity .3s";
  /* si el móvil no deja crear el contexto, esto lanza antes de tocar la pantalla y juego.js sigue con el sobre en CSS */
  const renderer = new THREE.WebGLRenderer({canvas: cvs, antialias: true, alpha: true, powerPreference: "high-performance"});
  capa.appendChild(cvs); capa.appendChild(guia);
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.1;   /* respeta los colores de la ilustración */
  const scene = new THREE.Scene();
  scene.environment = entorno(renderer, new THREE.Color(op.color || "#ff8a3d"));
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 100);
  const dl = new THREE.DirectionalLight(0xffffff, 1.5); dl.position.set(-3, 4, 5); scene.add(dl);
  scene.add(new THREE.AmbientLight(0xffffff, .35));
  const luzBoca = new THREE.PointLight(new THREE.Color(op.tier || "#ffffff"), 0, 6, 1.6);
  luzBoca.position.set(0, CORTE + .2, .9); scene.add(luzBoca);

  const tf = textura(op.frente, renderer), td = textura(op.dorso, renderer), tr = textura(op.rasgado, renderer);
  const bF = textura(op.brilloF, renderer, true), bD = textura(op.brilloD, renderer, true), ar = textura(op.arrugas, renderer, true);
  /* cada cara solo se pinta por fuera: así el dorso nunca asoma por delante en los sellados, donde las dos caras casi se tocan.
     Con máscara de brillo, el metalizado y el arcoíris salen solo donde ella dice (las caras quedan mates) */
  const mat = (map, side, br) => new THREE.MeshPhysicalMaterial(Object.assign({map, side, alphaTest: .5, transparent: false, roughness: .34, clearcoatRoughness: .18},
    br ? {metalness: .3, metalnessMap: br, clearcoat: 1, clearcoatMap: br, iridescence: 1, iridescenceMap: br, iridescenceIOR: 1.35, iridescenceThicknessRange: [180, 520]}
       : {metalness: .18, clearcoat: .85},
    ar ? {bumpMap: ar, bumpScale: 2.2} : {}));
  const mF = mat(tf, THREE.FrontSide, bF), mD = mat(td, THREE.BackSide, bD);
  const mR = new THREE.MeshStandardMaterial({map: tr, vertexColors: true, transparent: true, roughness: .4, metalness: .6, side: THREE.DoubleSide, depthWrite: false});

  const pack = new THREE.Group(), cuerpo = new THREE.Group(), tira = new THREE.Group();
  const centroTira = (CORTE + H / 2) / 2;
  tira.position.set(0, centroTira, 0);
  const malla = (g, m, en, tiraSi) => { const o = new THREE.Mesh(g, m); o.userData = {base: new Float32Array(g.attributes.position.array), tira: tiraSi}; if(tiraSi) o.position.y = -centroTira; en.add(o); return o; };
  const piezas = [
    malla(lamina(-H / 2, CORTE, false, 60), mF, cuerpo, false),
    malla(lamina(-H / 2, CORTE, true, 60), mD, cuerpo, false),
    malla(lamina(CORTE, H / 2, false, 10), mF, tira, true),
    malla(lamina(CORTE, H / 2, true, 10), mD, tira, true)
  ];
  const bandas = [malla(banda(false), mR, cuerpo, false), malla(banda(true), mR, tira, true)];
  pack.add(cuerpo); pack.add(tira); scene.add(pack);
  /* el interior: la pared de dentro con los cantos de las cartas; se ve cuando el borde de delante se abre */
  const LABIO = .6, ti = textura(op.interior, renderer);
  if(ti){
    const alto = W * .42 * .62;                         /* solo la parte de abajo de la textura (lo de arriba quedaría por encima del sobre) */
    ti.repeat.set(1, .62); ti.offset.set(0, 0);
    const pi = new THREE.Mesh(new THREE.PlaneGeometry(W * .94, alto), new THREE.MeshStandardMaterial({map: ti, roughness: .45, metalness: .5}));
    pi.position.set(0, CORTE - .015 - alto / 2, -.02); cuerpo.add(pi);
  }

  const halo = new THREE.Sprite(new THREE.SpriteMaterial({map: brillo(), color: new THREE.Color(op.tier || "#ffffff"), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0}));
  halo.position.set(0, CORTE + .05, .25); halo.scale.set(.01, .01, 1); pack.add(halo);
  const td2 = textura(op.destello, renderer);
  const estallo = td2 ? new THREE.Sprite(new THREE.SpriteMaterial({map: td2, color: new THREE.Color(op.tier || "#ffffff").lerp(new THREE.Color("#ffffff"), .45), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0})) : null;
  if(estallo){ estallo.position.set(0, CORTE + .1, .4); estallo.scale.set(.01, .01, 1); pack.add(estallo); }

  /* estado */
  let progreso = 0, dir = 1, modo = "cerrado", vivo = true, t0 = performance.now(), tPrev = t0;
  const rot = {y: 0, v: 0, arrastre: false};
  const escala = {s: .9, v: 0};                       /* entra creciendo, con rebote */
  let vuelo = null, cae = null, abreT = null, auto = null, boca = 0;

  function deforma(){
    for(const o of piezas.concat(bandas)){
      if(o.userData.tira && boca > 0) continue;            /* la tira ya va por su cuenta */
      const pos = o.geometry.attributes.position, base = o.userData.base, esBanda = o.geometry.attributes.color;
      const col = esBanda ? o.geometry.attributes.color : null;
      for(let i = 0; i < pos.count; i++){
        const x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2];
        const desde = dir > 0 ? (x + W / 2) / W : (W / 2 - x) / W;
        const suelto = cl((progreso - desde) * 4, 0, 1);
        if(col) col.setW(i, suelto > .02 ? 1 : 0);
        if(o.userData.tira){
          const h = cl((y - CORTE) / (H / 2 - CORTE), 0, 1), s = Math.sign(z || 1);
          pos.setXYZ(i, x - dir * suelto * .1, y + suelto * (.1 + (1 - desde) * .26) * (.6 + .4 * h),
            z + s * Math.sin(suelto * Math.PI * .75) * (.18 + .3 * h) * (z < 0 ? .4 : 1));
        } else {
          const cerca = Math.exp(-Math.abs(y - CORTE) * 2.6);
          /* al abrirse, el borde de delante se dobla hacia fuera y hacia abajo (y el de detrás un poco hacia atrás) */
          const d = cl((y - (CORTE - LABIO)) / LABIO, 0, 1), dd = d * d * boca * (1 - Math.pow(Math.abs(x) / (W / 2), 4));
          const dz = z >= 0 ? dd * .34 : -dd * .1, dy = z >= 0 ? -dd * .2 : -dd * .03;
          pos.setXYZ(i, x + Math.sin(y * 21 + x * 11) * cerca * progreso * .01, y + dy, z + dz + Math.sin(x * 35 + progreso * 15) * cerca * progreso * .02 * Math.sign(z || 1));
        }
      }
      pos.needsUpdate = true; if(col) col.needsUpdate = true;
      o.geometry.computeVertexNormals();
    }
  }
  /* mientras vuela, la tira tiembla: una onda que se apaga (el muelle) */
  function aleteo(b){
    for(const o of piezas.concat(bandas)){
      if(!o.userData.tira) continue;
      const pos = o.geometry.attributes.position;
      if(!o.userData.suelta) o.userData.suelta = new Float32Array(pos.array);
      const base = o.userData.suelta;
      for(let i = 0; i < pos.count; i++){
        const x = base[i * 3], z = base[i * 3 + 2], u = x / (W / 2);
        pos.setZ(i, z + b * (u * u - .33) * .35 + b * .08 * Math.sin(u * 5));
      }
      pos.needsUpdate = true;
    }
  }

  /* encaje en pantalla: como el sobre en CSS (64 % del ancho, como mucho 300 px, centrado al 46 %) */
  let anchoPx = 0, visH = 1;
  function ajusta(){
    const w = capa.clientWidth || innerWidth, h = capa.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    anchoPx = Math.max(140, Math.min(w * .64, 300, (h - 220) / 1.7));
    const tan = Math.tan(THREE.MathUtils.degToRad(15));
    const d = W * h / (2 * tan * anchoPx);
    visH = 2 * d * tan;
    camera.position.set(0, -(.5 - .46) * visH, d);
    camera.lookAt(0, -(.5 - .46) * visH, 0);
    camera.updateProjectionMatrix();
  }
  ajusta();
  const ro = new ResizeObserver(ajusta); ro.observe(capa);

  const v3 = new THREE.Vector3();
  function enPantalla(x, y, z){
    v3.set(x, y, z).applyMatrix4(cuerpo.matrixWorld).project(camera);
    const r = cvs.getBoundingClientRect();
    return {x: (v3.x + 1) / 2 * r.width + r.left, y: (1 - v3.y) / 2 * r.height + r.top};
  }
  function lineaCorte(){ const a = enPantalla(-W / 2 * .92, CORTE, .1), b = enPantalla(W / 2 * .92, CORTE, .1); return {a, b}; }

  function pinta(){
    if(!vivo) return;
    const ahora = performance.now(), dt = Math.min(.05, (ahora - tPrev) / 1000), t = (ahora - t0) / 1000; tPrev = ahora;
    /* inclinación: la luz de motor.js (puntero o giroscopio) da hasta 12°, más el arrastre del dedo */
    const rx = parseFloat(RS.getPropertyValue("--rotate-x")) || 0, ry = parseFloat(RS.getPropertyValue("--rotate-y")) || 0;
    if(!rot.arrastre){ rot.v += (-rot.y) * .08; rot.v *= .84; rot.y += rot.v; }
    if(!cae){
      pack.rotation.y = THREE.MathUtils.degToRad(cl(-rx * .75, -12, 12)) + rot.y + Math.sin(t * .7) * .05;
      pack.rotation.x = THREE.MathUtils.degToRad(cl(ry * .55, -10, 10)) + Math.sin(t * .9) * .025;
      pack.position.y = Math.sin(t * 1.3) * .05;
    }
    /* escala con muelle (entrada y el rebote del 3 % al soltarse la tira) */
    escala.v += (-(escala.s - 1) * 170 - escala.v * 11) * dt; escala.s += escala.v * dt;
    cuerpo.scale.setScalar(escala.s); if(!vuelo && modo !== "abierto") tira.scale.setScalar(escala.s);
    if(auto){ const k = cl((ahora - auto.t) / 420, 0, 1); avanza(auto.p0 + (1 - auto.p0) * k); if(k >= 1) auto = null; }
    if(vuelo){
      vuelo.t += dt;
      vuelo.v.y -= 9.5 * dt;
      tira.position.addScaledVector(vuelo.v, dt);
      tira.rotation.x += vuelo.w.x * dt; tira.rotation.y += vuelo.w.y * dt; tira.rotation.z += vuelo.w.z * dt;
      vuelo.w.multiplyScalar(.992);
      vuelo.b.v += (-vuelo.b.x * 260 - vuelo.b.v * 5) * dt; vuelo.b.x += vuelo.b.v * dt;
      aleteo(vuelo.b.x);
      if(vuelo.t > 2.2){ tira.visible = false; vuelo = null; }
    }
    if(abreT !== null){
      const k = (ahora - abreT) / 1000;
      if(boca < 1){ boca = Math.min(1, 1 - Math.pow(1 - cl(k / .45, 0, 1), 3)); deforma(); }
      if(estallo){ const e = cl(k / .5, 0, 1); estallo.material.opacity = (1 - e) * (k < .05 ? k / .05 : 1); const sc = .3 + 3.4 * Math.pow(e, .5); estallo.scale.set(sc, sc, 1); estallo.material.rotation = k * .6; }
      const a = cl(k / .35, 0, 1) * (1 - cl((k - 1.2) / .8, 0, 1) * .6);
      halo.material.opacity = a * .95; const s = (.4 + 2.6 * Math.pow(cl(k / .5, 0, 1), .6)) * (1 + .06 * Math.sin(k * 9));
      halo.scale.set(s * 1.5, s * .8, 1);
      luzBoca.intensity = a * 9;
    }
    if(cae){
      cae.k += dt / .6;
      const e = cae.k * cae.k;
      pack.position.y = -e * visH * .75; pack.rotation.z = cae.k * .1; pack.scale.setScalar(1 - .15 * cae.k);
      cvs.style.opacity = String(cl(1 - cae.k, 0, 1));
      if(cae.k >= 1){ const f = cae.fin; cae = null; destruye(); if(f) f(); return; }
    }
    /* la guía: la línea de corte en pantalla */
    if(modo === "cerrado" && guia.isConnected){
      const {a, b} = lineaCorte(), r = capa.getBoundingClientRect();
      guia.style.left = (a.x - r.left) + "px"; guia.style.top = (a.y - r.top) + "px"; guia.style.width = (b.x - a.x) + "px";
    }
    renderer.render(scene, camera);
    requestAnimationFrame(pinta);
  }

  function avanza(p){
    if(modo === "abierto") return;
    if(p <= progreso) return;
    const antes = progreso; progreso = cl(p, 0, 1);
    if(modo === "cerrado"){ modo = "rasgando"; guia.style.opacity = "0"; }
    deforma();
    if(op.alRasgar && Math.floor(progreso * 14) > Math.floor(antes * 14)){
      const {a, b} = lineaCorte(), x = dir > 0 ? a.x + (b.x - a.x) * progreso : b.x - (b.x - a.x) * progreso;
      op.alRasgar(progreso, x, a.y + (b.y - a.y) * (dir > 0 ? progreso : 1 - progreso));
    }
    if(progreso >= .97) suelta();
  }
  function suelta(){
    if(modo === "abierto") return;
    modo = "abierto"; progreso = 1; deforma(); guia.remove();
    tira.scale.setScalar(1);
    vuelo = {t: 0, v: new THREE.Vector3(dir * 1.7, 3.4, 2.2), w: new THREE.Vector3(-2.2, dir * 7.5, -dir * 3.2), b: {x: 0, v: 3.2}};
    escala.v = -2.4;                                  /* se encoge un poco y rebota */
    abreT = performance.now();
    if(op.alAbrir) op.alAbrir();
  }

  /* gestos: por la línea de corte rasga; en el resto, gira el sobre */
  let gesto = null;
  cvs.addEventListener("pointerdown", e => {
    if(modo === "abierto" || cae) return;
    const {a, b} = lineaCorte(), alto = enPantalla(0, -H / 2, .1).y - enPantalla(0, H / 2, .1).y;
    const yC = a.y + (b.y - a.y) * cl((e.clientX - a.x) / ((b.x - a.x) || 1), 0, 1);
    const dentro = e.clientX > a.x - 30 && e.clientX < b.x + 30;
    const cerca = dentro && e.clientY > enPantalla(0, H / 2, .1).y - 24 && e.clientY < yC + Math.max(40, alto * .09);
    const enSobre = dentro && e.clientY > enPantalla(0, H / 2, .1).y - 24 && e.clientY < enPantalla(0, -H / 2, .1).y + 24;
    if(!enSobre) return;
    gesto = {x0: e.clientX, y0: e.clientY, tipo: cerca ? "rasga" : "gira", ancho: b.x - a.x, ini: progreso, mov: false};
    if(gesto.tipo === "gira") rot.arrastre = true;
    try { cvs.setPointerCapture(e.pointerId); } catch(_){}
  });
  cvs.addEventListener("pointermove", e => {
    if(!gesto) return;
    const dx = e.clientX - gesto.x0;
    if(Math.abs(dx) > 6 || Math.abs(e.clientY - gesto.y0) > 6) gesto.mov = true;
    if(gesto.tipo === "gira"){ rot.y = cl(dx / 180, -.8, .8); return; }
    if(Math.abs(dx) < 6 || auto) return;
    if(modo === "cerrado") dir = dx > 0 ? 1 : -1;
    avanza(gesto.ini + (dx * dir) / (gesto.ancho * .8));
  });
  const fin = () => {
    if(!gesto) return;
    const g = gesto; gesto = null; rot.arrastre = false;
    /* un toque (o soltar a medias pasado el 40 %) termina de abrirlo solo */
    if(modo !== "abierto" && !auto && (!g.mov || (g.tipo === "rasga" && progreso > .4))) auto = {t: performance.now(), p0: progreso};
  };
  cvs.addEventListener("pointerup", fin); cvs.addEventListener("pointercancel", fin);

  function destruye(){
    if(!vivo) return; vivo = false;
    ro.disconnect();
    scene.traverse(o => { if(o.geometry) o.geometry.dispose(); if(o.material){ (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { Object.values(m).forEach(v => { if(v && v.isTexture) v.dispose(); }); m.dispose(); }); } });
    if(scene.environment) scene.environment.dispose();
    renderer.dispose(); try { renderer.forceContextLoss(); } catch(e){}
    cvs.remove(); guia.remove();
  }

  requestAnimationFrame(pinta);
  return {
    vacia(fin){ if(vivo && !cae) cae = {k: 0, fin}; else if(fin) fin(); },   /* se va hacia abajo y desaparece */
    tinte(c){ const k = new THREE.Color(c); halo.material.color = k; luzBoca.color = k; },
    destruye,
    get modo(){ return modo; }
  };
}
