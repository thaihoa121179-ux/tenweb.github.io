"""Read-only Pages verification: compare deployed code/data and decode local photos.

Only the configured Pages origin is contacted. Museum/player URLs are metadata,
never download destinations. The JSON report is an Actions artifact, not a commit.
"""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import hashlib
from html.parser import HTMLParser
from io import BytesIO
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time
from urllib.error import HTTPError
from urllib.parse import parse_qs, unquote, urljoin, urlsplit, urlunsplit, urlencode
from urllib.request import HTTPRedirectHandler, Request, build_opener
import warnings

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_BASE = 'https://thaihoa121179-ux.github.io/tenweb.github.io/bao-tang-da-nang-v6/'
MAX_BYTES = 12 * 1024 * 1024
REQUIRED_JS = ('app.js', 'library-ui.js', 'videos.js', 'conversation.js', 'mobile.js', 'request-plan.js', 'chat-text.js', 'v6.js', 'visitor.js', 'location-engine.js', 'location.js')
REQUIRED_CSS = ('library-ui.css', 'videos.css', 'mobile.css', 'visitor.css', 'location.css')
Image.MAX_IMAGE_PIXELS = 40_000_000


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def assigned_json(text: str, name: str):
    match = re.search(r'(?:window|globalThis)\.' + re.escape(name) + r'\s*=\s*', text)
    if not match:
        raise ValueError(f'No JSON assignment for {name}')
    value, end = json.JSONDecoder().raw_decode(text[match.end():])
    if text[match.end() + end:].strip() not in ('', ';'):
        raise ValueError(f'Unexpected executable suffix after {name}')
    return value


def local_path(root: Path, value: str) -> Path:
    if not isinstance(value, str) or not value:
        raise ValueError('Missing local asset path')
    url = urlsplit(value)
    if url.scheme or url.netloc or url.query or url.fragment or value.startswith('/'):
        raise ValueError(f'Asset must be a relative local path: {value}')
    path = (root / unquote(url.path)).resolve()
    if not path.is_relative_to(root.resolve()) or path == root.resolve():
        raise ValueError(f'Asset escapes the checkout: {value}')
    if not path.is_file():
        raise ValueError(f'Local asset missing: {value}')
    return path


def expected_photos(root: Path, minimum: int) -> tuple[list[dict], dict]:
    if (root / 'data/museum-content.json').is_file():
        raw=(root/'data/museum-content.json').read_bytes()
        content=json.loads(raw)
        records=content.get('artifacts',[])
        if content.get('schemaVersion')!=1 or not minimum <= len(records) <= 1000:
            raise ValueError(f'Expected {minimum}..1000 canonical records, found {len(records)}')
        ids=set();paths=set();photos=[]
        for record in records:
            ident=record.get('id'); image=record.get('image')
            if not ident or ident in ids or image in paths: raise ValueError('Duplicate canonical ID/photo URL')
            ids.add(ident); paths.add(image); path=local_path(root,image)
            if record.get('guide',{}).get('source')!=record.get('url'): raise ValueError('Canonical source mismatch')
            photos.append({'id':ident,'path':image,'expectedSha256':digest(path.read_bytes())})
        import gzip
        if gzip.decompress((root/'data/museum-content.json.gz').read_bytes())!=raw: raise ValueError('Stale compressed canonical JSON')
        return photos, {'actualRecords':len(records),'legacyRecords':9,'collectionSha256':digest(raw),'minimumRecords':minimum}
    collection_bytes = (root / 'collection.js').read_bytes()
    collection = assigned_json(collection_bytes.decode(), 'MuseumCollection')
    mapping = assigned_json((root / 'media-map.js').read_text(), 'MuseumMediaMap')
    app = (root / 'app.js').read_text()
    legacy_match = re.search(r'\bconst\s+A\s*=\s*(\[.*?\])\s*;\s*A\.push', app, re.S)
    if not legacy_match:
        raise ValueError('Cannot locate the legacy A initializer before A.push')
    legacy = []
    pattern = r'\{\s*id\s*:\s*("(?:\\.|[^"\\])*")(.*?)\n\s*\}'
    for entry in re.finditer(pattern, legacy_match[1], re.S):
        image = re.search(r'\bimage\s*:\s*("(?:\\.|[^"\\])*")', entry[2])
        if image:
            legacy.append({'id': json.loads(entry[1]), 'image': json.loads(image[1])})
    if len(legacy) != 9 or collection.get('legacyCount') != 9:
        raise ValueError(f'Expected exactly 9 retained legacy records, found {len(legacy)}')
    items = collection.get('items')
    if not isinstance(items, list):
        raise ValueError('Collection items must be an array')
    records = legacy + items
    if len(records) < minimum or len(records) > 1000:
        raise ValueError(f'Expected {minimum}..1000 real records, found {len(records)}')
    if collection.get('totalCount') != len(records):
        raise ValueError('Declared totalCount does not equal actual retained + imported records')
    ids, paths = set(), set()
    photos = []
    for record in records:
        ident = record.get('id')
        if not isinstance(ident, str) or not ident or ident in ids:
            raise ValueError(f'Duplicate/missing record ID: {ident}')
        ids.add(ident)
        image = mapping.get(record.get('image'), record.get('image'))
        path = local_path(root, image)
        if image in paths:
            raise ValueError(f'Two records share the same photo URL: {image}')
        paths.add(image)
        photos.append({'id': ident, 'path': image, 'expectedSha256': digest(path.read_bytes())})
    return photos, {'actualRecords': len(records), 'legacyRecords': 9,
                    'collectionSha256': digest(collection_bytes), 'minimumRecords': minimum}


class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.scripts = []
        self.styles = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'script' and attrs.get('src'):
            self.scripts.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') == 'stylesheet' and attrs.get('href'):
            self.styles.append(attrs['href'])


def checked_assets(index: str, version: str, bootstrap: str = "") -> dict[str, str]:
    parsed = Assets()
    parsed.feed(index)
    assets = {}
    if version.startswith('7.'):
        matches=[v for v in parsed.scripts if urlsplit(v).path==('bootstrap.js' if version=='7.0.0' else 'bootstrap-'+version+'.js')]
        entry='bootstrap.js' if version=='7.0.0' else 'bootstrap-'+version+'.js'
        if matches!=[entry+'?v='+version]: raise ValueError('Missing versioned bootstrap.js')
        if "version='"+version+"'" not in bootstrap: raise ValueError('Bootstrap version mismatch')
        modules=['qr-decoder.js','qr-generator.js','guide-engine.js','chat-text.js','object-videos.js','videos.js','library-ui.js','request-plan.js','conversation.js','experience-i18n.js','learning-engine.js','retrieval.js','visitor.js','app.js','v6.js','visuals.js','profile.js','mobile.js','analytics.js','experience.js','photo-query.js','journey-card.js','offline.js']
        if version=='7.0.0': modules.remove('visuals.js')
        if version not in ('7.0.0','7.1.0'): modules=['config.js',*modules,'live-map-entry.js']
        manifest=re.search(r'const modules=\[(.*?)\];', bootstrap)
        if not manifest: raise ValueError('Missing bootstrap module manifest')
        positions=[manifest.group(1).find("'"+name+"'") for name in modules]
        if -1 in positions or positions!=sorted(positions): raise ValueError('Bad bootstrap module dependency order')
        bundles=['app-foundation.js','app-core.js','app-runtime.js']
        if version!='7.0.0':bundles=[name.replace('.js','-'+version+'.js') for name in bundles]
        for name in ['bootstrap.js',entry,*bundles,*modules]: assets[name]=name+'?v='+version
        for name in ['app-styles.css' if version=='7.0.0' else 'app-styles-'+version+'.css']:
            values=[v for v in parsed.styles if urlsplit(v).path==name]
            if values!=[name+'?v='+version]: raise ValueError('Missing versioned stylesheet '+name)
            assets[name]=values[0]
        for name in ['data/museum-content.json','data/museum-content.json.gz','sw.js','manifest.webmanifest','qr-print/index.html','qr-print/print.js','qr-print/print.css','admin/index.html','admin/admin.js','admin/admin.css']:
            assets[name]=name+'?v='+version
        if version not in ('7.0.0','7.1.0'):
            for name in ['app-map-'+version+'.js','config.js','live-map-config.js','live-map-i18n.js','live-map-engine.js','live-map-sensors.js','live-map.js','live-map.css',*[f'data/maps/floor-{n}.json' for n in (1,2,3)]]: assets[name]=name+'?v='+version
        return assets
    for name, values in [(name, parsed.scripts) for name in REQUIRED_JS] + [(name, parsed.styles) for name in REQUIRED_CSS]:
        matches = [value for value in values if urlsplit(value).path == name]
        if len(matches) != 1 or parse_qs(urlsplit(matches[0]).query).get('v') != [version]:
            raise ValueError(f'Expected exactly one {name}?v={version} in published HTML')
        assets[name] = matches[0]
    for dependency in ('media-map.js', 'collection.js', 'object-videos.js'):
        matches = [value for value in parsed.scripts if urlsplit(value).path == dependency]
        if len(matches) != 1 or not parse_qs(urlsplit(matches[0]).query).get('v'):
            raise ValueError(f'Missing cache-versioned dependency: {dependency}')
        assets[dependency] = matches[0]
    for dependency, values in [('vendor/leaflet-1.9.4/leaflet.js', parsed.scripts),
                               ('vendor/leaflet-1.9.4/leaflet.css', parsed.styles)]:
        matches = [value for value in values if urlsplit(value).path == dependency]
        if len(matches) != 1 or parse_qs(urlsplit(matches[0]).query).get('v') != ['1.9.4']:
            raise ValueError(f'Missing local map dependency: {dependency}')
        assets[dependency] = matches[0]
    positions = {urlsplit(value).path: i for i, value in enumerate(parsed.scripts)}
    for before, after in [('media-map.js', 'app.js'), ('collection.js', 'app.js'),
                          ('object-videos.js', 'app.js'), ('videos.js', 'library-ui.js'),
                          ('library-ui.js', 'app.js'), ('conversation.js', 'app.js'),
                          ('app.js', 'mobile.js'), ('request-plan.js', 'conversation.js'),
                          ('chat-text.js', 'app.js'), ('app.js', 'v6.js'),
                          ('visitor.js', 'app.js'), ('app.js', 'location.js'),
                          ('location-engine.js', 'location.js'),
                          ('vendor/leaflet-1.9.4/leaflet.js', 'location.js')]:
        if positions[before] >= positions[after]:
            raise ValueError(f'Bad script dependency order: {before} must precede {after}')
    return assets


class SameOriginRedirects(HTTPRedirectHandler):
    def __init__(self, origin: str, prefix: str):
        super().__init__()
        self.origin, self.prefix = origin, prefix

    def redirect_request(self, request, fp, code, msg, headers, newurl):
        target = urlsplit(newurl)
        if f'{target.scheme}://{target.netloc}' != self.origin or not target.path.startswith(self.prefix):
            raise ValueError('Refusing redirect outside the configured Pages origin/path')
        return super().redirect_request(request, fp, code, msg, headers, newurl)


class PagesClient:
    def __init__(self, base: str, token: str):
        parsed = urlsplit(base)
        if parsed.username or parsed.password or parsed.query or parsed.fragment or not parsed.path.endswith('/'):
            raise ValueError('Base must be a credential-free directory URL without query/fragment')
        local = parsed.hostname in ('127.0.0.1', 'localhost', '::1')
        if not ((parsed.scheme == 'https' and parsed.hostname and parsed.hostname.endswith('.github.io')) or (local and parsed.scheme == 'http')):
            raise ValueError('Only GitHub Pages HTTPS or a loopback HTTP test server is allowed')
        self.base, self.token = base, token
        self.origin = f'{parsed.scheme}://{parsed.netloc}'
        self.prefix = parsed.path

    def fetch(self, relative: str, timeout: float = 15) -> tuple[bytes, dict]:
        parts = urlsplit(relative)
        if parts.scheme or parts.netloc or relative.startswith('/') or '..' in unquote(parts.path).split('/'):
            raise ValueError('Refusing nonlocal download destination')
        query = parse_qs(parts.query)
        query['published_verify'] = [self.token]
        suffix = urlunsplit(('', '', parts.path, urlencode(query, doseq=True), ''))
        url = urljoin(self.base, suffix)
        request = Request(url, headers={'User-Agent': 'MuseumV6PublishedVerifier/1.0', 'Cache-Control': 'no-cache'})
        # Each worker gets its own opener; no shared mutable urllib state.
        opener = build_opener(SameOriginRedirects(self.origin, self.prefix))
        with opener.open(request, timeout=timeout) as response:
            data = response.read(MAX_BYTES + 1)
            if response.status != 200 or len(data) > MAX_BYTES:
                raise ValueError(f'Expected bounded HTTP 200: {relative}')
            return data, {'url': url, 'status': response.status,
                          'contentType': response.headers.get('Content-Type', '')}


def wait_for_deploy(client: PagesClient, root: Path, expected: dict, version: str, maximum: float, interval: float) -> dict:
    deadline = time.monotonic() + maximum
    attempts = []
    while True:
        try:
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                raise TimeoutError('Deployment readiness deadline reached')
            data, response = client.fetch('index.html', timeout=min(12, remaining))
            assets = checked_assets(data.decode('utf-8'), version, (root/'bootstrap.js').read_text() if (root/'bootstrap.js').is_file() else '')
            verified = []
            for name, source in assets.items():
                remaining = deadline - time.monotonic()
                if remaining <= 0:
                    raise TimeoutError('Deployment readiness deadline reached')
                live, metadata = client.fetch(source, timeout=min(12, remaining))
                local = (root / name).read_bytes()
                if digest(live) != digest(local):
                    raise ValueError(f'Stale/mismatched published asset: {name}')
                if name in ('collection.js','data/museum-content.json') and digest(live) != expected['collectionSha256']:
                    raise ValueError('Published collection SHA256 differs from checkout')
                verified.append({'name': name, 'sha256': digest(live), **metadata})
            return {'ready': True, 'index': response, 'assetVersion': version,
                    'assets': verified, 'attempts': attempts, 'checkedAt': now()}
        except Exception as error:
            attempts.append({'at': now(), 'error': str(error)})
            if time.monotonic() >= deadline:
                return {'ready': False, 'attempts': attempts, 'error': 'Publication did not match checkout within the bounded readiness window'}
            time.sleep(min(interval, max(0, deadline - time.monotonic())))


def decoded_photo(data: bytes, minimum: int) -> dict:
    with warnings.catch_warnings():
        warnings.simplefilter('error', Image.DecompressionBombWarning)
        with Image.open(BytesIO(data)) as image:
            image.load()  # Decode pixels; checking headers/HTTP status is insufficient.
            width, height = image.size
            fmt = image.format
        with Image.open(BytesIO(data)) as image:
            image.verify()
    if width < minimum or height < minimum:
        raise ValueError(f'Image too small: {width}x{height}, require both dimensions >= {minimum}')
    if fmt not in ('JPEG', 'PNG', 'WEBP', 'GIF'):
        raise ValueError(f'Unexpected photo format: {fmt}')
    return {'width': width, 'height': height, 'format': fmt, 'sha256': digest(data), 'bytes': len(data)}


def verify_photo(client: PagesClient, photo: dict, minimum: int) -> dict:
    result = dict(photo)
    try:
        data, response = client.fetch(photo['path'])
        result.update(response)
        if not response['contentType'].split(';')[0].startswith('image/'):
            raise ValueError('Expected an image Content-Type, not an HTML fallback')
        result.update(decoded_photo(data, minimum))
        if result['sha256'] != photo['expectedSha256']:
            raise ValueError('Live photo bytes differ from the checked-out source asset')
        result['passed'] = True
    except Exception as error:
        result.update(passed=False, error=str(error))
    return result


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def verify(args) -> dict:
    root = args.root.resolve()
    report = {'schemaVersion': 1, 'startedAt': now(), 'checkoutCommit': os.environ.get('GITHUB_SHA'),
              'baseUrl': args.base_url, 'passed': False,
              'scope': 'Actual deployed code/data and decoded same-origin photo bytes, not historical accuracy, artifact identity by visual inspection, camera/audio, model quality or video playback.'}
    try:
        photos, expected = expected_photos(root, args.minimum_records)
        report['expected'] = expected
        assets=checked_assets((root / 'index.html').read_text(), args.asset_version, (root/'bootstrap.js').read_text() if (root/'bootstrap.js').is_file() else '')
        for name in [name for name in assets if name.endswith('.js')]:
            subprocess.run(['node', '--check', str(root / name)], check=True, capture_output=True, timeout=20)
        token = os.environ.get('GITHUB_SHA') or expected['collectionSha256'][:16]
        client = PagesClient(args.base_url, token)
        readiness = wait_for_deploy(client, root, expected, args.asset_version, args.max_wait, args.poll_interval)
        report['deployment'] = readiness
        if not readiness['ready']:
            report['error'] = readiness['error']
            return report
        results = []
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            pending = [pool.submit(verify_photo, client, photo, args.minimum_dimension) for photo in photos]
            for completed in as_completed(pending):
                results.append(completed.result())
        results.sort(key=lambda row: row['id'])
        successful = [row for row in results if row['passed']]
        hashes = {}
        duplicates = []
        for row in successful:
            if row['sha256'] in hashes:
                duplicates.append({'first': hashes[row['sha256']], 'second': row['id'], 'sha256': row['sha256']})
            else:
                hashes[row['sha256']] = row['id']
        report['photos'] = results
        report['summary'] = {'records': len(photos), 'decodedPhotosPassed': len(successful),
                             'distinctPhotoUrls': len({row['path'] for row in results}),
                             'distinctDecodedPhotoSha256': len(hashes), 'duplicatePhotoBytes': duplicates,
                             'failedPhotos': len(results) - len(successful)}
        report['passed'] = len(successful) == len(photos) and len(hashes) == len(photos)
    except Exception as error:
        report['error'] = str(error)
    finally:
        report['finishedAt'] = now()
    return report


def arguments(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=ROOT)
    parser.add_argument('--base-url', default=DEFAULT_BASE)
    parser.add_argument('--minimum-records', type=int, default=200)
    parser.add_argument('--minimum-dimension', type=int, default=128)
    parser.add_argument('--asset-version', default='7.2.0')
    parser.add_argument('--max-wait', type=float, default=180)
    parser.add_argument('--poll-interval', type=float, default=8)
    parser.add_argument('--workers', type=int, default=8)
    parser.add_argument('--report', type=Path)
    args = parser.parse_args(argv)
    if not (1 <= args.minimum_records <= 1000 and 128 <= args.minimum_dimension <= 4096 and
            0 < args.max_wait <= 180 and 0 < args.poll_interval <= 30 and 1 <= args.workers <= 16):
        parser.error('Limits: records 1..1000, dimension 128..4096, readiness 0..180s, interval 0..30s, workers 1..16')
    args.report = args.report or args.root / 'data/published-verification.json'
    return args


def main(argv=None) -> int:
    args = arguments(argv)
    report = verify(args)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({key: report[key] for key in ('passed', 'baseUrl', 'expected', 'summary', 'error') if key in report}, ensure_ascii=False))
    print(f'Verification report: {args.report}')
    return 0 if report['passed'] else 1


if __name__ == '__main__':
    sys.exit(main())
