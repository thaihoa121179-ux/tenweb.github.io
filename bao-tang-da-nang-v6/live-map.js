/* Bản đồ minh họa cho lớp học. Giữ router và dữ liệu Mây hiện có.
   Chỉ di chuyển DOM của chấm / camera trong RAF; hình tầng dựng lại khi đổi tầng. */
(()=>{
 'use strict';
 const M=Museum,E=MuseumMapEngine,C=MuseumMapConfig,W=MuseumMapWords,$=id=>document.getElementById('lm-'+id),esc=M.esc;
 const t=key=>W[key]?.[{vi:0,en:1,ko:2,zh:3}[M.state.lang]??0]||key;
 const debug=new URLSearchParams(location.search).get('debug')==='1',reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const host=document.createElement('div');host.className='live-map-host';document.getElementById('page-map').appendChild(host);
 const settings=document.createElement('dialog');settings.className='live-settings';settings.setAttribute('aria-labelledby','lm-settings-title');document.body.appendChild(settings);
 const info=document.createElement('dialog');info.className='live-settings';info.setAttribute('aria-labelledby','lm-info-title');document.body.appendChild(info);info.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});
 let floors={},floor=null,mode='joystick',running=false,active=false,loading=null,frame=0,lastTime=0,lastInfo=0,frames=0,fps=0;
 let position={x:6,y:20},visual={...position},heading=90,shownHeading=90,offset=0,rawHeading=null,steps=0;
 let sensitivity=C.sensitivity,scale=C.mapScale,snapEnabled=true,teleport=debug,zoom=1,pan={x:0,y:0},follow=false,headingUp=false;
 let stick={x:0,y:0},stickId=null,keys=new Set(),pointers=new Map(),gesture=null,hold=0,lastWall=0,trail=[],raw={},sensorMessage='instruction';
 let tour=[],tourIndex=0,dwell=0,autoSpeed=1,selected=null,expanded=false,worldMatrix=null;
 const sensors=MuseumMapSensors.create({sensitivity:()=>sensitivity,step:()=>{if(!active||settings.open)return;steps++;const a=heading*Math.PI/180;applyMove(Math.sin(a)*C.stepLength*scale,-Math.cos(a)*C.stepLength*scale);},heading:h=>{rawHeading=h;heading=E.normalize(h+offset);},raw:r=>Object.assign(raw,r),status:s=>{sensorMessage=s==='motion'?'active':s==='heading'&&sensorMessage==='active'?'active':'waiting';paintStatus();},error:key=>{sensorMessage=key;paintStatus();}});
 function render(){
  host.innerHTML=`<div class="live-top"><button id="lm-back" data-back aria-label="${esc(t('back'))}">‹</button><div><h1 id="lm-heading" tabindex="-1">${esc(t('title'))}</h1><small id="lm-floor-label" role="status"></small></div><button id="lm-settings" aria-label="${esc(t('settings'))}"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="var(--mint)"/><circle cx="15" cy="12" r="2" fill="var(--mint)"/><circle cx="9" cy="18" r="2" fill="var(--mint)"/></svg></button></div><div class="live-chips"><button id="lm-explain">${esc(t('simulated'))} · ${esc(t('illustration'))} ⓘ</button><span id="lm-counter"></span></div><div class="live-stage" id="lm-stage"><svg id="lm-svg" class="live-svg" aria-label="${esc(t('mapLabel'))}" role="img"><g id="lm-world"></g></svg><div class="live-floor-tabs">${[1,2,3].map(n=>`<button data-live-floor="${n}" aria-label="${esc(t('floor'))} ${n}">${esc(t('floorShort'))}${n}</button>`).join('')}</div><span class="live-north" id="lm-north">↑ ${esc(t('northMark'))}</span><div class="live-zoom"><button id="lm-plus" aria-label="${esc(t('zoomIn'))}">+</button><button id="lm-minus" aria-label="${esc(t('zoomOut'))}">−</button><button id="lm-center" aria-label="${esc(t('recenter'))}">◎</button></div><div class="live-stick" id="lm-stick" role="group" aria-label="${esc(t('joystickHint'))}"><span id="lm-knob"></span><i aria-hidden="true">＋</i><div class="live-dpad">${[['up','↑'],['left','←'],['down','↓'],['right','→']].map(([d,s])=>`<button data-live-dpad="${d}" aria-label="${esc(t(d))}">${s}</button>`).join('')}</div></div><div id="lm-debug" class="live-debug" ${debug?'':'hidden'}></div><div id="lm-loading" class="live-loading" role="status">${esc(t('loading'))}</div></div><div class="live-controls"><div class="live-modes" role="group" aria-label="${esc(t('title'))}">${['walking','joystick','auto'].map(m=>`<button data-live-mode="${m}">${esc(t(m))}</button>`).join('')}</div><div id="lm-mode-tools"></div><p id="lm-status" role="status"></p></div><section class="live-sheet ${expanded?'expanded':''}" id="lm-sheet"><button class="live-sheet-handle" id="lm-sheet-toggle" aria-label="${esc(t('sheet'))}" aria-expanded="${expanded}"><span></span></button><div id="lm-selected"></div><div class="live-area-list" id="lm-areas"></div></section>`;
  settings.innerHTML=`<div class="live-settings-head"><h2 id="lm-settings-title">${esc(t('settings'))}</h2><button id="lm-close-settings">${esc(t('close'))} ×</button></div><p>${esc(t('calibrate'))}</p><button id="lm-calibrate">${esc(t('setHeading'))}</button><div class="live-setting-row"><button data-turn="-90">−90°</button><button data-turn="90">+90°</button></div><p>${esc(t('orientHint'))}</p><label>${esc(t('sensitivity'))}<input id="lm-sensitivity" type="range" min="0.6" max="1.8" step="0.1" value="${sensitivity}"></label><label>${esc(t('scale'))}<select id="lm-scale">${C.scales.map(n=>`<option value="${n}" ${n===scale?'selected':''}>×${n} · ${(C.stepLength*n).toFixed(1)}m</option>`).join('')}</select></label><label class="live-check"><input type="checkbox" id="lm-snap" ${snapEnabled?'checked':''}>${esc(t('snap'))}</label><label class="live-check"><input type="checkbox" id="lm-teleport" ${teleport?'checked':''}>${esc(t('teleport'))}</label><button id="lm-rotate-view">${esc(t(headingUp?'headingUp':'north'))}</button><button id="lm-follow" aria-pressed="${follow}">${esc(t('follow'))}</button><button id="lm-reset">${esc(t('reset'))}</button>`;
  settings.onkeydown=e=>{if(e.key==='Escape')e.stopPropagation();};
  $('settings').onclick=()=>settings.showModal();$('close-settings').onclick=()=>settings.close();
  $('explain').onclick=()=>{info.innerHTML=`<h2 id="lm-info-title">${esc(t('illustration'))}</h2><p>${esc(t('explanation'))}</p><button>${esc(t('close'))}</button>`;info.querySelector('button').onclick=()=>info.close();info.showModal();};$('sheet-toggle').onclick=()=>setExpanded(!expanded);
  $('plus').onclick=()=>{zoom=Math.min(C.maxZoom,zoom*1.3);};$('minus').onclick=()=>{zoom=Math.max(C.minZoom,zoom/1.3);};$('center').onclick=()=>{follow=true;pan={x:0,y:0};};
  $('calibrate').onclick=()=>{offset=90-(rawHeading??0);heading=90;sensorMessage='calibrated';paintStatus();};
  settings.querySelectorAll('[data-turn]').forEach(b=>b.onclick=()=>{const d=Number(b.dataset.turn);offset+=d;heading=E.normalize(heading+d);});
  $('sensitivity').oninput=e=>{sensitivity=Number(e.target.value);};$('scale').onchange=e=>{scale=Number(e.target.value);};$('snap').onchange=e=>{snapEnabled=e.target.checked;};$('teleport').onchange=e=>{teleport=e.target.checked;};
  $('rotate-view').onclick=()=>{headingUp=!headingUp;$('rotate-view').textContent=t(headingUp?'headingUp':'north');};$('follow').onclick=()=>{follow=!follow;pan={x:0,y:0};$('follow').setAttribute('aria-pressed',String(follow));};
  $('reset').onclick=()=>{resetPosition();settings.close();};
  host.querySelectorAll('[data-live-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.liveMode));host.querySelectorAll('[data-live-floor]').forEach(b=>b.onclick=()=>setFloor(Number(b.dataset.liveFloor)));
  bindGestures();bindStick();paintMode();if(floor)drawFloor();
 }
 function setExpanded(value){expanded=value;$('sheet').classList.toggle('expanded',value);$('sheet-toggle').setAttribute('aria-expanded',String(value));}
 function resetPosition(){if(!floor)return;position={x:floor.start.x,y:floor.start.y};visual={...position};heading=shownHeading=floor.start.heading;steps=0;trail=[];zoom=1;pan={x:0,y:0};follow=false;tourIndex=0;dwell=0;buildTour();paintStatus();}
 function setFloor(n){if(!floors[n])return;sensors.stop();running=false;floor=floors[n];M.state.floor=n;selected=floor.zones.find(z=>z.topicId===M.state.mapSelected)||floor.zones[0];resetPosition();drawFloor();paintMode();}
 function drawFloor(){
  if(!floor||!$('world'))return;
  $('loading').hidden=true;$('floor-label').textContent=t('floor')+' '+floor.floor+' · '+floor.size.width+' × '+floor.size.height+floor.size.unit;
  host.querySelectorAll('[data-live-floor]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.liveFloor)===floor.floor)));
  const poly=p=>p.map(v=>v.join(',')).join(' ');
  $('world').innerHTML=`<rect x="1" y="1" width="58" height="38" rx="1.3" class="live-building"/><path d="M3 17H57V23H3Z" class="live-corridor"/>${floor.zones.map((z,i)=>`<g class="live-zone" data-live-zone="${esc(z.id)}"><polygon points="${poly(z.polygon)}" class="zone-color-${i%3}"/><circle cx="${z.center.x}" cy="${z.center.y-3.7}" r="1.3"/><text class="live-zone-num" x="${z.center.x}" y="${z.center.y-3.2}" text-anchor="middle">${i+1}</text><foreignObject x="${z.polygon[0][0]+.8}" y="${z.center.y-1.7}" width="${z.polygon[1][0]-z.polygon[0][0]-1.6}" height="7"><div xmlns="http://www.w3.org/1999/xhtml" class="live-zone-name" style="font-size:${floor.zones.length>4?1.3:1.5}px">${esc(M.nm(M.D.find(d=>d.id===z.topicId)))}</div></foreignObject></g>`).join('')}${floor.walls.map(w=>`<path class="live-wall" d="M${w.a.join(' ')}L${w.b.join(' ')}"/>`).join('')}${floor.zones.map(z=>`<path class="live-door" d="M${z.door.x-1.25} ${z.door.y}h2.5"/>`).join('')}${floor.pois.map(p=>`<g class="live-poi"><rect x="${p.x-1.4}" y="${p.y-.95}" width="2.8" height="1.9" rx=".4"/><text x="${p.x}" y="${p.y+.35}" text-anchor="middle">${esc(t(p.type))}</text></g>`).join('')}<g id="lm-graph">${debug?floor.walkable.map(p=>`<polygon class="live-debug-walk" points="${poly(p)}"/>`).join('')+floor.graph.edges.map(([a,b])=>{const p=floor.graph.nodes.find(n=>n.id===a),q=floor.graph.nodes.find(n=>n.id===b);return`<path class="live-debug-edge" d="M${p.x} ${p.y}L${q.x} ${q.y}"/>`;}).join(''):''}</g><path id="lm-auto-path" class="live-auto-path"/><g id="lm-trail"></g><g id="lm-avatar"><path class="live-cone" d="M0 0L-3.2 -6.5Q0 -8 3.2 -6.5Z"/><circle class="live-pulse" r="1.8"/><circle class="live-dot" r=".9"/><path class="live-arrow" d="M0 -1.8L-.65 -.7H.65Z"/><text id="lm-you-label" class="live-you" y="2.8" text-anchor="middle">${esc(t('you'))}</text></g>`;
  $('world').querySelectorAll('[data-live-zone]').forEach(g=>g.onclick=()=>{if(gesture?.moved)return;selected=floor.zones.find(z=>z.id===g.dataset.liveZone);paintAreas();});
  buildTour();paintAreas();paintStatus();
 }
 function paintAreas(){
  if(!floor||!selected)return;const d=M.D.find(d=>d.id===selected.topicId),view=MuseumVisuals.forTopic(d.id,true);
  $('selected').innerHTML=`${MuseumVisuals.media(view,{decorative:true})}<div><small>${esc(t('here'))}</small><b>${esc(M.nm(d))}</b></div><button id="lm-open-topic" aria-label="${esc(t('topic'))}">›</button>`;
  $('open-topic').onclick=()=>M.openArticle(d.id);
  $('areas').innerHTML=`<p>${esc(t('nearby'))}</p>`+floor.zones.map(z=>`<button data-area="${esc(z.id)}">${MuseumVisuals.media(MuseumVisuals.forTopic(z.topicId,true),{decorative:true})}<span>${esc(M.nm(M.D.find(d=>d.id===z.topicId)))}</span><span>›</span></button>`).join('');
  $('areas').querySelectorAll('[data-area]').forEach(b=>b.onclick=()=>{selected=floor.zones.find(z=>z.id===b.dataset.area);paintAreas();});
 }
 function paintStatus(){if(!$('status'))return;$('status').textContent=t(mode==='walking'?sensorMessage:mode==='joystick'?'joystickHint':sensorMessage==='tourDone'?'tourDone':'instruction');$('counter').textContent=steps+' '+t('steps');if(mode==='walking'&&$('sensor-button'))$('sensor-button').textContent=t(sensors.active?'stop':'enable');}
 function setMode(next){sensors.stop();keys.clear();stick={x:0,y:0};stickId=null;rawHeading=null;if($('knob'))$('knob').style.transform='';mode=next;running=false;dwell=0;sensorMessage='instruction';if(next==='auto')buildTour();paintMode();}
 function paintMode(){
  host.querySelectorAll('[data-live-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.liveMode===mode)));
  $('stick').hidden=mode!=='joystick';
  $('mode-tools').innerHTML=mode==='walking'?`<button id="lm-sensor-button">${esc(t('enable'))}</button><button id="lm-quick-calibrate">${esc(t('setHeading'))}</button>`:mode==='auto'?`<button id="lm-play">${esc(t(running?'pause':'play'))}</button><button id="lm-skip">${esc(t('skip'))}</button><label>${esc(t('speed'))}<select id="lm-speed">${[1,2,4].map(n=>`<option value="${n}" ${autoSpeed===n?'selected':''}>×${n}</option>`).join('')}</select></label>`:`<button id="lm-view">${esc(t(headingUp?'headingUp':'north'))}</button><button id="lm-track" aria-pressed="${follow}">${esc(t('follow'))}</button>`;
  if($('sensor-button'))$('sensor-button').onclick=()=>{if(sensors.active){sensors.stop();sensorMessage='instruction';paintStatus();}else sensors.start().catch(()=>{sensorMessage='denied';paintStatus();});};
  if($('quick-calibrate'))$('quick-calibrate').onclick=()=>settings.showModal();
  if($('play')){$('play').onclick=()=>{if(tourIndex>=tour.length)resetPosition();running=!running;paintMode();};$('skip').onclick=()=>{skipStop();};$('speed').onchange=e=>autoSpeed=Number(e.target.value);}
  if($('view')){$('view').onclick=()=>{headingUp=!headingUp;paintMode();};$('track').onclick=()=>{follow=!follow;pan={x:0,y:0};paintMode();};}
  if($('auto-path'))$('auto-path').hidden=mode!=='auto';paintStatus();
 }
 function applyMove(dx,dy){if(!floor)return;const result=E.move(floor,position,dx,dy);position=snapEnabled?E.snap(floor,result.position,{x:dx,y:dy}):result.position;
  if(result.blocked&&performance.now()-lastWall>650){lastWall=performance.now();$('avatar')?.classList.add('bumped');setTimeout(()=>$('avatar')?.classList.remove('bumped'),180);if(!reduced.matches&&mode==='walking')navigator.vibrate?.(15);}
 }
 function buildTour(){
  if(!floor)return;const nodes=floor.graph.nodes;
  // Không kéo chấm xuyên tường về node gần nhất: chọn node có đoạn nối đi được.
  const visible=nodes.filter(n=>!E.move(floor,position,n.x-position.x,n.y-position.y).blocked);
  const start=visible.sort((a,b)=>E.distance(a,position)-E.distance(b,position))[0]||nodes[0];
  let at=start.id;const preferences=M.state.route?.ids||[],zones=[...floor.zones].sort((a,b)=>{const ia=preferences.indexOf(a.topicId),ib=preferences.indexOf(b.topicId);return(ia<0?99:ia)-(ib<0?99:ib);});
  tour=[{...start}];for(const z of zones){const points=E.path(floor,at,z.id);if(points.length){tour.push(...points.slice(1).map(p=>({...p,stop:p.id===z.id})));at=z.id;}}
  tourIndex=0;dwell=0;
  if($('auto-path')){$('auto-path').setAttribute('d',tour.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(''));$('auto-path').hidden=mode!=='auto';}
 }
 function skipStop(){
  if(!tour.length)return;let i=tour.findIndex((p,i)=>i>=tourIndex&&p.stop);if(i<0)i=tour.length-1;
  // Tua vẫn đi qua từng cạnh với va chạm, không teleport xuyên tường.
  for(let k=tourIndex;k<=i;k++){const p=tour[k];applyMove(p.x-position.x,p.y-position.y);}
  tourIndex=i+1;dwell=0;visual={...position};selected=floor.zones.find(z=>z.id===tour[i].id)||selected;paintAreas();
 }
 function autoplay(dt){
  if(!running)return;if(dwell>0){dwell-=dt;return;}
  const p=tour[tourIndex];if(!p){running=false;sensorMessage='tourDone';paintMode();return;}
  const d=E.distance(position,p),distance=C.autoplaySpeed*autoSpeed*dt;
  if(d<.15){tourIndex++;if(p.stop){dwell=C.autoplayDwellSeconds;selected=floor.zones.find(z=>z.id===p.id)||selected;paintAreas();}return;}
  heading=E.normalize(Math.atan2(p.x-position.x,-(p.y-position.y))*180/Math.PI);applyMove((p.x-position.x)/d*Math.min(d,distance),(p.y-position.y)/d*Math.min(d,distance));
 }
 function draw(now){
  if(!active||document.hidden){frame=0;return;}const dt=Math.min(C.maxFrameSeconds,Math.max(0,(now-lastTime)/1000||0));lastTime=now;frames++;
  if(floor){
   if(mode==='joystick'&&!settings.open){let x=stick.x+(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),y=stick.y+(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);const n=Math.hypot(x,y);if(n>.05){if(n>1){x/=n;y/=n;}heading=E.normalize(Math.atan2(x,-y)*180/Math.PI);applyMove(x*C.joystickSpeed*dt,y*C.joystickSpeed*dt);}}
   if(mode==='auto'&&!settings.open)autoplay(dt);
   const f=1-Math.exp(-C.interpolation*dt);visual.x+=(position.x-visual.x)*f;visual.y+=(position.y-visual.y)*f;shownHeading=E.smoothAngle(shownHeading,heading,Math.min(1,dt*12));
   const rect=$('svg').getBoundingClientRect(),fit=Math.min(rect.width/floor.size.width,rect.height/floor.size.height)*.94,center=follow?visual:{x:floor.size.width/2,y:floor.size.height/2};
   $('world').setAttribute('transform',`translate(${rect.width/2+pan.x} ${rect.height/2+pan.y}) scale(${fit*zoom}) rotate(${headingUp?-shownHeading:0}) translate(${-center.x} ${-center.y})`);
   $('avatar').setAttribute('transform',`translate(${visual.x} ${visual.y}) rotate(${shownHeading})`);$('you-label').setAttribute('transform',`rotate(${headingUp?0:-shownHeading})`);$('north').style.transform=`rotate(${headingUp?-shownHeading:0}deg)`;worldMatrix=$('world').getScreenCTM();
   if(now-lastInfo>250){fps=Math.round(frames*1000/(now-lastInfo));frames=0;lastInfo=now;
    if(!trail.length||E.distance(trail.at(-1),position)>.3)trail.push({...position,time:now});trail=trail.filter(p=>now-p.time<C.trailSeconds*1000).slice(-C.maxTrail);
    $('trail').innerHTML=trail.map(p=>`<circle cx="${p.x}" cy="${p.y}" r=".16" opacity="${Math.max(.04,.4-(now-p.time)/(C.trailSeconds*1000)*.4)}"/>`).join('');
    if(debug)$('debug').textContent=`x ${position.x.toFixed(2)}m · y ${position.y.toFixed(2)}m\n${steps} ${t('steps')} · ${heading.toFixed(0)}° · ${fps} FPS\na ${Number(raw.signal||0).toFixed(2)} · h ${raw.heading?.toFixed(1)??'—'}`;
   }
  }frame=requestAnimationFrame(draw);
 }
 function toWorld(clientX,clientY){if(!worldMatrix)return null;const pt=new DOMPoint(clientX,clientY).matrixTransform(worldMatrix.inverse());return{x:pt.x,y:pt.y};}
 function bindGestures(){
  const svg=$('svg');
  svg.onpointerdown=e=>{if(!floor)return;svg.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});gesture={x:e.clientX,y:e.clientY,pan:{...pan},zoom,dist:pointers.size===2?Math.hypot(...pointerDelta()):0,moved:false};clearTimeout(hold);if(teleport&&pointers.size===1)hold=setTimeout(()=>{const p=toWorld(e.clientX,e.clientY);if(p&&E.walkable(floor,p)){position=p;visual={...p};running=false;buildTour();paintMode();}},650);};
  function pointerDelta(){const ps=[...pointers.values()];return[ps[0].x-ps[1].x,ps[0].y-ps[1].y];}
  svg.onpointermove=e=>{if(!pointers.has(e.pointerId)||!gesture)return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>6){clearTimeout(hold);gesture.moved=true;}
   if(pointers.size===2){const d=Math.hypot(...pointerDelta());if(gesture.dist)zoom=Math.max(C.minZoom,Math.min(C.maxZoom,gesture.zoom*d/gesture.dist));}
   else{pan={x:gesture.pan.x+e.clientX-gesture.x,y:gesture.pan.y+e.clientY-gesture.y};if(gesture.moved)follow=false;}
  };
  const end=e=>{clearTimeout(hold);pointers.delete(e.pointerId);if(pointers.size===1){const p=[...pointers.values()][0];gesture={x:p.x,y:p.y,pan:{...pan},zoom,dist:0,moved:true};}};svg.onpointerup=end;svg.onpointercancel=end;svg.onlostpointercapture=end;
  svg.onwheel=e=>{e.preventDefault();zoom=Math.max(C.minZoom,Math.min(C.maxZoom,zoom*Math.exp(-e.deltaY*.001)));};
  const handle=$('sheet-toggle');let sy=null;handle.onpointerdown=e=>{sy=e.clientY;handle.setPointerCapture(e.pointerId);};handle.onpointerup=e=>{if(sy!==null&&Math.abs(e.clientY-sy)>20)setExpanded(e.clientY<sy);sy=null;};
 }
 function bindStick(){
  const pad=$('stick'),knob=$('knob');
  function update(e){const b=pad.getBoundingClientRect(),dx=e.clientX-b.x-b.width/2,dy=e.clientY-b.y-b.height/2,n=Math.max(C.joystickRadius,Math.hypot(dx,dy));stick={x:dx/n,y:dy/n};knob.style.transform=`translate(${stick.x*C.joystickRadius}px,${stick.y*C.joystickRadius}px)`;}
  pad.onpointerdown=e=>{if(e.target.closest('button'))return;stickId=e.pointerId;pad.setPointerCapture(e.pointerId);update(e);};pad.onpointermove=e=>{if(stickId===e.pointerId)update(e);};
  const release=()=>{stickId=null;stick={x:0,y:0};knob.style.transform='';};pad.onpointerup=release;pad.onpointercancel=release;pad.onlostpointercapture=release;
  pad.querySelectorAll('[data-live-dpad]').forEach(b=>{b.onpointerdown=e=>{e.stopPropagation();b.setPointerCapture(e.pointerId);const d=b.dataset.liveDpad;stick={x:d==='left'?-1:d==='right'?1:0,y:d==='up'?-1:d==='down'?1:0};};b.onpointerup=release;b.onpointercancel=release;b.onlostpointercapture=release;});
 }
 async function load(){
  if(Object.keys(floors).length===3)return;if(loading)return loading;
  loading=Promise.all([1,2,3].map(async n=>{const r=await fetch(`data/maps/floor-${n}.json`);if(!r.ok)throw Error('floor');const f=await r.json();if(f.schemaVersion!==1||!f.illustrative||f.floor!==n||!Array.isArray(f.walkable)||!f.graph?.nodes?.length||!f.zones.every(z=>M.D.some(d=>d.id===z.topicId&&d.floor===n)))throw Error('schema');return f;})).then(fs=>{floors=Object.fromEntries(fs.map(f=>[f.floor,f]));}).finally(()=>loading=null);return loading;
 }
 async function enter(){
  if(M.state.page!=='map')return;active=true;render();$('heading').focus({preventScroll:true});if(!frame){lastTime=performance.now();frame=requestAnimationFrame(draw);}
  try{await load();if(!active||M.state.page!=='map')return;if(!floor||M.state.floor!==floor.floor)setFloor(M.state.floor||1);else{drawFloor();paintMode();}}
  catch{$('loading').hidden=false;$('loading').innerHTML=`<p>${esc(t('loadError'))}</p><button id="lm-retry">${esc(t('retry'))}</button>`;$('retry').onclick=()=>enter();}
 }
 function leave(){active=false;sensors.stop();if(mode==='walking')sensorMessage='instruction';running=false;keys.clear();stick={x:0,y:0};pointers.clear();clearTimeout(hold);cancelAnimationFrame(frame);frame=0;if(settings.open)settings.close();if(info.open)info.close();}
 document.addEventListener('museum:navigate',()=>{if(M.state.page!=='map')leave();});
 document.addEventListener('museum:language',()=>{if(active)enter();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)leave();else if(M.state.page==='map')enter();});window.addEventListener('pagehide',leave);window.addEventListener('blur',()=>{keys.clear();stick={x:0,y:0};});
 document.addEventListener('keydown',e=>{if(!active||mode!=='joystick'||settings.open||e.target.closest('input,select,textarea'))return;const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k)){e.preventDefault();keys.add(k);}});
 document.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
 window.MuseumLiveMap={enter,leave,getState:()=>({floor:floor?.floor,mode,position:{...position},heading,steps,running,sensorsActive:sensors.active,frame,zoom,follow,fps,tourIndex,tourLength:tour.length})};
})();
