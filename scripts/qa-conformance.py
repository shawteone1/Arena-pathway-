"""Focused conformance acceptance, reusing the existing My AP browser harness.
MY_AP_BROWSER=webkit runs the same checks in actual WebKit.
"""
import os
from pathlib import Path
import runpy
import shutil
import socket
import subprocess
import time
import unittest
from urllib.request import urlopen
ROOT=Path(__file__).resolve().parent.parent
server=None
if not os.environ.get('ARENA_QA_BASE'):
    with socket.socket() as sock:
        sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
    os.environ['ARENA_QA_BASE']='http://127.0.0.1:'+str(port)
    server=subprocess.Popen([shutil.which('node'),'server.mjs'],cwd=ROOT,env=dict(os.environ,PORT=str(port)),stdout=subprocess.DEVNULL)
    for _ in range(100):
        try:
            with urlopen(os.environ['ARENA_QA_BASE']+'/health',timeout=1):break
        except OSError:time.sleep(.1)
    else:raise RuntimeError('Server failed to start')
base=runpy.run_path(str(ROOT/'scripts/qa-my-ap.py'))
BASE=os.environ['ARENA_QA_BASE']
OUT=Path(os.environ.get('ARENA_QA_ARTIFACTS',ROOT/'var'/'conformance-qa'));OUT.mkdir(parents=True,exist_ok=True)
ENGINE=os.environ.get('MY_AP_BROWSER','chromium')
class ConformanceQA(base['MyAPQA']):
    def test_quick_athlete_profile_edit_shared_identity_and_club_save(self):
        self.page.goto(BASE+'/build?new=1')
        self.page.locator('#nickname').fill('Local athlete')
        self.page.locator('#sport').select_option('swimming')
        self.assertIn('100m freestyle',self.page.locator('#position').get_attribute('placeholder'))
        self.page.locator('#club-team').fill('My existing team')
        self.page.locator('#position').fill('100m freestyle')
        self.page.get_by_role('button',name='Save athlete profile').click()
        self.page.wait_for_selector('#profile-summary h2')
        athlete=self.page.evaluate('JSON.parse(localStorage.getItem("arenaPathway.v2")).profiles[0]')
        for label in ['Schedule','Stats','Media','Development','Community','Network']:
            self.assertTrue(self.page.locator('#profile-nav').get_by_role('link',name=label,exact=True).is_visible())
        self.assertNotIn('recruiting',athlete['modules'])
        self.page.locator('#profile-nav').get_by_role('link',name='Stats',exact=True).click()
        self.assertTrue(self.page.locator('#stats').is_visible());self.assertFalse(self.page.locator('#schedules').is_visible())
        self.page.locator('#profile-nav').get_by_role('link',name='Schedule',exact=True).click()
        self.page.get_by_role('link',name='Edit athlete',exact=True).click()
        self.page.locator('#position').fill('200m freestyle')
        self.page.get_by_role('button',name='Save athlete profile').click()
        self.page.wait_for_selector('#profile-summary h2')
        self.assertIn('200m freestyle',self.page.locator('#profile-summary').inner_text())
        self.page.screenshot(path=str(OUT/f'{ENGINE}-athlete-profile.png'),full_page=True)
        self.page.goto(BASE+'/my-ap?section=family');self.page.wait_for_selector('#platform-content[data-startup-state=ready] .ap-local-athletes')
        self.assertIn('Local athlete',self.page.locator('.ap-local-athletes').inner_text())
        self.assertEqual(self.page.locator('.ap-local-athletes article').get_attribute('data-athlete-id'),athlete['id'])
        self.page.goto(BASE+'/siem/setup');self.page.wait_for_selector('#siem-people .siem-person');self.assertIn('Local athlete',self.page.locator('#siem-people').inner_text())
        self.page.goto(BASE+'/sports/swimming');self.page.locator('[data-save]').first.click()
        saved=self.page.evaluate('JSON.parse(localStorage.getItem("arenaPathway.v2")).profiles[0]')
        self.assertEqual(saved['id'],athlete['id']);self.assertTrue(saved['saved']);self.assertNotIn('recruiting',saved['modules'])
    def test_calendar_ranges_activity_labels_and_messages(self):
        self.open('/my-ap?section=calendar')
        calendar=self.page.locator('[data-section=calendar]')
        week=calendar.locator('.ap-activity').count()
        calendar.get_by_role('button',name='Day',exact=True).click()
        self.assertLess(calendar.locator('.ap-activity').count(),week)
        calendar.get_by_role('button',name='Month',exact=True).click()
        self.assertGreaterEqual(calendar.locator('.ap-activity').count(),week)
        self.assertGreater(calendar.locator('[data-activity-type=practice]').count(),0)
        self.assertGreater(calendar.locator('[data-activity-type=tournament]').count(),0)
        calendar.get_by_label('Calendar date',exact=True).fill('2040-01-01')
        self.assertIn('No commitments in this date range',calendar.inner_text())
        calendar.get_by_label('Calendar date',exact=True).fill('2030-05-06')
        self.page.screenshot(path=str(OUT/f'{ENGINE}-calendar-month.png'))
        self.section('messages')
        for message in self.page.locator('[data-section=communications] .ap-message').all():
            self.assertIn('SIMULATED NOTICE',message.inner_text());self.assertIn('MT',message.inner_text())
            self.assertTrue(message.get_by_role('button',name='Open related activities').is_visible())
        self.page.screenshot(path=str(OUT/f'{ENGINE}-messages.png'))
    def test_sport_entry_full_results_search_regions_mobile(self):
        self.page.set_viewport_size({'width':390,'height':844})
        for sport in ['lacrosse','volleyball','basketball','swimming']:
            self.page.goto(BASE+'/sports/'+sport)
            rows=self.page.request.get(BASE+'/api/data/directory?sport='+sport).json()
            self.assertEqual(self.page.locator('.club-result').count(),len(rows))
            self.page.locator('.engine-filter-options summary').click()
            self.assertIn('South Denver/DTC',self.page.locator('#region').inner_text())
            self.page.locator('#region').select_option('south-denver-dtc')
            self.page.get_by_role('button',name='Search',exact=False).click()
            self.page.wait_for_load_state('networkidle');self.page.evaluate('document.fonts.ready')
            self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),str(self.page.evaluate('()=>[...document.querySelectorAll("body *")].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>({tag:e.tagName,id:e.id,cls:e.className,width:e.getBoundingClientRect().width})).slice(0,15)')))
        self.page.goto(BASE+'/sports/lacrosse')
        self.page.screenshot(path=str(OUT/f'{ENGINE}-sport-directory.png'))

if __name__=='__main__':
    try:unittest.main(verbosity=2)
    finally:
        if server:server.terminate();server.wait(timeout=10)
