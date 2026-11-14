/* Run against a local static server. No credentials or live AI services are used.
 * node bao-tang-da-nang-v6/tests/browser.cjs
 * Optional: MUSEUM_TEST_URL, CHROMIUM_PATH, SCREENSHOT_DIR.
 */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const BASE = process.env.MUSEUM_TEST_URL || 'http://127.0.0.1:8000/bao-tang-da-nang-v6/';
const origin = new URL(BASE).origin;
const results = [];
let browser;

async function fixture(options = {}) {
  const context = await browser.newContext({ viewport: {width:390,height:844}, locale:'vi-VN', reducedMotion:'reduce', ...options });
  // External photos are fixture responses in this suite: the cloud egress policy
  // blocks museum image hosts. A dedicated test checks failure fallback too.
  await context.route(/^https:\/\/(?:baotangdanang\.vn|dnfam-website\.vr360\.com\.vn)\/uploads\//, route=>route.fulfill({status:200,contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64')}));
  const page = await context.newPage();
  const errors = [], external = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => {if (!r.url().startsWith(origin) && /^https?:/.test(r.url())) external.push(r.url());});
  return { context, page, errors, external };
}
async function open(page, query = '', lang = 'vi') {
  const response = await page.goto(BASE + query);
  assert.equal(response.status(), 200);
  await page.waitForFunction(() => !!window.Museum && !!window.MuseumProfile);
  if (await page.locator('#lang-overlay:not(.hidden)').count()) {
    await page.locator(`[data-lang="${lang}"]`).click();
    await page.locator('#language-start').click();
  }
  await page.locator('#lang-overlay').waitFor({state:'hidden'});
  await page.evaluate(() => document.fonts.ready);
}
async function nav(page, name) {
  await page.locator(`.nav [data-go="${name}"]`).click();
  assert.equal(await page.evaluate(() => Museum.state.page), name);
  await page.locator(`#page-${name}.active`).waitFor({state:'visible'});
}
async function send(page, text) {
  await page.locator('#chat-input').fill(text);
  await page.locator('#chat-form button[type=submit]').click();
  await page.waitForFunction(() => document.querySelector('#messages').getAttribute('aria-busy') !== 'true');
  return page.locator('.assistant-row .bubble').last().innerText();
}
async function noOverflow(page, detail = '') {
  const bad = await page.evaluate(() => [...document.querySelectorAll('html,body,.page.active,.page.active .scroll')]
    .filter(e => e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 2)
    .map(e => `${e.tagName}#${e.id}.${e.className}: ${e.scrollWidth}>${e.clientWidth}`));
  assert.deepEqual(bad, [], detail);
}
async function test(name, work) {
  try { await work(); results.push({name,passed:true}); console.log(`PASS ${name}`); }
  catch (e) { results.push({name,passed:false,error:e.stack}); console.error(`FAIL ${name}\n${e.stack}`); }
}

(async () => {
  browser = await chromium.launch({headless:true, executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
  try {
    for (const width of [375,390,768,1366]) {
      await test(`responsive navigation, local mascot and layout at ${width}px`, async () => {
        const f = await fixture({viewport:{width,height:900}});
        try {
          await open(f.page);
          const mascot = await f.page.locator('.hero-robot img').evaluate(i => ({loaded:i.complete&&i.naturalWidth>0,width:i.getBoundingClientRect().width}));
          assert.equal(mascot.loaded,true);assert.ok(mascot.width>=120);
          for (const name of ['home','catalog','guide','scan','profile']) {await nav(f.page,name);await noOverflow(f.page,`${width}px ${name}`);}
          for (const name of ['map','plan','quiz','info']) {
            await nav(f.page,'home');await f.page.locator(`.home-grid [data-go="${name}"]`).click();
            assert.equal(await f.page.evaluate(() => Museum.state.page),name);await noOverflow(f.page,`${width}px ${name}`);
          }
          await nav(f.page,'home');
          const buttons = await f.page.locator('.nav button,.home-grid button,#hero-plan').evaluateAll(es => es.map(e => ({text:e.innerText,rect:e.getBoundingClientRect().toJSON()})));
          assert.deepEqual(buttons.filter(x=>x.rect.height<43.5||x.rect.width<43.5),[],'Main controls have 44px touch targets');
          assert.deepEqual(f.errors,[]);assert.ok(f.external.every(u=>/^https:\/\/(baotangdanang\.vn|dnfam-website\.vr360\.com\.vn)\/uploads\//.test(u)),'Only original source image hosts may be requested');
          if(process.env.SCREENSHOT_DIR){await fs.mkdir(process.env.SCREENSHOT_DIR,{recursive:true});await f.page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,`home-${width}.png`),fullPage:true});}
        } finally {await f.context.close();}
      });
    }
    await test('4 languages retain navigation and conversational artifact context', async () => {
      const f=await fixture();try {
        await open(f.page);await nav(f.page,'guide');
        const cases=[['vi','Trang chủ','Súng thần công có từ khi nào?','Chất liệu là gì?','Kim loại'],['en','Home','Tell me about the cannon','What is it made of?','Metal'],['ko','홈','대포에 대해 알려줘','재질은 무엇인가요?','금속'],['zh','首页','介绍古炮','它的材质是什么？','金属']];
        let prior=0;
        for(const [lang,home,question,follow,material] of cases){
          await f.page.locator('#lang-switch').click();await f.page.locator(`[data-lang="${lang}"]`).click();await f.page.locator('#language-start').click();
          assert.equal(await f.page.locator('html').getAttribute('lang'),lang);
          assert.equal(await f.page.locator('.nav [data-go=home]').innerText(),home);
          assert.equal(await f.page.evaluate(()=>Museum.state.page),'guide');
          const count=await f.page.locator('.assistant-row').count();assert.ok(count>=prior,'Changing language must preserve the conversation');
          await send(f.page,question);assert.match(await send(f.page,follow),new RegExp(material));
          prior=await f.page.locator('.assistant-row').count();await noOverflow(f.page,lang+' chat');
        }
        assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('search handles Vietnamese accents and a one-character typo', async()=>{
      const f=await fixture();try{await open(f.page);await f.page.locator('#home-search-btn').click();
        await f.page.locator('#search-input').fill('sung than congx');
        assert.equal(await f.page.locator('#search-artifacts [data-artifact="sung-than-cong"]').count(),1);
        await f.page.locator('#search-input').press('Enter');assert.equal(await f.page.locator('#artifact-title').innerText(),'Súng thần công');
        await nav(f.page,'catalog');await f.page.locator('#catalog-input').fill('mã não');assert.equal(await f.page.locator('#catalog-list [data-artifact="ma-nao"]').count(),1);
        await f.page.locator('#catalog-input').fill('qzxqzxqzx');assert.equal(await f.page.locator('#catalog-list [data-artifact]').count(),0);assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('all sample QR images actually decode to their V6 URLs',async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'scan');await f.page.locator('#scan-demo-btn').click();
        const decoded=await f.page.locator('#qr-codes .qr-sample').evaluateAll(async buttons=>{
          const result=[];for(const button of buttons){const image=button.querySelector('img');await image.decode();const canvas=document.createElement('canvas');canvas.width=800;canvas.height=800;const c=canvas.getContext('2d',{willReadFrequently:true});c.fillStyle='white';c.fillRect(0,0,800,800);c.drawImage(image,0,0,800,800);const pixels=c.getImageData(0,0,800,800);const output=window.jsQR(pixels.data,800,800,{inversionAttempts:'attemptBoth'});result.push({expected:button.dataset.demoCode,actual:output?.data});}return result;
        });assert.equal(decoded.length,8);for(const q of decoded)assert.equal(q.actual,q.expected);
        await f.page.locator('#qr-codes [data-demo-code$="?zone=dan-toc"]').click();assert.equal(await f.page.evaluate(()=>Museum.state.currentZone.via),'qr');assert.equal(await f.page.evaluate(()=>Museum.state.currentZone.topic),'dan-toc');
        await nav(f.page,'scan');await f.page.locator('#qr-manual').fill('DN-MUSEUM-TOPIC-co-vat');await f.page.locator('#qr-manual-go').click();assert.equal(await f.page.evaluate(()=>Museum.state.topic),'co-vat');assert.equal(await f.page.evaluate(()=>Museum.state.page),'article');
        assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('first-language confirmation respects artifact, topic, floor and zone deep links',async()=>{
      for(const [query,target,id] of [['?artifact=ghe-bau','artifact','ghe-bau'],['?topic=co-vat','article','co-vat'],['?floor=3','map',3],['?zone=dan-toc','map','dan-toc']]){
        const f=await fixture();try{await open(f.page,query);const m=await f.page.evaluate(()=>({page:Museum.state.page,artifact:Museum.state.artifact,topic:Museum.state.topic,zone:Museum.state.currentZone,floor:Museum.state.floor}));assert.equal(m.page,target);if(target==='artifact')assert.equal(m.artifact,id);if(target==='article')assert.equal(m.topic,id);if(query.startsWith('?floor'))assert.equal(m.floor,id);if(query.startsWith('?zone'))assert.equal(m.zone.topic,id);assert.deepEqual(f.errors,[]);}finally{await f.context.close();}
      }
    });
    await test('route time, interests, pace and visited progress persist',async()=>{
      const f=await fixture();try{await open(f.page);await f.page.locator('#hero-plan').click();await f.page.locator('[data-min="15"]').click();await f.page.locator('#plan-build').click();const short=await f.page.locator('.route-stop').count();
        await f.page.locator('[data-min="60"]').click();await f.page.locator('[data-interest="history"]').click();await f.page.locator('[data-interest="culture"]').click();await f.page.locator('#plan-build').click();const long=await f.page.locator('.route-stop').count();assert.ok(long>short);assert.deepEqual(await f.page.evaluate(()=>Museum.state.route.interests),['culture']);
        await f.page.locator('[data-pace="focused"]').click();await f.page.locator('#plan-build').click();assert.ok(await f.page.locator('.route-stop').count()<long);
        const done=await f.page.locator('[data-route-done]').first().getAttribute('data-route-done');await f.page.locator('[data-route-done]').first().click();assert.match(await f.page.locator('.route-stop.done').innerText(),/Đã ghé/);
        await f.page.reload();await f.page.waitForFunction(()=>!!window.MuseumProfile);await f.page.evaluate(()=>Museum.nav('plan'));assert.ok(await f.page.evaluate(id=>Museum.state.route.done.includes(id),done));assert.equal(await f.page.locator('.route-stop.done').count(),1);assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('quiz score, badges, journal save, download, share and reload',async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'catalog');await f.page.locator('#catalog-list [data-artifact="sac-phong"]').click();await nav(f.page,'profile');await f.page.locator('[data-personal="start-quiz"]').click();
        for(const answer of [0,1,2,1,3]){await f.page.locator(`[data-quiz-choice="${answer}"]`).click();assert.equal(await f.page.locator('.quiz-option.correct').count(),1);assert.match(await f.page.locator('#quiz-feedback .source').getAttribute('href'),/^https:\/\/(www\.)?baotangdanang\.vn\//);await f.page.locator('[data-personal="next"]').click();}
        assert.equal(await f.page.locator('.quiz-complete>strong').innerText(),'5/5');await nav(f.page,'profile');assert.equal(await f.page.locator('.personal-badge.earned').count(),2);
        const note='Hôm nay tôi khám phá Sắc phong năm 1840. 🏛️';await f.page.locator('#personal-note').fill(note);await f.page.locator('[data-personal="save"]').click();assert.match(await f.page.locator('#personal-save-state').innerText(),/Đã lưu/);
        const downloadPromise=f.page.waitForEvent('download');await f.page.locator('[data-personal="download"]').click();const download=await downloadPromise;const text=await fs.readFile(await download.path(),'utf8');assert.ok(text.includes(note));assert.ok(text.includes('Sắc phong'));assert.ok(text.includes('?artifact=sac-phong'));
        await f.page.evaluate(()=>{window.testShared=null;Object.defineProperty(navigator,'share',{configurable:true,value:async payload=>{window.testShared=payload}})});await f.page.locator('[data-personal="share"]').click();assert.ok((await f.page.evaluate(()=>window.testShared?.text)).includes(note));
        await f.page.reload();await f.page.waitForFunction(()=>!!window.MuseumProfile);await nav(f.page,'profile');assert.equal(await f.page.locator('#personal-note').inputValue(),note);assert.equal(await f.page.evaluate(()=>MuseumProfile.getData().best),5);assert.ok(await f.page.evaluate(()=>MuseumProfile.getData().visits.some(x=>x.key==='artifact:sac-phong')));assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('backend success is distinguished from outage and malformed responses',async()=>{
      const f=await fixture();try{await open(f.page);await f.page.locator('#top-info').click();await f.page.locator('.developer-config summary').click();await f.page.locator('#ai-endpoint').fill('https://museum-api.example/chat');await f.page.locator('#ai-endpoint-save').click();await nav(f.page,'guide');assert.match(await f.page.locator('#guide-status').innerText(),/Chế độ trợ lý dữ liệu/);
        let phase='success',requests=[];await f.page.route('https://museum-api.example/chat',async route=>{requests.push(route.request().postDataJSON());if(phase==='outage')return route.abort('failed');return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(phase==='data'?{answer:'Không đủ dữ liệu từ máy chủ.',mode:'data',sources:[]}:phase==='success'?{answer:'Câu trả lời từ máy chủ thử nghiệm.',mode:'generative',sources:['https://baotangdanang.vn/','javascript:alert(1)','https://attacker.invalid/']}:{answer:123,sources:[]})})});
        assert.equal(await send(f.page,'Tầng 2 có gì?'),'Câu trả lời từ máy chủ thử nghiệm.');assert.match(await f.page.locator('#guide-status').innerText(),/AI tạo sinh/);assert.equal(requests[0].language,'vi');assert.ok(requests[0].history.length<=8);assert.equal(await f.page.locator('.assistant-row').last().locator('.assistant-source a').getAttribute('href'),'https://baotangdanang.vn/');
        phase='data';assert.equal(await send(f.page,'Câu hỏi ngoài dữ liệu'),'Không đủ dữ liệu từ máy chủ.');assert.match(await f.page.locator('#guide-status').innerText(),/Chế độ trợ lý dữ liệu/);
        phase='outage';assert.match(await send(f.page,'Súng thần công có từ khi nào?'),/thế kỷ XIX/);assert.match(await f.page.locator('#guide-status').innerText(),/Chế độ trợ lý dữ liệu/);
        phase='invalid';assert.match(await send(f.page,'Chất liệu là gì?'),/Kim loại/);assert.match(await f.page.locator('#guide-status').innerText(),/Chế độ trợ lý dữ liệu/);assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('context stays scoped to artifacts, visitor information and Korean routes',async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'guide');
        await send(f.page,'Súng thần công có từ khi nào?');
        assert.match(await send(f.page,'Tháp Eiffel có niên đại nào?'),/chưa tìm được thông tin đáng tin cậy/);
        assert.match(await send(f.page,'What is this alien cube made of?'),/chưa tìm được thông tin đáng tin cậy/);
        assert.match(await send(f.page,'Nó làm bằng gì?'),/Kim loại/);
        assert.match(await send(f.page,'Bảo tàng ở đâu?'),/31 Trần Phú/);
        assert.match(await send(f.page,'When does the museum open?'),/08:00–17:00/);
        await f.page.locator('#lang-switch').click();await f.page.locator('[data-lang="ko"]').click();await f.page.locator('#language-start').click();
        assert.match(await send(f.page,'역사 30분 코스'),/도시 역사/);
        const shorter=await send(f.page,'15분은요?');assert.match(shorter,/15분/);assert.match(shorter,/도시 역사/);
        assert.equal(await f.page.evaluate(()=>Museum.guideContext.artifact),null);
        assert.match(await send(f.page,'박물관은 어디에 있나요?'),/31/);assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('blocked storage stays usable and accessibility settings persist',async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'profile');await f.page.locator('#personal-large').check();await f.page.locator('#personal-contrast').check();await f.page.reload();await f.page.waitForFunction(()=>!!window.MuseumProfile);assert.equal(await f.page.locator('html').evaluate(e=>e.classList.contains('v6-large-text')&&e.classList.contains('v6-high-contrast')),true);
        for(const name of ['profile','catalog','guide','home']){await nav(f.page,name);await noOverflow(f.page,'larger text '+name)}assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
      const blocked=await fixture();try{await blocked.context.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Blocked','SecurityError')};Storage.prototype.getItem=function(){throw new DOMException('Blocked','SecurityError')}});await open(blocked.page);await blocked.page.locator('#hero-plan').click();await blocked.page.locator('#plan-build').click();assert.match(await blocked.page.locator('#plan-result').innerText(),/Chỉ lưu trong phiên/);await nav(blocked.page,'profile');assert.match(await blocked.page.locator('.personal-storage-notice').innerText(),/phiên/);assert.deepEqual(blocked.errors,[]);}finally{await blocked.context.close();}
    });
    await test('unknown answers, dangerous QR and incorrect QR paths stay explicit',async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'guide');assert.match(await send(f.page,'Bảo tàng có viên ngọc của người ngoài hành tinh không?'),/chưa tìm được thông tin đáng tin cậy/);await nav(f.page,'scan');await f.page.locator('#qr-manual').fill('javascript:alert(1)');await f.page.locator('#qr-manual-go').click();assert.equal(await f.page.locator('#qr-result a').count(),0);assert.match(await f.page.locator('#qr-result').innerText(),/Không nhận ra/);assert.equal(await f.page.evaluate(()=>Museum.state.page),'scan');assert.deepEqual(f.errors,[]);}finally{await f.context.close();}
    });
    await test('the user screenshot questions work, with pictured recommendations and useful real actions',async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'guide');
        const intro=await send(f.page,'hiện vật nào đáng xem nhất');assert.match(intro,/Súng thần công/);assert.match(intro,/không phải bảng xếp hạng/);assert.equal(await f.page.locator('.chat-record-card').count(),3);
        assert.match(await send(f.page,'cái thứ hai'),/Trang sức mã não/);
        assert.match(await send(f.page,'nó làm bằng gì'),/Chất liệu: Mã não/);
        assert.match(await send(f.page,'tôi tới mà k muốn xem thì làm gì'),/quiz 5 câu/);
        await f.page.locator('[data-reply-action=quiz]').last().click();assert.equal(await f.page.evaluate(()=>Museum.state.page),'quiz');await nav(f.page,'guide');
        assert.match(await send(f.page,'tôi nhát đi bộ lắm có cách nào ko'),/ít điểm dừng/);
        const shorter=await send(f.page,'tôi chỉ có 10 phút');assert.match(shorter,/10 phút/);assert.doesNotMatch(shorter,/bao nhiêu phút/);
        await f.page.locator('[data-reply-action=plan]').last().click();assert.equal(await f.page.locator('[data-min="10"]').getAttribute('class'),'chip selected');
        await f.page.locator('#plan-build').click();const route=await f.page.evaluate(()=>Museum.state.route);assert.equal(route.time,10);assert.ok(route.ids.length<=2);assert.ok(route.sameFloor);assert.equal(await f.page.locator('[data-low-walking]').getAttribute('aria-pressed'),'true');
        assert.equal(await f.page.evaluate(()=>new Set(Museum.state.route.ids.map(id=>Museum.D.find(d=>d.id===id).floor)).size),1);
        assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('recommendation preferences support negation, comparison and all four languages',async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'guide');
        await send(f.page,'hiện vật nào đáng xem nhất');await send(f.page,'không thích lịch sử, thích văn hóa hơn');assert.equal(await f.page.evaluate(()=>Museum.guideContext.preferences.interest),'culture');assert.ok(await f.page.evaluate(()=>Museum.guideContext.preferences.excluded.includes('history')));
        assert.match(await send(f.page,'So sánh súng thần công và sắc phong'),/1840/);assert.match(await f.page.locator('.assistant-row .bubble').last().innerText(),/Kim loại/);
        for(const [lang,question,expected]of [['en','I don’t want to see exhibits',/quiz/],['ko','많이 걷고 싶지 않아요',/한 층/],['zh','有什么必看文物？',/推荐|官方排名/]]){await f.page.locator('#lang-switch').click();await f.page.locator(`[data-lang="${lang}"]`).click();await f.page.locator('#language-start').click();assert.match(await send(f.page,question),expected);await noOverflow(f.page,lang+' practical chat')}
        assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('artifact and gallery photos use their actual source URLs, with a working failure fallback',async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'catalog');
        const photos=f.page.locator('#catalog-list .photo-wrap img');assert.equal(await photos.count(),await f.page.evaluate(()=>Museum.A.length));
        const urls=await photos.evaluateAll(images=>images.map(i=>i.src));const expected=await f.page.evaluate(()=>Museum.A.map(a=>new URL(window.MuseumMediaMap?.[a.image]||a.image,document.baseURI).href));assert.deepEqual(urls,expected);
        await photos.evaluateAll(images=>Promise.all(images.map(i=>{i.loading='eager';return i.decode()})));assert.equal(await photos.first().evaluate(i=>i.naturalWidth>0),true);
        await f.page.locator('#catalog-list [data-artifact="sung-than-cong"]').click();assert.match(await f.page.locator('#artifact-photo .photo-credit').innerText(),/Bảo tàng Đà Nẵng/);assert.ok(await f.page.locator('#artifact-photo img').getAttribute('src'));
        await f.page.evaluate(()=>Museum.openArticle('co-vat'));assert.match(await f.page.locator('#article-photo img').getAttribute('src'),/^(assets\/museum\/|https:\/\/dnfam-website\.vr360\.com\.vn\/)/);
        await f.context.route('**/uploads/**',route=>route.abort());await f.page.evaluate(()=>{Museum.A.find(a=>a.id==='ghe-bau').image+='?failure-case';Museum.openArtifact('ghe-bau')});await f.page.locator('#artifact-photo .photo-retry:not([hidden])').waitFor({state:'visible'});assert.match(await f.page.locator('#artifact-photo').innerText(),/không tải được/);
        assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('text reveals progressively without zoom, can be shown immediately and preserves Unicode',async()=>{
      const f=await fixture({reducedMotion:'no-preference'});try{await open(f.page);await nav(f.page,'guide');
        await f.page.locator('#chat-input').fill('hiện vật nào đáng xem nhất');await f.page.locator('#chat-form button[type=submit]').click();
        const bubble=f.page.locator('.assistant-row .bubble').last();await f.page.waitForFunction(()=>!!document.querySelector('.is-revealing'));
        const first=await bubble.innerText();assert.ok(first.length<100);assert.equal(await f.page.locator('.assistant-row').last().evaluate(e=>getComputedStyle(e).animationName),'none');
        await f.page.waitForTimeout(130);const second=await bubble.innerText();assert.ok(second.length>first.length);assert.ok(second.length<500);assert.equal(await f.page.locator('#chat-form button[type=submit]').isDisabled(),true);
        await f.page.locator('.chat-reveal-all:visible').click();await f.page.waitForFunction(()=>document.querySelector('#messages').getAttribute('aria-busy')==='false');assert.match(await bubble.innerText(),/Súng thần công/);assert.equal(await f.page.locator('.chat-record-card').count(),3);
        const unicode=await f.page.evaluate(async()=>{const el=document.createElement('p');document.body.appendChild(el);const text='Mây 😊 a\u0306\u0301 · 한국어 · 中文';const control=MuseumChatText.reveal(el,text);control.finish();await control.finished;const output=el.textContent;el.remove();return output});assert.equal(unicode,'Mây 😊 a\u0306\u0301 · 한국어 · 中文');
        assert.equal(await f.page.locator('.assistant-row').last().locator('.sr-only').textContent(),await bubble.textContent());assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('typing respects a reader scrolling up and finishes safely when navigating away',async()=>{
      const f=await fixture({reducedMotion:'no-preference'});try{await open(f.page);await nav(f.page,'guide');
        // Populate real transcript entries without waiting for presentation effects.
        await f.page.evaluate(()=>{const log=document.querySelector('#messages');for(let i=0;i<15;i++){const p=document.createElement('p');p.className='bubble';p.textContent=('Một đoạn hội thoại trước đó. ').repeat(6);log.appendChild(p)}log.scrollTop=log.scrollHeight});
        await f.page.locator('#chat-input').fill('tôi nhát đi bộ lắm có cách nào ko');await f.page.locator('#chat-form button[type=submit]').click();await f.page.waitForFunction(()=>!!document.querySelector('.is-revealing'));
        await f.page.locator('#messages').evaluate(el=>{el.scrollTop=0;el.dispatchEvent(new Event('scroll'))});await f.page.waitForTimeout(160);assert.equal(await f.page.locator('#messages').evaluate(el=>el.scrollTop),0);
        await nav(f.page,'home');await f.page.waitForFunction(()=>document.querySelector('#messages').getAttribute('aria-busy')==='false');await nav(f.page,'guide');assert.match(await f.page.locator('.assistant-row .bubble').last().innerText(),/ít điểm dừng/);assert.equal(await f.page.locator('.is-revealing').count(),0);assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('chat can open app actions without claiming notes were already saved or spending provider calls',async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'guide');
        await f.page.evaluate(()=>Museum.persist('museum_ai_endpoint','https://museum-api.example/chat'));
        let calls=0;await f.page.route('https://museum-api.example/chat',route=>{calls++;return route.abort()});
        assert.match(await send(f.page,'bạn giúp được gì'),/sở thích/);
        assert.match(await send(f.page,'chơi quiz'),/quiz 5 câu/);await f.page.locator('[data-reply-action=quiz]').last().click();assert.equal(await f.page.evaluate(()=>Museum.state.page),'quiz');await nav(f.page,'guide');
        assert.match(await send(f.page,'mở nhật ký'),/chưa được tự lưu/);await f.page.locator('[data-reply-action=profile]').last().click();assert.equal(await f.page.evaluate(()=>Museum.state.page),'profile');assert.equal(calls,0);assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('expanded official catalogue has 50–100 unique complete records and every real photo decodes',async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'catalog');
        const data=await f.page.evaluate(()=>({total:Museum.A.length,reported:MuseumCollection.totalCount,items:MuseumCollection.items}));assert.ok(data.total>=50&&data.total<=100);assert.equal(data.total,data.reported);assert.equal(new Set(data.items.map(a=>a.url)).size,data.items.length);assert.equal(new Set(data.items.map(a=>a.sourceImageSha256)).size,data.items.length);
        for(const a of data.items){assert.ok(a.name&&a.era&&a.material&&a.origin);assert.match(a.image,/^assets\/collection\/.*\.webp$/);assert.match(a.url,/^https:\/\/baotangdanang\.vn\/(bao-tang-da-nang|bao-tang-da-nang-co-so-2)\/hien-vat\//);assert.equal(a.locationVerified,false)}
        const photos=await f.page.locator('#catalog-list img').evaluateAll(async images=>{for(const i of images){i.loading='eager';await i.decode()}return images.map(i=>({path:i.getAttribute('src'),w:i.naturalWidth,h:i.naturalHeight}))});assert.equal(photos.length,data.total);assert.ok(photos.every(i=>i.path.startsWith('assets/')&&i.w>=128&&i.h>=128));
        await nav(f.page,'home');assert.match(await f.page.locator('[data-v6=catalogSub]').innerText(),new RegExp(String(data.total)));assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('site filters, full provenance, source-language disclosure and new deep links work',async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'catalog');await f.page.locator('[data-catalog-site=site2]').click();const expected=await f.page.evaluate(()=>MuseumCollection.items.filter(a=>a.sourceSite==='site2').length);assert.equal(await f.page.locator('#catalog-list [data-artifact]').count(),expected);
        const item=await f.page.evaluate(()=>MuseumCollection.items.find(a=>a.sourceSite==='site2'&&a.dimensions));await f.page.locator(`#catalog-list [data-artifact="${item.id}"]`).click();assert.equal(await f.page.locator('#artifact-title').innerText(),item.name);assert.ok((await f.page.locator('#artifact-full-data').innerText()).includes(item.origin));assert.ok((await f.page.locator('#artifact-full-data').innerText()).includes(item.sourceSiteLabel));assert.ok((await f.page.locator('#artifact-meta').innerText()).includes(item.material));assert.ok((await f.page.locator('#artifact-meta').innerText()).includes(item.dimensions));assert.equal(await f.page.locator('#artifact-map').isDisabled(),true);
        await nav(f.page,'guide');await send(f.page,item.name);assert.match(await send(f.page,'Nó làm bằng gì?'),new RegExp(item.material.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));const where=await send(f.page,'Nó ở tầng nào?');assert.match(where,/chưa nêu tầng/);assert.doesNotMatch(where,/Tầng [123]/);
        await f.page.goto(BASE+'?artifact='+item.id+'&lang=vi');await f.page.waitForFunction(()=>!!window.Museum);assert.equal(await f.page.locator('#artifact-title').innerText(),item.name);await f.page.locator('#lang-switch').click();await f.page.locator('[data-lang=en]').click();await f.page.locator('#language-start').click();assert.match(await f.page.locator('#artifact-full-data').innerText(),/Original source in Vietnamese/);assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('reduced motion, manual carousel and keyboard language dialog',async()=>{
      const f=await fixture({reducedMotion:'reduce'});try{await open(f.page);assert.equal(await f.page.locator('#hero-pause').getAttribute('aria-pressed'),'false');assert.equal(await f.page.locator('.orbit').first().evaluate(e=>getComputedStyle(e).animationName),'none');
        const original=await f.page.locator('#hero-title').innerText();await f.page.locator('[data-slide="2"]').click();assert.notEqual(await f.page.locator('#hero-title').innerText(),original);await f.page.locator('#hero-pause').click();await f.page.locator('#hero-pause').click();assert.equal(await f.page.locator('#hero-pause').getAttribute('aria-pressed'),'false');
        await f.page.locator('#lang-switch').click();await f.page.locator('#language-start').focus();await f.page.keyboard.press('Tab');assert.equal(await f.page.locator('[data-lang="vi"]').evaluate(e=>e===document.activeElement),true);await f.page.keyboard.press('Escape');await f.page.locator('#lang-overlay').waitFor({state:'hidden'});assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
  } finally { await browser.close(); }
  const failed=results.filter(x=>!x.passed);console.log(`\n${results.length-failed.length}/${results.length} browser groups passed`);
  if(process.env.MUSEUM_TEST_REPORT)await fs.writeFile(process.env.MUSEUM_TEST_REPORT,JSON.stringify({url:BASE,results},null,2));
  if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
