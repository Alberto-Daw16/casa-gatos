import sys, numpy as np, cv2
from PIL import Image, ImageDraw
from rembg import remove, new_session
SRC={'alberto':'Cartitas1/images/image2.png','cristina':'Cartitas1/images/image5.png','kurama-ex':'Cartitas1/images/image1.png',
     'gyukki-ex':'Cartitas1/images/image3.png','kurama-gyukki-vstar':'Cartitas1/images/image4.png','love-vmax':'Cartitas 2/images/image1.png'}
ARTE={'alberto':[.0306,.1266,.9694,.8675],'cristina':[.0306,.1266,.9694,.8675],'kurama-ex':[.02,.20,.98,.84],'gyukki-ex':[.02,.20,.98,.84],
      'kurama-gyukki-vstar':[.035,.095,.965,.585],'love-vmax':[.035,.118,.965,.695]}
MOD={'love-vmax':'isnet-general-use'}
W,H=720,1019
ses={}
for id in sys.argv[1:]:
    src=Image.open('../cartas/'+SRC[id]).convert('RGB'); card=src.resize((W,H),Image.LANCZOS)
    a=ARTE[id]; bx=(round(a[0]*W),round(a[1]*H),round(a[2]*W),round(a[3]*H))
    Wo,Ho=src.size; art_o=src.crop((round(a[0]*Wo),round(a[1]*Ho),round(a[2]*Wo),round(a[3]*Ho)))
    m=MOD.get(id,'isnet-anime'); ses.setdefault(m,new_session(m))
    ch=remove(art_o,session=ses[m]).resize((bx[2]-bx[0],bx[3]-bx[1]),Image.LANCZOS)
    chA=np.array(ch); al=chA[:,:,3].astype(float); chA[:,:,3]=np.clip((al-40)*1.4,0,255).astype(np.uint8)
    Image.fromarray(chA).save(f'../capas/v/{id}-pj.webp',quality=90)
    art=np.array(card.crop(bx)); mk=cv2.dilate((chA[:,:,3]>20).astype(np.uint8)*255,np.ones((9,9),np.uint8))
    bg=cv2.cvtColor(cv2.inpaint(cv2.cvtColor(art,cv2.COLOR_RGB2BGR),mk,7,cv2.INPAINT_TELEA),cv2.COLOR_BGR2RGB)
    Image.fromarray(bg).save(f'../capas/v/{id}-fondo.webp',quality=88)
    d=np.array(card.convert('RGBA')); d[bx[1]:bx[3],bx[0]:bx[2],3]=0
    rr=Image.new('L',(W,H),0); ImageDraw.Draw(rr).rounded_rectangle((0,0,W-1,H-1),radius=int(W*.037),fill=255)
    d[:,:,3]=np.minimum(d[:,:,3],np.array(rr)); Image.fromarray(d).save(f'../capas/v/{id}-marco.webp',quality=90)
    c2=np.array(card.convert('RGBA')); c2[:,:,3]=np.array(rr); Image.fromarray(c2).save(f'../capas/v/{id}-plana.webp',quality=88)
    # vista de control
    v=Image.new('RGB',(W*2,H),(0,140,100)); v.paste(card,(0,0)); p=Image.fromarray(chA); g=Image.new('RGBA',p.size,(0,140,100,255)); g.alpha_composite(p); v.paste(g.convert('RGB'),(W+bx[0],bx[1]))
    v.resize((W//2*2//2,H//2)).save(f'../t/corte-{id}.png')
    print(id, bx, m)
