import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import '../visit-events.js';
const E = globalThis.MuseumVisitEvents;
const NOW = Date.parse('2026-11-19T10:00:00+07:00');
const SOURCE = 'https://baotangdanang.vn/danh-cho-du-khach/su-kien';
const verifiedAt = '2026-11-19T08:00:00+07:00';
const event = changes => ({ id: 'test-event', date: '2026-11-20', start: '2026-11-20T09:00:00+07:00', end: '2026-11-20T17:00:00+07:00', timezone: 'Asia/Saigon', title: { vi: 'Sự kiện kiểm thử tổng hợp', en: 'Synthetic test event' }, summary: { vi: 'Chỉ dùng để kiểm thử, không phải lịch thật.' }, sourceUrl: SOURCE, publishedAt: '2026-11-18T10:00:00+07:00', verifiedAt, ...changes });
const dataset = events => ({ schemaVersion: 1, timezone: 'Asia/Saigon', sourceUrl: SOURCE, publishedAt: null, verifiedAt, events });
const upcoming = rows => E.upcomingEvents(E.normalizeData(dataset(rows), NOW), NOW);

test('published dataset contains no invented future events or verification date', () => {
  const raw = JSON.parse(readFileSync(new URL('../data/events.json', import.meta.url)));
  assert.deepEqual(raw.events, []);
  assert.equal(raw.verifiedAt, null);
  assert.equal(raw.verificationStatus, 'unavailable');
  const valid = E.normalizeData(raw, NOW);
  assert.deepEqual(E.upcomingEvents(valid, NOW), []);
  assert(valid.contextImage);
  assert(existsSync(new URL('../' + valid.contextImage.src, import.meta.url)));
});

test('museum date follows Asia/Saigon even when UTC and host date differ', () => {
  assert.equal(E.dateInMuseumTimezone('2026-11-19T16:59:59Z'), '2026-11-19');
  assert.equal(E.dateInMuseumTimezone('2026-11-19T17:00:00Z'), '2026-11-20');
  assert.equal(E.dateInMuseumTimezone('2026-12-31T18:00:00Z'), '2027-01-01');
});

test('future and ongoing records remain, finished records are excluded and sorted', () => {
  const rows = [event({ id: 'tomorrow' }), event({ id: 'finished', date: '2026-11-19', start: '2026-11-19T08:00:00+07:00', end: '2026-11-19T09:00:00+07:00' }), event({ id: 'ongoing', date: '2026-11-19', start: '2026-11-19T09:00:00+07:00', end: '2026-11-19T11:00:00+07:00' })];
  assert.deepEqual(upcoming(rows).map(e => e.id), ['ongoing', 'tomorrow']);
});

test('all-day records expire at museum midnight without assuming hours', () => {
  const allDay = event({ date: '2026-11-19', start: null, end: null });
  const valid = E.normalizeData(dataset([allDay]), NOW);
  assert.equal(E.upcomingEvents(valid, Date.parse('2026-11-19T16:59:59Z')).length, 1);
  assert.equal(E.upcomingEvents(valid, Date.parse('2026-11-19T17:00:00Z')).length, 0);
});

test('invalid dates, local times without offset, mismatched days and reversed times are rejected', () => {
  for (const changes of [{ date: '2026-02-30' }, { start: '2026-11-20T25:00:00+07:00' }, { start: '2026-11-20T09:00:00' }, { date: '2026-11-21' }, { end: '2026-11-20T08:00:00+07:00' }, { start: null }, { timezone: 'UTC' }]) {
    assert.equal(E.normalizeData(dataset([event(changes)]), NOW).events.length, 0);
  }
});

test('only official HTTPS event sources without credentials or custom ports are accepted', () => {
  for (const sourceUrl of ['https://baotangdanang.vn.evil.example/events', 'http://baotangdanang.vn/events', 'javascript:alert(1)', 'https://secret@baotangdanang.vn/events', 'https://baotangdanang.vn:444/events']) {
    assert.equal(E.normalizeData(dataset([event({ sourceUrl })]), NOW).events.length, 0);
  }
  assert.throws(() => E.normalizeData({ ...dataset([]), sourceUrl: 'https://evil.example' }, NOW));
});

test('records require real publication and verification metadata without hiding older verified future events', () => {
  for (const changes of [{ verifiedAt: null }, { publishedAt: null }, { verifiedAt: '2026-12-01T00:00:00Z' }, { publishedAt: '2026-11-19T09:00:00+07:00' }]) assert.equal(E.normalizeData(dataset([event(changes)]), NOW).events.length, 0);
  const olderVerified = upcoming([event({ verifiedAt: '2026-10-01T00:00:00Z', publishedAt: '2026-09-30T00:00:00Z' })]);
  assert.equal(olderVerified.length, 1);
  assert.equal(olderVerified[0].verifiedAt, '2026-10-01T00:00:00Z');
  assert.throws(() => E.normalizeData({ ...dataset([event()]), verifiedAt: null }, NOW));
});

test('unverified event imagery and unsafe image paths are never used', () => {
  const alt = { vi: 'Ảnh kiểm thử' };
  const valid = E.normalizeData(dataset([event({ images: [{ src: 'assets/events/real.webp', sourceUrl: SOURCE, alt, verifiedSource: true }, { src: 'assets/events/../secret.png', sourceUrl: SOURCE, alt, verifiedSource: true }, { src: 'https://evil.example/track.png', sourceUrl: SOURCE, alt, verifiedSource: true }, { src: 'assets/events/unverified.webp', sourceUrl: SOURCE, alt }] })]), NOW);
  assert.equal(valid.events[0].images.length, 1);
});

test('duplicate IDs are rejected and unknown source translations are preserved without fabrication', () => {
  const rows = E.normalizeData(dataset([event(), event()]), NOW);
  assert.equal(rows.events.length, 1);
  assert.equal(rows.rejectedCount, 1);
  assert.equal(rows.events[0].title.ko, undefined);
  for (const lang of ['vi', 'en', 'ko', 'zh']) assert(E.formatDate('2026-11-20T09:00:00+07:00', lang, true).length > 0);
});

test('loader stays lazy, deduplicates requests and reports ready only for valid JSON', async () => {
  let calls = 0;
  const loader = E.createLoader({ fetcher: async () => { calls++; return new Response(JSON.stringify({ ...dataset([]), verifiedAt: null })); } });
  assert.equal(calls, 0);
  assert.equal(loader.state.phase, 'idle');
  await Promise.all([loader.load(), loader.load()]);
  assert.equal(calls, 1);
  assert.equal(loader.state.phase, 'ready');
  await loader.load(); assert.equal(calls, 1);
});

test('failed load clears old content and retry can recover after synchronous or HTTP failure', async () => {
  let calls = 0;
  const loader = E.createLoader({ fetcher: () => { calls++; if (calls === 1) throw Error('network failed'); return Promise.resolve(new Response(JSON.stringify({ ...dataset([]), verifiedAt: null }))); } });
  await assert.rejects(loader.load());
  assert.equal(loader.state.phase, 'error'); assert.equal(loader.state.data, null);
  await loader.load(true); assert.equal(loader.state.phase, 'ready'); assert.equal(calls, 2);
  const bad = E.createLoader({ fetcher: async () => new Response('offline fallback', { status: 503 }) });
  await assert.rejects(bad.load()); assert.equal(bad.state.phase, 'error'); assert.equal(bad.state.data, null);
});

test('malformed and oversized cached responses cannot become an events schedule', async () => {
  for (const text of ['<html>offline shell</html>', ' '.repeat(100001)]) {
    const loader = E.createLoader({ fetcher: async () => new Response(text) });
    await assert.rejects(loader.load()); assert.equal(loader.state.phase, 'error');
  }
});
