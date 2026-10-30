# Media storage và image manager

Backend dùng `ObjectStorage` làm boundary. Local/test mặc định dùng `FakeObjectStorage`, lưu object vào `backend/s3_upload_fake/`; thư mục này bị gitignore và không được commit ảnh người dùng.

`MediaManager` chỉ làm việc với storage port và `MediaAsset` metadata: tạo upload intent, kiểm tra MIME/size, complete asset sang `READY`, list và soft-delete. Khi chọn S3-compatible provider, cấu hình `MEDIA_STORAGE_DRIVER=s3` cho S3/MinIO hoặc `MEDIA_STORAGE_DRIVER=r2` cho Cloudflare R2; API và database contract không đổi. Hai driver được giữ song song để có thể chuyển provider bằng environment mà không đổi metadata.

Fake flow dùng:

1. `POST /weddings/{weddingId}/media/upload-intents` tạo `MediaAsset(PENDING_UPLOAD)` và backend upload intent.
2. `PUT /weddings/{weddingId}/media/{mediaId}/upload` nhận file JPEG/PNG/WebP tối đa 10 MB; backend xác thực nội dung và áp dụng EXIF orientation. JPEG/PNG được resize tối đa 2400 px mỗi chiều rồi chuyển sang WebP lossy quality 90 bằng `sharp`. WebP đã đúng chiều và trong giới hạn 2400 px được lưu nguyên bytes để tránh nén lossy lần hai; WebP cần xoay hoặc resize mới được re-encode. Object lưu vẫn giới hạn 10 MB. Ảnh gốc không được lưu.
3. `POST /weddings/{weddingId}/media/{mediaId}/complete` kiểm tra object WebP tồn tại và chuyển sang `READY`.
4. `GET /weddings/{weddingId}/media` liệt kê media; `GET/PATCH /weddings/{weddingId}/media/{mediaId}` xem chi tiết hoặc cập nhật `altText`; `DELETE` soft-delete metadata và xóa object storage.

Không publish asset nếu chưa `READY`. R2 dùng S3 API với endpoint dạng `https://<account-id>.r2.cloudflarestorage.com`; bucket phải được tạo trước trên Cloudflare và backend không tự gọi `CreateBucket`. `R2_PUBLIC_BASE_URL` nên trỏ custom domain/public URL của bucket để URL ảnh dùng được trên website.

Audio của catalog nhạc nền cũng dùng `ObjectStorage`; PostgreSQL chỉ lưu `MediaAsset`/`MusicTrack` metadata và reference. Audio có allowlist MIME, giới hạn size, scan/metadata verification riêng và có thể cần derivative streaming. Platform admin upload qua contract module `music`; không tái sử dụng route media owner-scoped. Xem [backend nhạc nền cưới](../modules/background-music.md).

## CORS for R2 images in the editor

The browser image editor loads `MediaAsset.publicUrl` with `crossOrigin="Anonymous"` so it can edit and export a canvas. Configure CORS on the Cloudflare R2 bucket to allow the exact production frontend origin and `GET`. An image may render in a regular `<img>` while the editor fails if the response lacks a matching `Access-Control-Allow-Origin` header.

Use the actual frontend origin (scheme and hostname, no path); list each production origin separately:

```json
[
  {
    "AllowedOrigins": ["https://<frontend-domain>"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

This is bucket CORS, separate from the backend API `APP_ORIGINS` setting. If the editor still cannot load an image after updating the policy, check that the public URL returns a successful status and an `image/*` content type.

When only older objects fail, compare one failing and one working object's browser Network response side by side: final URL/redirect, status, `Access-Control-Allow-Origin`, `Content-Type`, and response size. R2 CORS is bucket-level, while object metadata such as `Content-Type` is per object. Wedding media JPEG/PNG uses lossy WebP quality 90 with a 2400px maximum dimension; valid in-limit WebP input is preserved without another lossy encode. Previously stored assets are not automatically rewritten; re-upload the original source to replace an older image when needed.

R2 public object responses may omit explicit `Cache-Control`/`Expires`, and browsers can reuse a heuristic cache entry. The frontend image editor uses a distinct `_editor=1` query key to force a separate request/cache entry from regular image display. Verify the live cPanel SPA shell also has `Cache-Control: no-cache` so stale frontend code is revalidated after deployment.
