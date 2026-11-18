"""Repeatable standalone checks; same SIEM behavior, no external provider traffic."""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/playrcmd/screenshots'
BASE=os.environ.get('PLAYRCMD_QA_BASE','http://127.0.0.1:4310')
OUT.mkdir(parents=True,exist_ok=True)
results=[]
with sync_playwright() as p:
 for engine in os.environ.get('PLAYRCMD_ENGINES','chromium').split(','):
  browser=getattr(p,engine).launch()
  for label,width,height in [('desktop',1440,1000),('ipad-landscape',1024,768),('ipad-portrait',768,1024),('mobile',390,844)]:
   ctx=browser.new_context(viewport={'width':width,'height':height},has_touch=label!='desktop')
   page=ctx.new_page(); errors=[]; bad=[]; external=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.on('response',lambda r:bad.append([r.url,r.status]) if r.status>=400 else None)
   page.on('request',lambda r:external.append(r.url) if not r.url.startswith(BASE) else None)
   page.goto(BASE)
   for href in ['https://soccercenter.org','https://arenapathway.com','https://la02uk.com']:
    expect(page.locator('a[href="'+href+'"]').first).to_be_attached()
   for path,name in [('/','landing'),('/integrations','integrations'),('/demo?scenario=family','overview'),('/demo?scenario=family&section=family','family'),('/demo?scenario=family&section=calendar','calendar'),('/demo?scenario=family&section=messages','messages'),('/setup','setup')]:
    page.goto(BASE+path)
    if name in ['overview','family','calendar','messages']:page.wait_for_selector('#platform-content[data-startup-state=ready]')
    if name=='setup':page.wait_for_selector('#siem-connections .siem-panel',state='attached')
    assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),(engine,label,name,'overflow')
    page.screenshot(path=str(OUT/f'{engine}-{label}-{name}.png'),full_page=True)
   page.goto(BASE+'/demo?scenario=family&section=calendar');page.wait_for_selector('[data-calendar-athlete]')
   for view in ['Day','Month','Week']:
    page.get_by_role('button',name=view,exact=True).click()
    expect(page.get_by_role('button',name=view,exact=True)).to_have_attribute('aria-pressed','true')
   page.get_by_role('button',name='None',exact=True).click();expect(page.locator('#platform-calendar')).to_contain_text('No athletes selected')
   page.get_by_role('button',name='All athletes',exact=True).click()
   colors=page.locator('[data-calendar-athlete]').evaluate_all('(nodes)=>nodes.map(n=>getComputedStyle(n).getPropertyValue("--athlete-color").trim())')
   assert set(colors)=={'#258653','#2e68bd','#8055b4'},colors
   page.goto(BASE+'/demo?scenario=family&mode=command');page.wait_for_selector('[data-alert=changed]',state='attached')
   more=page.locator('.ap-more-actions')
   if not more.evaluate('(el)=>el.open'):more.locator(':scope > summary').click()
   page.locator('[data-alert=changed]').filter(has_text='Alex · Soccer practice').get_by_role('button',name='Review details').click()
   for text in ['PlayMetrics · FICTIONAL SOURCE','TeamSnap · FICTIONAL SOURCE','Slack · FICTIONAL SOURCE','4:30 PM','5:15 PM']:
    expect(page.locator('#platform-detail')).to_contain_text(text)
   page.screenshot(path=str(OUT/f'{engine}-{label}-change-detail.png'))
   page.get_by_role('button',name='Close details',exact=True).click()
   page.get_by_role('button',name='Start Guided Tour',exact=True).click()
   for title in ['Family overview','Consolidated calendar','Schedule changes','Action priorities','Messages and Slack replies','Family settings and filters']:
    expect(page.locator('#siem-tour-title')).to_have_text(title)
    page.locator('#siem-tour').get_by_role('button',name='Finish' if title=='Family settings and filters' else 'Next',exact=True).click()
   # Seed an unrelated AP key outside adapter scope; wrapper must never display or erase it.
   page.goto(BASE)
   page.evaluate("localStorage.setItem('arenaPathway.v2', JSON.stringify({version:2,profiles:[{id:'real-record',nickname:'PRODUCTION_SENTINEL',sport:'soccer'}]}))")
   page.goto(BASE+'/demo?scenario=family&section=family');page.wait_for_selector('#platform-content[data-startup-state=ready]')
   assert 'PRODUCTION_SENTINEL' not in page.locator('body').inner_text()
   page.goto(BASE+'/setup');page.wait_for_selector('#siem-connections .siem-panel',state='attached')
   page.locator('#siem-participant-add [name=nickname]').fill('Demo athlete')
   page.locator('#siem-participant-add button').click();expect(page.locator('#siem-people')).to_contain_text('Demo athlete')
   # Existing UTC ICS parser + setup form + local calendar projection, unmodified.
   page.locator('.siem-local-tools > summary').click()
   page.get_by_text('Import an ICS calendar',exact=True).click()
   ics='BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:playrcmd-test\r\nDTSTART:20300506T170000Z\r\nDTEND:20300506T180000Z\r\nSUMMARY:Fictional imported practice\r\nEND:VEVENT\r\nEND:VCALENDAR'
   page.locator('#siem-import [name=file]').set_input_files({'name':'fictional.ics','mimeType':'text/calendar','buffer':ics.encode()})
   page.locator('#siem-import button').click();expect(page.locator('#siem-calendar')).to_contain_text('Fictional imported practice')
   page.goto(BASE+'/demo?scenario=local&section=calendar');page.wait_for_selector('#platform-content[data-startup-state=ready]')
   expect(page.locator('#platform-content')).to_contain_text('Demo athlete')
   page.get_by_label('Calendar date',exact=True).fill('2030-05-06')
   page.get_by_label('Calendar date',exact=True).dispatch_event('change')
   page.get_by_role('button',name='Day',exact=True).click()
   expect(page.locator('#platform-calendar')).to_contain_text('Fictional imported practice')
   page.get_by_role('button',name='Reset all demo data',exact=True).click();page.wait_for_selector('#platform-content[data-startup-state=ready]')
   page.goto(BASE)
   assert page.evaluate("localStorage.getItem('arenaPathway.v2').includes('PRODUCTION_SENTINEL')")
   assert page.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('playrcmd.demo.v1.')).length")==0
   assert not errors,(engine,label,errors)
   assert not bad,(engine,label,bad)
   assert not external,(engine,label,external)
   results.append({'engine':engine,'viewport':label,'checks':'passed','page_errors':errors,'failed_assets':bad,'external_requests':external})
   print(engine,label,'passed',flush=True)
   ctx.close()
  browser.close()
(OUT.parent/'browser-results.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps(results,indent=2))
