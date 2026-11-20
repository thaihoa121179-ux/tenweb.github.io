# Bước 4–5 · Đà Nẵng xưa & nay và bản trình diễn 7.8.0

Mở [trang chia sẻ](../../share/) để thử ba thanh trượt hoặc đi thẳng vào [tuyến mô phỏng của Mây](../../?presentation=1&v=7.8.0), [quiz](../../?demo-panel=quiz&v=7.8.0) và [thẻ kỷ niệm](../../?demo-panel=journey&v=7.8.0).

## Thay ảnh minh họa

Các cặp hiện tại là tranh minh họa theo chủ đề, không phải cặp ảnh tư liệu chụp cùng vị trí. Mã đọc đường dẫn từ [data/then-now.json](../../data/then-now.json). Cả hồ sơ và trang chia sẻ dùng chung tệp dữ liệu.

| Hồ sơ | Xưa | Nay |
| --- | --- | --- |
| Khuyên tai ba mấu | [khuyen-tai-ba-mau-xua.webp](../../assets/then-now/khuyen-tai-ba-mau-xua.webp) | [khuyen-tai-ba-mau-nay.webp](../../assets/then-now/khuyen-tai-ba-mau-nay.webp) |
| Phù điêu Cơ Tu | [phu-dieu-xua.webp](../../assets/then-now/phu-dieu-xua.webp) | [phu-dieu-nay.webp](../../assets/then-now/phu-dieu-nay.webp) |
| Súng thần công | [sung-than-cong-xua.webp](../../assets/then-now/sung-than-cong-xua.webp) | [sung-than-cong-nay.webp](../../assets/then-now/sung-than-cong-nay.webp) |

Chép ảnh WebP mới vào `bao-tang-da-nang-v6/assets/then-now/` với đúng tên. Canh hai ảnh cùng tỷ lệ 8:5, khuyến nghị 960×600 trở lên. Sau khi xuất bản, mở cặp ảnh khi có mạng để cache cập nhật. Nếu ảnh có nội dung khác, cập nhật mô tả `scenes` và ghi nguồn ở `credit` trong JSON theo các khóa `vi`, `en`, `ko`, `zh`.

## Kiểm tra cục bộ

Trong `bao-tang-da-nang-v6`, chạy `npm ci`, `npm run build` rồi `python3 scripts/serve_demo.py --port 8878`. Chạy `node tests/presentation-step45.cjs` trong terminal khác với Playwright có thể được tìm qua `NODE_PATH` và Chromium có sẵn. Có thể đặt `MUSEUM_TEST_URL` để thử dưới đúng đường dẫn con Pages.

Thẻ PNG có cạnh 1080×1920 hoặc 1620×2880 tùy mật độ điểm ảnh. Trên iOS, nút tải ưu tiên bảng chia sẻ ảnh khi trình duyệt hỗ trợ; liên kết **Mở ảnh để lưu** là đường dự phòng. Hiệu ứng pháo giấy tôn trọng cài đặt giảm chuyển động. Khi mục Cá nhân báo đã sẵn sàng ngoại tuyến, PWA đã lưu ứng dụng, trang chia sẻ, ảnh, khung thẻ, bản đồ và bộ MP3.
