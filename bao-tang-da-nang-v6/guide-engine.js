/* Shared intent/slot resolver. It does not train a model or invent museum facts.
 * Used by the local assistant and optional Worker with the same source records. */
((root) => {
  "use strict";
  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .normalize("NFC")
      .replace(/đ/g, "d")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim()
      .replace(/\s+/g, " ");
  const colloquial = (text, lang) => {
    let q = normalize(text);
    if (lang === "vi")
      q = q
        .replace(/\b(k|ko|khg|hok|hong|hem)\b/g, "khong")
        .replace(/\b(dc|dk)\b/g, "duoc")
        .replace(/\b(mik|mk|minh)\b/g, "minh")
        .replace(/\b(vay|zay|z)\b/g, "vay")
        .replace(/\b(j)\b/g, "gi");
    return q;
  };
  const aliases = {
    "sung-than-cong": ["sung than cong", "than cong", "cannon", "대포", "古炮"],
    "ma-nao": ["ma nao", "agate", "마노", "玛瑙"],
    "sac-phong": ["sac phong", "royal edict", "칙서", "敕封"],
    "doi-bau": ["doi bau", "carrying vessels", "운반 용기", "挑担容器"],
    "bom-cbu": ["bom cbu", "cbu 55", "cbu55", "cbu"],
    "phu-dieu": ["phu dieu", "co tu relief", "목조 부조", "木雕浮雕"],
    "di-chuc": ["di chuc", "testament", "유언장", "遗嘱"],
    "canh-cua": ["canh cua", "prison doors", "감옥 문", "监狱门"],
    "ghe-bau": ["ghe bau", "trading boat", "무역선", "商船"],
  };
  const tags = {
    history: ["lich su", "chien tranh", "history", "war", "역사", "历史"],
    culture: ["van hoa", "dan toc", "culture", "ethnic", "문화", "文化"],
    antique: ["co vat", "do co", "antiquities", "antique", "유물", "古物"],
    family: [
      "gia dinh",
      "tre em",
      "tre nho",
      "children",
      "family",
      "kids",
      "가족",
      "어린이",
      "家庭",
      "儿童",
    ],
    modern: ["thanh pho", "do thi", "modern", "city", "도시", "城市"],
  };
  function has(q, phrase) {
    const p = normalize(phrase);
    return /[가-힣\u3400-\u9fff]/u.test(p)
      ? q.includes(p)
      : (" " + q + " ").includes(" " + p + " ");
  }
  const any = (q, phrases) => phrases.some((p) => has(q, p));
  function editDistance(a, b) {
    if (Math.abs(a.length - b.length) > 1) return 2;
    let row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const next = [i];
      for (let j = 1; j <= b.length; j++)
        next[j] = Math.min(
          next[j - 1] + 1,
          row[j] + 1,
          row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
        );
      row = next;
    }
    return row[b.length];
  }
  function entities(query, records = []) {
    const q = normalize(query),
      words = q.split(" ");
    return records
      .map((record) => {
        const names = [
          ...(record.names || []),
          ...(aliases[record.id.replace(/^artifact:/, "")] || []),
        ];
        let score = 0;
        for (const name of names) {
          const n = normalize(name);
          if (has(q, n)) score = Math.max(score, 60 + n.length);
          // A typo can identify an object when its entire distinctive multiword name is present.
          else if (/^[a-z0-9 ]+$/.test(n)) {
            const parts = n.split(" ");
            if (parts.length < 2) continue;
            for (let i = 0; i <= words.length - parts.length; i++) {
              const d = parts.reduce(
                (sum, p, j) => sum + editDistance(p, words[i + j]),
                0,
              );
              if (d === 1 && parts.some((p) => p.length >= 4))
                score = Math.max(score, 40 + n.length);
            }
          }
        }
        return { record, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
  }
  function duration(q) {
    if (/nua (tieng|gio)|half an hour|half hour|半小时|반 시간/.test(q))
      return 30;
    const h = q.match(/(?:^|\s)([12])\s*(?:tieng|gio|hours?|시간|小时)/);
    if (h) return Number(h[1]) * 60;
    const m = q.match(
      /(?:^|\D)(\d{1,3})\s*(?:phut|p\b|minutes?\b|mins?\b|분|分钟)/,
    );
    return m && Number(m[1]) > 0 && Number(m[1]) <= 180 ? Number(m[1]) : null;
  }
  function interest(q) {
    const positive = [],
      negative = [];
    for (const [tag, phrases] of Object.entries(tags))
      for (const phrase of phrases) {
        const p = normalize(phrase),
          at = q.indexOf(p);
        if (at < 0) continue;
        const prefix = q.slice(Math.max(0, at - 32), at);
        const neg =
          /(khong (thich|muon|xem|quan tam)( xem| ve)?|bo qua|not interested in|don t like|do not like|skip|싫어|不喜欢|不要)\s*$/.test(
            prefix,
          );
        (neg ? negative : positive).push(tag);
      }
    return {
      positive: [...new Set(positive)],
      negative: [...new Set(negative)],
    };
  }
  function understand(message, memory = {}, options = {}) {
    const lang = options.lang || "vi",
      q = colloquial(message, lang);
    const likes = interest(q),
      minutes = duration(q);
    const lowWalking = any(q, [
      "it di bo",
      "ngai di bo",
      "nhat di bo",
      "luoi di bo",
      "khong muon di bo",
      "khong di bo nhieu",
      "khong muon di nhieu",
      "it di chuyen",
      "khong muon leo cau thang",
      "toi met",
      "met chan",
      "dau chan",
      "xe lan",
      "less walking",
      "not much walking",
      "don t want to walk",
      "tired of walking",
      "wheelchair",
      "걷기 싫",
      "걷고 싶지",
      "걷는 게 힘들",
      "오래 걷",
      "많이 걷고",
      "적게 걷",
      "휠체어",
      "많이 걷기",
      "少走路",
      "不想走",
      "走累了",
      "轮椅",
    ]);
    const resetWalking = any(q, [
      "di bo thoai mai",
      "di nhieu cung duoc",
      "khong ngai di bo",
      "khong luoi di bo",
      "khong met",
      "walking is fine",
      "no walking limit",
      "걷기 괜찮",
      "可以多走",
      "不怕走路",
    ]);
    const preferences = {
      ...(memory.preferences || {}),
      excluded: [...(memory.preferences?.excluded || [])],
    };
    if (lowWalking) preferences.lowWalking = true;
    if (resetWalking) preferences.lowWalking = false;
    if (likes.positive.length) preferences.interest = likes.positive[0];
    for (const tag of likes.negative) {
      if (!preferences.excluded.includes(tag)) preferences.excluded.push(tag);
      if (preferences.interest === tag) preferences.interest = null;
    }
    for (const tag of likes.positive)
      preferences.excluded = preferences.excluded.filter((x) => x !== tag);
    if (minutes) preferences.minutes = minutes;
    const floor = q.match(/(?:tang|floor)\s*([123])|([123])\s*층|([一二三])楼/);
    if (floor)
      preferences.floor = Number(
        floor[1] || floor[2] || { 一: 1, 二: 2, 三: 3 }[floor[3]],
      );
    const brief = q.match(/^(?:con )?(\d{1,3})(?: thi sao| thoi|은요|呢)?$/);
    if (
      brief &&
      Number(brief[1]) > 0 &&
      Number(brief[1]) <= 180 &&
      ["route", "low-walking", "highlights"].includes(memory.activeIntent)
    )
      preferences.minutes = Number(brief[1]);
    const recognized = entities(q, options.records || []);
    const wantsFact = any(q, [
      "chat lieu",
      "lam bang",
      "nien dai",
      "nam nao",
      "co tu khi nao",
      "o dau",
      "tang nao",
      "material",
      "made of",
      "how old",
      "when",
      "where",
      "재질",
      "연대",
      "어디",
      "材质",
      "年代",
      "哪里",
    ]);
    let intent = null;
    // Visitor information and explicit facts keep the source-grounded core as authority.
    if (
      recognized.length >= 2 &&
      any(q, [
        "so sanh",
        "khac nhau",
        "compare",
        "difference",
        "비교",
        "比较",
        "区别",
      ])
    )
      intent = "compare";
    else if (recognized.length && wantsFact) intent = "fact";
    else if (lowWalking && !resetWalking) intent = "low-walking";
    else if (resetWalking) intent = "route";
    else if (
      any(q, [
        "choi quiz",
        "bat dau quiz",
        "cau do",
        "play quiz",
        "start quiz",
        "퀴즈",
        "测验",
        "问答游戏",
      ])
    )
      intent = "quiz";
    else if (
      any(q, [
        "nhat ky",
        "ghi chu chuyen di",
        "journal",
        "visit notes",
        "일지",
        "日记",
      ])
    )
      intent = "journal";
    else if (
      any(q, [
        "ban giup duoc gi",
        "ban lam duoc gi",
        "co the lam gi",
        "what can you do",
        "how can you help",
        "무엇을 할 수",
        "能做什么",
      ])
    )
      intent = "help";
    else if (
      !likes.negative.length &&
      any(q, [
        "khong muon xem",
        "chang muon xem",
        "khong thich xem",
        "khong muon tham quan",
        "chan xem",
        "khong xem hien vat",
        "dont want to look",
        "don t want to see",
        "do not want to see",
        "not interested in exhibits",
        "전시 보기 싫",
        "전시를 보고 싶지",
        "전시가 지루",
        "보기 싫",
        "不想看展",
        "不想参观",
      ])
    )
      intent = "alternatives";
    else if (
      any(q, [
        "dang xem",
        "dang xem nhat",
        "dep nhat",
        "noi bat",
        "nen xem gi",
        "nen xem cai nao",
        "xem gi truoc",
        "lan dau",
        "bat dau tu dau",
        "khong biet xem gi",
        "co gi hay",
        "goi y hien vat",
        "must see",
        "must-see",
        "best artifact",
        "recommend an artifact",
        "worth seeing",
        "highlights",
        "first visit",
        "볼만한",
        "추천 유물",
        "처음 방문",
        "值得看",
        "推荐文物",
        "必看",
        "第一次",
      ])
    )
      intent = "highlights";
    else if (
      any(q, [
        "lo trinh",
        "hanh trinh",
        "nen di",
        "tham quan gi",
        "route",
        "itinerary",
        "tour",
        "코스",
        "路线",
      ]) ||
      minutes ||
      (brief &&
        ["route", "low-walking", "highlights"].includes(memory.activeIntent))
    )
      intent = "route";
    else if (
      (likes.positive.length || likes.negative.length) &&
      ["highlights", "route", "low-walking", "preference"].includes(
        memory.activeIntent,
      )
    )
      intent = memory.activeIntent === "highlights" ? "highlights" : "route";
    else if (likes.negative.length) intent = "highlights";
    else if (recognized.length) intent = "entity";
    else if (
      any(q, [
        "anh",
        "xem anh",
        "cho xem",
        "picture",
        "photo",
        "사진",
        "照片",
      ]) &&
      memory.recommended?.length
    )
      intent = "select";
    else if (
      /^(cai |hien vat |so |thu |number |the )?(dau tien|thu nhat|thu hai|thu ba|mot|hai|ba|1|2|3|first|second|third)( ay| do| nhe| please)?$/.test(
        q,
      ) ||
      /^(첫 번째|두 번째|세 번째|第一个|第二个|第三个)$/.test(q)
    )
      intent = "select";
    else if (
      /^(tai sao|vi sao|why|왜|为什么)( lai)?( chon| goi y| recommend| 추천)?( cai do| no| that| it|这个|它)?$/.test(
        q,
      ) &&
      memory.recommended?.length
    )
      intent = "reason";
    else if (
      any(q, [
        "co cach nao khac",
        "cach khac",
        "con gi nua",
        "khac nua",
        "something else",
        "another option",
        "다른 방법",
        "还有别的",
        "换一个",
      ]) &&
      memory.activeIntent === "alternatives"
    )
      intent = "alternatives";
    if (intent === "select") {
      const ordinal = /thu ba|\bba\b|\b3\b|third|세 번째|第三个/.test(q)
        ? 2
        : /thu hai|\bhai\b|\b2\b|second|두 번째|第二个/.test(q)
          ? 1
          : 0;
      return {
        intent,
        preferences,
        selected: memory.recommended?.[ordinal] || null,
        entities: recognized.map((x) => x.record),
        query: q,
      };
    }
    return {
      intent,
      preferences,
      entities: recognized.map((x) => x.record),
      query: q,
    };
  }
  function rank(artifacts, preferences = {}) {
    const favorites = {
      history: [
        "sung-than-cong",
        "sac-phong",
        "doi-bau",
        "canh-cua",
        "di-chuc",
        "bom-cbu",
      ],
      culture: ["ghe-bau", "phu-dieu", "ma-nao"],
      antique: ["ma-nao", "sac-phong", "sung-than-cong"],
      family: ["ghe-bau", "ma-nao", "phu-dieu"],
      modern: ["ghe-bau", "sac-phong"],
    };
    const priority = favorites[preferences.interest] || [
      "sung-than-cong",
      "ma-nao",
      "ghe-bau",
    ];
    return artifacts
      .filter(
        (a) => !(a.tags || []).some((t) => preferences.excluded?.includes(t)),
      )
      .map((a, i) => ({
        a,
        score: priority.includes(a.id) ? 100 - priority.indexOf(a.id) * 5 : 0,
        order: i,
      }))
      .sort((a, b) => b.score - a.score || a.order - b.order)
      .slice(0, 3)
      .map((x) => x.a);
  }
  root.MuseumGuideEngine = Object.freeze({
    normalize,
    colloquial,
    understand,
    entities,
    rank,
    duration,
  });
})(globalThis);
