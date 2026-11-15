# Phân tích yêu cầu và chữ chậm — 6.8, 15/11/2026

- **92/92 kiểm thử Node**: giữ toàn bộ kiểm thử dữ liệu/nhận diện trước, thêm tách ý và phủ định, kế hoạch theo môn/thời gian, phương trình bậc nhất có kiểm nghiệm, bộ đếm frame cho nhịp chữ và tham số suy luận Worker. Không gọi provider thật.
- **25/25 nhóm trình duyệt hồi quy**, **11/11 nhóm điện thoại/hội thoại** đạt, gồm 200 ảnh thật, nguồn, QR, kế hoạch, hồ sơ và các kích thước 320–844px. Chỉnh riêng hàng điều khiển cho màn hình ngang; sửa autofocus trễ không giành focus đang nằm trong hộp thoại ngôn ngữ.
- **5/5 nhóm nhịp đọc/chế độ kỹ**: kiểm tra chữ đang hiện thực sự dài dần, mặc định Chậm ngay cả khi hệ điều hành báo reduced motion; đổi Hiện ngay giải phóng submit; chế độ kỹ/gọn thay nội dung; đúng câu trong ảnh, câu có ý ngược lại, môn/thời gian nối tiếp và bài toán `2x+3=7` → giải thích chuyển vế. Giữ lịch sử học cục bộ ngoài các lượt gửi API bảo tàng.
- **19/19 Python** đạt về parser nguồn và verifier xuất bản; verifier nay so khớp `request-plan.js`, `chat-text.js`, `v6.js` và thứ tự phụ thuộc.

Chế độ kỹ cục bộ là phân tích mục tiêu/điều kiện và trình bày thêm, không phải đo suy nghĩ nội bộ của LLM. Tests Worker dùng response giả lập để kiểm tra model/effort/budget/timeout/citation. Chưa có API key/backend để gọi mô hình thật. Bộ đo 80 câu của phiên bản trước không được dùng làm bằng chứng cho khả năng suy luận mới.

Báo cáo thực chạy: `docs/reports/depth-6.8.json`, `browser-6.8.json`, `mobile-6.8.json`; ảnh mẫu trong `docs/screenshots/depth-6.8/`. Câu trả lời môn học ngắn như “Toán”, “Văn”, “Hóa” chỉ nối vào kế hoạch khi đang có ngữ cảnh học. Bằng chứng Pages và 200 ảnh do workflow tự kiểm tra sau mỗi thay đổi V6, độc lập với báo cáo cục bộ.

---

## Biên bản phiên bản trước

# Điện thoại và hội thoại đời thường — bản 6.7, 15/11/2026

- **25/25 nhóm trình duyệt hồi quy** đạt: giữ 200 hồ sơ/ảnh thật, tìm kiếm, QR, lộ trình, quiz, nhật ký, bốn ngôn ngữ, trường hợp lỗi backend, câu hỏi nối tiếp và nguồn tham khảo. Các lượt đời thường không lọt vào lịch sử gửi API ở câu hỏi bảo tàng tiếp theo.
- **11/11 nhóm điện thoại/hội thoại** đạt: 320×568, 360×740, 375×812, 390×844, 430×932, 768×1024, 844×390; composer không bị khuất, không tràn ngang, đổi nhóm gợi ý giữ focus, bốn ngôn ngữ và chữ lớn. Thu vùng nhìn xuống 500px khi focus input rồi khôi phục để kiểm tra luồng bàn phím. Desktop không chồng nút chủ đề lên tin nhắn.
- **73/73 Node** đạt, gồm 14 tình huống hội thoại mới: tâm trạng không bị chuyển thành trò đùa, tiếng Việt có dấu/viết hoa, đùa đổi câu, bữa ăn chay nối với yêu cầu nấu nhanh, thời gian học, giả tưởng có nhãn, phép tính âm/thập phân/ngoài giới hạn, bảo toàn phạm vi tư liệu và các ngôn ngữ hỗ trợ.
- **19/19 Python** đạt: nguồn dữ liệu/video và trình kiểm tra xuất bản, thêm phát hiện CSS mobile cũ và sai thứ tự module hội thoại.
- 200/200 ảnh cục bộ tiếp tục giải mã được, mã kiểm tra tệp/URL không trùng. Cập nhật bộ kiểm tra Pages để so khớp cả `conversation.js`, `mobile.js`, `mobile.css` và thứ tự tải trước/sau `app.js`.

`docs/reports/mobile-6.7.json` và `docs/reports/browser-6.7.json` giữ kết quả thực chạy. Ảnh xem trước nằm ở `docs/screenshots/mobile-6.7/`.

Phạm vi phép thử: Chromium mô phỏng thiết bị và thay đổi viewport, chưa kiểm tra bàn phím Safari/camera/giọng đọc trên máy thật. Các tình huống hội thoại kiểm tra bộ phản hồi cục bộ, không đo chất lượng một LLM và không chứng minh đã huấn luyện mô hình mới. Không gọi provider thật trong phép thử.

---

## Hồ sơ kiểm thử bản mở rộng trước đó

# Kiểm thử bản mở rộng 200 hồ sơ — 15/11/2026

Kiểm tra trên bộ dữ liệu thật tại commit dữ liệu `aa18764`: 200 hiện vật, gồm 57 Đà Nẵng, 6 Bảo tàng Lịch sử Quốc gia và 137 V&A. Tất cả 143 hồ sơ tham khảo có ảnh, niên đại, chất liệu, số kiểm kê và nguồn; không gán vị trí Đà Nẵng.

- **25/25 nhóm trình duyệt**: điều hướng, tìm kiếm, 4 ngôn ngữ, 4 kích thước, QR, lộ trình, quiz, nhật ký, lưu/khôi phục, lỗi backend giả lập, phân trang và nguồn tham khảo. 200/200 ảnh thật được giải mã, không dùng fixture thay ảnh hiện vật.
- **59/59 kiểm thử Node**: 37 backend, 20 bộ nhận diện và 2 bộ dữ liệu thực tế. Bộ kiểm tra tên xác nhận cả 200 hồ sơ truy xuất đúng bằng tên nguồn đầy đủ.
- **17/17 kiểm thử Python**, bao gồm parser gốc, 4 bằng chứng nguồn video và 8 tình huống kiểm tra xuất bản.
- **8/8 nhóm thành phần video**, cộng luồng tích hợp thật: chatbot → hồ sơ Cơ Tu → mở/đóng phim; Bài chòi chỉ trên chủ đề; rời trang giải phóng trình phát. Request player ngoài được chặn trong kiểm thử, không xác nhận YouTube phát được.
- Thư viện kiểm tra với dữ liệu thật và fixture 205 mục riêng: chỉ dựng 24 mục/trang, lọc đúng, giữ focus, 4 ngôn ngữ và 4 chiều rộng. Fixture không được tính vào 200 hồ sơ thật.
- Bộ kiểm tra HTTP cục bộ độc lập tải/giải mã đủ **200 ảnh, 200 URL và 200 SHA-256 khác nhau**, so khớp đúng tệp trong checkout, kích thước tối thiểu 128px mỗi chiều.
- Bộ đo resolver cố định 80 tình huống trên corpus gốc 57 hiện vật: bản cũ **53/80 (66,25%)**, bản mới **74/80 (92,5%)**, còn 6 lỗi và 1 hồi quy. Không phải phép đo chất lượng mô hình tạo sinh hoặc bằng chứng “thông minh gấp ba”. Báo cáo lần đo đầu và các thay đổi tích hợp sau phép đo đều được giữ riêng.

Workflow `Verify published V6 photos and deployed assets` kiểm tra lại byte của các module, dữ liệu, CSS và toàn bộ ảnh trên URL GitHub Pages; báo cáo nằm trong artifact của lần chạy. Dữ liệu kiểm tra cục bộ không tự được gọi là bằng chứng bản live.

Phạm vi còn lại: chưa triển khai Worker với mô hình/credential thật; camera, micro, giọng đọc, Safari và thiết bị vật lý cần kiểm tra riêng. Video xác nhận URL/chú thích trên nguồn, chưa xác nhận khả năng phát hoặc hiện vật cụ thể xuất hiện trong phim chủ đề.

---

## Biên bản lưu trước bản mở rộng

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

## Kết quả bổ sung: ảnh nội bộ

Workflow `Import original museum photos` run `43615884744` đã thành công, lưu 18 ảnh gốc ở commit `6c3ec42`. Pages run `43615980831` đã triển khai thành công. Chromium tải và giải mã thành công cả 9 ảnh hiện vật thật từ `assets/museum/` (kích thước gốc 589–1600px ngang), không sử dụng fixture cho các ảnh này. Các URL JavaScript/CSS đã có mã phiên bản để bỏ cache của bản placeholder cũ.

## Đợt mở rộng 57 hiện vật

- 23/23 nhóm browser đạt, gồm giải mã đủ 57 ảnh nội bộ thật, bộ lọc 33/24 hiện vật theo cơ sở, dữ liệu nguồn mới, hỏi nối tiếp chất liệu, không bịa tầng, deep link và nhãn tiếng Việt ở giao diện ngoại ngữ.
- 34 kiểm thử Node đạt (11 hội thoại, 23 backend); thêm 5 kiểm thử parser Python đạt trên HTML nguồn chính thức: giữ nguyên metadata, lấy chất liệu chỉ từ câu rõ ràng, loại vật liệu chưa biết, nhận nguồn gốc trong mô tả và không nhận tin tức thành hiện vật.
- Nguồn rà 77 hồ sơ, thêm 48, giữ 9, loại 20 thiếu dữ liệu; dữ liệu và ảnh không trùng URL/ảnh gốc giữa các mục mới. Cả 57 ảnh nội bộ đã giải mã trong Chromium.
- Chỉ sửa V6 và các workflow phục vụ nhập dữ liệu; website gốc và V1–V5 giữ nguyên. Chưa có bản dịch mới hay mặt bằng vị trí được xác minh; nguồn tiếng Việt được ghi nhãn rõ.
