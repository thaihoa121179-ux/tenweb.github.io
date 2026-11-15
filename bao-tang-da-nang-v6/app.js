(() => {
  "use strict";
  const I18N = {
    vi: {
      searchHint: "Tìm hiện vật, chủ đề, khu trưng bày...",
      heroEyebrow: "HÀNH TRÌNH DI SẢN",
      heroTitle: "Khám phá theo cách của bạn.",
      heroText: "Từ sở thích đến hành trình — bảo tàng trong lòng bàn tay.",
      startPlan: "✦ Tạo hành trình riêng ↗",
      exploreNow: "Bạn muốn làm gì?",
      noInstall: "Không cần cài ứng dụng",
      scan: "Quét mã QR",
      scanSub: "Tầng / hiện vật",
      map: "Sơ đồ tầng",
      mapSub: "Xem các khu trưng bày",
      askGuide: "Hỏi trợ lý",
      guideSub: "Tư vấn theo sở thích",
      collections: "Thư viện",
      collectionsSub: "15 chủ đề / 3 tầng",
      journey: "Hành trình riêng",
      journeySub: "15 / 30 / 60 phút",
      visit: "Tham quan",
      visitSub: "Giờ mở cửa / vé",
      homeFoot: "Cơ sở 1 · 31 Trần Phú · 08:00–17:00",
      details: "Chi tiết ›",
      chooseFloor: "Khám phá từng tầng",
      collectionDesc:
        "Chọn một tầng để xem các chủ đề, nghe giải thích và mở sơ đồ.",
      openMap: "Xem sơ đồ tầng",
      story: "CÂU CHUYỆN DI SẢN",
      detail: "Thông tin trưng bày",
      listen: "▶ Nghe thuyết minh",
      pinMap: "Xem trên sơ đồ",
      askAbout: "Hỏi trợ lý",
      addRoute: "Lưu vào hành trình",
      source: "Nguồn bảo tàng ↗",
      verifiedNote:
        "Nội dung theo nguồn chính thức. Vị trí trên sơ đồ là mô phỏng, không phải vị trí hiện vật thật.",
      floorOverview: "KHÔNG GIAN TRƯNG BÀY",
      interactiveMap: "Sơ đồ tương tác",
      illustration: "SƠ ĐỒ MÔ PHỎNG",
      mapCaveat:
        "⚠ Sơ đồ chỉ minh họa các nhóm chủ đề. Chưa thể dẫn đường tới vị trí hiện vật chính xác nếu không có bản vẽ mặt bằng được bảo tàng xác nhận.",
      allTopics: "Danh sách chủ đề",
      scanFloorQR: "Quét QR tầng",
      smartFind: "TÌM KIẾM THÔNG MINH",
      searchTitle: "Bạn muốn tìm gì?",
      qrGuide: "HAI LOẠI MÃ QR",
      qrTitle: "Quét để khám phá",
      qrExplainTitle: "QR hoạt động như thế nào?",
      qrExplain:
        "QR đặt ở lối vào dùng để mở website. Sau khi vào, QR của từng tầng/hiện vật mở sơ đồ hoặc trang thông tin tương ứng.",
      qrIdle: "Bấm Mở camera để quét",
      openCamera: "Mở camera",
      stopCamera: "Tắt camera",
      uploadQr: "Chọn ảnh QR",
      demoCodes: "Mã dùng thử",
      qrManual: "Nhập mã, ví dụ DN-MUSEUM-F1",
      qrWarning:
        "Mã demo do nhóm tự tạo, không phải QR đã lắp tại bảo tàng. QR thực tế chỉ hoạt động khi được đăng ký dữ liệu.",
      personalized: "CÁ NHÂN HÓA",
      planTitle: "Thiết kế chuyến đi",
      planTime: "BẠN CÓ BAO NHIÊU THỜI GIAN?",
      planLikes: "BẠN QUAN TÂM ĐẾN GÌ?",
      planStyle: "NHỊP ĐỘ THAM QUAN",
      buildPlan: "✦ Tạo lộ trình của tôi",
      planLimit:
        "Thời lượng từng điểm chỉ là ước tính, chưa có dữ liệu khoảng cách trong nhà.",
      guideMode: "BẠN ĐỒNG HÀNH MỖI NGÀY",
      guideTitle: "Trò chuyện cùng Mây",
      offlineMode:
        "Chế độ tư vấn theo dữ liệu mẫu có dẫn nguồn. AI đối thoại tự do chỉ hoạt động khi kết nối backend.",
      askAnything: "Hỏi một điều, kể một chuyện…",
      infoTag: "THÔNG TIN THAM QUAN",
      address: "Địa chỉ",
      addressText: "31 Trần Phú, Hải Châu, Đà Nẵng",
      hours: "Giờ mở cửa",
      hoursText: "08:00–17:00 hằng ngày",
      tickets: "Giá vé",
      ticketsText: "Xem mức giá và ưu đãi mới nhất trên website chính thức.",
      contact: "Liên hệ",
      howTo: "Cách sử dụng",
      howToText:
        "Chọn ngôn ngữ → tạo hành trình hoặc xem tầng → quét QR để mở nội dung → hỏi trợ lý.",
      developerSettings: "Kết nối AI (cho nhóm phát triển)",
      developerIntro:
        "Nhập URL máy chủ AI khi đã triển khai. KHÔNG nhập API key tại đây.",
      developerWarn:
        "Địa chỉ backend được lưu trên thiết bị này; API key phải được giữ ở máy chủ.",
      officialSite: "Xem nguồn chính thức ↗",
      demoDisclaimer:
        "Dự án sinh viên độc lập; không phải website chính thức của bảo tàng.",
      navHome: "Trang chủ",
      navSearch: "Tìm kiếm",
      navGuide: "Trợ lý",
      floor: "Tầng",
      floorLabel: "Tầng {n}",
      floorIntro: "Khám phá các câu chuyện và không gian",
      zone: "Vùng minh họa",
      openTopic: "Xem nội dung",
      noResult: "Không tìm thấy chủ đề phù hợp. Hãy thử từ khóa khác.",
      popular: "Gợi ý khám phá",
      history: "Lịch sử",
      culture: "Văn hóa",
      antique: "Cổ vật",
      family: "Gia đình",
      modern: "Thành phố",
      relaxed: "Thư thả",
      focused: "Tìm hiểu sâu",
      planReady: "Hành trình đề xuất",
      routeDone: "Đã ghé",
      routeMark: "Đánh dấu đã ghé",
      routeProgress: "Hoàn thành",
      routeSave: "Hành trình đã được lưu trên thiết bị",
      routeNo: "Chọn ít nhất một sở thích.",
      clickStop: "Chạm vào tên để xem chi tiết",
      qrEntry: "Mở website",
      qrF1: "QR tầng 1",
      qrF2: "QR tầng 2",
      qrF3: "QR tầng 3",
      qrInvalid:
        "Không nhận ra mã này trong dữ liệu demo. Hãy thử mã mẫu hoặc xem danh sách chủ đề.",
      qrExternal:
        "Mã QR dẫn tới trang khác. Bạn có thể mở bằng trình duyệt, nhưng đây không phải mã nội bộ của dự án.",
      qrScanned: "Đã nhận diện mã",
      qrCameraError:
        "Không thể mở camera. Kiểm tra quyền truy cập, dùng HTTPS hoặc chọn ảnh QR.",
      qrLibraryError:
        "Trình duyệt này chưa hỗ trợ đọc QR; hãy dùng mã nhập tay hoặc ảnh và thử lại.",
      qrBusy: "Đang nhận diện mã QR...",
      qrStopped: "Camera đã tắt",
      qrManualMsg: "Nhập mã để xem kết quả.",
      qrFileError: "Không đọc được mã QR từ ảnh. Thử ảnh rõ nét hơn.",
      cameraStarted: "Đang quét, đưa mã vào khung",
      speechUnsupported:
        "Trình duyệt không hỗ trợ micro nhận dạng trực tiếp. Hãy dùng nút micro trên bàn phím hoặc gõ chữ.",
      speechDenied: "Không được cấp quyền micro. Bạn có thể gõ câu hỏi.",
      speechListening: "Đang nghe, hãy nói...",
      voiceUnsupported: "Trình duyệt chưa hỗ trợ đọc văn bản.",
      speakStop: "■ Dừng đọc",
      sourceWarning:
        "Liên kết nguồn bên ngoài có thể hiển thị bằng tiếng Việt, nhưng nội dung trong ứng dụng đã chuyển ngôn ngữ.",
      guideHello:
        "Xin chào! Bạn thích lịch sử, văn hóa hay cổ vật? Bạn có thể hỏi mình nên tham quan tầng nào, thông tin vé hoặc quét QR như thế nào.",
      guideTry: "Mình thích văn hóa, nên đi tầng nào?",
      guideQR: "Quét QR để làm gì?",
      guideTicket: "Giá vé / giờ mở cửa",
      guideMap: "Xem bản đồ tầng 1",
      guideAnswerHistory:
        "Nếu bạn thích lịch sử, hãy ưu tiên tầng 3 với lịch sử đô thị, đấu tranh giành độc lập và quá trình phát triển của Đà Nẵng.",
      guideAnswerCulture:
        "Nếu yêu thích văn hóa các dân tộc và nét đặc trưng xứ Quảng, hãy tham quan tầng 2, rồi tầng 3 để tìm hiểu văn hóa người Việt xứ Quảng.",
      guideAnswerAntique:
        "Nếu thích cổ vật, nên bắt đầu từ tầng 1: sưu tập cổ vật và khu trưng bày chuyên đề.",
      guideAnswerFamily:
        "Đi cùng gia đình hoặc trẻ em, hãy xem khu thiếu nhi ở tầng 1, sau đó khám phá thiên nhiên và con người ở tầng 3.",
      guideAnswerQR:
        "Có 2 loại QR: (1) Mã đặt ngoài lối vào mở website trên điện thoại; (2) Mã nội bộ được gắn cho tầng hoặc chủ đề, quét trong website để mở đúng sơ đồ hoặc trang chi tiết. Bản này chỉ có mã thử nghiệm.",
      guideAnswerTime:
        "Bảo tàng Đà Nẵng cơ sở 1, số 31 Trần Phú, mở 08:00–17:00 hằng ngày. Bạn nên kiểm tra lại lịch dịp lễ trên trang chính thức.",
      guideAnswerTicket:
        "Giá vé có các mức tùy đối tượng và thời điểm. Để tránh đưa giá cũ, vui lòng kiểm tra thông báo vé mới nhất trên website chính thức.",
      guideAnswerUnknown:
        "Mình chưa có dữ liệu chắc chắn để giải thích câu này. Hãy thử tìm chủ đề trong thư viện hoặc mở nguồn chính thức. Khi kết nối backend AI, câu hỏi sẽ được xử lý từ kho tri thức đã kiểm chứng.",
      assistantActions: "Khám phá tiếp",
      goMap: "Mở sơ đồ",
      goPlan: "Tạo hành trình",
      goSearch: "Tìm chủ đề",
      openOfficial: "Mở trang chính thức",
      saveOk: "Đã lưu vào hành trình",
      endpointSaved: "Đã lưu địa chỉ backend. Hãy thử nhắn tin để kiểm tra.",
      endpointClear: "Đã chuyển về chế độ tra cứu mẫu.",
      aiOn: "AI đã kết nối máy chủ; câu trả lời phụ thuộc chất lượng dữ liệu và cấu hình.",
      aiError: "Không kết nối được AI, đang trả lời bằng bộ tra cứu có sẵn.",
      loading: "Đang trả lời...",
      sampleTap: "Chạm vào mã để mô phỏng quét",
      welcomeLanguage: "Chào mừng đến\nBảo tàng Đà Nẵng",
      languagePrompt:
        "Chọn ngôn ngữ trước khi bắt đầu. Bạn có thể thay đổi bất kỳ lúc nào.",
      browserGuess: "Trình duyệt gợi ý: ",
      languageStart: "Bắt đầu khám phá →",
    },
    en: {
      searchHint: "Search exhibits, artifacts, and stories...",
      heroEyebrow: "HERITAGE JOURNEY",
      heroTitle: "Explore it your way.",
      heroText:
        "From your interests to your journey — the museum in your pocket.",
      startPlan: "✦ Create my tour ↗",
      exploreNow: "What would you like to do?",
      noInstall: "No app required",
      scan: "Scan QR",
      scanSub: "Floor / exhibits",
      map: "Floor map",
      mapSub: "Explore zones",
      askGuide: "Ask a guide",
      guideSub: "Recommendations",
      collections: "Collections",
      collectionsSub: "15 topics / 3 floors",
      journey: "My journey",
      journeySub: "15 / 30 / 60 min",
      visit: "Plan a visit",
      visitSub: "Hours / tickets",
      homeFoot: "Main site · 31 Tran Phu · 08:00–17:00",
      details: "Details ›",
      chooseFloor: "Explore each floor",
      collectionDesc:
        "Choose a floor to explore stories, listen, and see a floor diagram.",
      openMap: "View floor map",
      story: "HERITAGE STORIES",
      detail: "Exhibition details",
      listen: "▶ Listen",
      pinMap: "Show on map",
      askAbout: "Ask the guide",
      addRoute: "Save to journey",
      source: "Museum source ↗",
      verifiedNote:
        "Based on official museum information. The diagram is illustrative, not the actual location of artifacts.",
      floorOverview: "EXHIBITION SPACE",
      interactiveMap: "Interactive floor map",
      illustration: "ILLUSTRATIVE MAP",
      mapCaveat:
        "⚠ Illustrative topic zones only. Accurate indoor directions require official floor plans and verified exhibit positions.",
      allTopics: "All topics",
      scanFloorQR: "Scan floor QR",
      smartFind: "SMART SEARCH",
      searchTitle: "What are you looking for?",
      qrGuide: "TWO TYPES OF QR",
      qrTitle: "Scan to explore",
      qrExplainTitle: "What do QR codes do?",
      qrExplain:
        "An entrance QR opens this website. Inside, a floor or exhibit QR takes you to the relevant map or exhibit page.",
      qrIdle: "Tap Open camera to scan",
      openCamera: "Open camera",
      stopCamera: "Stop camera",
      uploadQr: "Choose QR image",
      demoCodes: "Try demo codes",
      qrManual: "Enter code e.g. DN-MUSEUM-F1",
      qrWarning:
        "Demo codes are created for this project, not installed in the museum. Actual QR labels require approved mappings.",
      personalized: "PERSONALIZED",
      planTitle: "Design your visit",
      planTime: "HOW MUCH TIME DO YOU HAVE?",
      planLikes: "WHAT INTERESTS YOU?",
      planStyle: "PREFERRED PACE",
      buildPlan: "✦ Build my journey",
      planLimit:
        "Stop durations are approximate; no verified indoor distance data is available.",
      guideMode: "HERITAGE & EVERYDAY LIFE",
      guideTitle: "A moment with Mây",
      offlineMode:
        "Verified-data demo mode. Open-ended AI requires a separate configured backend.",
      askAnything: "Ask something, share a thought…",
      infoTag: "VISITOR INFORMATION",
      address: "Address",
      addressText: "31 Tran Phu, Hai Chau, Da Nang",
      hours: "Opening hours",
      hoursText: "Daily 08:00–17:00",
      tickets: "Tickets",
      ticketsText:
        "Check current admission and concessions on the official site.",
      contact: "Contact",
      howTo: "How to use",
      howToText:
        "Choose language → plan or browse floors → scan QR to open content → ask your guide.",
      developerSettings: "Connect AI (for developers)",
      developerIntro:
        "Enter your deployed AI backend URL. Never enter an API key here.",
      developerWarn:
        "The URL is saved on this device. Keep API keys on the server.",
      officialSite: "Official museum source ↗",
      demoDisclaimer:
        "Independent student prototype, not an official museum website.",
      navHome: "Home",
      navSearch: "Search",
      navGuide: "Guide",
      floor: "Floor",
      floorLabel: "Floor {n}",
      floorIntro: "Stories and galleries to explore",
      zone: "Demo zone",
      openTopic: "Open details",
      noResult: "No matching topic. Try another search.",
      popular: "Suggested discoveries",
      history: "History",
      culture: "Culture",
      antique: "Antiquities",
      family: "Families",
      modern: "Modern city",
      relaxed: "Relaxed",
      focused: "In depth",
      planReady: "Your suggested journey",
      routeDone: "Visited",
      routeMark: "Mark visited",
      routeProgress: "Completed",
      routeSave: "Tour saved on this device",
      routeNo: "Choose at least one interest.",
      clickStop: "Tap a stop to open details",
      qrEntry: "Website entrance",
      qrF1: "Floor 1 QR",
      qrF2: "Floor 2 QR",
      qrF3: "Floor 3 QR",
      qrInvalid:
        "Unknown demo code. Try a sample code or browse the collection.",
      qrExternal:
        "This QR points to another website. You may open it in your browser, but it is not an internal demo code.",
      qrScanned: "QR detected",
      qrCameraError:
        "Camera unavailable. Check permission and HTTPS, or upload a QR image.",
      qrLibraryError:
        "QR decoding not supported in this browser. Enter the sample code manually.",
      qrBusy: "Reading QR...",
      qrStopped: "Camera stopped",
      qrManualMsg: "Enter a code to continue.",
      qrFileError: "No readable QR found. Try a clearer image.",
      cameraStarted: "Scanning — align the QR in the frame",
      speechUnsupported:
        "Speech recognition is unsupported here. Use your keyboard microphone or type.",
      speechDenied: "Microphone permission denied. You can type instead.",
      speechListening: "Listening...",
      voiceUnsupported: "Text-to-speech is unavailable.",
      speakStop: "■ Stop audio",
      sourceWarning:
        "External source pages may be in Vietnamese; the content inside this app is localized.",
      guideHello:
        "Hello! Do you enjoy history, culture or antiquities? Ask me which floor to explore, ticket information, or how QR codes work.",
      guideTry: "I love culture. Which floor?",
      guideQR: "What do QR codes do?",
      guideTicket: "Tickets and hours",
      guideMap: "Show floor 1 map",
      guideAnswerHistory:
        "If you enjoy history, prioritize floor 3: urban history, independence movements and Da Nang’s development.",
      guideAnswerCulture:
        "For ethnic cultures and Quang traditions, start on floor 2, then continue to floor 3 for Vietnamese culture of the region.",
      guideAnswerAntique:
        "For antiquities, start on floor 1 with its artifact collections and special exhibition space.",
      guideAnswerFamily:
        "With children, explore the children’s section on floor 1, then nature and people on floor 3.",
      guideAnswerQR:
        "There are two QR flows: (1) an entrance QR opens the website; (2) a mapped floor or exhibit QR scanned inside the app opens its floor map or detail page. This prototype uses demo QR codes.",
      guideAnswerTime:
        "The museum at 31 Tran Phu is open daily 08:00–17:00. Check special holiday schedules on the official site.",
      guideAnswerTicket:
        "Ticket rates vary by visitor category and date. Check the latest official notice to avoid outdated prices.",
      guideAnswerUnknown:
        "I do not have verified data to answer that confidently. Search the collections or view the official source. A future AI backend can answer from a curated knowledge base.",
      assistantActions: "Continue exploring",
      goMap: "Show map",
      goPlan: "Build a route",
      goSearch: "Search topics",
      openOfficial: "Official website",
      saveOk: "Added to your journey",
      endpointSaved: "AI backend URL saved. Try a message to test it.",
      endpointClear: "Switched to the built-in guide.",
      aiOn: "AI backend connected. Accuracy depends on verified sources and configuration.",
      aiError: "AI unavailable; using built-in guide instead.",
      loading: "Thinking...",
      sampleTap: "Tap a QR code to simulate scanning",
      welcomeLanguage: "Welcome to\nDa Nang Museum",
      languagePrompt:
        "Choose your language before entering. You can change it any time.",
      browserGuess: "Browser suggests: ",
      languageStart: "Start exploring →",
    },
    ko: {
      searchHint: "유물, 전시, 이야기를 검색하세요...",
      heroEyebrow: "문화유산 여행",
      heroTitle: "나만의 방식으로 탐험하세요.",
      heroText: "관심사에 맞춘 박물관 관람을 휴대전화에서 즐기세요.",
      startPlan: "✦ 맞춤 관람 만들기 ↗",
      exploreNow: "무엇을 하고 싶으세요?",
      noInstall: "앱 설치 불필요",
      scan: "QR 스캔",
      scanSub: "층 / 전시",
      map: "층별 안내도",
      mapSub: "전시 구역 살펴보기",
      askGuide: "가이드에게 질문",
      guideSub: "맞춤 추천",
      collections: "전시 자료",
      collectionsSub: "15개 주제 / 3개 층",
      journey: "나의 관람 코스",
      journeySub: "15 / 30 / 60분",
      visit: "방문 안내",
      visitSub: "운영시간 / 요금",
      homeFoot: "본관 · 쩐푸 31번지 · 08:00–17:00",
      details: "자세히 ›",
      chooseFloor: "층별 전시 둘러보기",
      collectionDesc: "층을 선택해 전시 이야기를 확인하고 안내도를 보세요.",
      openMap: "층별 안내도",
      story: "문화유산 이야기",
      detail: "전시 정보",
      listen: "▶ 음성 안내",
      pinMap: "안내도에서 보기",
      askAbout: "가이드에게 질문",
      addRoute: "코스에 저장",
      source: "박물관 공식 자료 ↗",
      verifiedNote:
        "공식 자료 기반 콘텐츠입니다. 안내도는 실제 유물 위치가 아닌 예시입니다.",
      floorOverview: "전시 공간",
      interactiveMap: "인터랙티브 안내도",
      illustration: "예시 안내도",
      mapCaveat:
        "⚠ 주제별 구역을 표현한 예시입니다. 정확한 실내 길 안내에는 박물관에서 확인한 도면이 필요합니다.",
      allTopics: "전체 주제",
      scanFloorQR: "층 QR 스캔",
      smartFind: "스마트 검색",
      searchTitle: "무엇을 찾으세요?",
      qrGuide: "두 가지 QR 코드",
      qrTitle: "QR로 탐색",
      qrExplainTitle: "QR 코드는 어떻게 쓰나요?",
      qrExplain:
        "입구 QR은 웹사이트를 열고, 내부의 층/전시 QR은 해당 안내도나 상세 정보를 엽니다.",
      qrIdle: "카메라 열기를 눌러 스캔하세요",
      openCamera: "카메라 열기",
      stopCamera: "카메라 끄기",
      uploadQr: "QR 이미지 선택",
      demoCodes: "예시 QR 보기",
      qrManual: "코드 입력: DN-MUSEUM-F1",
      qrWarning:
        "본 QR은 프로젝트용 예시이며 실제 박물관에 설치된 코드가 아닙니다.",
      personalized: "맞춤형 관람",
      planTitle: "관람 계획 세우기",
      planTime: "관람 시간은?",
      planLikes: "관심 분야는?",
      planStyle: "관람 속도",
      buildPlan: "✦ 코스 만들기",
      planLimit: "소요 시간은 예시이며 실제 실내 이동 거리 정보는 없습니다.",
      guideMode: "일상과 유산 이야기",
      guideTitle: "마이와 이야기해요",
      offlineMode:
        "검증된 자료 기반 데모입니다. 자유 대화형 AI에는 별도 서버 연결이 필요합니다.",
      askAnything: "궁금한 점이나 오늘 이야기를 들려주세요…",
      infoTag: "방문 정보",
      address: "주소",
      addressText: "베트남 다낭 하이쩌우 쩐푸 31",
      hours: "운영시간",
      hoursText: "매일 08:00–17:00",
      tickets: "입장료",
      ticketsText: "최신 요금 및 할인은 공식 사이트에서 확인하세요.",
      contact: "연락처",
      howTo: "이용 방법",
      howToText: "언어 선택 → 코스 또는 전시 선택 → QR 스캔 → 가이드에게 질문.",
      developerSettings: "AI 연결 (개발자용)",
      developerIntro: "AI 서버 URL을 입력하세요. API 키는 입력하지 마세요.",
      developerWarn:
        "서버 URL은 기기에 저장됩니다. API 키는 서버에서 보호해야 합니다.",
      officialSite: "공식 박물관 사이트 ↗",
      demoDisclaimer: "비공식 학생 프로젝트입니다.",
      navHome: "홈",
      navSearch: "검색",
      navGuide: "가이드",
      floor: "층",
      floorLabel: "{n}층",
      floorIntro: "층별 전시 이야기",
      zone: "예시 구역",
      openTopic: "상세 보기",
      noResult: "검색 결과가 없습니다.",
      popular: "추천 콘텐츠",
      history: "역사",
      culture: "문화",
      antique: "유물",
      family: "가족",
      modern: "현대 도시",
      relaxed: "여유롭게",
      focused: "깊이 있게",
      planReady: "추천 관람 코스",
      routeDone: "방문 완료",
      routeMark: "방문 표시",
      routeProgress: "완료",
      routeSave: "기기에 코스가 저장되었습니다",
      routeNo: "관심사를 하나 이상 선택하세요.",
      clickStop: "항목을 누르면 상세 정보를 볼 수 있습니다",
      qrEntry: "입구 웹사이트",
      qrF1: "1층 QR",
      qrF2: "2층 QR",
      qrF3: "3층 QR",
      qrInvalid: "등록되지 않은 예시 코드입니다.",
      qrExternal: "이 QR은 외부 사이트로 연결됩니다. 내부 코드가 아닙니다.",
      qrScanned: "QR 인식됨",
      qrCameraError:
        "카메라를 사용할 수 없습니다. 권한, HTTPS를 확인하거나 이미지를 선택하세요.",
      qrLibraryError: "이 브라우저에서는 QR 인식이 지원되지 않습니다.",
      qrBusy: "QR 읽는 중...",
      qrStopped: "카메라 종료",
      qrManualMsg: "코드를 입력하세요.",
      qrFileError: "이미지에서 QR을 읽지 못했습니다.",
      cameraStarted: "스캔 중 — QR을 프레임에 맞추세요",
      speechUnsupported:
        "음성 인식이 지원되지 않습니다. 키보드 마이크나 입력을 사용하세요.",
      speechDenied: "마이크 권한이 거부되었습니다.",
      speechListening: "듣고 있습니다...",
      voiceUnsupported: "음성 읽기가 지원되지 않습니다.",
      speakStop: "■ 읽기 중지",
      sourceWarning: "외부 공식 자료는 베트남어일 수 있습니다.",
      guideHello:
        "안녕하세요! 역사, 문화, 유물 중 무엇에 관심이 있나요? 층 추천이나 QR 사용법을 물어보세요.",
      guideTry: "문화를 좋아해요. 어느 층?",
      guideQR: "QR 사용법",
      guideTicket: "입장료와 운영시간",
      guideMap: "1층 안내도",
      guideAnswerHistory:
        "역사를 좋아한다면 도시의 역사와 독립운동을 소개하는 3층을 추천합니다.",
      guideAnswerCulture:
        "지역 문화와 민족 문화를 좋아한다면 2층을 먼저 둘러보세요. 3층에서도 꽝 지역 문화를 볼 수 있습니다.",
      guideAnswerAntique:
        "유물에 관심이 있다면 1층의 고대 유물 컬렉션을 추천합니다.",
      guideAnswerFamily:
        "어린이와 함께라면 1층의 어린이 전시 공간을 추천합니다.",
      guideAnswerQR:
        "입구 QR은 웹사이트를 열고, 박물관 내부 QR은 해당 층 안내도나 전시 상세 화면을 엽니다. 현재는 예시 QR을 사용합니다.",
      guideAnswerTime: "본관 운영시간은 매일 08:00–17:00입니다.",
      guideAnswerTicket:
        "정확한 입장료는 공식 홈페이지의 최신 안내를 확인하세요.",
      guideAnswerUnknown:
        "확인된 정보가 없어 확실히 답하기 어렵습니다. 전시 검색이나 공식 자료를 이용하세요.",
      assistantActions: "계속 탐색",
      goMap: "안내도 보기",
      goPlan: "코스 만들기",
      goSearch: "전시 검색",
      openOfficial: "공식 웹사이트",
      saveOk: "코스에 추가했습니다",
      endpointSaved: "AI 서버 주소가 저장되었습니다.",
      endpointClear: "기본 가이드 모드입니다.",
      aiOn: "AI 서버 연결됨.",
      aiError: "AI에 연결할 수 없어 기본 답변을 표시합니다.",
      loading: "답변 작성 중...",
      sampleTap: "QR을 누르면 스캔을 시뮬레이션합니다",
      welcomeLanguage: "다낭 박물관에\n오신 것을 환영합니다",
      languagePrompt:
        "시작하기 전에 언어를 선택하세요. 나중에 변경할 수 있습니다.",
      browserGuess: "브라우저 추천: ",
      languageStart: "탐험 시작 →",
    },
    zh: {
      searchHint: "搜索文物、展览与故事...",
      heroEyebrow: "文化遗产之旅",
      heroTitle: "按自己的方式探索。",
      heroText: "根据兴趣规划旅程，随时了解博物馆。",
      startPlan: "✦ 创建专属路线 ↗",
      exploreNow: "您想做什么？",
      noInstall: "无需安装应用",
      scan: "扫描二维码",
      scanSub: "楼层 / 展品",
      map: "楼层导览图",
      mapSub: "查看展区",
      askGuide: "咨询导览助手",
      guideSub: "按兴趣推荐",
      collections: "展览目录",
      collectionsSub: "15个主题 / 3层",
      journey: "我的参观路线",
      journeySub: "15 / 30 / 60分钟",
      visit: "参观信息",
      visitSub: "开放时间 / 门票",
      homeFoot: "主馆 · 陈富街31号 · 08:00–17:00",
      details: "详情 ›",
      chooseFloor: "探索各楼层",
      collectionDesc: "选择楼层查看主题、语音介绍和示意图。",
      openMap: "查看楼层图",
      story: "文化遗产故事",
      detail: "展览详情",
      listen: "▶ 收听介绍",
      pinMap: "查看地图位置",
      askAbout: "询问助手",
      addRoute: "加入路线",
      source: "博物馆资料来源 ↗",
      verifiedNote: "内容依据官方资料。导览图仅为示意，并非文物真实位置。",
      floorOverview: "展览空间",
      interactiveMap: "互动楼层图",
      illustration: "示意图",
      mapCaveat:
        "⚠ 本图仅展示主题分区示意。准确的室内导航需要博物馆核实的平面图。",
      allTopics: "查看本层主题",
      scanFloorQR: "扫描楼层码",
      smartFind: "智能搜索",
      searchTitle: "您想找什么？",
      qrGuide: "两种二维码",
      qrTitle: "扫描探索",
      qrExplainTitle: "二维码有什么作用？",
      qrExplain:
        "入口二维码打开网站；馆内楼层或展品二维码可打开相应楼层图或详情。",
      qrIdle: "点击开启摄像头扫描",
      openCamera: "开启摄像头",
      stopCamera: "关闭摄像头",
      uploadQr: "选择二维码图片",
      demoCodes: "查看演示码",
      qrManual: "输入代码，如 DN-MUSEUM-F1",
      qrWarning: "这些是项目演示码，并非馆内已安装的二维码。",
      personalized: "个性化",
      planTitle: "规划您的参观",
      planTime: "您有多少时间？",
      planLikes: "您对什么感兴趣？",
      planStyle: "参观节奏",
      buildPlan: "✦ 生成专属路线",
      planLimit: "各站时间为估算，目前没有经过核实的馆内距离数据。",
      guideMode: "日常与文化小伙伴",
      guideTitle: "和小云聊聊",
      offlineMode: "基于已核实资料的演示问答。自由对话AI需另行连接服务器。",
      askAnything: "问个问题，聊聊今天……",
      infoTag: "参观须知",
      address: "地址",
      addressText: "越南岘港海洲坊陈富街31号",
      hours: "开放时间",
      hoursText: "每天 08:00–17:00",
      tickets: "门票",
      ticketsText: "请以官网最新票价及优惠信息为准。",
      contact: "联系方式",
      howTo: "使用方法",
      howToText:
        "选择语言 → 规划路线或查看楼层 → 扫码查看内容 → 咨询导览助手。",
      developerSettings: "连接AI（开发者）",
      developerIntro: "输入已部署的AI服务器地址。不要填写API密钥。",
      developerWarn: "服务器地址保存在本设备；API密钥应保存在服务端。",
      officialSite: "博物馆官方网站 ↗",
      demoDisclaimer: "独立学生演示项目，并非博物馆官方网站。",
      navHome: "首页",
      navSearch: "搜索",
      navGuide: "助手",
      floor: "楼层",
      floorLabel: "第{n}层",
      floorIntro: "探索展区故事",
      zone: "示意区域",
      openTopic: "查看详情",
      noResult: "未找到匹配主题，请换个词搜索。",
      popular: "推荐探索",
      history: "历史",
      culture: "文化",
      antique: "古物",
      family: "家庭",
      modern: "城市发展",
      relaxed: "轻松",
      focused: "深度探索",
      planReady: "推荐路线",
      routeDone: "已参观",
      routeMark: "标记已参观",
      routeProgress: "已完成",
      routeSave: "路线已保存在本设备",
      routeNo: "请至少选择一个兴趣。",
      clickStop: "点击站点查看详情",
      qrEntry: "网站入口码",
      qrF1: "一层码",
      qrF2: "二层码",
      qrF3: "三层码",
      qrInvalid: "无法识别此演示码，请尝试示例。",
      qrExternal: "此码指向外部网站，不属于内部演示码。",
      qrScanned: "已识别二维码",
      qrCameraError: "无法访问摄像头。请检查权限和HTTPS，或上传二维码图片。",
      qrLibraryError: "当前浏览器不支持二维码解码，请手动输入。",
      qrBusy: "正在识别...",
      qrStopped: "摄像头已关闭",
      qrManualMsg: "请输入代码。",
      qrFileError: "无法从图片识别二维码。",
      cameraStarted: "正在扫描，请将二维码放入框内",
      speechUnsupported: "浏览器不支持语音识别。请使用键盘麦克风或文字输入。",
      speechDenied: "麦克风权限被拒绝。",
      speechListening: "正在聆听...",
      voiceUnsupported: "浏览器不支持语音朗读。",
      speakStop: "■ 停止朗读",
      sourceWarning: "外部来源网页可能是越南语，但本应用内内容已翻译。",
      guideHello:
        "您好！您对历史、文化还是古物感兴趣？可以询问楼层推荐、门票信息或二维码使用方法。",
      guideTry: "我喜欢文化，推荐哪层？",
      guideQR: "二维码如何使用？",
      guideTicket: "门票与开放时间",
      guideMap: "查看一层地图",
      guideAnswerHistory:
        "如果喜欢历史，推荐三层：城市历史、民族独立斗争和岘港的发展。",
      guideAnswerCulture:
        "对民族文化和广南传统感兴趣，建议先看二层，再去三层了解当地越南文化。",
      guideAnswerAntique: "喜欢古物可先从一层的古物收藏与专题展开始。",
      guideAnswerFamily:
        "带孩子参观可先去一层的儿童展区，再看三层的自然与人文展览。",
      guideAnswerQR:
        "入口二维码可打开网站；馆内二维码在应用中扫描后打开对应楼层图或展品详情。目前仅提供演示码。",
      guideAnswerTime: "岘港博物馆主馆每天08:00–17:00开放。",
      guideAnswerTicket: "门票可能因人群和时间而异，请查看官网最新公告。",
      guideAnswerUnknown:
        "目前缺少核实资料，无法确定答复。请搜索展览或查看官方来源。",
      assistantActions: "继续探索",
      goMap: "查看地图",
      goPlan: "规划路线",
      goSearch: "搜索主题",
      openOfficial: "官方网站",
      saveOk: "已加入路线",
      endpointSaved: "已保存AI服务器地址。",
      endpointClear: "已切换至内置导览助手。",
      aiOn: "AI服务器已连接。",
      aiError: "无法连接AI，已改用内置答复。",
      loading: "正在生成答复...",
      sampleTap: "点击二维码模拟扫描",
      welcomeLanguage: "欢迎来到\n岘港博物馆",
      languagePrompt: "请先选择语言，之后可随时更改。",
      browserGuess: "浏览器推荐：",
      languageStart: "开始探索 →",
    },
  };

  Object.assign(I18N.vi, {
    catalogTitle: "Hiện vật có hình ảnh",
    catalogCaption: "BỘ SƯU TẬP THAM KHẢO",
    catalogFloor: "Khám phá nội dung 3 tầng ↗",
    artifactCaption: "HỒ SƠ HIỆN VẬT",
    artifactListen: "♬ Nghe thuyết minh",
    artifactShare: "↗ Chia sẻ QR/link",
    artifactMap: "Chủ đề liên quan",
    artifactSource: "Xem hồ sơ chính thức ↗",
    artifactQRExplain:
      "Dùng camera điện thoại khác quét mã này để mở trực tiếp hồ sơ hiện vật.",
    zoneIndexTitle: "CÁC CHỦ ĐỀ TRÊN TẦNG",
  });
  Object.assign(I18N.en, {
    catalogTitle: "Artifact photo library",
    catalogCaption: "VERIFIED REFERENCE COLLECTION",
    catalogFloor: "Explore all three floors ↗",
    artifactCaption: "ARTIFACT PROFILE",
    artifactListen: "♬ Listen to audio",
    artifactShare: "↗ Share QR/link",
    artifactMap: "Related theme",
    artifactSource: "Official museum record ↗",
    artifactQRExplain:
      "Scan with another phone’s camera to open this artifact profile.",
    zoneIndexTitle: "EXHIBITION THEMES ON THIS FLOOR",
  });
  Object.assign(I18N.ko, {
    catalogTitle: "사진 유물 자료",
    catalogCaption: "전시 소장품 안내",
    catalogFloor: "3개 층 콘텐츠 보기 ↗",
    artifactCaption: "유물 정보",
    artifactListen: "♬ 오디오 듣기",
    artifactShare: "↗ QR/링크 공유",
    artifactMap: "관련 주제",
    artifactSource: "박물관 원본 자료 ↗",
    artifactQRExplain:
      "다른 휴대전화로 이 QR을 스캔하면 유물 정보를 열 수 있습니다.",
    zoneIndexTitle: "층별 주제",
  });
  Object.assign(I18N.zh, {
    catalogTitle: "文物照片资料",
    catalogCaption: "馆藏资料",
    catalogFloor: "浏览三层展厅 ↗",
    artifactCaption: "文物详情",
    artifactListen: "♬ 听语音介绍",
    artifactShare: "↗ 分享二维码",
    artifactMap: "相关主题",
    artifactSource: "官方文物资料 ↗",
    artifactQRExplain: "使用另一部手机扫描二维码，直接打开此文物详情。",
    zoneIndexTitle: "本层展览主题",
  });
  // Opening information is inherited project data, not a live schedule feed.
  Object.assign(I18N.vi, {
    guideAnswerTime:
      "Thông tin tham khảo trong dự án: cơ sở 1 tại 31 Trần Phú mở 08:00–17:00 hằng ngày. Hãy xác nhận lịch hiện tại và dịp lễ trên website chính thức.",
  });
  Object.assign(I18N.en, {
    guideAnswerTime:
      "The project records list site 1 at 31 Tran Phu as open daily 08:00–17:00. Confirm the current schedule and holiday hours on the official website.",
  });
  Object.assign(I18N.ko, {
    guideAnswerTime:
      "프로젝트 자료에 따르면 쩐푸 31번지 본관은 매일 08:00–17:00 운영합니다. 최신 일정과 공휴일 시간은 공식 웹사이트에서 확인하세요.",
  });
  Object.assign(I18N.zh, {
    guideAnswerTime:
      "项目资料记载陈富街31号主馆每天08:00–17:00开放。请在官方网站确认最新时间及节假日安排。",
  });
  const langs = ["vi", "en", "ko", "zh"];
  const L = { vi: 0, en: 1, ko: 2, zh: 3 };
  const S = {
    overview: "https://baotangdanang.vn/bao-tang-da-nang-1",
    floors: "https://baotangdanang.vn/bao-tang-da-nang/khong-gian-trung-bay",
    f2: "https://www.baotangdanang.vn/khong-gian-trung-bay-tang-2",
    main: "https://baotangdanang.vn/",
  };
  const D = [
    [
      "co-vat",
      1,
      "🏺",
      ["antique", "history"],
      [
        "Sưu tập cổ vật",
        "Antiquities collection",
        "고대 유물 컬렉션",
        "古物收藏",
      ],
      [
        "Các sưu tập cổ vật giới thiệu dấu ấn vật chất và đời sống qua nhiều thời kỳ ở vùng đất Đà Nẵng và miền Trung.",
        "Antiquities collections present material heritage and traces of everyday life from different historical periods in central Vietnam.",
        "고대 유물 컬렉션을 통해 베트남 중부 지역의 여러 시대 생활과 물질문화를 살펴볼 수 있습니다.",
        "古物收藏展示越南中部不同时代的物质文化与生活遗迹。",
      ],
      "gom co chu dau binh voi antiquities ceramics pottery",
    ],
    [
      "thieu-nhi",
      1,
      "🧒",
      ["family", "culture"],
      [
        "Khu trưng bày thiếu nhi",
        "Children’s exhibition area",
        "어린이 전시 공간",
        "儿童展区",
      ],
      [
        "Không gian dành cho các hoạt động khám phá và giáo dục di sản phù hợp với trẻ em.",
        "A space for children to discover heritage through age-appropriate activities and learning.",
        "어린이가 체험과 배움을 통해 지역 문화유산을 알아보는 공간입니다.",
        "面向儿童的文化遗产探索与教育空间。",
      ],
      "tre em gia dinh kids family",
    ],
    [
      "trien-lam",
      1,
      "🖼️",
      ["modern", "culture"],
      [
        "Trưng bày định kỳ",
        "Temporary exhibitions",
        "기획·특별 전시",
        "定期专题展览",
      ],
      [
        "Không gian dành cho triển lãm ngắn hạn; nội dung có thể thay đổi theo từng đợt trưng bày.",
        "A space for short-term exhibitions. Displays change according to the museum’s current program.",
        "기간별로 주제가 바뀌는 특별 전시 공간입니다.",
        "用于短期专题展览，具体展览内容会随活动计划调整。",
      ],
      "trien lam chuyen de temporary exhibitions",
    ],
    [
      "den-co",
      2,
      "🏮",
      ["culture", "antique"],
      [
        "Đèn cổ xứ Quảng",
        "Historic lamps of Quang region",
        "꽝 지역의 옛 등불",
        "广南地区古灯",
      ],
      [
        "Tìm hiểu các loại đèn cổ và nét sinh hoạt văn hóa gắn với ánh sáng trong cuộc sống xứ Quảng.",
        "Discover historical lamps and their connections to everyday life and cultural practices in the Quang region.",
        "꽝 지역의 옛 등불과 생활문화의 관계를 알아봅니다.",
        "了解广南地区古灯及其与当地生活文化的联系。",
      ],
      "den mang xong den co lamp lantern lighting",
    ],
    [
      "tram-huong",
      2,
      "🌿",
      ["culture", "antique"],
      [
        "Trầm hương xứ Quảng",
        "Agarwood of Quang region",
        "꽝 지역의 침향",
        "广南地区沉香",
      ],
      [
        "Giới thiệu trầm hương như một nét đặc trưng trong tài nguyên, nghề nghiệp và đời sống văn hóa xứ Quảng.",
        "Explore agarwood as part of the region’s natural resources, crafts and cultural traditions.",
        "꽝 지역의 자원, 공예와 문화 전통 속 침향을 소개합니다.",
        "介绍沉香与当地自然资源、工艺及文化传统的关系。",
      ],
      "tram huong agarwood incense",
    ],
    [
      "nghien-cuu",
      2,
      "📚",
      ["modern", "history"],
      [
        "Nghiên cứu và phát triển",
        "Research and development",
        "연구와 발전",
        "研究与发展",
      ],
      [
        "Không gian giới thiệu hoạt động tìm hiểu, nghiên cứu và phát triển gắn với di sản địa phương.",
        "A thematic area presenting research and development related to local heritage.",
        "지역 문화유산의 연구와 발전을 살펴보는 주제 공간입니다.",
        "展示与当地文化遗产有关的研究与发展主题。",
      ],
      "nghien cuu phat trien research development",
    ],
    [
      "dan-toc",
      2,
      "🧵",
      ["culture", "family"],
      ["Văn hóa các dân tộc", "Ethnic cultures", "소수민족 문화", "民族文化"],
      [
        "Tìm hiểu văn hóa của các cộng đồng Cơ Tu, Xơ Đăng, Giẻ-Triêng, Cor và những nét đa dạng văn hóa trong khu vực.",
        "Explore the cultural diversity of communities such as Cơ Tu, Xơ Đăng, Giẻ-Triêng and Cor.",
        "꺼뚜, 써당, 제찌엥, 꼬르 등 지역 공동체의 다양한 문화를 소개합니다.",
        "了解格都、色登、耶-遮恩、戈尔等族群的多样文化。",
      ],
      "co tu xo dang gie trieng cor dan toc minority ethnic",
    ],
    [
      "tong-quan",
      3,
      "🌉",
      ["history", "modern"],
      ["Tổng quan Đà Nẵng", "Da Nang overview", "다낭 개요", "岘港概览"],
      [
        "Bức tranh khái quát về thành phố Đà Nẵng, nơi thiên nhiên, đô thị và các cộng đồng cùng tạo nên bản sắc.",
        "An introduction to the city and the natural, urban and social elements that shape its identity.",
        "다낭의 자연, 도시와 공동체가 이룬 지역적 특색을 소개합니다.",
        "概述岘港的自然、城市与社会特色。",
      ],
      "da nang city overview thanh pho",
    ],
    [
      "thien-nhien",
      3,
      "🌊",
      ["family", "culture"],
      [
        "Thiên nhiên và con người",
        "Nature and people",
        "자연과 사람",
        "自然与人文",
      ],
      [
        "Khám phá điều kiện tự nhiên cùng mối quan hệ giữa con người và môi trường ở Đà Nẵng.",
        "Explore Da Nang’s natural environment and the relationship between its landscape and communities.",
        "다낭의 자연환경과 사람들의 삶의 관계를 살펴봅니다.",
        "了解岘港的自然环境及人与环境的关系。",
      ],
      "thien nhien con nguoi moi truong nature people",
    ],
    [
      "lich-su-do-thi",
      3,
      "🏛️",
      ["history", "modern"],
      [
        "Lịch sử đô thị Đà Nẵng",
        "Urban history of Da Nang",
        "다낭 도시 역사",
        "岘港城市史",
      ],
      [
        "Theo dõi những chuyển biến của Đà Nẵng qua các giai đoạn hình thành và phát triển đô thị.",
        "Follow the evolution of Da Nang through stages of urban formation and development.",
        "다낭의 도시 형성과 발전 과정을 살펴봅니다.",
        "了解岘港城市形成与发展的历史进程。",
      ],
      "lich su tourane thanh pho urban history",
    ],
    [
      "doc-lap",
      3,
      "🕊️",
      ["history"],
      [
        "Đấu tranh bảo vệ độc lập",
        "Struggle for independence",
        "독립을 위한 투쟁",
        "争取民族独立",
      ],
      [
        "Chủ đề giới thiệu hành trình đấu tranh bảo vệ độc lập dân tộc được phản ánh trong lịch sử địa phương.",
        "An exhibition theme about the struggle to defend national independence in the region’s history.",
        "지역 역사 속 민족 독립을 위한 투쟁을 소개합니다.",
        "展示当地历史中争取并捍卫民族独立的历程。",
      ],
      "khang chien doc lap independence struggle",
    ],
    [
      "chien-tranh",
      3,
      "🪖",
      ["history"],
      ["Chứng tích chiến tranh", "War remnants", "전쟁의 흔적", "战争遗迹"],
      [
        "Những tư liệu và câu chuyện giúp du khách suy ngẫm về tác động của chiến tranh và giá trị của hòa bình.",
        "Documents and stories invite reflection on the impact of war and the value of peace.",
        "전쟁의 영향과 평화의 가치를 되새기는 자료와 이야기를 소개합니다.",
        "通过资料与故事反思战争的影响与和平的价值。",
      ],
      "chien tranh war peace chung tich",
    ],
    [
      "hoi-nhap",
      3,
      "✨",
      ["modern", "history"],
      [
        "Hội nhập và phát triển",
        "Integration and development",
        "통합과 발전",
        "融合与发展",
      ],
      [
        "Tìm hiểu quá trình Đà Nẵng đổi mới và phát triển trong giai đoạn hiện đại.",
        "Discover Da Nang’s modern transformation, integration and development.",
        "현대 다낭의 변화와 발전 과정을 소개합니다.",
        "了解现代岘港的转型、融合与发展。",
      ],
      "hoi nhap phat trien modern development",
    ],
    [
      "toa-thi-chinh",
      3,
      "🏢",
      ["history", "modern"],
      ["Tòa thị chính Đà Nẵng", "Da Nang City Hall", "다낭 시청", "岘港市政厅"],
      [
        "Không gian giới thiệu dấu ấn công trình và câu chuyện đô thị gắn với Tòa thị chính Đà Nẵng.",
        "An exhibition topic about the historic city hall and its place in Da Nang’s urban story.",
        "다낭 시청과 도시사의 관련성을 소개하는 전시입니다.",
        "介绍岘港市政厅及其承载的城市历史。",
      ],
      "toa thi chinh city hall",
    ],
    [
      "van-hoa-quang",
      3,
      "🎎",
      ["culture", "family"],
      [
        "Văn hóa người Việt xứ Quảng",
        "Vietnamese culture of Quang region",
        "꽝 지역 베트남 문화",
        "广南地区越族文化",
      ],
      [
        "Khám phá phong tục, đời sống và giá trị văn hóa của người Việt xứ Quảng trong dòng chảy lịch sử.",
        "Explore traditions, daily life and cultural values of Vietnamese communities in the Quang region.",
        "꽝 지역 베트남인들의 풍습, 생활과 문화적 가치를 알아봅니다.",
        "探索广南地区越族的风俗、日常生活与文化价值。",
      ],
      "van hoa viet quang nam phong tuc traditions culture",
    ],
  ].map(([id, floor, icon, tags, names, descs, keywords]) => ({
    id,
    floor,
    icon,
    tags,
    names,
    descs,
    keywords,
    source: floor === 2 ? S.f2 : floor === 1 ? S.floors : S.overview,
  }));

  const GALLERY_IMAGES = {
    "co-vat": "https://dnfam-website.vr360.com.vn/uploads/images/DSCF1963.webp",
    "thieu-nhi":
      "https://dnfam-website.vr360.com.vn/uploads/images/khu%20v%E1%BB%B1c%20thieu%20nhi.webp",
    "trien-lam":
      "https://dnfam-website.vr360.com.vn/uploads/images/trien%20lam%20dinh%20ky.webp",
    "den-co": "https://dnfam-website.vr360.com.vn/uploads/images/DSC02502.JPG",
    "tram-huong": "https://dnfam-website.vr360.com.vn/uploads/images/h2.webp",
    "nghien-cuu": "https://dnfam-website.vr360.com.vn/uploads/images/h2.webp",
    "dan-toc": "https://dnfam-website.vr360.com.vn/uploads/images/h2.webp",
    "tong-quan":
      "https://dnfam-website.vr360.com.vn/uploads/images/DSC00923.JPG",
    "thien-nhien":
      "https://dnfam-website.vr360.com.vn/uploads/images/Kh%C3%B4ng%20gian%20Thi%C3%AAn%20nhi%C3%AAn%20v%C3%A0%20con%20ng%C6%B0%E1%BB%9Di%20%C4%90%C3%A0%20N%E1%BA%B5ng%281%29.webp",
    "lich-su-do-thi":
      "https://dnfam-website.vr360.com.vn/uploads/images/DSC00923.JPG",
    "doc-lap":
      "https://dnfam-website.vr360.com.vn/uploads/images/Kh%C3%B4ng%20gian%20Cu%E1%BB%99c%20%C4%91%E1%BA%A5u%20tranh%20b%E1%BA%A3o%20v%E1%BB%87%20n%E1%BB%81n%20%C4%91%E1%BB%99c%20l%E1%BA%ADp%20d%C3%A2n%20t%E1%BB%99c%281%29.webp",
    "chien-tranh":
      "https://dnfam-website.vr360.com.vn/uploads/images/Kh%C3%B4ng%20gian%20Cu%E1%BB%99c%20%C4%91%E1%BA%A5u%20tranh%20b%E1%BA%A3o%20v%E1%BB%87%20n%E1%BB%81n%20%C4%91%E1%BB%99c%20l%E1%BA%ADp%20d%C3%A2n%20t%E1%BB%99c%281%29.webp",
    "hoi-nhap":
      "https://dnfam-website.vr360.com.vn/uploads/images/DSC00923.JPG",
    "toa-thi-chinh":
      "https://dnfam-website.vr360.com.vn/uploads/images/DSC00923.JPG",
    "van-hoa-quang":
      "https://dnfam-website.vr360.com.vn/uploads/images/Kh%C3%B4ng%20gian%20ngh%E1%BB%81%20th%E1%BB%A7%20c%C3%B4ng%20truy%E1%BB%81n%20th%E1%BB%91ng.jpg",
  };
  const A = [
    {
      id: "ma-nao",
      topic: "tong-quan",
      name: "Trang sức mã não",
      en: "Agate jewelry",
      image:
        "https://baotangdanang.vn/uploads/artifacts/artifact_gshe48iiab-1777263997460.webp",
      era: "Khoảng 2.500–2.000 năm trước",
      material: "Mã não",
      summary:
        "Đồ trang sức tiêu biểu của cư dân văn hóa Sa Huỳnh, khai quật tại khu mộ chum Gò Đình năm 1980.",
      enSummary:
        "Agate ornaments associated with the Sa Huynh culture, recovered from the Go Dinh jar-burial site.",
      url: "https://baotangdanang.vn/bao-tang-da-nang/hien-vat/trang-sc-ma-nao",
    },
    {
      id: "sung-than-cong",
      topic: "doc-lap",
      name: "Súng thần công",
      en: "Historic cannon",
      image:
        "https://baotangdanang.vn/uploads/artifacts/artifact_93pul2vr1m-1774794472986.webp",
      era: "Theo hồ sơ: thế kỷ XIX",
      material: "Kim loại",
      summary:
        "Khẩu thần công được phát hiện tại khu vực Xuân Thiều – Nam Ô năm 2019; hiện vật gợi mở câu chuyện phòng thủ Đà Nẵng.",
      enSummary:
        "A historical cannon discovered near Xuan Thieu – Nam O in 2019, linked to Da Nang’s defensive history.",
      url: "https://baotangdanang.vn/bao-tang-da-nang/hien-vat/song-than-cing",
    },
    {
      id: "sac-phong",
      topic: "doc-lap",
      name: "Sắc phong",
      en: "Royal edict",
      image:
        "https://baotangdanang.vn/uploads/artifacts/artifact_u392gzmdqs-1774775225176.webp",
      era: "1840",
      material: "Giấy",
      summary:
        "Sắc phong thời Minh Mạng liên quan đến chức Thự thủ thành Điện Hải, viết chữ Hán trên giấy vàng có dấu triện đỏ.",
      enSummary:
        "An 1840 royal edict related to the Dien Hai Citadel, written on yellow paper with a red seal.",
      url: "https://baotangdanang.vn/bao-tang-da-nang/hien-vat/sac-phong",
    },
    {
      id: "doi-bau",
      topic: "doc-lap",
      name: "Đôi bầu",
      en: "Double carrying vessels",
      image:
        "https://baotangdanang.vn/uploads/artifacts/artifact_5mpvcd3k71-1777265281891.webp",
      era: "1954",
      material: "Vật dụng sinh hoạt",
      summary:
        "Đôi bầu chị Phan Thị Truy sử dụng khi cải trang bán nước mắm để hoạt động cách mạng ở Đà Nẵng.",
      enSummary:
        "Carrying vessels used by Phan Thi Truy as part of her cover while gathering information during wartime.",
      url: "https://baotangdanang.vn/bao-tang-da-nang/hien-vat/yii-bau",
    },
    {
      id: "bom-cbu",
      topic: "chien-tranh",
      name: "Bom CBU 55",
      en: "CBU-55 bomb",
      image:
        "https://baotangdanang.vn/uploads/artifacts/artifact_3epz1nk68i-1774802764488.webp",
      era: "1955–1975",
      material: "Sắt",
      summary:
        "Hiện vật chứng tích chiến tranh được bàn giao từ Nhà Chứng tích Chiến tranh năm 1990.",
      enSummary:
        "A wartime remnant transferred from the War Remnants House in 1990.",
      url: "https://baotangdanang.vn/bao-tang-da-nang/hien-vat/bom-cbu-55",
    },
    {
      id: "phu-dieu",
      topic: "dan-toc",
      name: "Phù điêu Cơ Tu",
      en: "Co Tu carved reliefs",
      image:
        "https://baotangdanang.vn/uploads/artifacts/artifact_qm704x4fvt-1775100280017.webp",
      era: "Thế kỷ XX",
      material: "Gỗ",
      summary:
        "Bộ phù điêu gỗ chạm hình rồng và thằn lằn từ nhà Gươl của người Cơ Tu tại vùng Giằng – Quảng Nam.",
      enSummary:
        "Wooden relief carvings of dragons and lizards from a Co Tu communal Guol house.",
      url: "https://baotangdanang.vn/bao-tang-da-nang/hien-vat/pho-yiau",
    },
    {
      id: "di-chuc",
      topic: "doc-lap",
      name: "Bản di chúc",
      en: "Historical testament",
      image:
        "https://baotangdanang.vn/uploads/artifacts/artifact_m59hgxxluy-1774794845046.webp",
      era: "1884",
      material: "Giấy",
      summary:
        "Bản di chúc chữ Hán Nôm gắn với danh nhân Ông Ích Khiêm, lưu lời căn dặn cho con cháu.",
      enSummary:
        "A handwritten testament associated with scholar and military figure Ong Ich Khiem.",
      url: "https://baotangdanang.vn/bao-tang-da-nang/hien-vat/ban-di-choc",
    },
    {
      id: "canh-cua",
      topic: "chien-tranh",
      name: "Cánh cửa nhà tù",
      en: "Prison doors",
      image:
        "https://baotangdanang.vn/uploads/artifacts/artifact_iosdna45zc-1774801711882.webp",
      era: "1946–1954",
      material: "Sắt",
      summary:
        "Cánh cửa được lưu giữ từ nhà lao Con Gà, ghi dấu lịch sử đấu tranh và giam cầm tại Đà Nẵng.",
      enSummary:
        "Original prison doors from the Con Ga detention facility, reflecting Da Nang’s wartime history.",
      url: "https://baotangdanang.vn/bao-tang-da-nang/hien-vat/canh-ca-nha-to",
    },
    {
      id: "ghe-bau",
      topic: "van-hoa-quang",
      name: "Ghe bầu",
      en: "Traditional trading boat",
      image:
        "https://baotangdanang.vn/uploads/artifacts/artifact_kvx3ir44ha-1774803583740.webp",
      era: "Mô hình thế kỷ XXI",
      material: "Gỗ",
      summary:
        "Mô hình ghe bầu – phương tiện vận tải đường biển và giao thương truyền thống nổi tiếng của xứ Quảng.",
      enSummary:
        "A modern wooden model of a traditional trading boat associated with coastal Quang culture.",
      url: "https://baotangdanang.vn/bao-tang-da-nang/hien-vat/ghe-bau",
    },
  ];
  A.push(
    ...(window.MuseumCollection?.items || []).filter(
      (item) =>
        !A.some(
          (existing) => existing.url === item.url || existing.id === item.id,
        ),
    ),
  );
  for (const record of A) {
    const linked = window.MuseumObjectVideos?.[record.id] || [];
    record.videos = [...(record.videos || []), ...linked];
  }
  const FLOOR_NAMES = {
    1: [
      "Cổ vật & khám phá",
      "Antiquities & discovery",
      "유물과 탐험",
      "古物与探索",
    ],
    2: ["Sắc màu văn hóa", "Cultural mosaic", "다채로운 문화", "多元文化"],
    3: ["Lịch sử & con người", "History & people", "역사와 사람", "历史与人文"],
  };
  const $ = (id) => document.getElementById(id);
  const $all = (s) => [...document.querySelectorAll(s)];
  const sv = (k, def = "") => {
    try {
      return localStorage.getItem("museum_v6:" + k) || def;
    } catch (e) {
      return def;
    }
  };
  const persist = (k, v) => {
    try {
      localStorage.setItem("museum_v6:" + k, v);
      return true;
    } catch (e) {
      return false;
    }
  };
  const browser = (() => {
    const v = (
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      "vi"
    ).toLowerCase();
    return v.startsWith("ko")
      ? "ko"
      : v.startsWith("zh")
        ? "zh"
        : v.startsWith("en")
          ? "en"
          : "vi";
  })();

  const CANONICAL_BASE =
    "https://thaihoa121179-ux.github.io/tenweb.github.io/bao-tang-da-nang-v6/";
  function restoreZone() {
    try {
      const z = JSON.parse(sv("museum_zone_v4", "null"));
      if (
        z &&
        [1, 2, 3].includes(z.floor) &&
        typeof z.topic === "string" &&
        (!z.topic || D.some((d) => d.id === z.topic && d.floor === z.floor)) &&
        ["qr", "manual"].includes(z.via) &&
        Number.isFinite(z.time)
      )
        return { floor: z.floor, topic: z.topic, via: z.via, time: z.time };
    } catch {}
    return null;
  }
  function adata(a) {
    return window.MuseumDataV6?.artifacts?.[a.id];
  }
  function aname(a) {
    return (
      adata(a)?.names[L[state.lang]] ||
      (state.lang === "vi" ? a.name : a.en || a.name)
    );
  }
  function asummary(a) {
    return (
      adata(a)?.summaries[L[state.lang]] ||
      (state.lang === "vi" ? a.summary : a.enSummary || a.summary)
    );
  }
  function ameta(a) {
    const d = adata(a);
    return {
      era: d?.eras[L[state.lang]] || a.era,
      material: d?.flags?.materialUnverified
        ? human("Chưa xác minh", "Unverified", "미확인", "尚未核实")
        : d?.materials[L[state.lang]] || a.material,
    };
  }
  function modeLabel() {
    return human(
      "Chế độ trợ lý dữ liệu",
      "Data assistant mode",
      "자료 기반 도우미 모드",
      "资料助手模式",
    );
  }
  function emit(name, detail = {}) {
    document.dispatchEvent(new CustomEvent("museum:" + name, { detail }));
  }
  const state = {
    lang: langs.includes(new URLSearchParams(location.search).get("lang"))
      ? new URLSearchParams(location.search).get("lang")
      : langs.includes(sv("museum_language"))
        ? sv("museum_language")
        : browser,
    confirmed: sv("museum_language_confirmed") === "yes",
    page: "home",
    stack: [],
    floor: 1,
    topic: "co-vat",
    mapSelected: null,
    time: 30,
    interests: new Set(["history"]),
    pace: "relaxed",
    route: null,
    guideMode: "offline",
    replyDepth: sv("museum_reply_depth", "deep") === "deep" ? "deep" : "standard",
    revealSpeed: ["slow","normal","instant","auto"].includes(sv("museum_reveal_speed")) ? sv("museum_reveal_speed") : "slow",
    currentZone: restoreZone(),
    artifact: "ma-nao",
    speech: null,
    scan: null,
    scanLoop: null,
    qrBusy: false,
  };
  function t(k) {
    return (I18N[state.lang] && I18N[state.lang][k]) || I18N.en[k] || k;
  }
  function label(f) {
    return t("floorLabel").replace("{n}", f);
  }
  function nm(d) {
    return d.names[L[state.lang]] || d.names[1];
  }
  function ds(d) {
    return d.descs[L[state.lang]] || d.descs[1];
  }
  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .normalize("NFC")
      .replace(/đ/g, "d")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function esc(s) {
    return String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }
  function toast(s) {
    const el = $("toast");
    el.textContent = s;
    el.classList.remove("hidden");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.add("hidden"), 3600);
  }
  function updateTranslations() {
    document.documentElement.lang = state.lang;
    document.title =
      state.lang === "vi"
        ? "Di sản Đà Nẵng · Hướng dẫn viên bảo tàng"
        : "Da Nang Museum · Heritage Companion";
    $all("[data-t]").forEach((el) => {
      el.textContent = t(el.dataset.t);
    });
    $all("[data-placeholder]").forEach((el) => {
      el.placeholder = t(el.dataset.placeholder);
    });
    $("lang-tag").textContent = state.lang.toUpperCase();
    $("language-heading").textContent = t("welcomeLanguage");
    $("language-intro").textContent = t("languagePrompt");
    $("language-start").textContent = t("languageStart");
    $("language-detected").textContent =
      t("browserGuess") + browser.toUpperCase();
    $all("[data-lang]").forEach((el) =>
      el.classList.toggle("selected", el.dataset.lang === state.lang),
    );
    if (!guideContext.turns.length && $("messages").children.length) resetGuide();
    renderPage();
    emit("language", { language: state.lang });
  }
  function enterLanguage() {
    const first = !state.confirmed;
    persist("museum_language", state.lang);
    persist("museum_language_confirmed", "yes");
    state.confirmed = true;
    $("lang-overlay").classList.add("hidden");
    updateTranslations();
    if (first) applyDeepLink(new URLSearchParams(location.search), false);
  }
  function applyDeepLink(q, remember = true) {
    const item = q.get("artifact"),
      zone = q.get("zone"),
      topic = q.get("topic"),
      floor = Number(q.get("floor"));
    if (item && A.some((x) => x.id === item)) {
      openArtifact(item, remember);
      return true;
    }
    if (zone && D.some((x) => x.id === zone)) {
      markPosition(zone, true, "qr");
      openMap(D.find((x) => x.id === zone).floor, remember, zone);
      return true;
    }
    if (topic && D.some((x) => x.id === topic)) {
      openArticle(topic, remember);
      return true;
    }
    if ([1, 2, 3].includes(floor)) {
      markPosition("floor-" + floor, true, "qr");
      openMap(floor, remember);
      return true;
    }
    return false;
  }

  function nav(page, remember = true) {
    const target = $("page-" + page);
    if (!target) return;
    if (state.page === "scan" && page !== "scan") stopCamera();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (remember && state.page !== page) state.stack.push(state.page);
    state.stack = state.stack.slice(-30);
    state.page = page;
    $all(".page").forEach((el) => {
      const on = el === target;
      el.classList.toggle("active", on);
      el.setAttribute("aria-hidden", String(!on));
      el.inert = !on;
    });
    $all(".nav button").forEach((el) => {
      const active = el.dataset.go === page;
      el.classList.toggle("on", active);
      if (active) el.setAttribute("aria-current", "page");
      else el.removeAttribute("aria-current");
    });
    renderPage();
    target.scrollTop = 0;
    const scroll = target.querySelector(".scroll");
    if (scroll) scroll.scrollTop = 0;
    const h = target.querySelector("h1");
    if (h) {
      h.tabIndex = -1;
      h.focus({ preventScroll: true });
    }
    emit("navigate", { page });
  }

  function back() {
    const dest = state.stack.pop() || "home";
    nav(dest, false);
  }
  function openTopics(f) {
    state.floor = f;
    nav("topics");
  }
  function openArtifact(id, remember = true) {
    const a = A.find((x) => x.id === id);
    if (!a) return;
    state.artifact = id;
    nav("artifact", remember);
  }
  function openArticle(id, remember = true) {
    const d = D.find((x) => x.id === id);
    if (!d) return;
    state.topic = id;
    state.floor = d.floor;
    nav("article", remember);
  }
  function openMap(f, remember = true, topic = null) {
    state.floor = f;
    state.mapSelected = topic;
    nav("map", remember);
  }
  function renderPage() {
    switch (state.page) {
      case "floors":
        renderFloors();
        break;
      case "catalog":
        renderCatalog();
        break;
      case "artifact":
        renderArtifact();
        break;
      case "topics":
        renderTopics();
        break;
      case "article":
        renderArticle();
        break;
      case "map":
        renderMap();
        break;
      case "search":
        renderSearch();
        break;
      case "plan":
        renderPlan();
        break;
      case "guide":
        renderGuide();
        break;
      case "scan":
        renderSamples();
        break;
      case "info":
        $("ai-endpoint").value = sv("museum_ai_endpoint");
        break;
    }
  }
  function human(vi, en, ko, zh) {
    return { vi, en, ko: ko || en, zh: zh || en }[state.lang] || vi;
  }
  function imageBox(url, alt, small = false, caption = "") {
    url = window.MuseumMediaMap?.[url] || url;
    const record = A.find(a => (window.MuseumMediaMap?.[a.image] || a.image) === url);
    const credit =
      caption || record?.imageCredit || (record?.institutionName ? human("Ảnh: ", "Photo: ", "사진: ", "图片：") + record.institutionName : "") ||
      human(
        "Ảnh: Bảo tàng Đà Nẵng",
        "Photo: Da Nang Museum",
        "사진: 다낭 박물관",
        "图片：岘港博物馆",
      );
    return `<div class="photo-wrap${small ? " photo-small" : ""}"><img src="${esc(url)}" alt="${esc(alt)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><div class="photo-retry" hidden><span>${esc(human("Ảnh nguồn tạm thời không tải được", "Source image temporarily unavailable", "원본 사진을 불러올 수 없습니다", "暂时无法加载原图"))}</span></div>${small ? "" : `<span class="photo-credit">${esc(credit)}</span>`}</div>`;
  }

  let libraryController=null;
  function renderCatalog() {
    if(window.MuseumLibrary){libraryController ||= window.MuseumLibrary.createController({state,A,aname,asummary,ameta,openArtifact,esc});libraryController.render(artifactSearch($('catalog-input').value),{query:$('catalog-input').value,allItems:A});return;}

    const q = ($("catalog-input")?.value || "").trim();
    const items = artifactSearch(q).filter(
      (a) =>
        !state.catalogSite ||
        state.catalogSite === "all" ||
        (a.sourceSite || "site1") === state.catalogSite,
    );
    let filters = $("catalog-sites");
    if (!filters) {
      filters = document.createElement("div");
      filters.id = "catalog-sites";
      filters.className = "chiprow";
      $("catalog-input").closest(".text-input").after(filters);
    }
    filters.innerHTML = [
      ["all", human("Tất cả", "All", "전체", "全部")],
      ["site1", human("Cơ sở 1", "Site 1", "제1관", "第一馆")],
      ["site2", human("Cơ sở 2", "Site 2", "제2관", "第二馆")],
    ]
      .map(
        ([site, title]) =>
          `<button type="button" class="chip${(state.catalogSite || "all") === site ? " selected" : ""}" data-catalog-site="${site}" aria-pressed="${(state.catalogSite || "all") === site}">${esc(title)}</button>`,
      )
      .join("");
    $("catalog-count").textContent = human(
      `${items.length} hồ sơ hiện vật`,
      `${items.length} artifact records`,
      `${items.length}개 유물 기록`,
      `${items.length}件文物记录`,
    );
    $("catalog-list").innerHTML =
      items
        .map(
          (a) =>
            `<button class="artifact-listitem" data-artifact="${a.id}">${imageBox(a.image, aname(a), true)}<span><b>${esc(aname(a))}</b><small>${esc(ameta(a).era)} · ${esc(a.sourceSiteLabel || human("Cơ sở 1", "Site 1", "제1관", "第一馆"))}</small><em>${esc(asummary(a))}</em></span><span class="artifact-arrow">›</span></button>`,
        )
        .join("") || `<p class="muted">${esc(t("noResult"))}</p>`;
  }

  function renderArtifact() {
    const a = A.find((x) => x.id === state.artifact);
    if (!a) return;
    const m = ameta(a);
    $("artifact-title").textContent = aname(a);
    $("artifact-photo").innerHTML = imageBox(a.image, aname(a));
    $("artifact-id").textContent = (a.referenceOnly ? "REF-" : "DM-") + a.id.toUpperCase();
    $("artifact-text").textContent = asummary(a);
    let full = $("artifact-full-data");
    if (!full) {
      full = document.createElement("div");
      full.id = "artifact-full-data";
      full.className = "artifact-source-data";
      $("artifact-text").after(full);
    }
    full.innerHTML = a.imported
      ? `<p class="note">${esc(a.sourceSiteLabel)} · ${esc(a.sourceLanguage === "en" ? human("Hồ sơ gốc tiếng Anh", "Original source in English", "영어 원문 기록", "英语原始档案") : human("Hồ sơ gốc tiếng Việt", "Original source in Vietnamese; translations pending", "베트남어 원문 자료; 번역 준비 중", "越南语原始档案，译文待补充"))}</p><h2>${esc(human("Nguồn gốc", "Provenance", "유래", "来源"))}</h2><p>${esc(a.origin)}</p>${a.description ? `<h2>${esc(human("Nội dung hồ sơ", "Source description", "원문 설명", "档案正文"))}</h2><p>${esc(a.description)}</p>` : ""}`
      : "";
    $("artifact-map").hidden = !!a.referenceOnly;
    $("artifact-map").disabled = !!a.imported;
    $("artifact-map").title = a.imported
      ? human(
          "Nguồn chưa cung cấp tầng/vị trí hiện vật",
          "The source gives no verified floor or object position",
          "전시 층과 위치 미확인",
          "来源未核实展出楼层或位置",
        )
      : "";
    $("artifact-meta").innerHTML =
      `<div><b>${human("Niên đại", "Date", "연대", "年代")}</b><span>${esc(m.era)}</span></div><div><b>${human("Chất liệu", "Material", "재질", "材质")}</b><span>${esc(m.material)}</span></div><div><b>${a.referenceOnly ? human("Đơn vị nguồn", "Source institution", "출처 기관", "来源机构") : human("Chủ đề liên quan", "Related theme", "관련 주제", "相关主题")}</b><span>${esc(a.referenceOnly ? (a.institutionName || a.sourceSiteLabel) : nm(D.find((d) => d.id === a.topic)))}</span></div>`;
    if (a.dimensions)
      $("artifact-meta").innerHTML +=
        `<div><b>${human("Kích thước", "Dimensions", "크기", "尺寸")}</b><span>${esc(a.dimensions)}</span></div>`;
    let media=$('artifact-videos');if(!media){media=document.createElement('section');media.id='artifact-videos';$('artifact-full-data').after(media);}window.MuseumVideos?.render(media,a,state.lang);
    $("artifact-source").href = a.url;
    $("artifact-location").textContent = a.referenceOnly ? human(
      `Hồ sơ tham khảo từ ${a.institutionName || a.sourceSiteLabel}. Không phải hồ sơ xác nhận hiện vật thuộc hoặc đang trưng bày tại Bảo tàng Đà Nẵng.`,
      `Reference record from ${a.institutionName || a.sourceSiteLabel}. This does not establish ownership or display at Da Nang Museum.`,
      `${a.institutionName || a.sourceSiteLabel}의 참고 기록입니다. 다낭 박물관 소장 또는 전시 유물이라는 뜻이 아닙니다.`,
      `参考来源：${a.institutionName || a.sourceSiteLabel}。这不表示文物由岘港博物馆收藏或展出。`,
    ) : human(
      "Chủ đề liên quan không phải vị trí đặt hiện vật. Ảnh và dữ liệu có liên kết tới hồ sơ nguồn của bảo tàng.",
      "Related themes are not physical object locations. Images and data link to the original museum record.",
      "관련 주제는 실제 유물 위치가 아닙니다. 사진과 자료는 박물관 원문으로 연결됩니다.",
      "关联主题不代表实际展位。图片与资料链接至博物馆原始档案。",
    );
    $("artifact-qr").src = qrSrc(
      CANONICAL_BASE + "?artifact=" + encodeURIComponent(a.id),
    );
  }

  function markPosition(zone, silent = false, via = "manual") {
    let floor = 0,
      topic = "";
    if (/^floor-[123]$/.test(zone)) floor = Number(zone.slice(-1));
    else {
      const d = D.find((x) => x.id === zone);
      if (!d) return;
      floor = d.floor;
      topic = d.id;
    }
    state.currentZone = {
      floor,
      topic,
      via: via === "qr" ? "qr" : "manual",
      time: Date.now(),
    };
    persist("museum_zone_v4", JSON.stringify(state.currentZone));
    emit("position", { ...state.currentZone });
    if (!silent)
      toast(
        human(
          "Đã lưu mốc tham chiếu · " + label(floor),
          "Reference point saved · " + label(floor),
          "참조 지점 저장 · " + label(floor),
          "已保存参考点 · " + label(floor),
        ),
      );
  }

  function locationPanel() {
    const z = state.currentZone;
    const h = z
      ? z.topic
        ? nm(D.find((d) => d.id === z.topic))
        : label(z.floor)
      : human(
          "Chưa có mốc tham chiếu",
          "No reference point yet",
          "참조 지점 없음",
          "尚无参考点",
        );
    return `<div class="location-banner"><span class="loc-dot">●</span><div><b>${esc(human("Bạn đang ở đây · mốc mô phỏng", "You are here · demo marker", "현재 위치 · 예시 지점", "您在这里 · 模拟参考点"))}</b><p>${esc(h)} · ${esc(z?.via === "qr" ? human("QR check-in; không phải GPS", "QR check-in; not GPS", "QR 체크인; GPS 아님", "二维码签到，非GPS") : human("Chọn thủ công; không phải GPS", "Manual selection; not GPS", "수동 선택; GPS 아님", "手动选择，非GPS"))}</p></div><button data-set-floor-here="${state.floor}">${human("Tôi ở tầng này", "I am here", "이 층에 있어요", "我在本层")}</button></div>`;
  }

  function qrSrc(v) {
    if (typeof window.qrcode !== "function") return "";
    const qr = window.qrcode(0, "M");
    qr.addData(String(v), "Byte");
    qr.make();
    return (
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(
        qr.createSvgTag({ cellSize: 4, margin: 16, scalable: true }),
      )
    );
  }
  function renderFloors() {
    $("floor-list").innerHTML = [3, 2, 1]
      .map(
        (f) =>
          `<button class="listbutton" data-open-floor="${f}"><span class="num">${f.toString().padStart(2, "0")}</span><span class="body"><b>${esc(label(f))} · ${esc(FLOOR_NAMES[f][L[state.lang]])}</b><p>${esc(
            D.filter((x) => x.floor === f)
              .map((x) => nm(x))
              .slice(0, 3)
              .join(" · "),
          )}</p></span><span class="arrow">›</span></button>`,
      )
      .join("");
  }
  function renderTopics() {
    $("topic-eyebrow").textContent = label(state.floor);
    $("topic-floor-title").textContent =
      FLOOR_NAMES[state.floor][L[state.lang]];
    $("topic-list").innerHTML = D.filter((x) => x.floor === state.floor)
      .map(
        (d) =>
          `<button class="listbutton picture-topic" data-topic="${esc(d.id)}">${imageBox(GALLERY_IMAGES[d.id], nm(d), true)}<span class="body"><b>${esc(nm(d))}</b><p>${esc(ds(d))}</p></span><span class="arrow">›</span></button>`,
      )
      .join("");
  }
  function renderArticle() {
    const d = D.find((x) => x.id === state.topic);
    if (!d) return;
    $("article-floor").textContent = label(d.floor) + " · " + t("story");
    $("article-title").textContent = nm(d);
    $("article-summary").textContent = ds(d);
    $("article-facts").innerHTML =
      `<li>${esc(label(d.floor))} — ${esc(FLOOR_NAMES[d.floor][L[state.lang]])}</li><li>${esc(t("verifiedNote"))}</li>`;
    $("article-source").href = d.source;
    $("article-speak").textContent = t("listen");
    $("article-photo").innerHTML = imageBox(
      GALLERY_IMAGES[d.id],
      nm(d),
      false,
      human(
        "Ảnh khu trưng bày: Bảo tàng Đà Nẵng · ảnh toàn cảnh, không phải ảnh riêng hiện vật",
        "Gallery photograph: Da Nang Museum · overview, not an individual object",
      ),
    );
    const related = A.filter((a) => !a.referenceOnly && a.topic === d.id);
    $("article-related").innerHTML = related.length
      ? `<h3>${human("Hồ sơ hiện vật liên quan", "Related artifact records", "관련 유물 기록", "相关文物档案")}</h3>` +
        related
          .map(
            (a) =>
              `<button class="artifact-listitem" data-artifact="${a.id}">${imageBox(a.image, aname(a), true)}<span><b>${esc(aname(a))}</b><small>${esc(ameta(a).era)}</small></span><span>›</span></button>`,
          )
          .join("")
      : "";
    let media=$('article-videos');
    if(!media){media=document.createElement('section');media.id='article-videos';$('article-related').after(media);}
    window.MuseumVideos?.render(media,{name:nm(d),videos:window.MuseumTopicVideos?.[d.id]||[]},state.lang);
  }
  function makeFloorSVG() {
    const items = D.filter((x) => x.floor === state.floor);
    const active = state.currentZone?.topic;
    const rows = items.length <= 4 ? 2 : 3;
    const cols = Math.ceil(items.length / rows);
    const width = 340;
    let nodes = "";
    items.forEach((d, i) => {
      const col = i % cols,
        row = Math.floor(i / cols),
        w = 304 / cols - 8,
        h = 55,
        x = 22 + col * (304 / cols),
        y = 41 + row * 70;
      const selected = state.mapSelected === d.id;
      const here = active === d.id;
      nodes += `<g class="zone-node${selected ? " on" : ""}${here ? " is-here" : ""}" data-map-topic="${esc(d.id)}" tabindex="0" role="button" aria-label="${esc(nm(d))}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/><text x="${x + w / 2}" y="${y + 15}" text-anchor="middle">${i + 1}${here ? " ●" : ""}</text><foreignObject x="${x + 4}" y="${y + 21}" width="${w - 8}" height="30"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-zone-label">${esc(nm(d))}</div></foreignObject></g>`;
    });
    return `<rect x="6" y="8" width="328" height="235" rx="16" fill="#f5f4ef" stroke="#c6d1c5" stroke-width="1.5"/><text x="19" y="28" fill="#7b907e" font-size="10">${esc(human("Sơ đồ chủ đề · Mô phỏng", "Thematic diagram · Simulation", "주제 안내도 · 예시", "主题示意图 · 模拟"))}</text>${nodes}<rect x="143" y="245" width="54" height="9" rx="5" fill="#c6d7c7"/>`;
  }
  function renderMap() {
    $all("[data-floor]").forEach((x) =>
      x.classList.toggle("selected", Number(x.dataset.floor) === state.floor),
    );
    $("map-floor-title").textContent =
      label(state.floor) + " · " + FLOOR_NAMES[state.floor][L[state.lang]];
    const d = D.find(
      (x) => x.id === state.mapSelected && x.floor === state.floor,
    );
    const first = D.find((x) => x.floor === state.floor);
    if (!d) state.mapSelected = first?.id;
    $("floor-svg").innerHTML = makeFloorSVG();
    const show = d || first;
    if (show) {
      $("map-selected").innerHTML =
        `${imageBox(GALLERY_IMAGES[show.id], nm(show), true)}<div><b>${esc(nm(show))}</b><p>${esc(ds(show))}</p><div class="map-actions"><button id="map-open-topic">${esc(t("openTopic"))} ›</button><button data-set-here="${show.id}">${human("Tôi ở đây", "I am here", "여기에 있어요", "我在这里")}</button></div></div>`;
    } else $("map-selected").textContent = t("noResult");
    $("location-panel").innerHTML = locationPanel();
    $("map-zone-list").innerHTML = D.filter((x) => x.floor === state.floor)
      .map(
        (x, i) =>
          `<button class="zone-list-btn${state.currentZone?.topic === x.id ? " is-here" : ""}" data-map-topic="${x.id}"><span>${i + 1}</span><b>${esc(nm(x))}</b><small>›</small></button>`,
      )
      .join("");
  }
  function levens(a, b) {
    if (Math.abs(a.length - b.length) > 3) return 9;
    let old = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const row = [i];
      for (let j = 1; j <= b.length; j++)
        row.push(
          Math.min(
            row[j - 1] + 1,
            old[j] + 1,
            old[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
          ),
        );
      old = row;
    }
    return old[b.length];
  }
  function searchScore(d, q) {
    const needle = norm(q);
    if (!needle) return 1;
    const terms = [
      ...d.names,
      ...d.descs,
      d.keywords,
      label(d.floor),
      "tang " + d.floor,
      "floor " + d.floor,
    ];
    const name = norm(nm(d));
    if (name === needle) return 100;
    if (name.startsWith(needle)) return 80;
    const hay = norm(terms.join(" "));
    if (hay.includes(needle)) return 54;
    const words = hay.split(" "),
      queryWords = needle.split(" ");
    const hits = queryWords.map((word) => {
      if (words.some((w) => w.startsWith(word))) return 12;
      if (
        word.length >= 3 &&
        words.some(
          (w) =>
            Math.abs(w.length - word.length) <= 2 &&
            levens(w, word) <= Math.min(2, Math.floor(word.length / 3)),
        )
      )
        return 7;
      return 0;
    });
    return hits.some((x) => x === 0) ? 0 : hits.reduce((a, b) => a + b, 0);
  }
  function getSearch(q) {
    return D.map((d) => ({ d, score: searchScore(d, q) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((x) => x.d);
  }
  function renderSearch() {
    const inp = $("search-input");
    const q = inp.value.trim();
    const interests = ["co-vat", "dan-toc", "lich-su-do-thi", "den-co"];
    $("search-quick").innerHTML = interests
      .map((id) => {
        const d = D.find((x) => x.id === id);
        return `<button class="chip" data-search-id="${id}">${esc(nm(d))}</button>`;
      })
      .join("");
    const res = getSearch(q);
    $("search-results").innerHTML = q
      ? '<div class="muted">' +
        esc(res.length ? t("popular") + " · " + res.length : t("noResult")) +
        "</div>"
      : '<div class="muted">' + esc(t("popular")) + "</div>";
    $("search-results").innerHTML += res
      .map(
        (d) =>
          `<button class="suggestion" data-topic="${esc(d.id)}"><span class="sicon">${d.icon}</span><span><strong>${esc(nm(d))}</strong><small>${esc(label(d.floor))} · ${esc(ds(d).slice(0, 95))}</small></span></button>`,
      )
      .join("");
    $("search-results").innerHTML += '<div id="search-artifacts"></div>';
    renderSearchArtifacts();
  }
  function artifactScore(a, q) {
    const needle = norm(q);
    if (!needle) return 1;
    const d = adata(a),
      names = (d?.names || [a.name, a.en]).map(norm);
    if (names.includes(needle)) return 120;
    if (names.some((x) => x.startsWith(needle))) return 95;
    const nameWords = names.join(" ").split(" ");
    const queries = needle.split(" ");
    const nameHits = queries.map((w) =>
      nameWords.some((x) => x.startsWith(w))
        ? 15
        : w.length >= 4 && nameWords.some((x) => levens(x, w) <= 1)
          ? 10
          : 0,
    );
    if (nameHits.every(Boolean))
      return 65 + nameHits.reduce((a, b) => a + b, 0);
    const hay = norm(
      [
        ...(d?.summaries || [a.summary, a.enSummary]),
        ...(d?.materials || [a.material]),
        a.origin || "",
        a.description || "",
        a.sourceSiteLabel || "",
        ...(d?.eras || [a.era]),
      ].join(" "),
    );
    return hay.includes(needle) ? 40 : 0;
  }
  function artifactSearch(q) {
    return A.map((a) => ({ a, score: artifactScore(a, q) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.a);
  }
  function renderSearchArtifacts() {
    const q = $("search-input").value;
    const data = q.trim() ? artifactSearch(q) : [];
    $("search-artifacts").innerHTML = data.length
      ? `<div class="muted">${human("HỒ SƠ HIỆN VẬT", "ARTIFACT RECORDS", "유물 기록", "文物档案")}</div>` +
        data
          .map(
            (a) =>
              `<button class="artifact-listitem" data-artifact="${a.id}">${imageBox(a.image, aname(a), true)}<span><b>${esc(aname(a))}</b><small>${esc(ameta(a).era)}</small></span><span>›</span></button>`,
          )
          .join("")
      : "";
  }

  function renderPlan() {
    $("plan-time")
      .querySelectorAll("[data-custom-time]")
      .forEach((b) => b.remove());
    if (![15, 30, 60].includes(state.time)) {
      const b = document.createElement("button");
      b.className = "chip";
      b.dataset.min = String(state.time);
      b.dataset.customTime = "true";
      b.textContent = state.time + "′";
      $("plan-time").appendChild(b);
    }
    let walk = $("plan-walking");
    if (!walk) {
      walk = document.createElement("div");
      walk.id = "plan-walking";
      walk.className = "plan-walking";
      $("plan-pace").after(walk);
    }
    const low = !!guideContext.preferences?.lowWalking;
    walk.innerHTML = `<button type="button" class="chip${low ? " selected" : ""}" data-low-walking aria-pressed="${low}">${esc(human("Ít đổi tầng", "Stay on one floor", "한 층 위주", "尽量不换楼层"))}</button><p class="muted">${esc(human("Chỉ giảm số chủ đề và số tầng; chưa có dữ liệu đo đường đi.", "Reduces themes and floor changes, not a measured walking distance.", "주제와 층 이동 수를 줄이며 실제 도보 거리는 측정되지 않았습니다.", "仅减少主题和换楼层次数，不代表实测步行距离。"))}</p>`;

    $all("[data-min]").forEach((x) =>
      x.classList.toggle("selected", Number(x.dataset.min) === state.time),
    );
    $("plan-interests").innerHTML = [
      "history",
      "culture",
      "antique",
      "family",
      "modern",
    ]
      .map(
        (k) =>
          `<button class="chip${state.interests.has(k) ? " selected" : ""}" data-interest="${k}">${esc(t(k))}</button>`,
      )
      .join("");
    $("plan-pace").innerHTML = ["relaxed", "focused"]
      .map(
        (k) =>
          `<button class="chip${state.pace === k ? " selected" : ""}" data-pace="${k}">${esc(t(k))}</button>`,
      )
      .join("");
    if (state.route) renderRoute();
  }
  function buildRoute() {
    if (!state.interests.size) {
      toast(t("routeNo"));
      return;
    }
    const base = state.time <= 20 ? 2 : state.time <= 45 ? 4 : 7;
    const preferences = guideContext.preferences || {};
    const sameFloor = preferences.lowWalking
      ? preferences.floor ||
        state.currentZone?.floor ||
        (state.interests.has("history")
          ? 3
          : state.interests.has("culture")
            ? 2
            : 1)
      : null;

    const n = state.pace === "focused" ? Math.max(1, base - 1) : base;
    const interests = [...state.interests];
    const scored = D.filter(
      (d) =>
        (!sameFloor || d.floor === sameFloor) &&
        !d.tags.some((t) => preferences.excluded?.includes(t)),
    )
      .map((d, i) => ({
        d,
        score:
          d.tags.reduce((s, k) => s + (interests.includes(k) ? 13 : 0), 0) +
          (d.floor === 3 ? 1 : 0) -
          i * 0.02,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, sameFloor ? Math.min(2, n) : n)
      .map((x) => x.d);
    if (!scored.length) {
      toast(
        human(
          "Chưa có chủ đề phù hợp với lựa chọn này. Hãy đổi sở thích hoặc tầng.",
          "No theme matches these choices. Change the interest or floor.",
          "조건에 맞는 주제가 없습니다. 관심사나 층을 바꿔 주세요.",
          "没有符合条件的主题，请更换兴趣或楼层。",
        ),
      );
      return;
    }
    const stops = scored.sort(
      (a, b) => b.floor - a.floor || D.indexOf(a) - D.indexOf(b),
    );
    state.route = {
      ids: stops.map((x) => x.id),
      done: [],
      time: state.time,
      pace: state.pace,
      interests,
      sameFloor,
    };
    saveRoute();
    renderRoute();
    $("plan-result").scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  function saveRoute() {
    state.routeStored = persist("museum_route", JSON.stringify(state.route));
    emit("route", { route: state.route });
  }
  function restoreRoute() {
    try {
      const r = JSON.parse(sv("museum_route", "null"));
      if (
        !r ||
        !Array.isArray(r.ids) ||
        !r.ids.length ||
        r.ids.length > D.length ||
        !r.ids.every((id) => D.some((x) => x.id === id)) ||
        !Array.isArray(r.done) ||
        !Number.isFinite(r.time) ||
        r.time < 1 ||
        r.time > 180 ||
        !["relaxed", "focused"].includes(r.pace) ||
        !Array.isArray(r.interests) ||
        !r.interests.every((k) =>
          ["history", "culture", "antique", "family", "modern"].includes(k),
        )
      )
        return;
      state.route = {
        ids: [...new Set(r.ids)],
        done: [...new Set(r.done.filter((id) => r.ids.includes(id)))],
        time: r.time,
        pace: r.pace,
        interests: r.interests,
        sameFloor: [1, 2, 3].includes(r.sameFloor) ? r.sameFloor : null,
      };
    } catch {}
  }

  function renderRoute() {
    const el = $("plan-result");
    if (!state.route) {
      el.classList.add("hidden");
      return;
    }
    el.classList.remove("hidden");
    const r = state.route;
    const pct = Math.round((100 * r.done.length) / Math.max(1, r.ids.length));
    el.innerHTML = `<div class="sectionline"><b style="font-size:13px">${esc(t("planReady"))}</b><small>${r.time}' · ${esc(t("routeProgress"))} ${pct}%</small></div><div class="route-progress"><span style="width:${pct}%"></span></div>${r.sameFloor ? `<p class="note">${esc(human("Các chủ đề cùng một tầng; không phải đường đi ngắn nhất đã đo.", "Themes on a single floor; not a measured shortest path.", "한 층의 주제이며 실측 최단 경로가 아닙니다.", "同一楼层的主题，并非实测最短路线。"))}</p>` : ""}${r.ids
      .map((id, i) => {
        const d = D.find((x) => x.id === id);
        const done = r.done.includes(id);
        return `<div class="route-stop${done ? " done" : ""}"><span class="step-num">${done ? "✓" : i + 1}</span><div class="step-body"><b data-route-open="${id}" role="button" tabindex="0" style="cursor:pointer">${esc(nm(d))}</b><small>${esc(label(d.floor))} · ~${Math.max(3, Math.floor(r.time / r.ids.length))}′</small></div><button data-route-done="${id}">${esc(done ? t("routeDone") : t("routeMark"))}</button></div>`;
      })
      .join(
        "",
      )}<p class="muted">${esc(state.routeStored === false ? human("Chỉ lưu trong phiên này: trình duyệt đã chặn bộ nhớ", "Session only: browser storage is blocked", "브라우저 저장소가 차단되어 현재 세션에만 저장됩니다", "浏览器存储已禁用，仅在本次会话保存") : t("routeSave"))} · ${esc(t("clickStop"))}</p>`;
  }
  /* Museum Companion V5: conversational, source-grounded local assistant.
   Not a generative AI model. An optional HTTPS backend can be connected separately. */
  const companion = window.MuseumConversation?.createResponder();
  const guideContext = {
    artifact: null,
    topic: null,
    floor: null,
    turns: [],
    lastMood: "😊",
  };
  const CHAT_UI = {
    vi: {
      welcome:
        "Mây đây ☁️ Một chuyện hôm nay, một câu hỏi về hiện vật, hay một ý tưởng hơi kỳ cục — bạn muốn bắt đầu từ đâu?",
      offline:
        "🧠 Mây đang dùng dữ liệu bảo tàng có nguồn. Hỏi tiếp được nhé! AI tạo sinh cần kết nối máy chủ riêng.",
      online: "✨ AI nâng cao đã kết nối máy chủ",
      source: "Nguồn",
      help: "Mình chưa tìm được thông tin đáng tin cậy cho câu đó 🤔. Bạn thử hỏi tên một hiện vật, tầng trưng bày, giá vé hoặc lộ trình nhé.",
      like: "Cảm ơn bạn! Đã ghi nhận đánh giá cho phản hồi này 😊",
      dislike:
        "Mình ghi nhận góp ý. Bạn có thể thử câu hỏi khác hoặc mở nguồn chính thức nhé 🙏",
      prompt: [
        "Tôi thích lịch sử, có 30 phút",
        "Súng thần công có từ khi nào?",
        "Tôi đang ở đâu?",
        "Tầng 2 có gì?",
      ],
      photo: "📚 Mở hồ sơ",
      where: "🧭 Xem tầng",
      route: "✨ Tạo lộ trình",
      more: "📚 Đọc chi tiết",
      hear: "🔊 Nghe",
      copy: "Sao chép",
      good: "Hữu ích",
      bad: "Chưa đúng",
    },
    en: {
      welcome:
        "Hi, I’m Mây ☁️ A museum question, a story about your day, or a wonderfully odd idea — where shall we start?",
      offline:
        "🧠 Mây uses curated museum records. A separate AI server is needed for generative chat.",
      online: "✨ Advanced AI server connected",
      source: "Source",
      help: "I do not have a verified answer yet 🤔. Try an artifact name, an exhibition floor or a short itinerary.",
      like: "Thank you! 😊",
      dislike:
        "Thanks for the feedback. You can check the official museum source 🙏",
      prompt: [
        "30 minutes of history",
        "Tell me about the cannon",
        "Where am I?",
        "What is on floor 2?",
      ],
      photo: "📚 Open record",
      where: "🧭 View floor",
      route: "✨ Plan a route",
      more: "📚 Read more",
      hear: "🔊 Listen",
      copy: "Copy",
      good: "Helpful",
      bad: "Needs work",
    },
    ko: {
      welcome:
        "마이예요 ☁️ 유물에 대한 질문, 오늘의 이야기, 엉뚱한 상상 중 어디서 시작할까요?",
      offline:
        "🧠 검증된 박물관 자료를 바탕으로 답합니다. 생성형 AI는 별도 서버가 필요합니다.",
      online: "✨ AI 서버 연결됨",
      source: "출처",
      help: "정확하게 확인된 자료가 없습니다 🤔. 유물 이름이나 층별 전시를 물어보세요.",
      like: "감사합니다! 😊",
      dislike: "의견 감사합니다 🙏",
      prompt: [
        "3층에는 무엇이 있나요?",
        "대포에 대해 알려줘",
        "30분 코스",
        "어디에 있나요?",
      ],
      photo: "📚 기록 보기",
      where: "🧭 층별 안내",
      route: "✨ 관람 코스",
      more: "📚 자세히",
      hear: "🔊 듣기",
      copy: "복사",
      good: "좋아요",
      bad: "아쉬워요",
    },
    zh: {
      welcome:
        "我是小云 ☁️ 文物问题、今天的心事，或一个古怪又有趣的想法——想先聊哪个？",
      offline: "🧠 我根据有来源的博物馆资料回答。生成式 AI 需要独立服务器。",
      online: "✨ 高级 AI 已连接",
      source: "资料来源",
      help: "目前没有足够可靠的资料回答 🤔。可以尝试询问文物名称、楼层或参观路线。",
      like: "谢谢！😊",
      dislike: "感谢反馈 🙏",
      prompt: ["三楼有什么？", "介绍古炮", "30分钟路线", "我在哪里？"],
      photo: "📚 打开档案",
      where: "🧭 楼层地图",
      route: "✨ 规划路线",
      more: "📚 详细介绍",
      hear: "🔊 收听",
      copy: "复制",
      good: "有用",
      bad: "待改进",
    },
  };
  function cu(k) {
    return (CHAT_UI[state.lang] || CHAT_UI.vi)[k];
  }
  let chatFollowsTail = true;
  function scrollChat(force = false) {
    const list = $("messages");
    if (force || chatFollowsTail) list.scrollTop = list.scrollHeight;
  }
  $("messages").addEventListener("scroll", () => {
    const list = $("messages");
    chatFollowsTail =
      list.scrollHeight - list.clientHeight - list.scrollTop < 70;
  });
  const ROBOT_COPY = {
    vi: [
      "Mây · Bạn đồng hành",
      "Khám phá hiện vật, trò chuyện đời thường và cùng bạn nghĩ những điều vui.",
      "☁️ Có chuyện gì, kể Mây nghe.",
    ],
    en: [
      "Mây · Your companion",
      "Explore artifacts, talk about your day and share a little imagination.",
      "☁️ A little curiosity, a little company.",
    ],
    ko: [
      "Mây AI · 박물관 로봇",
      "유물을 알아보고 전시장을 찾으며 관람 코스를 계획하세요.",
      "🤖 나만의 디지털 안내원",
    ],
    zh: [
      "Mây AI · 博物馆机器人",
      "探索文物、了解主题并规划专属参观路线。",
      "🤖 您的数字导览助手",
    ],
  };
  function renderGuide() {
    if (!$("messages").children.length) resetGuide();
    $("guide-status").textContent =
      state.guideMode === "generative"
        ? human(
            "AI tạo sinh · máy chủ đã phản hồi",
            "Generative AI · server responded",
            "생성형 AI · 서버 응답 확인",
            "生成式AI · 服务器已响应",
          )
        : modeLabel();
    const robotCopy = ROBOT_COPY[state.lang] || ROBOT_COPY.vi;
    ["robot-label", "robot-description", "robot-tagline"].forEach(
      (id, i) => ($(id).textContent = robotCopy[i]),
    );
    let topics = $("chat-topics");
    if (!topics) {
      topics = document.createElement("div"); topics.id = "chat-topics"; topics.className = "chat-topics";
      topics.setAttribute("role", "group"); $("guide-status").after(topics);
      topics.addEventListener("click", e => { const button=e.target.closest('[data-chat-topic]'); if(button){state.chatTopic=button.dataset.chatTopic;renderGuide();} });
    }
    topics.setAttribute("aria-label",human("Gợi ý trò chuyện", "Conversation ideas", "대화 주제", "聊天主题"));
    const labels = {museum:human("Khám phá", "Explore", "탐방", "探索"),life:human("Chuyện thường ngày", "Everyday life", "일상", "聊日常"),playful:human("Chút vui", "A little fun", "재미", "来点乐趣")};
    const focusedTopic=document.activeElement?.dataset.chatTopic;
    topics.innerHTML=Object.entries(labels).map(([key,value])=>`<button type="button" data-chat-topic="${key}" aria-pressed="${(state.chatTopic||'museum')===key}">${value}</button>`).join('');
    if(focusedTopic)topics.querySelector(`[data-chat-topic="${focusedTopic}"]`)?.focus({preventScroll:true});
    const suggestions = state.chatTopic === 'life' ? {
      vi:["Hôm nay tôi hơi mệt", "Tối nay ăn gì?", "Cho tôi chút động lực"],
      en:["I'm tired today", "What should I eat?", "I need motivation"],
      ko:["오늘 피곤해요", "오늘 슬퍼요", "오늘 기뻐요"],
      zh:["今天好累", "今天吃什么", "我有点难过"],
    }[state.lang] : state.chatTopic === 'playful' ? {
      vi:["Kể chuyện hài đi", "Nếu mèo làm giám đốc?", "Nếu hiện vật biết nói?"],
      en:["Tell me a joke", "What if cats ran a museum?", "Tell me another joke"],
      ko:["농담 해줘", "유물이 말한다면? 상상해줘", "오늘 재미있는 이야기"],
      zh:["讲个笑话", "如果文物会说话？", "再讲个笑话"],
    }[state.lang] : cu("prompt");
    $("guide-chips").innerHTML = suggestions
      .map((q) => `<button data-chat-question="${esc(q)}">${esc(q)}</button>`)
      .join("");
    renderReplyPreferences();
  }
  function renderReplyPreferences() {
    let bar=$("chat-preferences");
    if(!bar){
      bar=document.createElement('div');bar.id='chat-preferences';bar.className='chat-preferences';
      bar.innerHTML='<div class="reply-options"><button id="chat-depth" type="button" role="switch" aria-describedby="chat-depth-note"></button><label class="reply-speed"><span id="chat-speed-label"></span><select id="chat-speed"></select></label></div><p id="chat-depth-note"></p>';
      $('chat-form').before(bar);
      $('chat-depth').addEventListener('click',()=>{state.replyDepth=state.replyDepth==='deep'?'standard':'deep';persist('museum_reply_depth',state.replyDepth);renderReplyPreferences();});
      $('chat-speed').addEventListener('change',()=>{state.revealSpeed=$('chat-speed').value;persist('museum_reveal_speed',state.revealSpeed);window.MuseumChatText.setSpeed(state.revealSpeed);});
    }
    const deep=state.replyDepth==='deep';
    $('chat-depth').textContent=(deep?'✦ ':'◇ ')+human('Suy nghĩ kỹ','Think carefully','자세히 생각','仔细思考');
    $('chat-depth').setAttribute('aria-checked',String(deep));
    $('chat-depth').disabled=$('messages').getAttribute('aria-busy')==='true';
    $('chat-speed-label').textContent=human('Chữ','Text','글자','文字');
    $('chat-speed').setAttribute('aria-label',human('Tốc độ hiện chữ','Text reveal speed','글자 표시 속도','文字显示速度'));
    const speeds={slow:human('Chậm','Slow','천천히','慢速'),normal:human('Vừa','Normal','보통','正常'),instant:human('Hiện ngay','Instant','즉시','立即显示'),auto:human('Theo thiết bị','Device setting','기기 설정','设备设置')};
    $('chat-speed').replaceChildren(...Object.entries(speeds).map(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;return option;}));
    $('chat-speed').value=state.revealSpeed;
    $('chat-depth-note').textContent=deep&&state.guideMode==='generative'?human('AI máy chủ · yêu cầu trả lời kỹ.','AI server · detailed response requested.','AI 서버 · 자세한 답변 요청.','AI服务器 · 已请求详细回答。'):deep?human('Phân tích mục tiêu và điều kiện trên thiết bị.','Goal and constraint analysis on this device.','기기에서 목표와 조건을 분석합니다.','在本设备分析目标与条件。'):human('Trả lời gọn, tập trung vào bước tiếp theo.','A concise answer focused on the next step.','다음 단계에 집중한 간단한 답변.','简洁回答，侧重下一步。');
    $('chat-depth').title=human('Phân tích tại thiết bị; suy luận bằng mô hình cần máy chủ AI được cấu hình.','Local analysis; model reasoning requires a configured AI server.','로컬 분석입니다. AI 추론에는 서버 설정이 필요합니다.','本地分析；模型推理需要已配置的AI服务器。');
  }
  function addBubble(
    text,
    you = false,
    extra = "",
    mood = "😊",
    src = "",
    options = {},
  ) {
    const list = $("messages");
    let box = document.createElement("div");
    box.className = "bubble" + (you ? " you" : "");
    box.textContent = text;
    if (you) {
      list.appendChild(box);
      chatFollowsTail = true;
      scrollChat(true);
      return box;
    }
    const row = document.createElement("div");
    row.className = "assistant-row";
    const avatar = document.createElement("div");
    avatar.className = "assistant-avatar";
    avatar.title = "Mây · " + mood;
    avatar.innerHTML =
      '<img src="ai-robot.webp" alt="Mây AI"><span class="assistant-badge">' +
      mood +
      "</span>";
    const stack = document.createElement("div");
    stack.className = "assistant-stack";
    stack.appendChild(box);
    row.append(avatar, stack);
    let note = null;
    if (extra || src || options.sources?.length) {
      note = document.createElement("div");
      note.className = "assistant-source";
      const sources = options.sources?.length
        ? options.sources
        : [{ url: src, label: cu("source") }];
      for (const entry of sources.filter((e) => e.url)) {
        const link = document.createElement("a");
        link.href = entry.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = (entry.label || cu("source")) + " ↗";
        note.appendChild(link);
      }
      if (extra) {
        const span = document.createElement("span");
        span.textContent = extra;
        note.appendChild(span);
      }
      stack.appendChild(note);
    }
    const controls = document.createElement("div");
    controls.className = "assistant-tools";
    for (const [name, icon, title] of [
      ["listen", "🔊", cu("hear")],
      ["copy", "⧉", cu("copy")],
      ["up", "👍", cu("good")],
      ["down", "👎", cu("bad")],
    ]) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = icon;
      b.title = title;
      b.setAttribute("aria-label", title);
      b.onclick = async () => {
        if (name === "listen") {
          speakChat(text);
          return;
        }
        if (name === "copy") {
          try {
            await navigator.clipboard.writeText(text);
            toast("✓ " + cu("copy"));
          } catch (e) {
            toast(
              human(
                "Không thể sao chép tự động. Bạn có thể chọn đoạn trả lời và sao chép.",
                "Automatic copy unavailable. Select the reply text to copy it.",
                "자동 복사가 불가능합니다. 답변 텍스트를 선택해 복사하세요.",
                "无法自动复制，请选中回复文字进行复制。",
              ),
            );
          }
          return;
        }
        if (name === "up" || name === "down") {
          controls
            .querySelectorAll("button")
            .forEach((x) => x.classList.remove("reacted"));
          b.classList.add("reacted");
          controls.querySelectorAll("button").forEach((x) => {
            if (["👍", "👎"].includes(x.textContent))
              x.setAttribute("aria-pressed", String(x === b));
          });
          toast(name === "up" ? cu("like") : cu("dislike"));
          guideContext.lastFeedback = name;
          persist("museum_chat_feedback", name);
        }
      };
      controls.appendChild(b);
    }
    const skip = document.createElement("button");
    skip.type = "button";
    skip.className = "chat-reveal-all";
    skip.textContent = human(
      "Hiện ngay",
      "Show full reply",
      "전체 답변 보기",
      "立即显示",
    );
    skip.hidden = !options.animate;
    skip.onclick = () => box.reveal?.finish();
    const accessible = document.createElement("span");
    accessible.className = "sr-only";
    box.setAttribute("aria-hidden", "true");
    stack.append(skip, controls, accessible);
    list.appendChild(row);
    if (options.animate) {
      controls.hidden = true;
      if (note) note.hidden = true;
    }
    box.reveal = window.MuseumChatText.reveal(box, text, {
      animate: !!options.animate,
      speed: state.revealSpeed,
      onProgress: () => scrollChat(),
      onFinish: () => {
        skip.hidden = true;
        controls.hidden = false;
        if (note) note.hidden = false;
        accessible.textContent = text;
      },
    });
    scrollChat();
    return box;
  }

  function speakChat(txt) {
    if (!("speechSynthesis" in window)) {
      toast(t("voiceUnsupported"));
      return;
    }
    try {
      speechSynthesis.cancel();
      const s = new SpeechSynthesisUtterance(String(txt).slice(0, 2000));
      s.lang = speechLang();
      s.rate = 0.94;
      speechSynthesis.speak(s);
    } catch (e) {
      toast(t("voiceUnsupported"));
    }
  }
  function resetGuide() {
    companion?.reset();
    guideContext.requestPlan=null;
    guideContext.artifact = null;
    guideContext.topic = null;
    guideContext.floor = null;
    guideContext.turns = [];
    guideContext.preferences = {};
    guideContext.recommended = [];
    guideContext.activeIntent = null;
    $("messages").replaceChildren();
    addBubble(cu("welcome"), false, "", "🤖");
  }
  function levenshtein1(a, b) {
    if (a === b) return 0;
    if (Math.abs(a.length - b.length) > 2) return 3;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let row = [i];
      for (let j = 1; j <= b.length; j++)
        row.push(
          Math.min(
            row[j - 1] + 1,
            prev[j] + 1,
            prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
          ),
        );
      prev = row;
    }
    return prev[b.length];
  }
  function semanticHit(query, phrase) {
    const a = norm(query),
      b = norm(phrase);
    if (!a || !b) return 0;
    if (a.includes(b)) return 26 + Math.min(10, b.length / 3);
    const aw = a.split(" ").filter((x) => x.length >= 3),
      bw = b.split(" ").filter((x) => x.length >= 3);
    const hits = bw.filter(
      (w) =>
        aw.includes(w) ||
        aw.some((x) => x.length > 3 && w.length > 3 && levenshtein1(x, w) <= 1),
    ).length;
    const stop = new Set([
      "tang",
      "floor",
      "museum",
      "bao",
      "tang",
      "lich",
      "su",
      "van",
      "hoa",
      "the",
      "tell",
      "about",
      "cua",
      "nay",
      "o",
      "dau",
      "what",
      "where",
      "hien",
      "vat",
      "gioi",
      "thieu",
      "cho",
      "toi",
      "cai",
      "trong",
    ]);
    const informative = bw.filter((w) => !stop.has(w));
    const clear = informative.filter(
      (w) =>
        aw.includes(w) ||
        aw.some((x) => x.length > 3 && w.length > 3 && levenshtein1(x, w) <= 1),
    ).length;
    return hits >= 2 && clear >= 1
      ? 7 + hits * 3 + clear * 3
      : clear >= 1 && informative.length === 1 && informative[0].length >= 5
        ? 8 + clear * 3
        : 0;
  }
  function findMuseumEntity(q) {
    const records = [
      ...A.map((a) => ({
        id: a.id,
        type: "artifact",
        names: adata(a)?.names || [a.name, a.en],
        item: a,
      })),
      ...D.map((d) => ({ ...d, type: "topic", item: d })),
    ];
    const match = window.MuseumGuideEngine.entities(q, records)[0];
    return match
      ? {
          type: match.record.type,
          item: match.record.item,
          id: match.record.id,
        }
      : null;
  }
  function answerLanguage(vi, en, ko, zh) {
    return human(vi, en, ko, zh);
  }
  function shortName(d) {
    return nm(d);
  }
  function safeCurrentZone() {
    const z = state.currentZone;
    if (!z) return null;
    if (typeof z === "string") return z;
    return z.topic || z.zone || z.id || (z.floor ? "floor-" + z.floor : null);
  }
  function locationText() {
    const z = state.currentZone;
    if (!z)
      return human(
        "Chưa có mốc tham chiếu. Hãy quét QR demo hoặc tự chọn một tầng. Ứng dụng không định vị GPS trong nhà.",
        "No reference point yet. Scan a demo QR or select a floor. This app does not use indoor GPS.",
        "참조 지점이 없습니다. 예시 QR을 스캔하거나 층을 선택하세요. 실내 GPS를 사용하지 않습니다.",
        "尚无参考点。请扫描演示二维码或选择楼层。本应用不使用室内GPS。",
      );
    guideContext.floor = z.floor;
    const title = z.topic
      ? nm(D.find((d) => d.id === z.topic))
      : label(z.floor);
    return human(
      "Mốc gần nhất: " +
        title +
        ". " +
        (z.via === "qr" ? "QR check-in" : "Bạn chọn thủ công") +
        ". Đây là mốc mô phỏng theo chủ đề, không xác nhận vị trí hiện vật thật.",
      "Latest point: " +
        title +
        ". " +
        (z.via === "qr" ? "QR check-in" : "Manually selected") +
        ". This is a thematic demo marker, not a verified physical exhibit location.",
      "최근 지점: " +
        title +
        ". " +
        (z.via === "qr" ? "QR 체크인" : "수동 선택") +
        ". 실제 유물 위치가 아닌 주제별 예시 지점입니다.",
      "最近参考点：" +
        title +
        "。" +
        (z.via === "qr" ? "二维码签到" : "手动选择") +
        "。这是主题模拟点，并非已核实的实际展位。",
    );
  }
  function artifactMeta(a) {
    return ameta(a);
  }
  function answerForArtifact(a, intent) {
    const d=D.find(x=>x.id===a.topic);
    const hasThematicFloor=!a.imported&&!a.referenceOnly&&!!d;
    guideContext.artifact=a.id;guideContext.topic=hasThematicFloor?a.topic:null;guideContext.floor=hasThematicFloor?d.floor:null;
    const name=aname(a),desc=asummary(a),meta=ameta(a);
    const institution=a.institutionName||a.sourceSiteLabel||human('Nguồn tham khảo ngoài Đà Nẵng','External reference institution','외부 참고 기관','岘港以外参考机构');
    const prefix=a.referenceOnly?human('Tham khảo ngoài Đà Nẵng · ','Reference outside Da Nang · ','다낭 외부 참고 자료 · ','岘港以外参考资料 · ')+institution+'\n':'';
    const field={when:'era',where:'location',more:'summary',photo:'photo'}[intent]||intent;
    const fields=a.sourceFields&&typeof a.sourceFields==='object'?a.sourceFields:{};
    const exactField=(...keys)=>{for(const key of keys){const value=fields[key];if(typeof value==='string'&&value.trim())return value.trim()}return ''};
    const unknown=label=>human('Chưa có dữ liệu có nguồn về '+label+' trong hồ sơ này. Mây không suy đoán; bạn có thể mở hồ sơ nguồn để đối chiếu.','This record has no sourced '+label+'. I will not guess; consult the original source.','이 기록에 출처가 있는 '+label+' 정보가 없습니다. 추측하지 않고 원문 확인을 권합니다.','本档案缺少有来源的'+label+'资料。我不会猜测，请查看原始来源。');
    let text=name+'\n'+desc;
    if(field==='era')text=name+' · '+human('Niên đại: ','Date: ','연대: ','年代：')+meta.era+'\n'+desc;
    else if(field==='material')text=name+' · '+human('Chất liệu: ','Material: ','재질: ','材质：')+(adata(a)?.flags?.materialUnverified?human('Chưa xác minh. Hồ sơ kế thừa chỉ ghi loại vật dụng sinh hoạt.','Unverified. The inherited record lists a household-object category only.','미확인. 기존 기록에는 생활용품 분류만 있습니다.','尚未核实。原记录仅标注生活用品类别。'):meta.material)+'\n'+desc;
    else if(['weight','dimensions','origin'].includes(field)){
      const label=field==='weight'?human('trọng lượng','weight','무게','重量'):field==='dimensions'?human('kích thước','dimensions','크기','尺寸'):human('nguồn gốc','provenance','출처·발견 경위','来源');
      const value=field==='weight'?(typeof a.weight==='string'?a.weight:exactField('trọng lượng','khối lượng')):field==='dimensions'?(a.dimensions||exactField('kích thước','kích thước (cm)')):(a.origin||exactField('nguồn gốc','xuất xứ'));
      const known=typeof value==='string'&&value.trim()&&!/^(?:chưa|không có|không nêu|chưa xác minh|unknown|unverified)/i.test(value.trim());
      text=name+'\n'+(known?label+': '+value:unknown(label));
    }else if(field==='location'){
      text=name+'\n'+(a.referenceOnly?institution+'\n':'')+(hasThematicFloor?human('Chủ đề tham chiếu: ','Related theme: ','관련 주제: ','相关主题：')+nm(d)+' · '+label(d.floor)+'\n':'')+human('Hồ sơ chưa xác nhận tầng, phòng hoặc tủ trưng bày thực tế. Sơ đồ chủ đề cơ sở 1 không xác định vị trí của hiện vật này.','The record does not verify a physical floor, room or case. The Site 1 thematic diagram does not locate this object.','실제 층, 전시실 또는 진열장 위치가 확인되지 않았습니다. 제1관 주제 안내도로 이 유물의 실제 위치를 알 수 없습니다.','档案未核实实际楼层、展厅或展柜。第一馆主题示意图不能确定本件文物的实际位置。');
    }else if(field==='photo')text=name+'\n'+human('Mây gửi ảnh hiện vật bên dưới. Mở hồ sơ để xem ảnh lớn, niên đại và thông tin nguồn.','Here is the artifact photo. Open its record for a larger image, date and source information.','아래 유물 사진을 확인하세요. 기록을 열면 큰 사진, 연대와 출처를 볼 수 있습니다.','下方是文物照片。打开档案可查看大图、年代与来源资料。');
    else text+='\n\n'+human('Niên đại: ','Date: ','연대: ','年代：')+meta.era+' · '+human('Chất liệu: ','Material: ','재질: ','材质：')+meta.material;
    if(state.replyDepth==='deep'&&['summary','more'].includes(intent)&&a.description){
      const details=[a.origin,a.dimensions].filter(value=>typeof value==='string'&&value.trim()&&!text.includes(value));
      const excerpt=Array.from(a.description).slice(0,900).join('');
      if(excerpt&&!text.includes(excerpt))details.push(excerpt+(Array.from(a.description).length>900?'…':''));
      if(details.length)text+='\n\n'+human('Thông tin thêm từ hồ sơ nguồn','More from the source record','원문 기록의 추가 정보','原始档案的更多信息')+'\n'+details.join('\n\n');
    }
    return {text:prefix+text,mood:field==='location'?'🧭':field==='summary'?'📚':'🤩',source:a.url,action:'artifact',artifact:a.id,cards:['summary','photo','more'].includes(intent)?[a.id]:[],floor:hasThematicFloor?d.floor:null,hints:hasThematicFloor?['artifact:'+a.id,'map:'+d.floor]:['artifact:'+a.id]};
  }
  function answerForTopic(d, intent) {
    guideContext.topic = d.id;
    guideContext.floor = d.floor;
    guideContext.artifact = null;
    let text = nm(d) + " · " + label(d.floor) + "\n" + ds(d);
    if (intent === "where") text += "\n\n" + t("verifiedNote");
    if (intent === "when" || intent === "material")
      text +=
        "\n\n" +
        human(
          "Chưa có niên đại hoặc chất liệu cụ thể cho toàn bộ chủ đề. Hãy chọn một hồ sơ hiện vật.",
          "A theme has no single verified date or material. Please choose an artifact record.",
          "주제 전체의 연대나 재질은 하나로 확인할 수 없습니다. 유물 기록을 선택하세요.",
          "整个主题没有统一且核实的年代或材质。请选择文物档案。",
        );
    const related = A.filter((a) => !a.referenceOnly && a.topic === d.id);
    if (related.length)
      text +=
        "\n\n" +
        human(
          "Hồ sơ liên quan: ",
          "Related records: ",
          "관련 기록: ",
          "相关档案：",
        ) +
        related.map(aname).join(", ");
    return {
      text,
      mood: "📚",
      source: d.source,
      action: "article",
      id: d.id,
      floor: d.floor,
      hints: ["article:" + d.id, "map:" + d.floor],
    };
  }
  function interestRoute(s) {
    guideContext.artifact = null;
    guideContext.topic = null;
    let tag = null;
    if (/lich su|history|chien tranh|khang chien|war|역사|历史/.test(s))
      tag = "history";
    else if (/van hoa|dan toc|culture|ethnic|문화|文化/.test(s))
      tag = "culture";
    else if (/co vat|gom|antique|ceramic|pottery|古物|유물/.test(s))
      tag = "antique";
    else if (/tre em|gia dinh|children|family|kid|儿童|어린이/.test(s))
      tag = "family";
    const num = s.match(/(?:^|\D)(15|20|30|45|60|90|120)(?=\D|$)/);
    const mins = num ? Number(num[1]) : guideContext.minutes || 30;
    if (!tag && guideContext.interest) tag = guideContext.interest;
    guideContext.minutes = mins;
    const preferred = {
      history: [
        "lich-su-do-thi",
        "doc-lap",
        "chien-tranh",
        "hoi-nhap",
        "tong-quan",
      ],
      culture: [
        "dan-toc",
        "den-co",
        "tram-huong",
        "van-hoa-quang",
        "thieu-nhi",
      ],
      antique: ["co-vat", "den-co", "tram-huong", "trien-lam", "tong-quan"],
      family: [
        "thieu-nhi",
        "thien-nhien",
        "co-vat",
        "van-hoa-quang",
        "tong-quan",
      ],
      default: [
        "tong-quan",
        "co-vat",
        "dan-toc",
        "lich-su-do-thi",
        "van-hoa-quang",
      ],
    };
    const n = mins <= 20 ? 2 : mins <= 45 ? 3 : 5;
    const ids = (preferred[tag || "default"] || preferred.default)
      .slice(0, n)
      .map((id) => D.find((x) => x.id === id))
      .filter(Boolean);
    return { tag, mins, ids };
  }
  function visitorAnswer(answer) {
    guideContext.activeIntent = "visitor";
    guideContext.recommended = [];
    guideContext.artifact = null;
    guideContext.topic = null;
    return answer;
  }
  function visitorConversation(query) {
    const engine = window.MuseumGuideEngine;
    const records = [
      ...A.map((a) => ({
        id: a.id,
        type: "artifact",
        names: adata(a)?.names || [a.name, a.en],
      })),
      ...D.map((d) => ({ ...d, type: "topic" })),
    ];
    const decision = engine.understand(query, guideContext, {
      lang: state.lang,
      records,
    });
    guideContext.preferences = decision.preferences;
    const p = decision.preferences;
    const rawId=id=>String(id||'').replace(/^(?:artifact|topic):/,'');
    if(decision.unsupportedFloor!==null&&decision.unsupportedFloor!==undefined)return {
      text:human('Mình chưa có dữ liệu xác minh cho tầng '+decision.unsupportedFloor+'. Dự án chỉ có sơ đồ chủ đề mô phỏng tầng 1–3 của cơ sở 1; không thể tạo đường đi hay gán hiện vật vào tầng bạn nêu.','I have no verified information for floor '+decision.unsupportedFloor+'. Only a thematic simulation of Site 1 floors 1–3 is available; I cannot assign artifacts or create directions to that requested floor.','요청하신 '+decision.unsupportedFloor+'층 정보는 확인되지 않았습니다. 제1관 1~3층 주제별 예시만 있으며 실제 위치나 경로를 만들 수 없습니다.','尚无已核实的第'+decision.unsupportedFloor+'层资料。项目仅有第一馆1至3层主题模拟图，不能将文物分配到所述楼层或编造路线。'),mood:'🤔',applicationOnly:true,hints:['info']};
    if(decision.needsClarification){const cards=(guideContext.recommended||[]).filter(id=>A.some(a=>a.id===rawId(id))).slice(0,3).map(rawId);return {text:human('Bạn đang hỏi hồ sơ nào? Mây chưa xác định chắc hiện vật hoặc thứ tự bạn muốn chọn. Hãy chọn một hồ sơ bên dưới hoặc nói rõ tên hiện vật.','Which record do you mean? I cannot identify the intended object or list position confidently. Choose a record below or give its name.','어떤 기록을 뜻하나요? 유물이나 목록 순서를 확실히 알 수 없습니다. 아래 기록을 선택하거나 이름을 알려 주세요.','您指的是哪份档案？暂时不能确定文物或列表顺序。请选择下方档案，或说出具体名称。'),mood:'🤔',applicationOnly:true,cards,hints:['catalog']}}
    if (/\b(?:video|clip|phim)\b|영상|视频/.test(decision.query)) {
      const namedId=rawId(decision.entities?.find(r=>r.type==='artifact')?.id);
      const contextual=/\b(?:no|cai do|hien vat do|it|this|that)\b|그것|그 유물|它|这件/.test(decision.query);
      const target=A.find(a=>a.id===(namedId||(contextual?guideContext.artifact:null)));
      const records=target?[target]:A.filter(a=>window.MuseumVideos?.items(a).length).slice(0,6);
      const withVideos=records.filter(a=>window.MuseumVideos?.items(a).length);
      if (!withVideos.length) return {text:(target?aname(target)+'\n':'')+human('Mình chưa có video được đối chiếu với nguồn chính thức cho hồ sơ này. Bạn có thể xem ảnh và mở trang nguồn.','There is no video verified against an official source for this record yet. You can view its photo and original source.','이 기록에 공식 출처와 대조한 영상은 아직 없습니다. 사진이나 원문을 확인하세요.','这份档案暂时没有经过官方来源核对的视频，可以查看照片或原始来源。'),mood:'📚',cards:target?[target.id]:[],source:target?.url,hints:['catalog']};
      return {text:human('Mở hồ sơ bên dưới rồi bấm Phát video. Tư liệu cùng chủ đề có nhãn riêng, không khẳng định hiện vật cụ thể xuất hiện trong phim.','Open a record below and choose Play video. Thematic media is labeled separately; it does not establish that this particular object appears.','아래 기록을 열고 영상 재생을 누르세요. 주제 관련 자료는 별도로 표시되며 해당 유물의 등장을 확인하는 뜻은 아닙니다.','打开下方档案，再点击播放视频。主题相关资料会单独标注，不代表本件文物一定出镜。')+'\n\n'+withVideos.map(a=>aname(a)+' · '+(a.institutionName||a.sourceSiteLabel||'Bảo tàng Đà Nẵng')).join('\n'),mood:'📽️',cards:withVideos.map(a=>a.id),source:withVideos[0].url,sources:withVideos.map(a=>({url:a.url,label:aname(a)})),hints:[]};
    }
    if(decision.intent==='fact'){
      const record=decision.entities?.[0];const id=rawId(record?.id||decision.selected);const artifact=A.find(a=>a.id===id);
      if(artifact){guideContext.activeIntent='entity';return answerForArtifact(artifact,{era:'when',location:'where',summary:'more'}[decision.factField]||decision.factField||'summary')}
      const topic=D.find(d=>d.id===id);
      if(topic){guideContext.activeIntent='entity';if(['material','era','weight','dimensions','origin'].includes(decision.factField))return {text:nm(topic)+'\n'+human('Đây là chủ đề trưng bày, không phải một hiện vật có cùng niên đại, chất liệu hay kích thước. Hãy chọn hồ sơ hiện vật cụ thể.','This is an exhibition theme, not an individual object with one date, material or size. Choose a specific artifact record.','개별 유물이 아닌 전시 주제입니다. 하나의 연대·재질·크기를 지정할 수 없으니 유물 기록을 선택하세요.','这是展览主题，而非具有统一年代、材质或尺寸的单件文物。请选择具体文物档案。'),mood:'🤔',source:topic.source,hints:['article:'+topic.id,'catalog']};return answerForTopic(topic,decision.factField==='location'?'where':'summary')}
    }
    if (p.interest) state.interests = new Set([p.interest]);
    const source = S.overview;
    const artifacts = A.filter(a=>!a.referenceOnly).map((a) => ({
      ...a,
      tags: D.find((d) => d.id === a.topic)?.tags || [],
      thematicFloor:!a.imported&&!a.referenceOnly?D.find(d=>d.id===a.topic)?.floor:null,
      sourceSite:a.sourceSite||'site1',
    }));
    const chooseHighlights = () => engine.rank(artifacts, p);
    const setScope = (intent) => {
      guideContext.activeIntent = intent;
      guideContext.artifact = null;
      guideContext.topic = null;
    };
    const questions = {
      vi: ["Tôi thích lịch sử hơn", "Tôi chỉ có 15 phút", "Tôi muốn ít đi bộ"],
      en: [
        "I prefer history",
        "I only have 15 minutes",
        "I prefer less walking",
      ],
      ko: ["역사를 더 좋아해요", "15분만 있어요", "적게 걷고 싶어요"],
      zh: ["我更喜欢历史", "我只有15分钟", "我想少走路"],
    }[state.lang];
    if (["quiz", "journal", "help"].includes(decision.intent)) {
      setScope(decision.intent);
      const text =
        decision.intent === "quiz"
          ? human(
              "Mình có quiz 5 câu dựa trên hồ sơ bảo tàng. Mỗi câu có đáp án và nguồn để bạn tìm hiểu tiếp. Bấm Chơi quiz để bắt đầu nhé.",
              "Try the five-question quiz based on museum records. Each answer includes a source. Choose Play quiz to start.",
              "박물관 기록 기반 다섯 문제 퀴즈가 있어요. 답마다 출처가 제공됩니다. 퀴즈 시작을 눌러 보세요.",
              "可以玩五道题的博物馆资料测验，每题附答案与来源。点击玩测验开始。",
            )
          : decision.intent === "journal"
            ? human(
                "Bạn có thể ghi cảm nhận, lưu trên thiết bị, tải tệp hoặc chia sẻ trong mục Nhật ký. Bấm Mở nhật ký để viết; tin nhắn này chưa được tự lưu thành ghi chú.",
                "Use the journal to write notes, save them on this device, download or share them. Choose Open journal to write; this chat message has not been saved as a note.",
                "일지에서 메모를 작성해 기기에 저장하거나 다운로드·공유할 수 있어요. 일지 열기를 누르세요. 이 채팅은 메모로 자동 저장되지 않습니다.",
                "在日记里可以写笔记、保存在本设备、下载或分享。点击打开日记书写；本条聊天尚未自动保存为笔记。",
              )
            : human(
                "Mây có thể gợi ý hiện vật theo sở thích, nhớ thời gian và lựa chọn ít đi bộ trong phiên, so sánh hồ sơ, giải thích niên đại/chất liệu, mở sơ đồ và QR, cùng bạn chơi quiz hoặc ghi nhật ký. Bạn muốn bắt đầu với hiện vật nào đáng xem, hay một chuyến đi nhẹ nhàng?",
                "I can recommend artifacts by interest, remember your time and less-walking preference in this session, compare records, explain dates and materials, open maps and QR, or help you try the quiz and journal. Would you like highlights or a lighter visit?",
                "관심사별 유물 추천, 대화 중 시간·적게 걷기 선호 기억, 기록 비교, 연대·재질 설명, 지도·QR, 퀴즈와 일지를 도와드려요. 추천 유물이나 가벼운 관람 중 무엇으로 시작할까요?",
                "我能按兴趣推荐文物，记住本次对话的时间和少走路偏好，对比档案、介绍年代材质、打开地图和二维码，也能带您玩测验或写日记。想先看推荐文物，还是轻松参观？",
              );
      return {
        text,
        mood: "😊",
        applicationOnly: true,
        hints:
          decision.intent === "quiz"
            ? ["quiz"]
            : decision.intent === "journal"
              ? ["profile"]
              : ["catalog", "quiz", "profile"],
        questions:
          decision.intent === "help"
            ? [
                human(
                  "Hiện vật nào đáng xem nhất?",
                  "What are the highlights?",
                  "추천 유물은 무엇인가요?",
                  "有什么必看文物？",
                ),
              ]
            : [],
      };
    }
    if (decision.intent === "select") {
      const a = A.find((a) => a.id === decision.selected);
      if (a) {
        guideContext.activeIntent = "entity";
        return answerForArtifact(a, "summary");
      }
      return {
        text: human(
          "Bạn muốn chọn hiện vật nào? Mây có thể gợi ý ba hồ sơ để bạn bắt đầu.",
          "Which artifact would you like? I can suggest three records to start with.",
          "어떤 유물을 원하시나요? 시작할 기록 세 개를 추천해 드릴 수 있어요.",
          "您想选择哪件文物？我可以先推荐三份档案。",
        ),
        mood: "🤔",
        hints: ["catalog"],
        questions: [
          human(
            "Hiện vật nào đáng xem nhất?",
            "What are the highlights?",
            "추천 유물은 무엇인가요?",
            "有什么必看文物？",
          ),
        ],
      };
    }
    if (decision.intent === "compare") {
      const items = decision.entities
        .filter((e) => e.type === "artifact")
        .map((e) => A.find((a) => a.id === e.id))
        .filter(Boolean)
        .slice(0, 2);
      if (items.length === 2) {
        setScope("compare");
        guideContext.recommended = items.map((a) => a.id);
        return {
          text:
            human(
              "Mây đối chiếu theo hồ sơ hiện có, không xếp hạng hiện vật:\n",
              "Here is a record-based comparison, not an official ranking:\n",
              "기존 기록을 비교합니다. 공식 순위는 아닙니다:\n",
              "以下按现有档案对比，并非官方排名：\n",
            ) +
            items
              .map(
                (a) =>
                  `${a.referenceOnly?(a.institutionName||a.sourceSiteLabel||human('Tham khảo ngoài Đà Nẵng','External reference','외부 참고 자료','外部参考资料'))+'\n':''}${aname(a)}\n${asummary(a)}\n${ameta(a).era} · ${ameta(a).material}`,
              )
              .join("\n\n"),
          mood: "📚",
          source: items[0].url,
          cards: items.map((a) => a.id),
          hints: [],
          sources: items.map((a) => ({ url: a.url, label: aname(a) })),
        };
      }
      return null;
    }
    if (decision.intent === "highlights" || decision.intent === "reason") {
      setScope("highlights");
      const chosen = chooseHighlights();
      guideContext.recommended = chosen.map((a) => a.id);
      if (!chosen.length)
        return {
          text: human(
            "Mình chưa tìm được hồ sơ phù hợp với tất cả điều kiện đang chọn. Mình vẫn giữ các bộ lọc về cơ sở, chất liệu, tầng tham chiếu và nhóm loại trừ; bạn muốn đổi điều kiện nào?",
            "No record matches all current conditions. I have retained the site, material, thematic-floor and exclusion filters. Which condition would you like to change?",
            "모든 조건에 맞는 기록이 없습니다. 기관·재질·참조 층·제외 조건을 그대로 유지합니다. 어떤 조건을 바꿀까요?",
            "没有档案同时符合全部条件。馆区、材质、主题参考楼层和排除条件均予保留。您想更改哪项？",
          ),
          mood: "🤔",
          hints: ["catalog"],
          questions,
        };
      const introduction = p.excluded?.length
        ? human(
            "Mình sẽ tránh nhóm bạn vừa nói không thích. Đây là vài lựa chọn khác theo dữ liệu đang có:",
            "I will avoid the themes you said you dislike. Here are some other record-based choices:",
            "말씀하신 원하지 않는 주제를 제외했어요. 다른 유물을 추천합니다:",
            "我会避开您不喜欢的主题，推荐其他有资料的选择：",
          )
        : human(
            "Nếu lần đầu ghé bảo tàng, Mây gợi ý bắt đầu với những hiện vật này. Đây là gợi ý theo câu chuyện và sở thích, không phải bảng xếp hạng chính thức:",
            "For a first visit, I suggest these artifacts as starting points. These are story-based recommendations, not an official ranking:",
            "첫 방문이라면 다음 유물로 시작해 보세요. 이야기와 관심사에 따른 추천이며 공식 순위가 아닙니다:",
            "第一次参观，可以从这些文物开始。这是按故事与兴趣给出的建议，并非官方排名：",
          );
      return {
        text:
          introduction +
          "\n\n" +
          chosen
            .map((a, i) => `${i + 1}. ${aname(a)} — ${asummary(a)}`)
            .join("\n\n") +
          "\n\n" +
          human(
            "Bạn nghiêng về lịch sử, văn hóa hay chỉ muốn một điểm xem nhanh?",
            "Would you prefer history, culture, or just one quick stop?",
            "역사, 문화, 짧은 관람 중 어떤 것이 좋으세요?",
            "您更喜欢历史、文化，还是只想快速看一个主题？",
          ),
        mood: "🤩",
        source: chosen[0].url,
        sources: chosen.map((a) => ({ url: a.url, label: aname(a) })),
        cards: chosen.map((a) => a.id),
        hints: [],
        questions,
      };
    }
    if (decision.intent === "alternatives") {
      setScope("alternatives");
      guideContext.recommended = [];
      return {
        text: human(
          "Không nhất thiết phải xem thật nhiều hiện vật đâu 😊. Nếu bạn chưa có hứng xem, có thể thử ngay trên điện thoại:\n\n• Nghe Mây kể một câu chuyện ngắn thay vì đọc các bảng dài.\n• Chơi quiz 5 câu để khám phá theo kiểu trò chơi.\n• Viết một ghi chú vào nhật ký chuyến đi.\n\nNếu chỉ đang mệt hoặc ngại đi bộ, mình có thể gợi ý một chủ đề trên một tầng. Bạn muốn nghe chuyện, chơi quiz hay tham quan nhẹ nhàng?",
          "You do not have to look at lots of objects 😊. If you are not in the mood, try something on your phone:\n\n• Listen to a short artifact story instead of reading long panels.\n• Try the five-question quiz as a game.\n• Write a note in your visit journal.\n\nIf you are tired or prefer less walking, I can suggest one theme on one floor. Would you like a story, a quiz, or a lighter visit?",
          "많은 유물을 꼭 볼 필요는 없어요 😊. 지금 전시를 보고 싶지 않다면 휴대전화로 해 보세요:\n\n• 긴 설명을 읽는 대신 짧은 유물 이야기를 들어 보세요.\n• 다섯 문제 퀴즈를 게임처럼 즐겨 보세요.\n• 관람 일지에 메모를 남겨 보세요.\n\n피곤하거나 걷기 싫다면 한 층의 한 주제를 추천할 수 있어요. 이야기, 퀴즈, 가벼운 관람 중 무엇이 좋으세요?",
          "不必一次看很多文物 😊。暂时不想看展，可以在手机上试试：\n\n• 听一段文物故事，代替阅读长篇展板。\n• 玩五道题的小测验，换一种探索方式。\n• 在参观日记里写下感受。\n\n如果只是累了或不想多走，我可以推荐一层中的一个主题。您想听故事、玩测验，还是轻松参观？",
        ),
        mood: "😊",
        hints: ["quiz", "profile"],
        questions: [
          human(
            "Kể cho tôi một chuyện về hiện vật",
            "Tell me a short artifact story",
            "짧은 유물 이야기를 들려줘",
            "讲一个文物故事",
          ),
          questions[2],
        ],
      };
    }
    if(['route','low-walking'].includes(decision.intent)&&(p.site&&p.site!=='site1'||p.materials?.length||p.excludedMaterials?.length)){
      setScope('route');const chosen=chooseHighlights();guideContext.recommended=chosen.map(a=>a.id);
      return {text:(chosen.length?human('Mây giữ các điều kiện bạn chọn và gợi ý các hồ sơ sau để tìm hiểu trên điện thoại. Đây không phải tuyến đường trong bảo tàng:\n','Keeping your conditions, here are sourced records to explore on your phone. This is not an indoor route:\n','선택한 조건을 유지한 기록을 휴대전화에서 살펴보세요. 실제 실내 경로가 아닙니다:\n','保留所选条件，推荐以下有来源档案在手机上了解。这不是馆内导航路线：\n')+chosen.map((a,i)=>(i+1)+'. '+aname(a)).join('\n'):human('Chưa có hồ sơ phù hợp với tất cả điều kiện. Mây giữ nguyên bộ lọc; hãy đổi một điều kiện nếu muốn tìm rộng hơn.','No records match every condition. Filters are retained; change a condition if you want a broader search.','모든 조건에 맞는 기록이 없습니다. 필터를 유지하므로 검색을 넓히려면 조건을 바꿔 주세요.','没有同时符合全部条件的档案。筛选条件保留，如需扩大搜索，请更改条件。'))+'\n\n'+human('Chưa có mặt bằng, khoảng cách, lối xe lăn hoặc tầng trưng bày được xác minh cho các hồ sơ này.','Verified floor plans, distances, wheelchair access and display floors are not available for these records.','이 기록의 실제 도면·거리·휠체어 통로·전시 층 정보는 확인되지 않았습니다.','这些档案尚无已核实的平面图、距离、轮椅通道或实际展出楼层。'),mood:'🧭',cards:chosen.map(a=>a.id),sources:chosen.map(a=>({url:a.url,label:aname(a)})),hints:['catalog','info']};
    }
    if (
      decision.intent === "low-walking" ||
      (decision.intent === "route" && p.lowWalking)
    ) {
      setScope("low-walking");
      guideContext.recommended = [];
      const floor =
        p.floor ||
        state.currentZone?.floor ||
        (p.interest === "history" ? 3 : p.interest === "culture" ? 2 : 1);
      const items = D.filter(
        (d) =>
          d.floor === floor &&
          !(d.tags || []).some((t) => p.excluded?.includes(t)),
      );
      const topic =
        items.find((d) => p.interest && d.tags.includes(p.interest)) ||
        items[0];
      if (!topic)
        return {
          text: human(
            "Mình chưa tìm được chủ đề trên tầng này phù hợp với các lựa chọn đã loại trừ. Bạn muốn đổi tầng hoặc sở thích nào?",
            "No theme on this floor matches your exclusions. Would you like a different floor or interest?",
            "제외한 조건에 맞는 주제가 이 층에 없어요. 다른 층이나 관심사를 선택할까요?",
            "本层没有符合排除条件的主题。要换一层或换个兴趣吗？",
          ),
          mood: "🤔",
          hints: ["plan", "info"],
        };
      state.time = p.minutes || 15;
      state.pace = "focused";
      if (p.interest) state.interests = new Set([p.interest]);
      guideContext.preferences.floor = floor;
      return {
        text:
          human(
            `Có nhé, mình sẽ ưu tiên ít điểm dừng và cùng một tầng, thay vì đi qua nhiều tầng. Bạn có thể chọn chủ đề “${nm(topic)}” (${label(floor)}), mở bài giới thiệu và bấm nghe thuyết minh ngay trên điện thoại.`,
            `Yes. Let’s keep to fewer stops on a single floor rather than cover several floors. Try “${nm(topic)}” (${label(floor)}), open the introduction and listen on your phone.`,
            `네. 여러 층을 돌기보다 한 층에서 적은 주제만 보도록 할게요. “${nm(topic)}” (${label(floor)}) 소개를 열고 휴대전화로 음성 안내를 들어 보세요.`,
            `可以。我们少选站点、集中在一层，不必来回换楼层。试试“${nm(topic)}”（${label(floor)}），打开介绍，在手机上收听讲解。`,
          ) +
          "\n\n" +
          human(
            "Đây là gợi ý giảm số chủ đề, chưa phải tuyến đường ngắn nhất. Mình chưa có dữ liệu xác nhận khoảng cách, thang máy, lối xe lăn hoặc chỗ nghỉ. Nếu cần hỗ trợ di chuyển, hãy hỏi nhân viên bảo tàng trước.",
            "This reduces the number of themes, not a measured shortest path. I have no verified distances, lift access, wheelchair routes or resting places. Ask museum staff for mobility assistance.",
            "주제 수를 줄이는 제안이며 실제 최단 경로는 아닙니다. 거리, 엘리베이터, 휠체어 경로나 휴식 장소 정보는 확인되지 않았으니 이동 지원은 직원에게 문의하세요.",
            "这只是减少主题数量的建议，并非经过测量的最短路线。距离、电梯、轮椅通道和休息点尚无核实资料；需要移动协助时请先询问工作人员。",
          ) +
          "\n\n" +
          (p.minutes
            ? human(
                `Mình đã cập nhật thời gian ${p.minutes} phút và giữ lựa chọn ít đổi tầng. Bấm Tạo lộ trình để xem đề xuất.`,
                `I have set ${p.minutes} minutes and kept your single-floor preference. Open Plan a route to see the suggestion.`,
                `${p.minutes}분과 한 층 위주 선호를 반영했어요. 코스 만들기를 열어 확인하세요.`,
                `已更新为${p.minutes}分钟，并保留尽量不换楼层的偏好。打开规划路线查看建议。`,
              )
            : human(
                "Mình sẽ nhớ lựa chọn ít đi bộ trong cuộc trò chuyện này. Bạn có khoảng bao nhiêu phút?",
                "I will remember less walking for this conversation. How many minutes do you have?",
                "이 대화에서는 적게 걷는 선호를 기억할게요. 시간이 얼마나 있나요?",
                "本次对话会记住少走路的偏好。您有多少分钟？",
              )),
        mood: "🧭",
        source: topic.source,
        hints: ["article:" + topic.id, "plan", "info"],
        questions: [questions[1]],
      };
    }
    if (decision.intent === "route") {
      setScope("route");
      guideContext.recommended = [];
      guideContext.minutes = p.minutes || guideContext.minutes || 30;
      guideContext.interest = p.interest || guideContext.interest;
      state.time = guideContext.minutes;
      if (p.interest) state.interests = new Set([p.interest]);
      const r = interestRoute(engine.colloquial(query, state.lang));
      const stops = r.ids.filter(
        (d) => (!p.floor||d.floor===p.floor)&&!(d.tags || []).some((t) => p.excluded?.includes(t)),
      );
      if(!stops.length)return {text:human('Chưa có chủ đề phù hợp với tầng tham chiếu và các nhóm đã loại trừ. Mây giữ nguyên điều kiện; bạn muốn đổi tầng hay sở thích?','No theme matches the thematic floor and exclusions. Conditions are retained; would you like to change the floor or interests?','참조 층과 제외 조건에 맞는 주제가 없습니다. 조건을 유지합니다. 층이나 관심사를 바꿀까요?','没有符合主题参考楼层及排除条件的主题。条件保留，是否更改楼层或兴趣？'),mood:'🤔',hints:['plan','info']};
      return {
        text:
          human(
            `Với khoảng ${r.mins} phút, Mây gợi ý:\n`,
            `For about ${r.mins} minutes, Mây suggests:\n`,
            `${r.mins}분 관람 추천:\n`,
            `${r.mins}分钟参观建议：\n`,
          ) +
          stops
            .map((d, i) => `${i + 1}. ${nm(d)} · ${label(d.floor)}`)
            .join("\n") +
          "\n\n" +
          t("planLimit"),
        mood: "🧭",
        source,
        hints: ["plan", "map"],
        questions: [questions[2]],
      };
    }
    if (
      !decision.entities.length &&
      /(?:ke|nghe)( cho toi)?( mot)?( cau)? chuyen|short artifact story|유물 이야기|文物故事/.test(
        decision.query,
      )
    ) {
      const a = chooseHighlights()[0];
      if (a) {
        setScope("entity");
        guideContext.recommended = [a.id];
        return answerForArtifact(a, "summary");
      }
    }
    return null;
  }
  function replyKnowledge(q) {
    const query = String(q).slice(0, 700),
      s = norm(query),
      say = (...a) => a.some((k) => s.includes(norm(k)));
    const named = findMuseumEntity(query);
    const requestPlan = window.MuseumRequestPlan?.analyze(query,{previous:guideContext.requestPlan,namedArtifact:named?.type==='artifact'});
    const museumQuery = requestPlan?.domain !== 'study' && !requestPlan?.clarification && requestPlan?.domain !== 'conversation' && (!!named || /bao tang|hien vat|than cong|ma nao|sac phong|ghe bau|lich su|van hoa|co vat|tham quan|lo trinh|so do|tang [0-9]|tang nao|gia ve|gio mo cua|di bo|khong muon xem|nien dai|chat lieu|lam bang|made of|which floor|museum|artifact|material|history|route|low walking|박물관|유물|대포|博物馆|文物|古炮/.test(s)
      || ((guideContext.artifact || guideContext.recommended?.length) && /^(no |cai |hien vat do|what is|when was|where is|the second|thu hai|thu nhat)/.test(s)));
    const social = companion?.respond(query,{language:state.lang,plan:requestPlan,deep:state.replyDepth==='deep',museum:museumQuery,openConversation:['life','playful'].includes(state.chatTopic),artifactName:named?.type==='artifact'?aname(named.item):''});
    if (social) {
      guideContext.requestPlan=social.requestPlan || null;
      guideContext.activeIntent='conversation'; guideContext.artifact=null; guideContext.topic=null; guideContext.recommended=[];
      state.chatTopic=social.fiction||['joke','cat','riddle','riddleAnswer'].includes(social.conversationTopic)?'playful':'life';
      return social;
    }
    guideContext.requestPlan = null;
    if(requestPlan?.domain==='museum' && requestPlan.avoids.includes('study') && !named) return visitorConversation(human('Hiện vật nào đáng xem nhất?','What are the highlights?','추천 유물은 무엇인가요?','有什么必看文物？'));
    const timeAsk = say(
      "bao gio",
      "nam nao",
      "nien dai",
      "thoi ky",
      "tu khi nao",
      "how old",
      "when",
      "date",
      "era",
      "年代",
      "언제",
      "연대",
    );
    const materialAsk = say(
      "chat lieu",
      "lam bang gi",
      "vat lieu",
      "material",
      "made of",
      "材质",
      "재질",
    );
    const photoAsk = say(
      "co anh",
      "hinh anh",
      "cho xem anh",
      "xem hinh",
      "photo",
      "picture",
      "image",
      "照片",
      "사진",
    );
    const moreAsk = say(
      "ke them",
      "noi them",
      "chi tiet",
      "giai thich",
      "vi sao",
      "read more",
      "tell me more",
      "details",
      "explain",
      "详情",
      "자세히",
    );
    const whereAsk = say(
      "o dau",
      "vi tri",
      "tang nao",
      "lam sao den",
      "duong di",
      "where",
      "how to get",
      "which floor",
      "位置",
      "어디",
    );
    const intent = timeAsk
      ? "when"
      : materialAsk
        ? "material"
        : photoAsk
          ? "photo"
          : whereAsk
            ? "where"
            : moreAsk
              ? "more"
              : "summary";
    if (
      say(
        "toi dang o dau",
        "vi tri cua toi",
        "dinh vi toi",
        "where am i",
        "my location",
        "我在哪里",
        "내 위치",
        "나는 어디에",
        "제가 어디에",
      )
    )
      return {
        text: locationText(),
        mood: "🧭",
        hints: ["map:" + (state.currentZone?.floor || state.floor), "scan"],
      };
    const museumSubject = say("bao tang", "museum", "박물관", "博物馆");
    if (
      (museumSubject &&
        say("o dau", "where", "어디", "在哪", "地址", "주소")) ||
      say("dia chi", "address", "주소", "地址")
    )
      return visitorAnswer({
        text: t("addressText") + " · " + t("hoursText"),
        mood: "🧭",
        source: S.main,
        hints: ["info"],
      });
    if (
      say(
        "gio mo cua",
        "gio dong cua",
        "bao gio mo",
        "opening hour",
        "hours",
        "when does the museum open",
        "开放时间",
        "几点开",
        "운영시간",
        "문 여는",
        "몇 시",
      )
    )
      return visitorAnswer({
        text: t("guideAnswerTime"),
        mood: "📚",
        source: S.main,
        hints: ["info"],
      });
    if (
      say(
        "gia ve",
        "mua ve",
        "ticket",
        "admission",
        "vao cua bao nhieu",
        "fee",
        "门票",
        "입장료",
      )
    )
      return visitorAnswer({
        text: t("guideAnswerTicket"),
        mood: "📚",
        source: S.main,
        hints: ["info"],
      });
    const practical = visitorConversation(query);
    if (practical) return practical;
    const item = findMuseumEntity(query);
    if (item) {
      guideContext.activeIntent = "entity";
      guideContext.recommended = [];
    }
    if (item?.type === "artifact") return answerForArtifact(item.item, intent);
    if (item?.type === "topic") return answerForTopic(item.item, intent);
    // Follow-up intent only applies to short contextual questions, never arbitrary unknown factual questions.
    const followup = [
      "nó làm bằng gì",
      "nó làm bằng chất liệu gì",
      "nó có từ khi nào",
      "nó ở đâu",
      "nó ở tầng nào",
      "nó có ảnh không",
      "ảnh đâu",
      "cho tôi xem ảnh",
      "nói thêm về nó",
      "kể thêm về hiện vật đó",
      "hiện vật đó làm bằng gì",
      "cái đó ở đâu",
      "what is it made of",
      "what is that made of",
      "what is this made of",
      "when was it made",
      "when was it created",
      "where is it",
      "where can i find it",
      "tell me more about it",
      "how old is it",
      "what is its material",
      "它是什么材质",
      "它的材质是什么",
      "它的材质",
      "它在哪里",
      "它在哪一层",
      "它是什么年代",
      "它有照片吗",
      "这个是什么材质",
      "그것은 무엇으로 만들었나요",
      "그것의 재질은 무엇인가요",
      "chất liệu",
      "chất liệu gì",
      "chất liệu là gì",
      "còn chất liệu thì sao",
      "làm bằng gì",
      "niên đại",
      "niên đại nào",
      "còn niên đại thì sao",
      "bao giờ",
      "ở đâu",
      "ở tầng nào",
      "tầng nào",
      "kể thêm",
      "nói thêm",
      "chi tiết",
      "có ảnh không",
      "xem hình",
      "material",
      "what material",
      "what is the material",
      "date",
      "era",
      "how old",
      "when",
      "where",
      "tell me more",
      "read more",
      "show me a photo",
      "재질",
      "재질은",
      "재질은요",
      "재질은 무엇인가요",
      "무슨 재질인가요",
      "어떤 재질인가요",
      "연대",
      "연대는",
      "언제",
      "어디",
      "자세히",
      "사진",
      "材质",
      "什么材质",
      "是什么材质",
      "年代",
      "什么年代",
      "哪一层",
      "在哪里",
      "详情",
      "照片",
    ].some((phrase) => s === norm(phrase));
    if (followup && intent !== "summary") {
      const a = A.find((a) => a.id === guideContext.artifact);
      if (a) return answerForArtifact(a, intent);
      const d = D.find((d) => d.id === guideContext.topic);
      if (d) return answerForTopic(d, intent);
      if (guideContext.recommended?.length)
        return {
          text: human(
            "Bạn muốn hỏi hiện vật nào trong các gợi ý này? Chọn một hồ sơ bên dưới, Mây sẽ trả lời đúng hiện vật.",
            "Which recommended artifact do you mean? Choose a record below so I can answer about the right one.",
            "어떤 추천 유물을 말씀하시나요? 아래 기록을 선택해 주세요.",
            "您指的是哪件推荐文物？请在下方选择档案。",
          ),
          mood: "🤔",
          cards: guideContext.recommended,
          hints: [],
        };
    }
    if (
      say("chao", "hello", "xin chao", "hey", "안녕", "你好") &&
      s.split(" ").length <= 5
    )
      return {
        text: cu("welcome"),
        mood: "😊",
        hints: ["plan", "catalog", "scan"],
      };
    if (say("cam on", "thank", "thanks", "고마워", "谢谢"))
      return {
        text: human(
          "Rất vui vì giúp được bạn! Bạn muốn tìm hiểu hiện vật nào tiếp theo?",
          "Happy to help! What would you like to explore next?",
          "도움이 되어 기쁩니다! 다음에는 무엇을 알아볼까요?",
          "很高兴能帮到您！接下来想了解什么？",
        ),
        mood: "😊",
        hints: ["catalog", "plan"],
      };
    if (say("qr", "quet ma", "scan", "camera", "二维码", "코드"))
      return {
        text: human(
          "Bạn có thể quét bằng camera sau khi cấp quyền, tải ảnh QR hoặc nhập mã. QR tầng/khu tạo mốc check-in mô phỏng; QR hiện vật mở hồ sơ. Đây không phải GPS trong nhà.",
          "Grant camera permission to scan, upload a QR image, or enter a code. Floor/zone QR codes set a demo check-in point; artifact codes open records. This is not indoor GPS.",
          "카메라 권한을 허용해 스캔하거나 QR 이미지를 업로드하거나 코드를 입력하세요. 층·구역 QR은 예시 체크인 지점을 설정하며 유물 QR은 기록을 엽니다. 실내 GPS가 아닙니다.",
          "授权摄像头扫码、上传二维码图片或手动输入代码。楼层和区域码设置模拟签到点，文物码打开档案。这不是室内GPS。",
        ),
        mood: "🧭",
        hints: ["scan", "map"],
      };
    if (
      say(
        "gia ve",
        "mua ve",
        "ticket",
        "admission",
        "vao cua bao nhieu",
        "fee",
        "门票",
        "입장료",
      )
    )
      return {
        text: t("guideAnswerTicket"),
        mood: "📚",
        source: S.main,
        hints: ["info"],
      };
    if (
      say(
        "gio mo cua",
        "gio dong cua",
        "bao gio mo",
        "opening hour",
        "hours",
        "开放时间",
        "운영시간",
      )
    )
      return {
        text: t("guideAnswerTime"),
        mood: "📚",
        source: S.main,
        hints: ["info"],
      };
    if (
      say(
        "dia chi",
        "bao tang o dau",
        "toi muon den",
        "address",
        "how to get to museum",
        "地址",
        "주소",
      )
    )
      return {
        text: t("addressText") + " · " + t("hoursText"),
        mood: "🧭",
        source: S.main,
        hints: ["info"],
      };
    for (const [f, phrases, key] of [
      [
        1,
        ["tang 1", "tang mot", "floor 1", "1층", "一楼"],
        "guideAnswerAntique",
      ],
      [
        2,
        ["tang 2", "tang hai", "floor 2", "2층", "二楼"],
        "guideAnswerCulture",
      ],
      [
        3,
        ["tang 3", "tang ba", "floor 3", "3층", "三楼"],
        "guideAnswerHistory",
      ],
    ])
      if (say(...phrases)) {
        guideContext.floor = f;
        guideContext.artifact = null;
        guideContext.topic = null;
        return {
          text: t(key),
          mood: "📚",
          source: f === 1 ? S.floors : f === 2 ? S.f2 : S.overview,
          hints: ["map:" + f],
        };
      }
    const routeAsk =
      (guideContext.minutes && /\d+\s*(분|分钟|min|phut)/.test(s)) ||
      say(
        "nen di",
        "lo trinh",
        "hanh trinh",
        "tour",
        "route",
        "phut",
        "minute",
        "thoi gian tham quan",
        "tham quan gi",
        "recommend",
        "goi y",
        "코스",
        "路线",
        "分钟",
        "분 코스",
      );
    if (routeAsk) {
      const r = interestRoute(s);
      if (!r.tag && guideContext.interest) r.tag = guideContext.interest;
      guideContext.interest = r.tag;
      state.time = r.mins <= 20 ? 15 : r.mins <= 45 ? 30 : 60;
      if (r.tag) state.interests = new Set([r.tag]);
      const stops = r.ids
        .map((d, i) => i + 1 + ". " + nm(d) + " · " + label(d.floor))
        .join("\n");
      return {
        text:
          human(
            "Với khoảng " + r.mins + " phút, Mây gợi ý:\n",
            "For about " + r.mins + " minutes, Mây suggests:\n",
            r.mins + "분 관람 추천:\n",
            r.mins + "分钟参观建议：\n",
          ) +
          stops +
          "\n\n" +
          t("planLimit"),
        mood: "🧭",
        source: S.overview,
        hints: ["plan", "map"],
      };
    }
    if (
      say(
        "lich su",
        "history",
        "chien tranh",
        "war",
        "khang chien",
        "历史",
        "역사",
      )
    ) {
      guideContext.interest = "history";
      return {
        text: t("guideAnswerHistory"),
        mood: "📚",
        source: S.overview,
        hints: ["map:3", "plan"],
      };
    }
    if (say("van hoa", "culture", "dan toc", "ethnic", "文化", "문화")) {
      guideContext.interest = "culture";
      return {
        text: t("guideAnswerCulture"),
        mood: "📚",
        source: S.f2,
        hints: ["map:2", "plan"],
      };
    }
    if (say("co vat", "gom", "antique", "ceramic", "pottery", "古物", "유물")) {
      guideContext.interest = "antique";
      return {
        text: t("guideAnswerAntique"),
        mood: "📚",
        source: S.floors,
        hints: ["map:1", "catalog"],
      };
    }
    if (
      say("tre em", "gia dinh", "family", "children", "kid", "儿童", "어린이")
    ) {
      guideContext.interest = "family";
      return {
        text: t("guideAnswerFamily"),
        mood: "😊",
        source: S.floors,
        hints: ["map:1", "plan"],
      };
    }
    return {
      text: cu("help"),
      mood: "🤔",
      hints: ["catalog", "search", "info"],
    };
  }
  function smartButtons(ans) {
    if (ans.cards?.length) {
      const cards = document.createElement("div");
      cards.className = "chat-record-cards";
      cards.innerHTML = ans.cards
        .map((id) => A.find((a) => a.id === id))
        .filter(Boolean)
        .slice(0, 3)
        .map(
          (a) =>
            `<button type="button" class="chat-record-card" data-artifact="${esc(a.id)}">${imageBox(a.image, aname(a), true)}<span><b>${esc(aname(a))}</b><small>${esc(ameta(a).era)}</small>${a.referenceOnly?`<small>${esc(a.institutionName||a.sourceSiteLabel)} · ${esc(human("Tham khảo", "Reference", "참고", "参考"))}</small>`:""}<span class="chat-card-open">${esc(human("Mở hồ sơ", "Open record", "기록 열기", "打开档案"))} ›</span></span></button>`,
        )
        .join("");
      $("messages").appendChild(cards);
    }
    const wrap = document.createElement("div");
    wrap.className = "chat-actions contextual-actions";
    const names = {
      plan: cu("route"),
      catalog: t("collections"),
      map: cu("where"),
      scan: t("scan"),
      info: t("visit"),
      search: t("goSearch"),
      quiz: human("Chơi quiz", "Play quiz", "퀴즈 시작", "玩测验"),
      profile: human("Mở nhật ký", "Open journal", "일지 열기", "打开日记"),
    };
    const actions = ans.hints || [];
    for (const action of [...new Set(actions)].slice(0, 3)) {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.replyAction = action;
      b.textContent = action.startsWith("artifact:")
        ? human("Mở hồ sơ", "Open record", "기록 열기", "打开档案")
        : action.startsWith("article:")
          ? cu("more")
          : action.startsWith("map:")
            ? cu("where")
            : names[action] || action;
      wrap.appendChild(b);
    }
    for (const question of (ans.questions || []).slice(0, 3)) {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.chatQuestion = question;
      b.textContent = question;
      wrap.appendChild(b);
    }
    if (wrap.children.length) $("messages").appendChild(wrap);
    scrollChat();
  }
  let chatBusy = false;
  function safeEndpoint(value) {
    try {
      const u = new URL(value);
      return u.protocol === "https:" &&
        !u.username &&
        !u.password &&
        !u.hash &&
        u.href.length <= 2048
        ? u.href
        : null;
    } catch {
      return null;
    }
  }
  async function sendMessage(raw) {
    const q = String(raw || "")
      .trim()
      .slice(0, 700);
    if (!q || chatBusy) return;
    chatBusy = true;
    const submit = $("chat-form").querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    $("messages").setAttribute("aria-busy", "true");
    const language = state.lang;
    let preparation;
    renderReplyPreferences();
    try {
      addBubble(q, true);
      preparation=document.createElement('div');preparation.className='chat-preparing';preparation.setAttribute('role','status');
      preparation.textContent=state.replyDepth==='deep'?human('Đang phân tích mục tiêu và điều kiện…','Analyzing the goal and constraints…','목표와 조건을 분석하고 있어요…','正在分析目标与条件……'):human('Đang chuẩn bị câu trả lời…','Preparing a reply…','답변을 준비하고 있어요…','正在准备回答……');
      $('messages').appendChild(preparation);scrollChat();
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      $("chat-input").value = "";
      const history = guideContext.turns
        .filter((turn) => turn.scope !== "conversation")
        .slice(-8)
        .map((turn) => ({ role: turn.role, content: turn.content.slice(0, 1200) }));
      const currentTurn = { role: "user", content: q };
      guideContext.turns.push(currentTurn);
      guideContext.turns = guideContext.turns.slice(-10);
      const localAnswer = replyKnowledge(q);
      currentTurn.scope = localAnswer.kind === "conversation" ? "conversation" : "museum";
      preparation.remove();
      const endpoint = safeEndpoint(sv("museum_ai_endpoint"));
      if (endpoint && !localAnswer.applicationOnly) {
        const typing = addBubble(human("Đang chờ AI máy chủ phản hồi…", "Waiting for the AI server…", "AI 서버의 응답을 기다리고 있어요…", "正在等待AI服务器回复……"), false, "", "🤔");
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), state.replyDepth==='deep'?50000:14000);
          let response;
          try {
            response = await fetch(endpoint, {
              method: "POST",
              headers: { "content-type": "application/json" },
              credentials: "omit",
              signal: controller.signal,
              body: JSON.stringify({
                message: q,
                history,
                language,
                context: {
                  floor: state.floor,
                  topic: guideContext.topic,
                  artifact: guideContext.artifact,
                  zone: safeCurrentZone(),
                },
                version: "v6",
                depth: state.replyDepth,
              }),
            });
          } finally {
            clearTimeout(timeout);
          }
          if (!response.ok) throw Error("HTTP " + response.status);
          const payload = await response.json();
          if (
            typeof payload.answer !== "string" ||
            !payload.answer.trim() ||
            payload.answer.length > 5000 ||
            !["generative", "data"].includes(payload.mode)
          )
            throw Error("Invalid AI response");
          const sources = (
            Array.isArray(payload.sources) ? payload.sources : []
          ).filter((x) => {
            try {
              const u = new URL(x);
              return (
                u.protocol === "https:" &&
                new Set(['baotangdanang.vn','www.baotangdanang.vn',...A.map(a=>{try{return new URL(a.url).hostname}catch{return ''}})]).has(u.hostname) &&
                !u.username &&
                !u.password
              );
            } catch {
              return false;
            }
          });
          typing.closest(".assistant-row")?.remove();
          state.guideMode =
            payload.mode === "generative" ? "generative" : "offline";
          renderGuide();
          const responseBubble = addBubble(
            payload.answer,
            false,
            payload.mode === "data" ? modeLabel() : "",
            payload.mode === "generative" ? "🤩" : "🤔",
            sources[0] || "",
            {
              animate: true,
              sources: sources.map((url) => ({ url, label: cu("source") })),
            },
          );
          await responseBubble.reveal.finished;
          guideContext.turns.push({
            role: "assistant",
            content: payload.answer,
            scope: "museum",
          });
          guideContext.turns = guideContext.turns.slice(-10);
          return;
        } catch (error) {
          typing.closest(".assistant-row")?.remove();
          state.guideMode = "offline";
          toast(t("aiError"));
        }
      }
      state.guideMode = "offline";
      renderGuide();
      const answer = localAnswer;
      guideContext.lastMood = answer.mood;
      $("page-guide").dataset.mood=answer.mood || "☁️";
      const responseBubble = addBubble(
        answer.text,
        false,
        answer.kind === "conversation" ? (answer.fiction ? human("Tưởng tượng vui", "Playful fiction", "재미있는 상상", "趣味想象") : human("Chuyện cùng Mây", "A moment with Mây", "마이와 대화", "和小云聊聊")) : modeLabel(),
        answer.mood || "😊",
        answer.source || "",
        { animate: true, sources: answer.sources },
      );
      await responseBubble.reveal.finished;
      smartButtons(answer);
      guideContext.turns.push({ role: "assistant", content: answer.text, scope: answer.kind === "conversation" ? "conversation" : "museum" });
      guideContext.turns = guideContext.turns.slice(-10);
    } finally {
      preparation?.remove();
      chatBusy = false;
      if (submit) submit.disabled = false;
      $("messages").setAttribute("aria-busy", "false");
      renderReplyPreferences();
    }
  }

  function speechLang() {
    return (
      { vi: "vi-VN", en: "en-US", ko: "ko-KR", zh: "zh-CN" }[state.lang] ||
      "vi-VN"
    );
  }
  function speakText(txt) {
    if (!("speechSynthesis" in window)) {
      toast(t("voiceUnsupported"));
      return;
    }
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      $("article-speak").textContent = t("listen");
      return;
    }
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = speechLang();
    u.rate = 0.93;
    u.onend = () => {
      $("article-speak").textContent = t("listen");
    };
    u.onerror = () => {
      $("article-speak").textContent = t("listen");
    };
    speechSynthesis.speak(u);
    $("article-speak").textContent = t("speakStop");
  }
  function speechToInput(target, send = false) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast(t("speechUnsupported"));
      target.focus();
      return;
    }
    try {
      if (state.speech) {
        state.speech.abort();
      }
      const r = new SR();
      state.speech = r;
      r.lang = speechLang();
      r.interimResults = false;
      r.maxAlternatives = 1;
      const old = target.placeholder;
      r.onstart = () => {
        target.placeholder = t("speechListening");
      };
      r.onresult = (e) => {
        const words = e.results[0][0].transcript;
        target.value = words;
        if (send) sendMessage(words);
        else renderSearch();
      };
      r.onerror = (e) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed")
          toast(t("speechDenied"));
      };
      r.onend = () => {
        target.placeholder = old;
        state.speech = null;
      };
      r.start();
    } catch (e) {
      toast(t("speechUnsupported"));
    }
  }
  const QR_VALUES = {
    entry: CANONICAL_BASE,
    f1: CANONICAL_BASE + "?floor=1",
    f2: CANONICAL_BASE + "?floor=2",
    f3: CANONICAL_BASE + "?floor=3",
    a1: CANONICAL_BASE + "?artifact=sung-than-cong",
    a2: CANONICAL_BASE + "?artifact=ghe-bau",
    zone: CANONICAL_BASE + "?zone=dan-toc",
    topic: CANONICAL_BASE + "?topic=co-vat",
  };
  function renderSamples() {
    $("qr-codes").innerHTML = Object.entries(QR_VALUES)
      .map(([k, v]) => {
        const name =
          k === "entry"
            ? t("qrEntry")
            : k.startsWith("f")
              ? label(Number(k[1]))
              : k === "a1"
                ? aname(A.find((a) => a.id === "sung-than-cong"))
                : k === "a2"
                  ? aname(A.find((a) => a.id === "ghe-bau"))
                  : nm(
                      D.find(
                        (d) => d.id === (k === "zone" ? "dan-toc" : "co-vat"),
                      ),
                    );
        return `<button class="qr-sample" data-demo-code="${esc(v)}"><img loading="lazy" alt="QR ${esc(name)}" src="${qrSrc(v)}"><b>${esc(name)}</b><small>${esc(t("sampleTap"))}</small></button>`;
      })
      .join("");
  }
  function showQR(text) {
    const box = $("qr-result");
    box.classList.remove("hidden");
    box.textContent = text;
  }
  function parseQR(raw) {
    const val = String(raw || "").trim();
    if (!val) {
      showQR(t("qrManualMsg"));
      return;
    }
    stopCamera();
    if (val.length > 2048) {
      showQR(t("qrInvalid"));
      return;
    }
    const code = val.toUpperCase();
    if (code === "DN-MUSEUM-ENTRY") {
      nav("home");
      return;
    }
    const fm = code.match(/^DN-MUSEUM-(?:F|FLOOR-)([123])$/);
    if (fm) {
      markPosition("floor-" + fm[1], false, "qr");
      openMap(Number(fm[1]));
      return;
    }
    const am = code.match(/^DN-MUSEUM-(?:ART-|ARTIFACT-)([A-Z0-9-]+)$/);
    if (am && A.some((a) => a.id === am[1].toLowerCase())) {
      openArtifact(am[1].toLowerCase());
      return;
    }
    const zm = code.match(/^DN-MUSEUM-(ZONE|TOPIC)-([A-Z0-9-]+)$/);
    if (zm && D.some((d) => d.id === zm[2].toLowerCase())) {
      const d = D.find((d) => d.id === zm[2].toLowerCase());
      if (zm[1] === "TOPIC") openArticle(d.id);
      else {
        markPosition(d.id, false, "qr");
        openMap(d.floor, true, d.id);
      }
      return;
    }
    try {
      const u = new URL(val, location.href),
        canonical = new URL(CANONICAL_BASE);
      const cleanPath = (x) => x.replace(/index\.html$/, "").replace(/\/$/, "");
      const canonicalMatch =
        u.protocol === "https:" &&
        u.hostname === canonical.hostname &&
        cleanPath(u.pathname) === cleanPath(canonical.pathname);
      const localMatch =
        u.origin === location.origin &&
        cleanPath(u.pathname) === cleanPath(location.pathname) &&
        (u.protocol === "https:" ||
          (u.protocol === "http:" &&
            ["localhost", "127.0.0.1", "[::1]"].includes(u.hostname)));
      if (!u.username && !u.password && (canonicalMatch || localMatch)) {
        if (!u.search) {
          nav("home");
          return;
        }
        if (!applyDeepLink(u.searchParams)) showQR(t("qrInvalid"));
        return;
      }
      if (u.protocol === "https:" && !u.username && !u.password) {
        const box = $("qr-result");
        box.classList.remove("hidden");
        box.replaceChildren();
        const p = document.createElement("p");
        p.textContent = t("qrExternal");
        const a = document.createElement("a");
        a.href = u.href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "source";
        a.textContent = t("openOfficial");
        box.append(p, a);
        return;
      }
    } catch {}
    showQR(t("qrInvalid"));
  }
  async function decode(canvas) {
    if (window.jsQR) {
      try {
        const c = canvas.getContext("2d", { willReadFrequently: true });
        const data = c.getImageData(0, 0, canvas.width, canvas.height);
        const out = window.jsQR(data.data, data.width, data.height, {
          inversionAttempts: "attemptBoth",
        });
        if (out) return out.data;
      } catch (e) {}
    }
    if ("BarcodeDetector" in window) {
      try {
        const detector = new BarcodeDetector({ formats: ["qr_code"] });
        const codes = await detector.detect(canvas);
        if (codes.length) return codes[0].rawValue;
      } catch (e) {}
    }
    return null;
  }
  function stopCamera() {
    if (state.scanLoop) cancelAnimationFrame(state.scanLoop);
    state.scanLoop = null;
    const s = state.scan;
    if (s) {
      s.getTracks().forEach((track) => track.stop());
      state.scan = null;
    }
    const video = $("qr-video");
    video.pause();
    video.srcObject = null;
    $("scan-video-box").classList.remove("streaming");
    if (state.page === "scan") $("scan-state").textContent = t("qrStopped");
    state.qrBusy = false;
  }
  async function openCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast(t("qrCameraError"));
      return;
    }
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      if (state.page !== "scan") {
        stream.getTracks().forEach((x) => x.stop());
        return;
      }
      state.scan = stream;
      const video = $("qr-video");
      video.srcObject = stream;
      await video.play();
      $("scan-state").textContent = t("cameraStarted");
      $("scan-video-box").classList.add("streaming");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      let last = 0;
      const tick = async (now) => {
        if (!state.scan || state.page !== "scan") return;
        if (!state.qrBusy && now - last > 140 && video.videoWidth) {
          last = now;
          state.qrBusy = true;
          try {
            const w = Math.min(700, video.videoWidth);
            canvas.width = w;
            canvas.height = Math.max(
              1,
              Math.round((video.videoHeight * w) / video.videoWidth),
            );
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const result = await decode(canvas);
            if (result) {
              parseQR(result);
              return;
            }
          } catch (e) {
          } finally {
            state.qrBusy = false;
          }
        }
        state.scanLoop = requestAnimationFrame(tick);
      };
      state.scanLoop = requestAnimationFrame(tick);
    } catch (e) {
      toast(t("qrCameraError"));
      showQR(t("qrCameraError"));
      stopCamera();
    }
  }
  async function scanFile(file) {
    if (!file) return;
    showQR(t("qrBusy"));
    try {
      const blobURL = URL.createObjectURL(file);
      const im = new Image();
      try {
        await new Promise((res, rej) => {
          im.onload = res;
          im.onerror = rej;
          im.src = blobURL;
        });
        const cn = document.createElement("canvas");
        const w = Math.min(1500, im.naturalWidth);
        cn.width = w;
        cn.height = Math.max(
          1,
          Math.round((im.naturalHeight * w) / im.naturalWidth),
        );
        cn.getContext("2d", { willReadFrequently: true }).drawImage(
          im,
          0,
          0,
          cn.width,
          cn.height,
        );
        const val = await decode(cn);
        if (val) parseQR(val);
        else showQR(t("qrFileError"));
      } finally {
        URL.revokeObjectURL(blobURL);
      }
    } catch (e) {
      showQR(t("qrFileError"));
    }
  }
  function syncEvents() {
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-catalog-site]");
      if (b) {
        state.catalogSite = b.dataset.catalogSite;
        renderCatalog();
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-low-walking]")) {
        guideContext.preferences = {
          ...(guideContext.preferences || {}),
          lowWalking: !guideContext.preferences?.lowWalking,
        };
        renderPlan();
      }
    });

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("button,[data-route-open],[data-map-topic]");
      if (!btn) return;
      if (btn.matches("[data-go]")) {
        nav(btn.dataset.go);
        return;
      }
      if (btn.matches("[data-back]")) {
        back();
        return;
      }
      if (btn.matches("[data-open-floor]")) {
        openTopics(Number(btn.dataset.openFloor));
        return;
      }
      if (btn.matches("[data-topic]")) {
        openArticle(btn.dataset.topic);
        return;
      }
      if (btn.matches("[data-artifact]")) {
        openArtifact(btn.dataset.artifact);
        return;
      }
      if (btn.matches("[data-set-here]")) {
        markPosition(btn.dataset.setHere, false, "manual");
        renderMap();
        return;
      }
      if (btn.matches("[data-set-floor-here]")) {
        markPosition("floor-" + btn.dataset.setFloorHere, false, "manual");
        renderMap();
        return;
      }
      if (btn.matches("[data-floor]")) {
        state.floor = Number(btn.dataset.floor);
        state.mapSelected = null;
        renderMap();
        return;
      }
      if (btn.matches("[data-map-topic]")) {
        state.mapSelected = btn.dataset.mapTopic;
        renderMap();
        return;
      }
      if (btn.matches("[data-search-id]")) {
        openArticle(btn.dataset.searchId);
        return;
      }
      if (btn.matches("[data-min]")) {
        state.time = Number(btn.dataset.min);
        guideContext.preferences = {
          ...(guideContext.preferences || {}),
          minutes: state.time,
        };
        renderPlan();
        return;
      }
      if (btn.matches("[data-interest]")) {
        const k = btn.dataset.interest;
        state.interests.has(k)
          ? state.interests.delete(k)
          : state.interests.add(k);
        guideContext.preferences = {
          ...(guideContext.preferences || {}),
          interest: [...state.interests][0] || null,
          excluded: (guideContext.preferences?.excluded || []).filter(
            (tag) => !state.interests.has(tag),
          ),
        };
        renderPlan();
        return;
      }
      if (btn.matches("[data-pace]")) {
        state.pace = btn.dataset.pace;
        renderPlan();
        return;
      }
      if (btn.matches("[data-route-open]")) {
        openArticle(btn.dataset.routeOpen);
        return;
      }
      if (btn.matches("[data-route-done]")) {
        if (!state.route) return;
        const id = btn.dataset.routeDone;
        state.route.done = state.route.done.includes(id)
          ? state.route.done.filter((x) => x !== id)
          : [...state.route.done, id];
        saveRoute();
        renderRoute();
        return;
      }
      if (btn.matches("[data-chat-sample]")) {
        sendMessage(t(btn.dataset.chatSample));
        return;
      }
      if (btn.matches("[data-chat-question]")) {
        sendMessage(btn.dataset.chatQuestion);
        return;
      }
      if (btn.matches("[data-reply-action]")) {
        const a = btn.dataset.replyAction;
        if (a.startsWith("map:")) openMap(Number(a.split(":")[1]));
        else if (a.startsWith("article:")) openArticle(a.split(":")[1]);
        else if (a.startsWith("artifact:")) openArtifact(a.split(":")[1]);
        else nav(a);
        return;
      }
      if (btn.matches("[data-demo-code]")) {
        parseQR(btn.dataset.demoCode);
        return;
      }
      if (btn.matches("[data-lang]")) {
        state.lang = btn.dataset.lang;
        updateTranslations();
        return;
      }
    });
    $("lang-switch").addEventListener("click", () => {
      $("lang-overlay").classList.remove("hidden");
    });
    $("language-start").addEventListener("click", () => {
      enterLanguage();
    });
    $("top-info").addEventListener("click", () => nav("info"));
    $("catalog-input").addEventListener("input", renderCatalog);
    $("catalog-floor").addEventListener("click", () => nav("floors"));
    $("artifact-speak").addEventListener("click", () => {
      const a = A.find((x) => x.id === state.artifact);
      speakText(aname(a) + ". " + asummary(a));
    });
    $("artifact-share").addEventListener("click", async () => {
      const url =
        CANONICAL_BASE + "?artifact=" + encodeURIComponent(state.artifact);
      try {
        if (navigator.share)
          await navigator.share({ title: document.title, url });
        else {
          await navigator.clipboard.writeText(url);
          toast(human("Đã sao chép link hiện vật", "Artifact link copied"));
        }
      } catch (e) {
        toast(url);
      }
    });
    $("artifact-map").addEventListener("click", () => {
      const a = A.find((x) => x.id === state.artifact);
      const d = D.find((x) => x.id === a.topic);
      openMap(d.floor, true, d.id);
    });
    $("home-search-btn").addEventListener("click", () => {
      $("search-input").value = "";
      nav("search");
      $("search-input").focus();
    });
    $("home-mic").addEventListener("click", () => {
      nav("search");
      speechToInput($("search-input"));
    });
    $("hero-plan").addEventListener("click", () => nav("plan"));
    $("topics-map").addEventListener("click", () => openMap(state.floor));
    $("topics-scan").addEventListener("click", () => nav("scan"));
    $("article-pin").addEventListener("click", () => {
      const d = D.find((x) => x.id === state.topic);
      openMap(d.floor, true, d.id);
    });
    $("article-chat").addEventListener("click", () => {
      const d = D.find((x) => x.id === state.topic);
      nav("guide");
      sendMessage(nm(d));
    });
    $("article-add").addEventListener("click", () => {
      if (!state.route)
        state.route = {
          ids: [],
          done: [],
          time: 30,
          pace: "relaxed",
          interests: [],
        };
      if (!state.route.ids.includes(state.topic))
        state.route.ids.push(state.topic);
      saveRoute();
      toast(t("saveOk"));
    });
    $("article-speak").addEventListener("click", () => {
      const d = D.find((x) => x.id === state.topic);
      speakText(nm(d) + ". " + ds(d));
    });
    $("map-open-topic")?.addEventListener("click", () => {});
    $("map-list").addEventListener("click", () => openTopics(state.floor));
    $("map-scan").addEventListener("click", () => nav("scan"));
    $("search-input").addEventListener("input", () => renderSearch());
    $("search-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = $("search-input").value;
        const artifacts = artifactSearch(q),
          topics = getSearch(q);
        if (
          artifacts.length &&
          (!topics.length ||
            artifactScore(artifacts[0], q) >= searchScore(topics[0], q))
        )
          openArtifact(artifacts[0].id);
        else if (topics.length) openArticle(topics[0].id);
      }
    });
    $("search-mic").addEventListener("click", () =>
      speechToInput($("search-input")),
    );
    $("plan-build").addEventListener("click", buildRoute);
    $("chat-form").addEventListener("submit", (e) => {
      e.preventDefault();
      sendMessage($("chat-input").value);
    });
    $("chat-mic").addEventListener("click", () =>
      speechToInput($("chat-input"), true),
    );
    $("scan-start").addEventListener("click", openCamera);
    $("scan-stop").addEventListener("click", () => {
      stopCamera();
      showQR(t("qrStopped"));
    });
    $("scan-demo-btn").addEventListener("click", () => {
      $("qr-codes").classList.toggle("hidden");
      renderSamples();
    });
    $("scan-upload-btn").addEventListener("click", () => $("qr-file").click());
    $("qr-file").addEventListener("change", (e) => {
      scanFile(e.target.files?.[0]);
      e.target.value = "";
    });
    $("qr-manual-go").addEventListener("click", () =>
      parseQR($("qr-manual").value),
    );
    $("qr-manual").addEventListener("keydown", (e) => {
      if (e.key === "Enter") parseQR(e.target.value);
    });
    $("ai-endpoint-save").addEventListener("click", () => {
      const val = $("ai-endpoint").value.trim();
      if (val && !safeEndpoint(val)) {
        toast(
          human(
            "Nhập URL HTTPS hợp lệ, không chứa khóa hoặc thông tin đăng nhập.",
            "Use a valid HTTPS URL without credentials or keys.",
            "키나 로그인 정보가 없는 HTTPS URL을 입력하세요.",
            "请输入不含密钥或登录信息的有效HTTPS地址。",
          ),
        );
        return;
      }
      persist("museum_ai_endpoint", val);
      state.guideMode = "offline";
      toast(t(val ? "endpointSaved" : "endpointClear"));
      renderGuide();
    });
    window.addEventListener("pagehide", stopCamera);
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("#map-open-topic") && state.mapSelected)
      openArticle(state.mapSelected);
  });
  document.addEventListener(
    "error",
    (e) => {
      if (e.target.tagName === "IMG" && e.target.closest(".photo-wrap")) {
        e.target.style.display = "none";
        const n = e.target.nextElementSibling;
        if (n) n.hidden = false;
      }
    },
    true,
  );
  document.addEventListener("keydown", (e) => {
    if (
      (e.key === "Enter" || e.key === " ") &&
      e.target.matches("[data-map-topic],[data-route-open]")
    ) {
      e.preventDefault();
      e.target.click();
    }
    if (
      e.key === "Escape" &&
      $("lang-overlay").classList.contains("hidden") &&
      state.page !== "home"
    )
      back();
  });
  restoreRoute();
  syncEvents();
  updateTranslations();
  resetGuide();
  $("lang-overlay").classList.toggle("hidden", state.confirmed);
  if (state.confirmed)
    applyDeepLink(new URLSearchParams(location.search), false);

  window.Museum = {
    state,
    D,
    A,
    S,
    t,
    nm,
    ds,
    label,
    human,
    nav,
    openArtifact,
    openArticle,
    openMap,
    renderPage,
    renderCatalog,
    renderSearch,
    renderGuide,
    renderPlan,
    renderMap,
    renderArtifact,
    renderArticle,
    updateTranslations,
    sendMessage,
    parseQR,
    markPosition,
    speakText,
    toast,
    esc,
    norm,
    sv,
    persist,
    guideContext,
    replyKnowledge,
    buildRoute,
    saveRoute,
    getSearch,
    searchScore,
    levens,
    qrSrc,
    aname,
    asummary,
    ameta,
    artifactSearch,
    artifactScore,
    CANONICAL_BASE,
    applyDeepLink,
    modeLabel,
    stopCamera,
  };
})();
