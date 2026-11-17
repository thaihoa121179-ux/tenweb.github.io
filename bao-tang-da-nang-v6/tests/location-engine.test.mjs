import test from 'node:test';
import assert from 'node:assert/strict';
import '../location-engine.js';
const E=globalThis.MuseumLocationEngine;
test('absolute compass headings use clockwise north and screen rotation, never relative alpha or GPS course',()=>{
 assert.equal(E.heading({alpha:0,absolute:true}),0);assert.equal(E.heading({alpha:270,absolute:true}),90);
 assert.equal(E.heading({alpha:0,absolute:true},90),90);assert.equal(E.heading({alpha:0,absolute:true},270),270);
 assert.equal(E.heading({alpha:12,absolute:false}),null);assert.equal(E.heading({alpha:null,absolute:true}),null);
 assert.equal(E.heading({coords:{heading:125}}),null);
});
test('Safari north-referenced readings support north at zero and reject unreliable compass data',()=>{
 assert.equal(E.heading({webkitCompassHeading:0,webkitCompassAccuracy:10}),0);
 assert.equal(E.heading({webkitCompassHeading:350,webkitCompassAccuracy:5},90),80);
 assert.equal(E.heading({webkitCompassHeading:120,webkitCompassAccuracy:-1}),null);
 assert.equal(E.heading({webkitCompassHeading:120,webkitCompassAccuracy:80}),null);
});
test('heading smoothing crosses north over the short arc and retains continuous rotation',()=>{
 assert.ok(E.smooth(359,1)>359);assert.ok(E.smooth(1,359)<1);
 assert.equal(E.smooth(null,90),90);assert.equal(E.smooth(359,1,1),361);
});
test('only finite GPS fixes with sane timestamps are used; movement heading never becomes phone direction',()=>{
 const now=Date.now(),p={coords:{latitude:16.06,longitude:108.22,accuracy:12,heading:95},timestamp:now};
 assert.deepEqual(E.fix(p),{lat:16.06,lng:108.22,accuracy:12,timestamp:now});
 assert.equal(E.fix({...p,timestamp:now-1},now),null);assert.equal(E.fix({...p,timestamp:now+120000}),null);
 for(const change of [{latitude:91},{longitude:181},{latitude:NaN},{accuracy:-1},{accuracy:Infinity},{longitude:null}])assert.equal(E.fix({...p,coords:{...p.coords,...change}}),null);
});
