/* Run against a local static server. No credentials or live AI services are used.
 * node bao-tang-da-nang-v6/tests/browser.cjs
 * Optional: MUSEUM_TEST_URL, CHROMIUM_PATH, SCREENSHOT_DIR, MUSEUM_EXPECTED_RECORDS.
 * The default acceptance target is 200 actual source records, never synthetic padding.
 */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const BASE = process.env.MUSEUM_TEST_URL || 'http://127.0.0.1:8000/bao-tang-da-nang-v6/';
const origin = new URL(BASE).origin;
const EXPECTED_RECORDS = Number(process.env.MUSEUM_EXPECTED_RECORDS || 200);
assert.ok(Number.isInteger(EXPECTED_RECORDS) && EXPECTED_RECORDS > 0);
const results = [];
let browser;

async function fixture(options = {}) {
  const context = await browser.newContext({ viewport: {width:390,height:844}, locale:'vi-VN', reducedMotion:'reduce', ...options });
  if(options.reducedMotion!=='no-preference')await context.addInitScript(()=>localStorage.setItem('museum_v6:museum_reveal_speed','instant'));
  // Image checks use actual cached assets. No external-photo fixture substitutes.
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
    await page.locator('#visitor-name').fill('Bạn kiểm thử');
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
          assert.deepEqual(f.errors,[]);assert.deepEqual(f.external,[],'Navigation and the paginated catalog load only local assets');
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
    await test('paginated thumbnails match source records and detail photos have a working failure fallback',async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'catalog');
        const photos=f.page.locator('#catalog-list .library-thumbnail img');
        const pageSize=await f.page.evaluate(()=>MuseumLibrary.PAGE_SIZE);
        const current=await f.page.locator('#catalog-list [data-artifact]').evaluateAll(cards=>cards.map(card=>({id:card.dataset.artifact,url:card.querySelector('img')?.src})));
        assert.equal(current.length,Math.min(pageSize,await f.page.evaluate(()=>Museum.A.length)));
        const expected=await f.page.evaluate(ids=>ids.map(id=>{const a=Museum.A.find(record=>record.id===id);return new URL(window.MuseumMediaMap?.[a.image]||a.image,document.baseURI).href}),current.map(record=>record.id));
        assert.deepEqual(current.map(record=>record.url),expected);
        await photos.evaluateAll(images=>Promise.all(images.map(image=>{image.loading='eager';return image.decode()})));
        assert.ok(await photos.first().evaluate(image=>image.naturalWidth>0));
        await f.page.locator('#catalog-input').fill('sung than cong');
        await f.page.locator('#catalog-list [data-artifact="sung-than-cong"]').click();
        assert.match(await f.page.locator('#artifact-photo .photo-credit').innerText(),/Bảo tàng Đà Nẵng/);
        assert.ok(await f.page.locator('#artifact-photo img').getAttribute('src'));
        await f.page.evaluate(()=>Museum.openArticle('co-vat'));
        assert.match(await f.page.locator('#article-photo img').getAttribute('src'),/^assets\/museum\//);
        // Only this failure case replaces a local URL with a guaranteed missing local resource.
        await f.page.evaluate(()=>{Museum.A.find(a=>a.id==='ghe-bau').image='assets/collection/intentionally-missing-test-image.webp';Museum.openArtifact('ghe-bau')});
        await f.page.locator('#artifact-photo .photo-retry:not([hidden])').waitFor({state:'visible'});
        assert.match(await f.page.locator('#artifact-photo').innerText(),/không tải được/);
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
    await test(`actual collection has ${EXPECTED_RECORDS} source records and every cached photograph decodes`,async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'catalog');
        const data=await f.page.evaluate(()=>({total:Museum.A.length,reported:MuseumCollection.totalCount,items:MuseumCollection.items,all:Museum.A}));
        assert.equal(data.total,EXPECTED_RECORDS,'Expected actual production records; synthetic capacity fixtures do not count');
        assert.equal(data.total,data.reported);
        assert.equal(new Set(data.all.map(a=>a.id)).size,data.total,'Each artifact ID is unique');
        assert.equal(new Set(data.all.map(a=>a.url)).size,data.total,'Each artifact has a unique source page');
        assert.equal(new Set(data.items.map(a=>a.sourceImageSha256)).size,data.items.length,'Imported source photographs are not duplicates');
        for(const a of data.items){
          assert.ok(a.name&&a.era&&a.material&&a.origin,`Complete source metadata: ${a.id}`);
          assert.match(a.image,/^assets\/(?:collection|reference)\/.*\.webp$/);
          assert.match(a.url,/^https:\/\//);
          assert.ok(a.sourceImageSha256,`Source image hash: ${a.id}`);
          assert.equal(a.locationVerified,false);
          if(a.referenceOnly){assert.ok(a.institutionId&&a.institutionName,`Reference museum identity: ${a.id}`);assert.notEqual(a.sourceSite,'site1');assert.notEqual(a.sourceSite,'site2');}
          else assert.match(a.url,/^https:\/\/baotangdanang\.vn\/(bao-tang-da-nang|bao-tang-da-nang-co-so-2)\/hien-vat\//);
        }
        assert.equal(await f.page.locator('#catalog-list [data-artifact]').count(),Math.min(24,data.total),'Only one catalog page is in the DOM');
        // Decode every actual record, independent of the current catalog page.
        // Four workers bound decode concurrency rather than starting 200 loads at once.
        const decoded=await f.page.evaluate(async()=>{
          const queue=Museum.A.map(a=>({id:a.id,url:new URL(window.MuseumMediaMap?.[a.image]||a.image,document.baseURI).href}));
          const results=new Array(queue.length);let next=0;
          await Promise.all(Array.from({length:4},async()=>{
            while(next<queue.length){const index=next++,record=queue[index],image=new Image();
              try{image.decoding='async';image.src=record.url;await image.decode();results[index]={...record,width:image.naturalWidth,height:image.naturalHeight};}
              catch(error){results[index]={...record,error:error.message};}
              finally{image.removeAttribute('src');}
            }
          }));
          return results;
        });
        assert.equal(decoded.length,data.total);
        for(const image of decoded){assert.equal(new URL(image.url).origin,origin,`Local image: ${image.id}`);assert.match(new URL(image.url).pathname,/\/assets\//);assert.ok(!image.error&&image.width>=128&&image.height>=128,`${image.id}: ${JSON.stringify(image)}`);}
        await nav(f.page,'home');assert.match(await f.page.locator('[data-v6=catalogSub]').innerText(),new RegExp(String(data.total)));
        assert.deepEqual(f.external,[],'All production photographs decode without external image requests');assert.deepEqual(f.errors,[]);
        console.log(`  Decoded all ${decoded.length} actual cached source photographs (4 concurrent loads).`);
      }finally{await f.context.close();}
    });
    await test('source filters, pagination, full provenance and new deep links work',async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'catalog');
        await f.page.locator('#library-institution').selectOption('site2');
        const expected=await f.page.evaluate(()=>Museum.A.filter(a=>(a.institutionId||a.sourceSite||'site1')==='site2').length);
        assert.equal(await f.page.locator('#catalog-list [data-artifact]').count(),Math.min(24,expected));
        assert.match(await f.page.locator('#catalog-count').innerText(),new RegExp('^'+expected+' '));
        const found=[];
        while(true){found.push(...await f.page.locator('#catalog-list [data-artifact]').evaluateAll(cards=>cards.map(card=>card.dataset.artifact)));if(await f.page.locator('[data-library-page=next]').isDisabled())break;await f.page.locator('[data-library-page=next]').click();}
        assert.equal(found.length,expected);assert.equal(new Set(found).size,expected,'Pagination has no duplicates or missing site records');
        const item=await f.page.evaluate(()=>MuseumCollection.items.find(a=>a.sourceSite==='site2'&&a.dimensions));assert.ok(item,'Use a real site-2 record with dimensions');
        await f.page.locator('#catalog-input').fill(item.name);
        await f.page.locator(`#catalog-list [data-artifact="${item.id}"]`).click();
        assert.equal(await f.page.locator('#artifact-title').innerText(),item.name);
        assert.ok((await f.page.locator('#artifact-full-data').innerText()).includes(item.origin));
        assert.ok((await f.page.locator('#artifact-full-data').innerText()).includes(item.sourceSiteLabel));
        assert.ok((await f.page.locator('#artifact-meta').innerText()).includes(item.material));
        assert.ok((await f.page.locator('#artifact-meta').innerText()).includes(item.dimensions));
        assert.equal(await f.page.locator('#artifact-map').isDisabled(),true);
        await nav(f.page,'guide');await send(f.page,item.name);
        assert.ok((await send(f.page,'Nó làm bằng gì?')).includes(item.material));
        const where=await send(f.page,'Nó ở tầng nào?');assert.match(where,/chưa nêu tầng|chưa.*(?:vị trí|tọa độ|tầng)/i);assert.doesNotMatch(where,/Tầng [123]/);
        await f.page.goto(BASE+'?artifact='+item.id+'&lang=vi');await f.page.waitForFunction(()=>!!window.Museum);
        assert.equal(await f.page.locator('#artifact-title').innerText(),item.name);
        await f.page.locator('#lang-switch').click();await f.page.locator('[data-lang=en]').click();await f.page.locator('#language-start').click();
        assert.match(await f.page.locator('#artifact-full-data').innerText(),/Original source in Vietnamese/);assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('catalog controls stay usable in four languages and match actual material/video metadata',async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'catalog');
        const counts=await f.page.evaluate(()=>({paper:Museum.A.filter(a=>Museum.norm(a.material)==='giay').length,video:Museum.A.filter(a=>MuseumVideos.items(a).length>0).length,total:Museum.A.length}));
        for(const [lang,label] of [['vi','Bảo tàng / cơ sở'],['en','Museum / site'],['ko','박물관 / 분관'],['zh','博物馆 / 馆址']]){
          await f.page.locator('#lang-switch').click();await f.page.locator(`[data-lang="${lang}"]`).click();await f.page.locator('#language-start').click();
          assert.equal(await f.page.evaluate(()=>Museum.state.page),'catalog');
          assert.equal(await f.page.locator('[data-library-label=institution]').innerText(),label);
          await f.page.locator('#library-material').selectOption('giay');
          assert.match(await f.page.locator('#catalog-count').innerText(),new RegExp('^'+counts.paper+' '));
          await f.page.locator('#library-material').selectOption('all');await f.page.locator('#library-media').selectOption('yes');
          assert.match(await f.page.locator('#catalog-count').innerText(),new RegExp('^'+counts.video+' '));
          assert.equal(await f.page.locator('#catalog-list [data-artifact]').count(),Math.min(24,counts.video));
          if(!counts.video)assert.equal(await f.page.locator('.library-empty').count(),1,'No pretend videos are listed');
          await f.page.locator('#library-media').selectOption('all');await noOverflow(f.page,lang+' catalog');
          const controls=await f.page.locator('.library-filters select,.library-pagination button').evaluateAll(elements=>elements.map(el=>el.getBoundingClientRect().height));assert.ok(controls.every(height=>height>=43.5));
        }
        assert.deepEqual(f.errors,[]);
      }finally{await f.context.close();}
    });
    await test('external museum references disclose their source and never acquire a Da Nang floor through chat',async()=>{
      const f=await fixture();try{await open(f.page);await nav(f.page,'catalog');
        const item=await f.page.evaluate(()=>Museum.A.find(a=>a.referenceOnly));assert.ok(item,'The expanded production collection includes explicit external references');
        const institution=item.institutionId||item.sourceSite;await f.page.locator('#library-institution').selectOption(institution);
        const expected=await f.page.evaluate(id=>Museum.A.filter(a=>(a.institutionId||a.sourceSite)===id).length,institution);
        assert.match(await f.page.locator('#catalog-count').innerText(),new RegExp('^'+expected+' '));
        assert.equal(await f.page.locator('.library-external-tag').count(),Math.min(24,expected));
        await f.page.locator('#catalog-input').fill(item.name);await f.page.locator(`#catalog-list [data-artifact="${item.id}"]`).click();
        assert.equal(await f.page.locator('#artifact-title').innerText(),item.name);assert.ok((await f.page.locator('#artifact-full-data').innerText()).includes(item.institutionName));
        assert.equal(await f.page.locator('#artifact-source').getAttribute('href'),item.url);
        assert.equal(await f.page.locator('#artifact-map').isDisabled(),true);
        assert.doesNotMatch(await f.page.locator('#artifact-meta').innerText(),/Tầng [123]/);
        await nav(f.page,'guide');const intro=await send(f.page,item.name);assert.ok(intro.includes(item.name));assert.ok(intro.includes(item.institutionName),'Named references disclose their source institution in chat');
        const place=await send(f.page,'Hiện vật này ở tầng nào của Bảo tàng Đà Nẵng?');
        assert.doesNotMatch(place,/Tầng [123]|tầng [123] của Bảo tàng Đà Nẵng/);
        assert.match(place,/tham khảo|bảo tàng khác|chưa.*(?:tầng|vị trí)|không.*(?:tầng|vị trí)/i);
        const followActions=await f.page.locator('.assistant-row').last().evaluate(row=>{const actions=[];for(let el=row.nextElementSibling;el;el=el.nextElementSibling)actions.push(...[...el.querySelectorAll('[data-reply-action]')].map(button=>button.dataset.replyAction));return actions});
        assert.ok(followActions.every(action=>!action.startsWith('map')&&!action.startsWith('article:')),'A reference-location reply must not link to an invented Da Nang location');
        assert.deepEqual(f.errors,[]);
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
