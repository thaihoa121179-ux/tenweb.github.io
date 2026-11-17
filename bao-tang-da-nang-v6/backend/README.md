# Backend Mây — Cloudflare Worker

Worker dùng chung JSON chuẩn với frontend, hỗ trợ `/chat`, `/story`, `/identify`, `/route`, `/summary`, `/events`, `/metrics`. Chưa triển khai Worker thật trong lần bàn giao này vì chưa có credential của chủ tài khoản; website tra cứu cục bộ vẫn chạy.

Xem [hướng dẫn từng bước](../docs/AI-DEPLOY.md). Model mặc định `gpt-4.1-mini`, có ảnh / đa ngôn ngữ / JSON schema. Đây là API có phí, không cam kết gói miễn phí. Đổi model qua biến Worker, không sửa key vào JS.

```sh
node --test worker.test.mjs features.test.mjs
npx wrangler@4.50.0 deploy --dry-run --outdir /tmp/museum-worker-build
```

CORS chỉ origin đã cấu hình. Rate limit bắt buộc: 6/phút/IP/endpoint, 30/phút toàn Worker; cấu hình thiếu hoặc limiter lỗi thì từ chối. Đây là kiểm soát demo, không phải chống mọi kiểu lạm dụng công khai. `/metrics` cần thêm `ADMIN_SECRET` và `METRICS`; mật khẩu `may-demo` ở frontend không mở được dữ liệu server.

Không log request hoặc upstream error. Chat dùng tối đa 5 hồ sơ, ID gợi ý từ client được đối chiếu với corpus server, lịch sử giới hạn 8 lượt / ngân sách ký tự. Câu thiếu nguồn hoặc thuộc tính chưa có sẽ từ chối, không tự lấy phân loại “vật dụng sinh hoạt” làm chất liệu. Lời kể kiểm tra nguồn và năm mới xuất hiện; nhận diện ảnh chỉ trả ứng viên đã biết và yêu cầu người dùng xác nhận. Điều này giảm lỗi, không bảo đảm tuyệt đối mọi mệnh đề của model đều chính xác.
