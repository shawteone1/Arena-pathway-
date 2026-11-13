"""Local synthetic evidence. Baseline48 server3001; working candidate3000. No real family data."""
import os,json,base64
from datetime import datetime,timezone
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path('docs/qa-20261113-resume/screenshots');OUT.mkdir(parents=True,exist_ok=True)
engine=os.environ.get('PROFILE_BROWSER','chromium');review=json.loads(Path('data/content-review.json').read_text());stamp=datetime.now(timezone.utc).isoformat()
plan=dict(id='sample-meet',name='Family-entered weekend meet',kind='meet',start='2026-11-20',end='2026-11-21',repeat='none',note='Family-entered pool',sessions=[dict(id='race-a',name='Preliminary race',dayOffset=0,startTime='10:00',endTime='10:10',discipline='100 yd freestyle',course='SCY'),dict(id='race-b',name='Final race',dayOffset=1,startTime='11:00',endTime='11:10',discipline='100 yd freestyle',course='SCY')])
profile=dict(id='synthetic-swimmer',nickname='Casey Demo',sport='swimming',clubTeam='Family-entered swim team',position='Freestyle',role='parent',guardian=True,participationDesignation='youth',participationLevel='competitive',region='all',goal='teams',interests=[],moduleVersion=2,modules=['teams','schedules','saved','camps','community','recruiting'],saved=[],plans=[plan],records=[dict(id='record-a',eventRef='sample-meet#race-a',metrics={'Time (seconds)':62.34},discipline='100 yd freestyle',course='SCY',achievement='Family-entered result')],swimmingTargets=[dict(id='target-a',discipline='100 yd freestyle',course='SCY',seconds=60)],ageYears=16,ageReviewedAt=stamp,aboutSport='Synthetic QA swimmer. These are fictional family records.',goals='Improve turns and race consistency.',contentSubscriptions=[s['id'] for s in review['sources'] if s['sport']=='swimming' and s['decision']=='approved'],recruiting=dict(checks=[],notes='',rulesReview=dict(sport='swimming',acknowledged=True,at=stamp),visibility=dict(identity=True,schedule=True,stats=True,achievements=True,highlights=False)))
with sync_playwright() as pw:
 browser=getattr(pw,engine).launch(headless=True,executable_path=os.environ.get('WEBKIT_PATH') if engine=='webkit' else '/usr/bin/chromium')
 version=browser.version
 for phase,port in [('before',3001),('after',3000)]:
  base='http://127.0.0.1:'+str(port);context=browser.new_context(viewport=dict(width=810,height=1080));page=context.new_page();page.goto(base+'/my-pathway');page.evaluate('(p)=>localStorage.setItem("arenaPathway.v2",JSON.stringify({version:2,active:p.id,profiles:[p]}))',profile)
  def shot(name,selector=None):
   page.evaluate('document.activeElement?.blur()');page.locator(selector).screenshot(path=str(OUT/f'{engine}-{phase}-{name}.png')) if selector else page.screenshot(path=str(OUT/f'{engine}-{phase}-{name}.png'))
  page.goto(base+'/my-pathway?view=family');page.wait_for_selector('.family-athlete-card');shot('parent-ipad')
  page.goto(base+'/my-pathway');page.wait_for_selector('#show-tryouts');shot('athlete-ipad');shot('swimmer-overview-ipad','#overview')
  page.locator('#profile-nav').get_by_role('link',name='Schedule',exact=True).click();page.wait_for_selector('#schedule-list article');
  if phase=='after':page.get_by_role('navigation',name='Athlete schedule views',exact=True).get_by_role('button',name='Week',exact=True).click()
  shot('schedule-ipad','#schedules')
  page.locator('#athlete-resource-nav').get_by_role('link',name='My Feed',exact=True).click();page.wait_for_selector('#my-feed .content-items');shot('feed-ipad','#my-feed')
  page.goto(base+'/recruiting');page.wait_for_selector('#college-research');page.locator('#college-research').get_by_role('button',name='Build Profile',exact=True).click()
  if phase=='after':page.wait_for_selector('[data-builder-host] #recruiting-profile-builder')
  shot('recruiting-builder-ipad','#college-research')
  page.goto(base+'/my-ap?scenario=family&section=family');page.wait_for_selector('.ap-family-grid');shot('siem-family-ipad','#platform-content')
  if phase=='after':page.get_by_role('button',name='Guided tour',exact=True).click();shot('siem-tour-ipad');page.locator('#siem-tour').get_by_role('button',name='Skip',exact=True).click()
  page.goto(base+'/locked-in-demo');page.wait_for_selector('#lockedin-workflow' if phase=='after' else 'main');shot('lockedin-ipad')
  if phase=='after':shot('lockedin-workflow-ipad','#lockedin-workflow')
  context.close()
 browser.close()
(OUT.parent/f'{engine}-evidence.json').write_text(json.dumps({'baseline':'48ca091c56772ff49b5e6217b8766ecfbc7f0158','viewport':{'width':810,'height':1080},'data':'Synthetic fixture only','engine':engine,'version':version},indent=2)+'\n')
