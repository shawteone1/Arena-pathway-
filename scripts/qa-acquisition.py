"""Consumer regression suite plus the loopback-only acquisition quality console."""
import unittest
import importlib.util
from pathlib import Path
import os, socket, subprocess, shutil, time
from urllib.request import urlopen
spec=importlib.util.spec_from_file_location('qa_release',Path(__file__).with_name('qa-release.py'))
release=importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)
base=release.base

class AcquisitionQA(release.ReleaseQA):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        with socket.socket() as s:
            s.bind(('127.0.0.1',0))
            port=s.getsockname()[1]
        cls.console_url='http://127.0.0.1:'+str(port)
        cls.console=subprocess.Popen([shutil.which('node'),'scripts/acquisition-console.mjs'],cwd=base.ROOT,env=dict(os.environ,ACQUISITION_CONSOLE_PORT=str(port)),stdout=subprocess.DEVNULL)
        for _ in range(100):
            try:
                with urlopen(cls.console_url,timeout=1):
                    break
            except OSError:
                time.sleep(.1)
        else:
            raise RuntimeError('Internal console failed to start')

    @classmethod
    def tearDownClass(cls):
        cls.console.terminate()
        cls.console.wait(timeout=10)
        super().tearDownClass()

    def test_internal_console_filters_drilldown_and_failed_source_evidence(self):
        self.page.goto(self.console_url+'/?sport=lacrosse')
        self.assertIn('ACCEPTANCE NOT MET',self.page.locator('main').inner_text())
        self.page.get_by_role('link',name='Manually reviewed identities',exact=True).click()
        self.assertEqual(self.page.locator('tbody tr').count(),4)
        self.assertIn('Northern Power',self.page.locator('tbody').inner_text())
        self.page.goto(self.console_url+'/?sport=volleyball&view=failedSources')
        summary=self.page.locator('summary').filter(has_text='RMR official club directory').first
        summary.click()
        self.assertIn('HTTP_403',self.page.locator('details[open]').first.inner_text())
        self.page.goto(self.console_url+'/?sport=lacrosse&view=consumerYouthOrganizations')
        self.assertIn('Denver Elite',self.page.locator('#baseline-names').inner_text())
        self.assertIn('Team 180',self.page.locator('#baseline-names').inner_text())
        self.assertNotIn('Northern Power',self.page.locator('#baseline-names').inner_text())

    def test_internal_console_phone_tablet_desktop_and_keyboard(self):
        artifacts=base.ARTIFACTS.parent/'acquisition-v2-qa'
        artifacts.mkdir(exist_ok=True)
        for w,h in [(390,844),(768,1024),(1280,900)]:
            self.page.set_viewport_size({'width':w,'height':h})
            self.page.goto(self.console_url+'/?sport=volleyball')
            self.assertEqual(self.page.locator('h1').count(),1)
            self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth > innerWidth+1'),str(w))
            self.assertGreaterEqual(self.page.get_by_role('button',name='Filter',exact=True).bounding_box()['height'],44)
            self.page.locator('[name=sport]').focus()
            self.assertEqual(self.page.locator(':focus').get_attribute('name'),'sport')
            self.page.screenshot(path=str(artifacts/('quality-'+str(w)+'.png')))

    def test_internal_console_unknown_region_and_readonly_api(self):
        self.page.goto(self.console_url+'/')
        self.page.select_option('[name=sport]','swimming')
        self.page.select_option('[name=region]','unknown')
        self.page.get_by_role('button',name='Filter',exact=True).click()
        self.assertIn('region=unknown',self.page.url)
        r=self.page.request.get(self.console_url+'/api/quality?sport=swimming&region=unknown')
        self.assertEqual(r.status,200)
        q=r.json()
        self.assertTrue(all(s['region']=='unknown' for s in q['sources']))
        self.assertEqual(q['stats']['monitoredSources'],0)
        self.assertEqual(self.page.request.post(self.console_url+'/').status,405)
        self.assertIsNone(self.page.evaluate('localStorage.getItem("arenaPathway.v2")'))

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
