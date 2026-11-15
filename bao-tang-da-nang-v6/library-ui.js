/* Bounded catalog rendering. Data remains the supplied, sourced collection. */
(() => {
  'use strict';
  const PAGE_SIZE = 24;
  const translations = {
    vi: {institution:'Bảo tàng / cơ sở',material:'Chất liệu',media:'Video',all:'Tất cả',withVideo:'Có video nguồn',withoutVideo:'Chưa có video',unknown:'Chưa xác minh',previous:'Trang trước',next:'Trang sau',page:'Trang',of:'/',records:'hồ sơ hiện vật',shown:'Đang hiển thị',empty:'Không tìm thấy hồ sơ phù hợp.',tryAgain:'Thử từ khóa khác hoặc bỏ bộ lọc.',clear:'Bỏ bộ lọc và từ khóa',source:'Nguồn',external:'Tham khảo từ bảo tàng khác',local:'Bảo tàng Đà Nẵng',sourceVi:'Hồ sơ nguồn tiếng Việt',sourceEn:'Hồ sơ nguồn tiếng Anh',video:'Video có nguồn',themeVideo:'Video chủ đề liên quan',overviewVideo:'Video tổng quan',objectVideo:'Video về hiện vật',noPhoto:'Ảnh chưa có trong thư viện',noFloor:'Chưa xác minh vị trí trưng bày',filters:'Bộ lọc thư viện',pagination:'Các trang hồ sơ',resultList:'Kết quả hiện vật',site1:'Bảo tàng Đà Nẵng · Cơ sở 1',site2:'Bảo tàng Đà Nẵng · Cơ sở 2',paper:'Giấy',wood:'Gỗ',metal:'Kim loại',iron:'Sắt',bronze:'Đồng',stone:'Đá',silver:'Bạc',fabric:'Vải',ceramic:'Gốm',agate:'Mã não'},
    en: {institution:'Museum / site',material:'Material',media:'Video',all:'All',withVideo:'With sourced video',withoutVideo:'Without video',unknown:'Not verified',previous:'Previous',next:'Next',page:'Page',of:'/',records:'artifact records',shown:'Showing',empty:'No matching records.',tryAgain:'Try another search or remove the filters.',clear:'Clear filters and search',source:'Source',external:'Reference from another museum',local:'Da Nang Museum',sourceVi:'Vietnamese source record',sourceEn:'English source record',video:'Sourced video',themeVideo:'Related theme video',overviewVideo:'Overview video',objectVideo:'Artifact video',noPhoto:'Image not held in this library',noFloor:'Display location not verified',filters:'Collection filters',pagination:'Collection pages',resultList:'Artifact results',site1:'Da Nang Museum · Site 1',site2:'Da Nang Museum · Site 2',paper:'Paper',wood:'Wood',metal:'Metal',iron:'Iron',bronze:'Bronze / copper',stone:'Stone',silver:'Silver',fabric:'Textile',ceramic:'Ceramic',agate:'Agate'},
    ko: {institution:'박물관 / 분관',material:'재질',media:'영상',all:'전체',withVideo:'출처가 있는 영상',withoutVideo:'영상 없음',unknown:'미확인',previous:'이전',next:'다음',page:'페이지',of:'/',records:'유물 기록',shown:'표시',empty:'일치하는 자료가 없습니다.',tryAgain:'다른 검색어를 입력하거나 필터를 해제하세요.',clear:'필터 및 검색어 지우기',source:'출처',external:'다른 박물관의 참고 자료',local:'다낭 박물관',sourceVi:'베트남어 원문 자료',sourceEn:'영어 원문 자료',video:'출처가 있는 영상',themeVideo:'관련 주제 영상',overviewVideo:'개요 영상',objectVideo:'해당 유물 영상',noPhoto:'이 라이브러리에 사진이 없습니다',noFloor:'전시 위치 미확인',filters:'컬렉션 필터',pagination:'컬렉션 페이지',resultList:'유물 검색 결과',site1:'다낭 박물관 · 제1관',site2:'다낭 박물관 · 제2관',paper:'종이',wood:'나무',metal:'금속',iron:'철',bronze:'구리 / 청동',stone:'돌',silver:'은',fabric:'직물',ceramic:'도자기',agate:'마노'},
    zh: {institution:'博物馆 / 馆址',material:'材质',media:'视频',all:'全部',withVideo:'有来源的视频',withoutVideo:'暂无视频',unknown:'尚未核实',previous:'上一页',next:'下一页',page:'页',of:'/',records:'文物档案',shown:'显示',empty:'没有符合条件的档案。',tryAgain:'请尝试其他关键词或清除筛选。',clear:'清除筛选和搜索',source:'来源',external:'其他博物馆的参考资料',local:'岘港博物馆',sourceVi:'越南语原始档案',sourceEn:'英语原始档案',video:'有来源的视频',themeVideo:'相关主题视频',overviewVideo:'概览视频',objectVideo:'文物视频',noPhoto:'本库暂无此图片',noFloor:'展出位置尚未核实',filters:'文物库筛选',pagination:'文物档案页码',resultList:'文物结果',site1:'岘港博物馆 · 第一馆',site2:'岘港博物馆 · 第二馆',paper:'纸',wood:'木',metal:'金属',iron:'铁',bronze:'铜 / 青铜',stone:'石',silver:'银',fabric:'织物',ceramic:'陶瓷',agate:'玛瑙'}
  };
  const materialKeys = {giay:'paper',go:'wood','kim loai':'metal',sat:'iron',dong:'bronze',da:'stone',bac:'silver',vai:'fabric',gom:'ceramic','ma nao':'agate'};
  const normalize = text => String(text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().trim();
  const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = value => {
    if(typeof value!=='string'||!value.trim())return '';
    try {const url=new URL(value,location.href);return url.protocol==='https:'||(url.protocol==='http:'&&url.origin===location.origin)?url.href:'';}catch{return '';}
  };
  function videoItems(record) {
    if (typeof window.MuseumVideos?.items === 'function') {
      try { const items=window.MuseumVideos.items(record); return Array.isArray(items)?items:[]; } catch { return []; }
    }
    return (Array.isArray(record.videos)?record.videos:[]).filter(video=>{
      if(!video||video.verifiedSource!==true||!['object','theme','overview'].includes(video.relation)||!safeUrl(video.sourceUrl))return false;
      const url=safeUrl(video.url);if(!url)return false;
      const parsed=new URL(url);
      return /\.(?:mp4|webm|ogv)$/i.test(parsed.pathname)||
        ((parsed.hostname==='youtube.com'||parsed.hostname==='www.youtube.com')&&(/^(?:\/embed\/|\/shorts\/)[A-Za-z0-9_-]{11}/.test(parsed.pathname)||(parsed.pathname==='/watch'&&/^[A-Za-z0-9_-]{11}$/.test(parsed.searchParams.get('v')||''))))||
        (parsed.hostname==='youtu.be'&&/^\/[A-Za-z0-9_-]{11}$/.test(parsed.pathname))||
        ((parsed.hostname==='vimeo.com'||parsed.hostname==='player.vimeo.com')&&/^\/(?:video\/)?\d+$/.test(parsed.pathname));
    });
  }
  function hasVideo(record) { return videoItems(record).length>0; }
  function createController(M, options={}) {
    const doc=options.document||document;
    const input=doc.getElementById('catalog-input');
    const list=doc.getElementById('catalog-list');
    const count=doc.getElementById('catalog-count');
    if(!input||!list||!count)throw new Error('Catalog input, list and count are required');
    const lang=()=>M.state?.lang||'vi';
    const tr=key=>(translations[lang()]||translations.vi)[key]||key;
    const name=a=>M.aname?.(a)||window.MuseumDataV6?.artifacts[a.id]?.names?.[{vi:0,en:1,ko:2,zh:3}[lang()]]||(lang()==='vi'?a.name:a.en)||a.name||a.id;
    const summary=a=>M.asummary?.(a)||(lang()==='vi'?a.summary:a.enSummary)||a.summary||'';
    const meta=a=>M.ameta?.(a)||{era:a.era||'',material:a.material||''};
    const institution=a=>String(a.institutionId||a.sourceSite||'site1');
    const isExternal=a=>a.referenceOnly===true||a.externalReference===true||a.isExternal===true||a.external===true||(!['site1','site2','danang-museum','da-nang-museum'].includes(institution(a))&&!!a.institutionId);
    function institutionLabel(a) {
      const key=institution(a);
      if(!a.institutionId&&['site1','site2'].includes(key))return tr(key);
      return String(a.institutionName||a.sourceSiteLabel||key);
    }
    const rawMaterial=a=>String(a.material||'').trim();
    const material=a=>{
      const value=normalize(rawMaterial(a));
      return !value||/chua (co|xac)|khong ro|not verified|unknown|미확인|尚未/.test(value)?'__unknown':value;
    };
    function materialLabel(a) {
      const key=material(a);
      if(key==='__unknown')return tr('unknown');
      if(materialKeys[key])return tr(materialKeys[key]);
      const translated=String(meta(a).material||rawMaterial(a));
      return translated+(lang()!=='vi'&&translated===rawMaterial(a)?' (VI)':'');
    }
    const controls=doc.getElementById('catalog-sites')||doc.createElement('div');
    controls.id='catalog-sites';controls.className='library-filters';controls.setAttribute('role','group');
    controls.innerHTML='<label><span data-library-label="institution"></span><select id="library-institution" aria-controls="library-result-grid"></select></label><label><span data-library-label="material"></span><select id="library-material" aria-controls="library-result-grid"></select></label><label><span data-library-label="media"></span><select id="library-media" aria-controls="library-result-grid"></select></label>';
    if(!controls.isConnected)input.closest('.text-input').after(controls);
    list.classList.add('library-catalog');
    list.innerHTML='<div id="library-result-grid" class="library-results"></div><nav class="library-pagination"><button class="secondary" type="button" data-library-page="previous"></button><span id="library-page-status" tabindex="-1"></span><button class="secondary" type="button" data-library-page="next"></button></nav>';
    const grid=doc.getElementById('library-result-grid');
    const pager=list.querySelector('.library-pagination');
    const previous=pager.querySelector('[data-library-page="previous"]');
    const next=pager.querySelector('[data-library-page="next"]');
    const status=doc.getElementById('library-page-status');
    const institutionSelect=doc.getElementById('library-institution');
    const materialSelect=doc.getElementById('library-material');
    const mediaSelect=doc.getElementById('library-media');
    count.setAttribute('role','status');count.setAttribute('aria-live','polite');count.setAttribute('aria-atomic','true');
    let allItems=[],searched=[],current=[],query='',signature='',page=0;
    let filters={institution:M.state?.catalogSite||'all',material:'all',media:'all'};
    function unique(items){const seen=new Set();return(Array.isArray(items)?items:[]).filter(a=>a&&typeof a.id==='string'&&!seen.has(a.id)&&seen.add(a.id));}
    function setOptions(select,entries,value){
      const html=entries.map(([id,title])=>`<option value="${escape(id)}">${escape(title)}</option>`).join('');
      if(select.innerHTML!==html)select.innerHTML=html;
      select.value=value;
    }
    function updateFilters() {
      const institutions=new Map(),materials=new Map();
      allItems.forEach(a=>{institutions.set(institution(a),institutionLabel(a));materials.set(material(a),materialLabel(a));});
      if(filters.institution!=='all'&&!institutions.has(filters.institution))filters.institution='all';
      if(filters.material!=='all'&&!materials.has(filters.material))filters.material='all';
      setOptions(institutionSelect,[['all',tr('all')],...institutions],filters.institution);
      setOptions(materialSelect,[['all',tr('all')],...[...materials].sort((a,b)=>a[1].localeCompare(b[1],lang()))],filters.material);
      setOptions(mediaSelect,[['all',tr('all')],['yes',tr('withVideo')],['no',tr('withoutVideo')]],filters.media);
      controls.setAttribute('aria-label',tr('filters'));
      controls.querySelectorAll('[data-library-label]').forEach(el=>{el.textContent=tr(el.dataset.libraryLabel);});
    }
    function thumbnail(a) {
      const mapped=window.MuseumMediaMap?.[a.image]||a.image;
      const src=safeUrl(mapped);
      // Local cached thumbnails only: rendering a catalog never contacts arbitrary image hosts.
      if(!src||new URL(src).origin!==location.origin)return `<span class="library-thumbnail library-no-photo">${escape(tr('noPhoto'))}</span>`;
      return `<span class="library-thumbnail"><img src="${escape(src)}" alt="" loading="lazy" decoding="async" width="112" height="112"><span class="library-image-fallback" hidden>${escape(tr('noPhoto'))}</span></span>`;
    }
    function card(a) {
      const title=name(a),m=meta(a),external=isExternal(a),videos=videoItems(a);
      const relations=[...new Set(videos.map(v=>v.relation))];
      const videoTags=relations.map(relation=>`<span>${escape(tr(relation==='theme'?'themeVideo':relation==='overview'?'overviewVideo':relation==='object'?'objectVideo':'video'))}</span>`).join('');
      return `<button type="button" class="artifact-listitem library-card${external?' library-external':''}" data-artifact="${escape(a.id)}">${thumbnail(a)}<span class="library-record-body"><b>${escape(title)}</b><small>${escape(m.era||tr('unknown'))}</small><em>${escape(summary(a))}</em><span class="library-record-source">${escape(tr('source'))}: ${escape(institutionLabel(a))}</span><span class="library-tags">${external?`<span class="library-external-tag">${escape(tr('external'))}</span>`:''}${a.sourceLanguage==='vi'&&lang()!=='vi'?`<span>${escape(tr('sourceVi'))}</span>`:a.sourceLanguage==='en'&&lang()!=='en'?`<span>${escape(tr('sourceEn'))}</span>`:''}${videoTags}</span></span><span class="artifact-arrow" aria-hidden="true">›</span></button>`;
    }
    function draw({scroll=false}={}) {
      updateFilters();
      current=searched.filter(a=>(filters.institution==='all'||institution(a)===filters.institution)&&(filters.material==='all'||material(a)===filters.material)&&(filters.media==='all'||hasVideo(a)===(filters.media==='yes')));
      const pages=Math.max(1,Math.ceil(current.length/PAGE_SIZE));page=Math.max(0,Math.min(page,pages-1));
      const start=page*PAGE_SIZE,visible=current.slice(start,start+PAGE_SIZE);
      grid.setAttribute('aria-label',tr('resultList'));
      grid.innerHTML=visible.length?visible.map(card).join(''):`<div class="library-empty"><h2>${escape(tr('empty'))}</h2><p>${escape(tr('tryAgain'))}</p><button type="button" class="secondary" data-library-clear>${escape(tr('clear'))}</button></div>`;
      const range=visible.length?`${start+1}–${start+visible.length}`:'0';
      count.textContent=`${current.length} ${tr('records')} · ${tr('shown')} ${range}`;
      previous.textContent=`← ${tr('previous')}`;next.textContent=`${tr('next')} →`;
      previous.disabled=page===0;next.disabled=page>=pages-1;
      status.textContent=`${tr('page')} ${page+1} ${tr('of')} ${pages}`;
      pager.setAttribute('aria-label',tr('pagination'));pager.hidden=current.length===0;
      if(scroll)list.scrollTo({top:0,behavior:'auto'});
    }
    function onChange(event) {
      const key=event.target===institutionSelect?'institution':event.target===materialSelect?'material':event.target===mediaSelect?'media':null;
      if(!key)return;
      filters[key]=event.target.value;page=0;
      if(key==='institution'&&M.state)M.state.catalogSite=filters.institution;
      draw({scroll:true});
    }
    function onClick(event) {
      const button=event.target.closest('button');if(!button||!list.contains(button))return;
      if(button.dataset.libraryPage){
        page+=button.dataset.libraryPage==='next'?1:-1;draw({scroll:true});
        // Keep keyboard users on a usable pagination control after the final page is reached.
        if(button.disabled)(button===next?previous:next).focus({preventScroll:true});
      }else if(button.hasAttribute('data-library-clear')){
        filters={institution:'all',material:'all',media:'all'};if(M.state)M.state.catalogSite='all';
        input.value='';query='';searched=allItems;page=0;signature='';draw({scroll:true});
        input.dispatchEvent(new Event('input',{bubbles:true}));input.focus({preventScroll:true});
      }else if(button.dataset.artifact){
        event.stopPropagation();M.openArtifact?.(button.dataset.artifact);
      }
    }
    function onImageError(event){const image=event.target;if(image.tagName!=='IMG')return;image.hidden=true;const fallback=image.nextElementSibling;if(fallback)fallback.hidden=false;}
    controls.addEventListener('change',onChange);list.addEventListener('click',onClick);grid.addEventListener('error',onImageError,true);
    const controller={
      render(items,config={}) {
        allItems=unique(config.allItems||M.A||items);searched=unique(items);query=String(config.query??input.value??'');
        const nextSignature=query+'\u0000'+searched.map(a=>a.id).join('\u0001');
        if(nextSignature!==signature)page=0;signature=nextSignature;draw();return controller;
      },
      getState(){return{...filters,page:page+1,pageSize:PAGE_SIZE,total:current.length,visible:Math.min(PAGE_SIZE,Math.max(0,current.length-page*PAGE_SIZE)),query};},
      destroy(){controls.removeEventListener('change',onChange);list.removeEventListener('click',onClick);grid.removeEventListener('error',onImageError,true);},
      hasVideo
    };
    return controller;
  }
  window.MuseumLibrary={createController,PAGE_SIZE,hasVideo};
})();
