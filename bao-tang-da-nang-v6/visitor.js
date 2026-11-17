/* Local nickname only; never appended to AI requests, URLs or geolocation data. */
((root) => {
  'use strict';
  const prefix='museum_v6:', memory=new Map();
  let guestRequested=false;
  const read=key=>{try{return root.localStorage.getItem(prefix+key)||memory.get(key)||'';}catch{return memory.get(key)||'';}};
  function write(key,value){memory.set(key,value);try{root.localStorage.setItem(prefix+key,value);return true;}catch{return false;}}
  const units=value=>typeof Intl.Segmenter==='function'?[...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(value)].map(x=>x.segment):Array.from(value);
  const clean=value=>String(value||'').normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g,'').replace(/\s+/gu,' ').trim();
  const getName=()=>units(clean(read('museum_visitor_name'))).slice(0,30).join('');
  const isReady=()=>read('museum_visitor_ready')==='yes';
  const M=()=>root.Museum;
  const text=(vi,en,ko,zh)=>M()?.human(vi,en,ko,zh)||vi;
  function validate(value){const name=clean(value);return !name?'empty':units(name).length>30?'long':'';}
  function errorText(error){return error==='long'?text('Tên tối đa 30 ký tự nhé.','Use up to 30 characters.','이름은 30자 이내로 입력해 주세요.','名字最多30个字符。'):text('Nhập tên hoặc chọn “Tiếp tục với tên Khách”.','Enter a name or choose “Continue as Guest”.','이름을 입력하거나 게스트로 계속하세요.','请输入名字，或选择以访客身份继续。');}
  function save(value){const saved=write('museum_visitor_name',clean(value));write('museum_visitor_ready','yes');if(M())M().state.visitorName=getName();if(root.document?.getElementById('visitor-name'))document.getElementById('visitor-name').value=getName();return saved;}
  function showError(input,output,error){input.setAttribute('aria-invalid',String(!!error));output.textContent=error?errorText(error):'';if(error)input.focus();}
  function commitInput(){
    const input=document.getElementById('visitor-name'),output=document.getElementById('visitor-name-error');
    if(!input)return true;
    if(guestRequested || isReady()&&!getName()&&!clean(input.value)){guestRequested=false;save('');showError(input,output,'');return true;}
    const error=validate(input.value);showError(input,output,error);if(error)return false;
    save(input.value);input.value=getName();return true;
  }
  function greeting(){const name=getName();return name?text(`Chào ${name},`, `Welcome, ${name}`,`${name}님, 안녕하세요`,`${name}，你好`):text('Chào bạn,','Welcome','안녕하세요','你好');}
  function renderProfile(){
    const host=document.querySelector('#page-profile .personal-scroll');if(!host||host.querySelector('#visitor-card'))return;
    const card=document.createElement('section');card.id='visitor-card';card.className='card visitor-card';
    card.innerHTML='<div class="visitor-avatar" aria-hidden="true"></div><div class="visitor-card-copy"><h2></h2><p></p><form id="visitor-edit-form"><label for="visitor-edit-name"></label><div class="visitor-edit-row"><input id="visitor-edit-name" autocomplete="nickname" maxlength="120" aria-describedby="visitor-edit-error"><button class="primary" type="submit"></button></div><p id="visitor-edit-error" class="visitor-error" role="status"></p><button class="visitor-guest-reset" type="button"></button></form></div>';
    card.querySelector('.visitor-avatar').textContent=units(getName())[0]||'✳';
    card.querySelector('h2').textContent=greeting();
    card.querySelector('.visitor-card-copy>p').textContent=text('Tên chỉ lưu trên thiết bị này.','Your name stays on this device.','이름은 이 기기에만 저장됩니다.','名字仅保存在此设备。');
    card.querySelector('label').textContent=text('Tên hoặc biệt danh','Name or nickname','이름 또는 별명','名字或昵称');
    card.querySelector('input').value=getName();
    card.querySelector('[type=submit]').textContent=text('Lưu tên','Save name','이름 저장','保存名字');
    card.querySelector('.visitor-guest-reset').textContent=text('Dùng tên Khách','Use Guest','게스트로 사용','使用访客身份');
    host.prepend(card);
  }
  function update(){
    const input=document.getElementById('visitor-name');
    document.getElementById('visitor-name-label').textContent=text('Mây gọi bạn là gì?','What should Mây call you?','어떻게 불러 드릴까요?','小云该怎么称呼你？');
    input.placeholder=text('Tên hoặc biệt danh của bạn','Your name or nickname','이름 또는 별명','你的名字或昵称');
    document.getElementById('visitor-name-note').textContent=text('Chỉ lưu trên thiết bị này. Bạn có thể đổi tên trong Cá nhân.','Saved on this device. Change it in My space.','이 기기에 저장됩니다. 내 공간에서 변경할 수 있어요.','仅保存在此设备，可在个人页修改。');
    document.getElementById('visitor-guest').textContent=text('Tiếp tục với tên Khách','Continue as Guest','게스트로 계속','以访客身份继续');
    const welcome=document.querySelector('[data-v6=welcome]');if(welcome)welcome.textContent=greeting();
    if(M())M().state.visitorName=getName();
    document.getElementById('visitor-card')?.remove();renderProfile();
  }
  function init(){
    document.getElementById('visitor-name').value=getName();
    document.getElementById('visitor-guest').addEventListener('click',()=>{guestRequested=true;document.getElementById('language-start').click();});
    document.getElementById('visitor-name').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();document.getElementById('language-start').click();}});
    document.getElementById('visitor-name').addEventListener('input',()=>showError(document.getElementById('visitor-name'),document.getElementById('visitor-name-error'),''));
    document.addEventListener('submit',event=>{
      if(event.target.id!=='visitor-edit-form')return;event.preventDefault();
      const input=document.getElementById('visitor-edit-name'),output=document.getElementById('visitor-edit-error'),error=validate(input.value);showError(input,output,error);if(error)return;
      const persistent=save(input.value);update();M().toast(persistent?text('Đã lưu tên.','Name saved.','이름을 저장했어요.','名字已保存。'):text('Tên chỉ được giữ trong phiên này.','Name kept for this session.','이 세션 동안 이름을 기억합니다.','名字仅保留到本次会话结束。'));
    });
    document.addEventListener('click',event=>{if(event.target.closest('.visitor-guest-reset')){save('');update();}});
    document.addEventListener('museum:language',update);
    document.addEventListener('museum:navigate',()=>{const welcome=document.querySelector('[data-v6=welcome]');if(welcome)welcome.textContent=greeting();renderProfile();});
    new MutationObserver(renderProfile).observe(document.getElementById('page-profile'),{childList:true});
    update();
  }
  root.MuseumVisitor=Object.freeze({getName,isReady,validate,clean,save,commitInput,greeting});
  if(root.document)document.addEventListener('DOMContentLoaded',init,{once:true});
})(globalThis);
