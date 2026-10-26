import sys, numpy as np, cv2, onnxruntime as ort
from PIL import Image
import os
SRC=os.path.expanduser('~/Downloads/gremory-cartas/final/')
ARTE={'alberto':[.0306,.1266,.9694,.8675]}
da=ort.InferenceSession('../inm/da.onnx',providers=['CPUExecutionProvider'])
def prof(img):
    w,h=img.size; S=518*2//14*14
    x=np.array(img.convert('RGB').resize((S,S),Image.BICUBIC)).astype(np.float32)/255
    x=((x-[.485,.456,.406])/[.229,.224,.225]).transpose(2,0,1)[None].astype(np.float32)
    d=cv2.resize(da.run(None,{da.get_inputs()[0].name:x})[0][0],(w,h),interpolation=cv2.INTER_CUBIC)
    lo,hi=np.percentile(d,1),np.percentile(d,99.5); d=np.clip((d-lo)/(hi-lo),0,1)
    return cv2.bilateralFilter((d*255).astype(np.uint8),9,40,9)
def comp(f,p): c=f.convert('RGBA'); c.alpha_composite(p); return c.convert('RGB')
def inm(id,nom,f,p):
    f.save(f'../inm/v/{id}-{nom}-fondo.webp',quality=86); p.save(f'../inm/v/{id}-{nom}-pj.webp',quality=88)
    Image.fromarray(prof(f)).save(f'../inm/v/{id}-{nom}-fondo-d.webp',quality=82)
    Image.fromarray(cv2.dilate(prof(comp(f,p)),np.ones((7,7),np.uint8))).save(f'../inm/v/{id}-{nom}-pj-d.webp',quality=82)
for id in sys.argv[1:]:
    L=lambda n: Image.open(SRC+f'{id}-{n}.png')
    bf,bp=L('base-fondo').convert('RGB'),L('base-pj').convert('RGBA')
    # ventana de la carta base
    a=ARTE[id]; W,H=720,1019; ww,wh=round((a[2]-a[0])*W),round((a[3]-a[1])*H); asp=ww/wh
    cw=bf.width; ch=round(cw/asp); y0=0
    box=(0,y0,cw,y0+ch)
    bf.crop(box).save(f'../capas/v2/{id}-fondo.webp',quality=86); bp.crop(box).save(f'../capas/v2/{id}-pj.webp',quality=88)
    marco=Image.open(f'../capas/v/{id}-marco.webp').convert('RGBA'); pl=Image.new('RGBA',(W,H),(0,0,0,255))
    pl.paste(comp(bf.crop(box),bp.crop(box)).resize((ww,wh),Image.LANCZOS),(round(a[0]*W),round(a[1]*H))); pl.alpha_composite(marco)
    old=Image.open(f'../capas/v/{id}-plana.webp').convert('RGBA'); pl.putalpha(old.getchannel('A'))
    pl.save(f'../capas/v2/{id}-plana.webp',quality=88); marco.save(f'../capas/v2/{id}-marco.webp',quality=90)
    for n in ['firma-fondo','firma-pj','gremory-pj','gremory-obsidiana','gremory-cosmica']:
        L(n).save(f'../art/{id}-{n}.webp',quality=86 if 'pj' not in n else 88)
    inm(id,'base',bf,bp)
    gp=L('gremory-pj').convert('RGBA')
    inm(id,'g1',L('gremory-obsidiana').convert('RGB'),gp); inm(id,'g2',L('gremory-cosmica').convert('RGB'),gp)
    print(id,'ok')
