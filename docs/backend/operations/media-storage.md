# Media storage và image manager

Backend dùng `ObjectStorage` làm boundary. Local/test mặc định dùng `FakeObjectStorage`, lưu object vào `backend/s3_upload_fake/`; thư mục này bị gitignore và không được commit ảnh người dùng.

`MediaManager` chỉ làm việc với storage port và `MediaAsset` metadata: tạo upload intent, kiểm tra MIME/size, complete asset sang `READY`, list và soft-delete. Khi chọn S3-compatible provider, cấu hình `MEDIA_STORAGE_DRIVER=s3` cho S3/MinIO hoặc `MEDIA_STORAGE_DRIVER=r2` cho Cloudflare R2; API và database contract không đổi. Hai driver được giữ song song để có thể chuyển provider bằng environment mà không đổi metadata.

Fake flow dùng:

1. `POST /weddings/{weddingId}/media/upload-intents` tạo `MediaAsset(PENDING_UPLOAD)` và backend upload intent.
2. `PUT /weddings/{weddingId}/media/{mediaId}/upload` nhận bytes ảnh tại backend; backend xác thực nội dung, chuyển JPEG/PNG/WebP sang WebP bằng `sharp`, rồi chỉ ghi file WebP vào object storage. Ảnh gốc không được lưu.
3. `POST /weddings/{weddingId}/media/{mediaId}/complete` kiểm tra object WebP tồn tại và chuyển sang `READY`.
4. `GET /weddings/{weddingId}/media` liệt kê media; `GET/PATCH /weddings/{weddingId}/media/{mediaId}` xem chi tiết hoặc cập nhật `altText`; `DELETE` soft-delete metadata và xóa object storage.

Không publish asset nếu chưa `READY`. R2 dùng S3 API với endpoint dạng `https://<account-id>.r2.cloudflarestorage.com`; bucket phải được tạo trước trên Cloudflare và backend không tự gọi `CreateBucket`. `R2_PUBLIC_BASE_URL` nên trỏ custom domain/public URL của bucket để URL ảnh dùng được trên website.

Audio của catalog nhạc nền cũng dùng `ObjectStorage`; PostgreSQL chỉ lưu `MediaAsset`/`MusicTrack` metadata và reference. Audio có allowlist MIME, giới hạn size, scan/metadata verification riêng và có thể cần derivative streaming. Platform admin upload qua contract module `music`; không tái sử dụng route media owner-scoped. Xem [backend nhạc nền cưới](../modules/background-music.md).
