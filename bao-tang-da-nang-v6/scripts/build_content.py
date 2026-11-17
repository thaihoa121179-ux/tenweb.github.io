"""Validate the canonical records and rebuild deterministic compressed delivery bytes."""
import argparse
import gzip
import hashlib
from io import BytesIO
import json
from pathlib import Path
from urllib.parse import urlsplit

ROOT=Path(__file__).resolve().parents[1]

def validate(root=ROOT):
    path=root/'data/museum-content.json'
    raw=path.read_bytes(); data=json.loads(raw)
    assert data['schemaVersion']==1
    artifacts=data['artifacts']; assert len(artifacts)==200
    assert len(data['topics'])==15
    for key in ('id','url','image'):
        assert len({a[key] for a in artifacts})==200, f'Duplicate {key}'
    hashes=set()
    for a in artifacts:
        assert a['name'] and a['summary'] and a['era'] and a['material']
        assert a['guide']['id']=='artifact:'+a['id'] and a['guide']['source']==a['url']
        assert urlsplit(a['url']).scheme=='https'
        image=(root/a['image']).resolve()
        assert image.is_relative_to(root.resolve()) and image.is_file()
        digest=hashlib.sha256(image.read_bytes()).hexdigest()
        assert digest not in hashes, f'Reused photo: {a["id"]}'
        hashes.add(digest)
        if a.get('referenceOnly'):
            assert a['institutionName'] and a['institutionId'] and not a['locationVerified']
            assert a.get('sourceSite') not in ('site1','site2')
    assert sum(bool(a.get('referenceOnly')) for a in artifacts)==143
    assert sum(not a.get('referenceOnly') for a in artifacts)==57
    return raw, data

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__); parser.add_argument('--check',action='store_true'); args=parser.parse_args()
    raw,data=validate(); buffer=BytesIO()
    with gzip.GzipFile(fileobj=buffer,mode='wb',compresslevel=9,mtime=0,filename='') as archive: archive.write(raw)
    packed=buffer.getvalue(); target=ROOT/'data/museum-content.json.gz'
    if args.check: assert target.read_bytes()==packed,'Run build_content.py after editing the canonical JSON'
    else: target.write_bytes(packed)
    print(json.dumps({'records':200,'topics':15,'daNang':57,'otherMuseums':143,'jsonBytes':len(raw),'gzipBytes':len(packed)},ensure_ascii=False))
