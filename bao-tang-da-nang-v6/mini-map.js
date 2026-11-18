/* Mini-map nhẹ: chỉ đọc JSON sơ đồ, không nạp engine/cảm biến bản đồ đầy đủ.
   Tọa độ mô phỏng chỉ ở RAM trong phiên; không ghi localStorage hoặc gửi ra ngoài. */
((root)=>{
 'use strict';
 const M=root.Museum;if(!M||!root.document)return;
 const base=new URL('./',document.currentScript?.src||document.baseURI),cache=new Map(),loaded=new Map(),views=new WeakMap();
 const words={
  title:['Bản đồ cho chuyến đi','A map for your visit','탐방 지도','参观地图'],
  objectTitle:['Chủ đề trên sơ đồ','Theme on the plan','평면도의 전시 주제','平面图上的主题'],
  simulation:['Sơ đồ minh họa · Định vị mô phỏng','Illustrative plan · Simulated position','예시 평면도 · 모의 위치','示意平面图 · 模拟定位'],
  floor:['Tầng','Floor','층','楼层'],areas:['khu','areas','구역','个区域'],
  start:['Điểm bắt đầu mô phỏng','Simulation starting point','시뮬레이션 시작점','模拟起点'],
  session:['Vị trí mô phỏng trong phiên này','Simulated position in this session','이번 세션의 모의 위치','本次会话中的模拟位置'],
  related:['Vùng chủ đề liên quan; không xác nhận vị trí trưng bày thật.','Related theme area; this does not establish the actual display location.','관련 전시 주제 구역이며 실제 전시 위치를 확인하는 정보가 아닙니다.','相关主题区域，不代表真实展位。'],
  open:['Mở bản đồ trực tiếp','Open the live map','실시간 지도 열기','打开实景模拟地图'],
  directions:['Chỉ đường trên sơ đồ','Directions on the plan','평면도 길 안내','平面图路线指引'],
  loading:['Đang mở sơ đồ nhỏ…','Opening the mini-map…','미니 지도를 여는 중…','正在打开迷你地图…'],
  unavailable:['Chưa tải được sơ đồ nhỏ. Kết nối mạng rồi thử lại.','The mini-map could not load. Reconnect and retry.','미니 지도를 불러오지 못했습니다. 연결 후 다시 시도하세요.','迷你地图加载失败，请联网后重试。'],
  retry:['Thử lại','Retry','다시 시도','重试'],
  mapLabel:['Sơ đồ tầng minh họa; vị trí nếu có chỉ là mô phỏng.','Illustrative floor plan; any position shown is simulated.','예시 층 평면도이며 표시된 위치는 모의 위치입니다.','楼层示意图，所显示的位置仅为模拟。'],
  preview:['Xem trước sơ đồ mô phỏng','Preview the simulated plan','모의 평면도 미리 보기','预览模拟平面图'],
 };
 const t=k=>words[k]?.[{vi:0,en:1,ko:2,zh:3}[M.state.lang]??0]||k,esc=v=>M.esc(String(v??''));
 let current=null,observer=null,frame=0;
 const active=kind=>M.state.confirmed&&M.state.page===(kind==='home'?'home':'artifact')&&document.getElementById('lang-overlay')?.classList.contains('hidden');
 const inView=el=>{const r=el.getBoundingClientRect();return r.bottom>0&&r.top<(root.visualViewport?.height||root.innerHeight)+80;};
 function pointInPolygon(p,poly){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];if((a[1]>p.y)!==(b[1]>p.y)&&p.x<(b[0]-a[0])*(p.y-a[1])/(b[1]-a[1])+a[0])inside=!inside;
 }return inside;}
 function validPose(f,p){return !!p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.y>=0&&p.x<=f.size.width&&p.y<=f.size.height&&f.walkable.some(poly=>pointInPolygon(p,poly));}
 function isPoint(a){return Array.isArray(a)&&a.length===2&&a.every(Number.isFinite);}
 function validFloor(f,n){return f?.schemaVersion===1&&f.illustrative===true&&f.floor===n&&Number.isFinite(f.size?.width)&&Number.isFinite(f.size?.height)&&f.size.width>0&&f.size.height>0&&f.size.width<1000&&f.size.height<1000&&Array.isArray(f.walkable)&&f.walkable.length&&f.walkable.every(p=>Array.isArray(p)&&p.length>=3&&p.every(isPoint))&&Array.isArray(f.walls)&&f.walls.every(w=>isPoint(w.a)&&isPoint(w.b))&&Array.isArray(f.zones)&&f.zones.every(z=>typeof z.topicId==='string'&&Array.isArray(z.polygon)&&z.polygon.length>=3&&z.polygon.every(isPoint)&&Number.isFinite(z.center?.x)&&Number.isFinite(z.center?.y))&&validPose(f,f.start);}
 function floorData(n){
  if(!cache.has(n)){
   const controller=new AbortController(),timeout=Math.max(1000,Math.min(30000,Number(root.MuseumConfig?.assetTimeoutMs)||10000));
   const timer=setTimeout(()=>controller.abort(),timeout);
   const pending=fetch(new URL(`data/maps/floor-${n}.json`,base),{credentials:'same-origin',signal:controller.signal}).then(r=>{if(!r.ok)throw Error('mini_map_http');return r.json();}).then(f=>{if(!validFloor(f,n))throw Error('mini_map_schema');loaded.set(n,f);return f;}).catch(e=>{cache.delete(n);throw e;}).finally(()=>clearTimeout(timer));
   cache.set(n,pending);
  }
  return cache.get(n);
 }
 function supported(a){return !!a&&!a.referenceOnly&&(a.sourceSite||'site1')==='site1'&&M.D.some(d=>d.id===a.topic&&[1,2,3].includes(d.floor));}
 function recordContext(){const a=M.A.find(a=>a.id===M.state.artifact);if(!supported(a))return null;const d=M.D.find(d=>d.id===a.topic);return{kind:'artifact',floor:d.floor,artifact:a,topic:d};}
 function context(kind){return kind==='home'?{kind:'home',floor:current?.floor||1}:recordContext();}
 function mount(kind){
  const id=kind==='home'?'home-mini-map':'artifact-mini-map';let card=document.getElementById(id);
  if(!card){card=document.createElement('section');card.id=id;card.className='mini-map-card';card.dataset.miniKind=kind;card.setAttribute('aria-label',t('preview'));
   if(kind==='home'){const anchor=document.getElementById('home-records')||document.querySelector('.home-feature');if(!anchor)return null;anchor.after(card);}
   else{const anchor=document.getElementById('artifact-location');if(!anchor)return null;anchor.before(card);}
   observer?.observe(card);
  }return card;
 }
 function skeleton(card,ctx){
  card.hidden=false;card.dataset.miniFloor=String(ctx.floor);card.dataset.miniRecord=ctx.artifact?.id||'';card.setAttribute('aria-label',t('preview'));
  card.innerHTML=`<div class="mini-map-head"><h2>${esc(t(ctx.kind==='home'?'title':'objectTitle'))}</h2><span>${esc(t('floor'))} ${ctx.floor}</span></div><p class="mini-map-disclaimer">${esc(t('simulation'))}</p><div class="mini-map-preview" aria-busy="true"><p class="mini-map-state" role="status">${esc(t('loading'))}</p></div><p class="mini-map-detail">${esc(ctx.kind==='home'?t('start'):t('related'))}</p>`;
  action(card,ctx);
 }
 function draw(card,ctx,f){
  const state=views.get(card);if(!state||state.floor!==ctx.floor||state.record!==(ctx.artifact?.id||'')||state.lang!==M.state.lang)return;
  const zone=ctx.topic&&f.zones.find(z=>z.topicId===ctx.topic.id);
  if(ctx.kind==='artifact'&&!zone)throw Error('mini_map_no_zone');
  const name=z=>M.D.find(d=>d.id===z.topicId)?.names?.[{vi:0,en:1,ko:2,zh:3}[M.state.lang]??0]||'';
  const points=poly=>poly.map(p=>p.join(',')).join(' '),hasPose=current?.floor===ctx.floor&&validPose(f,current.position);
  const pose=hasPose?current.position:ctx.kind==='home'?f.start:null;
  const heading=hasPose?current.heading:Number.isFinite(f.start.heading)?f.start.heading:90;
  const dot=pose?`<g class="mini-map-position" transform="translate(${pose.x} ${pose.y}) rotate(${heading})"><path class="mini-map-cone" d="M0 0L-2.5 -5Q0 -6 2.5 -5Z"/><circle r=".95"/><path class="mini-map-arrow" d="M0 -2L-.6 -.9H.6Z"/></g>`:'';
  const preview=card.querySelector('.mini-map-preview');preview.setAttribute('aria-busy','false');
  preview.innerHTML=`<svg class="mini-map-svg" role="img" aria-label="${esc(t('mapLabel'))}" viewBox="0 0 ${f.size.width} ${f.size.height}"><rect class="mini-map-building" x="1" y="1" width="${f.size.width-2}" height="${f.size.height-2}" rx="1.2"/>${f.walkable.map(poly=>`<polygon class="mini-map-walkable" points="${points(poly)}"/>`).join('')}${f.zones.map((z,i)=>`<g class="mini-map-zone ${zone?.id===z.id?'selected':''}"><title>${esc(name(z))}</title><polygon points="${points(z.polygon)}"/><text x="${z.center.x}" y="${z.center.y+.8}" text-anchor="middle">${i+1}</text></g>`).join('')}${f.walls.map(w=>`<path class="mini-map-wall" d="M${w.a.join(' ')}L${w.b.join(' ')}"/>`).join('')}${dot}</svg><p class="mini-map-position-label">${esc(ctx.kind==='home'?(hasPose?t('session'):t('start')):M.nm(ctx.topic))}</p>`;
  let details=card.querySelector('.mini-map-detail');if(!details){details=document.createElement('p');details.className='mini-map-detail';card.appendChild(details);}details.textContent=ctx.kind==='home'?`${t('floor')} ${f.floor} · ${f.zones.length} ${t('areas')}`:t('related')+(hasPose?' '+t('session')+'.':'');
  action(card,ctx);
  state.ready=true;state.poseSignature=pose?`${pose.x}|${pose.y}|${heading}|${hasPose}`:'';
 }
 function action(card,ctx){
  let button=card.querySelector('.mini-map-open');if(!button){button=document.createElement('button');button.type='button';button.className='mini-map-open';card.appendChild(button);}button.textContent=t(ctx.kind==='home'?'open':'directions')+' ›';
  button.onclick=()=>{
   if(ctx.kind==='artifact'){const target={kind:'artifact',id:ctx.artifact.id};if(typeof root.MuseumMapOpenTarget==='function')root.MuseumMapOpenTarget(target);else{root.MuseumPendingMapTarget=target;M.nav('map');}}
   else{M.state.floor=ctx.floor;M.nav('map');}
  };
 }
 function fail(card,ctx){
  const state=views.get(card);if(!state||state.floor!==ctx.floor||state.record!==(ctx.artifact?.id||'')||state.lang!==M.state.lang)return;
  state.failed=true;const preview=card.querySelector('.mini-map-preview');preview.setAttribute('aria-busy','false');preview.innerHTML=`<p class="mini-map-state" role="status">${esc(t('unavailable'))}</p><button type="button" class="mini-map-retry">${esc(t('retry'))}</button>`;
  preview.querySelector('button').onclick=()=>{views.delete(card);updateCard(card,true);};
 }
 function updatePose(card,ctx,f){
  const state=views.get(card),hasPose=current?.floor===ctx.floor&&validPose(f,current.position),pose=hasPose?current.position:ctx.kind==='home'?f.start:null,heading=hasPose?current.heading:f.start.heading||90;
  const sig=pose?`${pose.x}|${pose.y}|${heading}|${hasPose}`:'';if(state.poseSignature===sig)return;
  let dot=card.querySelector('.mini-map-position');if(!!dot!==!!pose){draw(card,ctx,f);return;}if(dot)dot.setAttribute('transform',`translate(${pose.x} ${pose.y}) rotate(${heading})`);
  const caption=card.querySelector('.mini-map-position-label');if(caption&&ctx.kind==='home')caption.textContent=hasPose?t('session'):t('start');state.poseSignature=sig;
 }
 function updateCard(card,force=false){
  const kind=card.dataset.miniKind;if(!active(kind))return;const ctx=context(kind);if(!ctx){card.hidden=true;views.delete(card);return;}
  card.hidden=false;let state=views.get(card);const same=state&&state.floor===ctx.floor&&state.record===(ctx.artifact?.id||'')&&state.lang===M.state.lang;
  if(same&&state.ready){updatePose(card,ctx,loaded.get(ctx.floor));return;}if(same&&(state.pending||state.failed)&&!force)return;
  if(!same){skeleton(card,ctx);state={floor:ctx.floor,record:ctx.artifact?.id||'',lang:M.state.lang,pending:false,ready:false};views.set(card,state);}
  if(!force&&!inView(card))return;state.pending=true;
  floorData(ctx.floor).then(f=>draw(card,ctx,f)).catch(()=>fail(card,ctx)).finally(()=>{if(views.get(card)===state)state.pending=false;});
 }
 function refresh(){
  if(M.state.page==='home'){const card=mount('home');if(card)updateCard(card);}
  else if(M.state.page==='artifact'){const card=mount('artifact');if(card)updateCard(card);}
 }
 function receivePosition(detail){
  if(!detail||![1,2,3].includes(detail.floor)||!Number.isFinite(detail.position?.x)||!Number.isFinite(detail.position?.y)||!Number.isFinite(detail.heading))return false;
  const candidate={floor:detail.floor,position:{x:detail.position.x,y:detail.position.y},heading:((detail.heading%360)+360)%360};
  const f=loaded.get(candidate.floor);if(f&&!validPose(f,candidate.position))return false;
  if(candidate.position.x<0||candidate.position.y<0||candidate.position.x>1000||candidate.position.y>1000)return false;
  current=candidate;
  if(['home','artifact'].includes(M.state.page)&&!frame)frame=requestAnimationFrame(()=>{frame=0;refresh();});return true;
 }
 if('IntersectionObserver'in root)observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)updateCard(entry.target);},{rootMargin:'80px'});
 document.addEventListener('museum:navigate',refresh);document.addEventListener('museum:language',refresh);document.addEventListener('museum:ready',refresh);
 document.addEventListener('museum:mapposition',e=>receivePosition(e.detail));
 document.addEventListener('museum:mapreset',()=>{current=null;refresh();});
 root.MuseumMiniMap={refresh,receivePosition,loadFloor:n=>[1,2,3].includes(n)?floorData(n):Promise.reject(Error('mini_map_floor')),getSnapshot:()=>current?{floor:current.floor,position:{...current.position},heading:current.heading}:null};refresh();
})(globalThis);
