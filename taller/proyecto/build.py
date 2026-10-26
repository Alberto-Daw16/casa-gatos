import re, base64, json, mimetypes, os
B=os.path.dirname(os.path.abspath(__file__)); os.chdir(B)
def du(p):
    t={'png':'image/png','jpg':'image/jpeg','webp':'image/webp','woff2':'font/woff2'}[p.rsplit('.',1)[1]]
    return 'data:'+t+';base64,'+base64.b64encode(open(p,'rb').read()).decode()
ff=open('fuentes/fuentes.css').read()
ff+='\n@font-face{font-family:"Firma";src:url('+du('fuentes/firma.woff2')+') format("woff2");font-display:block}'
css=open('holo.css').read()
css=re.sub(r'url\("tex/([^"]+)"\)', lambda m:'url("'+du('tex/'+m.group(1))+'")', css)
from PIL import Image as _I
imgs={}
for id in ['alberto','cristina','kurama-ex','gyukki-ex','kurama-gyukki-vstar','love-vmax']:
    import os
    imgs[id]={k:du((f'capas/v2/{id}-{k}.webp' if os.path.exists(f'capas/v2/{id}-{k}.webp') else f'capas/v/{id}-{k}.webp')) for k in ['plana','fondo','pj','marco']}
    _p=_I.open(f'capas/v2/{id}-pj.webp' if os.path.exists(f'capas/v2/{id}-pj.webp') else f'capas/v/{id}-pj.webp')
    _a=_p.getchannel('A').point(lambda x:255 if x>40 else 0); _bb=_a.getbbox() or (0,0,_p.width,_p.height)
    imgs[id]['bb']=[_bb[0]/_p.width,_bb[1]/_p.height,_bb[2]/_p.width,_bb[3]/_p.height]; imgs[id]['asp']=_p.width/_p.height
    imgs[id]['arte']=du(f'capas/v2/{id}-arte.webp' if os.path.exists(f'capas/v2/{id}-arte.webp') else f'inm/{id}-arte.webp')
PAW="data:image/svg+xml,"+__import__('urllib.parse').parse.quote("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><ellipse cx='50' cy='68' rx='24' ry='20'/><ellipse cx='21' cy='41' rx='10' ry='13' transform='rotate(-20 21 41)'/><ellipse cx='40' cy='23' rx='10' ry='13' transform='rotate(-8 40 23)'/><ellipse cx='61' cy='23' rx='10' ry='13' transform='rotate(8 61 23)'/><ellipse cx='80' cy='41' rx='10' ry='13' transform='rotate(20 80 41)'/></svg>")
CROWN="data:image/svg+xml,"+__import__('urllib.parse').parse.quote("<svg xmlns='http://www.w3.org/2000/svg' viewBox='10 14 44 36'><path d='M12 24l8 8 12-14 12 14 8-8-4 22H16z'/></svg>")
s=open('galeria.src.html').read()
s=s.replace('/*FUENTES*/',ff).replace('/*HOLO*/',css).replace('/*IMGS*/',json.dumps(imgs)).replace('@@PAW@@',PAW).replace('@@CROWN@@',CROWN)
s=re.sub(r'url\("tex/([^"]+)"\)', lambda m:'url("'+du('tex/'+m.group(1))+'")', s)  # PAGE_TEX
from PIL import Image as _I
inm={}
for id in ['alberto','cristina','kurama-ex','gyukki-ex','kurama-gyukki-vstar','love-vmax']:
    P='inm/'+id
    dos=id not in ('kurama-ex','gyukki-ex'); w,h=_I.open(P+'-arte.webp').size
    inm[id]={'dos':dos,'w':w,'h':h}
    if dos: inm[id].update(fondo=du(P+'-fondo.webp'),fondo_d=du(P+'-fondo-d.webp'),pj=du(P+'-pj.webp'),pj_d=du(P+'-arte-d.webp'))
    else: inm[id].update(arte=du(P+'-arte.webp'),arte_d=du(P+'-arte-d.webp'))
art={}
for id in ['alberto','cristina','kurama-ex','gyukki-ex','kurama-gyukki-vstar','love-vmax']:
    A='art/'+id
    art[id]={}
    for tpl,nom in [('est','estandar'),('full','grabada'),('esc','escapada'),('oro','oro'),('firma','firmada')]:
        if os.path.exists(A+f'-{nom}-fondo.webp'):
            art[id][tpl]={'fondo':du(A+f'-{nom}-fondo.webp')}
            if os.path.exists(A+f'-{nom}-pj.webp'):
                art[id][tpl]['pj']=du(A+f'-{nom}-pj.webp')
                _p=_I.open(A+f'-{nom}-pj.webp'); _bb=_p.getchannel('A').point(lambda x:255 if x>40 else 0).getbbox()
                art[id][tpl]['bb']=[_bb[0]/_p.width,_bb[1]/_p.height,_bb[2]/_p.width,_bb[3]/_p.height]; art[id][tpl]['asp']=_p.width/_p.height
    if os.path.exists(A+'-firma-fondo.webp'):
        art[id].update({'firma':{'fondo':du(A+'-firma-fondo.webp'),'pj':du(A+'-firma-pj.webp')},
                 'gre':{'pj':du(A+'-gremory-pj.webp'),'g1':du(A+'-gremory-obsidiana.webp'),'g2':du(A+'-gremory-cosmica.webp')}})
    V='inm/v/'+id
    if os.path.exists(V+'-base-fondo.webp'):
        inm[id]['v']={}
        for g in ['base','g1','g2']:
            w,h=_I.open(V+f'-{g}-fondo.webp').size
            inm[id]['v'][g]={'dos':True,'w':w,'h':h,'fondo':du(V+f'-{g}-fondo.webp'),'fondo_d':du(V+f'-{g}-fondo-d.webp'),'pj':du(V+f'-{g}-pj.webp'),'pj_d':du(V+f'-{g}-pj-d.webp')}
            if g=='g2' and os.path.exists(A+'-inmersiva.mp4'):
                inm[id]['v'][g]['video']='data:video/mp4;base64,'+base64.b64encode(open(A+'-inmersiva.mp4','rb').read()).decode()
                if os.path.exists(A+'-inmersiva.json'): inm[id]['v'][g].update(json.load(open(A+'-inmersiva.json')))
                if os.path.exists(A+'-inmersiva.mp3'): inm[id]['v'][g]['audio']='data:audio/mpeg;base64,'+base64.b64encode(open(A+'-inmersiva.mp3','rb').read()).decode()
for id in inm:
    if 'v' in inm[id]: inm[id]={**inm[id]['v']['base'],'v':inm[id]['v']}
s=s.replace('/*ART*/',json.dumps(art))
s=s.replace('/*INMJS*/',open('inmersiva.js').read().replace('/*INM*/',json.dumps(inm)))
open('../rarezas-gremory.html','w').write(s); print(len(s)/1e6,'MB')
