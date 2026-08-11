# 0009 - Catalog nhạc nền cưới dùng chung

Status: Accepted
Date: 2026-08-11

## Context

Thiệp online và website cưới cần nhạc nền nhưng không thể lưu data URL demo trong canonical content hay để mỗi renderer quản lý file riêng. Platform admin cần upload một kho nhạc đã kiểm tra để nhiều wedding dùng chung, đồng thời trang public phải tiếp tục hoạt động khi track ngừng phân phối.

## Decision

- Tạo module/catalog `music` do platform admin quản lý; owner chọn track `ACTIVE` theo publication surface.
- PostgreSQL lưu `MusicTrack` metadata, lifecycle, license, revision và reference. Bytes audio lưu trong S3-compatible `ObjectStorage`, không lưu binary/base64 trong database.
- Canonical config lưu `musicTrackId`, `enabled`, `autoplayRequested`; publish resolve và pin public playback reference trong snapshot bất biến.
- Retire ngăn lựa chọn/publish mới nhưng không sửa snapshot live cũ. Physical deletion chỉ sau reference check và retention.
- Autoplay là best-effort sau tương tác mở thiệp; renderer luôn cung cấp manual play/pause và trang không phụ thuộc audio để sử dụng.

## Consequences

- Cần admin catalog UI/API, media audio validation/processing, owner picker và publish validation trước khi bật lưu nhạc thật.
- Metadata/licensing có thể cập nhật có kiểm soát nhưng snapshot live không bị đổi ngoài quy trình publish.
- Một object có thể được nhiều wedding dùng chung, giảm duplicate storage; quyền sử dụng và audit trở thành production gate.

