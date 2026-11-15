/* Actual data/UI integration; player requests are aborted, not playback proof. */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));let players=0;
  await page.route('https://www.youtube-nocookie.com/**',route=>{players++;return route.abort();});
  await page.addInitScript(()=>localStorage.setItem('museum_v6:museum_reveal_speed','instant'));
  await page.goto(process.env.MUSEUM_TEST_URL||'http://127.0.0.1:8000/bao-tang-da-nang-v6/');
  await page.locator('[data-lang="vi"]').click();await page.locator('#language-start').click();
  assert.equal(await page.evaluate(()=>Museum.A.length),200);
  assert.equal(await page.evaluate(()=>Museum.A.filter(a=>MuseumVideos.items(a).length).length),4);
  await page.evaluate(()=>Museum.nav('guide'));
  await page.locator('#chat-input').fill('hiện vật nào có video');await page.locator('#chat-form button[type=submit]').click();
  await page.waitForFunction(()=>document.querySelector('#messages').getAttribute('aria-busy')!=='true');
  assert.match(await page.locator('.assistant-row .bubble').last().innerText(),/Phát video/);
  await page.locator('.chat-record-cards [data-artifact="phu-dieu"]').last().click();
  assert.match(await page.locator('#artifact-videos').innerText(),/Tư liệu liên quan/);
  assert.equal(await page.locator('iframe').count(),0);assert.equal(players,0);
  assert.ok((await page.locator('#artifact-videos a.source').getAttribute('href')).startsWith('https://baotangdanang.vn/'));
  await page.locator('#artifact-videos button').click();
  assert.match(await page.locator('.museum-video-overlay iframe').getAttribute('src'),/youtube-nocookie\.com\/embed\/iJkoA0EPDLo/);
  await page.keyboard.press('Escape');assert.equal(await page.locator('.museum-video-overlay').count(),0);
  await page.evaluate(()=>Museum.openArticle('van-hoa-quang'));
  assert.match(await page.locator('#article-videos').innerText(),/bài chòi/i);
  await page.locator('#article-videos button').click();
  assert.match(await page.locator('.museum-video-overlay iframe').getAttribute('src'),/F3kKGgNnIr0/);
  await page.evaluate(()=>Museum.nav('catalog'));assert.equal(await page.locator('.museum-video-overlay').count(),0);
  await page.locator('#library-media').selectOption('yes');assert.equal(await page.locator('.library-card').count(),4);
  assert.deepEqual(errors,[]);
  console.log('PASS actual 200-record video discovery, 4 thematic mappings, provenance, on-demand player, topic video and navigation cleanup. External player requests aborted; playback not tested.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
