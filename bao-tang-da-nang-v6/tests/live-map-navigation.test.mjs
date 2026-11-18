import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import '../live-map-config.js';import '../live-map-engine.js';import '../live-map-navigation.js';
const E=MuseumMapEngine,N=MuseumMapNavigation;
const floors=Object.fromEntries([1,2,3].map(n=>[n,JSON.parse(fs.readFileSync(new URL(`../data/maps/floor-${n}.json`,import.meta.url)))]));
test('all source-to-zone routes across three floors use walkable edges and actual connectors',()=>{
 for(const from of Object.values(floors))for(const to of Object.values(floors))for(const z of to.zones){
  const r=N.route(floors,{floor:from.floor,...from.start},{floor:to.floor,nodeId:z.id});assert.ok(r);assert.equal(r.points.at(-1).id,z.id);
  for(let i=1;i<r.points.length;i++){const a=r.points[i-1],b=r.points[i];if(a.floor===b.floor)assert.equal(E.move(floors[a.floor],a,b.x-a.x,b.y-a.y).blocked,false);else{assert.ok(['stairs','lift'].includes(b.via));assert.ok(floors[a.floor].connectors.some(c=>c.type===b.via&&c.nodeId===a.id&&c.targets.some(t=>t.floor===b.floor&&t.nodeId===b.id)));}}
 }
});
test('an adjacent floor chooses stairs; a two-floor trip may use the direct lift',()=>{
 const r=N.route(floors,{floor:1,...floors[1].start},{floor:2,nodeId:floors[2].zones[0].id});assert.ok(r.points.some(p=>p.via==='stairs'));
 const lift=N.route(floors,{floor:1,...floors[1].start},{floor:3,nodeId:floors[3].zones[0].id});assert.ok(lift.points.some(p=>p.via==='lift'));
});
test('itinerary preserves the exact chosen stop order even when returning to a previous floor',()=>{
 const targets=[{floor:3,nodeId:floors[3].zones[2].id},{floor:2,nodeId:floors[2].zones[0].id},{floor:1,nodeId:floors[1].zones[0].id}],r=N.itinerary(floors,{floor:1,...floors[1].start},targets);
 assert.deepEqual(r.points.filter(p=>p.stop).map(p=>p.id),targets.map(t=>t.nodeId));assert.ok(r.distance>0);
});
test('routes refuse unknown nodes, floors and starting positions outside walkable geometry',()=>{
 assert.equal(N.route(floors,{floor:1,x:0,y:0},{floor:1,nodeId:'h-6'}),null);assert.equal(N.route(floors,{floor:1,...floors[1].start},{floor:4,nodeId:'h-6'}),null);assert.equal(N.route(floors,{floor:1,...floors[1].start},{floor:1,nodeId:'made-up'}),null);
});
test('zone entry only fires once per pass, suppresses doorway jitter and respects cooldown',()=>{
 const tracker=N.tracker(),f=floors[1],z=f.zones[0],outside={x:6,y:20};
 assert.equal(tracker.update(f,z.center,0).length,1);assert.equal(tracker.update(f,z.center,2000).length,0);assert.equal(tracker.update(f,{x:z.center.x,y:15.2},2100).length,0);
 assert.equal(tracker.update(f,z.center,2500).length,0);tracker.update(f,outside,3000);assert.equal(tracker.update(f,z.center,3500).length,0);tracker.update(f,outside,4000);assert.equal(tracker.update(f,z.center,9000).length,1);
 tracker.reset();assert.equal(tracker.update(f,z.center,10000).length,1);
});
test('deviation identifies an off-route room and turn hints distinguish left, right and stairs',()=>{
 const points=[{floor:1,x:6,y:20},{floor:1,x:14,y:20},{floor:1,x:14,y:9}];assert.equal(N.instruction(points,1,points[0]).kind,'left');assert.equal(N.instruction([{floor:1,x:6,y:20},{floor:1,x:14,y:20},{floor:1,x:14,y:31}],1,points[0]).kind,'right');
 assert.ok(N.deviation(points,{x:30,y:9},1)>10);assert.equal(N.deviation(points,{x:10,y:20},1),0);
 assert.equal(N.instruction([{floor:1,x:54,y:20},{floor:2,x:54,y:20,via:'stairs'}],1,{floor:1,x:54,y:20}).kind,'stairs');
});
