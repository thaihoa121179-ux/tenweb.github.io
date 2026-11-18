/* Đường ngắn nhất trên graph minh họa. Không suy luận vị trí thật từ tên hiện vật. */
((root)=>{
 'use strict';const E=()=>root.MuseumMapEngine,C=()=>root.MuseumMapConfig;
 function graph(floors){
  const nodes=new Map(),adj=new Map();
  for(const f of Object.values(floors))for(const n of f.graph.nodes){const id=f.floor+':'+n.id;nodes.set(id,{...n,floor:f.floor,key:id});adj.set(id,[]);}
  function edge(a,b,cost,type){if(nodes.has(a)&&nodes.has(b))adj.get(a).push({to:b,cost,type});}
  for(const f of Object.values(floors)){
   for(const [a,b]of f.graph.edges){const x=f.floor+':'+a,y=f.floor+':'+b,d=E().distance(nodes.get(x),nodes.get(y));edge(x,y,d);edge(y,x,d);}
   for(const c of f.connectors)for(const target of c.targets)edge(f.floor+':'+c.nodeId,target.floor+':'+target.nodeId,c.type==='stairs'?C().stairsCost:C().liftCost,c.type);
  }return{nodes,adj};
 }
 function route(floors,start,target){
  const f=floors[start.floor];if(!f||!E().walkable(f,start)||!floors[target.floor])return null;
  const g=graph(floors),end=target.floor+':'+target.nodeId;if(!g.nodes.has(end))return null;
  const cost=new Map(),prev=new Map(),open=new Set();
  // Các node nối với vị trí hiện tại phải có đoạn thẳng đi được: không nối xuyên tường.
  for(const node of f.graph.nodes)if(!E().move(f,start,node.x-start.x,node.y-start.y).blocked){const key=f.floor+':'+node.id;cost.set(key,E().distance(start,node));open.add(key);}
  while(open.size){const at=[...open].sort((a,b)=>cost.get(a)-cost.get(b))[0];open.delete(at);if(at===end)break;
   for(const edge of g.adj.get(at)){const c=cost.get(at)+edge.cost;if(c<(cost.get(edge.to)??Infinity)){cost.set(edge.to,c);prev.set(edge.to,{from:at,type:edge.type});open.add(edge.to);}}
  }
  if(!cost.has(end))return null;const ids=[end];while(prev.has(ids[0]))ids.unshift(prev.get(ids[0]).from);
  const points=[{id:'start',floor:start.floor,x:start.x,y:start.y},...ids.map(id=>({...g.nodes.get(id),via:prev.get(id)?.type}))];
  return{points,distance:cost.get(end),target};
 }
 function itinerary(floors,start,targets){
  let at=start,points=[],distance=0;
  for(let i=0;i<targets.length;i++){const leg=route(floors,at,targets[i]);if(!leg)return null;
   const part=leg.points.map(p=>({...p}));part.at(-1).stop=true;part.at(-1).stopIndex=i;points.push(...(points.length?part.slice(1):part));distance+=leg.distance;at={...part.at(-1)};
  }return{points,distance};
 }
 function deviation(points,p,floor){
  let d=Infinity;
  for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(a.floor===floor&&b.floor===floor)d=Math.min(d,E().distance(p,E().nearestSegment(p,a,b)));}
  return d;
 }
 function instruction(points,cursor,position){
  const p=points[cursor];if(!p)return{kind:'arrived',distance:0};
  if(p.floor!==position.floor)return{kind:p.via||'stairs',floor:p.floor,distance:0};
  let distance=E().distance(position,p),a=position,b=p;
  for(let i=cursor+1;i<points.length;i++){
   const next=points[i];if(next.floor!==b.floor)return{kind:next.via||'stairs',floor:next.floor,distance};
   const d1={x:b.x-a.x,y:b.y-a.y},d2={x:next.x-b.x,y:next.y-b.y};
   if(Math.hypot(d1.x,d1.y)>.1&&Math.hypot(d2.x,d2.y)>.1){const cross=d1.x*d2.y-d1.y*d2.x,dot=d1.x*d2.x+d1.y*d2.y,angle=Math.atan2(cross,dot)*180/Math.PI;
    if(Math.abs(angle)>35)return{kind:angle>0?'right':'left',distance};}
   distance+=E().distance(b,next);a=b;b=next;if(b.stop)break;
  }return{kind:'straight',distance};
 }
 // Chỉ phát một lần cho mỗi lượt đi ngang; phải ra khỏi vùng có hysteresis mới tái kích hoạt.
 function tracker(){
  const states=new Map();let current=null;
  function update(floor,position,time){const entered=[];current=null;
   for(const z of floor.zones){const inside=E().inPolygon(position,z.polygon)||E().distance(position,z.center)<=z.triggerRadius;
    let s=states.get(z.id)||{inside:false,last:-Infinity};
    if(inside){current=z;if(!s.inside){s.inside=true;if(time-s.last>=C().zoneCooldownMs){s.last=time;entered.push(z);}}}
    else if(s.inside){let edge=Infinity;for(let i=0;i<z.polygon.length;i++){const a=z.polygon[i],b=z.polygon[(i+1)%z.polygon.length];edge=Math.min(edge,E().distance(position,E().nearestSegment(position,{x:a[0],y:a[1]},{x:b[0],y:b[1]})));}if(edge>C().zoneExitMargin&&E().distance(position,z.center)>z.triggerRadius+C().zoneExitMargin)s.inside=false;}
    states.set(z.id,s);
   }return entered;
  }return{update,get current(){return current;},reset(){states.clear();current=null;}};
 }
 root.MuseumMapNavigation=Object.freeze({graph,route,itinerary,deviation,instruction,tracker});
})(globalThis);
