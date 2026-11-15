/* Real phone-sized UI, keyboard-resize simulation and local conversation integration.
 * Software-keyboard geometry is simulated; this does not claim a physical Safari test. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const {chromium}=require('playwright');
const BASE=process.env.MUSEUM_TEST_URL||'http://127.0.0.1:8000/bao-tang-da-nang-v6/';
const reports=[];
let browser;
async function fixture(width=390,height=844){
 const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,reducedMotion:'reduce',locale:'en-US'});
 await context.addInitScript(()=>localStorage.setItem('museum_v6:museum_reveal_speed','instant'));
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(BASE);await page.locator('[data-lang=vi]').click();await page.locator('#language-start').click();await page.evaluate(()=>document.fonts.ready);
 return {page,context,errors};
}
async function send(page,text){await page.locator('#chat-input').fill(text);await page.locator('#chat-form button[type=submit]').click();await page.waitForFunction(()=>document.querySelector('#messages').getAttribute('aria-busy')!=='true');return page.locator('.assistant-row .bubble').last().innerText();}
async function overflow(page){return page.evaluate(()=>[...document.querySelectorAll('html,body,.page.active,.page.active>.scroll')].filter(e=>e.clientWidth&&e.scrollWidth>e.clientWidth+2).map(e=>e.id||e.tagName));}
async function test(name,work){try{await work();reports.push({name,passed:true});console.log('PASS '+name)}catch(e){reports.push({name,passed:false,error:e.stack});console.error('FAIL '+name+'\n'+e.stack)}}
(async()=>{
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const [width,height]of[[320,568],[360,740],[375,812],[390,844],[430,932],[768,1024],[844,390]])await test(`mobile layout ${width}×${height}`,async()=>{
   const f=await fixture(width,height);try{
    for(const route of ['home','catalog','guide','scan','profile']){await f.page.evaluate(route=>Museum.nav(route),route);assert.deepEqual(await overflow(f.page),[],route);const nav=await f.page.locator('.nav').boundingBox();assert.ok(nav.y+nav.height<=height+2,'Bottom navigation stays in the visual viewport');}
    await f.page.evaluate(()=>Museum.nav('guide'));
    assert.match(await f.page.locator('.assistant-row .bubble').first().innerText(),/Mây đây/,'First language selection localizes the greeting');
    const form=await f.page.locator('#chat-form').boundingBox(),log=await f.page.locator('#messages').boundingBox();assert.ok(form.y+form.height<=height-45,'Composer remains above navigation');assert.ok(log.height>=70,'Chat retains usable space');
    const font=await f.page.locator('#chat-input').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));assert.ok(font>=16,'Input avoids automatic iOS zoom');
    await f.page.locator('[data-chat-topic=life]').click();assert.match(await f.page.locator('#guide-chips').innerText(),/hơi mệt/);assert.equal(await f.page.evaluate(()=>document.activeElement.dataset.chatTopic),'life','Topic selection preserves keyboard focus');
    await f.page.locator('[data-chat-topic=playful]').click();assert.match(await f.page.locator('#guide-chips').innerText(),/mèo/);
    assert.deepEqual(f.errors,[]);
   }finally{await f.context.close()}
  });
  await test('keyboard resize keeps the composer and latest conversation visible',async()=>{
   const f=await fixture();try{await f.page.evaluate(()=>Museum.nav('guide'));await send(f.page,'Hôm nay tôi hơi mệt');await f.page.locator('#chat-input').focus();await f.page.setViewportSize({width:390,height:500});await f.page.waitForFunction(()=>document.body.classList.contains('keyboard-open'));
    const form=await f.page.locator('#chat-form').boundingBox(),log=await f.page.locator('#messages').boundingBox();assert.ok(form.y>=0&&form.y+form.height<=501);assert.ok(log.height>=140);assert.equal(await f.page.locator('.nav').isVisible(),false);
    await f.page.setViewportSize({width:390,height:844});await f.page.waitForFunction(()=>!document.body.classList.contains('keyboard-open'));assert.equal(await f.page.locator('.nav').isVisible(),true);assert.deepEqual(f.errors,[]);
   }finally{await f.context.close()}
  });
  await test('life, humor, imagination and museum facts can share one conversation',async()=>{
   const f=await fixture();try{await f.page.evaluate(()=>Museum.nav('guide'));
    assert.match(await send(f.page,'hôm nay tôi buồn quá haha'),/nặng lòng|kể/);assert.equal(await f.page.locator('.assistant-badge').last().innerText(),'💛');
    const joke=await send(f.page,'Kể chuyện hài đi');assert.match(joke,/😄/);assert.notEqual(await send(f.page,'kể tiếp'),joke);
    assert.match(await send(f.page,'Nếu mèo làm giám đốc?'),/bát ăn|mèo/);assert.match(await f.page.locator('.assistant-source').last().innerText(),/Tưởng tượng vui/);assert.equal(await f.page.locator('.assistant-row').last().locator('.assistant-source a').count(),0);
    assert.match(await send(f.page,'Tối nay ăn gì?'),/gợi ý/);await send(f.page,'tôi ăn chay');const food=await send(f.page,'Món nào nấu nhanh?');assert.match(food,/đậu hũ|nấm/);assert.doesNotMatch(food,/trứng|thịt/);
    assert.match(await send(f.page,'Súng thần công làm bằng gì?'),/Kim loại/);assert.equal(await f.page.locator('.assistant-row').last().locator('.assistant-source a').count(),1);
    assert.equal(await f.page.evaluate(()=>Museum.A.length),200);assert.deepEqual(await overflow(f.page),[]);assert.deepEqual(f.errors,[]);
   }finally{await f.context.close()}
  });
  await test('local small talk does not claim or call an AI provider',async()=>{
   const f=await fixture();try{let calls=0;let sent;await f.page.route('https://example.org/companion',r=>{calls++;sent=r.request().postDataJSON();return r.fulfill({status:500,body:'unavailable'})});await f.page.evaluate(()=>{Museum.persist('museum_ai_endpoint','https://example.org/companion');Museum.nav('guide')});
    assert.match(await send(f.page,'Tôi đang ôn thi'),/25 phút/);assert.match(await send(f.page,'tôi chỉ có 10 phút'),/10 phút/);assert.equal(calls,0);assert.match(await f.page.locator('#guide-status').innerText(),/Chế độ trợ lý dữ liệu/);await send(f.page,'Súng thần công làm bằng gì?');assert.equal(calls,1);assert.deepEqual(sent.history,[],'Everyday conversation is excluded from later museum API history');assert.deepEqual(f.errors,[]);
   }finally{await f.context.close()}
  });
  await test('larger text, four languages, all carousel slides and desktop layout stay usable',async()=>{
   const f=await fixture();try{
    for(const [language,label]of[['en','Everyday life'],['ko','일상'],['zh','聊日常'],['vi','Chuyện thường ngày']]){
     await f.page.locator('#lang-switch').click();await f.page.locator(`[data-lang=${language}]`).click();await f.page.locator('#language-start').click();await f.page.evaluate(()=>Museum.nav('guide'));assert.equal(await f.page.locator('[data-chat-topic=life]').innerText(),label);assert.deepEqual(await overflow(f.page),[]);
     await f.page.evaluate(()=>Museum.nav('home'));for(let i=0;i<5;i++){await f.page.locator(`[data-slide="${i}"]`).click();assert.deepEqual(await overflow(f.page),[])}
    }
    await f.page.evaluate(()=>document.documentElement.classList.add('v6-large-text'));await f.page.evaluate(()=>Museum.nav('guide'));assert.deepEqual(await overflow(f.page),[]);
    await f.page.setViewportSize({width:1366,height:900});await f.page.waitForFunction(()=>!document.documentElement.style.getPropertyValue('--app-height'));assert.deepEqual(await overflow(f.page),[]);
    const topics=await f.page.locator('#chat-topics').boundingBox(),messages=await f.page.locator('#messages').boundingBox();assert.ok(topics.y+topics.height<=messages.y+2,'Desktop topic controls do not overlap messages');assert.deepEqual(f.errors,[]);
   }finally{await f.context.close()}
  });
  if(process.env.SCREENSHOT_DIR){await fs.mkdir(process.env.SCREENSHOT_DIR,{recursive:true});const f=await fixture();try{await f.page.screenshot({path:process.env.SCREENSHOT_DIR+'/home-390.png'});await f.page.evaluate(()=>Museum.nav('catalog'));await f.page.locator('.library-card img').first().evaluate(i=>i.decode());await f.page.screenshot({path:process.env.SCREENSHOT_DIR+'/catalog-390.png'});await f.page.evaluate(()=>Museum.nav('guide'));await send(f.page,'Nếu mèo làm giám đốc?');await f.page.screenshot({path:process.env.SCREENSHOT_DIR+'/chat-390.png'});}finally{await f.context.close()}}
 }finally{await browser.close()}
 console.log(`${reports.filter(r=>r.passed).length}/${reports.length} mobile/conversation groups passed`);if(process.env.MUSEUM_TEST_REPORT)await fs.writeFile(process.env.MUSEUM_TEST_REPORT,JSON.stringify({base:BASE,scope:'Chromium device emulation and simulated viewport resizing; not a physical device test',reports},null,2));if(reports.some(r=>!r.passed))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
