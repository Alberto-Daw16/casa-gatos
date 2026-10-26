import sys, numpy as np, cv2, onnxruntime as ort
from PIL import Image
from rembg import remove, new_session
SRC={'alberto':'Cartitas1/images/image2.png','cristina':'Cartitas1/images/image5.png','kurama-ex':'Cartitas1/images/image1.png',
     'gyukki-ex':'Cartitas1/images/image3.png','kurama-gyukki-vstar':'Cartitas1/images/image4.png','love-vmax':'Cartitas 2/images/image1.png'}
ARTE={'alberto':[.0306,.1266,.9694,.8675],'cristina':[.0306,.1266,.9694,.8675],'kurama-ex':[.04,.165,.96,.86],'gyukki-ex':[.04,.165,.96,.86],
      'kurama-gyukki-vstar':[.045,.124,.955,.585],'love-vmax':[.035,.118,.965,.695]}
MOD={'love-vmax':'isnet-general-use'}
CAPAS={'alberto','cristina','kurama-gyukki-vstar','love-vmax'}
SOLO={'kurama-ex','gyukki-ex'}
so=ort.SessionOptions(); so.intra_op_num_threads=4
da=ort.InferenceSession('da.onnx',so,providers=['CPUExecutionProvider'])
def prof(img):
    w,h=img.size; S=518*2//14*14
    x=np.array(img.convert('RGB').resize((S,S),Image.BICUBIC)).astype(np.float32)/255
    x=(x-[.485,.456,.406])/[.229,.224,.225]; x=x.transpose(2,0,1)[None].astype(np.float32)
    d=da.run(None,{da.get_inputs()[0].name:x})[0][0]
    d=cv2.resize(d,(w,h),interpolation=cv2.INTER_CUBIC)
    lo,hi=np.percentile(d,1),np.percentile(d,99.5); d=np.clip((d-lo)/(hi-lo),0,1)
    d=cv2.bilateralFilter((d*255).astype(np.uint8),9,40,9)
    return d
ses={}
UMBRAL={'kurama-ex':150,'gyukki-ex':95}
for id in sys.argv[1:]:
    src=Image.open('../cartas/'+SRC[id]).convert('RGB'); Wo,Ho=src.size; a=ARTE[id]
    art=src.crop((round(a[0]*Wo),round(a[1]*Ho),round(a[2]*Wo),round(a[3]*Ho)))
    if id=='kurama-gyukki-vstar':
        A=np.array(art); h,w=A.shape[:2]; mk=np.zeros((h,w),np.uint8); mk[:int(h*.06),:int(w*.06)]=255
        art=Image.fromarray(cv2.cvtColor(cv2.inpaint(cv2.cvtColor(A,cv2.COLOR_RGB2BGR),mk,15,cv2.INPAINT_TELEA),cv2.COLOR_BGR2RGB))
    if id=='love-vmax':
        A=np.array(art); h,w=A.shape[:2]; mk=np.zeros((h,w),np.uint8); mk[:int(h*.075),:int(w*.36)]=255; mk[:int(h*.02),:]=255
        art=Image.fromarray(cv2.cvtColor(cv2.inpaint(cv2.cvtColor(A,cv2.COLOR_RGB2BGR),mk,15,cv2.INPAINT_TELEA),cv2.COLOR_BGR2RGB))
    art.save(f'{id}-arte.webp',quality=86)
    dA=prof(art); Image.fromarray(cv2.dilate(dA,np.ones((7,7),np.uint8))).save(f'{id}-arte-d.webp',quality=82)
    if id in SOLO: print(id,art.size); continue
    if True:
        if id in CAPAS:
            m=MOD.get(id,'isnet-anime'); ses.setdefault(m,new_session(m))
            ch=np.array(remove(art,session=ses[m])); al=ch[:,:,3].astype(float); ch[:,:,3]=np.clip((al-40)*1.4,0,255).astype(np.uint8)
        else:
            ch=np.array(art.convert('RGBA')); t=UMBRAL[id]
            al=np.clip((dA.astype(float)-t)*255/18,0,255)
            al=cv2.GaussianBlur(al,(0,0),1.2); ch[:,:,3]=al.astype(np.uint8)
        # limpia manchitas sueltas: quedarse con componentes grandes
        n,lab,st,_=cv2.connectedComponentsWithStats((ch[:,:,3]>20).astype(np.uint8))
        keep=np.zeros(n,bool); keep[1:]=st[1:,4]>st[1:,4].max()*.04; ch[:,:,3][~keep[lab]]=0
        Image.fromarray(ch).save(f'{id}-pj.webp',quality=88)
        mk=cv2.dilate((ch[:,:,3]>20).astype(np.uint8)*255,np.ones((15,15),np.uint8))
        bg=cv2.cvtColor(cv2.inpaint(cv2.cvtColor(np.array(art),cv2.COLOR_RGB2BGR),mk,9,cv2.INPAINT_TELEA),cv2.COLOR_BGR2RGB)
        Image.fromarray(bg).save(f'{id}-fondo.webp',quality=86)
        dF=prof(Image.fromarray(bg)); Image.fromarray(dF).save(f'{id}-fondo-d.webp',quality=80)
    print(id, art.size, flush=True)
