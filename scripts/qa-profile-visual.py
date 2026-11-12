"""Profile-only iPad acceptance. PROFILE_BROWSER=webkit selects actual WebKit.
Fixtures are fictional; the uploaded portrait is a synthetic canvas avatar, not a real athlete.
"""
import base64
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
ROOT=Path(__file__).resolve().parent.parent
BASE=os.environ.get('ARENA_QA_BASE','')
ENGINE=os.environ.get('PROFILE_BROWSER','chromium')
OUT=Path(os.environ.get('ARENA_QA_ARTIFACTS',ROOT/'var'/'profile-visual'));OUT.mkdir(parents=True,exist_ok=True)
KEY='arenaPathway.v2'
def athlete(id,name,sport,team,position):
    return dict(id=id,nickname=name,sport=sport,clubTeam=team,position=position,role='parent',guardian=True,region='all',goal='teams',interests=[],moduleVersion=2,modules=['teams','saved','schedules','camps','community','media'],mediaEnabled=True,mediaSources=['du-news'],mediaSourcePreferences=['du-news'],saved=['denver-elite'] if sport=='lacrosse' else ['denver-juniors'],plans=[dict(id=id+'-plan',name='Training · personal plan',start='2030-05-06',note='Family-entered plan')],participationLevel='competitive',participationDesignation='youth',recruiting=dict(checks=['research'],notes='Retain family research'),extension=dict(retain=True))
FIXTURE=dict(version=2,active='existing-alex',profiles=[athlete('existing-alex','Alex Rivera','lacrosse','Rivera club team · family-entered','Midfield'),athlete('existing-jordan','Jordan Rivera','volleyball','Rivera volleyball · family-entered','Setter')])
class ProfileVisualQA(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.playwright=sync_playwright().start();options={'headless':True}
        if ENGINE=='webkit':
            if os.environ.get('WEBKIT_PATH'):options['executable_path']=os.environ['WEBKIT_PATH']
            cls.browser=cls.playwright.webkit.launch(**options)
        else:
            options['executable_path']=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
            cls.browser=cls.playwright.chromium.launch(**options)
        (OUT/(ENGINE+'-engine.json')).write_text(json.dumps(dict(engine=ENGINE,version=cls.browser.version,physical_iPad=False))+'\n')
    @classmethod
    def tearDownClass(cls):cls.browser.close();cls.playwright.stop()
    def setUp(self):
        self.context=self.browser.new_context(viewport={'width':810,'height':1080},has_touch=True,device_scale_factor=1)
        self.page=self.context.new_page();self.errors=[];self.requests=[]
        self.page.on('pageerror',lambda error:self.errors.append(str(error)))
        self.page.on('request',lambda request:self.requests.append((request.method,request.url)))
        self.page.goto(BASE+'/health');self.page.evaluate('()=>localStorage.setItem("arenaPathway.siem.v1",JSON.stringify({version:1,familyId:"local-family",athletes:[{id:"existing-casey",type:"parent",name:"Casey Rivera",sport:"personal"}],events:[],actions:{},audit:[],permissions:{recruiting:false,lockedIn:false}}))');self.page.evaluate('(value)=>localStorage.setItem("arenaPathway.v2",JSON.stringify(value))',FIXTURE)
    def tearDown(self):
        self.context.close();self.assertEqual(self.errors,[])
        self.assertFalse(any(method!='GET' for method,url in self.requests),'Profile data must stay local')
    def open(self,path='/my-pathway'):
        self.page.goto(BASE+path);self.page.wait_for_selector('#profile-summary .profile-athlete-name' if 'view=family' not in path else '#family-profile .family-athlete-card')
    def state(self):return self.page.evaluate('JSON.parse(localStorage.getItem("arenaPathway.v2"))')
    def settled(self):
        self.page.evaluate('async()=>{await document.fonts.ready;document.activeElement?.blur();scrollTo(0,0);}')
        self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth+1'))
    def png(self):
        data=self.page.evaluate('''()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#e2e5e8';x.fillRect(0,0,256,256);x.fillStyle='#26354b';x.beginPath();x.arc(128,282,112,0,Math.PI*2);x.fill();x.fillStyle='#bd9578';x.beginPath();x.arc(128,96,48,0,Math.PI*2);x.fill();x.fillStyle='#26354b';x.beginPath();x.arc(128,82,49,Math.PI,Math.PI*2);x.fill();x.fillStyle='#26354b';x.fillRect(108,94,7,4);x.fillRect(143,94,7,4);x.fillStyle='#a52a3b';x.fillRect(108,198,40,58);return c.toDataURL('image/png').split(',')[1];}''')
        return dict(name='synthetic-avatar.png',mimeType='image/png',buffer=base64.b64decode(data))
    def test_ipad_parent_to_athlete_hierarchy_and_screenshots(self):
        original=self.state()
        for label,width,height in [('ipad-portrait',810,1080),('ipad-landscape',1080,810),('ipad-768',768,1024)]:
            self.page.set_viewport_size(dict(width=width,height=height));self.open('/my-pathway?view=family');self.settled()
            self.assertEqual(self.page.locator('#family-profile .family-athlete-card').count(),2)
            self.assertTrue(self.page.locator('#family-profile .profile-cover').is_visible())
            self.assertIn('Casey Rivera',self.page.locator('#family-profile').inner_text())
            self.page.screenshot(path=str(OUT/f'{ENGINE}-{label}-parent-viewport.png'))
            self.page.screenshot(path=str(OUT/f'{ENGINE}-{label}-parent.png'),full_page=True)
            self.page.locator('#family-profile [data-athlete-id=existing-alex]').get_by_role('link',name='View Athlete').click()
            self.page.wait_for_selector('#profile-summary .profile-athlete-name');self.settled()
            self.assertEqual(self.page.locator('#profile-select').input_value(),'existing-alex')
            self.assertIn('Alex Rivera',self.page.locator('#profile-summary').inner_text())
            self.assertIn('Parent-managed',self.page.locator('#profile-summary').inner_text())
            self.assertLess(self.page.locator('#profile-summary').bounding_box()['y'],300)
            self.assertLess(self.page.locator('#profile-nav').bounding_box()['y'],780)
            self.assertEqual(self.page.locator('#overview .athlete-card').count(),6)
            self.page.screenshot(path=str(OUT/f'{ENGINE}-{label}-athlete-viewport.png'))
            self.page.screenshot(path=str(OUT/f'{ENGINE}-{label}-athlete.png'),full_page=True)
        self.assertEqual(self.state(),original)
    def test_view_athlete_links_reload_and_unknown_ids_are_safe(self):
        before=self.state();family_before=self.page.evaluate('localStorage.getItem("arenaPathway.siem.v1")')
        self.open('/my-pathway?view=family')
        self.page.locator('#family-profile [data-athlete-id=existing-jordan]').get_by_role('link',name='View Athlete').click()
        self.page.wait_for_selector('#profile-summary .profile-athlete-name');self.assertIn('Jordan Rivera',self.page.locator('#profile-summary').inner_text())
        self.page.reload();self.page.wait_for_selector('#profile-summary .profile-athlete-name');self.assertEqual(self.state()['active'],'existing-jordan')
        self.page.locator('#profile-select').select_option('existing-alex');self.page.reload();self.page.wait_for_selector('#profile-summary .profile-athlete-name');self.assertEqual(self.state()['active'],'existing-alex')
        self.assertEqual(self.state(),before);self.assertEqual(self.page.evaluate('localStorage.getItem("arenaPathway.siem.v1")'),family_before)
        self.page.goto(BASE+'/my-pathway?athlete=removed-athlete');self.page.wait_for_selector('#workspace-empty:not([hidden])')
        self.assertIn('Athlete not found',self.page.locator('#workspace-empty').inner_text());self.assertFalse(self.page.locator('#profile-summary').is_visible());self.assertEqual(self.state(),before)
    def test_parent_profile_actions_update_the_existing_local_parent(self):
        self.open('/my-pathway?view=family');athletes_before=self.state();parent_before=self.page.evaluate('JSON.parse(localStorage.getItem("arenaPathway.siem.v1"))')
        self.page.get_by_role('button',name='Edit profile',exact=True).click();dialog=self.page.get_by_role('dialog',name='Edit parent profile')
        dialog.locator('#parent-display-name').fill('Casey Rivera · parent');dialog.locator('#parent-profile-photo').set_input_files(self.png())
        dialog.get_by_role('button',name='Save profile',exact=True).click();self.page.wait_for_selector('#family-profile .profile-avatar canvas')
        self.assertEqual(self.state(),athletes_before)
        after=self.page.evaluate('JSON.parse(localStorage.getItem("arenaPathway.siem.v1"))');expected=json.loads(json.dumps(parent_before));expected['athletes'][0]['name']='Casey Rivera · parent'
        self.assertEqual({**after,'athletes':[{k:v for k,v in after['athletes'][0].items() if k!='avatarDataUrl'}]},expected)
        self.page.reload();self.page.wait_for_selector('#family-profile .profile-avatar canvas');self.assertIn('Casey Rivera · parent',self.page.locator('#family-profile .profile-athlete-name').inner_text())
        self.page.get_by_role('button',name='Edit profile',exact=True).click();dialog=self.page.get_by_role('dialog',name='Edit parent profile');dialog.locator('#parent-display-name').fill('Do not save')
        dialog.get_by_role('button',name='Cancel',exact=True).click();self.assertEqual(self.page.evaluate('JSON.parse(localStorage.getItem("arenaPathway.siem.v1"))'),after)
    def test_sections_preserve_modules_and_card_navigation(self):
        self.open();before=self.state()
        for label,id in [('Profile','overview'),('Schedule','schedules'),('Stats','stats'),('Media','profile-media'),('Development','camps'),('Community','community'),('Network','network')]:
            link=self.page.locator('#profile-nav, #athlete-resource-nav').get_by_role('link',name=label,exact=True);link.click()
            self.assertTrue(self.page.locator('#'+id).is_visible());self.assertEqual(link.get_attribute('aria-current'),'page')
            self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth+1'))
        self.assertFalse(self.page.locator('#optional-recruiting').evaluate('(el)=>el.open'))
        self.assertNotIn('recruiting',self.state()['profiles'][0]['modules']);self.assertEqual(self.state(),before)
        self.page.set_viewport_size(dict(width=390,height=844));self.settled()
    def test_local_photo_survives_reload_and_does_not_change_identity(self):
        self.open();before=self.state();self.page.locator('#athlete-photo').set_input_files(self.png())
        self.page.wait_for_selector('#profile-summary .profile-avatar canvas');after=self.state()
        self.assertEqual(after['profiles'][1],before['profiles'][1])
        self.assertEqual({k:v for k,v in after['profiles'][0].items() if k!='avatarDataUrl'},before['profiles'][0])
        self.assertTrue(after['profiles'][0]['avatarDataUrl'].startswith('data:image/jpeg;base64,'))
        self.page.reload();self.page.wait_for_selector('#profile-summary .profile-avatar canvas');self.settled()
        self.page.screenshot(path=str(OUT/f'{ENGINE}-ipad-portrait-photo-viewport.png'))
        self.page.screenshot(path=str(OUT/f'{ENGINE}-ipad-portrait-photo.png'),full_page=True)
        self.page.locator('#profile-nav').get_by_role('link',name='Media',exact=True).click();self.settled()
        self.page.screenshot(path=str(OUT/f'{ENGINE}-ipad-media.png'),full_page=True)
        self.page.get_by_role('button',name='Remove photo',exact=True).click();self.assertEqual(self.state(),before)
    def test_photo_is_attached_to_original_id_when_switching_athletes(self):
        self.open();self.page.evaluate('''()=>{const original=window.createImageBitmap;let first=true;window.createImageBitmap=async(...args)=>{if(first){first=false;await new Promise(resolve=>window.releaseProfilePhoto=resolve);}return original(...args);};}''')
        self.page.locator('#athlete-photo').set_input_files(self.png());self.page.wait_for_function('()=>typeof window.releaseProfilePhoto==="function"')
        self.page.locator('#profile-select').select_option('existing-jordan');self.page.evaluate('()=>window.releaseProfilePhoto()')
        self.page.wait_for_function('()=>!!JSON.parse(localStorage.getItem("arenaPathway.v2")).profiles[0].avatarDataUrl')
        state=self.state();self.assertEqual(state['active'],'existing-jordan');self.assertNotIn('avatarDataUrl',state['profiles'][1])
        self.page.get_by_role('link',name='My Athletes',exact=True).click();self.page.wait_for_selector('#family-profile .family-athlete-card canvas')
    def test_edit_keeps_existing_id_records_and_recruiting_notes(self):
        self.open();before=self.state();self.page.get_by_role('link',name='Edit athlete',exact=True).click()
        self.page.locator('#position').fill('Attack');self.page.get_by_role('button',name='Save athlete profile').click();self.page.wait_for_selector('#profile-summary .profile-athlete-name')
        after=self.state();expected=json.loads(json.dumps(before));expected['profiles'][0]['position']='Attack';self.assertEqual(after,expected)
        self.assertIn('Attack',self.page.locator('#profile-summary').inner_text())
    def test_invalid_photo_and_quota_failure_preserve_saved_records(self):
        self.open();before=self.state()
        self.page.locator('#athlete-photo').set_input_files(dict(name='bad.svg',mimeType='image/svg+xml',buffer=b'<svg xmlns="http://www.w3.org/2000/svg"/>'))
        self.assertIn('JPG, PNG or WebP',self.page.locator('#toast').inner_text());self.assertEqual(self.state(),before)
        self.page.evaluate('()=>{Storage.prototype.setItem=()=>{throw Error("Quota");};}')
        self.page.locator('#athlete-photo').set_input_files(self.png());self.page.wait_for_function('()=>document.querySelector("#toast").textContent.includes("Saving is unavailable")')
        self.assertEqual(self.state(),before);self.assertEqual(self.page.locator('#profile-summary canvas').count(),0)
if __name__=='__main__':
    server=None
    try:
        if not BASE:
            with socket.socket() as sock:sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
            BASE='http://127.0.0.1:'+str(port);server=subprocess.Popen([shutil.which('node'),'server.mjs'],cwd=ROOT,env=dict(os.environ,PORT=str(port)),stdout=subprocess.DEVNULL)
            for _ in range(100):
                try:
                    with urlopen(BASE+'/health',timeout=1):break
                except OSError:time.sleep(.1)
            else:raise RuntimeError('Server failed to start')
        unittest.main(verbosity=2)
    finally:
        if server:server.terminate();server.wait(timeout=10)
