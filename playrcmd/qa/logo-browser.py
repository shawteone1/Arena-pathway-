"""Actual browser image/layout captures. Run only against temporary review servers.
PLAYRCMD_QA_BASE=... PLAYRCMD_BEFORE_BASE=... python playrcmd/qa/logo-browser.py
"""
import os,json
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
bases=[('after',os.environ.get('PLAYRCMD_QA_BASE','http://127.0.0.1:4310'))]
if os.environ.get('PLAYRCMD_BEFORE_BASE'):bases.insert(0,('before',os.environ['PLAYRCMD_BEFORE_BASE']))
out=Path(os.environ.get('PLAYRCMD_QA_ARTIFACTS','/tmp/playrcmd-approved-logo-browser'));out.mkdir(parents=True,exist_ok=True)
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch()
 for version,base in bases:
  for device,w,h in [('desktop',1440,1000),('ipad-landscape',1024,768),('ipad-portrait',768,1024),('phone',390,844)]:
   context=browser.new_context(viewport={'width':w,'height':h},device_scale_factor=2,has_touch=device!='desktop');page=context.new_page();errors=[];bad=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.on('response',lambda r:bad.append([r.url,r.status]) if r.status>=400 else None)
   for name,path in [('landing','/'),('parent','/demo?scenario=family'),('athlete','/demo?scenario=college'),('coach','/demo?scenario=coach')]:
    page.goto(base.rstrip('/')+path)
    if name!='landing':
     page.wait_for_selector('#platform-content[data-startup-state=ready]')
     if page.locator('#pr-setup-dialog').is_visible():page.locator('#pr-setup-dialog').get_by_role('button',name='Skip setup',exact=True).click()
    if version=='after':
     image=page.locator('header .pr-approved-full').first
     expect(image).to_be_visible();assert image.evaluate('(e)=>e.complete&&e.naturalWidth>0')
     for img in page.locator('.pr-approved-full,.pr-approved-emblem').all():
      assert img.evaluate('(e)=>e.complete&&e.naturalWidth>0')
      assert img.evaluate('(e)=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&Math.abs(r.width/r.height-e.naturalWidth/e.naturalHeight)<.03}')
     assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),(version,device,name,'overflow')
    page.screenshot(path=str(out/f'{version}-{device}-{name}.png'),full_page=True)
    results.append({'version':version,'device':device,'page':name,'result':'passed'})
   assert not errors,errors;assert not bad,bad;context.close()
 browser.close()
(out/'results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results))
