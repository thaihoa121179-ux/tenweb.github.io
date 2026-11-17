/* Keep the composer above a phone's software keyboard; no user data is stored. */
(() => {
  'use strict';
  const viewport=window.visualViewport, mobile=matchMedia('(max-width:800px), (max-width:1024px) and (max-height:500px)');
  let baseline=window.innerHeight, frame=0;
  function sync(){
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{
      if(!mobile.matches){document.documentElement.style.removeProperty('--app-height');document.body.classList.remove('keyboard-open');return;}
      const height=Math.round(viewport?.height||window.innerHeight);
      document.documentElement.style.setProperty('--viewport-top',Math.max(0,Math.round(viewport?.offsetTop||0))+'px');
      const input=document.activeElement;
      const chatting=input?.id==='chat-input'&&window.Museum?.state.page==='guide';
      if(!chatting)baseline=Math.max(window.innerHeight,height);
      document.documentElement.style.setProperty('--app-height',height+'px');
      document.body.classList.toggle('keyboard-open',chatting&&Math.max(window.innerHeight,baseline)-height>140);
      if(chatting&&document.body.classList.contains('keyboard-open')){
        const log=document.getElementById('messages');if(log&&log.scrollHeight-log.clientHeight-log.scrollTop<120)log.scrollTop=log.scrollHeight;
      }
    });
  }
  viewport?.addEventListener('resize',sync);viewport?.addEventListener('scroll',sync);
  window.addEventListener('resize',sync);window.addEventListener('orientationchange',()=>{baseline=window.innerHeight;sync()});
  document.addEventListener('focusin',sync);document.addEventListener('focusout',()=>setTimeout(sync,120));
  document.addEventListener('museum:navigate',sync);mobile.addEventListener('change',sync);sync();
})();
