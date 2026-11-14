"""Import original museum photos as versioned website assets; no substitutes."""
import hashlib
import json
from pathlib import Path
import re
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
urls = sorted(set(re.findall(r'https://(?:baotangdanang\.vn|dnfam-website\.vr360\.com\.vn)/uploads/[^"\s]+', (ROOT / 'app.js').read_text())))
assert len(urls) == 18, f'Expected 18 original image URLs, found {len(urls)}'
assets = ROOT / 'assets' / 'museum'
assets.mkdir(parents=True, exist_ok=True)
manifest = {}
for url in urls:
    request = urllib.request.Request(url, headers={'User-Agent': 'MuseumCompanion/6.2', 'Accept': 'image/*'})
    with urllib.request.urlopen(request, timeout=60) as response:
        assert response.status == 200, (url, response.status)
        data = response.read(12 * 1024 * 1024 + 1)
    assert len(data) <= 12 * 1024 * 1024, f'Image too large: {url}'
    if data[:4] == b'RIFF' and data[8:12] == b'WEBP': ext = 'webp'
    elif data[:3] == b'\xff\xd8\xff': ext = 'jpg'
    elif data[:8] == b'\x89PNG\r\n\x1a\n': ext = 'png'
    else: raise ValueError(f'Not a supported real image: {url}')
    name = hashlib.sha256(url.encode()).hexdigest()[:16] + '.' + ext
    (assets / name).write_bytes(data)
    manifest[url] = 'assets/museum/' + name
    print(f'Imported {name}: {len(data)} bytes')
serialized = json.dumps(manifest, ensure_ascii=False, indent=2)
(ROOT / 'media-map.js').write_text('/* Original museum photo URLs mapped to local files. */\nwindow.MuseumMediaMap = ' + serialized + ';\n')
(ROOT / 'assets' / 'museum' / 'SOURCES.json').write_text(serialized + '\n')
version = hashlib.sha256(serialized.encode()).hexdigest()[:12]
index = ROOT / 'index.html'
index.write_text(re.sub(r'media-map\.js(?:\?v=[^"\s]+)?', 'media-map.js?v=' + version, index.read_text()))
print(f'Imported all {len(manifest)} original images.')
