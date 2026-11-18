"""Cross-engine AP density contract, unchanged bounds from qa-siem-refinement.py.
Run after starting the unchanged AP server on AP_QA_BASE (default port 4320).
"""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/playrcmd/qualification/after'
BASE=os.environ.get('AP_QA_BASE','http://127.0.0.1:4320')
rows=[]
with sync_playwright() as p:
 for engine in os.environ.get('QUALIFICATION_ENGINES','webkit').split(','):
  options={}
  if engine=='webkit' and os.environ.get('WEBKIT_PATH'):options['executable_path']=os.environ['WEBKIT_PATH']
  browser=getattr(p,engine).launch(**options)
  context=browser.new_context(has_touch=True)
  page=context.new_page(); errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  for label,width,height in [('desktop',1440,900),('ipad-landscape',1024,768),('ipad-portrait',768,1024),('phone',390,844)]:
   page.set_viewport_size({'width':width,'height':height})
   for scenario in ['parent','coach','college']:
    for mode in ['everyday','command','display']:
     page.goto(BASE+'/siem/platform?scenario='+scenario+'&mode='+mode)
     page.wait_for_selector('.ap-stat')
     page.evaluate('async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));}')
     metrics=page.evaluate('''()=>{const c=document.querySelector('[data-section=calendar] .ap-activity'),a=document.querySelector('[data-section=actions] .ap-action');return {headerHeight:document.querySelector('.site-header').getBoundingClientRect().height,kpiHeight:document.querySelector('.ap-stat').getBoundingClientRect().height,commitmentTitleBottom:c.querySelector('h3').getBoundingClientRect().bottom,actionTitleBottom:a.querySelector('h3').getBoundingClientRect().bottom,nextActionBottom:a.querySelector('.ap-next-step').getBoundingClientRect().bottom,overflow:document.documentElement.scrollWidth>innerWidth+1}}''')
     row={'engine':engine,'version':browser.version,'viewport':label,'scenario':scenario,'mode':mode,'viewportHeight':height,**metrics}
     rows.append(row)
     assert not metrics['overflow'],row
     assert metrics['kpiHeight']<=64,row
     for key in ['commitmentTitleBottom','actionTitleBottom','nextActionBottom']:assert metrics[key]<height,row
     if label=='phone' and scenario=='college' and mode=='everyday':page.screenshot(path=str(OUT/f'ap-college-phone-{engine}.png'),full_page=True)
  assert not errors,errors
  context.close();browser.close()
(OUT/'cross-engine-layout.json').write_text(json.dumps(rows,indent=2)+'\n')
print('PASS:',len(rows),'role/mode/viewport cases; original first-screen bounds retained')
