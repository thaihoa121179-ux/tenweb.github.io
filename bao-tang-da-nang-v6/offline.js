/* PWA: chỉ cache ứng dụng/tư liệu công khai; không cache hội thoại hoặc ảnh tải lên. */
(() => {
 'use strict';const M=Museum,T=key=>MuseumLexicon.t(key);let prompt=null,registration=null;
 const banner=document.createElement('div');banner.className='offline-banner';banner.setAttribute('role','status');document.querySelector('.app').prepend(banner);
 function sync(){banner.hidden=navigator.onLine;banner.textContent=T('offline');}
 window.addEventListener('online',sync);window.addEventListener('offline',sync);document.addEventListener('museum:language',sync);sync();
 const state=document.createElement('p');state.id='pwa-offline-state';state.className='note';state.setAttribute('role','status');
 let offlineStatus='';
 function renderStatus(){
  state.textContent={
   pending:M.human('Đang lưu bản demo ngoại tuyến…','Saving the offline demo…','오프라인 데모를 저장하고 있어요…','正在保存离线演示……'),
   ready:M.human('Đã sẵn sàng trình diễn ngoại tuyến.','Ready for an offline demo.','오프라인 데모 준비 완료.','可以离线演示。'),
   failed:M.human('Chưa lưu được bản demo ngoại tuyến.','The offline demo could not be saved.','오프라인 데모를 저장하지 못했습니다.','未能保存离线演示。'),
  }[offlineStatus]||'';
 }
 const actions=document.createElement('div');actions.className='pwa-actions';actions.innerHTML='<button type="button" class="secondary" id="pwa-install"></button><button type="button" class="secondary" id="pwa-update" hidden></button><label class="analytics-option"><input type="checkbox" id="analytics-optin"><span id="analytics-label"></span></label><a class="secondary" href="qr-print/">QR · A4 ›</a><a class="secondary" href="admin/">Dashboard demo ›</a>';
 actions.appendChild(state);
 function mount(){renderStatus();const host=document.querySelector('#page-profile .personal-settings');if(host&&!actions.isConnected)host.appendChild(actions);document.getElementById('pwa-install').textContent=T('install');document.getElementById('pwa-update').textContent=T('update');document.getElementById('analytics-label').textContent=T('analytics');document.getElementById('analytics-optin').checked=M.sv('museum_analytics_optin')==='yes';}
 actions.addEventListener('change',e=>{if(e.target.id==='analytics-optin')M.persist('museum_analytics_optin',e.target.checked?'yes':'no');});
 document.addEventListener('museum:navigate',mount);document.addEventListener('museum:language',mount);mount();
 new MutationObserver(()=>{if(!actions.isConnected)mount();}).observe(document.getElementById('page-profile'),{childList:true});
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();prompt=e;});
 document.getElementById('pwa-install').onclick=async()=>{if(prompt){await prompt.prompt();prompt=null;}else M.toast(T('iosInstall'));};
 const update=document.getElementById('pwa-update');let requested=false;
 update.onclick=()=>{if(registration?.waiting){requested=true;registration.waiting.postMessage({type:'SKIP_WAITING'});}};
 if('serviceWorker'in navigator&&window.isSecureContext&&(!['localhost','127.0.0.1'].includes(location.hostname)||new URLSearchParams(location.search).has('pwa'))){
  const setStatus=value=>{offlineStatus=value;renderStatus();};
  const askStatus=()=>navigator.serviceWorker.controller?.postMessage({type:'DEMO_CACHE_STATUS'});
  navigator.serviceWorker.addEventListener('message',event=>{
   if(event.source===navigator.serviceWorker.controller&&event.data?.type==='DEMO_CACHE_READY'&&event.data.release===window.MuseumAssetVersion)setStatus('ready');
  });
  const register=async()=>{
   setStatus('pending');
   try{
    registration=await navigator.serviceWorker.register('./sw.js',{scope:'./'});
    update.hidden=!registration.waiting;
    function watch(){
     const worker=registration.installing;
     worker?.addEventListener('statechange',()=>{
      if(worker.state==='installed'&&navigator.serviceWorker.controller)update.hidden=false;
      if(worker.state==='redundant'&&offlineStatus!=='ready')setStatus('failed');
     });
    }
    watch();
    registration.addEventListener('updatefound',watch);
    askStatus();
   }catch{setStatus('failed');}
  };
  // Không tranh mạng với màn chọn ngôn ngữ. Bắt đầu lưu offline sau khi khách
  // vào ứng dụng; người quay lại đã xác nhận vẫn được cập nhật bình thường.
  let scheduled=false;
  const maybeRegister=()=>{if(scheduled||!M.state.confirmed)return;scheduled=true;
   const idle=()=>{if('requestIdleCallback'in window)requestIdleCallback(register,{timeout:3000});else setTimeout(register,0);};
   if(document.readyState==='complete')idle();else window.addEventListener('load',idle,{once:true});
  };
  document.addEventListener('museum:language',maybeRegister);document.addEventListener('museum:ready',maybeRegister);maybeRegister();
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(requested)location.reload();else askStatus();});
 }
 window.MuseumOffline={getRegistration:()=>registration};
})();
