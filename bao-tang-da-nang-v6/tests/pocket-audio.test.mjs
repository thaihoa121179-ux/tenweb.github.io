import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import '../pocket-audio-engine.js';import '../audio-range.js';
const E=MuseumPocketAudioEngine,content=JSON.parse(fs.readFileSync(new URL('../data/museum-content.json',import.meta.url))),raw=JSON.parse(fs.readFileSync(new URL('../data/demo-narrations.json',import.meta.url)));
const base='https://museum.example/tenweb.github.io/bao-tang-da-nang-v6/',asset=p=>new URL(p,base).href;
const track=(key='a',extra={})=>({key,artifactId:'sung-than-cong',lang:'vi',persona:'quick',title:'Súng thần công',text:'Theo hồ sơ, đây là một khẩu thần công bằng kim loại.',src:'./audio/cannon-vi-quick.mp3',duration:30,artwork:'./assets/museum/8e6e15dab0e30205.webp',...extra});
const flush=()=>new Promise(r=>setImmediate(r));
function fixture({play,canSpeak=true}={}){
 const changes=[],positions=[],handlers=new Map(),utterances=[];let created=0;
 const audio={src:'',currentTime:0,duration:30,paused:true,ended:false,error:null,get currentSrc(){return this.src;},load(){this.error=null;this.ended=false;},setAttribute(){},pause(){this.paused=true;queueMicrotask(()=>this.onpause?.());},play(){this.paused=false;if(play)return play(this);queueMicrotask(()=>this.onplaying?.());return Promise.resolve();}};
 const speech={getVoices:()=>[{name:'Local Vietnamese',lang:'vi-VN',localService:true}],cancel(){},speak:u=>{utterances.push(u);u.onstart?.();}};
 const media={playbackState:'none',metadata:null,setActionHandler:(k,f)=>handlers.set(k,f),setPositionState:p=>positions.push(p)};
 const engine=E.create({asset,createAudio:()=>{created++;return audio;},speech:canSpeak?speech:{},createUtterance:t=>({text:t}),mediaSession:media,Metadata:class{constructor(o){Object.assign(this,o);}},onChange:s=>changes.push(s)});
 return{engine,audio,speech,media,handlers,utterances,changes,positions,created:()=>created};
}
test('36 prepared texts point to exactly the three original records; four language/persona combinations resolve',()=>{
 assert.equal(E.validate(raw,content.artifacts),raw);for(const r of raw.records)for(const lang of E.languages)for(const persona of E.personas){const t=E.track(raw,content.artifacts,r.artifactId,lang,persona);assert.ok(t.text.length>=40);assert.equal(t.source,content.artifacts.find(a=>a.id===r.artifactId).url);assert.ok(t.artwork.startsWith('./assets/'));}
 assert.equal(E.track(raw,content.artifacts,'ma-nao','vi','quick'),null);assert.equal(E.track(raw,content.artifacts,'sung-than-cong','fr','quick'),null);
});
test('rejects a changed source, wrong institution, injected file path and missing language',()=>{
 let r=structuredClone(raw);r.records[0].source='https://invented.example/';assert.throws(()=>E.validate(r,content.artifacts),/narration_source/);
 r=structuredClone(raw);r.records[0].stories.vi.quick.audio='https://external.example/a.mp3';assert.throws(()=>E.validate(r,content.artifacts),/narration_audio/);
 r=structuredClone(raw);delete r.records[0].stories.ko;assert.throws(()=>E.validate(r,content.artifacts),/narration_text/);
 const a=structuredClone(content.artifacts);a.find(a=>a.id===raw.records[0].artifactId).sourceSite='site2';assert.throws(()=>E.validate(raw,a),/narration_source/);
});
test('cannon date stays qualified in every quick narration and discovery year stays separate',()=>{
 const r=raw.records.find(r=>r.artifactId==='sung-than-cong');for(const lang of ['vi','en','ko','zh'])assert.match(r.stories[lang].quick.text,{vi:/theo hồ sơ/i,en:/according to the record/i,ko:/기록/,zh:/据档案/}[lang]);
 assert.match(r.stories.vi.deep.text,/2019 không phải/);assert.match(r.stories.en.deep.text,/not a confirmed manufacturing year/);
});
test('opening and selecting a record does not create or play audio; a deliberate play uses one element',async()=>{
 const f=fixture();assert.equal(f.created(),0);f.engine.select(track());assert.equal(f.created(),0);assert.equal(f.engine.getState().status,'paused');f.engine.play();await flush();assert.equal(f.created(),1);assert.equal(f.engine.getState().status,'playing');assert.equal(f.utterances.length,0);f.engine.pause();assert.equal(f.engine.getState().status,'paused');f.engine.play();await flush();assert.equal(f.created(),1);f.engine.destroy();
});
test('unlock is silent, deduplicated and reuses the same element for the actual MP3',async()=>{
 const f=fixture();const a=f.engine.unlock(),b=f.engine.unlock();assert.equal(a,b);assert.equal(f.audio.src,asset('./audio/unlock.mp3'));await a;assert.equal(f.created(),1);assert.equal(f.engine.getState().unlocked,true);assert.equal(f.audio.paused,true);f.engine.play(track());await flush();assert.equal(f.audio.src,asset(track().src));assert.equal(f.created(),1);f.engine.destroy();
});
test('NotAllowedError exposes a manual play state and never pretends speech bypasses autoplay rules',async()=>{
 const f=fixture({play:()=>Promise.reject(Object.assign(Error('denied'),{name:'NotAllowedError'}))});f.engine.play(track());await flush();assert.equal(f.engine.getState().status,'blocked');assert.equal(f.engine.getState().error,'tap');assert.equal(f.utterances.length,0);f.engine.destroy();
});
test('missing MP3 falls back to the exact same text and language; old errors cannot interrupt the new speech',async()=>{
 const f=fixture({play:()=>Promise.reject(Error('network'))});const t=track('kids',{lang:'ko',persona:'kids',text:'기록을 바탕으로 준비한 어린이 해설입니다.'});f.engine.play(t);await flush();assert.equal(f.engine.getState().mode,'speech');assert.equal(f.engine.getState().status,'playing');assert.equal(f.utterances.length,1);assert.equal(f.utterances[0].text,t.text);assert.equal(f.utterances[0].lang,'ko-KR');assert.equal(f.engine.getState().seekable,false);assert.equal(f.engine.seek(5),false);f.engine.destroy();
});
test('a delayed old play rejection or resolution cannot resurrect or replace a newer track',async()=>{
 const pending=[];const f=fixture({play:()=>new Promise((resolve,reject)=>pending.push({resolve,reject}))});f.engine.play(track('old'));f.engine.play(track('new',{persona:'deep'}));pending[1].resolve();await flush();pending[0].reject(Error('late old error'));await flush();assert.equal(f.engine.getState().track.key,'new');assert.equal(f.engine.getState().status,'playing');assert.equal(f.utterances.length,0);
 f.engine.select(track('paused'));f.engine.play();f.engine.pause();pending[2].resolve();await flush();assert.equal(f.engine.getState().status,'paused');f.engine.destroy();
});
test('speech pause resumes from the last reported word; cancelled callbacks cannot mark a new track ended',()=>{
 const f=fixture(),t=track('speech',{src:null});f.engine.play(t);const u=f.utterances[0];u.onboundary({charIndex:12});f.engine.pause();assert.equal(f.engine.getState().speechOffset,12);f.engine.play();assert.equal(f.utterances[1].text,t.text.slice(12));u.onend();assert.equal(f.engine.getState().status,'playing');f.engine.clear();f.utterances[1].onend();assert.equal(f.engine.getState().status,'idle');f.engine.destroy();
});
test('absent audio and absent device speech produces a readable error without breaking the app',async()=>{
 const f=fixture({play:()=>Promise.reject(Error('missing')),canSpeak:false});f.engine.play(track());await flush();assert.equal(f.engine.getState().status,'error');assert.equal(f.engine.getState().error,'unavailable');f.engine.destroy();
});
test('Media Session metadata, pause/play, stop and bounded seek actions reflect the actual track',async()=>{
 const f=fixture();f.engine.play(track());await flush();assert.equal(f.media.metadata.title,'Súng thần công');assert.equal(f.media.metadata.artwork[0].src,asset(track().artwork));assert.equal(f.media.playbackState,'playing');
 f.handlers.get('pause')();assert.equal(f.media.playbackState,'paused');f.handlers.get('play')();await flush();f.handlers.get('seekto')({seekTime:12});assert.equal(f.audio.currentTime,12);f.handlers.get('seekbackward')({seekOffset:30});assert.equal(f.audio.currentTime,0);f.handlers.get('seekforward')({seekOffset:100});assert.ok(f.audio.currentTime<30);assert.equal(f.engine.seek(NaN),false);f.handlers.get('stop')();assert.equal(f.media.metadata,null);assert.equal(f.media.playbackState,'none');f.engine.destroy();
});
test('Range parsing handles Safari probes, suffixes and open ranges; invalid and multiple ranges fail closed',()=>{
 const p=MuseumAudioRange.parse;assert.deepEqual(p('bytes=0-1',100),{start:0,end:1});assert.deepEqual(p('bytes=98-',100),{start:98,end:99});assert.deepEqual(p('bytes=-10',100),{start:90,end:99});assert.deepEqual(p('bytes=-200',100),{start:0,end:99});for(const h of ['bytes=100-','bytes=20-10','bytes=0-1,4-5','bytes=-0','items=0-1','bytes=-'])assert.equal(p(h,100),null,h);
});
test('cached MP3 response returns exact 206 bytes and a valid 416 for an invalid request',async()=>{
 const bytes=Uint8Array.from([10,20,30,40,50]),response=()=>new Response(bytes,{headers:{'Content-Type':'audio/mpeg','Content-Length':'5'}});
 const part=await MuseumAudioRange.respond(new Request(base+'audio/a.mp3',{headers:{Range:'bytes=0-1'}}),response());assert.equal(part.status,206);assert.equal(part.headers.get('Content-Range'),'bytes 0-1/5');assert.deepEqual([...new Uint8Array(await part.arrayBuffer())],[10,20]);
 const bad=await MuseumAudioRange.respond(new Request(base+'audio/a.mp3',{headers:{Range:'bytes=9-'}}),response());assert.equal(bad.status,416);assert.equal(bad.headers.get('Content-Range'),'bytes */5');assert.equal(await bad.text(),'');
});
