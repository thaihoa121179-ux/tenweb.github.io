import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import '../collection.js';
import '../guide-engine.js';
import {records} from '../backend/corpus.mjs';
const collection=globalThis.MuseumCollection;
const root=new URL('../',import.meta.url);
test('the actual 200-record catalogue preserves the 57 Da Nang records and complete scoped references',()=>{
  assert.equal(collection.totalCount,200);
  const artifacts=records.filter(r=>r.type==='artifact');
  assert.equal(artifacts.length,200);
  assert.equal(collection.items.filter(a=>a.referenceOnly).length,143);
  assert.equal(collection.items.filter(a=>!a.referenceOnly).length+9,57);
  const urls=new Set(),identities=new Set(),photos=new Set();
  for(const a of collection.items){
    assert.ok(!urls.has(a.url),`Repeated source ${a.url}`);urls.add(a.url);
    assert.ok(a.name&&a.summary&&a.image&&a.era&&a.material);
    const photo=fs.readFileSync(new URL(a.image,root));
    const hash=crypto.createHash('sha256').update(photo).digest('hex');
    assert.ok(!photos.has(hash),`Repeated photo for ${a.id}`);photos.add(hash);
    if(a.referenceOnly){
      assert.ok(a.institutionId&&a.institutionName&&a.accessionNumber);
      assert.equal(a.locationVerified,false);
      assert.deepEqual(a.metadataUnknown,[]);
      assert.ok(!identities.has(a.objectIdentity));identities.add(a.objectIdentity);
      assert.ok(a.metadataEvidence.era&&a.metadataEvidence.material);
    }
  }
});
test('every real object resolves by its complete source title including accession numbers',()=>{
  for(const r of records.filter(r=>r.type==='artifact')){
    const result=globalThis.MuseumGuideEngine.understand(r.names[0],{}, {records,lang:r.sourceLanguage==='en'?'en':'vi'});
    assert.ok(result.entities.some(e=>e.id===r.id),`Failed exact title: ${r.names[0]}`);
  }
});
