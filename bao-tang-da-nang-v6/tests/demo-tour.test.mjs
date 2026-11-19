/* Dùng graph, chủ đề, ảnh và hồ sơ thật để thử tuyến sân khấu. */
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import '../live-map-config.js';import '../live-map-engine.js';import '../live-map-navigation.js';import '../demo-tour.js';import '../demo-tour-view.js';
const root=new URL('../',import.meta.url),read=name=>JSON.parse(fs.readFileSync(new URL(name,root))),floors=Object.fromEntries([1,2,3].map(n=>[n,read(`data/maps/floor-${n}.json`)]));
const raw=read('data/demo-tour.json'),content=read('data/museum-content.json'),D=MuseumDemoTour,E=MuseumMapEngine;
const compile=(r=raw,a=content.artifacts)=>D.compile(r,floors,a,content.topics),route=compile();
test('nine stops are three per floor, with one real site 1 anchor and photo per floor',()=>{
 assert.equal(route.stops.length,9);assert.deepEqual(route.stops.map(s=>s.floor),[1,1,1,2,2,2,3,3,3]);
 for(const n of [1,2,3]){const anchors=route.stops.filter(s=>s.featured&&s.floor===n);assert.equal(anchors.length,1);const a=content.artifacts.find(a=>a.id===anchors[0].artifactId);assert.equal(a.sourceSite||'site1','site1');assert.ok(a.url.startsWith('https://'));assert.ok(fs.existsSync(new URL(a.image,root)));}
});
test('simulation follows walkable edges and both real floor connectors; every pose stays walkable',()=>{
 const changes=route.points.filter((p,i)=>i&&p.floor!==route.points[i-1].floor);assert.deepEqual(changes.map(p=>p.floor),[2,3]);
 for(let distance=0;distance<=route.length;distance+=.1){const p=D.pose(route,distance);assert.ok(E.walkable(floors[p.floor],p),`${distance}: ${JSON.stringify(p)}`);}
 for(const s of route.stops){const p=D.pose(route,s.arrivalAt);assert.equal(p.floor,s.floor);assert.ok(E.distance(p,s.center)<=raw.arrivalRadius+1e-6);}
});
test('selecting a floor by slider percentage resolves floating point rounding at stairs',()=>{
 const p=D.createPlayer(route);for(const floor of [1,2,3]){const first=route.points.find(p=>p.floor===floor);p.seek(first.at/route.length*100);assert.equal(p.getState().position.floor,floor);assert.deepEqual(p.getState().visited,[]);}
});
test('all nine arrivals occur once, in order, and each pauses until the next deliberate play',()=>{
 const p=D.createPlayer(route),arrivals=[];let previous=0;
 for(let i=0;i<9;i++){assert.equal(p.play(),true);let event=null,guard=0;while(!event&&guard++<10000){event=p.tick(1/60);const s=p.getState();assert.ok(s.distance-previous<=route.speed/60+1e-6);previous=s.distance;}
  assert.ok(event);assert.equal(event.firstVisit,true);assert.equal(event.index,i);assert.equal(p.getState().running,false);assert.equal(p.tick(10),null);arrivals.push(event.stop.id);
 }
 assert.deepEqual(arrivals,route.stops.map(s=>s.id));assert.equal(p.getState().complete,true);assert.equal(p.getState().percent,100);assert.equal(p.play(),false);
});
test('pause, non-finite input and background-sized frames cannot teleport the mascot',()=>{
 const p=D.createPlayer(route);p.play();p.tick(.1);p.pause();const before=p.getState();assert.equal(p.tick(30),null);assert.deepEqual(p.getState(),before);p.play();p.tick(Infinity);p.tick(NaN);assert.equal(p.getState().distance,before.distance);
 p.tick(30);assert.ok(p.getState().distance-before.distance<=route.speed*.25+1e-6);p.seek(NaN);assert.ok(Number.isFinite(p.getState().distance));p.setSpeed(1e9);assert.equal(p.getState().speed,1);
});
test('seeking is preview only, does not earn stops or replay earlier arrival side effects',()=>{
 const p=D.createPlayer(route);p.seek(90);assert.deepEqual(p.getState().visited,[]);assert.equal(p.getState().preview,true);p.seek(0);p.play();let event;while(!(event=p.tick(.25))){}assert.equal(event.firstVisit,true);
 p.seek(0);p.play();while(!(event=p.tick(.25))){}assert.equal(event.firstVisit,false);assert.equal(p.getState().visited.length,1);
 p.seek(-10);assert.equal(p.getState().distance,0);p.seek(200);assert.equal(p.getState().distance,route.length);assert.equal(p.getState().visited.length,1);
});
test('restart clears only in-memory tour state and grants a fresh event session',()=>{
 const p=D.createPlayer(route),session=p.getState().sessionId;p.play();while(!p.tick(.25)){}p.setSpeed(4);p.reset();assert.notEqual(p.getState().sessionId,session);assert.deepEqual(p.getState().visited,[]);assert.equal(p.getState().running,false);assert.equal(p.getState().lastStop,-1);assert.equal(p.getState().speed,4);const {heading,...point}=p.getState().position;assert.deepEqual(point,{floor:1,x:6,y:20});assert.ok(Number.isFinite(heading));
});
test('rejects invented, wrong-site, reference, duplicate and incorrectly placed demo records',()=>{
 const clone=()=>structuredClone(raw);let r=clone();r.stops[0].artifactId='invented';assert.throws(()=>compile(r),/demo_record/);
 for(const patch of [{referenceOnly:true},{sourceSite:'site2'},{topic:'doc-lap'}]){const records=structuredClone(content.artifacts),a=records.find(a=>a.id===raw.stops[0].artifactId);Object.assign(a,patch);assert.throws(()=>compile(raw,records),/demo_record/);}
 r=clone();r.stops[1].id=r.stops[0].id;assert.throws(()=>compile(r),/demo_stop/);r=clone();r.stops[0].floor=2;assert.throws(()=>compile(r),/demo_stop/);r=clone();r.stops[0].featured=false;assert.throws(()=>compile(r),/demo_floor_order/);
});
test('every presentation control has all four language labels',()=>{for(const [key,words]of Object.entries(MuseumDemoTourView.labels)){assert.equal(words.length,4,key);assert.ok(words.every(w=>typeof w==='string'&&w.trim()),key);}});
