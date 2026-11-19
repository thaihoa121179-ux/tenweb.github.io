# Bước 2 — Bản đồ mô phỏng để trình diễn

Nâng cấp trên ứng dụng hiện có, gói 7.6.0. Bản đồ tự do, quét QR, chat, quiz, nhật ký và bộ 200 hồ sơ được giữ lại. Không có backend hoặc API trả phí mới.

Mở [tuyến trình diễn](https://thaihoa121179-ux.github.io/tenweb.github.io/bao-tang-da-nang-v6/?presentation=1). Nếu là lần đầu, chọn ngôn ngữ và tên Khách, rồi tuyến sẽ mở. Cũng có thể chọn **Mở tuyến trình diễn** ở trang chủ. `/share/` vẫn là trang HTML tĩnh để Gemini/công cụ đọc web xem nội dung; ứng dụng tương tác dùng URL trên.

## Kịch bản điều khiển

1. Chạm **Bắt đầu mô phỏng**. Mây đi theo graph lối đi, qua cửa và cầu thang; không xin quyền chuyển động, vị trí hoặc camera.
2. Mỗi điểm đến tự tạm dừng: có gợn sóng quanh Mây, thẻ có ảnh, tóm tắt và liên kết nguồn. Chạm **Điểm tiếp theo** để đi tiếp. Đây là chuyển động liên tục, không nhảy tức thời tới điểm đến.
3. Nút chính chuyển thành **Tạm dừng/Tiếp tục**. Tốc độ có ×1, ×2, ×4. ×1 mất khoảng 68 giây di chuyển qua cả tuyến, chưa tính thời gian dừng để thuyết trình.
4. Thanh trượt và các nút tầng dùng để **xem trước**, không tạo sự kiện đến điểm hoặc ghi tiến độ cá nhân. Đi lùi rồi chạy lại cùng một điểm không phát sự kiện đến điểm lần hai trong cùng lượt.
5. Nút vòng tròn chạy lại chỉ xóa trạng thái của lượt mô phỏng trong RAM. Tiến độ, tên, huy hiệu và nhật ký đã lưu vẫn được giữ.
6. Rời màn hình hoặc đưa trình duyệt ra nền sẽ tạm dừng. Quay lại không tự chạy; đóng/tải lại trang sẽ bắt đầu lượt mới.
7. **Về bản đồ tự do** mở lại các điều khiển bản đồ hiện có. Chọn chỉ đường từ hồ sơ hiện vật cũng quay về chế độ chỉ đường thông thường.

## 9 điểm và dữ liệu thật

Sơ đồ hiện có có 15 chủ đề minh họa. Tuyến sân khấu chọn đúng 9 điểm; không khẳng định đây là toàn bộ chủ đề hoặc vị trí thật của bảo tàng. Mỗi tầng có một hiện vật đinh; các điểm còn lại là chủ đề, có nhãn phân biệt và ảnh không gian tương ứng.

| Tầng | Ba điểm theo thứ tự | Hiện vật đinh |
| --- | --- | --- |
| 1 | Sưu tập cổ vật → Khu trưng bày thiếu nhi → Trưng bày định kỳ | Khuyên tai ba mấu (`hv-khuyen-tai-ba-mau-f7a824`) |
| 2 | Đèn cổ xứ Quảng → Trầm hương xứ Quảng → Văn hóa các dân tộc | Phù điêu Cơ Tu (`phu-dieu`) |
| 3 | Tổng quan Đà Nẵng → Đấu tranh bảo vệ độc lập → Tòa thị chính Đà Nẵng | Súng thần công (`sung-than-cong`) |

Tên, tóm tắt, nguồn và ảnh lấy từ bộ dữ liệu hiện có. Nhãn **Theo hồ sơ** và dữ liệu niên đại không bị sửa. Hồ sơ tham khảo từ bảo tàng khác và Cơ sở 2 không được ghim thành hiện vật ở Cơ sở 1. Mọi tuyến có nhãn **Sơ đồ minh họa**. UI hỗ trợ VI/EN/KO/ZH; nội dung chưa có bản dịch được ghi rõ là ngôn ngữ nguồn.

## Ranh giới Bước 2 và audio của Bước 3

Nút **Nghe tóm tắt** trên thẻ hiện vật dùng Web Speech API hiện có, phát sau thao tác chạm. Có thể phụ thuộc giọng đọc đã cài trên điện thoại, đặc biệt khi ngoại tuyến.

Mini Player, file MP3, Media Session, ba persona và việc tự nối trình phát khi đến điểm thuộc **Bước 3**, chưa được đưa vào bản này. Đã có các sự kiện sau để nối audio mà không sửa engine:

| Sự kiện trên `document` | Thời điểm |
| --- | --- |
| `museum:demostart` | Đồng bộ trong thao tác chạm bắt đầu/tiếp tục, phục vụ mở khóa audio iOS |
| `museum:demoarrival` | Đến điểm lần đầu trong một lượt; có `sessionId`, `stopId`, `index`, `floor`, `topicId`, `artifactId`, `featured`, `simulated: true` |
| `museum:demoseek` | Tua/xem trước; trình phát tương lai chỉ nên dừng, không tự phát |
| `museum:demopause` | Người dùng tạm dừng, rời trang hoặc ứng dụng bị ẩn |
| `museum:demoreset` | Bắt đầu một lượt mới |

Không dùng sự kiện đến điểm của bản đồ tự do để cộng huy hiệu cho tuyến sân khấu. Mọi sự kiện có trạng thái mô phỏng, không phải định vị ngoài đời.

## File hoàn chỉnh

Các đường dẫn dưới đây là file đầy đủ, có thể tải/copy nguyên file. Không có đoạn bỏ trống “giữ nguyên code cũ”. Các bundle được sinh tự động; sửa module nguồn rồi build lại.

| File | Vai trò |
| --- | --- |
| [data/demo-tour.json](../../data/demo-tour.json) | Cấu hình 9 điểm, ba hiện vật, tốc độ, bán kính đến điểm |
| [demo-tour.js](../../demo-tour.js) | Kiểm tra cấu hình, tính tuyến qua graph, bộ chạy thuần JS |
| [demo-tour-view.js](../../demo-tour-view.js) | Điều khiển, ảnh, nguồn, thẻ tóm tắt và bản dịch bốn ngôn ngữ |
| [presentation-map.css](../../presentation-map.css) | Bố cục điện thoại/ngang/desktop, Mây và hiệu ứng đến điểm |
| [demo-entry.js](../../demo-entry.js), [demo-entry.css](../../demo-entry.css) | Thẻ mở tuyến trên trang chủ và `?presentation=1` |
| [live-map.js](../../live-map.js) | Tích hợp renderer, vòng lặp, vòng đời và tách tracker cá nhân |
| [live-map-entry.js](../../live-map-entry.js) | Chỉ đường hiện vật thoát chế độ trình diễn |
| [bootstrap.js](../../bootstrap.js), [index.html](../../index.html) | Nạp gói 7.6.0, cung cấp base URL tương đối |
| [scripts/build-assets.mjs](../../scripts/build-assets.mjs) | Thêm module/CSS vào gói runtime và gói bản đồ tải khi cần |
| [sw.js](../../sw.js) | Cache mới, JSON tuyến và tám ảnh duy nhất cho chín thẻ; đọc ảnh đã precache khi mất mạng |
| [package.json](../../package.json), [package-lock.json](../../package-lock.json) | Phiên bản gói |
| [scripts/verify_published_v6.py](../../scripts/verify_published_v6.py) | Kiểm tra các file triển khai và ảnh thật |
| [tests/demo-tour.test.mjs](../../tests/demo-tour.test.mjs), [tests/demo-tour.cjs](../../tests/demo-tour.cjs) | Graph thật, sự kiện, UI, ngoại tuyến và vòng đời |
| [workflow kiểm tra web](../../../.github/workflows/verify-published-v6.yml) | Xác thực file triển khai và Lighthouse trên URL công khai |

Các file sinh thêm: `bootstrap-7.6.0.js`, `app-foundation-7.6.0.js`, `app-core-7.6.0.js`, `app-runtime-7.6.0.js`, `app-styles-7.6.0.css`, `app-map-7.6.0.js`, `map-styles-7.6.0.css`. Các gói phiên bản cũ còn nguyên để tránh làm hỏng URL đã mở.

## Chạy và đưa lên GitHub Pages

1. Trong thư mục `bao-tang-da-nang-v6`, chạy `npm ci`, rồi `node scripts/build-assets.mjs`.
2. Từ thư mục repository, chạy `python3 -m http.server 8877`. Mở `http://localhost:8877/bao-tang-da-nang-v6/?presentation=1`.
3. Để kiểm tra PWA cục bộ, dùng thêm `&pwa=1`. Production tự đăng ký service worker sau khi chọn ngôn ngữ/tên.
4. Giữ nguyên cấu trúc thư mục và đẩy bản đã kiểm tra lên nhánh GitHub Pages đang dùng. Không copy app vào `/share/`. Tất cả file mới dùng đường dẫn tương đối và kế thừa base URL của app.
5. Trên điện thoại, mở URL công khai khi có mạng, hoàn thành màn chào, đợi bộ nhớ offline cài xong và thử đi qua các điểm. Cần khoảng 5 MB thêm cho các ảnh chủ đề hiện có. Sau đó tải lại khi bật chế độ máy bay để kiểm tra đúng máy sẽ trình chiếu.

Không cần đăng ký Cloudflare/Vercel hoặc lấy API key cho Bước 2.

## Checklist trước khi thuyết trình bằng điện thoại thật

Chạy lần lượt trên iPhone Safari và Chrome Android, chiều rộng 360–430px; các bước dưới đây là kiểm tra thủ công cần làm trên máy thật, không được xem là đã được Chromium giả lập chứng nhận.

- [ ] Mở link mới, chọn ngôn ngữ, thẻ trang chủ xuất hiện; mở tuyến tối đa một chạm từ trang chủ.
- [ ] Bắt đầu, tạm dừng, tiếp tục, chọn ×4. Mây dừng đúng từng điểm, tự đổi tầng qua cầu thang.
- [ ] Thẻ hiện vật có đúng ảnh, tên và nguồn; nút mở hồ sơ mở đúng hiện vật.
- [ ] Kéo thanh tua bằng ngón tay; nút T1/T2/T3 mở đúng tầng. Không xuất hiện thông báo xin cảm biến/GPS.
- [ ] Xoay ngang, kiểm tra các nút không che bản đồ; cuộn được thẻ dài và nút về bản đồ tự do.
- [ ] Đưa app ra nền rồi quay lại, Mây vẫn tạm dừng; không tăng tiến độ cá nhân.
- [ ] Nghe tóm tắt sau thao tác chạm; kiểm tra âm lượng và giọng đọc của điện thoại. Không dựa vào TTS ngoại tuyến nếu máy chưa cài giọng phù hợp.
- [ ] Mở đủ chín thẻ, bật máy bay rồi tải lại; bản đồ, dữ liệu và toàn bộ ảnh tuyến vẫn hiện. Lần mở đầu tiên cần có mạng để cài cache.
- [ ] Mở chat cũ, nhập câu hỏi khi bàn phím mở, quay về app; quét QR và hồ sơ cũ còn hoạt động.
- [ ] Chuẩn bị sẵn trang chủ hoặc tuyến, tắt thông báo trên điện thoại trình chiếu. Chưa có audio MP3/Media Session trước Bước 3.

Kết quả kiểm tra tự động và ảnh chụp của bản hoàn thiện nằm cùng thư mục này. Không cần xóa localStorage để nâng cấp; xóa dữ liệu cá nhân là một thao tác riêng trong app.


## Kết quả đã chạy

| Kiểm tra | Kết quả |
| --- | --- |
| Node — corpus, RAG, Worker và engine (bao gồm 9 ca mới) | 160/160 |
| Python — import và bộ xác thực triển khai | 19/19 |
| Bản đồ trình diễn — luồng 9 điểm, 4 ngôn ngữ, 360–430px, ngang, desktop, lỗi tải, background, offline | 8/8 nhóm |
| Bản đồ tự do — chỉ đường, chuyển tầng, nguồn, cảm biến giả lập, offline | 9/9 |
| Chức năng app cũ — chat, QR, câu chuyện, nhiệm vụ, PWA, video, giọng nói | 24/24 |
| Ảnh hồ sơ được giải mã và đối chiếu trên server cục bộ | 200/200 ảnh riêng biệt |
| axe WCAG A/AA trên màn trình diễn | 0 lỗi tự động phát hiện |
| Lighthouse mobile cold trên server gzip cục bộ | Performance 91 · Accessibility 100 · Best Practices 100 |

Kết quả Lighthouse trên URL công khai được đo riêng bằng workflow sau khi triển khai; phép đo cục bộ không đại diện cho mọi mạng/điện thoại. Không có tuyên bố đã kiểm thử phần cứng Safari/Android thật.

Ảnh: [Bắt đầu](start-390.png), [tầng 1](floor-1-390.png), [tầng 2](floor-2-390.png), [tầng 3](floor-3-390.png), [điện thoại ngang](landscape-844.png), [desktop](desktop-1440.png), [thẻ mở ở trang chủ](home-entry.png).

[Tải các file thay đổi dạng ZIP](changed-files.zip). Giải nén vào thư mục repository **đã có**, cho phép ghi đè các file tương ứng. Gói chứa toàn bộ nội dung các file thay đổi/thêm mới so với `bfa0a95`, gồm bundle đã build và tài liệu; không nhân bản 200 ảnh/dữ liệu cũ không thay đổi. Mã nguồn cũ còn lại vẫn lấy từ repository hiện có.
