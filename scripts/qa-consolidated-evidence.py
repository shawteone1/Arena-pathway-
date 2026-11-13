"""Matched synthetic screenshots against the immutable baseline server and current AP.
Run baseline on3001 from9733b60; current AP on3000. Never reads a personal browser profile.
"""
import os,json,base64
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path('docs/qa-20261113/screenshots');OUT.mkdir(parents=True,exist_ok=True)
ENGINE=os.environ.get('PROFILE_BROWSER','chromium')
review=json.loads(Path('data/content-review.json').read_text())
subscriptions=[s['id'] for s in review['sources'] if s['sport']=='lacrosse' and s['decision']=='approved']
profile=dict(id='synthetic-casey',nickname='Casey Demo',sport='lacrosse',clubTeam='Denver Elite',position='Attack',role='parent',guardian=True,participationDesignation='youth',participationLevel='competitive',region='all',goal='teams',interests=[],modules=['teams','schedules','saved','camps','community'],moduleVersion=2,saved=['denver-elite'],plans=[dict(id='synthetic-series',name='Family practice',start='2026-11-16',end='2026-11-16',repeat='weekly',until='2026-11-30',interval=1,days=[1],kind='practice',startTime='17:00',endTime='18:00',note='Family-entered training location'),dict(id='synthetic-tournament',name='Family tournament',kind='tournament',start='2026-11-19',end='2026-11-19',note='Family-entered venue')],records=[dict(id='synthetic-record',eventRef='synthetic-tournament',metrics={'Goals':2,'Assists':1},achievement='Synthetic family result')],contentSubscriptions=subscriptions,recruiting=dict(checks=['research'],notes='Synthetic research only'),goals='Improve passing and game awareness.',aboutSport='Synthetic QA athlete. All records and uploaded files are demonstration fixtures.',programTeam='Family-entered team',seasonLabel='Fall 2026',ageGroup='U16')
video=base64.b64encode(Path('test/fixtures/qa-family-video.mp4').read_bytes()).decode()
with sync_playwright() as pw:
 browser=getattr(pw,ENGINE).launch(headless=True,executable_path=os.environ.get('WEBKIT_PATH') if ENGINE=='webkit' else '/usr/bin/chromium')
 inventory=[]
 for phase,port in [('before',3001),('after',3000)]:
  context=browser.new_context(viewport={'width':810,'height':1080});page=context.new_page();base='http://127.0.0.1:'+str(port);page.goto(base+'/my-pathway')
  page.evaluate('''async ({profile,video})=>{const canvas=document.createElement('canvas');canvas.width=320;canvas.height=200;const c=canvas.getContext('2d');c.fillStyle='#19334f';c.fillRect(0,0,320,200);c.fillStyle='#f4eee2';c.font='18px sans-serif';c.fillText('SYNTHETIC FAMILY IMAGE',34,103);profile.avatarDataUrl=canvas.toDataURL();localStorage.setItem('arenaPathway.v2',JSON.stringify({version:2,active:profile.id,profiles:[profile]}));const model=await import('/assets/siem-model.js');const family=model.empty();family.athletes=[{id:'synthetic-parent',name:'Demo Parent',type:'parent',sport:'personal'}];localStorage.setItem('arenaPathway.siem.v1',JSON.stringify(family));const media=await import('/assets/media-library.js');const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));await media.putMedia({athleteId:profile.id,file:new File([blob],'synthetic-family.png',{type:'image/png'}),caption:'Family highlight · synthetic fixture',eventRef:'synthetic-tournament'});const bytes=Uint8Array.from(atob(video),x=>x.charCodeAt(0));await media.putMedia({athleteId:profile.id,file:new File([bytes],'synthetic-video.mp4',{type:'video/mp4'}),caption:'Synthetic family video',eventRef:'synthetic-tournament'});}''',dict(profile=profile,video=video))
  page.goto(base+'/my-pathway?view=family');page.wait_for_selector('.family-athlete-card');page.evaluate('document.activeElement?.blur()');page.screenshot(path=str(OUT/f'{ENGINE}-{phase}-parent.png'),full_page=True)
  page.goto(base+'/my-pathway');page.wait_for_selector('#show-tryouts');page.screenshot(path=str(OUT/f'{ENGINE}-{phase}-athlete.png'),full_page=True)
  for name,selector in [('Schedule','#schedules'),('Stats','#stats'),('Media','#profile-media'),('My Feed','#my-feed'),('Development','#camps')]:
   page.locator('#profile-nav,#athlete-resource-nav').get_by_role('link',name=name,exact=True).click();page.locator(selector).wait_for()
   if name in ['My Feed','Development']:page.wait_for_selector(selector+' [data-content-library][aria-busy=false]' if phase=='after' else selector+' [data-content-library]')
   if name=='Media':page.wait_for_selector('#profile-media video');page.wait_for_function('()=>document.querySelector("#profile-media video")?.readyState>=1')
   page.evaluate('document.activeElement?.blur()');page.locator(selector).screenshot(path=str(OUT/f'{ENGINE}-{phase}-{name.lower().replace(" ","-")}.png'))
  page.goto(base+'/build?new=1'+('&guided=1' if phase=='after' else ''));page.wait_for_selector('#athlete-journey' if phase=='after' else '#athlete-basics:not([disabled])');page.evaluate('document.activeElement?.blur()');page.screenshot(path=str(OUT/f'{ENGINE}-{phase}-add-athlete.png'),full_page=True)
  page.goto(base+'/recruiting');page.wait_for_selector('#optional-recruiting');page.evaluate('document.activeElement?.blur()');page.screenshot(path=str(OUT/f'{ENGINE}-{phase}-recruiting.png'),full_page=True)
  page.goto(base+'/sports/lacrosse');page.wait_for_selector('.result-count');inventory.append({'phase':phase,'lacrosseRows':page.locator('.directory-records>article').count()});page.screenshot(path=str(OUT/f'{ENGINE}-{phase}-sport-viewport.png'))
  page.goto(base+'/my-ap?scenario=family&section=calendar');page.wait_for_selector('#platform-calendar .ap-activity');page.screenshot(path=str(OUT/f'{ENGINE}-{phase}-siem-calendar.png'),full_page=True)
  if phase=='after':
   page.locator('#platform-settings>summary').click();page.get_by_role('button',name='Start guided tour',exact=True).click();page.screenshot(path=str(OUT/f'{ENGINE}-after-siem-tour.png'));page.get_by_role('button',name='Skip',exact=True).click();page.goto(base+'/locked-in-demo');page.screenshot(path=str(OUT/f'{ENGINE}-after-lockedin.png'),full_page=True);page.goto(base+'/community?sport=lacrosse');page.screenshot(path=str(OUT/f'{ENGINE}-after-community.png'),full_page=True)
  context.close()
 browser.close();(OUT.parent/f'{ENGINE}-screenshot-inventory.json').write_text(json.dumps(inventory,indent=2)+'\n')
