import re,json,base64,os,io
from PIL import Image
import os
# rutas: este kit vive en gremory-tcg/proyecto/album; las cartas de Codex en gremory-cartas
AQUI=os.path.dirname(os.path.abspath(__file__))
PROY=os.path.dirname(AQUI)+'/'
def _cartas():
    for c in [os.environ.get('GREMORY_CARTAS',''), os.path.expanduser('~/Downloads/gremory-cartas'), os.path.expanduser('~/mnt/Downloads/gremory-cartas'), '/mnt/user-data/uploads/Downloads/gremory-cartas']:
        if c and os.path.isdir(c): return c.rstrip('/')+'/'
    raise SystemExit('No encuentro la carpeta gremory-cartas (pon GREMORY_CARTAS=ruta)')
CARTAS=_cartas()
W=CARTAS+'reviews/s01/web/'
MAN=json.load(open(W+'manifest.json'))
SET=json.load(open(AQUI+'/set1.json'))
TX=json.load(open(AQUI+'/textos.json')) if os.path.exists(AQUI+'/textos.json') else {}
def du(p):
    t={'png':'image/png','jpg':'image/jpeg','webp':'image/webp','woff2':'font/woff2'}[p.rsplit('.',1)[1]]
    return 'data:'+t+';base64,'+base64.b64encode(open(p,'rb').read()).decode()
def thumb(paths):
    b=None
    for p in paths:
        im=Image.open(W+p).convert('RGBA')
        if b is None: b=im
        else: b.alpha_composite(im.resize(b.size))
    b=b.convert('RGB'); r=min(1,240/b.height); b=b.resize((round(b.width*r),round(b.height*r)))
    # recorte vertical tipo carta
    tw=round(b.height*720/1019)
    if b.width>tw: x=(b.width-tw)//2; b=b.crop((x,0,x+tw,b.height))
    o=io.BytesIO(); b.save(o,'WEBP',quality=70); return 'data:image/webp;base64,'+base64.b64encode(o.getvalue()).decode()
F=CARTAS+'final/s01/'
import os
# encuadre a medida: zoom (z) y punto de la imagen (cx,cy) llevado a (tx,ty) de la zona visible
ENC={'005':{'ty':-.06},'006':{'ty':-.19}}  # ajustes de encuadre de la selección aprobada (14/10/2026); p. ej. '002':{'z':1.55,'cx':.53,'cy':.34,'tx':.5,'ty':.2} si un personaje sale diminuto
def duhi(name):
    # si hay zoom, la imagen original a tamaño completo para que no se vea borrosa
    p=F+name.replace('.webp','.png')
    if not os.path.exists(p): return du(W+name)
    o=io.BytesIO(); Image.open(p).save(o,'WEBP',quality=84); return 'data:image/webp;base64,'+base64.b64encode(o.getvalue()).decode()

# NOMBRES=1: para la app. En vez de meter las imágenes, deja su nombre («IMG:fichero.webp»); la app las pide al Worker
NOMBRES=os.environ.get('NOMBRES')=='1'
if NOMBRES:
    du=lambda p: 'IMG:'+os.path.basename(p)
    duhi=lambda name: 'IMG:'+name
    thumb=lambda paths: None
TH=AQUI+'/th/'
NOM={'alberto':'Alberto','cristina':'Cristina','kurama':'Kurama','sukuna':'Sukuna','gyukki':'Gyukki'}
EL={'alberto':'agua','cristina':'hada','kurama':'fuego','sukuna':'siniestro','gyukki':'psiquico'}
COL={'agua':'#3b82f6','hada':'#ec4899','fuego':'#f97316','siniestro':'#b91c1c','psiquico':'#8b5cf6','dragon':'#c9a227'}
RASGO={'alberto':['Gremory','Casa'],'cristina':['Gremory','Casa'],'kurama':['Gato','Naranja'],'sukuna':['Gato','Maine Coon'],'gyukki':['Gato','Siamesa']}
KEY={'Estándar':('estandar','est'),'Grabada':('grabada','full'),'Escapada':('escapada','esc'),'Firmada':('firmada','firma'),'Oro':('oro','oro'),'Gremory':('gremory','gre')}
CASA={
'049':('Objeto','Limpieza a fondo','Baraja tu pila de descarte en tu mazo. Cada 15 días, obligatorio.','Cada 15 días, jumpscare.'),
'050':('Objeto','Fuera bolas de pelo','Un gato recupera 30 de aura. Lo odia, pero funciona.','La odian. Se la comen. Contradicciones felinas.'),
'051':('Objeto','Sesión de cepillado','Quita un estado alterado a un gato. Con el pelo que sale, se teje otro.','Cepillar a Sukuna desbloquea un gato extra.'),
'052':('Lugar','El sitio bueno','Mientras esté en juego, los gatos no se pueden mover. Los humanos, tampoco.','Tres plazas. Cinco ocupantes. Ninguna queja.'),
'053':('Lugar','Pasa un avión','Cada vez que pasa un avión, cada jugador roba 1 carta.','Cerámica, sol y un avión cada cinco minutos.'),
'054':('Objeto','La corona','Únela a Sukuna: gana 50 de aura y nadie se ríe. En voz alta.','No es una sartén. Es una corona.'),
'055':('Objeto','El trono','El gato que está aquí no puede ser atacado por gatos más pequeños. O sea, a Sukuna nunca.','Lo compraron para todos. Es de uno.'),
'056':('Objeto','Hora de comer','Todos tus gatos pasan al puesto activo. Gyukki, la primera.','El único sitio de la casa con cola.'),
'057':('Lugar','Territorio prohibido','Los gatos que suban aquí vuelven a tu mano. Kurama vuelve a subir.','Prohibido. Teóricamente.'),
'058':('Lugar','Turno de noche','Roba 2 cartas. Este turno no puedes dormir.','Aquí se programa, y debajo duerme un Maine Coon.'),
'059':('Objeto','Abre un sobre','Mira las 5 primeras cartas de tu mazo y quédate una.','Siempre queda uno más por abrir.'),
'060':('Lugar','Con bocata','Mientras Cristina esté en juego, roba 1 carta más cada turno. Con bocata de calamares, 2.','La otra casa.')}
BASE={
 'sukuna':dict(nom="Sukuna", forma="NOVA", clase="Familiar", el=["siniestro"], aura=220,
   hab=["Rey de la casa","Si tiene una sartén unida, el rival no puede retirarse. Nadie se atreve a decírselo."],
   atq=[["siniestro","siniestro","comodin"],"Peso pesado","160","Si está durmiendo en una postura imposible, este ataque no se puede evitar."],
   deb=["hada","×2"], agu=["psiquico","−30"], siesta=4, lore="El más grande de la casa. Y lo sabe.")}
out=dict(CARTAS={},FICHA={},WS={},WSELLO={},GSELLO={},ART={},IMG={},SETT={},BASEF={},LISTA=[])
files=set(MAN)
for n in sorted(SET):
    c=SET[n]; id='s01-'+n
    entry={'id':id,'n':n,'ok':False,'t':''}
    if c.get('casa'):
        f=f's01-{n}-casa.webp'
        entry['t']=c['que']
        if f in files:
            cl,hn,ht,lore=CASA[n]
            out['ART'][id]={'casa':du(W+f)}; out['SETT'][id]='Casa'
            out['CARTAS'][id]={'n':c['que'],'tipo':'trainer','sub':'item','arte':[0,0,1,1],'capas':True,'sello':[]}
            out['FICHA'][id]={'nom':c['que'],'clase':cl,'hab':[ht and hn,ht],'lore':lore,'el':['comodin']}
            out['WS'][id]={'num':n}
            entry.update(ok=True,th=thumb([f]))
            if os.path.exists(TH+n+'.webp'): entry['th']=du(TH+n+'.webp')
        out['LISTA'].append(entry); continue
    if n=='061':
        # la secreta: Love of My Life, ilustrada como Grabada (a sangre)
        c=dict(c, tipo='Grabada', quien='alberto + cristina')
    quien=[q.strip() for q in c['quien'].split('+')]
    if c['quien']=='los cinco': quien=['alberto','cristina','kurama','sukuna','gyukki']
    tipo=c['tipo']; suf,key=KEY.get(tipo,('estandar','est'))
    grupo=len(quien)>1
    pref=f"s01-{n}-{'-'.join(quien) if c['quien']!='los cinco' else 'familia'}-{suf}"
    nombre=('Los tres gatos' if len(quien)==3 else ' & '.join(NOM[q] for q in quien)) if c['quien']!='los cinco' else 'La familia'
    if n=='061': nombre='Love of My Life'
    entry['t']=nombre+' · '+tipo
    if key=='gre': need=[pref+'-pj.webp',pref+'-obsidiana.webp',pref+'-cosmica.webp']
    else: need=[pref+'-fondo.webp',pref+'-pj.webp']
    if not all(x in files for x in need): out['LISTA'].append(entry); continue
    if key=='gre':
        pj=MAN[need[0]]; art={'gre':{'pj':du(W+need[0]),'g1':du(W+need[1]),'g2':du(W+need[2]),'bb':pj.get('bb',[0,0,1,1]),'asp':pj['w']/pj['h']}}; th=[need[2],need[0]]
        if n in ENC: art['gre']['enc']=ENC[n]
    else:
        pj=MAN[need[1]]; D_=duhi if n in ENC else (lambda x: du(W+x))
        art={key:{'fondo':D_(need[0]),'pj':D_(need[1]),'bb':pj.get('bb',[0,0,1,1]),'asp':pj['w']/pj['h']}}; th=need
        if n in ENC: art[key]['enc']=ENC[n]
    if key=='gre' and all(f'{pref}-plana-{k}.webp' in files for k in ('g1','g2')):
        art['plana']={k:du(W+f'{pref}-plana-{k}.webp') for k in ('g1','g2')}  # carta entera ya montada (Cristina y Mimikyu, 22/10)
    out['ART'][id]=art
    out['SETT'][id]=tipo
    humano=all(q in('alberto','cristina') for q in quien)
    el=['dragon'] if grupo else [EL[quien[0]]]
    titulo=re.split(r'[:.]',c['esc'])[0].split(', ')[0]
    out['CARTAS'][id]={'n':nombre,'tipo':'trainer' if humano else 'pokémon','sub':'supporter' if humano else ('vstar' if grupo else 'stage 2 ex'),'arte':[.0306,.1266,.9694,.8675],'capas':True,
        'sello':[{'t':'firma','q':q,'x':.36,'y':.62,'s':52,'rot':-9} for q in quien if q in('alberto','cristina')][:1] or [{'t':'huella','x':.07,'y':.64,'s':15,'rot':-14}]}
    if grupo and n!='061': out['CARTAS'][id]['bond']=[COL[EL[q]] for q in quien]
    out['FICHA'][id]={'base':('grupo' if grupo else quien[0]),'nom':nombre,'el':el,'info':f'Nº{n} · {titulo}','forma':'BOND' if grupo else ''}
    if n in TX:
        t=dict(TX[n]); t['info']=f'Nº{n} · '+t['info'] if 'info' in t else out['FICHA'][id]['info']; out['FICHA'][id]['tx']=t
    out['WS'][id]={'nv':3 if humano else 2,'coste':2 if humano else 1,'poder':'9500' if humano else '7000','color':COL[el[0]],'rasgos':(['Familia','Casa'] if grupo else RASGO[quien[0]]),'num':n}
    if n in TX and 'rasgos' in TX[n]: out['WS'][id]['rasgos']=TX[n]['rasgos']
    if n in TX and 'frase' in TX[n]: out['WS'][id]['frase']=TX[n]['frase']
    if key=='firma':
        PATA={'024':(.36,.47,44,-6),'031':(.44,.52,44,-4),'038':(.40,.48,44,-8)}
        px,py,ps,pr=PATA.get(n,(.52,.52,40,-10))
        FPOS={'004':(.49,.70,42,-9)}
        fx,fy,fs,fr=FPOS.get(n,(.30,.52,58,-8))
        out['WSELLO'][id]=[{'t':'firma','q':quien[0],'x':fx,'y':fy,'s':fs,'rot':fr}] if humano else [{'t':'pata','n':NOM[quien[0]],'x':px,'y':py,'s':ps,'rot':pr}]
    if key=='gre' and humano and n!='006': out['GSELLO'][id]=[{'t':'firma','q':quien[0],'x':.38,'y':.6,'s':50,'rot':-9}]
    entry.update(ok=True,th=thumb(th))
    if os.path.exists(TH+n+'.webp'): entry['th']=du(TH+n+'.webp')
    out['LISTA'].append(entry)
out['BASEF']=BASE
if NOMBRES:
    for e in out['LISTA']:
        if e.get('ok'): e['th']='IMG:s01-th-'+e['n']+'.webp'
json.dump(out,open(AQUI+('/album-data-app.json' if NOMBRES else '/album-data.json'),'w'))
print(sum(e['ok'] for e in out['LISTA']),'montables de',len(out['LISTA']))
