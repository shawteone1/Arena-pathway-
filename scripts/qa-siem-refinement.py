"""UX v2.1 density, responsive disclosure, timeline and accessible navigation QA.
Inherits the seven complete v2 behavior/role/privacy/browser regression checks.
"""
import importlib.util
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import time
import unittest
from urllib.request import urlopen
spec=importlib.util.spec_from_file_location('platform_qa',Path(__file__).with_name('qa-siem-platform.py'))
platform=importlib.util.module_from_spec(spec)
spec.loader.exec_module(platform)
base=platform.base

class RefinementQA(platform.PlatformQA):
    def test_first_screen_and_capture_comparison(self):
        metrics=[]
        for label,width,height in [('desktop',1440,900),('ipad-landscape',1024,768),('ipad-portrait',768,1024),('phone',390,844)]:
            self.page.set_viewport_size({'width':width,'height':height})
            for kind in ['parent','coach','college']:
                for mode in ['everyday','command','display']:
                    self.open(kind,mode)
                    self.page.evaluate('async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));}')
                    self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),str((label,kind,mode)))
                    measurements=self.page.evaluate('''()=>{const c=document.querySelector('[data-section=calendar] .ap-activity'),a=document.querySelector('[data-section=actions] .ap-action');return {kpiHeight:document.querySelector('.ap-stat').getBoundingClientRect().height,commitmentTop:c.getBoundingClientRect().top,commitmentTitleBottom:c.querySelector('h3').getBoundingClientRect().bottom,actionTop:a.getBoundingClientRect().top,actionTitleBottom:a.querySelector('h3').getBoundingClientRect().bottom,nextActionBottom:a.querySelector('.ap-next-step').getBoundingClientRect().bottom}}''')
                    self.assertLessEqual(measurements['kpiHeight'],64)
                    self.assertLess(measurements['commitmentTitleBottom'],height,str((label,kind,mode,measurements)))
                    self.assertLess(measurements['actionTitleBottom'],height,str((label,kind,mode,measurements)))
                    self.assertLess(measurements['nextActionBottom'],height,str((label,kind,mode,measurements)))
                    metrics.append({'viewport':label,'scenario':kind,'mode':mode,'height':height,**measurements})
                    if kind=='parent':self.page.screenshot(path=str(base.ARTIFACTS/f'{label}-{mode}.png'))
        (base.ARTIFACTS/'metrics.json').write_text(json.dumps(metrics,indent=2)+'\n')

    def test_sidebar_keyboard_touch_and_ipad_default(self):
        for width,height in [(1440,900),(1024,768),(768,1024),(390,844)]:
            self.page.set_viewport_size({'width':width,'height':height})
            self.open('college','command')
            toggle=self.page.locator('#platform-sidebar-toggle')
            self.assertEqual(toggle.get_attribute('aria-expanded'),'false' if 700<=width<=1180 else 'true')
            toggle.focus();self.page.keyboard.press('Enter')
            self.assertTrue(toggle.evaluate('(el)=>el===document.activeElement'))
            self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth+1'))
            toggle.click()
            self.page.locator('[data-mode=display]').focus();self.page.keyboard.press('Enter')
            self.assertEqual(self.page.locator('body').get_attribute('data-platform-mode'),'display')
            self.assertEqual(self.page.locator('#platform-privacy').get_attribute('aria-pressed'),'true')
            self.assertGreaterEqual(toggle.bounding_box()['height'],44)

    def test_compact_filters_keyboard_scope_and_disclosure(self):
        self.open('coach','command')
        more=self.page.locator('#platform-more-filters')
        self.assertFalse(more.evaluate('(el)=>el.open'))
        more.locator('summary').focus();self.page.keyboard.press('Enter')
        self.page.get_by_label('Source',exact=True).focus()
        self.page.get_by_label('Source',exact=True).select_option('Teamworks-club')
        self.assertIn('No upcoming commitments',self.page.locator('[data-section=calendar]').inner_text())
        self.assertTrue(self.page.get_by_label('Source',exact=True).evaluate('(el)=>el===document.activeElement'))
        self.assertTrue(more.evaluate('(el)=>el.open'))
        self.page.get_by_role('button',name='Clear filters',exact=True).click()
        self.assertGreater(self.page.locator('[data-section=calendar] .ap-activity').count(),0)
        self.page.set_viewport_size({'width':390,'height':844});self.open('college','command')
        self.page.locator('#platform-more-filters summary').first.click()
        self.page.get_by_label('Active role',exact=True).select_option('coach')
        text=self.page.locator('#platform-content').inner_text()
        self.assertIn('Skills coaching session',text)
        self.assertNotIn('Biology lab',text)
        self.assertNotIn('Evening with friends',text)

    def test_phone_full_calendar_and_action_controls_remain_available(self):
        self.page.set_viewport_size({'width':390,'height':844});self.open(mode='command')
        schedule=self.page.locator('.ap-more-schedule')
        self.assertFalse(schedule.evaluate('(el)=>el.open'))
        schedule.locator('summary').focus();self.page.keyboard.press('Enter')
        self.assertTrue(schedule.evaluate('(el)=>el.open'))
        self.assertTrue(schedule.locator('.ap-activity').last.is_visible())
        actions=self.page.locator('.ap-more-actions');actions.locator('summary').click()
        self.assertTrue(actions.evaluate('(el)=>el.open'))
        self.page.locator('[data-alert=deadline]').get_by_role('button',name='Mark reviewed').click()
        self.assertIn('Reviewed in this demo only',self.page.locator('#platform-feedback').inner_text())
        self.assertEqual(self.page.locator(':focus').get_attribute('id'),'platform-feedback')
        self.page.locator('#platform-privacy').click()
        self.assertNotIn('Alex Morgan',self.page.locator('body').text_content())
        self.assertEqual(self.page.locator('#platform-content button').count(),0)

    def test_alert_scan_lines_timeline_and_touch_targets(self):
        for width,height in [(1440,900),(768,1024),(390,844)]:
            self.page.set_viewport_size({'width':width,'height':height});self.open(mode='command')
            self.assertIn('today',self.page.locator('.ap-calendar-day').inner_text().lower())
            self.assertGreaterEqual(self.page.locator('.ap-day-heading').count(),2)
            for item in self.page.locator('.ap-action').all():
                self.assertIn('Impact ·',item.locator('.ap-impact').text_content())
                self.assertIn('Next ·',item.locator('.ap-next-step').text_content())
            for target in self.page.locator('.ap-platform button:visible,.ap-platform select:visible,.ap-platform summary:visible,.ap-stat a').all():
                self.assertGreaterEqual(target.bounding_box()['height'],44)
            self.assertIn('No live providers',self.page.locator('.ap-demo-banner').inner_text())

if __name__=='__main__':
    server=None
    try:
        if not base.BASE:
            with socket.socket() as sock:sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
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
