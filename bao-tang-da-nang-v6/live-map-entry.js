/* Tải bộ bản đồ khi cần, không chặn trang chủ. Lỗi tải có thể thử lại. */
(()=>{
 let pending;
 function open(){
  if(Museum.state.page!=='map')return;
  if(window.MuseumLiveMap){MuseumLiveMap.enter();return;}
  if(pending)return;
  pending=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='app-map-'+window.MuseumAssetVersion+'.js';s.onload=resolve;s.onerror=()=>{s.remove();reject(Error('map_bundle'));};document.body.appendChild(s);});
  pending.then(()=>MuseumLiveMap.enter()).catch(()=>{
   pending=null;Museum.toast(Museum.human('Chưa mở được bản đồ. Bấm để thử lại.','Could not open the map. Tap to retry.','지도를 열지 못했습니다. 다시 시도하세요.','地图未能打开，请重试。'));
   let b=document.getElementById('map-retry-load');if(!b){b=document.createElement('button');b.id='map-retry-load';b.className='primary';b.onclick=()=>{b.remove();open();};document.getElementById('page-map').prepend(b);}b.textContent=Museum.human('Thử lại bản đồ','Retry map','지도 다시 열기','重试地图');
  });
 }
 window.MuseumMapOpenTarget=target=>{window.MuseumPendingMapTarget=target;Museum.nav('map');};
 document.addEventListener('museum:navigate',open);open();
})();
