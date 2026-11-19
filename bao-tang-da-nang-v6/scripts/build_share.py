"""Xuất trang chia sẻ HTML và Markdown, đọc được khi không chạy JavaScript."""
from pathlib import Path
import json,html
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'data/museum-content.json').read_text())
esc=lambda value:html.escape(str(value or ''))
intro='Museum Companion là dự án học tập độc lập về bảo tàng, không phải website chính thức. Mây mặc định trả lời từ hồ sơ có nguồn; AI tạo sinh chỉ hoạt động khi cấu hình backend. Bản đồ trong nhà là mô phỏng, không xác nhận vị trí thật.'
features=['Chọn bốn ngôn ngữ và tên khách','Thư viện 200 hồ sơ có ảnh và nguồn; có hồ sơ tham khảo ngoài Đà Nẵng, được ghi riêng','Hỏi Mây theo ngữ cảnh hiện vật, thẻ nguồn, giọng nói và lời kể','Quét QR, chụp và hỏi, chia sẻ link hiện vật','Lộ trình, nhiệm vụ, quiz, nhật ký và thẻ hành trình','Bản đồ mô phỏng ba tầng: đi bộ qua cảm biến, joystick và tự đi','PWA lưu giao diện, dữ liệu và ảnh đã xem; mục sự kiện chỉ hiện lịch được xác minh']
shots=[('home','Trang chủ'),('artifact-share','Hồ sơ và chia sẻ'),('chat','Mây và nguồn trả lời'),('scan','Quét QR'),('visit-events','Thông tin tham quan và trạng thái sự kiện')]
parts=['<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Museum Companion — Bản chia sẻ dễ đọc</title><style>body{max-width:960px;margin:auto;padding:24px;font:17px/1.7 system-ui;background:#f6f5f0;color:#103e35}a{color:#205849}article,figure{background:white;padding:20px;border-radius:18px;margin:20px 0}img{max-width:100%;height:auto}figure img{max-height:680px}article img{max-height:260px;object-fit:contain}nav{display:flex;gap:20px;flex-wrap:wrap}</style><body><h1>Museum Companion — Bảo tàng Đà Nẵng</h1>',f'<p>{esc(intro)}</p>','<p>Trang này chứa nội dung và ảnh ngay trong HTML, không cần JavaScript hoặc đăng nhập. Đây là bản đọc để chia sẻ, không phải giao diện tương tác của ứng dụng.</p><nav><a href="../">Mở ứng dụng tương tác</a><a href="README.md">Bản văn bản Markdown</a><a href="#records">200 hồ sơ</a></nav><h2>Chức năng</h2><ul>']
parts.extend('<li>'+esc(f)+'</li>' for f in features);parts.append('</ul><h2>Ảnh giao diện thực tế</h2><p>Ảnh kiểm thử ở kích thước điện thoại; tình huống quyền camera trong ảnh được giả lập.</p>')
md=['# Museum Companion — Bảo tàng Đà Nẵng',intro,'## Chức năng',*['- '+f for f in features],'## 200 hồ sơ có nguồn']
for name,label in shots:parts.append(f'<figure><figcaption>{esc(label)}</figcaption><img loading="lazy" src="../docs/ui-cleanup-7.5/{name}.png" alt="{esc(label)}"></figure>')
parts.append('<h2 id="records">200 hồ sơ</h2><p>Nội dung dưới đây giữ nguyên dữ liệu nguồn trong dự án, không phải xác minh độc lập tính chính xác lịch sử.</p>')
for a in data['artifacts']:
 credit=a.get('institutionName') or a.get('sourceSiteLabel') or 'Bảo tàng Đà Nẵng · Cơ sở 1'
 ref=' · Hồ sơ tham khảo ngoài Đà Nẵng' if a.get('referenceOnly') else ''
 parts.append(f'<article id="{esc(a["id"])}"><h3>{esc(a["name"])}</h3><img loading="lazy" src="../{esc(a["image"])}" alt="{esc(a["name"])}"><p>{esc(credit+ref)}</p><p>Niên đại theo hồ sơ: {esc(a.get("era"))}<br>Chất liệu theo hồ sơ: {esc(a.get("material"))}</p><p>{esc(a.get("summary"))}</p><a href="{esc(a["url"])}" rel="noopener">Nguồn hồ sơ</a> · <a href="../?artifact={esc(a["id"])}">Mở trong ứng dụng</a></article>')
 md.extend(['\n## '+a['name'],credit+ref,'Niên đại theo hồ sơ: '+str(a.get('era','')),'Chất liệu theo hồ sơ: '+str(a.get('material','')),a.get('summary',''),'Nguồn: '+a['url']])
parts.append('</body></html>')
out=root/'share';out.mkdir(exist_ok=True);(out/'index.html').write_text('\n'.join(parts));(out/'README.md').write_text('\n\n'.join(md)+'\n')
assert len(data['artifacts'])==200
print('Exported static HTML, five screenshots and 200 sourced records; Markdown included.')
