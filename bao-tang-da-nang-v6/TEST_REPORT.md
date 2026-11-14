# Biên bản kiểm thử V6 — cập nhật ảnh và hội thoại

Ngày: 14/11/2026. Linux, Python 3.12, Node 24, Playwright 1.62.1, Chromium headless; máy chủ tĩnh phục vụ từ gốc checkout.

## Kết quả đã chạy

- **21/21 nhóm kiểm thử trình duyệt** trong `tests/browser.cjs`.
- **33/33 kiểm thử Node**, gồm 11 kiểm thử nhận diện hội thoại và 22 kiểm thử backend. Không gọi mô hình hoặc dùng credential thật.
- Cú pháp JavaScript và các đường dẫn script nội bộ hợp lệ.
- So sánh với `origin/main` tại commit `c4963f9`: không sửa website gốc hoặc V1–V5. Thay đổi chỉ trong thư mục V6.

| Nhóm | Kiểm tra thực tế |
| --- | --- |
| Responsive | 375/390/768/1366px; điều hướng chính, dashboard, sơ đồ, hành trình, quiz và thông tin không tràn ngang; mascot tải được, nút chính đạt 44px; không có `pageerror`. |
| Bốn ngôn ngữ | Việt/Anh/Hàn/Trung, đổi ngôn ngữ giữ hội thoại; niên đại → chất liệu đúng hiện vật. Các nhu cầu không muốn xem, ít đi bộ và gợi ý hiện vật được nhận diện cả bốn ngôn ngữ. |
| Câu hỏi từ ảnh chủ dự án | “hiện vật nào đáng xem nhất”, “tôi tới mà k muốn xem thì làm gì”, “tôi nhát đi bộ lắm có cách nào ko” đều có câu trả lời và thao tác phù hợp. |
| Ngữ cảnh | “cái thứ hai” chọn đúng hồ sơ vừa gợi ý; “nó làm bằng gì” dùng đúng hiện vật. Phân biệt câu hỏi bảo tàng, hiện vật, lộ trình và đối tượng ngoài dữ liệu. |
| Sở thích | Nhận biết phủ định, loại trừ nhóm không muốn xem, so sánh hai hồ sơ, giữ ít đi bộ khi đổi thời gian xuống 10 phút và đổi sở thích. Không tạo thông tin về thang máy hoặc lối đi thật. |
| Lộ trình | Thời gian, nhịp độ, sở thích và tiến độ lưu/khôi phục. Lựa chọn ít đổi tầng tạo ít điểm dừng trên một tầng; không gọi đó là đường ngắn nhất đã đo. |
| Tác vụ UI qua chat | Mở quiz và nhật ký bằng nút thật; không gọi provider cho thao tác UI, không nói đã lưu một ghi chú khi người dùng chưa lưu. |
| Hiện chữ | Đo trực tiếp độ dài phản hồi tăng dần trước khi đủ; không dùng animation zoom/fade cả hàng; Hiện ngay hoàn tất chữ; tiếng Việt tổ hợp, emoji, Hàn/Trung không bị hỏng. Người đang cuộn lên đọc không bị kéo xuống; đổi trang hoàn tất chữ an toàn; reduced motion hiển thị ngay. |
| Trợ năng | Nội dung đầy đủ cho trình đọc màn hình, không thông báo từng ký tự; focus trap/Escape, chữ lớn/tương phản và storage bị chặn đều qua thử nghiệm tự động. Chưa thử trình đọc màn hình thật. |
| Ảnh nguồn | Cả 9 URL ảnh hiện vật đúng dữ liệu gốc; ảnh không gian dùng URL VR360, có ghi công. Thành công và lỗi tải ảnh được kiểm tra bằng fixture; không thay ảnh hiện vật bằng ảnh robot trong sản phẩm. |
| Tìm kiếm/QR | Có dấu, không dấu, một ký tự sai, Enter mở hồ sơ. Cả 8 ảnh QR được giải mã pixel thực tế bằng jsQR, URL trùng khớp; deep link lần đầu đúng hiện vật/chủ đề/tầng/khu; chặn URL nguy hiểm. |
| Quiz/nhật ký | Chạy 5 câu, đáp án có nguồn, điểm/huy hiệu, lưu/tải/chia sẻ nhật ký, khôi phục sau reload. |
| Backend | Thành công tạo sinh, data-mode hợp lệ, lỗi kết nối và JSON sai được giả lập. Backend giữ CORS, input bounds, rate-limit fail closed, timeout/redaction, nguồn giới hạn, ngữ cảnh riêng từng request. Truy xuất và prompt cải thiện cho các câu thực tế mới. |

## Giới hạn kiểm chứng ảnh thật

Proxy cloud trả `Tunnel connection failed: 403 Forbidden` cho `baotangdanang.vn` và `dnfam-website.vr360.com.vn`. Đây là chặn mạng tại môi trường kiểm thử, không phải kết quả HTTP từ tệp nguồn. Frontend đã bật tải ảnh từ URL gốc theo yêu cầu chủ dự án. Suite dùng ảnh fixture chỉ để xác nhận luồng hiển thị và chủ động làm lỗi để xác nhận fallback; **chưa chứng minh 18 URL ảnh khác nhau tải thành công qua mạng công khai**. Không chụp ảnh fixture làm ảnh minh họa hiện vật khi bàn giao.

## Ảnh chụp

`docs/screenshots/chat-practical-{390,1366}.png` ghi phản hồi mới về ít đi bộ; `chat-typing-390.png` ghi trạng thái đang hiện chữ. Những ảnh này chỉ dùng mascot tại máy, không có ảnh hiện vật giả lập. Các ảnh dashboard và chat bản đầu được giữ làm tài liệu lịch sử, không phải bằng chứng ảnh hiện vật đã tải thật.

## Chưa chạy

- [ ] Camera, micro, giọng đọc, quét QR in giấy và tải ảnh từ thiết bị thật trên iPhone Safari/Android Chrome.
- [ ] VoiceOver/TalkBack, bàn phím thật và zoom 200%.
- [ ] Tải URL ảnh nguồn trên mạng công khai sau khi hợp nhất bản cập nhật; kiểm tra ảnh bị đổi URL tại nguồn.
- [ ] Triển khai Worker và kiểm tra model/API thật, chi phí và chất lượng dẫn nguồn. Môi trường chưa có endpoint hoặc API key; không huấn luyện/fine-tune trọng số model.
- [ ] Đối chiếu thông tin lịch sử, lịch tham quan và mặt bằng hiện hành với bảo tàng. Kiểm thử phần mềm không xác minh các dữ liệu này.
- [ ] Sau khi chủ dự án hợp nhất: chờ GitHub Pages cập nhật, kiểm tra URL V6 công khai và tải lại bỏ cache. Chưa tự hợp nhất hoặc deploy trong nhiệm vụ này.
