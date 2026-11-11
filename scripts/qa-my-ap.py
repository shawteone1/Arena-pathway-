"""Consolidated My AP end-to-end acceptance in actual Chromium or WebKit."""
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
BASE=os.environ.get('ARENA_QA_BASE','')
ENGINE=os.environ.get('MY_AP_BROWSER','chromium')
OUT=Path(os.environ.get('ARENA_QA_ARTIFACTS',ROOT/'var'/'my-ap-qa'))
LEGACY="const original=window.matchMedia.bind(window);window.matchMedia=q=>{const m=original(q);Object.defineProperty(m,'addEventListener',{value:undefined});return m;}"

class MyAPQA(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.p=sync_playwright().start();options={'headless':True}
        if ENGINE=='webkit':
            if os.environ.get('WEBKIT_PATH'):options['executable_path']=os.environ['WEBKIT_PATH']
            cls.browser=cls.p.webkit.launch(**options)
        else:
            options['executable_path']=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
            if os.environ.get('ARENA_QA_NO_SANDBOX')=='1':options['args']=['--no-sandbox']
            cls.browser=cls.p.chromium.launch(**options)
        OUT.mkdir(parents=True,exist_ok=True)
    @classmethod
    def tearDownClass(cls):cls.browser.close();cls.p.stop()
    def setUp(self):
        self.ctx=self.browser.new_context(viewport={'width':1024,'height':768},has_touch=True)
        self.page=self.ctx.new_page();self.errors=[];self.page.on('pageerror',lambda e:self.errors.append(str(e)))
    def tearDown(self):
        self.ctx.close();self.assertEqual(self.errors,[])
    def ready(self):self.page.wait_for_selector('#platform-content[data-startup-state=ready] .ap-stat')
    def open(self,path='/my-ap'):self.page.goto(BASE+path);self.ready()
    def section(self,name):self.page.locator('[data-section-link='+name+']').click()
    def test_home_siem_opens_latest_family_and_four_sections(self):
        self.page.goto(BASE+'/');self.page.locator('.site-header a.my-link[href="/my-ap"]').click();self.ready()
        self.assertIn('/my-ap',self.page.url);self.assertEqual(self.page.locator('#platform-scenario').input_value(),'family')
        self.assertEqual(self.page.locator('#platform-sections button').count(),4)
        self.assertIn('What’s next?',self.page.locator('[data-section=calendar]').inner_text())
        self.section('calendar')
        self.assertEqual(self.page.locator('[data-section=calendar] .ap-activity').count(),17)
        self.assertIn('Jordan · Tournament RSVP due',self.page.locator('[data-section=calendar]').inner_text())
        self.section('messages');self.assertEqual(self.page.locator('[data-section=communications] .ap-message').count(),4)
        self.assertIn('Slack DEMO',self.page.locator('[data-section=communications]').inner_text())
        self.section('family');self.assertEqual(self.page.locator('.ap-family-grid article').count(),3)
        for name in ['Alex Rivera','Jordan Rivera','Taylor Rivera','Rise 12U Volleyball','Foothills U11 Soccer']:self.assertIn(name,self.page.locator('.ap-family-grid').inner_text())
        self.assertIn('not an authenticated family account',self.page.locator('[data-section=family]').inner_text())
    def test_exact_route_fresh_modern_and_legacy_initialization(self):
        for legacy in [False,True]:
            context=self.browser.new_context(viewport={'width':810,'height':1080},has_touch=True)
            if legacy:context.add_init_script(LEGACY)
            page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
            page.goto(BASE+'/siem/platform?scenario=family&mode=everyday');page.wait_for_selector('#platform-content[data-startup-state=ready] .ap-action')
            self.assertEqual(page.locator('.ap-stat').count(),3);self.assertEqual(page.locator('.ap-feed').count(),5)
            self.assertIn('Jordan · Volleyball practice',page.locator('[data-section=calendar]').text_content())
            page.reload();page.wait_for_selector('#platform-content[data-startup-state=ready] .ap-action')
            self.assertEqual(errors,[]);context.close()
    def test_navigation_preserves_actions_filters_and_source_drilldown(self):
        self.open('/my-ap?mode=command');self.page.locator('[data-alert=changed]').filter(has_text='Alex · Soccer practice').get_by_role('button',name='Review details').click()
        for source in ['PlayMetrics · FICTIONAL SOURCE','TeamSnap · FICTIONAL SOURCE','Slack · FICTIONAL SOURCE']:self.assertIn(source,self.page.locator('#platform-detail').inner_text())
        self.page.get_by_role('button',name='Close details').click()
        item=self.page.locator('.ap-action').filter(has_text='Confirm Monday carpool coverage').first
        item.get_by_role('button',name='Resolve locally').click()
        self.section('messages');self.section('day')
        self.assertIn('resolved',self.page.locator('.ap-action').filter(has_text='Confirm Monday carpool coverage').first.inner_text().lower())
        self.section('calendar');self.page.get_by_label('Participant',exact=True).select_option('taylor')
        self.assertNotIn('Alex · Soccer',self.page.locator('[data-section=calendar]').inner_text())
        self.section('messages');self.assertEqual(self.page.get_by_label('Participant',exact=True).input_value(),'taylor')
        self.page.locator('#platform-reset').click();self.assertEqual(self.page.get_by_label('Participant',exact=True).input_value(),'')
    def test_legacy_routes_and_local_family_setup_preserve_data(self):
        for path,scenario in [('/siem','family'),('/demos/parent','family'),('/demos/coach','coach'),('/demos/college','college')]:
            self.open(path);self.assertIn('/my-ap?',self.page.url);self.assertEqual(self.page.locator('#platform-scenario').input_value(),scenario)
            self.assertEqual(self.page.locator('script[src="/assets/release-demo.js"]').count(),0)
        self.page.goto(BASE+'/siem/setup')
        self.page.locator('#siem-participant-add input[name=nickname]').fill('Local test child')
        self.page.locator('#siem-participant-add button').click()
        before=self.page.evaluate('localStorage.getItem("arenaPathway.siem.v1")')
        self.open();self.section('family')
        self.assertNotIn('Local test child',self.page.locator('.ap-family-grid').inner_text())
        self.assertEqual(self.page.evaluate('localStorage.getItem("arenaPathway.siem.v1")'),before)
        self.page.get_by_role('link',name='Manage my browser-local family →').click()
        self.page.wait_for_selector('#siem-people .siem-person')
        self.assertIn('Local test child',self.page.locator('#siem-people').inner_text())
    def test_responsive_sections_modes_and_ipad_screenshots(self):
        for label,w,h in [('desktop',1440,900),('ipad-landscape',1024,768),('ipad-portrait',768,1024),('phone',390,844)]:
            self.page.set_viewport_size({'width':w,'height':h});self.open()
            for view in ['day','calendar','messages','family']:
                self.section(view)
                self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),str((ENGINE,label,view)))
                self.assertEqual(self.page.locator('h1').count(),1)
                if view=='calendar':self.assertTrue(self.page.locator('[data-section=calendar] .ap-activity').last.is_visible())
                self.page.evaluate('async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));}')
                self.page.screenshot(path=str(OUT/f'{ENGINE}-{label}-{view}.png'))
            for mode in ['everyday','command','display']:
                self.page.locator('[data-mode='+mode+']').click()
                self.assertEqual(self.page.locator('body').get_attribute('data-platform-mode'),mode)
                self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth+1'))
            self.assertEqual(self.page.locator('#platform-privacy').get_attribute('aria-pressed'),'true')
    def test_keyboard_privacy_settings_and_no_real_connection(self):
        self.open();self.page.locator('[data-section-link=messages]').focus();self.page.keyboard.press('Enter')
        self.assertEqual(self.page.locator('body').get_attribute('data-my-ap-section'),'messages')
        self.page.locator('#platform-settings summary').click();self.page.locator('#platform-settings-connections').click()
        self.assertTrue(self.page.locator('[data-section=sources]').is_visible())
        self.assertIn('fictional fixtures, not connected',self.page.locator('[data-section=sources]').inner_text())
        self.page.locator('[data-mode=display]').click();self.section('family')
        for name in ['Alex Rivera','Jordan Rivera','Taylor Rivera','Willow Creek','Rivera']:self.assertNotIn(name,self.page.locator('body').text_content())
        self.section('messages');self.assertIn('hidden',self.page.locator('[data-section=communications]').inner_text())
        for target in self.page.locator('#platform-sections button:visible,#platform-modes button:visible,#platform-sidebar-toggle').all():self.assertGreaterEqual(target.bounding_box()['height'],44)

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
