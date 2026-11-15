"""Second bounded pass: exact official catalogue schemas and source video pages."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import json, urllib.request
urls=[
'https://chammuseum.vn/page-sitemap.xml',
'https://chammuseum.vn/cac-tac-pham-tieu-bieu/',
'https://chammuseum.vn/bao-vat-quoc-gia/',
'https://baotanglichsu.vn/Sitemap.aspx',
'https://baotanglichsu.vn/vi/Articles/1001/bao-vat-quoc-gia',
'https://baotanglichsu.vn/vi/Articles/1002/hien-vat',
'https://baotanglichsu.vn/vi/Articles/1002/hien-vat?page=2',
'https://baotanglichsu.vn/vi/Articles/1001/73731/bao-vat-quoc-gia-trong-hoang-ha.html',
'https://baotanglichsu.vn/vi/Articles/1002/73158/vo-hoc-bang-mo-tre-luu-giu-tai-btlsqg.html',
'https://baotanglichsu.vn/vi/Video',
'https://baotangdanang.vn/phim-bai-choi',
'https://chammuseum.vn/exhibition-sitemap.xml',
]
def fetch(url):
 try:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'MuseumCompanion source research','Accept':'text/html,application/xml'}),timeout=30) as r:
   b=r.read(5*1024*1024+1);assert len(b)<=5*1024*1024;return {'url':url,'finalUrl':r.url,'status':r.status,'html':b.decode('utf-8',errors='replace')}
 except Exception as e:return {'url':url,'error':str(e)}
rows=list(ThreadPoolExecutor(max_workers=3).map(fetch,urls))
p=Path(__file__).resolve().parents[1]/'data/expansion-samples.json';p.parent.mkdir(exist_ok=True);p.write_text(json.dumps(rows,ensure_ascii=False,indent=2))
for r in rows:print(r['url'],r.get('status',r.get('error')),len(r.get('html','')))
