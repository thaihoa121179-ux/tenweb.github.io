# Tài sản và thư viện

- `qr-generator.js`: qrcode-generator **1.4.4**, Kazuhiko Arase, MIT; lấy từ npm bằng `npm pack` có kiểm tra integrity chuẩn của npm. Thông báo giấy phép nằm ở đầu tệp; README gốc trong `licenses/qrcode-generator-README.md`.
- `qr-decoder.js`: bản jsQR kế thừa V4, giấy phép MIT giữ trong `licenses/qr-decoder.txt`.
- `fonts/*.woff2`: Be Vietnam Pro, gói **@fontsource/be-vietnam-pro 5.2.6**, SIL OFL 1.1. Lưu các subset latin và vietnamese, normal 400/500/600/700; `licenses/be-vietnam-pro-OFL.txt`.
- `ai-robot.webp`: sao chép nguyên tệp V5, không chỉnh sửa hay tải ảnh bên thứ ba. Nguồn/quyền tài sản gốc do chủ dự án xác nhận.
- Ảnh bảo tàng/VR360 được hiển thị trực tiếp từ URL nguồn gốc theo yêu cầu chủ dự án, có ghi công. Không tạo giấy phép mới hoặc thay ảnh hiện vật bằng ảnh khác. Xem `DATA_SOURCES.md`.

Frontend không cần CDN script, tải font bên ngoài, dịch vụ QR hoặc trình quản lý gói khi chạy. Ảnh hiện vật/không gian tải từ hai host nguồn đã ghi trong DATA_SOURCES.
