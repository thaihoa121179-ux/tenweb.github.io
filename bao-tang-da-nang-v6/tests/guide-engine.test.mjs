import test from 'node:test';
import assert from 'node:assert/strict';
import '../guide-engine.js';
const engine=globalThis.MuseumGuideEngine;
const records=[
 {id:'sung-than-cong',type:'artifact',names:['Súng thần công','Historic cannon','역사적 대포','古炮'],tags:['history']},
 {id:'ma-nao',type:'artifact',names:['Trang sức mã não','Agate jewelry','마노 장신구','玛瑙饰品'],tags:['antique']},
 {id:'ghe-bau',type:'artifact',names:['Ghe bầu','Traditional trading boat','전통 무역선','商船'],tags:['culture']},
 {id:'sac-phong',type:'artifact',names:['Sắc phong','Royal edict','칙서','敕封文书'],tags:['history']},
];
const decide=(q,memory={},lang='vi')=>engine.understand(q,memory,{lang,records});

test('the user screenshots produce useful practical intents, including shorthand and typo',()=>{
 for(const [q,intent] of [['hiện vật nào đáng xem nhất','highlights'],['tôi tới mà k muốn xem thì làm gì','alternatives'],['tôi nhát đi bộ lắm có cách nào ko','low-walking']])assert.equal(decide(q).intent,intent);
 for(const q of ['không muốn đi bộ nhiều','mình ngại đi bộ','tôi lười đi bộ','tôi mệt chân'])assert.equal(decide(q).preferences.lowWalking,true);
});
test('four languages recognize highlights, alternatives and less walking',()=>{
 const cases={vi:['hiện vật nào đáng xem','tôi không muốn xem','tôi ngại đi bộ'],en:['What are the highlights?','I don’t want to see exhibits','I prefer less walking'],ko:['추천 유물은 무엇인가요?','전시를 보고 싶지 않아요','많이 걷고 싶지 않아요'],zh:['有什么必看文物？','我不想看展','我想少走路']};
 for(const [lang,questions]of Object.entries(cases))for(const [i,q]of questions.entries())assert.equal(decide(q,{},lang).intent,['highlights','alternatives','low-walking'][i],q);
});
test('interests, a short duration and a walking preference survive follow-up turns',()=>{
 let memory={};
 for(const [q,mins]of [['tôi thích lịch sử và ngại đi bộ',null],['tôi chỉ có 10 phút',10],['30 thì sao',30]]){
  const d=decide(q,memory);memory={preferences:d.preferences,activeIntent:d.intent};assert.equal(d.preferences.interest,'history');assert.equal(d.preferences.lowWalking,true);if(mins)assert.equal(d.preferences.minutes,mins);
 }
});
test('explicitly lifting a walking restriction does not keep a hidden constraint',()=>{
 const d=decide('tôi không ngại đi bộ, 60 phút cũng được',{preferences:{lowWalking:true,minutes:15},activeIntent:'low-walking'});
 assert.equal(d.preferences.lowWalking,false);assert.equal(d.preferences.minutes,60);assert.equal(d.intent,'route');
});
test('negated interests are excluded while a new positive interest is retained',()=>{
 const d=decide('không thích lịch sử, tôi thích văn hóa hơn',{preferences:{interest:'history'},activeIntent:'highlights'});
 assert.deepEqual(d.preferences.excluded,['history']);assert.equal(d.preferences.interest,'culture');
 assert(engine.rank(records,d.preferences).every(r=>!r.tags.includes('history')));
});
test('ordinal follow-ups select the actual previously recommended record',()=>{
 const memory={recommended:['sung-than-cong','ma-nao','ghe-bau'],activeIntent:'highlights'};
 for(const [q,id]of [['cái đầu tiên','sung-than-cong'],['cái thứ hai','ma-nao'],['số 3','ghe-bau']])assert.equal(decide(q,memory).selected,id);
 assert.equal(decide('cái thứ hai').selected,null);
});
test('complete distinctive names tolerate a one-character typo; unrelated names never inherit records',()=>{
 assert.equal(engine.entities('sung than congx',records)[0].record.id,'sung-than-cong');
 for(const q of ['Tháp Eiffel có niên đại nào?','What is this alien cube made of?','khối lập phương ngoài hành tinh'])assert.deepEqual(engine.entities(q,records),[]);
 assert.equal(decide('What is this alien cube made of?',{preferences:{interest:'history'}},'en').intent,null);
});
test('comparison retrieves both named artifacts, preserving record identity',()=>{
 const d=decide('So sánh súng thần công và sắc phong');assert.equal(d.intent,'compare');assert.deepEqual(new Set(d.entities.map(e=>e.id)),new Set(['sung-than-cong','sac-phong']));
});
test('durations work with natural Vietnamese, English, Korean and Chinese units',()=>{
 for(const [q,mins]of [['nửa tiếng',30],['1 giờ',60],['10p',10],['half an hour',30],['2 hours',120],['15분',15],['半小时',30],['45分钟',45]])assert.equal(engine.duration(engine.normalize(q)),mins,q);
 assert.equal(engine.duration('999 phút'),null);
});
test('preferences are per-conversation values, never shared or mutated across sessions',()=>{
 const memory={preferences:{interest:'history',excluded:['family']}};const snapshot=JSON.stringify(memory);
 decide('tôi không thích lịch sử và muốn ít đi bộ',memory);
 assert.equal(JSON.stringify(memory),snapshot);assert.deepEqual(decide('hiện vật nào đáng xem').preferences,{excluded:[]});
});

test('app actions are recognized as actions rather than unknown historical questions',()=>{
 for(const [q,intent]of [['chơi quiz','quiz'],['mở nhật ký','journal'],['bạn giúp được gì','help']])assert.equal(decide(q).intent,intent);
});
