# convierte lo nuevo de gremory-cartas/final/s01 (PNG de Codex) a reviews/s01/web (webp ligeros) y apunta
# en manifest.json el tamaño y la caja del personaje (bb, fracciones del lienzo). Solo toca lo que falta.
import json,os,sys
from PIL import Image
def _cartas():
    for c in [os.environ.get('GREMORY_CARTAS',''), os.path.expanduser('~/Downloads/gremory-cartas'), os.path.expanduser('~/mnt/Downloads/gremory-cartas'), '/mnt/user-data/uploads/Downloads/gremory-cartas']:
        if c and os.path.isdir(c): return c.rstrip('/')+'/'
    raise SystemExit('No encuentro la carpeta gremory-cartas (pon GREMORY_CARTAS=ruta)')
CARTAS=_cartas()
F=CARTAS+'final/s01/'; W=CARTAS+'reviews/s01/web/'
os.makedirs(W,exist_ok=True)
man=json.load(open(W+'manifest.json')) if os.path.exists(W+'manifest.json') else {}
forzar='--todo' in sys.argv
n=0
for f in sorted(os.listdir(F)):
    if not f.endswith('.png'): continue
    out=f[:-4]+'.webp'
    if not forzar and out in man and os.path.exists(W+out) and os.path.getmtime(W+out)>=os.path.getmtime(F+f): continue
    im=Image.open(F+f); im.load()
    if '-pj' in f and im.mode!='RGBA': print('OJO, personaje sin transparencia:',f); im=im.convert('RGBA')
    mx=1400 if 'gremory' in f else 1200
    r=min(1,mx/max(im.size))
    if r<1: im=im.resize((round(im.width*r),round(im.height*r)),Image.LANCZOS)
    e={'w':im.width,'h':im.height}
    if '-pj' in f:
        b=im.getchannel('A').point(lambda v:255 if v>24 else 0).getbbox()
        if b: e['bb']=[b[0]/im.width,b[1]/im.height,b[2]/im.width,b[3]/im.height]
        im.save(W+out,'WEBP',quality=88)
    else: im.convert('RGB').save(W+out,'WEBP',quality=86)
    man[out]=e; n+=1; print(out,e)
json.dump(man,open(W+'manifest.json','w'),indent=1)
print(n,'convertidas')
