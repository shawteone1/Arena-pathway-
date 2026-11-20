"""Real-browser acceptance runner. Requires the existing PlayRcmd server and Playwright.
No sandbox workarounds. Artifacts go outside product source unless configured otherwise.
PLAYRCMD_QA_BASE=http://127.0.0.1:4310 python playrcmd/qa/onboarding-browser.py
"""
import os,json
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
base=os.environ.get('PLAYRCMD_QA_BASE','http://127.0.0.1:4310').rstrip('/')
out=Path(os.environ.get('PLAYRCMD_QA_ARTIFACTS','/tmp/playrcmd-guided-browser'));out.mkdir(parents=True,exist_ok=True)
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch()
 for label,w,h in [('desktop',1440,1000),('ipad-landscape',1024,768),('ipad-portrait',768,1024),('phone',390,844)]:
  context=browser.new_context(viewport={'width':w,'height':h},has_touch=label!='desktop');page=context.new_page();errors=[];bad=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:bad.append([r.url,r.status]) if r.status>=400 else None)
  for role in ['family','college','coach']:
   page.goto(base+'/demo?scenario='+role);page.wait_for_selector('#platform-content[data-startup-state=ready]');wizard=page.locator('#pr-setup-dialog');expect(wizard).to_be_visible()
   page.screenshot(path=str(out/f'{label}-{role}-first-launch.png'),full_page=True)
   wizard.get_by_role('button',name='Skip setup',exact=True).click();page.get_by_role('button',name='Edit My Setup',exact=True).click()
   wizard.get_by_role('button',name='Save & continue',exact=True).click();wizard.get_by_role('button',name='Save & continue',exact=True).click();wizard.get_by_role('button',name='Save & continue',exact=True).click()
   wizard.get_by_role('checkbox',name='Schedule changes',exact=True).check();wizard.get_by_role('button',name='Save & continue',exact=True).click();wizard.get_by_role('button',name='Save setup & open command center',exact=True).click()
   page.reload();page.wait_for_selector('#platform-content[data-startup-state=ready]');expect(wizard).not_to_be_visible()
   page.get_by_role('button',name='Start Tour',exact=True).click();expect(page.locator('#siem-tour')).to_be_visible();assert 'scenario='+role in page.url;page.locator('#siem-tour').get_by_role('button',name='Skip',exact=True).click()
   page.get_by_role('button',name='Pull from Soccer Center',exact=True).click();transfer=page.locator('#pr-transfer-dialog');transfer.get_by_role('checkbox',name='Display name',exact=True).check();transfer.get_by_role('button',name='Preview selected changes',exact=True).click()
   review=page.locator('#pr-transfer-review');review.get_by_role('checkbox').first.check()
   if role=='family':review.get_by_role('checkbox').nth(1).check()
   review.get_by_role('button',name='Approve simulated transfer',exact=True).click();expect(review).to_contain_text('No external system changed');page.screenshot(path=str(out/f'{label}-{role}-pull-receipt.png'),full_page=True)
   transfer.get_by_role('button',name='Undo last simulated transfer',exact=True).click();transfer.get_by_role('button',name='Close',exact=True).click()
   page.get_by_role('button',name='Push to Arena Pathway',exact=True).click();transfer=page.locator('#pr-transfer-dialog');transfer.get_by_role('checkbox',name='Display name',exact=True).check();transfer.get_by_role('button',name='Preview selected changes',exact=True).click();review=page.locator('#pr-transfer-review');review.get_by_role('checkbox').first.check()
   if role=='family':review.get_by_role('checkbox').nth(1).check()
   review.get_by_role('button',name='Approve simulated transfer',exact=True).click();expect(review).to_contain_text('No external system changed');page.screenshot(path=str(out/f'{label}-{role}-push-receipt.png'),full_page=True)
   transfer.get_by_role('button',name='Close',exact=True).click();assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1');page.get_by_role('button',name='Reset this role',exact=True).click();page.wait_for_selector('#platform-content[data-startup-state=ready]');expect(page.locator('#pr-setup-dialog')).to_be_visible()
   results.append({'device':label,'role':role,'result':'passed'})
  assert not errors,errors;assert not bad,bad;context.close()
 browser.close()
(out/'results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results))
