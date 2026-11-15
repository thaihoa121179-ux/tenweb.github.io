"""Bounded read-only official public collection API schema samples."""
import json,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
URLS=["https://api.vam.ac.uk/v2/objects/search?q=Vietnam&page_size=3&images_exist=1", "https://openaccess-api.clevelandart.org/api/artworks/?q=Vietnam&has_image=1&limit=2", "https://api.artic.edu/api/v1/artworks/search?q=Vietnam&limit=3&fields=id,title,image_id,date_display,place_of_origin,medium_display,description,dimensions,credit_line"]
rows=[]
def get(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url,headers={"User-Agent":"MuseumCompanion/6.5 public collection schema review"}),timeout=25) as r:
            raw=r.read(1500000)
            data=json.loads(raw)
            rows.append({"url":url,"status":r.status,"data":data})
            return data
    except Exception as error: rows.append({"url":url,"error":str(error)})
for url in URLS:
    data=get(url)
    if "vam.ac.uk" in url and isinstance(data,dict):
        for record in data.get("records",[])[:1]:
            number=record.get("systemNumber")
            if number: get("https://api.vam.ac.uk/v2/museumobject/"+number)
(ROOT/"data/reference-api-sample.json").write_text(json.dumps(rows,ensure_ascii=False,indent=2)+"\n")
print(json.dumps([{k:v for k,v in row.items()if k!="data"}for row in rows]))
