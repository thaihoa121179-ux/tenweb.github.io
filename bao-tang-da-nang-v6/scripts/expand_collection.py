"""Import complete, illustrated records from the official Da Nang Museum sites.
No invented facts, translations, physical positions or substitute images.
"""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse
import hashlib, io, json, re, time, unicodedata, urllib.request
from bs4 import BeautifulSoup
from PIL import Image, ImageOps

ROOT=Path(__file__).resolve().parents[1]
TARGET=75
SITE='https://baotangdanang.vn'
HEADERS={'User-Agent':'MuseumCompanion/6.3 official catalogue import','Accept':'text/html,image/*'}
legacy=set(json.loads((ROOT/'data/legacy-source-urls.json').read_text()))

def request(url, maximum=12*1024*1024):
    assert urlparse(url).hostname=='baotangdanang.vn', 'Only official source host is allowed'
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url,headers=HEADERS),timeout=40) as r:
                if r.status!=200:raise ValueError(f'HTTP {r.status}')
                data=r.read(maximum+1)
                if len(data)>maximum:raise ValueError('Source is too large')
                return data
        except Exception:
            if attempt==2:raise
            time.sleep(1+attempt)

def clean(value):return re.sub(r'\s+',' ',str(value)).strip()
def topic(title,material,description):
    text=unicodedata.normalize('NFD',title+' '+material+' '+description).encode('ascii','ignore').decode().lower()
    if any(x in text for x in ['chien tranh','khang chien','cach mang','nhat ky','dan duoc','vu khi']):return 'doc-lap'
    if any(x in text for x in ['co tu','xo dang','gie trieng','dan toc','nha guol','khung det']):return 'dan-toc'
    if any(x in text for x in ['ghe bau','ngu cu','danh ca','thuyen']):return 'van-hoa-quang'
    return 'co-vat'

def parse_record(html,url):
    soup=BeautifulSoup(html,'html.parser')
    h=soup.select_one('h1.artifact-detail-title')
    if not h:raise ValueError('No artifact title')
    name=clean(h.get_text(' ',strip=True))
    fields={}
    for row in soup.select('table.artifact-info-table tr'):
        cells=row.find_all('td')
        if len(cells)>=2:fields[clean(cells[0].get_text(' ',strip=True)).lower()]=clean(cells[1].get_text(' ',strip=True))
    material=fields.get('chất liệu','');era=fields.get('niên đại','');origin=fields.get('nguồn gốc','')
    content=soup.select_one('.artifact-description-content')
    description=clean(content.get_text(' ',strip=True)) if content else ''
    material_quote=''
    if not material:
        explicit=re.search(r'(?:được\s+)?(?:làm|chế tác)\s+(?:bằng|từ)(?:\s+chất liệu)?\s+((?:đá|gỗ|kim loại|gốm|sứ|đồng|giấy|sắt|bạc|vàng|xương|ngà|thủy tinh)[^.;]{0,65})(?:[.;]|$)',description,re.I)
        if explicit:material=clean(explicit[1]);material_quote=explicit[0]
    image=soup.find('img',alt=h.get_text(strip=True))
    if not image or '/uploads/artifacts/' not in image.get('src',''):
        image=soup.select_one('.artifact-detail img[src*="/uploads/artifacts/"]')
    if not image:
        image=soup.find('img',src=re.compile('/uploads/artifacts/'))
    image_url=image.get('src','') if image else ''
    if image_url.startswith('/'):image_url=SITE+image_url
    invalid={'','-','...','chưa rõ','không rõ','chưa xác định','đang cập nhật'}
    if len(name)<3 or material.lower() in invalid or era.lower() in invalid or len(origin)<3 or (len(origin)<20 and len(description)<80) or not image_url:
        raise ValueError('Incomplete title/image/material/date/origin')
    # Do not infer a material from an object category.
    if material.lower() in {'vật dụng sinh hoạt','hiện vật','tư liệu'}:raise ValueError('Object category is not a material')
    site='site2' if '/bao-tang-da-nang-co-so-2/' in url else 'site1'
    digest=hashlib.sha256(url.encode()).hexdigest()[:12]
    slug=unicodedata.normalize('NFD',name).replace('đ','d').replace('Đ','D').encode('ascii','ignore').decode().lower()
    slug=re.sub('[^a-z0-9]+','-',slug).strip('-')[:45]
    summary=description or origin
    if len(summary)>520:
        cut=summary[:520].rfind('. ');summary=summary[:cut+1] if cut>120 else summary[:517]+'…'
    return {'id':'hv-'+slug+'-'+digest[:6],'name':name,'en':name,'summary':summary,'enSummary':summary,'description':description,'origin':origin,'era':era,'material':material,'url':url,'sourceImage':image_url,'sourceSite':site,'sourceSiteLabel':'Bảo tàng Đà Nẵng · Cơ sở '+('2' if site=='site2' else '1'),'sourceLanguage':'vi','dimensions':fields.get('kích thước',''),'sourceFields':fields,'materialEvidence':material_quote,'imported':True,'locationVerified':False,'topic':topic(name,material,description),'image':'assets/collection/'+digest+'.webp'}

def fetch_record(url):
    try:
        record=parse_record(request(url,5*1024*1024).decode('utf-8'),url)
        data=request(record['sourceImage'])
        with Image.open(io.BytesIO(data)) as image:
            image.load()
            if min(image.size)<128:raise ValueError('Source image too small')
            photo=ImageOps.exif_transpose(image).convert('RGB');photo.thumbnail((1600,1600))
            out=io.BytesIO();photo.save(out,format='WEBP',quality=88,method=5)
        record['sourceImageSha256']=hashlib.sha256(data).hexdigest()
        return record,out.getvalue(),None
    except Exception as e:return None,None,{'url':url,'reason':str(e)}

def main():
    sitemap=request(SITE+'/sitemap.xml',5*1024*1024).decode('utf-8')
    urls=list(dict.fromkeys(u for u in re.findall(r'<loc>(.*?)</loc>',sitemap) if re.match(r'https://baotangdanang\.vn/(bao-tang-da-nang|bao-tang-da-nang-co-so-2)/hien-vat/[^/?]+$',u)))
    candidates=[u for u in urls if u not in legacy]
    print('Official site1/site2 records:',len(urls),'new candidates:',len(candidates),flush=True)
    kept=[];skipped=[];image_hashes=set()
    for record,data,error in ThreadPoolExecutor(max_workers=3).map(fetch_record,candidates):
        if error:skipped.append(error);print('Skipped',error,flush=True);continue
        if record['sourceImageSha256'] in image_hashes:skipped.append({'url':record['url'],'reason':'Duplicate original photograph'});continue
        image_hashes.add(record['sourceImageSha256']);kept.append((record,data));print('Eligible:',record['name'],flush=True)
    # Quality comes before filling a target. Never pad with incomplete records.
    chosen=kept[:max(0,TARGET-len(legacy))]
    assert len(chosen)+len(legacy)>=50,f'Only {len(chosen)+len(legacy)} complete records, refusing an incomplete expansion'
    for record,data in chosen:
        file=ROOT/record['image'];file.parent.mkdir(parents=True,exist_ok=True);file.write_bytes(data)
    payload={'source':'https://baotangdanang.vn/sitemap.xml','fetchedAt':datetime.now(timezone.utc).isoformat(),'sourceLanguage':'vi','legacyCount':len(legacy),'totalCount':len(legacy)+len(chosen),'items':[r for r,_ in chosen]}
    serialized=json.dumps(payload,ensure_ascii=False,indent=2)
    (ROOT/'collection.js').write_text('/* Official source records, not generated historical claims. */\nglobalThis.MuseumCollection = '+serialized+';\n')
    (ROOT/'data/collection-audit.json').write_text(json.dumps({'officialCandidates':len(urls),'legacyRetained':len(legacy),'newEligible':len(kept),'added':len(chosen),'total':payload['totalCount'],'skipped':skipped,'eligibleNotSelected':[r['url'] for r,_ in kept[len(chosen):]]},ensure_ascii=False,indent=2)+'\n')
    version=hashlib.sha256(serialized.encode()).hexdigest()[:12]
    index=ROOT/'index.html';index.write_text(re.sub(r'collection\.js(?:\?v=[^"\s]+)?','collection.js?v='+version,index.read_text()))
    print('READY:',payload['totalCount'],'records with real local photos',flush=True)

if __name__=='__main__':main()
