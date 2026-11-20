"""MP3 thật: đối chiếu nguồn, giải mã, thời lượng và tín hiệu; không gọi mạng."""
import hashlib
import json
from pathlib import Path
import re
import shutil
import struct
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT/'audio/manifest.json').read_text())
NARRATIONS = json.loads((ROOT/'data/demo-narrations.json').read_text())


class DemoAudio(unittest.TestCase):
    def test_manifest_names_and_bytes_match_18_narrations_and_one_silent_unlock(self):
        self.assertEqual(len(MANIFEST['files']), 19)
        self.assertEqual(len({f['path'] for f in MANIFEST['files']}), 19)
        for file in MANIFEST['files']:
            self.assertRegex(file['path'], r'^\./audio/[a-z0-9-]+\.mp3$')
            path = ROOT/file['path']
            self.assertEqual(path.stat().st_size, file['bytes'])
            self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), file['sha256'])

    def test_files_cover_every_vi_en_style_and_do_not_invent_ko_zh_mp3(self):
        for record in NARRATIONS['records']:
            for lang in ('vi','en','ko','zh'):
                for persona in ('quick','kids','deep'):
                    story = record['stories'][lang][persona]
                    if lang in ('ko','zh'):
                        self.assertNotIn('audio', story)
                        continue
                    f = next(f for f in MANIFEST['files'] if f['path']==story['audio'])
                    self.assertEqual(f['artifactId'], record['artifactId'])
                    self.assertEqual(f['language'], lang)
                    self.assertEqual(f['persona'], persona)
                    self.assertEqual(f['textSha256'], hashlib.sha256(story['text'].encode()).hexdigest())

    @unittest.skipUnless(shutil.which('ffmpeg') and shutil.which('ffprobe'), 'Optional MP3 decoder unavailable')
    def test_every_file_decodes_and_narration_has_sound_with_plausible_duration(self):
        for f in MANIFEST['files']:
            path = ROOT/f['path']
            probe = json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name,sample_rate,channels','-of','json',str(path)], text=True))
            self.assertEqual(probe['streams'][0]['codec_name'], 'mp3')
            self.assertEqual(probe['streams'][0]['channels'], 1)
            self.assertEqual(probe['streams'][0]['sample_rate'], '22050')
            actual = float(probe['format']['duration'])
            self.assertAlmostEqual(actual, f['durationSeconds'], delta=.01)
            subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','null','-'],check=True,capture_output=True)
            if f.get('purpose'):
                self.assertLess(actual,1)
                continue
            self.assertGreater(actual,8)
            self.assertLess(actual,{'quick':40,'kids':90,'deep':120}[f['persona']])
            pcm = subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-t','4','-f','s16le','-'])
            samples=struct.unpack('<'+'h'*(len(pcm)//2),pcm)
            self.assertGreater(max(abs(s) for s in samples),100, f['path'])

    def test_models_are_build_only_and_attribution_cards_exist(self):
        p=json.loads((ROOT/'audio/model-provenance.json').read_text())
        self.assertFalse(p['modelsDistributed'])
        self.assertEqual({m['language'] for m in p['models']},{'vi','en'})
        for model in p['models']:
            self.assertTrue((ROOT/model['modelCard']).is_file())
            self.assertRegex(model['modelSha256'],r'^[a-f0-9]{64}$')
        self.assertFalse(any((ROOT/'audio').glob('*.onnx')))


if __name__=='__main__':
    unittest.main()
