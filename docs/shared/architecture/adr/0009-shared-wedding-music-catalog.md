# 0009 - Catalog nhạc nền cưới dùng chung và thư viện cá nhân

Status: Accepted
Date: 2026-08-23

## Context

Thiệp online và website cưới cần nhạc nền nhưng không thể lưu data URL trong canonical content. Sản phẩm có hai nguồn: catalog nhạc hệ thống do platform admin kiểm duyệt và thư viện nhạc riêng do user upload cho các thiệp của mình.

## Decision

- `MusicTrack` có `scope=SYSTEM|PERSONAL`. System track do platform admin quản lý, user chỉ được đọc/chọn; personal track có `ownerUserId` và chỉ owner được đọc/chọn/retire.
- PostgreSQL lưu metadata, lifecycle, license, revision và reference. Bytes audio lưu trong S3-compatible `ObjectStorage`; local development dùng MinIO.
- Canonical config lưu `musicTrackId`, `enabled`, `autoplayRequested`; playback URL không được lưu như canonical data. Publish resolve và pin public playback reference trong snapshot bất biến.
- Retire ngăn lựa chọn mới nhưng không xóa object ngay; physical deletion chỉ sau reference check và retention.
- Autoplay là best-effort sau tương tác mở thiệp; renderer luôn có manual play/pause.

## Consequences

- FE có một catalog hợp nhất từ `GET /music-tracks`; UI cần hiển thị scope và chỉ hiện delete cho personal track của user.
- Admin API bắt buộc license metadata cho system music; personal music không được dùng để thay thế license gate của catalog hệ thống.
- S3 adapter dùng cùng ObjectStorage abstraction với media, nên đổi MinIO sang S3 thật chỉ cần đổi env/config.
- MVP chưa transcode/scan/duration extraction bất đồng bộ; các status PROCESSING/FAILED đã dành chỗ cho pipeline sau.
