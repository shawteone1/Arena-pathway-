"""Matched39ecc7e/candidate captures using existing, labeled synthetic QA fixtures."""
import os,json,importlib.util,copy
from pathlib import Path
from playwright.sync_api import sync_playwright
spec=importlib.util.spec_from_file_location('profiles',Path(__file__).with_name('qa-profile-visual.py'));profiles=importlib.util.module_from_spec(spec);spec.loader.exec_module(profiles)
OUT=Path('docs/qa-20261113-dgc/screenshots');OUT.mkdir(parents=True,exist_ok=True)
engine=os.environ.get('PROFILE_BROWSER','chromium');review=json.loads(Path('data/content-review.json').read_text());fixture=copy.deepcopy(profiles.FIXTURE);athlete=fixture['profiles'][0];athlete.update(aboutSport='Synthetic QA athlete — browser-local review fixture.',goals='Improve passing and game awareness.',seasonLabel='Fall 2026',records=[dict(id='synthetic-record',eventRef=athlete['plans'][0]['id'],metrics={'Goals':2},achievement='Synthetic family result')],contentSubscriptions=[s['id'] for s in review['sources'] if s['sport']=='lacrosse' and s['decision']=='approved'])
inventory=[]
with sync_playwright() as pw:
 browser=getattr(pw,engine).launch(headless=True,executable_path=os.environ.get('WEBKIT_PATH') if engine=='webkit' else '/usr/bin/chromium');version=browser.version
 for phase,port in [('before',3001),('after',3000)]:
  base='http://127.0.0.1:'+str(port);context=browser.new_context(viewport={'width':810,'height':1080});page=context.new_page()
  def shot(name,selector=None):
   page.evaluate('async()=>{await document.fonts.ready;document.activeElement?.blur();document.querySelectorAll("img").forEach(i=>i.loading="eager");await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));}')
   path=OUT/f'{engine}-{phase}-{name}.png';page.locator(selector).screenshot(path=str(path)) if selector else page.screenshot(path=str(path));inventory.append({'file':str(path.relative_to(OUT.parent)),'viewport':page.viewport_size,'componentCrop':selector})
  page.goto(base+'/');shot('home-ipad');page.locator('#sports').scroll_into_view_if_needed();shot('discover-ipad');page.goto(base+'/sports/lacrosse');page.wait_for_selector('.directory-records>article');shot('sport-ipad')
  page.goto(base+'/my-pathway');page.evaluate('(s)=>localStorage.setItem("arenaPathway.v2",JSON.stringify(s))',fixture);page.reload();page.wait_for_selector('#show-tryouts');shot('athlete-ipad');shot('overview-ipad','#overview')
  for name,label,id in [('feed','My Feed','my-feed'),('development','Development','camps'),('community','Community','community')]:
   page.locator('#athlete-resource-nav').get_by_role('link',name=label,exact=True).click();page.locator('#'+id).wait_for()
   if name!='community':page.wait_for_selector('#'+id+' [aria-busy=false]')
   page.evaluate('scrollTo(0,0)');shot(name+'-ipad');shot(name+'-cards-ipad','#'+id)
  for name,w,h in [('desktop',1440,900),('iphone',390,844)]:
   page.set_viewport_size({'width':w,'height':h});page.goto(base+'/');shot('home-'+name);page.goto(base+'/my-pathway#my-feed');page.wait_for_selector('#my-feed [aria-busy=false]');shot('feed-'+name)
  page.set_viewport_size({'width':810,'height':1080});page.goto(base+'/my-ap');page.wait_for_selector('.ap-feed');shot('siem-ipad');page.goto(base+'/locked-in-demo');page.wait_for_selector('#lockedin-external-demo');shot('lockedin-ipad');context.close()
 browser.close()
(OUT.parent/(engine+'-evidence.json')).write_text(json.dumps({'baseline':'39ecc7eb9c2f671658d4916f17c966facb6b3c39','engine':engine,'version':version,'fixture':'Existing synthetic QA profiles/results; no production records','screenshots':inventory},indent=2)+'\n')
