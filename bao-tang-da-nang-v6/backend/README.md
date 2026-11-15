# API tùy chọn cho Mây V6

Mặc định V6 chạy bằng **Chế độ trợ lý dữ liệu**, không cần backend hay khóa API. Thư mục này cung cấp Cloudflare Worker để triển khai riêng khi cần câu trả lời tạo sinh. Chưa triển khai Worker, chưa gọi nhà cung cấp thật và chưa xác minh chất lượng câu trả lời từ mô hình thật trong lần bàn giao này.

Phần trò chuyện đời thường 6.7 nằm trong `../conversation.js`, chạy cục bộ và không đi qua Worker này. API tiếp tục phục vụ câu hỏi có nguồn về bảo tàng; cập nhật này không triển khai hoặc đổi mô hình tạo sinh.

## Mức trả lời kỹ và cấu hình reasoning 6.8

POST `/chat` có thể gửi `depth: "standard" | "deep"`; thiếu trường dùng standard, giá trị khác bị từ chối. Deep kiểm tra lại mục tiêu, phủ định, điều kiện và nguồn, yêu cầu kết luận cùng giải thích ngắn công khai; không yêu cầu hay xuất chuỗi suy nghĩ riêng.

- Nếu không đặt `OPENAI_REASONING_MODEL`, giữ model hiện có, không gửi `reasoning_effort` không được hỗ trợ; nâng giới hạn completion lên 1.800 token và vẫn giữ giới hạn ký tự/citation.
- Nếu người vận hành đặt `OPENAI_REASONING_MODEL` tại máy chủ, deep dùng model đó với `reasoning_effort: "high"`, tối đa 6.000 completion token (bao gồm ngân sách reasoning của provider). Model được chọn phải hỗ trợ schema JSON và các tham số này. Phản hồi mô tả `reasoningMode: "model"` chỉ khi đã dùng cấu hình đó.
- Timeout sâu tối đa 40 giây mặc định (giới hạn cấu hình test 45s), client 50s; lỗi/thiếu citation tiếp tục fail closed. Không in nội dung upstream hoặc khóa.
- Yêu cầu ưu tiên học nhưng không muốn đi bảo tàng được nhận ra ở máy chủ và trả kế hoạch cục bộ `mode: data`, `analysis: local`, không gọi provider. Frontend vẫn xử lý các lượt học này tại thiết bị, không gửi trong lịch sử API.

Chưa triển khai reasoning backend và chưa gọi mô hình thật trong cập nhật này. Tests chỉ chứng minh định tuyến/tham số/giới hạn, không chứng minh chất lượng của một model hoặc thay đổi trọng số. Không đưa API key vào frontend hay cuộc trò chuyện.

## Dữ liệu và giới hạn

`corpus.mjs` là bản chụp 15 chủ đề và 9 hồ sơ hiện vật từ V5 tại commit `83b2d7fb0804965a274f502638bf16986c940cba`. Các URL nguồn được giữ nguyên. Một lỗi phân loại được làm rõ: “Vật dụng sinh hoạt” của Đôi bầu là loại đồ vật, không phải chất liệu; trường chất liệu được đặt `null` (chưa xác minh), đồng nhất với dữ liệu V6. Đây là dữ liệu kế thừa của dự án, **chưa được kiểm chứng độc lập lại**; cần đối chiếu với bảo tàng trước khi công bố là thông tin đã xác thực. Không suy ra tọa độ hiện vật từ chủ đề hoặc tầng. Không có bản vẽ mặt bằng chính thức. QR chỉ xác nhận mốc check-in; lộ trình là gợi ý chủ đề, thời lượng ước tính.

Corpus hiện tại còn nối thêm các hồ sơ đã nhập ở `../collection.js`; số lượng thay đổi theo lần nhập và phải đọc báo cáo nguồn thực tế, không mặc định đã có 200 hồ sơ. Kiểm thử với bộ dữ liệu tổng hợp 220 hồ sơ chỉ kiểm tra khả năng truy xuất và giới hạn ngữ cảnh, không chứng minh có 220 hiện vật thật.

API không tải website tùy ý và không nhận tài liệu do trình duyệt cung cấp làm nguồn tin. Nó xếp hạng bản ghi ở máy chủ bằng tên, từ khóa, chủ đề và ngữ cảnh hiện vật hợp lệ; chỉ gửi tối đa 6 bản ghi cho mô hình. Chỉ mục ID/tên/nội dung được tạo và dùng lại cho mỗi corpus trong Worker; một câu hỏi hiện vật đơn lẻ chọn bản ghi phù hợp nhất thay vì đẩy cả thư viện vào prompt. Mỗi bản ghi có đoạn mô tả tối đa 1.200 ký tự, trường metadata giới hạn độ dài, đầu ra tối đa 900 token và phản hồi thô từ provider tối đa 64 KiB. Lịch sử hội thoại dùng để hiểu câu hỏi nối tiếp về thuộc tính/thông tin bảo tàng, không được coi là nguồn sự thật hoặc tự làm câu hỏi mới trở thành có căn cứ. Không tìm thấy nguồn hoặc hỏi chất liệu đã biết là chưa xác minh thì trả lời thiếu dữ liệu, không gọi mô hình. Đầu ra mô hình không dẫn nguồn được thay bằng câu trả lời thiếu dữ liệu. Phương pháp này chưa phải tìm kiếm vector. Kiểm tra ID nguồn chỉ bảo đảm URL thuộc tập dữ liệu đã truy xuất, **không chứng minh mọi mệnh đề được nguồn đó hỗ trợ**; chỉ dẫn mô hình và cấu trúc JSON không thể bảo đảm điều này. Cần kiểm duyệt kết quả với chuyên gia trước khi dùng chính thức.

Tên, mô tả, niên đại và chất liệu của cả 9 hiện vật có đủ bốn bản dịch biên tập (Việt/Anh/Hàn/Trung), đồng nhất với `data-v6.js`; đây không phải bản dịch được bảo tàng phê duyệt. Bộ tìm kiếm chuẩn hóa Hangul về NFC sau xử lý dấu và giữ sở thích khi câu hỏi nối tiếp chỉ đổi thời gian tham quan.

API không phân phối ảnh; frontend hiển thị URL ảnh nguồn theo yêu cầu chủ dự án và giữ ghi công nguồn.

## Kiểm thử cục bộ

Node.js 24 trở lên, không cần cài gói:

```sh
cd /workspace/tenweb.github.io/bao-tang-da-nang-v6/backend
node --test worker.test.mjs
```

Các kiểm thử giả lập dịch vụ bên ngoài, bao gồm giới hạn truy cập và nhà cung cấp. Chúng kiểm tra chọn dữ liệu, ngữ cảnh nối tiếp, CORS, kiểm tra đầu vào, kích thước thân yêu cầu, giới hạn tần suất bắt buộc, từ chối cấu hình thiếu, lọc nguồn và lỗi nhà cung cấp. Chúng không chứng minh rate limit đã được cấp phát trên tài khoản Cloudflare hay mô hình thật trả lời đúng.

## Triển khai Cloudflare Worker

1. Cần tài khoản Cloudflare có quyền Workers, OpenAI API có thanh toán và quyền dùng model đã chọn, cùng người vận hành chịu trách nhiệm chi phí. Không nhập khóa trong chat hoặc mã nguồn.
2. Kiểm tra `wrangler.jsonc`. `ALLOWED_ORIGINS` phải chứa **origin HTTPS đầy đủ** của website (không có đường dẫn, không có dấu `/` cuối). Có thể phân tách nhiều origin bằng dấu phẩy. Mặc định là origin GitHub Pages của dự án. CORS phân biệt origin, không thể giới hạn riêng thư mục V6 trên cùng một origin.
3. Dùng Wrangler >=4.36, ví dụ cài một phiên bản cố định bạn đã rà soát bên ngoài thư mục website. Đăng nhập tài khoản và lưu khóa qua luồng bí mật của Cloudflare:

   ```sh
   cd /workspace/tenweb.github.io/bao-tang-da-nang-v6/backend
   npx wrangler@4.36.0 login
   npx wrangler@4.36.0 secret put OPENAI_API_KEY
   npx wrangler@4.36.0 deploy
   ```

   Chọn `namespace_id` chưa dùng trong tài khoản cho hai binding `AI_RATE_LIMITER` và `AI_GLOBAL_LIMITER`; giữ hai ID khác nhau. Khóa chỉ được lưu ở Cloudflare, không có trong `wrangler.jsonc`. Không commit `.dev.vars` hoặc `.env`. Nếu dùng model khác, kiểm tra nó hỗ trợ `json_schema` và `max_completion_tokens` trước khi cập nhật `OPENAI_MODEL`.
4. Xác nhận hai binding rate limit được tạo thành công. Worker trả 503 và **không gọi mô hình** nếu thiếu khóa, binding hoặc định danh IP từ Cloudflare. Cấu hình mẫu giới hạn khoảng 6 yêu cầu/phút/IP và 30 yêu cầu/phút cho khóa chung tại mỗi địa điểm Cloudflare. Đây là giới hạn xấp xỉ theo địa điểm, **không phải trần chi phí toàn cầu**. CORS cũng **không phải xác thực**: công cụ ngoài trình duyệt có thể giả origin. Trước khi mở công khai, đặt ngân sách/hạn mức tại nhà cung cấp, theo dõi usage và có cách tắt Worker/thu hồi khóa. Đối với yêu cầu chi phí nghiêm ngặt, thêm xác thực/Turnstile và bộ đếm toàn cục Durable Object; mẫu hiện tại không tuyên bố có các chức năng đó.
5. Trong V6, mở thông tin tham quan → mục cấu hình backend, nhập URL Worker `https://<tên-worker>.<tài-khoản>.workers.dev/chat`. Chỉ nhập URL, **không nhập API key**. Trình duyệt gửi POST HTTPS. Kiểm tra DevTools không có khóa phía client.
6. Kiểm tra một câu hỏi tên hiện vật, câu nối tiếp, câu ngoài dữ liệu, đổi ngôn ngữ, giới hạn 429 và nhà cung cấp lỗi. Website phải chuyển về trợ lý dữ liệu khi API lỗi. Kiểm tra nguồn trả về bằng URL chính thức và đối chiếu nội dung thật. Chỉ dùng nhãn AI tạo sinh khi API thực sự trả kết quả hợp lệ, không chỉ vì đã lưu URL.

Không triển khai backend lên GitHub Pages: Pages chỉ phục vụ tệp tĩnh. Worker là dịch vụ độc lập có chi phí và quyền triển khai riêng. Các lệnh trên là hướng dẫn cho người vận hành; không được thực hiện tự động bởi website.

Tài liệu rate limit chính thức: <https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/>. Cú pháp `ratelimits` đã được đối chiếu với nguồn tài liệu Cloudflare; toàn bộ `wrangler.jsonc` cũng đã được kiểm tra với JSON Schema trong gói `wrangler@4.36.0` chính thức. Hai binding có namespace riêng và `period: 60` hợp lệ. Cấu hình trên tài khoản thật vẫn cần kiểm thử sau triển khai.

## Phân biệt cơ quan nguồn và tư liệu tham khảo

Hồ sơ có thể bổ sung `institutionId`, `institutionName`, `referenceOnly`, `sourceSite` và `media`; Worker cũng đọc alias `institution_id`/`institution_name`/`reference_only`. Hồ sơ từ host khác nguồn Bảo tàng Đà Nẵng được xử lý bảo thủ là **tham khảo**, kể cả nếu chưa có cờ phân loại. Không tự coi tất cả hồ sơ mới là hiện vật đang ở Đà Nẵng. Nguồn bên ngoài chỉ được nhập sau khi kiểm chứng/duyệt theo quy trình dữ liệu của dự án; khả năng kỹ thuật trong API không thay thế phê duyệt nhập nguồn.

Gợi ý hiện vật và lộ trình mặc định chỉ dùng hồ sơ Đà Nẵng. Hỏi rõ tên hiện vật tham khảo hoặc tên cơ quan nguồn có thể truy xuất hồ sơ tham khảo; khi có trích dẫn từ nguồn đó, API tự thêm nhãn cơ quan và câu không xác nhận hiện vật thuộc/đang trưng bày tại Bảo tàng Đà Nẵng. Dữ liệu `thematicFloor` chỉ dùng lọc theo chủ đề, không phải tọa độ thật. Bộ lọc tầng chủ đề, cơ sở, chất liệu không được tự bỏ khi không có kết quả.

Danh sách miền nguồn được suy ra từ URL HTTPS đã lưu **ở server corpus**, không nhận allowlist hay URL nguồn từ request hoặc văn bản mô hình. Cấu trúc `sourceDetails` trong phản hồi lưu cơ quan, trạng thái tham khảo và ID hồ sơ để frontend hiển thị đúng nguồn. Khi bổ sung bảo tàng khác, frontend cũng phải kiểm tra URL theo corpus cục bộ của nó thay vì chỉ cho phép một miền cũ.

Trường `media` chỉ được xây dựng từ media của **hồ sơ server được trích dẫn**, không lấy URL ảnh/video do mô hình tự trả. Mẫu dữ liệu được hỗ trợ:

```json
{
  "institutionId": "museum-reference",
  "institutionName": "Tên bảo tàng nguồn",
  "referenceOnly": true,
  "media": [{
    "type": "video",
    "url": "https://official-museum.example/video/record-id",
    "source": "https://official-museum.example/objects/record-id",
    "title": "Tiêu đề tư liệu",
    "credit": "Chủ sở hữu/nguồn"
  }]
}
```

Đây là **ví dụ cấu trúc**, không phải nguồn video thật. Chỉ dùng liên kết thực sự kiểm chứng, có nguồn và quyền phù hợp. Có cấu trúc API không có nghĩa mỗi hồ sơ đã có video.

## Giao thức

`POST /chat`, `Content-Type: application/json`, `Origin` thuộc allowlist. Body tối đa 16 KiB:

```json
{
  "message": "Súng thần công có từ khi nào?",
  "language": "vi",
  "history": [{"role": "user", "content": "Giới thiệu súng thần công"}],
  "context": {"artifact": "sung-than-cong", "floor": 3},
  "version": "v6"
}
```

`language`: `vi`, `en`, `ko`, `zh`; câu hỏi tối đa 700 ký tự; tối đa 10 lượt lịch sử, mỗi lượt tối đa 5.000 ký tự. Chỉ chấp nhận vai trò `user` và `assistant`. ID hiện vật/chủ đề được đối chiếu corpus. Trường bổ sung bị bỏ qua, không được đưa vào prompt làm dữ kiện.

Thành công: `{ "answer": "...", "sources": ["https://baotangdanang.vn/..."], "mode": "generative", "grounded": true }`. Khi không có bản ghi phù hợp: `mode: "data"`, `sources: []`, `grounded: false`, với câu trả lời thiếu dữ liệu theo ngôn ngữ. Chỉ trả nguồn nằm trong tập truy xuất phía máy chủ. Phản hồi có thể thêm `sourceDetails: [{recordId,title,institution,institutionId,referenceOnly,source}]` và `media: [{recordId,type,url,source,title,credit}]`; các trường này lấy từ corpus, không lấy từ mô hình. Khi thiếu chất liệu, niên đại, xuất xứ, kích thước, trọng lượng hoặc vị trí đã xác minh trong trường dữ liệu, Worker trả lời cụ thể thuộc tính đang thiếu; không suy ra từ ảnh hay loại vật dụng. Câu hỏi thiếu đối tượng và số tầng không được hỗ trợ được xử lý thành lời hỏi làm rõ trước khi gọi mô hình. Không phản hồi lỗi thô hay thông tin khóa từ nhà cung cấp.

Mã lỗi: 400 đầu vào không hợp lệ, 403 origin không được phép, 404 sai đường dẫn, 405 sai phương thức, 413 quá kích thước, 415 sai kiểu nội dung, 429 quá giới hạn, 502 nhà cung cấp lỗi/hết 12 giây hoặc phản hồi sai định dạng, 503 thiếu cấu hình/giới hạn tần suất. Mọi phản hồi dùng `Cache-Control: no-store`; không bật ghi log hội thoại ở Worker. Câu hỏi và tối đa 8 lượt gần nhất được gửi tới OpenAI khi cần sinh câu trả lời (mỗi lượt cắt tối đa 1.500 ký tự; tổng lịch sử tối đa 6.000 ký tự; `store: false` gửi cho OpenAI): cần thông báo quyền riêng tư và chính sách lưu dữ liệu phù hợp trước vận hành công khai. Không gửi thông tin cá nhân nhạy cảm.

## Nhận diện nhu cầu và bộ nhớ hội thoại

`../guide-engine.js` được dùng chung với frontend để hiểu cách viết tắt `k/ko`, gợi ý hiện vật, so sánh, ít đi bộ, loại trừ sở thích và đổi thời gian. Backend suy ra sở thích từ các lượt trước của **chính request đó**, không lưu trạng thái chung giữa người dùng. Prompt yêu cầu trả lời đúng nhu cầu và đưa bước tiếp theo, không lặp câu từ chối chung cho yêu cầu tư vấn. Gợi ý ít đi bộ không được biến thành xác nhận thang máy, lối xe lăn hoặc khoảng cách thực tế.

Các thao tác UI như mở quiz, ghi nhật ký hoặc hỏi khả năng ứng dụng được xử lý tại client và vẫn ghi chế độ dữ liệu, không gọi provider. Hiệu ứng hiện chữ ở client là trình bày kết quả hoàn chỉnh; API này không tuyên bố truyền token trực tiếp hoặc đã fine-tune mô hình.
