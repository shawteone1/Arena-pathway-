"""SIEM UX v2 browser QA. Local test server only; no provider accounts or publishing."""
import importlib.util
import os
import shutil
import socket
import subprocess
import time
import unittest
from pathlib import Path
from urllib.request import urlopen
spec=importlib.util.spec_from_file_location('workspace_qa',Path(__file__).with_name('qa-pathway.py'))
base=importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)

class PlatformQA(unittest.TestCase):
    setUpClass=classmethod(base.PathwayBrowserQA.setUpClass.__func__)
    tearDownClass=classmethod(base.PathwayBrowserQA.tearDownClass.__func__)
    setUp=base.PathwayBrowserQA.setUp
    tearDown=base.PathwayBrowserQA.tearDown

    def open(self,scenario='parent',mode='everyday'):
        self.page.goto(base.BASE+'/siem/platform?scenario='+scenario+'&mode='+mode)
        self.page.wait_for_selector('#platform-content .ap-stat')

    def test_modes_scenarios_and_responsive_layouts(self):
        for width,height in [(1440,1000),(768,1024),(390,844)]:
            self.page.set_viewport_size({'width':width,'height':height})
            for scenario in ['parent','coach','college']:
                self.open(scenario)
                for mode in ['everyday','command','display']:
                    self.page.locator('[data-mode='+mode+']').click()
                    self.assertEqual(self.page.locator('body').get_attribute('data-platform-mode'),mode)
                    self.assertEqual(self.page.locator('[data-mode='+mode+']').get_attribute('aria-pressed'),'true')
                    self.assertEqual(self.page.locator('h1').count(),1)
                    self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),str((scenario,mode,width)))
                    self.assertTrue(self.page.locator('[data-section=calendar]').is_visible())
                    self.assertTrue(self.page.locator('[data-section=actions]').is_visible())
                    if mode=='display':
                        self.assertEqual(self.page.locator('body').get_attribute('data-platform-privacy'),'true')
                    if mode=='everyday' or (scenario=='coach' and mode in ['command','display']):
                        self.page.evaluate('async()=>{await document.fonts.ready; await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));}')
                        self.page.screenshot(path=str(base.ARTIFACTS/f'siem-v2-{scenario}-{mode}-{width}.png'),full_page=True)

    def test_action_detail_duplicate_and_scenario_state_isolation(self):
        self.open(mode='command')
        self.assertEqual(self.page.locator('[data-alert=duplicate]').count(),1)
        self.assertEqual(self.page.locator('[data-section=calendar] .ap-activity').count(),4)
        self.page.locator('[data-alert=changed]').get_by_role('button',name='Review details').click()
        self.assertTrue(self.page.locator('#platform-detail').is_visible())
        self.assertIn('Version history',self.page.locator('#platform-detail').inner_text())
        self.page.locator('#platform-detail .ap-technical-details>summary').click()
        self.assertIn('Source identity',self.page.locator('#platform-detail').inner_text())
        self.page.keyboard.press('Escape')
        self.assertFalse(self.page.locator('#platform-detail').is_visible())
        self.page.locator('[data-alert=deadline]').get_by_role('button',name='Mark reviewed').click()
        self.assertIn('acknowledged',self.page.locator('[data-alert=deadline]').inner_text().lower())
        self.assertEqual(self.page.locator(':focus').get_attribute('id'),'platform-feedback')
        self.page.locator('[data-alert=deadline]').get_by_role('button',name='Resolve locally').click()
        self.assertIn('resolved',self.page.locator('[data-alert=deadline]').inner_text().lower())
        self.page.locator('#platform-settings').evaluate('(el)=>el.open=true')
        self.page.locator('#platform-scenario').select_option('coach')
        self.assertIn('open',self.page.locator('[data-alert=deadline]').inner_text().lower())
        self.page.locator('#platform-settings').evaluate('(el)=>el.open=true')
        self.page.locator('#platform-scenario').select_option('parent')
        self.assertIn('open',self.page.locator('[data-alert=deadline]').inner_text().lower())
        self.assertEqual(self.page.evaluate('localStorage.length'),0)

    def test_role_and_organization_isolation(self):
        self.open('coach','command')
        self.page.locator('.ap-multiselect').first.locator('summary').click()
        self.page.get_by_label('Summit Athletic Club',exact=True).check()
        self.assertNotIn('U17 · Field session',self.page.locator('#platform-content').inner_text())
        self.assertEqual(self.page.locator('[data-alert=conflict]').count(),0)
        self.assertTrue(self.page.get_by_label('Summit Athletic Club',exact=True).evaluate('(el)=>el===document.activeElement'))
        self.open('college','command')
        self.assertIn('Biology lab',self.page.locator('#platform-content').inner_text())
        self.assertNotIn('OTHER PERSON',self.page.locator('body').inner_text())
        self.page.get_by_label('Active role',exact=True).select_option('coach')
        body=self.page.locator('#platform-content').inner_text()
        self.assertIn('Skills coaching session',body)
        for text in ['Biology lab','Evening with friends','OTHER PERSON']:
            self.assertNotIn(text,body)
        self.assertEqual(self.page.locator('[data-alert=conflict]').count(),0)

    def test_privacy_redacts_dom_details_and_display_defaults(self):
        self.open(mode='command')
        self.page.locator('[data-alert=changed]').get_by_role('button',name='Review details').click()
        self.page.get_by_role('button',name='Close details').click()
        self.page.locator('#platform-privacy').click()
        text=self.page.locator('body').text_content()
        for value in ['Alex Morgan','Riley Morgan','Jamie Morgan','East Training Center','Morgan family','Training venue moved']:
            self.assertNotIn(value,text)
        self.assertEqual(self.page.locator('#platform-detail-content').inner_text(),'')
        self.assertEqual(self.page.locator('#platform-content button').count(),0)
        self.page.locator('#platform-privacy').click()
        self.assertIn('Alex · Swim training',self.page.locator('#platform-content').inner_text())
        self.page.locator('[data-mode=display]').click()
        self.assertEqual(self.page.locator('#platform-privacy').get_attribute('aria-pressed'),'true')

    def test_feed_health_refresh_and_pause(self):
        self.page.clock.install()
        self.open(mode='display')
        for state in ['fresh','stale','disconnected','failed']:
            self.assertGreater(self.page.locator('[data-health='+state+']').count(),0)
        source_text=self.page.locator('[data-section=sources]').inner_text()
        old=self.page.locator('#platform-refresh').inner_text()
        self.page.clock.fast_forward(61000)
        self.assertNotEqual(self.page.locator('#platform-refresh').inner_text(),old)
        self.assertEqual(self.page.locator('[data-section=sources]').inner_text(),source_text)
        self.page.locator('#platform-pause').click()
        old=self.page.locator('#platform-refresh').inner_text()
        self.page.clock.fast_forward(61000)
        self.assertEqual(self.page.locator('#platform-refresh').inner_text(),old)
        self.page.locator('#platform-refresh-now').click()
        self.assertIn('no provider was contacted',self.page.locator('#platform-feedback').inner_text())

    def test_keyboard_labels_touch_targets_and_dialog_focus(self):
        self.open(mode='command')
        self.page.locator('[data-mode=display]').focus()
        self.page.keyboard.press('Enter')
        self.assertEqual(self.page.locator('body').get_attribute('data-platform-mode'),'display')
        self.page.locator('[data-mode=command]').focus()
        self.page.keyboard.press('Enter')
        self.page.locator('#platform-privacy').click()
        b=self.page.locator('[data-section=calendar]').get_by_role('button',name='Details ↗').first
        b.focus()
        self.page.keyboard.press('Enter')
        self.assertTrue(self.page.locator('#platform-detail').is_visible())
        self.assertTrue(self.page.locator('#platform-detail :focus').count())
        self.page.keyboard.press('Escape')
        self.assertTrue(b.evaluate('(el)=>el===document.activeElement'))
        for control in self.page.locator('button:visible,select:visible').all():
            self.assertGreaterEqual(control.bounding_box()['height'],44)
        self.assertEqual(self.page.locator('main').count(),1)
        self.assertTrue(self.page.evaluate('Array.from(document.querySelectorAll("button")).filter(b=>b.getClientRects().length).every(b=>(b.getAttribute("aria-label")||b.textContent).trim().length>0)'))
        self.page.locator('#platform-settings').evaluate('(el)=>el.open=true')
        self.assertTrue(self.page.get_by_label('Demo experience',exact=True).is_visible())

    def test_no_provider_requests_or_family_storage_changes(self):
        self.page.goto(base.BASE+'/health')
        self.page.evaluate('localStorage.setItem("arenaPathway.siem.v1","keep-me");localStorage.setItem("arenaPathway.v2","also-keep-me")')
        requests=[]
        self.page.on('request',lambda req:requests.append(req.url))
        self.open()
        for scenario in ['coach','college','parent']:
            self.page.locator('#platform-settings').evaluate('(el)=>el.open=true')
            self.page.locator('#platform-scenario').select_option(scenario)
            self.page.locator('#platform-reset').click()
        self.assertEqual(self.page.evaluate('localStorage.getItem("arenaPathway.siem.v1")'),'keep-me')
        self.assertEqual(self.page.evaluate('localStorage.getItem("arenaPathway.v2")'),'also-keep-me')
        self.assertTrue(all(url.startswith(base.BASE) for url in requests))

if __name__=='__main__':
    server=None
    try:
        if not base.BASE:
            with socket.socket() as sock:
                sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
            base.BASE='http://127.0.0.1:'+str(port)
            server=subprocess.Popen([shutil.which('node'),'server.mjs'],cwd=base.ROOT,env=dict(os.environ,PORT=str(port)),stdout=subprocess.DEVNULL)
            for _ in range(100):
                try:
                    with urlopen(base.BASE+'/health',timeout=1):break
                except OSError:time.sleep(.1)
            else:raise RuntimeError('Local server did not start')
        unittest.main(verbosity=2)
    finally:
        if server:server.terminate();server.wait(timeout=10)
