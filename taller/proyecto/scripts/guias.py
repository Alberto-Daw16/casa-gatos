from PIL import Image, ImageDraw, ImageFont
F=lambda s: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', s)
def base(w,h,titulo,sub):
    im=Image.new('RGBA',(w,h),(34,38,48,255)); d=ImageDraw.Draw(im)
    for x in range(0,w,64): d.line([(x,0),(x,h)],fill=(52,57,70),width=1)
    for y in range(0,h,64): d.line([(0,y),(w,y)],fill=(52,57,70),width=1)
    return im
def zona(im,box,col,txt,al=90):
    w,h=im.size; ov=Image.new('RGBA',im.size,(0,0,0,0)); d=ImageDraw.Draw(ov)
    x0,y0,x1,y1=[box[0]*w,box[1]*h,box[2]*w,box[3]*h]
    d.rectangle([x0,y0,x1,y1],fill=col+(al,),outline=col+(255,),width=5)
    im.alpha_composite(ov); d=ImageDraw.Draw(im)
    y=y0+18
    for i,l in enumerate(txt.split('\n')):
        f=F(38 if i==0 else 28); d.text((x0+22,y),l,fill=(255,255,255),font=f); y+= 48 if i==0 else 38
def cab(im,t,s):
    d=ImageDraw.Draw(im); w,h=im.size
    d.rectangle([0,h-120,w,h],fill=(14,17,24,235)); d.text((24,h-108),t,fill=(201,242,74),font=F(40)); d.text((24,h-56),s,fill=(220,222,228),font=F(21))
ROJO=(220,60,60); VERDE=(60,190,110); AMA=(235,190,40); AZUL=(70,140,240)
# 1 · Estándar 3:2
im=base(1536,1024,'','')
zona(im,(.30,.08,.70,.62),VERDE,'CARA Y TORSO AQUÍ\nplano medio, personaje centrado o en un tercio')
zona(im,(0,0,1,.03),ROJO,'',120); zona(im,(0,.97,1,1),ROJO,'',120)
cab(im,'ESTÁNDAR · Destello / Reverso / Doble brillo','3:2 · 1536×1024 · fondo y personaje del MISMO tamaño y alineados · no hay texto encima')
im.save('guia-1-estandar-1536x1024.png')
# 2 · Grabada 2:3
im=base(1024,1536,'','')
zona(im,(0,0,1,.10),ROJO,'NOMBRE Y AURA ENCIMA\nsolo cielo / fondo')
zona(im,(.12,.11,.88,.57),VERDE,'CARA Y CUERPO AQUÍ\ncabeza a partir del 11%')
zona(im,(0,.595,1,1),ROJO,'PANEL DE TEXTO (cristal)\nse ve borroso y oscuro:\npiernas, suelo, fondo')
cab(im,'GRABADA · a sangre','2:3 · 1024×1536 · fondo y personaje del mismo tamaño y alineados')
im.save('guia-2-grabada-1024x1536.png')
# 3 · Escapada: personaje 1:1
im=base(1024,1024,'','')
zona(im,(0,0,1,.175),ROJO,'VACÍO · queda bajo el nombre, no se ve')
zona(im,(0,.175,1,.333),AMA,'ZONA DE ESCAPE\nsolo cabeza, pelo, orejas o cola')
zona(im,(0,.333,1,1),VERDE,'DENTRO DEL HUECO\naquí detrás va el fondo 3:2\nel cuerpo puede cortarse en el borde de abajo')
cab(im,'ESCAPADA · personaje','1:1 · 1024×1024 · fondo transparente · nada toca los bordes laterales ni el de arriba')
im.save('guia-3-escapada-pj-1024x1024.png')
im=base(1536,1024,'','')
zona(im,(0,0,1,1),VERDE,'SOLO ESCENARIO\nel personaje de la guía 3 va encima,\nsaliendo por arriba',60)
cab(im,'ESCAPADA · fondo','3:2 · 1536×1024 · sin personajes')
im.save('guia-3-escapada-fondo-1536x1024.png')
# 4 · Firmada / Oro 2:3
for n,t in [('4-firmada','FIRMADA'),('5-oro','ORO (el fondo se pasa a oro, el personaje queda a color)')]:
    im=base(1024,1536,'','')
    zona(im,(0,0,.2,.15),ROJO,'NIVEL\nY COSTE')
    zona(im,(.3,.52,.95,.70),AZUL,'FIRMA DORADA\nzona oscura y tranquila\n(ropa, sombra)')
    zona(im,(0,.828,1,1),ROJO,'BANDA: poder, nombre, rasgos\npuede haber cuerpo, sin cara ni manos')
    zona(im,(.15,.1,.85,.5),VERDE,'CARA AQUÍ',60)
    cab(im,t,'2:3 · 1024×1536 · fondo y personaje del mismo tamaño y alineados')
    im.save(f'guia-{n}-1024x1536.png')
# 6 · Gremory 9:16
im=base(1024,1820,'','')
zona(im,(.3,0,.7,.1),ROJO,'LOGO G')
zona(im,(0,0,.22,.14),ROJO,'NIVEL')
zona(im,(.1,.1,.9,.78),VERDE,'PERSONAJE ENTERO\nentre el logo y la banda')
zona(im,(0,.8,1,.95),ROJO,'BANDA DEL NOMBRE\npies y suelo')
cab(im,'GREMORY · personaje + 2 fondos','9:16 · 1024×1820 · el mismo personaje sirve para Obsidiana y Cósmica')
im.save('guia-6-gremory-1024x1820.png')
