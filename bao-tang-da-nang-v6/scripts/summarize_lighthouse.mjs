/* Báo cáo CI công khai giúp xem điểm thật khi không truy cập được log đăng nhập. */
import fs from 'node:fs';
const [reportPath, logPath]=process.argv.slice(2);
let summary='## Hiệu năng mobile trên website công khai\n\n';
if(reportPath&&fs.existsSync(reportPath)){
  const report=JSON.parse(fs.readFileSync(reportPath,'utf8'));
  summary+='| Hạng mục | Điểm |\n| --- | ---: |\n';
  for(const [name,category]of Object.entries(report.categories||{}))summary+=`| ${name} | ${Math.round(category.score*100)} |\n`;
  summary+='\n';
  for(const key of ['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift'])summary+=`- ${key}: ${report.audits?.[key]?.displayValue||'Không có số đo'}\n`;
  if(report.runtimeError)summary+='\nLighthouse runtimeError: '+JSON.stringify(report.runtimeError)+'\n';
}else{
  summary+='Lighthouse chưa tạo được JSON. Bước đo vẫn giữ trạng thái lỗi.\n';
  if(logPath&&fs.existsSync(logPath))summary+='\n```text\n'+fs.readFileSync(logPath,'utf8').slice(-3500).replaceAll('```','~~~')+'\n```\n';
}
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,summary);
process.stdout.write(summary);
