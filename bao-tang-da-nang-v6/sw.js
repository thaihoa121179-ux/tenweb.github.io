/* Scope chỉ V6. Bộ nhớ ảnh có giới hạn; API và dữ liệu riêng tư không được cache. */
const VERSION='museum-v7-20261118-photos-2',SHELL=VERSION+'-shell',IMAGES='museum-v7-visited-images';
const scope=new URL('./',self.location.href);
const core=['./','index.html','bootstrap-7.1.0.js','app-foundation-7.1.0.js','app-core-7.1.0.js','app-runtime-7.1.0.js','app-styles-7.1.0.css','ai-robot.webp','data/museum-content.json.gz','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','qr-generator.js','qr-decoder.js','qr-print/index.html','qr-print/print.js','qr-print/print.css','admin/index.html','admin/admin.js','admin/admin.css'];
for(const weight of [400,500,600,700])for(const subset of ['vietnamese','latin'])core.push(`fonts/be-vietnam-pro-${subset}-${weight}-normal.woff2`);
if(!('DecompressionStream'in self))core.push('data/museum-content.json');
self.addEventListener('install',event=>event.waitUntil(caches.open(SHELL).then(cache=>cache.addAll(core.map(path=>new URL(path,scope).href))).then(()=>self.skipWaiting())));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const images=await caches.open(IMAGES);
 for(const key of await caches.keys())if(key.startsWith('museum-v7-')&&![SHELL,IMAGES].includes(key)){
  // Giữ ảnh đã xem khi nâng từ 7.0; chỉ đổi giao diện, không xóa tiến độ hoặc tự tải lại trang.
  if(key.endsWith('-images')){const old=await caches.open(key);for(const request of (await old.keys()).slice(-60)){const response=await old.match(request);if(response)await images.put(request,response);}}
  await caches.delete(key);
 }
 const keys=await images.keys();for(const key of keys.slice(0,Math.max(0,keys.length-60)))await images.delete(key);
 await self.clients.claim();
})()));
async function networkFirst(request){const cache=await caches.open(SHELL),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4000);try{const response=await fetch(request,{signal:controller.signal});if(response.ok){const u=new URL(request.url);u.search='';await cache.put(u.href,response.clone());}return response;}catch{const cached=await cache.match(request,{ignoreSearch:true});if(cached)return cached;if(new URL(request.url).pathname.endsWith('/data/museum-content.json')){const compressed=await cache.match(new URL('data/museum-content.json.gz',scope).href,{ignoreSearch:true});if(compressed&&'DecompressionStream'in self)return new Response(compressed.body.pipeThrough(new DecompressionStream('gzip')),{headers:{'Content-Type':'application/json'}});}
if(request.mode==='navigate')return await cache.match(new URL('index.html',scope).href);return Response.error();}finally{clearTimeout(timer);}}
self.addEventListener('fetch',event=>{
 const r=event.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==scope.origin||!u.pathname.startsWith(scope.pathname)||r.headers.has('Authorization')||/\/api\//.test(u.pathname))return;
 if(r.mode==='navigate'||u.pathname.endsWith('.json')||u.pathname.endsWith('.json.gz')){event.respondWith(networkFirst(r));return;}
 if(r.destination==='image'&&!u.pathname.endsWith('/ai-robot.webp')&&!u.pathname.includes('/icons/')){
  event.respondWith((async()=>{const cache=await caches.open(IMAGES),cached=await cache.match(r,{ignoreSearch:true});if(cached)return cached;const response=await fetch(r);if(response.ok&&response.type!=='opaque'){await cache.put(r,response.clone());const keys=await cache.keys();for(const key of keys.slice(0,Math.max(0,keys.length-60)))await cache.delete(key);}return response;})());return;
 }
 event.respondWith((async()=>{const cache=await caches.open(SHELL),cached=await cache.match(r,{ignoreSearch:true});return cached||fetch(r);})());
});
