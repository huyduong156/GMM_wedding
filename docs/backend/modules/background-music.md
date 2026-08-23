# Backend nhạc nền cưới

Status: Implemented (MVP backend).

Module `music` hỗ trợ hai nguồn nhạc: `SYSTEM` do platform admin upload và quản lý dùng chung; `PERSONAL` do từng user upload, chỉ user đó được xem/chọn/xóa. Metadata (bảng `MusicTrack`) nằm trong PostgreSQL, bytes audio nằm trong S3-compatible ObjectStorage (local dùng MinIO), không lưu binary/base64 trong database hay content JSON.

## Actor và lifecycle

- Platform admin: upload, complete, activate và retire nhạc hệ thống. Nhạc hệ thống không bị user xóa.
- User đã đăng nhập: xem nhạc hệ thống `READY`, xem/upload/xóa nhạc cá nhân của chính mình. Xóa là soft-retire để không phá reference/snapshot tương lai.
- Public: không list catalog; playback URL chỉ xuất hiện với track `READY` được chọn bởi content/publication flow.
- MVP complete kiểm tra object tồn tại, kích thước và MIME rồi chuyển `DRAFT -> READY`; `PROCESSING/FAILED` giữ cho pipeline scan/transcode tương lai. Retire chặn lựa chọn mới.

## Data model

`MusicTrack` gồm `id`, `scope` (`SYSTEM|PERSONAL`), `ownerUserId?`, `createdById`, `status` (`DRAFT|PROCESSING|FAILED|READY|RETIRED`), display/artist metadata, verified MIME/size, license metadata, `storageKey`, `revision` và timestamps. `storageKey` không trả ra DTO; `playbackUrl` chỉ trả với track `READY`.

Canonical wedding content nên lưu `musicTrackId`, `enabled`, `autoplayRequested`; URL phát không phải canonical content. Khi tích hợp content publish, backend phải kiểm tra track thuộc system READY hoặc personal của user READY trước khi pin snapshot.

## API đã triển khai

Base API là `/api`.

| Method | Path | Auth | Mục đích |
|---|---|---|---|
| `GET` | `/music-tracks?q=` | Session | List system READY + personal READY của user |
| `GET` | `/music-tracks/{trackId}` | Session | Lấy metadata/playback URL của track user được dùng |
| `POST` | `/music-tracks/upload-intents` | Session | Tạo upload intent cho nhạc cá nhân |
| `POST` | `/music-tracks/{trackId}/complete` | Session/owner | Verify object và chuyển personal track sang READY |
| `DELETE` | `/music-tracks/{trackId}` | Session/owner | Retire nhạc cá nhân |
| `GET` | `/admin/music-tracks?q=` | Platform admin | List mọi system/personal track để vận hành |
| `POST` | `/admin/music-tracks/upload-intents` | Platform admin | Tạo upload intent nhạc SYSTEM; bắt buộc license |
| `POST` | `/admin/music-tracks/{trackId}/complete` | Platform admin | Verify system object và chuyển READY |
| PATCH | /admin/music-tracks/{trackId} | Platform admin | Sửa metadata với evision hiện tại |
| `POST` | `/admin/music-tracks/{trackId}/activate` | Platform admin | Re-check object/license và activate idempotent |
| `POST` | `/admin/music-tracks/{trackId}/retire` | Platform admin | Retire nhạc hệ thống, không xóa object ngay |

Upload flow: gọi upload-intent, PUT bytes vào `uploadUrl` với headers trả về, gọi complete. FE không tự dựng storage key và không gửi playback URL vào content.

## Validation và security

- Allowlist: `audio/mpeg`, `audio/mp4`, `audio/ogg`; tối đa 15 MB.
- Complete đọc metadata object; không tin extension/MIME/size client gửi. MIME `application/octet-stream` chỉ được chấp nhận khi storage provider không trả content type, còn size vẫn phải khớp.
- User không thể đọc hoặc retire PERSONAL track của user khác. System track không có owner user.
- Storage driver chọn bằng `MEDIA_STORAGE_DRIVER=fake|s3`. S3 dùng `S3_ENDPOINT`, `S3_BUCKET`, credentials, `S3_FORCE_PATH_STYLE`; local Compose cung cấp MinIO tại port 9000.
- MinIO local: S3 API http://localhost:9000, Console http://localhost:9001, username minioadmin, password minioadmin, bucket gmm-wedding. Đây là credentials development trong ackend/compose.yaml, không dùng cho staging/production.
- Không trả storage key, secret hoặc signed URL log ra response/log.

## Test và vận hành

- Unit test kiểm tra personal ownership, license gate và MIME/size gate.
- Integration test chạy với `S3_INTEGRATION=true` kiểm tra presigned PUT, head và delete trên MinIO.
- Chưa có audio transcoding/virus scan/duration extraction bất đồng bộ; khi thêm worker cần giữ lifecycle PROCESSING/FAILED và chỉ expose READY sau validation.
