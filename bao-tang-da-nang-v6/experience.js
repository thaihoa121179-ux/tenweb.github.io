/* Lớp trải nghiệm mới nối vào router và dữ liệu hiện có, không thay app lõi. */
(() => {
 'use strict';
 const M=window.Museum,T=key=>MuseumLexicon.t(key),$=id=>document.getElementById(id),esc=M.esc;
 let lastScroll=0,streamTrack=null,torch=false,cameraPhase='idle',torchSupported=false,torchBusy=false,contextSignature='',sourceSignature='';
 const lex=key=>T(key),V=window.MuseumVisuals;
 const icon=name=>window.MuseumIcons.svg(name);
 function button(text,attrs='',cls='secondary'){return `<button type="button" class="${cls}" ${attrs}>${esc(text)}</button>`;}
 function iconButton(name,attrs='',cls='secondary'){return `<button type="button" class="${cls}" ${attrs}>${icon(name)}</button>`;}
 function dialog(id,title){const el=document.createElement('dialog');el.id=id;el.className='experience-dialog';el.innerHTML=`<div class="sheet-heading"><h2>${esc(title)}</h2>${button(T('close'),'data-close-dialog')}</div><div class="sheet-body"></div>`;document.body.appendChild(el);el.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});el.addEventListener('click',e=>{if(e.target===el||e.target.closest('[data-close-dialog]'))el.close();});return el;}
 M.renderGuide();
 const options=dialog('reply-options',T('options')),filters=dialog('filter-sheet',T('filters')),storySheet=dialog('story-sheet',T('narrate'));
 options.querySelector('.sheet-body').appendChild($('chat-preferences'));

 $('chat-depth-note').removeAttribute('role');$('chat-depth-note').hidden=true;
 const more=document.createElement('button');more.id='chat-more';more.type='button';more.innerHTML=icon('menu');more.setAttribute('aria-haspopup','dialog');$('page-guide').querySelector('.backline').appendChild(more);more.onclick=()=>options.showModal();
 const context=document.createElement('div');context.id='chat-context';context.className='chat-context';context.hidden=true;$('page-guide').querySelector('.backline').after(context);
 const logo=document.querySelector('.logo');logo.innerHTML='<svg viewBox="0 0 40 40" role="img" aria-label="DN"><path d="M9 9v22h6c14 0 14-22 0-22H9zm14 22V9l9 22V9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/></svg>';
 function pin(id){if(!M.A.some(a=>a.id===id))return;M.state.chatTopicId=null;M.state.chatArtifact=id;M.guideContext.artifact=id;syncContext();}
 function pinTopic(id){if(!M.D.some(d=>d.id===id))return;M.state.chatArtifact=null;M.state.chatTopicId=id;Object.assign(M.guideContext,{artifact:null,topic:id,recommended:[]});syncContext();}
 function clearPin(){M.state.chatTopicId=null;M.state.chatArtifact=null;Object.assign(M.guideContext,{artifact:null,topic:null,recommended:[],turns:[],activeIntent:null});syncContext();}
 function syncContext(){
  M.state.chatTopic='museum';const a=M.A.find(a=>a.id===M.state.chatArtifact),d=!a&&M.D.find(d=>d.id===M.state.chatTopicId),signature=(a?.id||d?.id||'')+M.state.lang;
  if(signature!==contextSignature){contextSignature=signature;context.hidden=!a&&!d;context.innerHTML=a||d?`<button type="button" data-context-open>${V.media(a?V.object(a):V.forTopic(d.id),{decorative:true})}<span class="context-title">${esc(T('context'))}: ${esc(a?M.aname(a):M.nm(d))}</span></button>${iconButton('close',`data-context-clear aria-label="${esc(T('clear'))}"`,'')}`:'';}
  renderStarter();
  if(d){M.guideContext.topic=d.id;const qs=[T('zoneQuestion'),T('zoneObjects'),T('zoneStory')];if([...$('guide-chips').children].map(b=>b.textContent).join('|')!==qs.join('|'))$('guide-chips').innerHTML=qs.map(q=>button(q,`data-chat-question="${esc(q)}"`)).join('');}
  if(a){M.guideContext.artifact=a.id;const qs=[T('eraQuestion'),T('materialQuestion'),T('storyQuestion')];if([...$('guide-chips').children].map(b=>b.textContent).join('|')!==qs.join('|'))$('guide-chips').innerHTML=qs.map(q=>button(q,`data-chat-question="${esc(q)}"`)).join('');}
 }
 function renderStarter(){
  const stack=document.querySelector('.assistant-row .assistant-stack');if(!stack)return;
  const previous=document.getElementById('guide-welcome-gallery');
  if(M.guideContext.turns.length){previous?.remove();return;}
  const ids=[...new Set([M.state.chatArtifact,'ma-nao','sung-than-cong','phu-dieu'].filter(Boolean))].slice(0,3),signature=M.state.lang+ids.join('|');
  if(previous?.dataset.signature===signature)return;
  previous?.remove();const gallery=document.createElement('div');gallery.id='guide-welcome-gallery';gallery.className='guide-welcome-gallery';gallery.dataset.signature=signature;
  gallery.innerHTML=`<h3>${esc(V.t('start'))}</h3><div class="visual-source-grid">${ids.map(id=>V.card(V.object(M.A.find(a=>a.id===id)),{question:true})).join('')}</div>`;stack.appendChild(gallery);
 }
 document.addEventListener('museum:question',()=>document.getElementById('guide-welcome-gallery')?.remove());
 context.addEventListener('click',e=>{if(e.target.closest('[data-context-clear]'))clearPin();else if(e.target.closest('[data-context-open]')&&M.state.chatArtifact)M.openArtifact(M.state.chatArtifact);else if(e.target.closest('[data-context-open]')&&M.state.chatTopicId)M.openArticle(M.state.chatTopicId);});
 new MutationObserver(syncContext).observe($('guide-chips'),{childList:true});
 function applyTerms(){
  for(const [key,term]of Object.entries({quiz:'quiz',profile:'journal',plan:'route',map:'qrMap',dataMode:'dataMode',meetMay:'quickAsk'}))document.querySelectorAll(`[data-v6="${key}"]`).forEach(e=>e.textContent=T(term));
  $('chat-more').setAttribute('aria-label',T('options'));$('chat-depth').textContent=T('detail');$('chat-speed-label').textContent=T('speed');
  $('reply-options').querySelector('h2').textContent=T('options');
  document.querySelectorAll('.tile-arrow,.hero-buttons .gold-btn>span:last-child').forEach(e=>{e.innerHTML=icon('chevron');});
  $('qr-manual-go').innerHTML=icon('chevron');$('filter-toggle')?.setAttribute('aria-label',T('filters'));
  const eyebrow=$('page-guide').querySelector('.heading .eyebrow');eyebrow.textContent=navigator.onLine?T('dataMode'):T('offline');
  syncContext();
 }
 let headerFrame=0,headerSettling=false;
 // Thu gọn header làm đổi chiều cao vùng cuộn và scrollTop. Không hiểu nhầm
 // chuyển động do bố cục này thành thao tác cuộn ngược của khách.
 function settleHeader(region){
  cancelAnimationFrame(headerFrame);headerSettling=true;let previousHeight=null,stableFrames=0;
  const sample=()=>{const height=document.querySelector('.top').getBoundingClientRect().height;lastScroll=region?.scrollTop||0;
   stableFrames=previousHeight!==null&&Math.abs(height-previousHeight)<.25?stableFrames+1:0;previousHeight=height;
   if(stableFrames>=2){headerSettling=false;headerFrame=0;return;}headerFrame=requestAnimationFrame(sample);
  };headerFrame=requestAnimationFrame(sample);
 }
 function immersive(){cancelAnimationFrame(headerFrame);headerSettling=false;document.body.dataset.page=M.state.page;document.body.classList.remove('header-collapsed');lastScroll=0;settleHeader(M.state.page==='catalog'?$('catalog-list'):document.querySelector('.page.active'));applyTerms();if(M.state.page==='guide')syncContext();}
 document.addEventListener('scroll',event=>{if(event.target!==document.querySelector('.page.active')&&event.target!==$('catalog-list')||['guide','scan'].includes(M.state.page)||document.activeElement?.matches('input,textarea'))return;const y=event.target.scrollTop;if(headerSettling){lastScroll=y;return;}if(Math.abs(y-lastScroll)>8){const collapsed=y>lastScroll&&y>80;lastScroll=y;if(document.body.classList.contains('header-collapsed')!==collapsed){document.body.classList.toggle('header-collapsed',collapsed);settleHeader(event.target);}}},{capture:true,passive:true});
 // Điểm mở chat và nghe kể được gắn vào hồ sơ đang xem.
 const actions=document.createElement('div');actions.id='artifact-ai-actions';actions.className='artifact-ai-actions';$('artifact-meta').before(actions);
 function artifactActions(){const a=M.A.find(a=>a.id===M.state.artifact);if(!a)return;actions.innerHTML=button(T('ask'),'data-ask-current','primary')+button(T('narrate'),'data-story-current')+button(T('mapDirections'),`data-map-current ${a.referenceOnly||(a.sourceSite||'site1')!=='site1'?'disabled':''}`)+`<span class="record-language">${esc(a.translationStatus==='automatic'&&M.state.lang!==a.sourceLanguage?T('autoTranslation'):a.imported&&!MuseumDataV6.artifacts[a.id]?T('originalLanguage'):'')}</span>`;}
 actions.addEventListener('click',e=>{if(e.target.closest('[data-ask-current]')){pin(M.state.artifact);M.nav('guide');$('chat-input').focus();}else if(e.target.closest('[data-story-current]'))openStory(M.state.artifact);else if(e.target.closest('[data-map-current]'))window.MuseumMapOpenTarget?.({kind:'artifact',id:M.state.artifact});});
 async function api(path,body,timeout=25000){
  const endpoint=M.getAIEndpoint();if(!endpoint)throw Error('not_configured');
  const url=new URL(endpoint);if(url.protocol!=='https:'||url.username||url.password)throw Error('unsafe_endpoint');url.pathname=url.pathname.replace(/\/(chat|story|identify|route|summary)\/?$/,'')+'/'+path;url.search='';url.hash='';
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
  try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'omit',signal:controller.signal,body:JSON.stringify(body)});if(!r.ok)throw Error('HTTP '+r.status);return await r.json();}finally{clearTimeout(timer);}
 }
 let storyId=null,storyVersion=0;
 function storyBody(a,text,mode,tone){const related=M.A.filter(b=>!b.referenceOnly&&b.id!==a.id&&(b.topic===a.topic||b.sourceSite===a.sourceSite)).slice(0,3);return `<p class="mode-label">${esc(T(mode==='generative'?'generated':'scripted'))}</p><div class="story-tones" role="group">${['child','visitor','deep'].map(k=>button(T(k),`data-story-tone="${k}" aria-pressed="${tone===k}"`)).join('')}</div><h3>${esc(M.aname(a))}</h3>${V.figure(V.object(a),{className:"story-photo",eager:true})}<p class="story-text"></p><div class="buttonrow">${button(T('narrate'),'data-story-speak','primary')}${button(T('close'),'data-story-stop')}</div><button class="story-source secondary" data-artifact="${esc(a.id)}">${esc(T('source'))}: ${esc(M.aname(a))}${icon('chevron')}</button><a class="source" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">${esc(T('readOriginal'))}${icon('arrowExternal')}</a><h3>${esc(T('related'))}</h3><div class="story-related-grid">${related.map(b=>V.card(V.object(b))).join('')}</div>`;}
 async function openStory(id,tone='visitor'){
  const a=M.A.find(a=>a.id===id);if(!a)return;storyId=id;const token=++storyVersion;const local=MuseumLearning.story(a,M.state.lang,tone),body=storySheet.querySelector('.sheet-body');
  const paint=(text,mode)=>{body.innerHTML=storyBody(a,text,mode,tone);body.querySelector('.story-text').textContent=text;};
  storySheet.querySelector('h2').textContent=T('narrate');paint(local,'data');if(!storySheet.open)storySheet.showModal();
  try{const r=await api('story',{artifact:id,language:M.state.lang,tone});if(token===storyVersion&&storySheet.open&&r.mode==='generative'&&r.recordId===id&&typeof r.answer==='string'&&r.source===a.url)paint(r.answer,'generative');}catch{/* Lời kể cục bộ ghi nhãn rõ ràng; không giả tạo sinh. */}
 }
 storySheet.addEventListener('close',()=>{storyVersion++;window.speechSynthesis?.cancel();});
 storySheet.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.storyTone)openStory(storyId,b.dataset.storyTone);if(b.hasAttribute('data-story-speak'))M.speakText(storySheet.querySelector('.story-text').textContent,b);if(b.hasAttribute('data-story-stop')){if('speechSynthesis'in window)speechSynthesis.cancel();}if(b.dataset.artifact){e.stopPropagation();storySheet.close();M.openArtifact(b.dataset.artifact);}if(b.dataset.storyRelated){storySheet.close();M.openArtifact(b.dataset.storyRelated);}});
 // Tìm kiếm luôn nằm ngoài vùng kết quả cuộn; các select được dùng lại trong sheet.
 const tools=document.createElement('div');tools.id='library-toolbar';tools.className='library-toolbar';$('catalog-input').closest('.text-input').after(tools);
 tools.innerHTML=button(T('filters'),'id="filter-toggle" aria-haspopup="dialog"')+button(T('list'),'id="library-layout" aria-pressed="false"')+'<div id="active-filters"></div>';
 document.body.classList.add('library-grid');
 function catalogTools(){
  const existing=$('catalog-sites');if(existing&&!filters.contains(existing))filters.querySelector('.sheet-body').appendChild(existing);
  $('filter-toggle').textContent=T('filters');$('library-layout').textContent=T(document.body.classList.contains('library-grid')?'list':'grid');
  filters.querySelector('h2').textContent=T('filters');
  $('active-filters').innerHTML=['library-institution','library-material','library-media'].map(id=>{const s=$(id);return s&&s.value!=='all'?`<button class="filter-chip" data-clear-filter="${id}">${esc(s.selectedOptions[0].textContent)}${icon('close')}</button>`:'';}).join('');
  const warning=$('page-catalog').querySelector('.catalog-warning');if(warning&&!$('catalog-source-note')){const d=document.createElement('details');d.id='catalog-source-note';d.innerHTML=`<summary>${icon('info')}<span>${esc(T('source'))}: Đà Nẵng / V&A / VNMH</span></summary>`;warning.before(d);d.appendChild(warning);}
 }
 $('filter-toggle').onclick=()=>{catalogTools();filters.showModal();};$('library-layout').onclick=()=>{document.body.classList.toggle('library-grid');$('library-layout').setAttribute('aria-pressed',String(!document.body.classList.contains('library-grid')));catalogTools();};
 filters.addEventListener('change',()=>{M.state.catalogScroll=0;catalogTools();});$('active-filters').addEventListener('click',e=>{const id=e.target.closest('[data-clear-filter]')?.dataset.clearFilter;if(id){$(id).value='all';$(id).dispatchEvent(new Event('change',{bubbles:true}));catalogTools();}});
 // Ba hành động được đưa lên trước hero; gợi ý dùng hồ sơ thật, không gọi model.
 const quick=document.createElement('div');quick.className='home-quick-actions';document.querySelector('.home-feature').before(quick);
 const homeRecords=document.createElement('section');homeRecords.id='home-records';document.querySelector('.home-feature').after(homeRecords);
 function homeUpdates(){
  // Chưa vào app thì không tải ảnh trang chủ nằm sau màn chọn ngôn ngữ.
  if(!M.state.confirmed)return;
  quick.innerHTML=button(T('quickAsk'),'data-go="guide"','primary')+button(T('scan'),'data-go="scan"')+button(T('route'),'data-go="plan"');
  const seen=MuseumProfile.getData().visits.filter(v=>v.key.startsWith('artifact:')).slice(0,2).map(v=>M.A.find(a=>a.id===v.key.split(':')[1])).filter(Boolean);
  const local=M.A.filter(a=>!a.referenceOnly&&(a.sourceSite||'site1')==='site1');const today=local[Math.floor(Date.now()/86400000)%local.length];
  const card=a=>`<button class="home-record" data-artifact="${esc(a.id)}"><img src="${esc(a.image)}" loading="lazy" width="76" height="76" alt=""><span><b>${esc(M.aname(a))}</b><small>${esc(T('why'))}</small></span>${icon('chevron')}</button>`;
  homeRecords.innerHTML=(seen.length?`<h2>${esc(T('resume'))}</h2>${seen.map(card).join('')}`:'')+`<h2>${esc(T('today'))}</h2>${card(today)}`;V.decorateHome();
 }
 // QR trong nhà; GPS chỉ còn link chỉ đường ngoài trời, không tải bản đồ bên thứ ba.
 const qrInfo=document.createElement('details');qrInfo.className='map-explanation illustration-details';qrInfo.innerHTML=`<summary>${icon('info')}<span>${esc(T('mapNote'))}</span></summary><p>${esc(T('qrHelp'))}</p>`;const alert=$('page-map').querySelector('.map-alert');alert.replaceWith(qrInfo);
 const directions=document.createElement('a');directions.className='secondary directions-link';directions.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Bảo tàng Đà Nẵng 31 Trần Phú Đà Nẵng');directions.target='_blank';directions.rel='noopener noreferrer';$('page-map').querySelector('.scroll').appendChild(directions);
 // Camera chỉ khởi động khi vào màn quét; không upload khung hình QR.
 const cameraError=document.createElement('div');cameraError.id='camera-help';cameraError.className='camera-help';cameraError.hidden=true;$('scan-video-box').after(cameraError);
 const flash=document.createElement('button');flash.id='scan-torch';flash.type='button';flash.className='secondary';flash.setAttribute('aria-describedby','scan-torch-status');$('scan-start').after(flash);
 const flashStatus=document.createElement('p');flashStatus.id='scan-torch-status';flashStatus.className='muted';flashStatus.setAttribute('role','status');flash.closest('.buttonrow').after(flashStatus);
 function paintCameraControls(){
  const pending=cameraPhase==='starting',ready=cameraPhase==='active';
  $('scan-start').hidden=cameraPhase!=='error';$('scan-start').textContent=T('retry');$('scan-stop').hidden=true;
  flash.hidden=false;flash.disabled=!ready||!torchSupported||torchBusy;flash.setAttribute('aria-pressed',String(torch));
  flash.innerHTML=icon(torch?'flash':'flashOff')+`<span>${esc(T(torch?'flashOn':'flashOff'))}</span>`;
  const note=pending?T('cameraStarting'):ready&&!torchSupported?T('flashUnsupported'):'';
  if(flashStatus.textContent!==note)flashStatus.textContent=note;flashStatus.hidden=!note;
  if(pending&&$('scan-state').textContent!==T('cameraStarting'))$('scan-state').textContent=T('cameraStarting');
  cameraError.hidden=cameraPhase!=='error';
  if(!cameraError.hidden)cameraError.textContent=T('cameraDenied');
 }
 function startingCamera(){if(M.state.page!=='scan')return;cameraPhase='starting';streamTrack=null;torch=false;torchSupported=false;torchBusy=false;paintCameraControls();}
 // Lõi vẫn giữ listener mở camera; capture chỉ cập nhật giao diện trước lời xin quyền.
 $('scan-start').addEventListener('click',startingCamera,{capture:true});
 flash.onclick=async()=>{
  if(cameraPhase!=='active'||!streamTrack||!torchSupported||torchBusy)return;
  const track=streamTrack,next=!torch;torchBusy=true;paintCameraControls();
  try{await track.applyConstraints({advanced:[{torch:next}]});if(streamTrack===track&&M.state.page==='scan')torch=next;}
  catch{if(streamTrack===track)torchSupported=false;}
  finally{if(streamTrack===track&&M.state.page==='scan'){torchBusy=false;paintCameraControls();}}
 };
 const manual=document.createElement('details');manual.className='manual-code';manual.innerHTML='<summary>'+esc(T('enterCode'))+'</summary>';const manualInput=$('qr-manual').closest('.text-input');manualInput.before(manual);manual.appendChild(manualInput);
 const guide=document.createElement('details');guide.className='scan-guide illustration-details';guide.innerHTML=`<summary>${icon('info')}<span>${esc(T('mapNote'))}</span></summary><p class="scan-diagram-note">${esc(T('qrHelp'))}</p>`;const intro=$('page-scan').querySelector('.scroll>.card');intro.before(guide);guide.appendChild(intro);guide.appendChild($('page-scan').querySelector('[data-v6=cameraPrivacy]'));
 const debugQR=new URLSearchParams(location.search).get('debug')==='1';$('scan-demo-btn').hidden=!debugQR;if(!debugQR)$('qr-codes').hidden=true;
 document.addEventListener('museum:camerastarting',startingCamera);
 document.addEventListener('museum:camera',e=>{
  if(M.state.page!=='scan'||e.detail.stream!==M.state.scan)return;
  streamTrack=e.detail.stream.getVideoTracks()[0];torch=false;torchBusy=false;torchSupported=false;cameraPhase='active';
  try{torchSupported=Boolean(streamTrack?.getCapabilities?.().torch&&streamTrack?.applyConstraints);}catch{/* Một số trình duyệt không cho đọc khả năng đèn. */}
  paintCameraControls();
 });
 document.addEventListener('museum:cameraerror',()=>{if(M.state.page!=='scan')return;streamTrack=null;torch=false;torchSupported=false;torchBusy=false;cameraPhase='error';paintCameraControls();});
 // Nhiệm vụ nhỏ, tiến độ không trộn với số phòng/tọa độ thực tế.
 const key='museum_discovery_v7';let discovery={version:1,seen:[],active:0,earned:[]};
 try{const stored=JSON.parse(M.sv(key,'null'));if(stored?.version===1)discovery={...discovery,...stored};}catch{}
 if(!Array.isArray(discovery.seen))discovery.seen=[];
 discovery.seen=[...new Set([...discovery.seen,...MuseumProfile.getData().visits.filter(v=>v.key.startsWith('artifact:')).map(v=>v.key.split(':')[1])])].filter(id=>M.A.some(a=>a.id===id));
 const locals=M.A.filter(a=>!a.referenceOnly&&(a.sourceSite||'site1')==='site1');
 const definitions=[locals.filter(a=>['doc-lap','chien-tranh'].includes(a.topic)).slice(0,5),locals.filter(a=>['dan-toc','van-hoa-quang'].includes(a.topic)).slice(0,3),locals.slice(0,3)].map(arr=>arr.length>=3?arr:locals.slice(0,3));
 discovery.active=Number.isInteger(discovery.active)&&definitions[discovery.active]?discovery.active:0;discovery.earned=Array.isArray(discovery.earned)?discovery.earned.filter(n=>Number.isInteger(n)&&definitions[n]):[];
 function writeDiscovery(){M.persist(key,JSON.stringify(discovery));}
 function missionProgress(){const list=definitions[discovery.active];return{done:list.filter(a=>discovery.seen.includes(a.id)).length,total:list.length};}
 function renderMissions(){
  const host=document.querySelector('#page-profile .personal-scroll');if(!host)return;
  let section=$('discovery-missions');if(!section){section=document.createElement('section');section.id='discovery-missions';section.className='card';host.querySelector('.personal-intro').after(section);}
  const progress=missionProgress(),list=definitions[discovery.active],names=MuseumLexicon.all.missionNames[{vi:0,en:1,ko:2,zh:3}[M.state.lang]];
  section.innerHTML=`<div class="mission-heading"><img src="ai-robot.webp" alt="Mây" width="52" height="52"><div><span class="eyebrow">${esc(T('missions'))}</span><h2>${esc(names[discovery.active])}</h2></div><span role="img" class="mission-medal ${progress.done===progress.total?'earned':''}" aria-label="${esc(T('missions'))}"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 4 6 12 14 2-10 10 3 14-13-7-13 7 3-14L4 18l14-2Z" fill="currentColor"/><circle cx="24" cy="23" r="7" fill="var(--paper)"/></svg></span></div><p>${esc(T('missionIntro'))}</p><label for="mission-select">${esc(T('choose'))}</label><select id="mission-select">${names.map((n,i)=>`<option value="${i}" ${i===discovery.active?'selected':''}>${esc(n)}</option>`).join('')}</select><div class="mission-progress"><b>${progress.done} / ${progress.total}</b><progress max="${progress.total}" value="${progress.done}"></progress></div><div class="mission-list">${list.map(a=>`<button class="mission-record ${discovery.seen.includes(a.id)?'done':''}" data-artifact="${esc(a.id)}">${V.media(V.object(a),{className:'mission-thumb',decorative:true})}<span class="mission-copy"><b>${esc(M.aname(a))}</b><small>${esc(M.ameta(a).era)}</small></span><span class="mission-status" aria-hidden="true">${icon(discovery.seen.includes(a.id)?'check':'chevron')}</span></button>`).join('')}</div><p class="mission-end">${esc(progress.done===progress.total?T('earned'):T('remaining'))}</p>`;
 }
 document.addEventListener('change',e=>{if(e.target.id==='mission-select'){discovery.active=Number(e.target.value);writeDiscovery();renderMissions();}});
 document.addEventListener('museum:profileclear',()=>{discovery={version:1,seen:[],active:0,earned:[]};writeDiscovery();renderMissions();});
 function visit(){if(M.state.page!=='artifact')return;const id=M.state.artifact;if(!discovery.seen.includes(id)){discovery.seen.push(id);writeDiscovery();}const p=missionProgress();if(p.done===p.total&&!discovery.earned.includes(discovery.active)){discovery.earned.push(discovery.active);writeDiscovery();window.MuseumAnalytics?.record('mission',String(discovery.active));M.toast(T('earned'));document.body.classList.add('mission-earned');setTimeout(()=>document.body.classList.remove('mission-earned'),1200);}}
 function sourceCards(answer){
  const urls=[answer.source,...(answer.sources||[]).map(s=>s.url)].filter(Boolean),ids=(answer.cards||[]).map(id=>String(id).replace(/^artifact:/,''));
  const records=M.A.filter(a=>urls.includes(a.url)||(!urls.length&&ids.includes(a.id)));
  const topicIds=(answer.cards||[]).map(id=>String(id).replace(/^topic:/,''));
  const selected=M.D.filter(d=>topicIds.includes(d.id)||d.id===M.guideContext.topic&&urls.includes(d.source));
  const views=[...records.slice(0,5).map(a=>V.object(a)),...selected.slice(0,3).map(d=>V.forTopic(d.id))].filter(Boolean);
  const log=$('messages'),follow=log.scrollHeight-log.clientHeight-log.scrollTop<120;
  const row=[...document.querySelectorAll('.assistant-row .assistant-stack')].at(-1);if(!row||!views.length)return;
  row.querySelector('.verified-source-cards')?.remove();const el=document.createElement('div');el.className='verified-source-cards';el.dataset.count=views.length;
  el.innerHTML=`<small>${esc(urls.length?T('sources'):V.t('start'))}</small>`+views.map(v=>V.card(v)).join('');row.appendChild(el);
  if(follow)requestAnimationFrame(()=>{log.scrollTop=log.scrollHeight;});
 }
 document.addEventListener('museum:reply',e=>{sourceCards(e.detail.answer);syncContext();});
 // Cho đổi/bỏ điểm trong lộ trình đang có; lý do tạo sinh chỉ hiện khi backend trả hợp lệ.
 function routeTools(){
  const el=$('plan-result');el.querySelectorAll('.route-stop').forEach((row,i)=>{
   if(row.querySelector('.route-editor'))return;const id=M.state.route?.ids[i],d=M.D.find(d=>d.id===id);if(!d)return;
   row.insertAdjacentHTML('afterbegin',V.figure(V.forTopic(id,true),{className:'route-picture'}));
   const details=document.createElement('details');details.className='route-editor';
   details.innerHTML=`<summary>${esc(V.t('edit'))}</summary><div class="route-edit"><label><span class="sr-only">${esc(T('route'))}</span><select data-route-replace="${esc(id)}">${M.D.map(d=>`<option value="${esc(d.id)}" ${d.id===id?'selected':''}>${esc(M.nm(d))}</option>`).join('')}</select></label>${iconButton('close',`data-route-remove="${esc(id)}" aria-label="${esc(T('close'))}"`)}</div>`;row.appendChild(details);
   const reason=document.createElement('p');reason.className='route-reason';reason.textContent=M.state.route?.reasons?.[id]||M.ds(d);row.appendChild(reason);
  });
  if(el.querySelector('.route-stop')&&!el.querySelector('.route-method-note')){const p=document.createElement('p');p.className='route-method-note';p.textContent=T('routeWhy');el.appendChild(p);}
 }
 new MutationObserver(routeTools).observe($('plan-result'),{childList:true});
 document.addEventListener('click',e=>{const b=e.target.closest('[data-route-remove]');if(!b||!M.state.route)return;const id=b.dataset.routeRemove;M.state.route.ids=M.state.route.ids.filter(x=>x!==id);M.state.route.done=M.state.route.done.filter(x=>x!==id);if(!M.state.route.ids.length)M.state.route=null;M.saveRoute();M.renderRoute();});
 document.addEventListener('change',e=>{const old=e.target.dataset.routeReplace;if(!old||!M.state.route)return;if(M.state.route.ids.includes(e.target.value)){e.target.value=old;return;}M.state.route.ids=M.state.route.ids.map(x=>x===old?e.target.value:x);M.state.route.done=M.state.route.done.filter(x=>x!==old);M.saveRoute();M.renderRoute();});
 const routeAI=document.createElement('button');routeAI.id='route-ai';routeAI.className='secondary';$('plan-build').after(routeAI);
 routeAI.onclick=async()=>{M.buildRoute();routeAI.disabled=true;try{const r=await api('route',{language:M.state.lang,time:M.state.time,interests:[...M.state.interests]});if(r.mode==='generative'&&Array.isArray(r.stops)&&r.stops.length&&r.stops.every(s=>M.D.some(d=>d.id===s.id)&&typeof s.reason==='string')){M.state.route={...M.state.route,ids:[...new Set(r.stops.map(s=>s.id))],done:[],reasons:Object.fromEntries(r.stops.map(s=>[s.id,s.reason]))};M.saveRoute();M.renderRoute();}}catch{M.toast(T('dataMode'));}finally{routeAI.disabled=false;}};
 function labels(){$('floor-svg').setAttribute('aria-label',T('mapNote'));applyTerms();artifactActions();catalogTools();homeUpdates();renderMissions();directions.innerHTML=esc(T('directions'))+icon('arrowExternal');$('page-map').querySelector('h1').textContent=T('qrMap');qrInfo.querySelector('summary').innerHTML=icon('info')+`<span>${esc(T('mapNote'))}</span>`;qrInfo.querySelector('p').textContent=T('qrHelp');guide.querySelector('summary').innerHTML=icon('info')+`<span>${esc(T('mapNote'))}</span>`;guide.querySelector('.scan-diagram-note').textContent=T('qrHelp');manual.querySelector('summary').textContent=T('enterCode');routeAI.textContent=T('aiRoute');paintCameraControls();}
 window.addEventListener('online',applyTerms);window.addEventListener('offline',applyTerms);
 document.addEventListener('museum:language',()=>{contextSignature='';labels();});
 document.addEventListener('museum:navigate',()=>{
  immersive();visit();
  if(M.state.page==='catalog'){catalogTools();requestAnimationFrame(()=>{$('catalog-list').scrollTop=M.state.catalogScroll||0;});}
  if(M.state.page==='home')homeUpdates();if(M.state.page==='map')V.decorateMap();if(M.state.page==='floors')V.decorateFloors();if(M.state.page==='profile')renderMissions();if(M.state.page==='artifact')artifactActions();
  if(M.state.page==='scan'){startingCamera();M.openCamera();}
  else{streamTrack=null;torch=false;torchSupported=false;torchBusy=false;cameraPhase='idle';paintCameraControls();}
 });
 new MutationObserver(()=>{if(!$('discovery-missions'))renderMissions();}).observe($('page-profile'),{childList:true});
 new MutationObserver(V.decorateMap).observe($('map-zone-list'),{childList:true});
 new MutationObserver(V.decorateFloors).observe($('floor-list'),{childList:true});
 V.decorateMap();V.decorateFloors();routeTools();
 window.MuseumDiscovery={recordSimulatedVisit:(topicId,artifactId)=>{
  const a=locals.find(a=>a.id===artifactId&&a.topic===topicId);
  MuseumProfile.recordSimulated(topicId,a?.id);
  if(a&&!discovery.seen.includes(a.id)){discovery.seen.push(a.id);writeDiscovery();}
  const p=missionProgress();if(p.done===p.total&&!discovery.earned.includes(discovery.active)){discovery.earned.push(discovery.active);writeDiscovery();M.toast(T('earned'));}
 },getData:()=>structuredClone(discovery),progress:missionProgress,definitions:()=>definitions.map(list=>list.map(a=>a.id))};
 window.MuseumExperience={pinTopic, pin,clearPin,openStory,api,dialog,t:T,renderMissions};
 immersive();labels();
})();
