import re,json,base64
import os
# rutas: este kit vive en gremory-tcg/proyecto/album; las cartas de Codex en gremory-cartas
AQUI=os.path.dirname(os.path.abspath(__file__))
PROY=os.path.dirname(AQUI)+'/'
def _cartas():
    for c in [os.environ.get('GREMORY_CARTAS',''), os.path.expanduser('~/Downloads/gremory-cartas'), os.path.expanduser('~/mnt/Downloads/gremory-cartas'), '/mnt/user-data/uploads/Downloads/gremory-cartas']:
        if c and os.path.isdir(c): return c.rstrip('/')+'/'
    raise SystemExit('No encuentro la carpeta gremory-cartas (pon GREMORY_CARTAS=ruta)')
CARTAS=_cartas()
H=PROY
def du(p):
    t={'png':'image/png','jpg':'image/jpeg','webp':'image/webp','woff2':'font/woff2'}[p.rsplit('.',1)[1]]
    return 'data:'+t+';base64,'+base64.b64encode(open(p,'rb').read()).decode()
s=open(H+'galeria.src.html').read()
ff=open(H+'fuentes/fuentes.css').read()
ff+='\n@font-face{font-family:"Firma";src:url('+du(H+'fuentes/firma.woff2')+') format("woff2");font-display:block}'
css=open(H+'holo.css').read()
css=re.sub(r'url\("tex/([^"]+)"\)', lambda m:'url("'+du(H+'tex/'+m.group(1))+'")', css)
PAW="data:image/svg+xml,"+__import__('urllib.parse').parse.quote("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><ellipse cx='50' cy='68' rx='24' ry='20'/><ellipse cx='21' cy='41' rx='10' ry='13' transform='rotate(-20 21 41)'/><ellipse cx='40' cy='23' rx='10' ry='13' transform='rotate(-8 40 23)'/><ellipse cx='61' cy='23' rx='10' ry='13' transform='rotate(8 61 23)'/><ellipse cx='80' cy='41' rx='10' ry='13' transform='rotate(20 80 41)'/></svg>")
CROWN="data:image/svg+xml,"+__import__('urllib.parse').parse.quote("<svg xmlns='http://www.w3.org/2000/svg' viewBox='10 14 44 36'><path d='M12 24l8 8 12-14 12 14 8-8-4 22H16z'/></svg>")
s=s.replace('/*FUENTES*/',ff).replace('/*HOLO*/',css).replace('@@PAW@@',PAW).replace('@@CROWN@@',CROWN)
s=re.sub(r'url\("tex/([^"]+)"\)', lambda m:'url("'+du(H+'tex/'+m.group(1))+'")', s)
s=s.replace('/*IMGS*/','{}').replace('/*ART*/','{}')
# inmersiva: de momento solo la secreta (capas y mapas de profundidad en album/inm/)
INMD={}
_i=AQUI+'/inm/s01-061-'
if os.path.exists(_i+'pj-d.webp'):
    INMD['s01-061']={'dos':True,'capas':True,'w':1600,'h':2400,'petalos':du(_i+'petalos.webp') if os.path.exists(_i+'petalos.webp') else '','fondo':du(_i+'fondo.webp'),'fondo_d':du(_i+'fondo-d.webp'),'pj':du(_i+'pj.webp'),'pj_d':du(_i+'pj-d.webp')}
_r=AQUI+'/recuerdos/'
if 's01-061' in INMD and os.path.exists(_r+'recuerdos.json'):
    INMD['s01-061']['recuerdos']=[{'src':du(_r+x['f']),'pie':x['pie'],'w':x['w'],'h':x['h']} for x in json.load(open(_r+'recuerdos.json'))]
s=s.replace('/*INMJS*/', open(H+'inmersiva.js').read().replace('/*INM*/',json.dumps(INMD)))
# numeración y versiones
s=s.replace("w.num + '/006'","w.num + '/060'")
s=s.replace("function versiones(id){","function versiones0(id){",1)
s=s.replace("function carta(id, v){","function carta(id, v){\n  if(v === \"CASA\") return cartaCasa(id);",1)
inj=open(AQUI+'/inject.js').read().replace('/*SET1*/',open(AQUI+'/album-data.json').read())
s=s.replace("/* ── interfaz ── */", inj+"\n/* ── interfaz ── */",1)
D=json.load(open(AQUI+'/album-data.json'))
first=[e['id'] for e in D['LISTA'] if e['ok']][0]
s=s.replace('let actual = "alberto", ver = "G1";','let actual = "'+first+'", ver = "R";',1)
old='$("tira").innerHTML = Object.keys(CARTAS).map(id => \'<button data-id="\' + id + \'" class="\' + (id === actual ? \'on\' : \'\') + \'"><img src="\' + IMG[id].arte + \'" alt=""></button>\').join("");'
assert old in s
new='$("tira").innerHTML = D1.LISTA.map(e => e.ok ? \'<button data-id="\' + e.id + \'" title="\' + e.n + " · " + e.t + \'" class="\' + (e.id === actual ? \'on\' : \'\') + \'"><img src="\' + e.th + \'" alt=""><i>\' + e.n + \'</i></button>\' : \'<button class="falta" disabled title="\' + e.n + " · " + e.t + \'"><i>\' + e.n + \'</i></button>\').join("");\n  $("cuenta").textContent = D1.LISTA.filter(e => e.ok && e.n !== "061").length + " de 60 montadas" + (D1.LISTA.some(e => e.ok && e.n === "061") ? " + la secreta" : "");'
s=s.replace(old,new,1)
s=s.replace('$("nombre").innerHTML = \'<b>\' + CARTAS[actual].n + \'</b>','$("nombre").innerHTML = \'<b>\' + actual.slice(4) + \' · \' + CARTAS[actual].n + \'</b>',1)
s=s.replace('<h1>Rarezas · Set 1</h1>','<h1>Gremory · Set 1</h1><div id="cuenta"></div>',1)
s=s.replace('$("bInm").style.display = ver === "G2" ? "" : "none";','$("bInm").style.display = actual === "s01-061" ? "" : "none";',1)
extra='''
#cuenta{font:700 10px/1.4 "Space Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);text-align:center;margin-top:6px}
.tira{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:14px 10px;width:100%;max-width:980px;overflow:visible;padding:4px 16px 40px;box-sizing:border-box}
.tira button{position:relative;width:100%;aspect-ratio:auto;height:auto;border:0;border-radius:0;background:none;overflow:visible;display:flex;flex-direction:column;gap:6px;align-items:stretch;cursor:pointer;transition:transform .15s}
.tira button:hover{transform:translateY(-3px)}
.tira button img{width:100%;height:auto;aspect-ratio:260/368;object-fit:cover;border-radius:7px;box-shadow:0 6px 14px rgba(0,0,0,.45);outline:2px solid transparent;outline-offset:2px}
.tira button.on img{outline-color:var(--acc)}
.tira button i{font:700 10px/1 "Space Mono",monospace;font-style:normal;letter-spacing:.08em;color:var(--dim);text-align:center}
.tira button.on i{color:var(--acc)}
.tira button.falta{cursor:default}
.tira button.falta:hover{transform:none}
.tira button.falta::before{content:"";display:block;width:100%;aspect-ratio:260/368;border-radius:7px;border:1px dashed rgba(255,255,255,.14);background:repeating-linear-gradient(135deg,rgba(255,255,255,.02) 0 6px,rgba(255,255,255,.045) 6px 12px)}
.tira button.falta i{opacity:.5}
.carta.casa{background:#0d0c10}
.carta.casa>.casa-amb{overflow:hidden;border-radius:inherit}
.carta.casa>.casa-amb img{width:100%;height:100%;object-fit:cover;transform:scale(1.2);filter:blur(12px) brightness(.45) saturate(1.1)}
.carta.casa>.casa-ven{inset:auto;left:5%;top:15%;width:90%;height:60%;overflow:hidden;border-radius:2.2cqw;border:1px solid rgba(232,211,138,.55);box-shadow:0 1.2cqw 3cqw rgba(0,0,0,.55)}
.carta.casa>.casa-ven img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:translate(calc((var(--mx) - .5) * -1.2%),calc((var(--my) - .5) * -1.2%)) scale(1.03)}
.carta.casa>.casa-cab{inset:auto;height:auto;width:auto;position:absolute;left:5%;right:5%;top:3.4%;display:flex;flex-direction:column;gap:.6cqw;padding:2.2cqw 3.6cqw;background:rgba(10,10,14,.6);border:1px solid rgba(232,211,138,.4);border-radius:2.2cqw;z-index:3}
.casa-cab em{font:700 2.4cqw/1 "Space Mono",monospace;letter-spacing:.22em;text-transform:uppercase;color:#e8d38a;font-style:normal}
.casa-cab b{font:400 8.4cqw/1 "Instrument Serif",Georgia,serif;color:#fff}
.carta.casa>.casa-panel{inset:auto;height:auto;width:auto;position:absolute;left:5%;right:5%;top:77.5%;bottom:3.2%;display:flex;flex-direction:column;box-sizing:border-box;padding:3.4cqw 4cqw 2.6cqw;background:rgba(10,10,14,.8);border:1px solid rgba(232,211,138,.4);border-radius:2.6cqw;color:#eceef3;font:3.2cqw/1.38 system-ui,sans-serif;z-index:3}
.casa-ef{margin:0}.casa-ef b{color:#e8d38a}
.casa-lore{margin:1.6cqw 0 0;font-style:italic;opacity:.7}
.casa-pie{margin-top:auto!important;display:flex;justify-content:space-between;margin-top:2.2cqw;font:700 2cqw/1 "Space Mono",monospace;letter-spacing:.12em;text-transform:uppercase;opacity:.55}
'''
s=s.replace('</style>',extra+'</style>',1)
import sys; sys.path.insert(0,AQUI)
from aplica_binder import aplica
s=aplica(s, H+'tex/logo-g.png')   # el binder: dos hojas 3x3, pasar página, un binder para cada uno
open(CARTAS+'album-set1.html','w').write(s)
print(len(s)/1e6,'MB')
