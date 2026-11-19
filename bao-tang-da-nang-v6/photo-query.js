/* Chụp & hỏi có bước xem trước và gửi ảnh chủ động; QR không gửi khung hình. */
(() => {
 'use strict';const I=(name,className)=>MuseumIcons.svg(name,className),M=Museum,E=MuseumExperience,T=E.t,esc=M.esc;
 const sheet=E.dialog('photo-sheet',T('photo')),body=sheet.querySelector('.sheet-body');let encoded='',url='',version=0;
 body.innerHTML=`<p data-photo-help></p><label class="primary photo-file-button" for="artifact-photo-file"></label><input id="artifact-photo-file" type="file" accept="image/*" capture="environment" hidden><img class="photo-preview" hidden alt=""><button class="primary full" id="identify-photo" disabled></button><p class="photo-state" role="status"></p><input class="photo-search" type="search"><div class="photo-results"></div>`;
 const input=body.querySelector('input[type=file]'),preview=body.querySelector('img'),identify=body.querySelector('#identify-photo'),search=body.querySelector('[type=search]'),state=body.querySelector('.photo-state'),results=body.querySelector('.photo-results');
 function labels(){sheet.querySelector('h2').textContent=T('photo');body.querySelector('[data-photo-help]').textContent=T('photoHelp');body.querySelector('label').textContent=T('choosePhoto');identify.textContent=T('identify');search.placeholder=M.human('Tìm tên hoặc chữ trên nhãn…','Search an object name or label…','유물 이름 또는 라벨 검색…','搜索文物名或标签…');preview.alt=T('photo');}
 function cards(records,confidence={}){results.innerHTML=records.slice(0,3).map(a=>`<button class="photo-result" data-confirm-photo="${esc(a.id)}"><img src="${esc(a.image)}" alt=""><span>${esc(M.aname(a))}${confidence[a.id]?`<small>${esc(T('confidence'+confidence[a.id][0].toUpperCase()+confidence[a.id].slice(1)))}</small>`:''}</span><b>${I('chevron')}</b></button>`).join('');}
 async function compress(file){
  if(!file||file.size>20*1024*1024||file.type&&!file.type.startsWith('image/'))throw Error('image');
  const raw=URL.createObjectURL(file);try{const image=new Image();image.src=raw;await image.decode();const scale=Math.min(1,1024/Math.max(image.naturalWidth,image.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);const value=canvas.toDataURL('image/jpeg',.78);if(value.length>1600000)throw Error('large');return value;}finally{URL.revokeObjectURL(raw);}
 }
 input.onchange=async()=>{const token=++version;encoded='';identify.disabled=true;state.textContent='';results.replaceChildren();try{const value=await compress(input.files[0]);if(token!==version)return;encoded=value;preview.src=value;preview.hidden=false;identify.disabled=false;}catch{state.textContent=M.human('Chưa đọc được ảnh. Thử JPG/PNG/WebP dưới 20 MB.','Could not read this image. Try JPG/PNG/WebP under 20 MB.','사진을 읽을 수 없습니다. 20MB 미만 JPG/PNG/WebP를 사용하세요.','无法读取图片，请使用20MB以下的JPG/PNG/WebP。');}input.value='';};
 identify.onclick=async()=>{
  if(!encoded)return;const token=++version;identify.disabled=true;state.textContent=T('photoBusy');results.replaceChildren();
  try{const r=await E.api('identify',{image:encoded,language:M.state.lang},40000);if(token!==version||!sheet.open)return;const matches=Array.isArray(r.matches)?r.matches.map(x=>M.A.find(a=>a.id===x.id)).filter(Boolean):[];state.textContent=T('unsure');cards(matches,Object.fromEntries((r.matches||[]).filter(x=>['low','medium','high'].includes(x.confidence)).map(x=>[x.id,x.confidence])));if(!matches.length)state.textContent=T('noData');}
  catch{if(token===version)state.textContent=T('photoMissing');}finally{if(token===version)identify.disabled=false;}
 };
 search.oninput=()=>{const text=search.value.trim();if(!text){results.replaceChildren();return;}state.textContent=T('unsure');cards(M.artifactSearch(text));};
 results.onclick=e=>{const id=e.target.closest('[data-confirm-photo]')?.dataset.confirmPhoto;if(!id)return;sheet.close();E.pin(id);M.openArtifact(id);};
 function open(){labels();state.textContent='';sheet.showModal();}
 const scan=document.createElement('button');scan.id='photo-open-scan';scan.className='primary';scan.type='button';scan.textContent=T('photo');document.getElementById('scan-video-box').before(scan);scan.onclick=open;
 const chat=document.createElement('button');chat.id='photo-open-chat';chat.type='button';chat.innerHTML=I('camera');chat.setAttribute('aria-label',T('photo'));document.getElementById('chat-mic').before(chat);chat.onclick=open;
 sheet.addEventListener('close',()=>{version++;identify.disabled=!encoded;});
 document.addEventListener('museum:language',()=>{scan.textContent=T('photo');chat.setAttribute('aria-label',T('photo'));labels();});
 window.MuseumPhoto={open,compress};labels();
})();
