/* Chỉ đếm ID/loại thao tác. Không lưu câu hỏi thô, tên, tọa độ, ảnh hoặc nhật ký. */
(() => {
 const M=Museum,key='museum_anonymous_counts_v1',blank=()=>({version:1,questions:{},artifacts:{},zones:{},languages:{},missions:{}});let data=blank();
 try{const stored=JSON.parse(M.sv(key,'null'));if(stored?.version===1)for(const k of ['questions','artifacts','zones','languages','missions'])if(stored[k]&&typeof stored[k]==='object'&&!Array.isArray(stored[k]))data[k]=Object.fromEntries(Object.entries(stored[k]).filter(([id,v])=>typeof id==='string'&&id.length<100&&Number.isInteger(v)&&v>=0&&v<10000000));}catch{}
 function record(type,id){const safe={artifact:'artifacts',question:'questions',zone:'zones',language:'languages',mission:'missions'}[type];if(!safe||typeof id!=='string'||id.length>100)return;data[safe][id]=(data[safe][id]||0)+1;M.persist(key,JSON.stringify(data));
  if(M.sv('museum_analytics_optin')==='yes'){const endpoint=M.sv('museum_ai_endpoint');try{const url=new URL(endpoint);if(url.protocol!=='https:')return;url.pathname=url.pathname.replace(/\/chat\/?$/,'')+'/events';url.search='';fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'omit',body:JSON.stringify({type,id,language:M.state.lang}),keepalive:true}).catch(()=>{});}catch{}}
 }
 document.addEventListener('museum:navigate',()=>{if(M.state.page==='artifact')record('artifact',M.state.artifact);});
 document.addEventListener('museum:language',()=>record('language',M.state.lang));
 document.addEventListener('museum:question',e=>record('question',String(e.detail.intent||'unknown').replace(/[^a-z-]/g,'').slice(0,40)||'unknown'));
 document.addEventListener('museum:position',e=>{if(e.detail.via==='qr')record('zone',e.detail.topic||'floor-'+e.detail.floor);});
 window.MuseumAnalytics={record,getData:()=>structuredClone(data)};
})();
