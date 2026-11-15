/* Local conversational companion. Curated replies and session context, not model training.
 * Museum facts stay with the source-backed guide; playful stories are labelled fiction. */
((root) => {
  'use strict';
  const normalize = text => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const has = (text, pattern) => pattern.test(text);
  const copy = {
    vi: {
      hello: ['Mây đây ☁️ Bạn muốn khám phá gì, kể chuyện hôm nay hay thử một câu hỏi hơi “khó đỡ”?', 'Chào bạn! Mang một câu hỏi, một tâm sự hay một ý tưởng kỳ cục đến đây cũng được. Mây nghe nè.'],
      thanks: ['Mây nhận được lời cảm ơn rồi 😊 Bạn cứ hỏi tiếp, đổi chủ đề cũng được nhé.', 'Có ích cho bạn là tốt rồi. Còn chuyện gì đang làm bạn tò mò?'],
      identity: ['Mây là trợ lý ảo đồng hành cùng bạn: tra hồ sơ bảo tàng, cùng nghĩ chuyện đời thường và góp một chút dí dỏm. Kiến thức hiện vật có nguồn; chuyện tưởng tượng sẽ được nói rõ.'],
      sad: ['Nghe như hôm nay có điều làm bạn nặng lòng. Bạn không cần phải vui lên ngay đâu. Bạn muốn kể điều vừa xảy ra, hay muốn cùng Mây nghĩ một việc nhỏ để dễ chịu hơn?', 'Mây nghe bạn. Mình có thể đi chậm một chút: chuyện gì đang làm bạn buồn nhất lúc này?'],
      lonely: ['Cảm giác cô đơn có thể đến ngay cả khi quanh mình có nhiều người. Bạn muốn kể một chút, hay thử nhắn cho một người tin cậy: “Hôm nay mình hơi chùng xuống, cậu có rảnh nói chuyện không?”'],
      tired: ['Hôm nay có vẻ bạn đã dùng khá nhiều năng lượng rồi. Nếu được, nghỉ vài phút, uống chút nước và chọn một việc thật nhỏ để làm tiếp. Bạn đang mệt vì công việc, thiếu ngủ hay chuyện trong lòng?'],
      angry: ['Mây nghe là bạn đang rất bực. Mình tạm chưa gửi tin nhắn lúc nóng nhé: đặt điện thoại xuống một chút, rồi viết điều bạn muốn người kia hiểu bằng một câu. Bạn muốn Mây giúp sửa câu đó cho rõ và bình tĩnh hơn không?'],
      happy: ['Tin vui cần được ăn mừng một chút chứ 🎉 Bạn muốn kể khoảnh khắc vui nhất, hay để Mây nghĩ giúp một câu caption?', 'Mây xin góp một tiếng “yeah!” vào ngày đẹp của bạn 🎉 Chuyện vui gì vừa xảy ra vậy?'],
      relationship: ['Bị “seen” dễ làm mình nghĩ rất xa, nhưng trạng thái tin nhắn chưa nói hết suy nghĩ của người kia 😅 Bạn có thể cho họ chút thời gian, rồi nhắn một câu nhẹ nhàng thay vì gửi dồn. Bạn muốn một mẫu tin nhắn tự nhiên không?'],
      breakup: ['Chia tay có thể làm cả những việc thường ngày cũng khó hơn. Hôm nay mình chỉ cần lo một việc gần nhất: ăn chút gì, nghỉ được một lúc, hoặc gọi một người tin cậy. Bạn muốn kể, hay muốn cùng nghĩ cách vượt qua tối nay?'],
      study: ['Thử chia việc thành một vòng nhỏ: 5 phút chọn phần quan trọng nhất, 20 phút làm một nhiệm vụ, rồi nghỉ 5 phút. Đừng bắt mình hoàn hảo ngay vòng đầu. Bạn đang học môn gì hoặc mắc ở việc nào?'],
      studyNext: ['Bắt đầu bằng một bài hoặc một câu nhỏ bạn có thể hoàn thành ngay. Nếu chưa làm được, ghi rõ chỗ vướng rồi xem một ví dụ tương tự. Gửi đề hoặc mô tả việc đang kẹt để mình cùng chia nhỏ nhé.'],
      sleep: ['Tối nay thử giảm ánh sáng, để điện thoại xa tay và làm một việc nhẹ như đọc vài trang hoặc thở chậm. Nếu chưa buồn ngủ, đừng ép mình “phải ngủ ngay”. Tình trạng này mới hôm nay hay đã kéo dài nhiều đêm?'],
      motivation: ['Không cần chờ đầy pin mới bắt đầu đâu. Chọn phiên bản 2 phút của việc đó: mở tài liệu, viết một dòng, hoặc dọn một góc bàn. Hôm nay mình khởi động, chưa cần chạy marathon 😄 Bạn muốn bắt đầu việc gì?'],
      bored: ['Chán thì mình đổi nhịp một chút nhé: chơi một câu đố, bịa một thế giới ngược đời, hoặc chọn một việc 5 phút để “đổi gió”. Bạn chọn vui, lạ hay thư giãn?', 'Mây có ba nút đổi không khí: một câu đố, một mẩu chuyện hài, một giả thuyết kỳ cục. Bạn bấm nút nào?'],
      joke: ['Vì sao lập trình viên thích đi bảo tàng? Vì cuối cùng cũng gặp một thứ “cũ nhưng vẫn chạy tốt” mà không phải sửa bug 😄', 'Mây định đi tập thể dục, nhưng đồng hồ bảo: “Đứng dậy đi.” Mây đáp: “Từ từ, đang nâng cấp ý chí.” Kết quả: ý chí còn tải, ghế đã giữ chân 😄', 'Một chiếc đèn cổ hỏi bóng đèn thông minh: “Cháu biết nhiều thế, có biết lúc nào nên tắt không?” Bóng đèn đáp: “Dạ… để cháu hỏi Wi-Fi.” 😄', 'Kế hoạch tiết kiệm của Mây rất rõ ràng: không mua gì không cần thiết. Vấn đề là ly trà sữa nào cũng trình bày hoàn cảnh rất thuyết phục 😄'],
      riddle: ['Đố bạn: thứ gì càng lấy đi lại càng lớn? Mây chờ đáp án của bạn trước nhé 😉'],
      riddleAnswer: ['Đáp án là cái hố: càng lấy đất đi, hố càng lớn 😄 Bạn muốn thêm một câu hay đổi vai để đố Mây?'],
      cat: ['Vậy ngôn ngữ chính của bạn chắc là MeowScript 😼 Bug thì bắt, chuột thì giữ lại làm đồng nghiệp. Dự án đầu tiên: nút “cho ăn” tự bấm mỗi 5 phút?'],
      compliment: ['Mây xin nhận lời khen và cất vào ngăn “ngày đẹp trời” ☁️ Giờ đến lượt bạn: hôm nay có điều gì làm bạn mỉm cười chưa?'],
      repair: ['Có vẻ câu vừa rồi chưa trúng ý bạn. Mây thử lại nhé: bạn muốn câu trả lời ngắn hơn, nghiêm túc hơn, hay cụ thể bằng một ví dụ?'],
      weather: ['Mây chưa có dữ liệu thời tiết trực tiếp nên không đoán nắng mưa hôm nay. Bạn kiểm tra ứng dụng dự báo theo đúng địa điểm nhé. Nếu cần, mình có thể giúp lên phương án đi chơi cho cả trời mưa lẫn trời nắng.'],
      live: ['Thông tin này thay đổi theo thời gian, mà Mây chưa có nguồn trực tiếp để kiểm tra ngay. Mình không muốn đưa một con số đoán. Bạn có thể gửi nguồn đang xem để cùng phân tích, hoặc hỏi phần kiến thức nền nhé.'],
      sky: ['Ban ngày, các phân tử không khí tán xạ ánh sáng xanh mạnh hơn ánh sáng đỏ, nên từ mặt đất ta thường thấy bầu trời xanh. Lúc hoàng hôn, ánh sáng đi qua lớp khí quyển dài hơn nên sắc đỏ, cam nổi bật hơn.'],
      egg: ['Nếu nói trứng nói chung thì trứng có trước: nhiều loài đã đẻ trứng từ rất lâu trước khi gà xuất hiện. Còn câu “quả trứng gà đầu tiên” lại phụ thuộc bạn định nghĩa trứng theo con vật đẻ ra hay con vật nở từ đó. Một câu đố mà kéo cả tiến hóa vào bàn ăn 😄'],
      rain: ['Mưa hình thành khi hơi nước ngưng tụ thành những giọt nhỏ trong mây. Khi chúng kết hợp đủ lớn và không còn được luồng khí giữ lên, chúng rơi xuống. Tên Mây hợp nghề thật, nhưng Mây trong chat không dự báo thời tiết được nhé ☁️'],
      meaning: ['Mây không nghĩ phải có một đáp án chung cho ý nghĩa cuộc sống. Bạn có thể bắt đầu gần hơn: điều gì đáng để mình chăm chút hôm nay, ai mình muốn dành thời gian, hoặc điều gì mình muốn hiểu thêm? Với bạn lúc này, câu hỏi đó đến từ tò mò hay từ cảm giác chông chênh?'],
      listen: ['Mây đang nghe. Điều gì trong chuyện đó làm bạn khó chịu nhất? Nếu bạn muốn, mình chỉ nghe trước, chưa vội đưa lời khuyên.'],
      caption: ['Thử câu này nhé: “Một ngày bình thường, nhưng mình chọn giữ lại một điều vui.” Bạn muốn caption hài, nhẹ nhàng hay thật ngắn?'],
      serious: ['Được, Mây sẽ nói thẳng và nhẹ nhàng, bớt đùa. Bạn muốn cùng giải quyết chuyện gì trước?'],
      short: ['Được nhé, Mây sẽ trả lời gọn hơn. Bạn hỏi tiếp đi.'],
      fallback: ['Mây chưa hiểu rõ bạn muốn hỏi theo nghĩa thật hay muốn thử một ý tưởng vui. Bạn kể thêm một chi tiết nhé, mình sẽ bám vào điều đó để trả lời.'],
      crisis: ['Nghe như bạn đang rất đau lòng. Ngay lúc này bạn có ở nơi an toàn không? Nếu có nguy cơ làm đau bản thân, hãy đến chỗ có người, gọi một người bạn tin cậy hoặc cấp cứu địa phương để được hỗ trợ ngay. Mây có thể nghe bạn kể, nhưng bạn cần người thật ở cạnh lúc này.'],
    },
    en: {
      hello:['Hi, I’m Mây ☁️ Want to explore, talk about your day, or try a wonderfully odd question?'],
      thanks:['You’re welcome! We can keep going or change the subject.'],
      identity:['I’m Mây, a virtual companion for museum records, everyday conversation and a little wordplay. Museum facts use sources; imaginary stories are labeled.'],
      sad:['That sounds like a difficult day. You don’t have to cheer up on demand. Would you like to tell me what happened, or think of one small thing that might help?'],
      lonely:['Feeling lonely can happen even around other people. Would you like to talk, or draft a small message to someone you trust?'],
      tired:['It sounds like your energy is running low. Could you pause, have some water and choose just one small next step? Is it work, lost sleep, or something on your mind?'],
      angry:['It sounds frustrating. Before sending a message in anger, take a pause and write the one thing you want the other person to understand. I can help you word it calmly.'],
      happy:['That sounds worth celebrating 🎉 What was the best part?'],
      joke:['Why did the programmer visit a museum? To enjoy something old that still worked without being assigned its maintenance 😄','My plan was to save money. Unfortunately, every cup of bubble tea made a very convincing case for being essential 😄'],
      bored:['Want a small change of pace? Pick a riddle, a silly story, or an imaginary world with one very strange rule.'],
      study:['Try one small cycle: 5 minutes to choose a priority, 20 to work on one task, then a 5-minute break. What are you studying or working on?'],
      sleep:['Try dimming the lights and putting your phone out of reach before a quiet activity. Has the trouble sleeping just started, or has it lasted several nights?'],
      motivation:['Choose the two-minute version of the task. Open the document or write one line; starting doesn’t require a perfect day. What would you like to begin?'],
      repair:['That didn’t quite land. Would you prefer a shorter reply, a serious explanation, or a concrete example?'],
      weather:['I don’t have live weather here, so I won’t guess today’s forecast. Check a weather service for your location; I can help plan options for rain or sunshine.'],
      live:['That changes over time and I have no live source to verify it here. Share the source you are looking at, or ask about the background rather than a current number.'],
      serious:['Understood. I’ll keep it direct and leave out the jokes. What should we work through first?'],
      short:['Sure — I’ll keep it brief. What would you like to ask?'],
      listen:['I’m listening. What part has been hardest? I can listen first without jumping to advice.'],
      fallback:['Do you mean that literally, or are we exploring a playful idea? Give me one more detail so I can follow your meaning.'],
      crisis:['It sounds like you are in a lot of pain. Are you somewhere safe right now? If you might hurt yourself, move near other people and contact someone you trust or local emergency help now. I can listen, but you need a person with you.'],
    },
    ko: {
      hello:['안녕하세요, 마이예요 ☁️ 오늘 이야기, 유물 탐방, 조금 엉뚱한 질문 모두 좋아요.'],
      sad:['오늘 많이 힘드셨군요. 당장 기분을 바꾸려고 애쓰지 않아도 괜찮아요. 무슨 일이 있었는지 들려주실래요?'],
      tired:['에너지가 많이 떨어진 것 같아요. 잠시 쉬고 물을 마신 뒤 작은 일 하나만 골라볼까요? 일, 잠 부족, 마음의 고민 중 어느 쪽인가요?'],
      joke:['프로그래머가 박물관을 좋아하는 이유요? 오래됐는데 잘 작동하는 물건을 유지보수 없이 즐길 수 있어서요 😄'],
      thanks:['도움이 됐다니 좋아요. 계속 이야기하거나 다른 주제로 바꿔도 괜찮아요.'],
      happy:['함께 기뻐할 소식이네요 🎉 가장 좋았던 순간은 무엇인가요?'],
      repair:['답변이 기대와 달랐군요. 짧게, 진지하게, 아니면 구체적인 예시로 다시 설명할까요?'],
      weather:['실시간 날씨 자료가 없어서 오늘의 예보는 추측하지 않아요. 현재 위치의 예보를 확인해 주세요.'],
      listen:['듣고 있어요. 어떤 부분이 가장 힘들었나요? 원하시면 조언보다 이야기를 먼저 들을게요.'],
      fallback:['사실 그대로의 질문인가요, 재미있는 상상인가요? 상황을 조금 더 알려 주세요.'],
      crisis:['많이 힘드신 것 같아요. 지금 안전한 곳에 계신가요? 자신을 해칠 위험이 있다면 다른 사람이 있는 곳으로 가서 믿을 수 있는 사람이나 현지 긴급 구조에 바로 연락해 주세요.'],
    },
    zh: {
      hello:['你好，我是小云 ☁️ 可以聊聊今天、探索文物，也可以来个有趣又古怪的问题。'],
      sad:['听起来今天不太容易。你不必马上开心起来。愿意说说发生了什么，还是一起想一件能让你轻松一点的小事？'],
      tired:['听起来你的精力有些不足。先休息一会儿，喝点水，再选一件小事好吗？是工作、睡眠不足，还是心事让你累了？'],
      joke:['程序员为什么喜欢博物馆？终于能欣赏“虽然很旧却还能运行”的东西，而且不用负责维护了 😄'],
      thanks:['能帮到你就好。可以接着聊，也可以换个话题。'],
      happy:['值得庆祝一下 🎉 最开心的是哪一刻？'],
      repair:['刚才的回答没有说到点上。你希望我简短一点、认真一点，还是举个具体例子？'],
      weather:['我没有实时天气数据，不能猜今天的预报。请查看你所在位置的天气服务。'],
      listen:['我在听。哪一部分最让你难受？你愿意的话，我可以先听，不急着给建议。'],
      fallback:['你是在认真提问，还是想一起开个脑洞？再给我一点具体情境吧。'],
      crisis:['听起来你正承受很大的痛苦。你现在安全吗？如果有伤害自己的风险，请去有人的地方，马上联系信任的人或当地紧急援助。'],
    },
  };
  Object.assign(copy.vi, {
    money: ['Nếu đang muốn quản lý tiền gọn hơn, thử ghi ba nhóm: khoản bắt buộc, khoản có thể giảm và một khoản dự phòng dù nhỏ. Chưa cần ép mình theo một tỷ lệ cố định. Khoản nào đang làm bạn khó xoay nhất: tiền nhà, ăn uống hay mua sắm?'],
    work: ['Thử tách hai chuyện: việc cần xử lý hôm nay và điều bạn muốn thay đổi lâu dài. Hôm nay chọn một việc quan trọng, báo rõ thời hạn hoặc chỗ đang vướng. Bạn đang quá tải vì nhiều việc, hay khó chịu vì cách làm việc với ai đó?'],
    communication: ['Mình thử nói theo ba phần: chuyện đã xảy ra, cảm giác của bạn và điều bạn mong lần sau. Ví dụ: “Khi kế hoạch đổi mà mình chưa biết, mình khá bị động. Lần sau báo mình sớm hơn nhé.” Bạn muốn Mây cùng soạn câu nói cho tình huống của bạn không?'],
    decision: ['Thử so hai lựa chọn theo ba câu: mình muốn điều gì, mình chịu được đánh đổi nào, và có thể thử nhỏ trước không? Không nhất thiết phải quyết định cả cuộc đời trong một buổi tối. Hai lựa chọn của bạn là gì?'],
    routine: ['Mình lên một ngày vừa sức nhé: một việc quan trọng nhất, một việc chăm bản thân và một khoảng trống để thở. Xếp việc khó vào lúc bạn tỉnh táo nhất, rồi chừa thời gian dự phòng. Ngày mai bạn có những việc nào bắt buộc?'],
    income: ['Mây không tự kiếm tiền hay làm việc ngoài cuộc trò chuyện. Nhưng mình có thể giúp bạn nghĩ ý tưởng, sửa một đoạn giới thiệu, chia nhỏ việc học hoặc chuẩn bị câu hỏi phỏng vấn. Bạn đang tìm việc hay muốn học thêm một kỹ năng?'],
  });
  Object.assign(copy.en, {
    money:['Start with three buckets: essential costs, flexible spending and a small buffer. A fixed percentage won’t suit everyone. Which cost is hardest to manage right now?'],
    work:['Separate what needs attention today from what you want to change long term. Choose one priority and explain any deadline or obstacle clearly. Is the main problem workload or working with someone?'],
    communication:['Try three parts: what happened, how it affected you and what you would like next time. Describe the action rather than labeling the person. What situation would you like to put into words?'],
    decision:['Compare the options by what matters to you, what trade-offs you can accept and whether you can test a small version first. What are the two options?'],
    routine:['Pick one important task, one thing that looks after you and some breathing room. Put demanding work when you tend to be most alert. What commitments must fit into tomorrow?'],
    income:['I don’t earn money or do work outside this conversation. I can help brainstorm, revise an introduction, plan learning or prepare interview questions. What are you working toward?'],
    sky:['Air molecules scatter blue light more strongly than red, so the daytime sky usually looks blue. At sunset, light travels through more atmosphere and red and orange become more prominent.'],
    rain:['Water vapor condenses into tiny cloud droplets. As droplets combine and grow too heavy for air currents to hold up, they fall as rain. That explains rain generally, rather than predicting today’s weather.'],
    egg:['Eggs in general came first: egg-laying animals existed long before chickens. “The first chicken egg” depends on whether you name it after the animal that laid it or the animal that hatched from it.'],
  });
  function createResponder() {
    let last='', storyPart=0, brief=false, serious=false, vegetarian=false;
    const counters=new Map();
    function response(key,lang='vi',extra={}) {
      const table=copy[lang]||copy.vi;
      const options=table[key]||table.listen||table.fallback;
      const count=counters.get(key)||0;counters.set(key,count+1);
      let text=typeof extra.text==='string'?extra.text:options[count%options.length];
      if(brief&&text.length>280)text=text.split(/(?<=[.!?。！？])\s+/u).slice(0,2).join(' ');
      last=key;
      return {text,mood:({joke:'😄',happy:'🥳',sad:'💛',lonely:'💛',breakup:'💛',angry:'🌿',tired:'🌿',crisis:'💛',cat:'😼',riddle:'😉'})[key]||'☁️',kind:'conversation',conversationTopic:key,applicationOnly:true,hints:[],questions:[],...extra,text};
    }
    function food(lang,detail={}) {
      if(lang!=='vi')return response('food',lang,{text:lang==='en'?(vegetarian?'For something simple: rice with tofu and vegetables, or mushroom noodle soup. Do you want a quick meal or something to cook?':'A simple choice: rice with vegetables and your preferred protein, noodle soup, or a sandwich. Any dietary restrictions or budget?'):lang==='ko'?'간단한 밥과 두부·채소, 국수는 어떠세요? 식이 제한이나 예산이 있나요?':'可以考虑米饭配豆腐蔬菜或一碗面。有没有饮食限制或预算？'});
      if(detail.quick)return response('food',lang,{text:vegetarian?'Một món gọn là đậu hũ xào nấm: thái đậu hũ, làm sạch nấm rồi xào cùng chút hành và gia vị bạn dùng. Ăn với cơm sẵn và rau là thành một bữa. Mình vẫn giữ lựa chọn ăn chay; bạn có sẵn đậu hũ hay nấm không?':'Nếu có sẵn cơm, thử cơm trứng với rau: làm chín trứng, thêm phần rau có sẵn rồi ăn cùng cơm. Ít nguyên liệu, ít bát đĩa phải rửa. Bạn đang có những gì trong bếp?'});
      const budget=detail.budget;
      const dish=vegetarian?'cơm với đậu hũ, nấm và rau, hoặc một tô bún chay':'cơm trứng với rau, bánh mì trứng, hoặc bún với món đạm bạn thích';
      return response('food',lang,{text:(budget?'Nếu muốn tiết kiệm, mình ưu tiên món đơn giản; giá thực tế còn tùy chỗ bán. ':'')+'Mây gợi ý '+dish+'. '+(vegetarian?'Mình đang giữ lựa chọn ăn chay của bạn. ':'')+'Bạn muốn tự nấu hay mua nhanh bên ngoài?',questions:['Tôi ăn chay','Món nào nấu nhanh?']});
    }
    function respond(message,{language='vi',museum=false,openConversation=false,artifactName='',plan=null,deep=false}={}) {
      const lang=copy[language]?language:'vi', raw=String(message||'').trim().slice(0,700), q=normalize(raw);
      if(!q)return null;
      if(plan?.domain==='study'){last='study';return root.MuseumRequestPlan.studyAnswer(plan,{language:lang,deep});}
      if(plan?.clarification || plan?.domain==='conversation'&&plan.avoids?.length)return root.MuseumRequestPlan.clarification(plan,lang);
      const laughingIdiom=has(q,/\bcuoi (?:muon chet|chet mat|xiu|be bung)\b/);
      if(has(q,/\b(?:tu tu|tu sat|tu lam hai ban than|khong muon song)\b|kill myself|自杀|不想活|죽고 싶/) || !laughingIdiom&&has(q,/\bmuon chet\b|want to die/))return response('crisis',lang);
      if(laughingIdiom)return response('joke',lang);
      const imaginary=has(q,/\b(?:tuong tuong|bia chuyen|imagine)\b|상상/) || has(q,/\b(?:neu|gia su|what if)\b|如果/)&&has(q,/\b(?:biet noi|biet bay|lam giam doc|meo|co canh|tra sua|song day|bien thanh|cats?|could talk|came alive)\b|会说话|猫/) || has(q,/\b(?:cai ghe|cai ban|tra sua|hien vat)\b.*\b(?:biet noi|biet buon|co linh hon|co buon)\b/);
      const creativeRequest=has(q,/\b(?:lam tho|viet tho|write a poem|caption)\b/);
      const playful=has(q,/\b(?:hai huoc|ke chuyen hai|ke truyen hai|chuyen hai|hai hai|vui vui|hai di|noi gi do hai|noi gi do vui|buon cuoi|tau hai|ke chuyen cuoi|noi gi vui|cau dua|joke|make me laugh|funny)\b|笑话|농담/);
      if(museum&&!imaginary&&(!playful||has(q,/\b(?:lam bang|chat lieu|nien dai|nam nao|gia ve|gio mo|material|made of|when was)\b/))){last='';return null;}
      if(has(q,/\b(?:dung dua|nghiem tuc|stop joking|be serious)\b/)){serious=true;const previous=last,result=response('serious',lang);last=previous;return result;}
      if(has(q,/\b(?:ngan thoi|ngan gon|noi gon|keep it short)\b/)){brief=true;const previous=last,result=response('short',lang);last=previous;return result;}
      if(has(q,/\b(?:may ngu|ai ngu|vo dung|tra loi do|sai roi|khong dung|not helpful|you are stupid)\b|没用|멍청/))return response('repair',lang);
      if(has(q,/\b(?:chia tay|that tinh|broken up|breakup)\b/))return response('breakup',lang);
      if(has(q,/\b(?:co don|khong ai hieu|lonely|alone)\b|孤独|외로/))return response('lonely',lang);
      if(!creativeRequest&&!imaginary&&!has(q,/\bbuon (?:ngu|cuoi|chan)\b/)&&has(q,/\b(?:buon|stress|ap luc|lo lang|that vong|ton thuong|sad|anxious|overwhelmed)\b|难过|伤心|슬퍼|슬프/))return response('sad',lang);
      if(has(q,/\b(?:tuc qua|buc minh|quau|gian qua|angry|frustrated)\b|生气|화가 나/))return response('angry',lang);
      if(!creativeRequest&&!imaginary&&has(q,/\b(?:met|buon ngu|kiet suc|tired|exhausted)\b|好累|피곤/))return response('tired',lang);
      if(!creativeRequest&&has(q,/\b(?:vui qua|hanh phuc|thi do|dau dai hoc|tang luong|vui lam|happy|great day|passed my exam)\b|开心|기뻐/))return response('happy',lang);
      if(has(q,/\b(?:thoi tiet|du bao|hom nay mua|troi mua khong|weather|rain today)\b|天气|날씨/))return response('weather',lang);
      if(has(q,/\b(?:ti gia|ty gia|gia vang|gia bitcoin|ket qua xo so|tin nong|latest news|exchange rate)\b/))return response('live',lang);
      const arithmetic=raw.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase().trim();
      const calculation=arithmetic.match(/^(?:tinh |bao nhieu la )?(-?\d+(?:[.,]\d+)?) (cong|tru|nhan|chia|times|plus|minus|divided by) (-?\d+(?:[.,]\d+)?)$/);
      const symbolic=raw.match(/^\s*(-?\d+(?:[.,]\d+)?)\s*([+−\-×*÷/])\s*(-?\d+(?:[.,]\d+)?)\s*(?:=|=\s*\?|bằng bao nhiêu)?\s*$/u);
      if(calculation||symbolic){const m=calculation||symbolic,a=Number(m[1].replace(',','.')),b=Number(m[3].replace(',','.')),op=m[2];const div=['chia','divided by','÷','/'].includes(op);if(div&&b===0)return response('math',lang,{text:lang==='vi'?'Không chia được cho 0 trong phép tính số thực thông thường.':lang==='en'?'Division by zero is undefined in ordinary real arithmetic.':lang==='ko'?'일반적인 실수 계산에서 0으로 나눌 수 없습니다.':'普通实数运算中不能除以零。'});const result=div?a/b:['cong','plus','+'].includes(op)?a+b:['tru','minus','−','-'].includes(op)?a-b:a*b;if(!Number.isFinite(a)||!Number.isFinite(b)||!Number.isFinite(result))return response('math',lang,{text:lang==='vi'?'Các số này vượt giới hạn của phép tính nhanh ở đây. Bạn cần công cụ tính có độ chính xác cao hơn.':'These numbers exceed the limits of this quick calculator. Please use a higher-precision tool.'});return response('math',lang,{text:`${a} ${div?'÷':['cong','plus','+'].includes(op)?'+':['tru','minus','−','-'].includes(op)?'−':'×'} ${b} = ${Number(result.toPrecision(12))}.`});}
      if(has(q,/\b(?:khong an chay nua|no longer vegetarian)\b/)){vegetarian=false;return food(lang);}
      if(has(q,/\b(?:toi an chay|minh an chay|vegetarian|vegan)\b/)){vegetarian=true;last='food';return food(lang);}
      if(has(q,/\b(?:an gi|toi doi|bung doi|bua toi|bua trua|nau gi|hungry|what to eat)\b|吃什么|배고파/))return food(lang);
      if(last==='food'&&has(q,/\b(?:nhanh|tu nau|mua ngoai|tiet kiem|nghin|chay|[12345]0k)\b/))return food(lang,{quick:has(q,/\b(?:nhanh|tu nau)\b/),budget:has(q,/\b(?:tiet kiem|nghin|[12345]0k)\b/)});
      if(has(q,/\b(?:crush|nguoi yeu|bi seen|da seen|khong tra loi tin nhan)\b/))return response('relationship',lang,{questions:['Gợi ý một tin nhắn nhẹ nhàng']});
      if(last==='relationship'&&has(q,/\b(?:goi y|mau tin|nhan gi|tin nhan|duoc|ok)\b/))return response('relationshipNext',lang,{text:lang==='vi'?'Bạn thử: “Hôm nay cậu thế nào? Khi nào rảnh mình nói chuyện nhé.” Gọn, có sự quan tâm và để người kia tự chọn thời điểm trả lời.':'You could write: “How’s your day going? Let’s catch up when you have a moment.” It shows interest without pressure.'});
      if(has(q,/\b(?:kho ngu|mat ngu|khong ngu duoc|cant sleep|cannot sleep|insomnia)\b/))return response('sleep',lang);
      if(has(q,/\b(?:hoc bai|on thi|mai thi|deadline|tri hoan|tap trung|studying|study|procrastinat\w*)\b/))return response('study',lang);
      if(['study','studyNext'].includes(last)&&has(q,/\b(?:bat dau|lam sao|lam gi|phut|mon|bai|how|start)\b/)){const time=q.match(/\b(\d{1,3}) phut\b/);if(time&&Number(time[1])>=5&&Number(time[1])<=180&&lang==='vi'){const minutes=Number(time[1]),prepare=Math.min(5,Math.floor(minutes/5)),rest=Math.min(5,Math.floor(minutes/5));return response('studyNext',lang,{text:`Với ${minutes} phút, thử dành ${prepare} phút chọn một mục tiêu, ${minutes-prepare-rest} phút làm đúng việc đó, rồi ${rest} phút kiểm lại hoặc nghỉ. Chỉ chọn một phần nhỏ để hoàn thành nhé. Bạn đang học hoặc làm việc gì?`});}return response('studyNext',lang);}
      if(has(q,/\b(?:dong luc|luoi qua|khong muon lam gi|motivation|unmotivated)\b/))return response('motivation',lang);
      if(has(q,/\b(?:meo biet code|meo lap trinh|toi la con meo|coding cat)\b/))return response('cat',lang);
      if(has(q,/\b(?:ga hay trung|trung hay ga|chicken or egg)\b/))return response('egg',lang);
      if(has(q,/\b(?:sao troi xanh|tai sao bau troi|why is the sky blue)\b/))return response('sky',lang);
      if(has(q,/\b(?:tai sao co mua|mua hinh thanh|why does it rain)\b/))return response('rain',lang);
      if(has(q,/\b(?:y nghia cuoc song|song de lam gi|meaning of life)\b/))return response('meaning',lang);
      if(has(q,/\b(?:kiem tien|earn money)\b/) && has(q,/\b(?:may|ban|you)\b/))return response('income',lang);
      if(has(q,/\b(?:het tien|tiet kiem|chi tieu|quan ly tien|luong|budget|saving money)\b/))return response('money',lang);
      if(has(q,/\b(?:cai nhau|hieu lam|mau thuan|giao tiep|arguing|misunderstanding)\b/))return response('communication',lang);
      if(has(q,/\b(?:di lam|dong nghiep|sep|cong viec|workload|colleague|boss)\b/))return response('work',lang);
      if(has(q,/\b(?:khong biet chon|chon nghe|chon nganh|lua chon|nen chon|decision|choose between)\b/))return response('decision',lang);
      if(has(q,/\b(?:ke hoach ngay|ke hoach ngay mai|thoi quen|daily routine|plan my day)\b/))return response('routine',lang);
      if(has(q,/\b(?:lam tho|viet tho|write a poem)\b/)){
        const subject=raw.match(/(?:về|about)\s+(.{1,80})/iu)?.[1]?.replace(/[.!?]+$/u,'') || (lang==='vi'?'một ngày bình yên':'a quiet day');
        return response('poem',lang,{fiction:true,mood:'✨',text:lang==='vi'?`Một đoạn thơ tự do về ${subject}:\n\nGiữa ngày nhiều tiếng động,\n${subject.charAt(0).toUpperCase()+subject.slice(1)} giữ một khoảng yên.\nTa đi chậm hơn một chút,\nĐể nghe lòng mình gọi tên.`:`A short imaginary verse about ${subject}:\n\nBetween the noise of passing days,\nA quiet thought can find its place.\nWe slow our steps and let it stay,\nA little light along the way.`});
      }
      if(has(q,/\b(?:caption|cau dang anh)\b/))return response('caption',lang,has(q,/\b(?:hai|vui|funny)\b/)?{text:lang==='vi'?'Thử câu này: “Định ra ngoài hít thở khí trời, ai ngờ hít luôn mùi đồ ăn.” 😄 Bạn muốn caption cho ảnh đi chơi, ăn uống hay tự chụp?':'Try: “Went outside for some fresh air. Accidentally found snacks.” 😄 What kind of photo is it for?'}:{});
      if(imaginary){
        let text;
        if(lang==='vi'){
          if(has(q,/\bmeo\b/))text='Tưởng tượng vui nhé: nếu mèo làm giám đốc, cuộc họp đầu tiên sẽ là “vì sao bát ăn chưa đầy?”. KPI: ngủ đủ, vuốt ve đúng lúc, tuyệt đối không gọi sếp dậy 😼';
          else if(has(q,/\bca\b/)&&has(q,/\bbay\b/))text='Tưởng tượng vui nhé: nếu cá bay như chim, biển báo đầu tiên chắc là “Cẩn thận cá băng qua đường”. Còn ô đi mưa phải nâng cấp thêm chế độ né cá 😄 Bạn muốn thêm một luật kỳ cục cho thế giới này không?';
          else if(artifactName||has(q,/\b(?:hien vat|bao tang|trong dong)\b/))text='Tưởng tượng vui thôi nhé, không phải tư liệu lịch sử: '+(artifactName||'một chiếc trống cổ')+' có thể sẽ bảo: “Tôi đi qua bao nhiêu năm rồi, mà cứ thấy máy ảnh là lại phải đứng nghiêm!” 😄 Nếu được hỏi hiện vật một câu, bạn sẽ hỏi gì?';
          else {const subject=raw.replace(/^(?:nếu|giả sử|tưởng tượng)\s*/iu,'').replace(/\s*(?:thì sao|sẽ thế nào|sẽ ra sao)[?!.]*$/iu,'').slice(0,100);text='Thử tưởng tượng vui nhé: “'+subject+'”. Luật đầu tiên của thế giới này: chuyện bình thường nhất lại khiến mọi người bất ngờ nhất. Mây sẽ xin một ngày làm khách du lịch ở đó trước khi nhận việc 😄 Bạn muốn câu chuyện nghiêng về hài hay phiêu lưu?';}
        }else text=lang==='en'&&has(q,/\bcats?\b/)?'Just imagining: if cats ran a museum, opening hours would depend on naps. The first exhibit would be the cardboard box from the gift shop 😼':lang==='en'?'Just imagining, not a factual account: if museum objects could talk, one might say, “I’ve survived centuries — but I still have to pose for every camera!” 😄 What would you ask it?':lang==='ko'?'사실이 아닌 재미있는 상상이에요. 유물이 말한다면 “수백 년을 버텼는데 사진을 찍을 때마다 또 자세를 잡아야 하네요!”라고 할지도요 😄':'这只是想象，并非史料：如果文物会说话，也许会说：“我熬过了几百年，每次遇到相机还是得站好！”😄';
        return response('imagination',lang,{text,mood:'✨',fiction:true,questions:lang==='vi'?['Kể tiếp theo kiểu phiêu lưu','Đổi sang chuyện bảo tàng']:[]});
      }
      if(last==='imagination'&&has(q,/\b(?:ke tiep|phieu luu|tiep di|roi sao|thuong luong|ban do|dau chan|mo hop|continue)\b/)){storyPart++;return response('imagination',lang,{fiction:true,mood:'✨',text:lang==='vi'?(storyPart%2?'Chuyện tưởng tượng tiếp nhé: Mây vừa mở cửa thì thấy bảng “Lối vào” đang… xin nghỉ phép. Cả nhóm phải hỏi chiếc bản đồ, nhưng bản đồ lại đòi được dẫn đi chơi một lần. Bạn chọn thương lượng với bản đồ hay lần theo dấu chân trên sàn?':'Tiếp chuyện tưởng tượng: dấu chân dẫn tới một chiếc hộp ghi “Chỉ mở khi biết cười”. Mây kể một chuyện đùa. Chiếc hộp bật mở… bên trong là tờ giấy: “Cuối cùng cũng có người đọc hướng dẫn!” 😄'):'Continuing our imaginary story: the map asks for a day off, and the entrance sign points to an adventure of its own. Which clue would you follow?'});}
      if(has(q,/^(?:(?:xin )?chao(?: may|ban)?|hello(?: may)?|hi(?: may)?|alo|hey|안녕|你好)$/u))return response('hello',lang);
      if(has(q,/\b(?:cam on|thanks|thank you)\b|谢谢|감사/))return response('thanks',lang);
      if(has(q,/\b(?:do vui|cau do|do di|riddle)\b/))return response('riddle',lang);
      if(last==='riddle'&&has(q,/\b(?:ho|khong biet|khong nghi ra|dap an|bo tay|chiu|hole|answer)\b/))return response('riddleAnswer',lang);
      if(last==='riddle')return response('riddle',lang,{text:lang==='vi'?'Gợi ý nhé: nghĩ tới việc lấy đất ra khỏi mặt đất. Bạn thử một đáp án nữa, hoặc nói “cho đáp án” để Mây bật mí.':'Hint: think about taking soil away from the ground. Try again, or ask for the answer.'});
      if(playful||has(q,/\b(?:hai hon|chuyen cuoi|lam toi cuoi)\b/)||last==='joke'&&has(q,/\b(?:ke tiep|cau khac|ke nua|nua di|nua|khac di|tiep di|another|again)\b/))return response(serious?'bored':'joke',lang,{mood:serious?'☁️':'😄'});
      if(last==='joke'&&has(q,/\b(?:nhat qua|khong hai|khong vui|not funny)\b/))return response('joke',lang,{text:lang==='vi'?'Câu vừa rồi chưa hợp gu rồi 😅 Đổi sang chuyện đời thường nhé: Mây mở ví tìm động lực đi làm. Ví im lặng. Thế là hiểu thông điệp ngay.':'That one did not land 😅 Let’s switch styles: I looked in my wallet for motivation to work. The silence was very persuasive.'});
      if(has(q,/\b(?:chan qua|buon chan|boring|bored)\b/))return response('bored',lang,{questions:lang==='vi'?['Đố vui đi','Kể chuyện hài đi','Nếu mèo làm giám đốc?']:[]});
      if(has(q,/\b(?:may xinh|may de thuong|yeu may|ban dang yeu|cute|love you)\b/))return response('compliment',lang);
      if(has(q,/\b(?:ban la ai|may la ai|ban la gi|may co cam xuc|who are you)\b/))return response('identity',lang);
      if(['sad','lonely','tired','breakup','angry','listen'].includes(last))return response('listen',lang);
      if(has(q,/^(?:haha|hihi|hehe|kkk|lol)+$/))return response('joke',lang);
      if(has(q,/\b(?:doi sang chuyen bao tang|back to the museum)\b/)){last='';return null;}
      if (has(q,/\b(?:doi toi|doi minh|cuoc doi|chuyen la|la di|la la|ki cuc|ky cuc|linh hon|toi la cu khoai|toi la sieu nhan|toi la nguoi ngoai hanh tinh)\b/))return response('imagination',lang,{fiction:true,mood:'😄',text:lang==='vi'?'Câu này có mùi một vũ trụ hơi lệch quỹ đạo rồi 😄 Thử tưởng tượng vui nhé: ở đó, trà sữa được tính là nhiên liệu, còn thứ Hai phải nộp đơn trước khi xuất hiện. Bạn muốn thêm luật gì?':'A playful imaginary universe, then: bubble tea counts as fuel, and Monday must apply for permission before showing up. What rule would you add?'});
      return openConversation?response('fallback',lang):null;
    }
    return Object.freeze({respond,reset(){last='';storyPart=0;brief=false;serious=false;vegetarian=false;counters.clear();}});
  }
  root.MuseumConversation=Object.freeze({createResponder,normalize});
})(globalThis);
