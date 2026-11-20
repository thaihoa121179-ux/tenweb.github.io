# Âm thanh demo

Thư mục có **18 MP3 lời kể thật**: ba hiện vật × ba kiểu kể × VI/EN; và `unlock.mp3`, đoạn im lặng ngắn để mở quyền phát sau thao tác chạm. `manifest.json` ghi thời lượng, số byte và SHA-256 của từng file.

| Tên file | Hiện vật |
| --- | --- |
| `earring-{vi,en}-{quick,kids,deep}.mp3` | Khuyên tai ba mấu |
| `relief-{vi,en}-{quick,kids,deep}.mp3` | Phù điêu Cơ Tu |
| `cannon-{vi,en}-{quick,kids,deep}.mp3` | Súng thần công |

Lời kể đủ bốn ngôn ngữ nằm trong [demo-narrations.json](../data/demo-narrations.json). Bản Hàn/Trung không gắn đường dẫn MP3 giả: trình phát dùng Web Speech API, có trạng thái rõ ràng. Giọng đọc Hàn/Trung khi mất mạng phụ thuộc giọng đã cài trên điện thoại.

Âm thanh VI/EN được tổng hợp bằng Piper tại thời điểm build, dùng CPU. Không có model hoặc API key trên frontend; du khách không gửi nội dung hay tên lên dịch vụ TTS. Kiểu trẻ em dùng văn bản riêng, tốc độ chậm hơn và cao độ tăng nhẹ; đây là giọng tổng hợp, không phải bản thu chính thức của bảo tàng.

Nguồn model, giấy phép dữ liệu và hash nằm trong [model-provenance.json](model-provenance.json). Thẻ nguồn được giữ tại [licenses/pocket-audio](../licenses/pocket-audio/). Model tiếng Việt VAIS1000 sử dụng dữ liệu CC BY 4.0; model tiếng Anh LJSpeech sử dụng dữ liệu public domain. Các bản kể được biên soạn từ hồ sơ bảo tàng có dẫn nguồn, bản dịch chưa hiệu đính được gắn nhãn trong ứng dụng.

Không cần tái tạo MP3 khi chạy web hoặc build giao diện. Nếu muốn thay giọng:

1. Sửa văn bản trong `data/demo-narrations.json`, giữ `artifactId` và `source` đúng hồ sơ.
2. Cài Python package `piper-tts==1.3.0`, `ffmpeg` và `ffprobe` trên máy build.
3. Tải, kiểm tra model theo các URL trong `model-provenance.json`, giải nén vào thư mục riêng **ngoài repository**.
4. Chạy `python3 scripts/build_demo_audio.py --models-dir /duong-dan/toi/models`. Có thể dùng `--personas kids` để tạo lại riêng một kiểu kể.
5. Script cập nhật file MP3, thời lượng và manifest. Chạy lại kiểm thử trước khi đưa lên Pages, đổi phiên bản cache service worker nếu thay file đã phát hành.

Nếu tự thu âm, thay đúng file tương ứng rồi cập nhật thời lượng và SHA-256 trong JSON/manifest; có thể dùng `ffprobe` để đo. Mọi đường dẫn audio trong ứng dụng có dạng tương đối `./audio/...`.
