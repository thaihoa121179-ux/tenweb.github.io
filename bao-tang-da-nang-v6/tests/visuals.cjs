/* Kiểm tra ảnh thật trong các luồng, không chỉ đếm số thẻ img. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),{chromium}=require('playwright');
const BASE=process.env.MUSEUM_TEST_URL||'http://127.0.0.1:8877/bao-tang-da-nang-v6/';
const results=[];let browser;
async function fixture(width=390){
 const c=await browser.newContext({viewport:{width,height:900},isMobile:width<800,hasTouch:width<800,reducedMotion:'reduce',locale:'vi-VN'});
 const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(BASE);await p.waitForFunction(()=>window.MuseumVisuals&&window.MuseumJourneyCard&&!document.getElementById('boot-status'));
 await p.locator('[data-lang=vi]').click();await p.locator('#visitor-guest').click();
 await p.evaluate(()=>{Museum.state.revealSpeed='instant';});return{c,p,errors};
}
async function loaded(locator){await locator.evaluate(async img=>{img.loading='eager';await img.decode();});assert.ok(await locator.evaluate(img=>img.naturalWidth>=128&&img.naturalHeight>=128));}
const nav=(p,view)=>p.evaluate(view=>Museum.nav(view),view);
async function send(p,q){await p.locator('#chat-input').fill(q);await p.locator('#chat-form button[type=submit]').click();await p.waitForFunction(()=>document.getElementById('messages').getAttribute('aria-busy')!=='true');}
async function check(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS',name);}catch(e){results.push({name,passed:false,error:e.stack});console.error('FAIL',name,e.stack);}}
(async()=>{browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});try{
 for(const width of [360,390,430,1366,1920])await check(`photo layouts fit ${width}px; quiz photo matches question and enlarges`,async()=>{
  const f=await fixture(width);try{
   await nav(f.p,'quiz');const q=await f.p.evaluate(()=>MuseumLearning.quiz(Museum.A,Museum.state.lang)[0]);
   assert.equal(await f.p.locator('.quiz-object-photo').getAttribute('data-visual-record'),'artifact:'+q.id);
   assert.equal(await f.p.locator('.quiz-object-photo img').getAttribute('src'),await f.p.evaluate(id=>Museum.A.find(a=>a.id===id).image,q.id));
   await loaded(f.p.locator('.quiz-object-photo img'));await f.p.locator('.quiz-object-photo [data-visual-open]').click();
   await loaded(f.p.locator('#visual-viewer img'));assert.equal(await f.p.locator('#visual-viewer').getAttribute('data-record'),'artifact:'+q.id);
   await f.p.keyboard.press('Escape');assert.equal(await f.p.locator('#visual-viewer').isVisible(),false);assert.equal(await f.p.evaluate(()=>Museum.state.page),'quiz');
   for(const view of ['home','profile','plan','map','floors','guide','quiz']){
    await nav(f.p,view);if(view==='plan')await f.p.evaluate(()=>Museum.buildRoute());
    assert.deepEqual(await f.p.evaluate(()=>[...document.querySelectorAll('html,body,.page.active,.page.active .scroll')].filter(e=>e.clientWidth&&e.scrollWidth>e.clientWidth+2).map(e=>e.id||e.tagName)),[]);
   }
   assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('five quiz photographs retain correct answers, explanation, sources and review gallery',async()=>{
  const f=await fixture();try{await nav(f.p,'profile');await f.p.locator('[data-personal=start-quiz]').click();
   const questions=await f.p.evaluate(()=>MuseumLearning.quiz(Museum.A,Museum.state.lang));
   for(const q of questions){assert.equal(await f.p.locator('.quiz-object-photo').getAttribute('data-visual-record'),'artifact:'+q.id);await loaded(f.p.locator('.quiz-object-photo img'));await f.p.locator(`[data-quiz-choice="${q.answer}"]`).click();assert.equal(await f.p.locator('#quiz-feedback [data-artifact]').getAttribute('data-artifact'),q.id);await f.p.locator('[data-personal=next]').click();}
   assert.equal(await f.p.locator('.visual-quiz-review [data-artifact]').count(),5);assert.match(await f.p.locator('.quiz-complete>strong').innerText(),/5/);assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('missions, recent visits and route replacements keep exact photo identities',async()=>{
  const f=await fixture(1366);try{
   await nav(f.p,'profile');for(let mission=0;mission<3;mission++){await f.p.locator('#mission-select').selectOption(String(mission));const rows=await f.p.locator('.mission-record').evaluateAll(es=>es.map(e=>({id:e.dataset.artifact,src:e.querySelector('img').getAttribute('src')})));const records=await f.p.evaluate(()=>Museum.A.map(a=>({id:a.id,src:a.image})));assert.ok(rows.length>=3);for(const row of rows)assert.equal(row.src,records.find(a=>a.id===row.id).src);}
   const id=await f.p.locator('.mission-record').first().getAttribute('data-artifact');await f.p.locator('.mission-record').first().click();assert.equal(await f.p.evaluate(()=>Museum.state.artifact),id);
   await nav(f.p,'profile');assert.equal(await f.p.locator('.personal-timeline [data-artifact]').first().getAttribute('data-artifact'),id);await loaded(f.p.locator('.personal-timeline [data-artifact]').first().locator('img'));
   await nav(f.p,'plan');await f.p.evaluate(()=>Museum.buildRoute());
   const replacement=await f.p.evaluate(()=>Museum.D.find(d=>!Museum.state.route.ids.includes(d.id)&&d.id==='co-vat')?.id||Museum.D.find(d=>!Museum.state.route.ids.includes(d.id)).id);
   await f.p.locator('.route-editor summary').first().click();await f.p.locator('[data-route-replace]').first().selectOption(replacement);
   const expected=await f.p.evaluate(id=>{const v=MuseumVisuals.forTopic(id,true);return{key:v.kind+':'+v.id,image:v.image};},replacement);
   assert.equal(await f.p.locator('.route-picture').first().getAttribute('data-visual-record'),expected.key);assert.equal(await f.p.locator('.route-picture img').first().getAttribute('src'),expected.image);
   await loaded(f.p.locator('.route-picture img').first());assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('Mây welcome choice pins the photo, answer cards open records, story photos enlarge',async()=>{
  const f=await fixture();try{
   await nav(f.p,'guide');await f.p.locator('[data-visual-question=ma-nao]').click();await f.p.waitForFunction(()=>document.getElementById('messages').getAttribute('aria-busy')!=='true');
   assert.equal(await f.p.evaluate(()=>Museum.state.chatArtifact),'ma-nao');assert.equal(await f.p.locator('#guide-welcome-gallery').count(),0);
   await send(f.p,'Cái này bao nhiêu tuổi?');const card=f.p.locator('.verified-source-cards').last().locator('[data-artifact=ma-nao]');await loaded(card.locator('img'));await card.click();assert.equal(await f.p.evaluate(()=>Museum.state.artifact),'ma-nao');
   await f.p.locator('[data-story-current]').click();await loaded(f.p.locator('.story-photo img'));assert.ok(await f.p.locator('.story-related-grid [data-artifact]').count()>0);
   await f.p.locator('.story-photo [data-visual-open]').click();assert.equal(await f.p.locator('#visual-viewer').isVisible(),true);await f.p.locator('[data-open-image-record]').click();assert.equal(await f.p.locator('dialog[open]').count(),0);assert.equal(await f.p.evaluate(()=>Museum.state.artifact),'ma-nao');assert.deepEqual(f.errors,[]);
  }finally{await f.c.close();}
 });
 await check('an unavailable photograph shows a labelled state without substituting another object',async()=>{
  const f=await fixture();try{await f.p.route('**/assets/museum/71e343040f8e3f2e.webp',r=>r.abort());await nav(f.p,'quiz');await f.p.locator('.quiz-object-photo .visual-unavailable:not([hidden])').waitFor();assert.match(await f.p.locator('.quiz-object-photo .visual-unavailable').innerText(),/Ảnh chưa tải được/);assert.equal(await f.p.locator('.quiz-object-photo img').getAttribute('src'),'assets/museum/71e343040f8e3f2e.webp');assert.deepEqual(f.errors,[]);}finally{await f.c.close();}
 });
}finally{await browser.close();}console.log(`${results.filter(r=>r.passed).length}/${results.length} photo checks passed`);await fs.writeFile(process.env.MUSEUM_VISUAL_REPORT||'/tmp/museum-71-visual-results.json',JSON.stringify({base:BASE,scope:'Chromium desktop and mobile emulation; real records and real image decoding',results},null,2));if(results.some(r=>!r.passed))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
