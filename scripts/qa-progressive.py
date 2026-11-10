"""Existing release checks plus progressive directory, independent status and saved-family behavior."""
import importlib.util,unittest,os,socket,subprocess,shutil,time
from urllib.request import urlopen
from pathlib import Path
spec=importlib.util.spec_from_file_location('acquisition',Path(__file__).with_name('qa-acquisition.py'))
acquisition=importlib.util.module_from_spec(spec);spec.loader.exec_module(acquisition)
base=acquisition.base
class ProgressiveQA(acquisition.AcquisitionQA):
    def test_verified_org_without_program_or_registration_is_visible(self):
        self.page.goto(base.BASE+'/sports/lacrosse/youth?q=Foothills')
        card=self.page.locator('.club-result')
        self.assertEqual(card.count(),1)
        self.assertIn('verified organization',card.inner_text().casefold())
        self.assertIn('youth program confirmed',card.inner_text().casefold())
        self.assertIn('Registration status unknown',card.inner_text())
        card.locator('h2 a').click()
        self.assertEqual(self.page.locator('h1').inner_text(),'Foothills Pack')
        self.assertIn('No separately verified named program',self.page.locator('#programs').inner_text())
        self.assertEqual(self.page.locator('#teams tbody tr').count(),0)
        self.assertIn('No dated camps',self.page.locator('#opportunities').inner_text())
    def test_org_only_view_keeps_unknown_youth_and_current_filters_separate(self):
        self.page.goto(base.BASE+'/sports/lacrosse/youth?participation=all-verified&q=Kings')
        card=self.page.locator('.club-result');self.assertEqual(card.count(),1)
        self.assertEqual(card.locator('[data-verification="youth"]').count(),0)
        self.assertIn('Youth participation is not confirmed',card.inner_text())
        self.page.goto(base.BASE+'/sports/lacrosse/youth?q=Kings')
        self.assertEqual(self.page.locator('.club-result').count(),0)
        self.page.goto(base.BASE+'/sports/volleyball/youth?verification=current-season')
        self.assertEqual(self.page.locator('.club-result').count(),0)
        self.page.goto(base.BASE+'/sports/volleyball/youth?registration=unknown&q=EDGE')
        self.assertEqual(self.page.locator('.club-result').count(),1)
    def test_progressive_club_save_preserves_independent_family_modules(self):
        self.seed(base.profile('a',sport='lacrosse',modules=['teams','saved']),base.profile('b',sport='volleyball',modules=['community']))
        self.page.goto(base.BASE+'/sports/lacrosse/youth?q=Foothills')
        card=self.page.locator('.club-result');rid=card.get_attribute('data-record')
        card.get_by_role('button',name='Save',exact=True).click()
        self.page.wait_for_function('(id) => JSON.parse(localStorage.getItem("arenaPathway.v2")).profiles[0].saved.includes(id)',arg=rid)
        self.workspace()
        self.assertIn('Foothills Pack',self.page.locator('#saved-list').inner_text())
        self.assertEqual(self.page.locator('#workspace-nav a[href="#recruiting"]').count(),0)
        state=self.state();self.assertEqual(state['profiles'][0]['modules'],['teams','saved']);self.assertEqual(state['profiles'][1]['modules'],['community']);self.assertEqual(state['profiles'][1]['saved'],[])
    def test_progressive_mobile_tablet_desktop_profiles_and_filters(self):
        artifacts=base.ARTIFACTS.parent/'progressive-qa';artifacts.mkdir(exist_ok=True)
        for w,h in [(390,844),(768,1024),(1280,900)]:
            self.page.set_viewport_size({'width':w,'height':h})
            self.page.goto(base.BASE+'/sports/lacrosse/youth?q=RoughRiders')
            self.assertEqual(self.page.locator('.club-result').count(),1)
            self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth+1'))
            self.page.locator('.verification-gaps summary').first.click()
            self.assertTrue(self.page.locator('.verification-gaps[open]').first.is_visible())
            self.page.screenshot(path=str(artifacts/('directory-'+str(w)+'.png')),full_page=True)
            self.page.locator('.club-result h2 a').click()
            self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth+1'))
            self.assertIn('Registration status unknown',self.page.locator('main').inner_text())
            self.page.screenshot(path=str(artifacts/('profile-'+str(w)+'.png')),full_page=True)
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
