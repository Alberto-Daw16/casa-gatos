import sys
from PIL import Image
out=sys.argv[1]; cols=int(sys.argv[2]); fs=sys.argv[3:]
ims=[Image.open(f).convert('RGB') for f in fs]
for i in ims: i.thumbnail((380,540))
w=max(i.width for i in ims); h=max(i.height for i in ims); rows=(len(ims)+cols-1)//cols
o=Image.new('RGB',(cols*(w+6),rows*(h+6)),'white')
for k,i in enumerate(ims): o.paste(i,((k%cols)*(w+6),(k//cols)*(h+6)))
o.save(out)
