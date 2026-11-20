/* Giao diện tuyến trình diễn; chỉ cập nhật số trên thanh tua trong mỗi khung hình.
   Thẻ dùng ảnh, lời tóm tắt và nguồn có sẵn, không tạo hồ sơ hoặc lịch sử mới. */
((root)=>{
 'use strict';
 const labels={
  title:['Một vòng di sản cùng Mây','A heritage tour with Mây','마이와 함께하는 유산 여행','与小云一起探索遗产'],
  stops:['điểm dừng','stops','개 지점','个站点'],
  start:['Bắt đầu mô phỏng','Start simulation','시뮬레이션 시작','开始模拟'],
  pause:['Tạm dừng','Pause','일시 정지','暂停'],
  resume:['Tiếp tục','Resume','계속','继续'],
  next:['Điểm tiếp theo','Next stop','다음 지점','下一站'],
  reset:['Chạy lại từ đầu','Restart tour','처음부터 다시','重新开始'],
  exit:['Về bản đồ tự do','Explore map freely','자유 지도 탐색','自由探索地图'],
  progress:['Tiến trình mô phỏng','Simulation progress','시뮬레이션 진행','模拟进度'],
  speed:['Tốc độ','Speed','속도','速度'],
  ready:['Chạm bắt đầu. Mây sẽ dừng ở mỗi điểm để bạn khám phá.','Tap Start. Mây pauses at each stop for you to explore.','시작을 누르세요. 마이가 각 지점에서 기다려요.','点击开始，小云会在每一站停下等你探索。'],
  moving:['Mây đang tới:','Mây is heading to:','마이가 향하는 곳:','小云正在前往：'],
  arrived:['Đã đến','Arrived','도착','已到达'],
  paused:['Đang tạm dừng','Paused','일시 정지됨','已暂停'],
  preview:['Xem trước · Chưa ghi nhận điểm dừng','Preview · No arrival recorded','미리보기 · 도착 기록 없음','预览 · 未记录到站'],
  done:['Đã hoàn thành 9 điểm. Bạn có thể mở hồ sơ hoặc chạy lại.','All 9 stops complete. Open a record or restart the tour.','9개 지점을 완료했어요. 기록을 열거나 다시 시작하세요.','已完成9站，可以打开档案或重新开始。'],
  floor:['Tầng','Floor','층','楼层'],
  theme:['Chủ đề tham quan','Tour theme','관람 주제','参观主题'],
  record:['Hiện vật nổi bật','Featured object','주요 유물','精选文物'],
  open:['Mở hồ sơ','Open record','기록 열기','打开档案'],
  explore:['Khám phá chủ đề','Explore theme','주제 살펴보기','探索主题'],
  listen:['Nghe lời kể','Play narration','해설 재생','播放讲述'],
  source:['Nguồn','Source','출처','来源'],
  original:['Nội dung hồ sơ theo ngôn ngữ nguồn','Record text in its source language','기록 내용은 원문 언어로 표시됩니다','档案文字保留来源语言'],
  intro:['9 điểm, 3 tầng, 3 hiện vật nổi bật','9 stops, 3 floors, 3 featured objects','9개 지점, 3개 층, 주요 유물 3점','9个站点、3个楼层、3件精选文物'],
  illustration:['Sơ đồ minh họa','Illustrative map','예시 지도','示意地图'],
  note:['Vị trí và đường đi dùng để trình diễn, không phải sơ đồ định vị trong bảo tàng.','Positions and paths are for presentation, not indoor positioning.','위치와 경로는 시연용이며 실제 실내 위치를 안내하지 않습니다.','位置和路线用于演示，并非馆内定位。'],
 };
 function create(ctx){
  const {M,route}=ctx,esc=M.esc,I=(n,c)=>root.MuseumIcons.svg(n,c),T=k=>labels[k][{vi:0,en:1,ko:2,zh:3}[M.state.lang]??0];
  let panel=null,cardKey='',statusKey='',lastPercent=-1;
  const topic=s=>M.D.find(d=>d.id===s.topicId),record=s=>M.A.find(a=>a.id===s.artifactId),name=s=>s?(s.artifactId?M.aname(record(s)):M.nm(topic(s))):'';
  function mount(host){
   panel=document.createElement('section');panel.className='demo-tour-panel';panel.setAttribute('aria-label',T('title'));
   panel.innerHTML=`<div class="demo-tour-toolbar"><b id="demo-count">0 / 9 ${esc(T('stops'))}</b><label>${esc(T('speed'))}<select id="demo-speed">${[1,2,4].map(n=>`<option value="${n}">×${n}</option>`).join('')}</select></label><button id="demo-reset" aria-label="${esc(T('reset'))}">${I('refresh')}</button></div><label class="demo-range-label" for="demo-seek">${esc(T('progress'))}<output id="demo-percent" for="demo-seek">0%</output></label><input type="range" id="demo-seek" min="0" max="1000" step="1" value="0"><div class="demo-tour-actions"><button id="demo-play" class="demo-primary">${I('play')}<span>${esc(T('start'))}</span></button><button id="demo-next">${esc(T('next'))}${I('chevron')}</button></div><p id="demo-status" role="status" aria-live="polite"></p><div id="demo-audio-slot"></div><section class="demo-stop-card" id="demo-stop" aria-labelledby="demo-stop-title"></section><button id="demo-exit" class="demo-exit">${I('map')}${esc(T('exit'))}</button>`;
   host.appendChild(panel);document.dispatchEvent(new Event('museum:demoview'));
   panel.querySelector('#demo-play').onclick=()=>ctx.toggle();panel.querySelector('#demo-next').onclick=()=>ctx.play();
   panel.querySelector('#demo-reset').onclick=()=>ctx.reset();panel.querySelector('#demo-exit').onclick=()=>ctx.exit();
   panel.querySelector('#demo-speed').onchange=e=>ctx.speed(Number(e.target.value));
   panel.querySelector('#demo-seek').oninput=e=>ctx.seek(Number(e.target.value)/10);
   cardKey='';statusKey='';lastPercent=-1;
  }
  function update(state,force=false){
   if(!panel)return;const $=id=>panel.querySelector('#demo-'+id),arrived=route.stops[state.lastStop],next=route.stops[state.nextIndex];
   const displayIndex=state.preview&&arrived?.floor!==state.position.floor?route.stops.findIndex(s=>s.floor===state.position.floor):state.lastStop,stop=route.stops[displayIndex];
   const pct=Math.round(state.percent*10),key=[state.running,state.complete,state.preview,state.lastStop,state.nextIndex,state.visited.length].join(':');
   if(force||pct!==lastPercent){$('seek').value=String(pct);$('percent').value=Math.round(state.percent)+'%';lastPercent=pct;}
   if(force||key!==statusKey){
    $('count').textContent=state.visited.length+' / 9 '+T('stops');
    const label=state.running?'pause':state.complete?'reset':state.distance===0?'start':'resume';
    $('play').innerHTML=I(state.running?'pause':'play')+'<span>'+esc(T(label))+'</span>';$('play').setAttribute('aria-pressed',String(state.running));
    $('next').disabled=state.running||state.complete;$('speed').value=String(state.speed);
    const atStop=arrived&&Math.abs(state.distance-arrived.arrivalAt)<1e-6;
    $('status').textContent=state.running?T('moving')+' '+name(next):state.preview?T('preview'):state.complete?T('done'):atStop?T('arrived')+' '+(state.lastStop+1)+' / 9 · '+name(arrived):state.distance>0?T('paused')+' · '+name(next):T('ready')+(root.MuseumPocketAudio?' '+root.MuseumPocketAudio.hint():'');
    statusKey=key;
   }
   const nextCard=[state.preview,displayIndex].join(':');
   if(force||cardKey!==nextCard){
    cardKey=nextCard;
    if(!stop){delete $('stop').dataset.stop;$('stop').innerHTML=`<div class="demo-tour-intro"><img src="./ai-robot.webp" width="88" height="88" alt=""><div><h2 id="demo-stop-title">${esc(T('intro'))}</h2><p>${esc(T('note'))}</p></div></div>`;return;}
    const a=record(stop),d=topic(stop),view=a?root.MuseumVisuals.object(a):root.MuseumVisuals.forTopic(d.id),text=a?M.asummary(a):M.ds(d);
    const media=view?root.MuseumVisuals.media({...view,image:'./'+view.image},{eager:true}):'<img class="demo-fallback" src="./ai-robot.webp" width="100" height="110" alt="">';
    const untranslated=a&&M.state.lang!=='vi'&&!root.MuseumDataV6?.artifacts?.[a.id];
    $('stop').dataset.stop=stop.id;$('stop').innerHTML=`<div class="demo-stop-overview">${media}<div><small>${esc(T('floor'))} ${stop.floor} · ${esc(T(a?'record':'theme'))}</small><h2 id="demo-stop-title">${esc(name(stop))}</h2><p>${esc(text)}</p></div></div>${untranslated?`<small class="demo-original">${esc(T('original'))}</small>`:''}<div class="demo-stop-actions"><button id="demo-record">${esc(T(a?'open':'explore'))}${I('chevron')}</button>${a?`<button id="demo-listen">${I('volume')}${esc(T('listen'))}</button>`:''}</div><a class="demo-source" href="${esc(a?.url||d.source)}" target="_blank" rel="noopener noreferrer">${esc(T('source'))}: ${esc(view?.credit||'Bảo tàng Đà Nẵng')} ${I('arrowExternal')}</a>`;
    $('record').onclick=()=>a?M.openArtifact(a.id):M.openArticle(d.id);
    if(a)$('listen').onclick=e=>{if(root.MuseumPocketAudio?.supports(a.id))root.MuseumPocketAudio.playArtifact(a.id);else M.speakText(M.aname(a)+'. '+M.asummary(a),e.currentTarget);};
   }
  }
  return{mount,update,T,name};
 }
 root.MuseumDemoTourView=Object.freeze({create,labels});
})(globalThis);
