"""Integrated release QA: inherited workspace/data checks plus presentation and SIEM scenarios."""
import unittest
import importlib.util
from pathlib import Path
spec=importlib.util.spec_from_file_location('qa_unified',Path(__file__).with_name('qa-unified.py'))
unified=importlib.util.module_from_spec(spec)
spec.loader.exec_module(unified)
base=unified.base

class ReleaseQA(unified.UnifiedSportsQA):
    def test_release_pages_at_phone_tablet_desktop(self):
        routes=['/','/about','/offerings','/collective-data','/soccer-center','/siem','/demos/parent','/demos/coach','/demos/college']
        for width,height in [(390,844),(768,1024),(1280,900)]:
            self.page.set_viewport_size({'width':width,'height':height})
            for path in routes:
                self.page.goto(base.BASE+path)
                self.page.wait_for_load_state('networkidle')
                self.assertEqual(self.page.locator('h1').count(),1,path)
                self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth > innerWidth+1'),str((path,width)))
                self.assertEqual(self.page.locator('#sports-menu nav a').count(),5)
                self.page.locator('.explore-menu summary').click()
                self.assertTrue(self.page.get_by_role('link',name='About us',exact=True).first.is_visible())
                self.page.locator('.explore-menu summary').click()
                if path in ['/','/offerings','/demos/parent','/demos/coach','/demos/college']:
                    name=path.strip('/').replace('/','-') or 'homepage'
                    self.page.evaluate('async () => { document.querySelectorAll("img").forEach(i => i.loading="eager"); await Promise.all([...document.images].map(i => i.decode().catch(()=>{}))); await document.fonts.ready; }')
                    self.assertTrue(self.page.evaluate('Array.from(document.images).every(i=>i.complete && i.naturalWidth>0)'))
                    self.page.screenshot(path=str(base.ARTIFACTS/('release-'+name+'-'+str(width)+'.png')),full_page=True)

    def test_demo_actions_filters_and_no_family_state_mutation(self):
        self.seed(base.profile(modules=['teams','saved'],saved=['denver-juniors']))
        before=self.page.evaluate('localStorage.getItem("arenaPathway.v2")')
        for kind in ['parent','coach','college']:
            self.page.goto(base.BASE+'/demos/'+kind)
            self.page.wait_for_selector('.ap-stat')
            self.assertIn('/my-ap?',self.page.url)
            self.assertEqual(self.page.locator('#platform-scenario').input_value(),'family' if kind=='parent' else kind)
            self.page.locator('[data-mode=command]').click()
            item=self.page.locator('[data-alert=conflict]').first
            item.get_by_role('button',name='Mark reviewed',exact=True).click()
            self.assertIn('acknowledged',self.page.locator('[data-alert=conflict]').first.inner_text().lower())
            self.page.locator('#platform-reset').click()
            self.assertIn('open',self.page.locator('[data-alert=conflict]').first.inner_text().lower())
            self.assertEqual(self.page.evaluate('localStorage.getItem("arenaPathway.v2")'),before)
            self.assertIsNone(self.page.evaluate('localStorage.getItem("arenaPathway.siem.v1")'))

    def test_siem_lightweight_family_does_not_require_recruiting_profile(self):
        self.page.goto(base.BASE+'/siem/setup')
        self.page.locator('#siem-participant-add input[name=nickname]').fill('Demo child')
        self.page.locator('#siem-participant-add select[name=sport]').select_option('swimming')
        self.page.locator('#siem-participant-add button').click()
        self.assertIn('Demo child',self.page.locator('#siem-people').inner_text())
        self.page.locator('details.siem-local-tools > summary').click()
        f=self.page.locator('#siem-event')
        f.evaluate('(el)=>el.closest("details").open=true')
        f.locator('[name=title]').fill('Test practice')
        f.locator('[name=ref]').fill('practice-test')
        f.locator('[name=start]').fill('2030-01-01T16:00')
        f.locator('[name=end]').fill('2030-01-01T17:00')
        f.locator('button').click()
        self.assertIn('Test practice',self.page.locator('#siem-calendar').inner_text())
        self.page.reload()
        self.page.wait_for_selector('#siem-people .siem-person')
        self.page.locator('details.siem-local-tools > summary').click()
        self.assertIn('Demo child',self.page.locator('#siem-people').inner_text())
        self.assertIn('Test practice',self.page.locator('#siem-calendar').inner_text())
        self.assertIsNone(self.page.evaluate('localStorage.getItem("arenaPathway.v2")'))
        self.assertEqual(self.page.locator('#siem-event [name=athleteId] option').count(),1)

    def test_demo_keyboard_and_primary_touch_targets(self):
        self.page.goto(base.BASE+'/demos/parent')
        self.page.wait_for_selector('#platform-content .ap-action')
        self.page.get_by_label('Participant',exact=True).focus()
        self.assertEqual(self.page.locator(':focus').get_attribute('aria-label'),'Participant')
        for button in self.page.locator('#platform-content button:visible').all():
            self.assertGreaterEqual(button.bounding_box()['height'],44)
        self.page.keyboard.press('Tab')
        self.assertEqual(self.page.locator(':focus').count(),1)

if __name__ == '__main__':
    import os
    import shutil
    import socket
    import subprocess
    import time
    from urllib.request import urlopen
    server = None
    try:
        if not base.BASE:
            with socket.socket() as sock:
                sock.bind(('127.0.0.1', 0))
                port = sock.getsockname()[1]
            base.BASE = 'http://127.0.0.1:' + str(port)
            server = subprocess.Popen([shutil.which('node'), 'server.mjs'], cwd=base.ROOT,
                                      env=dict(os.environ, PORT=str(port)), stdout=subprocess.DEVNULL)
            for _ in range(100):
                try:
                    with urlopen(base.BASE + '/health', timeout=1):
                        break
                except OSError:
                    time.sleep(0.1)
            else:
                raise RuntimeError('Local server did not start')
        unittest.main(verbosity=2)
    finally:
        if server:
            server.terminate()
            server.wait(timeout=10)
