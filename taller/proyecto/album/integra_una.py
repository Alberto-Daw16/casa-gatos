# Uso: python3 integra_una.py <carpeta_entrega> <base> <capa1,capa2,...> <sufijo>
# Pasa una carta elegida a final/s01 y reviews/s01/web (copia de lo sustituido en _anteriores-FECHA)
import os, sys, json, shutil, datetime
from PIL import Image
D = os.path.expanduser('~/mnt/Downloads/')
if not os.path.isdir(D + 'gremory-cartas'): D = os.path.expanduser('~/Downloads/')
C = D + 'gremory-cartas/'; FIN, WEB = C + 'final/s01/', C + 'reviews/s01/web/'
HOY = datetime.date.today().isoformat()
carpeta, base, capas, suf = sys.argv[1].rstrip('/') + '/', sys.argv[2], sys.argv[3].split(','), sys.argv[4]
bf, bw = FIN + '_anteriores-' + HOY + '/', WEB + '_anteriores-' + HOY + '/'
os.makedirs(bf, exist_ok=True); os.makedirs(bw, exist_ok=True)
man = json.load(open(WEB + 'manifest.json'))
if not os.path.exists(bw + 'manifest.json'): shutil.copy(WEB + 'manifest.json', bw + 'manifest.json')
for c in capas:
    if not os.path.exists(carpeta + base + '-' + c + suf + '.png'): raise SystemExit('falta ' + carpeta + base + '-' + c + suf + '.png')
for c in capas:
    src = carpeta + base + '-' + c + suf + '.png'; dst = FIN + base + '-' + c + '.png'
    if os.path.exists(dst) and not os.path.exists(bf + os.path.basename(dst)): shutil.copy2(dst, bf + os.path.basename(dst))
    shutil.copy2(src, dst)
    w = base + '-' + c + '.webp'
    if os.path.exists(WEB + w) and not os.path.exists(bw + w): shutil.copy2(WEB + w, bw + w)
    im = Image.open(src); im = im.convert('RGBA') if c == 'pj' else im.convert('RGB')
    im.save(WEB + w, 'WEBP', quality=88)
    e = {'w': im.width, 'h': im.height}
    if c == 'pj':
        b = im.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
        e['bb'] = [b[0] / im.width, b[1] / im.height, b[2] / im.width, b[3] / im.height]
    man[w] = e
json.dump(man, open(WEB + 'manifest.json', 'w'), indent=1)
print('integrada', base, suf)
