/* Frozen resolver benchmark, deliberately separate from UI and generative AI quality.
 * Run: node bao-tang-da-nang-v6/tests/chat-benchmark.mjs
 * Optional --write writes the measured paired report beside this file. */
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {performance} from 'node:perf_hooks';
import assert from 'node:assert/strict';
const url=name=>new URL(name,import.meta.url);
const sha=text=>crypto.createHash('sha256').update(text).digest('hex');
const baseline=JSON.parse(fs.readFileSync(url('chat-benchmark-baseline.json'),'utf8'));
const heldoutText=fs.readFileSync(url('chat-benchmark-heldout.json'),'utf8');
const heldout=JSON.parse(heldoutText);
const HELDOUT_SHA='8a214485f53e9736f466950437532662bcc3a3a853aeabf802680c2659d6b206';
assert.equal(sha(heldoutText),HELDOUT_SHA,'Frozen held-out scenarios were edited; restore them before reporting a comparable score');
assert.equal(sha(baseline.engineSource),baseline.sourceSha256,'Baseline source checksum mismatch');
assert.equal(baseline.commit,'c391419');
assert.equal(baseline.records.filter(r=>r.type==='artifact').length,57);
assert.equal(heldout.length,80);
const source=fs.readFileSync(url('../guide-engine.js'),'utf8');
const firstFrozen=JSON.parse(fs.readFileSync(url('chat-benchmark-results-first-frozen.json'),'utf8'));
function engine(code){const context=vm.createContext({});vm.runInContext(code,context,{timeout:5000});return context.MuseumGuideEngine;}
const engines={baseline:engine(baseline.engineSource),candidate:engine(source)};
const bare=id=>String(id).replace(/^(?:artifact|topic):/,'');
const sorted=v=>[...new Set(v)].sort();
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const records=baseline.records;
const validIds=new Set(records.map(r=>bare(r.id)));
assert.equal(new Set(heldout.map(x=>x.id)).size,heldout.length);
for(const scenario of heldout)for(const id of scenario.expect.entities||[])assert.ok(validIds.has(id),`Gold entity must come from the frozen source corpus: ${id}`);
function check(actual,expect){
  const failures=[];
  for(const [key,wanted]of Object.entries(expect)){
    if(key==='entities'){
      const observed=sorted((actual.entities||[]).map(r=>bare(r.id)));
      if(!same(observed,sorted(wanted)))failures.push({key,expected:sorted(wanted),actual:observed});
    }else if(key==='preferences'){
      for(const [slot,value]of Object.entries(wanted)){
        const observed=actual.preferences?.[slot];
        if(!same(Array.isArray(value)?sorted(value):value,Array.isArray(observed)?sorted(observed):observed))failures.push({key:'preferences.'+slot,expected:value,actual:observed??null});
      }
    }else if(!same(actual[key],wanted))failures.push({key,expected:wanted,actual:actual[key]??null});
  }
  return failures;
}
function assess(e){
  const cases=[];
  for(const scenario of heldout){
    const start=performance.now();
    const decision=e.understand(scenario.message,structuredClone(scenario.memory||{}),{lang:scenario.lang,records});
    const elapsedMs=performance.now()-start;
    const failures=check(decision,scenario.expect);
    cases.push({id:scenario.id,category:scenario.category,lang:scenario.lang,passed:failures.length===0,failures,elapsedMs});
  }
  const byCategory={},byLanguage={};
  for(const c of cases)for(const [group,key]of [[byCategory,c.category],[byLanguage,c.lang]]){group[key]??={passed:0,total:0};group[key].total++;if(c.passed)group[key].passed++;}
  return {passed:cases.filter(c=>c.passed).length,total:cases.length,accuracy:cases.filter(c=>c.passed).length/cases.length,byCategory,byLanguage,cases};
}
// One warm-up pass is excluded from timing; semantic results are still assessed once per case.
for(const e of Object.values(engines))for(const scenario of heldout)e.understand(scenario.message,structuredClone(scenario.memory||{}),{lang:scenario.lang,records});
const measured={};for(const [name,e]of Object.entries(engines))measured[name]=assess(e);
const timing={};for(const [name,e]of Object.entries(engines)){
  const samples=[];for(let pass=0;pass<3;pass++)for(const scenario of heldout){const start=performance.now();e.understand(scenario.message,structuredClone(scenario.memory||{}),{lang:scenario.lang,records});samples.push(performance.now()-start)}samples.sort((a,b)=>a-b);timing[name]={samples:samples.length,medianMs:samples[Math.floor(samples.length*.5)],p95Ms:samples[Math.floor(samples.length*.95)]};
}
const b=measured.baseline,c=measured.candidate;
const gained=heldout.filter((_,i)=>!b.cases[i].passed&&c.cases[i].passed).map(s=>s.id);
const regressions=heldout.filter((_,i)=>b.cases[i].passed&&!c.cases[i].passed).map(s=>s.id);
const report={firstHeldoutEvaluation:{candidateSha256:firstFrozen.candidateEngineSha256,passed:firstFrozen.candidate.passed,total:firstFrozen.candidate.total,source:'chat-benchmark-results-first-frozen.json'},currentEvaluationUsesPreviouslySeenScenarios:sha(source)!==firstFrozen.candidateEngineSha256,postEvaluationChanges:sha(source)!==firstFrozen.candidateEngineSha256?'Independent backend integration defect: site number in co so 2 misread as ordinal; material recommendation cues. No changes from held-out failures.':'None',scope:'Deterministic intent/entity/preference/reference resolver only. Not answer factuality, generative AI quality, user satisfaction, or end-to-end app success.',methodology:'80 scenarios authored independently from baseline source and frozen source corpus. Original candidate completed and unit-checked before first held-out evaluation; immutable first results retained separately. Subsequent integration fixes, if any, are labelled above; these scenarios then serve as regression monitoring, not new unseen evidence. No changes based on held-out failures. Each scenario passes only if every annotated expectation matches. Unannotated fields are not scored. Timings use warm-up plus 3 passes on the current machine and exclude network.',baselineCommit:baseline.commit,baselineEngineSha256:baseline.sourceSha256,candidateEngineSha256:sha(source),heldoutSha256:HELDOUT_SHA,artifactCount:57,topicCount:15,scenarioCount:80,baseline:b,candidate:c,accuracyGainPercentagePoints:(c.accuracy-b.accuracy)*100,relativeTaskSuccess:c.passed/Math.max(1,b.passed),gained,regressions,timing};
console.log(`Frozen corpus: 57 artifacts / 15 themes; independent held-out: ${heldout.length} scenarios`);
console.log(`Baseline ${b.passed}/${b.total} (${(b.accuracy*100).toFixed(1)}%); candidate ${c.passed}/${c.total} (${(c.accuracy*100).toFixed(1)}%)`);
console.log(`Gain: ${report.accuracyGainPercentagePoints.toFixed(1)} percentage points; task-success ratio ${report.relativeTaskSuccess.toFixed(2)}x; regressions ${regressions.length}`);
console.log('Categories:',JSON.stringify({baseline:b.byCategory,candidate:c.byCategory},null,2));
console.log('Languages:',JSON.stringify({baseline:b.byLanguage,candidate:c.byLanguage},null,2));
console.log('Latency (machine-local; network excluded):',JSON.stringify(timing));
console.log('Remaining held-out failures:',c.cases.filter(x=>!x.passed).map(x=>({id:x.id,failures:x.failures})));
if(process.argv.includes('--write'))fs.writeFileSync(url('chat-benchmark-results.json'),JSON.stringify(report,null,2)+'\n');
// Benchmark score is a measurement, not a forced 100%-pass test. Regression is separately visible.
if(!Number.isFinite(report.relativeTaskSuccess)||c.total!==80)process.exitCode=1;
