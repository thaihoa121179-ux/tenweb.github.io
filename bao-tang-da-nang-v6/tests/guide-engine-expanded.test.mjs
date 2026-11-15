import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import '../guide-engine.js';
const e=globalThis.MuseumGuideEngine;
const {records}=JSON.parse(fs.readFileSync(new URL('./chat-benchmark-baseline.json',import.meta.url)));
const decide=(q,memory={},lang='vi')=>e.understand(q,memory,{lang,records});

test('expanded imported titles retain identity and suppress their generic embedded titles',()=>{
 const cases=[['Tượng thần Siva có niên đại nào?','hv-tuong-than-siva-105d35'],['Khuyên tai hai đầu thú làm bằng gì?','hv-khuyen-tai-hai-dau-thu-8a56ff'],['Cho xem Tượng gỗ bé gái Cơ-tu','hv-tuong-go-be-gai-co-tu-608076'],['Tôi đang xem súng thần công','sung-than-cong']];
 for(const [q,id]of cases){const d=decide(q);assert.deepEqual(d.entities.map(r=>r.id),['artifact:'+id],q)}
});
test('exact correction replaces the negated object, rather than merging two unrelated records',()=>{
 const d=decide('Không phải mã não, mà là ghe bầu');assert.deepEqual(d.entities.map(r=>r.id),['artifact:ghe-bau']);assert.equal(d.intent,'entity');
});
test('source properties are classified without synthesizing a value',()=>{
 for(const [q,field]of [['Súng thần công nặng bao nhiêu?','weight'],['Sắc phong có kích thước nào?','dimensions'],['Mã não được khai quật ở đâu?','origin'],['Cánh cửa ở tủ nào?','location']]){const d=decide(q);assert.equal(d.intent,'fact');assert.equal(d.factField,field);assert.equal('answer'in d,false)}
});
test('unambiguous terse properties use a valid conversation record; unknown nouns never do',()=>{
 const memory={artifact:'sung-than-cong',activeIntent:'entity'};
 assert.equal(decide('Nó làm bằng gì?',memory).selected,'sung-than-cong');
 assert.equal(decide('Nó làm bằng gì?',memory).intent,'fact');
 for(const q of ['Chiếc xe ngoài hành tinh làm bằng gì?','Tượng thần Zeus có niên đại nào?'])assert.deepEqual(decide(q,memory).entities,[]);
});
test('ambiguous, absent and out-of-range references require clarification',()=>{
 const memory={recommended:['sung-than-cong','ma-nao'],activeIntent:'highlights'};
 for(const q of ['Nó làm bằng gì?','cái thứ ba','cái thứ nhất hoặc cái thứ hai'])assert.equal(decide(q,memory).needsClarification,true,q);
 assert.equal(decide('cái thứ hai làm bằng gì?',memory).selected,'ma-nao');
 assert.equal(decide('cái thứ hai làm bằng gì?',memory).intent,'fact');
});
test('impossible floor constraints are exposed without inventing a matching artifact',()=>{
 for(const [lang,q]of [['vi','Dẫn tôi lên tầng 8 xem súng thần công'],['en','Plan a route on floor 9'],['ko','7층에서 볼 유물'],['zh','第八层有什么文物？']]){const d=decide(q,{},lang);assert.ok(d.unsupportedFloor>3);assert.deepEqual(d.entities,[]);assert.equal(d.preferences.floor,undefined);assert.equal(d.intent,null)}
});
test('duration supports composite and bounded natural units and does not mutate memory',()=>{
 for(const [q,n]of [['1 giờ 30 phút',90],['một tiếng rưỡi',90],['one and a half hours',90],['한 시간 반',90],['一小时半',90],['45m',45]])assert.equal(e.duration(q),n,q);
 assert.equal(decide('Tôi có -15 phút').preferences.minutes,undefined);
 const memory={preferences:{excluded:['history'],minutes:15},activeIntent:'route'};const before=JSON.stringify(memory);decide('60 phút, thích lịch sử',memory);assert.equal(JSON.stringify(memory),before);
});
test('hard catalogue filters never broaden silently or invent a physical floor',()=>{
 const items=records.filter(r=>r.type==='artifact');
 for(const constraint of [{materials:['paper']},{materials:['wood']},{floor:2},{excluded:['history']}]){
  const found=e.rank(items,constraint);assert.ok(found.length>0);
  if(constraint.floor)assert.ok(found.every(r=>r.floor===2));
  if(constraint.excluded)assert.ok(found.every(r=>!r.tags.includes('history')));
  if(constraint.materials)assert.ok(found.every(r=>e.normalize(r.material).includes(constraint.materials[0]==='paper'?'giay':'go')));
 }
 assert.deepEqual(e.rank(items,{floor:8}),[]);
 assert.deepEqual(e.rank(items,{site:'missing-site'}),[]);
});

test('integration: site numbers are not ordinals, and material recommendations remain filters',()=>{
 for(const q of ['Hiện vật bằng gốm đáng xem ở cơ sở 2','Hiện vật chất liệu gốm đáng xem ở cơ sở 2']){const d=decide(q);assert.equal(d.intent,'highlights');assert.equal(d.needsClarification,false);assert.equal(d.selected,null);assert.deepEqual(d.preferences.materials,['ceramic']);assert.equal(d.preferences.site,'site2');assert.equal(d.factField,null)}
 const follow=decide('cái thứ hai',{recommended:['sung-than-cong','ma-nao'],activeIntent:'highlights'});assert.equal(follow.selected,'ma-nao');
 const specific=decide('Sắc phong làm bằng gì?');assert.equal(specific.intent,'fact');assert.equal(specific.factField,'material');
});
