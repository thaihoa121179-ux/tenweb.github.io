/* Chỉ lưu ID khu/hiện vật, không lưu tọa độ hoặc luồng cảm biến. */
(()=>{
 'use strict';const M=Museum,key='museum_map_journey_v1',labels={
  title:['Hành trình mô phỏng','Simulated journey','모의 탐방','模拟旅程'],
  note:['Tiến độ khám phá trên sơ đồ demo; không xác nhận đã ghé bảo tàng thật.','Exploration on the demo plan; not proof of a real museum visit.','시연 평면도의 탐방 기록이며 실제 방문을 증명하지 않습니다.','此为演示平面图上的探索记录，不代表实际到馆。'],
  badge:['Người mở lối · khám phá 2 khu','Trail finder · explore 2 areas','길 개척자 · 구역 2곳 탐방','开路者 · 探索2个区域'],
  earned:['Đã nhận huy hiệu mô phỏng','Simulation badge earned','모의 탐방 배지 획득','已获得模拟徽章'],
  progress:['khu đã khám phá','areas explored','탐방한 구역','已探索区域'],
  open:['Mở bản đồ','Open map','지도 열기','打开地图'],
 };
 const t=k=>labels[k][{vi:0,en:1,ko:2,zh:3}[M.state.lang]??0];let data={version:1,topics:[],artifacts:[],earned:false};
 try{const d=JSON.parse(M.sv(key,'null'));if(d?.version===1){data.topics=[...new Set(Array.isArray(d.topics)?d.topics:[])].filter(id=>M.D.some(t=>t.id===id));data.artifacts=[...new Set(Array.isArray(d.artifacts)?d.artifacts:[])].filter(id=>M.A.some(a=>a.id===id&&!a.referenceOnly&&(a.sourceSite||'site1')==='site1'));data.earned=data.topics.length>=2;}}catch{}
 function render(){const host=document.querySelector('#page-profile .personal-scroll');if(!host)return;let card=document.getElementById('map-journey');if(!card){card=document.createElement('section');card.id='map-journey';card.className='card map-journey';document.getElementById('discovery-missions')?.after(card);if(!card.isConnected)host.prepend(card);}
  card.innerHTML=`<div class="map-journey-head"><img src="ai-robot.webp" alt="Mây" width="52" height="52"><h2>${M.esc(t('title'))}</h2></div><p>${M.esc(t('note'))}</p><b>${data.topics.length} / ${M.D.length} ${M.esc(t('progress'))}</b><progress value="${data.topics.length}" max="${M.D.length}" aria-label="${M.esc(t('progress'))}"></progress><div class="map-journey-badge ${data.earned?'earned':''}"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 3 7 13 14 3-10 11 2 15-13-7-13 7 2-15L3 19l14-3Z" fill="currentColor"/><path d="m17 25 5 5 10-12" stroke="var(--paper)" fill="none" stroke-width="3"/></svg><span>${M.esc(t('badge'))}${data.earned?`<small>${M.esc(t('earned'))}</small>`:''}</span></div><button class="primary" data-go="map">${M.esc(t('open'))} ›</button>`;
 }
 function record(topicId,artifactId){
  if(!M.D.some(d=>d.id===topicId))return null;
  const a=M.A.find(a=>a.id===artifactId&&a.topic===topicId&&!a.referenceOnly&&(a.sourceSite||'site1')==='site1');
  const first=!data.topics.includes(topicId),earnedBefore=data.earned;if(first)data.topics.push(topicId);
  if(a&&!data.artifacts.includes(a.id))data.artifacts.push(a.id);data.earned=data.topics.length>=2;M.persist(key,JSON.stringify(data));
  window.MuseumDiscovery?.recordSimulatedVisit(topicId,a?.id);document.dispatchEvent(new CustomEvent('museum:mapvisit',{detail:{topicId,artifactId:a?.id,first,badge:data.earned&&!earnedBefore}}));
  return{first,badge:data.earned&&!earnedBefore};
 }
 document.addEventListener('museum:navigate',()=>{if(M.state.page==='profile')render();});document.addEventListener('museum:language',()=>{if(M.state.page==='profile')render();});
 document.addEventListener('museum:profileclear',()=>{data={version:1,topics:[],artifacts:[],earned:false};M.persist(key,JSON.stringify(data));render();document.dispatchEvent(new Event('museum:mapreset'));});
 rootExpose();function rootExpose(){window.MuseumMapJourney={record,getData:()=>structuredClone(data),render};}if(M.state.page==='profile')render();
})();
