from playwright.sync_api import sync_playwright
from pathlib import Path
import json
out=Path('docs/recruiting-acceptance-20261117/reference');proof=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(viewport={'width':810,'height':1080});c.route('**/*',lambda r:r.continue_() if r.request.method in ['GET','HEAD','OPTIONS'] else r.abort());p=c.new_page();p.goto('https://soccercenter.org/demo/parent-portal',wait_until='domcontentloaded');p.wait_for_timeout(1000)
 if p.get_by_role('button',name='Decline',exact=True).count():p.get_by_role('button',name='Decline',exact=True).click()
 for i in range(5):
  select=p.locator('select').nth(i);options=select.locator('option').evaluate_all('(es)=>es.filter(e=>e.value&&!e.disabled).map(e=>({value:e.value,label:e.textContent}))');proof.append({'selector':i,'options':options});
  if options:select.select_option(options[-1 if i in [1,2] else 0]['value']);p.wait_for_timeout(250)
 p.screenshot(path=str(out/'public-older-demo-profile.png'),full_page=True);proof.append({'body':p.locator('body').inner_text(),'buttons':p.get_by_role('button').all_text_contents()})
 for tab in ['Schedule','Stats','Media','Recruiting']:
  button=p.get_by_role('button',name=tab,exact=True)
  if button.count():button.first.click();p.wait_for_timeout(300);p.screenshot(path=str(out/('public-older-demo-'+tab.lower()+'.png')),full_page=True);proof.append({'tab':tab,'body':p.locator('body').inner_text()})
 if p.get_by_role('button',name='Build Profile',exact=True).count():
  p.get_by_role('button',name='Build Profile',exact=True).click();p.wait_for_timeout(400);p.screenshot(path=str(out/'public-older-demo-builder.png'),full_page=True);proof.append({'tab':'Build Profile','body':p.locator('body').inner_text(),'buttons':p.get_by_role('button').all_text_contents()})
 (out/'PUBLIC-OLDER-DEMO-JOURNEY.json').write_text(json.dumps(proof,indent=2)+'\n');b.close()
