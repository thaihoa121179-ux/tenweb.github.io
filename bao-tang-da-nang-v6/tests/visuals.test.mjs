/* Ảnh phải giữ đúng danh tính và nguồn, kể cả hồ sơ tham khảo ngoài Đà Nẵng. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const content = JSON.parse(fs.readFileSync(new URL('data/museum-content.json', root)));
const app = fs.readFileSync(new URL('app.js', root), 'utf8');
const galleries = vm.runInNewContext('(' + app.match(/const GALLERY_IMAGES = (\{[\s\S]*?\n  \});/)[1] + ')');
const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const context = vm.createContext({MuseumMediaMap:content.mediaMap, Museum:{
  A:structuredClone(content.artifacts), D:content.topics, galleryImages:galleries,
  state:{lang:'vi'}, esc:escape, aname:a=>a.name, nm:d=>d.names[0],
}});
vm.runInContext(fs.readFileSync(new URL('visuals.js', root), 'utf8'), context);
const V = context.MuseumVisuals;

test('all 200 photo cards use the exact local image and original record URL', () => {
  assert.equal(content.artifacts.length, 200);
  for (const a of content.artifacts) {
    const view=V.object(a);
    assert.equal(view.id,a.id); assert.equal(view.image,a.image); assert.equal(view.source,a.url);
    assert.ok(fs.statSync(new URL(view.image,root)).isFile());
    assert.equal(view.overview,false);
    const html=V.card(view);
    assert.ok(html.includes('data-artifact="'+escape(a.id)+'"'));
    assert.ok(html.includes('src="'+escape(a.image)+'"'));
    if(a.referenceOnly) { assert.ok(view.credit.includes(a.institutionName)); assert.ok(view.credit.includes('Tham khảo')); }
  }
});

test('all 15 route topics use matching site 1 records or clearly labelled gallery images', () => {
  for (const d of content.topics) {
    const view=V.forTopic(d.id,true);
    assert.ok(view); assert.ok(fs.statSync(new URL(view.image,root)).isFile());
    if(view.kind==='artifact') {
      const a=content.artifacts.find(a=>a.id===view.id);
      assert.equal(a.topic,d.id); assert.equal(a.referenceOnly||false,false);
      assert.equal(a.sourceSite||'site1','site1'); assert.equal(view.relationship,'Hiện vật liên quan');
    } else { assert.equal(view.id,d.id); assert.equal(view.overview,true); assert.match(V.figure(view),/Ảnh minh họa chủ đề/); }
  }
});

test('unknown records and modified copies cannot substitute another photo or attribution', () => {
  assert.equal(V.object({id:'invented'}),null);
  assert.equal(V.forTopic('invented'),null);
  const real=content.artifacts[0];
  const view=V.object({...real,image:'https://untrusted.example/fake.jpg',name:'invented',url:'javascript:alert(1)'});
  assert.equal(view.image,real.image);assert.equal(view.name,real.name);assert.equal(view.source,real.url);
});

test('quiz photographs do not reveal the answer in their caption and contain the whole object', () => {
  for(const a of content.artifacts.slice(0,5)) {
    const html=V.figure(V.object(a));
    assert.ok(!html.includes(a.era)); assert.ok(!html.includes(a.summary));
    assert.match(html,/data-visual-open="artifact:/); assert.match(html,/is-object/);
  }
  const css=fs.readFileSync(new URL('visuals.css',root),'utf8');
  assert.match(css,/object-fit:contain/); assert.match(css,/prefers-reduced-motion/);
});

test('new image controls have translated labels in all four interface languages', () => {
  for(const lang of ['vi','en','ko','zh']) {
    context.Museum.state.lang=lang;
    for(const key of ['zoom','open','close','gallery','missing','reference','edit']) {
      assert.notEqual(V.t(key),key); assert.ok(V.t(key).length>0);
    }
  }
  context.Museum.state.lang='vi';
});
