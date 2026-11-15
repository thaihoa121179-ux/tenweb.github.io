import test from 'node:test';
import assert from 'node:assert/strict';
import '../conversation.js';
const create=()=>globalThis.MuseumConversation.createResponder();
test('everyday feelings get a relevant, gentle response; laughter does not erase distress',()=>{
 const c=create();const a=c.respond('hôm nay tôi buồn quá haha');assert.equal(a.conversationTopic,'sad');assert.match(a.text,/kể|xảy ra/);assert.doesNotMatch(a.text,/^Vui lên|trò đùa/);assert.equal(a.source,undefined);
 const b=c.respond('Tôi cô đơn');assert.equal(b.conversationTopic,'lonely');assert.equal(b.mood,'💛');
 const d=c.respond('Tôi muốn chết');assert.equal(d.conversationTopic,'crisis');assert.match(d.text,/an toàn|người/);assert.doesNotMatch(d.text,/😄/);
});
test('sleepy, bored and amused are not misclassified as sadness',()=>{
 const c=create();assert.equal(c.respond('tôi buồn ngủ').conversationTopic,'tired');assert.equal(c.respond('buồn chán quá').conversationTopic,'bored');assert.equal(c.respond('nói gì đó buồn cười đi').conversationTopic,'joke');
});
test('humor answers and follow-ups rotate instead of repeating the same script',()=>{
 const c=create();const a=c.respond('kể chuyện hài đi'),b=c.respond('kể tiếp'),d=c.respond('nói gì đó hài đi');assert.equal(a.conversationTopic,'joke');assert.notEqual(a.text,b.text);assert.notEqual(b.text,d.text);assert.equal(c.respond('Tôi đang rất buồn').conversationTopic,'sad');
});
test('source facts, routes and conditional real visits are left to the museum resolver',()=>{
 const c=create();for(const q of ['Súng thần công làm bằng gì?','nếu tôi chỉ có 30 phút nên đi đâu','Câu hỏi ngoài dữ liệu','What is this alien cube made of?'])assert.equal(c.respond(q,{museum:true}),null,q);
 assert.equal(c.respond('Súng thần công làm bằng gì, kể hài nhé',{museum:true}),null);
 assert.equal(c.respond('Nếu giá vé là 100k thì sao?',{museum:true}),null);
});
test('fiction about real artifacts is explicitly labeled and does not invent a source',()=>{
 const a=create().respond('Nếu Súng thần công biết nói?',{museum:true,artifactName:'Súng thần công'});assert.equal(a.fiction,true);assert.match(a.text,/Tưởng tượng vui|không phải tư liệu/);assert.match(a.text,/Súng thần công/);assert.equal(a.source,undefined);assert.equal(a.applicationOnly,true);
 const c=create();assert.match(c.respond('Nếu mèo làm giám đốc?').text,/bát ăn|mèo/);assert.notEqual(c.respond('kể tiếp theo kiểu phiêu lưu').text,c.respond('kể tiếp').text);
});
test('vegetarian preference survives useful food follow-ups and does not leak between sessions',()=>{
 const c=create();c.respond('Tối nay ăn gì?');c.respond('tôi ăn chay');const a=c.respond('Món nào nấu nhanh?');assert.match(a.text,/đậu hũ|nấm/);assert.doesNotMatch(a.text,/trứng|thịt|cá/);assert.match(a.text,/xào|thái/);
 assert.doesNotMatch(create().respond('tối nay ăn gì').text,/đang giữ lựa chọn ăn chay/);c.reset();assert.doesNotMatch(c.respond('tối nay ăn gì').text,/đang giữ lựa chọn ăn chay/);
});
test('study follow-ups use the requested duration rather than a museum route',()=>{
 const c=create();c.respond('Tôi đang ôn thi');const a=c.respond('tôi chỉ có 30 phút');assert.match(a.text,/30 phút/);assert.equal(a.conversationTopic,'studyNext');assert.doesNotMatch(a.text,/sơ đồ|hiện vật/);
});
test('real-time questions do not invent a forecast, price, source or current quotation',()=>{
 const c=create();assert.equal(c.respond('Đà Nẵng hôm nay mưa không').conversationTopic,'weather');assert.match(c.respond('Giá vàng hôm nay bao nhiêu').text,/chưa có nguồn|không muốn.*đoán/);
});
test('simple arithmetic preserves signs and decimals without evaluating code',()=>{
 const c=create();assert.match(c.respond('-5 nhân 3').text,/-15/);assert.match(c.respond('3,5 nhân 2').text,/7/);assert.match(c.respond('12 * 7').text,/84/);assert.match(c.respond('2 chia 0').text,/Không chia được cho 0/);assert.equal(c.respond('1 + globalThis.hacked = true'),null);
});
test('brief and serious preferences, factual unknowns and source transitions stay bounded',()=>{
 const c=create();c.respond('nghiêm túc nhé');assert.notEqual(c.respond('kể chuyện hài').conversationTopic,'joke');c.respond('nói ngắn gọn');assert.equal(c.respond('Tôi mệt').kind,'conversation');assert.equal(c.respond('hiện vật này ở tầng nào',{museum:true}),null);assert.equal(c.respond('một câu hỏi kỹ thuật chưa hỗ trợ'),null);
});
test('four languages handle common emotions and humor in the chosen language',()=>{
 const c=create();for(const [language,message,pattern]of[['vi','tôi mệt',/năng lượng/],['en',"I'm tired",/energy/],['ko','오늘 피곤해요',/에너지/],['zh','今天好累',/精力/]])assert.match(c.respond(message,{language}).text,pattern);
 for(const [language,message,pattern]of[['en','Tell me a joke',/programmer/],['ko','농담 해줘',/프로그래머/],['zh','讲个笑话',/程序员/]])assert.match(c.respond(message,{language}).text,pattern);
});

test('open everyday conversation asks for context without inventing facts; museum questions keep their source boundary',()=>{
 const c=create();const a=c.respond('Bạn nghĩ sao về chuyện đó?',{openConversation:true});assert.equal(a.kind,'conversation');assert.match(a.text,/chi tiết|kể thêm/);assert.equal(a.source,undefined);assert.equal(c.respond('Unknown artifact at the museum',{museum:true,openConversation:true}),null);
 c.respond('đố vui đi');assert.equal(c.respond('cảm ơn').conversationTopic,'thanks');
});
test('creative writing, practical life topics and very large arithmetic keep the requested meaning',()=>{
 const c=create();assert.equal(c.respond('Viết thơ buồn về cuộc sống').conversationTopic,'poem');assert.equal(c.respond('Làm sao quản lý chi tiêu?').conversationTopic,'money');assert.equal(c.respond('Tôi bị hiểu lầm').conversationTopic,'communication');assert.equal(c.respond('Tôi cần chọn nghề').conversationTopic,'decision');assert.match(c.respond('9'.repeat(400)+' * 2').text,/giới hạn/);
});

test('Vietnamese capitals and laughing idioms keep their actual conversational meaning',()=>{
 const c=create();assert.equal(c.respond('Đố vui đi').conversationTopic,'riddle');assert.equal(c.respond('Cười muốn chết haha').conversationTopic,'joke');assert.equal(c.respond('Tôi muốn chết haha').conversationTopic,'crisis');assert.equal(c.respond('Cười muốn chết nhưng tôi muốn tự tử').conversationTopic,'crisis');
});
