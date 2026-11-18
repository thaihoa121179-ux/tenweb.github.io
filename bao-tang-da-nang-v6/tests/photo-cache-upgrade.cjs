/* Nâng cache thật từ bản 7.0: URL mới không bị worker cũ trả nhầm bundle cũ. */
'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),path=require('node:path'),fs=require('node:fs/promises');
const {execFileSync}=require('node:child_process'),{chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..'),PREFIX='/bao-tang-da-nang-v6/';
const oldRef=process.env.MUSEUM_PREVIOUS_REF||'b01a340';
const previous=Object.fromEntries(['index.html','bootstrap.js','sw.js'].map(file=>[file,execFileSync('git',['show',`${oldRef}:bao-tang-da-nang-v6/${file}`],{cwd:ROOT})]));
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.gz':'application/gzip','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.webmanifest':'application/manifest+json'};
let oldMode=true;
const server=http.createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(!pathname.startsWith(PREFIX)){res.writeHead(404).end();return;}
  let name=pathname.slice(PREFIX.length)||'index.html';if(name.endsWith('/'))name+='index.html';
  const file=path.resolve(ROOT,name);if(!file.startsWith(ROOT+path.sep)){res.writeHead(404).end();return;}
  const data=oldMode&&previous[name]?previous[name]:await fs.readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','Content-Length':data.length});res.end(data);
 }catch{res.writeHead(404).end();}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  const base=`http://127.0.0.1:${server.address().port}${PREFIX}`;
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
  const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'?pwa=1');await p.waitForFunction(()=>window.MuseumJourneyCard&&!document.getElementById('boot-status'));
  assert.equal(await p.evaluate(()=>typeof MuseumVisuals),'undefined');
  await p.locator('[data-lang=vi]').click();await p.locator('#visitor-name').fill('An');await p.locator('#language-start').click();
  await p.waitForFunction(()=>navigator.serviceWorker.controller!==null&&MuseumOffline.getRegistration()?.active);
  await p.evaluate(()=>Museum.openArtifact('ma-nao'));await p.locator('#artifact-photo img').evaluate(img=>{img.loading='eager';return img.decode();});
  const photo=await p.evaluate(()=>new URL(Museum.A.find(a=>a.id==='ma-nao').image,location.href).href);
  await p.waitForFunction(async photo=>{for(const key of await caches.keys())if(key.endsWith('-images')&&await(await caches.open(key)).match(photo))return true;return false;},photo);
  await p.evaluate(()=>{Museum.nav('profile');window.upgradeSentinel='page remains open';document.getElementById('personal-note').value='Bản nháp đang gõ — giữ lại';});
  oldMode=false;await p.evaluate(()=>MuseumOffline.getRegistration().update());
  await p.waitForFunction(async photo=>{const names=await caches.keys();return navigator.serviceWorker.controller?.state==='activated'&&!names.some(n=>n==='museum-v7-20261118-1-shell'||n==='museum-v7-20261118-1-images')&&names.includes('museum-v7-visited-images')&&names.some(n=>n==='museum-v7-20261118-map-stage1-shell')&&!!await(await caches.open('museum-v7-visited-images')).match(photo);},photo,{timeout:20000});
  // Worker mới nhận trang hiện tại nhưng không tự reload khi khách đang viết.
  assert.equal(await p.evaluate(()=>window.upgradeSentinel),'page remains open');assert.equal(await p.locator('#personal-note').inputValue(),'Bản nháp đang gõ — giữ lại');
  await p.reload();await p.waitForFunction(()=>window.MuseumVisuals&&window.MuseumJourneyCard&&!document.getElementById('boot-status'));
  assert.equal(await p.locator('#lang-overlay').isVisible(),false);assert.ok(await p.evaluate(()=>MuseumProfile.getData().visits.some(v=>v.key==='artifact:ma-nao')));
  await p.evaluate(()=>Museum.nav('quiz'));await p.locator('.quiz-object-photo img').evaluate(img=>{img.loading='eager';return img.decode();});
  await c.setOffline(true);await p.reload();await p.waitForFunction(()=>window.MuseumVisuals&&window.MuseumJourneyCard&&!document.getElementById('boot-status'));
  assert.equal(await p.evaluate(()=>Museum.A.length),200);await p.evaluate(()=>Museum.openArtifact('ma-nao'));await p.locator('#artifact-photo img').evaluate(img=>{img.loading='eager';return img.decode();});
  await p.evaluate(()=>Museum.nav('quiz'));await p.locator('.quiz-object-photo img').evaluate(img=>{img.loading='eager';return img.decode();});
  assert.ok(await p.locator('.quiz-object-photo img').evaluate(img=>img.naturalWidth>128));assert.deepEqual(errors,[]);
  console.log('PASS actual 7.0 worker → current assets; no forced reload; visits, cached photo and offline photo quiz preserved');await c.close();
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
