"""WebKit fresh-load and Safari MediaQueryList compatibility regressions.
WEBKIT_PATH optionally selects a locally installed WebKit launcher; default is
Playwright's normal WebKit installation. No Safari user-agent spoof in Chromium.
"""
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import time
import unittest
from urllib.request import urlopen
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
ARTIFACTS=Path(os.environ.get('ARENA_QA_ARTIFACTS',ROOT/'var'/'webkit-qa'))
BASE=os.environ.get('ARENA_QA_BASE','')
LEGACY="""const original=window.matchMedia.bind(window);window.matchMedia=query=>{const media=original(query);Object.defineProperty(media,'addEventListener',{value:undefined});return media;};"""
NO_EVENTS="""const original=window.matchMedia.bind(window);window.matchMedia=query=>{const media=original(query);Object.defineProperty(media,'addEventListener',{value:undefined});Object.defineProperty(media,'addListener',{value:undefined});return media;};"""

class WebKitQA(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.p=sync_playwright().start()
        options={'headless':True}
        if os.environ.get('WEBKIT_PATH'):options['executable_path']=os.environ['WEBKIT_PATH']
        cls.browser=cls.p.webkit.launch(**options)
        ARTIFACTS.mkdir(parents=True,exist_ok=True)
        (ARTIFACTS/'engine.json').write_text(json.dumps({'engine':'WebKit','version':cls.browser.version,'physical_safari':False})+'\n')
    @classmethod
    def tearDownClass(cls):cls.browser.close();cls.p.stop()
    def setUp(self):
        self.ctx=self.browser.new_context(**self.p.devices['iPad (gen 7)'])
        self.page=self.ctx.new_page();self.errors=[];self.assets=[];self.failed=[]
        self.page.on('pageerror',lambda e:self.errors.append(str(e)))
        self.page.on('response',lambda r:self.assets.append({'path':r.url.replace(BASE,''),'status':r.status,'type':r.headers.get('content-type')}))
        self.page.on('requestfailed',lambda r:self.failed.append(r.url))
    def tearDown(self):self.ctx.close()
    def open(self,mode='everyday'):
        self.page.goto(BASE+'/siem/platform?scenario=family&mode='+mode)
        self.page.wait_for_selector('#platform-content[data-startup-state=ready] .ap-stat')
    def assert_family(self):
        self.assertEqual(self.errors,[])
        self.assertEqual(self.page.locator('.ap-stat').count(),3)
        self.assertEqual(self.page.get_by_label('Participant',exact=True).locator('option').count(),4)
        self.assertIn('Jordan · Volleyball practice',self.page.locator('[data-section=calendar]').text_content())
        self.assertIn('Alex · Soccer practice',self.page.locator('[data-section=calendar]').text_content())
        self.assertGreater(self.page.locator('[data-section=actions] .ap-action').count(),0)
        self.assertEqual(self.page.locator('[data-section=sources] .ap-feed').count(),5)
        for text in ['PlayMetrics','SportsEngine','TeamSnap','Slack','Locked In']:
            self.assertIn(text,self.page.locator('[data-section=sources]').inner_text())
        self.assertIn('unconnected',self.page.locator('.ap-source-summary').inner_text())
        self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth+1'))
        self.assertEqual(self.failed,[])
        for asset in self.assets:
            self.assertEqual(asset['status'],200,asset)
            if asset['path'].endswith('.js'):self.assertIn('javascript',asset['type'])
    def test_fresh_ipad_load_and_reload_renders_family(self):
        for orientation,width,height in [('portrait',810,1080),('landscape',1080,810)]:
            self.page.set_viewport_size({'width':width,'height':height});self.open();self.assert_family()
            self.page.screenshot(path=str(ARTIFACTS/f'webkit-family-{orientation}.png'))
            self.page.reload();self.page.wait_for_selector('.ap-stat');self.assert_family()
        (ARTIFACTS/'asset-responses.json').write_text(json.dumps(self.assets,indent=2)+'\n')
    def test_legacy_media_query_listener_renders_and_updates_sidebar(self):
        self.ctx.add_init_script(LEGACY);self.open();self.assert_family()
        self.assertEqual(self.page.locator('#platform-sidebar-toggle').get_attribute('aria-expanded'),'false')
        self.page.set_viewport_size({'width':1280,'height':900})
        for _ in range(30):
            if self.page.locator('#platform-sidebar-toggle').get_attribute('aria-expanded')=='true':break
            self.page.wait_for_timeout(50)
        self.assertEqual(self.page.locator('#platform-sidebar-toggle').get_attribute('aria-expanded'),'true')
        self.assert_family();self.page.screenshot(path=str(ARTIFACTS/'webkit-legacy-fixed.png'))
    def test_optional_resize_listener_absence_does_not_block_initialization(self):
        self.ctx.add_init_script(NO_EVENTS);self.open();self.assert_family()
        self.page.locator('#platform-sidebar-toggle').click()
        self.assertEqual(self.page.locator('#platform-sidebar-toggle').get_attribute('aria-expanded'),'true')
    def test_modes_filters_evidence_approval_and_privacy_in_webkit(self):
        self.open('command');self.assert_family()
        teams=self.page.locator('.ap-multiselect').nth(1)
        teams.locator('summary').click();self.assertEqual(teams.locator('input[type=checkbox]').count(),4)
        self.page.get_by_label('Participant',exact=True).select_option('taylor')
        self.assertNotIn('Alex · Soccer',self.page.locator('[data-section=calendar]').inner_text())
        self.page.get_by_role('button',name='Clear filters',exact=True).click()
        changed=self.page.locator('[data-alert=changed]').filter(has_text='Alex · Soccer practice')
        self.assertEqual(changed.count(),1);changed.get_by_role('button',name='Review details').click()
        text=self.page.locator('#platform-detail').inner_text()
        for name in ['PlayMetrics · FICTIONAL SOURCE','TeamSnap · FICTIONAL SOURCE','Slack · FICTIONAL SOURCE']:self.assertIn(name,text)
        self.page.get_by_role('button',name='Close details').click()
        self.page.locator('.ap-action').filter(has_text='Confirm Monday carpool coverage').first.get_by_role('button',name='Review details').click()
        self.page.get_by_role('button',name='Preview simulated action',exact=True).click()
        self.assertTrue(self.page.get_by_role('button',name='Approve simulation only').is_disabled())
        self.page.get_by_label('I approve this simulated action only',exact=True).check()
        self.page.get_by_role('button',name='Approve simulation only').click()
        self.assertIn('Nothing was sent',self.page.locator('#platform-feedback').inner_text())
        self.page.locator('[data-mode=display]').click()
        for name in ['Alex Rivera','Jordan Rivera','Taylor Rivera','Willow Creek']:self.assertNotIn(name,self.page.locator('body').text_content())
        self.assertEqual(self.page.locator('#platform-privacy').get_attribute('aria-pressed'),'true')
        self.assertEqual(self.errors,[])
    def test_module_load_failure_has_visible_recoverable_error(self):
        self.page.route('**/assets/siem-family-fixtures.js',lambda route:route.fulfill(status=404,content_type='text/plain',body='Missing test asset'))
        self.page.goto(BASE+'/siem/platform?scenario=family&mode=everyday')
        self.page.wait_for_selector('#platform-content[data-startup-state=error] [role=alert]')
        self.assertIn('dashboard could not start',self.page.locator('#platform-content').inner_text())
        self.assertTrue(self.page.get_by_role('button',name='Reload dashboard').is_visible())
        self.page.screenshot(path=str(ARTIFACTS/'webkit-asset-failure-visible.png'))

if __name__=='__main__':
    server=None
    try:
        if not BASE:
            with socket.socket() as sock:sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
            BASE='http://127.0.0.1:'+str(port)
            server=subprocess.Popen([shutil.which('node'),'server.mjs'],cwd=ROOT,env=dict(os.environ,PORT=str(port)),stdout=subprocess.DEVNULL)
            for _ in range(100):
                try:
                    with urlopen(BASE+'/health',timeout=1):break
                except OSError:time.sleep(.1)
            else:raise RuntimeError('Local server did not start')
        unittest.main(verbosity=2)
    finally:
        if server:server.terminate();server.wait(timeout=10)
