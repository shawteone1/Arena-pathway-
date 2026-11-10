"""Signature family walkthrough and regression QA; all feeds are local fixtures."""
import importlib.util
import os
import shutil
import socket
import subprocess
import time
import unittest
from pathlib import Path
from urllib.request import urlopen
spec=importlib.util.spec_from_file_location('refinement_qa',Path(__file__).with_name('qa-siem-refinement.py'))
refinement=importlib.util.module_from_spec(spec);spec.loader.exec_module(refinement)
base=refinement.base

class FamilyQA(refinement.RefinementQA):
    def family(self,mode='command'):
        self.page.goto(base.BASE+'/siem/platform?scenario=family&mode='+mode)
        self.page.wait_for_selector('.ap-stat')

    def test_signature_modes_devices_and_screenshots(self):
        for label,w,h in [('desktop',1440,900),('ipad-landscape',1024,768),('ipad-portrait',768,1024),('phone',390,844)]:
            self.page.set_viewport_size({'width':w,'height':h})
            for mode in ['everyday','command','display']:
                self.family(mode)
                self.assertEqual(self.page.locator('#platform-scenario').input_value(),'family')
                self.assertEqual(self.page.locator('h1').count(),1)
                self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),str((label,mode)))
                self.assertIn('May 6–12, 2030',self.page.locator('.ap-clock small').inner_text())
                self.assertIn('America/Denver',self.page.locator('.ap-clock small').inner_text())
                if mode=='display':self.assertEqual(self.page.locator('#platform-privacy').get_attribute('aria-pressed'),'true')
                else:self.assertIn('SportsEngine DEMO',self.page.locator('[data-section=calendar]').inner_text())
                self.page.evaluate('async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));}')
                self.page.screenshot(path=str(base.ARTIFACTS/f'family-{label}-{mode}.png'))
                if label=='desktop' and mode=='command':self.page.screenshot(path=str(base.ARTIFACTS/'family-desktop-command-full.png'),full_page=True)

    def test_family_cross_feed_change_and_sources(self):
        self.family()
        changed=self.page.locator('[data-alert=changed]').filter(has_text='Alex · Soccer practice')
        self.assertEqual(changed.count(),1)
        self.assertEqual(self.page.locator('[data-alert=duplicate]').count(),0)
        changed.get_by_role('button',name='Review details').click()
        dialog=self.page.locator('#platform-detail')
        for text in ['PlayMetrics · FICTIONAL SOURCE','TeamSnap · FICTIONAL SOURCE','Slack · FICTIONAL SOURCE','Source record: teamsnap-alex-mon','Version history','5:00 PM','4:30 PM','5:15 PM']:
            self.assertIn(text,dialog.inner_text())
        self.page.screenshot(path=str(base.ARTIFACTS/'family-correlated-change-detail.png'))
        self.page.keyboard.press('Escape')
        self.assertGreater(self.page.locator('[data-alert=conflict]').count(),0)

    def test_child_team_sport_and_source_filters(self):
        self.family()
        select=self.page.get_by_label('Participant',exact=True)
        self.assertEqual(select.locator('option').count(),4)
        select.select_option('taylor')
        self.assertNotIn('Alex · Soccer',self.page.locator('[data-section=calendar]').inner_text())
        self.assertNotIn('Jordan · Volleyball',self.page.locator('[data-section=calendar]').inner_text())
        more=self.page.locator('#platform-more-filters')
        if not more.evaluate('(el)=>el.open'):more.locator('summary').first.click()
        self.page.get_by_label('Sport',exact=True).select_option('volleyball')
        calendar=self.page.locator('[data-section=calendar]').inner_text()
        self.assertIn('Taylor · Volleyball',calendar);self.assertNotIn('Taylor · Soccer',calendar)
        self.page.get_by_role('button',name='Clear filters',exact=True).click()
        self.page.locator('.ap-multiselect').nth(1).locator('summary').click()
        self.page.get_by_label('Jordan · Rise 14U Volleyball',exact=True).check()
        calendar=self.page.locator('[data-section=calendar]').inner_text()
        self.assertIn('Jordan ·',calendar);self.assertNotIn('Alex ·',calendar)
        self.page.get_by_role('button',name='Clear filters',exact=True).click()
        more=self.page.locator('#platform-more-filters')
        if not more.evaluate('(el)=>el.open'):more.locator('summary').first.click()
        self.page.get_by_label('Source',exact=True).select_option('teamsnap-calendar')
        calendar=self.page.locator('[data-section=calendar]').inner_text()
        self.assertIn('Alex · Soccer practice',calendar)
        self.assertNotIn('Alex · Soccer league game',calendar)
        self.assertIn('TeamSnap',self.page.locator('[data-section=sources]').inner_text())

    def test_simulated_approval_no_sending_and_reset(self):
        self.family()
        action=self.page.locator('.ap-action').filter(has_text='Confirm Monday carpool coverage').first
        action.get_by_role('button',name='Review details').click()
        self.page.get_by_role('button',name='Preview simulated action',exact=True).click()
        approve=self.page.get_by_role('button',name='Approve simulation only',exact=True)
        self.assertTrue(approve.is_disabled())
        self.assertIn('NOTHING SENT',self.page.locator('#platform-detail').inner_text())
        self.page.get_by_label('I approve this simulated action only',exact=True).check()
        self.assertFalse(approve.is_disabled())
        approve.click()
        self.assertIn('Nothing was sent, submitted or changed',self.page.locator('#platform-feedback').inner_text())
        self.assertIn('resolved',self.page.locator('.ap-action').filter(has_text='Confirm Monday carpool coverage').first.inner_text().lower())
        self.page.locator('#platform-reset').click()
        self.assertIn('open',self.page.locator('.ap-action').filter(has_text='Confirm Monday carpool coverage').first.inner_text().lower())
        self.assertEqual(self.page.evaluate('localStorage.length'),0)

    def test_tournament_arrival_rsvp_and_locked_in_status(self):
        self.family()
        action=self.page.locator('.ap-action').filter(has_text='Jordan · Tournament RSVP due').first
        action.get_by_role('button',name='Review details').click()
        self.assertIn('Front Range volleyball tournament',self.page.locator('#platform-detail').inner_text())
        self.page.keyboard.press('Escape')
        self.page.locator('[data-section=calendar] .ap-activity').filter(has_text='Jordan · Front Range volleyball tournament').get_by_role('button',name='Details ↗').click()
        text=self.page.locator('#platform-detail').inner_text()
        for value in ['6:30 AM','7:15 AM','8:00 AM','Travel & arrival plan']:self.assertIn(value,text)
        self.page.keyboard.press('Escape')
        self.page.locator('.ap-action').filter(has_text='Locked In demo').first.get_by_role('button',name='Review details').click()
        text=self.page.locator('#platform-detail').inner_text()
        self.assertIn('SIMULATED Locked In status',text);self.assertIn('No document',text)

    def test_family_privacy_and_no_provider_requests(self):
        self.page.goto(base.BASE+'/health')
        self.page.evaluate('localStorage.setItem("arenaPathway.siem.v1","untouched")')
        requests=[];self.page.on('request',lambda r:requests.append(r.url))
        self.family('everyday')
        self.page.locator('[data-mode=display]').click()
        text=self.page.locator('body').text_content()
        for value in ['Alex Rivera','Jordan Rivera','Taylor Rivera','Willow Creek','Foothills U13','Casey','Drew']:
            self.assertNotIn(value,text)
        self.assertEqual(self.page.locator('#platform-content button').count(),0)
        self.page.locator('#platform-reset').click()
        self.assertTrue(all(url.startswith(base.BASE) for url in requests))
        self.assertEqual(self.page.evaluate('localStorage.getItem("arenaPathway.siem.v1")'),'untouched')
        self.assertEqual(self.page.locator('body').get_attribute('data-platform-privacy'),'true')

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
