"""Unified hierarchy acceptance checks in isolated, local Chromium contexts."""
import unittest
import importlib.util
from pathlib import Path
spec = importlib.util.spec_from_file_location('qa_pathway', Path(__file__).with_name('qa-pathway.py'))
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)


class UnifiedSportsQA(base.PathwayBrowserQA):
    def test_directory_separation_club_first_and_team_search(self):
        self.page.goto(base.BASE + '/sports/volleyball/youth?q=Denver%20Juniors')
        self.assertEqual(self.page.locator('.club-result').count(), 1)
        self.assertEqual(self.page.locator('.club-result').get_attribute('data-organization'), 'denver-juniors')
        self.page.fill('#q', 'Kiki')
        self.page.locator('form[role=search] button[type=submit]').click()
        self.assertEqual(self.page.locator('.club-result').count(), 1)
        self.assertIn('Denver Juniors 11 Kiki', self.page.locator('.matched-teams').inner_text())
        self.page.get_by_role('link', name='View Arena Pathway profile').click()
        self.assertIn('Denver Juniors', self.page.locator('h1').inner_text())
        self.assertEqual(self.page.locator('tr[data-team]').count(), 18)
        self.assertIn('Source provenance', self.page.locator('#sources').inner_text())
        self.page.goto(base.BASE + '/sports/lacrosse/youth')
        self.assertFalse(self.page.locator('.club-result:has-text("Colorado Lacrosse League")').count())
        self.page.goto(base.BASE + '/sports/lacrosse/adult')
        self.assertTrue(self.page.locator('.club-result:has-text("Colorado Lacrosse League")').count())

    def test_swimming_distinguishes_year_round_seasonal_summer_and_masters(self):
        for format, query, expected in [('year-round-competitive', 'ACES', 'Year-round competitive'),
                                         ('seasonal-competitive', 'Canon', 'Seasonal USA Swimming'),
                                         ('summer-recreational', 'Fox', 'Summer recreational leagues')]:
            self.page.goto(base.BASE + '/sports/swimming/youth?format=' + format + '&q=' + query)
            self.assertGreater(self.page.locator('.club-result').count(), 0)
            self.assertIn(expected, self.page.locator('.club-result').first.inner_text())
        self.page.goto(base.BASE + '/sports/swimming/youth?format=masters')
        self.assertEqual(self.page.locator('.club-result').count(), 0)
        self.page.goto(base.BASE + '/sports/swimming/adult?format=masters')
        self.assertGreater(self.page.locator('.club-result').count(), 0)

    def test_league_to_feeder_profile_keeps_registration_and_ownership_truthful(self):
        self.page.goto(base.BASE + '/sports/basketball/youth?kind=league')
        self.page.locator('.club-result:has-text("Gold Crown Foundation")').get_by_role('link', name='View Arena Pathway profile').click()
        self.assertIn('team', self.page.locator('.participation-facts').first.inner_text())
        self.assertIn('unknown availability', self.page.locator('.participation-facts').first.inner_text())
        self.assertIn('Published feeder & club program resources', self.page.locator('main').inner_text())
        link = self.page.get_by_role('link', name='Arapahoe Feeder Program', exact=True)
        self.assertEqual(link.count(), 1)
        link.click()
        self.assertIn('Arapahoe Feeder Program', self.page.locator('h1').inner_text())
        text = self.page.locator('main').inner_text()
        self.assertIn('Published venue:', text)
        self.assertIn('not a current fixture', text)
        self.assertIn('No verified named competition teams', text)

    def test_seven_modules_saved_opportunities_and_youth_recommendations(self):
        self.seed(base.profile(modules=['teams', 'saved'], saved=['denver-juniors', 'frvc-camp']))
        self.assertEqual(self.navigation(), ['teams', 'saved'])
        self.assertIn('Front Range high school team camp', self.page.locator('#opportunity-saved').inner_text())
        self.assertNotIn('Front Range high school team camp', self.page.locator('#saved-list').inner_text())
        self.assertEqual(self.page.locator('#recruiting').count(), 0)
        self.page.goto(base.BASE + '/pathway/settings')
        self.assertEqual(self.page.locator('[name=workspace-module]').count(), 7)
        self.page.select_option('#participation-level', 'competitive')
        self.page.select_option('#participation-designation', 'youth')
        self.page.locator('#pathway-form button[type=submit]').click()
        self.page.wait_for_url('**/my-pathway')
        self.page.wait_for_selector('#workspace:not([hidden])')
        self.assertEqual(self.current()['participationLevel'], 'competitive')
        self.assertNotIn('recruiting', self.navigation())
        self.page.goto(base.BASE + '/pathway/settings')
        self.assertEqual(self.page.input_value('#participation-level'), 'competitive')

    def test_verified_school_programs_and_real_named_tiers(self):
        self.page.goto(base.BASE + '/sports/volleyball/high-school?q=Niwot')
        self.assertEqual(self.page.locator('.club-result').count(), 1)
        self.page.get_by_role('link', name='View Arena Pathway profile').click()
        self.assertEqual(self.page.locator('tr[data-team]').count(), 7)
        self.assertIn('Junior Varsity', self.page.locator('#teams').inner_text())
        self.assertIn('Unconfirmed', self.page.locator('#teams').inner_text())

    def test_mobile_tablet_directory_profile_and_review_accessibility(self):
        for width, height, name in [(390, 844, 'iphone'), (768, 1024, 'ipad'), (1280, 900, 'desktop')]:
            self.page.set_viewport_size({'width': width, 'height': height})
            for path, artifact in [('/sports/basketball/youth?grade=6&gender=boys', 'youth-directory'),
                                   ('/organizations/denver-juniors?sport=volleyball', 'club-profile'),
                                   ('/data/classification', 'classification-report')]:
                self.page.goto(base.BASE + path)
                self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth > innerWidth'), name + path)
                self.assertEqual(self.page.locator('#sports-menu nav a').count(), 5)
                self.assertEqual(self.page.locator('main').count(), 1)
                self.assertIn('/assets/brand/', self.page.locator('.brand img').first.get_attribute('src'))
                self.page.screenshot(path=str(base.ARTIFACTS / (artifact + '-' + name + '.png')))
            self.page.goto(base.BASE + '/sports/basketball/youth')
            self.page.locator('.engine-filter-options summary').tap()
            self.assertTrue(self.page.locator('#grade').is_visible())
            self.page.locator('#q').focus()
            self.assertEqual(self.page.locator(':focus').get_attribute('id'), 'q')
            self.assertGreaterEqual(self.page.locator('form[role=search] button[type=submit]').bounding_box()['height'], 44)


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
