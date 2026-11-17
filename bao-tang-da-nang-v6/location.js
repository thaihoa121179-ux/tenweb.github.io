/* Opt-in geographic location + absolute compass. Never projects GPS onto the
 * uncalibrated indoor illustration, saves coordinates, or sends them to Mây. */
(() => {
  'use strict';
  const M=window.Museum,E=window.MuseumLocationEngine,$=id=>document.getElementById(id);
  if(!M||!E)return;
  const words={
    vi:{title:'Vị trí & hướng nhìn',sub:'GPS và la bàn điện thoại',start:'Vị trí của tôi',recenter:'Về vị trí của tôi',heading:'Bật hướng nhìn',headingOff:'Tắt hướng nhìn',stop:'Dừng',off:'Bật GPS để thấy chấm vị trí của bạn.',waiting:'Đang tìm vị trí GPS…',tracking:'Đang cập nhật GPS',paused:'Đã dừng · vị trí cuối cùng',stale:'Vị trí cũ · đang chờ GPS cập nhật',denied:'Chưa có quyền vị trí. Bạn có thể bật lại trong cài đặt trình duyệt rồi thử lại.',unavailable:'Chưa nhận được GPS. Thử gần cửa sổ hoặc ngoài trời.',timeout:'GPS phản hồi chậm. Bạn có thể thử lại.',unsupported:'Trình duyệt này chưa hỗ trợ vị trí.',insecure:'GPS cần mở web bằng HTTPS.',error:'Chưa mở được GPS. Hãy thử lại.',sensorOff:'Bật hướng nhìn để tia xanh xoay theo điện thoại.',sensorWaiting:'Đang chờ la bàn… Cầm điện thoại gần nằm ngang.',sensorActive:'Hướng điện thoại',sensorDenied:'Chưa có quyền la bàn. Kiểm tra quyền chuyển động và hướng trong trình duyệt.',sensorUnsupported:'Thiết bị hoặc trình duyệt chưa hỗ trợ la bàn.',sensorUnavailable:'Chưa nhận được hướng Bắc. Thử trên điện thoại có la bàn, tránh vật kim loại.',sensorInsecure:'La bàn cần mở web bằng HTTPS.',sensorError:'Chưa mở được la bàn. Hãy thử lại.',accuracy:'Sai số khoảng',updated:'Cập nhật',ago:'giây trước',north:'B',map:'Bản đồ GPS, hướng Bắc ở phía trên',mapHint:'Chấm xanh là vị trí GPS. Tia xanh là hướng điện thoại.',note:'GPS trong nhà có thể lệch và không xác định tầng/phòng. Quét QR hoặc chọn tầng ở sơ đồ bên dưới.',tiles:'Chưa tải được nền bản đồ. Tọa độ và la bàn vẫn hiển thị.',intro:'Bản đồ chỉ tải khi bạn bật GPS. Vị trí không được lưu vào nhật ký.',indoor:'Sơ đồ chủ đề trong bảo tàng',compass:'La bàn điện thoại'},
    en:{title:'Location & facing direction',sub:'Phone GPS and compass',start:'My location',recenter:'Back to my location',heading:'Enable facing direction',headingOff:'Disable facing direction',stop:'Stop',off:'Enable GPS to see your location dot.',waiting:'Finding your GPS location…',tracking:'Updating GPS',paused:'Stopped · last known location',stale:'Old location · waiting for a GPS update',denied:'Location permission is unavailable. Enable it in browser settings and retry.',unavailable:'No GPS fix yet. Try near a window or outdoors.',timeout:'GPS took too long. You can retry.',unsupported:'This browser does not support geolocation.',insecure:'GPS requires HTTPS.',error:'Could not start GPS. Please retry.',sensorOff:'Enable facing direction to rotate the blue beam with your phone.',sensorWaiting:'Waiting for the compass… Hold your phone nearly flat.',sensorActive:'Phone direction',sensorDenied:'Compass permission is unavailable. Check browser motion and orientation permissions.',sensorUnsupported:'This device or browser does not support a compass.',sensorUnavailable:'No north-referenced heading yet. Try a phone with a compass, away from metal.',sensorInsecure:'The compass requires HTTPS.',sensorError:'Could not start the compass. Please retry.',accuracy:'Accuracy about',updated:'Updated',ago:'seconds ago',north:'N',map:'GPS map, north is at the top',mapHint:'The blue dot is GPS position. The beam is phone direction.',note:'Indoor GPS can drift and does not identify floors or rooms. Scan a QR or select a floor below.',tiles:'Map background unavailable. Coordinates and compass still work.',intro:'Map tiles load only after you enable GPS. Your location is not saved in the journal.',indoor:'Museum thematic diagram',compass:'Phone compass'},
    ko:{title:'위치와 바라보는 방향',sub:'휴대전화 GPS와 나침반',start:'내 위치',recenter:'내 위치로 이동',heading:'방향 표시 켜기',headingOff:'방향 표시 끄기',stop:'중지',off:'GPS를 켜면 내 위치가 표시됩니다.',waiting:'GPS 위치를 찾고 있어요…',tracking:'GPS 갱신 중',paused:'중지됨 · 마지막 위치',stale:'이전 위치 · GPS 갱신 대기',denied:'위치 권한이 없습니다. 브라우저 설정에서 허용하고 다시 시도하세요.',unavailable:'GPS를 받지 못했습니다. 창가나 야외에서 시도하세요.',timeout:'GPS 응답이 늦습니다. 다시 시도할 수 있어요.',unsupported:'이 브라우저는 위치를 지원하지 않습니다.',insecure:'GPS에는 HTTPS가 필요합니다.',error:'GPS를 시작하지 못했습니다.',sensorOff:'방향 표시를 켜면 휴대전화를 따라 파란 빔이 회전합니다.',sensorWaiting:'나침반 대기 중… 휴대전화를 거의 수평으로 잡으세요.',sensorActive:'휴대전화 방향',sensorDenied:'나침반 권한이 없습니다. 브라우저 동작 및 방향 권한을 확인하세요.',sensorUnsupported:'나침반을 지원하지 않습니다.',sensorUnavailable:'북쪽 기준 방향을 받지 못했습니다. 금속에서 떨어져 시도하세요.',sensorInsecure:'나침반에는 HTTPS가 필요합니다.',sensorError:'나침반을 시작하지 못했습니다.',accuracy:'오차 약',updated:'갱신',ago:'초 전',north:'북',map:'GPS 지도, 위쪽은 북쪽',mapHint:'파란 점은 GPS 위치, 빔은 휴대전화 방향입니다.',note:'실내 GPS는 부정확하며 층과 방을 구분하지 못합니다. 아래에서 QR을 스캔하거나 층을 선택하세요.',tiles:'지도 배경을 불러오지 못했습니다. 좌표와 나침반은 사용할 수 있어요.',intro:'GPS를 켜야 지도를 불러옵니다. 위치는 일지에 저장하지 않습니다.',indoor:'박물관 주제 안내도',compass:'휴대전화 나침반'},
    zh:{title:'位置与朝向',sub:'手机GPS与指南针',start:'我的位置',recenter:'回到我的位置',heading:'开启朝向',headingOff:'关闭朝向',stop:'停止',off:'开启GPS以显示你的位置蓝点。',waiting:'正在获取GPS位置……',tracking:'正在更新GPS',paused:'已停止 · 最后位置',stale:'旧位置 · 等待GPS更新',denied:'尚无位置权限，请在浏览器设置中允许后重试。',unavailable:'尚未收到GPS，请在窗边或室外重试。',timeout:'GPS响应较慢，可以重试。',unsupported:'此浏览器不支持定位。',insecure:'GPS需要HTTPS。',error:'无法开启GPS，请重试。',sensorOff:'开启朝向后，蓝色光束会随手机转动。',sensorWaiting:'正在等待指南针，请将手机保持接近水平。',sensorActive:'手机朝向',sensorDenied:'尚无指南针权限，请检查浏览器的运动与方向权限。',sensorUnsupported:'此设备或浏览器不支持指南针。',sensorUnavailable:'尚未收到以北方为基准的朝向，请远离金属后重试。',sensorInsecure:'指南针需要HTTPS。',sensorError:'无法开启指南针，请重试。',accuracy:'误差约',updated:'更新于',ago:'秒前',north:'北',map:'GPS地图，上方为北',mapHint:'蓝点代表GPS位置，光束代表手机朝向。',note:'室内GPS可能漂移，无法判断楼层或房间。请扫描二维码或在下方选择楼层。',tiles:'地图背景暂不可用，坐标和指南针仍可使用。',intro:'开启GPS后才加载地图，位置不会保存到日记。',indoor:'馆内主题示意图',compass:'手机指南针'}
  };
  const tr=key=>(words[M.state.lang]||words.vi)[key]||key;
  let gps='off',sensor='off',watchId=null,gpsToken=0,sensorToken=0,fix=null,bearing=null,headingAt=0;
  let geoDeadline,sensorDeadline,ticker,listening=false,preferAbsolute=false,follow=true,map,marker,circle,tileFailure=false;
  const panel=document.createElement('section');panel.id='gps-panel';panel.className='gps-panel';
  panel.innerHTML='<div class="gps-panel-heading"><div><span id="gps-subtitle" class="eyebrow"></span><h2 id="gps-title"></h2></div><span class="gps-live-badge">GPS</span></div><p id="gps-intro" class="gps-caption"></p><div class="gps-controls"><button id="gps-start" class="primary" type="button"></button><button id="gps-heading" class="secondary" type="button" aria-pressed="false"></button><button id="gps-stop" class="secondary" type="button" hidden></button></div><p id="gps-status" class="gps-status" role="status"></p><div class="gps-map-shell"><div id="gps-map"><div class="gps-map-placeholder" aria-hidden="true">⌖</div></div><div class="gps-compass" role="img"><span class="gps-north"></span><span class="gps-compass-arrow" hidden>↑</span><span class="gps-compass-idle" aria-hidden="true">⌖</span></div></div><p id="gps-tile-status" class="gps-caption" role="status" hidden></p><div class="gps-readouts"><span id="gps-coordinates"></span><span id="gps-accuracy"></span><span id="gps-updated"></span></div><p id="gps-heading-status" class="gps-heading-status" role="status"></p><p id="gps-bearing" class="gps-bearing"></p><p id="gps-note" class="gps-caption"></p>';
  const scroll=document.querySelector('#page-map>.scroll');scroll.prepend(panel);
  const indoorLabel=document.createElement('h2');indoorLabel.id='indoor-map-heading';indoorLabel.className='indoor-map-heading';
  panel.after(indoorLabel);indoorLabel.after(document.querySelector('#page-map>.floor-tabs'));

  function activeGPS(){return ['waiting','tracking','stale'].includes(gps);}
  function activeHeading(){return listening||sensor==='requesting';}
  function render(){
    $('gps-title').textContent=tr('title');$('gps-subtitle').textContent=tr('sub');$('gps-intro').textContent=tr('intro');
    $('gps-start').textContent=gps==='tracking'&&fix?tr('recenter'):tr('start');$('gps-start').disabled=gps==='waiting';
    $('gps-heading').textContent=activeHeading()?tr('headingOff'):tr('heading');$('gps-heading').setAttribute('aria-pressed',String(activeHeading()));
    $('gps-stop').textContent=tr('stop');$('gps-stop').hidden=!activeGPS()&&!activeHeading();
    $('gps-status').textContent=gps==='paused'&&!fix?M.human('Đã dừng định vị.','Location paused.','위치 확인을 중지했어요.','定位已暂停。'):tr(gps);$('gps-status').classList.toggle('gps-error',['denied','error','unsupported','insecure','timeout','unavailable'].includes(gps));
    $('gps-map').setAttribute('aria-label',tr('map'));$('gps-map').title=tr('mapHint');
    $('gps-note').textContent=tr('note');$('indoor-map-heading').textContent=tr('indoor');
    $('gps-heading-status').textContent=tr(({off:'sensorOff',paused:'sensorOff',requesting:'sensorWaiting',waiting:'sensorWaiting',active:'sensorActive',denied:'sensorDenied',unsupported:'sensorUnsupported',unavailable:'sensorUnavailable',insecure:'sensorInsecure',error:'sensorError'})[sensor]||'sensorOff');
    panel.querySelector('.gps-north').textContent=tr('north');panel.querySelector('.gps-compass').setAttribute('aria-label',tr('compass'));
    $('gps-tile-status').textContent=tr('tiles');$('gps-tile-status').hidden=!tileFailure;
    for(const [selector,label] of [['.leaflet-control-zoom-in',M.human('Phóng to','Zoom in','확대','放大')],['.leaflet-control-zoom-out',M.human('Thu nhỏ','Zoom out','축소','缩小')]]){const button=panel.querySelector(selector);if(button){button.title=label;button.setAttribute('aria-label',label);}}
    renderReadouts();renderDirection();
  }
  function renderReadouts(){
    $('gps-coordinates').textContent=fix?`${fix.lat.toFixed(5)}, ${fix.lng.toFixed(5)}`:'';
    $('gps-accuracy').textContent=fix?`${tr('accuracy')} ±${Math.max(1,Math.round(fix.accuracy))} m`:'';
    $('gps-updated').textContent=fix?`${tr('updated')} ${Math.max(0,Math.round((Date.now()-fix.timestamp)/1000))} ${tr('ago')}`:'';
    $('gps-bearing').textContent=sensor==='active'&&bearing!==null?`${Math.round(E.normalize(bearing))}° · ${M.human('Cầm điện thoại gần nằm ngang.','Hold your phone nearly flat.','휴대전화를 거의 수평으로 잡으세요.','请将手机保持接近水平。')}`:'';
    marker?.getElement()?.classList.toggle('gps-paused',gps!=='tracking');
  }
  function renderDirection(){
    const visible=sensor==='active'&&bearing!==null;
    const node=marker?.getElement();node?.classList.toggle('has-heading',visible);
    const ray=node?.querySelector('.gps-direction');if(ray)ray.style.transform=`rotate(${bearing||0}deg)`;
    const arrow=panel.querySelector('.gps-compass-arrow');arrow.hidden=!visible;arrow.style.transform=`rotate(${bearing||0}deg)`;
    panel.querySelector('.gps-compass-idle').hidden=visible;
  }
  function ensureMap(){
    if(map)return true;if(!window.L){tileFailure=true;render();return false;}
    $('gps-map').replaceChildren();
    map=L.map('gps-map',{zoomControl:true,scrollWheelZoom:false,attributionControl:true});
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>'})
      .on('tileerror',()=>{tileFailure=true;render();}).addTo(map);
    map.on('dragstart',()=>{follow=false;});
    L.control.scale({imperial:false,position:'bottomleft'}).addTo(map);
    return true;
  }
  function drawFix(){
    if(!fix||!ensureMap())return;
    const point=[fix.lat,fix.lng];
    if(!marker){
      circle=L.circle(point,{radius:fix.accuracy,color:'#237cd5',weight:1,fillColor:'#3b93ea',fillOpacity:0.1,interactive:false}).addTo(map);
      marker=L.marker(point,{interactive:false,keyboard:false,icon:L.divIcon({className:'gps-marker',html:'<div class="gps-position"><i class="gps-direction"></i><i class="gps-dot"></i></div>',iconSize:[24,24],iconAnchor:[12,12]})}).addTo(map);
      if(fix.accuracy>100)map.fitBounds(circle.getBounds(),{maxZoom:17,padding:[20,20],animate:false});
      else map.setView(point,17,{animate:false});
    }else{
      marker.setLatLng(point);circle.setLatLng(point).setRadius(fix.accuracy);
      if(follow)map.panTo(point,{animate:false});
    }
    renderDirection();renderReadouts();
  }
  function maintainTicker(){
    if(!activeGPS()&&!activeHeading()){clearInterval(ticker);ticker=null;return;}
    if(ticker)return;
    ticker=setInterval(()=>{
      if(gps==='tracking'&&fix&&Date.now()-fix.timestamp>30000){gps='stale';render();}
      if(sensor==='active'&&Date.now()-headingAt>10000){bearing=null;sensor='waiting';render();}
      renderReadouts();
    },1000);
  }
  function clearGeo(){gpsToken++;clearTimeout(geoDeadline);if(watchId!==null)navigator.geolocation?.clearWatch(watchId);watchId=null;}
  function geoError(error){
    clearGeo();gps=({1:'denied',2:'unavailable',3:'timeout'})[error?.code]||'error';render();maintainTicker();
  }
  function startGPS(){
    if(!window.isSecureContext){gps='insecure';render();return;}
    if(!navigator.geolocation?.watchPosition){gps='unsupported';render();return;}
    if(gps==='tracking'&&fix){follow=true;map?.setView([fix.lat,fix.lng],map.getZoom(),{animate:false});return;}
    if(gps==='waiting')return;
    clearGeo();const token=gpsToken;gps='waiting';follow=true;render();maintainTicker();
    geoDeadline=setTimeout(()=>{if(token===gpsToken)geoError({code:3});},15000);
    try{
      const id=navigator.geolocation.watchPosition(position=>{
        if(token!==gpsToken||M.state.page!=='map'||document.hidden)return;
        const next=E.fix(position,fix?.timestamp||0);if(!next)return;
        clearTimeout(geoDeadline);fix=next;gps=Date.now()-fix.timestamp>30000?'stale':'tracking';drawFix();render();maintainTicker();
      },error=>{if(token===gpsToken)geoError(error);},{enableHighAccuracy:true,maximumAge:5000,timeout:15000});
      if(token===gpsToken)watchId=id;else navigator.geolocation.clearWatch(id);
    }catch{geoError({});}
  }
  function orientation(event){
    if(!listening)return;
    if(preferAbsolute&&event.type!=='deviceorientationabsolute'&&typeof event.webkitCompassHeading!=='number')return;
    const angle=Number(screen.orientation?.angle??window.orientation??0);
    const next=E.heading(event,angle);if(next===null)return;
    if(event.type==='deviceorientationabsolute')preferAbsolute=true;
    clearTimeout(sensorDeadline);bearing=E.smooth(bearing,next);headingAt=Date.now();
    const first=sensor!=='active';sensor='active';if(first)render();else{renderDirection();renderReadouts();}
  }
  function stopHeading(state='off'){
    sensorToken++;clearTimeout(sensorDeadline);window.removeEventListener('deviceorientationabsolute',orientation);window.removeEventListener('deviceorientation',orientation);
    listening=false;preferAbsolute=false;bearing=null;sensor=state;renderDirection();
  }
  async function startHeading(){
    if(activeHeading()){stopHeading();render();maintainTicker();return;}
    if(!window.isSecureContext){sensor='insecure';render();return;}
    const Device=window.DeviceOrientationEvent;
    if(!Device){sensor='unsupported';render();return;}
    const token=++sensorToken;sensor='requesting';render();
    try{
      // iOS requires this call directly inside the button gesture, before any other await.
      const permission=typeof Device.requestPermission==='function'?await Device.requestPermission():'granted';
      if(token!==sensorToken||document.hidden||M.state.page!=='map')return;
      if(permission!=='granted'){sensor='denied';render();maintainTicker();return;}
      listening=true;sensor='waiting';preferAbsolute=false;
      window.addEventListener('deviceorientationabsolute',orientation);window.addEventListener('deviceorientation',orientation);
      sensorDeadline=setTimeout(()=>{if(token===sensorToken&&sensor==='waiting'){stopHeading('unavailable');render();maintainTicker();}},8000);
      render();maintainTicker();
    }catch{if(token===sensorToken){sensor='error';render();maintainTicker();}}
  }
  function stop(state='off'){
    const hadGPS=activeGPS(),hadHeading=activeHeading();clearGeo();stopHeading(hadHeading?state:'off');
    if(hadGPS)gps=state==='off'&&fix?'paused':state;render();maintainTicker();
  }
  $('gps-start').addEventListener('click',startGPS);$('gps-heading').addEventListener('click',startHeading);$('gps-stop').addEventListener('click',()=>stop());
  document.addEventListener('museum:language',render);
  document.addEventListener('museum:navigate',event=>{if(event.detail?.page!=='map')stop('paused');else if(map)requestAnimationFrame(()=>map.invalidateSize());});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop('paused');});
  window.addEventListener('pagehide',()=>stop('paused'));
  render();
  window.MuseumLocation=Object.freeze({stop,getState:()=>({gps,sensor,position:fix?{...fix}:null,heading:bearing===null?null:E.normalize(bearing),watching:watchId!==null,listening,following:follow})});
})();
