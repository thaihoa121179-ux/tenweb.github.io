# Bằng chứng kiểm thử — 18/11/2026

Bản static vẫn ở đường dẫn V6, phiên bản asset 7.0.0.

| Kiểm tra | Kết quả | Phạm vi |
|---|---|---|
| Node | 111/111 | Dữ liệu thật, alias/ngữ cảnh, RAG, quiz, lời kể, CORS, rate limit, output/schema, cache, vision/route/summary/metrics với provider mô phỏng |
| Chromium acceptance | 24/24 nhóm | 360/375/390/430/1366px; QR giải mã từ pixel, 200 ảnh thật, context 4 ngôn ngữ, text reveal, viewport bàn phím giả lập, fallback, PWA reload offline, camera-race và voice adapter mô phỏng |
| Python | 19/19 | Import/source-video và fixture cho bộ xác minh xuất bản; ảnh fixture không được coi là bằng chứng ảnh thật |
| Ảnh hiện vật thật | 200/200 | Giải mã pixel WebP, kích thước ít nhất 128px, 200 URL và SHA256 khác nhau; không dùng ảnh thay thế từ server test |
| axe-core | 10/10 màn không có violation tự động WCAG 2 A/AA | Giao diện hiện ở Chromium, không phải chứng nhận tuân thủ WCAG toàn diện |
| Lighthouse mobile | Performance 89; Accessibility 100; Best Practices 100 | Lần mở lạnh, server local có HTTP gzip, throttling mobile mặc định Lighthouse 13.0.1; chưa phải số đo Pages |
| Wrangler | Dry-run thành công | Worker khoảng 1.4MB / gzip 121KB; chưa triển khai tài khoản hoặc gọi provider thật |

Báo cáo máy đọc được: [browser-results.json](browser-results.json), [accessibility-results.json](accessibility-results.json), [local-assets-and-photos.json](local-assets-and-photos.json), [lighthouse-local.json](lighthouse-local.json). Bằng chứng xuất bản thật được lưu riêng trong Actions artifact của workflow **Verify published V6 photos and deployed assets**: so byte code/JSON, giải mã đủ 200 ảnh và đo trang Pages bằng Lighthouse mobile, yêu cầu Performance >=85. Không dùng báo cáo local để giả là kết quả xuất bản.

Ảnh xem trước dưới đây là Chromium mô phỏng 390×844, tên **An** chỉ là dữ liệu demo. Không phải ảnh kiểm thử trên Safari thật.

- [Trang chủ](home-390.png) · [Thư viện](library-390.png) · [Hồ sơ hiện vật](object-390.png)
- [Chat ngữ cảnh](chat-390.png) · [Cá nhân](profile-390.png) · [Thẻ PNG demo](journey-demo.png)

Chưa kiểm chứng: Safari iPhone/Chrome Android vật lý, bàn phím/torch/micro/giọng TTS/share sheet hệ điều hành, phát video bên cung cấp, chất lượng model thật, toàn bộ bản dịch mới. Môi trường không có OPENAI_API_KEY / quyền tài khoản Cloudflare nên giao AI backend dưới dạng mã sẵn triển khai; 191 hồ sơ mở rộng vẫn giữ ngôn ngữ nguồn. Xem [AI-DEPLOY](../AI-DEPLOY.md) và [checklist điện thoại](../TEST-7.md).

Để chạy acceptance bổ sung trong môi trường phát triển, cài Playwright + axe-core và Chromium riêng, đặt MUSEUM_TEST_URL / CHROMIUM_PATH khi cần, chạy tests/upgrade.cjs hoặc tests/a11y.cjs. Không đưa test/tool vào luồng sử dụng của du khách.
