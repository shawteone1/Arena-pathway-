"""Matched AP baseline/current screenshots, existing synthetic profile fixtures only."""
import os,json,importlib.util
from pathlib import Path
from playwright.sync_api import sync_playwright
spec=importlib.util.spec_from_file_location('profiles',Path(__file__).with_name('qa-profile-visual.py'));profiles=importlib.util.module_from_spec(spec);spec.loader.exec_module(profiles)
OUT=Path('docs/qa-20261113-polish/screenshots');OUT.mkdir(parents=True,exist_ok=True)
engine=os.environ.get('PROFILE_BROWSER','chromium');inventory=[]
with sync_playwright() as pw:
 browser=getattr(pw,engine).launch(headless=True,executable_path=os.environ.get('WEBKIT_PATH') if engine=='webkit' else '/usr/bin/chromium');version=browser.version
 for phase,port in [('before',3001),('after',3000)]:
  base='http://127.0.0.1:'+str(port);context=browser.new_context(viewport={'width':810,'height':1080});page=context.new_page()
  def shot(name,selector=None):
   page.evaluate('async()=>{await document.fonts.ready;document.activeElement?.blur();await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));}')
   path=OUT/f'{engine}-{phase}-{name}.png'
   if selector:page.locator(selector).screenshot(path=str(path))
   else:page.screenshot(path=str(path))
   inventory.append({'file':str(path.relative_to(OUT.parent)),'viewport':{'width':page.viewport_size['width'],'height':page.viewport_size['height']},'componentCrop':selector})
  page.goto(base+'/sports/lacrosse');page.wait_for_selector('.directory-records>article');shot('lacrosse-ipad');shot('sport-navigation-ipad','.sport-pathways');shot('sport-editorial-ipad','.sport-editorial')
  for name,w,h in [('desktop',1440,900),('iphone',390,844)]:
   page.set_viewport_size({'width':w,'height':h});shot('lacrosse-'+name)
  page.set_viewport_size({'width':810,'height':1080});page.goto(base+'/my-ap');page.wait_for_selector('.ap-feed');shot('siem-entry-ipad')
  if phase=='after':page.locator('#platform-entry-tour').click()
  else:page.locator('#platform-settings>summary').click();page.get_by_role('button',name='Start guided tour',exact=True).click()
  shot('siem-tour-ipad');page.locator('#siem-tour').get_by_role('button',name='Skip',exact=True).click()
  page.goto(base+'/my-ap?scenario=family&mode=command');page.wait_for_selector('.ap-action');shot('siem-actions-ipad','#platform-actions')
  page.goto(base+'/my-ap?scenario=family&section=calendar');page.wait_for_selector('#platform-calendar .ap-activity');shot('siem-calendar-ipad','#platform-calendar')
  page.goto(base+'/my-ap?scenario=family&section=messages');page.wait_for_selector('.ap-message');shot('siem-messages-ipad','#platform-content')
  page.goto(base+'/locked-in-demo');page.wait_for_selector('#lockedin-external-demo' if phase=='after' else '#lockedin-workflow input');shot('lockedin-entry-ipad')
  page.goto(base+'/my-pathway');page.evaluate('(s)=>localStorage.setItem("arenaPathway.v2",JSON.stringify(s))',profiles.FIXTURE);page.goto(base+'/my-pathway?view=family');page.wait_for_selector('.family-athlete-card');shot('parent-ipad')
  page.goto(base+'/my-pathway');page.wait_for_selector('#show-tryouts');shot('athlete-ipad');shot('athlete-overview-ipad','#overview')
  page.goto(base+'/recruiting');page.wait_for_selector('#college-research');shot('recruiting-ipad')
  page.goto(base+'/my-ap?scenario=family');page.wait_for_selector('.ap-feed')
  for name,w,h in [('desktop',1440,900),('iphone',390,844)]:
   page.set_viewport_size({'width':w,'height':h});shot('siem-'+name)
  context.close()
 browser.close()
(OUT.parent/f'{engine}-evidence.json').write_text(json.dumps({'baseline':'d3ed8609081124457e95e692ac8d6cac4721300b','engine':engine,'version':version,'screenshots':inventory},indent=2)+'\n')
