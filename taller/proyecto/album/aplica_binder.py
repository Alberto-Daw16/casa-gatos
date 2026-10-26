# mete el binder (binder.css + binder.js) en un album-set1.html ya montado
import sys,base64,os
AQUI=os.path.dirname(os.path.abspath(__file__))
def aplica(s, logo_png):
    css=open(AQUI+'/binder.css').read()
    logo='data:image/png;base64,'+base64.b64encode(open(logo_png,'rb').read()).decode()
    css=':root{--logoG:url("'+logo+'")}\n'+css
    s=s.replace('</style>',css+'</style>',1)
    js=open(AQUI+'/binder.js').read()
    i=s.rindex('</body>')
    return s[:i]+'<script>\n'+js+'\n</script>\n'+s[i:]
if __name__=='__main__':
    src,dst,logo=sys.argv[1:4]
    open(dst,'w').write(aplica(open(src).read(),logo))
