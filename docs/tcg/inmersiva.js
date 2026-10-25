/* Gremory TCG · modo inmersivo (generado por inm_build.py desde proyecto/inmersiva.js: no editar a mano) */
(function(){
"use strict";
const G = window.GTCG;
/* ── Modo inmersivo: entras en el dibujo de la carta ──
   Profundidad real por capas (mapa de profundidad Depth Anything V2 + personaje recortado),
   renderizado con WebGL2 (paralaje por oclusión), partículas en 3D, rayos de luz y música generada. */
const INM = {};
const TEMA = {
  "alberto": {foco:.55, luz:[.42,.30], rayo:.75, rcol:[1,.93,.82], raiz:50, modo:"may", prog:[0,4,5,3],
    parts:[{t:1,n:26,mov:"flota",s:[22,58],z:[.2,1.5],a:.8,c:["#6fb7ff","#ff7ab8","#ffb45c","#b28cff"]},
           {t:3,n:22,mov:"titila",s:[18,40],z:[.3,1],a:1,c:["#ffffff","#fff1c9"]},
           {t:0,n:18,mov:"sube",s:[8,16],z:[.3,1.3],a:.9,c:["#ffd9a0","#ffffff"]}]},
  "cristina": {foco:.55, luz:[.5,.24], rayo:.65, rcol:[1,.88,.95], raiz:53, modo:"may", prog:[0,2,5,3],
    parts:[{t:1,n:24,mov:"flota",s:[20,54],z:[.2,1.5],a:.75,c:["#ffb3d1","#c9a8ff","#9fd8ff","#ffe0a8"]},
           {t:3,n:22,mov:"titila",s:[18,38],z:[.3,1],a:1,c:["#ffffff","#ffe3f0"]},
           {t:2,n:6,mov:"sube",s:[20,34],z:[.4,1.2],a:.7,c:["#ff9ec4","#ffc2da"]}]},
  "kurama-ex": {foco:.5, luz:[.52,.16], rayo:1, rcol:[1,.82,.5], raiz:48, modo:"may", prog:[0,3,5,4],
    parts:[{t:0,n:64,mov:"sube",s:[6,15],z:[.25,1.6],a:1,c:["#ffe08a","#ffae4a","#ff7a2a"]},
           {t:1,n:14,mov:"flota",s:[20,50],z:[.3,1.4],a:.7,c:["#ffd36b","#ffb347","#fff0b0"]}]},
  "gyukki-ex": {foco:.5, luz:[.56,.1], rayo:.4, rcol:[.78,.72,1], raiz:47, modo:"men", prog:[0,5,2,6],
    parts:[{t:3,n:46,mov:"titila",s:[10,30],z:[.1,1],a:1,c:["#d9ceff","#a9d4ff","#ffffff"]},
           {t:1,n:16,mov:"flota",s:[20,52],z:[.3,1.5],a:.75,c:["#9d7bff","#c7b1ff","#7fb2ff"]},
           {t:0,n:30,mov:"flota",s:[4,9],z:[.2,1.2],a:.8,c:["#c9b8ff","#8fb8ff"]}]},
  "kurama-gyukki-vstar": {vis:.55, foco:.55, luz:[.5,.34], rayo:.9, rcol:[1,.84,.6], raiz:55, modo:"may", prog:[0,5,3,4],
    parts:[{t:0,n:46,mov:"sube",s:[6,14],z:[.25,1.5],a:1,c:["#ffe08a","#ffae4a","#ff8a5a"]},
           {t:2,n:10,mov:"sube",s:[26,48],z:[.35,1.3],a:.8,c:["#ffb3c7","#ff7aa2","#ffd27a"]}]},
  "s01-061": {lento:1.5, suave:.025, recuerdos:1, tono:1, cy:.42, zoom:1.08, panx:.8, foco:.58, luz:[.66,.1], rayo:.55, rcol:[1,.86,.8], raiz:51, modo:"may", prog:[0,5,1,4],
    parts:[{t:2,n:44,mov:"sube",s:[18,48],z:[.25,1.6],a:.9,c:["#ff9ec4","#ff6f9c","#ffd0de","#ff4d7d"]},
           {t:0,n:26,mov:"flota",s:[40,120],z:[.3,1.6],a:.2,c:["#ffd8a8","#ffb3c7","#fff1d6"]},
           {t:3,n:22,mov:"titila",s:[14,30],z:[.2,1],a:1,c:["#ffffff","#ffe3f0"]}]},
  "love-vmax": {vis:.55, foco:.6, luz:[.72,.08], rayo:.28, rcol:[1,.9,.8], raiz:51, modo:"may", prog:[0,5,1,4],
    parts:[{t:0,n:22,mov:"flota",s:[40,110],z:[.3,1.6],a:.22,c:["#ffd8a8","#ffb3c7","#fff1d6"]},
           {t:2,n:12,mov:"sube",s:[20,40],z:[.4,1.3],a:.75,c:["#ff9ec4","#ff6f9c","#ffd0de"]},
           {t:3,n:12,mov:"titila",s:[14,28],z:[.3,1],a:.9,c:["#ffffff"]}]}
};

const LENTO = 1;
const Inm = (() => {
  let gl, cv, P, PP, buf, pbuf, tex = {}, estado = null, raf = 0, audio = null, mudo = false;
  const VS = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
  const FS = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform vec4 uArt; uniform vec4 uClip; uniform float uRad;
uniform vec2 uOff; uniform float uFoco, uT, uDos, uRespira, uLuzA; uniform vec2 uLuz; uniform vec3 uRCol;
uniform sampler2D tC0, tD0, tC1, tD1;
out vec4 o;
float clipA(vec2 px){ vec2 c = uClip.xy + uClip.zw*.5, h = uClip.zw*.5 - vec2(uRad);
  vec2 q = abs(px - c) - h; float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - uRad; return 1. - smoothstep(-1., 1., d); }
float fuera(vec2 s){ return max(max(-s.y, s.y - 1.), max(-s.x, s.x - 1.)); }
/* busca en qué punto del dibujo cae el rayo de la cámara (paralaje por oclusión) */
vec2 marcha(vec2 uv, int capa, out float ok){
  const int N = 24; float dt = 1. / float(N), t = 1., pt = 1., pg = -1.;
  for(int i = 0; i <= N; i++){
    t = 1. - float(i) * dt;
    vec2 s = uv - uOff * (t - uFoco);
    float d;
    if(capa == 0) d = texture(tD0, s).r;
    else d = (fuera(s) > 0. || texture(tC1, s).a < .45) ? -1. : texture(tD1, s).r;
    float g = d - t;
    if(g >= 0.){ float w = (i == 0) ? 0. : g / (g - pg); float th = mix(t, pt, w); ok = 1.; return uv - uOff * (th - uFoco); }
    pt = t; pg = g;
  }
  ok = 0.; return uv;
}
float h12(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  float ca = clipA(px); if(ca <= 0.){ o = vec4(0.); return; }
  vec2 uv = (px - uArt.xy) / uArt.zw;
  float ok; vec2 s = marcha(uv, 0, ok);
  float fu = max(fuera(s), 0.);
  vec3 amb = texture(tC0, vec2(s.x, clamp(s.y, .03, .97)), 5.5).rgb * (1. - clamp(fu * 1.6, 0., .72));
  float borde = smoothstep(0., .1, s.y) * smoothstep(1., .9, s.y) * smoothstep(0., .03, s.x) * smoothstep(1., .97, s.x);
  vec3 col = mix(amb, texture(tC0, s).rgb, borde);
  if(uDos > .5){
    vec2 a = vec2(.5, 1.02); vec2 u1 = a + (uv - a) / vec2(1. + uRespira * .35, 1. + uRespira);
    u1.x += sin(uT * .8) * .0015;
    float k; vec2 s1 = marcha(u1, 1, k);
    if(k > .5){ vec4 c1 = texture(tC1, s1); float b1 = smoothstep(1., .96, s1.y) * smoothstep(0., .1, s1.y); col = mix(col, c1.rgb, smoothstep(.45, .8, c1.a) * b1); }
  }
  /* rayos de luz que giran despacio */
  vec2 q = uv + uOff * (.15 - uFoco) - uLuz; q.x *= uArt.z / uArt.w;
  float an = atan(q.y, q.x), r = length(q);
  float n = (sin(an * 11. + uT * .22) * .5 + .5) * (sin(an * 7. - uT * .15 + 1.3) * .5 + .5) * (sin(an * 17. + uT * .09 + 4.) * .3 + .7);
  float ray = pow(n, 2.5) * smoothstep(1.15, .05, r) * .55 + exp(-r * 7.) * .35;
  vec3 add = uRCol * ray * uLuzA;
  col = 1. - (1. - col) * (1. - add);
  /* viñeta y grano */
  vec2 v = (px / uRes - .5) * vec2(1., .75);
  col *= mix(.55, 1., smoothstep(.62, .18, length(v)));
  col += (h12(px + fract(uT) * 91.) - .5) * .025;
  o = vec4(col * ca, ca);
}`;
  const PVS = `#version 300 es
in vec4 a0; in vec4 a1; in vec3 a2;
uniform vec2 uRes; uniform vec4 uArt; uniform vec2 uOff; uniform float uFoco, uDpr;
out vec4 v1; out vec3 vc;
void main(){
  vec2 p = a0.xy + uOff * (a0.z - uFoco), px = uArt.xy + p * uArt.zw;
  gl_Position = vec4(px.x / uRes.x * 2. - 1., 1. - px.y / uRes.y * 2., 0., 1.);
  gl_PointSize = a0.w * uDpr * (.5 + a0.z * .8) * uArt.z / uRes.x * .5;
  v1 = vec4(a1.xyz, clamp(a0.z - 1., 0., 1.)); vc = a2;
}`;
  const PFS = `#version 300 es
precision highp float;
in vec4 v1; in vec3 vc; uniform vec2 uRes; uniform vec4 uClip; uniform float uRad; out vec4 o;
float clipA(vec2 px){ vec2 c = uClip.xy + uClip.zw*.5, h = uClip.zw*.5 - vec2(uRad);
  vec2 q = abs(px - c) - h; float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - uRad; return 1. - smoothstep(-1., 1., d); }
void main(){
  vec2 q = gl_PointCoord * 2. - 1.; q.y = -q.y;
  float c = cos(v1.y), s = sin(v1.y); q = mat2(c, -s, s, c) * q;
  int t = int(v1.x + .5); float a = 0., bl = .04 + v1.w * .35;
  if(t == 0){ float r = length(q); a = exp(-r * r * 5.) ; }
  else if(t == 1){ float d = abs(q.x) / .32 + abs(q.y) / .95; a = (1. - smoothstep(1. - bl - .1, 1., d)) * (.55 + .45 * (1. - abs(q.x) / .32)) + exp(-length(q) * 3.) * .25; }
  else if(t == 2){ vec2 h = q * 1.35; h.y += .3; float u0 = h.x*h.x + h.y*h.y - 1.; float f = u0*u0*u0 - h.x*h.x*h.y*h.y*h.y; a = 1. - smoothstep(-.02 - bl, .03 + bl, f); }
  else { float r = length(q); a = exp(-abs(q.x) * 22.) * exp(-abs(q.y) * 2.4) + exp(-abs(q.y) * 22.) * exp(-abs(q.x) * 2.4) + exp(-r * r * 18.) * .8; a *= 1. - smoothstep(.8, 1., r); }
  float k = a * v1.z * clipA(vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y));
  o = vec4(vc * k, 0.);
}`;
  function prog(vs, fs){
    const p = gl.createProgram();
    for(const [t, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]){
      const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s);
      if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      gl.attachShader(p, s);
    }
    gl.linkProgram(p); if(!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for(let i = 0; i < n; i++){ const nm = gl.getActiveUniform(p, i).name; u[nm] = gl.getUniformLocation(p, nm); }
    return {p, u};
  }
  function init(){
    if(gl) return true;
    cv = document.getElementById("inmCv");
    gl = cv.getContext("webgl2", {premultipliedAlpha:true, alpha:true, antialias:false});
    if(!gl) return false;
    P = prog(VS, FS); PP = prog(PVS, PFS);
    buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    pbuf = gl.createBuffer();
    return true;
  }
  function textura(url){
    if(tex[url]) return tex[url];
    const t = gl.createTexture(), o = {t, ok:false};
    gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,0,0,0]));
    const im = new Image(); im.crossOrigin = "anonymous"; im.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, t); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im); gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
      o.ok = true;
    };
    im.src = url; tex[url] = o; return o;
  }
  const hex = h => [1,3,5].map(i => parseInt(h.slice(i, i+2), 16) / 255);
  const rnd = (a, b) => a + Math.random() * (b - a);
  function particulas(tema){
    const L = [];
    for(const g of tema.parts) for(let i = 0; i < g.n; i++){
      const p = {g, t:g.t, mov:g.mov, x:Math.random(), y:rnd(-.1, 1.1), z:rnd(g.z[0], g.z[1]), s:rnd(g.s[0], g.s[1]), rot:rnd(0, 6.3), vr:rnd(-.6, .6),
        c:hex(g.c[i % g.c.length]), ph:rnd(0, 6.3), f:rnd(.5, 1.6), vx:rnd(-.012, .012), vy:rnd(-.012, .012), vida:rnd(0, 1), dur:rnd(7, 14)};
      if(p.mov === "sube"){ p.vy = -rnd(.035, .075) * (p.t === 2 ? .45 : 1); p.vr *= .3; }
      if(p.t === 2) p.rot = rnd(-.35, .35);
      L.push(p);
    }
    return L;
  }
  function mueve(L, dt, t){
    const d = new Float32Array(L.length * 11);
    L.forEach((p, i) => {
      let a = p.g.a;
      if(p.mov === "sube"){
        p.y += p.vy * dt; p.x += Math.sin(t * p.f + p.ph) * .012 * dt; p.rot += p.vr * dt;
        if(p.y < -.15){ p.y = 1.15; p.x = Math.random(); }
        a *= Math.min(1, (1.15 - p.y) * 4) * Math.min(1, (p.y + .15) * 3) * (.65 + .35 * Math.sin(t * 3 * p.f + p.ph));
      } else if(p.mov === "flota"){
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt * .5;
        if(p.x < -.1) p.x = 1.1; if(p.x > 1.1) p.x = -.1; if(p.y < -.15) p.y = 1.15; if(p.y > 1.15) p.y = -.15;
        a *= .55 + .45 * Math.pow(Math.sin(t * p.f + p.ph) * .5 + .5, 2);
      } else {
        a *= Math.pow(Math.sin(t * p.f * 1.4 + p.ph) * .5 + .5, 3);
      }
      d.set([p.x, p.y, p.z, p.s, p.t, p.rot, a, 0, p.c[0], p.c[1], p.c[2]], i * 11);
    });
    return d;
  }

  /* ── música: pad de acordes, campanitas y reverb, todo sintetizado ── */
  function musica(tema){
    const AC = window.__ac || (window.__ac = new (window.AudioContext || window.webkitAudioContext)());
    AC.resume && AC.resume();
    const T = () => AC.currentTime, out = AC.createGain(); out.gain.setValueAtTime(0, T()); out.gain.linearRampToValueAtTime(mudo ? 0 : .5, T() + 2.5);
    const comp = AC.createDynamicsCompressor(); out.connect(comp); comp.connect(AC.destination);
    const ir = AC.createBuffer(2, AC.sampleRate * 3.4, AC.sampleRate);
    for(let c = 0; c < 2; c++){ const b = ir.getChannelData(c); for(let i = 0; i < b.length; i++) b[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / b.length, 2.6); }
    const rev = AC.createConvolver(); rev.buffer = ir; const wet = AC.createGain(); wet.gain.value = .6; rev.connect(wet); wet.connect(out);
    const lp = AC.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900; lp.Q.value = .4; lp.connect(out); lp.connect(rev);
    const lfo = AC.createOscillator(), lg = AC.createGain(); lfo.frequency.value = .06; lg.gain.value = 380; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
    const del = AC.createDelay(); del.delayTime.value = .37; const fb = AC.createGain(); fb.gain.value = .38; del.connect(fb); fb.connect(del);
    const dg = AC.createGain(); dg.gain.value = .5; del.connect(dg); dg.connect(rev); dg.connect(out);
    const ESC = tema.modo === "men" ? [0,2,3,5,7,8,10] : [0,2,4,5,7,9,11];
    const nota = (g) => tema.raiz + ESC[((g % 7) + 7) % 7] + 12 * Math.floor(g / 7);
    const hz = m => 440 * Math.pow(2, (m - 69) / 12);
    const vivos = []; let k = 0, tim = [], parado = false;
    function voz(m, t0, dur, vol, tipo, det){
      const o = AC.createOscillator(), g = AC.createGain(); o.type = tipo; o.frequency.value = hz(m); o.detune.value = det || 0;
      g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + 1.8); g.gain.setValueAtTime(vol, t0 + dur - .2); g.gain.linearRampToValueAtTime(0, t0 + dur + 2.4);
      o.connect(g); g.connect(lp); o.start(t0); o.stop(t0 + dur + 2.6); vivos.push(o);
    }
    function acorde(){
      if(parado) return;
      const g = tema.prog[k++ % tema.prog.length], t0 = T() + .05, dur = 5.2;
      voz(nota(g) - 12, t0, dur, .07, "triangle");
      for(const x of [0, 2, 4]){ voz(nota(g + x), t0, dur, .035, "triangle", rnd(-6, 6)); voz(nota(g + x), t0, dur, .012, "sawtooth", rnd(-9, 9)); }
      tim.push(setTimeout(acorde, dur * 1000));
    }
    function campana(){
      if(parado) return;
      const PENTA = tema.modo === "men" ? [0,2,3,4,6] : [0,1,2,4,5];
      const g = PENTA[Math.floor(Math.random() * 5)] + 7 * (1 + Math.floor(Math.random() * 2)) + 7, m = nota(g) + 12, t0 = T() + .02;
      for(const [mult, v] of [[1, .05], [2.76, .012], [5.4, .005]]){
        const o = AC.createOscillator(), gg = AC.createGain(); o.type = "sine"; o.frequency.value = hz(m) * mult;
        gg.gain.setValueAtTime(0, t0); gg.gain.linearRampToValueAtTime(v, t0 + .01); gg.gain.exponentialRampToValueAtTime(.0001, t0 + 2.6 / mult);
        o.connect(gg); gg.connect(del); gg.connect(rev); o.start(t0); o.stop(t0 + 2.8); vivos.push(o);
      }
      tim.push(setTimeout(campana, rnd(450, 1500)));
    }
    acorde(); tim.push(setTimeout(campana, 1200));
    return {
      parar(){ parado = true; tim.forEach(clearTimeout); out.gain.cancelScheduledValues(T()); out.gain.setValueAtTime(out.gain.value, T()); out.gain.linearRampToValueAtTime(0, T() + .9);
        setTimeout(() => { vivos.forEach(o => { try { o.stop(); } catch(e){} }); try { lfo.stop(); } catch(e){} out.disconnect(); }, 1100); },
      mute(m){ out.gain.cancelScheduledValues(T()); out.gain.setTargetAtTime(m ? 0 : .5, T(), .2); }
    };
  }

  const ease = x => x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2;
  const lerp = (a, b, t) => a + (b - a) * t;
  function cubre(img, r){ const A = img.w / img.h; let w = r.w, h = w / A; if(h < r.h){ h = r.h; w = h * A; } return {x: r.x + (r.w - w) / 2, y: r.y + (r.h - h) / 2, w, h}; }

  function entra(id, ver, elCarta, elEscena){
    if(estado || !INM[id]) return;
    if(!init()){ return; }
    const grupo = ver === "G1" ? "g1" : ver === "G2" ? "g2" : "base", D = (INM[id].v && INM[id].v[grupo]) || INM[id], tema = TEMA[id], el = elCarta, esc = elEscena;
    if(!el) return;
    const rc = el.getBoundingClientRect();
    const plantilla = ["SP", "HR", "G1", "G2"].includes(ver) || id === "s01-061", a = G.CARTAS[id].arte;
    const ven = plantilla ? {x: rc.left, y: rc.top, w: rc.width, h: rc.height} : {x: rc.left + a[0] * rc.width, y: rc.top + a[1] * rc.height, w: (a[2] - a[0]) * rc.width, h: (a[3] - a[1]) * rc.height};
    const T0 = {c0: textura(D.dos ? D.fondo : D.arte), d0: textura(D.dos ? D.fondo_d : D.arte_d), c1: D.dos ? textura(D.pj) : null, d1: D.dos ? textura(D.pj_d) : null};
    estado = {id, ver, D, tema, ven, T:T0, parts: particulas(tema), fase:"entra", p:0, t0: performance.now(), tp: performance.now(), el, esc, off:{x:0, y:0}, pan:{x:0, y:0}, ult: performance.now()};
    const ov = document.getElementById("inm"); ov.classList.add("on"); ov.classList.remove("tit", "pista");
    /* velo: tono rosado y el pie granate que tapa por donde se corta la ilustración (la secreta) */
    if(!document.getElementById("inmVelo")){ const cvv = document.getElementById("inmCv");
      cvv.insertAdjacentHTML("afterend", '<img id="inmPet" alt=""><div id="inmTono"></div><div id="inmVelo"></div>');
      cvv.insertAdjacentHTML("beforebegin", '<div id="inmCapas"><img alt=""><img alt=""></div>'); }
    const capas = document.getElementById("inmCapas"); capas.style.display = D.capas ? "block" : "none";
    if(D.capas){ if(capas.children[0].src !== D.fondo) capas.children[0].src = D.fondo; if(capas.children[1].src !== D.pj) capas.children[1].src = D.pj; }
    ov.classList.toggle("velo", !!tema.velo); ov.classList.toggle("tono", !!(tema.tono || tema.velo));
    const pet = document.getElementById("inmPet"); pet.style.display = D.petalos ? "block" : "none"; if(D.petalos && pet.src !== D.petalos) pet.src = D.petalos;
    document.getElementById("inmTit").innerHTML = '<b>' + G.CARTAS[id].n + '</b><span>' + (id === "s01-061" ? "Love of My Life" : G.nombreVer(id, ver)) + '</span>';
    esc.classList.add("volando");
    const vo = {x: ven.x + ven.w / 2 - rc.left, y: ven.y + ven.h / 2 - rc.top};
    const re = esc.getBoundingClientRect(); estado.org = {x: ven.x + ven.w / 2 - re.left, y: ven.y + ven.h / 2 - re.top};
    esc.style.transformOrigin = estado.org.x + "px " + estado.org.y + "px";
    /* si la carta tiene clip de vídeo (Gremory Cosmic), el interior es el vídeo en vez de la escena WebGL */
    const vc = document.getElementById("inmVidC"), vid = document.getElementById("inmVid");
    if(D.video){
      /* Safari no reproduce vídeo desde data:, así que se pasa a un blob una sola vez */
      if(!D.videoUrl){ try { const b64 = D.video.split(",")[1], bin = atob(b64), u8 = new Uint8Array(bin.length);
        for(let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        D.videoUrl = URL.createObjectURL(new Blob([u8], {type:"video/mp4"})); } catch(e){ D.videoUrl = D.video; } }
      vid.src = D.videoUrl; vid.loop = !D.loop && !D.unaVez; vid.currentTime = 0; vid.muted = true; vid.defaultMuted = true; vid.playsInline = true;
      vid.setAttribute("playsinline", ""); vid.setAttribute("muted", "");
      vc.style.display = "block"; estado.vid = vid; const E0 = estado; E0.vOk = false;
      /* el sonido arranca con el primer fotograma real del vídeo, para que golpes y letras caigan sincronizados */
      vid.onplaying = () => { if(estado !== E0) return; E0.vOk = true; vc.style.display = "block"; E0.vid = vid; if(E0.suena) E0.suena(vid.currentTime); };
      /* las inmersivas tipo Pocket se ven una vez y acaban en la ilustración: al terminar, la carta vuelve sola */
      vid.onended = () => { if(estado === E0 && D.unaVez) sale(); };
      vid.play().catch(() => {});
      /* si el vídeo no arranca en 4 s (móvil lento, formato no soportado), se vuelve a la escena con profundidad en vez de quedarse en negro */
      const plan = () => { if(estado !== E0 || E0.vOk) return; vc.style.display = "none"; E0.vid = null; if(E0.suena) E0.suena(0); };
      vid.onerror = plan; estado.tv = setTimeout(plan, 4000);
    } else vc.style.display = "none";
    if(D.video && D.audio){
      /* sonido con WebAudio: la intro suena una vez y luego se repite solo el tramo del bucle, sin cortes */
      try {
        const AC = window.__ac || (window.__ac = new (window.AudioContext || window.webkitAudioContext)()); AC.resume && AC.resume();
        const g = AC.createGain(); g.gain.value = mudo ? 0 : .85; g.connect(AC.destination); const E0 = estado; E0.auG = g;
        const arr = (() => { const b = atob(D.audio.split(",")[1]), u = new Uint8Array(b.length); for(let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u.buffer; })();
        const buf0 = D.audioBuf ? Promise.resolve(D.audioBuf) : AC.decodeAudioData(arr);
        let t0 = null, lista = null;
        const dale = () => { if(lista === null || t0 === null || E0.auS || estado !== E0 || E0.fase === "sale") return;
          const src = AC.createBufferSource(); src.buffer = lista; src.loop = !D.unaVez; if(D.loop){ src.loopStart = D.loop[0]; src.loopEnd = D.loop[1]; }
          src.connect(g); src.start(0, Math.min(t0, lista.duration - .05)); E0.auS = src; };
        E0.suena = t => { t0 = t; dale(); };
        buf0.then(buf => { D.audioBuf = buf; lista = buf; dale(); }).catch(() => {});
      } catch(e){}
    }
    else { try { audio = musica(tema); } catch(e){ audio = null; } }
    if(!D.video) estado.tt1 = setTimeout(() => ov.classList.add("tit"), 1700 * LENTO);
    estado.tt2 = setTimeout(() => ov.classList.add("pista"), (D.video ? 5000 : 3200) * LENTO);
    estado.tt3 = setTimeout(() => ov.classList.remove("tit"), 7500 * LENTO);
    if(tema.recuerdos && D.recuerdos && D.recuerdos.length){ clearTimeout(estado.tt2); estado.recT = recuerdos(D.recuerdos, ov); }
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  }
  /* recuerdos: van cayendo polaroids una a una encima de la escena y la última es la propia carta */
  function recuerdos(L, ov){
    let box = document.getElementById("inmRec");
    if(!box){ box = document.createElement("div"); box.id = "inmRec"; ov.insertBefore(box, document.getElementById("inmTit")); }
    box.innerHTML = ""; box.className = "";
    const T = [], t0 = 5200 * LENTO, paso = 2400 * LENTO;
    const suelta = (html, cls, i) => {
      [...box.children].forEach(c => c.classList.add("atras"));
      const p = document.createElement("div"), lado = i % 2 ? 1 : -1;
      p.className = "pol " + cls;
      p.style.setProperty("--r", (cls === "fin" ? 0 : lado * (3 + Math.random() * 6)).toFixed(1) + "deg");
      p.style.setProperty("--x", (cls === "fin" ? 0 : (Math.random() - .5) * 16).toFixed(1) + "vw");
      p.style.setProperty("--y", (cls === "fin" ? -2 : (Math.random() - .5) * 7).toFixed(1) + "vh");
      p.innerHTML = html; box.appendChild(p);
    };
    T.push(setTimeout(() => box.classList.add("on"), t0 - 700));
    L.forEach((r, i) => T.push(setTimeout(() => {
      const a = (r.w && r.h) ? r.w / r.h : .8;
      suelta('<div class="pol-f" style="aspect-ratio:' + a.toFixed(4) + '"><img src="' + r.src + '" alt=""></div><div class="pol-p">' + r.pie + '</div>', "", i);
      box.lastChild.style.width = "min(58vw, " + (58 * a).toFixed(1) + "vh)";
    }, t0 + i * paso)));
    const fin = t0 + L.length * paso;
    T.push(setTimeout(() => { suelta('<div class="pol-c">' + G.carta(estado ? estado.id : "s01-061", "SR") + '</div>', "fin", L.length); }, fin));
    T.push(setTimeout(() => ov.classList.add("pista"), fin + 1600));
    return T;
  }
  function sale(){
    if(!estado || estado.fase === "sale") return;
    estado.fase = "sale"; estado.tp = performance.now(); estado.p0 = estado.p;
    const ov = document.getElementById("inm"); ov.classList.remove("tit", "pista");
    clearTimeout(estado.tt1); clearTimeout(estado.tt2); clearTimeout(estado.tt3);
    (estado.recT || []).forEach(clearTimeout); const rb = document.getElementById("inmRec"); if(rb) rb.classList.add("fuera");
    if(audio){ audio.parar(); audio = null; }
    if(estado.auG){ const AC = window.__ac, g = estado.auG, s = estado.auS; g.gain.cancelScheduledValues(AC.currentTime); g.gain.setValueAtTime(g.gain.value, AC.currentTime); g.gain.linearRampToValueAtTime(0, AC.currentTime + .8);
      setTimeout(() => { try { s && s.stop(); } catch(e){} g.disconnect(); }, 900); }
  }
  function fin(){
    const ov = document.getElementById("inm"); ov.classList.remove("on");
    estado.esc.classList.remove("volando"); estado.esc.style.transform = ""; estado.esc.style.opacity = ""; estado.esc.style.transformOrigin = "";
    clearTimeout(estado.tv); const vv = document.getElementById("inmVid"); vv.pause(); vv.onerror = null; document.getElementById("inmVidC").style.display = "none";
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    const rb = document.getElementById("inmRec"); if(rb){ rb.innerHTML = ""; rb.className = ""; }
    const ic = document.getElementById("inmCapas"); if(ic) ic.style.display = "none";
    estado = null; cancelAnimationFrame(raf);
  }
  function frame(now){
    const E = estado; if(!E) return;
    raf = requestAnimationFrame(frame);
    const dpr = Math.min(1.6, devicePixelRatio || 1), sw = innerWidth, sh = innerHeight;
    if(cv.width !== Math.round(sw * dpr) || cv.height !== Math.round(sh * dpr)){ cv.width = Math.round(sw * dpr); cv.height = Math.round(sh * dpr); }
    const t = (now - E.t0) / 1000, dt = Math.min(.05, (now - (E.last || now)) / 1000); E.last = now;
    if(E.fase === "entra"){ E.p = Math.min(1, (now - E.tp) / (1600 * (E.tema.lento || 1) * LENTO)); if(E.p >= 1) E.fase = "dentro"; }
    else if(E.fase === "sale"){ E.p = Math.max(0, E.p0 - (now - E.tp) / (950 * (E.tema.lento || 1) * LENTO)); if(E.p <= 0){ fin(); return; } }
    const e = ease(E.p);
    /* dónde mira: giroscopio si lo hay, si no un paseo lento */
    const hayGiro = false;
    const gx = hayGiro ? Math.max(-1, Math.min(1, pos.x / 14)) : Math.sin(t * .23) * .55;
    const gy = hayGiro ? Math.max(-1, Math.min(1, pos.y / 16)) : Math.sin(t * .17 + 1) * .4;
    const sv = E.tema.suave || .06; E.pan.x += (gx - E.pan.x) * sv; E.pan.y += (gy - E.pan.y) * sv;
    const img = {w: E.D.w, h: E.D.h}, A = img.w / img.h;
    const W = Math.max(sw * 1.05, Math.min(sh * A * 1.08, sw / (E.tema.vis || .45))) * (sw > sh ? (E.tema.zoom || 1) : 1) * (1 + .03 * Math.sin(t * .11)), H = W / A;
    const cyT = E.tema.cy == null ? .5 : E.tema.cy, holgura = E.tema.cy == null ? Math.max(0, H - sh) / 2 * .85 : sh * .06;
    let fin_ = {x: sw / 2 - W / 2 - E.pan.x * (W - sw) / 2 * .85 * (E.tema.panx || 1), y: sh / 2 - H * cyT - E.pan.y * holgura, w: W, h: H};
    /* el vídeo ya trae su propia cámara: se encaja quieto, a sangre en el móvil y entero en pantallas anchas */
    if(E.vid){ const Wv = sw / sh > .75 ? sh * A : Math.max(sw, sh * A), Hv = Wv / A; fin_ = {x: (sw - Wv) / 2, y: (sh - Hv) / 2, w: Wv, h: Hv}; }
    const ini = cubre(img, E.ven);
    const art = {x: lerp(ini.x, fin_.x, e), y: lerp(ini.y, fin_.y, e), w: lerp(ini.w, fin_.w, e), h: lerp(ini.h, fin_.h, e)};
    /* pétalos en primer plano: una capa plana muy cerca de cámara, que se mueve más que el resto */
    if(E.D.petalos){ const pe = document.getElementById("inmPet"), sc = 1.08;
      Object.assign(pe.style, {left: (art.x - art.w * (sc - 1) / 2 + E.pan.x * art.w * .05 * e) + "px", top: (art.y - art.h * (sc - 1) / 2 + E.pan.y * art.h * .04 * e) + "px",
        width: art.w * sc + "px", height: art.h * sc + "px", opacity: Math.max(0, (e - .3) / .7)}); }
    const clip = {x: lerp(E.ven.x, 0, e), y: lerp(E.ven.y, 0, e), w: lerp(E.ven.w, sw, e), h: lerp(E.ven.h, sh, e)};
    const rad = lerp(E.ven.w * .03, 0, e);
    const k = .05 * e;
    const off = {x: -E.pan.x * k - Math.sin(t * .31) * .012 * e, y: -E.pan.y * k * .8 - Math.cos(t * .23) * .008 * e};
    /* la carta del DOM vuela hacia la cámara y se desvanece */
    const s = art.w / ini.w, cx = art.x + art.w / 2 - (ini.x + ini.w / 2), cy = art.y + art.h / 2 - (ini.y + ini.h / 2);
    E.esc.style.transform = "translate(" + cx + "px," + cy + "px) scale(" + s + ")";
    E.esc.style.opacity = Math.max(0, 1 - Math.max(0, e - .15) / .35);
    document.getElementById("inmFondo").style.opacity = Math.min(1, e * 3.5);
    /* pintar */
    gl.viewport(0, 0, cv.width, cv.height); gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    if(E.vid){
      const vc = document.getElementById("inmVidC");
      if(E.D.loop && E.vid.currentTime >= E.D.loop[1] - .06){ E.vid.currentTime = E.D.loop[0]; if(E.vid.paused) E.vid.play().catch(() => {}); }
      vc.style.clipPath = vc.style.webkitClipPath = "inset(" + clip.y + "px " + (sw - clip.x - clip.w) + "px " + (sh - clip.y - clip.h) + "px " + clip.x + "px round " + rad + "px)";
      Object.assign(E.vid.style, {left: art.x + "px", top: art.y + "px", width: art.w + "px", height: art.h + "px"});
      return;
    }
    /* capas planas (la secreta): fondo y personajes como dos láminas que se desplazan a distinto ritmo,
       sin mapa de profundidad, así no se deforman ni dejan estela en los bordes */
    const capas = E.D.capas && document.getElementById("inmCapas");
    if(capas){
      capas.style.clipPath = capas.style.webkitClipPath = "inset(" + clip.y + "px " + (sw - clip.x - clip.w) + "px " + (sh - clip.y - clip.h) + "px " + clip.x + "px round " + rad + "px)";
      const L = [[capas.children[0], .5, 1.05], [capas.children[1], -.28, 1]];
      for(const [im, f, sc] of L) Object.assign(im.style, {left: art.x + "px", top: art.y + "px", width: art.w + "px", height: art.h + "px",
        transform: "translate(" + (off.x * f * art.w).toFixed(2) + "px," + (off.y * f * art.h).toFixed(2) + "px) scale(" + sc + ")"});
    } else {
    const ok = E.T.c0.ok && E.T.d0.ok && (!E.T.c1 || (E.T.c1.ok && E.T.d1.ok));
    if(!ok) return;
    gl.disable(gl.BLEND); gl.useProgram(P.p); const u = P.u;
    gl.uniform2f(u.uRes, cv.width, cv.height);
    gl.uniform4f(u.uArt, art.x * dpr, art.y * dpr, art.w * dpr, art.h * dpr);
    gl.uniform4f(u.uClip, clip.x * dpr, clip.y * dpr, clip.w * dpr, clip.h * dpr); gl.uniform1f(u.uRad, rad * dpr);
    gl.uniform2f(u.uOff, off.x, off.y); gl.uniform1f(u.uFoco, E.tema.foco); gl.uniform1f(u.uT, t);
    gl.uniform1f(u.uDos, E.T.c1 ? 1 : 0); gl.uniform1f(u.uRespira, Math.sin(t * 1.7) * .006 * e);
    gl.uniform2f(u.uLuz, E.tema.luz[0], E.tema.luz[1]); gl.uniform3f(u.uRCol, ...E.tema.rcol); gl.uniform1f(u.uLuzA, E.tema.rayo * e);
    [["tC0", E.T.c0], ["tD0", E.T.d0], ["tC1", E.T.c1 || E.T.c0], ["tD1", E.T.d1 || E.T.d0]].forEach(([n, o], i) => {
      gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, o.t); gl.uniform1i(u[n], i); });
    gl.bindBuffer(gl.ARRAY_BUFFER, buf); const lp = gl.getAttribLocation(P.p, "p");
    gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); gl.disableVertexAttribArray(lp);
    }
    /* partículas */
    const d = mueve(E.parts, dt, t);
    gl.useProgram(PP.p); const v = PP.u;
    gl.uniform2f(v.uRes, cv.width, cv.height); gl.uniform4f(v.uArt, art.x * dpr, art.y * dpr, art.w * dpr, art.h * dpr);
    gl.uniform2f(v.uOff, off.x * 1.4, off.y * 1.4); gl.uniform1f(v.uFoco, E.tema.foco); gl.uniform1f(v.uDpr, dpr);
    gl.uniform4f(v.uClip, clip.x * dpr, clip.y * dpr, clip.w * dpr, clip.h * dpr); gl.uniform1f(v.uRad, rad * dpr);
    gl.bindBuffer(gl.ARRAY_BUFFER, pbuf); gl.bufferData(gl.ARRAY_BUFFER, d, gl.DYNAMIC_DRAW);
    const at = ["a0", "a1", "a2"].map(n => gl.getAttribLocation(PP.p, n));
    gl.enableVertexAttribArray(at[0]); gl.vertexAttribPointer(at[0], 4, gl.FLOAT, false, 44, 0);
    gl.enableVertexAttribArray(at[1]); gl.vertexAttribPointer(at[1], 4, gl.FLOAT, false, 44, 16);
    gl.enableVertexAttribArray(at[2]); gl.vertexAttribPointer(at[2], 3, gl.FLOAT, false, 44, 32);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
    gl.drawArrays(gl.POINTS, 0, E.parts.length);
    at.forEach(a => gl.disableVertexAttribArray(a));
  }
  function silencio(){ mudo = !mudo; if(audio) audio.mute(mudo); if(estado && estado.auG) estado.auG.gain.value = mudo ? 0 : .85; document.getElementById("inmSon").classList.toggle("off", mudo); }
  return {entra, sale, silencio, activo: () => !!estado, pon: (id, d) => { INM[id] = d; }, hay: id => !!INM[id], webgl2: () => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch(e){ return false; } }};
})();


const st = document.createElement("style"); st.textContent = "#inm{position:fixed;inset:0;z-index:400;display:none;touch-action:none}\n#inm.on{display:block}\n#inmFondo{position:absolute;inset:0;background:#05040a;opacity:0}\n#inmCv{position:absolute;inset:0;width:100%;height:100%;display:block}\n#inmVidC{position:absolute;inset:0;display:none}\n#inmTono,#inmVelo{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity 1.8s .4s ease}\n#inm.velo.on #inmVelo{opacity:1}\n#inmPet{position:absolute;display:none;pointer-events:none;max-width:none;filter:blur(1.5px)}\n#inmCapas{position:absolute;inset:0;display:none;pointer-events:none;overflow:hidden}\n#inmCapas img{position:absolute;max-width:none;transform-origin:50% 50%;will-change:transform}\n/* recuerdos de la secreta: polaroids que caen sobre la escena */\n#inmRec{position:absolute;inset:0;pointer-events:none;z-index:65;background:rgba(18,3,9,0);transition:background 2s ease,opacity 1.1s ease}\n#inmRec.on{background:rgba(18,3,9,.45)}\n#inmRec.fuera{opacity:0}\n#inmRec .pol{position:absolute;left:50%;top:47%;width:min(58vw,34vh);padding:min(2.6vw,1.5vh) min(2.6vw,1.5vh) 0;background:#fbf8f2;border-radius:3px;\n  box-shadow:0 18px 40px rgba(0,0,0,.5),0 2px 4px rgba(0,0,0,.25);transform:translate(-50%,-50%) translate(var(--x),var(--y)) rotate(var(--r));\n  animation:polCae 1.35s cubic-bezier(.22,.8,.3,1.04) both;transition:filter 1.2s ease}\n#inmRec .pol.atras{filter:brightness(.78) saturate(.9)}\n#inmRec .pol-f{aspect-ratio:4/5;overflow:hidden;background:#222}\n#inmRec .pol-f img{width:100%;height:100%;object-fit:cover;display:block}\n#inmRec .pol-p{font:italic 400 min(4.6vw,2.7vh)/1.2 \"Instrument Serif\",Georgia,serif;color:#3b2626;text-align:center;padding:min(2.2vw,1.3vh) 6px min(3vw,1.8vh)}\n#inmRec .pol.fin{padding:0;background:none;box-shadow:none;width:auto;animation-duration:1.7s}\n#inmRec .pol.fin .carta{--w:min(64vw,40vh);box-shadow:0 0 60px rgba(255,120,160,.55),0 24px 50px rgba(0,0,0,.6)}\n@keyframes polCae{0%{opacity:0;transform:translate(-50%,-50%) translate(var(--x),calc(var(--y) - 34vh)) rotate(calc(var(--r) * -2.5)) scale(1.3)}\n  55%{opacity:1}100%{opacity:1;transform:translate(-50%,-50%) translate(var(--x),var(--y)) rotate(var(--r)) scale(1)}}\n#inmTono{background:linear-gradient(170deg,#ff9fb6 0%,#ffd2a0 45%,#c23a5e 100%);mix-blend-mode:multiply;opacity:0}\n#inm.tono.on #inmTono{opacity:.16}\n#inmVelo{background:linear-gradient(0deg,#22030b 0%,rgba(70,6,24,.96) 16%,rgba(110,14,42,.55) 32%,transparent 46%),\n  radial-gradient(120% 70% at 50% 40%,transparent 55%,rgba(40,2,14,.55) 100%)}\n#inmVid{position:absolute;object-fit:cover;background:#05040a}\n.escena.volando{position:relative;z-index:401;pointer-events:none;will-change:transform,opacity}\n#inmTit{position:absolute;left:0;right:0;bottom:calc(env(safe-area-inset-bottom) + 74px);text-align:center;opacity:0;transform:translateY(10px);transition:opacity 1.2s,transform 1.2s;pointer-events:none;z-index:70}\n#inm.tit #inmTit{opacity:1;transform:none}\n#inmTit b{display:block;font:400 42px/1 \"Instrument Serif\",Georgia,serif;color:#fff;text-shadow:0 2px 18px rgba(0,0,0,.7)}\n#inmTit span{display:block;margin-top:8px;font:700 10px/1 \"Space Mono\",monospace;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.75);text-shadow:0 1px 8px rgba(0,0,0,.8)}\n#inmPista{position:absolute;left:0;right:0;bottom:calc(env(safe-area-inset-bottom) + 36px);text-align:center;font:700 9.5px/1 \"Space Mono\",monospace;letter-spacing:.2em;text-transform:uppercase;\n  color:#fff;opacity:0;transition:opacity 1.5s;pointer-events:none;z-index:70}\n#inm.pista #inmPista{opacity:.5}\n#inmSon{position:absolute;top:calc(env(safe-area-inset-top) + 14px);right:14px;width:42px;height:42px;display:grid;place-items:center;border-radius:50%;\n  background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.18);color:#fff;z-index:70;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}\n#inmSon .tacha{display:none}#inmSon.off .tacha{display:inline}#inmSon.off .ondas{display:none}\n"; document.head.appendChild(st);
document.body.insertAdjacentHTML("beforeend", "<div id=\"inm\"><div id=\"inmFondo\"></div><canvas id=\"inmCv\"></canvas><div id=\"inmVidC\"><video id=\"inmVid\" playsinline muted></video></div>\n  <button id=\"inmSon\" aria-label=\"Sonido\"><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 9.5h3.5L12 5.5v13l-4.5-4H4z\"/><path class=\"ondas\" d=\"M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11\"/><path class=\"tacha\" d=\"M16 9.5l5 5M21 9.5l-5 5\"/></svg></button>\n  <div id=\"inmTit\"></div><div id=\"inmPista\">Toca para volver</div></div>\n");
document.getElementById("inm").onclick = e => { if(e.target.closest("#inmSon")) return; if(Inm.activo()) Inm.sale(); };
document.getElementById("inmSon").onclick = e => { e.stopPropagation(); Inm.silencio(); };
window.GTCG_INM = Inm;
})();
