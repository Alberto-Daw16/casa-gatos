# motor.css = prefijo del motor (hasta "piezas de Valeria") + juego.css desde ese marcador + "\n" + manga.css (diseño fullart manga + bordes, 25/10)
import sys
M = "/* ══ piezas de Valeria"
mc = open('/home/claude/casa-gatos/docs/tcg/motor.css').read()
jc = open('/home/claude/work/juego.css').read()
mg = open('/home/claude/work/manga.css').read()
pre = mc[:mc.index(M)]
out = pre + jc[jc.index(M):]
out = out.rstrip('\n') + '\n' if not jc.endswith('\n') else out
out = out + '\n' + mg
if '--check' in sys.argv: print(out == mc); sys.exit()
open('/home/claude/casa-gatos/docs/tcg/motor.css', 'w').write(out)
