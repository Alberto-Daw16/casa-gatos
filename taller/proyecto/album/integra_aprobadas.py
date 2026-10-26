# Pasa las cartas aprobadas (carpetas Gremory-*-aprobada / definitivas de Descargas) a final/s01 y a reviews/s01/web
# Guarda copia de lo que sustituye en final/s01/_anteriores-FECHA/ y reviews/s01/web/_anteriores-FECHA/
import os, json, shutil, datetime
from PIL import Image
D = os.path.expanduser('~/mnt/Downloads/')
if not os.path.isdir(D + 'gremory-cartas'): D = os.path.expanduser('~/Downloads/')
C = D + 'gremory-cartas/'
FIN, WEB = C + 'final/s01/', C + 'reviews/s01/web/'
HOY = datetime.date.today().isoformat()
A = D + 'Gremory-Alberto-seleccion-aprobada/'
K = D + 'Gremory-Cris-definitivas-011A-013C-015C-sirena/'
SEL = [  # (carpeta, base, capas, sufijo)
  (A + 's01-001/', 's01-001-alberto-estandar', ['fondo', 'pj'], '--A'),
  (A + 's01-003/', 's01-003-alberto-escapada', ['fondo', 'pj'], '--B'),
  (A + 's01-004/', 's01-004-alberto-firmada', ['fondo', 'pj'], ''),
  (A + 's01-005/', 's01-005-alberto-oro', ['fondo', 'pj'], ''),
  (A + 's01-006/', 's01-006-alberto-gremory', ['pj', 'obsidiana', 'cosmica'], ''),
  (A + 's01-007/', 's01-007-alberto-estandar', ['fondo', 'pj'], '--A'),
  (A + 's01-008/', 's01-008-alberto-estandar', ['fondo', 'pj'], ''),
  (A + 's01-009/', 's01-009-alberto-estandar', ['fondo', 'pj'], ''),
  (A + 's01-010/', 's01-010-alberto-estandar', ['fondo', 'pj'], '--B'),
  (K + 's01-011/', 's01-011-cristina-estandar', ['fondo', 'pj'], '--A'),
  (K + 's01-013/', 's01-013-cristina-escapada', ['fondo', 'pj'], '--C'),
  (K + 's01-015/', 's01-015-cristina-oro', ['fondo', 'pj'], '--C'),
]
bf, bw = FIN + '_anteriores-' + HOY + '/', WEB + '_anteriores-' + HOY + '/'
os.makedirs(bf, exist_ok=True); os.makedirs(bw, exist_ok=True)
man = json.load(open(WEB + 'manifest.json'))
if not os.path.exists(bw + 'manifest.json'): shutil.copy(WEB + 'manifest.json', bw + 'manifest.json')
hechas = []
for carpeta, base, capas, suf in SEL:
    for c in capas:
        src = carpeta + base + '-' + c + suf + '.png'
        if not os.path.exists(src): raise SystemExit('falta ' + src)
    for c in capas:
        src = carpeta + base + '-' + c + suf + '.png'
        dst = FIN + base + '-' + c + '.png'
        if os.path.exists(dst) and not os.path.exists(bf + os.path.basename(dst)): shutil.copy2(dst, bf + os.path.basename(dst))
        shutil.copy2(src, dst)
        w = base + '-' + c + '.webp'
        if os.path.exists(WEB + w) and not os.path.exists(bw + w): shutil.copy2(WEB + w, bw + w)
        im = Image.open(src)
        im = im.convert('RGBA') if c == 'pj' else im.convert('RGB')
        im.save(WEB + w, 'WEBP', quality=88)
        e = {'w': im.width, 'h': im.height}
        if c == 'pj':
            b = im.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
            e['bb'] = [b[0] / im.width, b[1] / im.height, b[2] / im.width, b[3] / im.height]
        man[w] = e
    hechas.append(base[:7])
json.dump(man, open(WEB + 'manifest.json', 'w'), indent=1)
print('integradas:', ' '.join(hechas))
