"""Founder failure regression: real existing athlete -> gold identity -> one recruiting portfolio, four sports."""
import importlib.util,unittest,os,json
from pathlib import Path
spec=importlib.util.spec_from_file_location('r',Path(__file__).with_name('qa-recruiting-reconstruction-20261117.py'));r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r);r.base.OUT=Path('docs/recruiting-acceptance-20261117/after');r.base.OUT.mkdir(parents=True,exist_ok=True)
class Acceptance(r.Recruiting):
 def create(self,name,sport):
  athlete=super().create(name,sport);p=self.page;self.currentSport=sport;p.get_by_role('link',name='MY ATHLETES',exact=True).click();p.wait_for_selector('.athlete-identity-card');self.assertEqual(p.locator('.athlete-player-card .athlete-identity-card').count(),1);self.views(sport+'-parent-portal');p.get_by_role('link',name='View Profile',exact=True).click();p.wait_for_selector('.athlete-story');self.assertTrue(p.locator('.athlete-masthead .athlete-identity-card').is_visible());
  for title,fields in [('Profile',{'Jersey / lane label':'17'}),('About Me',{'About Me':'Fictional '+sport+' athlete: I learn with my team and keep improving my skills.'}),('Education',{'High school':'Fictional Academy','Graduation year':'2028'}),('Achievements',{'Achievements (one per line)':'Selected fictional team honour\nPrivate unselected honour'})]:
   p.get_by_role('button',name='Edit '+title,exact=True).click();d=p.get_by_role('dialog')
   for label,value in fields.items():d.get_by_label(label,exact=True).fill(value)
   d.get_by_role('button',name=__import__('re').compile('^Save ')).click();p.wait_for_function('()=>!document.querySelector("dialog[open]")');p.wait_for_selector('.athlete-story')
  self.identityAccent=p.locator('.athlete-masthead .athlete-identity-card').evaluate('e=>[...e.classList].find(c=>/^ap-athlete-/.test(c))');self.assertIn('17',p.locator('.athlete-masthead .athlete-identity-card').inner_text());self.views(sport+'-identity-and-profile');return athlete
 def edit(self,title,fields):
  p=self.page;existing=self.state()['profiles'][0];p.get_by_role('button',name='Edit '+title,exact=True).click();d=p.get_by_role('dialog')
  keys={'About Me':'aboutSport','High school':'highSchool','Graduation year':'graduationYear','Achievements (one per line)':'personalAchievements'}
  for label,value in fields.items():
   control=d.get_by_label(label,exact=True);key=keys.get(label)
   if key and existing.get(key):self.assertEqual(control.input_value(),'\n'.join(existing[key]) if isinstance(existing[key],list) else str(existing[key]))
   if control.input_value()!=value:control.fill(value)
  d.get_by_role('button',name=__import__('re').compile('^Save ')).click();p.wait_for_selector('#recruiting-experience[data-screen=information][aria-busy=false]')
 def views(self,name):
  p=self.page;sport=getattr(self,'currentSport','lacrosse')
  if p.locator('#recruiting-experience').count():
   self.assertEqual(p.locator('#template-recruiting,#optional-recruiting,#recruiting-form,#recruiting-profile-builder').count(),0)
   self.assertEqual(p.get_by_role('navigation',name='Recruiting journey').count(),1)
   self.assertEqual(p.get_by_role('navigation',name='Recruiting journey').get_by_role('button').all_text_contents(),['Explore Colleges','Prepare Recruiting Profile','Preview & Save'])
  if name=='recruiting-dashboard':
   r.base.Foundation.views(self,sport+'-recruiting-entry');p.get_by_role('navigation',name='Recruiting journey').get_by_role('button',name='Explore Colleges',exact=True).click();p.wait_for_selector('.college-program-card');self.assertEqual(p.get_by_label('Recruiting sport',exact=True).input_value(),sport);self.assertIn('No verified '+sport+' coaching contacts',p.locator('.college-program-card').first.inner_text() if p.locator('.college-program-card details').first.evaluate('e=>e.open') else p.locator('.college-program-card details').first.text_content());r.base.Foundation.views(self,sport+'-college-discovery');p.get_by_role('button',name='Return to My Presentation',exact=True).click();p.wait_for_selector('#recruiting-experience[data-screen=landing]')
  if name=='recruiting-builder':
   p.get_by_role('button',name='Choose content',exact=True).click();
   for label,w,h in [('desktop',1440,900),('ipad-portrait',810,1080),('ipad-landscape',1024,768),('phone',390,844)]:
    p.set_viewport_size({'width':w,'height':h});self.assertFalse(p.evaluate('document.documentElement.scrollWidth>innerWidth+1'));p.screenshot(path=str(r.base.OUT/(r.base.ENGINE+'-'+sport+'-composition-controls-'+label+'.png')),full_page=False,animations='disabled')
   p.set_viewport_size({'width':810,'height':1080});p.get_by_role('button',name='Done choosing content',exact=True).click();
   self.assertIn(self.identityAccent,p.locator('.presentation-live-preview .athlete-identity-card').get_attribute('class'));self.assertIn('Selected fictional team honour',p.locator('.presentation-live-preview').inner_text());self.assertEqual(p.locator('.presentation-live-preview video').count(),1);self.assertEqual(p.locator('.presentation-live-preview').evaluate('e=>getComputedStyle(e).maxHeight'),'none');self.assertIn('17',p.locator('.presentation-live-preview .identity-card-number').inner_text())
  # Capture each requested major surface for every adapter, not only Lacrosse.
  return r.base.Foundation.views(self,name if name.startswith(sport+'-') else sport+'-'+name)
 def test_shared_four_sport_finished_journey(self):
  # Inherited complete original workflow asserts individual selected results/media, playback,
  # focus/scroll, original IDs, school save, leave/reload, rebuild, approval and revocation.
  return super().test_shared_four_sport_finished_journey()
 def test_no_second_interface_and_profile_dependency_failure(self):
  p=self.page;athlete=r.base.Foundation.create(self,'Route isolation Demo','basketball');p.route('**/assets/profile-qa.js*',lambda route:route.abort());p.route('**/assets/content-library.js*',lambda route:route.abort());p.goto(r.base.BASE+'/recruiting?athlete='+athlete);p.wait_for_selector('#recruiting-experience[aria-busy=false]');self.assertEqual(p.locator('#template-recruiting,#recruiting-form,#recruiting-profile-builder,#optional-recruiting,#module-customizer').count(),0);self.assertTrue(p.locator('.athlete-identity-card').is_visible());p.get_by_role('navigation',name='Recruiting journey').get_by_role('button',name='Explore Colleges',exact=True).click();p.wait_for_selector('.college-program-card');self.assertEqual(p.get_by_label('Recruiting sport',exact=True).input_value(),'basketball');p.unroute('**/assets/profile-qa.js*');p.unroute('**/assets/content-library.js*');p.goto(r.base.BASE+'/my-pathway?athlete='+athlete+'#recruiting-profile-builder');p.wait_for_url('**/recruiting?athlete='+athlete);p.wait_for_selector('#recruiting-experience');self.assertEqual(p.locator('#recruiting-profile-builder').count(),0)
if __name__=='__main__':unittest.main(verbosity=2)
