"""Capture public official catalogue responses for an auditable importer."""
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import urllib.request

urls = [
 'https://baotangdanang.vn/bao-tang-da-nang/hien-vat',
 'https://baotangdanang.vn/sitemap.xml',
 'https://baotangdanang.vn/robots.txt',
 'https://baotangdanang.vn/bao-tang-da-nang/hien-vat/trang-sc-ma-nao',
]
def fetch(url):
 try:
  request=urllib.request.Request(url,headers={'User-Agent':'MuseumCompanion/6.3 source catalogue import','Accept':'text/html,application/json,application/xml'})
  with urllib.request.urlopen(request,timeout=45) as response:
   body=response.read(5*1024*1024+1)
   if len(body)>5*1024*1024:raise ValueError('response too large')
   return {'url':url,'final_url':response.url,'status':response.status,'content_type':response.headers.get('content-type'),'body':body.decode('utf-8',errors='replace')}
 except Exception as error:return {'url':url,'error':str(error)}
results=list(ThreadPoolExecutor(max_workers=2).map(fetch,urls))
root=Path(__file__).resolve().parents[1]
(root/'data').mkdir(parents=True,exist_ok=True)
(root/'data/source-discovery.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
for item in results:print(item['url'],item.get('status',item.get('error')),len(item.get('body','')))
assert results[0].get('status')==200,'Official catalogue unavailable'
