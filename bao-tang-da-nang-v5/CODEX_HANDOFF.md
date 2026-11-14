# Bảo tàng Đà Nẵng – Museum Companion V5.1

**Demo web:** https://thaihoa121179-ux.github.io/tenweb.github.io/bao-tang-da-nang-v5/

## Hướng dẫn Codex

Đây là website một trang HTML tĩnh; chatbot “Mây AI” hiện dùng bộ kiến thức và quy tắc nội bộ. **Chưa có AI tạo sinh** nếu không triển khai backend riêng. Không đặt API key trong HTML hay repository.

Ảnh robot đã nhúng dưới dạng WebP base64 trong `index.html` để mở file HTML riêng không bị thiếu ảnh. File `ai-robot.webp` trong gói ZIP là bản ảnh gọn để Codex thay đổi khi cần.

### Các việc nên giao Codex tiếp theo

1. Tách CSS/JS khỏi HTML thành các module dễ bảo trì (giữ nguyên tính năng hiện có).
2. Bố cục responsive: desktop (2 cột ở trang trợ lý) và smartphone (1 cột).
3. Nối backend AI bảo mật với nguồn kiến thức Bảo tàng Đà Nẵng; câu trả lời có dẫn nguồn và có lời thú nhận khi thiếu dữ liệu.
4. Thử QR thực tế, micro, ảnh hiện vật, thời gian phản hồi; không bịa tọa độ phòng/tủ hiện vật.
5. Giữ mascot Mây AI ở trang chủ và bên cạnh mỗi phản hồi; có biểu tượng cảm xúc theo ngữ cảnh.
6. Chọn ngôn ngữ Việt/Anh/Hàn/Trung đầu trải nghiệm và đảm bảo nội dung giao diện robot chuyển theo ngôn ngữ.

### Mở dự án trong Codex

Chọn GitHub repository `thaihoa121179-ux/tenweb.github.io`, nhánh `main`, thư mục `bao-tang-da-nang-v5/` rồi yêu cầu Codex chỉnh sửa. Tránh đưa mật khẩu/API key lên GitHub Pages.