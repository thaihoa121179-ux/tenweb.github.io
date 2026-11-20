/* Chromium: MP3 thật và SW thật. Giọng hệ điều hành / nút màn hình khóa được giả lập riêng. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),{chromium}=require('playwright');
const BASE=process.env.MUSEUM_TEST_URL||'http://127.0.0.1:8877/bao-tang-da-nang-v6/';let browser;const results=[];
async function fixture({lang='vi',width=390,height=844,query='',speech=false,before}={}){
 const c=await browser.newContext({viewport:{width,height},isMobile:width<800,hasTouch:width<800,reducedMotion:'reduce'});
 await c.addInitScript(({speech})=>{
  window.audioElements=[];window.audioAttempts=0;window.blockNextPlay=false;window.testUtterances=[];window.mediaActions={};
  const NativeAudio=window.Audio;window.Audio=function(...args){const a=new NativeAudio(...args);audioElements.push(a);return a;};
  const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){audioAttempts++;if(blockNextPlay){blockNextPlay=false;return Promise.reject(new DOMException('gesture required','NotAllowedError'));}return play.call(this);};
  if(navigator.mediaSession){const original=navigator.mediaSession.setActionHandler.bind(navigator.mediaSession);navigator.mediaSession.setActionHandler=(name,fn)=>{mediaActions[name]=fn;return original(name,fn);};}
  if(speech){window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{speaking:false,last:null,getVoices:()=>['vi-VN','en-US','ko-KR','zh-CN'].map(lang=>({lang,localService:true})),speak(u){this.speaking=true;this.last=u;testUtterances.push(u);u.onstart?.();},cancel(){const old=this.last;this.last=null;this.speaking=false;old?.onend?.();}}});}
 },{speech});
 const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));if(before)await before(p);
 await p.goto(BASE+query);await p.waitForFunction(()=>window.MuseumPocketAudio&&!document.getElementById('boot-status'));await p.locator(`[data-lang=${lang}]`).click();await p.locator('#visitor-guest').click();return{c,p,errors};
}
const state=p=>p.evaluate(()=>MuseumPocketAudio.getState());
async function object(p,id='phu-dieu'){await p.evaluate(id=>Museum.openArtifact(id),id);await p.locator(`#prepared-narration [data-pocket-play="${id}"]`).waitFor();}
async function play(p,id='phu-dieu'){await object(p,id);await p.locator(`#prepared-narration [data-pocket-play="${id}"]`).click();await p.waitForFunction(()=>MuseumPocketAudio.getState().status==='playing');}
async function lang(p,value){await p.evaluate(()=>Museum.nav('home'));await p.locator('#lang-switch').click();await p.locator(`[data-lang=${value}]`).click();await p.locator('#language-start').click();}
async function check(name,fn){if(process.env.MUSEUM_AUDIO_FILTER&&!name.includes(process.env.MUSEUM_AUDIO_FILTER))return;try{await fn();results.push({name,passed:true});console.log('PASS',name);}catch(e){results.push({name,passed:false,error:e.stack});console.error('FAIL',name,e.stack);}}
async function layout(p){
 assert.deepEqual(await p.evaluate(()=>[...document.querySelectorAll('html,body,.app,.page.active,#pocket-player,#prepared-narration')].filter(e=>e.clientWidth&&e.scrollWidth>e.clientWidth+2).map(e=>e.id||e.className)),[]);
 const sizes=await p.locator('#pocket-player button:visible,#pocket-seek:visible,.prepared-personas button:visible').evaluateAll(es=>es.map(e=>({id:e.id,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})).filter(r=>r.w<43.9||r.h<43.9));assert.deepEqual(sizes,[]);
 assert.equal(await p.evaluate(()=>{const player=document.getElementById('pocket-player').getBoundingClientRect(),nav=document.querySelector('.app>.nav').getBoundingClientRect(),stage=document.querySelector('.stage').getBoundingClientRect();return player.bottom<=nav.top+.5&&stage.bottom<=player.top+.5;}),true);
}
(async()=>{browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
 await check('opening three anchors shows prepared text but never plays audio; 197 other records keep legacy narration',async()=>{
  const f=await fixture();try{for(const id of ['hv-khuyen-tai-ba-mau-f7a824','phu-dieu','sung-than-cong']){await object(f.p,id);assert.equal(await f.p.locator('.prepared-personas button').count(),3);assert.equal(await f.p.locator('#artifact-speak').isVisible(),false);}
   assert.equal(await f.p.evaluate(()=>audioAttempts),0);assert.equal(await f.p.evaluate(()=>audioElements.length),0);await f.p.evaluate(()=>Museum.openArtifact('ma-nao'));assert.equal(await f.p.locator('#prepared-narration').isVisible(),false);assert.equal(await f.p.locator('#artifact-speak').isVisible(),true);assert.equal(await f.p.evaluate(()=>Museum.A.length),200);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('real MP3 plays, seeks, pauses and switches persona text and audio without stale playback',async()=>{
  const f=await fixture();try{await play(f.p);assert.equal((await state(f.p)).mode,'file');assert.match((await state(f.p)).track.src,/relief-vi-quick\.mp3$/);await f.p.waitForFunction(()=>MuseumPocketAudio.getState().currentTime>.05);await layout(f.p);
   await f.p.locator('#pocket-seek').evaluate(e=>{e.value='500';e.dispatchEvent(new Event('input',{bubbles:true}));});await f.p.waitForFunction(()=>MuseumPocketAudio.getState().currentTime>5);await f.p.locator('#pocket-toggle').click();assert.equal((await state(f.p)).status,'paused');
   await f.p.locator('[data-pocket-persona=kids]').click();assert.match(await f.p.locator('.prepared-text').innerText(),/Bạn nhỏ ơi/);assert.equal((await state(f.p)).status,'paused');await f.p.locator('#pocket-toggle').click();await f.p.waitForFunction(()=>MuseumPocketAudio.getState().status==='playing');assert.match((await state(f.p)).track.src,/relief-vi-kids/);
   await f.p.locator('[data-pocket-persona=deep]').click();await f.p.waitForFunction(()=>MuseumPocketAudio.getState().status==='playing'&&MuseumPocketAudio.getState().track.persona==='deep');assert.equal(await f.p.evaluate(()=>audioElements.length),1);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('pocket audio continues through normal navigation, yields to chat and legacy speech, then closes cleanly',async()=>{
  const f=await fixture({speech:true});try{await play(f.p);await f.p.evaluate(()=>Museum.nav('catalog'));assert.equal((await state(f.p)).status,'playing');await layout(f.p);await f.p.evaluate(()=>Museum.nav('guide'));assert.equal((await state(f.p)).status,'paused');assert.equal(await f.p.locator('#pocket-player').isVisible(),false);
   await f.p.evaluate(()=>Museum.nav('home'));assert.equal((await state(f.p)).status,'paused');await f.p.locator('#pocket-toggle').click();await f.p.waitForFunction(()=>MuseumPocketAudio.getState().status==='playing');await f.p.evaluate(()=>Museum.speakText('Kiểm tra giọng đọc cũ.'));assert.equal((await state(f.p)).status,'paused');assert.equal(await f.p.evaluate(()=>testUtterances.length),1);await f.p.locator('#pocket-close').click();assert.equal((await state(f.p)).track,null);assert.equal(await f.p.locator('#pocket-spacer').isVisible(),false);assert.equal(await f.p.evaluate(()=>navigator.mediaSession?.metadata),null);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('Media Session reports artwork/title and play/pause/seek handlers use the actual MP3',async()=>{
  const f=await fixture({lang:'en'});try{await play(f.p,'sung-than-cong');assert.equal(await f.p.evaluate(()=>navigator.mediaSession.metadata.title),'Historic cannon');assert.match(await f.p.evaluate(()=>navigator.mediaSession.metadata.artwork[0].src),/assets\/museum\//);await f.p.evaluate(()=>mediaActions.pause());assert.equal((await state(f.p)).status,'paused');await f.p.evaluate(()=>mediaActions.seekto({seekTime:8}));await f.p.waitForFunction(()=>Math.abs(MuseumPocketAudio.getState().currentTime-8)<.5);await f.p.evaluate(()=>mediaActions.play());await f.p.waitForFunction(()=>MuseumPocketAudio.getState().status==='playing');await f.p.evaluate(()=>mediaActions.stop());assert.equal((await state(f.p)).track,null);assert.deepEqual(f.errors,[]);}finally{await f.c.close();}
 });
 await check('autoplay rejection requests a tap; missing MP3 uses the exact sourced device speech without a fake time bar',async()=>{
  const f=await fixture({speech:true});try{await object(f.p);await f.p.evaluate(()=>blockNextPlay=true);await f.p.locator('[data-pocket-play=phu-dieu]').click();await f.p.waitForFunction(()=>MuseumPocketAudio.getState().status==='blocked');assert.match(await f.p.locator('#pocket-status').innerText(),/Chạm/);assert.equal(await f.p.evaluate(()=>testUtterances.length),0);await f.p.locator('#pocket-toggle').click();await f.p.waitForFunction(()=>MuseumPocketAudio.getState().status==='playing');
   await f.p.route('**/audio/relief-vi-kids.mp3',r=>r.fulfill({status:404,body:'missing fixture'}));await f.p.locator('[data-pocket-persona=kids]').click();await f.p.waitForFunction(()=>MuseumPocketAudio.getState().mode==='speech'&&MuseumPocketAudio.getState().status==='playing');assert.equal(await f.p.evaluate(()=>testUtterances.at(-1).text),await f.p.locator('.prepared-text').innerText());assert.equal(await f.p.locator('#pocket-seek').isDisabled(),true);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('all four languages and 360–430px/landscape fit; Korean and Chinese use honest device speech',async()=>{
  for(const opts of [{lang:'vi',width:360,height:640},{lang:'en',width:430},{lang:'ko',width:390,speech:true},{lang:'zh',width:412,speech:true},{lang:'en',width:844,height:390}]){
   const f=await fixture(opts);try{await play(f.p);await layout(f.p);if(['ko','zh'].includes(opts.lang)){assert.equal((await state(f.p)).mode,'speech');assert.equal(await f.p.evaluate(()=>testUtterances.at(-1).lang),opts.lang==='ko'?'ko-KR':'zh-CN');assert.equal(await f.p.locator('.prepared-translation').isVisible(),true);}assert.deepEqual(f.errors,[]);}finally{await f.c.close();}
  }
 });
 await check('tour start unlocks one element; actual arrival plays narration, seeking/resetting never replays it',async()=>{
  const f=await fixture();try{const before=await f.p.evaluate(()=>MuseumMapJourney.getData());await f.p.evaluate(()=>MuseumOpenDemoTour());await f.p.locator('#demo-play').waitFor();await f.p.locator('#demo-speed').selectOption('4');await f.p.locator('#demo-play').click();await f.p.waitForFunction(()=>MuseumPocketAudio.getState().status==='playing'&&MuseumPocketAudio.getState().track?.origin==='demo');assert.equal(await f.p.evaluate(()=>audioElements.length),1);assert.equal((await state(f.p)).track.artifactId,'hv-khuyen-tai-ba-mau-f7a824');assert.equal(await f.p.locator('#demo-audio-slot #pocket-player').count(),1);
   await f.p.locator('#pocket-transcript').click();await f.p.locator('#pocket-dialog [data-pocket-persona=kids]').click();await f.p.waitForFunction(()=>MuseumPocketAudio.getState().track.persona==='kids'&&MuseumPocketAudio.getState().status==='playing');await f.p.locator('#pocket-dialog-close').click();assert.equal((await state(f.p)).status,'playing');
   await f.p.locator('#demo-seek').evaluate(e=>{e.value='850';e.dispatchEvent(new Event('input',{bubbles:true}));});assert.equal((await state(f.p)).track,null);await f.p.locator('#demo-reset').click();assert.equal(await f.p.evaluate(()=>MuseumLiveMap.getState().demo.visited.length),0);assert.deepEqual(await f.p.evaluate(()=>MuseumMapJourney.getData()),before);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('a slow JSON response cannot start old audio or reopen a dialog after navigation',async()=>{
  let release;const f=await fixture({before:p=>p.route('**/data/demo-narrations.json',async r=>{await new Promise(resolve=>release=resolve);await r.continue();})});try{await f.p.evaluate(()=>Museum.openArtifact('phu-dieu'));await f.p.locator('#artifact-speak').click();await f.p.evaluate(()=>Museum.nav('home'));release();await f.p.waitForFunction(()=>MuseumPocketAudio.getState().ready);assert.equal((await state(f.p)).track,null);assert.equal(await f.p.locator('#pocket-player').isVisible(),false);assert.equal(await f.p.locator('#pocket-dialog').isVisible(),false);assert.deepEqual(f.errors,[]);}finally{release?.();await f.c.close();}
 });
 await check('all 18 prepared MP3 play offline; cached Safari Range requests return the correct bytes and 416',async()=>{
  const f=await fixture({query:'?pwa=1'});try{await f.p.waitForFunction(()=>!!navigator.serviceWorker.controller);await f.c.setOffline(true);await f.p.reload();await f.p.waitForFunction(()=>window.MuseumPocketAudio&&!document.getElementById('boot-status'));
   for(const language of ['vi','en']){if(language==='en')await lang(f.p,'en');for(const id of ['hv-khuyen-tai-ba-mau-f7a824','phu-dieu','sung-than-cong']){await object(f.p,id);for(const persona of ['quick','kids','deep']){await f.p.locator(`[data-pocket-persona=${persona}]`).click();const s=await state(f.p);if(!['playing','loading'].includes(s.status)||s.track?.artifactId!==id)await f.p.locator(`[data-pocket-play="${id}"]`).click();await f.p.waitForFunction(()=>MuseumPocketAudio.getState().status==='playing'&&MuseumPocketAudio.getState().mode==='file');assert.equal((await state(f.p)).track.lang,language);}}}
   const probe=await f.p.evaluate(async()=>{const url=new URL('./audio/relief-vi-quick.mp3',MuseumAssetBaseURL),r=await fetch(url,{headers:{Range:'bytes=0-1'}}),bad=await fetch(url,{headers:{Range:'bytes=99999999-'}});return{status:r.status,range:r.headers.get('Content-Range'),bytes:[...new Uint8Array(await r.arrayBuffer())],bad:bad.status};});assert.equal(probe.status,206);assert.match(probe.range,/^bytes 0-1\//);assert.deepEqual(probe.bytes,[73,68]);assert.equal(probe.bad,416);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('WCAG A/AA checks pass for prepared narration, player and transcript dialog',async()=>{
  const f=await fixture();try{await play(f.p);await f.p.addScriptTag({path:process.env.MUSEUM_AXE_PATH||'/tmp/museum-v7-tools/node_modules/axe-core/axe.min.js'});for(const dialog of [false,true]){if(dialog)await f.p.locator('#pocket-transcript').click();const issues=await f.p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});assert.deepEqual(issues,[]);}assert.deepEqual(f.errors,[]);}finally{await f.c.close();}
 });
}finally{await browser.close();}await fs.writeFile(process.env.MUSEUM_AUDIO_REPORT||'/tmp/museum-step3-audio-browser.json',JSON.stringify({scope:'Chromium with actual MP3/SW; speech voices and lock screen commands simulated, not physical Safari/Android',results},null,2));console.log(`${results.filter(r=>r.passed).length}/${results.length} pocket audio checks passed`);if(results.some(r=>!r.passed))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
