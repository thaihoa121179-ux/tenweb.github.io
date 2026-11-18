/* Chromium mô phỏng: kiểm thử thiết bị/cảm biến vật lý cần làm riêng theo checklist. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),{chromium}=require('playwright');
const BASE=process.env.MUSEUM_TEST_URL||'http://127.0.0.1:8877/bao-tang-da-nang-v6/';let browser;const results=[];
async function fixture({width=390,height=844,query='',sensor='none'}={}){
 const c=await browser.newContext({viewport:{width,height},isMobile:width<800,hasTouch:width<800,reducedMotion:'reduce'});
 await c.addInitScript(sensor=>{localStorage.setItem('museum_v6:museum_map_onboarding_v1',JSON.stringify({version:1,status:'completed'}));
  if(sensor==='none')return;
  const permission=()=>sensor==='denied'?Promise.resolve('denied'):sensor==='pending'?new Promise(r=>{(window.permissionResolvers||=[]).push(r);}):Promise.resolve('granted');
  Object.defineProperty(window,'DeviceMotionEvent',{value:class{static requestPermission(){return permission();}},configurable:true});
  Object.defineProperty(window,'DeviceOrientationEvent',{value:class{static requestPermission(){return permission();}},configurable:true});
 },sensor);
 const p=await c.newPage(),errors=[],external=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(new URL(r.url()).origin!==new URL(BASE).origin)external.push(r.url());});
 await p.goto(BASE+query);await p.waitForFunction(()=>window.MuseumJourneyCard&&!document.getElementById('boot-status'));await p.locator('[data-lang=vi]').click();await p.locator('#visitor-guest').click();
 const lazy=await p.evaluate(()=>typeof MuseumLiveMap==='undefined');assert.equal(lazy,true);await p.evaluate(()=>Museum.nav('map'));await p.waitForFunction(()=>window.MuseumLiveMap?.getState().floor);
 return{c,p,errors,external};
}
async function test(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS',name);}catch(e){results.push({name,passed:false,error:e.stack});console.error('FAIL',name,e.stack);}}
const state=p=>p.evaluate(()=>MuseumLiveMap.getState());
(async()=>{browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});try{
 for(const [width,height]of [[360,800],[390,844],[430,932],[844,390],[1366,900]])await test(`full screen, no overflow, floor geometry and touch targets ${width}×${height}`,async()=>{
  const f=await fixture({width,height});try{assert.equal(await f.p.locator('.nav').isVisible(),false);assert.equal(await f.p.locator('.top').isVisible(),false);
   for(const floor of [1,2,3]){await f.p.locator(`[data-live-floor="${floor}"]`).click();assert.equal((await state(f.p)).floor,floor);assert.equal(await f.p.locator('.live-zone').count(),[3,4,8][floor-1]);}
   assert.deepEqual(await f.p.evaluate(()=>[...document.querySelectorAll('html,body,.page.active,.live-map-host')].filter(e=>e.clientWidth&&e.scrollWidth>e.clientWidth+2).map(e=>e.id||e.tagName)),[]);
   const sizes=await f.p.locator('.live-map-host button:visible').evaluateAll(es=>es.map(e=>({id:e.id,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})).filter(s=>s.w<47.9||s.h<47.9));assert.deepEqual(sizes,[]);
   await f.p.locator('#lm-explain').click();assert.match(await f.p.locator('dialog[open]').innerText(),/không xác định vị trí thật/);await f.p.keyboard.press('Escape');assert.equal(await f.p.evaluate(()=>Museum.state.page),'map');assert.deepEqual(f.errors,[]);assert.deepEqual(f.external,[]);
  }finally{await f.c.close();}
 });
 await test('WASD and joystick move, diagonal speed is bounded, walls stop and exit clears input/RAF',async()=>{
  const f=await fixture({width:1366,height:900});try{await f.p.locator('[data-live-mode=joystick]').click();const before=await state(f.p);await f.p.keyboard.down('d');await f.p.waitForTimeout(900);await f.p.keyboard.up('d');const after=await state(f.p);assert.ok(after.position.x>before.position.x+.8&&after.position.x<before.position.x+1.6);
   const stick=await f.p.locator('#lm-stick').boundingBox();await f.p.mouse.move(stick.x+56,stick.y+56);await f.p.mouse.down();await f.p.mouse.move(stick.x+56,stick.y+15);await f.p.waitForTimeout(1600);await f.p.mouse.up();assert.ok((await state(f.p)).position.y<after.position.y-1);
   await f.p.keyboard.down('w');await f.p.waitForTimeout(1500);await f.p.keyboard.up('w');assert.ok((await state(f.p)).position.y>=17.2);
   await f.p.locator('#lm-back').click();const stopped=await state(f.p);assert.equal(stopped.frame,0);assert.equal(stopped.sensorsActive,false);await f.p.waitForTimeout(200);assert.deepEqual((await state(f.p)).position,stopped.position);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await test('autoplay plays, pauses, speeds up and seeks through doors without penetrating walls',async()=>{
  const f=await fixture();try{await f.p.locator('[data-live-mode=auto]').click();await f.p.locator('#lm-speed').selectOption('4');await f.p.locator('#lm-play').click();await f.p.waitForTimeout(900);assert.ok((await state(f.p)).position.x>9);await f.p.locator('#lm-play').click();const paused=await state(f.p);await f.p.waitForTimeout(250);assert.deepEqual((await state(f.p)).position,paused.position);
   for(let i=0;i<3;i++){await f.p.locator('#lm-skip').click();const s=await state(f.p);assert.ok(await f.p.evaluate(async s=>{const f=await(await fetch('data/maps/floor-1.json')).json();return MuseumMapEngine.walkable(f,s.position);},s));}
   await f.p.locator('[data-live-floor="2"]').click();assert.equal((await state(f.p)).running,false);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await test('denied sensors have a one-tap joystick fallback; late permissions cannot restart sensors',async()=>{
  for(const sensor of ['denied','pending']){const f=await fixture({sensor});try{await f.p.locator('[data-live-mode=walking]').click();await f.p.locator('#lm-sensor-button').click();if(sensor==='denied')await f.p.locator('#lm-status').filter({hasText:'Chưa được cấp quyền'}).waitFor();await f.p.locator('[data-live-mode=joystick]').click();if(sensor==='pending')await f.p.evaluate(()=>permissionResolvers.forEach(r=>r('granted')));await f.p.waitForTimeout(80);assert.equal((await state(f.p)).sensorsActive,false);assert.equal((await state(f.p)).mode,'joystick');assert.deepEqual(f.errors,[]);}finally{await f.c.close();}}
 });
 await test('sensor silence after 3 seconds shows recovery and ten gait pulses drive the dot',async()=>{
  const f=await fixture({sensor:'granted',query:'?debug=1'});try{
   await f.p.clock.install();await f.p.locator('[data-live-mode=walking]').click();await f.p.locator('#lm-sensor-button').click();await f.p.clock.runFor(3200);assert.match(await f.p.locator('#lm-status').innerText(),/Safari\/Chrome/);assert.equal((await state(f.p)).sensorsActive,false);
   await f.p.locator('#lm-sensor-button').click();await f.p.evaluate(()=>{window.waveStart=performance.now();window.wave=setInterval(()=>{const phase=(performance.now()-waveStart)%800,z=9.81+(phase>=200&&phase<360?2*Math.sin((phase-200)/160*Math.PI):0);const e=new Event('devicemotion');e.accelerationIncludingGravity={x:0,y:0,z};window.dispatchEvent(e);const h=new Event('deviceorientation');h.alpha=270;h.absolute=true;window.dispatchEvent(h);},20);});
   await f.p.clock.runFor(8000);await f.p.evaluate(()=>clearInterval(wave));const s=await state(f.p);assert.equal(s.steps,10);assert.ok(s.position.x>25&&s.position.x<28);assert.ok(await f.p.locator('#lm-debug').isVisible());
   await f.p.locator('#lm-back').click();assert.equal((await state(f.p)).sensorsActive,false);assert.equal((await state(f.p)).frame,0);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await test('zoom, pan, direction-up, follow, settings, held placement and reset work',async()=>{
  const f=await fixture({query:'?debug=1'});try{await f.p.locator('#lm-plus').click();assert.ok((await state(f.p)).zoom>1);await f.p.locator('#lm-view').click();await f.p.locator('#lm-settings').click();await f.p.locator('#lm-scale').selectOption('6');await f.p.locator('#lm-sensitivity').fill('1.5');await f.p.locator('#lm-reset').click();assert.equal((await state(f.p)).zoom,1);assert.equal((await state(f.p)).steps,0);
   const svg=await f.p.locator('#lm-svg').boundingBox();await f.p.mouse.move(svg.x+180,svg.y+180);await f.p.mouse.down();await f.p.mouse.move(svg.x+220,svg.y+200);await f.p.mouse.up();assert.equal((await state(f.p)).follow,false);await f.p.locator('#lm-center').click();assert.equal((await state(f.p)).follow,true);
   await f.p.locator('#lm-settings').click();await f.p.locator('#lm-reset').click();await f.p.waitForTimeout(80);
   const goal=await f.p.evaluate(()=>{const p=new DOMPoint(20,20).matrixTransform(document.getElementById('lm-world').getScreenCTM());return{x:p.x,y:p.y};});await f.p.mouse.move(goal.x,goal.y);await f.p.mouse.down();await f.p.waitForTimeout(750);await f.p.mouse.up();assert.ok(Math.abs((await state(f.p)).position.x-20)<.2);
   const box=await f.p.locator('#lm-svg').boundingBox(),cdp=await f.c.newCDPSession(f.p),cy=box.y+100;const beforeZoom=(await state(f.p)).zoom;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:130,y:cy},{x:230,y:cy}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:100,y:cy},{x:260,y:cy}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok((await state(f.p)).zoom>beforeZoom);await cdp.detach();
   await f.p.locator('#lm-sheet-toggle').click();assert.equal(await f.p.locator('.live-area-list').isVisible(),true);await f.p.keyboard.press('Tab');assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await test('four languages, QR pixels and file-based AI configuration remain valid',async()=>{
  const f=await fixture();try{await f.p.locator('#lm-back').click();assert.equal(await f.p.locator('.developer-config,#ai-endpoint').count(),0);assert.equal(await f.p.evaluate(()=>Museum.getAIEndpoint()),null);
   for(const lang of ['en','ko','zh','vi']){await f.p.locator('#lang-switch').click();await f.p.locator(`[data-lang=${lang}]`).click();await f.p.locator('#language-start').click();await f.p.evaluate(()=>Museum.nav('map'));await f.p.waitForFunction(()=>window.MuseumLiveMap?.getState().floor);assert.equal(await f.p.locator('#lm-heading').innerText(),await f.p.evaluate(()=>MuseumMapWords.title[{vi:0,en:1,ko:2,zh:3}[Museum.state.lang]]));await f.p.locator('#lm-back').click();}
   await f.p.evaluate(()=>Museum.openArtifact('ma-nao'));const url=await f.p.evaluate(async()=>{const i=document.getElementById('artifact-qr');await i.decode();await MuseumLoadQRDecoder();const c=document.createElement('canvas');c.width=c.height=800;const x=c.getContext('2d');x.fillStyle='white';x.fillRect(0,0,800,800);x.drawImage(i,0,0,800,800);return jsQR(x.getImageData(0,0,800,800).data,800,800)?.data;});assert.match(url,/\?artifact=ma-nao$/);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await test('PWA opens the lazy map, three floors and autopilot offline',async()=>{
  const f=await fixture({query:'?pwa=1'});try{await f.p.waitForFunction(()=>navigator.serviceWorker.controller!==null);await f.c.setOffline(true);await f.p.reload();await f.p.waitForFunction(()=>window.MuseumJourneyCard&&!document.getElementById('boot-status'));await f.p.evaluate(()=>Museum.nav('map'));await f.p.waitForFunction(()=>window.MuseumLiveMap?.getState().floor);await f.p.locator('[data-live-floor="3"]').click();assert.equal((await state(f.p)).floor,3);await f.p.locator('[data-live-mode=auto]').click();await f.p.locator('#lm-play').click();await f.p.waitForTimeout(300);assert.equal((await state(f.p)).running,true);assert.deepEqual(f.errors,[]);}finally{await f.c.close();}
 });
}finally{await browser.close();}await fs.writeFile(process.env.MUSEUM_MAP_REPORT||'/tmp/live-map-results.json',JSON.stringify({scope:'Stage 1; Chromium viewport and synthetic sensor tests, not real phone hardware',results},null,2));console.log(`${results.filter(r=>r.passed).length}/${results.length} stage 1 checks passed`);if(results.some(r=>!r.passed))process.exitCode=1;})().catch(e=>{console.error(e);process.exitCode=1;});
