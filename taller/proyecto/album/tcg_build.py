# Gremory TCG para la app: saca el motor de las cartas (plantillas, rarezas, foils) de la galería
# y lo deja en una carpeta lista para subir al repo como docs/tcg/:
#   motor.css   estilos de las cartas (holo.css incluido) + Casa + el juego (juego.css)
#   motor.js    plantillas y datos del Set 1 (sin imágenes: las pide al Worker), expone window.GTCG
#   juego.js    binder, sobres y cambios dentro de la app (usa S, save, sincroniza... de index.html)
#   sobre3d.js  el sobre en 3D de la apertura (módulo; lo importa juego.js)
#   arte/       cielo, tejados, dorso de carta, revelados... de Valeria (las portadas con caras van al Worker)
#   tex/        texturas de los foils;  firma.woff2  la letra de la firma
# Uso:  NOMBRES=1 python3 build_album.py && python3 tcg_build.py SALIDA
import os,re,sys,json,shutil
AQUI=os.path.dirname(os.path.abspath(__file__)); PROY=os.path.dirname(AQUI)+'/'
OUT=(sys.argv[1] if len(sys.argv)>1 else AQUI+'/tcg').rstrip('/')+'/'
os.makedirs(OUT+'tex',exist_ok=True)
src=open(PROY+'galeria.src.html').read()

# ── CSS ──
css=src[src.index('<style>')+7:src.index('</style>')]
css=css.replace('/*FUENTES*/','@font-face{font-family:"Firma";src:url("firma.woff2") format("woff2");font-display:block}')
css=css.replace('/*HOLO*/',open(PROY+'holo.css').read())
# fuera lo que es de la página de la galería (la app tiene sus propios colores, cuerpo y botones)
a=css.index(':root{--bg:'); b=css.index('/* ── la carta ── */')
css=css[:a]+':root{--pointer-x:50%;--pointer-y:50%;--card-opacity:1;--rotate-x:0deg;--rotate-y:0deg;--background-x:50%;--background-y:50%;\n  --pointer-from-center:0;--pointer-from-top:.5;--pointer-from-left:.5;--mx:.5;--my:.5}\n'+css[b:]
a=css.index('/* ── modo inmersivo ── */'); b=css.index('/* ── marco base propio')
css=css[:a]+css[b:]
css=css[:css.index('/* ── selector ── */')]
m=open(AQUI+'/make.py').read(); ex=m[m.index("extra='''")+9:]; ex=ex[:ex.index("'''")]
css+='\n/* ── Casa ── */\n'+'\n'.join(l for l in ex.splitlines() if 'casa' in l)
css+='\n'+open(AQUI+'/juego.css').read()
css += '\n' + open(AQUI+'/manga.css').read()
open(OUT+'motor.css','w').write(css)
for f in os.listdir(PROY+'tex'):
    if re.search(r'url\("tex/'+re.escape(f)+'"\)',css): shutil.copy(PROY+'tex/'+f,OUT+'tex/'+f)
shutil.copy(PROY+'fuentes/firma.woff2',OUT+'firma.woff2')

# ── JS ──
js=src[src.index('const IMG = /*IMGS*/;'):src.index('/* ── interfaz ── */')]
js=js.replace('/*IMGS*/','{}').replace('/*ART*/','{}')
js=js.replace("w.num + '/006'","w.num + '/060'")
js=js.replace("function versiones(id){","function versiones0(id){",1)
js=js.replace("function carta(id, v){","function carta(id, v){\n  if(v === \"CASA\") return cartaCasa(id);",1)
D=open(AQUI+'/album-data-app.json').read()
INJ=open(AQUI+'/inject.js').read().replace('/*SET1*/',D)
# la dedicatoria de la 061 es una sorpresa: no va al repo público (se pondrá privada desde el Worker)
import re as _re
INJ=_re.sub(r'texto: \[.*?\],\n  firma:', 'texto: [],\n  firma:', INJ, count=1, flags=_re.S)
assert _re.search(r'texto: \[\],\n  firma:', INJ), 'la dedicatoria de la 061 no puede ir en el paquete público'
js+='\n'+INJ
js+=r'''
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
window.GTCG = {carta, versiones, nombreVer, icono, VERS, CARTAS, FICHA, D1, luz, ponImagenes, secretaAudio, secretaLatido, secretaEstalla, cartaSecretaDorso,
  firmas(f){ if(f && typeof f === "object") FIRMAS = Object.assign({}, FIRMAS, f); }};
'''
open(OUT+'motor.js','w').write('/* Gremory TCG · motor de las cartas (generado por tcg_build.py: no editar a mano) */\n(function(){\n'+js+'\n})();\n'+open(AQUI+'/manga.js').read())
shutil.copy(AQUI+'/juego.js',OUT+'juego.js')
shutil.copy(AQUI+'/sobre3d.js',OUT+'sobre3d.js')   # el sobre en 3D (three.js desde jsDelivr); juego.js lo carga al abrir sobres
shutil.copytree(AQUI+'/arte',OUT+'arte',dirs_exist_ok=True)   # piezas de Valeria sin personas (las convierte gremory-cartas/scripts/convierte_tcg.py)
tot=sum(os.path.getsize(os.path.join(dp,f)) for dp,_,fs in os.walk(OUT) for f in fs)
print('listo en',OUT,round(tot/1e6,2),'MB')
