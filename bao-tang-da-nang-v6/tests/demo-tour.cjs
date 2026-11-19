/* Chromium, DOM thật và graph thật. Các ca này không thay kiểm thử iPhone vật lý. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),{chromium}=require('playwright');
const BASE=process.env.MUSEUM_TEST_URL||'http://127.0.0.1:8877/bao-tang-da-nang-v6/',results=[];let browser;
async function fixture({lang='vi',width=390,height=844,query='',motion='reduce',before}={}){
 const c=await browser.newContext({viewport:{width,height},isMobile:width<800,hasTouch:width<800,reducedMotion:motion});
 await c.addInitScript(()=>{
  window.demoPermissionRequests=0;window.demoEvents=[];
  for(const name of ['DeviceMotionEvent','DeviceOrientationEvent'])window[name]=class{static async requestPermission(){demoPermissionRequests++;return'denied';}};
  if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia=async()=>{demoPermissionRequests++;throw Error('not_expected');};
  for(const name of ['start','arrival','seek','reset','pause'])document.addEventListener('museum:demo'+name,e=>demoEvents.push({name,detail:e.detail}));
 });
 const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));if(before)await before(p);
 await p.goto(BASE+query);await p.waitForFunction(()=>window.MuseumOpenDemoTour&&!document.getElementById('boot-status'));
 await p.locator(`[data-lang=${lang}]`).click();await p.locator('#visitor-guest').click();return{c,p,errors};
}
async function open(p){await p.evaluate(()=>MuseumOpenDemoTour());await p.waitForFunction(()=>!!window.MuseumLiveMap?.getState().demo&&document.getElementById('demo-play'));}
const state=p=>p.evaluate(()=>MuseumLiveMap.getState());
async function seek(p,value){await p.locator('#demo-seek').evaluate((e,v)=>{e.value=String(v*10);e.dispatchEvent(new Event('input',{bubbles:true}));},value);}
async function check(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS',name);}catch(e){results.push({name,passed:false,error:e.stack});console.error('FAIL',name,e.stack);}}
async function layout(p){
 const bad=await p.evaluate(()=>[...document.querySelectorAll('html,body,.page.active,.live-map-host,.demo-tour-panel')].filter(e=>e.clientWidth&&e.scrollWidth>e.clientWidth+2).map(e=>e.id||e.className));assert.deepEqual(bad,[]);
 const controls=await p.locator('.live-map-host button:visible,.demo-tour-panel select:visible,.demo-tour-panel input:visible').evaluateAll(es=>es.map(e=>({id:e.id,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})).filter(r=>r.w<43.9||r.h<43.9));assert.deepEqual(controls,[]);
 const overlap=await p.evaluate(()=>{const map=document.getElementById('lm-svg').getBoundingClientRect(),panel=document.querySelector('.demo-tour-panel').getBoundingClientRect();return map.left<panel.right&&map.right>panel.left&&map.top<panel.bottom&&map.bottom>panel.top;});assert.equal(overlap,false);
}
(async()=>{browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});try{
 await check('complete nine stops, cross two floors, pulse/image/source at arrival, no sensors or personal progress',async()=>{
  const f=await fixture();try{const before=await f.p.evaluate(()=>MuseumMapJourney.getData());await f.p.locator('#presentation-open').click();await f.p.waitForFunction(()=>document.getElementById('demo-play'));
   assert.equal((await state(f.p)).onboardingOpen,false);await f.p.locator('#demo-speed').selectOption('4');
   for(let i=0;i<9;i++){
    await f.p.locator(i?'#demo-next':'#demo-play').click();const moving=await state(f.p);assert.equal(moving.running,true);await f.p.waitForFunction(n=>MuseumLiveMap.getState().demo.visited.length===n,i+1);
    const s=await state(f.p);assert.equal(s.demo.lastStop,i);assert.equal(s.floor,Math.floor(i/3)+1);assert.equal(s.running,false);assert.equal(await f.p.locator('.demo-stop-card img').count(),1);
    await f.p.locator('.demo-stop-card img').evaluate(img=>img.decode());assert.match(await f.p.locator('.demo-source').getAttribute('href'),/^https:\/\//);
   }
   assert.equal((await state(f.p)).demo.complete,true);assert.equal(await f.p.locator('#demo-percent').innerText(),'100%');assert.equal(await f.p.locator('#demo-next').isDisabled(),true);
   const events=await f.p.evaluate(()=>demoEvents.filter(e=>e.name==='arrival').map(e=>e.detail));assert.equal(events.length,9);assert.equal(new Set(events.map(e=>e.stopId)).size,9);assert.ok(events.every(e=>e.simulated));assert.equal(events.filter(e=>e.featured).length,3);
   assert.deepEqual(await f.p.evaluate(()=>MuseumMapJourney.getData()),before);assert.equal(await f.p.evaluate(()=>demoPermissionRequests),0);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('pause is stable, Next moves smoothly, seek is preview and duplicate arrivals stay suppressed',async()=>{
  const f=await fixture();try{await open(f.p);await f.p.locator('#demo-play').click();await f.p.waitForTimeout(140);await f.p.locator('#demo-play').click();const paused=(await state(f.p)).demo.distance;await f.p.waitForTimeout(180);assert.equal((await state(f.p)).demo.distance,paused);assert.ok(paused>0&&paused<10);
   await seek(f.p,70);assert.equal((await state(f.p)).demo.preview,true);assert.equal((await state(f.p)).running,false);assert.equal(await f.p.evaluate(()=>demoEvents.filter(e=>e.name==='arrival').length),0);
   await seek(f.p,0);await f.p.locator('#demo-speed').selectOption('4');await f.p.locator('#demo-next').click();assert.ok((await state(f.p)).demo.distance<10);await f.p.waitForFunction(()=>MuseumLiveMap.getState().demo.visited.length===1);
   await seek(f.p,0);await f.p.locator('#demo-next').click();await f.p.waitForFunction(()=>MuseumLiveMap.getState().demo.lastStop===0&&!MuseumLiveMap.getState().running);assert.equal(await f.p.evaluate(()=>demoEvents.filter(e=>e.name==='arrival').length),1);
   const session=(await state(f.p)).demo.sessionId;await f.p.locator('#demo-reset').click();assert.equal((await state(f.p)).floor,1);assert.equal((await state(f.p)).demo.distance,0);assert.deepEqual((await state(f.p)).demo.visited,[]);assert.notEqual((await state(f.p)).demo.sessionId,session);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('home and deep link entry work; all four languages fit 360–430px, landscape and desktop',async()=>{
  for(const opts of [{lang:'vi',width:360,height:640},{lang:'en',width:390},{lang:'ko',width:430},{lang:'zh',width:412},{lang:'vi',width:844,height:390},{lang:'en',width:1440,height:900}]){
   const f=await fixture({...opts,query:'?presentation=1'});try{await f.p.waitForFunction(()=>!!window.MuseumLiveMap?.getState().demo&&document.getElementById('demo-play'));await f.p.evaluate(()=>document.fonts.ready);await layout(f.p);await seek(f.p,4.5);await layout(f.p);
    assert.equal(await f.p.locator('.app>.nav').isVisible(),false);assert.equal(await f.p.locator('.top').isVisible(),false);assert.equal(await f.p.locator('#demo-play').innerText(),MuseumLabel(opts.lang));assert.equal(await f.p.evaluate(()=>demoPermissionRequests),0);assert.deepEqual(f.errors,[]);
   }finally{await f.c.close();}
  }
 });
 await check('manual floor selection previews only; navigation away and hidden document pause and re-enter without autoplay',async()=>{
  const f=await fixture();try{await open(f.p);await f.p.locator('[data-live-floor="3"]').click();assert.equal((await state(f.p)).floor,3);assert.deepEqual((await state(f.p)).demo.visited,[]);
   await f.p.locator('#demo-play').click();await f.p.waitForTimeout(100);await f.p.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));});const d=(await state(f.p)).demo.distance;assert.equal((await state(f.p)).running,false);await f.p.waitForTimeout(100);assert.equal((await state(f.p)).demo.distance,d);
   await f.p.evaluate(()=>{Object.defineProperty(document,'hidden',{value:false,configurable:true});document.dispatchEvent(new Event('visibilitychange'));});await f.p.waitForFunction(()=>!!document.getElementById('demo-play'));assert.equal((await state(f.p)).running,false);assert.equal((await state(f.p)).demo.distance,d);
   await f.p.locator('#demo-play').click();await f.p.evaluate(()=>Museum.nav('home'));assert.equal((await state(f.p)).running,false);await open(f.p);assert.equal((await state(f.p)).running,false);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('exit restores normal map and directions to an artifact clear presentation state',async()=>{
  const f=await fixture();try{await open(f.p);await seek(f.p,5);await f.p.locator('#demo-record').click();assert.equal(await f.p.evaluate(()=>Museum.state.page),'artifact');assert.equal(await f.p.evaluate(()=>Museum.state.artifact),'hv-khuyen-tai-ba-mau-f7a824');
   await f.p.evaluate(()=>MuseumMapOpenTarget({kind:'artifact',id:'phu-dieu'}));await f.p.waitForFunction(()=>MuseumLiveMap.getState().navigation.active);assert.equal((await state(f.p)).presentation,false);
   await open(f.p);await f.p.locator('#demo-exit').click();await f.p.waitForFunction(()=>!MuseumLiveMap.getState().presentation);assert.equal(await f.p.locator('.demo-tour-panel').count(),0);assert.equal(await f.p.locator('.live-controls').isVisible(),true);assert.equal(await f.p.evaluate(()=>demoPermissionRequests),0);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('failed tour JSON offers retry and late responses never steal navigation',async()=>{
  const f=await fixture({before:p=>p.route('**/data/demo-tour.json',r=>r.abort())});try{await f.p.evaluate(()=>MuseumOpenDemoTour());await f.p.locator('#lm-retry').waitFor();assert.equal(await f.p.locator('.demo-tour-panel').count(),0);await f.p.unroute('**/data/demo-tour.json');await f.p.locator('#lm-retry').click();await f.p.locator('#demo-play').waitFor();assert.deepEqual(f.errors,[]);}finally{await f.c.close();}
  let release;const g=await fixture({before:p=>p.route('**/data/demo-tour.json',async r=>{await new Promise(resolve=>release=resolve);await r.continue();})});try{await g.p.evaluate(()=>MuseumOpenDemoTour());await g.p.waitForFunction(()=>window.MuseumLiveMap);await g.p.waitForTimeout(100);await g.p.evaluate(()=>Museum.nav('profile'));release();await g.p.waitForTimeout(300);assert.equal(await g.p.evaluate(()=>Museum.state.page),'profile');assert.equal(await g.p.locator('.demo-tour-panel').count(),0);assert.deepEqual(g.errors,[]);}finally{release?.();await g.c.close();}
 });
 await check('installed PWA opens the new tour and all nine photos after an offline reload',async()=>{
  const f=await fixture({query:'?pwa=1'});try{await f.p.waitForFunction(()=>!!navigator.serviceWorker.controller);await f.c.setOffline(true);await f.p.reload();await f.p.waitForFunction(()=>window.MuseumOpenDemoTour&&!document.getElementById('boot-status'));await open(f.p);
   for(const pct of [5,14,24,41,52,58,78,92,100]){await seek(f.p,pct);await f.p.locator('#demo-stop img').evaluate(img=>img.decode());}
   assert.equal(await f.p.evaluate(()=>Museum.A.length),200);assert.deepEqual((await state(f.p)).demo.visited,[]);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('automatic WCAG A/AA checks find no violations in presentation controls',async()=>{
  const f=await fixture();try{await open(f.p);await seek(f.p,5);await f.p.addScriptTag({path:process.env.MUSEUM_AXE_PATH||'/tmp/museum-v7-tools/node_modules/axe-core/axe.min.js'});const issues=await f.p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});assert.deepEqual(issues,[]);assert.deepEqual(f.errors,[]);}finally{await f.c.close();}
 });
}finally{await browser.close();}await fs.writeFile(process.env.MUSEUM_DEMO_REPORT||'/tmp/museum-demo-tour-results.json',JSON.stringify({scope:'Step 2 Chromium DOM, real data, offline cache; no physical iOS/Android claim',results},null,2));console.log(`${results.filter(r=>r.passed).length}/${results.length} presentation checks passed`);if(results.some(r=>!r.passed))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
function MuseumLabel(lang){return{vi:'Tiếp tục',en:'Resume',ko:'계속',zh:'继续'}[lang];}
