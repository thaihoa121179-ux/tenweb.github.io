/* Scope chỉ V6. Bộ nhớ ảnh có giới hạn; API và dữ liệu riêng tư không được cache. */
const RELEASE='7.8.0',VERSION='museum-v7-20261120-story-1',SHELL=VERSION+'-shell',IMAGES='museum-v7-visited-images';
const scope=new URL('./',self.location.href);
importScripts('./audio-range.js');
const core=['./','index.html','bootstrap-7.8.0.js','app-foundation-7.8.0.js','app-core-7.8.0.js','app-runtime-7.8.0.js','app-styles-7.8.0.css','app-map-7.8.0.js','map-styles-7.8.0.css','data/maps/floor-1.json','data/maps/floor-2.json','data/maps/floor-3.json','data/events.json','./data/demo-tour.json','./assets/collection/f7a8246b22e5.webp','./assets/museum/01c059cf4c93559a.webp','./assets/museum/8e6e15dab0e30205.webp','ai-robot.webp','data/museum-content.json.gz','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','qr-generator.js','qr-decoder.js','./qr-print/','qr-print/index.html','qr-print/print.js','qr-print/print.css','./admin/','admin/index.html','admin/admin.js','admin/admin.css'];
for(const weight of [400,500,600,700])for(const subset of ['vietnamese','latin'])core.push(`fonts/be-vietnam-pro-${subset}-${weight}-normal.woff2`);
// Ảnh của sáu thẻ chủ đề dùng trong tuyến 9 điểm; hai thẻ dùng chung ảnh tổng quan.
core.push('./assets/museum/9e429f41d55d0b6b.webp','./assets/museum/ee28a2e281a89226.webp','./assets/museum/dbab919206d7f999.jpg','./assets/museum/52b295ca02e559fb.webp','./assets/museum/d64286f3dbe189cc.jpg');
core.push(
 './audio-range.js','./data/demo-narrations.json','./assets/journey-story-frame.png',
 './share/','./share/index.html','./share/README.md','./then-now.js','./then-now.css',
 ...['home','artifact-share','chat','scan','visit-events'].map(name=>`./docs/ui-cleanup-7.5/${name}.png`),
);

async function cacheDemoImages(cache){
 const contentURL=new URL('./data/museum-content.json',scope);
 const pairsURL=new URL('./data/then-now.json',scope);
 const [content,pairs]=await Promise.all([contentURL,pairsURL].map(url=>fetch(url,{cache:'reload'})));
 if(!content.ok||!pairs.ok)throw Error('demo_data');
 const {artifacts,mediaMap}=await content.clone().json();
 const comparisons=Object.values(await pairs.clone().json());
 const photos=artifacts.map(record=>record.image);
 const exhibits=Object.values(mediaMap);
 const illustrations=comparisons.flatMap(({before,after})=>[before,after]);
 if(photos.length!==200||new Set(photos).size!==200||[...photos,...exhibits].some(path=>!/^assets\/(museum|collection|reference)\/[a-z0-9.-]+\.(webp|png|jpe?g)$/i.test(path)))throw Error('demo_photo_paths');
 if(illustrations.length!==6||illustrations.some(path=>!/^\.\/assets\/then-now\/[a-z0-9-]+\.webp$/.test(path)))throw Error('demo_comparison_paths');
 await Promise.all([cache.put(contentURL.href,content),cache.put(pairsURL.href,pairs)]);
 const assets=[...new Set([...illustrations,...photos,...exhibits])];
 for(let i=0;i<assets.length;i+=12){
  await cache.addAll(assets.slice(i,i+12).map(path=>new URL(path,scope).href));
 }
}
async function installDemo(){
 const url=new URL('./audio/manifest.json',scope),response=await fetch(url,{cache:'reload'});if(!response.ok)throw Error('audio_manifest');
 const manifest=await response.clone().json();if(manifest.schemaVersion!==1||!Array.isArray(manifest.files)||manifest.files.length<1||manifest.files.length>100||manifest.files.some(f=>!/^\.\/audio\/[a-z0-9-]+\.mp3$/.test(f.path)))throw Error('audio_manifest_schema');
 const cache=await caches.open(SHELL);await cache.addAll(core.map(path=>new URL(path,scope).href));await cache.put(url.href,response);await cache.addAll(manifest.files.map(f=>new URL(f.path,scope).href));await cacheDemoImages(cache);await self.skipWaiting();
}
self.addEventListener('install',event=>event.waitUntil(installDemo()));
self.addEventListener('message',event=>{
 if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
 if(event.data?.type==='DEMO_CACHE_STATUS')event.source?.postMessage({type:'DEMO_CACHE_READY',release:RELEASE});
});
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
async function networkFirst(request,cacheMode='default'){const cache=await caches.open(SHELL),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4000);try{const response=await fetch(request,{signal:controller.signal,cache:cacheMode});if(response.ok){const u=new URL(request.url);u.search='';await cache.put(u.href,response.clone());}return response;}catch{const cached=await cache.match(request,{ignoreSearch:true});if(cached)return cached;if(new URL(request.url).pathname.endsWith('/data/museum-content.json')){const compressed=await cache.match(new URL('data/museum-content.json.gz',scope).href,{ignoreSearch:true});if(compressed&&'DecompressionStream'in self)return new Response(compressed.body.pipeThrough(new DecompressionStream('gzip')),{headers:{'Content-Type':'application/json'}});}
if(request.mode==='navigate')return await cache.match(new URL('index.html',scope).href);return Response.error();}finally{clearTimeout(timer);}}
self.addEventListener('fetch',event=>{
 const r=event.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==scope.origin||!u.pathname.startsWith(scope.pathname)||r.headers.has('Authorization')||/\/api\//.test(u.pathname))return;
 if(u.pathname.startsWith(new URL('./audio/',scope).pathname)&&u.pathname.endsWith('.mp3')){
  event.respondWith((async()=>{const cache=await caches.open(SHELL);let response=await cache.match(r,{ignoreSearch:true});
   if(!response){const headers=new Headers(r.headers);headers.delete('Range');response=await fetch(new Request(r,{headers}));if(response.ok&&response.status===200&&response.headers.get('Content-Type')?.startsWith('audio/')){const key=new URL(u);key.search='';await cache.put(key.href,response.clone());}}
   return MuseumAudioRange.respond(r,response);
  })());return;
 }
 if(u.pathname.startsWith(new URL('./assets/then-now/',scope).pathname)){event.respondWith(networkFirst(r,'no-cache'));return;}
 if(r.mode==='navigate'||u.pathname.endsWith('.json')||u.pathname.endsWith('.json.gz')){event.respondWith(networkFirst(r));return;}
 if(r.destination==='image'&&!u.pathname.endsWith('/ai-robot.webp')&&!u.pathname.includes('/icons/')){
  event.respondWith((async()=>{const shell=await caches.open(SHELL),coreImage=await shell.match(r,{ignoreSearch:true});if(coreImage)return coreImage;const cache=await caches.open(IMAGES),cached=await cache.match(r,{ignoreSearch:true});if(cached)return cached;const response=await fetch(r);if(response.ok&&response.type!=='opaque'){await cache.put(r,response.clone());const keys=await cache.keys();for(const key of keys.slice(0,Math.max(0,keys.length-60)))await cache.delete(key);}return response;})());return;
 }
 event.respondWith((async()=>{const cache=await caches.open(SHELL),cached=await cache.match(r,{ignoreSearch:true});return cached||fetch(r);})());
});
