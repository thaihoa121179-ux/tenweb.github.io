# Bước 3 — Audio bỏ túi và đổi vai kể chuyện

Nâng cấp tiếp trên Bước 2, phiên bản 7.7.0. Mã nguồn, 200 hồ sơ, ảnh, nguồn, QR, chat và bản đồ cũ được giữ. Không cần backend, tài khoản mới hoặc API trả phí.

Mở [tuyến demo](https://thaihoa121179-ux.github.io/tenweb.github.io/bao-tang-da-nang-v6/?presentation=1&v=7.7.0), hoặc mở một trong ba hồ sơ: [Khuyên tai ba mấu](https://thaihoa121179-ux.github.io/tenweb.github.io/bao-tang-da-nang-v6/?artifact=hv-khuyen-tai-ba-mau-f7a824&v=7.7.0), [Phù điêu Cơ Tu](https://thaihoa121179-ux.github.io/tenweb.github.io/bao-tang-da-nang-v6/?artifact=phu-dieu&v=7.7.0), [Súng thần công](https://thaihoa121179-ux.github.io/tenweb.github.io/bao-tang-da-nang-v6/?artifact=sung-than-cong&v=7.7.0).

## Đã tích hợp

- Ba nút **Nhanh 30 giây**, **Mây kể trẻ em**, **Đọc chuyên sâu** trên ba hồ sơ đinh. Văn bản thay đổi ngay, giữ nút đang chọn và không gọi AI API. Nếu đang nghe, chọn kiểu mới sẽ dừng bản cũ và phát bản mới từ đầu. Nếu đang tạm dừng thì đổi văn bản, chờ bạn chạm nghe.
- Mini Player có ảnh đúng hiện vật, tên, kiểu kể, thời gian thực, thanh tua, phát/tạm dừng và đóng. Trên màn thông thường có spacer thật để giữ nội dung phía trên player/nav; trên bản đồ player nằm trong panel, không phủ lên nút điều khiển.
- Chạm tên/ảnh trong player mở cửa sổ có ảnh hiện vật, toàn bộ lời kể, ba kiểu kể và nguồn. Có thể đóng cửa sổ, tiếp tục nghe và khám phá trang khác. Vào chat/quét QR sẽ tạm dừng để tránh phát chồng âm thanh; lời đọc cũ cũng được ưu tiên khi bạn chủ động bật nó.
- Có 18 MP3 VI/EN được tạo sẵn, không phải URL placeholder; bản kể đủ VI/EN/KO/ZH nằm trong JSON. KO/ZH dùng giọng thiết bị. Bản dịch tự động chưa hiệu đính được ghi nhãn.
- Media Session API cung cấp tên, ảnh, kiểu kể và các hành động play/pause/stop/seek cho trình duyệt/hệ điều hành có hỗ trợ. Thanh thời gian dùng thời lượng MP3 thật.
- File lỗi, mất mạng hoặc codec không hỗ trợ sẽ chuyển sang đúng văn bản bằng Web Speech API. Khi dùng giọng thiết bị, thanh tua được tắt; không giả lập phần trăm hoặc thời lượng đọc. Nếu bị chặn phát, hiện nút chạm để nghe.
- SW được đổi cache version, lưu JSON và toàn bộ 18 MP3 cùng clip im lặng. Yêu cầu HTTP Range như `bytes=0-1` của Safari được trả đúng `206 Partial Content`; yêu cầu không hợp lệ nhận `416`.

Các hồ sơ ngoài ba hiện vật đinh giữ cách nghe/kể hiện có. Nội dung câu chuyện dựa trên hồ sơ; ví dụ súng thần công vẫn ghi **Theo hồ sơ: thế kỷ XIX** và phân biệt với năm phát hiện 2019. Không thêm năm chế tạo, người chế tạo hoặc trận đánh không có trong nguồn.

## Thao tác trình diễn

1. Chọn VI hoặc EN để dùng các MP3 đã chuẩn bị. Mở hồ sơ Phù điêu Cơ Tu, chạm nghe, đổi sang kiểu trẻ em rồi chuyên sâu. Cả lời và audio đổi theo lựa chọn.
2. Chạm tên/ảnh player để xem lời kể có ảnh và nguồn. Đóng cửa sổ, mở Thư viện; player vẫn nghe được. Chạm tạm dừng hoặc đóng tùy ý.
3. Mở tuyến trình diễn, chạm **Bắt đầu mô phỏng**. Đây là thao tác bật audio; clip im lặng ngắn phát trên cùng một audio element dùng suốt phiên.
4. Khi Mây đến một trong ba hiện vật đinh, MP3 của hiện vật đó tự phát. Các điểm chủ đề khác không được gán lời kể hiện vật tùy tiện. Chạm **Điểm tiếp theo** sẽ dừng lời trước để di chuyển.
5. Kéo thanh tua bản đồ chỉ xem trước; không tự phát hoặc cộng tiến độ. Chạy lại tạo một lượt mới. Mở đúng hồ sơ từ điểm dừng vẫn giữ player bỏ túi.
6. Nếu iOS vẫn chặn tự phát, chạm nút nghe trong player. Ứng dụng không dùng giọng thiết bị để giả vờ vượt quy định autoplay.

Trên trang hồ sơ, MP3 có thể tiếp tục khi trình duyệt ra nền nếu hệ điều hành cho phép. Bản đồ ngừng mô phỏng khi bị ẩn; MP3 có thể tiếp tục, còn lời đọc Web Speech được tạm dừng để tránh trạng thái sai. Khi trang bị điều hướng/rời hẳn, player dừng. Hành vi màn hình khóa còn phụ thuộc Safari/Chrome, phiên bản hệ điều hành và chế độ nguồn của điện thoại.

## JSON và file hoàn chỉnh

[data/demo-narrations.json](../../data/demo-narrations.json) là dữ liệu đầy đủ cho ba hiện vật: `artifactId`, URL nguồn chính xác, tên bốn ngôn ngữ, `stories.{vi,en,ko,zh}.{quick,kids,deep}.text`. Các mục có file thật thêm `audio: "./audio/…mp3"` và `durationSeconds`. Không thêm trường audio cho file chưa có.

| File đầy đủ | Công dụng |
| --- | --- |
| [pocket-audio-engine.js](../../pocket-audio-engine.js) | Một audio element, trạng thái, chống callback cũ, TTS fallback và Media Session |
| [pocket-audio.js](../../pocket-audio.js) | Panel ba kiểu kể, player, cửa sổ lời kể và kết nối sự kiện bản đồ |
| [pocket-audio.css](../../pocket-audio.css) | Mobile/landscape/desktop, player và spacer |
| [data/demo-narrations.json](../../data/demo-narrations.json) | 36 bản kể biên soạn theo hồ sơ, không tạo hồ sơ lịch sử mới |
| [audio/manifest.json](../../audio/manifest.json), [audio/README.md](../../audio/README.md) | Danh sách 18 MP3 thật + unlock, thời lượng, hash, cách tái tạo |
| [audio/model-provenance.json](../../audio/model-provenance.json) | Nguồn model và giấy phép dữ liệu; model không nằm trong frontend |
| [app.js](../../app.js), [experience.js](../../experience.js) | Phối hợp player với điều hướng và lời đọc có sẵn; ba hồ sơ dùng panel mới |
| [demo-tour-view.js](../../demo-tour-view.js), [live-map.js](../../live-map.js), [presentation-map.css](../../presentation-map.css) | Slot audio, sự kiện dừng/rời trang và bố cục bản đồ |
| [audio-range.js](../../audio-range.js), [sw.js](../../sw.js) | Byte Range và cache offline |
| [scripts/build-assets.mjs](../../scripts/build-assets.mjs), [bootstrap.js](../../bootstrap.js), [index.html](../../index.html) | Đóng gói/nạp 7.7.0; đường dẫn tương đối dưới subpath |
| [package.json](../../package.json), [package-lock.json](../../package-lock.json) | Phiên bản gói, không thêm thư viện runtime nặng |
| [scripts/build_demo_audio.py](../../scripts/build_demo_audio.py) | Tùy chọn tạo lại MP3 offline, không chạy trên điện thoại |
| [scripts/serve_demo.py](../../scripts/serve_demo.py) | Server thử cục bộ có gzip/Range giống host tĩnh |
| [scripts/verify_published_v6.py](../../scripts/verify_published_v6.py), [workflow](../../../.github/workflows/verify-published-v6.yml) | Đối chiếu cả MP3 thật, mã triển khai và 200 ảnh trên Pages |
| [tests/pocket-audio.test.mjs](../../tests/pocket-audio.test.mjs), [tests/pocket-audio.cjs](../../tests/pocket-audio.cjs), [tests/test_demo_audio.py](../../tests/test_demo_audio.py) | Engine/race, UI, audio thật, fallback, Media Session và SW |

Các bundle đầy đủ được sinh thêm: `bootstrap-7.7.0.js`, `app-foundation-7.7.0.js`, `app-core-7.7.0.js`, `app-runtime-7.7.0.js`, `app-styles-7.7.0.css`, `app-map-7.7.0.js`, `map-styles-7.7.0.css`. Không ghi đè bundle phiên bản cũ.

[ZIP các file thay đổi hoàn chỉnh](changed-files.zip): giải nén vào repository **đã có** tại gốc, cho phép ghi đè file tương ứng. Gói chứa các file thay đổi/thêm mới từ `25bc41a`, cả MP3 và bundle; không nhân bản ảnh/model cũ không đổi. Không có đoạn bỏ trống “giữ nguyên code cũ”.

## Chạy thử và cập nhật Pages

1. Trong `bao-tang-da-nang-v6`, chạy `npm ci` rồi `node scripts/build-assets.mjs`. Không cần cài Piper/model để build giao diện hoặc nghe MP3 đã có.
2. Chạy `python3 scripts/serve_demo.py --port 8878`, mở `http://127.0.0.1:8878/bao-tang-da-nang-v6/`. Server này hỗ trợ tua MP3; `python -m http.server` thông thường có thể thiếu HTTP Range.
3. Để thử SW cục bộ, thêm `?pwa=1`. Chọn ngôn ngữ/tên rồi đợi service worker cài xong. Trên Pages tự đăng ký sau màn chào.
4. Đưa toàn bộ file đã kiểm tra lên nhánh Pages. Giữ đường dẫn `/bao-tang-da-nang-v6/`; `/share/` vẫn là trang đọc HTML tĩnh cho công cụ như Gemini.
5. Trước khi trình chiếu, mở web có mạng, tải/kiểm tra các bản kể cần dùng, rồi bật máy bay và tải lại. Bộ audio thêm khoảng 3 MB; lần tải đầu cần mạng để cài cache.

Nếu muốn tái tạo/thay giọng, làm theo [audio/README.md](../../audio/README.md). Nếu dùng KO/ZH khi mất mạng, cần cài giọng tương ứng trên thiết bị; nếu thiết bị không có giọng phù hợp, vẫn đọc được toàn bộ văn bản và nguồn. Không yêu cầu API key, Cloudflare hoặc Vercel cho bước này.

## Checklist iPhone Safari và Chrome Android thật

Các kiểm thử tự động dùng Chromium. Danh sách này dành cho máy trình chiếu thật; API màn hình khóa và giọng hệ điều hành không được coi là đã kiểm thử phần cứng qua mô phỏng.

- [ ] Mở link mới trên màn 360–430px; ban đầu không tự phát. Chọn nghe và kiểm tra âm lượng thực tế.
- [ ] Đổi ba kiểu kể; lời đổi ngay, audio trước dừng, kiểu mới phát từ đầu. Tạm dừng rồi đổi kiểu không tự phát lại.
- [ ] Tua MP3 trên player, khóa màn hình: kiểm tra tên, ảnh, nút phát/tạm dừng của Media Session nếu hệ điều hành hỗ trợ.
- [ ] Từ hồ sơ sang Thư viện: player còn hoạt động, nội dung và nav không bị che. Mở chat hoặc QR: audio được tạm dừng.
- [ ] Mở cửa sổ lời kể, xem ảnh và nguồn, đóng rồi tiếp tục nghe. Xoay ngang, kiểm tra mọi nút còn bấm được.
- [ ] Trên tuyến demo, chạm Bắt đầu; đến ba hiện vật thì phát lời đúng hiện vật. Nếu bị chặn, chạm nghe trong player.
- [ ] Tua hoặc chạy lại bản đồ: không phát nhầm lời của điểm cũ, không tăng tiến độ tham quan thật.
- [ ] Cài cache khi có mạng; bật máy bay, tải lại, thử cả ba hiện vật và ba kiểu kể bằng VI/EN.
- [ ] Thử Hàn/Trung với giọng của máy; nếu cần offline, cài giọng trước. Văn bản, ảnh và nguồn vẫn phải hiện khi audio không có.
- [ ] Mở bàn phím ở trang Cá nhân, đóng bàn phím, trở lại hồ sơ; player/nav bố trí đúng. Thử mạng chậm rồi rời trang để kiểm tra không tự bật âm thanh muộn.

Bước 4 (Xưa & Nay) và Bước 5 (confetti, thẻ 9:16) chưa nằm trong lần nâng cấp này.


## Kết quả đã chạy

| Kiểm tra | Kết quả |
| --- | --- |
| Node — dữ liệu, RAG, Worker, map và engine audio | 173/173 |
| Python — nhập dữ liệu, verifier và MP3 thật | 23/23 |
| Audio — phát/tua, persona, race, autoplay, Media Session, bốn ngôn ngữ, offline | 10/10 nhóm |
| Bản đồ demo hiện có | 8/8 nhóm |
| Chỉ đường bản đồ tự do | 9/9 nhóm |
| Chức năng cũ: chat, QR, nhiệm vụ, video, giọng nói, PWA | 24/24 nhóm |
| MP3 được ffmpeg giải mã đầy đủ, đo thời lượng và kiểm tra tín hiệu | 19/19, gồm clip im lặng |
| File triển khai + 200 ảnh riêng biệt + MP3 trên server thử | Đạt, SHA khớp |
| axe WCAG A/AA: panel, player và cửa sổ lời kể | 0 lỗi tự động phát hiện |
| Lighthouse mobile cold trên server gzip cục bộ | Performance 91 · Accessibility 100 · Best Practices 100 |

Giọng đọc phần cứng và giao diện màn hình khóa thật chưa được xác thực bằng Chromium. Với TTS, khả năng nghe tiếp từ từ gần nhất phụ thuộc sự kiện word boundary của hệ điều hành; máy không cung cấp sự kiện này có thể đọc lại từ đầu. MP3 có tua/thời gian thật và không phụ thuộc hạn chế đó.

Ảnh thực tế từ trình duyệt: [Nhanh](quick-390.png), [trẻ em](kids-390.png), [cửa sổ có ảnh và nguồn](transcript-390.png), [audio ở điểm đến](map-audio-390.png), [điện thoại ngang](landscape-844.png), [desktop](desktop-1440.png). Kết quả web công khai được đo riêng bằng GitHub Actions, không thay bằng điểm cục bộ.
