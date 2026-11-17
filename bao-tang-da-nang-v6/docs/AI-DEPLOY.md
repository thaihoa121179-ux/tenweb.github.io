# Bật AI, triển khai Worker và dịch hồ sơ

## 1. Chuẩn bị

Cài Node.js 24. Tạo tài khoản tại https://dash.cloudflare.com/ và tài khoản API tại https://platform.openai.com/ . API được tính phí riêng; đặt ngân sách / cảnh báo trong trang quản lý nhà cung cấp. Tạo khóa API ở trang API keys; không đưa vào chat, repository, `app.js`, ảnh chụp hoặc ô URL backend.

Bản giao đã có mã và dry-run build thành công; chưa có credential để đăng nhập hoặc triển khai Worker trong tài khoản của bạn. CORS mặc định chỉ `https://thaihoa121179-ux.github.io` — origin không có đường dẫn và không có dấu `/` cuối. CORS không phân biệt các thư mục trên cùng origin GitHub Pages.

## 2. Tạo Worker

Mở terminal trong `bao-tang-da-nang-v6/backend`:

```sh
npx wrangler@4.50.0 login
npx wrangler@4.50.0 secret put OPENAI_API_KEY
npx wrangler@4.50.0 deploy
```

Lệnh đầu mở trang Cloudflare để bạn đăng nhập; lệnh thứ hai hỏi khóa theo cơ chế secret của Wrangler. Không chèn khóa vào câu lệnh hoặc file. Lệnh cuối in địa chỉ dạng `https://danang-museum-may-v6.<tài-khoản>.workers.dev`.

`wrangler.jsonc` có sẵn hai binding rate limit (Wrangler hỗ trợ từ 4.36). Nếu tài khoản đã dùng namespace 1001/1002 cho ứng dụng khác, đổi sang hai ID riêng. Không bỏ binding để “sửa nhanh” lỗi 503; backend cố ý không chạy khi không có giới hạn. Cấu hình `OPENAI_MODEL` / `OPENAI_VISION_MODEL` đều mặc định `gpt-4.1-mini` và `observability.enabled=false`.

## 3. Nối website

Trên web chọn **Mây AI → ⋯ → Cấu hình backend · dành cho nhóm phát triển**. Mở bảng cấu hình, dán **URL Worker + `/chat`**, ví dụ `https://danang-museum-may-v6.example.workers.dev/chat`, bấm ✓. Chỉ nhập URL, không nhập API key. Ô `#ai-endpoint` và nút `#ai-endpoint-save` hiện có được đưa vào menu này để dùng trên điện thoại. Để quay về chế độ cục bộ, xóa URL rồi bấm ✓.

Thử mở Trang sức mã não → Hỏi Mây → “cái này bao nhiêu tuổi?”. Thẻ nguồn phải mở lại hồ sơ đúng. Chọn Nghe hiện vật kể: chỉ khi Worker trả kết quả hợp lệ mới đổi nhãn thành **Lời kể do AI diễn đạt từ hồ sơ**. Chụp & hỏi: xem trước ảnh, bấm Nhận diện, so sánh ba ứng viên rồi tự chọn. Mức khớp là gợi ý từ model, không phải xác suất đã hiệu chuẩn.

## 4. Model và trả lời chi tiết

| Biến | Mặc định / tác dụng |
|---|---|
| `OPENAI_API_KEY` | Secret bắt buộc cho các endpoint AI |
| `OPENAI_MODEL` | `gpt-4.1-mini`: chat, lời kể, lộ trình, tổng kết |
| `OPENAI_VISION_MODEL` | `gpt-4.1-mini`: đọc và đối chiếu ảnh |
| `OPENAI_REASONING_MODEL` | Để trống. Nếu đặt: chỉ chế độ chi tiết dùng model hỗ trợ `reasoning_effort: high`, JSON schema và `max_completion_tokens` |
| `ALLOWED_ORIGINS` | Origin Pages chính xác; không dùng `*` |
| `NARRATIONS` | KV tùy chọn cache lời kể theo hash hồ sơ/ngôn ngữ/giọng/model, 24 giờ |
| `METRICS` | KV tùy chọn lưu số đếm ẩn danh, không dùng làm nhật ký cá nhân |
| `ADMIN_SECRET` | Secret ít nhất 12 ký tự để đọc `/metrics`, khác mật khẩu demo |

Có thể chọn model OpenAI rẻ hơn nếu model đó hỗ trợ ảnh và strict JSON schema; kiểm thử lại trước khi đổi. Không tự thay URL này bằng API Gemini: API cần adapter tương ứng. “Trả lời chi tiết” tăng nội dung cần kiểm tra, không biến bộ tra cứu cục bộ thành mô hình reasoning. Chữ chạy là hiệu ứng trình bày, có thể bỏ qua ngay; không thêm thời gian chờ giả.

## 5. Cache lời kể và dashboard server (tùy chọn)

```sh
npx wrangler@4.50.0 kv namespace create NARRATIONS
npx wrangler@4.50.0 kv namespace create METRICS
npx wrangler@4.50.0 secret put ADMIN_SECRET
```

Wrangler in ID của mỗi namespace. Thêm cấp cao nhất trong `wrangler.jsonc`:

```json
"kv_namespaces": [
  { "binding": "NARRATIONS", "id": "ID_NARRATIONS_VUA_TAO" },
  { "binding": "METRICS", "id": "ID_METRICS_VUA_TAO" }
]
```

Deploy lại. Trong **Cá nhân → Cài đặt**, bật gửi số đếm ẩn danh nếu muốn tổng hợp server. Mặc định chỉ đếm tại thiết bị. Đếm loại câu hỏi, ID hồ sơ, mốc QR, ngôn ngữ, nhiệm vụ; không gửi tên, GPS, ghi chú, câu hỏi thô hoặc ảnh cho dashboard. KV có thể mất cập nhật đồng thời, số đếm chỉ xấp xỉ cho demo.

Mở `../admin/`, mật khẩu demo `may-demo` chỉ mở giao diện mô phỏng. Chọn kết nối server, nhập URL Worker và **admin secret**, tải. Secret gửi qua HTTPS, không lưu ở trình duyệt. Không đặt admin secret vào HTML. Khi lỗi, màn hình giữ nguyên nhãn dữ liệu hiện tại. Số quét QR không được gọi là lượng khách thật.

## 6. Dịch dữ liệu lúc build

Chín hồ sơ gốc có sẵn bốn bản dịch. 191 hồ sơ mở rộng hiện vẫn là nguyên văn nguồn — không đánh dấu đã dịch khi chưa chạy model.

Cách dễ nhất: tạo repository secret `OPENAI_API_KEY` ở GitHub **Settings → Secrets and variables → Actions → New repository secret**. Vào **Actions → Build optional record translations → Run workflow**, chọn số hồ sơ mới, thử `1` trước; đặt `200` khi đã xem chất lượng và ngân sách. Workflow chỉ trả artifact dữ liệu, không tự commit hay xuất bản. Tải artifact, chép JSON/cache vào `data/`, chạy build / test và cập nhật repository. Workflow cần secret; khi chưa có thì từ chối rõ ràng, không tạo bản dịch giả.

Hoặc trong terminal đã được cấp biến môi trường `OPENAI_API_KEY` bằng trình quản lý secret của máy build:

```sh
cd bao-tang-da-nang-v6
# Mặc định chỉ dịch 1 hồ sơ mới để giới hạn chi phí.
node scripts/translate-content.mjs
python3 scripts/build_content.py
npm run build
npm test
```

`TRANSLATION_LIMIT=200` cho phép dịch hết những hồ sơ còn thiếu; `OPENAI_MODEL` đổi model build. Cache `data/translations-cache.json` được khóa bằng hash nội dung nguồn + URL + model + phiên bản prompt. Không gọi lại khi đã có cache. Các bản dịch mới mang nhãn **Dịch tự động · chưa duyệt**. Kiểm tra tên riêng, niên đại, đơn vị, xuất xứ và phạm vi bảo tàng trước khi dùng chính thức. Dữ liệu nguyên văn vẫn giữ trong hồ sơ để đối chiếu.

## 7. Lỗi thường gặp

- **403:** origin chưa khớp hoặc admin secret sai. Không tắt CORS để khắc phục.
- **429:** chờ một phút; rate limit áp dụng theo endpoint / IP và toàn Worker.
- **503:** thiếu key, rate limit binding hoặc METRICS. Kiểm tra Cloudflare Settings → Variables and Secrets / Bindings.
- **502 / timeout:** nhà cung cấp, model/schema hoặc KV lỗi; không đưa response lỗi chứa dữ liệu riêng lên giao diện. Chat và lời kể giữ fallback có nguồn.
- **Camera/micro bị chặn:** mở quyền Camera/Microphone trong cài đặt Safari/Chrome; cần HTTPS. Không thể dùng script thay người dùng cấp quyền hệ điều hành.
- **Ảnh không nhận diện được:** thử ánh sáng tốt, cả hiện vật và nhãn; chọn thủ công. Không dùng demo này để khẳng định danh tính khoa học.
