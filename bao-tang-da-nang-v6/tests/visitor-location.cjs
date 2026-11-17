/* Permission and sensor simulation in Chromium. These tests do not verify a
 * physical phone compass, indoor positioning or live OpenStreetMap tiles. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const {chromium}=require('playwright');
const BASE=process.env.MUSEUM_TEST_URL||'http://127.0.0.1:8765/bao-tang-da-nang-v6/';
let browser;const results=[];
async function test(name,work){try{await work();results.push({name,passed:true});console.log('PASS '+name);}catch(error){results.push({name,passed:false,error:error.stack});console.error('FAIL '+name+'\n'+error.stack);}}
async function fixture({mock=true,width=390,height=844,...options}={}){
 const context=await browser.newContext({viewport:{width,height},locale:'vi-VN',reducedMotion:'reduce',...options});
 const page=await context.newPage(),errors=[],external=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(new URL(BASE).origin))external.push(r.url());});
 await page.route('https://tile.openstreetmap.org/**',r=>r.abort());
 if(mock)await page.addInitScript(()=>{
  const callbacks=[],cleared=[];let permission='granted',pendingResolve;
  window.__geo={callbacks,cleared,options:[],permissions:[],permission:value=>{permission=value;},resolve:()=>pendingResolve?.('granted'),fix:(lat=16.07123,lng=108.22345,accuracy=12,time=Date.now())=>callbacks.at(-1)?.success({coords:{latitude:lat,longitude:lng,accuracy,heading:125},timestamp:time}),fail:code=>callbacks.at(-1)?.error({code}),emit:(alpha,absolute=true,other={})=>{const event=new Event('deviceorientation');Object.defineProperties(event,Object.fromEntries(Object.entries({alpha,absolute,...other}).map(([k,v])=>[k,{value:v}])));window.dispatchEvent(event);}};
  Object.defineProperty(navigator,'geolocation',{configurable:true,value:{watchPosition(success,error,options){callbacks.push({success,error});window.__geo.options.push(options);return callbacks.length;},clearWatch(id){cleared.push(id);}}});
  class Orientation extends Event{static requestPermission(){window.__geo.permissions.push({active:navigator.userActivation.isActive});return permission==='pending'?new Promise(resolve=>{pendingResolve=resolve;}):Promise.resolve(permission);}}
  Object.defineProperty(window,'DeviceOrientationEvent',{configurable:true,value:Orientation});
 });
 await page.goto(BASE);await page.locator('[data-lang=vi]').click();return{context,page,errors,external};
}
async function enter(f,name='Hòa 🌼'){await f.page.locator('#visitor-name').fill(name);await f.page.locator('#language-start').click();await f.page.locator('#lang-overlay').waitFor({state:'hidden'});}
async function map(f){await f.page.evaluate(()=>Museum.nav('map'));}
async function state(f){return f.page.evaluate(()=>MuseumLocation.getState());}
async function overflow(page){return page.evaluate(()=>[...document.querySelectorAll('html,body,.page.active,.page.active .scroll')].filter(e=>e.clientWidth&&e.scrollWidth>e.clientWidth+2).map(e=>e.id||e.tagName));}
(async()=>{browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});try{
 await test('first entry asks for a nickname, preserves a draft on language changes and supports rename/reload/guest',async()=>{const f=await fixture();try{
  await f.page.locator('#language-start').click();assert.equal(await f.page.locator('#visitor-name').getAttribute('aria-invalid'),'true');assert.match(await f.page.locator('#visitor-name-error').innerText(),/Nhập tên/);
  await f.page.locator('#visitor-name').fill('Hòa 🌼');await f.page.locator('[data-lang=en]').click();assert.equal(await f.page.locator('#visitor-name').inputValue(),'Hòa 🌼');await f.page.locator('[data-lang=vi]').click();
  await f.page.locator('#language-start').click();assert.match(await f.page.locator('[data-v6=welcome]').innerText(),/Hòa 🌼/);await f.page.reload();assert.equal(await f.page.locator('#lang-overlay').isVisible(),false);
  await f.page.evaluate(()=>Museum.nav('profile'));await f.page.locator('#visitor-edit-name').fill('Lan');await f.page.locator('#visitor-edit-form [type=submit]').click();await f.page.reload();assert.equal(await f.page.evaluate(()=>MuseumVisitor.getName()),'Lan');
  await f.page.evaluate(()=>Museum.nav('profile'));await f.page.locator('.visitor-guest-reset').click();await f.page.locator('#lang-switch').click();await f.page.locator('#language-start').click();await f.page.locator('#lang-overlay').waitFor({state:'hidden'});assert.equal(await f.page.evaluate(()=>MuseumVisitor.getName()),'');assert.deepEqual(f.errors,[]);assert.deepEqual(f.external,[]);
 }finally{await f.context.close();}});
 await test('guest and existing-language visitors complete onboarding, including a first-visit QR deep link and blocked storage',async()=>{
  const f=await fixture();try{await f.page.goto(BASE+'?artifact=ma-nao');await f.page.locator('#visitor-guest').click();await f.page.locator('#lang-overlay').waitFor({state:'hidden'});assert.equal(await f.page.evaluate(()=>Museum.state.page),'artifact');await f.page.reload();assert.equal(await f.page.locator('#lang-overlay').isVisible(),false);assert.deepEqual(f.errors,[]);}finally{await f.context.close();}
  const old=await fixture();try{await old.page.evaluate(()=>{localStorage.setItem('museum_v6:museum_language_confirmed','yes');});await old.page.reload();assert.equal(await old.page.locator('#lang-overlay').isVisible(),true);await enter(old,'Bạn cũ');assert.equal(await old.page.evaluate(()=>MuseumVisitor.getName()),'Bạn cũ');}finally{await old.context.close();}
  const blocked=await fixture();try{await blocked.page.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new DOMException('Blocked','SecurityError');};Storage.prototype.getItem=()=>{throw new DOMException('Blocked','SecurityError');};});await blocked.page.reload();await enter(blocked,'Tên tạm');await blocked.page.evaluate(()=>Museum.nav('profile'));assert.match(await blocked.page.locator('#visitor-card').innerText(),/Tên tạm/);assert.deepEqual(blocked.errors,[]);}finally{await blocked.context.close();}
 });
 await test('names are rendered as text and new controls fit narrow, landscape, tablet and desktop viewports',async()=>{
  for(const[width,height]of[[320,568],[390,844],[844,390],[768,1024],[1366,900]]){const f=await fixture({width,height});try{
   const name='<img src=x onerror=alert(1)>';await enter(f,name);assert.equal(await f.page.locator('[data-v6=welcome] img').count(),0);assert.ok((await f.page.locator('[data-v6=welcome]').innerText()).includes(name));
   await map(f);assert.deepEqual(await overflow(f.page),[]);await f.page.locator('#gps-start').click();await f.page.evaluate(()=>__geo.fix());assert.equal((await state(f)).gps,'tracking');assert.deepEqual(await overflow(f.page),[]);
   await f.page.evaluate(()=>Museum.nav('profile'));assert.deepEqual(await overflow(f.page),[]);assert.deepEqual(f.errors,[]);
  }finally{await f.context.close();}}
 });
 await test('Chromium GPS permission supplies a real browser fix only after opt-in, without inferring facing direction',async()=>{const f=await fixture({mock:false,permissions:['geolocation','accelerometer','gyroscope','magnetometer'],geolocation:{latitude:16.07123,longitude:108.22345,accuracy:18}});try{
  await enter(f);await map(f);assert.deepEqual(f.external,[]);assert.equal((await state(f)).position,null);await f.page.locator('#gps-start').click();await f.page.waitForFunction(()=>MuseumLocation.getState().position!==null);
  const s=await state(f);assert.equal(s.position.lat,16.07123);assert.equal(s.position.accuracy,18);assert.equal(s.heading,null);assert.equal(await f.page.locator('.gps-marker .gps-direction').isVisible(),false);assert.match(await f.page.locator('#gps-accuracy').innerText(),/18 m/);assert.deepEqual(f.errors,[]);
  await f.page.locator('#gps-heading').click();await f.page.waitForFunction(()=>MuseumLocation.getState().listening);
  await f.page.evaluate(()=>window.dispatchEvent(new DeviceOrientationEvent('deviceorientation',{alpha:315,absolute:true})));assert.equal((await state(f)).heading,45);assert.equal(await f.page.locator('.gps-marker .gps-direction').isVisible(),true);
 }finally{await f.context.close();}});
 await test('phone direction rotates a beam on a stationary GPS dot, uses a gesture permission and ignores relative sensors',async()=>{const f=await fixture();try{
  await enter(f);await map(f);await f.page.evaluate(()=>Museum.markPosition('floor-2',true,'qr'));const zone=await f.page.evaluate(()=>JSON.stringify(Museum.state.currentZone));
  assert.equal(await f.page.evaluate(()=>__geo.callbacks.length),0);await f.page.locator('#gps-start').click();await f.page.evaluate(()=>__geo.fix());await f.page.locator('#gps-heading').click();
  assert.equal(await f.page.evaluate(()=>__geo.permissions[0].active),true);await f.page.evaluate(()=>__geo.emit(12,false));assert.equal((await state(f)).heading,null);
  await f.page.evaluate(()=>__geo.emit(270,true));assert.equal((await state(f)).heading,90);assert.equal(await f.page.locator('.gps-marker .gps-direction').isVisible(),true);const before=(await state(f)).position;
  await f.page.evaluate(()=>{for(let i=0;i<25;i++)__geo.emit(180,true);});assert.ok(Math.abs((await state(f)).heading-180)<1);assert.deepEqual((await state(f)).position,before);assert.equal(await f.page.evaluate(()=>JSON.stringify(Museum.state.currentZone)),zone);
  await f.page.evaluate(()=>__geo.fix(16.0713,108.2235,22));assert.equal((await state(f)).position.accuracy,22);
  const storage=await f.page.evaluate(()=>JSON.stringify({...localStorage}));assert.ok(!storage.includes('16.07123'));assert.deepEqual(f.errors,[]);
 }finally{await f.context.close();}});
 await test('GPS and compass denial, missing hardware and delayed iOS permission remain recoverable',async()=>{const f=await fixture();try{
  await enter(f);await map(f);await f.page.locator('#gps-start').click();await f.page.evaluate(()=>__geo.fail(1));assert.equal((await state(f)).gps,'denied');assert.match(await f.page.locator('#gps-status').innerText(),/quyền/);
  await f.page.evaluate(()=>__geo.permission('denied'));await f.page.locator('#gps-heading').click();assert.equal((await state(f)).sensor,'denied');assert.equal((await state(f)).listening,false);
  await f.page.locator('#gps-start').click();await f.page.evaluate(()=>__geo.fail(2));assert.equal((await state(f)).gps,'unavailable');await f.page.locator('#gps-start').click();await f.page.evaluate(()=>__geo.fail(3));assert.equal((await state(f)).gps,'timeout');
  await f.page.evaluate(()=>__geo.permission('pending'));await f.page.locator('#gps-heading').click();await f.page.evaluate(()=>Museum.nav('home'));await f.page.evaluate(()=>__geo.resolve());assert.equal((await state(f)).listening,false);
  await map(f);await f.page.evaluate(()=>Object.defineProperty(window,'DeviceOrientationEvent',{value:undefined}));await f.page.locator('#gps-heading').click();assert.equal((await state(f)).sensor,'unsupported');assert.deepEqual(f.errors,[]);
 }finally{await f.context.close();}});
 await test('stop, background and navigation clear watches; stale callbacks cannot restart tracking or leak location/name to AI',async()=>{const f=await fixture();try{
  await enter(f,'Nickname_Private');await map(f);await f.page.locator('#gps-start').click();await f.page.evaluate(()=>__geo.fix());await f.page.locator('#gps-heading').click();await f.page.evaluate(()=>__geo.emit(270));
  await f.page.locator('#gps-stop').click();assert.equal((await state(f)).watching,false);assert.equal((await state(f)).listening,false);assert.equal((await state(f)).gps,'paused');const stopped=(await state(f)).position;
  await f.page.evaluate(()=>{__geo.fix(20,110,5);__geo.emit(180);});assert.deepEqual((await state(f)).position,stopped);assert.equal((await state(f)).heading,null);
  await f.page.locator('#gps-start').click();await f.page.evaluate(()=>__geo.fix());await f.page.locator('#gps-heading').click();await f.page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide')));assert.equal((await state(f)).watching,false);assert.equal((await state(f)).listening,false);
  await f.page.locator('#gps-start').click();await f.page.evaluate(()=>__geo.fix());await f.page.locator('#gps-heading').click();await f.page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});assert.equal((await state(f)).watching,false);assert.equal((await state(f)).listening,false);await f.page.evaluate(()=>{delete document.hidden;});
  await f.page.locator('#gps-start').click();await f.page.evaluate(()=>__geo.fix());await f.page.evaluate(()=>Museum.nav('guide'));assert.equal((await state(f)).watching,false);
  let sent;await f.page.route('https://example.org/chat',r=>{sent=r.request().postDataJSON();return r.fulfill({status:500,body:'unavailable'});});await f.page.evaluate(()=>{Museum.persist('museum_ai_endpoint','https://example.org/chat');Museum.state.revealSpeed='instant';});await f.page.locator('#chat-input').fill('Súng thần công làm bằng gì?');await f.page.locator('#chat-form [type=submit]').click();await f.page.waitForFunction(()=>document.querySelector('#messages').getAttribute('aria-busy')==='false');assert.ok(sent);assert.ok(!JSON.stringify(sent).includes('Nickname_Private'));assert.ok(!JSON.stringify(sent).includes('16.07123'));assert.deepEqual(f.errors,[]);
 }finally{await f.context.close();}});
 await test('old fixes and old compass readings become visibly stale, and a fresh GPS fix restores tracking',async()=>{const f=await fixture();try{
  await enter(f);await map(f);await f.page.clock.install({time:Date.now()});await f.page.locator('#gps-start').click();await f.page.evaluate(()=>__geo.fix());await f.page.locator('#gps-heading').click();await f.page.evaluate(()=>__geo.emit(270));await f.page.clock.fastForward(31000);
  assert.equal((await state(f)).gps,'stale');assert.equal((await state(f)).heading,null);assert.equal(await f.page.locator('.gps-marker').evaluate(e=>e.classList.contains('gps-paused')),true);
  await f.page.locator('#gps-start').click();assert.equal((await state(f)).gps,'waiting');assert.equal(await f.page.locator('.gps-marker').evaluate(e=>e.classList.contains('gps-paused')),true);
  await f.page.evaluate(()=>__geo.fix(16.072,108.224,10));assert.equal((await state(f)).gps,'tracking');const current=(await state(f)).position;await f.page.evaluate(()=>__geo.fix(20,110,5,Date.now()-5000));assert.deepEqual((await state(f)).position,current);assert.deepEqual(f.errors,[]);
 }finally{await f.context.close();}});
 }finally{await browser.close();}
 console.log(`${results.filter(r=>r.passed).length}/${results.length} visitor/location groups passed`);
 if(process.env.MUSEUM_TEST_REPORT)await fs.writeFile(process.env.MUSEUM_TEST_REPORT,JSON.stringify({base:BASE,scope:'Chromium API/sensor simulation; no physical device, indoor GPS or live OSM-tile verification',results},null,2));
 if(results.some(r=>!r.passed))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
