# Bàn giao Museum Companion V6

Làm việc trong `bao-tang-da-nang-v6/`, không sửa V1–V5 hoặc website gốc nếu chưa được yêu cầu. Mỗi nhiệm vụ cloud đã cách ly; dùng checkout có sẵn, không tự tạo Git worktree.

Đọc [README.md](README.md), [TEST_REPORT.md](TEST_REPORT.md) và [DATA_SOURCES.md](DATA_SOURCES.md). Đây là frontend HTML/CSS/JavaScript tĩnh, không cần build. Server phục vụ từ gốc checkout; V6 đã có bản QR decoder riêng, không phụ thuộc tài nguyên V4 lúc chạy.

`app.js` kế thừa các bản ghi V5 và cung cấp `window.Museum`; `data-v6.js` bổ sung bản dịch và trạng thái dữ liệu; `v6.js` phụ trách dashboard; `profile.js` ghi nhật ký và quiz. Sự kiện `museum:navigate`, `museum:language`, `museum:route`, `museum:position` dùng để đồng bộ các màn hình. Storage core dùng tiền tố `museum_v6:`; profile dùng `museum_v6_personal` riêng. Không đọc/xóa storage V5.

Mặc định là **trợ lý dữ liệu**, không phải mô hình tạo sinh. Backend tùy chọn có tài liệu và test nhưng chưa triển khai. Không đặt API key vào mã phía client. Không tuyên bố dữ liệu kế thừa đã được bảo tàng xác minh lại, không gán vị trí vật lý cho hiện vật. Ảnh hiện vật chỉ được hiển thị khi đã có hồ sơ quyền sử dụng; hiện là placeholder có chủ đích.

Chạy kiểm thử browser/backend sau thay đổi. Camera, micro, đọc trên điện thoại, screen reader và mặt bằng thật còn cần kiểm thử/xác nhận riêng. Không merge PR hoặc deploy nếu chưa có chỉ dẫn.
