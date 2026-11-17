# Kiểm thử điện thoại và demo

Checklist này dành cho iPhone Safari và Chrome Android thật; các ô không đánh dấu sẵn. Kiểm thử Chromium tự động mô phỏng màn hình/viewport không thay cho bàn phím, camera, compass hoặc giọng đọc của hệ điều hành.

## Chuẩn bị

Mở URL Pages có `?v=7`, cho hoàn tất bộ nhớ offline ở lần đầu có mạng. Ghi tên máy, OS, phiên bản trình duyệt, ngày, ngôn ngữ, trạng thái kết nối. Thử chiều rộng 360, 375, 390, 430px bằng xoay máy và công cụ trình duyệt; kèm chữ lớn trong Cá nhân. Để reset chỉ dữ liệu demo, dùng Xóa nhật ký & tiến độ; tên có nút dùng tên Khách riêng. Không xóa toàn bộ website của người dùng chỉ để chạy thử.

## Bố cục và điều hướng

- [ ] Chọn đủ VI/EN/KO/ZH, nhập `ok` thành `Ok`; tên Khách có lời chào chung, avatar viết hoa.
- [ ] Cả năm mục nav cùng hàng/baseline; vùng nội dung cuối cuộn đến được, không bị home indicator/nav che.
- [ ] Trang chủ thấy Hỏi Mây / Quét QR / Lộ trình trước hero; trở lại có Tiếp tục xem.
- [ ] Header thu khi cuộn xuống, hiện khi lên; chat/quét không còn global header.
- [ ] Thư viện: tìm kiếm giữ trên, filter sheet đóng/mở bằng tay và phím, chip xóa lọc đúng, lưới/list không lệch ảnh, cuộn tải thêm không lặp hồ sơ.
- [ ] Hồ sơ tham khảo luôn có tên bảo tàng sở hữu, không có nút gán vào sơ đồ Đà Nẵng.
- [ ] Bật chữ lớn / reduced motion: vẫn đọc/chạm được; không cuộn ngang. Duyệt tới cuối Cá nhân, quiz, thư viện, ô Nhập mã.

## Chat, bàn phím và AI

- [ ] Hồ sơ → Hỏi Mây → “cái này bao nhiêu tuổi?” đúng ngữ cảnh và đúng nguồn, tối đa ba chạm để bắt đầu câu hỏi.
- [ ] Đổi ngôn ngữ không làm mất lịch sử; ba câu gợi ý theo hồ sơ đổi ngôn ngữ.
- [ ] Mở bàn phím, xoay ngang, mở/đóng thanh địa chỉ Safari: composer vẫn ở trên bàn phím, có vùng đọc tin nhắn.
- [ ] Menu ⋯ chứa chi tiết, tốc độ chữ và cấu hình backend; Đóng/quay lại không giữ focus sau overlay.
- [ ] Chọn Chậm: câu trả lời có nhiều khung chữ trung gian, không phóng cả đoạn; Hiện ngay bỏ qua hiệu ứng. Reduced motion được tôn trọng.
- [ ] Tắt hoặc nhập sai backend: nói rõ fallback hồ sơ tại thiết bị; dữ kiện và nguồn vẫn đúng.
- [ ] Hỏi cân nặng chưa có trong hồ sơ / tầng không tồn tại / yêu cầu đổi luật: không bịa và hướng tới nguồn/nhân viên.
- [ ] Hỏi tiếng Anh/Hàn/Trung bằng micro khi trình duyệt hỗ trợ, trạng thái đang nghe đúng; từ chối quyền có cách nhập chữ.
- [ ] Nghe câu trả lời có trạng thái đang nói/dừng, chuyển trang dừng đọc; giọng hệ thống có thể chưa cài đủ ngôn ngữ.

## Quét, chụp và kể chuyện

- [ ] Vào tab Quét xin quyền và tự mở camera sau khi cho phép; rời tab/ẩn app dừng track.
- [ ] Từ chối quyền: Retry và hướng dẫn bật lại quyền hiện; Chọn ảnh QR / Nhập mã vẫn dùng được.
- [ ] Đèn flash chỉ hiện trên track có torch; thử bật/tắt trên Android hỗ trợ, không ép Safari thiếu torch.
- [ ] In QR từ `qr-print/`, camera thực sự giải mã đúng tầng/hiện vật; quét QR tầng đặt mốc “Bạn đang ở đây”.
- [ ] Mã dùng thử chỉ hiện ở `?demo=1`; sơ đồ luôn ghi minh họa, GPS chỉ là link chỉ đường ngoài trời.
- [ ] Nghe hiện vật kể đủ ba giọng, câu chuyện có nguồn và nhãn đúng cục bộ/AI, không tự đổi niên đại.
- [ ] Chụp & hỏi: xem trước, chỉ upload sau bấm Nhận diện; ảnh xử lý còn tối đa 1024px. Khi thiếu backend, không giả nhận diện.
- [ ] Ảnh vật không có trong thư viện hoặc góc chụp mờ: không tự khẳng định khớp, có chọn thủ công tối đa ba ứng viên.
- [ ] Video chỉ tải sau bấm phát, giữ ghi công nguồn; nếu nhà cung cấp chặn nhúng vẫn có link nguồn.

## Nhiệm vụ, offline, dữ liệu và dashboard

- [ ] Nhiệm vụ 3–5 hồ sơ hoàn thành sau mở/quét các ID thật; thưởng một lần, reload giữ tiến độ, không hiện 0/215 gây nhầm.
- [ ] Quiz: đáp án đúng là trường nguồn, giải thích và link hồ sơ hoạt động ở cả bốn ngôn ngữ.
- [ ] Lộ trình 15/30/60: đổi/bỏ điểm, reload giữ; lý do không bịa khoảng cách/phòng/thang máy.
- [ ] Tạo PNG, ảnh có tên/ngày/chủ đề/hiện vật/Mây; tải và share sheet thật, không đưa tên/nhật ký vào request AI.
- [ ] Sau khi cài offline xong, bật chế độ máy bay rồi reload: app + JSON chạy, hiện nhãn ngoại tuyến, ảnh đã xem có sẵn; ảnh chưa lưu báo lỗi thân thiện.
- [ ] Worker lỗi hoặc mất mạng giữa chừng không làm mất note, tên, tiến độ. Cập nhật PWA chỉ reload khi bấm.
- [ ] Dashboard `may-demo`: mô phỏng ghi nhãn rõ; chuyển Thiết bị này chỉ có số đếm tại máy, không thấy nội dung câu hỏi/tên.
- [ ] Bật gửi số đếm khi có server rồi kiểm tra `/events`; admin secret sai không mở được `/metrics`, lỗi không đổi nhãn sang dữ liệu thật.
- [ ] Browser storage bị chặn/đầy: cảnh báo local/session thân thiện, ứng dụng vẫn mở được hồ sơ.

## Kịch bản trình diễn 3 phút

1. Chọn English và tên khách. Dùng camera quét QR Trang sức mã não in từ trang A4.
2. Bấm Ask Mây, micro: “What is it made of?”. Kiểm tra chip Viewing và thẻ nguồn; bấm nghe câu trả lời.
3. Trở lại hồ sơ → Hear the object’s story → Visitor. Nghe, xem nhãn và nguồn, mở một hồ sơ liên quan.
4. Cá nhân → chọn nhiệm vụ ba hiện vật; mở các hồ sơ còn lại → huy hiệu Completed.
5. Create journey card → Download image / Share. Khi có backend thật, tổng kết chỉ dùng các ID đã đọc; khi chưa có, nhãn biên soạn cục bộ giữ rõ.

Chuẩn bị phương án nhập chữ khi Web Speech không hỗ trợ; phương án chọn ảnh QR khi camera bị khóa bởi trình duyệt nhúng. Không trình diễn fallback như thể model thị giác đã nhận diện thật.
