/* Nạp nguồn JSON thật trước các module cũ; không tạo dữ liệu thay thế khi lỗi. */
(() => {
  'use strict';
  const version='7.1.0',base=new URL('./',document.currentScript.src);
  const status=document.createElement('p');status.id='boot-status';status.className='note';status.setAttribute('role','status');
  status.textContent='Đang tải hồ sơ / Loading museum records…';document.getElementById('language-start').before(status);
  document.getElementById('language-start').disabled=true;
  const script=name=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL(name+'?v='+version,base);s.onload=resolve;s.onerror=()=>reject(Error(name));document.body.appendChild(s);});
  let decoder;window.MuseumLoadQRDecoder=()=>window.jsQR?Promise.resolve():(decoder||=(script('qr-decoder.js').catch(e=>{decoder=null;throw e;})));
  async function boot(){
    try{
      let data;
      if('DecompressionStream'in window){try{const compressed=await fetch(new URL('data/museum-content.json.gz?v='+version,base));if(!compressed.ok)throw Error('compressed');data=await new Response(compressed.body.pipeThrough(new DecompressionStream('gzip'))).json();}catch{}}
      if(!data){const response=await fetch(new URL('data/museum-content.json?v='+version,base));if(!response.ok)throw Error('data');data=await response.json();}
      if(data.schemaVersion!==1||data.artifacts?.length!==200||new Set(data.artifacts.map(a=>a.id)).size!==200||data.artifacts.some(a=>!a.url||!a.image||!a.guide))throw Error('schema');
      window.MuseumContent=data;window.MuseumDataV6=data.nativeTranslations;window.MuseumMediaMap=data.mediaMap;
      const modules=['qr-decoder.js','qr-generator.js','guide-engine.js','chat-text.js','object-videos.js','videos.js','library-ui.js','request-plan.js','conversation.js','experience-i18n.js','learning-engine.js','retrieval.js','visitor.js','app.js','v6.js','visuals.js','profile.js','mobile.js','analytics.js','experience.js','photo-query.js','journey-card.js','offline.js'];
      await script('app-foundation-'+version+'.js');
      await script('app-core-'+version+'.js');
      await script('app-runtime-'+version+'.js');
      if(!window.MuseumVisuals||!window.MuseumExperience||!window.MuseumPhoto||!window.MuseumJourneyCard)throw Error("feature_load");
      window.MuseumVisitor.start();document.dispatchEvent(new CustomEvent('museum:ready'));
      await Promise.all([...document.querySelectorAll('link[data-app-style]')].map(link=>link.sheet?Promise.resolve():new Promise((resolve,reject)=>{link.addEventListener('load',resolve,{once:true});link.addEventListener('error',reject,{once:true});})));
      status.remove();document.getElementById('language-start').disabled=false;document.documentElement.classList.remove('booting');document.getElementById('boot-cover')?.remove();
    }catch(error){
      document.documentElement.classList.remove('booting');document.getElementById('boot-cover')?.remove();document.getElementById('lang-overlay').classList.remove('hidden');document.querySelector('.app').classList.add('language-open');console.error('Museum startup: '+error.message);status.textContent='Chưa tải được dữ liệu. Kiểm tra mạng rồi thử lại. / Could not load records.';
      const retry=document.createElement('button');retry.className='secondary';retry.textContent='Thử lại / Retry';retry.onclick=()=>location.reload();status.appendChild(retry);
    }
  }
  boot();
})();
