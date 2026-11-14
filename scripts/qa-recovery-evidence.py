"""Matched baseline/candidate evidence, explicit fictional records only; no external writes."""
import os,json,importlib.util,copy
from datetime import datetime,timezone
STAMP=datetime.now(timezone.utc).isoformat()
from pathlib import Path
from playwright.sync_api import sync_playwright
spec=importlib.util.spec_from_file_location('fixtures',Path(__file__).with_name('qa-profile-visual.py'));fixtures=importlib.util.module_from_spec(spec);spec.loader.exec_module(fixtures)
OUT=Path('docs/qa-20261114-recovery/screenshots');OUT.mkdir(parents=True,exist_ok=True)
engine=os.environ.get('PROFILE_BROWSER','chromium');review=json.loads(Path('data/content-review.json').read_text());fixture=copy.deepcopy(fixtures.FIXTURE);a=fixture['profiles'][0];a.update(ageYears=16,ageReviewedAt=STAMP,seasonLabel='Fall 2026',aboutSport='Synthetic QA athlete — fictional local acceptance record.',goals='Improve passing and game awareness.',graduationYear='2028',highSchool='Synthetic QA school',plans=[dict(id='qa-weekly',name='Synthetic practice',kind='practice',start='2026-11-16',repeat='weekly',days=[1,3],until='2026-11-30',note='Fictional training venue'),dict(id='qa-game',name='Synthetic game',kind='game',start='2026-11-20',startTime='17:00',endTime='18:00',note='Fictional game venue')],records=[dict(id='qa-record',eventRef='qa-game',metrics={'Goals':2},achievement='Synthetic recorded result')],contentSubscriptions=[s['id'] for s in review['sources'] if s['sport']=='lacrosse' and s['decision']=='approved']);a['recruiting'].update(visibility={'identity':True,'schedule':True,'stats':True,'achievements':True,'overview':True},eventRefs=['qa-game'],recordIds=['qa-record'],rulesReview=dict(acknowledged=True,sport='lacrosse',at=STAMP))
inventory=[]
with sync_playwright() as pw:
 browser=getattr(pw,engine).launch(headless=True,executable_path=os.environ.get('WEBKIT_PATH') if engine=='webkit' else '/usr/bin/chromium');version=browser.version
 for phase,port in [('before',3001),('after',3000)]:
  base='http://127.0.0.1:'+str(port);ctx=browser.new_context(viewport={'width':810,'height':1080});p=ctx.new_page();p.set_default_timeout(15000)
  def shot(name,selector=None):
   p.evaluate('async()=>{await document.fonts.ready;document.activeElement?.blur();document.querySelectorAll("img").forEach(i=>i.loading="eager");await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));}')
   path=OUT/f'{engine}-{phase}-{name}.png';p.locator(selector).screenshot(path=str(path)) if selector else p.screenshot(path=str(path));inventory.append({'file':str(path.relative_to(OUT.parent)),'viewport':p.viewport_size,'component':selector})
  p.goto(base+'/');shot('home-ipad')
  for sport in ['lacrosse','volleyball','basketball','swimming']:
   p.goto(base+'/sports/'+sport);p.wait_for_selector('.directory-records>article');shot(sport+'-ipad');shot(sport+'-editorial','#sport-discover')
  p.goto(base+'/build?new=1&guided=1');p.wait_for_selector('#athlete-journey');shot('onboarding-ipad')
  p.goto(base+'/my-pathway');p.evaluate('(s)=>localStorage.setItem("arenaPathway.v2",JSON.stringify(s))',fixture);p.goto(base+'/my-pathway?view=family');p.wait_for_selector('.family-athlete-card');shot('parent-ipad');p.goto(base+'/my-pathway');p.wait_for_selector('#show-tryouts');shot('athlete-ipad')
  for label,id,name in [('Schedule','schedules','schedule'),('Stats','stats','stats'),('Media','profile-media','media'),('My Feed','my-feed','feed'),('Development','camps','development')]:
   p.locator('#profile-nav,#athlete-resource-nav').get_by_role('link',name=label,exact=True).click();p.locator('#'+id).wait_for()
   if name in ['feed','development']:p.wait_for_selector('#'+id+' [aria-busy=false]')
   p.evaluate('scrollTo(0,0)');shot(name+'-ipad');shot(name+'-content','#'+id)
  p.goto(base+'/recruiting');p.wait_for_selector('#college-research');
  if phase=='before':p.get_by_role('button',name='Open local recruiting planner',exact=True).click()
  p.wait_for_selector('#recruiting-profile-builder',state='attached');shot('recruiting-schools-ipad')
  if phase=='after':
   p.get_by_role('navigation',name='Recruiting journey',exact=True).get_by_role('button',name='2 · Build athlete information',exact=True).click();shot('recruiting-builder-ipad');p.get_by_role('button',name='Preview selected information',exact=True).click();p.get_by_role('article',name='Coach-facing local athlete card',exact=True).wait_for();shot('recruiting-preview-ipad');shot('recruiting-card','.recruiting-preview')
  else:
   p.locator('#college-research').get_by_role('button',name='Build Profile',exact=True).click();p.wait_for_selector('[data-builder-host] #recruiting-profile-builder');shot('recruiting-builder-ipad');p.get_by_role('button',name='Parent approve local preview',exact=True).click();shot('recruiting-preview-ipad');shot('recruiting-card','.recruiting-preview')
  for size,w,h in [('desktop',1440,900),('iphone',390,844)]:
   p.set_viewport_size({'width':w,'height':h});p.goto(base+'/');shot('home-'+size);p.goto(base+'/my-pathway#my-feed');p.wait_for_selector('#my-feed [aria-busy=false]');shot('feed-'+size)
  p.set_viewport_size({'width':810,'height':1080});p.goto(base+'/my-ap');p.wait_for_selector('.ap-feed');shot('siem-ipad');p.goto(base+'/locked-in-demo');p.wait_for_selector('#lockedin-external-demo');shot('lockedin-ipad')
  if phase=='after':
   p.route('**/assets/style.css*',lambda r:r.abort());p.goto(base+'/');p.wait_for_selector('#asset-health:not([hidden])');shot('asset-recovery-ipad');p.unroute('**/assets/style.css*');p.get_by_role('button',name='Retry page assets',exact=True).click();p.wait_for_selector('#asset-health[hidden]',state='attached');shot('asset-restored-ipad')
  ctx.close()
 browser.close()
(OUT.parent/(engine+'-evidence.json')).write_text(json.dumps({'baseline':'638b53fb182e42bb90563e80f789781e5c0c8591','engine':engine,'version':version,'fixture':'Explicit synthetic family/athlete records, no genuine private information','screenshots':inventory},indent=2)+'\n')
print(engine,len(inventory),'screenshots')
