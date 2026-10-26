# Genera docs/tcg/inmersiva.js (módulo para la app) a partir de gremory-tcg/proyecto/inmersiva.js (la del álbum).
# La app le pasa los datos (imágenes privadas del Worker) con GTCG_INM.pon(id, datos) y entra con GTCG_INM.entra(id, ver, carta, escena).
import json, re
src = open('/home/claude/work/inm/inmersiva-src.js').read()
css = open('/home/claude/work/inm/inm.css').read()
html = open('/home/claude/work/inm/inm.html').read()
js = src[:src.index('$("bInm").onclick')]
def R(o, n, c=1):
    global js
    assert js.count(o) == c, (o, js.count(o)); js = js.replace(o, n)
R('const INM = /*INM*/;', 'const INM = {};')
R('const im = new Image(); im.onload = () => {', 'const im = new Image(); im.crossOrigin = "anonymous"; im.onload = () => {')
R('const LENTO = +(new URLSearchParams(location.search).get("lento") || 1);', 'const LENTO = 1;')
R('function entra(id, ver){', 'function entra(id, ver, elCarta, elEscena){')
R('el = document.querySelector("#sitio .carta"), esc = document.querySelector(".escena");', 'el = elCarta, esc = elEscena;')
R('a = CARTAS[id].arte;', 'a = G.CARTAS[id].arte;')
R("'<b>' + CARTAS[id].n + '</b><span>' + nombreVer(id, ver) + '</span>'", "'<b>' + G.CARTAS[id].n + '</b><span>' + (id === \"s01-061\" ? \"Love of My Life\" : G.nombreVer(id, ver)) + '</span>'")
R('if(typeof carta === "function") suelta(\'<div class="pol-c">\' + carta(', 'suelta(\'<div class="pol-c">\' + G.carta(')
R('const hayGiro = typeof ultimo !== "undefined" && performance.now() - ultimo < 1500;', 'const hayGiro = false;')
R('return {entra, sale, silencio, activo: () => !!estado};', 'return {entra, sale, silencio, activo: () => !!estado, pon: (id, d) => { INM[id] = d; }, hay: id => !!INM[id], webgl2: () => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch(e){ return false; } }};')
css = css.replace('#inm{position:fixed;inset:0;z-index:50;', '#inm{position:fixed;inset:0;z-index:400;').replace('.escena.volando{position:relative;z-index:60;', '.escena.volando{position:relative;z-index:401;')
out = ('/* Gremory TCG · modo inmersivo (generado por inm_build.py desde proyecto/inmersiva.js: no editar a mano) */\n(function(){\n"use strict";\nconst G = window.GTCG;\n' + js +
  '\nconst st = document.createElement("style"); st.textContent = ' + json.dumps(css) + '; document.head.appendChild(st);\n' +
  'document.body.insertAdjacentHTML("beforeend", ' + json.dumps(html) + ');\n' +
  'document.getElementById("inm").onclick = e => { if(e.target.closest("#inmSon")) return; if(Inm.activo()) Inm.sale(); };\n' +
  'document.getElementById("inmSon").onclick = e => { e.stopPropagation(); Inm.silencio(); };\n' +
  'window.GTCG_INM = Inm;\n})();\n')
open('/home/claude/casa-gatos/docs/tcg/inmersiva.js', 'w').write(out)
print(len(out))
