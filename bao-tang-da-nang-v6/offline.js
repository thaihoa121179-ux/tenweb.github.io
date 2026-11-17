/* PWA: chỉ cache ứng dụng/tư liệu công khai; không cache hội thoại hoặc ảnh tải lên. */
(() => {
 'use strict';const M=Museum,T=key=>MuseumLexicon.t(key);let prompt=null,registration=null;
 const banner=document.createElement('div');banner.className='offline-banner';banner.setAttribute('role','status');document.querySelector('.app').prepend(banner);
 function sync(){banner.hidden=navigator.onLine;banner.textContent=T('offline');}
 window.addEventListener('online',sync);window.addEventListener('offline',sync);document.addEventListener('museum:language',sync);sync();
 const actions=document.createElement('div');actions.className='pwa-actions';actions.innerHTML='<button type="button" class="secondary" id="pwa-install"></button><button type="button" class="secondary" id="pwa-update" hidden></button><label class="analytics-option"><input type="checkbox" id="analytics-optin"><span id="analytics-label"></span></label><a class="secondary" href="qr-print/" target="_blank" rel="noopener">QR · A4 ↗</a><a class="secondary" href="admin/" target="_blank" rel="noopener">Dashboard demo ↗</a>';
 function mount(){const host=document.querySelector('#page-profile .personal-settings');if(host&&!actions.isConnected)host.appendChild(actions);document.getElementById('pwa-install').textContent=T('install');document.getElementById('pwa-update').textContent=T('update');document.getElementById('analytics-label').textContent=T('analytics');document.getElementById('analytics-optin').checked=M.sv('museum_analytics_optin')==='yes';}
 actions.addEventListener('change',e=>{if(e.target.id==='analytics-optin')M.persist('museum_analytics_optin',e.target.checked?'yes':'no');});
 document.addEventListener('museum:navigate',mount);document.addEventListener('museum:language',mount);mount();
 new MutationObserver(()=>{if(!actions.isConnected)mount();}).observe(document.getElementById('page-profile'),{childList:true});
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();prompt=e;});
 document.getElementById('pwa-install').onclick=async()=>{if(prompt){await prompt.prompt();prompt=null;}else M.toast(T('iosInstall'));};
 const update=document.getElementById('pwa-update');let requested=false;
 update.onclick=()=>{if(registration?.waiting){requested=true;registration.waiting.postMessage({type:'SKIP_WAITING'});}};
 if('serviceWorker'in navigator&&window.isSecureContext&&(!['localhost','127.0.0.1'].includes(location.hostname)||new URLSearchParams(location.search).has('pwa'))){
  const register=()=>navigator.serviceWorker.register('sw.js',{scope:'./'}).then(r=>{registration=r;update.hidden=!r.waiting;r.addEventListener('updatefound',()=>{const worker=r.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)update.hidden=false;});});}).catch(()=>M.toast(M.human('Chưa cài được bộ nhớ offline. Bạn vẫn dùng được web khi có mạng.','Offline storage is unavailable. The online app still works.','오프라인 저장을 사용할 수 없습니다. 온라인 앱은 이용할 수 있어요.','暂时无法启用离线缓存，联网时仍可使用。')));
  if(document.readyState==='complete'){if('requestIdleCallback'in window)requestIdleCallback(register,{timeout:3000});else setTimeout(register,0);}else window.addEventListener('load',register,{once:true});
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(requested)location.reload();});
 }
 window.MuseumOffline={getRegistration:()=>registration};
})();
