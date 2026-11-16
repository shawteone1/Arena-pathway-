"""Editorial image, rights-boundary and responsive acceptance. Fixtures never activate production sources."""
import importlib.util,unittest,json
from pathlib import Path
spec=importlib.util.spec_from_file_location('rss',Path(__file__).with_name('qa-rss.py'));rss=importlib.util.module_from_spec(spec);spec.loader.exec_module(rss)
base=rss.base
OUT=Path('docs/rss-visual-20261116/after');OUT.mkdir(parents=True,exist_ok=True)
class Editorial(unittest.TestCase):
 setUpClass=classmethod(base.Remediation.setUpClass.__func__)
 tearDownClass=classmethod(base.Remediation.tearDownClass.__func__)
 setUp=base.Remediation.setUp
 tearDown=base.Remediation.tearDown
 state=base.Remediation.state
 section=base.Remediation.section
 fixture=rss.RSS.fixture
 open=rss.RSS.open
 def follow_reviewed(self):
  self.section('My Feed');self.page.wait_for_selector('[data-content-library=news][aria-busy=false]');choices=self.page.locator('#content-choices-news');choices.locator('summary').click()
  for cb in choices.locator('input:enabled').all():cb.check()
  choices.locator('summary').click();self.page.wait_for_selector('#my-feed .content-items .news-featured img');self.page.locator('#my-feed .content-items').evaluate("async e=>{await Promise.all([...e.querySelectorAll('img')].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));}")
 def assert_images(self):
  images=self.page.locator('#my-feed .content-items .news-cover img');self.assertGreater(images.count(),0)
  for img in images.all():self.assertTrue(img.evaluate('(e)=>e.complete&&e.naturalWidth>0'));self.assertIn('/assets/photos/',img.get_attribute('src'));self.assertTrue(img.get_attribute('alt'))
  self.assertEqual(self.page.locator('#my-feed .content-items .news-featured').count(),1)
  for figure in self.page.locator('#my-feed .content-items figure').all():self.assertIn('not article imagery',figure.inner_text());self.assertEqual(figure.get_by_role('link',name='Photo credits').get_attribute('href'),'/credits')
 def test_01_actual_four_sports_and_responsive_editorial(self):
  for sport in ['lacrosse','basketball','volleyball','swimming']:
   self.page.evaluate('(sport)=>{const s=JSON.parse(localStorage.getItem("arenaPathway.v2"));s.profiles.find(p=>p.id===s.active).sport=sport;localStorage.setItem("arenaPathway.v2",JSON.stringify(s));}',sport);self.page.reload();self.page.wait_for_selector('#profile-nav');self.follow_reviewed();self.assert_images()
   self.assertEqual(self.page.locator('.news-featured').first.evaluate('(e)=>getComputedStyle(e).backgroundColor'),'rgb(23, 36, 58)')
   self.assertEqual(self.page.locator('.news-featured h4 a').first.evaluate('(e)=>getComputedStyle(e).color'),'rgb(255, 255, 255)')
   for name,w,h in [('desktop',1440,900),('ipad',810,1080),('iphone',390,844)]:
    self.page.set_viewport_size(dict(width=w,height=h));self.page.locator('#my-feed .content-items').evaluate("async e=>{await Promise.all([...e.querySelectorAll('img')].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));}");self.page.evaluate('()=>document.activeElement?.blur()');self.page.wait_for_function('()=>!document.querySelector("#toast").textContent');self.assertFalse(self.page.evaluate('()=>document.documentElement.scrollWidth>innerWidth+1'))
    feature=self.page.locator('#my-feed .content-items .news-featured');self.assertGreaterEqual(feature.bounding_box()['width'],300)
    self.assertEqual(self.page.locator('#my-feed .content-items').evaluate('(e)=>getComputedStyle(e).gridTemplateColumns.split(" ").length'),1 if w==390 else 2)
    for button in self.page.locator('[data-content-library=news] .editorial-tools button,#my-feed .source-chips button').all():self.assertGreaterEqual(button.bounding_box()['height'],44)
    if sport=='lacrosse' or name=='ipad':self.page.locator('#my-feed').screenshot(path=str(OUT/f'{base.ENGINE}-{sport}-{name}.png'),animations='disabled')
    if sport=='lacrosse':self.page.screenshot(path=str(OUT/f'{base.ENGINE}-{sport}-{name}-context.png'),full_page=True,animations='disabled')
   self.assertEqual(self.state()['profiles'][0]['id'],self.athlete)
   self.assertEqual(self.page.locator('[data-rss-source]:enabled').count(),0)
 def test_02_rss_metadata_does_not_hotlink_and_feature_tracks_filter(self):
  attempted=[];self.page.on('request',lambda r:attempted.append(r.url) if 'unapproved-image.example' in r.url else None)
  def fixture(route):
   # Start with the existing sport-isolation fixture, adding a deliberately unapproved image.
   publishers=[dict(id='lacrosse:rss:nll',name='Test NLL',sport='lacrosse',coverage=['professional'],enabled=True,status='ready'),dict(id='lacrosse:rss:world-lacrosse',name='Test World',sport='lacrosse',coverage=['national'],enabled=True,status='ready')]
   items=[dict(id=str(n),sourceId=p['id'],publisher=p['name'],sport='lacrosse',title='Synthetic story '+str(n),url='https://example.com/'+str(n),summary='Synthetic story for layout validation only.',publishedAt='2026-11-1'+str(n)+'T10:00:00Z',topics=p['coverage'],imageCandidates=[dict(url='https://unapproved-image.example/story.jpg',displayApproved=True)]) for n,p in enumerate(publishers,1)]
   route.fulfill(content_type='application/json',body=json.dumps(dict(publishers=publishers,items=items)))
  self.page.route('**/api/rss-news?*',fixture);self.page.reload();self.page.wait_for_selector('#profile-nav');self.open()
  for sid in ['lacrosse:rss:nll','lacrosse:rss:world-lacrosse']:
   self.page.locator('[data-rss-source="'+sid+'"]').check();self.page.wait_for_selector('[data-rss-news][aria-busy=false]')
  self.page.wait_for_selector('.rss-items .news-featured img');self.assertEqual(self.page.locator('.rss-items .news-featured h4').inner_text(),'Synthetic story 2')
  self.page.get_by_label('RSS publisher',exact=True).select_option('lacrosse:rss:nll');self.assertEqual(self.page.locator('.rss-items .news-featured h4').inner_text(),'Synthetic story 1');self.assertEqual(self.page.locator('.rss-items article').count(),1)
  self.page.get_by_role('button',name='Refresh news',exact=True).click();self.page.wait_for_selector('[data-rss-news][aria-busy=false]');self.assertEqual(self.page.locator('.rss-items article').count(),1);self.assertEqual(attempted,[])
  self.page.reload();self.page.wait_for_selector('#profile-nav');self.section('My Feed');self.page.wait_for_selector('.rss-items .news-featured img');self.assertEqual(self.page.locator('.rss-items article').count(),2)
 def test_03_failed_photos_leave_readable_articles_and_reduced_motion(self):
  self.page.emulate_media(reduced_motion='reduce');self.page.route('**/assets/photos/lacrosse*.webp',lambda r:r.fulfill(status=404,body='Not available'))
  self.section('My Feed');self.page.wait_for_selector('[data-content-library=news][aria-busy=false]');choices=self.page.locator('#content-choices-news');choices.locator('summary').click()
  for cb in choices.locator('input:enabled').all():cb.check()
  choices.locator('summary').click();self.page.locator('#my-feed .content-items article').last.scroll_into_view_if_needed();self.page.wait_for_function('()=>document.querySelectorAll("#my-feed .content-items .news-cover").length===0')
  self.assertGreater(self.page.locator('#my-feed .content-items h4 a').count(),0);self.assertEqual(self.page.locator('#my-feed .content-items img').count(),0)
  self.assertEqual(self.page.locator('.news-featured h4 a').first.evaluate('(e)=>getComputedStyle(e).color'),'rgb(255, 255, 255)')
if __name__=='__main__':unittest.main()
