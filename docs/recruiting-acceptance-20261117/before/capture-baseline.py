from playwright.sync_api import sync_playwright
from pathlib import Path
import os
import json
# Run only against the untouched bbdd9fc baseline server.
BASE=os.environ.get('ARENA_QA_BASE','http://127.0.0.1:3130');out=Path('docs/recruiting-acceptance-20261117/before');proof={}
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(viewport={'width':810,'height':1080});p=c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.goto(BASE+'/build?new=1');p.wait_for_selector('#athlete-basics:not([disabled])');p.locator('#nickname').fill('Jordan Ellis Demo');p.locator('#sport').select_option('lacrosse');p.locator('#guardian').check();p.locator('#club-team').fill('Fictional family club');p.get_by_role('button',name='Save athlete profile',exact=False).click();p.wait_for_selector('.athlete-story');
 for route,name in [('/my-pathway?view=family','parent'),('/my-pathway','profile'),('/recruiting','recruiting-entry')]:
  p.goto(BASE+route);p.wait_for_selector('.athlete-player-card' if name=='parent' else '.athlete-story' if name=='profile' else '#recruiting-experience[aria-busy=false]');proof[name]={'text':p.locator('#main').inner_text(),'legacyTemplate':p.locator('#template-recruiting').count(),'legacyPlanner':p.locator('#recruiting-form').count(),'legacyBuilder':p.locator('#recruiting-profile-builder').count(),'optionalRecruiting':p.locator('#optional-recruiting').count()}
  for label,w,h in [('desktop',1440,900),('ipad-portrait',810,1080),('ipad-landscape',1024,768),('iphone',390,844)]:p.set_viewport_size({'width':w,'height':h});p.screenshot(path=str(out/(name+'-'+label+'.png')),full_page=True)
 proof['errors']=errors;(out/'REACHABILITY.json').write_text(json.dumps(proof,indent=2)+'\n');b.close()
