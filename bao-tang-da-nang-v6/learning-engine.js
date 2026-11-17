/* Quiz và lời kể dự phòng chỉ sử dụng trường dữ liệu đã có. */
((root)=>{
 const I={vi:0,en:1,ko:2,zh:3};
 function field(a,key,lang='vi'){const i=I[lang]??0;const d=root.MuseumDataV6?.artifacts?.[a.id];return d?.[key]?.[i]||({names:lang==='vi'?a.name:a.en||a.name,summaries:lang==='vi'?a.summary:a.enSummary||a.summary,eras:a.era,materials:a.material}[key])||'';}
 function quiz(artifacts,lang='vi'){
  const valid=artifacts.filter(a=>!a.referenceOnly),out=[];
  for(const a of valid){
   for(const [key,type] of [['eras','era'],['materials','material']]){
    if(type==='material'&&root.MuseumDataV6?.artifacts?.[a.id]?.flags?.materialUnverified)continue;
    const answer=field(a,key,lang);if(!answer||/chưa|không rõ|unknown|not verified|미확인|尚未/.test(answer))continue;
    const alternatives=[...new Set(valid.filter(b=>b.id!==a.id).map(b=>field(b,key,lang)).filter(v=>v&&v!==answer))].slice(0,3);if(alternatives.length<3)continue;
    const options=[answer,...alternatives];const shift=out.length%4;for(let j=0;j<shift;j++)options.push(options.shift());
    out.push({id:a.id,type,options,answer:options.indexOf(answer),explanation:field(a,'summaries',lang),source:a.url});break;
   }
   if(out.length===5)break;
  }
  return out;
 }
 function story(a,lang='vi',tone='visitor'){
  const i=I[lang]??0,name=field(a,'names',lang),summary=field(a,'summaries',lang),era=field(a,'eras',lang);
  const intro=[`Tôi là ${name}.`,`I am ${name}.`, `저는 ${name}입니다.`,`我是${name}。`][i];
  const quote=[`Hồ sơ ghi: “${summary}”`,`My record states: “${summary}”`,`기록에는 “${summary}”라고 적혀 있습니다.`,`档案记载：“${summary}”`][i];
  const question=['Bạn hãy nhìn kỹ một chi tiết rồi kể Mây nghe nhé.','Look closely at one detail. What do you notice?','세부 하나를 자세히 살펴보세요. 무엇이 보이나요?','请仔细观察一个细节，你发现了什么？'][i];
  const more=tone==='deep'?'\n\n'+['Theo hồ sơ, niên đại: ','According to the record, date: ','기록에 따른 연대: ','根据档案，年代：'][i]+era+'\n'+['Thông tin chưa có trong hồ sơ cần được hỏi nhân viên hoặc đối chiếu nguồn gốc.','For information not documented here, consult staff or the original source.','기록에 없는 정보는 직원이나 원문에서 확인하세요.','档案未记载的信息请咨询工作人员或对照原始来源。'][i]:'';
  return intro+'\n\n'+quote+more+(tone==='child'?'\n\n'+question:'');
 }
 root.MuseumLearning=Object.freeze({field,quiz,story});
})(globalThis);
