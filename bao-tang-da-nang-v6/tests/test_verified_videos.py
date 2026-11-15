"""Source provenance checks, not YouTube playback verification."""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class VerifiedVideoEvidence(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = json.loads((ROOT/'data/verified-videos.json').read_text())
        cls.discovery = json.loads((ROOT/'data/verified-video-source-pages.json').read_text())
        cls.samples = json.loads((ROOT/'data/expansion-samples.json').read_text())
        text = (ROOT/'collection.js').read_text()
        cls.records = {r['id']: r for r in json.loads(text[text.index('{'):text.rfind('}')+1])['items']}

    def test_actual_records_and_thematic_scope(self):
        mappings = self.manifest['byRecordId']
        self.assertEqual(set(mappings), {'phu-dieu', 'hv-tuong-dan-ba-co-tu-mua-ya-ya-1ca507', 'hv-tuong-go-be-gai-co-tu-608076', 'hv-tuong-de079e'})
        self.assertEqual(self.manifest['coverage']['mappedRecordCount'], len(mappings))
        self.assertEqual(self.manifest['coverage']['uniqueArtifactVideoCount'], 1)
        for record_id, videos in mappings.items():
            with self.subTest(record=record_id):
                self.assertTrue(record_id == 'phu-dieu' or record_id in self.records)
                for video in videos:
                    self.assertEqual(video['relation'], 'theme')
                    self.assertFalse(video['objectAppearanceVerified'])
                    self.assertFalse(video['playbackVerified'])
                    if record_id != 'phu-dieu':
                        self.assertEqual(video['recordEvidence']['sourceUrl'], self.records[record_id]['url'])
                        self.assertIn(video['recordEvidence']['quote'], self.records[record_id]['description'])
                    else:
                        self.assertIn(video['recordEvidence']['quote'], (ROOT/'data-v6.js').read_text())

    def test_video_url_and_caption_are_observed_in_exact_official_page(self):
        for videos in self.manifest['byRecordId'].values():
            for video in videos:
                proof = video['provenance']
                page = self.discovery['responses'][proof['responseIndex']]
                self.assertEqual(page['status'], 200)
                self.assertEqual(page['requested_url'], video['sourceUrl'])
                self.assertEqual(page['sha256'], proof['officialPageSha256'])
                self.assertIn(proof['evidenceElement'], page['html_sample'])
                self.assertIn('href="'+video['url']+'"', proof['evidenceElement'])
                self.assertIn('data-caption="'+video['sourceCaption']+'"', proof['evidenceElement'])

    def test_bai_choi_is_topic_only_with_official_iframe_evidence(self):
        [video] = self.manifest['byTopicId']['van-hoa-quang']
        proof = video['provenance']
        page = self.samples[proof['responseIndex']]
        self.assertEqual(page['status'], 200)
        self.assertEqual(page['url'], video['sourceUrl'])
        self.assertIn(proof['evidenceElement'], page['html'])
        self.assertIn('F3kKGgNnIr0', proof['evidenceElement'])
        self.assertIn(proof['evidenceHeading'], page['html'])
        self.assertFalse(any('F3kKGgNnIr0' in item['url'] for media in self.manifest['byRecordId'].values() for item in media))

    def test_unrelated_sculpture_and_weaving_are_not_mapped(self):
        self.assertNotIn('hv-tuong-cong-lang-1865d2', self.manifest['byRecordId'])
        self.assertNotIn('hv-bo-khung-det-xa-xao-2c1626', self.manifest['byRecordId'])
        self.assertNotIn('hv-doi-xe-chi-2a1dfe', self.manifest['byRecordId'])
        self.assertTrue(all(re.match(r'https://(?:www\.)?youtube\.com/watch\?v=[A-Za-z0-9_-]{11}$', v['url']) for videos in self.manifest['byRecordId'].values() for v in videos))

if __name__ == '__main__':
    unittest.main()
