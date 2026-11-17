# Museum Companion — Mây · Bản nâng cấp 7

Ứng dụng học tập độc lập, không phải website chính thức của Bảo tàng Đà Nẵng. Nâng cấp trực tiếp V6, giữ địa chỉ Pages, bộ ảnh, ID hồ sơ, mascot và bảng màu xanh rêu / vàng kem. Frontend vẫn HTML/CSS/JavaScript thuần.

**Web:** https://thaihoa121179-ux.github.io/tenweb.github.io/bao-tang-da-nang-v6/

## Dùng bản mới

- Trang chủ: Hỏi Mây, Quét QR, Lộ trình xuất hiện trước hero; có Tiếp tục xem và Gợi ý hôm nay.
- Chat toàn màn hình: quay lại bằng nút ‹; tùy chọn Trả lời chi tiết và tốc độ chữ trong ⋯. Hồ sơ → Hỏi Mây ghim đúng hiện vật, kèm ba câu hỏi riêng và thẻ nguồn mở lại hồ sơ. Không dùng thời gian chờ giả để gọi là suy luận.
- Thư viện: lưới / danh sách, tìm kiếm cố định, bộ lọc mở riêng, tải tiếp khi cuộn; nguồn đúng từng bảo tàng. Ảnh thật đã lưu cùng website.
- Nghe hiện vật kể: Bé khám phá / Du khách / Chuyên sâu, nghe bằng TTS, nguồn và hồ sơ liên quan. Lời kể cục bộ và lời kể tạo sinh có nhãn khác nhau.
- Chụp & hỏi: xem trước ảnh, nén JPEG tối đa 1024px, chủ động gửi để đối chiếu. Luôn cho người dùng xác nhận; chưa nối backend thì tìm tên/nhãn thủ công, không giả nhận diện ảnh.
- Cá nhân: tên chuẩn hóa, nhiệm vụ 3–5 hồ sơ, huy hiệu, quiz từ dữ liệu thật, nhật ký cũ và thẻ hành trình PNG có tên, ảnh, chủ đề, mascot; lưu tại trình duyệt, không cần tài khoản.
- Trong nhà: mốc QR tầng/khu, sơ đồ minh họa. GPS được thay bằng link Google Maps đến 31 Trần Phú. [Trang in QR A4](qr-print/) sinh mã thật cho tầng và hồ sơ; `?demo=1` mới hiện bộ mã thử trong màn quét.
- PWA: lưu giao diện, JSON và tối đa 60 ảnh đã xem; chọn Thêm vào màn hình chính trong Cá nhân. [Dashboard demo](admin/) có mật khẩu trình diễn `may-demo`, phân biệt dữ liệu mô phỏng / thiết bị / server.

## Nguồn dữ liệu và AI

`data/museum-content.json` là nguồn chạy duy nhất: **200 hồ sơ hiện vật + 15 chủ đề**. Có **57 hồ sơ Đà Nẵng (33 cơ sở 1, 24 cơ sở 2), 6 Bảo tàng Lịch sử Quốc gia, 137 V&A**. 143 hồ sơ ngoài Đà Nẵng mang nhãn tham khảo, không được gán vào sơ đồ hoặc lộ trình Đà Nẵng. Không thêm hồ sơ giả để đủ số lượng. Nhãn “Theo hồ sơ” và chất liệu chưa xác minh được giữ.

Chạy mặc định bằng tra cứu hồ sơ tại thiết bị. **Worker, AI tạo sinh, nhận diện ảnh và dịch thêm 191 hồ sơ chưa được kích hoạt trong tài khoản của bạn**, vì môi trường bàn giao chưa có quyền đăng nhập Cloudflare / khóa API. Mã backend đã đóng gói thử và kiểm thử bằng provider mô phỏng. Không có khóa AI trong frontend. Chín hồ sơ gốc có bốn bản dịch; 191 hồ sơ mới giữ nguyên ngôn ngữ nguồn, có nhãn rõ. [Hướng dẫn bật AI và dịch dữ liệu](docs/AI-DEPLOY.md).

Giao diện chính có bốn ngôn ngữ VI/EN/KO/ZH. Câu hỏi ngoài hồ sơ nói rõ chưa có thông tin và hướng tới nhân viên / nguồn chính thức. Kiểm tra ID nguồn không tự chứng minh mọi câu do model tạo đều đúng; cần rà soát nội dung khi dùng model thật.

## Chạy và sửa

Cài Node.js 24 và Python 3. Mở terminal trong thư mục này:

```sh
npm ci
npm run build
python3 -m http.server 8877
```

Mở http://localhost:8877/ . Trên Windows có thể thay `python3` bằng `py -3`. Không mở trực tiếp `index.html` bằng `file://`, vì ứng dụng cần fetch JSON. Trang Pages dùng file đã build, không cần Node chạy trên server.

Sửa các file nguồn có chú thích; chạy lại `npm run build` để cập nhật `app-foundation.js`, `app-core.js`, `app-runtime.js`, `app-styles.css` và JSON gzip. Bộ đóng gói chỉ là công cụ build, không thêm framework vào sản phẩm. Bộ giải mã QR tải khi cần; các file `collection.js`, `data-v6.js`, `media-map.js`, `conversation.js`, `location*.js` giữ làm tư liệu tương thích/lịch sử, không còn là nguồn dữ liệu chạy hoặc tính năng GPS của bản mới. Script nhập dữ liệu cũ chỉ phục vụ lịch sử; thay đổi bộ hồ sơ hiện tại phải sửa JSON chuẩn và chạy bộ kiểm tra.

## Kiểm tra và bàn giao

```sh
npm test
python3 scripts/build_content.py --check
# Từ gốc repository, với Pillow và BeautifulSoup được cài trong venv:
python3 -m unittest discover -s bao-tang-da-nang-v6/tests -p 'test_*.py'
# Có Playwright + Chromium và server ở cổng 8877:
MUSEUM_TEST_URL=http://localhost:8877/ node tests/upgrade.cjs
```

- [Đối chiếu 13 vấn đề, các giai đoạn và toàn bộ file sửa](docs/UPGRADE-7.md)
- [Hướng dẫn Cloudflare, biến môi trường, model, dịch lúc build](docs/AI-DEPLOY.md)
- [Checklist Safari iPhone / Chrome Android, kịch bản demo](docs/TEST-7.md)
- [Thuật ngữ thống nhất bốn ngôn ngữ](docs/TERMS-7.md)
- [Kết quả kiểm thử và giới hạn đo](docs/release-7/VALIDATION.md)
- [Lịch sử phiên bản cũ](docs/HISTORY-V6.md), [giấy phép thư viện](licenses/), [nguồn video](data/verified-videos.json).

Mã hoàn chỉnh từng module nằm trong repository; `docs/UPGRADE-7.md` chỉ rõ vai trò và vị trí sửa. Không cần chép những đoạn “giữ nguyên phần còn lại”.
