/* Hợp đồng cờ hoàn tất: dữ liệu hỏng không được âm thầm bỏ qua hướng dẫn. */
import test from 'node:test';
import assert from 'node:assert/strict';
import '../live-map-onboarding.js';
const O=globalThis.MuseumMapOnboarding;
test('only a supported completed or skipped record suppresses onboarding',()=>{
 assert.equal(O.isFinished({version:1,status:'completed'}),true);
 assert.equal(O.isFinished({version:1,status:'skipped'}),true);
 for(const value of [null,{},true,{version:2,status:'completed'},{version:1,status:'reset'},{version:1,status:'permission-granted'}])assert.equal(O.isFinished(value),false);
});
test('all permission, fallback and calibration messages have four explicit translations',()=>{
 for(const [key,translations]of Object.entries(O.words)){assert.equal(translations.length,4,key);assert.ok(translations.every(t=>typeof t==='string'&&t.trim()),key);}
 assert.match(O.words.disclaimer[0],/không xác định vị trí thật/);assert.match(O.words.disclaimer[1],/do not establish your real position/);assert.match(O.words.disclaimer[2],/실제 위치/);assert.match(O.words.disclaimer[3],/真实位置/);
});
