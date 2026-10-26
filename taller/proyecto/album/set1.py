# datos del Set 1 sacados de SET1.md (lo que manda) — solo lo que hace falta para pintar
import re,json
import os
# rutas: este kit vive en gremory-tcg/proyecto/album; las cartas de Codex en gremory-cartas
AQUI=os.path.dirname(os.path.abspath(__file__))
PROY=os.path.dirname(AQUI)+'/'
def _cartas():
    for c in [os.environ.get('GREMORY_CARTAS',''), os.path.expanduser('~/Downloads/gremory-cartas'), os.path.expanduser('~/mnt/Downloads/gremory-cartas'), '/mnt/user-data/uploads/Downloads/gremory-cartas']:
        if c and os.path.isdir(c): return c.rstrip('/')+'/'
    raise SystemExit('No encuentro la carpeta gremory-cartas (pon GREMORY_CARTAS=ruta)')
CARTAS=_cartas()
s=open(CARTAS+'SET1.md').read()
cards={}
for line in s.splitlines():
    m=re.match(r'^\| (\d{3})(/060)? \| (.+)$',line)
    if not m: continue
    c=[x.strip() for x in line.strip('|').split('|')]
    n=c[0][:3]
    if int(n)>=49 and int(n)<=60: cards[n]={'n':n,'casa':True,'que':c[1],'esc':c[2]}
    elif n=='061': cards[n]={'n':n,'quien':c[1],'tipo':'Secreta','esc':c[3]}
    else: cards[n]={'n':n,'quien':c[1],'tipo':c[2].split(' (')[0],'esc':c[3],'outfit':c[5]}
json.dump(cards,open(AQUI+'/set1.json','w'),ensure_ascii=False,indent=0)
print(len(cards))
