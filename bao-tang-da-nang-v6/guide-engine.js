/* Source-record intent resolver shared by the browser and optional Worker.
 * This is deterministic retrieval and conversation state, never a trained model.
 * Dates, materials and locations must still be answered from returned records. */
((root) => {
  'use strict';
  const normalize = value => String(value ?? '').slice(0,12000).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').normalize('NFC').replace(/đ/g,'d').replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ');
  const colloquial = (text,lang='vi') => {
    let q=normalize(text);
    if(lang==='vi')q=q.replace(/\b(k|ko|khg|hok|hong|hem)\b/g,'khong').replace(/\b(dc|dk)\b/g,'duoc').replace(/\b(mik|mk)\b/g,'minh').replace(/\b(zay|z)\b/g,'vay').replace(/\bj\b/g,'gi');
    return q;
  };
  const rawId = id => String(id||'').replace(/^(?:artifact|topic):/,'');
  const unique = list => [...new Set(list)];
  const containsCJK = s => /[가-힣\u3400-\u9fff]/u.test(s);
  function occurrences(q,p){
    p=normalize(p);if(!p)return [];
    const hits=[];let at=q.indexOf(p);
    while(at>=0){const before=q[at-1],after=q[at+p.length];if(containsCJK(p)||(!before||before===' ')&&(!after||after===' '))hits.push({start:at,end:at+p.length});at=q.indexOf(p,at+1)}
    return hits;
  }
  const has=(q,p)=>occurrences(q,p).length>0;
  const any=(q,list)=>list.some(p=>has(q,p));
  const aliases={
    'sung-than-cong':['than cong','cannon','대포','古炮'],
    'ma-nao':['ma nao','agate','마노','玛瑙'],
    'sac-phong':['sac phong','royal edict','칙서','敕封'],
    'doi-bau':['doi bau','carrying vessels','운반 용기','挑担容器'],
    'bom-cbu':['bom cbu','cbu 55','cbu55','cbu'],
    'phu-dieu':['phu dieu','co tu relief','목조 부조','木雕浮雕'],
    'di-chuc':['di chuc','testament','유언장','遗嘱'],
    'canh-cua':['canh cua','prison doors','감옥 문','监狱门'],
    'ghe-bau':['ghe bau','trading boat','무역선','商船']
  };
  const tags={
    history:['lich su','chien tranh','history','war','역사','历史'],
    culture:['van hoa','dan toc','culture','ethnic','문화','文化'],
    antique:['co vat','do co','antiquities','antique','유물','古物'],
    family:['gia dinh','tre em','tre nho','children','family','kids','가족','어린이','家庭','儿童'],
    modern:['thanh pho','do thi','modern','city','도시','城市']
  };
  const materials={
    paper:['giay','paper','종이','纸'],wood:['go','wood','wooden','목재','나무','木'],
    stone:['da','stone','sandstone','nephrite','돌','석재','石'],metal:['kim loai','sat','thep','dong','metal','iron','steel','bronze','금속','철','金属','铁','铜'],
    ceramic:['gom','su','dat nung','ceramic','pottery','terracotta','도자기','토기','陶','瓷'],glass:['thuy tinh','glass','유리','玻璃'],gold:['vang','gold','금','黄金'],agate:['ma nao','agate','마노','玛瑙']
  };
  const safeTags=new Set(Object.keys(tags));
  function clauseBefore(q,start){return q.slice(0,start).split(/\b(?:nhung|tuy nhien|but|however|instead|ma la)\b|但是|不过|但|대신|하지만/).at(-1).slice(-70)}
  function negated(q,span){
    const before=clauseBefore(q,span.start),after=q.slice(span.end,span.end+38);
    // A double negative or inclusive "not just" is not an exclusion.
    if(/(?:khong (?:ghet|phai chi)|not (?:only|just)|do not dislike|don t dislike)\s*$/.test(before))return false;
    return /(?:khong (?:thich|muon|can|chon|xem|quan tam|phai)(?: xem| ve| den| la)?|bo qua|tru|ngoai tru|tranh|not interested in|don t like|do not like|don t want(?: to see)?|do not want(?: to see)?|not(?: the)?|skip|avoid|except|exclude|instead of|不喜欢|不想看|不想|不要|不是|排除)\s*$/.test(before)
      || /^(?:(?:이|가|은|는|을|를|에는)\s*)?(?:싫|말고|제외|아니)/.test(after);
  }
  function entityNegated(q,span){const before=clauseBefore(q,span.start),after=q.slice(span.end,span.end+25);return /(?:khong phai|khong chon|bo qua|not(?: the)?|instead of|don t mean|do not mean|不是|不要)\s*$/.test(before)||/^(?:(?:이|가|은|는|을|를)\s*)?(?:아니|말고|제외)/.test(after)}
  function editDistance(a,b){
    if(a===b)return 0;if(Math.abs(a.length-b.length)>1)return 2;
    let row=Array.from({length:b.length+1},(_,i)=>i),older=null;
    for(let i=1;i<=a.length;i++){const next=[i];for(let j=1;j<=b.length;j++){let value=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]===b[j-1]?0:1));if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])value=Math.min(value,older[j-2]+1);next[j]=value}older=row;row=next}return Math.min(2,row[b.length]);
  }
  const generic=new Set(['tuong','statue','binh','am','hu','hop','dia','book','sach','picture','anh']);
  function specificGeneric(q,n,span){if(!generic.has(n))return true;const remaining=(q.slice(0,span.start)+' '+q.slice(span.end)).replace(/\b(?:ho so|hien vat|nay|do|ay|la|gi|chat lieu|nien dai|cua|nam|nao|co|tu|khi|bao gio|o dau|what|is|the|material|date|of|this|that)\b/g,'').trim();return !remaining}
  function entities(query,records=[]){
    const q=normalize(query).slice(0,1400),words=[...q.matchAll(/\S+/g)].map(m=>({text:m[0],start:m.index,end:m.index+m[0].length}));
    const hits=[];
    for(const record of records.slice(0,2000)){
      const names=unique([...(Array.isArray(record.names)?record.names:[]),...(aliases[rawId(record.id)]||[])]).filter(n=>typeof n==='string'&&n.length<=400);
      // Parenthetical qualifiers can be omitted only if the non-parenthetical name stays distinctive.
      for(const name of [...names])if(/[（(]/.test(name)){const stem=name.replace(/\([^)]*\)|（[^）]*）/g,' ').trim();if(normalize(stem).length>=7)names.push(stem)}
      for(const name of unique(names)){
        const n=normalize(name);for(const span of occurrences(q,n))if(!entityNegated(q,span)&&specificGeneric(q,n,span))hits.push({record,score:80+n.length,span});
        if(!/^[a-z0-9 ]+$/.test(n))continue;const parts=n.split(' ');if(parts.length<2||parts.length>10||!parts.some(p=>p.length>=4))continue;
        for(let i=0;i<=words.length-parts.length;i++){
          let distance=0;for(let j=0;j<parts.length&&distance<=1;j++)distance+=editDistance(parts[j],words[i+j].text);
          if(distance!==1)continue;const span={start:words[i].start,end:words[i+parts.length-1].end};if(!entityNegated(q,span))hits.push({record,score:50+n.length,span});
        }
      }
    }
    // A longer title at the same text position wins over generic embedded names or aliases.
    const precise=hits.filter(h=>!hits.some(other=>other.record.id!==h.record.id&&other.span.start<=h.span.start&&other.span.end>=h.span.end&&other.span.end-other.span.start>h.span.end-h.span.start));
    const best=new Map();for(const h of precise){const prior=best.get(h.record.id);if(!prior||h.score>prior.score)best.set(h.record.id,h)}
    return [...best.values()].sort((a,b)=>b.score-a.score||a.span.start-b.span.start).map(({record,score})=>({record,score}));
  }
  function duration(input){
    if(/(?:^|\s)-\s*\d/.test(String(input)))return null;const q=normalize(input);if(/(?:\bminus|\bam|\bnegative)\s+\d/.test(q))return null;
    const special=[[/nua (?:tieng|gio)|half (?:an )?hour|半小时|半小時|반 시간/,30],[/mot (?:tieng|gio) ruoi|one and a half hours|한 시간 반|一(?:个)?半小时|一小时半/,90],[/muoi lam phut|quarter (?:of an )?hour|十五分钟/,15],[/mot (?:tieng|gio)|one hour|한 시간|一小时/,60],[/hai (?:tieng|gio)|two hours|두 시간|两小时|二小时/,120]];
    for(const [re,value]of special.sort((a,b)=>b[1]-a[1]))if(re.test(q)&&!negated(q,{start:q.search(re),end:q.search(re)+q.match(re)[0].length}))return value;
    const tokens=[...q.matchAll(/(?:^|\s|(?<=[\u3400-\u9fff]))(\d{1,3})\s*(tieng|gio|hours?|hrs?|h\b|시간|小时|phut|p\b|minutes?\b|mins?\b|m\b|분|分钟)/gu)];
    const valid=tokens.filter(m=>!negated(q,{start:m.index,end:m.index+m[0].length})).map(m=>({value:Number(m[1])*(/^(?:tieng|gio|hours?|hrs?|h|시간|小时)$/.test(m[2])?60:1),hour:/^(?:tieng|gio|hours?|hrs?|h|시간|小时)$/.test(m[2]),start:m.index,end:m.index+m[0].length}));
    if(!valid.length)return null;let value=valid.at(-1).value;const last=valid.at(-1),prev=valid.at(-2);if(prev?.hour&&!last.hour&&q.slice(prev.end,last.start).trim().match(/^(?:va|and|零)?$/))value+=prev.value;
    return value>0&&value<=180?value:null;
  }
  function interest(q){const decisions=new Map();for(const [tag,phrases]of Object.entries(tags))for(const phrase of phrases)for(const span of occurrences(q,phrase)){const prior=decisions.get(tag);if(!prior||span.start>=prior.at)decisions.set(tag,{at:span.start,negative:negated(q,span)})}return {positive:[...decisions].filter(([,d])=>!d.negative).sort((a,b)=>b[1].at-a[1].at).map(([tag])=>tag),negative:[...decisions].filter(([,d])=>d.negative).map(([tag])=>tag)}}
  function floorSlot(q){const hits=[...q.matchAll(/(?:\btang|\bfloor)\s*(\d{1,2})\b|(\d{1,2})\s*층|第?([一二三四五六七八九十\d]{1,2})\s*[楼层]/gu)];if(!hits.length)return {value:null,unsupported:null};const m=hits.at(-1);const chinese={一:1,二:2,三:3,四:4,五:5,六:6,七:7,八:8,九:9,十:10};const number=Number(m[1]||m[2]||chinese[m[3]]||m[3]);return [1,2,3].includes(number)?{value:number,unsupported:null}:{value:null,unsupported:number}}
  const fields={
    material:['chat lieu','lam bang','vat lieu','material','made of','made from','재질','무엇으로','材质','材料'],
    era:['nien dai','nam nao','co tu khi nao','thoi ky','bao nhieu tuoi','bao gio','date','dating','how old','what year','when','연대','언제','몇 년','年代','何时','什么时候'],
    origin:['nguon goc','xuat xu','phat hien','tim thay','khai quat','origin','discovered','excavated','found','출토','발견','来源','出土','发现'],
    dimensions:['kich thuoc','chieu cao','chieu dai','dimensions','height','length','size','크기','높이','尺寸','高度'],
    weight:['can nang','nang bao nhieu','trong luong','weight','weigh','무게','重量','多重'],
    location:['o dau','vi tri','tang nao','phong nao','tu nao','where','which floor','which room','location','어디','위치','几楼','哪里','位置','展柜'],
    summary:['ke them','noi them','chi tiet','y nghia','giai thich','tell me more','more details','explain','significance','더 알려','자세히','详细','更多','介绍']
  };
  function factField(q){for(const [field,phrases]of Object.entries(fields))if(any(q,phrases))return field;return null}
  function ordinal(q){
    const specs=[[/\b(?:dau tien|thu nhat|first)\b|첫\s*번째|第一个/g,0],[/\b(?:thu hai|second)\b|두\s*번째|第二个/g,1],[/\b(?:thu ba|third)\b|세\s*번째|第三个/g,2],[/\b(?:thu tu|fourth)\b|네\s*번째|第四个/g,3],[/\b(?:thu nam|fifth)\b|다섯\s*번째|第五个/g,4]];
    const found=[];for(const [re,value]of specs)for(const m of q.matchAll(re))if(!negated(q,{start:m.index,end:m.index+m[0].length}))found.push(value);
    for(const m of q.matchAll(/\b(?:cai|so|thu|number|item|option)\s*(\d{1,2})\b/g))if(!/co\s+$/.test(q.slice(0,m.index))&&!negated(q,{start:m.index,end:m.index+m[0].length}))found.push(Number(m[1])-1);
    if(/^[123]$/.test(q))found.push(Number(q)-1);
    return unique(found);
  }
  function contextualOnly(q){
    let rest=q;
    const phrases=Object.values(fields).flat().sort((a,b)=>b.length-a.length);
    for(const p of phrases)rest=rest.split(normalize(p)).join(' ');
    rest=rest.replace(/\b(?:no|cai|do|ay|nay|hien vat|nay thi sao|the|that|this|it|one|its|these|those|them|what|is|are|was|were|does|do|of|about|please|can|you|me|tell|how|and|la|gi|the nao|thi|sao|vay|cho|minh|toi|biet|them|duoc|khong|a|nhe|nhi|nao|co|tu|khi|bao|nhieu|bang|cua|cai do|hien vat do)\b/g,' ')
      .replace(/그것|이것|그거|이거|그 유물|이 유물|은|는|이|가|을|를|의|뭐|무엇|인가요|입니까|알려주세요|주세요|으로|이야|어떻게|얼마나|它|这个|那个|这件|那件|文物|的|是|什么|多少|呢|吗|请|告诉我|一下|在|由|制成|做成|有|用|请问/g,' ').replace(/\s+/g,' ').trim();
    return rest.length===0;
  }
  function preferencesFrom(memory){const p=memory?.preferences&&typeof memory.preferences==='object'?memory.preferences:{};const next={excluded:Array.isArray(p.excluded)?unique(p.excluded.filter(x=>safeTags.has(x))):[]};if(safeTags.has(p.interest))next.interest=p.interest;else if(p.interest===null)next.interest=null;if(Number.isFinite(p.minutes)&&p.minutes>0&&p.minutes<=180)next.minutes=p.minutes;if(typeof p.lowWalking==='boolean')next.lowWalking=p.lowWalking;if([1,2,3].includes(p.floor))next.floor=p.floor;if(Array.isArray(p.materials))next.materials=p.materials.filter(x=>materials[x]);if(Array.isArray(p.excludedMaterials))next.excludedMaterials=p.excludedMaterials.filter(x=>materials[x]);if(['site1','site2'].includes(p.site))next.site=p.site;return next}
  function understand(message,memory={},options={}){
    memory=memory&&typeof memory==='object'?memory:{};const q=colloquial(String(message??'').slice(0,1400),options.lang||'vi');const records=Array.isArray(options.records)?options.records:[];
    const p=preferencesFrom(memory),likes=interest(q),minutes=duration(message),floor=floorSlot(q);
    const lowWalking=any(q,['it di bo','ngai di bo','nhat di bo','luoi di bo','khong muon di bo','khong thich di bo','khong di bo nhieu','khong muon di nhieu','it di chuyen','khong muon leo cau thang','toi met','met chan','dau chan','xe lan','less walking','not much walking','don t want to walk','tired of walking','wheelchair','avoid stairs','걷기 싫','걷고 싶지','걷는 게 힘들','오래 걷','많이 걷고','적게 걷','휠체어','많이 걷기','少走路','不想走','走累了','轮椅']);
    const resetWalking=any(q,['di bo thoai mai','di nhieu cung duoc','khong ngai di bo','khong luoi di bo','khong met','walking is fine','no walking limit','걷기 괜찮','可以多走','不怕走路']);
    if(lowWalking)p.lowWalking=true;if(resetWalking)p.lowWalking=false;
    for(const tag of likes.negative){if(!p.excluded.includes(tag))p.excluded.push(tag);if(p.interest===tag)p.interest=null}
    if(likes.positive.length){p.interest=likes.positive[0];for(const tag of likes.positive)p.excluded=p.excluded.filter(t=>t!==tag)}
    if(minutes)p.minutes=minutes;if(floor.value)p.floor=floor.value;
    const active=['route','low-walking','highlights','preference'].includes(memory.activeIntent);
    const brief=q.match(/^(?:con\s+)?(\d{1,3})(?:\s+(?:thi sao|thoi)|은요|呢)?$/);if(brief&&active&&Number(brief[1])>0&&Number(brief[1])<=180)p.minutes=Number(brief[1]);
    const materialPos=[],materialNeg=[];for(const [key,phrases]of Object.entries(materials))for(const phrase of phrases)for(const span of occurrences(q,phrase)){if(negated(q,span))materialNeg.push(key);else materialPos.push(key)}
    // A factual question about a named object is not a new shopping/filter preference.
    const recognized=entities(q,records).map(x=>x.record);
    const filtering=!recognized.length&&any(q,['tim','loc','chon','goi y','muon xem','dang xem','noi bat','show','find','filter','recommend','must see','보고 싶','볼만','찾','推荐','筛选','找'])&&materialPos.length>0;
    if(filtering&&materialPos.length)p.materials=unique(materialPos);if(filtering&&materialNeg.length)p.excludedMaterials=unique([...(p.excludedMaterials||[]),...materialNeg]);
    const site=q.match(/(?:co so|site|branch)\s*([12])\b|([12])\s*호관|第([一二12])馆/);if(site)p.site='site'+(site[1]||site[2]||{一:1,二:2}[site[3]]||site[3]);
    const rawField=factField(q);const field=filtering&&['material','location'].includes(rawField)?null:rawField;const ord=ordinal(q);const lookup=id=>records.find(r=>r.id===id||rawId(r.id)===rawId(id));
    const recommended=Array.isArray(memory.recommended)?memory.recommended.filter(id=>lookup(id)) : [];
    const result={intent:null,preferences:p,entities:recognized,query:q,factField:field,needsClarification:false,unsupportedFloor:floor.unsupported,selected:null};
    if(floor.unsupported!==null){result.entities=[];return result}
    const compare=any(q,['so sanh','khac nhau','compare','difference','비교','比较','区别']);
    if(compare){result.intent=recognized.length>=2?'compare':null;result.needsClarification=recognized.length<2;return result}
    if(recognized.length&&field){result.intent='fact';return result}
    const requestedOrdinal=ord.length>0;let referenced=null;
    if(requestedOrdinal){if(ord.length===1&&ord[0]>=0&&recommended[ord[0]])referenced=lookup(recommended[ord[0]]);else result.needsClarification=true}
    else if(field&&contextualOnly(q)){
      if(memory.activeIntent==='entity'&&(memory.artifact||memory.topic))referenced=lookup(memory.artifact||memory.topic);
      else if(recommended.length===1)referenced=lookup(recommended[0]);
      else if(!recommended.length&&(memory.artifact||memory.topic))referenced=lookup(memory.artifact||memory.topic);
      if(!referenced)result.needsClarification=true;
    }
    if(referenced){result.intent=field?'fact':'select';result.entities=field?[referenced]:[];result.selected=rawId(referenced.id);return result}
    if(requestedOrdinal||result.needsClarification){if(requestedOrdinal&&!field)result.intent='select';return result}
    if(field&&contextualOnly(q))return result;
    const visitor=any(q,['gia ve','gio mo cua','dia chi bao tang','ticket','opening hours','museum address','입장료','운영시간','门票','开放时间']);if(visitor)return result;
    if(any(q,['choi quiz','bat dau quiz','cau do','play quiz','start quiz','퀴즈','测验','问答游戏']))result.intent='quiz';
    else if(any(q,['nhat ky','ghi chu chuyen di','journal','visit notes','일지','日记']))result.intent='journal';
    else if(any(q,['ban giup duoc gi','ban lam duoc gi','co the lam gi','what can you do','how can you help','무엇을 할 수','能做什么']))result.intent='help';
    else if(lowWalking&&!resetWalking)result.intent='low-walking';
    else if(resetWalking)result.intent='route';
    else if(recognized.length&&!minutes&&!any(q,['lo trinh','hanh trinh','route','itinerary','tour','코스','路线']))result.intent='entity';
    else if(!likes.negative.length&&any(q,['khong muon xem','chang muon xem','khong thich xem','khong muon tham quan','chan xem','khong xem hien vat','dont want to look','don t want to see','do not want to see','not interested in exhibits','전시 보기 싫','전시를 보고 싶지','전시가 지루','보기 싫','不想看展','不想参观']))result.intent='alternatives';
    else if(any(q,['dang xem','dang xem nhat','dep nhat','noi bat','nen xem gi','nen xem cai nao','xem gi truoc','lan dau','bat dau tu dau','khong biet xem gi','co gi hay','goi y hien vat','must see','best artifact','recommend an artifact','worth seeing','highlights','first visit','볼만한','추천 유물','처음 방문','值得看','推荐文物','必看','第一次']))result.intent='highlights';
    else if(any(q,['lo trinh','hanh trinh','nen di','tham quan gi','route','itinerary','tour','코스','路线'])||minutes||(brief&&active))result.intent='route';
    else if(recognized.length)result.intent='entity';
    else if((likes.positive.length||likes.negative.length||filtering&&materialPos.length)&&!field)result.intent=active&&memory.activeIntent!=='highlights'?'route':'highlights';
    else if(any(q,['anh','xem anh','cho xem','picture','photo','사진','照片'])&&contextualOnly(q.replace(/\b(?:anh|xem anh|cho xem|picture|photo)\b|사진|照片/g,''))){result.intent='select';result.selected=recommended.length===1?rawId(recommended[0]):null;result.needsClarification=!result.selected}
    else if(/^(?:tai sao|vi sao|why|왜|为什么)(?: lai)?(?: chon| goi y| recommend| 추천)?(?: cai do| no| that| it|这个|它)?$/.test(q)){result.intent=recommended.length?'reason':null;result.needsClarification=!recommended.length}
    else if(any(q,['co cach nao khac','cach khac','con gi nua','khac nua','something else','another option','다른 방법','还有别的','换一个'])&&memory.activeIntent==='alternatives')result.intent='alternatives';
    return result;
  }
  function materialTags(a){if(a.materialVerified===false||a.materialUnverified||!a.material)return [];const text=normalize(typeof a.material==='string'?a.material:'');return Object.entries(materials).filter(([,phrases])=>phrases.some(p=>has(text,p))).map(([key])=>key)}
  function rank(artifacts,preferences={}){
    const favorites={history:['sung-than-cong','sac-phong','doi-bau','canh-cua','di-chuc','bom-cbu'],culture:['ghe-bau','phu-dieu','ma-nao'],antique:['ma-nao','sac-phong','sung-than-cong'],family:['ghe-bau','ma-nao','phu-dieu'],modern:['ghe-bau','sac-phong']};
    const priority=favorites[preferences.interest]||['sung-than-cong','ma-nao','ghe-bau'];
    return artifacts.filter(a=>!(a.tags||[]).some(t=>preferences.excluded?.includes(t)))
      .filter(a=>!preferences.floor||a.floor===preferences.floor||a.thematicFloor===preferences.floor)
      .filter(a=>!preferences.site||a.sourceSite===preferences.site)
      .filter(a=>!preferences.materials?.length||materialTags(a).some(t=>preferences.materials.includes(t)))
      .filter(a=>!preferences.excludedMaterials?.some(t=>materialTags(a).includes(t)))
      .map((a,i)=>({a,order:i,score:((a.tags||[]).includes(preferences.interest)?100:0)+(priority.includes(rawId(a.id))?40-priority.indexOf(rawId(a.id))*3:0)}))
      .sort((a,b)=>b.score-a.score||a.order-b.order).slice(0,3).map(x=>x.a);
  }
  root.MuseumGuideEngine=Object.freeze({normalize,colloquial,understand,entities,rank,duration});
})(globalThis);
