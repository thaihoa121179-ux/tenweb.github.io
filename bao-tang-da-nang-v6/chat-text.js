/* Presentation pacing, not a claim of token streaming or hidden model thought.
 * Explicit slow/normal choices override automatic reduced-motion presentation;
 * Auto respects the device preference. No long-answer acceleration or catch-up bursts. */
((root) => {
  'use strict';
  const pending = new Set();
  const profiles = { slow: { ms:42, comma:90, sentence:180 }, normal: { ms:24, comma:35, sentence:90 } };
  const valid = new Set(['auto','slow','normal','instant']);
  function reveal(element, text, { animate=true, speed='auto', onProgress=()=>{}, onFinish=()=>{} }={}) {
    const complete=String(text);
    const units=typeof Intl.Segmenter==='function'
      ? [...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(complete)].map(x=>x.segment)
      : Array.from(complete);
    let resolve,done=false,frame=0,index=0,nextDue=null,selected=valid.has(speed)?speed:'auto';
    const finished=new Promise(r=>{resolve=r});
    const reduced=()=>root.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const instant=()=>!animate||selected==='instant'||selected==='auto'&&reduced();
    const profile=()=>profiles[selected==='normal'?'normal':'slow'];
    const control={finished,finish:()=>finish(),setSpeed(value){selected=valid.has(value)?value:'auto';nextDue=null;if(instant())finish();}};
    function finish(){
      if(done)return;done=true;root.cancelAnimationFrame?.(frame);element.textContent=complete;
      element.classList.remove('is-revealing');pending.delete(control);onProgress();onFinish();resolve();
    }
    if(instant()||!units.length||root.document?.hidden){finish();return control;}
    element.textContent='';element.classList.add('is-revealing');
    const textNode=element.ownerDocument?.createTextNode('');if(textNode)element.appendChild(textNode);
    function tick(now){
      if(done)return;
      if(!element.isConnected||root.document?.hidden){finish();return;}
      if(nextDue===null)nextDue=now;
      if(now>=nextDue){
        const unit=units[index++];
        if(textNode)textNode.appendData(unit);else element.textContent=units.slice(0,index).join('');
        const p=profile();nextDue=now+p.ms+(/[.!?。！？]/u.test(unit)?p.sentence:/[,;:，；：]/u.test(unit)?p.comma:0);
        onProgress();
      }
      if(index>=units.length)finish();else frame=root.requestAnimationFrame(tick);
    }
    pending.add(control);frame=root.requestAnimationFrame(tick);return control;
  }
  const finishAll=()=>[...pending].forEach(x=>x.finish());
  root.document?.addEventListener('visibilitychange',()=>{if(root.document.hidden)finishAll();});
  root.document?.addEventListener('museum:navigate',e=>{if(e.detail.page!=='guide')finishAll();});
  root.document?.addEventListener('museum:language',finishAll);
  root.MuseumChatText=Object.freeze({reveal,finishAll,setSpeed:speed=>[...pending].forEach(x=>x.setSpeed(speed))});
})(globalThis);
