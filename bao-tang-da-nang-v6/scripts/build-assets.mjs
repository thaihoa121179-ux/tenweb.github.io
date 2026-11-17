/* Chỉ đóng gói để tải nhanh; các file nguồn có chú thích vẫn giữ riêng để sửa. */
import fs from 'node:fs/promises';import {transform} from 'esbuild';
const root=new URL('../',import.meta.url);
export const scripts=['qr-decoder.js','qr-generator.js','guide-engine.js','chat-text.js','object-videos.js','videos.js','library-ui.js','request-plan.js','conversation.js','experience-i18n.js','learning-engine.js','retrieval.js','visitor.js','app.js','v6.js','profile.js','mobile.js','analytics.js','experience.js','photo-query.js','journey-card.js','offline.js'];
export const styles=['base.css','v6.css','videos.css','library-ui.css','profile.css','mobile.css','visitor.css','experience.css'];
const active=scripts.filter(f=>!['qr-decoder.js','conversation.js'].includes(f)),at=active.indexOf('app.js'),extra=active.indexOf('analytics.js');
const outputs=[[active.slice(0,at),'app-foundation.js','js'],[active.slice(at,extra),'app-core.js','js'],[active.slice(extra),'app-runtime.js','js'],[styles,'app-styles.css','css']];
for(const [files,out,loader]of outputs){
 const load=loader==='js'?files.filter(f=>!['qr-decoder.js','conversation.js'].includes(f)):files;
 const text=(await Promise.all(load.map(f=>fs.readFile(new URL(f,root),'utf8')))).join(loader==='js'?'\n;\n':'\n');
 const result=await transform(text,{loader,minify:true,target:'es2020',legalComments:'inline'});
 await fs.writeFile(new URL(out,root),(out==='app-foundation.js'?'/*! QR Code Generator (c) 2009 Kazuhiko Arase; MIT — see licenses/qrcode-generator-MIT.txt. */\n':'')+result.code);console.log(out,new TextEncoder().encode(result.code).length,'bytes');
}
