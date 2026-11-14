# Kiểm thử trình duyệt V6

Từ thư mục gốc repository, chạy máy chủ tĩnh trong một terminal:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Terminal khác:

```sh
node bao-tang-da-nang-v6/tests/browser.cjs
```

Yêu cầu: Node.js hỗ trợ CommonJS, gói `playwright` có thể được `require` (qua cài đặt của môi trường hoặc `NODE_PATH`), và Chromium. Mặc định dùng `/usr/bin/chromium`; có thể chọn `CHROMIUM_PATH=/path/to/chromium`. Suite không tự tải gói, trình duyệt hoặc gọi dịch vụ AI thật.

Biến tùy chọn:

- `MUSEUM_TEST_URL`: URL thư mục V6 trên máy chủ kiểm thử; mặc định `http://127.0.0.1:8000/bao-tang-da-nang-v6/`.
- `SCREENSHOT_DIR`: thư mục nhận ảnh dashboard tại 375, 390, 768, 1366px.
- `MUSEUM_TEST_REPORT`: đường dẫn báo cáo JSON; tiến trình thoát mã 1 nếu có nhóm kiểm thử thất bại.

15 nhóm kiểm thử bao gồm layout và điều hướng ở bốn chiều rộng, mascot nội bộ, vùng chạm 44px của nút chính, bốn ngôn ngữ và câu hỏi nối tiếp, tìm kiếm không dấu/sai một ký tự, đọc thực tế tám ảnh QR bằng decoder, deep link ở lần chọn ngôn ngữ đầu tiên, hành trình và tiến độ, quiz và huy hiệu, nhật ký lưu/tải/chia sẻ, khôi phục sau reload, backend giả lập thành công/lỗi/phản hồi sai, câu hỏi chưa có dữ liệu, QR nguy hiểm, giảm chuyển động và bàn phím.

Backend được giả lập bằng interception của Playwright. Kết quả đạt không xác nhận backend đã triển khai, khóa API hợp lệ hay chất lượng một mô hình AI thật. Việc không tràn ngang và tải font không thay thế kiểm tra trực quan tiếng Việt/CJK, tương phản hoặc kiểm thử với trình đọc màn hình. Quyền camera/micro, giọng đọc và quét QR từ camera thật cần thiết bị thực; suite chỉ giải mã ảnh QR được tạo trong ứng dụng và kiểm tra luồng nhập mã.

Nếu chưa có công cụ kiểm thử, cài bên ngoài checkout (không cần cho frontend):

```sh
npm install --prefix /tmp/museum-v6-test-tools --cache /tmp/museum-v6-npm --no-package-lock --no-audit --no-fund playwright@1.62.1
NODE_PATH=/tmp/museum-v6-test-tools/node_modules CHROMIUM_PATH=/usr/bin/chromium node bao-tang-da-nang-v6/tests/browser.cjs
```

Dùng Chromium do hệ điều hành cung cấp, hoặc cài trình duyệt Playwright bằng cơ chế chính thức rồi chỉ định `CHROMIUM_PATH`. Không tắt xác minh TLS hoặc sửa mã nguồn để làm test đạt.
