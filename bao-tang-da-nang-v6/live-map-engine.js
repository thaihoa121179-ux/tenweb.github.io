/* Hình học và bước chân thuần JS: dùng chung cho cảm biến, joystick, tự đi.
   Không đọc GPS, không truy cập mạng hoặc lưu vị trí. */
((root) => {
 'use strict';
 const C=()=>root.MuseumMapConfig;
 const normalize=n=>((n%360)+360)%360;
 const angleDelta=(a,b)=>((b-a+540)%360)-180;
 const smoothAngle=(a,b,f=C().headingFilter)=>normalize(a+angleDelta(a,b)*f);
 const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 function inPolygon(p,poly){
  let inside=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
   const a=poly[i],b=poly[j],cross=(p.x-a[0])*(b[1]-a[1])-(p.y-a[1])*(b[0]-a[0]);
   if(Math.abs(cross)<1e-7&&p.x>=Math.min(a[0],b[0])-1e-7&&p.x<=Math.max(a[0],b[0])+1e-7&&p.y>=Math.min(a[1],b[1])-1e-7&&p.y<=Math.max(a[1],b[1])+1e-7)return true;
   if((a[1]>p.y)!==(b[1]>p.y)&&p.x<(b[0]-a[0])*(p.y-a[1])/(b[1]-a[1])+a[0])inside=!inside;
  }return inside;
 }
 function walkable(floor,p,r=C().avatarRadius){
  if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return false;
  const inside=q=>floor.walkable.some(poly=>inPolygon(q,poly));
  if(!inside(p))return false;
  for(let k=0;k<8;k++){const a=k*Math.PI/4;if(!inside({x:p.x+Math.cos(a)*r,y:p.y+Math.sin(a)*r}))return false;}return true;
 }
 function move(floor,from,dx,dy){
  let p={...from},blocked=false;const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/C().collisionStep));
  for(let i=0;i<steps;i++){
   const sx=dx/steps,sy=dy/steps,next={x:p.x+sx,y:p.y+sy};
   if(walkable(floor,next)){p=next;continue;}
   blocked=true;
   const px={x:p.x+sx,y:p.y};if(walkable(floor,px))p=px;
   const py={x:p.x,y:p.y+sy};if(walkable(floor,py))p=py;
  }return{position:p,blocked};
 }
 function nearestSegment(p,a,b){
  const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy,t=l?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/l)):0;
  return{x:a.x+t*dx,y:a.y+t*dy};
 }
 function snap(floor,p,direction){
  const nodes=Object.fromEntries(floor.graph.nodes.map(n=>[n.id,n]));let best=null,d=Infinity;
  for(const [a,b]of floor.graph.edges){
   const from=nodes[a],to=nodes[b];
   // Chỉ bám trục cùng hướng đi; kéo ngang sẽ giữ chấm mắc ở hành lang khi muốn rẽ.
   if(direction){const length=distance(from,to)*Math.hypot(direction.x,direction.y);if(!length||Math.abs(((to.x-from.x)*direction.x+(to.y-from.y)*direction.y)/length)<.88)continue;}
   const q=nearestSegment(p,from,to),v=distance(p,q);if(v<d){best=q;d=v;}
  }
  if(best&&d<C().snapDistance)return move(floor,p,(best.x-p.x)*C().snapStrength,(best.y-p.y)*C().snapStrength).position;
  return p;
 }
 // Graph cục bộ được dùng để Tự đi qua cửa; chỉ đường người dùng sẽ nối ở Giai đoạn 2.
 function path(floor,startId,endId){
  const nodes=new Map(floor.graph.nodes.map(n=>[n.id,n])),cost=new Map([[startId,0]]),previous=new Map(),open=new Set([startId]);
  if(!nodes.has(startId)||!nodes.has(endId))return[];
  while(open.size){const at=[...open].sort((a,b)=>cost.get(a)-cost.get(b))[0];open.delete(at);if(at===endId)break;
   for(const [a,b]of floor.graph.edges){const next=a===at?b:b===at?a:null;if(!next)continue;const c=cost.get(at)+distance(nodes.get(at),nodes.get(next));if(c<(cost.get(next)??Infinity)){cost.set(next,c);previous.set(next,at);open.add(next);}}
  }
  if(!cost.has(endId))return[];const ids=[endId];while(ids[0]!==startId)ids.unshift(previous.get(ids[0]));return ids.map(id=>({...nodes.get(id)}));
 }
 function heading(event,screenAngle=0){
  if(Number.isFinite(event.webkitCompassHeading)){if(Number.isFinite(event.webkitCompassAccuracy)&&(event.webkitCompassAccuracy<0||event.webkitCompassAccuracy>50))return null;return normalize(event.webkitCompassHeading+screenAngle);}
  if(event.absolute===true&&Number.isFinite(event.alpha))return normalize(360-event.alpha+screenAngle);
  // Alpha tương đối vẫn dùng được cho mô phỏng sau khi Đặt hướng; không gọi là hướng Bắc thật.
  if(Number.isFinite(event.alpha))return normalize(360-event.alpha+screenAngle);
  return null;
 }
 class StepDetector{
  constructor(){this.reset();}
  reset(){this.gravity=null;this.noise=0;this.peak=null;this.lastStep=-Infinity;this.lastTime=null;this.signal=0;}
  feed(event,time,sensitivity=C().sensitivity){
   const a=event.accelerationIncludingGravity;if(!a||![a.x,a.y,a.z].every(Number.isFinite)||!Number.isFinite(time))return false;
   const mag=Math.hypot(a.x,a.y,a.z);
   if(this.lastTime!==null&&(time<=this.lastTime||time-this.lastTime>1500)){this.reset();}
   this.lastTime=time;if(this.gravity===null){this.gravity=mag;return false;}
   this.gravity+=(mag-this.gravity)*C().gravityFilter;this.signal=mag-this.gravity;
   this.noise=this.noise*0.97+Math.min(Math.abs(this.signal),1.5)*0.03;
   const rate=event.rotationRate,spin=rate?Math.hypot(rate.alpha||0,rate.beta||0,rate.gamma||0):0;
   if(Math.abs(this.signal)>C().shakeCeiling||spin>300){this.peak=null;this.lastStep=time;return false;}
   const threshold=Math.max(C().stepThreshold,Math.min(1.8,this.noise*1.6))/Math.max(.5,sensitivity);
   if(this.signal>threshold&&!this.peak&&time-this.lastStep>=C().minStepMs)this.peak={time,max:this.signal};
   if(!this.peak)return false;this.peak.max=Math.max(this.peak.max,this.signal);
   const elapsed=time-this.peak.time;
   if(elapsed>C().maxPeakMs){this.peak=null;return false;}
   if(this.signal<threshold*.35){this.peak=null;if(elapsed>=C().minPeakMs&&time-this.lastStep>=C().minStepMs){this.lastStep=time;return true;}}
   return false;
  }
 }
 root.MuseumMapEngine=Object.freeze({normalize,angleDelta,smoothAngle,distance,inPolygon,walkable,move,snap,nearestSegment,path,heading,StepDetector});
})(globalThis);
