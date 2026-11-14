# Biên bản kiểm thử V6

Ngày kiểm thử: 14/11/2026. Môi trường: Linux, Python 3.12, Node 24, Playwright 1.62.1, Chromium headless. Frontend chạy qua máy chủ HTTP tĩnh từ gốc checkout.

## Đã chạy và đạt

- **15/15 nhóm kiểm thử trình duyệt** trong `tests/browser.cjs`.
- **18/18 kiểm thử backend** trong `backend/worker.test.mjs`. Provider và rate-limit binding dùng test double; không gọi mô hình, không dùng credential thật.
- Kiểm tra cú pháp các script ứng dụng và backend bằng Node; các tài nguyên HTML nội bộ đều tồn tại.
- V1–V5 và trang gốc: so sánh Git với commit gốc `83b2d7fb0804965a274f502638bf16986c940cba`, không có thay đổi bên ngoài V6. Sáu trang cũ vẫn phục vụ HTTP 200. Ba ảnh thiếu sẵn của trang gốc `images/box1.jpg`–`box3.jpg` không được sửa trong nhiệm vụ V6.

| Nhóm | Bằng chứng kiểm tra |
| --- | --- |
| Responsive | 375, 390, 768, 1366px; không tràn ngang trên màn hình chính, điều hướng, sơ đồ, hành trình, quiz, thông tin; ảnh robot tải được, không có lỗi JS `pageerror`. |
| Điều hướng | 5 mục chính và 6 ô dashboard đều mở đúng màn hình; nút chính có vùng chạm tối thiểu 44px. |
| Ngôn ngữ/chat | Việt/Anh/Hàn/Trung; đổi ngôn ngữ giữ hội thoại, hỏi hiện vật rồi hỏi chất liệu; route tiếng Hàn giữ sở thích khi đổi 30→15 phút. |
| Phạm vi câu trả lời | Sau câu hỏi hiện vật, địa chỉ/giờ bảo tàng được trả đúng phạm vi; câu hỏi tháp Eiffel không bị gán niên đại/chất liệu hiện vật trước. |
| Tìm kiếm | Không dấu, có dấu, một ký tự sai, Enter mở hồ sơ, không có kết quả khi từ khóa lạ. |
| QR | **Giải mã pixel thực tế cả 8 ảnh QR SVG** bằng jsQR, đối chiếu chính xác URL. Mã khu tạo check-in, mã chủ đề mở nội dung; URL nguy hiểm bị từ chối. |
| Deep link | Hiện vật/chủ đề/tầng/khu mở đúng sau hộp chọn ngôn ngữ lần đầu. |
| Hành trình | Thời gian, sở thích, nhịp độ thay đổi điểm dừng; đánh dấu và khôi phục tiến độ sau reload. |
| Quiz/nhật ký | 5 câu thực sự chạy, đạt 5/5, mở huy hiệu; lưu/tải/chia sẻ nội dung nhật ký; reload giữ dữ liệu. |
| Backend giả lập | Thành công tạo sinh, trả lời không đủ dữ liệu hợp lệ, mất kết nối và JSON sai; giao diện phân biệt chế độ và fallback rõ ràng. |
| Trợ năng/storage | Focus trap, Escape, giảm chuyển động, điều khiển banner; chữ lớn/tương phản giữ sau reload; chặn storage vẫn sử dụng trong phiên và báo rõ. |
| Phụ thuộc mạng | Luồng frontend không yêu cầu ảnh/font/CDN bên ngoài; không tải ảnh hiện vật chưa có bằng chứng quyền sử dụng. |
| Backend | CORS, body/history/context bounds, prompt nguồn server, ID nguồn giới hạn, timeout/error redaction, rate-limit fail closed, phản hồi thiếu nguồn, câu ngoài dữ liệu, 4 ngôn ngữ. |

Ảnh chụp dashboard: `docs/screenshots/home-{375,390,768,1366}.png`. Có thêm ảnh màn hình chat 390/1366px. Ảnh chụp là một thời điểm, không thay thế mọi trạng thái UI.

## Chưa chạy — cần thiết bị hoặc cấu hình thật

- [ ] iPhone Safari: cho phép/từ chối camera, đổi hướng camera, quét QR bằng camera, ánh sáng yếu, QR in giấy, chọn ảnh QR trong thư viện.
- [ ] Android Chrome: các bước camera tương tự; rời màn hình/đưa ứng dụng xuống nền phải tắt track camera.
- [ ] Micro Việt/Anh/Hàn/Trung, từ chối và thu hồi quyền; bàn phím vẫn nhập được; yêu cầu HTTPS và hỗ trợ của trình duyệt.
- [ ] Đọc câu trả lời/thuyết minh trên iOS/Android, giọng đúng ngôn ngữ nếu hệ điều hành có giọng tương ứng, dừng/đổi màn hình; Bluetooth và chế độ im lặng.
- [ ] VoiceOver/TalkBack và bàn phím thật: thứ tự focus, nhãn nút, thông báo chat, chọn đáp án, focus đối thoại và zoom 200%.
- [ ] Backend thật: cấu hình secret server, origin Pages, rate-limit bindings, kiểm tra chi phí/quyền riêng tư và chất lượng câu trả lời/citation của mô hình thực tế.
- [ ] Nguồn/mặt bằng/quyền ảnh: đối chiếu với bảo tàng; không tuyên bố đã xác minh chỉ vì test phần mềm đạt.
- [ ] Sau khi người dùng duyệt và triển khai Pages: tải URL công khai, deep link và QR từ thiết bị khác. Chưa thực hiện merge/deploy trong nhiệm vụ này.
