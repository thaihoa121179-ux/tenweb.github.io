# Đà Nẵng Museum Companion V6 — Mây

Bản nâng cấp độc lập từ V5, dành cho trình diễn công nghệ. Không phải website chính thức của Bảo tàng Đà Nẵng. V1–V5 và website gốc được giữ nguyên.

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
- 9 hồ sơ hiện vật và 15 chủ đề kế thừa; dịch tên, mô tả, niên đại, chất liệu, điều hướng và quiz sang Việt/Anh/Hàn/Trung.
- Tìm kiếm gợi ý theo thời gian thực, không dấu, một lỗi gõ nhẹ, Enter mở kết quả. Cả thư viện và tìm kiếm chung đều tìm hồ sơ hiện vật.
- Trợ lý dữ liệu có dẫn nguồn, nối tiếp hiện vật/chất liệu/niên đại và sở thích/thời gian, đọc, sao chép, đánh giá và mở hồ sơ/sơ đồ. Hội thoại được giữ trong phiên khi đổi ngôn ngữ; không lưu nội dung chat vào storage.
- Camera QR xử lý trên thiết bị; nhập mã và chọn ảnh; tạo QR SVG tại máy, không gọi dịch vụ tạo QR. Tám mã mẫu có thể bấm hoặc quét; URL mở đúng tầng/chủ đề/khu/hiện vật ngay sau chọn ngôn ngữ lần đầu.
- Sơ đồ chủ đề tương tác, check-in theo mốc QR và chọn mốc thủ công được phân biệt. Luôn ghi **mô phỏng**, không phải GPS hay vị trí vật lý đã xác thực.
- Hành trình theo thời gian, sở thích và nhịp độ; đánh dấu, lưu và khôi phục tiến độ.
- Quiz 5 câu có nguồn, phản hồi đáp án, điểm cao nhất và huy hiệu thực sự mở khóa.
- Cá nhân: số hồ sơ đã mở (không tự nhận đã tham quan thực tế), nhật ký 3.000 ký tự, lưu/tải/chia sẻ, tương phản cao, chữ lớn, xóa dữ liệu cá nhân.
- Dữ liệu V6 dùng storage riêng, không sửa dữ liệu của phiên bản trước. Khi storage bị chặn, hồ sơ/quiz/nhật ký vẫn dùng được trong phiên và giao diện báo giới hạn.
- Backend mẫu có truy xuất 24 bản ghi phía máy chủ, kiểm tra đầu vào, CORS, giới hạn yêu cầu và timeout; khóa không nằm trong frontend. Xem [backend/README.md](backend/README.md).

## Giới hạn còn lại — không đánh dấu hoàn tất

| Hạng mục | Trạng thái |
| --- | --- |
| AI tạo sinh thực tế | **Chưa triển khai/chưa kiểm thử với mô hình thật.** Mặc định ghi “Chế độ trợ lý dữ liệu”. Chỉ báo AI tạo sinh sau phản hồi hợp lệ từ backend. |
| Ảnh hiện vật | **Chưa có bằng chứng giấy phép.** Giữ 9 URL ảnh và URL hồ sơ gốc trong dữ liệu; dùng placeholder rõ ràng. Mở nguồn để xem ảnh, không tự sao chép ảnh chưa được phép. |
| Nguồn lịch sử, giờ mở cửa, vé | Kế thừa dữ liệu có dẫn nguồn của V5, không xác nhận lại là dữ liệu hiện hành. Vé mở thông báo chính thức; lịch cần đối chiếu trước chuyến đi. |
| Địa điểm hiện vật | Chưa có mặt bằng/chứng thực vị trí. Quan hệ hiện vật–chủ đề không phải tọa độ hay đường đi thực. |
| Chất liệu Đôi bầu | Chưa xác minh; “vật dụng sinh hoạt” là loại đồ vật, không phải chất liệu. |
| Camera/micro/giọng đọc | Có xử lý quyền và fallback. Cần thiết bị thật; giọng đọc/ngôn ngữ và nhận dạng phụ thuộc trình duyệt/hệ điều hành. |
| iPhone/Android/Safari thực tế | Chưa kiểm thử trên thiết bị thật. Kiểm thử tự động dùng Chromium ở 4 độ rộng, không thay thế Safari/VoiceOver/TalkBack. |
| Lưu/chia sẻ | Lưu cục bộ từng trình duyệt, không đồng bộ tài khoản. Chia sẻ dùng Web Share hoặc clipboard; luôn có tải tệp. |

Chi tiết nguồn, quyền ảnh và giới hạn dữ liệu: [DATA_SOURCES.md](DATA_SOURCES.md).

## Kiểm thử và ảnh chụp

```sh
node --test bao-tang-da-nang-v6/backend/worker.test.mjs
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

`index.html`: các màn hình; `base.css`: phong cách kế thừa; `v6.css`: thiết kế V6; `app.js`: dữ liệu/quy trình chính; `data-v6.js`: bản dịch hồ sơ; `v6.js`: dashboard/trợ năng; `profile.js/css`: nhật ký/quiz; `qr-decoder.js` và `qr-generator.js`: thư viện chạy tại máy; `backend/`: Worker tùy chọn.

Thư viện QR và font được lưu kèm thông báo giấy phép trong `licenses/`. Ảnh robot là tài sản có sẵn của dự án V5; nguồn/quyền của tài sản kế thừa cần nhóm dự thi xác nhận trước khi công bố thương mại.
