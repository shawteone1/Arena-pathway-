"""DGC presentation: existing synthetic fixtures, no real provider writes."""
import importlib.util,unittest,json
from pathlib import Path
spec=importlib.util.spec_from_file_location('prior',Path(__file__).with_name('qa-consolidated.py'));base=importlib.util.module_from_spec(spec);spec.loader.exec_module(base)
class DGC(base.Consolidated):
 def test_dgc_01_homepage_discovery_precedes_admin_and_anchors_work(self):
  p=self.page;p.goto(base.base.BASE+'/');self.assertIn('A place to belong.',p.locator('.hero-intro').inner_text());nav=p.get_by_role('navigation',name='Athlete experiences',exact=True);self.assertEqual(nav.locator('a').count(),3);self.assertLess(p.locator('#sports').bounding_box()['y'],p.locator('.mission').bounding_box()['y']);
  for label,target in [('Discover','#sports'),('Grow','#grow'),('Connect','#connect')]:
   link=nav.get_by_role('link',name=label,exact=False);self.assertEqual(link.get_attribute('href'),target);link.click();p.wait_for_function('(hash)=>location.hash===hash',arg=target)
  for w,h in [(1440,900),(810,1080),(390,844)]:
   p.set_viewport_size({'width':w,'height':h});self.assertFalse(p.evaluate('document.documentElement.scrollWidth>innerWidth+1'))
  self.assertIsNone(self.state())
 def test_dgc_02_all_sport_anchors_retain_full_results(self):
  p=self.page
  for sport in ['lacrosse','volleyball','basketball','swimming']:
   p.goto(base.base.BASE+'/sports/'+sport);p.wait_for_selector('.directory-records>article');self.assertGreaterEqual(p.locator('.directory-records>article').count(),13 if sport=='lacrosse' else 1);nav=p.get_by_role('navigation',name='Athlete experiences',exact=True)
   for label,id in [('Discover','sport-discover'),('Grow','sport-grow'),('Connect','sport-connect')]:self.assertEqual(nav.get_by_role('link',name=label,exact=False).get_attribute('href'),'#'+id);self.assertEqual(p.locator('#'+id).count(),1)
   self.assertEqual(p.locator('.sport-news-card img').count(),0)
 def test_dgc_03_editorial_covers_do_not_activate_sources_or_fake_photos(self):
  self.basic('lacrosse');p=self.page;self.nav('My Feed');self.assertEqual(p.locator('#my-feed .editorial-card').count(),0);self.follow('news');cards=p.locator('#my-feed .editorial-card');self.assertEqual(cards.count(),3);self.assertEqual(p.locator('#my-feed .editorial-fallback').count(),3);self.assertEqual(p.locator('#my-feed .editorial-card img').count(),0);self.assertTrue(all('lacrosse' in e.inner_text().lower() for e in p.locator('#my-feed .editorial-fallback').all()));self.assertGreater(p.locator('#my-feed time[datetime]').count(),0);p.locator('#my-feed .source-chips button').nth(1).click();self.assertEqual(p.locator('#my-feed .editorial-card').count(),1);self.assertTrue(p.locator('#my-feed .editorial-body h4 a').get_attribute('href').startswith('https://'));self.assertNotIn('recruiting',self.state()['profiles'][0]['modules']);self.nav('Development');self.follow('development');self.assertGreater(p.locator('#camps .editorial-fallback').count(),0);self.assertEqual(p.locator('#camps video,#camps iframe').count(),0)
 def test_dgc_04_profile_header_compacts_without_changing_identity_or_sections(self):
  athlete=self.basic();p=self.page;before=self.state();self.assertEqual(p.locator('#workspace').get_attribute('data-section'),'overview');profile_height=p.locator('#profile-summary').bounding_box()['height'];self.nav('My Feed');self.assertLess(p.locator('#profile-summary').bounding_box()['height'],profile_height);self.assertEqual(self.state(),before);self.assertEqual(p.locator('#profile-nav a').count(),5);self.nav('Profile');self.assertEqual(p.locator('#workspace').get_attribute('data-section'),'overview');self.assertEqual(self.state()['active'],athlete)
 def test_dgc_05_reduced_motion_and_responsive_feed_keep_controls_accessible(self):
  self.basic();p=self.page;self.nav('My Feed');self.follow('news');p.emulate_media(reduced_motion='reduce');card=p.locator('#my-feed .editorial-card').first;self.assertEqual(card.evaluate('(e)=>getComputedStyle(e).transitionDuration'),'0s');self.assertEqual(card.evaluate('(e)=>getComputedStyle(e).transform'),'none');self.assertEqual(p.locator('video[autoplay]').count(),0)
  for w,h in [(1440,900),(810,1080),(390,844)]:
   p.set_viewport_size({'width':w,'height':h});self.assertFalse(p.evaluate('document.documentElement.scrollWidth>innerWidth+1'));self.assertGreaterEqual(p.get_by_role('button',name='Retry news',exact=True).bounding_box()['height'],44)
  p.goto(base.base.BASE+'/');self.assertEqual(p.evaluate('getComputedStyle(document.documentElement).scrollBehavior'),'auto')
 def test_dgc_06_only_existing_season_and_achievement_are_presented(self):
  athlete=self.basic();p=self.page;self.assertEqual(p.locator('.recorded-achievement').count(),0);p.evaluate('''()=>{const s=JSON.parse(localStorage.getItem('arenaPathway.v2')),p=s.profiles.find(p=>p.id===s.active);p.seasonLabel='Fall 2026';p.records=[{id:'synthetic-record',eventRef:'synthetic-event',metrics:{Goals:2},achievement:'Synthetic family result'}];localStorage.setItem('arenaPathway.v2',JSON.stringify(s));}''');p.reload();p.wait_for_selector('#show-tryouts');self.assertEqual(p.locator('#profile-summary .profile-cover-caption').inner_text(),'Fall 2026');self.assertEqual(p.locator('.recorded-achievement').inner_text(),'Synthetic family result');self.assertEqual(self.state()['active'],athlete);self.assertEqual(self.state()['profiles'][0]['records'][0]['id'],'synthetic-record');self.assertNotIn('recruiting',self.state()['profiles'][0]['modules'])
for name in list(vars(base.Consolidated)):
 if name.startswith('test_'):setattr(DGC,name,None)
if __name__=='__main__':unittest.main(verbosity=2)
