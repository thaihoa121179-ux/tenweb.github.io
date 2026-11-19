/* Ảnh thật từ hồ sơ / ảnh không gian đã lưu. Không lấy ảnh ngẫu nhiên để minh họa một hiện vật. */
((root) => {
  'use strict';
  const labels = {
    zoom: ['Xem ảnh lớn', 'Enlarge image', '사진 크게 보기', '查看大图'],
    open: ['Mở hồ sơ', 'Open record', '기록 열기', '打开档案'],
    close: ['Đóng', 'Close', '닫기', '关闭'],
    missing: ['Ảnh chưa tải được', 'Image unavailable', '사진을 불러올 수 없어요', '图片暂不可用'],
    gallery: ['Ảnh minh họa chủ đề', 'Thematic gallery photograph', '주제별 전시 참고 사진', '主题展览参考照片'],
    related: ['Hiện vật liên quan', 'Related object', '관련 유물', '相关文物'],
    source: ['Nguồn ảnh', 'Image source', '사진 출처', '图片来源'],
    reference: ['Tham khảo', 'Reference', '참고 자료', '参考'],
    start: ['Bạn muốn nghe câu chuyện nào?', 'Which story will you explore?', '어떤 이야기를 살펴볼까요?', '想探索哪个故事？'],
    edit: ['Đổi điểm dừng', 'Change stop', '방문 지점 변경', '更换站点'],
    review: ['Những hiện vật bạn vừa tìm hiểu', 'Objects you just explored', '방금 살펴본 유물', '刚刚探索的文物'],
  };
  const M = () => root.Museum;
  const t = key => labels[key]?.[{vi:0,en:1,ko:2,zh:3}[M()?.state.lang] ?? 0] || key;
  const esc = value => M().esc(String(value ?? ''));
  function localImage(value) {
    const path = root.MuseumMediaMap?.[value] || value;
    return typeof path === 'string' && /^assets\/[a-z0-9_./%-]+$/i.test(path) && !path.includes('..') ? path : null;
  }
  function object(record) {
    record = record && M().A.find(a => a.id === record.id);
    if (!record) return null;
    const image = localImage(record.image);
    if (!image) return null;
    const institution = record.institutionName || record.sourceSiteLabel || 'Bảo tàng Đà Nẵng · Cơ sở 1';
    return {kind:'artifact', id:record.id, name:M().aname(record), image, source:record.url,
      credit:institution + (record.referenceOnly ? ' · ' + t('reference') : ''), overview:false};
  }
  function forTopic(id, preferObject = false) {
    const topic = M().D.find(d => d.id === id);
    if (!topic) return null;
    if (preferObject) {
      const a = M().A.find(a => !a.referenceOnly && (a.sourceSite || 'site1') === 'site1' && a.topic === id);
      const view = a && object(a);
      if (view) return {...view, relationship:t('related')};
    }
    const image = localImage(M().galleryImages?.[id]);
    return image ? {kind:'topic', id, name:M().nm(topic), image, source:topic.source,
      credit:'Bảo tàng Đà Nẵng', overview:true} : null;
  }
  function resolve(kind, id) {
    return kind === 'artifact' ? object(M().A.find(a => a.id === id)) : forTopic(id);
  }
  function media(view, options = {}) {
    if (!view) return '';
    const cls = options.className || '';
    return `<span class="visual-media ${esc(cls)} ${view.overview?'is-gallery':'is-object'}"><img data-visual-image src="${esc(view.image)}" alt="${options.decorative?'':esc(view.name)}" width="480" height="360" loading="${options.eager?'eager':'lazy'}" decoding="async" fetchpriority="${options.eager?'auto':'low'}"><span class="visual-unavailable" hidden>${esc(t('missing'))}</span></span>`;
  }
  function figure(view, options = {}) {
    if (!view) return '';
    return `<figure class="visual-figure ${esc(options.className||'')}" data-visual-record="${esc(view.kind+':'+view.id)}"><button type="button" class="visual-zoom" data-visual-open="${esc(view.kind+':'+view.id)}" aria-label="${esc(t('zoom')+' · '+view.name)}">${media(view,{eager:options.eager})}<span class="visual-zoom-label" aria-hidden="true">${MuseumIcons.svg('expand')} ${esc(t('zoom'))}</span></button><figcaption>${view.relationship?`<span>${esc(view.relationship)}</span>`:''}<b>${esc(view.name)}</b><small>${esc(view.overview?t('gallery')+' · '+view.credit:view.credit)}</small></figcaption></figure>`;
  }
  function card(view, options = {}) {
    if (!view) return '';
    const attribute = options.question ? 'data-visual-question' : view.kind === 'artifact' ? 'data-artifact' : 'data-topic';
    return `<button type="button" class="visual-record-card ${esc(options.className||'')}" ${attribute}="${esc(view.id)}" data-visual-record="${esc(view.kind+':'+view.id)}">${media(view,{decorative:true})}<span class="visual-record-copy"><b>${esc(view.name)}</b><small>${esc(view.overview?t('gallery')+' · '+view.credit:view.credit)}</small><span class="visual-record-open">${esc(t('open'))} ›</span></span></button>`;
  }
  function quizStrip(records, className = '') {
    return `<div class="visual-strip ${esc(className)}">${records.map(a=>object(a)).filter(Boolean).map(v=>`<button type="button" data-visual-open="${esc('artifact:'+v.id)}" aria-label="${esc(t('zoom')+' · '+v.name)}">${media(v,{decorative:true})}</button>`).join('')}</div>`;
  }
  let viewer;
  function openViewer(kind, id) {
    const view = resolve(kind,id);
    if (!view || !root.document) return;
    if (!viewer) {
      viewer = document.createElement('dialog');
      viewer.id = 'visual-viewer'; viewer.className = 'image-viewer';
      document.body.appendChild(viewer);
      viewer.addEventListener('keydown', e=>{if(e.key==='Escape')e.stopPropagation();});
      viewer.addEventListener('click', e=>{
        if(e.target===viewer || e.target.closest('[data-close-image]')) viewer.close();
        if(e.target.closest('[data-open-image-record]')) {
          const current=viewer.dataset.record;
          viewer.close();document.querySelectorAll('dialog[open]').forEach(d=>d.close());
          const at=current.indexOf(':'),type=current.slice(0,at),key=current.slice(at+1);
          type==='artifact'?M().openArtifact(key):M().openArticle(key);
        }
      });
    }
    viewer.dataset.record=kind+':'+id;
    viewer.innerHTML=`<div class="image-viewer-heading"><h2>${esc(view.name)}</h2><button type="button" data-close-image>${esc(t('close'))} ×</button></div>${media(view,{eager:true})}<div class="image-viewer-caption"><p>${esc(view.overview?t('gallery')+' · '+view.credit:view.credit)}</p><button type="button" class="primary" data-open-image-record>${esc(t('open'))} ›</button><a href="${esc(view.source)}" target="_blank" rel="noopener noreferrer">${esc(t('source'))} ↗</a></div>`;
    if(!viewer.open)viewer.showModal();
  }
  function decorateHome() {
    const recent=root.MuseumProfile?.getData().visits.find(v=>v.key.startsWith('artifact:'));
    const views={catalog:object(M().A.find(a=>a.id==='ma-nao')),map:forTopic('co-vat'),plan:forTopic('lich-su-do-thi'),quiz:object(M().A.find(a=>a.id==='sung-than-cong')),info:forTopic('toa-thi-chinh'),profile:recent?resolve('artifact',recent.key.split(':')[1]):forTopic('dan-toc',true)};
    document.querySelectorAll('.home-grid .tile').forEach(tile=>{
      const view=views[tile.dataset.go];if(!view)return;
      tile.classList.add('visual-home-tile');
      let picture=tile.querySelector('.visual-tile-photo');
      if(!picture){picture=document.createElement('span');picture.className='visual-tile-photo';tile.prepend(picture);}
      if(picture.dataset.record!==view.kind+':'+view.id){picture.dataset.record=view.kind+':'+view.id;picture.innerHTML=media(view,{decorative:true});}
    });
  }
  function decorateMap() {
    document.querySelectorAll('#map-zone-list [data-map-topic]').forEach(button=>{
      if(button.querySelector('.visual-media'))return;
      const v=forTopic(button.dataset.mapTopic,true);if(v)button.insertAdjacentHTML('afterbegin',media(v,{className:'map-zone-photo',decorative:true}));
    });
  }
  function decorateFloors() {
    document.querySelectorAll('#floor-list [data-open-floor]').forEach(button=>{
      if(button.querySelector('.visual-media'))return;
      const d=M().D.find(d=>d.floor===Number(button.dataset.openFloor));
      const v=d&&forTopic(d.id);if(v)button.insertAdjacentHTML('afterbegin',media(v,{className:'floor-list-photo',decorative:true}));
    });
  }
  if(root.document) {
    document.addEventListener('click',e=>{
      const key=e.target.closest('[data-visual-open]')?.dataset.visualOpen;
      if(key){e.preventDefault();const at=key.indexOf(':');openViewer(key.slice(0,at),key.slice(at+1));}
      const id=e.target.closest('[data-visual-question]')?.dataset.visualQuestion;
      if(id){const a=M().A.find(a=>a.id===id);if(a){root.MuseumExperience.pin(id);M().sendMessage(M().aname(a));}}
    });
    document.addEventListener('load',e=>{if(e.target.matches?.('img[data-visual-image]'))e.target.closest('.visual-media').classList.add('is-loaded');},{capture:true});
    document.addEventListener('error',e=>{if(e.target.matches?.('img[data-visual-image]')){e.target.hidden=true;const parent=e.target.closest('.visual-media');parent.classList.add('is-unavailable');parent.querySelector('.visual-unavailable').hidden=false;}},{capture:true});
  }
  root.MuseumVisuals=Object.freeze({t,object,forTopic,resolve,media,figure,card,quizStrip,openViewer,decorateHome,decorateMap,decorateFloors});
})(globalThis);
