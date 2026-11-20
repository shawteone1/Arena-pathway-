"""Founder review: actual shared SIEM, role tools, real browser engines; fictional inputs."""
import os,json
from urllib.parse import urlparse,parse_qs
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/playrcmd/three-role'
BASE=os.environ.get('PLAYRCMD_QA_BASE','http://127.0.0.1:4310')
(OUT/'screenshots').mkdir(parents=True,exist_ok=True)
results=[]
with sync_playwright() as p:
 for engine in os.environ.get('PLAYRCMD_ENGINES','chromium').split(','):
  options={}
  if engine=='webkit' and os.environ.get('WEBKIT_PATH'):options['executable_path']=os.environ['WEBKIT_PATH']
  browser=getattr(p,engine).launch(**options)
  for label,w,h in [('desktop',1440,1000),('ipad-landscape',1024,768),('ipad-portrait',768,1024),('phone',390,844)]:
   ctx=browser.new_context(viewport={'width':w,'height':h},has_touch=label!='desktop');page=ctx.new_page();errors=[];bad=[];external=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.on('response',lambda r:bad.append([r.url,r.status]) if r.status>=400 else None)
   page.on('request',lambda r:external.append(r.url) if not r.url.startswith(BASE) else None)
   def capture(name):
    assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),(engine,label,name,'overflow')
    page.screenshot(path=str(OUT/'screenshots'/f'{engine}-{label}-{name}.png'),full_page=True)
   def open_role(role):
    page.goto(BASE+'/demo?scenario='+role);page.wait_for_selector('#platform-content[data-startup-state=ready]');page.locator('#pr-setup-dialog').get_by_role('button',name='Skip setup',exact=True).click() if page.locator('#pr-setup-dialog').is_visible() else None
   def tool(name):page.locator('[data-tool="'+name+'"]').click();expect(page.locator('#pr-tool-dialog')).to_be_visible()
   def close():page.locator('#pr-tool-dialog').get_by_role('button',name='Close',exact=True).click()
   page.goto(BASE);expect(page.get_by_role('link',name='Explore Interactive Demo',exact=True)).to_have_attribute('href','/roles')
   page.get_by_role('link',name='Explore Interactive Demo',exact=True).click();expect(page.locator('.pr-role-card')).to_have_count(3)
   if label in ['desktop','phone']:capture('role-selector')
   for role,link in [('family','Explore Parent & Family'),('college','Explore Athlete'),('coach','Explore Coach')]:
    page.goto(BASE+'/roles');page.get_by_role('link',name=link,exact=True).click();page.wait_for_selector('#platform-content[data-startup-state=ready]');page.locator('#pr-setup-dialog').get_by_role('button',name='Skip setup',exact=True).click() if page.locator('#pr-setup-dialog').is_visible() else None
    expect(page.locator('.pr-demo-context')).to_contain_text('Fictional data only');expect(page.locator('.ap-demo-banner')).to_contain_text('No live providers');capture(role+'-overview')
    # A real role navigation round-trip; no inherited filters or hidden controller state.
    next_role='coach' if role!='coach' else 'college';page.locator('[aria-label="Demo roles"] a[href="/demo?scenario='+next_role+'"]').click();page.wait_for_url(lambda url:parse_qs(urlparse(url).query).get('scenario')==[next_role]);page.wait_for_selector('#platform-content[data-startup-state=ready]');page.locator('#pr-setup-dialog').get_by_role('button',name='Skip setup',exact=True).click() if page.locator('#pr-setup-dialog').is_visible() else None;assert parse_qs(urlparse(page.url).query)['scenario']==[next_role]
    open_role(role)
    page.locator('[data-section-link=calendar]').click();page.wait_for_selector('[data-calendar-athlete]')
    for view in ['Day','Week','Month']:
     page.get_by_role('button',name=view,exact=True).click();expect(page.get_by_role('button',name=view,exact=True)).to_have_attribute('aria-pressed','true')
     assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
    page.get_by_role('button',name='None',exact=True).click();expect(page.locator('#platform-calendar')).to_contain_text('No athletes selected')
    page.get_by_role('button',name='All athletes',exact=True).click();page.get_by_role('button',name='Week',exact=True).click()
    if role=='coach':
     # Explicit organization boundary through the existing SIEM multiselect.
     orgs=page.locator('.ap-multiselect').first;orgs.locator(':scope > summary').click();orgs.locator('input').first.check()
     expect(page.locator('#platform-calendar')).not_to_contain_text('Cedar Valley · College practice')
     page.get_by_role('button',name='Clear filters',exact=True).click()
    page.locator('[data-section-link=messages]').click();expect(page.locator('[data-section=communications]')).to_be_visible()
    tool('entry');form=page.locator('#pr-entry-form');form.locator('[name=title]').fill('QA '+role+' recurring practice');form.locator('[name=count]').fill('3');form.get_by_role('button',name='Save fictional commitment',exact=True).click();expect(page.locator('.pr-tool-feedback')).to_contain_text('3 commitment(s) saved')
    # Re-save the stable reference: no second series.
    form.get_by_role('button',name='Save fictional commitment',exact=True).click();close()
    expect(page.locator('#platform-calendar')).to_contain_text('QA '+role+' recurring practice')
    page.get_by_role('button',name='Month',exact=True).click();assert page.locator('.ap-month-day').count()>0
    # Valid and unsupported ICS inputs, duplicate prevention and atomic rejection.
    tool('entry');ics='BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:qa-import\r\nDTSTART:20300506T230000Z\r\nDTEND:20300507T000000Z\r\nSUMMARY:QA imported '+role+'\r\nEND:VEVENT\r\nEND:VCALENDAR'
    imp=page.locator('#pr-import-form');imp.locator('[name=file]').set_input_files({'name':'fictional.ics','mimeType':'text/calendar','buffer':ics.encode()});imp.get_by_role('button',name='Import fictional calendar',exact=True).click();expect(page.locator('.pr-tool-feedback')).to_contain_text('1 imported calendar event')
    imp.get_by_role('button',name='Import fictional calendar',exact=True).click()
    imp.locator('[name=file]').set_input_files({'name':'unsupported.ics','mimeType':'text/calendar','buffer':ics.replace('DTSTART:','DTSTART;TZID=America/Denver:').encode()});imp.get_by_role('button',name='Import fictional calendar',exact=True).click();expect(page.locator('.pr-tool-feedback')).to_contain_text('UTC')
    if label=='desktop':capture(role+'-entry')
    close();page.get_by_role('button',name='Week',exact=True).click();expect(page.locator('#platform-calendar')).to_contain_text('QA imported '+role)
    # Exact record counts come from the adapter's scoped Web Storage, not mirrored UI assertions.
    counts=page.evaluate("role=>{const s=JSON.parse(localStorage.getItem('playrcmd.role.'+role));return {entries:s.entries.length,ids:s.entries.map(e=>e.eventId)}}",role);assert counts['entries']==4,counts
    tool('notifications');card=page.locator('[data-notification="playmetrics-change-'+role+'"]');button=card.get_by_role('button',name='Apply notification locally',exact=True);expect(button).to_be_disabled();card.locator('input[type=checkbox]').check();button.click();expect(page.locator('.pr-tool-feedback')).to_contain_text('Applied to the existing matched event')
    card.get_by_role('button',name='Applied · Replay to check duplicates',exact=True).click();expect(page.locator('.pr-tool-feedback')).to_contain_text('Duplicate prevented')
    reminder=page.locator('[data-notification="teamsnap-reminder-'+role+'"]');reminder.locator('input[type=checkbox]').check();reminder.get_by_role('button',name='Apply notification locally',exact=True).click()
    draft=page.locator('.pr-draft-composer form');draft.locator('[name=draft]').fill('QA '+role+' private local draft');draft.get_by_role('button',name='Save draft only',exact=True).click();expect(page.locator('.pr-tool-feedback')).to_contain_text('Nothing sent');expect(page.get_by_role('button',name='Sending unavailable · Authorized integrations required',exact=True)).to_be_disabled()
    if label=='desktop':capture(role+'-notifications')
    close();page.locator('[data-section-link=day]').click();expect(page.locator('#platform-changes')).to_contain_text('6:00 PM')
    # Reopening the lab retains the role/team draft.
    tool('notifications');expect(page.locator('.pr-saved-plan')).to_contain_text('QA '+role+' private local draft');close()
    tool('network');page.wait_for_selector('.pr-resource-card');expect(page.locator('.pr-resource-card').first).to_contain_text('Reviewed source snapshot')
    form=page.locator('.pr-network-filters');form.locator('[name=kind]').select_option('showcases');form.get_by_role('button',name='Find resources',exact=True).click();expect(page.locator('.pr-network-results')).to_contain_text('No verified showcases')
    form.locator('[name=kind]').select_option('jobs');form.get_by_role('button',name='Find resources',exact=True).click();expect(page.locator('.pr-network-results')).to_contain_text('No dated Colorado coaching vacancies')
    form.locator('[name=kind]').select_option('education');form.get_by_role('button',name='Find resources',exact=True).click();expect(page.locator('.pr-network-results')).to_contain_text('NFHS')
    if label=='desktop':capture(role+'-network')
    close()
    if role=='coach':
     tool('coach');plan=page.locator('#pr-plan-form');plan.locator('[name=teamId]').select_option('college-team');plan.locator('[name=title]').fill('QA college team plan');plan.locator('[name=notes]').fill('Fictional warmup and decision exercise. No sensitive information.');plan.get_by_role('button',name='Save local session plan',exact=True).click();expect(page.locator('.pr-saved-plan')).to_contain_text('QA college team plan')
     if label=='desktop':capture('coach-session-plan')
     close();page.reload();page.wait_for_selector('#platform-content[data-startup-state=ready]');page.locator('#pr-setup-dialog').get_by_role('button',name='Skip setup',exact=True).click() if page.locator('#pr-setup-dialog').is_visible() else None;tool('coach');expect(page.locator('.pr-saved-plan')).to_contain_text('QA college team plan');page.get_by_role('button',name='Delete local plan',exact=True).click();expect(page.locator('.pr-saved-plan')).to_have_count(0);close()
    # Another role never sees this role's new commitments or private drafts.
    open_role(next_role);assert 'QA '+role not in page.locator('body').inner_text();tool('notifications');assert 'QA '+role+' private local draft' not in page.locator('#pr-tool-dialog').inner_text();close()
    # Real principal isolation still enforced if a corrupt role record is inserted.
    open_role(role);page.evaluate("role=>{const k='playrcmd.role.'+role,s=JSON.parse(localStorage.getItem(k));s.entries.push({...s.entries[0],tenantId:'forbidden',title:'PRIVATE_ORG_SENTINEL'});localStorage.setItem(k,JSON.stringify(s))}",role);page.reload();page.wait_for_selector('#platform-content[data-startup-state=ready]');page.locator('#pr-setup-dialog').get_by_role('button',name='Skip setup',exact=True).click() if page.locator('#pr-setup-dialog').is_visible() else None;assert 'PRIVATE_ORG_SENTINEL' not in page.locator('body').inner_text()
    # Reset affects just this role; the previous v1 and AP namespaces are untouched.
    page.goto(BASE);page.evaluate("()=>{localStorage.setItem('arenaPathway.v2','AP_SENTINEL');localStorage.setItem('playrcmd.demo.v1.sentinel','OLD_DEMO_SENTINEL');localStorage.setItem('playrcmd.demo.v2.other.sentinel','OTHER_ROLE_SENTINEL')}");open_role(role)
    page.get_by_role('button',name='Reset this role',exact=True).click();page.wait_for_selector('#platform-content[data-startup-state=ready]');page.locator('#pr-setup-dialog').get_by_role('button',name='Skip setup',exact=True).click() if page.locator('#pr-setup-dialog').is_visible() else None;assert parse_qs(urlparse(page.url).query)['scenario']==[role];assert 'QA '+role not in page.locator('body').inner_text();tool('notifications');assert 'QA '+role+' private local draft' not in page.locator('#pr-tool-dialog').inner_text();close()
    page.goto(BASE);assert page.evaluate("localStorage.getItem('arenaPathway.v2')")=='AP_SENTINEL';assert page.evaluate("localStorage.getItem('playrcmd.demo.v1.sentinel')")=='OLD_DEMO_SENTINEL';assert page.evaluate("localStorage.getItem('playrcmd.demo.v2.other.sentinel')")=='OTHER_ROLE_SENTINEL'
    for href in ['https://soccercenter.org','https://arenapathway.com','https://la02uk.com']:expect(page.locator('a[href="'+href+'"]').first).to_be_attached()
    assert not errors,(engine,label,role,errors);assert not bad,(engine,label,role,bad);assert not external,(engine,label,role,external)
    results.append({'engine':engine,'version':browser.version,'viewport':label,'role':role,'status':'passed','pageErrors':[],'failedResponses':[],'externalRequests':[]});print(engine,label,role,'PASS',flush=True)
   ctx.close()
  browser.close()
(OUT/'browser-results.json').write_text(json.dumps(results,indent=2)+'\n')
print('PASS',len(results),'role/viewport/engine flows')
