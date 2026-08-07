# Media storage và image manager

Backend dùng `ObjectStorage` làm boundary. Local/test mặc định dùng `FakeObjectStorage`, lưu object vào `backend/s3_upload_fake/`; thư mục này bị gitignore và không được commit ảnh người dùng.

`MediaManager` chỉ làm việc với storage port và `MediaAsset` metadata: tạo upload intent, kiểm tra MIME/size, complete asset sang `READY`, list và soft-delete. Khi chọn S3-compatible provider, cấu hình `MEDIA_STORAGE_DRIVER=s3` và thay implementation trong `S3ObjectStorage`; API và database contract không đổi.

Fake flow dùng:

1. `POST /weddings/{weddingId}/media/upload-intents` tạo `MediaAsset(PENDING_UPLOAD)`.
2. `PUT /weddings/{weddingId}/media/{mediaId}/upload` ghi bytes vào fake storage.
3. `POST /weddings/{weddingId}/media/{mediaId}/complete` kiểm tra object tồn tại và chuyển sang `READY`.

Không publish asset nếu chưa `READY`. S3 adapter hiện là boundary chưa gắn SDK/provider cụ thể; không được dùng `MEDIA_STORAGE_DRIVER=s3` cho tới khi adapter được cấu hình.
