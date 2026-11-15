import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function fixture(reduced=false){
 let n=0;const frames=new Map(),listeners=new Map();const doc={hidden:false,addEventListener:(name,fn)=>listeners.set(name,fn)};
 const root={Intl,document:doc,matchMedia:()=>({matches:reduced}),requestAnimationFrame:fn=>{frames.set(++n,fn);return n},cancelAnimationFrame:id=>frames.delete(id)};
 vm.runInNewContext(fs.readFileSync(new URL('../chat-text.js',import.meta.url),'utf8'),root);
 const classes=new Set();const el={textContent:'',isConnected:true,classList:{add:s=>classes.add(s),remove:s=>classes.delete(s)}};
 return{api:root.MuseumChatText,el,doc,classes,frames,tick(time){const work=[...frames.values()];frames.clear();work.forEach(fn=>fn(time));},event(name,detail){listeners.get(name)?.({detail})}};
}
test('Slow reveals one grapheme at a time and never accelerates a long answer',async()=>{
 const f=fixture();const c=f.api.reveal(f.el,'x'.repeat(2000),{speed:'slow'});f.tick(0);assert.equal(f.el.textContent.length,1);f.tick(42);assert.equal(f.el.textContent.length,2);f.tick(5000);assert.equal(f.el.textContent.length,3,'A delayed frame cannot dump the intervening letters');c.finish();await c.finished;assert.equal(f.el.textContent.length,2000);
});
test('punctuation creates a readable pause and grapheme clusters remain intact',()=>{
 const f=fixture();const c=f.api.reveal(f.el,'a\u0306\u0301,😊 👨‍👩‍👧‍👦',{speed:'slow'});f.tick(0);assert.equal(f.el.textContent,'a\u0306\u0301');f.tick(42);assert.equal(f.el.textContent,'a\u0306\u0301,');f.tick(84);assert.equal(f.el.textContent,'a\u0306\u0301,');f.tick(174);assert.equal(f.el.textContent,'a\u0306\u0301,😊');c.finish();
});
test('explicit slow pacing remains slow under reduced motion, while Auto respects the device setting',()=>{
 const a=fixture(true);a.api.reveal(a.el,'slow',{speed:'slow'});assert.equal(a.el.textContent,'');a.tick(0);assert.equal(a.el.textContent,'s');a.api.finishAll();
 const b=fixture(true);b.api.reveal(b.el,'automatic',{speed:'auto'});assert.equal(b.el.textContent,'automatic');assert.equal(b.frames.size,0);
});
test('changing to Instant finishes the current answer and releases pending presentation',async()=>{
 const f=fixture();const c=f.api.reveal(f.el,'hello world',{speed:'slow'});f.tick(0);f.api.setSpeed('instant');await c.finished;assert.equal(f.el.textContent,'hello world');assert.equal(f.classes.has('is-revealing'),false);assert.equal(f.frames.size,0);
});
test('navigation or hiding the document completes presentation without orphaned frames',async()=>{
 for(const action of ['nav','hidden']){const f=fixture();const c=f.api.reveal(f.el,'complete reply',{speed:'slow'});if(action==='nav')f.event('museum:navigate',{page:'home'});else{f.doc.hidden=true;f.event('visibilitychange');}await c.finished;assert.equal(f.el.textContent,'complete reply');assert.equal(f.frames.size,0);}
});
