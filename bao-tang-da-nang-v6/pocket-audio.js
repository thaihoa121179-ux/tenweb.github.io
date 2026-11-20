/* Lời kể soạn sẵn cho ba hiện vật đinh. Những hồ sơ còn lại giữ luồng cũ.
   Không gửi tên khách hay nội dung lên dịch vụ TTS khi dùng ứng dụng. */
(()=>{
 'use strict';
 const M=Museum,E=MuseumPocketAudioEngine,esc=M.esc,I=n=>MuseumIcons.svg(n),anchors=new Set(['hv-khuyen-tai-ba-mau-f7a824','phu-dieu','sung-than-cong']);
 const labels={
  narrate:['Nghe hiện vật kể','Let the object tell its story','유물 이야기 듣기','听文物讲故事'],
  quick:['Nhanh 30 giây','Quick · 30 sec','빠르게 · 30초','快速 · 30秒'],kids:['Mây kể trẻ em','Mây for children','어린이 이야기','小云讲给孩子'],deep:['Đọc chuyên sâu','In depth','심층 해설','深入了解'],
  prepared:['Biên soạn từ hồ sơ có nguồn','Adapted from the sourced record','출처가 있는 기록을 바탕으로 구성','根据有来源的档案编写'],
  translated:['Dịch tự động · Chưa hiệu đính','Automatic translation · Not reviewed','자동 번역 · 미검수','自动翻译 · 未审校'],
  play:['Nghe lời kể','Play narration','해설 재생','播放讲述'],pause:['Tạm dừng','Pause','일시 정지','暂停'],resume:['Nghe tiếp','Resume','계속 듣기','继续播放'],close:['Đóng trình phát','Close player','플레이어 닫기','关闭播放器'],
  transcript:['Xem lời kể và đổi giọng','Read narration and change style','해설 읽기 및 스타일 변경','阅读讲述并切换风格'],
  loading:['Đang mở âm thanh…','Opening audio…','오디오 여는 중…','正在打开音频…'],playing:['Đang phát','Playing','재생 중','正在播放'],paused:['Đã tạm dừng','Paused','일시 정지됨','已暂停'],ended:['Đã nghe xong','Finished','재생 완료','播放完毕'],
  blocked:['Chạm nút nghe để bật âm thanh','Tap Play to enable audio','재생을 눌러 오디오를 켜세요','点击播放以开启声音'],error:['Chưa phát được. Bạn có thể đọc lời kể và thử lại.','Playback unavailable. Read the narration or try again.','재생할 수 없어요. 해설을 읽거나 다시 시도하세요.','暂时无法播放，可以阅读讲述或重试。'],
  file:['MP3 có sẵn','Prepared MP3','준비된 MP3','预置 MP3'],device:['Giọng đọc của thiết bị','Device speech voice','기기 음성','设备语音'],
  progress:['Tiến trình âm thanh','Audio progress','오디오 진행','音频进度'],source:['Hồ sơ nguồn','Source record','출처 기록','来源档案'],open:['Mở hồ sơ','Open record','기록 열기','打开档案'],
  wait:['Đang tải lời kể…','Loading narration…','해설 불러오는 중…','正在加载讲述…'],loadError:['Chưa tải được lời kể. Hãy thử lại.','Could not load narration. Please retry.','해설을 불러오지 못했어요. 다시 시도하세요.','无法加载讲述，请重试。'],retry:['Thử lại','Retry','다시 시도','重试'],
  audioHint:['Chạm bắt đầu để bật lời kể ở 3 hiện vật.','Tap Start to enable narration at 3 objects.','시작을 누르면 유물 3점의 해설이 켜져요.','点击开始，为3件文物开启讲述。'],
  player:['Trình phát bỏ túi','Pocket audio player','휴대용 오디오 플레이어','口袋播放器'],
 };
 const T=k=>labels[k][{vi:0,en:1,ko:2,zh:3}[M.state.lang]??0],asset=p=>new URL(p,window.MuseumAssetBaseURL||document.baseURI).href;
 const choice=new Map(),selected=id=>choice.get(id)||'quick';let data=null,pending=null,renderGeneration=0,lastMini='',armedSession=null,mapGeneration=0,playRequest=0,navigationGeneration=0;const seen=new Set();
 const section=document.createElement('section');section.id='prepared-narration';section.className='prepared-narration';section.hidden=true;document.getElementById('artifact-text').before(section);
 const mini=document.createElement('section');mini.id='pocket-player';mini.className='pocket-player';mini.hidden=true;
 mini.innerHTML=`<div class="pocket-player-main"><button class="pocket-track" id="pocket-transcript"><img width="48" height="48" alt=""><span><b id="pocket-title"></b><small id="pocket-caption"></small></span></button><button id="pocket-toggle"></button><button id="pocket-close">${I('close')}</button></div><div class="pocket-progress"><label class="sr-only" for="pocket-seek"></label><input type="range" id="pocket-seek" min="0" max="1000" value="0" step="1"><output id="pocket-time" for="pocket-seek"></output></div><p id="pocket-status" role="status" aria-live="polite"></p>`;
 document.body.appendChild(mini);const spacer=document.createElement('div');spacer.id='pocket-spacer';spacer.hidden=true;document.querySelector('.app>.nav').before(spacer);
 const dialog=document.createElement('dialog');dialog.id='pocket-dialog';dialog.className='pocket-dialog';dialog.innerHTML='<div class="pocket-dialog-head"><h2></h2><button id="pocket-dialog-close"></button></div><div id="pocket-dialog-body"></div>';document.body.appendChild(dialog);
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});dialog.querySelector('#pocket-dialog-close').onclick=()=>dialog.close();
 const $=id=>document.getElementById(id),put=(e,value)=>{if(e.textContent!==value)e.textContent=value;},clock=n=>Math.floor(Math.max(0,n||0)/60)+':'+String(Math.floor(Math.max(0,n||0)%60)).padStart(2,'0');
 const engine=E.create({asset,onChange:paint});
 async function ready(){
  if(data)return data;if(pending)return pending;const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),MuseumConfig.assetTimeoutMs||10000);
  pending=fetch(asset('./data/demo-narrations.json'),{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('narration_load');return r.json();}).then(raw=>{data=E.validate(raw,M.A);return data;}).finally(()=>{clearTimeout(timer);pending=null;});return pending;
 }
 function getTrack(id,persona=selected(id)){const t=E.track(data,M.A,id,M.state.lang,persona);return t?{...t,artist:'Mây · '+T(persona)}:null;}
 function audioActive(s){return ['loading','playing'].includes(s.status);}
 function syncButtons(){const s=engine.getState();document.querySelectorAll('[data-pocket-play]').forEach(b=>{const same=s.track?.key===getTrack(b.dataset.pocketPlay)?.key,playing=same&&audioActive(s),label=T(playing?'pause':same&&s.status==='paused'?'resume':'play');if(b.dataset.audioLabel!==label){b.dataset.audioLabel=label;b.innerHTML=I(playing?'pause':'play')+'<span>'+esc(label)+'</span>';}b.setAttribute('aria-pressed',String(playing));});}
 function positionMini(){
  const slot=M.state.page==='map'&&window.MuseumPresentationRequested?$('demo-audio-slot'):null;
  if(slot){if(mini.parentNode!==slot)slot.appendChild(mini);mini.classList.add('is-inline');}
  else{if(mini.parentNode!==document.body)document.body.appendChild(mini);mini.classList.remove('is-inline');}
  const show=!!engine.getState().track&&M.state.confirmed&&!['guide','scan'].includes(M.state.page)&&(M.state.page!=='map'||!!slot);
  mini.hidden=!show;spacer.hidden=!show||!!slot;document.body.classList.toggle('pocket-docked',show&&!slot);
  if(show&&!slot){const nav=document.querySelector('.app>.nav').getBoundingClientRect(),height=mini.getBoundingClientRect().height;document.documentElement.style.setProperty('--pocket-bottom',Math.max(0,innerHeight-nav.top)+'px');spacer.style.height=(height+12)+'px';}
 }
 let sizing=false;new ResizeObserver(()=>{if(sizing)return;sizing=true;requestAnimationFrame(()=>{sizing=false;positionMini();});}).observe(mini);
 window.addEventListener('resize',positionMini);window.visualViewport?.addEventListener('resize',positionMini);
 function paint(s=engine.getState()){
  mini.setAttribute('aria-label',T('player'));
  if(s.track){const key=s.track.key+':'+M.state.lang;if(key!==lastMini){lastMini=key;mini.querySelector('img').setAttribute('src',s.track.artwork);put($('pocket-title'),s.track.title);}
   const elapsed=s.mode==='file'&&s.duration>0?clock(s.currentTime)+' / '+clock(s.duration):T('device');put($('pocket-caption'),T(s.track.persona)+' · '+elapsed);
   const active=audioActive(s),label=T(active?'pause':s.status==='paused'?'resume':'play'),visual=active?'pause':'play';if($('pocket-toggle').dataset.visual!==visual){$('pocket-toggle').dataset.visual=visual;$('pocket-toggle').innerHTML=I(visual);}$('pocket-toggle').setAttribute('aria-label',label);$('pocket-toggle').setAttribute('aria-pressed',String(active));
   $('pocket-seek').disabled=!s.seekable;if(document.activeElement!==$('pocket-seek'))$('pocket-seek').value=String(s.seekable?Math.round(s.currentTime/s.duration*1000):0);$('pocket-seek').setAttribute('aria-valuetext',elapsed);put($('pocket-time'),elapsed);
   const status=s.status==='blocked'?T('blocked'):s.status==='error'?T('error'):T(s.status==='idle'?'paused':s.status)+' · '+T(s.mode==='speech'?'device':'file');put($('pocket-status'),status);
  }
  $('pocket-transcript').setAttribute('aria-label',T('transcript')+(s.track?' · '+s.track.title:''));$('pocket-close').setAttribute('aria-label',T('close'));mini.querySelector('label[for=pocket-seek]').textContent=T('progress');syncButtons();positionMini();
 }
 $('pocket-toggle').onclick=()=>audioActive(engine.getState())?engine.pause():engine.play();$('pocket-close').onclick=()=>engine.clear();
 $('pocket-seek').oninput=e=>{const s=engine.getState();engine.seek(Number(e.target.value)/1000*s.duration);};
 $('pocket-transcript').onclick=()=>{const id=engine.getState().track?.artifactId;if(id)openNarration(id,true);};
 function buildNarration(host,id){
  const t=getTrack(id);if(!t)return;const buildKey=id+':'+M.state.lang,view=MuseumVisuals.object(M.A.find(a=>a.id===id)),photo=host.id==='pocket-dialog-body'&&view?MuseumVisuals.media({...view,image:'./'+view.image},{eager:true}):'';
  if(host.dataset.buildKey!==buildKey){host.dataset.buildKey=buildKey;host.innerHTML=`<div class="prepared-head"><img src="./ai-robot.webp" width="48" height="48" alt=""><div><h2>${esc(T('narrate'))}</h2><small>${esc(T('prepared'))}</small></div></div>${photo}<div class="prepared-personas" role="group" aria-label="${esc(T('narrate'))}">${E.personas.map(p=>`<button type="button" data-pocket-persona="${p}" data-pocket-id="${esc(id)}">${esc(T(p))}</button>`).join('')}</div><p class="prepared-text"></p><p class="prepared-translation" ${M.state.lang==='vi'?'hidden':''}>${esc(T('translated'))}</p><div class="prepared-actions"><button class="primary" data-pocket-play="${esc(id)}"></button><a href="${esc(t.source)}" target="_blank" rel="noopener noreferrer">${esc(T('source'))}${I('arrowExternal')}</a></div>`;}
  host.querySelectorAll('[data-pocket-persona]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pocketPersona===selected(id))));
  const text=host.querySelector('.prepared-text');if(text.textContent!==t.text){text.textContent=t.text;if(!matchMedia('(prefers-reduced-motion: reduce)').matches)text.animate?.([{opacity:.25,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:180});}
  syncButtons();
 }
 async function renderArtifact(){
  const id=M.state.artifact,token=++renderGeneration,show=M.state.page==='artifact'&&anchors.has(id);section.hidden=!show;document.getElementById('page-artifact').classList.remove('has-prepared-narration');
  if(!show)return;
  if(!data){section.textContent=T('wait');section.setAttribute('aria-busy','true');}
  try{await ready();if(token!==renderGeneration||M.state.page!=='artifact'||M.state.artifact!==id)return;section.removeAttribute('aria-busy');section.hidden=false;buildNarration(section,id);document.getElementById('page-artifact').classList.add('has-prepared-narration');}
  catch{if(token!==renderGeneration)return;section.removeAttribute('aria-busy');section.innerHTML=`<p role="status">${esc(T('loadError'))}</p><button data-pocket-retry>${esc(T('retry'))}</button>`;}
 }
 function playArtifact(id,options={}){
  if(!anchors.has(id))return false;
  const request=++playRequest,language=M.state.lang;
  // Mở khóa ngay trong thao tác chạm, trước mọi await tải JSON.
  if(options.gesture!==false&&!data)engine.unlock();
  const run=()=>{if(request!==playRequest||language!==M.state.lang)return;const t=getTrack(id);if(!t)return;const s=engine.getState();if(s.track?.key===t.key&&audioActive(s)&&!options.auto)engine.pause();else engine.play({...t,origin:options.auto?'demo':'artifact'});};
  if(data)run();else ready().then(run).catch(()=>M.toast(T('loadError')));return true;
 }
 async function openNarration(id,popup=false,persona){
  if(!anchors.has(id))return;if(persona&&E.personas.includes(persona))choice.set(id,persona);
  const generation=navigationGeneration;
  try{await ready();if(generation!==navigationGeneration)return;if(M.state.page==='artifact'&&M.state.artifact===id&&!popup){await renderArtifact();if(generation!==navigationGeneration)return;section.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});return;}
   const body=$('pocket-dialog-body');buildNarration(body,id);dialog.querySelector('h2').textContent=getTrack(id).title;$('pocket-dialog-close').innerHTML=I('close');$('pocket-dialog-close').setAttribute('aria-label',T('close'));dialog.setAttribute('aria-label',getTrack(id).title);if(!dialog.open)dialog.showModal();
  }catch{M.toast(T('loadError'));}
 }
 document.addEventListener('click',e=>{
  if(e.target.closest('[data-pocket-retry]')){section.dataset.buildKey='';renderArtifact();return;}
  const play=e.target.closest('[data-pocket-play]');if(play){playArtifact(play.dataset.pocketPlay);return;}
  const b=e.target.closest('[data-pocket-persona]');if(!b)return;const id=b.dataset.pocketId,persona=b.dataset.pocketPersona;if(!anchors.has(id)||!E.personas.includes(persona))return;
  const s=engine.getState(),same=s.track?.artifactId===id,wasPlaying=same&&audioActive(s);choice.set(id,persona);
  if(section.dataset.buildKey===id+':'+M.state.lang)buildNarration(section,id);const body=$('pocket-dialog-body');if(body.dataset.buildKey===id+':'+M.state.lang)buildNarration(body,id);
  if(same){const t=getTrack(id);engine.select({...t,origin:s.track.origin});if(wasPlaying)engine.play();}
 });
 function beforeNavigate(page){playRequest++;navigationGeneration++;if(['guide','scan','map'].includes(page))engine.pause();else engine.pauseSpeech();}
 function pauseForOtherAudio(){const s=engine.getState(),wasSpeaking=s.mode==='speech'&&audioActive(s);engine.pause();return wasSpeaking;}
 document.addEventListener('museum:navigate',()=>{if(dialog.open)dialog.close();renderArtifact();positionMini();if(M.state.page==='map'&&window.MuseumPresentationRequested)ready().catch(()=>{});});
 document.addEventListener('museum:language',()=>{playRequest++;navigationGeneration++;engine.clear();armedSession=null;mapGeneration++;section.dataset.buildKey='';$('pocket-dialog-body').dataset.buildKey='';if(dialog.open)dialog.close();lastMini='';renderArtifact();paint();});
 document.addEventListener('museum:demoview',positionMini);
 document.addEventListener('museum:demostart',e=>{mapGeneration++;armedSession=e.detail.sessionId;engine.pause();engine.unlock();ready().catch(()=>{});});
 document.addEventListener('museum:demoarrival',e=>{
  const d=e.detail,key=d.sessionId+':'+d.stopId;if(!d.featured||!anchors.has(d.artifactId)||d.sessionId!==armedSession||seen.has(key)||document.hidden)return;
  seen.add(key);const token=mapGeneration;ready().then(()=>{if(token!==mapGeneration||document.hidden||M.state.page!=='map'||!window.MuseumPresentationRequested)return;playArtifact(d.artifactId,{auto:true,gesture:false});}).catch(()=>M.toast(T('loadError')));
 });
 document.addEventListener('museum:demopause',e=>{if(document.hidden||e.detail.reason==='leave')engine.pauseSpeech();else engine.pause();});
 for(const name of ['seek','reset'])document.addEventListener('museum:demo'+name,()=>{mapGeneration++;if(engine.getState().track?.origin==='demo')engine.clear();if(name==='reset'){armedSession=null;seen.clear();}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)engine.pauseSpeech();});window.addEventListener('pagehide',()=>engine.pause());
 window.MuseumPocketAudio=Object.freeze({ready,supports:id=>anchors.has(id),playArtifact,openNarration,beforeNavigate,pauseForOtherAudio,engine,labels,getState:()=>({...engine.getState(),ready:!!data,armedSession}),hint:()=>T('audioHint')});
 renderArtifact();paint();if(M.state.page==='map'&&window.MuseumPresentationRequested)ready().catch(()=>{});
})();
