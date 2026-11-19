/* Source-backed visit events. Empty data means no verified schedule, not no museum activity. */
((root) => {
  'use strict';
  const TIMEZONE = 'Asia/Saigon';
  const ZONES = new Set([TIMEZONE, 'Asia/Ho_Chi_Minh']);
  const OFFICIAL = new Set(['baotangdanang.vn', 'www.baotangdanang.vn']);
  const SOURCE = 'https://baotangdanang.vn/danh-cho-du-khach/su-kien';
  const languages = ['vi', 'en', 'ko', 'zh'];
  const locales = { vi: 'vi-VN', en: 'en-GB', ko: 'ko-KR', zh: 'zh-CN' };
  const copy = {
    vi: { heading: 'Sự kiện sắp tới', intro: 'Thêm một lý do để ghé bảo tàng.', loading: 'Đang tải lịch sự kiện…', empty: 'Lịch mới đang chờ bạn khám phá', emptyBody: 'Chưa có sự kiện sắp tới được xác minh trong ứng dụng. Xem thông báo mới nhất từ bảo tàng để lên kế hoạch ghé thăm.', error: 'Chưa tải được lịch sự kiện', errorBody: 'Bạn có thể thử lại hoặc xem trực tiếp trên website bảo tàng.', source: 'Xem lịch từ bảo tàng', eventSource: 'Thông báo chính thức', retry: 'Thử lại', reload: 'Tải lại lịch', context: 'Ảnh không gian trưng bày · không phải ảnh của một sự kiện sắp tới.', credit: 'Ảnh nguồn bảo tàng', verified: 'Đối chiếu nguồn ngày', timezone: 'Giờ Đà Nẵng · UTC+7', ongoing: 'Đang diễn ra', sourceLanguage: 'Tiêu đề theo ngôn ngữ của nguồn', offline: 'Bạn đang ngoại tuyến. Lịch đã lưu vẫn được lọc theo ngày hiện tại.' },
    en: { heading: 'Upcoming events', intro: 'One more reason to visit.', loading: 'Loading the events schedule…', empty: 'Discover what comes next', emptyBody: 'The app has no verified upcoming events yet. Check the museum’s latest announcements to plan your visit.', error: 'The schedule could not be loaded', errorBody: 'Try again or check the museum website directly.', source: 'See the museum schedule', eventSource: 'Official announcement', retry: 'Try again', reload: 'Reload schedule', context: 'Gallery photograph · not artwork for an upcoming event.', credit: 'Museum image source', verified: 'Source checked on', timezone: 'Da Nang time · UTC+7', ongoing: 'In progress', sourceLanguage: 'Title in the source language', offline: 'You are offline. Saved events are still filtered using today’s date.' },
    ko: { heading: '다가오는 행사', intro: '박물관을 방문할 또 하나의 이유.', loading: '행사 일정을 불러오는 중…', empty: '다음 소식을 만나 보세요', emptyBody: '앱에 확인된 예정 행사가 아직 없습니다. 방문 계획을 위해 박물관의 최신 공지를 확인해 주세요.', error: '행사 일정을 불러오지 못했습니다', errorBody: '다시 시도하거나 박물관 홈페이지에서 확인해 주세요.', source: '박물관 행사 일정 보기', eventSource: '공식 공지', retry: '다시 시도', reload: '일정 새로고침', context: '전시 공간 사진 · 예정 행사의 홍보 이미지가 아닙니다.', credit: '박물관 사진 출처', verified: '출처 확인일', timezone: '다낭 시간 · UTC+7', ongoing: '진행 중', sourceLanguage: '원문 언어의 제목', offline: '오프라인입니다. 저장된 행사도 현재 날짜를 기준으로 표시합니다.' },
    zh: { heading: '即将举行的活动', intro: '多一个走进博物馆的理由。', loading: '正在加载活动安排…', empty: '期待下一场精彩', emptyBody: '应用内暂无已核实的近期活动，请查看博物馆最新公告，安排参观。', error: '暂时无法加载活动安排', errorBody: '可以重试，或直接查看博物馆官方网站。', source: '查看博物馆活动安排', eventSource: '官方公告', retry: '重试', reload: '重新加载', context: '展厅照片，不是近期活动的宣传图片。', credit: '博物馆图片来源', verified: '来源核实日期', timezone: '岘港时间 · UTC+7', ongoing: '正在进行', sourceLanguage: '标题使用来源原文', offline: '当前离线。已保存的活动仍会按当前日期筛选。' },
  };
  function officialUrl(value) {
    if (typeof value !== 'string' || value.length > 2048) return null;
    try { const u = new URL(value); return u.protocol === 'https:' && OFFICIAL.has(u.hostname) && !u.port && !u.username && !u.password ? u.href : null; } catch { return null; }
  }
  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const ms = Date.parse(value + 'T00:00:00Z');
    return Number.isFinite(ms) && new Date(ms).toISOString().slice(0, 10) === value;
  }
  function instant(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !validDate(value.slice(0, 10))) return null;
    const parts = value.match(/T(\d{2}):(\d{2})(?::(\d{2}))?/);
    if (Number(parts[1]) > 23 || Number(parts[2]) > 59 || Number(parts[3] || 0) > 59) return null;
    const ms = Date.parse(value); return Number.isFinite(ms) ? ms : null;
  }
  function dateInMuseumTimezone(now = Date.now()) {
    const d = new Date(now); if (!Number.isFinite(d.getTime())) throw Error('invalid_now');
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(d);
    const get = type => parts.find(p => p.type === type).value;
    return get('year') + '-' + get('month') + '-' + get('day');
  }
  function localized(value, max) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const result = {};
    for (const lang of languages) if (typeof value[lang] === 'string' && value[lang].trim() && value[lang].length <= max) result[lang] = value[lang].trim();
    return result.vi ? result : null;
  }
  function image(value, context = false) {
    if (!value || value.verifiedSource !== true || typeof value.src !== 'string') return null;
    const local = /^assets\/(?:museum|events)\/[a-zA-Z0-9_/-]+\.(?:webp|jpe?g|png)$/.test(value.src) && !value.src.split('/').includes('..');
    const source = officialUrl(value.sourceUrl) || (context && value.sourceUrl === 'https://dnfam-website.vr360.com.vn/uploads/images/DSCF1963.webp' ? value.sourceUrl : null);
    if ((!local && !officialUrl(value.src)) || !source) return null;
    const alt = localized(value.alt, 240); if (!alt) return null;
    return { src: value.src, sourceUrl: source, alt };
  }
  function verifiedDate(value, now) { const ms = instant(value); return ms !== null && ms <= now ? ms : null; }
  function eventRecord(raw, now) {
    if (!raw || !/^[a-z0-9][a-z0-9_-]{0,79}$/.test(raw.id || '') || !validDate(raw.date) || !ZONES.has(raw.timezone)) return null;
    const title = localized(raw.title, 200), summary = localized(raw.summary, 800);
    const sourceUrl = officialUrl(raw.sourceUrl);
    const verifiedAt = verifiedDate(raw.verifiedAt, now), publishedAt = verifiedDate(raw.publishedAt, now);
    if (!title || !sourceUrl || verifiedAt === null || publishedAt === null || publishedAt > verifiedAt) return null;
    const hasStart = raw.start !== null && raw.start !== undefined, hasEnd = raw.end !== null && raw.end !== undefined;
    if (hasStart !== hasEnd) return null;
    const start = hasStart ? instant(raw.start) : null, end = hasEnd ? instant(raw.end) : null;
    if (hasStart && (start === null || end === null || end <= start || dateInMuseumTimezone(start) !== raw.date)) return null;
    return { id: raw.id, date: raw.date, start: hasStart ? raw.start : null, end: hasEnd ? raw.end : null, timezone: TIMEZONE, title, summary, sourceUrl, publishedAt: raw.publishedAt, verifiedAt: raw.verifiedAt,
      images: (Array.isArray(raw.images) ? raw.images : []).slice(0, 3).map(value => image(value)).filter(Boolean) };
  }
  function normalizeData(raw, now = Date.now()) {
    if (!raw || raw.schemaVersion !== 1 || !ZONES.has(raw.timezone) || !officialUrl(raw.sourceUrl) || !Array.isArray(raw.events) || raw.events.length > 100) throw Error('invalid_events_data');
    if (raw.verifiedAt !== null && verifiedDate(raw.verifiedAt, now) === null) throw Error('invalid_verification_date');
    if (raw.events.length && raw.verifiedAt === null) throw Error('missing_verification_date');
    const seen = new Set(), events = [];
    for (const row of raw.events) { const item = eventRecord(row, now); if (item && !seen.has(item.id)) { seen.add(item.id); events.push(item); } }
    return { schemaVersion: 1, timezone: TIMEZONE, sourceUrl: officialUrl(raw.sourceUrl), publishedAt: raw.publishedAt || null, verifiedAt: raw.verifiedAt, events, rejectedCount: raw.events.length - events.length, contextImage: image(raw.contextImage, true) };
  }
  function upcomingEvents(data, now = Date.now()) {
    const current = Number(new Date(now)); if (!Number.isFinite(current)) throw Error('invalid_now');
    const today = dateInMuseumTimezone(current);
    return data.events.filter(item => {
      const checked = verifiedDate(item.verifiedAt, current);
      if (checked === null) return false;
      return item.end ? instant(item.end) > current : item.date >= today;
    }).sort((a, b) => (instant(a.start) ?? Date.parse(a.date + 'T00:00:00+07:00')) - (instant(b.start) ?? Date.parse(b.date + 'T00:00:00+07:00')));
  }
  function formatDate(value, language = 'vi', includeTime = false) {
    const ms = instant(value) ?? (validDate(value) ? Date.parse(value + 'T12:00:00+07:00') : NaN);
    if (!Number.isFinite(ms)) return '';
    return new Intl.DateTimeFormat(locales[language] || locales.vi, { timeZone: TIMEZONE, year: 'numeric', month: 'short', day: 'numeric', ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}) }).format(new Date(ms));
  }
  function createLoader({ fetcher = root.fetch?.bind(root), url = 'data/events.json', timeoutMs = 8000 } = {}) {
    const state = { phase: 'idle', data: null }; let pending = null;
    async function load(force = false) {
      if (pending) return pending;
      if (state.phase === 'ready' && !force) return state.data;
      state.phase = 'loading'; state.data = null;
      pending = Promise.resolve().then(async () => { const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), timeoutMs);
        try { if (typeof fetcher !== 'function') throw Error('fetch_unavailable'); const response = await fetcher(url, { signal: controller.signal, cache: 'no-cache', credentials: 'same-origin' }); if (!response.ok) throw Error('events_http'); const raw = await response.text(); if (raw.length > 100000) throw Error('events_too_large'); const data = normalizeData(JSON.parse(raw)); state.data = data; state.phase = 'ready'; return data; }
        catch (error) { state.phase = 'error'; state.data = null; throw error; }
        finally { clearTimeout(timer); pending = null; }
      });
      return pending;
    }
    return { state, load };
  }
  let started = false, section = null, loader = null, expiryTimer = null;
  const lang = () => languages.includes(root.Museum?.state.lang) ? root.Museum.state.lang : 'vi';
  const words = () => copy[lang()];
  function element(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text) node.textContent = text; return node; }
  function sourceLink(url, text) { const a = element('a', 'visit-event-source', text); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; }
  function figure(photo, context) {
    const t = words(), node = element('figure', 'visit-event-photo'); const img = element('img'); img.src = photo.src; img.alt = photo.alt[lang()] || photo.alt.vi; img.loading = 'lazy'; img.decoding = 'async'; img.width = 960; img.height = 480;
    img.addEventListener('error', () => node.remove(), { once: true }); node.append(img);
    const caption = element('figcaption', '', context ? t.context + ' ' : ''); caption.append(sourceLink(photo.sourceUrl, t.credit)); node.append(caption); return node;
  }
  function render() {
    if (!section) return;
    clearTimeout(expiryTimer);
    const t = words(), language = lang(); section.replaceChildren();
    const heading = element('h2', '', t.heading); heading.id = 'visit-events-heading';
    if (root.MuseumIcons?.has('calendar')) { const icon = element('span'); icon.setAttribute('data-ui-icon', 'calendar'); icon.setAttribute('aria-hidden', 'true'); heading.prepend(icon); root.MuseumIcons.mount(icon); }
    section.append(heading, element('p', 'visit-events-intro', t.intro));
    const state = loader.state;
    section.setAttribute('aria-busy', String(state.phase === 'loading'));
    if (state.phase === 'idle' || state.phase === 'loading') { section.dataset.state = 'loading'; const status = element('p', 'visit-events-status', t.loading); status.setAttribute('role', 'status'); section.append(status); return; }
    const data = state.data, events = data ? upcomingEvents(data) : [];
    section.dataset.state = state.phase === 'error' ? 'error' : events.length ? 'ready' : 'empty';
    if (!events.length) {
      if (data?.contextImage) section.append(figure(data.contextImage, true));
      const empty = element('div', 'visit-events-empty'); empty.append(element('h3', '', state.phase === 'error' ? t.error : t.empty), element('p', '', state.phase === 'error' ? t.errorBody : t.emptyBody)); section.append(empty);
    } else {
      const list = element('div', 'visit-events-list');
      for (const item of events) {
        const card = element('article', 'visit-event-card'); if (item.images[0]) card.append(figure(item.images[0], false));
        const body = element('div', 'visit-event-body'); const date = element('time', 'visit-event-date', formatDate(item.start || item.date, language, !!item.start)); date.dateTime = item.start || item.date; body.append(date);
        if (item.end && instant(item.start) <= Date.now()) body.append(element('span', 'visit-event-live', t.ongoing));
        body.append(element('h3', '', item.title[language] || item.title.vi)); if (!item.title[language] && language !== 'vi') body.append(element('p', 'visit-events-note', t.sourceLanguage));
        if (item.summary) body.append(element('p', '', item.summary[language] || item.summary.vi));
        if (item.end) { const end = element('time', 'visit-event-end', '→ ' + formatDate(item.end, language, true)); end.dateTime = item.end; body.append(end); }
        body.append(element('p', 'visit-events-note', t.verified + ' ' + formatDate(item.verifiedAt, language)), sourceLink(item.sourceUrl, t.eventSource)); card.append(body); list.append(card);
      }
      section.append(list, element('p', 'visit-events-note', t.timezone));
    }
    if (root.navigator?.onLine === false) section.append(element('p', 'visit-events-note', t.offline));
    const actions = element('div', 'visit-events-actions'); actions.append(sourceLink(data?.sourceUrl || SOURCE, t.source)); const retry = element('button', 'visit-events-retry', state.phase === 'error' ? t.retry : t.reload); retry.type = 'button'; retry.addEventListener('click', () => load(true)); actions.append(retry); section.append(actions);
    if (data && root.Museum?.state.page === 'info') {
      const now = Date.now(), midnight = Date.parse(dateInMuseumTimezone(now) + 'T00:00:00+07:00') + 86400000;
      const boundaries = events.map(item => instant(item.end)).filter(ms => ms > now);
      expiryTimer = setTimeout(render, Math.max(100, Math.min(midnight, ...boundaries) - now + 100));
    }
  }
  async function load(force = false) { const restore = section?.contains(document.activeElement) && document.activeElement.classList.contains('visit-events-retry'); const pending = loader.load(force); render(); try { await pending; } catch { /* Explicit error and retry are rendered below. */ } render(); if (restore && root.Museum?.state.page === 'info') section.querySelector('.visit-events-retry')?.focus({ preventScroll: true }); }
  function sync() { if (!started) start(); if (root.Museum?.state.page === 'info' || document.querySelector('#page-info.active')) { if (loader?.state.phase === 'idle') load(); else render(); } else clearTimeout(expiryTimer); }
  function start() {
    if (started || !root.document || !root.Museum) return;
    const host = document.querySelector('#page-info .scroll'); if (!host) return;
    section = element('section', 'visit-events'); section.id = 'visit-events'; section.setAttribute('aria-labelledby', 'visit-events-heading'); host.append(section); loader = createLoader(); started = true;
    document.addEventListener('museum:navigate', sync); document.addEventListener('museum:language', sync); document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); }); root.addEventListener('online', sync); root.addEventListener('offline', sync);
  }
  root.MuseumVisitEvents = Object.freeze({ normalizeData, upcomingEvents, dateInMuseumTimezone, formatDate, createLoader, start, refresh: () => started ? load(true) : undefined });
  if (root.document) { document.addEventListener('museum:ready', () => { start(); sync(); }); start(); if (started) sync(); }
})(globalThis);
