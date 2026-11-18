/* Rà soát Giai đoạn 3: các tình huống thật từng thiếu trong kiểm thử trước.
   VisualViewport giả lập không thay cho Safari / bàn phím trên thiết bị vật lý. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),{chromium}=require('playwright');
const BASE=process.env.MUSEUM_TEST_URL||'http://127.0.0.1:8877/bao-tang-da-nang-v6/';
const results=[];let browser;
async function fixture({viewport=false,width=390,height=900}={}){
 const c=await browser.newContext({viewport:{width,height},isMobile:width<800,hasTouch:width<800,reducedMotion:'reduce'});
 await c.addInitScript(({viewport,height})=>{
  localStorage.setItem('museum_v6:museum_map_onboarding_v1',JSON.stringify({version:1,status:'completed'}));
  if(viewport){window.testViewport=new EventTarget();testViewport.height=height;testViewport.offsetTop=0;Object.defineProperty(window,'visualViewport',{value:testViewport});}
 },{viewport,height});
 const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(BASE);await p.waitForFunction(()=>window.MuseumJourneyCard&&!document.getElementById('boot-status'));
 await p.locator('[data-lang=vi]').click();await p.locator('#visitor-guest').click();await p.evaluate(()=>Museum.nav('map'));
 await p.waitForFunction(()=>window.MuseumLiveMap?.getState().floor);return{c,p,errors};
}
const position=p=>p.evaluate(()=>MuseumLiveMap.getState().position);
const angleDelta=(a,b)=>((b-a+540)%360)-180;
async function check(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS',name);}catch(error){results.push({name,passed:false,error:error.stack});console.error('FAIL',name,error.stack);}}
(async()=>{browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});try{
 await check('explanation, settings and destination dialogs pause movement behind them',async()=>{
  const f=await fixture();try{
   await f.p.locator('[data-live-mode=auto]').click();await f.p.locator('#lm-play').click();await f.p.waitForTimeout(200);
   for(const id of ['lm-explain','lm-settings','lm-search-button']){
    await f.p.locator('#'+id).click();const before=await position(f.p);await f.p.waitForTimeout(400);assert.deepEqual(await position(f.p),before,id);await f.p.keyboard.press('Escape');
   }
   await f.p.locator('[data-live-mode=joystick]').click();await f.p.locator('#lm-explain').click();const before=await position(f.p);
   await f.p.keyboard.down('d');await f.p.waitForTimeout(300);await f.p.keyboard.up('d');assert.deepEqual(await position(f.p),before,'keyboard moved behind explanation');
   await f.p.keyboard.press('Escape');assert.equal(await f.p.evaluate(()=>Museum.state.page),'map');assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('recenter, panning and heading-up keep camera controls and accessible states synchronized',async()=>{
  const f=await fixture();try{
   await f.p.locator('#lm-center').click();assert.equal(await f.p.evaluate(()=>MuseumLiveMap.getState().follow),true);assert.equal(await f.p.locator('#lm-track').getAttribute('aria-pressed'),'true');
   await f.p.locator('#lm-view').click();const label=await f.p.locator('#lm-view').innerText();await f.p.locator('#lm-settings').click();assert.equal(await f.p.locator('#lm-rotate-view').innerText(),label);assert.equal(await f.p.locator('#lm-follow').getAttribute('aria-pressed'),'true');await f.p.keyboard.press('Escape');
   const beforeNorth=await f.p.locator('#lm-north').evaluate(e=>parseFloat(e.style.transform.match(/rotate\(([-\d.]+)deg\)/)[1]));
   await f.p.keyboard.down('s');await f.p.waitForTimeout(350);await f.p.keyboard.up('s');await f.p.waitForTimeout(250);
   const rotated=await f.p.evaluate(()=>({north:parseFloat(document.getElementById('lm-north').style.transform.match(/rotate\(([-\d.]+)deg\)/)[1]),shown:parseFloat(document.getElementById('lm-avatar').getAttribute('transform').match(/rotate\(([-\d.]+)\)/)[1])}));
   assert.ok(Math.abs(angleDelta(beforeNorth,rotated.north))>45,JSON.stringify({beforeNorth,...rotated}));
   assert.ok(Math.abs(angleDelta(rotated.north,-rotated.shown))<.5,JSON.stringify(rotated));
   const box=await f.p.locator('#lm-svg').boundingBox();await f.p.mouse.move(box.x+170,box.y+200);await f.p.mouse.down();await f.p.mouse.move(box.x+200,box.y+215,{steps:5});await f.p.mouse.up();
   assert.equal(await f.p.evaluate(()=>MuseumLiveMap.getState().follow),false);assert.equal(await f.p.locator('#lm-track').getAttribute('aria-pressed'),'false');assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('dragging the bottom sheet opens and closes once without a trailing click reversal',async()=>{
  const f=await fixture();try{
   for(const up of [true,false]){const box=await f.p.locator('#lm-sheet-toggle').boundingBox(),x=box.x+box.width/2,y=box.y+box.height/2;await f.p.mouse.move(x,y);await f.p.mouse.down();await f.p.mouse.move(x,y+(up?-100:100),{steps:8});await f.p.mouse.up();assert.equal(await f.p.locator('#lm-sheet-toggle').getAttribute('aria-expanded'),String(up));}
   await f.p.locator('#lm-sheet-toggle').click();assert.equal(await f.p.locator('#lm-sheet-toggle').getAttribute('aria-expanded'),'true');assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('destination dialog remains inside a Safari-style visual viewport above the keyboard',async()=>{
  const f=await fixture({viewport:true});try{
   await f.p.locator('#lm-search-button').click();await f.p.locator('#lm-destination-input').fill('WC');await f.p.evaluate(()=>{testViewport.height=430;testViewport.offsetTop=25;testViewport.dispatchEvent(new Event('resize'));});await f.p.waitForTimeout(100);
   const box=await f.p.locator('.live-destinations').boundingBox();assert.ok(box.y>=25&&box.y+box.height<=455,JSON.stringify(box));assert.ok(await f.p.locator('#lm-destination-input').isVisible());assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
}finally{await browser.close();}await fs.writeFile(process.env.MUSEUM_MAP_FINAL_REPORT||'/tmp/live-map-final-results.json',JSON.stringify({scope:'Stage 3 actual DOM regression checks in Chromium; synthetic visual viewport only',results},null,2));console.log(`${results.filter(r=>r.passed).length}/${results.length} final map checks passed`);if(results.some(r=>!r.passed))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
