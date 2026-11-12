"""Nov12 integrated athlete, shared calendar, media and opt-in gates. No external writes."""
import os, sys, json, base64, unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
from playwright.sync_api import sync_playwright
BASE=os.environ.get('ARENA_QA_BASE','http://127.0.0.1:3000')
ENGINE=os.environ.get('PROFILE_BROWSER','chromium')
OUT=Path('var/qa-20261112');OUT.mkdir(parents=True,exist_ok=True)
class Remediation(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.pw=sync_playwright().start();cls.browser=getattr(cls.pw,ENGINE).launch(headless=True,executable_path=os.environ.get('WEBKIT_PATH') if ENGINE=='webkit' else '/usr/bin/chromium')
 @classmethod
 def tearDownClass(cls):cls.browser.close();cls.pw.stop()
 def setUp(self):
  self.context=self.browser.new_context(viewport={'width':810,'height':1080});self.page=self.context.new_page();self.errors=[];self.page.on('pageerror',lambda e:self.errors.append(str(e)));self.page.goto(BASE+'/build?new=1');self.page.wait_for_selector('#athlete-basics:not([disabled])');self.page.locator('#nickname').fill('QA Athlete');self.page.locator('#guardian').check();self.page.locator('#club-team').fill('Family-entered team');self.page.get_by_role('button',name='Save athlete profile').click();self.page.wait_for_selector('#profile-nav');self.page.wait_for_selector('#show-tryouts');self.athlete=self.state()['active']
 def tearDown(self):
  self.assertEqual(self.errors,[]);self.context.close()
 def state(self):return self.page.evaluate('JSON.parse(localStorage.getItem("arenaPathway.v2"))')
 def section(self,name):self.page.locator('#profile-nav, #athlete-resource-nav').get_by_role('link',name=name,exact=True).click()
 def add(self,kind='practice',repeat=False):
  self.section('Schedule');self.page.locator('#plan-title').fill('QA '+kind);self.page.locator('#plan-kind').select_option(kind);self.page.locator('#plan-start').fill('2026-11-16');self.page.locator('#plan-time').fill('17:00');self.page.locator('#plan-end-time').fill('18:00')
  if repeat:self.page.locator('#plan-repeat').select_option('weekly');self.page.locator('#plan-until').fill('2026-11-30')
  self.page.get_by_role('button',name='Add to schedule',exact=True).click();self.page.wait_for_selector('#schedule-list article')
 def test_01_recurring_edit_skip_export_and_parent_projection(self):
  self.add(repeat=True);self.assertEqual(self.page.locator('#schedule-list article').count(),3);raw=self.state()['profiles'][0];sid=raw['plans'][0]['id'];self.assertEqual(len(raw['plans']),1)
  self.page.get_by_role('button',name='Edit this occurrence').first.click();self.page.locator('#plan-title').fill('Moved practice');self.page.locator('#plan-start').fill('2026-11-17');self.page.locator('#plan-end').fill('2026-11-17');self.page.get_by_role('button',name='Save this occurrence',exact=True).click();self.assertIn('Moved practice',self.page.locator('#schedule-list').inner_text())
  self.page.get_by_role('button',name='Skip this occurrence').last.click();self.assertEqual(self.page.locator('#schedule-list article').count(),2)
  with self.page.expect_download() as d:self.page.locator('#export-calendar').click()
  text=Path(d.value.path()).read_text();self.assertIn(sid+'@2026-11-16@arena-pathway.local',text)
  self.page.get_by_role('link',name='Open family calendar').click();self.page.wait_for_selector('#platform-calendar');self.page.get_by_label('Calendar date',exact=True).fill('2026-11-17');self.page.get_by_label('Calendar date',exact=True).press('Tab');self.page.wait_for_selector('#platform-calendar .ap-activity');self.assertIn('Moved practice',self.page.locator('#platform-calendar').inner_text());self.assertEqual(len(self.state()['profiles'][0]['plans']),1)
  for view in ['Day','Week','Month']:self.page.get_by_role('button',name=view,exact=True).click()
  self.page.get_by_label('Activity category',exact=True).select_option('game');self.assertEqual(self.page.locator('#platform-calendar .ap-activity').count(),0)
  self.page.get_by_label('Activity category',exact=True).select_option('practice');self.page.screenshot(path=str(OUT/f'{ENGINE}-ipad-local-calendar.png'),full_page=True)
 def test_02_records_and_media_refs_survive_reload_and_athlete_switch(self):
  self.add(kind='game');self.section('Stats');self.page.locator('#record-event').select_option(index=1);self.page.locator('#metric-Goals').fill('3');self.page.locator('#record-achievement').fill('First recorded game');self.page.get_by_role('button',name='Save game / meet record').click();self.page.wait_for_selector('#stats .record');self.assertIn('Goals: 3',self.page.locator('#stats').inner_text())
  self.section('Media');self.page.locator('#media-upload').set_input_files({'name':'family.png','mimeType':'image/png','buffer':base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a8RQAAAAASUVORK5CYII=')});self.page.locator('#media-caption').fill('Family highlight');self.page.locator('#media-event').select_option(index=1);self.page.get_by_role('button',name='Save media',exact=True).click();self.page.wait_for_selector('#profile-media .record img');self.page.reload(wait_until='domcontentloaded');self.page.wait_for_selector('#profile-media .record img');self.assertEqual(self.page.locator('#profile-media .record input').input_value(),'Family highlight')
  items=self.page.evaluate('async id=>(await import("/assets/media-library.js")).listMedia(id).then(xs=>xs.map(x=>({athleteId:x.athleteId,eventRef:x.eventRef})))',self.athlete);self.assertEqual(items[0]['athleteId'],self.athlete);self.assertEqual(items[0]['eventRef'],self.state()['profiles'][0]['plans'][0]['id'])
  self.page.locator('#media-upload').set_input_files(str(Path(__file__).resolve().parent.parent/'test/fixtures/qa-family-video.mp4'));self.page.locator('#media-caption').fill('Synthetic family video');self.page.locator('#media-event').select_option(index=1);self.page.get_by_role('button',name='Save media',exact=True).click();self.page.wait_for_selector('#profile-media .record video');self.page.reload(wait_until='domcontentloaded');self.page.wait_for_selector('#profile-media .record video');self.assertEqual(self.page.locator('#profile-media .record').count(),2)
  video=self.page.locator('#profile-media video');video.evaluate('(e)=>e.load()');self.page.wait_for_function('()=>document.querySelector("#profile-media video")?.readyState>=2');self.assertTrue(video.evaluate('async e=>{e.muted=true;await e.play();return !e.paused}'));video.evaluate('(e)=>e.pause()');(OUT/(ENGINE+'-video.json')).write_text(json.dumps(video.evaluate('(e)=>({readyState:e.readyState,mediaError:e.error?.code||null,canPlayMP4:e.canPlayType(\'video/mp4; codecs="avc1.42E01E"\')})')))
  self.page.screenshot(path=str(OUT/f'{ENGINE}-ipad-media.png'),full_page=True)
  self.page.goto(BASE+'/build?new=1');self.page.wait_for_selector('#athlete-basics:not([disabled])');self.page.locator('#nickname').fill('Other athlete');self.page.get_by_role('button',name='Save athlete profile').click();self.page.wait_for_selector('#profile-nav');self.section('Media');self.page.wait_for_selector('#media-upload');self.assertEqual(self.page.locator('#profile-media .record').count(),0)
 def test_03_optional_sources_tryouts_and_recruiting(self):
  self.page.locator('#show-tryouts').check();self.page.wait_for_selector('#show-tryouts:checked');self.section('My Feed');self.page.wait_for_selector('#my-feed [data-content-library]');self.page.locator('#content-choices-news').evaluate('(e)=>e.open=true');self.assertEqual(self.page.locator('#my-feed input[type=checkbox]').count(),5);self.assertNotIn('recruiting',self.state()['profiles'][0]['modules']);self.section('Development');self.page.wait_for_selector('#camps [data-content-library]');self.assertEqual(self.page.locator('#camps [data-content-library] input[type=checkbox]').count(),5)
  self.page.goto(BASE+'/recruiting');self.page.get_by_role('button',name='Open local recruiting planner').click();self.page.get_by_text('Parent-controlled recruiting preview',exact=True).click();self.page.wait_for_selector('#recruiting-rules');self.assertTrue(self.page.get_by_role('button',name='Parent approve local preview').is_disabled());self.assertIn('Coach sharing is not connected',self.page.locator('#recruiting').inner_text())
 def test_04_responsive_profile_parent_navigation(self):
  for name,w,h in [('desktop',1440,900),('ipad',810,1080),('iphone',390,844)]:
   self.page.set_viewport_size({'width':w,'height':h});self.page.goto(BASE+'/my-pathway?view=family');self.page.wait_for_selector('.family-athlete-card');self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth+1'));self.page.screenshot(path=str(OUT/f'{ENGINE}-{name}-parent.png'),full_page=True);self.page.get_by_role('link',name='View Athlete').click();self.page.wait_for_selector('#show-tryouts');self.assertEqual(self.state()['active'],self.athlete);self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth+1'));self.page.screenshot(path=str(OUT/f'{ENGINE}-{name}-athlete.png'),full_page=True)
 def test_05_categories_delete_and_import_preview_deduplicate(self):
  for kind in ['practice','game','meet','tournament','camp','travel','other']:self.add(kind=kind)
  self.assertEqual(len(self.state()['profiles'][0]['plans']),7)
  for kind in ['practice','game','meet','tournament','camp','travel','other']:
   self.page.locator('#schedule-category').select_option(kind);self.assertEqual(self.page.locator('#schedule-list article').count(),1)
  self.page.locator('#schedule-category').select_option('game');self.page.once('dialog',lambda d:d.accept());self.page.get_by_role('button',name='Delete event',exact=True).click();self.assertEqual(len(self.state()['profiles'][0]['plans']),6)
  self.page.get_by_text('Import an expanded calendar snapshot',exact=True).click()
  text='BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:external-qa-1\r\nSUMMARY:Family travel snapshot\r\nDTSTART;VALUE=DATE:20261121\r\nDTEND;VALUE=DATE:20261124\r\nEND:VEVENT\r\nEND:VCALENDAR'
  self.page.locator('#schedule-import').set_input_files({'name':'snapshot.ics','mimeType':'text/calendar','buffer':text.encode()});self.page.get_by_role('button',name='Add reviewed events').click();self.assertEqual(len(self.state()['profiles'][0]['plans']),7)
  self.page.get_by_text('Import an expanded calendar snapshot',exact=True).click();self.page.locator('#schedule-import').set_input_files({'name':'snapshot.ics','mimeType':'text/calendar','buffer':text.encode()});self.assertTrue(self.page.get_by_role('button',name='Add reviewed events').is_disabled())
 def test_06_parent_local_preview_and_revocation(self):
  self.page.get_by_text('About My Sport · Positions and Goals',exact=True).click();self.page.locator('#athlete-age').fill('16');self.page.locator('#athlete-about').fill('Family-entered athlete story');self.page.get_by_role('button',name='Save details',exact=True).click();self.page.goto(BASE+'/recruiting');self.page.get_by_role('button',name='Open local recruiting planner').click();self.page.get_by_text('Parent-controlled recruiting preview',exact=True).click();self.page.locator('#recruiting-rules').check();self.page.get_by_label('Include identity',exact=True).check();self.page.get_by_role('button',name='Parent approve local preview').click();self.assertIn('QA Athlete',self.page.locator('.recruiting-preview').inner_text());self.assertTrue(self.state()['profiles'][0]['recruiting']['parentApproved']);self.page.get_by_role('button',name='Revoke preview approval').click();self.assertFalse(self.state()['profiles'][0]['recruiting']['parentApproved']);self.assertIn('No coach link',self.page.locator('.recruiting-preview').inner_text())
 def test_07_slack_reply_is_local_draft_and_no_posts(self):
  writes=[];self.page.on('request',lambda r:writes.append(r.url) if r.method not in ['GET','HEAD'] else None);self.page.goto(BASE+'/my-ap?scenario=family&section=messages');draft=self.page.get_by_label('Slack demo reply draft').first;draft.fill('Parent will review the pickup plan.');self.page.get_by_role('button',name='Save demo reply draft').first.click();self.assertIn('Nothing sent to Slack',self.page.locator('#platform-feedback').inner_text());self.page.reload();self.assertEqual(self.page.get_by_label('Slack demo reply draft').first.input_value(),'Parent will review the pickup plan.');self.assertEqual(writes,[])
if __name__=='__main__':unittest.main(verbosity=2)
