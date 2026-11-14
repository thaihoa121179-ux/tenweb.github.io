/* Presentation, localised dashboard and motion/accessibility controls. */
(() => {
  "use strict";
  const M = window.Museum;
  const $ = (id) => document.getElementById(id);
  const strings = {
    vi: {
      skip: "Bỏ qua đến nội dung",
      welcome: "CHÀO BẠN, NGƯỜI KHÁM PHÁ",
      homeTitle: "Một ngày chạm vào di sản.",
      companion: "BẠN ĐỒNG HÀNH DI SẢN",
      talk: "Trò chuyện với Mây",
      makeRoute: "Lập hành trình",
      robotHello: "Rất vui được gặp bạn!",
      yourVisit: "CHUẨN BỊ CHUYẾN ĐI",
      visitHeading: "Hẹn bạn ở bảo tàng.",
      visitIntro: "Một chút chuẩn bị cho những khám phá mới.",
      addressShort: "Hải Châu, Đà Nẵng",
      checkHours: "Theo dữ liệu dự án · kiểm tra lại lịch",
      visitDetails: "Thông tin tham quan ↗",
      independent:
        "Dự án minh họa độc lập, không phải website chính thức của Bảo tàng Đà Nẵng.",
      discover: "Khám phá theo cách của bạn",
      atYourPace: "Một chạm. Nhiều câu chuyện.",
      dataMode: "Chế độ trợ lý dữ liệu · Có dẫn nguồn",
      meetMay: "Tìm hiểu cùng Mây ↗",
      catalog: "Thư viện hiện vật",
      catalogSub: "9 hồ sơ · 15 chủ đề",
      map: "Sơ đồ chủ đề",
      mapSub: "Khám phá 3 tầng · mô phỏng",
      plan: "Hành trình của bạn",
      planSub: "Theo thời gian và sở thích",
      quiz: "Thử tài di sản",
      quizSub: "Học điều mới · nhận huy hiệu",
      info: "Thông tin tham quan",
      infoSub: "Địa chỉ, giờ và nguồn vé",
      profile: "Nhật ký khám phá",
      profileSub: "Lưu kỷ niệm và tiến độ",
      navhome: "Trang chủ",
      navcatalog: "Khám phá",
      navguide: "Mây AI",
      navscan: "Quét QR",
      navprofile: "Cá nhân",
      pause: "Ⅱ Tạm dừng",
      play: "▷ Tiếp tục",
      slide: "Nội dung",
      catalogNotice:
        "Ảnh và mô tả từ nguồn Bảo tàng Đà Nẵng. Chủ đề liên quan không xác định vị trí thực tế của hiện vật.",
      backendSettings: "Cấu hình backend · dành cho nhóm phát triển",
      cameraPrivacy:
        "Camera chỉ mở khi bạn bấm “Mở camera” và cho phép truy cập. Khung hình được xử lý trên thiết bị, không gửi lên máy chủ. Camera tắt khi rời màn hình quét.",
      lang: "Đổi ngôn ngữ",
      back: "Quay lại",
      voice: "Nhập bằng giọng nói",
      send: "Gửi câu hỏi",
      search: "Tìm kiếm hiện vật",
      openCode: "Mở mã đã nhập",
      saveEndpoint: "Lưu địa chỉ backend",
      catalogTitle: "Thư viện hiện vật",
      qrAlt: "Mã QR dẫn tới hồ sơ hiện vật",
      placeholderTitle: "Ảnh từ nguồn bảo tàng",
      backendConsent:
        "Khi kết nối backend, câu hỏi và tối đa 8 lượt hội thoại gần nhất được gửi đến máy chủ bạn cấu hình và nhà cung cấp AI của máy chủ. Không gửi thông tin cá nhân.",
      chatInput: "Nhập câu hỏi cho Mây",
      manual: "Nhập mã QR hoặc đường dẫn",
      carousel: "Gợi ý cùng Mây",
      stop: "Dừng",
      source: "Nguồn bảo tàng",
      picturePending: "Ảnh từ nguồn bảo tàng",
    },
    en: {
      skip: "Skip to content",
      welcome: "HELLO, EXPLORER",
      homeTitle: "A day closer to heritage.",
      companion: "YOUR HERITAGE COMPANION",
      talk: "Chat with Mây",
      makeRoute: "Plan a journey",
      robotHello: "Lovely to meet you!",
      yourVisit: "PLAN YOUR VISIT",
      visitHeading: "See you at the museum.",
      visitIntro: "A little preparation. A world of discoveries.",
      addressShort: "Hai Chau, Da Nang",
      checkHours: "Project records · confirm current hours",
      visitDetails: "Visitor information ↗",
      independent:
        "Independent demonstration, not the official Da Nang Museum website.",
      discover: "Make discovery your own",
      atYourPace: "One tap. Many stories.",
      dataMode: "Data assistant mode · Cited sources",
      meetMay: "Explore with Mây ↗",
      catalog: "Artifact library",
      catalogSub: "9 records · 15 themes",
      map: "Thematic map",
      mapSub: "Explore 3 floors · simulation",
      plan: "Your journey",
      planSub: "By time and interests",
      quiz: "Heritage challenge",
      quizSub: "Learn something · earn badges",
      info: "Visitor information",
      infoSub: "Address, hours and ticket sources",
      profile: "Discovery journal",
      profileSub: "Save memories and progress",
      navhome: "Home",
      navcatalog: "Explore",
      navguide: "Mây AI",
      navscan: "Scan QR",
      navprofile: "My space",
      pause: "Ⅱ Pause",
      play: "▷ Resume",
      slide: "Slide",
      catalogNotice:
        "Photographs and descriptions from Da Nang Museum sources. Related themes do not identify physical object locations.",
      backendSettings: "Backend settings · for developers",
      cameraPrivacy:
        "The camera opens only after you tap “Open camera” and grant access. Frames are processed on your device, never uploaded. Leaving the scanner stops the camera.",
      lang: "Change language",
      back: "Go back",
      voice: "Voice input",
      send: "Send question",
      search: "Search artifacts",
      openCode: "Open entered code",
      saveEndpoint: "Save backend URL",
      catalogTitle: "Artifact library",
      qrAlt: "QR code linking to the artifact record",
      placeholderTitle: "Museum source image",
      backendConsent:
        "When a backend is connected, your question and up to 8 recent conversation turns are sent to your configured server and its AI provider. Do not submit personal information.",
      chatInput: "Type a question for Mây",
      manual: "Enter a QR code or URL",
      carousel: "Discover with Mây",
      stop: "Stop",
      source: "Museum source",
      picturePending: "Museum source image",
    },
    ko: {
      skip: "본문으로 건너뛰기",
      welcome: "탐험가 여러분, 안녕하세요",
      homeTitle: "문화유산과 가까워지는 하루.",
      companion: "나만의 문화유산 안내원",
      talk: "마이와 대화하기",
      makeRoute: "관람 코스 만들기",
      robotHello: "만나서 반가워요!",
      yourVisit: "방문 준비",
      visitHeading: "박물관에서 만나요.",
      visitIntro: "작은 준비로 새로운 발견을 만나 보세요.",
      addressShort: "베트남 다낭 하이쩌우",
      checkHours: "프로젝트 자료 · 최신 시간 확인 필요",
      visitDetails: "방문 정보 ↗",
      independent:
        "독립 데모 프로젝트이며 다낭 박물관 공식 웹사이트가 아닙니다.",
      discover: "나만의 방식으로 탐험하기",
      atYourPace: "한 번의 터치, 다양한 이야기.",
      dataMode: "자료 안내 모드 · 출처 제공",
      meetMay: "마이와 함께 탐험하기 ↗",
      catalog: "유물 자료실",
      catalogSub: "유물 9개 · 주제 15개",
      map: "주제별 안내도",
      mapSub: "3개 층 탐색 · 모의 안내도",
      plan: "나의 관람 코스",
      planSub: "시간과 관심사에 맞춘 추천",
      quiz: "문화유산 퀴즈",
      quizSub: "새로운 배움과 배지",
      info: "방문 정보",
      infoSub: "주소, 운영시간 및 입장료 출처",
      profile: "탐험 일지",
      profileSub: "추억과 탐험 기록 저장",
      navhome: "홈",
      navcatalog: "탐험",
      navguide: "마이 AI",
      navscan: "QR 스캔",
      navprofile: "내 공간",
      pause: "Ⅱ 일시 정지",
      play: "▷ 다시 시작",
      slide: "슬라이드",
      catalogNotice:
        "사진과 설명은 다낭 박물관 자료를 출처로 합니다. 관련 주제는 유물의 실제 위치를 나타내지 않습니다.",
      backendSettings: "백엔드 설정 · 개발자용",
      cameraPrivacy:
        "카메라 열기를 누르고 권한을 허용한 경우에만 카메라가 켜집니다. 영상은 기기에서 처리되며 업로드되지 않습니다. 스캔 화면을 떠나면 카메라가 꺼집니다.",
      lang: "언어 변경",
      back: "뒤로 가기",
      voice: "음성 입력",
      send: "질문 보내기",
      search: "유물 검색",
      openCode: "입력 코드 열기",
      saveEndpoint: "백엔드 주소 저장",
      catalogTitle: "유물 자료실",
      qrAlt: "유물 상세 정보를 여는 QR 코드",
      placeholderTitle: "박물관 자료 사진",
      backendConsent:
        "백엔드 연결 시 질문과 최근 대화 최대 8개가 설정한 서버 및 AI 제공업체로 전송됩니다. 개인정보를 입력하지 마세요.",
      chatInput: "마이에게 질문 입력",
      manual: "QR 코드 또는 주소 입력",
      carousel: "마이와 함께 탐험",
      stop: "중지",
      source: "박물관 출처",
      picturePending: "박물관 자료 사진",
    },
    zh: {
      skip: "跳至正文",
      welcome: "探索者，您好",
      homeTitle: "与文化遗产更近的一天。",
      companion: "您的文化遗产伙伴",
      talk: "与小云聊天",
      makeRoute: "规划参观路线",
      robotHello: "很高兴认识您！",
      yourVisit: "准备参观",
      visitHeading: "博物馆见。",
      visitIntro: "做好小小准备，开启新的发现。",
      addressShort: "越南岘港海洲坊",
      checkHours: "项目资料 · 请确认最新时间",
      visitDetails: "参观信息 ↗",
      independent: "独立演示项目，并非岘港博物馆官方网站。",
      discover: "按自己的方式探索",
      atYourPace: "轻轻一点，发现更多故事。",
      dataMode: "资料助手模式 · 附资料来源",
      meetMay: "与小云一起探索 ↗",
      catalog: "文物资料库",
      catalogSub: "9件文物 · 15个主题",
      map: "主题导览图",
      mapSub: "探索3层 · 模拟示意",
      plan: "您的参观路线",
      planSub: "按时间与兴趣推荐",
      quiz: "文化遗产挑战",
      quizSub: "学习知识，赢取徽章",
      info: "参观信息",
      infoSub: "地址、开放时间与门票来源",
      profile: "探索日记",
      profileSub: "保存回忆与探索进度",
      navhome: "首页",
      navcatalog: "探索",
      navguide: "小云 AI",
      navscan: "扫码",
      navprofile: "个人",
      pause: "Ⅱ 暂停",
      play: "▷ 继续",
      slide: "幻灯片",
      catalogNotice:
        "图片与说明来自岘港博物馆资料。关联主题不代表文物实际位置。",
      backendSettings: "后端设置 · 开发者专用",
      cameraPrivacy:
        "只有点击开启摄像头并授权后才会打开摄像头。画面仅在设备内处理，不会上传。离开扫码页面后摄像头会关闭。",
      lang: "更改语言",
      back: "返回",
      voice: "语音输入",
      send: "发送问题",
      search: "搜索文物",
      openCode: "打开输入的代码",
      saveEndpoint: "保存后端地址",
      catalogTitle: "文物资料库",
      qrAlt: "打开文物档案的二维码",
      placeholderTitle: "博物馆来源图片",
      backendConsent:
        "连接后端后，您的问题和最近最多8条对话将发送至您配置的服务器及其AI服务商。请勿提交个人信息。",
      chatInput: "向小云输入问题",
      manual: "输入二维码或网址",
      carousel: "与小云一起探索",
      stop: "停止",
      source: "博物馆来源",
      picturePending: "博物馆来源图片",
    },
  };
  const slides = {
    vi: [
      [
        "Xin chào, mình là Mây.",
        "Cùng mình mở những câu chuyện về Đà Nẵng, từ hiện vật đến những ký ức của thành phố.",
      ],
      [
        "Một hành trình, rất riêng bạn.",
        "Có 15, 30 hay 60 phút? Mình gợi ý những điểm dừng theo thời gian và sở thích của bạn.",
      ],
      [
        "Mỗi hiện vật, một câu chuyện.",
        "Khám phá hồ sơ hiện vật, hỏi thêm về chất liệu, niên đại và mở nguồn để tìm hiểu sâu hơn.",
      ],
      [
        "Một lần quét, thêm một khám phá.",
        "Quét QR để mở đúng hồ sơ hoặc chọn mốc check-in. Sơ đồ chủ đề được ghi rõ là mô phỏng.",
      ],
      [
        "Cùng tìm về ký ức Đà Nẵng.",
        "Hỏi về lịch sử, văn hóa và con người. Khi thiếu dữ liệu, mình sẽ nói rõ thay vì đoán.",
      ],
    ],
    en: [
      [
        "Hello, I’m Mây.",
        "Let’s uncover Da Nang’s stories, from museum artifacts to the memories of a city.",
      ],
      [
        "A journey that feels like you.",
        "Have 15, 30 or 60 minutes? Find thematic stops tailored to your time and interests.",
      ],
      [
        "Every artifact has a story.",
        "Browse records, ask about materials and dates, and follow the sources to learn more.",
      ],
      [
        "One scan. A new discovery.",
        "Scan a QR to open a record or check-in marker. The thematic map is explicitly illustrative.",
      ],
      [
        "Meet the memories of Da Nang.",
        "Ask about history, culture and people. When the records are insufficient, I’ll tell you.",
      ],
    ],
    ko: [
      [
        "안녕하세요, 마이입니다.",
        "유물부터 도시의 기억까지, 다낭의 다양한 이야기를 함께 찾아보세요.",
      ],
      [
        "나에게 맞는 관람 여행.",
        "15분, 30분, 60분 중 얼마나 여유가 있나요? 시간과 관심사에 맞는 주제를 추천합니다.",
      ],
      [
        "유물마다 담긴 이야기.",
        "유물 자료를 보고 재질과 시대를 물어보세요. 출처에서 더 자세히 알아볼 수 있어요.",
      ],
      [
        "한 번의 스캔, 새로운 발견.",
        "QR로 유물 자료를 열거나 체크인하세요. 주제 안내도는 모의 안내도입니다.",
      ],
      [
        "다낭의 기억을 만나다.",
        "역사, 문화와 사람들을 물어보세요. 자료가 부족하면 추측하지 않고 알려드려요.",
      ],
    ],
    zh: [
      ["您好，我是小云。", "从馆藏文物到城市记忆，让我们一起发现岘港的故事。"],
      [
        "属于您的参观旅程。",
        "您有15、30还是60分钟？根据时间和兴趣，推荐适合您的主题站点。",
      ],
      [
        "每件文物都有故事。",
        "浏览文物档案，询问材质与年代，通过资料来源进一步了解。",
      ],
      [
        "一次扫码，全新发现。",
        "扫描二维码打开文物档案或签到点。主题导览图明确标注为模拟示意。",
      ],
      [
        "走近岘港的记忆。",
        "了解历史、文化与人物。资料不足时，我会如实说明，不会猜测。",
      ],
    ],
  };
  let index = 0;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = true; // Autoplay is opt-in so the reading experience remains stable.
  const tr = (k) => (strings[M.state.lang] || strings.vi)[k] || k;
  function renderSlide() {
    const pair = slides[M.state.lang][index];
    $("hero-title").textContent = pair[0];
    $("hero-text").textContent = pair[1];
    $("hero-dots").innerHTML = slides[M.state.lang]
      .map(
        (_, i) =>
          `<button type="button" data-slide="${i}" aria-label="${tr("slide")} ${i + 1}" aria-pressed="${i === index}"></button>`,
      )
      .join("");
    $("hero-pause").textContent = tr(paused ? "play" : "pause");
    $("hero-pause").setAttribute("aria-pressed", String(!paused));
  }
  function markNav() {
    const p = M.state.page;
    const group = [
      "artifact",
      "article",
      "topics",
      "floors",
      "map",
      "search",
    ].includes(p)
      ? "catalog"
      : ["plan", "quiz"].includes(p)
        ? "profile"
        : p;
    document.querySelectorAll(".nav button").forEach((b) => {
      const on = b.dataset.go === group;
      b.classList.toggle("on", on);
      if (on) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
  }
  function update() {
    document.querySelectorAll("[data-v6]").forEach((el) => {
      el.textContent = el.dataset.v6==='catalogSub'?M.human(`${M.A.length} hồ sơ · 15 chủ đề`,`${M.A.length} records · 15 themes`,`${M.A.length}개 유물 · 15개 주제`,`${M.A.length}件文物 · 15个主题`):tr(el.dataset.v6);
    });
    const labels = {
      "lang-switch": "lang",
      "top-info": "info",
      "home-mic": "voice",
      "search-mic": "voice",
      "chat-mic": "voice",
      "home-search-btn": "search",
      "catalog-input": "search",
      "search-input": "search",
      "chat-input": "chatInput",
      "qr-manual": "manual",
      "qr-manual-go": "openCode",
      "ai-endpoint-save": "saveEndpoint",
    };
    for (const [id, key] of Object.entries(labels))
      $(id)?.setAttribute("aria-label", tr(key));
    document
      .querySelectorAll("[data-back]")
      .forEach((b) => b.setAttribute("aria-label", tr("back")));
    document
      .querySelector("#chat-form button[type=submit]")
      ?.setAttribute("aria-label", tr("send"));
    document.querySelector(".nav").setAttribute("aria-label", tr("discover"));
    document
      .querySelector(".may-hero")
      .setAttribute("aria-label", tr("carousel"));
    document.querySelector("#page-catalog h1").textContent = tr("catalogTitle");
    $("artifact-qr").alt = tr("qrAlt");
    // Use the localized catalogue title consistently.
    document.querySelector("[data-t=catalogFloor]").textContent =
      M.t("chooseFloor");
    document
      .querySelectorAll(
        "[data-floor],[data-min],[data-interest],[data-pace],[data-lang]",
      )
      .forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          String(b.classList.contains("selected")),
        ),
      );
    renderSlide();
    markNav();
  }
  $("hero-pause").addEventListener("click", () => {
    paused = !paused;
    renderSlide();
  });
  $("hero-dots").addEventListener("click", (e) => {
    const b = e.target.closest("[data-slide]");
    if (b) {
      index = Number(b.dataset.slide);
      renderSlide();
    }
  });
  setInterval(() => {
    if (
      !paused &&
      !reduced.matches &&
      !document.hidden &&
      M.state.page === "home" &&
      $("lang-overlay").classList.contains("hidden")
    ) {
      index = (index + 1) % 5;
      renderSlide();
    }
  }, 8000);
  reduced.addEventListener("change", () => {
    if (reduced.matches) {
      paused = true;
      renderSlide();
    }
  });
  // Keep focus within the language selector while the rest of the app is inert.
  const overlay = $("lang-overlay");
  let languageFocus = null;
  function dialogState() {
    const open = !overlay.classList.contains("hidden");
    for (const el of document.querySelectorAll(".top,.stage,.nav"))
      el.inert = open;
    if (open) {
      languageFocus = document.activeElement;
      requestAnimationFrame(() =>
        overlay.querySelector('[data-lang="' + M.state.lang + '"]')?.focus(),
      );
    } else if (languageFocus?.isConnected) languageFocus.focus();
  }
  new MutationObserver(dialogState).observe(overlay, {
    attributes: true,
    attributeFilter: ["class"],
  });
  overlay.addEventListener("keydown", (e) => {
    const focusable = [...overlay.querySelectorAll("button:not(:disabled)")];
    const first = focusable[0],
      last = focusable.at(-1);
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    if (e.key === "Escape" && M.state.confirmed) {
      e.stopPropagation();
      overlay.classList.add("hidden");
    }
  });
  // Inform visitors before opting into external processing.
  const consent = document.createElement("p");
  consent.className = "note";
  consent.dataset.v6 = "backendConsent";
  document.querySelector(".developer-config")?.appendChild(consent);
  // Cancel permission-dependent work on backgrounding the app as well as navigating away.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      M.state.speech?.abort();
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      if (M.state.scan) M.stopCamera();
    }
  });
  document.addEventListener("museum:language", update);
  document.addEventListener("museum:navigate", () => {
    update();
  });
  new MutationObserver((records) => {
    for (const r of records) {
      const el = r.target;
      if (
        el.matches?.(
          "[data-floor],[data-min],[data-interest],[data-pace],[data-lang]",
        )
      )
        el.setAttribute(
          "aria-pressed",
          String(el.classList.contains("selected")),
        );
    }
  }).observe(document.querySelector(".app"), {
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });
  update();
  dialogState();
})();
