import test from 'node:test';
import assert from 'node:assert/strict';
import '../visitor.js';
const V=globalThis.MuseumVisitor;
test('nicknames preserve Vietnamese and emoji, normalize whitespace and reject empty or excessive names',()=>{
 assert.equal(V.clean('  Hòa   🌼  '),'Hòa 🌼');assert.equal(V.validate(' '),'empty');assert.equal(V.validate('あ'.repeat(31)),'long');
 assert.equal(V.validate('👩‍👩‍👦'.repeat(30)),'');assert.equal(V.clean('Hòa\u202e'),'Hòa');
});
test('identity remains usable for the session with blocked storage and never requires an account',()=>{
 assert.equal(V.isReady(),false);assert.equal(V.save('Hòa'),false);assert.equal(V.getName(),'Hòa');assert.equal(V.isReady(),true);
 V.save('');assert.equal(V.getName(),'');assert.equal(V.isReady(),true);
});
