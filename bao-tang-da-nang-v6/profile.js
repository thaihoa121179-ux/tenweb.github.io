/* V6 personal notebook. Records stay in this browser; no account or tracking service. */
(() => {
  "use strict";
  const M = window.Museum;
  const V = window.MuseumVisuals;
  if (!M) return;
  const KEY = "museum_v6_personal";
  const $ = (id) => document.getElementById(id);
  const words = {
    vi: {
      title: "Cá nhân",
      eyebrow: "KHÔNG GIAN CỦA BẠN",
      subtitle: "Lưu những điều đáng nhớ, khám phá theo nhịp riêng.",
      progress: "Dấu chân khám phá",
      viewed: "nội dung đã mở",
      topics: "Chủ đề",
      artifacts: "Hiện vật",
      readNotice:
        "Tiến độ ghi nhận hồ sơ bạn đã mở trên thiết bị, không xác nhận bạn đã đến bảo tàng.",
      badges: "Bộ sưu tập huy hiệu",
      first: "Bước chân đầu tiên",
      curious: "Nhà khám phá",
      scholar: "Am hiểu di sản",
      firstRule: "Mở một chủ đề hoặc hiện vật",
      curiousRule: "Mở ba hồ sơ hiện vật",
      scholarRule: "Đạt ít nhất 4/5 câu quiz",
      earned: "Đã nhận",
      locked: "Chưa nhận",
      quiz: "Thử thách di sản",
      quizIntro:
        "5 câu hỏi từ dữ liệu bảo tàng có nguồn. Học thêm qua từng đáp án.",
      play: "Bắt đầu quiz",
      best: "Điểm cao nhất",
      journal: "Nhật ký tham quan",
      note: "Ghi chú của bạn",
      noteHint: "Điều gì khiến bạn ấn tượng hôm nay?",
      save: "Lưu ghi chú",
      saved: "Đã lưu ghi chú trên thiết bị",
      local:
        "Nhật ký và tiến độ chỉ được lưu trong trình duyệt này. Không cần tài khoản.",
      memory: "Trình duyệt đang chặn lưu trữ. Dữ liệu chỉ giữ trong phiên này.",
      export: "Tải nhật ký",
      share: "Chia sẻ nhật ký",
      copied: "Đã sao chép nhật ký",
      shareFallback: "Không thể chia sẻ trực tiếp. Hãy tải nhật ký để lưu.",
      recent: "Nội dung vừa khám phá",
      empty: "Chưa có nội dung nào. Hãy bắt đầu từ thư viện nhé.",
      explore: "Khám phá thư viện",
      accessibility: "Trợ năng",
      contrast: "Tương phản cao",
      large: "Chữ lớn",
      erase: "Xóa nhật ký & tiến độ",
      confirm:
        "Xóa ghi chú, nội dung đã mở và điểm quiz V6 trên thiết bị này? Thao tác này không thể hoàn tác.",
      erased: "Đã xóa nhật ký và tiến độ V6",
      back: "Quay lại",
      question: "Câu",
      of: "/",
      correct: "Chính xác!",
      incorrect: "Chưa đúng. Hãy xem đáp án bên dưới.",
      answer: "Đáp án",
      next: "Câu tiếp theo",
      result: "Xem kết quả",
      finished: "Bạn đã hoàn thành!",
      score: "Điểm của bạn",
      retry: "Chơi lại",
      source: "Đọc nguồn bảo tàng",
      profile: "Về trang cá nhân",
      quizNote:
        "Câu hỏi dựa trên dữ liệu dự án kế thừa từ nguồn bảo tàng; không xác nhận vị trí thực tế của hiện vật.",
      opened: "Đã mở",
      generated: "Nhật ký tham quan Bảo tàng Đà Nẵng",
      noNotes: "Chưa có ghi chú.",
      none: "Chưa có nội dung.",
      unlocked: "Đã mở khóa huy hiệu Am hiểu di sản!",
      q1: "Sắc phong trong thư viện được ghi niên đại nào?",
      q2: "Phù điêu Cơ Tu trong thư viện được làm từ chất liệu gì?",
      q3: "Ghe bầu là mô hình của phương tiện nào?",
      q4: "Chủ đề “Văn hóa các dân tộc” thuộc tầng nào trong danh mục?",
      q5: "Trang sức mã não được gắn với nền văn hóa nào trong hồ sơ?",
      paper: "Giấy",
      wood: "Gỗ",
      iron: "Sắt",
      stone: "Đá",
      boat: "Thuyền giao thương",
      cart: "Xe ngựa",
      bicycle: "Xe đạp",
      car: "Ô tô",
      floor1: "Tầng 1",
      floor2: "Tầng 2",
      floor3: "Tầng 3",
      unknown: "Chưa xác định",
      sahuynh: "Sa Huỳnh",
      dongson: "Đông Sơn",
      "oc-eo": "Óc Eo",
      cham: "Chăm Pa",
    },
    en: {
      title: "My space",
      eyebrow: "YOUR SPACE",
      subtitle: "Keep the moments that matter. Explore at your own pace.",
      progress: "Your discoveries",
      viewed: "records opened",
      topics: "Topics",
      artifacts: "Artifacts",
      readNotice:
        "Progress counts records opened on this device, not physical museum visits.",
      badges: "Your badges",
      first: "First steps",
      curious: "Curious explorer",
      scholar: "Heritage learner",
      firstRule: "Open a topic or artifact",
      curiousRule: "Open three artifact records",
      scholarRule: "Score at least 4/5 in the quiz",
      earned: "Earned",
      locked: "Locked",
      quiz: "Heritage challenge",
      quizIntro:
        "5 questions from sourced museum records. Learn with every answer.",
      play: "Start quiz",
      best: "Personal best",
      journal: "Visit journal",
      note: "Your notes",
      noteHint: "What caught your attention today?",
      save: "Save notes",
      saved: "Notes saved on this device",
      local:
        "Your journal and progress stay in this browser. No account needed.",
      memory: "Storage is blocked. Your data is kept only for this session.",
      export: "Download journal",
      share: "Share journal",
      copied: "Journal copied",
      shareFallback:
        "Direct sharing is unavailable. Download your journal to keep it.",
      recent: "Recently discovered",
      empty: "No records yet. Start with the collections.",
      explore: "Explore collections",
      accessibility: "Accessibility",
      contrast: "High contrast",
      large: "Larger text",
      erase: "Clear journal & progress",
      confirm:
        "Delete V6 notes, opened records and quiz scores on this device? This cannot be undone.",
      erased: "V6 journal and progress cleared",
      back: "Back",
      question: "Question",
      of: "/",
      correct: "Correct!",
      incorrect: "Not quite. Check the answer below.",
      answer: "Answer",
      next: "Next question",
      result: "See results",
      finished: "Challenge complete!",
      score: "Your score",
      retry: "Try again",
      source: "Read the museum source",
      profile: "Back to my space",
      quizNote:
        "Questions use inherited, sourced museum records; they do not confirm physical artifact locations.",
      opened: "Opened",
      generated: "Da Nang Museum visit journal",
      noNotes: "No notes yet.",
      none: "No records yet.",
      unlocked: "Heritage learner badge unlocked!",
      q1: "What date is recorded for the royal edict in the collection?",
      q2: "What material is listed for the Co Tu carved reliefs?",
      q3: "What kind of vehicle does the traditional boat model represent?",
      q4: "Which floor lists the Ethnic cultures topic?",
      q5: "Which culture is associated with the agate jewelry record?",
      paper: "Paper",
      wood: "Wood",
      iron: "Iron",
      stone: "Stone",
      boat: "Trading boat",
      cart: "Horse cart",
      bicycle: "Bicycle",
      car: "Car",
      floor1: "Floor 1",
      floor2: "Floor 2",
      floor3: "Floor 3",
      unknown: "Not specified",
      sahuynh: "Sa Huynh",
      dongson: "Dong Son",
      "oc-eo": "Oc Eo",
      cham: "Champa",
    },
    ko: {
      title: "내 공간",
      eyebrow: "나의 공간",
      subtitle: "인상 깊은 순간을 기록하고 나만의 속도로 둘러보세요.",
      progress: "탐방 기록",
      viewed: "열어 본 자료",
      topics: "주제",
      artifacts: "유물",
      readNotice:
        "이 기기에서 열어 본 자료를 기록하며 실제 박물관 방문을 확인하지 않습니다.",
      badges: "나의 배지",
      first: "첫걸음",
      curious: "호기심 탐험가",
      scholar: "문화유산 학습자",
      firstRule: "주제나 유물 자료 하나 열기",
      curiousRule: "유물 자료 3개 열기",
      scholarRule: "퀴즈 5문제 중 4문제 이상 맞히기",
      earned: "획득",
      locked: "미획득",
      quiz: "문화유산 퀴즈",
      quizIntro:
        "출처가 있는 박물관 자료로 만든 5문제입니다. 답을 확인하며 배워 보세요.",
      play: "퀴즈 시작",
      best: "최고 점수",
      journal: "관람 일지",
      note: "나의 메모",
      noteHint: "오늘 무엇이 인상 깊었나요?",
      save: "메모 저장",
      saved: "이 기기에 메모를 저장했습니다",
      local:
        "일지와 진행 상황은 이 브라우저에만 저장됩니다. 계정이 필요 없습니다.",
      memory: "저장소 접근이 차단되었습니다. 자료는 현재 세션에만 유지됩니다.",
      export: "일지 다운로드",
      share: "일지 공유",
      copied: "일지를 복사했습니다",
      shareFallback: "직접 공유할 수 없습니다. 일지를 다운로드하세요.",
      recent: "최근 살펴본 자료",
      empty: "아직 기록이 없습니다. 컬렉션을 둘러보세요.",
      explore: "컬렉션 둘러보기",
      accessibility: "접근성",
      contrast: "고대비",
      large: "큰 글씨",
      erase: "일지 및 진행 상황 삭제",
      confirm:
        "이 기기의 V6 메모, 탐방 기록과 퀴즈 점수를 삭제할까요? 되돌릴 수 없습니다.",
      erased: "V6 일지 및 진행 상황을 삭제했습니다",
      back: "뒤로",
      question: "문제",
      of: "/",
      correct: "정답입니다!",
      incorrect: "아쉽습니다. 아래 정답을 확인해 보세요.",
      answer: "정답",
      next: "다음 문제",
      result: "결과 보기",
      finished: "퀴즈 완료!",
      score: "나의 점수",
      retry: "다시 풀기",
      source: "박물관 출처 읽기",
      profile: "내 공간으로",
      quizNote:
        "기존 박물관 자료를 바탕으로 한 문제이며 유물의 실제 위치를 확인하지 않습니다.",
      opened: "열람",
      generated: "다낭 박물관 관람 일지",
      noNotes: "메모가 없습니다.",
      none: "기록이 없습니다.",
      unlocked: "문화유산 학습자 배지를 획득했습니다!",
      q1: "컬렉션에 있는 왕실 칙령의 기록 연도는 언제인가요?",
      q2: "꺼뚜 부조의 재료는 무엇인가요?",
      q3: "전통 배 모형은 어떤 교통수단인가요?",
      q4: "소수민족 문화 주제는 어느 층으로 분류되어 있나요?",
      q5: "마노 장신구는 어떤 문화와 관련 있나요?",
      paper: "종이",
      wood: "나무",
      iron: "철",
      stone: "돌",
      boat: "교역선",
      cart: "마차",
      bicycle: "자전거",
      car: "자동차",
      floor1: "1층",
      floor2: "2층",
      floor3: "3층",
      unknown: "확인되지 않음",
      sahuynh: "사후인",
      dongson: "동선",
      "oc-eo": "옥에오",
      cham: "참파",
    },
    zh: {
      title: "个人",
      eyebrow: "我的空间",
      subtitle: "记录难忘时刻，按照自己的节奏探索。",
      progress: "探索足迹",
      viewed: "已打开的资料",
      topics: "主题",
      artifacts: "文物",
      readNotice: "进度记录本设备上已打开的资料，不代表实际到馆参观。",
      badges: "我的徽章",
      first: "探索第一步",
      curious: "好奇探索者",
      scholar: "遗产学习者",
      firstRule: "打开一项主题或文物资料",
      curiousRule: "打开三项文物资料",
      scholarRule: "测验至少答对4/5题",
      earned: "已获得",
      locked: "未获得",
      quiz: "文化遗产挑战",
      quizIntro: "5道有博物馆资料来源的问题，每题都能学到新知识。",
      play: "开始测验",
      best: "最高分",
      journal: "参观日记",
      note: "您的笔记",
      noteHint: "今天什么让您印象深刻？",
      save: "保存笔记",
      saved: "笔记已保存在本设备",
      local: "日记和进度仅保存在此浏览器，无需账号。",
      memory: "浏览器禁止存储，资料仅在本次会话中保留。",
      export: "下载日记",
      share: "分享日记",
      copied: "日记已复制",
      shareFallback: "无法直接分享，请下载日记保存。",
      recent: "最近探索",
      empty: "暂无记录，从文物库开始探索吧。",
      explore: "探索文物库",
      accessibility: "无障碍",
      contrast: "高对比度",
      large: "大字体",
      erase: "清除日记与进度",
      confirm: "清除此设备上的V6笔记、已打开的资料和测验分数？此操作无法撤销。",
      erased: "V6日记与进度已清除",
      back: "返回",
      question: "问题",
      of: "/",
      correct: "答对了！",
      incorrect: "还不正确，请查看下方答案。",
      answer: "答案",
      next: "下一题",
      result: "查看结果",
      finished: "挑战完成！",
      score: "您的分数",
      retry: "再试一次",
      source: "阅读博物馆来源",
      profile: "返回个人页",
      quizNote: "题目依据项目已有的博物馆来源资料，不确认文物的实际位置。",
      opened: "已打开",
      generated: "岘港博物馆参观日记",
      noNotes: "暂无笔记。",
      none: "暂无记录。",
      unlocked: "已解锁遗产学习者徽章！",
      q1: "文物库中的敕封文书记载于哪一年？",
      q2: "格都木雕浮雕使用什么材料？",
      q3: "传统船模型展示哪一种交通工具？",
      q4: "“民族文化”主题列于哪一层？",
      q5: "玛瑙首饰资料与哪种文化有关？",
      paper: "纸",
      wood: "木",
      iron: "铁",
      stone: "石",
      boat: "贸易船",
      cart: "马车",
      bicycle: "自行车",
      car: "汽车",
      floor1: "一层",
      floor2: "二层",
      floor3: "三层",
      unknown: "未确定",
      sahuynh: "沙黄",
      dongson: "东山",
      "oc-eo": "扶南（Óc Eo）",
      cham: "占婆",
    },
  };
  const tr = (key) => ["quiz","journal"].includes(key)?MuseumLexicon.t(key):(words[M.state.lang] || words.vi)[key] || key;
  const blank = () => ({
    version: 1,
    visits: [],
    note: "",
    best: 0,
    attempts: 0,
    contrast: false,
    large: false,
  });
  let data = blank();
  let storageAvailable = true;
  try {
    let stored = null;
    const raw = localStorage.getItem(KEY);
    try {
      stored = JSON.parse(raw || "null");
    } catch {
      /* A malformed record is ignored; storage may still work. */
    }
    if (stored && stored.version === 1) {
      const ids = new Set([
        ...M.A.map((x) => "artifact:" + x.id),
        ...M.D.map((x) => "article:" + x.id),
      ]);
      data.visits = Array.isArray(stored.visits)
        ? stored.visits
            .filter(
              (x) =>
                x &&
                ids.has(x.key) &&
                Number.isFinite(x.time) &&
                x.time > 0 &&
                x.time <= Date.now() + 60000,
            )
            .slice(0, 100)
        : [];
      data.visits = data.visits.filter(
        (x, i, a) => a.findIndex((y) => y.key === x.key) === i,
      );
      data.note =
        typeof stored.note === "string" ? stored.note.slice(0, 3000) : "";
      data.best = Number.isInteger(stored.best)
        ? Math.max(0, Math.min(5, stored.best))
        : 0;
      data.attempts = Number.isInteger(stored.attempts)
        ? Math.max(0, Math.min(10000, stored.attempts))
        : 0;
      data.contrast = stored.contrast === true;
      data.large = stored.large === true;
    }
  } catch {
    storageAvailable = false;
  }
  let quiz = { index: 0, answers: [], complete: false };
  let saveStatus = "";
  let questions = MuseumLearning.quiz(M.A,M.state.lang);
  const textOption = (value) => (/^\d+$/.test(value) ? value : tr(value));
  function write() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      storageAvailable = true;
      return true;
    } catch {
      storageAvailable = false;
      return false;
    }
  }
  function applyAccessibility() {
    document.documentElement.classList.toggle(
      "v6-high-contrast",
      data.contrast,
    );
    document.documentElement.classList.toggle("v6-large-text", data.large);
  }
  function visitRecord(v) {
    const [type, id] = v.key.split(":");
    const record =
      type === "artifact"
        ? M.A.find((x) => x.id === id)
        : M.D.find((x) => x.id === id);
    if (!record) return null;
    return {
      type,
      id,
      record,
      name:
        type === "artifact"
          ? window.MuseumDataV6?.artifacts[id]?.names?.[
              { vi: 0, en: 1, ko: 2, zh: 3 }[M.state.lang]
            ] ||
            record.names?.[{ vi: 0, en: 1, ko: 2, zh: 3 }[M.state.lang]] ||
            (M.state.lang === "vi" ? record.name : record.en)
          : M.nm(record),
    };
  }
  function date(time) {
    return new Intl.DateTimeFormat(
      { vi: "vi-VN", en: "en-GB", ko: "ko-KR", zh: "zh-CN" }[M.state.lang],
      { dateStyle: "medium", timeZone: "Asia/Ho_Chi_Minh" },
    ).format(time);
  }
  const section = document.createElement("section");
  section.className = "page";
  section.id = "page-profile";
  const quizSection = document.createElement("section");
  quizSection.className = "page";
  quizSection.id = "page-quiz";
  document.querySelector(".stage").append(section, quizSection);
  function renderProfile() {
    const artifacts = data.visits.filter((x) =>
      x.key.startsWith("artifact:"),
    ).length;
    const topics = data.visits.filter((x) =>
      x.key.startsWith("article:"),
    ).length;
    const total = M.A.length + M.D.length;
    const pct = Math.round((data.visits.length * 100) / Math.max(1, total));
    const badges = [
      ["✦", "first", "firstRule", data.visits.length > 0],
      ["◇", "curious", "curiousRule", artifacts >= 3],
      ["♜", "scholar", "scholarRule", data.best >= 4],
    ];
    section.innerHTML = `<div class="backline"><button class="back" data-back aria-label="${M.esc(tr("back"))}">‹</button><div class="heading"><div class="eyebrow">${M.esc(tr("eyebrow"))}</div><h1>${M.esc(tr("title"))}</h1></div></div><div class="scroll personal-scroll"><p class="personal-intro">${M.esc(tr("subtitle"))}</p><div class="personal-grid"><section class="card personal-progress"><h2>${M.esc(tr("progress"))}</h2><div class="personal-count"><strong>${data.visits.length}<span> / ${total}</span></strong><span>${M.esc(tr("viewed"))}</span></div><progress max="${total}" value="${data.visits.length}" aria-label="${M.esc(tr("progress"))}">${pct}%</progress><div class="personal-statrow"><span><b>${topics}</b> ${M.esc(tr("topics"))}</span><span><b>${artifacts}</b> ${M.esc(tr("artifacts"))}</span></div><p class="muted">${M.esc(tr("readNotice"))}</p></section><section class="card personal-badges"><h2>${M.esc(tr("badges"))}</h2><div class="badge-list">${badges.map(([icon, name, rule, earned]) => `<div class="personal-badge${earned ? " earned" : ""}"><span aria-hidden="true">${icon}</span><div><b>${M.esc(tr(name))}</b><p>${M.esc(tr(rule))}</p><small>${M.esc(tr(earned ? "earned" : "locked"))}</small></div></div>`).join("")}</div></section><section class="card personal-challenge"><span class="personal-kicker">05 / QUIZ</span><h2>${M.esc(tr("quiz"))}</h2>${V.quizStrip(questions.map(q=>M.A.find(a=>a.id===q.id)),"challenge-photos")}<p>${M.esc(tr("quizIntro"))}</p><div class="personal-challenge-bottom"><span>${M.esc(tr("best"))}: <b>${data.best}/5</b></span><button class="primary" data-personal="start-quiz">${M.esc(tr("play"))} ↗</button></div></section><section class="card personal-notebook"><h2>${M.esc(tr("journal"))}</h2><label for="personal-note">${M.esc(tr("note"))}</label><textarea id="personal-note" maxlength="3000" rows="5" placeholder="${M.esc(tr("noteHint"))}">${M.esc(data.note)}</textarea><div class="personal-note-info"><span id="personal-char-count">${data.note.length}/3000</span><span id="personal-save-state" role="status">${M.esc(saveStatus)}</span></div><button class="primary" data-personal="save">${M.esc(tr("save"))}</button><p class="muted personal-storage-notice">${M.esc(tr(storageAvailable ? "local" : "memory"))}</p><div class="buttonrow"><button class="secondary" data-personal="download">↓ ${M.esc(tr("export"))}</button><button class="secondary" data-personal="share">↗ ${M.esc(tr("share"))}</button></div></section><section class="card personal-recent"><h2>${M.esc(tr("recent"))}</h2>${
      data.visits.length
        ? `<ol class="personal-timeline">${data.visits
            .slice(0, 12)
            .map((v) => {
              const r = visitRecord(v);
              return r
                ? `<li><button ${r.type === "artifact" ? "data-artifact" : "data-topic"}="${M.esc(r.id)}">${V.media(V.resolve(r.type,r.id),{decorative:true})}<span class="timeline-copy"><span>${M.esc(r.name)}</span><small>${M.esc(date(v.time))} ›</small></span></button></li>`
                : "";
            })
            .join("")}</ol>`
        : `<p>${M.esc(tr("empty"))}</p><button class="secondary" data-go="catalog">${M.esc(tr("explore"))} ↗</button>`
    }</section><section class="card personal-settings"><h2>${M.esc(tr("accessibility"))}</h2><label><span>${M.esc(tr("contrast"))}</span><input type="checkbox" id="personal-contrast" ${data.contrast ? "checked" : ""}></label><label><span>${M.esc(tr("large"))}</span><input type="checkbox" id="personal-large" ${data.large ? "checked" : ""}></label><button class="personal-clear secondary" data-personal="clear">${M.esc(tr("erase"))}</button></section></div></div>`;
  }
  function sourceQuestion(q) {
    return q.id
      ? M.A.find((x) => x.id === q.id)?.url
      : M.D.find((x) => x.id === q.topic)?.source;
  }
  function renderQuiz() {
    if (!questions.length) return;
    if (quiz.complete) {
      const score = quiz.answers.filter((x,i)=>x===questions[i].answer).length;
      quizSection.innerHTML = `<div class="backline"><button class="back" data-go="profile" aria-label="${M.esc(tr("back"))}">‹</button><div class="heading"><div class="eyebrow">${M.esc(tr("quiz"))}</div><h1>${M.esc(tr("finished"))}</h1></div></div><div class="scroll"><section class="card quiz-complete"><span class="quiz-medal" aria-hidden="true">${score>=4?"✦":"◇"}</span><p>${M.esc(tr("score"))}</p><strong>${score}<span>/5</span></strong>${score>=4?`<p>${M.esc(tr("unlocked"))}</p>`:""}<p>${M.esc(tr("best"))}: ${data.best}/5</p><div class="buttonrow"><button class="primary" data-personal="start-quiz">${M.esc(tr("retry"))}</button><button class="secondary" data-go="profile">${M.esc(tr("profile"))}</button></div></section><section class="visual-quiz-review"><h2>${M.esc(V.t("review"))}</h2>${questions.map(q=>V.card(V.object(M.A.find(a=>a.id===q.id)))).join("")}</section></div>`;
      return;
    }
    const q=questions[quiz.index],artifact=M.A.find(a=>a.id===q.id);
    const prompt=MuseumLexicon.t(q.type==="era"?"quizEra":"quizMaterial").replace("{name}",M.aname(artifact));
    const selected=quiz.answers[quiz.index],answered=Number.isInteger(selected);
    const choices=q.options.map((value,i)=>`<button data-quiz-choice="${i}" ${answered?"disabled":""} class="quiz-option${answered&&i===q.answer?" correct":""}${answered&&i===selected&&i!==q.answer?" incorrect":""}" aria-pressed="${selected===i}"><span>${String.fromCharCode(65+i)}</span><b>${M.esc(textOption(value))}</b>${answered&&i===q.answer?'<span aria-hidden="true">✓</span>':""}</button>`).join("");
    const feedback=answered?`<p class="quiz-feedback"><b>${M.esc(tr(selected===q.answer?"correct":"incorrect"))}</b><br>${M.esc(tr("answer"))}: ${M.esc(textOption(q.options[q.answer]))}</p><p>${M.esc(MuseumLexicon.t("explanation"))}: ${M.esc(q.explanation)}</p><button class="secondary" data-artifact="${M.esc(q.id)}">${M.esc(M.aname(artifact))} ›</button><a class="source" href="${M.esc(sourceQuestion(q))}" target="_blank" rel="noopener noreferrer">${M.esc(tr("source"))} ↗</a><button class="primary full" data-personal="next">${M.esc(tr(quiz.index===questions.length-1?"result":"next"))} →</button>`:"";
    // Ảnh là đúng hiện vật của câu hỏi; không hiện niên đại/đáp án trong chú thích trước khi trả lời.
    quizSection.innerHTML=`<div class="backline"><button class="back" data-go="profile" aria-label="${M.esc(tr("back"))}">‹</button><div class="heading"><div class="eyebrow">${M.esc(tr("quiz"))}</div><h1>${M.esc(tr("question"))} ${quiz.index+1} / 5</h1></div></div><div class="scroll"><div class="quiz-dots" aria-hidden="true">${questions.map((_,i)=>`<span class="${i<=quiz.index?"active":""}"></span>`).join("")}</div><section class="card quiz-question"><div class="quiz-visual-layout">${V.figure(V.object(artifact),{className:"quiz-object-photo",eager:true})}<div class="quiz-answer-panel"><h2 id="quiz-prompt">${M.esc(prompt)}</h2><div class="quiz-options" role="group" aria-labelledby="quiz-prompt">${choices}</div><div id="quiz-feedback" role="status">${feedback}</div></div></div></section><p class="note">${M.esc(tr("quizNote"))}</p></div>`;
  }
  function recordVisit(page) {
    const id =
      page === "artifact"
        ? M.state.artifact
        : page === "article"
          ? M.state.topic
          : null;
    if (!id) return;
    const key = page + ":" + id;
    data.visits = [
      { key, time: Date.now() },
      ...data.visits.filter((x) => x.key !== key),
    ].slice(0, 100);
    write();
  }
  function captureNote() {
    const input = $("personal-note");
    if (input) data.note = input.value.slice(0, 3000);
  }
  function journalText() {
    captureNote();
    write();
    const lines = [
      tr("generated"),
      date(Date.now()),
      "",
      tr("note"),
      data.note || tr("noNotes"),
      "",
      tr("recent"),
    ];
    for (const v of data.visits) {
      const r = visitRecord(v);
      if (!r) continue;
      const u = new URL(location.href);
      u.search = "";
      u.hash = "";
      u.searchParams.set(r.type === "artifact" ? "artifact" : "topic", r.id);
      lines.push(`${date(v.time)} · ${r.name}`, u.href);
    }
    if (!data.visits.length) lines.push(tr("none"));
    lines.push("", `${tr("best")}: ${data.best}/5`, tr("readNotice"));
    return lines.join("\n");
  }
  async function shareJournal() {
    const text = journalText();
    try {
      if (navigator.share) {
        await navigator.share({ title: tr("generated"), text });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        M.toast(tr("copied"));
        return;
      }
      M.toast(tr("shareFallback"));
    } catch (e) {
      if (e.name !== "AbortError") M.toast(tr("shareFallback"));
    }
  }
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-personal],[data-quiz-choice]");
    if (!button) return;
    if (button.hasAttribute("data-quiz-choice")) {
      const choice = Number(button.dataset.quizChoice);
      if (
        !Number.isInteger(choice) ||
        choice < 0 ||
        choice > 3 ||
        Number.isInteger(quiz.answers[quiz.index]) ||
        quiz.complete
      )
        return;
      quiz.answers[quiz.index] = choice;
      renderQuiz();
      $("quiz-feedback")?.scrollIntoView({
        block: "nearest",
        behavior: "auto",
      });
      return;
    }
    switch (button.dataset.personal) {
      case "save":
        captureNote();
        saveStatus = tr(write() ? "saved" : "memory");
        $("personal-save-state").textContent = saveStatus;
        M.toast(saveStatus);
        break;
      case "download": {
        const text = journalText();
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "da-nang-museum-journal.txt";
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        break;
      }
      case "share":
        void shareJournal();
        break;
      case "start-quiz":
        questions=MuseumLearning.quiz(M.A,M.state.lang);
        quiz = { index: 0, answers: [], complete: false };
        renderQuiz();
        M.nav("quiz");
        break;
      case "next":
        if (!Number.isInteger(quiz.answers[quiz.index])) return;
        if (quiz.index < questions.length - 1) {
          quiz.index++;
          renderQuiz();
        } else {
          quiz.complete = true;
          const score = quiz.answers.filter(
            (x, i) => x === questions[i].answer,
          ).length;
          data.best = Math.max(data.best, score);
          data.attempts = Math.min(10000, data.attempts + 1);
          write();
          renderQuiz();
        }
        break;
      case "clear":
        if (window.confirm(tr("confirm"))) {
          const prefs = { contrast: data.contrast, large: data.large };
          data = { ...blank(), ...prefs };
          document.dispatchEvent(new CustomEvent("museum:profileclear"));
          write();
          quiz = { index: 0, answers: [], complete: false };
          saveStatus = "";
          renderProfile();
          M.toast(tr("erased"));
        }
        break;
    }
  });
  document.addEventListener("input", (event) => {
    if (event.target.id === "personal-note") {
      $("personal-char-count").textContent =
        event.target.value.length + "/3000";
      $("personal-save-state").textContent = "";
    }
  });
  document.addEventListener("change", (event) => {
    if (event.target.id === "personal-contrast")
      data.contrast = event.target.checked;
    else if (event.target.id === "personal-large")
      data.large = event.target.checked;
    else return;
    applyAccessibility();
    if (!write()) M.toast(tr("memory"));
  });
  document.addEventListener("museum:navigate", (event) => {
    const page = event.detail?.page || M.state.page;
    recordVisit(page);
    if (page === "profile") renderProfile();
    else if (page === "quiz") renderQuiz();
  });
  document.addEventListener("museum:language", () => {
    captureNote();
    questions=MuseumLearning.quiz(M.A,M.state.lang);
    saveStatus = "";
    renderProfile();
    renderQuiz();
  });
  applyAccessibility();
  renderProfile();
  renderQuiz();
  recordVisit(M.state.page);
  window.MuseumProfile = {
    render: renderProfile,
    renderQuiz,
    getData: () => structuredClone(data),
  };
})();
