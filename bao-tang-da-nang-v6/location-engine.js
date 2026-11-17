/* Sensor calculations only. GPS course is intentionally not device-facing heading. */
((root)=>{
  'use strict';
  const normalize=value=>((value%360)+360)%360;
  function heading(event,screenAngle=0){
    if(typeof event.webkitCompassHeading==='number'&&Number.isFinite(event.webkitCompassHeading)){
      if(typeof event.webkitCompassAccuracy==='number'&&(event.webkitCompassAccuracy<0||event.webkitCompassAccuracy>50))return null;
      return normalize(event.webkitCompassHeading+screenAngle);
    }
    if(event.absolute!==true||typeof event.alpha!=='number'||!Number.isFinite(event.alpha))return null;
    return normalize(360-event.alpha+screenAngle);
  }
  function smooth(previous,next,factor=0.28){
    if(!Number.isFinite(previous))return normalize(next);
    return previous+(((normalize(next)-normalize(previous)+540)%360)-180)*factor;
  }
  function fix(position,previousTimestamp=0){
    const c=position?.coords,stamp=position?.timestamp;
    if(!c||typeof c.latitude!=='number'||typeof c.longitude!=='number'||typeof c.accuracy!=='number'||!Number.isFinite(c.latitude)||!Number.isFinite(c.longitude)||!Number.isFinite(c.accuracy)||Math.abs(c.latitude)>90||Math.abs(c.longitude)>180||c.accuracy<0)return null;
    if(typeof stamp!=='number'||!Number.isFinite(stamp)||stamp<previousTimestamp||stamp>Date.now()+60000)return null;
    return {lat:c.latitude,lng:c.longitude,accuracy:c.accuracy,timestamp:stamp};
  }
  root.MuseumLocationEngine=Object.freeze({heading,smooth,fix,normalize});
})(globalThis);
