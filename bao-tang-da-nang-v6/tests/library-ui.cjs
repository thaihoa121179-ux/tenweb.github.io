/* Catalog rendering checks against a static server. Synthetic 205-record data is
 * a capacity fixture only; it is never added to the production collection.
 * MUSEUM_TEST_URL=http://127.0.0.1:8000/bao-tang-da-nang-v6/ node .../tests/library-ui.cjs
 */
'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
const BASE=process.env.MUSEUM_TEST_URL||'http://127.0.0.1:8000/bao-tang-da-nang-v6/';
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try {
  const page=await browser.newPage({viewport:{width:390,height:900}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(BASE);await page.waitForFunction(()=>!!window.Museum);
  const records=await page.evaluate(()=>Museum.A);
  assert.ok(records.length>=57,'Use the current real sourced collection');
  const search=await page.evaluate(()=>({plain:Museum.artifactSearch('sung than cong').map(a=>a.id),typo:Museum.artifactSearch('sung than conh').map(a=>a.id)}));
  assert.ok(search.plain.includes('sung-than-cong'),'Existing accent-insensitive search works');
  assert.ok(search.typo.includes('sung-than-cong'),'Existing mild-typo search works');
  // A standalone document isolates component event handlers from the app router.
  await page.goto(new URL('../',BASE).href);
  await page.setContent('<div class="app"><main class="stage"><section class="page active" id="page-catalog"><h1>Collection</h1><div class="text-input"><input id="catalog-input" aria-label="Search"></div><p id="catalog-count"></p><div id="catalog-list" class="scroll"></div></section></main></div>');
  for(const filename of ['base.css','v6.css','library-ui.css'])await page.addStyleTag({path:path.join(root,filename)});
  await page.addScriptTag({path:path.join(root,'library-ui.js')});
  await page.evaluate(records=>{
   window.librarySource=records;window.openedRecords=[];
   window.libraryContext={A:records,state:{lang:'vi'},openArtifact:id=>openedRecords.push(id)};
   window.libraryController=MuseumLibrary.createController(libraryContext);
   libraryController.render(records,{allItems:records,query:''});
  },records);
  assert.equal(await page.locator('.library-card').count(),24,'Real collection renders only the first 24 records');
  const pageCount=Math.ceil(records.length/24);
  assert.equal((await page.evaluate(()=>libraryController.getState())).total,records.length);
  await page.locator('[data-library-page="next"]').click();
  assert.equal((await page.evaluate(()=>libraryController.getState())).page,2);
  await page.locator('[data-library-page="previous"]').click();
  assert.equal((await page.evaluate(()=>libraryController.getState())).page,1);
  await page.locator('#library-institution').selectOption('site2');
  const sourceCount=records.filter(a=>(a.sourceSite||'site1')==='site2').length;
  assert.equal((await page.evaluate(()=>libraryController.getState())).total,sourceCount,'Site filters use actual record membership');
  await page.locator('#library-institution').selectOption('all');
  const image=records.find(a=>a.image?.startsWith('assets/')).image;
  const fixtures=Array.from({length:205},(_,i)=>({id:`capacity-fixture-${i}`,name:`Mẫu kiểm thử ${i}`,en:`Test fixture ${i}`,summary:'Test only',era:'Fixture',material:i%2?'Giấy':'Gỗ',image:image+`?fixture=${i}`,institutionId:i<175?'danang-museum':'reference-museum',institutionName:i<175?'Bảo tàng Đà Nẵng':'Reference Museum',referenceOnly:i>=175,sourceLanguage:'vi',videos:i%50===0?[{url:'https://www.youtube.com/watch?v=dQw4w9WgXcQ',sourceUrl:'https://example.org/official-source',verifiedSource:true,relation:i%100===0?'object':'theme'}]:[]}));
  fixtures[1].videos=[{url:'https://youtube.com/watch?v=dQw4w9WgXcQ',sourceUrl:'https://example.org',verifiedSource:false,relation:'object'}];
  fixtures[2].videos=[{url:'javascript:alert(1)',sourceUrl:'https://example.org',verifiedSource:true,relation:'object'}];
  await page.evaluate(fixtures=>{window.capacityFixtures=fixtures;libraryContext.A=fixtures;libraryController.render(fixtures,{allItems:fixtures,query:''});},fixtures);
  assert.equal(await page.locator('.library-card').count(),24);
  assert.equal(await page.locator('.library-results img').count(),24,'No 205-image eager render');
  await page.locator('#library-material').selectOption('giay');
  assert.equal((await page.evaluate(()=>libraryController.getState())).total,102);
  await page.locator('#library-material').selectOption('all');
  await page.locator('#library-media').selectOption('yes');
  assert.equal((await page.evaluate(()=>libraryController.getState())).total,5,'Unverified and unsafe video URLs are excluded');
  assert.ok((await page.locator('.library-tags').allTextContents()).some(x=>x.includes('Video chủ đề liên quan')),'Thematic video is not called object-specific');
  await page.locator('#library-media').selectOption('all');
  await page.locator('#library-institution').selectOption('reference-museum');
  assert.equal((await page.evaluate(()=>libraryController.getState())).total,30);
  assert.equal(await page.locator('.library-external-tag').count(),24,'External references are explicitly labeled');
  await page.locator('#library-institution').selectOption('all');
  for(let i=0;i<8;i++)await page.locator('[data-library-page="next"]').click();
  assert.equal(await page.locator('.library-card').count(),13,'Last page contains only the remainder');
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.libraryPage),'previous','Focus remains on a usable pagination control');
  await page.locator('.library-card').first().click();
  assert.equal((await page.evaluate(()=>openedRecords)).length,1,'Each artifact action fires once');
  await page.locator('#catalog-input').focus();
  await page.evaluate(()=>libraryController.render(capacityFixtures.slice(0,1),{allItems:capacityFixtures,query:'new query'}));
  assert.equal(await page.evaluate(()=>document.activeElement.id),'catalog-input','Rendering does not steal search focus');
  assert.equal((await page.evaluate(()=>libraryController.getState())).page,1,'A changed query resets pagination');
  await page.evaluate(()=>libraryController.render([],{allItems:capacityFixtures,query:'no-match'}));
  assert.equal(await page.locator('.library-results img').count(),0);
  assert.equal(await page.locator('.library-empty').count(),1);
  await page.locator('[data-library-clear]').click();
  assert.equal((await page.evaluate(()=>libraryController.getState())).total,205);
  for(const lang of ['vi','en','ko','zh']){
   await page.evaluate(lang=>{libraryContext.state.lang=lang;libraryController.render(capacityFixtures,{allItems:capacityFixtures,query:''});},lang);
   assert.ok((await page.locator('[data-library-label="institution"]').textContent()).length>0);
   assert.equal(await page.locator('#catalog-count').getAttribute('aria-live'),'polite');
  }
  for(const width of [375,390,768,1366]){
   await page.setViewportSize({width,height:900});
   const overflow=await page.evaluate(()=>[document.documentElement,document.body,document.querySelector('#catalog-list'),document.querySelector('#catalog-sites')].filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>el.id||el.tagName));
   assert.deepEqual(overflow,[],`No overflow at ${width}px`);
   const small=await page.locator('.library-pagination button,.library-filters select').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().height<43.5).map(e=>e.outerHTML));assert.deepEqual(small,[]);
  }
  assert.deepEqual(errors,[]);
  console.log(`PASS library UI: real ${records.length} records (${pageCount} pages), 205-record capacity fixture, pagination, filters, video provenance, references, focus, 4 languages and 4 viewport widths`);
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
