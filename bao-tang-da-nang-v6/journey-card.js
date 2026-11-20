/* Thẻ PNG dựng tại máy. Tổng kết AI tùy chọn chỉ nhận ID hồ sơ. */
(() => {
  'use strict';

  const M = Museum;
  const T = MuseumExperience.t;
  const width = 540;
  const height = 960;
  const filename = 'museum-journey.png';
  const downloadLabel = () => M.human('Tải thẻ kỷ niệm', 'Download keepsake', '기념 카드 저장', '保存纪念卡');
  const previewLabel = () => M.human('Mở ảnh để lưu', 'Open image to save', '이미지를 열어 저장', '打开图片以保存');
  const institution = record => record.institutionName || record.sourceSiteLabel || 'Bảo tàng Đà Nẵng';
  const localDate = { vi: 'vi-VN', en: 'en-GB', ko: 'ko-KR', zh: 'zh-CN' };
  const fonts = '"Be Vietnam Pro", "PingFang SC", "Apple SD Gothic Neo", "Noto Sans CJK SC", sans-serif';
  let blob, imageUrl, busy = false, revision = 0;

  const section = document.createElement('section');
  section.className = 'journey-card-section';
  section.id = 'journey-card-section';

  function render() {
    const host = document.querySelector('#page-profile .personal-scroll');
    if (!host) return;
    if (!section.isConnected) (document.getElementById('discovery-missions') || host.querySelector('.personal-intro')).after(section);
    section.innerHTML = `
      <h2>${M.esc(T('card'))}</h2>
      <p>${M.esc(T('cardIntro'))}</p>
      <img class="journey-card-preview" width="540" height="960" hidden alt="${M.esc(T('card'))}">
      <p id="journey-card-state" role="status"></p>
      <div class="journey-card-buttons">
        <button class="primary" data-card-create ${busy ? 'disabled' : ''}>${M.esc(T('createCard'))}</button>
        <button class="secondary" data-card-download ${blob ? '' : 'disabled'}>${M.esc(downloadLabel())}</button>
        <button class="secondary" data-card-share ${blob ? '' : 'disabled'}>${M.esc(T('share'))}</button>
        <a class="secondary" data-card-preview target="_blank" rel="noopener" hidden>${M.esc(previewLabel())}</a>
      </div>
    `;
    if (imageUrl) {
      const preview = section.querySelector('img');
      preview.src = imageUrl;
      preview.hidden = false;
      section.querySelector('[data-card-preview]').href = imageUrl;
    }
  }

  async function load(path) {
    const image = new Image();
    image.src = new URL(path, window.MuseumAssetBaseURL).href;
    try {
      await image.decode();
      return image;
    } catch {
      return null;
    }
  }

  function wrap(ctx, text, x, y, maxWidth, step, maxLines) {
    const chunks = text.match(/[^\s\p{Script=Han}]+|\s+|\p{Script=Han}/gu) || [];
    const lines = [];
    let line = '';
    for (const chunk of chunks) {
      if (ctx.measureText(line + chunk).width > maxWidth && line) {
        lines.push(line.trimEnd());
        line = '';
      }
      if (!line && !chunk.trim()) continue;
      for (const char of chunk) {
        if (ctx.measureText(line + char).width > maxWidth && line) {
          lines.push(line.trimEnd());
          line = '';
        }
        line += char;
      }
    }
    if (line) lines.push(line.trimEnd());
    if (lines.length > maxLines) {
      let last = lines[maxLines - 1];
      while (ctx.measureText(last + '…').width > maxWidth) last = Array.from(last).slice(0, -1).join('');
      lines[maxLines - 1] = last.trimEnd() + '…';
    }
    lines.slice(0, maxLines).forEach((value, index) => ctx.fillText(value, x, y + index * step));
  }

  function panel(ctx, x, y, w, h, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, radius);
    else ctx.rect(x, y, w, h);
    ctx.fill();
  }

  function contain(ctx, image, x, y, width, height) {
    if (!image) return;
    const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
    ctx.drawImage(image, x + (width - w) / 2, y + (height - h) / 2, w, h);
  }

  async function create() {
    if (busy) return;
    busy = true;
    const token = revision;
    const lang = M.state.lang;
    const name = MuseumVisitor.getName() || M.human('Bạn đồng hành', 'Museum explorer', '박물관 탐험가', '博物馆探索者');
    const visited = MuseumProfile.getData().visits
      .filter(visit => visit.key.startsWith('artifact:'))
      .map(visit => M.A.find(record => visit.key === 'artifact:' + record.id))
      .filter(Boolean);
    const records = visited.slice(0, 3);
    const counts = new Map();
    for (const { topic } of visited) counts.set(topic, (counts.get(topic) || 0) + 1);
    const [favoriteId] = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a));
    const favorite = M.D.find(theme => theme.id === favoriteId);
    const status = () => section.querySelector('#journey-card-state');
    section.querySelector('[data-card-create]').disabled = true;
    status().textContent = M.human('Đang tạo thẻ…', 'Creating your card…', '카드를 만들고 있어요…', '正在生成卡片……');

    try {
      let summary = M.human(
        `Tôi đã tìm hiểu ${records.length} hồ sơ có nguồn. Mỗi hiện vật mở ra một góc nhìn về lịch sử và đời sống.`,
        `I explored ${records.length} sourced records, discovering perspectives on history and everyday life.`,
        `${records.length}개의 출처 있는 기록에서 역사와 생활의 새로운 관점을 살펴봤어요.`,
        `我阅读了${records.length}份有来源的档案，发现历史与生活的新视角。`,
      );
      let mode = 'data';
      const images = Promise.all([
        load('./assets/journey-story-frame.png'),
        load('./ai-robot.webp'),
        ...records.map(record => load(record.image)),
      ]);
      if (records.length && navigator.onLine) {
        try {
          const response = await MuseumExperience.api('summary', { ids: records.map(record => record.id), language: lang }, 3500);
          if (response.mode === 'generative' && typeof response.answer === 'string' && response.answer.length <= 500) {
            summary = response.answer;
            mode = 'generative';
          }
        } catch { /* Dùng câu tổng kết trên thiết bị. */ }
      }

      const [frame, robot, ...photos] = await images;
      const fontSample = [name, T('card'), summary, ...records.map(M.aname)].join(' ');
      await Promise.allSettled([400, 600, 700].map(weight => document.fonts.load(`${weight} 24px "Be Vietnam Pro"`, fontSample)));
      if (token !== revision) return;

      const scale = Math.round(Math.max(2, Math.min(devicePixelRatio || 1, 3)));
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      ctx.lang = localDate[lang];
      ctx.scale(scale, scale);
      ctx.fillStyle = '#f6f0e3';
      ctx.fillRect(0, 0, width, height);
      if (frame) ctx.drawImage(frame, 0, 0);
      panel(ctx, 27, 30, 486, 244, 19, '#153f35');

      ctx.fillStyle = '#efd5a2';
      ctx.font = `600 13px ${fonts}`;
      ctx.fillText('DA NANG MUSEUM · MÂY', 47, 65);
      ctx.fillStyle = '#fffefa';
      ctx.font = `700 36px ${fonts}`;
      wrap(ctx, T('card'), 47, 112, 440, 43, 2);
      ctx.font = `600 23px ${fonts}`;
      wrap(ctx, name, 47, 194, 340, 29, 2);
      ctx.fillStyle = '#efd5a2';
      ctx.font = `400 13px ${fonts}`;
      ctx.fillText(new Intl.DateTimeFormat(localDate[lang], { dateStyle: 'long', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()), 47, 253);
      if (robot) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(450, 218, 33, 0, 2 * Math.PI);
        ctx.clip();
        contain(ctx, robot, 417, 185, 66, 66);
        ctx.restore();
      }

      if (favorite) {
        ctx.fillStyle = '#4d675d';
        ctx.font = `400 12px ${fonts}`;
        const label = M.human('Chủ đề quan tâm: ', 'Favorite theme: ', '관심 주제: ', '喜爱主题：');
        wrap(ctx, label + M.nm(favorite), 37, 295, 466, 15, 1);
      }
      if (records.length) {
        ctx.fillStyle = '#153f35';
        ctx.font = `700 21px ${fonts}`;
        ctx.fillText(M.human('Hiện vật đã xem', 'Objects explored', '살펴본 유물', '已浏览的文物'), 37, 318);
        if (records.length === 1) {
          panel(ctx, 35, 337, 470, 326, 14, '#fffefa');
          contain(ctx, photos[0], 53, 352, 434, 221);
          ctx.fillStyle = '#203d34';
          ctx.font = `700 19px ${fonts}`;
          wrap(ctx, M.aname(records[0]), 53, 600, 434, 23, 2);
          ctx.fillStyle = '#4d675d';
          ctx.font = `400 12px ${fonts}`;
          wrap(ctx, institution(records[0]), 53, 646, 434, 15, 1);
        } else {
          const rowHeight = records.length === 2 ? 156 : 100;
          records.forEach((record, index) => {
            const y = 337 + index * (rowHeight + 13);
            panel(ctx, 35, y, 470, rowHeight, 14, '#fffefa');
            contain(ctx, photos[index], 45, y + 9, 112, rowHeight - 18);
            ctx.fillStyle = '#203d34';
            ctx.font = `700 17px ${fonts}`;
            const titleY = y + rowHeight / 2 - 20;
            wrap(ctx, M.aname(record), 171, titleY, 316, 22, 2);
            ctx.fillStyle = '#4d675d';
            ctx.font = `400 12px ${fonts}`;
            wrap(ctx, institution(record), 171, titleY + 45, 316, 15, 1);
          });
        }
      }
      if (!records.length && robot) {
        panel(ctx, 144, 365, 252, 252, 38, '#e7dfcb');
        contain(ctx, robot, 157, 378, 226, 226);
      }
      const summaryY = records.length ? 692 : 675;
      ctx.fillStyle = '#203d34';
      ctx.font = `400 18px ${fonts}`;
      wrap(ctx, summary, 39, summaryY, 462, 25, Math.min(10, Math.floor((855 - summaryY) / 25) + 1));
      ctx.fillStyle = '#4d675d';
      ctx.font = `600 12px ${fonts}`;
      wrap(ctx, mode === 'generative' ? T('generated') : T('scripted'), 39, 880, 462, 16, 1);
      ctx.font = `400 11px ${fonts}`;
      wrap(ctx, M.human(
        'Dự án độc lập · Mở hồ sơ không xác nhận đã đến hiện vật.',
        'Independent project · Opened records do not verify physical visits.',
        '독립 프로젝트 · 기록 열람은 실물 방문 확인이 아닙니다.',
        '独立项目 · 打开档案不代表实地参观。',
      ), 39, 908, 462, 15, 2);

      const png = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!png) throw new Error('canvas_png');
      if (token !== revision) return;
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      blob = png;
      imageUrl = URL.createObjectURL(png);
      render();
    } catch {
      if (token === revision) status().textContent = M.human('Chưa tạo được ảnh, hãy thử lại.', 'Could not create the image. Please retry.', '이미지를 만들지 못했습니다. 다시 시도하세요.', '暂时无法生成图片，请重试。');
    } finally {
      busy = false;
      section.querySelector('[data-card-create]').disabled = false;
    }
  }

  function download() {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    section.appendChild(link);
    link.click();
    link.remove();
  }

  async function save(shareRequested) {
    if (!blob) return;
    const appleMobile = /iP(?:hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const files = [new File([blob], filename, { type: 'image/png' })];
    const preview = section.querySelector('[data-card-preview]');
    if (appleMobile) preview.hidden = false;
    try {
      if ((shareRequested || appleMobile) && navigator.canShare?.({ files })) {
        await navigator.share({ files, title: T('card') });
        return;
      }
    } catch (error) {
      if (error.name === 'AbortError' || appleMobile) return;
    }
    if (appleMobile) preview.click();
    else download();
  }

  function reset() {
    revision++;
    blob = null;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    imageUrl = '';
    render();
  }
  section.addEventListener('click', event => {
    if (event.target.closest('[data-card-create]')) void create();
    else if (event.target.closest('[data-card-download],[data-card-share]')) void save(!!event.target.closest('[data-card-share]'));
  });
  document.addEventListener('museum:profileclear', reset);
  document.addEventListener('museum:language', reset);
  document.addEventListener('museum:navigate', () => { if (M.state.page === 'profile') render(); });
  new MutationObserver(() => { if (!section.isConnected) render(); }).observe(document.getElementById('page-profile'), { childList: true });
  render();
  window.MuseumJourneyCard = { create, render, getBlob: () => blob };
})();
