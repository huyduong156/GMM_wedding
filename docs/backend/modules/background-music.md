# Backend nhạc nền cưới

Status: Planned.

Module `music` sở hữu catalog nhạc nền dùng chung do platform admin quản lý. PostgreSQL lưu metadata, lifecycle, quyền sử dụng và reference; bytes audio lưu qua `ObjectStorage`. Không lưu file audio dạng binary/base64 trong database, content JSON hoặc published snapshot.

## Actor và lifecycle

- Platform admin: tạo upload intent, complete, sửa metadata, activate và retire track. Mọi mutation ghi audit.
- Owner/editor có quyền content: đọc catalog `ACTIVE`, chọn hoặc bỏ track cho đúng wedding/surface thông qua content API.
- Public: không list catalog; chỉ nhận track đã được đóng gói trong snapshot hợp lệ.
- Lifecycle: `DRAFT -> PROCESSING -> ACTIVE -> RETIRED`; lỗi xử lý chuyển `FAILED` và có thể retry về `PROCESSING`. Không activate khi asset chưa `READY`.
- Retire chặn lựa chọn/publish mới nhưng không phá snapshot live cũ. Xóa vật lý chỉ khi retention job chứng minh không còn draft/snapshot tham chiếu.

## Data model

### `MusicTrack`

| Trường | Ý nghĩa |
|---|---|
| `id` | UUID ổn định dùng làm reference |
| `mediaAssetId` | Asset audio gốc/đã xử lý trong media module |
| `displayName`, `artistName?` | Metadata hiển thị |
| `durationSeconds`, `mimeType`, `sizeBytes` | Metadata đã xác minh, không tin client |
| `status` | `DRAFT\|PROCESSING\|FAILED\|ACTIVE\|RETIRED` |
| `licenseType`, `licenseReference`, `creditText?` | Nguồn và bằng chứng quyền sử dụng; không activate nếu thiếu |
| `sortOrder`, `revision` | Thứ tự catalog và optimistic concurrency |
| `createdById`, `createdAt`, `updatedAt`, `retiredAt?` | Audit/lifecycle |

`WeddingContent`/design config lưu `musicTrackId | null`, `enabled` và `autoplayRequested` theo surface. URL phát không phải canonical content. Publish resolve track/asset, kiểm tra `ACTIVE + READY`, rồi ghi DTO public tối thiểu vào snapshot.

## API dự kiến

Base API là `/api`.

| Method | Path | Auth | Mục đích |
|---|---|---|---|
| `GET` | `/music-tracks` | Session + content permission | List catalog `ACTIVE`, cursor/search |
| `GET` | `/music-tracks/{trackId}` | Session + content permission | Metadata/preview của track khả dụng |
| `GET` | `/admin/music-tracks` | Platform admin | List mọi trạng thái và usage summary |
| `POST` | `/admin/music-tracks/upload-intents` | Platform admin | Tạo audio asset/upload intent |
| `POST` | `/admin/music-tracks/{trackId}/complete` | Platform admin | Xác minh upload, metadata và chuyển xử lý/ready |
| `PATCH` | `/admin/music-tracks/{trackId}` | Platform admin | Sửa metadata theo `revision` |
| `POST` | `/admin/music-tracks/{trackId}/activate` | Platform admin | Activate sau validation quyền sử dụng/asset |
| `POST` | `/admin/music-tracks/{trackId}/retire` | Platform admin | Ngừng phân phối, không phá snapshot live |

Việc chọn track tiếp tục đi qua `PUT /weddings/{weddingId}/content` cùng revision của surface để content/theme/section/music được lưu atomically. Không tạo endpoint “set music” tách rời gây lost update với editor autosave.

## Validation và security

- Allowlist ban đầu: `audio/mpeg`, `audio/mp4`, `audio/ogg`; giới hạn upload server-side được cấu hình, MVP đề xuất 15MB và phải khớp UI/OpenAPI.
- Không tin extension, duration, MIME hay checksum client gửi; complete phải đọc metadata object và scan theo media pipeline.
- Storage key không xuất hiện trong DTO public. Playback dùng CDN/object URL đã ký hoặc public derivative key không đoán từ tên file.
- Admin mutation dùng platform-admin guard, CSRF/origin policy, rate limit upload và audit action `music.track_*`.
- Không nhận nhạc có bản quyền khi thiếu license reference. Log không chứa signed URL hoặc nội dung file.

## Transaction, concurrency và publish

- `PATCH/activate/retire` dùng `revision`; stale write trả `409 REVISION_CONFLICT`.
- Complete là idempotent theo track/upload; retry cùng object/checksum không sinh track mới.
- Publish transaction resolve `musicTrackId`, yêu cầu track `ACTIVE`, asset `READY` và section enabled. Track invalid trả validation error theo field, không âm thầm bỏ nhạc.
- Snapshot bất biến pin track/versioned media reference để retire hoặc cập nhật metadata catalog không đổi trang đang live.
- Usage summary là read model; không khóa publish và không dùng để quyết định xóa nếu chưa kiểm tra reference thật.

## Test và vận hành

- Unit: lifecycle, license gate, MIME/size, permission, revision và publish invariant.
- Integration: admin upload-complete-activate-retire, owner catalog/content save, cross-role denial và idempotent retry.
- Publication: snapshot không có storage key/PII, track retired bị chặn publish mới, snapshot live cũ vẫn phát.
- Observability: count upload/processing failure, latency complete, active catalog size và playback delivery errors; alert khi processing backlog vượt ngưỡng.
- Cleanup/rollback: retire trước, giữ object theo retention/reference; rollback migration phải giữ asset/reference có thể khôi phục.
