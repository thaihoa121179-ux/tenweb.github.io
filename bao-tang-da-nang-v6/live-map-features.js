/* Giai đoạn 2: khu, đường dẫn và liên kết với app. Renderer/motion của Giai đoạn 1 giữ riêng. */
((root)=>{
 'use strict';
 function create(ctx){
  const {M,E,C,t,$,esc}=ctx,N=MuseumMapNavigation,tracker=N.tracker();let nav=null,catalog=[],noticeTimer=0,lastTick=0,lastReroute=0,lastTransition=-Infinity,transitions=0,sound=false,audio=null,lastNotice=null,awardZone=null;const visitRecords=new Map();
  let observedBanner=null;const bannerObserver=new ResizeObserver(()=>updateNoticeTop());
  function updateNoticeTop(){if(observedBanner?.isConnected&&!observedBanner.hidden)ctx.host().style.setProperty('--live-notice-top',(observedBanner.offsetTop+observedBanner.offsetHeight+10)+'px');}
  const search=document.createElement('dialog');search.className='live-settings live-destinations';search.setAttribute('aria-labelledby','lm-destination-title');document.body.appendChild(search);search.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});
  const fmt=(key,vars={})=>Object.entries(vars).reduce((s,[k,v])=>s.replaceAll('{'+k+'}',String(v)),t(key));
  function label(target){return target.kind==='artifact'?M.aname(M.A.find(a=>a.id===target.id)):target.kind==='topic'?M.nm(M.D.find(d=>d.id===target.id)):t(target.type)+' · '+t('floor')+' '+target.floor;}
  function buildCatalog(){
   catalog=[];for(const f of Object.values(ctx.floors())){
    for(const z of f.zones){catalog.push({kind:'topic',id:z.topicId,floor:f.floor,nodeId:z.id,zoneId:z.id});for(const id of z.artifactIds){const a=M.A.find(a=>a.id===id&&!a.referenceOnly&&(a.sourceSite||'site1')==='site1');if(a)catalog.push({kind:'artifact',id,floor:f.floor,nodeId:z.id,zoneId:z.id});}}
    for(const p of f.pois)catalog.push({kind:'poi',id:p.id,type:p.type,floor:f.floor,nodeId:p.nodeId});
   }
  }
  const resolve=target=>catalog.find(d=>d.kind===target?.kind&&d.id===target.id);
  function renderUI(){
   let b=$('search-button');if(!b){b=document.createElement('button');b.id='lm-search-button';b.className='live-search-button';b.textContent='⌕';$('stage').appendChild(b);}b.setAttribute('aria-label',t('findDestination'));b.onclick=openSearch;
   if(!$('route-banner')){$('stage').insertAdjacentHTML('beforeend','<div id="lm-route-banner" class="live-route-banner" hidden></div><section id="lm-notice" class="live-notice" aria-live="polite" hidden></section>');}
   bannerObserver.disconnect();observedBanner=$('route-banner');bannerObserver.observe(observedBanner);
   const settings=ctx.settings();if(!$('sound'))settings.insertAdjacentHTML('beforeend',`<label class="live-check"><input id="lm-sound" type="checkbox" ${sound?'checked':''}>${esc(t('sound'))}</label>`);
   $('sound').onchange=e=>{sound=e.target.checked;if(sound)unlockAudio();};
   search.innerHTML=`<div class="live-settings-head"><h2 id="lm-destination-title">${esc(t('findDestination'))}</h2><button id="lm-search-close">${esc(t('close'))} ×</button></div><label class="live-destination-input"><span class="sr-only">${esc(t('findDestination'))}</span><input id="lm-destination-input" type="search" placeholder="${esc(t('searchDestination'))}" autocomplete="off"></label><button id="lm-personal-route" ${M.state.route?.ids?.length?'':'hidden'}>${esc(t('personalRoute'))} ›</button><div id="lm-destination-results"></div>`;
   $('search-close').onclick=()=>search.close();$('destination-input').oninput=renderSearch;$('personal-route').onclick=()=>{const ids=M.state.route?.ids||[],targets=ids.map(id=>resolve({kind:'topic',id})).filter(Boolean);if(targets.length){start(targets);search.close();}};
   paintRoute();decorateAreas();
  }
  function view(target){return target.kind==='artifact'?MuseumVisuals.object(M.A.find(a=>a.id===target.id)):target.kind==='topic'?MuseumVisuals.forTopic(target.id,true):null;}
  function renderSearch(){
   const q=M.norm($('destination-input').value),matches=catalog.filter(d=>!q||M.norm(label(d)+' '+(d.kind==='poi'?(d.type==='wc'?'wc toilet nha ve sinh 화장실 洗手间 ':'')+d.type:'')).includes(q)).sort((a,b)=>(a.kind==='topic'?0:1)-(b.kind==='topic'?0:1)).slice(0,q?70:16);
   $('destination-results').innerHTML=matches.length?matches.map(d=>`<button class="live-destination-result" data-destination="${esc(d.kind+':'+d.id)}">${view(d)?MuseumVisuals.media(view(d),{decorative:true}):'<span class="live-destination-icon" aria-hidden="true">⌖</span>'}<span><b>${esc(label(d))}</b><small>${esc(t('floor'))} ${d.floor} · ${esc(t('simulated'))}</small></span><span aria-hidden="true">›</span></button>`).join(''):`<p>${esc(t('noDestination'))}</p>`;
   $('destination-results').querySelectorAll('[data-destination]').forEach(b=>b.onclick=()=>{const at=b.dataset.destination.indexOf(':'),target=resolve({kind:b.dataset.destination.slice(0,at),id:b.dataset.destination.slice(at+1)});if(target){start([target]);search.close();}});
  }
  function openSearch(){buildCatalog();$('personal-route').hidden=!M.state.route?.ids?.length;renderSearch();search.showModal();$('destination-input').focus();}
  function rebuild(){
   if(!nav||nav.complete)return;const path=N.itinerary(ctx.floors(),ctx.position(),nav.targets.slice(nav.index));
   if(!path){M.toast(t('noPath'));nav=null;ctx.rebuildTour();paintRoute();return;}
   nav.points=path.points;nav.cursor=1;ctx.setAutoPath(nav.points);paintRoute();
  }
  function start(targets){
   const known=targets.map(resolve).filter(Boolean);if(!known.length){M.toast(t('noDestination'));return false;}
   ctx.pause();nav={targets:known,index:0,points:[],cursor:0,complete:false,reroutes:0};rebuild();if(!nav)return false;
   ctx.selectZone(nav.targets[0].zoneId);ctx.focusMap();hideNotice();return true;
  }
  function cancel(){nav=null;ctx.pause();ctx.rebuildTour();paintRoute();}
  function remaining(){if(!nav||nav.complete)return 0;let p=ctx.position(),d=0;for(const q of nav.points.slice(nav.cursor)){d+=q.floor===p.floor?E.distance(p,q):(q.via==='lift'?C.liftCost:C.stairsCost);p=q;}return d;}
  function paintRoute(){
   if(!$('route-banner'))return;const banner=$('route-banner');banner.hidden=!nav;
   ctx.host().classList.toggle('has-route',!!nav);
   if(!nav){ctx.host().style.setProperty('--live-notice-top','76px');$('nav-path')?.setAttribute('d','');return;}
   const target=nav.targets[Math.min(nav.index,nav.targets.length-1)],hint=N.instruction(nav.points,nav.cursor,ctx.position()),meters=Math.max(0,Math.round(hint.distance));
   const direction=hint.kind==='left'||hint.kind==='right'?fmt('turn'+(hint.kind==='left'?'Left':'Right'),{m:meters}):hint.kind==='lift'||hint.kind==='stairs'?fmt(hint.kind==='lift'?'takeLift':'takeStairs',{m:meters,f:hint.floor}):fmt('goStraight',{m:meters});
   if(!banner.querySelector('button')){banner.innerHTML=`<div><b></b><small></small></div><button id="lm-cancel-route" aria-label="${esc(t('cancelRoute'))}">×</button>`;$('cancel-route').onclick=cancel;}banner.querySelector('b').textContent=label(target)+(nav.complete?' ✓':'');banner.querySelector('small').textContent=(nav.complete?t('arrived'):direction)+(nav.complete?'':' · '+Math.round(remaining())+'m · '+Math.max(1,Math.ceil(remaining()/C.joystickSpeed/60))+' '+t('minutes'));

   const f=ctx.floor();if(!f)return;let d='',previous=null;
   for(const p of nav.points.slice(Math.max(0,nav.cursor-1))){if(p.floor===f.floor){d+=(previous?.floor===p.floor?'L':'M')+p.x+' '+p.y+' ';}previous=p;}
   $('nav-path')?.setAttribute('d',d);if($('auto-path'))$('auto-path').hidden=true;
  }
  function decorateAreas(){
   if(!$('areas'))return;let progress=$('visit-progress');if(!progress){progress=document.createElement('p');progress.id='lm-visit-progress';$('areas').prepend(progress);}
   const data=MuseumMapJourney.getData();ctx.host().querySelectorAll('[data-live-zone]').forEach(g=>{const z=ctx.floor()?.zones.find(z=>z.id===g.dataset.liveZone);g.classList.toggle('visited',!!z&&data.topics.includes(z.topicId));});progress.textContent=fmt('visitedAreas',{n:data.topics.length,total:M.D.length})+(data.earned?' · '+t('mapBadge'):'');
   $('areas').querySelectorAll('[data-area]').forEach(b=>{
    if(b.parentElement.classList.contains('live-area-row'))return;const row=document.createElement('div');row.className='live-area-row';b.before(row);row.appendChild(b);const go=document.createElement('button');go.className='live-area-go';go.textContent='→';const zone=ctx.floor().zones.find(z=>z.id===b.dataset.area);go.setAttribute('aria-label',t('directions')+' · '+M.nm(M.D.find(d=>d.id===zone.topicId)));go.onclick=()=>{start([resolve({kind:'topic',id:zone.topicId})]);ctx.collapseSheet();};row.appendChild(go);
   });
  }
  function representative(zone){const target=nav?.targets[nav.index],id=target?.kind==='artifact'&&target.zoneId===zone.id?target.id:null,seen=MuseumMapJourney.getData().artifacts;
   return M.A.find(a=>a.id===(id||zone.artifactIds.find(x=>!seen.includes(x))||zone.artifactIds[0])&&!a.referenceOnly&&(a.sourceSite||'site1')==='site1');}
  function hideNotice(){clearTimeout(noticeTimer);if($('notice'))$('notice').hidden=true;}
  function showNotice(zone,arrived=false,award=false,record=null){
   const d=M.D.find(d=>d.id===zone.topicId),a=record||M.A.find(a=>a.id===visitRecords.get(zone.id))||representative(zone),photo=a?MuseumVisuals.object(a):MuseumVisuals.forTopic(d.id);
   lastNotice=zone.id;const el=$('notice');if(!el)return;el.hidden=false;
   el.innerHTML=`<div class="live-notice-head"><span>${esc(arrived?t('arrived'):t('approaching'))}</span><button id="lm-notice-close" aria-label="${esc(t('close'))}">×</button></div><div class="live-notice-object">${MuseumVisuals.media(photo,{decorative:true,eager:true})}<div><h2>${esc(M.nm(d))}</h2><small>${esc(a?M.aname(a):t('illustration'))}</small>${award?`<b class="live-badge-earned">✦ ${esc(t('mapBadge'))}</b>`:''}</div></div><div class="live-notice-actions"><button id="lm-zone-listen">${esc(t('listenArea'))}</button><button id="lm-zone-ask">${esc(t('askArea'))}</button><button id="lm-zone-record">${esc(t('record'))} ›</button></div>`;
   const schedule=()=>{clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>{if(!el.contains(document.activeElement))hideNotice();},C.noticeMs);};schedule();
   el.onfocusin=()=>clearTimeout(noticeTimer);el.onfocusout=schedule;el.onpointerenter=()=>clearTimeout(noticeTimer);el.onpointerleave=schedule;
   $('notice-close').onclick=hideNotice;$('zone-listen').onclick=()=>{clearTimeout(noticeTimer);M.speakText(M.nm(d)+'. '+M.ds(d),$('zone-listen'));};
   $('zone-ask').onclick=()=>{MuseumExperience.pinTopic(d.id);M.nav('guide');M.sendMessage(M.nm(d));};$('zone-record').onclick=()=>a?M.openArtifact(a.id):M.openArticle(d.id);
  }
  function unlockAudio(){try{const Audio=root.AudioContext||root.webkitAudioContext;if(!Audio)return;audio||=new Audio();audio.resume().catch(()=>{});}catch{}}
  function feedback(){if(!matchMedia('(prefers-reduced-motion: reduce)').matches)navigator.vibrate?.(20);
   if(sound&&audio?.state==='running')try{const o=audio.createOscillator(),g=audio.createGain();o.frequency.setValueAtTime(740,audio.currentTime);o.frequency.exponentialRampToValueAtTime(1000,audio.currentTime+.12);g.gain.setValueAtTime(.06,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.25);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.26);}catch{}
  }
  function tick(now,force=false){
   if(!force&&now-lastTick<160)return;lastTick=now;const floor=ctx.floor(),p=ctx.position();if(!floor)return;
   for(const zone of tracker.update(floor,p,now)){const a=representative(zone);visitRecords.set(zone.id,a?.id);const award=MuseumMapJourney.record(zone.topicId,a?.id);if(award?.badge)awardZone=zone.id;ctx.selectZone(zone.id);feedback();showNotice(zone,false,award?.badge,a);}
   if(tracker.current){const small=$('selected')?.querySelector('small');if(small&&ctx.selected()?.id===tracker.current.id)small.textContent=t('youAreHere');}
   if(!nav||nav.complete)return;
   const target=nav.targets[nav.index],goal=ctx.floors()[target.floor].graph.nodes.find(n=>n.id===target.nodeId);
   if(p.floor===target.floor&&E.distance(p,goal)<=C.arrivalRadius){
    const z=ctx.floor().zones.find(z=>z.id===target.zoneId);if(z)showNotice(z,true,awardZone===z.id);
    nav.index++;if(nav.index>=nav.targets.length){nav.complete=true;ctx.pause();paintRoute();return;}
    rebuild();ctx.dwell();return;
   }
   while(nav.cursor<nav.points.length){
    const q=nav.points[nav.cursor];if(q.floor!==p.floor)break;
    const a=nav.points[nav.cursor-1],b=nav.points[nav.cursor+1];let passed=false;
    if(a?.floor===p.floor&&b?.floor===p.floor){const dx=q.x-a.x,dy=q.y-a.y,l=dx*dx+dy*dy,projection=l?((p.x-a.x)*dx+(p.y-a.y)*dy)/l:0;
     passed=projection>=1&&E.distance(p,E.nearestSegment(p,a,q))<1.3;
     if(!passed)passed=E.distance(p,q)>1&&E.distance(p,E.nearestSegment(p,q,b))<1.3;
    }
    if(E.distance(q,p)>.9&&!passed)break;nav.cursor++;
   }
   const next=nav.points[nav.cursor];
   if(next&&next.floor!==p.floor&&now-lastTransition>C.transitionCooldownMs){const previous=nav.points[nav.cursor-1];if(previous?.floor===p.floor&&E.distance(p,previous)<1.3){lastTransition=now;transitions++;ctx.transition(next.floor,next);nav.cursor++;ctx.seekAuto(nav.cursor);paintRoute();return;}}
   if(now-lastReroute>C.rerouteMs&&N.deviation(nav.points.slice(Math.max(0,nav.cursor-1)),p,p.floor)>C.rerouteDistance){lastReroute=now;nav.reroutes++;rebuild();}
   paintRoute();
  }
  function onEnter(){buildCatalog();renderUI();const pending=root.MuseumPendingMapTarget;if(pending){root.MuseumPendingMapTarget=null;const target=resolve(pending);if(target)start([target]);else M.toast(t('noDestination'));}else if(nav&&!nav.complete)rebuild();}
  function onLeave(){bannerObserver.disconnect();hideNotice();search.close();audio?.suspend().catch(()=>{});}
  document.addEventListener('museum:mapreset',()=>{tracker.reset();visitRecords.clear();awardZone=null;cancel();decorateAreas();});
  return{unlock:()=>{if(sound)unlockAudio();},modalOpen:()=>search.open,onFloorChanged:()=>{buildCatalog();if(nav&&!nav.complete)rebuild();paintRoute();},modeChanged:()=>{if(sound)unlockAudio();if(nav&&!nav.complete)rebuild();},renderUI,onEnter,onLeave,paintRoute,decorateAreas,tick,start,cancel,getPoints:()=>nav&&!nav.complete?nav.points:null,
   getState:()=>({active:!!nav&&!nav.complete,complete:!!nav?.complete,target:nav?.targets[nav.index]||null,index:nav?.index||0,cursor:nav?.cursor||0,reroutes:nav?.reroutes||0,transitions,currentZone:tracker.current?.id||null,visited:MuseumMapJourney.getData().topics.length})};
 }
 root.MuseumMapFeatures={create};
})(globalThis);
