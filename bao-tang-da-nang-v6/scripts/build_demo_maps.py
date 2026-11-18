"""Sinh sơ đồ lớp học minh họa. Không thay dữ liệu lịch sử hay mô tả vị trí thật.
Chạy thủ công khi muốn dựng lại; ứng dụng chỉ đọc các JSON đã sinh.
"""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
content=json.loads((ROOT/'data/museum-content.json').read_text())
def rect(x,y,w,h):return [[x,y],[x+w,y],[x+w,y+h],[x,y+h]]
for level in [1,2,3]:
 topics=[t for t in content['topics'] if t['floor']==level]
 cols=3 if level==1 else 2 if level==2 else 4
 width=48/cols
 zones=[];walls=[];walk=[rect(3,17,54,6)];nodes=[];edges=[]
 centers=[]
 def wall(a,b):walls.append({'a':a,'b':b})
 for i,t in enumerate(topics):
  row=i//cols;cx=6+width*(i%cols+.5);north=row==0;y=3 if north else 25;w=width-2;x=cx-w/2;door=15 if north else 25;cy=9 if north else 31
  walk.extend([rect(x,y,w,12),rect(cx-1.4,14 if north else 22,2.8,4)])
  wall([x,y],[x,y+12]);wall([x+w,y],[x+w,y+12]);wall([x,y if north else y+12],[x+w,y if north else y+12]);wall([x,door],[cx-1.4,door]);wall([cx+1.4,door],[x+w,door])
  artifacts=[a['id'] for a in content['artifacts'] if not a.get('referenceOnly') and a.get('sourceSite','site1')=='site1' and a['topic']==t['id']]
  zid=f'f{level}-{t["id"]}'
  zones.append({'id':zid,'names':t['names'],'polygon':rect(x,y,w,12),'center':{'x':cx,'y':cy},'triggerRadius':5,'topicId':t['id'],'artifactIds':artifacts,'door':{'x':cx,'y':door}})
  centers.append(cx);nodes.extend([{'id':zid,'x':cx,'y':cy},{'id':zid+'-door','x':cx,'y':18 if north else 22}]);edges.extend([[zid,zid+'-door'],[zid+'-door',f'h-{cx:g}']])
 for cx in sorted(set([6,10,50,54,*centers])):nodes.append({'id':f'h-{cx:g}','x':cx,'y':20})
 hallway=[n for n in nodes if n['id'].startswith('h-')];edges.extend([[a['id'],b['id']] for a,b in zip(hallway,hallway[1:])])
 for a,b in [([1,1],[59,1]),([59,1],[59,39]),([59,39],[1,39]),([1,39],[1,1])]:wall(a,b)
 pois=[{'id':f'f{level}-stairs','type':'stairs','x':54,'y':20,'nodeId':'h-54'},{'id':f'f{level}-lift','type':'lift','x':54,'y':21.8,'nodeId':'h-54'},{'id':f'f{level}-wc','type':'wc','x':50,'y':20,'nodeId':'h-50'}]
 if level==1:pois.extend([{'id':'f1-exit','type':'exit','x':6,'y':20,'nodeId':'h-6'},{'id':'f1-ticket','type':'ticket','x':10,'y':20,'nodeId':'h-10'}])
 connectors=[{'id':f'f{level}-{kind}','type':kind,'nodeId':'h-54','x':54,'y':20,'targets':[{'floor':n,'nodeId':'h-54'} for n in [1,2,3] if n!=level and (kind=='lift' or abs(n-level)==1)]} for kind in ['stairs','lift']]
 data={'schemaVersion':1,'illustrative':True,'floor':level,'size':{'width':60,'height':40,'unit':'m'},'start':{'x':6,'y':20,'heading':90},'walls':walls,'walkable':walk,'zones':zones,'pois':pois,'connectors':connectors,'graph':{'nodes':nodes,'edges':edges},'tour':[z['id'] for z in zones]}
 (ROOT/f'data/maps/floor-{level}.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
 print('floor',level,'zones',len(zones),'nodes',len(nodes))
