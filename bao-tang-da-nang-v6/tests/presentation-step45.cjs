'use strict';

const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const BASE = process.env.MUSEUM_TEST_URL || 'http://127.0.0.1:8878/bao-tang-da-nang-v6/';
const demos = ['hv-khuyen-tai-ba-mau-f7a824', 'phu-dieu', 'sung-than-cong'];

async function start(page, lang = 'vi') {
  await page.waitForFunction(() => window.MuseumJourneyCard && !document.getElementById('boot-status'));
  if (await page.locator('#lang-overlay').isVisible()) {
    await page.locator(`[data-lang=${lang}]`).click();
    await page.locator('#visitor-guest').click();
  }
}
async function photos(stage) {
  await stage.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
}
async function box(control) {
  await control.scrollIntoViewIfNeeded();
  return control.boundingBox();
}
async function drag(client, x, y, dx, dy) {
  const point = (x, y) => [{ x: Math.round(x), y: Math.round(y), id: 1 }];
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: point(x, y) });
  for (let step = 1; step <= 8; step++) {
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: point(x + step * dx / 8, y + step * dy / 8) });
    await new Promise(resolve => setTimeout(resolve, 16));
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, reducedMotion: 'no-preference', acceptDownloads: true });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push({ text: message.text(), url: message.location().url }); });
    await page.goto(BASE + 'share/');
    await page.locator('.then-now-stage:visible').last().waitFor();
    assert.equal(await page.locator('article').count(), 200);
    assert.equal(await page.locator('.then-now-stage:visible').count(), 3);
    for (const stage of await page.locator('.then-now-stage').all()) await photos(stage);
    await page.evaluate(() => caches.open('museum-v7-obsolete-shell'));
    console.log('PASS subpath share page exposes three working comparisons alongside 200 records');

    await page.getByRole('link', { name: 'Phù điêu Cơ Tu · Mở hồ sơ' }).click();
    await start(page);
    const stage = page.locator('#page-artifact .then-now-stage');
    const range = stage.getByRole('slider');
    await stage.waitFor();
    await photos(stage);
    assert.equal(await range.inputValue(), '50');
    await range.press('ArrowRight');
    assert.equal(await range.inputValue(), '51');
    const { x, y, width, height } = await box(stage);
    const gesture = await context.newCDPSession(page);
    await drag(gesture, x + width / 2, y + height / 2, width * .3, 1);
    assert.ok(Number(await range.inputValue()) >= 77);
    const beforePan = await range.inputValue();
    const scrollTop = () => page.locator('#page-artifact').evaluate(element => element.scrollTop);
    const scrollBefore = await scrollTop();
    await drag(gesture, x + width * .65, y + height / 2, 2, -130);
    await page.waitForFunction(previous => Math.abs(document.querySelector('#page-artifact').scrollTop - previous) > 15, scrollBefore);
    assert.equal(await range.inputValue(), beforePan);
    const mouseBox = await box(stage);
    await page.mouse.move(mouseBox.x + mouseBox.width * .5, mouseBox.y + mouseBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(mouseBox.x + mouseBox.width * .25, mouseBox.y + mouseBox.height / 2, { steps: 5 });
    await page.mouse.up();
    assert.equal(await range.inputValue(), '25');
    console.log('PASS drag with touch and mouse, arrow keys, and vertical touch scrolling');

    await page.goto(BASE + 'share/');
    await page.getByRole('link', { name: 'Làm quiz' }).click();
    await page.locator('#page-quiz.active').waitFor();
    const answer = await page.evaluate(() => MuseumLearning.quiz(Museum.A, Museum.state.lang)[0].answer);
    await page.locator(`[data-quiz-choice="${(answer + 1) % 4}"]`).click();
    assert.equal(await page.locator('.demo-confetti').count(), 0);
    await page.evaluate(() => document.querySelector('[data-personal="start-quiz"]').click());
    await page.locator(`[data-quiz-choice="${answer}"]`).click();
    await page.locator('.demo-confetti').waitFor({ state: 'attached' });
    await page.locator('.demo-confetti').waitFor({ state: 'detached' });
    await page.evaluate(ids => {
      window.newBadges = 0;
      document.addEventListener('museum:badgeearned', () => newBadges++);
      for (const id of ids) Museum.openArtifact(id);
    }, demos);
    assert.ok(await page.evaluate(() => newBadges > 0));
    await page.locator('.demo-confetti').waitFor({ state: 'attached' });
    const earned = await page.evaluate(() => newBadges);
    await page.evaluate(ids => { for (const id of ids) Museum.openArtifact(id); }, demos);
    assert.equal(await page.evaluate(() => newBadges), earned);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('.demo-confetti').waitFor({ state: 'detached' });
    await page.evaluate(() => document.querySelector('[data-personal="start-quiz"]').click());
    await page.locator(`[data-quiz-choice="${answer}"]`).click();
    assert.equal(await page.locator('.demo-confetti').count(), 0);
    console.log('PASS correct answers and newly earned badges celebrate once, with reduced motion respected');

    await page.goto(BASE + '?pwa=1&demo-panel=journey');
    await page.locator('#page-profile.active').waitFor();
    await page.waitForFunction(() => navigator.serviceWorker.controller && document.getElementById('pwa-offline-state')?.textContent.startsWith('Đã sẵn sàng'), null, { timeout: 60_000 });
    assert.equal(await page.evaluate(async () => (await caches.keys()).includes('museum-v7-obsolete-shell')), false);
    await context.setOffline(true);
    await page.goto(BASE + 'share/?lang=en');
    await page.locator('.then-now-stage:visible').last().waitFor();
    assert.equal(await page.locator('.then-now-tag-before').first().textContent(), 'Then');
    for (const stage of await page.locator('.then-now-stage').all()) await photos(stage);
    await page.getByRole('link', { name: 'Phù điêu Cơ Tu · Mở hồ sơ' }).click();
    await page.locator('#prepared-narration [data-pocket-play]').waitFor();
    const failures = await page.evaluate(async () => {
      const images = Museum.A.map(record => record.image);
      const failed = [];
      let next = 0;
      await Promise.all(Array.from({ length: 8 }, async () => {
        while (next < images.length) {
          const path = images[next++];
          const photo = new Image();
          photo.src = path;
          try {
            await photo.decode();
            if (Math.min(photo.naturalHeight, photo.naturalWidth) < 128) failed.push(path);
          } catch { failed.push(path); }
        }
      }));
      return { count: images.length, failed };
    });
    assert.deepEqual(failures, { count: 200, failed: [] });
    const rangeResult = await page.evaluate(async () => {
      const response = await fetch('./audio/relief-vi-quick.mp3', { headers: { Range: 'bytes=0-1' } });
      return [response.status, (await response.arrayBuffer()).byteLength];
    });
    assert.deepEqual(rangeResult, [206, 2]);

    for (const [language, label] of [['vi', 'Xưa'], ['en', 'Then'], ['ko', '과거'], ['zh', '过去']]) {
      await page.evaluate(() => Museum.nav('home'));
      await page.locator('#lang-switch').click();
      await page.locator(`[data-lang=${language}]`).click();
      await page.locator('#language-start').click();
      await page.evaluate(() => Museum.openArtifact('phu-dieu'));
      await photos(stage);
      await page.waitForFunction(label => document.querySelector('.then-now-tag-before')?.textContent === label, label);
      await page.evaluate(() => Museum.nav('profile'));
      await page.locator('[data-card-create]').click();
      await page.waitForFunction(() => MuseumJourneyCard.getBlob()?.size > 10000);
      const size = await page.locator('.journey-card-preview').evaluate(async image => {
        await image.decode();
        return [image.naturalWidth, image.naturalHeight];
      });
      assert.deepEqual(size, [1620, 2880]);
    }
    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('[data-card-download]').click()]);
    assert.equal(download.suggestedFilename(), 'museum-journey.png');
    assert.equal(await download.failure(), null);
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'userAgent', { value: 'iPhone Safari' });
      navigator.canShare = () => true;
      navigator.share = ({ files }) => { window.sharedCard = [files[0].name, files[0].type]; };
    });
    await page.locator('[data-card-download]').click();
    assert.deepEqual(await page.evaluate(() => sharedCard), ['museum-journey.png', 'image/png']);
    const preview = page.locator('[data-card-preview]');
    assert.equal(await preview.isVisible(), true);
    assert.match(await preview.getAttribute('href'), /^blob:/);
    assert.deepEqual(errors, []);
    console.log('PASS offline share, all 200 decoded photos, MP3 206, four languages and 9:16 PNG download');
    await context.close();
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
