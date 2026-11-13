"""My Feed RSS browser acceptance with synthetic publisher API fixtures; no live activation."""
import importlib.util,unittest,json,os
from pathlib import Path
spec=importlib.util.spec_from_file_location('base',Path(__file__).with_name('qa-20261112.py'));base=importlib.util.module_from_spec(spec);spec.loader.exec_module(base)
class RSS(unittest.TestCase):
 setUpClass=classmethod(base.Remediation.setUpClass.__func__)
 tearDownClass=classmethod(base.Remediation.tearDownClass.__func__)
 setUp=base.Remediation.setUp
 tearDown=base.Remediation.tearDown
 state=base.Remediation.state
 section=base.Remediation.section
 def fixture(self,route):
  publishers=[dict(id='lacrosse:rss:nll',name='Test NLL',sport='lacrosse',coverage=['professional'],enabled=True,status='ready',lastSuccessAt='2026-11-13T10:00:00Z'),dict(id='lacrosse:rss:world-lacrosse',name='Test World',sport='lacrosse',coverage=['national'],enabled=True,status='stale',lastSuccessAt='2026-11-12T10:00:00Z')]
  items=[dict(id='one',sourceId=publishers[0]['id'],publisher='Test NLL',sport='lacrosse',title='Synthetic pro result',url='https://example.com/pro',summary='Synthetic summary.',publishedAt='2026-11-12T10:00:00Z',topics=['professional']),dict(id='two',sourceId=publishers[1]['id'],publisher='Test World',sport='lacrosse',title='Synthetic Olympic result',url='https://example.com/olympic',summary='Synthetic summary.',publishedAt='2026-11-13T10:00:00Z',topics=['national']),dict(id='wrong',sourceId=publishers[0]['id'],publisher='Wrong sport',sport='swimming',title='Must never display',url='https://example.com/wrong',publishedAt='2026-11-13T11:00:00Z',topics=['national'])]
  route.fulfill(status=200,content_type='application/json',body=json.dumps(dict(publishers=publishers,items=items,refreshAfterMs=900000)))
 def open(self):
  self.section('My Feed');self.page.wait_for_selector('[data-rss-news][aria-busy=false]');self.page.locator('[data-rss-news] summary').click()
 def test_01_actual_catalog_is_off_and_profiles_untouched(self):
  before=self.state();self.open();self.assertGreater(self.page.locator('[data-rss-source]').count(),0);self.assertEqual(self.page.locator('[data-rss-source]:enabled').count(),0);self.assertEqual(self.page.locator('.rss-items article').count(),0);self.assertEqual(self.state(),before)
 def test_02_opt_in_filters_reload_and_mobile_cards(self):
  self.page.route('**/api/rss-news?*',self.fixture);self.page.reload();self.page.wait_for_selector('#show-tryouts',state='attached');self.open();self.assertEqual(self.page.locator('.rss-items article').count(),0)
  self.page.locator('[data-rss-source="lacrosse:rss:nll"]').check();self.page.wait_for_selector('.rss-items article');self.page.locator('[data-rss-source="lacrosse:rss:world-lacrosse"]').check();self.page.wait_for_function('document.querySelectorAll(".rss-items article").length===2');self.assertEqual(self.page.locator('.rss-items article h4').first.inner_text(),'Synthetic Olympic result');self.assertIn('Updates delayed',self.page.locator('.rss-items').inner_text());self.assertNotIn('Must never display',self.page.locator('.rss-items').inner_text())
  self.page.get_by_label('News category',exact=True).select_option('professional');self.assertEqual(self.page.locator('.rss-items article').count(),1);self.page.get_by_label('News category',exact=True).select_option('national');self.assertIn('Olympic',self.page.locator('.rss-items').inner_text());self.page.get_by_label('News category',exact=True).select_option('');self.page.get_by_label('RSS publisher',exact=True).select_option('lacrosse:rss:nll');self.assertEqual(self.page.locator('.rss-items article').count(),1)
  self.page.locator('#content-choices-news summary').click();reviewed=self.page.locator('#content-choices-news input:enabled').first;reviewed.check();reviewed_id=reviewed.get_attribute('data-content-source');self.assertIn('lacrosse:rss:nll',self.state()['profiles'][0]['contentSubscriptions']);self.page.locator('[data-rss-source="lacrosse:rss:nll"]').uncheck();self.page.locator('[data-rss-source="lacrosse:rss:nll"]').check();self.assertIn(reviewed_id,self.state()['profiles'][0]['contentSubscriptions'])
  before=self.state();self.page.reload();self.page.wait_for_selector('#show-tryouts',state='attached');self.section('My Feed');self.page.wait_for_function('document.querySelectorAll(".rss-items article").length===2');self.assertEqual(self.state(),before)
  out=Path('var/qa-rss');out.mkdir(parents=True,exist_ok=True)
  for name,w,h in [('desktop',1440,900),('ipad',810,1080),('iphone',390,844)]:
   self.page.set_viewport_size(dict(width=w,height=h));self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth+1'));self.page.locator('[data-rss-news]').screenshot(path=str(out/f'{base.ENGINE}-{name}.png'));self.assertGreaterEqual(self.page.get_by_role('button',name='Refresh news',exact=True).bounding_box()['height'],44)
  self.page.locator('[data-rss-news] summary').click();self.page.locator('[data-rss-source="lacrosse:rss:nll"]').uncheck();self.page.wait_for_function('document.querySelectorAll(".rss-items article").length===1');self.assertNotIn('lacrosse:rss:nll',self.state()['profiles'][0]['contentSubscriptions'])
 def test_03_failure_retry_and_pending_response_cannot_cross_athletes(self):
  self.page.route('**/api/rss-news?*',lambda r:r.fulfill(status=503,body='Unavailable'));self.page.reload();self.page.wait_for_selector('#show-tryouts',state='attached');self.section('My Feed');self.page.wait_for_selector('[data-rss-news][aria-busy=false]');self.assertIn('unavailable',self.page.locator('[data-rss-news] [role=status]').inner_text());self.page.unroute('**/api/rss-news?*');self.page.route('**/api/rss-news?*',self.fixture);self.page.get_by_role('button',name='Refresh news',exact=True).click();self.page.wait_for_selector('[data-rss-news][aria-busy=false]');self.page.locator('[data-rss-news] summary').click();self.page.locator('[data-rss-source="lacrosse:rss:nll"]').check();self.page.wait_for_selector('.rss-items article')
  state=self.state();first=state['profiles'][0];other=json.loads(json.dumps(first));other['id']='rss-second-athlete';other['nickname']='Second athlete';other['sport']='swimming';other['contentSubscriptions']=[];state['profiles'].append(other);self.page.evaluate('(v)=>localStorage.setItem("arenaPathway.v2",JSON.stringify(v))',state);self.page.unroute('**/api/rss-news?*');pending=[];self.page.route('**/api/rss-news?*',lambda r:pending.append(r));self.page.reload();self.page.wait_for_selector('#show-tryouts',state='attached');self.section('My Feed');self.page.wait_for_timeout(100);self.assertTrue(pending);self.page.locator('#profile-select').select_option(other['id']);self.section('My Feed');self.fixture(pending[0]);self.page.wait_for_timeout(150);
  for route in pending[1:]:self.fixture(route)
  self.page.wait_for_selector('[data-rss-news][aria-busy=false]');self.assertEqual(self.page.locator('.rss-items article').count(),0);self.assertEqual(self.state()['active'],other['id']);self.assertIn('lacrosse:rss:nll',self.state()['profiles'][0]['contentSubscriptions'])
 def test_04_all_four_sports_have_independent_publishers(self):
  for sport in ['lacrosse','basketball','volleyball','swimming']:
   if sport!='lacrosse':
    self.page.goto(base.BASE+'/build?new=1');self.page.wait_for_selector('#athlete-basics:not([disabled])');self.page.locator('#nickname').fill('Synthetic '+sport);self.page.locator('#sport').select_option(sport);self.page.locator('#guardian').check();self.page.get_by_role('button',name='Save athlete profile').click();self.page.wait_for_selector('#show-tryouts',state='attached')
   self.open();ids=self.page.locator('[data-rss-source]').evaluate_all('(xs)=>xs.map(x=>x.dataset.rssSource)');self.assertTrue(ids);self.assertTrue(all(i.startswith(sport+':rss:') for i in ids));self.assertEqual(self.page.locator('[data-rss-source]:checked').count(),0);self.assertEqual(self.page.locator('.rss-items article').count(),0)
  self.assertEqual(len(self.state()['profiles']),4)
if __name__=='__main__':unittest.main()
