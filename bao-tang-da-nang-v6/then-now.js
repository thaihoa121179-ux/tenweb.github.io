/* Dùng chung cho hồ sơ tương tác và trang chia sẻ. */
(() => {
  'use strict';

  const museum = window.Museum;
  const base = museum ? window.MuseumAssetBaseURL : new URL('./../', location.href);
  const copy = {
    vi: ['Đà Nẵng xưa & nay', 'Xưa', 'Nay', 'Kéo ngang hoặc dùng phím mũi tên.', 'Minh họa theo chủ đề hiện vật.', 'Chưa tải được cặp ảnh.'],
    en: ['Da Nang then & now', 'Then', 'Now', 'Drag sideways or use the arrow keys.', 'Illustrations inspired by the object’s theme.', 'The image pair could not be loaded.'],
    ko: ['다낭의 과거와 현재', '과거', '현재', '좌우로 밀거나 방향키를 사용하세요.', '유물의 주제를 바탕으로 그린 삽화입니다.', '비교 이미지를 불러오지 못했습니다.'],
    zh: ['岘港的过去与现在', '过去', '现在', '左右拖动或使用方向键。', '根据文物主题绘制的示意图。', '无法加载对比图片。'],
  };
  let request;

  function load() {
    request ??= fetch(new URL('./data/then-now.json', base))
      .then(response => {
        if (!response.ok) throw new Error('then_now_data');
        return response.json();
      })
      .catch(error => { request = null; throw error; });
    return request;
  }

  function render(section, pair, lang) {
    const [title, before, after, hint, credit, unavailable] = copy[lang];
    section.lang = lang;
    section.innerHTML = `
      <h2></h2>
      <p class="then-now-hint"></p>
      <div class="then-now-stage">
        <img class="then-now-after" width="960" height="600" draggable="false">
        <img class="then-now-before" width="960" height="600" draggable="false">
        <span class="then-now-tag then-now-tag-before" aria-hidden="true"></span>
        <span class="then-now-tag then-now-tag-after" aria-hidden="true"></span>
        <span class="then-now-divider" aria-hidden="true"></span>
        <span class="then-now-handle" aria-hidden="true">↔</span>
        <input class="then-now-range" type="range" min="0" max="100" value="50">
      </div>
      <p class="then-now-credit"></p>
    `;
    const stage = section.querySelector('.then-now-stage');
    const slider = section.querySelector('input');
    section.querySelector('h2').textContent = title;
    section.querySelector('.then-now-hint').textContent = hint;
    section.querySelector('.then-now-credit').textContent = pair.credit?.[lang] || credit;
    section.querySelector('.then-now-tag-before').textContent = before;
    section.querySelector('.then-now-tag-after').textContent = after;
    slider.setAttribute('aria-label', title);
    function update() {
      stage.style.setProperty('--then-now-split', slider.value + '%');
      slider.setAttribute('aria-valuetext', `${before} ${slider.value}% · ${after} ${100 - slider.value}%`);
    }
    slider.addEventListener('input', update);
    update();

    for (const [index, key] of ['before', 'after'].entries()) {
      const image = section.querySelector('.then-now-' + key);
      image.alt = pair.scenes[lang][index];
      image.addEventListener('error', () => {
        stage.hidden = true;
        section.querySelector('.then-now-hint').textContent = unavailable;
      }, { once: true });
      image.src = new URL(pair[key], base).href;
    }

    // A vertical gesture stays with the scroller. Native range retains keyboard and AT controls.
    let gesture;
    function moveTo(x) {
      const rect = stage.getBoundingClientRect();
      slider.value = Math.round(100 * (x - rect.left) / rect.width);
      update();
    }
    stage.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0) return;
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, dragging: false };
      if (event.pointerType === 'mouse') {
        stage.setPointerCapture(event.pointerId);
        gesture.dragging = true;
        moveTo(event.clientX);
        slider.focus({ preventScroll: true });
      }
    });
    stage.addEventListener('pointermove', event => {
      if (gesture?.id !== event.pointerId) return;
      if (!gesture.dragging) {
        const dx = Math.abs(event.clientX - gesture.x);
        const dy = Math.abs(event.clientY - gesture.y);
        if (dy > 8 && dy > dx) { gesture = null; return; }
        if (dx < 8 || dx <= dy) return;
        gesture.dragging = true;
        stage.setPointerCapture(event.pointerId);
      }
      moveTo(event.clientX);
    });
    stage.addEventListener('pointerup', event => {
      if (gesture?.id !== event.pointerId) return;
      if (gesture.dragging || Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) < 8) moveTo(event.clientX);
      gesture = null;
    });
    for (const name of ['pointercancel', 'lostpointercapture']) {
      stage.addEventListener(name, () => { gesture = null; });
    }
  }

  async function mount(section, id, lang) {
    const key = id + ':' + lang;
    if (section.dataset.compareKey === key) return;
    section.dataset.compareKey = key;
    section.hidden = true;
    try {
      const pairs = await load();
      if (section.dataset.compareKey !== key || !Object.prototype.hasOwnProperty.call(pairs, id)) return;
      render(section, pairs[id], lang);
      section.hidden = false;
    } catch {
      if (section.dataset.compareKey === key) delete section.dataset.compareKey;
    }
  }

  if (museum) {
    const section = document.createElement('section');
    section.className = 'then-now';
    section.hidden = true;
    document.getElementById('artifact-text').after(section);
    function updateArtifact() {
      if (museum.state.page === 'artifact') mount(section, museum.state.artifact, museum.state.lang);
    }
    document.addEventListener('museum:navigate', updateArtifact);
    document.addEventListener('museum:language', updateArtifact);
    updateArtifact();
  } else {
    let stored;
    try { stored = localStorage.getItem('museum_v6:museum_language'); } catch { /* Storage can be blocked. */ }
    const requested = new URLSearchParams(location.search).get('lang');
    const lang = [requested, stored, document.documentElement.lang].find(value => Object.prototype.hasOwnProperty.call(copy, value)) || 'vi';
    document.querySelectorAll('[data-compare-artifact]').forEach(section => mount(section, section.dataset.compareArtifact, lang));
  }
})();
