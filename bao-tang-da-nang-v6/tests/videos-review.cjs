/* Component-only verification. All player responses are fixtures; this does NOT
 * verify any real source video exists, is embeddable, or plays successfully.
 * Run: node bao-tang-da-nang-v6/tests/videos-review.cjs
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
let browser;
const results=[];
const youtube={verifiedSource:true,relation:'theme',title:'Fixture-only related media',url:'https://www.youtube.com/watch?v=abcdefghijk',sourceUrl:'https://baotangdanang.vn/source-fixture'};
const file={...youtube,url:'https://baotangdanang.vn/media/fixture.mp4',relation:'object'};
async function fixture(){
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const requests=[];await context.route('https://**/*',route=>{requests.push(route.request().url());return route.fulfill({status:200,contentType:route.request().resourceType()==='media'?'video/mp4':'text/html',body:route.request().resourceType()==='media'?'not-a-real-video':'<!doctype html><button>Fixture player control</button>'})});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setContent('<!doctype html><html lang="en"><body><main id="app" class="app"><button id="background">Background action</button><div id="videos"></div></main></body></html>');
 await page.addStyleTag({path:path.join(root,'videos.css')});await page.addScriptTag({path:path.join(root,'videos.js')});
 return {context,page,requests,errors};
}
async function render(page,video=youtube,lang='en'){await page.evaluate(({video,lang})=>MuseumVideos.render(document.querySelector('#videos'),{name:'Fixture object',videos:[video]},lang),{video,lang})}
async function test(name,work){try{await work();results.push({name,passed:true});console.log('PASS',name)}catch(e){results.push({name,passed:false,error:e.message});console.error('FAIL',name,e.message)}}
(async()=>{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  await test('unverified, malformed and unsafe descriptors are omitted',async()=>{
   const f=await fixture();try{
    for(const bad of [{...youtube,verifiedSource:false},{...youtube,relation:'pretend-location'},{...youtube,url:'javascript:alert(1)'},{...youtube,sourceUrl:'http://baotangdanang.vn/source'},{...youtube,url:'https://name:secret@youtube.com/watch?v=abcdefghijk'},{...youtube,sourceUrl:'https://name:secret@baotangdanang.vn/source'},{...youtube,url:'https://youtube.com/watch?v=short'}]){
     assert.equal(await f.page.evaluate(v=>MuseumVideos.normalize(v),bad),null);
    }
    await f.page.evaluate(()=>MuseumVideos.render(document.querySelector('#videos'),{videos:[]},'en'));assert.equal(await f.page.locator('#videos').isHidden(),true);
   }finally{await f.context.close()}
  });
  await test('render does not create a player or request media; titles are text, not markup',async()=>{
   const f=await fixture();try{await render(f.page,{...youtube,title:'<img src=x onerror=alert(1)>'});assert.equal(await f.page.locator('iframe,video').count(),0);assert.deepEqual(f.requests,[]);assert.equal(await f.page.locator('#videos h3').textContent(),'<img src=x onerror=alert(1)>');assert.equal(await f.page.locator('#videos img').count(),0);assert.match(await f.page.locator('#videos').innerText(),/not proof this object appears/);assert.deepEqual(f.errors,[])}finally{await f.context.close()}
  });
  await test('click opens only the normalized privacy-enhanced iframe and Escape restores focus',async()=>{
   const f=await fixture();try{await render(f.page);await f.page.locator('#videos button').click();const frame=f.page.locator('iframe');assert.match(await frame.getAttribute('src'),/^https:\/\/www\.youtube-nocookie\.com\/embed\/abcdefghijk\?rel=0/);assert.equal(await f.page.locator('[role=dialog]').getAttribute('aria-modal'),'true');assert.equal(await f.page.locator('.museum-video-panel button').evaluate(el=>el===document.activeElement),true);await f.page.keyboard.press('Escape');assert.equal(await f.page.locator('[role=dialog]').count(),0);assert.equal(await f.page.locator('#videos button').evaluate(el=>el===document.activeElement),true);assert.ok(f.requests.every(u=>u.startsWith('https://www.youtube-nocookie.com/')));assert.deepEqual(f.errors,[])}finally{await f.context.close()}
  });
  await test('dialog focus wraps from last to first and first to last',async()=>{
   const f=await fixture();try{await render(f.page);await f.page.locator('#videos button').click();await f.page.locator('.museum-video-panel a').focus();await f.page.keyboard.press('Tab');assert.equal(await f.page.locator('.museum-video-panel button').evaluate(el=>el===document.activeElement),true);await f.page.keyboard.press('Shift+Tab');assert.equal(await f.page.locator('.museum-video-panel a').evaluate(el=>el===document.activeElement),true)}finally{await f.context.close()}
  });
  await test('navigation removes iframe; visibility change releases direct video media',async()=>{
   const f=await fixture();try{await render(f.page);await f.page.locator('#videos button').click();await f.page.evaluate(()=>document.dispatchEvent(new CustomEvent('museum:navigate',{detail:{page:'home'}})));assert.equal(await f.page.locator('[role=dialog],iframe').count(),0);await render(f.page,file);await f.page.locator('#videos button').click();await f.page.evaluate(()=>{window.videoReference=document.querySelector('video');Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))});assert.equal(await f.page.locator('[role=dialog],video').count(),0);assert.equal(await f.page.evaluate(()=>videoReference.getAttribute('src')),null);assert.deepEqual(f.errors,[])}finally{await f.context.close()}
  });
  await test('media extension is checked on the URL path, never on a query parameter',async()=>{
   const f=await fixture();try{for(const url of ['https://baotangdanang.vn/not-a-video?x=.mp4?','https://baotangdanang.vn/page?filename=clip.webm'])assert.equal(await f.page.evaluate(v=>MuseumVideos.normalize(v),{...file,url}),null,url);assert.equal((await f.page.evaluate(v=>MuseumVideos.normalize(v),{...file,url:'https://baotangdanang.vn/media/fixture.mp4?download=1'})).type,'file')}finally{await f.context.close()}
  });
  await test('modal makes the background inert and preserves its prior state after close',async()=>{
   const f=await fixture();try{await render(f.page);await f.page.locator('#videos button').click();assert.equal(await f.page.locator('#app').evaluate(el=>el.inert),true,'aria-modal alone does not disable background controls');await f.page.locator('.museum-video-panel button').click();assert.equal(await f.page.locator('#app').evaluate(el=>el.inert),false);await f.page.evaluate(()=>document.querySelector('#app').inert=true);await f.page.evaluate(()=>document.querySelector('#videos button').click());await f.page.locator('.museum-video-panel button').click();assert.equal(await f.page.locator('#app').evaluate(el=>el.inert),true,'must retain an already-inert parent')}finally{await f.context.close()}
  });
  await test('all four labels and mobile dialog remain available without horizontal overflow',async()=>{
   const f=await fixture();try{for(const [lang,label]of [['vi','Phát video'],['en','Play video'],['ko','영상 재생'],['zh','播放视频']]){await render(f.page,youtube,lang);assert.equal(await f.page.locator('#videos button').innerText(),label);await f.page.locator('#videos button').click();assert.equal(await f.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await f.page.locator('.museum-video-panel button').click()}assert.deepEqual(f.errors,[])}finally{await f.context.close()}
  });
 }finally{await browser.close()}
 const passed=results.filter(r=>r.passed).length;console.log(`${passed}/${results.length} component groups passed. Mock-only: no live video playback verified.`);if(passed!==results.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
