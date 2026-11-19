/* Báo cáo CI công khai giúp xem điểm thật khi không truy cập được log đăng nhập. */
import fs from 'node:fs';
const [reportPath, logPath]=process.argv.slice(2);
let summary='## Hiệu năng mobile trên website công khai\n\n';
let diagnostics={reportCreated:false};
if(reportPath&&fs.existsSync(reportPath)){
  const report=JSON.parse(fs.readFileSync(reportPath,'utf8'));
  diagnostics={reportCreated:true,scores:Object.fromEntries(Object.entries(report.categories||{}).map(([k,v])=>[k,Math.round(v.score*100)])),FCP:report.audits?.['first-contentful-paint']?.displayValue,LCP:report.audits?.['largest-contentful-paint']?.displayValue,TBT:report.audits?.['total-blocking-time']?.displayValue,CLS:report.audits?.['cumulative-layout-shift']?.displayValue,runtimeError:report.runtimeError,finalUrl:report.finalDisplayedUrl||report.finalUrl};
  summary+='| Hạng mục | Điểm |\n| --- | ---: |\n';
  for(const [name,category]of Object.entries(report.categories||{}))summary+=`| ${name} | ${Math.round(category.score*100)} |\n`;
  summary+='\n';
  for(const key of ['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift'])summary+=`- ${key}: ${report.audits?.[key]?.displayValue||'Không có số đo'}\n`;
  if(report.runtimeError)summary+='\nLighthouse runtimeError: '+JSON.stringify(report.runtimeError)+'\n';
}else{
  summary+='Lighthouse chưa tạo được JSON. Bước đo vẫn giữ trạng thái lỗi.\n';
  if(logPath&&fs.existsSync(logPath))summary+='\n```text\n'+fs.readFileSync(logPath,'utf8').slice(-3500).replaceAll('```','~~~')+'\n```\n';
  if(logPath&&fs.existsSync(logPath))diagnostics.error=fs.readFileSync(logPath,'utf8').slice(-2000);
}
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,summary);
process.stdout.write(summary);
// Annotation xem được ở trang run công khai, kể cả khi Summary yêu cầu đăng nhập.
const annotation=JSON.stringify(diagnostics).replaceAll('%','%25').replaceAll('\r','%0D').replaceAll('\n','%0A');
process.stdout.write('::warning title=Actual published Lighthouse measurement::'+annotation+'\n');
