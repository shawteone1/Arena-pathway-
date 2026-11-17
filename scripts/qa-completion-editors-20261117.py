"""Focused education editor: responsive real UI, independently saved, same athlete after reload."""
import importlib.util,unittest
from pathlib import Path
s=importlib.util.spec_from_file_location('f',Path(__file__).with_name('qa-profile-foundation-20261117.py'));f=importlib.util.module_from_spec(s);s.loader.exec_module(f);f.OUT=Path('docs/product-completion-20261117/after')
class Editors(unittest.TestCase):
 setUpClass=classmethod(f.Foundation.setUpClass.__func__);tearDownClass=classmethod(f.Foundation.tearDownClass.__func__);setUp=f.Foundation.setUp;tearDown=f.Foundation.tearDown;state=f.Foundation.state;create=f.Foundation.create;shot=f.Foundation.shot;views=f.Foundation.views
 def test_focused_education_editor_four_viewports_and_persistence(self):
  p=self.page;athlete=self.create('Education Demo','volleyball');p.get_by_role('button',name='Edit Education',exact=True).click();d=p.get_by_role('dialog');self.assertIn('Education Demo',d.locator('.editor-person').inner_text())
  for label,value in [('High school','Fictional Academy'),('Graduation year','2028'),('School city / state','Fictional City, CO'),('Academic information (optional)','Fictional family-reported academic interests'),('Intended major (optional)','Engineering'),('GPA (optional)','3.8'),('GPA scale (optional)','4')]:d.get_by_label(label,exact=True).fill(value)
  d.get_by_label('GPA type (optional)',exact=True).select_option('unweighted');self.views('focused-education-editor');d.get_by_role('button',name='Save Education',exact=True).click();p.wait_for_function('()=>!document.querySelector("dialog[open]")');p.reload(wait_until='domcontentloaded');p.wait_for_selector('.athlete-story');self.assertEqual(self.state()['active'],athlete);self.assertEqual(self.state()['profiles'][0]['highSchool'],'Fictional Academy');self.assertIn('Unweighted',p.locator('#overview').inner_text());self.assertIn('Fictional City, CO',p.locator('#overview').inner_text())
if __name__=='__main__':unittest.main(verbosity=2)
