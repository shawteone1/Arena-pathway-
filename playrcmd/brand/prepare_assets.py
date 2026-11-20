"""Deterministic crops/exports of the approved photograph. No artwork generation/recoloring."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from collections import deque
import hashlib,json
ROOT=Path(__file__).resolve().parent;MASTER=ROOT/'masters/682F7A0C-FD73-4B7B-8519-BF5BC67AC602.jpeg';OUT=ROOT.parent/'public/brand/soccer';DOC=ROOT.parent/'docs/approved-logo'
OUT.mkdir(parents=True,exist_ok=True);DOC.mkdir(parents=True,exist_ok=True)
im=Image.open(MASTER).convert('RGB');w,h=im.size;assert (w,h)==(1280,853)
# Preserve the entire approved soccer-ball interior, including white panels and seams.
protect=Image.new('1',im.size);ImageDraw.Draw(protect).ellipse((366,46,909,595),fill=1)
protected=protect.load();pixels=im.load();eligible=bytearray(w*h)
for y in range(h):
 for x in range(w):
  color=pixels[x,y];eligible[y*w+x]=int(not protected[x,y] and min(color)>=232 and max(color)-min(color)<=20)
visited=bytearray(w*h);q=deque()
def add(x,y):
 i=y*w+x
 if eligible[i] and not visited[i]:visited[i]=1;q.append((x,y))
for x in range(w):add(x,0);add(x,h-1)
for y in range(h):add(0,y);add(w-1,y)
while q:
 x,y=q.popleft()
 for nx,ny in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
  if 0<=nx<w and 0<=ny<h:add(nx,ny)
rgba=im.convert('RGBA');rgba.putalpha(Image.frombytes('L',im.size,bytes(0 if v else 255 for v in visited)))
full_box=(294,34,984,819);emblem_box=(350,32,926,608)
full=rgba.crop(full_box);emblem=rgba.crop(emblem_box)
# The full wordmark begins just below the ball; exclude its top pixels from the emblem crop.
ImageDraw.Draw(emblem).rectangle((0,597-emblem_box[1],emblem.width,emblem.height),fill=(0,0,0,0))
full.save(OUT/'full-transparent.png',optimize=True)
full.save(OUT/'full-transparent.webp',lossless=True,method=6,exact=True)
# Opaque original-background fallback retains the photograph's original whites.
im.crop(full_box).save(OUT/'full-original-background.webp',lossless=True,method=6)
for name,picture in [('full',full),('emblem',emblem)]:
 for width in ([192,384] if name=='full' else [64,128,256,576]):
  size=(width,round(width*picture.height/picture.width));small=picture.resize(size,Image.Resampling.LANCZOS)
  small.save(OUT/f'{name}-{width}.webp',lossless=True,method=6,exact=True)
  if name=='emblem':small.save(OUT/f'{name}-{width}.png',optimize=True)
for size in [16,32,48,64,180]:emblem.resize((size,size),Image.Resampling.LANCZOS).save(OUT/f'icon-{size}.png',optimize=True)
emblem.resize((64,64),Image.Resampling.LANCZOS).save(OUT/'favicon.ico',sizes=[(16,16),(32,32),(48,48),(64,64)])
manifest={'approved_source_name':MASTER.name,'received_attachment_name':'1-Photo-1.jpg','master_sha256':hashlib.sha256(MASTER.read_bytes()).hexdigest(),'master_dimensions':[w,h],'full_crop':full_box,'emblem_crop':emblem_box,'method':'Edge-connected near-white background removal only; entire ball interior protected; enclosed white counters retained. No redraw, recoloring or generative edit.','active_variant':'soccer','assets':{p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(OUT.iterdir()) if p.is_file()}}
(ROOT/'asset-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
# Explicitly labeled asset proof, not a screenshot of the website.
board=Image.new('RGB',(1600,1100),'#e9eef2');draw=ImageDraw.Draw(board)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',24);smallfont=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',17)
draw.text((45,28),'APPROVED PLAYRCMD ASSET PROOF — NOT A WEBSITE SCREENSHOT',font=font,fill='#102a43')
for x,bg,label in [(40,'#ffffff','Light background'),(820,'#102331','Dark background')]:
 draw.rounded_rectangle((x,95,x+740,1000),16,fill=bg)
 draw.text((x+28,119),label,font=font,fill='#102a43' if x==40 else '#ffffff')
 p=full.copy();p.thumbnail((410,550),Image.Resampling.LANCZOS);
 if x==820:draw.rounded_rectangle((x+145,168,x+595,746),8,fill='white')
 board.paste(p,(x+165,182),p)
 p=emblem.resize((180,180),Image.Resampling.LANCZOS);board.paste(p,(x+278,760),p)
draw.text((45,1040),'Complete approved artwork + proportional ball crop. White interior panels and counters stay opaque.',font=smallfont,fill='#102a43')
board.save(DOC/'asset-proof.png')
print('Prepared approved-image exports and proof. Master SHA256:',manifest['master_sha256'])
