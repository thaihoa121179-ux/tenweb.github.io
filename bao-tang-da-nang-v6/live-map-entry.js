/* JS/CSS bản đồ chỉ tải khi mở. Có timeout/thử lại; không xin quyền cảm biến tự động. */
(()=>{
 let pending,styleReady=false;
 const timeout=()=>MuseumConfig.assetTimeoutMs||10000;
 function style(){
  if(styleReady)return Promise.resolve();
  return new Promise((resolve,reject)=>{const link=document.createElement('link');link.rel='stylesheet';link.href='map-styles-'+MuseumAssetVersion+'.css';link.dataset.liveMapStyle='';
   let settled=false;const timer=setTimeout(fail,timeout());function fail(){if(settled)return;settled=true;clearTimeout(timer);link.remove();reject(Error('map_css'));}
   link.onerror=fail;link.onload=()=>{if(settled)return;settled=true;clearTimeout(timer);styleReady=true;resolve();};document.head.appendChild(link);
  });
 }
 function script(){
  if(window.MuseumLiveMap)return Promise.resolve();
  return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='app-map-'+MuseumAssetVersion+'.js';const timer=setTimeout(fail,timeout());function fail(){clearTimeout(timer);s.remove();reject(Error('map_js'));}s.onerror=fail;s.onload=()=>{clearTimeout(timer);window.MuseumLiveMap?resolve():reject(Error('map_init'));};document.body.appendChild(s);});
 }
 function open(){
  if(Museum.state.page!=='map')return;
  if(window.MuseumLiveMap&&styleReady){MuseumLiveMap.enter();return;}
  if(pending)return;
  pending=Promise.all([style(),script()]);
  pending.then(()=>{if(Museum.state.page==='map')MuseumLiveMap.enter();}).catch(()=>{
   pending=null;if(Museum.state.page!=='map')return;
   Museum.toast(Museum.human('Chưa mở được bản đồ. Bấm để thử lại.','Could not open the map. Tap to retry.','지도를 열지 못했습니다. 다시 시도하세요.','地图未能打开，请重试。'));
   let b=document.getElementById('map-retry-load');if(!b){b=document.createElement('button');b.id='map-retry-load';b.className='primary';b.onclick=()=>{b.remove();open();};document.getElementById('page-map').prepend(b);}b.textContent=Museum.human('Thử lại bản đồ','Retry map','지도 다시 열기','重试地图');
  });
 }
 window.MuseumMapOpenTarget=target=>{window.MuseumPresentationRequested=false;window.MuseumPendingMapTarget=target;Museum.nav('map');};
 document.addEventListener('museum:navigate',open);open();
})();
