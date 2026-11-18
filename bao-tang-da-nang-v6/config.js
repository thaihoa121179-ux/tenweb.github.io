/* Chỉ cấu hình địa chỉ công khai. API key luôn đặt ở Worker, không đặt vào file này.
   Đổi aiEndpoint thành https://ten-worker.workers.dev/chat khi backend sẵn sàng.
   Không dùng giá trị endpoint cũ trong localStorage làm cấu hình công khai. */
globalThis.MuseumConfig = Object.freeze({aiEndpoint: ''});
