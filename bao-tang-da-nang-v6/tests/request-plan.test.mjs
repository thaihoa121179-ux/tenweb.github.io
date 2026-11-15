import test from 'node:test';
import assert from 'node:assert/strict';
import '../request-plan.js';
const {analyze,studyAnswer}=globalThis.MuseumRequestPlan;
test('the screenshot request prioritizes study and excludes the museum despite shorthand and missing punctuation',()=>{
 for(const q of ['muốn học bài k muốn đi bảo tàng','muốn học bài ko muốn đi bảo tàng','Mình muốn học bài, không muốn đi bảo tàng','hoc bai khg muon di bao tang']){const p=analyze(q);assert.equal(p.domain,'study',q);assert.equal(p.museumExcluded,true);const a=studyAnswer(p,{language:'vi',deep:true});assert.match(a.text,/tập trung học bài/);assert.doesNotMatch(a.text,/sơ đồ|lộ trình|tầng [123]/);}
});
test('opposite polarity, inclusive not-only and contradictory goals are not collapsed into one keyword',()=>{
 assert.equal(analyze('Không muốn học bài, muốn đi bảo tàng').domain,'museum');
 const avoid=analyze('không muốn học bài');assert.equal(avoid.domain,'conversation');assert.ok(!globalThis.MuseumRequestPlan.clarification(avoid).questions.some(q=>q.includes('học bài')));
 assert.equal(analyze('Không muốn bỏ học bài, nhưng chẳng muốn đi bảo tàng').domain,'study');
 assert.equal(analyze('Không chỉ học bài mà còn đi bảo tàng').clarification,true);
 assert.equal(analyze('Tôi muốn học bài và muốn đi bảo tàng').clarification,true);
});
test('studying in a museum and visiting to learn history retain different purposes',()=>{
 const a=analyze('Muốn học bài trong bảo tàng');assert.equal(a.domain,'study');assert.equal(a.studyAtMuseum,true);assert.match(studyAnswer(a,{deep:true}).text,/chưa có xác nhận/);
 assert.equal(analyze('Đến bảo tàng để học lịch sử').domain,'museum');
});
test('subject and time-only follow-ups retain the real goal without mutating previous analysis',()=>{
 const before=analyze('Muốn học bài k muốn đi bảo tàng, chỉ có 30 phút');const snapshot=JSON.stringify(before);
 const next=analyze('Tôi học Toán',{previous:before});assert.equal(next.subject,'math');assert.equal(next.minutes,30);assert.equal(next.museumExcluded,true);
 for(const[text,subject]of[['Toán','math'],['Văn!','literature'],['Anh','english'],['Lý','physics'],['Hóa','chemistry'],['Sử','history']]){const short=analyze(text,{previous:before});assert.equal(short.domain,'study');assert.equal(short.subject,subject);assert.equal(short.minutes,30);assert.equal(short.museumExcluded,true);}
 assert.equal(analyze('Toán').domain,null);assert.equal(analyze('toàn bộ',{previous:before}).subject,null);
 const last=analyze('chỉ có 15 phút',{previous:next});assert.equal(last.subject,'math');assert.equal(last.minutes,15);assert.equal(JSON.stringify(before),snapshot);
 assert.equal(analyze('Hôm nay tôi hơi buồn',{previous:last}).domain,null);
});
test('deep plans contain concrete subject-specific steps and an exact time budget',()=>{
 for(const minutes of [5,15,20,30,45,120]){const p=analyze(`Muốn học Toán, chỉ có ${minutes} phút`);const a=studyAnswer(p,{deep:true});assert.equal(a.planSummary.prepare+a.planSummary.focus+a.planSummary.review,minutes);assert.match(a.text,/dạng bài|ví dụ/);assert.match(a.text,/Bước tiếp theo/);assert.equal(a.source,undefined);assert.equal(a.applicationOnly,true);}
});
test('deep and concise answers differ in substance and do not fabricate an unknown subject',()=>{
 const p=analyze('muốn học bài k muốn đi bảo tàng');const simple=studyAnswer(p,{deep:false}),deep=studyAnswer(p,{deep:true});assert.ok(deep.text.length>simple.text.length);assert.match(deep.text,/Mục tiêu/);assert.match(deep.text,/Bạn đang học môn gì/);assert.equal(p.subject,null);
});
test('a specific factual artifact question retains source-based handling',()=>{
 assert.equal(analyze('Muốn học bài về Súng thần công, niên đại năm nào?',{namedArtifact:true}).domain,'museum');
});
test('English negation and four-language study plans preserve the requested activity',()=>{
 const p=analyze('I want to study, not visit the museum');assert.equal(p.domain,'study');assert.equal(p.museumExcluded,true);
 for(const[language,pattern]of[['vi',/học/],['en',/study/],['ko',/공부/],['zh',/学习/]])assert.match(studyAnswer(p,{language,deep:true}).text,pattern);
});

test('linear homework is actually solved and checked, with no partial parsing of unsupported mathematics',()=>{
 for(const[text,value]of[['2x + 3 = 7',2],['giải 2x - 3 = -7 nhé',-2],['0.5x+3.2=4.7',3],['3x+2=x-4',-3]]){const p=analyze(text);assert.equal(p.domain,'study');assert.equal(p.exercise.result,value);const a=studyAnswer(p,{deep:true});assert.equal(a.mathVerified,true);assert.match(a.text,/Kiểm tra kết quả/);}
 assert.equal(analyze('2x+1=2x+3').exercise.solution,'none');assert.equal(analyze('x=x').exercise.solution,'all');
 for(const text of ['x^2+x=0','y+x=2','x/2=3','x=2; y=3','x+alert(1)=3'])assert.equal(globalThis.MuseumRequestPlan.linearEquation(text),null,text);
 const before=analyze('2x+3=7');assert.match(studyAnswer(analyze('giải thích bước chuyển vế',{previous:before}),{deep:true}).text,/cộng hoặc trừ cùng một lượng/);
});
