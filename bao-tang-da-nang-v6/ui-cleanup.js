/* Nhãn tĩnh nhỏ; không quét/thay nội dung trò chuyện hoặc dữ liệu hiện vật. */
(()=>{
 'use strict';
 const labels={
  qrCode:['Mã QR','QR code','QR 코드','二维码'],
  illustration:['Sơ đồ minh họa','Illustrative map','안내도 예시','示意图'],
  demoQr:['QR minh họa','Illustrative QR','QR 코드 예시','演示二维码'],
  openCode:['Mở mã','Open code','코드 열기','打开代码'],
  send:['Gửi câu hỏi','Send question','질문 보내기','发送问题']
 };
 function update(){
  const i={vi:0,en:1,ko:2,zh:3}[window.Museum?.state.lang]??0;
  document.querySelectorAll('[data-cleanup]').forEach(el=>{const t=labels[el.dataset.cleanup];if(t)el.textContent=t[i];});
  document.querySelector('#qr-manual-go')?.setAttribute('aria-label',labels.openCode[i]);
  document.querySelector('#chat-form button[type=submit]')?.setAttribute('aria-label',labels.send[i]);
  window.MuseumIcons?.mount(document);
 }
 update();document.addEventListener('museum:ready',update);document.addEventListener('museum:language',update);
 window.MuseumUICleanup=Object.freeze({update});
})();
