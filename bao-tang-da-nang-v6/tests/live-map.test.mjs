/* Kiểm tra hình học bằng dữ liệu thật của demo, không chỉ khớp DOM. */
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import '../live-map-config.js';import '../live-map-engine.js';import '../live-map-i18n.js';
const E=MuseumMapEngine,C=MuseumMapConfig,root=new URL('../',import.meta.url);
const floors=[1,2,3].map(n=>JSON.parse(fs.readFileSync(new URL(`data/maps/floor-${n}.json`,root))));
const content=JSON.parse(fs.readFileSync(new URL('data/museum-content.json',root)));
test('all 15 themes have illustrative geometry; only correct site 1 records are pinned',()=>{
 assert.equal(floors.flatMap(f=>f.zones).length,15);
 for(const f of floors){assert.equal(f.illustrative,true);assert.equal(f.size.unit,'m');assert.ok(E.walkable(f,f.start));
  for(const z of f.zones){assert.ok(content.topics.some(t=>t.id===z.topicId&&t.floor===f.floor));assert.ok(E.walkable(f,z.center));for(const id of z.artifactIds){const a=content.artifacts.find(a=>a.id===id);assert.equal(a.topic,z.topicId);assert.equal(a.referenceOnly||false,false);assert.equal(a.sourceSite||'site1','site1');}}
 }
});
test('all graph edges can be walked by a dot with radius, including door thresholds',()=>{
 for(const f of floors)for(const [a,b]of f.graph.edges){const p=f.graph.nodes.find(n=>n.id===a),q=f.graph.nodes.find(n=>n.id===b);const result=E.move(f,p,q.x-p.x,q.y-p.y);assert.equal(result.blocked,false,`${f.floor}:${a}->${b}`);assert.ok(E.distance(result.position,q)<1e-6);}
});
test('substeps stop long jumps through walls and permit sliding without crossing the boundary',()=>{
 const f=floors[0],r=E.move(f,{x:6,y:20},0,-30);assert.equal(r.blocked,true);assert.ok(r.position.y>=17+C.avatarRadius-.01);
 const slide=E.move(f,{x:8,y:17.3},3,-4);assert.ok(slide.position.x>10);assert.ok(E.walkable(f,slide.position));
 assert.equal(E.walkable(f,{x:NaN,y:20}),false);assert.equal(E.walkable(f,{x:0,y:0}),false);
});
test('path snapping does not trap a perpendicular turn in the corridor',()=>{
 const f=floors[0],p={x:6,y:19.8};assert.deepEqual(E.snap(f,p,{x:0,y:-1}),p);
 const along=E.snap(f,{x:7,y:20.3},{x:1,y:0});assert.ok(along.y<20.3&&along.y>=20);
});
test('autoplay graph reaches every zone without leaving walkable geometry',()=>{
 for(const f of floors){let at='h-6';for(const id of f.tour){const path=E.path(f,at,id);assert.ok(path.length>=2);for(let i=1;i<path.length;i++)assert.equal(E.move(f,path[i-1],path[i].x-path[i-1].x,path[i].y-path[i-1].y).blocked,false);at=id;}}
 assert.deepEqual(E.path(floors[0],'unknown','also-unknown'),[]);
});
test('floor connectors point to existing graph nodes on the target floor',()=>{
 for(const f of floors)for(const c of f.connectors){assert.ok(f.graph.nodes.some(n=>n.id===c.nodeId));for(const target of c.targets)assert.ok(floors[target.floor-1].graph.nodes.some(n=>n.id===target.nodeId));}
});
test('circular heading smooths across north; screen rotation and poor iOS accuracy are handled',()=>{
 assert.ok(Math.abs(Math.abs(E.angleDelta(359,E.smoothAngle(359,1,.5)))-1)<1e-8);
 assert.equal(E.heading({absolute:true,alpha:90},90),0);assert.equal(E.heading({webkitCompassHeading:359},0),359);
 assert.equal(E.heading({webkitCompassHeading:20,webkitCompassAccuracy:-1}),null);assert.equal(E.heading({alpha:null}),null);
});
test('stationary noise and violent shakes do not produce walking steps',()=>{
 const d=new E.StepDetector();let count=0;for(let i=0;i<1000;i++)count+=Number(d.feed({accelerationIncludingGravity:{x:0,y:0,z:9.81+Math.sin(i)*.15}},i*20));assert.equal(count,0);
 d.reset();count=0;for(let i=0;i<200;i++)count+=Number(d.feed({accelerationIncludingGravity:{x:0,y:0,z:9.81+(i%2?20:0)},rotationRate:{alpha:500}},i*20));assert.equal(count,0);
});
test('ten separated gait pulses produce ten steps and 21 simulated metres at the default scale',()=>{
 const d=new E.StepDetector();let count=0;
 for(let i=0;i<400;i++){const phase=(i*20)%800,z=9.81+(phase>=200&&phase<360?2*Math.sin((phase-200)/160*Math.PI):0);count+=Number(d.feed({accelerationIncludingGravity:{x:0,y:0,z}},i*20));}
 assert.equal(count,10);assert.ok(Math.abs(C.stepLength*C.mapScale*10-21)<1e-8);
});
test('every map string is translated in four languages and no keys are empty',()=>{for(const [key,words]of Object.entries(MuseumMapWords)){assert.equal(words.length,4,key);assert.ok(words.every(w=>typeof w==='string'&&w.trim().length),key);}});
