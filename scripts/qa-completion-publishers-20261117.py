"""Read-only original-publisher navigation; no source activation or image copying."""
import importlib.util,unittest,json
from pathlib import Path
s=importlib.util.spec_from_file_location('f',Path(__file__).with_name('qa-profile-foundation-20261117.py'));f=importlib.util.module_from_spec(s);s.loader.exec_module(f)
class Publishers(unittest.TestCase):
 setUpClass=classmethod(f.Foundation.setUpClass.__func__);tearDownClass=classmethod(f.Foundation.tearDownClass.__func__);setUp=f.Foundation.setUp;tearDown=f.Foundation.tearDown
 def test_original_article_links_and_return(self):
  p=self.page;records=[];self.context.route('**/*',lambda r:r.continue_() if r.request.method in ['GET','HEAD'] else r.abort());responses=[];self.context.on('response',lambda r:responses.append({'url':r.url,'status':r.status}) if r.request.is_navigation_request() else None)
  for sport in ['lacrosse','basketball','volleyball','swimming']:
   with self.subTest(sport=sport):
    p.goto(f.BASE+'/sports/'+sport);p.wait_for_selector('#sport-discover .sport-news-card');a=p.locator('#sport-discover .sport-news-card h4 a').first;url=a.get_attribute('href');responses.clear()
    with p.expect_popup() as opened:a.click()
    external=opened.value;error=None
    try:external.wait_for_load_state('domcontentloaded',timeout=20000)
    except Exception as e:error=str(e).split('\n')[0]
    result={'sport':sport,'requestedURL':url,'finalURL':external.url,'navigationResponses':list(responses),'title':external.title() if error is None else None,'loadError':error,'APReturnURL':p.url,'noExternalWritesPermitted':True};records.append(result);external.close();self.assertIn('/sports/'+sport,p.url);self.assertEqual(p.locator('#sport-discover .sport-news-card').count(),3);self.assertTrue(any(r['status']==200 and not r['url'].startswith(f.BASE) for r in result['navigationResponses']),str(result))
  (f.OUT.parent/(f.ENGINE+'-publisher-checks.json')).write_text(json.dumps(records,indent=2)+'\n')
if __name__=='__main__':unittest.main(verbosity=2)
