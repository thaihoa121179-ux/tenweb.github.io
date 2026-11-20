/* Một audio element dùng suốt phiên để giữ quyền phát trên iOS.
   Engine không phụ thuộc DOM; adapter giả lập dùng để kiểm tra race/fallback. */
((root)=>{
 'use strict';
 const languages=['vi','en','ko','zh'],personas=['quick','kids','deep'];
 function validate(raw,artifacts){
  if(raw?.schemaVersion!==1||!Array.isArray(raw.records)||raw.records.length!==3)throw Error('narration_schema');
  const expected=new Set(['hv-khuyen-tai-ba-mau-f7a824','phu-dieu','sung-than-cong']),ids=new Set();
  for(const r of raw.records){const a=artifacts.find(a=>a.id===r.artifactId);
   if(!a||!expected.has(a.id)||ids.has(a.id)||r.source!==a.url||a.referenceOnly||(a.sourceSite||'site1')!=='site1')throw Error('narration_source');ids.add(a.id);
   for(const lang of languages){if(typeof r.names?.[lang]!=='string'||!r.names[lang].trim())throw Error('narration_language');
    for(const persona of personas){const s=r.stories?.[lang]?.[persona];if(typeof s?.text!=='string'||s.text.length<40||s.text.length>4000||/[<>]/.test(s.text))throw Error('narration_text');
     if(s.audio&&(!/^\.\/audio\/[a-z0-9-]+\.mp3$/.test(s.audio)||!Number.isFinite(s.durationSeconds)||s.durationSeconds<=0||s.durationSeconds>240))throw Error('narration_audio');
    }
   }
  }return raw;
 }
 function track(raw,artifacts,id,lang='vi',persona='quick'){
  if(!languages.includes(lang)||!personas.includes(persona))return null;
  const r=raw?.records.find(r=>r.artifactId===id),a=artifacts.find(a=>a.id===id),s=r?.stories[lang]?.[persona];if(!r||!a||!s)return null;
  return Object.freeze({key:[id,lang,persona].join(':'),artifactId:id,lang,persona,title:r.names[lang],text:s.text,src:s.audio||null,duration:s.durationSeconds||0,source:r.source,artwork:'./'+a.image});
 }
 function create(env={}){
  const asset=env.asset||((p)=>new URL(p,root.MuseumAssetBaseURL||root.document?.baseURI).href),speech=env.speech??root.speechSynthesis;
  const media=env.mediaSession??root.navigator?.mediaSession,Metadata=env.Metadata??root.MediaMetadata;
  const notify=env.onChange||(()=>{}),timer=env.setTimeout||root.setTimeout,untimer=env.clearTimeout||root.clearTimeout;
  let audio=null,current=null,status='idle',mode='none',intent=false,generation=0,expectedSrc='',time=0,duration=0,error=null,deadline=0,unlocked=false,unlockPending=null,speechOffset=0;
  const active=()=>['loading','playing'].includes(status);
  const snapshot=()=>({track:current,status,mode,currentTime:time,duration,error,unlocked,seekable:mode==='file'&&Number.isFinite(duration)&&duration>0,speechOffset});
  function position(){try{if(mode==='file'&&duration>0&&Number.isFinite(time))media?.setPositionState?.({duration,playbackRate:1,position:Math.min(duration,Math.max(0,time))});else media?.setPositionState?.();}catch{/* Một số Safari chưa hỗ trợ thanh thời gian. */}}
  function emit(){try{if(media)media.playbackState=status==='playing'?'playing':current?'paused':'none';}catch{}position();notify(snapshot());}
  function metadata(){if(!media)return;try{media.metadata=current&&Metadata?new Metadata({title:current.title,artist:current.artist||'Mây · Museum Companion',album:'Museum Companion',artwork:current.artwork?[{src:asset(current.artwork),type:current.artwork.endsWith('.webp')?'image/webp':'image/jpeg'}]:[]}):null;}catch{}}
  function clearDeadline(){if(deadline)untimer(deadline);deadline=0;}
  function halt(){intent=false;generation++;clearDeadline();audio?.pause();if(mode==='speech')speech?.cancel?.();}
  function matches(){return mode==='file'&&current&&(!audio.currentSrc||audio.currentSrc===expectedSrc);}
  function getAudio(){
   if(audio)return audio;audio=(env.createAudio||(()=>new root.Audio()))();audio.preload='metadata';audio.setAttribute?.('playsinline','');
   audio.onloadedmetadata=audio.ondurationchange=()=>{if(matches()&&Number.isFinite(audio.duration)&&audio.duration>0){duration=audio.duration;emit();}};
   audio.ontimeupdate=()=>{if(matches()&&Number.isFinite(audio.currentTime)){time=audio.currentTime;emit();}};
   audio.onplaying=()=>{if(matches()&&intent&&!audio.paused){clearDeadline();status='playing';error=null;unlocked=true;emit();}};
   audio.onpause=()=>{if(matches()&&intent&&audio.paused&&!audio.ended&&status==='playing'){intent=false;status='paused';emit();}};
   audio.onended=()=>{if(matches()&&audio.ended){intent=false;generation++;clearDeadline();status='ended';time=duration;emit();}};
   audio.onerror=()=>{if(matches()&&audio.error&&active())fileFailure(generation,audio.error);};return audio;
  }
  function select(next){
   halt();current=next?Object.freeze({...next}):null;time=0;duration=next?.duration||0;error=null;speechOffset=0;mode=next?.src?'file':next?'speech':'none';status=next?'paused':'idle';metadata();emit();return snapshot();
  }
  function speak(){
   if(!current)return;const token=++generation;clearDeadline();intent=true;mode='speech';time=duration=0;status='loading';error=null;audio?.pause();emit();
   if(!speech?.speak||!(env.createUtterance||root.SpeechSynthesisUtterance)){intent=false;status='error';error='unavailable';emit();return;}
   speech.cancel();const base=Math.min(speechOffset,current.text.length-1),text=current.text.slice(base),u=env.createUtterance?env.createUtterance(text):new root.SpeechSynthesisUtterance(text);
   u.lang={vi:'vi-VN',en:'en-US',ko:'ko-KR',zh:'zh-CN'}[current.lang];u.rate=current.persona==='kids'?0.88:current.persona==='deep'?0.94:1;u.pitch=current.persona==='kids'?1.08:1;
   const voices=speech.getVoices?.()||[],voice=voices.filter(v=>v.lang?.toLowerCase().startsWith(current.lang)).sort((a,b)=>Number(b.localService)-Number(a.localService))[0];if(voice)u.voice=voice;
   u.onstart=()=>{if(token!==generation)return;status='playing';error=null;emit();};
   u.onboundary=e=>{if(token===generation&&Number.isFinite(e.charIndex))speechOffset=base+Math.max(0,e.charIndex);};
   u.onend=()=>{if(token!==generation)return;intent=false;status='ended';speechOffset=0;emit();};
   u.onerror=e=>{if(token!==generation)return;intent=false;error=e.error==='not-allowed'?'tap':'unavailable';status=error==='tap'?'blocked':'error';emit();};
   try{speech.speak(u);}catch{if(token===generation){intent=false;status='error';error='unavailable';emit();}}
  }
  function fileFailure(token,e){
   if(token!==generation||mode!=='file'||!current||!intent)return;clearDeadline();
   if(e?.name==='NotAllowedError'){intent=false;audio.pause();status='blocked';error='tap';emit();return;}
   // 404, mạng yếu hoặc codec không hỗ trợ: đọc đúng cùng văn bản, không đổi hồ sơ.
   speak();
  }
  function play(next){
   if(next&&next.key!==current?.key)select(next);if(!current)return false;
   if(active())return true;
   if(status==='ended'){time=0;speechOffset=0;}
   if(mode==='speech'||!current.src){speak();return true;}
   const token=++generation,a=getAudio();intent=true;mode='file';status='loading';error=null;expectedSrc=asset(current.src);
   speech?.cancel?.();
   if(a.src!==expectedSrc){a.src=expectedSrc;a.load?.();}else if(time===0){try{a.currentTime=0;}catch{}}
   emit();clearDeadline();deadline=timer(()=>fileFailure(token,Error('audio_timeout')),env.timeoutMs||8000);
   try{const result=a.play();Promise.resolve(result).then(()=>{if(token!==generation||!intent||mode!=='file')return;clearDeadline();status='playing';unlocked=true;emit();}).catch(e=>fileFailure(token,e));}catch(e){fileFailure(token,e);}return true;
  }
  function pause(){if(!active())return snapshot();halt();status='paused';emit();return snapshot();}
  function clear(){select(null);}
  function seek(seconds){
   if(mode!=='file'||!current||!Number.isFinite(seconds)||!Number.isFinite(duration)||duration<=0)return false;
   const value=Math.max(0,Math.min(duration-.01,seconds));try{getAudio().currentTime=value;time=value;if(status==='ended')status='paused';emit();return true;}catch{return false;}
  }
  function unlock(){
   if(unlocked)return Promise.resolve(true);if(unlockPending)return unlockPending;
   const a=getAudio();if(active())return Promise.resolve(false);const token=++generation;mode='unlock';a.src=asset('./audio/unlock.mp3');a.load?.();
   try{unlockPending=Promise.resolve(a.play()).then(()=>{unlocked=true;if(token===generation&&mode==='unlock'){a.pause();mode=current?.src?'file':current?'speech':'none';}emit();return true;}).catch(()=>{if(token===generation&&mode==='unlock')mode=current?.src?'file':current?'speech':'none';return false;}).finally(()=>unlockPending=null);}catch{mode=current?.src?'file':current?'speech':'none';return Promise.resolve(false);}return unlockPending;
  }
  if(media?.setActionHandler){const actions={play:()=>play(),pause,stop:clear,seekto:e=>seek(e.seekTime),seekbackward:e=>seek(time-(e.seekOffset||10)),seekforward:e=>seek(time+(e.seekOffset||10))};for(const [name,fn]of Object.entries(actions))try{media.setActionHandler(name,fn);}catch{}}
  return Object.freeze({getState:snapshot,select,play,pause,clear,seek,unlock,pauseSpeech:()=>{if(mode==='speech')pause();},destroy:()=>{clear();if(media?.setActionHandler)for(const key of ['play','pause','stop','seekto','seekbackward','seekforward'])try{media.setActionHandler(key,null);}catch{}}});
 }
 root.MuseumPocketAudioEngine=Object.freeze({validate,track,create,languages,personas});
})(globalThis);
