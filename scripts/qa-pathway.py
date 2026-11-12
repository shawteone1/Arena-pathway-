"""Local Chromium interaction checks. Requires Python Playwright; no external accounts or publishing."""
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

ROOT = Path(__file__).resolve().parent.parent
KEY = 'arenaPathway.v2'
BASE = os.environ.get('ARENA_QA_BASE', '')
ARTIFACTS = Path(os.environ.get('ARENA_QA_ARTIFACTS', ROOT / 'var' / 'pathway-qa'))


def profile(id='a', **values):
    return dict(id=id, nickname=id, sport='volleyball', role='parent', guardian=True,
                region='all', goal='teams', interests=[], modules=[], saved=[], plans=[],
                recruiting={'checks': [], 'notes': ''}, mediaEnabled=False, mediaSources=[], **{}) | values


class PathwayBrowserQA(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        executable = os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('google-chrome')
        options = {'headless': True}
        if executable:
            options['executable_path'] = executable
        # A container's isolated test browser may not have a setuid Chromium sandbox.
        if os.environ.get('ARENA_QA_NO_SANDBOX') == '1':
            options['args'] = ['--no-sandbox']
        cls.browser = cls.playwright.chromium.launch(**options)
        ARTIFACTS.mkdir(parents=True, exist_ok=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 1280, 'height': 900}, accept_downloads=True, has_touch=True)
        self.page = self.context.new_page()
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [], 'Unexpected browser JavaScript errors')

    def seed(self, *profiles, active=None):
        self.page.goto(BASE + '/health')
        self.page.evaluate('(value) => localStorage.setItem("arenaPathway.v2", JSON.stringify(value))',
                           {'version': 2, 'profiles': list(profiles), 'active': active or profiles[0]['id']})
        self.workspace()

    def workspace(self):
        self.page.goto(BASE + '/my-pathway')
        self.page.wait_for_selector('#workspace:not([hidden])')
        self.page.wait_for_function('document.querySelector("#profile-select").options.length > 0')

    def state(self):
        return self.page.evaluate('JSON.parse(localStorage.getItem("arenaPathway.v2"))')

    def current(self):
        state = self.state()
        return next(p for p in state['profiles'] if p['id'] == state['active'])

    def navigation(self):
        return self.page.evaluate('async()=>{const m=await import("/assets/state.js");const s=m.loadState(localStorage);return m.modulesFor(s.profiles.find(p=>p.id===s.active));}')

    def choose(self, id, enabled=True):
        self.page.locator('#module-customizer').evaluate('(el) => el.open = true')
        self.page.locator('#choose-' + id).set_checked(enabled)
        if id == 'schedules':self.page.locator('#profile-nav a[href="#schedules"]').click()
        if id == 'recruiting' and enabled:self.page.locator('#recruiting').locator('..').evaluate('(el)=>el.open=true')

    def test_onboarding_choices_have_no_fixed_progression(self):
        self.page.goto(BASE + '/pathway/settings')
        self.assertEqual(self.page.locator('[name=workspace-module]:checked').count(), 0)
        self.assertFalse(self.page.locator('#media-enabled').is_checked())
        self.page.select_option('#role', 'parent')
        self.page.check('#guardian')
        self.page.fill('#nickname', 'My own adventure')
        self.page.select_option('#sport', 'swimming')
        self.page.select_option('#region', 'north')
        self.page.select_option('#goal', 'recruiting')
        self.page.check('[name=interests][value=community]')
        for id in ['community', 'camps', 'teams']:
            self.page.check('[name=workspace-module][value=' + id + ']')
        self.page.locator('#pathway-form button[type=submit]').click()
        self.page.wait_for_url('**/my-pathway')
        self.page.wait_for_selector('#workspace:not([hidden])')
        self.assertEqual(self.navigation(), ['community', 'camps', 'teams'])
        p = self.current()
        self.assertEqual((p['role'], p['guardian'], p['sport'], p['region']), ('parent', True, 'swimming', 'north'))
        self.assertEqual(p['interests'], ['community'])
        for id in ['recruiting', 'schedules', 'media']:
            self.assertEqual(self.page.locator('#' + id).count(), 1 if id == 'schedules' else 0)
        self.assertEqual(p['mediaSources'], [])

    def test_saving_club_preserves_identity_and_does_not_trigger_recruiting(self):
        self.seed(profile(modules=['teams']))
        self.page.goto(BASE + '/sports/volleyball/teams?kind=club&q=Denver%20Juniors')
        self.page.locator('[data-save=denver-juniors]').click()
        self.assertEqual(self.current()['saved'], ['denver-juniors'])
        self.assertEqual(self.current()['modules'], ['teams'])
        self.workspace()
        self.page.locator('#athlete-resource-nav a[href="#network"]').click()
        self.assertEqual(self.navigation(), ['teams'])
        self.assertEqual(self.page.locator('#recruiting-form').count(), 0)
        saved = self.page.locator('#saved-list')
        self.assertIn('Denver Juniors Volleyball Club', saved.inner_text())
        self.assertIn('18 associated teams', saved.inner_text())
        saved.locator('details summary').click()
        self.assertIn('Denver Juniors 11 Kiki', saved.inner_text())
        self.assertIn('/organizations/denver-juniors', saved.locator('a').first.get_attribute('href'))
        self.assertIn('denverjuniorsvc.com', saved.get_by_role('link', name='Official source').get_attribute('href'))

    def test_disabled_modules_leave_no_sections_or_links_and_keep_data(self):
        p = profile(modules=['teams', 'schedules', 'recruiting', 'media'], saved=['denver-juniors'],
                    plans=[{'id': 'p', 'name': 'Training', 'start': '2026-12-01', 'note': 'Gym'}],
                    recruiting={'checks': ['research'], 'notes': 'Preserve college research'},
                    mediaEnabled=True, mediaSources=['du-news'])
        self.seed(p)
        for id in ['recruiting', 'schedules', 'teams', 'media']:
            self.choose(id, False)
            self.assertNotIn(id, self.navigation())
            self.assertEqual(self.page.locator('#' + id).count(), 1 if id == 'schedules' else 0)
        self.assertTrue(self.page.locator('#profile-nav').is_visible())
        self.page.reload()
        self.page.wait_for_selector('#profile-nav')
        saved = self.current()
        for key in ['saved', 'plans', 'recruiting']:
            self.assertEqual(saved[key], p[key])
        self.assertEqual(saved['mediaSourcePreferences'], ['du-news'])
        for id in ['media', 'recruiting', 'schedules', 'teams']:
            self.choose(id)
        self.assertEqual(self.navigation(), ['media', 'recruiting', 'schedules', 'teams'])
        self.assertEqual(self.page.input_value('#recruiting-notes'), p['recruiting']['notes'])
        self.assertIn('Training', self.page.locator('#schedule-list').inner_text())
        self.assertIn('Denver Juniors', self.page.locator('#saved-list').inner_text())
        self.assertIn('Denver Pioneers Athletics', self.page.locator('#media-list').inner_text())

    def test_reorder_add_remove_is_persistent_and_keyboard_accessible(self):
        self.seed(profile(modules=['teams', 'community', 'camps']))
        self.page.locator('#module-customizer summary').click()
        self.page.locator('#move-camps-up').focus()
        self.page.keyboard.press('Enter')
        self.assertEqual(self.navigation(), ['teams', 'camps', 'community'])
        self.assertEqual(len(self.page.locator('#profile-nav a').all()), 5)
        self.assertEqual(self.page.locator(':focus').get_attribute('id'), 'move-camps-up')
        self.page.reload()
        self.page.wait_for_selector('#workspace:not([hidden])')
        self.assertEqual(self.navigation(), ['teams', 'camps', 'community'])
        self.choose('camps', False)
        self.choose('camps')
        self.assertEqual(self.navigation(), ['teams', 'community', 'camps'])

    def test_family_profiles_keep_separate_choices_and_new_profile_is_parent_controlled(self):
        a = profile(id='a', modules=['teams'], saved=['denver-juniors'])
        b = profile(id='b', nickname='Swim athlete', sport='swimming', modules=['recruiting', 'schedules'],
                    recruiting={'checks': ['questions'], 'notes': 'Swimming only'})
        self.seed(a, b)
        self.choose('community')
        self.page.select_option('#profile-select', 'b')
        self.assertEqual(self.navigation(), ['recruiting', 'schedules'])
        self.assertEqual(self.page.input_value('#recruiting-notes'), 'Swimming only')
        self.assertEqual(self.current()['saved'], [])
        self.page.select_option('#profile-select', 'a')
        self.assertEqual(self.navigation(), ['teams', 'community'])
        self.page.locator('#add-profile').click()
        self.page.wait_for_url('**/build?new=1')
        self.assertTrue(self.page.locator('#guardian').is_checked())
        self.page.fill('#nickname', 'Third athlete')
        self.page.locator('#athlete-form button[type=submit]').click()
        self.page.wait_for_url('**/my-pathway')
        self.page.wait_for_selector('#workspace:not([hidden])')
        self.assertEqual(self.navigation(), ['teams','saved','schedules','camps','community'])
        self.assertEqual(self.current()['saved'], [])
        self.assertEqual(self.current()['role'], 'parent')
        self.assertEqual(len(self.state()['profiles']), 3)
        self.page.select_option('#profile-select', 'a')
        self.assertEqual(self.navigation(), ['teams', 'community'])
        self.page.select_option('#profile-select', 'b')
        self.assertEqual(self.navigation(), ['recruiting', 'schedules'])
        self.assertEqual(self.current()['recruiting']['notes'], 'Swimming only')

    def test_media_sources_survive_disabled_module_and_builder_edits(self):
        self.seed(profile(modules=['media'], mediaEnabled=True, mediaSources=['du-news']))
        self.assertIn('Denver Pioneers Athletics', self.page.locator('#media-list').inner_text())
        self.assertNotIn('official club sites', self.page.locator('#media-list').inner_text())
        self.page.goto(BASE + '/pathway/settings')
        self.page.uncheck('#media-enabled')
        self.assertTrue(self.page.locator('[name=media-source][value=du-news]').is_checked())
        self.assertTrue(self.page.locator('[name=media-source][value=du-news]').is_disabled())
        self.page.check('[name=workspace-module][value=teams]')
        self.page.locator('#pathway-form button[type=submit]').click()
        self.page.wait_for_url('**/my-pathway')
        self.page.wait_for_selector('#workspace:not([hidden])')
        self.assertEqual(self.current()['mediaSources'], [])
        self.assertEqual(self.current()['mediaSourcePreferences'], ['du-news'])
        self.assertEqual(self.page.locator('#media').count(), 0)
        self.page.goto(BASE + '/pathway/settings')
        self.page.check('#media-enabled')
        self.assertTrue(self.page.locator('[name=media-source][value=du-news]').is_checked())
        self.assertFalse(self.page.locator('[name=media-source][value=club-updates]').is_checked())
        self.page.locator('#pathway-form button[type=submit]').click()
        self.page.wait_for_url('**/my-pathway')
        self.page.wait_for_selector('#media-list',state='attached')
        self.assertEqual(self.current()['mediaSources'], ['du-news'])
        self.assertNotIn('official club sites', self.page.locator('#media-list').inner_text())

    def test_calendar_and_recruiting_handlers_work_only_when_enabled(self):
        self.seed(profile(modules=[], saved=['frvc-camp']))
        self.choose('schedules')
        self.page.fill('#plan-title', 'Practice')
        self.page.fill('#plan-start', '2026-12-02')
        self.page.fill('#plan-note', 'Court two')
        self.page.locator('#schedule-form button[type=submit]').click()
        self.assertEqual(len(self.current()['plans']), 1)
        self.assertIn('Practice', self.page.locator('#schedule-list').inner_text())
        with self.page.expect_download() as download:
            self.page.locator('#export-calendar').click()
        destination = ARTIFACTS / 'calendar.ics'
        download.value.save_as(destination)
        self.assertIn('SUMMARY:Practice', destination.read_text())
        self.assertEqual(self.page.locator('#recruiting-form').count(), 0)
        self.choose('recruiting')
        self.page.check('[name=recruiting][value=research]')
        self.page.fill('#recruiting-notes', 'Family academic research')
        self.page.locator('#recruiting-form button[type=submit]').click()
        self.assertEqual(self.current()['recruiting']['notes'], 'Family academic research')
        self.choose('recruiting', False)
        self.choose('recruiting')
        self.assertTrue(self.page.locator('[name=recruiting][value=research]').is_checked())
        self.assertEqual(self.page.input_value('#recruiting-notes'), 'Family academic research')

    def test_legacy_saved_clubs_do_not_enable_recruiting(self):
        legacy = profile(saved=['denver-juniors'], recruiting={'notes': 'Old retained notes', 'checks': []})
        del legacy['modules']
        self.seed(legacy)
        self.assertEqual(self.navigation(), ['teams'])
        self.assertEqual(self.page.locator('#recruiting-form').count(), 0)
        self.choose('community')
        self.assertEqual(self.current()['recruiting']['notes'], 'Old retained notes')
        self.assertEqual(self.current()['modules'], ['teams', 'community'])

    def test_storage_failure_keeps_existing_choices_and_records(self):
        self.seed(profile(modules=['teams'], saved=['denver-juniors']))
        self.page.evaluate('() => { Storage.prototype.setItem = function() { throw new Error("Quota"); }; }')
        self.page.locator('#module-customizer').evaluate('(el) => el.open = true')
        self.page.locator('#choose-recruiting').click()
        self.assertEqual(self.navigation(), ['teams'])
        self.assertFalse(self.page.locator('#choose-recruiting').is_checked())
        self.assertEqual(self.current()['saved'], ['denver-juniors'])
        self.assertIn('Saving is unavailable', self.page.locator('#toast').inner_text())

    def test_mobile_and_tablet_controls_overflow_brand_and_screenshots(self):
        for width, height, name in [(390, 844, 'iphone'), (768, 1024, 'ipad'), (1280, 900, 'desktop')]:
            with self.subTest(viewport=name):
                self.page.set_viewport_size({'width': width, 'height': height})
                self.seed(profile(modules=['community', 'teams', 'schedules'], saved=['denver-juniors']))
                self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth > innerWidth'))
                self.page.locator('#module-customizer summary').click()
                self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth > innerWidth'))
                for box in self.page.locator('.module-order-controls button').all():
                    self.assertGreaterEqual(box.bounding_box()['height'], 44)
                self.page.locator('.module-choice-row:has(#choose-camps) label').tap()
                self.assertIn('camps', self.navigation())
                self.page.locator('#module-customizer').screenshot(path=str(ARTIFACTS / ('customizer-' + name + '.png')))
                self.page.locator('#module-customizer summary').click()
                self.page.locator('#sports-menu summary').click()
                self.assertEqual(self.page.locator('#sports-menu nav a').count(), 5)
                self.page.keyboard.press('Escape')
                self.assertFalse(self.page.locator('#sports-menu').evaluate('(el) => el.open'))
                self.assertEqual(self.page.locator('#recruiting').count(), 0)
                self.page.screenshot(path=str(ARTIFACTS / ('workspace-' + name + '.png')), full_page=True)
                self.page.screenshot(path=str(ARTIFACTS / ('workspace-overview-' + name + '.png')))
                self.page.goto(BASE + '/pathway/settings')
                self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth > innerWidth'))
                self.page.screenshot(path=str(ARTIFACTS / ('builder-' + name + '.png')), full_page=True)
                self.page.locator('#your-sources').screenshot(path=str(ARTIFACTS / ('module-choices-' + name + '.png')))


if __name__ == '__main__':
    server = None
    try:
        if not BASE:
            with socket.socket() as sock:
                sock.bind(('127.0.0.1', 0))
                port = sock.getsockname()[1]
            BASE = 'http://127.0.0.1:' + str(port)
            server = subprocess.Popen([shutil.which('node'), 'server.mjs'], cwd=ROOT,
                                      env=dict(os.environ, PORT=str(port)), stdout=subprocess.DEVNULL)
            for _ in range(100):
                try:
                    with urlopen(BASE + '/health', timeout=1) as response:
                        if response.status == 200:
                            break
                except OSError:
                    time.sleep(0.1)
            else:
                raise RuntimeError('Local QA server did not start')
        unittest.main(verbosity=2)
    finally:
        if server:
            server.terminate()
            server.wait(timeout=10)
