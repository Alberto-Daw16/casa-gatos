# pasa las capturas th/NNN.png a miniaturas th/NNN.webp (260 px de ancho)
import glob,os
from PIL import Image
AQUI=os.path.dirname(os.path.abspath(__file__))
for f in glob.glob(AQUI+'/th/*.png'):
    i=Image.open(f).convert('RGB'); i=i.resize((260,round(260*i.height/i.width)),Image.LANCZOS); i.save(f[:-4]+'.webp','WEBP',quality=80)
print('ok')
