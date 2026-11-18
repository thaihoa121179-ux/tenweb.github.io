/* Quyền được xin trực tiếp trong thao tác chạm, trước mọi await.
   Token ngăn một yêu cầu quyền cũ bật lại cảm biến sau khi đã rời bản đồ. */
((root)=>{
 'use strict';
 function create(callbacks){
  let preferAbsolute=false,generation=0,timer=0,active=false,raw=null,seenMotion=false,seenHeading=false,lastMotion=0,lastHeading=0;
  const detector=new MuseumMapEngine.StepDetector();
  const angle=()=>root.screen?.orientation?.angle??root.orientation??0;
  function motion(e){if(!active)return;lastMotion=performance.now();if(!seenMotion&&e.accelerationIncludingGravity&&Number.isFinite(e.accelerationIncludingGravity.z)){seenMotion=true;callbacks.status('motion');}if(detector.feed(e,lastMotion,callbacks.sensitivity()))callbacks.step();callbacks.raw({signal:detector.signal});}
  function orientation(e){if(!active)return;if(preferAbsolute&&e.type!=='deviceorientationabsolute'&&!Number.isFinite(e.webkitCompassHeading))return;const h=MuseumMapEngine.heading(e,angle());if(h===null)return;if(e.type==='deviceorientationabsolute')preferAbsolute=true;lastHeading=performance.now();if(!seenHeading){seenHeading=true;callbacks.status('heading');}raw=raw===null?h:MuseumMapEngine.smoothAngle(raw,h);callbacks.heading(raw);callbacks.raw({heading:raw});}
  function stop(){generation++;active=false;clearTimeout(timer);root.removeEventListener('devicemotion',motion);root.removeEventListener('deviceorientation',orientation);root.removeEventListener('deviceorientationabsolute',orientation);raw=null;preferAbsolute=false;detector.reset();seenMotion=seenHeading=false;lastMotion=lastHeading=0;}
  function watchdog(token){timer=setTimeout(()=>{if(!active||token!==generation)return;const now=performance.now();if(!seenMotion||now-lastMotion>3500){stop();callbacks.error('noMotion');return;}if(!seenHeading||now-lastHeading>3500)callbacks.error('noHeading');watchdog(token);},MuseumMapConfig.sensorTimeoutMs);}
  async function start(){
   stop();const token=generation;
   if(!root.isSecureContext){callbacks.error('https');return false;}
   if(!root.DeviceMotionEvent){callbacks.error('unsupported');return false;}
   const permission=Type=>{try{return Promise.resolve(typeof Type?.requestPermission==='function'?Type.requestPermission():'granted');}catch(error){return Promise.reject(error);}};
   const motionPermission=permission(root.DeviceMotionEvent),orientationPermission=permission(root.DeviceOrientationEvent);
   const result=await Promise.allSettled([motionPermission,orientationPermission]);
   if(token!==generation)return false;
   if(result[0].status!=='fulfilled'||result[0].value!=='granted'){callbacks.error('denied');return false;}
   active=true;callbacks.status('waiting');
   root.addEventListener('devicemotion',motion,{passive:true});root.addEventListener('deviceorientation',orientation,{passive:true});root.addEventListener('deviceorientationabsolute',orientation,{passive:true});
   if(result[1].status!=='fulfilled'||result[1].value!=='granted')callbacks.error('noHeading');watchdog(token);return true;
  }
  return{start,stop,get active(){return active;},get heading(){return raw;}};
 }
 root.MuseumMapSensors={create};
})(globalThis);
