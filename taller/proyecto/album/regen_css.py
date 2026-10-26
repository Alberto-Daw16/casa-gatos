# motor.css = prefijo del motor (hasta "piezas de Valeria") + juego.css desde ese marcador + "\n" + manga.css (diseño fullart manga + bordes, 25/10)
import sys, os
RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))   # la raíz del repo
AQUI = os.path.dirname(os.path.abspath(__file__))
M = "/* ══ piezas de Valeria"
mc = open(os.path.join(RAIZ, 'docs/tcg/motor.css')).read()
jc = open(os.path.join(AQUI, 'juego.css')).read()
mg = open(os.path.join(AQUI, 'manga.css')).read()
pre = mc[:mc.index(M)]
out = pre + jc[jc.index(M):]
out = out.rstrip('\n') + '\n' if not jc.endswith('\n') else out
out = out + '\n' + mg
if '--check' in sys.argv: print(out == mc); sys.exit()
open(os.path.join(RAIZ, 'docs/tcg/motor.css'), 'w').write(out)
