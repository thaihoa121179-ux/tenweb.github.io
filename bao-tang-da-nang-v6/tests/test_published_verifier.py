"""Loopback fixture tests for the read-only verifier; not real Pages evidence."""
from contextlib import contextmanager
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import importlib.util
from io import BytesIO
import json
from pathlib import Path
import tempfile
from threading import Thread
import unittest
from urllib.parse import urlsplit

from PIL import Image

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/verify_published_v6.py'
SPEC = importlib.util.spec_from_file_location('published_verifier', SCRIPT)
V = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(V)


def png(color, size=128):
    data = BytesIO()
    Image.new('RGB', (size, size), color).save(data, format='PNG')
    return data.getvalue()


@contextmanager
def site(overrides=None, duplicates=False):
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        (root/'assets').mkdir()
        mapping = {}
        legacy = []
        for i in range(10):
            image = png((20+i*12, 70, 100))
            if duplicates and i == 1:
                image = (root/'assets/0.png').read_bytes()
            (root/f'assets/{i}.png').write_bytes(image)
            if i < 9:
                source = f'https://museum.example.invalid/never-fetch-{i}.jpg'
                mapping[source] = f'assets/{i}.png'
                legacy.append('    {\n      id: '+json.dumps('legacy-'+str(i))+',\n      image: '+json.dumps(source)+'\n    }')
        app = 'const A = [\n'+',\n'.join(legacy)+'\n];\nA.push(...[]);\n'
        (root/'app.js').write_text(app)
        (root/'media-map.js').write_text('window.MuseumMediaMap = '+json.dumps(mapping)+';')
        (root/'collection.js').write_text('globalThis.MuseumCollection = '+json.dumps({'legacyCount':9,'totalCount':10,'items':[{'id':'imported-1','image':'assets/9.png'}]})+';')
        for name in (*V.REQUIRED_JS, 'object-videos.js'):
            if name == 'app.js': continue
            (root/name).write_text('/* fixture static asset */\nvoid 0;')
        for name in V.REQUIRED_CSS:
            (root/name).write_text('body { color: #123; }')
        scripts=['media-map.js','collection.js','object-videos.js','videos.js','library-ui.js','request-plan.js','chat-text.js','visitor.js','conversation.js','app.js','v6.js','mobile.js','location-engine.js','vendor/leaflet-1.9.4/leaflet.js','location.js']
        vendor=root/'vendor/leaflet-1.9.4'
        vendor.mkdir(parents=True)
        (vendor/'leaflet.js').write_text('void 0;')
        (vendor/'leaflet.css').write_text('/* local map */')
        (root/'index.html').write_text('<!doctype html><html><head>'+''.join(f'<link rel="stylesheet" href="{n}?v=6.9">' for n in V.REQUIRED_CSS)+'<link rel="stylesheet" href="vendor/leaflet-1.9.4/leaflet.css?v=1.9.4">'+'</head><body>'+''.join(f'<script src="{n}?v={"1.9.4" if n.startswith("vendor/") else "6.9"}"></script>' for n in scripts)+'</body></html>')
        requests = []
        custom = overrides or {}
        class Handler(SimpleHTTPRequestHandler):
            def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(root),**kwargs)
            def log_message(self,*args):pass
            def do_GET(self):
                path = urlsplit(self.path).path
                requests.append(self.path)
                if path == '/redirect':
                    self.send_response(302);self.send_header('Location','https://external.invalid/file.png');self.end_headers();return
                if path in custom:
                    mime, body = custom[path]
                    self.send_response(200);self.send_header('Content-Type',mime);self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body);return
                super().do_GET()
        server = ThreadingHTTPServer(('127.0.0.1',0),Handler)
        thread = Thread(target=server.serve_forever,daemon=True);thread.start()
        try:
            yield root, f'http://127.0.0.1:{server.server_port}/', requests
        finally:
            server.shutdown();server.server_close();thread.join()


def args(root,base):
    return V.arguments(['--root',str(root),'--base-url',base,'--minimum-records','10','--asset-version','6.9','--max-wait','2','--poll-interval','0.05','--workers','3'])


class PublishedVerifierTests(unittest.TestCase):
    def test_actual_local_mapping_and_all_decoded_live_fixture_images_pass(self):
        with site() as (root,base,requests):
            result = V.verify(args(root,base))
            self.assertTrue(result['passed'],result)
            self.assertEqual(result['summary']['decodedPhotosPassed'],10)
            self.assertEqual(result['summary']['distinctPhotoUrls'],10)
            self.assertEqual(result['summary']['distinctDecodedPhotoSha256'],10)
            self.assertTrue(all(row['width']>=128 and row['height']>=128 for row in result['photos']))
            self.assertTrue(all('never-fetch' not in value for value in requests))

    def test_duplicate_photo_bytes_cannot_pass_distinct_photo_verification(self):
        with site(duplicates=True) as (root,base,_):
            result = V.verify(args(root,base))
            self.assertFalse(result['passed'])
            self.assertEqual(result['summary']['decodedPhotosPassed'],10)
            self.assertEqual(result['summary']['distinctDecodedPhotoSha256'],9)
            self.assertEqual(len(result['summary']['duplicatePhotoBytes']),1)

    def test_stale_deployed_javascript_is_not_called_ready(self):
        with site({'/videos.js':('text/javascript',b'void "old-deployment";')}) as (root,base,_):
            result = V.verify(args(root,base))
            self.assertFalse(result['passed'])
            self.assertFalse(result['deployment']['ready'])
            self.assertTrue(any('videos.js' in attempt['error'] for attempt in result['deployment']['attempts']))
            self.assertNotIn('photos',result)

    def test_stale_phone_stylesheet_cannot_pass_publication_verification(self):
        with site({'/mobile.css':('text/css',b'/* old phone layout */')}) as (root,base,_):
            result = V.verify(args(root,base))
            self.assertFalse(result['passed'])
            self.assertTrue(any('mobile.css' in attempt['error'] for attempt in result['deployment']['attempts']))

    def test_conversation_module_must_load_before_the_app(self):
        with site() as (root,base,_):
            html=(root/'index.html').read_text()
            old='<script src="conversation.js?v=6.9"></script><script src="app.js?v=6.9"></script>'
            self.assertIn(old,html)
            html=html.replace(old,'<script src="app.js?v=6.9"></script><script src="conversation.js?v=6.9"></script>')
            with self.assertRaisesRegex(ValueError,'conversation.js must precede app.js'):
                V.checked_assets(html,'6.9')

    def test_http_200_with_html_masquerading_as_an_image_fails_decode(self):
        with site({'/assets/0.png':('image/png',b'<html>not an image</html>')}) as (root,base,_):
            result = V.verify(args(root,base))
            self.assertFalse(result['passed'])
            self.assertEqual(result['summary']['failedPhotos'],1)

    def test_tiny_placeholder_fails_minimum_dimensions(self):
        with site({'/assets/1.png':('image/png',png((0,0,0),size=1))}) as (root,base,_):
            result = V.verify(args(root,base))
            self.assertFalse(result['passed'])
            failed = [row for row in result['photos'] if not row['passed']]
            self.assertEqual(len(failed),1)
            self.assertIn('too small',failed[0]['error'])

    def test_external_redirect_and_path_traversal_are_rejected_before_contact(self):
        with site() as (root,base,requests):
            client = V.PagesClient(base,'test')
            for value in ['https://external.invalid/x','//external.invalid/x','../outside','%2e%2e/outside']:
                with self.assertRaises(ValueError):client.fetch(value)
            with self.assertRaisesRegex(ValueError,'redirect'):client.fetch('redirect')
            self.assertEqual(len(requests),1)
            with self.assertRaises(ValueError):V.local_path(root,'../outside.png')

    def test_failure_report_is_written_even_when_200_records_are_not_ready(self):
        with site() as (root,base,requests):
            report = root/'result.json'
            status = V.main(['--root',str(root),'--base-url',base,'--minimum-records','200','--max-wait','0.1','--report',str(report)])
            self.assertEqual(status,1)
            result = json.loads(report.read_text())
            self.assertFalse(result['passed'])
            self.assertIn('found 10',result['error'])
            self.assertEqual(requests,[])

    def test_node_syntax_failure_stops_before_publication_requests(self):
        with site() as (root,base,requests):
            (root/'videos.js').write_text('function { invalid JS')
            result = V.verify(args(root,base))
            self.assertFalse(result['passed'])
            self.assertEqual(requests,[])


if __name__ == '__main__':
    unittest.main()
