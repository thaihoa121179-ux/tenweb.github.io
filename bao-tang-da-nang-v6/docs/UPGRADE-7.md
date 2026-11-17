# Bàn giao các giai đoạn 0–6

Bản 7 nâng cấp trực tiếp trên nhánh V6 hiện có; giữ HTML/router, ID, dữ liệu thật, ảnh, nhật ký và storage người dùng. Mã nguồn hoàn chỉnh của các file dưới đây có sẵn trong repository; các file build được sinh từ source, không phải nơi sửa thủ công.

## Giai đoạn 0 — đối chiếu code và ảnh Safari

| Vấn đề | Kết quả kiểm tra trước khi sửa | Xử lý bản mới |
|---|---|---|
| 1. Nav che đáy / lệch nhãn | Nav cũ thực tế khoảng 83px do padding; nhãn giữa thấp hơn. Chromium dùng flex chưa tái hiện mọi trường hợp Safari trong ảnh. | Nav 64px + safe area, border-box, dành chỗ đúng một lần trong flex; phần cuộn có khoảng đáy. |
| 2. Header quá lớn | Header cũ desktop 82px, mobile CSS đã 64px; chưa có cơ chế thu khi cuộn. Khoảng trống trong ảnh còn gồm tiêu đề. | Thu khi cuộn xuống, hiện khi lên; ẩn trong chat/quét. |
| 3. Chat quá nhiều lớp | Đúng: global header/nav, ba tab, preferences/chips/composer cùng chiếm chiều cao. | Toàn màn hình; visualViewport; menu ⋯; giọng kể chuyển vào hồ sơ. |
| 4. Chips và badge | Đúng: vùng cuộn không rõ, emoji chồng avatar. | Snap + fade, đích chạm 44px, bỏ badge chồng. |
| 5. Tên nguyên văn | Đúng: tên “ok” giữ chữ thường. | Chuẩn hóa đầu tên, avatar viết hoa, tên Khách dùng lời chào chung. |
| 6. Logo | Đúng: ký tự ✳ phụ thuộc font/emoji. | SVG DN cùng màu thương hiệu. |
| 7. Mũi tên | Đúng: thẻ điều hướng nội bộ dùng ↗. | Chevron ›; ↗ dành cho liên kết ngoài/trang phụ mở tab. |
| 8. Thuật ngữ | Đúng: quiz/journal/route nhiều tên. | Bảng TERMS-7 và nhãn chung bốn ngôn ngữ. |
| 9. Cá nhân | Đúng: back tab gốc, 0/215, huy hiệu thụ động. | Không back; nhiệm vụ nhỏ 3–5 hồ sơ, tiến độ và huy hiệu. |
| 10. QR | Đúng: camera cần mở riêng, hai nút bật/tắt, demo luôn hiện. | Tự xin quyền khi vào tab; flash theo khả năng thiết bị; từ chối có thử lại/ảnh/mã; demo qua query riêng. |
| 11. Thư viện | Đúng: ba select cùng hàng, ảnh contain, cảnh báo dài, phân trang. | Tìm kiếm cố định, sheet bộ lọc, grid/list, cover đồng nhất, cảnh báo trong details, tải tiếp. |
| 12. Trang chủ | Đúng: hero và carousel trước hành động. | Ba hành động trước hero thấp hơn, gần đây/gợi ý từ hồ sơ thật. |
| 13. Tiếp cận/hiệu năng | Cũ đã có một số 16px/reduced motion/local photo; chưa có PWA/offline. | Giữ và tăng vùng chạm, nguồn/lỗi, skeleton, nén dữ liệu, cache. Giữ palette sáng thay vì tự đổi sang palette dark chưa được kiểm duyệt. |

Cốt truyện demo: một du khách chỉ có 15 phút, không biết tiếng Việt, thấy hiện vật có nhãn khó hiểu. Bạn ấy chọn tiếng Anh, quét QR mở đúng hồ sơ, hỏi bằng giọng nói “What is it made of?”, nghe hiện vật kể ngắn, mở ba hồ sơ của nhiệm vụ rồi tải thẻ kỷ niệm. Mây là điểm nối giữa tra cứu, kể chuyện, lộ trình và ký ức, không phải thêm một màn chat riêng rời rạc.

## Giai đoạn 1 — UX, thuật ngữ, JSON

| File sửa/thêm | Vai trò / vị trí |
|---|---|
| `index.html`, `bootstrap.js` | Giữ các khung trang cũ; tải JSON chuẩn, màn tải/lỗi, manifest và bundle theo thứ tự. |
| `data/museum-content.json`, `.json.gz` | 200 hiện vật + 15 chủ đề, adapter corpus server và chín bản dịch gốc; gzip chỉ là bản giao vận cùng dữ liệu. |
| `experience.css`, `experience.js` | Override bố cục, header/nav/chat, source cards, bộ lọc, home, camera, nhiệm vụ, route. |
| `experience-i18n.js`, `docs/TERMS-7.md` | Nhãn và thuật ngữ mới VI/EN/KO/ZH. |
| `app.js` | Thay khối D/A bằng JSON; context, source events, menu đọc, giọng nói, viewport/camera integration. |
| `v6.js`, `visitor.js`, `mobile.js` | Đồng nhất tên, logo/thuật ngữ, selector ngôn ngữ, nickname và visualViewport. |
| `library-ui.js` | Bộ lọc cũ giữ state; thay phân trang bằng tải tích lũy và IntersectionObserver. |
| `icons/icon-192.png`, `icons/icon-512.png` | Biểu tượng DN cho PWA / màn hình chính. |

Không gộp 143 hồ sơ tham khảo thành cơ sở 1. Bộ JSON giữ nguyên nguồn, điều chưa chắc chắn và ảnh địa phương cho tất cả 200 hồ sơ. File gốc lịch sử không được tải như nguồn thay thế khi JSON lỗi.

## Giai đoạn 2 — backend, context, RAG, giọng nói

| File | Vai trò |
|---|---|
| `retrieval.js` | Client xếp hạng tối đa năm hồ sơ theo tên, từ khóa và hiện vật đã ghim. |
| `app.js`, `experience.js` | Chip Đang xem, ba câu hỏi, context theo ID, thẻ nguồn mở đúng hồ sơ, fallback có nhãn. |
| `backend/corpus.mjs` | Đọc chính JSON chuẩn, không giữ bản corpus riêng bị lệch. |
| `backend/worker.mjs`, `wrangler.jsonc` | `/chat`, CORS origin cụ thể, rate limit fail closed, model/key server, giới hạn input/history/context. |
| `backend/features.mjs` | Các endpoint phụ, cache lời kể tùy chọn, vision, route, summary, metrics. |

Backend tự đối chiếu lại corpus; không tin mô tả do client gửi. VI/EN/KO/ZH giữ ngôn ngữ được chọn; khi chưa có bản dịch nội dung, bản cục bộ giữ nguyên nguồn và ghi nhãn rõ. SpeechRecognition/speechSynthesis có trạng thái và fallback khi trình duyệt/giọng đọc thiếu. Chưa có API key thì không giả gọi model.

## Giai đoạn 3 — kể chuyện, QR thật, quiz

`learning-engine.js` tạo lời kể dự phòng từ nguyên văn hồ sơ và quiz có đáp án/giải thích/nguồn. `profile.js` thay bộ câu hỏi cũ bằng dữ liệu thật. `experience.js` nối ba giọng kể và TTS; backend `/story` chỉ nhận ID hợp lệ, kiểm tra nguồn/năm mới và cache theo nội dung. Nhãn cục bộ khác nhãn AI tạo sinh.

`qr-print/index.html`, `print.js`, `print.css` sinh QR thật bằng thư viện hiện có, mặc định ba tầng + ba hiện vật vừa một A4, có chọn hồ sơ/ngôn ngữ. Mã dẫn tới Pages thật; chưa phải mã đã dán tại bảo tàng.

## Giai đoạn 4 — Chụp & hỏi

`photo-query.js` thêm chức năng vào chat và scanner: chụp/chọn → xem trước → JPEG tối đa 1024px → chủ động gửi. Backend `/identify` đọc dấu hiệu trong ảnh, tìm ứng viên trong 200 hồ sơ, đối chiếu ảnh + mô tả và trả tối đa ba ID. Kết quả luôn yêu cầu xác nhận; mức khớp không phải phần trăm hiệu chuẩn. Không nối backend thì cho tìm nhãn/chọn tay, không dùng một danh sách mặc định giả là nhận diện.

Ảnh tải lên không lưu cache PWA, không đưa vào dashboard. Khung hình QR vẫn xử lý tại thiết bị.

## Giai đoạn 5 — nhiệm vụ, lộ trình, thẻ

`experience.js` tạo nhiệm vụ 3–5 hồ sơ có thật, nhập tiến độ đã xem từ storage cũ, huy hiệu hoàn thành một lần; lộ trình 15/30/60 có đổi/bỏ điểm, lý do và API `/route` tùy chọn. Thời lượng là ước tính khám phá/đọc, không là thời gian đi bộ hay xác nhận vị trí thực.

`journey-card.js` dựng PNG 1080×1520 tại máy, gồm tên, ngày, ba hồ sơ gần đây, chủ đề quan tâm, tổng kết và Mây; tải/chia sẻ qua API hệ thống khi hỗ trợ. Chỉ gửi ID hồ sơ để xin tổng kết AI, không gửi tên hoặc nhật ký. Lời tổng kết cục bộ có nhãn rõ.

## Giai đoạn 6 — QR map, offline, dashboard, kiểm thử

- `manifest.webmanifest`, `sw.js`, `offline.js`: PWA, cache giao diện/JSON và tối đa 60 ảnh; cập nhật có nút tải lại, không tự xóa nội dung đang nhập.
- `analytics.js`, `admin/index.html`, `admin.js`, `admin.css`: số đếm ẩn danh tại thiết bị, gửi server khi opt in; dashboard mô phỏng ghi nhãn rõ, admin server cần secret riêng.
- `package.json`, `package-lock.json`, `.gitignore`, `scripts/build-assets.mjs`, `build_content.py`: build có thể lặp lại; ba bundle JS để trình duyệt có cơ hội xử lý giữa các nhóm module; CSS minified; gzip JSON khoảng 87KB; QR decoder tải khi cần.
- `scripts/translate-content.mjs`, `.github/workflows/translate-records.yml`: dịch lúc build + cache; mặc định một hồ sơ để kiểm soát chi phí, không chạy khi thiếu key, không tự xuất bản bản dịch chưa duyệt.
- `tests/upgrade.cjs`, `experience.test.mjs`, `backend/features.test.mjs`, cập nhật test/verifier cũ: kiểm tra sản phẩm, dữ liệu, source scope, fallback, PWA, QR, ảnh và security inputs.
- `.github/workflows/verify-published-v6.yml`, `scripts/verify_published_v6.py`: sau push, kiểm tra byte code/JSON đã xuất bản và giải mã đủ 200 ảnh; báo cáo lưu trong Actions artifact, không tự commit dữ liệu xác minh.

Các lớp tính năng mới nối vào router cũ bằng sự kiện `museum:*`. Bản đồ GPS/compass và trò chuyện đời thường cũ không được nạp ở sản phẩm hiện tại.

## Việc còn phụ thuộc chủ tài khoản / thiết bị

Không thể tự tạo quyền truy cập tài khoản hoặc khóa dịch vụ cho bạn. Chủ tài khoản đặt API secret, đăng nhập/deploy Worker và cấu hình URL theo AI-DEPLOY.md; sau đó thử model thật, rà soát bản dịch/lịch sử. Camera, micro, giọng đọc Safari/Android, share sheet và việc dán QR cần kiểm tra trên điện thoại thật theo TEST-7.md. Không tự ghi dấu đã kiểm thử phần cứng hoặc đã triển khai model khi chưa làm được.
