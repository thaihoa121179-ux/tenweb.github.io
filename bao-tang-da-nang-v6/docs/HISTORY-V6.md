# Lịch sử trước bản 7

Tài liệu lưu trữ. Tính năng GPS trong nhà và ba tab trò chuyện đã được thay bằng luồng tập trung bảo tàng trong bản 7. Xem README hiện tại.

# Đà Nẵng Museum Companion V6 — Mây

Bản nâng cấp độc lập từ V5, dành cho trình diễn công nghệ. Không phải website chính thức của Bảo tàng Đà Nẵng. V1–V5 và website gốc được giữ nguyên.

## Đặt tên, GPS và hướng nhìn — bản 6.9

Màn hình chào có tên/biệt danh (tối đa 30 ký tự hoàn chỉnh) và lựa chọn **Tiếp tục với tên Khách**. Tên lưu tại thiết bị, dùng trong lời chào trang chủ và Mây; có thể đổi hoặc xóa trong **Cá nhân**. Không tạo tài khoản, không gắn tên vào URL hay request AI. Nếu storage bị chặn, tên chỉ giữ trong phiên. Người đã chọn ngôn ngữ ở phiên bản cũ được mời đặt tên một lần; deep link QR tiếp tục sau bước này.

Trong **Bản đồ & hướng nhìn**, bấm **Vị trí của tôi** để xin quyền GPS và hiện chấm xanh, vòng sai số theo mét, tọa độ và tuổi của bản cập nhật. Bấm **Bật hướng nhìn** để xin quyền la bàn (iOS) và hiện tia xanh xoay theo điện thoại. Nền bản đồ luôn hướng Bắc lên trên; màn hình ngang được bù góc. Cầm điện thoại gần nằm ngang, tránh kim loại để đọc la bàn tốt hơn. Dữ liệu `heading` của GPS chỉ hướng di chuyển nên không được dùng thay hướng điện thoại; cảm biến chỉ có góc tương đối không được coi là hướng Bắc.

GPS là bản đồ địa lý riêng, không được đặt vào sơ đồ tầng mô phỏng. GPS trong nhà có thể lệch và không xác định phòng/tầng; mốc QR/thủ công tiếp tục hoạt động độc lập. Trình duyệt thiếu quyền, cảm biến hoặc HTTPS có thông báo và có thể thử lại. Nút Dừng, chuyển trang, ẩn tab và `pagehide` giải phóng GPS/cảm biến; dữ liệu cũ được đánh dấu thay vì giả vị trí trực tiếp. Tọa độ không lưu vào storage, nhật ký hoặc request AI.

Leaflet 1.9.4 được lưu cùng website tại `vendor/leaflet-1.9.4/`, kèm giấy phép. Tile OpenStreetMap chỉ tải sau khi chủ động bật GPS, có ghi công trên bản đồ, cần kết nối mạng. Khi tile không tải được vẫn hiện tọa độ, vòng sai số và la bàn trên nền lưới. Không cần API key bản đồ. Kiểm thử dùng GPS/cảm biến giả lập của Chromium, không thay cho kiểm tra la bàn Safari/Android trên điện thoại thật.

## Phân tích yêu cầu và nhịp đọc — bản 6.8, 15/11/2026

Mặc định bật **Suy nghĩ kỹ** và **Chữ: Chậm**. Câu “muốn học bài k muốn đi bảo tàng” được tách thành mục tiêu học và điều kiện không đi bảo tàng, thay vì bị chuyển sang tra cứu hiện vật. Bộ phân tích trong `request-plan.js` nhận mục tiêu có/không muốn, hỏi lại khi có hai lựa chọn chưa rõ ưu tiên, giữ môn học/thời lượng trong câu nối tiếp và lập kế hoạch có tổng thời gian khớp nhau. Chế độ kỹ trình bày mục tiêu, bước làm và phần kiểm tra; chế độ gọn giữ các điểm chính. Bộ giải cục bộ hỗ trợ phương trình bậc nhất một ẩn, kiểm lại nghiệm và từ chối biểu thức không thuộc dạng hỗ trợ, không dùng `eval`.

Chữ Chậm hiện từng cụm ký tự hoàn chỉnh khoảng 42ms/cụm và ngắt thêm ở dấu câu; không tăng tốc vì câu trả lời dài và không dồn ký tự khi một frame bị chậm. Có Vừa, Hiện ngay và Theo thiết bị; thay tốc độ áp dụng cho cả phản hồi đang hiện. Theo thiết bị tôn trọng reduced motion; lựa chọn Chậm/Vừa là yêu cầu hiển thị chủ động. Nút Hiện ngay, chuyển trang, đổi ngôn ngữ hoặc ẩn tab giải phóng tiến trình hiển thị. Nhịp đọc không được mô tả là thời gian mô hình suy nghĩ.

**Phân tích hiện tại chạy trên thiết bị.** Giao diện ghi rõ phạm vi này. Các giai đoạn chuẩn bị tương ứng thao tác thật, không thêm bộ đếm “suy nghĩ” giả. Worker tùy chọn nhận `depth: deep`: yêu cầu trả lời kỹ bằng model thường, hoặc gửi `reasoning_effort: high` nếu người vận hành cấu hình `OPENAI_REASONING_MODEL` phù hợp ở máy chủ. Lần cập nhật này không có credential/backend để triển khai hoặc kiểm thử một mô hình thật; không tuyên bố đã kích hoạt suy luận LLM cho bản Pages tĩnh.

## Giao diện điện thoại và trò chuyện đời thường — 15/11/2026

Bản 6.7 sắp lại trang chủ, thẻ hiện vật, thanh điều hướng và màn hình Mây cho điện thoại. Banner gọn hơn, hai thẻ chức năng xuất hiện sớm hơn; bộ lọc thư viện nằm trên một hàng, ảnh hiện vật lớn hơn. Ô nhập chữ 16px, xử lý chiều cao `visualViewport`, thu gọn thành phần phụ khi bàn phím mở và hỗ trợ màn hình ngang/chữ lớn.

Mây có ba nhóm gợi ý **Khám phá / Chuyện thường ngày / Chút vui**. `conversation.js` bổ sung phản hồi có biên tập và ngữ cảnh trong phiên cho tâm trạng, ăn uống, học tập/công việc, giao tiếp, chi tiêu, câu đố, đùa, giả tưởng, thơ và phép tính đơn giản. Có biến thể khi yêu cầu “kể tiếp”, nhớ lựa chọn ăn chay, thời lượng học và cách nói ngắn/nghiêm túc. Chuyện hư cấu có nhãn; câu hỏi bảo tàng tiếp tục dùng hồ sơ có nguồn. Chỉ sửa lời chào khi chưa có hội thoại, không xóa lịch sử khi đổi ngôn ngữ.

Phần trò chuyện này chạy tại thiết bị bằng bộ nhận diện và kịch bản, không phải một mô hình tạo sinh được huấn luyện lại. Nội dung chat/nhớ ngữ cảnh không lưu vào storage; câu trò chuyện được xử lý cục bộ kể cả khi đã cấu hình backend bảo tàng. Câu chưa hiểu được hỏi lại; giá/thời tiết hiện hành không được đoán. Worker tạo sinh tùy chọn vẫn cần triển khai và credential riêng như trước.

Kiểm thử: 25 nhóm trình duyệt cũ, 11 nhóm điện thoại/hội thoại mới, 73 kiểm thử Node và 19 kiểm thử Python. Các chiều rộng 320/360/375/390/430/768px và màn hình ngang 844×390px đã được kiểm tra bằng Chromium. Bàn phím được mô phỏng bằng thay đổi vùng nhìn; không thay cho kiểm tra Safari trên thiết bị thật.

## Bản cập nhật thư viện và Mây — 15/11/2026

Thư viện hiện có **200 hồ sơ có ảnh thật lưu cùng website**: 57 hồ sơ Đà Nẵng, 6 hồ sơ Bảo tàng Lịch sử Quốc gia và 137 hồ sơ tham khảo từ Victoria and Albert Museum. Nhóm tham khảo ghi rõ bảo tàng nguồn, không dùng làm điểm tham quan hoặc vị trí trưng bày Đà Nẵng. Dữ liệu V&A giữ nguyên nơi sản xuất/nơi tìm thấy; có hiện vật làm tại Trung Quốc, tìm thấy ở Việt Nam. Hồ sơ mới giữ ngôn ngữ nguồn, không giả bản dịch.

Thư viện phân trang 24 hồ sơ, lọc bảo tàng/chất liệu/video, tìm không dấu và giữ lựa chọn khi quay lại. Cả 143 hồ sơ tham khảo có ảnh, niên đại, chất liệu, số kiểm kê và URL nguồn. Bốn hồ sơ điêu khắc Cơ Tu có một phim tư liệu cùng chủ đề; chủ đề văn hóa xứ Quảng có phim Bài chòi. Nhãn video phân biệt liên hệ theo chủ đề với bằng chứng hiện vật xuất hiện. Trình phát chỉ tải sau khi bấm, dừng khi đóng hoặc chuyển trang.

Mây nhận dạng tên đầy đủ của cả 200 hồ sơ, nhớ ngữ cảnh và điều kiện, so sánh và xử lý câu hỏi về thuộc tính thiếu. Chưa triển khai mô hình tạo sinh; bản nâng cấp không tuyên bố đã huấn luyện hoặc tăng trí thông minh ba lần. Bộ đo 80 tình huống trên cùng tập 57 hồ sơ cũ: bộ nhận diện tăng từ 53/80 lên 74/80 (66,25% → 92,5%); còn 6 lỗi và 1 hồi quy so với bản gốc. Báo cáo lần đo đầu được giữ cố định, các sửa lỗi tích hợp sau đó được ghi riêng.

## Chạy tại máy

Không cần build, tài khoản hoặc API key cho frontend. Dùng Python 3:

```sh
cd /workspace/tenweb.github.io
python3 -m http.server 8000 --bind 127.0.0.1
```

Mở thư mục `/bao-tang-da-nang-v6/` trên máy chủ vừa chạy. Camera/micro cần HTTPS hoặc localhost và sự cho phép của người dùng. Không mở HTML trực tiếp nếu muốn kiểm thử đầy đủ quyền trình duyệt.

## Đã thực hiện

- Dashboard mobile-first và bố cục desktop rộng; xanh di sản, kem, đồng; Be Vietnam Pro tự lưu trữ, có dấu tiếng Việt.
- Điều hướng 5 mục cố định; bàn phím, focus rõ ràng, skip link, đối thoại chọn ngôn ngữ có focus trap, mục không hoạt động được ẩn với trình đọc màn hình.
- Robot Mây từ V5 trên banner và mỗi phản hồi. Năm nội dung banner; chuyển thủ công, tự chạy theo lựa chọn người dùng, tạm dừng và giảm chuyển động.
- 200 hồ sơ hiện vật và 15 chủ đề; 9 hồ sơ kế thừa có bản dịch Việt/Anh/Hàn/Trung, hồ sơ bổ sung giữ nguyên ngôn ngữ nguồn và ghi nhãn.
- Tìm kiếm gợi ý theo thời gian thực, không dấu, một lỗi gõ nhẹ, Enter mở kết quả. Cả thư viện và tìm kiếm chung đều tìm hồ sơ hiện vật.
- Ảnh hiện vật được lưu nội bộ, ghi nguồn theo từng bảo tàng; có fallback khi tệp không tải được.
- Phản hồi hiện chữ dần, giữ nguyên dấu tiếng Việt/emoji; nút **Hiện ngay**, giảm chuyển động và hỗ trợ trình đọc màn hình. Không dùng hiệu ứng zoom cả câu trả lời.
- Hiểu cách viết tắt `k/ko`, lỗi gõ nhẹ; gợi ý hiện vật đáng xem, câu hỏi so sánh, lựa chọn ít đi bộ, không muốn xem triển lãm, quiz/nhật ký; giữ sở thích, loại trừ và thời gian trong phiên. Chọn tiếp bằng “cái thứ hai” và hỏi niên đại/chất liệu của đúng hiện vật.
- Trợ lý dữ liệu có dẫn nguồn, nối tiếp hiện vật/chất liệu/niên đại và sở thích/thời gian, đọc, sao chép, đánh giá và mở hồ sơ/sơ đồ. Hội thoại được giữ trong phiên khi đổi ngôn ngữ; không lưu nội dung chat vào storage.
- Camera QR xử lý trên thiết bị; nhập mã và chọn ảnh; tạo QR SVG tại máy, không gọi dịch vụ tạo QR. Tám mã mẫu có thể bấm hoặc quét; URL mở đúng tầng/chủ đề/khu/hiện vật ngay sau chọn ngôn ngữ lần đầu.
- Sơ đồ chủ đề tương tác, check-in theo mốc QR và chọn mốc thủ công được phân biệt. Luôn ghi **mô phỏng**, không phải GPS hay vị trí vật lý đã xác thực.
- Hành trình theo thời gian, sở thích và nhịp độ; đánh dấu, lưu và khôi phục tiến độ.
- Quiz 5 câu có nguồn, phản hồi đáp án, điểm cao nhất và huy hiệu thực sự mở khóa.
- Cá nhân: số hồ sơ đã mở (không tự nhận đã tham quan thực tế), nhật ký 3.000 ký tự, lưu/tải/chia sẻ, tương phản cao, chữ lớn, xóa dữ liệu cá nhân.
- Dữ liệu V6 dùng storage riêng, không sửa dữ liệu của phiên bản trước. Khi storage bị chặn, hồ sơ/quiz/nhật ký vẫn dùng được trong phiên và giao diện báo giới hạn.
- Backend mẫu có truy xuất theo chỉ mục từ 200 hiện vật và 15 chủ đề phía máy chủ, kiểm tra đầu vào, CORS, giới hạn yêu cầu và timeout; khóa không nằm trong frontend. Xem [backend/README.md](backend/README.md).

## Giới hạn còn lại — không đánh dấu hoàn tất

| Hạng mục | Trạng thái |
| --- | --- |
| AI tạo sinh thực tế | **Chưa triển khai/chưa kiểm thử với mô hình thật.** Mặc định ghi “Chế độ trợ lý dữ liệu”. Chỉ báo AI tạo sinh sau phản hồi hợp lệ từ backend. |
| Ảnh hiện vật | 200 ảnh hiện vật được lưu ở `assets/museum/`, `assets/collection/`, `assets/reference/`; nguồn và mã kiểm tra giữ trong các audit. Cả 200 ảnh đã được tải, giải mã và kiểm tra không trùng trên máy chủ cục bộ. |
| Nguồn lịch sử, giờ mở cửa, vé | Kế thừa dữ liệu có dẫn nguồn của V5, không xác nhận lại là dữ liệu hiện hành. Vé mở thông báo chính thức; lịch cần đối chiếu trước chuyến đi. |
| Địa điểm hiện vật | Chưa có mặt bằng/chứng thực vị trí. Quan hệ hiện vật–chủ đề không phải tọa độ hay đường đi thực. |
| Chất liệu Đôi bầu | Chưa xác minh; “vật dụng sinh hoạt” là loại đồ vật, không phải chất liệu. |
| Camera/micro/giọng đọc | Có xử lý quyền và fallback. Cần thiết bị thật; giọng đọc/ngôn ngữ và nhận dạng phụ thuộc trình duyệt/hệ điều hành. |
| iPhone/Android/Safari thực tế | Chưa kiểm thử trên thiết bị thật. Kiểm thử tự động dùng Chromium ở 4 độ rộng, không thay thế Safari/VoiceOver/TalkBack. |
| Lưu/chia sẻ | Lưu cục bộ từng trình duyệt, không đồng bộ tài khoản. Chia sẻ dùng Web Share hoặc clipboard; luôn có tải tệp. |

Chi tiết nguồn và giới hạn dữ liệu: [DATA_SOURCES.md](DATA_SOURCES.md).

## Kiểm thử và ảnh chụp

```sh
node --test bao-tang-da-nang-v6/tests/guide-engine.test.mjs bao-tang-da-nang-v6/backend/worker.test.mjs
node bao-tang-da-nang-v6/tests/browser.cjs
```

Bộ kiểm thử trình duyệt yêu cầu Playwright và Chromium. Các lệnh trên chạy từ gốc repository, máy chủ cổng 8000 đang hoạt động. Xem [tests/README.md](tests/README.md) để cài công cụ kiểm thử riêng ngoài checkout, đổi cổng/Chromium hoặc xuất báo cáo.

[Biên bản kiểm thử](TEST_REPORT.md) · [375px](docs/screenshots/home-375.png) · [390px](docs/screenshots/home-390.png) · [768px](docs/screenshots/home-768.png) · [1366px](docs/screenshots/home-1366.png).

## Triển khai GitHub Pages sau khi duyệt PR

1. Duyệt và hợp nhất pull request V6 vào `main` khi sẵn sàng.
2. Giữ cấu hình Pages hiện tại. Nếu chưa có, chọn **Settings → Pages → Deploy from a branch → main → /(root)**.
3. V6 nằm tại `https://thaihoa121179-ux.github.io/tenweb.github.io/bao-tang-da-nang-v6/`. Trang gốc và đường dẫn V1–V5 vẫn như cũ. Đường dẫn này chỉ hoạt động sau khi thay đổi được hợp nhất và Pages triển khai thành công.
4. Kiểm tra lại deep link và QR sau triển khai. Mã QR mẫu dùng URL Pages chuẩn trên, nên quét bằng điện thoại trước triển khai sẽ chưa mở được V6.
5. Frontend không cần cấu hình secret hay npm. Backend triển khai riêng theo tài liệu; giữ API key trong secret của Worker, không đưa vào GitHub Pages, HTML hoặc JavaScript trình duyệt.

Không tự triển khai backend, hợp nhất hoặc xuất bản môi trường trong nhiệm vụ này.

## Cấu trúc

`index.html`: các màn hình; `base.css`: phong cách kế thừa; `v6.css`: thiết kế V6; `app.js`: dữ liệu/quy trình chính; `data-v6.js`: bản dịch hồ sơ; `guide-engine.js`: nhận diện ý định và sở thích, dùng chung với backend; `chat-text.js`: hiện chữ từng cụm ký tự Unicode; `v6.js`: dashboard/trợ năng; `profile.js/css`: nhật ký/quiz; `qr-decoder.js` và `qr-generator.js`: thư viện chạy tại máy; `backend/`: Worker tùy chọn.

Thư viện QR và font được lưu kèm thông báo giấy phép trong `licenses/`. Ảnh robot là tài sản có sẵn của dự án V5. Ảnh hiện vật giữ nguyên liên kết và chú thích nguồn gốc.

## Bản cập nhật hội thoại/ảnh sau V6 đầu tiên

“Luyện não” trong bản này là cải thiện nhận diện ý định, tìm hồ sơ, ngữ cảnh và prompt backend; **không phải huấn luyện hay fine-tune trọng số một mô hình**. Chế độ dữ liệu hoạt động ngay trên Pages. Trò chuyện tạo sinh cần triển khai Worker và cấu hình API key ở server; chưa có key, endpoint hay model thật trong môi trường này. Mẫu backend được cải thiện nhưng chưa triển khai. Đánh giá 👍/👎 được ghi nhận, không được quảng cáo là tự huấn luyện mô hình.

Lựa chọn ít đi bộ chỉ giảm số chủ đề/số tầng; không chứng minh đường ngắn nhất, thang máy hay lối xe lăn. Hỏi nhân viên bảo tàng khi cần thông tin hỗ trợ di chuyển.

## Ảnh đã lưu nội bộ

Bản cập nhật sau cùng đã tải đủ 18 ảnh gốc vào `assets/museum/`, gồm ảnh cho 9 hồ sơ hiện vật và các ảnh không gian. `media-map.js` ánh xạ URL nguồn sang tệp nội bộ; `SOURCES.json` giữ nguồn. GitHub Actions nhập ảnh bằng HTTPS, kiểm tra mã HTTP/kích thước/chữ ký định dạng rồi mới lưu. Đã kiểm tra 9 ảnh hiện vật thật trong Chromium, không dùng fixture cho các ảnh nội bộ. Các nhận xét trước đó về chưa tải được ảnh chỉ phản ánh giai đoạn cloud bị chặn nguồn; bước nhập ảnh nay đã hoàn tất qua workflow.

## Thư viện mở rộng: 57 hiện vật

Đợt nhập ngày 14/11/2026 rà 77 hồ sơ từ sitemap chính thức thuộc Cơ sở 1 và Cơ sở 2. Giữ 9 mục cũ, thêm 48 mục có ảnh được giải mã thật, niên đại, chất liệu và thông tin nguồn gốc/mô tả đủ rõ; bỏ 20 hồ sơ thiếu dữ liệu. Tổng cộng **57 hiện vật: 33 Cơ sở 1, 24 Cơ sở 2**. Không lấy thêm tác phẩm Mỹ thuật chỉ để tăng số lượng.

`collection.js` chứa dữ liệu nguồn, `assets/collection/` lưu 48 ảnh WebP tối ưu từ ảnh gốc; `data/collection-audit.json` lưu số lượng và danh sách loại trừ. Mỗi hồ sơ có URL nguồn, SHA-256 ảnh gốc, thông tin cơ sở và nội dung tiếng Việt nguyên nguồn. Chất liệu ngoài bảng chỉ được lấy khi văn bản ghi rõ, có lưu câu bằng chứng. Không suy đoán từ hình ảnh.

Thư viện có bộ lọc hai cơ sở, tìm kiếm, QR/link mở trực tiếp, kích thước khi có và phần nội dung hồ sơ đầy đủ. Sơ đồ cơ sở 1 không được dùng để định vị các hiện vật nhập thêm khi nguồn chưa xác nhận vị trí. Backend cũng nhận thêm 48 hồ sơ; không cần triển khai model để tìm và hỏi chất liệu theo dữ liệu cục bộ.

Dữ liệu mới giữ nguyên tiếng Việt của nguồn; giao diện vẫn có 4 ngôn ngữ và trang chi tiết ghi rõ khi nội dung chưa có bản dịch. Không tự tạo bản dịch hoặc ghi niên đại mới như thông tin lịch sử đã xác minh. Những giới hạn cũ về cơ sở dữ liệu 9 mục/24 bản ghi backend chỉ mô tả bản đầu.
