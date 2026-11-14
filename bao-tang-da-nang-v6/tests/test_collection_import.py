"""Parser checks use captured official HTML, never invent missing metadata."""
import importlib.util,json,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('collection_import',ROOT/'scripts/expand_collection.py')
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
class ParserTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.sources=json.loads((ROOT/'data/source-discovery.json').read_text())
 def page(self,slug):return next(x for x in self.sources if x['url'].endswith('/'+slug))
 def parse(self,slug):
  x=self.page(slug);return module.parse_record(x['body'],x['url'])
 def test_official_metadata_preserved(self):
  a=self.parse('trang-sc-ma-nao');self.assertEqual(a['material'],'Mã não');self.assertIn('1980',a['origin']);self.assertFalse(a['locationVerified']);self.assertTrue(a['image'].startswith('assets/collection/'))
 def test_material_requires_explicit_source_statement(self):
  a=self.parse('khuyan-tai-henh-vanh-khan');self.assertEqual(a['material'],'đá');self.assertIn('được làm từ đá',a['materialEvidence'])
 def test_missing_material_is_not_guessed_from_the_photo(self):
  x=self.page('yan-mang-xing')
  with self.assertRaisesRegex(ValueError,'Incomplete'):module.parse_record(x['body'],x['url'])
 def test_short_provenance_uses_rich_actual_description(self):
  a=self.parse('benh-tu-ba-trung');self.assertEqual(a['origin'],'Khai quật');self.assertIn('Cù Lao Chàm',a['description']);self.assertEqual(a['sourceSite'],'site2');self.assertEqual(a['material'],'Gốm - Sứ');self.assertIn('XV-XVI',a['era']);self.assertTrue(a['dimensions'])
 def test_unrelated_html_cannot_become_an_artifact(self):
  with self.assertRaisesRegex(ValueError,'No artifact title'):module.parse_record('<h1>News article</h1>','https://baotangdanang.vn/news')
if __name__=='__main__':unittest.main()
