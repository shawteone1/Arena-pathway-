from pathlib import Path
from PIL import Image,ImageDraw
import hashlib,json
r=Path(__file__).resolve().parent;manifest=json.loads((r/'asset-manifest.json').read_text());master=r/'masters'/manifest['approved_source_name'];assets=r.parent/'public/brand/soccer'
assert hashlib.sha256(master.read_bytes()).hexdigest()==manifest['master_sha256']=='5ae1a3292deb5b6a9a81a07a472360a91f2194649bd31c602b089c8f5c5195d3'
im=Image.open(master).convert('RGB');box=manifest['full_crop'];full=Image.open(assets/'full-transparent.png').convert('RGBA');assert full.size==(690,785)
source=im.crop(box);assert full.convert('RGB').tobytes()==source.tobytes(),'approved RGB artwork must not be repainted'
assert full.getchannel('A').getextrema()==(0,255)
mask=Image.new('1',im.size);ImageDraw.Draw(mask).ellipse((366,46,909,595),fill=1);protected=mask.crop(box)
fp,pp=full.load(),protected.load()
for y in range(full.height):
 for x in range(full.width):
  if pp[x,y]:assert fp[x,y][3]==255,'white panels/PR negative space must remain opaque'
# Original white counters in the lower wordmark must not become holes.
for x,y in [(394,640),(775,784)]:
 assert min(im.getpixel((x,y)))>232
 assert full.getpixel((x-box[0],y-box[1]))[3]==255
for name,data in manifest['assets'].items():assert hashlib.sha256((assets/name).read_bytes()).hexdigest()==data['sha256'],name
for size in [16,32,48,64,180]:
 img=Image.open(assets/f'icon-{size}.png').convert('RGBA');assert img.size==(size,size);assert img.getchannel('A').getextrema()[0]==0
emblem=Image.open(assets/'emblem-576.png').convert('RGBA');assert all(emblem.getpixel((x,575))[3]==0 for x in range(576)),'wordmark pixels must not leak into compact emblem'
assert Image.open(assets/'favicon.ico').ico.sizes()=={(16,16),(32,32),(48,48),(64,64)}
print('PASS: exact master, untouched RGB artwork, protected white interior/counters, transparent exterior, clean emblem crop, hashes and icon dimensions.')
