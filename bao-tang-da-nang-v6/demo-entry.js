/* Điểm vào gọn nhẹ; engine và CSS demo vẫn chỉ tải lúc mở bản đồ. */
(()=>{
 'use strict';const M=Museum,labels={
 title:['Demo 3 tầng cùng Mây','Tour three floors with Mây','마이와 3개 층 둘러보기','跟随小云游览三层'],
 text:['9 điểm dừng · Không cần cảm biến','9 stops · No sensors needed','9개 지점 · 센서 불필요','9个站点 · 无需传感器'],
 open:['Mở tuyến trình diễn','Open presentation tour','시연 경로 열기','打开演示路线']};
 const T=k=>labels[k][{vi:0,en:1,ko:2,zh:3}[M.state.lang]??0];
 window.MuseumOpenDemoTour=()=>{window.MuseumPresentationRequested=true;window.MuseumPendingMapTarget=null;M.nav('map');};
 let autoOpened=false;
 function render(){let card=document.getElementById('presentation-entry');if(!card){card=document.createElement('section');card.id='presentation-entry';card.className='presentation-entry';document.querySelector('.home-quick-actions').after(card);}
  card.innerHTML=`<img src="./ai-robot.webp" width="56" height="56" alt=""><div><h2>${M.esc(T('title'))}</h2><p>${M.esc(T('text'))}</p><button class="secondary" id="presentation-open">${M.esc(T('open'))}${MuseumIcons.svg('chevron')}</button></div>`;card.querySelector('button').onclick=window.MuseumOpenDemoTour;
  if(!autoOpened&&M.state.confirmed&&new URLSearchParams(location.search).get('presentation')==='1'){autoOpened=true;window.MuseumOpenDemoTour();}
 }
 document.addEventListener('museum:language',render);document.addEventListener('museum:ready',render);render();
})();
