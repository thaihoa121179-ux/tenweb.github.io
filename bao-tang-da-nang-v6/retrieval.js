/* RAG nhỏ: xếp hạng hồ sơ tại máy, server luôn đối chiếu lại bản nguồn của mình. */
((root)=>{
 const fold=s=>String(s||'').normalize('NFD').replace(/\p{M}/gu,'').replace(/đ/gi,'d').toLowerCase();
 const stop=new Set(['this','that','what','when','the','about','museum','hien','vat','cai','nay','bao','tang','toi','cho','cua','nhung']);
 function search(query,records,{artifact=null,limit=5}={}){
  const q=fold(query),words=[...new Set(q.split(/[^\p{L}\p{N}]+/u).filter(w=>w.length>2&&!stop.has(w)))];
  return records.map(a=>{const names=fold([a.name,a.en,...(a.guide?.names||[])].join(' ')),text=names+' '+fold([a.summary,a.era,a.material,...(a.guide?.descriptions||[])].join(' '));let score=a.id===artifact?100:0;for(const name of [a.name,a.en,...(a.guide?.names||[])])if(name&&q.includes(fold(name)))score+=40;for(const w of words)score+=names.includes(w)?8:text.includes(w)?1:0;return{record:a,score};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,Math.max(1,Math.min(5,limit))).map(x=>x.record);
 }
 root.MuseumRetrieval=Object.freeze({search});
})(globalThis);
