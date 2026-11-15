/* Public request interpretation and practical planning. This is local analysis,
 * not hidden model reasoning or evidence for museum facts. */
((root) => {
  'use strict';
  function normalize(value) {
    return String(value || '').slice(0, 700).toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').normalize('NFC')
      .replace(/\b(?:k|ko|khg|hok|hong|hem)\b/g, 'khong')
      .replace(/\b(?:mik|mk)\b/g, 'minh').replace(/\b(?:dc|dk)\b/g, 'duoc')
      .replace(/[^\p{L}\p{N}.,;!?\s]/gu, ' ').replace(/\s+/g, ' ').trim();
  }
  const patterns = {
    study: /\b(?:hoc bai|on bai|on thi|lam bai tap|lam bai|bai tap|giai bai|lam toan|hoc toan|hoc van|hoc tieng anh|hoc lich su|hoc khong vao|kho tap trung|mai thi|study|studying|homework|revision|revise)\b|공부|숙제|复习|学习|作业/gu,
    museum: /\b(?:di bao tang|den bao tang|tham quan bao tang|vao bao tang|bao tang|tham quan|visit the museum|go to the museum|museum visit|museum)\b|박물관|博物馆/gu,
  };
  function linearEquation(message) {
    const raw=String(message||'').toLowerCase().replace(/−/g,'-').replace(/×/g,'*');
    const match=raw.match(/[+\-\d.,x*\s]+=[+\-\d.,x*\s]+/u);
    if(!match||!match[0].includes('x'))return null;
    const outside=raw.slice(0,match.index)+' '+raw.slice(match.index+match[0].length);
    if(/[=+*/^\d-]/u.test(outside)||/(?<!\p{L})[xyz](?!\p{L})/u.test(outside))return null;
    const equation=match[0].replace(/\s+/g,'').replace(/[.,]+$/u,'').replace(/,/g,'.').replace(/(\d)\*x/g,'$1x');
    const sides=equation.split('=');if(sides.length!==2)return null;
    function side(value){
      const pieces=value.match(/[+-]?(?:(?:\d+(?:\.\d+)?|\.\d+)?x|(?:\d+(?:\.\d+)?|\.\d+))/g);
      if(!pieces||pieces.join('')!==value)return null;
      let a=0,b=0;
      for(const p of pieces){if(p.endsWith('x')){const c=p.slice(0,-1);a+=c===''||c==='+'?1:c==='-'?-1:Number(c);}else b+=Number(p);}
      return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a)<=1e9&&Math.abs(b)<=1e9?{a,b}:null;
    }
    const left=side(sides[0]),right=side(sides[1]);if(!left||!right)return null;
    const a=left.a-right.a,b=right.b-left.b;
    return {equation,left,right,a,b,result:a===0?null:b/a,solution:a===0?(b===0?'all':'none'):'one'};
  }
  function negativeAt(text, index, domain, end) {
    let prefix = text.slice(0, index);
    prefix = prefix.split(/[,;.!?]|\b(?:nhung|nhung ma|ma|con|thay vi|but|instead|rather than)\b/u).pop();
    if (/\b(?:khong chi|not only)\b/.test(prefix)) return false;
    if (/\bkhong phai (?:la )?khong (?:muon|thich)\s*$/.test(prefix)) return false;
    if (/\b(?:khong muon bo|khong bo|dung bo|do not skip)\s*$/.test(prefix)) return false;
    if (domain === 'study' && /^\s*(?:duoc|vao|noi)\b/.test(text.slice(end))) return false;
    return /\b(?:khong|chua|chang|dung|bo qua|ngai|don t|dont|not|skip|avoid)\b(?:\s+\w+){0,4}\s*$/.test(prefix)
      || /안\s*$|不想\s*$|不去\s*$/.test(prefix);
  }
  function analyze(message, { previous = null, namedArtifact = false } = {}) {
    const text = normalize(message), mentions = [];
    let exercise=linearEquation(message);
    for (const [domain, pattern] of Object.entries(patterns)) {
      for (const match of text.matchAll(new RegExp(pattern.source, pattern.flags))) {
        mentions.push({ domain, negative: negativeAt(text, match.index, domain, match.index + match[0].length), at: match.index });
      }
    }
    const wants = [...new Set(mentions.filter(m => !m.negative).map(m => m.domain))];
    const avoids = [...new Set(mentions.filter(m => m.negative).map(m => m.domain))];
    const timeValues = [...text.matchAll(/\b(\d{1,3})\s*(?:phut|minutes?|mins?)\b|(\d{1,3})\s*(?:분|分钟)/gu)]
      .filter(m => !negativeAt(text, m.index, 'duration', m.index + m[0].length))
      .map(m => Number(m[1] || m[2])).filter(n => n >= 5 && n <= 180);
    // A short subject answer is meaningful after asking what the user studies.
    // Keep it contextual so "toàn bộ" or an unrelated history request cannot become homework.
    const shortSubject = previous?.domain === 'study' ? ({toan:'math',van:'literature',anh:'english',ly:'physics',hoa:'chemistry',su:'history',math:'math',literature:'literature',english:'english',physics:'physics',chemistry:'chemistry',history:'history'})[text.replace(/^(?:mon )?/u,'').replace(/[.!?]+$/u,'').trim()] : null;
    const subject = shortSubject || (/\b(?:mon toan|hoc toan|lam toan|dai so|hinh hoc|math)\b/.test(text) ? 'math'
      : /\b(?:mon van|ngu van|hoc van|lam van|literature)\b/.test(text) ? 'literature'
      : /\b(?:tieng anh|english)\b/.test(text) ? 'english'
      : /\b(?:vat ly|mon ly|physics)\b/.test(text) ? 'physics'
      : /\b(?:hoa hoc|mon hoa|chemistry)\b/.test(text) ? 'chemistry'
      : /\b(?:hoc lich su|mon su|history homework)\b/.test(text) ? 'history' : null);
    const explainEquation=!!previous?.exercise&&/\b(?:giai thich|chuyen ve|kiem tra|vi sao|explain|check)\b/.test(text)&&(!subject||subject==='math');
    if(!exercise&&explainEquation)exercise=previous.exercise;
    const realFact = namedArtifact && /\b(?:chat lieu|lam bang|nien dai|nam nao|kich thuoc|nguon goc|made of|when was|material)\b/.test(text);
    let domain = null, clarification = false;
    if (realFact) domain = 'museum';
    else if(exercise)domain='study';
    else if (wants.includes('study') && !wants.includes('museum')) domain = 'study';
    else if (wants.includes('museum') && !wants.includes('study')) domain = 'museum';
    else if (wants.includes('study') && wants.includes('museum')) {
      if (/\b(?:trong|tai|o) (?:khu )?bao tang\b/.test(text)) domain = 'study';
      else if (/\b(?:de hoc lich su|learn history at|learn history in)\b/.test(text)) domain = 'museum';
      else clarification = true;
    } else if (previous?.domain === 'study' && (subject || timeValues.length || /\b(?:bat dau|hoc the nao|lam sao nho|chia nho|de bai|ngay mai|mai thi|ke tiep|chi tiet|giai thich them)\b/.test(text))) domain = 'study';
    else if (avoids.length) domain = 'conversation';
    return {
      domain, wants, avoids, clarification,
      subject: domain === 'study' ? exercise?'math':subject || previous?.subject || null : subject,
      minutes: timeValues.at(-1) || (domain === 'study' ? previous?.minutes : null) || null,
      museumExcluded: avoids.includes('museum') || domain === 'study' && previous?.museumExcluded === true,
      studyAtMuseum: domain === 'study' && /\b(?:trong|tai|o) (?:khu )?bao tang\b/.test(text),
      deadline: /\b(?:mai thi|ngay mai|tomorrow)\b/.test(text) ? 'tomorrow' : null,
      tired: /\b(?:met|buon ngu|kiet suc|tired)\b/.test(text),
      explicit: mentions.length > 0,
      exercise, explainEquation,
    };
  }
  const subjectNames = {
    vi: { math:'Toán', literature:'Ngữ văn', english:'tiếng Anh', physics:'Vật lý', chemistry:'Hóa học', history:'Lịch sử' },
    en: { math:'math', literature:'literature', english:'English', physics:'physics', chemistry:'chemistry', history:'history' },
  };
  function studyAnswer(plan, { language = 'vi', deep = false } = {}) {
    if(plan.exercise){
      const e=plan.exercise,fmt=n=>Number(n.toPrecision(12));
      let text;
      if(e.solution==='all')text=language==='vi'?`${e.equation}\nHai vế rút gọn giống nhau. Phương trình đúng với mọi số thực x.`:`${e.equation}\nBoth sides simplify identically. Every real x is a solution.`;
      else if(e.solution==='none')text=language==='vi'?`${e.equation}\nRút gọn được 0 = ${fmt(e.b)}, điều này không đúng. Phương trình vô nghiệm.`:`${e.equation}\nSimplifying gives 0 = ${fmt(e.b)}, a contradiction. There is no solution.`;
      else {
        const value=fmt(e.result),exact=Number.isInteger(e.result)?`x = ${value}`:`x = ${fmt(e.b)}/${fmt(e.a)} ≈ ${value}`;
        const checkedLeft=fmt(e.left.a*e.result+e.left.b),checkedRight=fmt(e.right.a*e.result+e.right.b);
        text=language==='vi'?(deep?`Phương trình: ${e.equation}\n\nCách giải\n${plan.explainEquation?'Chuyển vế là cộng hoặc trừ cùng một lượng ở cả hai vế để giữ đẳng thức.\n':''}1. Gom hạng chứa x về một vế và số hạng tự do về vế kia: ${fmt(e.a)}x = ${fmt(e.b)}.\n2. Chia hai vế cho ${fmt(e.a)}: ${exact}.\n\nKiểm tra kết quả\nThay x vào đề, vế trái ≈ ${checkedLeft}, vế phải ≈ ${checkedRight}.\n\nBạn muốn Mây giải thích kỹ bước chuyển vế hay thử một bài tương tự?`:`${e.equation}\n${exact}.\nKiểm tra: hai vế cùng bằng xấp xỉ ${checkedLeft}.`):`${e.equation}\n${deep?`Collect x terms on one side and constants on the other: ${fmt(e.a)}x = ${fmt(e.b)}.\nDivide both sides by ${fmt(e.a)}.\n`:''}${exact}.\nCheck: left ≈ ${checkedLeft}, right ≈ ${checkedRight}.`;
      }
      return {text,mood:'📖',kind:'conversation',conversationTopic:'study',applicationOnly:true,hints:[],questions:[],requestPlan:plan,detailed:deep,mathVerified:true};
    }
    const minutes = plan.minutes || (plan.tired ? 15 : 25);
    const prepare = Math.max(1, Math.min(5, Math.floor(minutes / 5)));
    const review = Math.max(1, Math.min(5, Math.floor(minutes / 5)));
    const focus = minutes - prepare - review;
    const subject = subjectNames[language]?.[plan.subject] || '';
    let text;
    if (language === 'vi') {
      const opening = plan.museumExcluded ? 'Được chứ — mình tập trung học bài, không lên lịch đi bảo tàng nhé.' : 'Được, mình cùng chia việc học thành những bước vừa sức nhé.';
      const task = ({
        math:'Chọn một dạng bài, đọc một ví dụ rồi tự làm lại khi không nhìn lời giải. Ghi đúng bước đang mắc.',
        literature:'Đọc kỹ yêu cầu, viết luận điểm chính và chọn dẫn chứng trước khi viết đoạn hoàn chỉnh.',
        english:'Chọn một nhóm từ hoặc một điểm ngữ pháp, tự đặt câu rồi kiểm lại lỗi mình hay gặp.',
        physics:'Ghi đại lượng đã biết, đổi đơn vị rồi chọn công thức phù hợp; kiểm tra đơn vị của kết quả.',
        chemistry:'Ghi chất và điều kiện phản ứng, cân bằng phương trình rồi mới thay số theo yêu cầu bài.',
        history:'Lập một dòng thời gian ngắn, rồi tự kể lại nguyên nhân, diễn biến và kết quả bằng lời của mình.',
      })[plan.subject] || 'Chọn một bài hoặc một phần nhỏ, tự thử làm trước rồi ghi lại đúng chỗ chưa hiểu.';
      const schedule = `${prepare} phút chọn mục tiêu · ${focus} phút học tập trung · ${review} phút tự kiểm lại.`;
      const question = subject ? `Bạn gửi đề hoặc phần ${subject} đang mắc nhé; Mây sẽ bám vào đó để giúp tiếp.` : 'Bạn đang học môn gì, và vướng ở phần nào?';
      if (deep) {
        text = `${opening}\n\nMục tiêu\n${subject ? `Học ${subject}` : 'Hoàn thành một phần bài cụ thể'}${plan.deadline ? ' để chuẩn bị cho ngày mai' : ''}. ${plan.minutes ? `Bạn có ${minutes} phút.` : `Nếu chưa chốt thời gian, thử một phiên ${minutes} phút trước.`}\n\nKế hoạch ${minutes} phút\n1. ${prepare} phút: xác định bài cần xong, chuẩn bị tài liệu và cất thứ dễ gây xao nhãng.\n2. ${focus} phút: ${task}\n3. ${review} phút: đóng tài liệu, tự nhắc lại ý chính hoặc làm một câu ngắn; đánh dấu chỗ cần hỏi.\n\n${plan.tired ? 'Bạn đang mệt, nên mình chọn ít việc trước; nghỉ ngắn nếu khó tập trung.\n\n' : ''}${plan.studyAtMuseum ? 'Mình chưa có xác nhận về chỗ ngồi học tại bảo tàng; nếu định học ở đó, hãy hỏi nhân viên trước.\n\n' : ''}Bước tiếp theo\n${question}`;
      } else text = `${opening}\n\nThử một phiên ${minutes} phút: ${schedule}\n${task}\n\n${question}`;
    } else if (language === 'ko') {
      text = `${plan.museumExcluded ? '박물관 방문 대신 공부에 집중해요.' : '공부를 작은 단계로 나눠 볼까요?'}\n\n${minutes}분 계획: ${prepare}분 목표 선택 → ${focus}분 한 가지 과제 → ${review}분 자료를 덮고 확인.\n\n어떤 과목이나 문제에서 막혔나요? 문제를 알려 주세요.${deep ? '\n모르는 부분을 정확히 표시하고, 해결한 부분과 나눠서 확인하세요.' : ''}`;
    } else if (language === 'zh') {
      text = `${plan.museumExcluded ? '好的，我们先学习，不安排博物馆参观。' : '我们把学习拆成几个小步骤。'}\n\n${minutes}分钟安排：${prepare}分钟选定目标，${focus}分钟完成一项任务，${review}分钟合上资料自测。\n\n你在学哪一科，卡在哪道题？可以发具体题目。${deep ? '\n把已知条件和不明白的步骤分开记录，再针对困难逐项处理。' : ''}`;
    } else {
      text = `${plan.museumExcluded ? 'Absolutely — let’s study and leave the museum visit out.' : 'Let’s break the study task into manageable steps.'}\n\n${deep ? 'Goal\n'+(subject?'Work on '+subject:'Finish one specific piece of work')+'.\n\n' : ''}A ${minutes}-minute plan\n1. ${prepare} minutes: choose one task and prepare what you need.\n2. ${focus} minutes: try the task, note the exact sticking point and compare one relevant example.\n3. ${review} minutes: put the notes away and check what you can recall or solve.\n\nWhich subject or question are you working on? Send the exercise so I can help with the actual problem.`;
    }
    return { text, mood:'📖', kind:'conversation', conversationTopic:'study', applicationOnly:true,
      hints:[], questions:language === 'vi' ? ['Tôi chỉ có 15 phút', 'Tôi đang học Toán'] : [],
      requestPlan:plan, detailed:deep, planSummary:{ domain:'study', minutes, prepare, focus, review } };
  }
  function clarification(plan, language='vi') {
    return { text:language==='vi' ? (plan.clarification ? 'Mình thấy bạn muốn cả học bài lẫn đi bảo tàng. Bạn muốn ưu tiên việc nào trước? Chọn một việc, mình sẽ lập kế hoạch theo đúng thời gian bạn có.' : plan.avoids.includes('study')&&!plan.avoids.includes('museum') ? 'Được, mình chưa lập kế hoạch học lúc này. Bạn muốn nghỉ một chút, trò chuyện hay làm việc khác?' : 'Được, mình không gợi ý đi bảo tàng lúc này. Bạn muốn dành thời gian để học bài, nghỉ một chút hay làm việc khác?') : language==='en' ? 'Which would you like to prioritize: studying, resting, or a museum visit? I’ll use your choice rather than assume.' : language==='ko' ? '공부, 휴식, 박물관 관람 중 무엇을 먼저 하고 싶으세요?' : '你想先学习、休息，还是参观博物馆？我会按你的选择安排。',
      mood:'☁️',kind:'conversation',conversationTopic:'clarification',applicationOnly:true,hints:[],
      questions:language==='vi' ? plan.avoids.includes('study')?['Tôi muốn nghỉ một chút','Kể chuyện hài đi']:['Ưu tiên học bài', 'Tôi muốn nghỉ một chút'] : [] };
  }
  root.MuseumRequestPlan=Object.freeze({normalize,analyze,studyAnswer,clarification,linearEquation});
})(globalThis);
