/* Bộ chạy tuyến sân khấu thuần JS. Không cảm biến, mạng, DOM hoặc ghi tiến độ cá nhân. */
((root)=>{
 'use strict';
 const E=()=>root.MuseumMapEngine,N=()=>root.MuseumMapNavigation;
 let serial=0;
 function compile(raw,floors,artifacts,topics){
  if(raw?.schemaVersion!==1||raw.illustrative!==true||raw.id!=='may-nine-stops'||!Array.isArray(raw.stops)||raw.stops.length!==9)throw Error('demo_schema');
  if(!Number.isFinite(raw.speed)||raw.speed<1||raw.speed>12||!Number.isFinite(raw.arrivalRadius)||raw.arrivalRadius<.5||raw.arrivalRadius>3)throw Error('demo_settings');
  const ids=new Set(),themes=new Set(),counts={1:0,2:0,3:0},featured={1:0,2:0,3:0};
  const stops=raw.stops.map(s=>{
   const f=floors[s.floor],z=f?.zones.find(z=>z.id===s.zoneId&&z.topicId===s.topicId),d=topics.find(d=>d.id===s.topicId&&d.floor===s.floor);
   if(!z||!d||typeof s.id!=='string'||!/^[a-z0-9-]+$/.test(s.id)||ids.has(s.id)||themes.has(s.topicId))throw Error('demo_stop');
   ids.add(s.id);themes.add(s.topicId);counts[s.floor]++;
   if(s.artifactId){const a=artifacts.find(a=>a.id===s.artifactId);if(!a||a.referenceOnly||(a.sourceSite||'site1')!=='site1'||a.topic!==s.topicId||!z.artifactIds.includes(a.id))throw Error('demo_record');}
   if(s.featured){if(!s.artifactId)throw Error('demo_featured');featured[s.floor]++;}
   return{id:s.id,floor:s.floor,zoneId:z.id,topicId:d.id,artifactId:s.artifactId||null,featured:s.featured===true,nodeId:z.id,center:{...z.center}};
  });
  if(![1,2,3].every(n=>counts[n]===3&&featured[n]===1)||stops.some((s,i)=>s.floor!==Math.floor(i/3)+1))throw Error('demo_floor_order');
  const path=N().itinerary(floors,{floor:1,...floors[1].start},stops);if(!path)throw Error('demo_path');
  let total=0;
  const points=path.points.map((p,i)=>{
   if(i){const a=path.points[i-1];if(a.floor===p.floor){if(E().move(floors[a.floor],a,p.x-a.x,p.y-a.y).blocked)throw Error('demo_wall');total+=E().distance(a,p);}
    else{if(!floors[a.floor].connectors.some(c=>c.type===p.via&&c.nodeId===a.id&&c.targets.some(t=>t.floor===p.floor&&t.nodeId===p.id)))throw Error('demo_connector');total+=p.via==='lift'?root.MuseumMapConfig.liftCost:root.MuseumMapConfig.stairsCost;}}
   if(p.stop){const s=stops[p.stopIndex],previous=path.points[i-1],lastLength=previous?.floor===p.floor?E().distance(previous,p):0;s.at=total;s.arrivalAt=total-Math.min(raw.arrivalRadius,lastLength*.8);}
   return Object.freeze({...p,at:total});
  });
  if(stops.some((s,i)=>!Number.isFinite(s.arrivalAt)||s.arrivalAt<=(stops[i-1]?.arrivalAt??0)))throw Error('demo_stop_order');
  return Object.freeze({id:raw.id,speed:raw.speed,length:total,points:Object.freeze(points),stops:Object.freeze(stops.map(s=>Object.freeze({...s,center:Object.freeze(s.center)})))});
 }
 function pose(route,distance){
  const points=route.points;let i=1;while(i<points.length&&points[i].at<distance-1e-7)i++;
  const b=points[Math.min(i,points.length-1)],a=points[Math.max(0,i-1)],part=b.at-a.at,f=part?Math.max(0,Math.min(1,(distance-a.at)/part)):1;
  // Phần trăm của thanh tua đi qua phép chia/nhân; cho phép sai số tại đúng đầu cầu thang.
  if(a.floor!==b.floor){const arrived=f>=1-1e-8;return{floor:arrived?b.floor:a.floor,x:arrived?b.x:a.x,y:arrived?b.y:a.y,heading:90};}
  return{floor:b.floor,x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,heading:part?E().normalize(Math.atan2(b.x-a.x,-(b.y-a.y))*180/Math.PI):90};
 }
 function createPlayer(route){
  let distance=0,running=false,visited=new Set(),lastStop=-1,preview=false,speed=1,sessionId='';
  const complete=()=>distance>=route.length-1e-6||(visited.has(route.stops.at(-1).id)&&distance>=route.stops.at(-1).arrivalAt-1e-6);
  const next=()=>route.stops.find(s=>s.arrivalAt>distance+1e-6);
  function state(){return{sessionId,running,preview,complete:complete(),distance,percent:complete()?100:distance/route.length*100,speed,visited:[...visited],lastStop,position:pose(route,distance),nextIndex:route.stops.indexOf(next())};}
  function reset(){distance=0;running=false;visited=new Set();lastStop=-1;preview=false;sessionId='demo-'+Date.now().toString(36)+'-'+(++serial);return state();}
  function play(){if(complete())return false;running=true;preview=false;return true;}
  function pause(){running=false;return state();}
  function seek(percent){if(!Number.isFinite(percent))return state();running=false;preview=true;distance=Math.max(0,Math.min(100,percent))/100*route.length;lastStop=-1;route.stops.forEach((s,i)=>{if(s.arrivalAt<=distance+1e-6)lastStop=i;});return state();}
  function tick(seconds){
   if(!running||!Number.isFinite(seconds)||seconds<=0)return null;
   const target=next();if(!target){running=false;return null;}
   distance=Math.min(target.arrivalAt,distance+Math.min(seconds,.25)*route.speed*speed);
   if(distance<target.arrivalAt-1e-6)return null;
   running=false;lastStop=route.stops.indexOf(target);const firstVisit=!visited.has(target.id);visited.add(target.id);preview=false;
   return{stop:target,index:lastStop,firstVisit};
  }
  reset();return Object.freeze({getState:state,play,pause,reset,seek,tick,setSpeed:value=>{if([1,2,4].includes(value))speed=value;return state();}});
 }
 root.MuseumDemoTour=Object.freeze({compile,pose,createPlayer});
})(globalThis);
