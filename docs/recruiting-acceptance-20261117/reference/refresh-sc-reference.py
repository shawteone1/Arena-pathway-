from playwright.sync_api import sync_playwright
from pathlib import Path
import json
out=Path('docs/recruiting-acceptance-20261117/reference');out.mkdir(exist_ok=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(viewport={'width':810,'height':1080});blocked=[]
 def guard(route):
  if route.request.method not in ['GET','HEAD','OPTIONS']:blocked.append({'method':route.request.method,'url':route.request.url});route.abort()
  else:route.continue_()
 c.route('**/*',guard);p=c.new_page();rows=[]
 for name,url in [('home','https://soccercenter.org/'),('clubs','https://soccercenter.org/soccer-directory'),('public-demo','https://soccercenter.org/demo/parent-portal'),('parent-auth','https://soccercenter.org/parent-portal'),('lockedin','https://soccercenter.org/locked-in/index.html')]:
  try:
   r=p.goto(url,wait_until='domcontentloaded',timeout=60000);p.wait_for_timeout(1200);p.screenshot(path=str(out/(name+'.png')),full_page=False);rows.append({'name':name,'requested':url,'actual':p.url,'status':r.status,'title':p.title(),'bodyExcerpt':p.locator('body').inner_text()[:4000]})
  except Exception as e:rows.append({'name':name,'requested':url,'error':str(e)})
 (out/'BROWSER-READBACK.json').write_text(json.dumps({'referenceHEAD':'11de067414e63c5d3e3e221dfc14cc026dfbd8d0','rows':rows,'blockedNonGET':blocked,'externalWrites':[]},indent=2)+'\n');b.close()
