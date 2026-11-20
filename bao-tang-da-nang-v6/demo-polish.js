/* A short, non-interactive celebration for quiz answers and newly earned badges. */
(() => {
  'use strict';
  const colors = ['#eabb68', '#14705a', '#8abfa4', '#cf754c', '#f4dfb6'];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let canvas;

  function stop() {
    cancelAnimationFrame(frame);
    canvas?.remove();
    canvas = null;
  }

  function celebrate() {
    if (reduced.matches || document.hidden) return;
    stop();
    canvas = document.createElement('canvas');
    canvas.className = 'demo-confetti';
    canvas.setAttribute('aria-hidden', 'true');
    const ctx = canvas.getContext('2d');
    if (!ctx) { canvas = null; return; }
    const width = innerWidth, height = innerHeight;
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);
    (document.querySelector('dialog[open]') || document.body).appendChild(canvas);
    const particles = Array.from({ length: 36 }, (_, index) => ({
      x: width * (.35 + Math.random() * .3),
      y: height * (.38 + Math.random() * .15),
      dx: (Math.random() - .5) * 560,
      dy: -160 - Math.random() * 260,
      angle: Math.random() * Math.PI,
      spin: (Math.random() - .5) * 10,
      color: colors[index % colors.length],
    }));
    const start = performance.now();
    function draw(now) {
      const time = (now - start) / 1000;
      if (time >= 1 || reduced.matches) { stop(); return; }
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = Math.min(1, (1 - time) * 4);
      for (const bit of particles) {
        ctx.save();
        ctx.translate(bit.x + bit.dx * time, bit.y + bit.dy * time + 460 * time ** 2);
        ctx.rotate(bit.angle + bit.spin * time);
        ctx.fillStyle = bit.color;
        ctx.fillRect(-4, -3, 8, 6);
        ctx.restore();
      }
      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
  }

  document.addEventListener('museum:quizcorrect', celebrate);
  document.addEventListener('museum:badgeearned', celebrate);
  document.addEventListener('museum:mapvisit', event => { if (event.detail?.badge) celebrate(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });

  // The share page links to the same quiz and journey card used in the app.
  const panel = new URLSearchParams(location.search).get('demo-panel');
  let opened = false;
  function openPanel() {
    if (opened || !Museum.state.confirmed || !['quiz', 'journey'].includes(panel)) return;
    opened = true;
    if (panel === 'quiz') {
      document.querySelector('[data-personal="start-quiz"]').click();
    } else {
      Museum.nav('profile');
      requestAnimationFrame(() => document.getElementById('journey-card-section').scrollIntoView({ block: 'start' }));
    }
  }
  document.addEventListener('museum:ready', openPanel);
  document.addEventListener('museum:language', openPanel);
})();
