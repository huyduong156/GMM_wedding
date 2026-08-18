# Wish service contract

## Phạm vi

Wish là lời chúc do khách gửi từ invitation chung hoặc invitation cá nhân. Dữ liệu
được lưu owner-private cho tới khi owner duyệt; chỉ wish `APPROVED` mới được đưa vào
public snapshot hoặc recap.

## Public flow

- `POST /public/weddings/{slug}/wishes`: URL chung, bắt buộc `guestName` và `content`.
- `POST /public/invitations/{weddingSlug}/{guestSlug}/wishes`: URL cá nhân, lấy danh tính từ invitation và không yêu cầu nhập tên.
- `GET /public/weddings/{slug}/wishes`: chỉ trả wish đã `APPROVED`, không trả contact hoặc guest metadata.

URL cá nhân gắn `Wish.guestId` theo invitation. URL chung tạo invitation anonymous
với `guestId = null`, lưu tên hiển thị trong `Wish.authorName` và `Invitation.label`.

## Owner API

| Method | Path | Mục đích |
|---|---|---|
| GET | `/weddings/{weddingId}/wishes` | List/filter theo status, nội dung, thời gian và cursor |
| PATCH | `/weddings/{weddingId}/wishes/{wishId}` | Đổi moderation status hoặc pin |
| POST | `/weddings/{weddingId}/wishes/{wishId}/promote-to-guest` | Tạo Guest từ anonymous wish và liên kết |
| POST | `/weddings/{weddingId}/wishes/{wishId}/link-guest` | Liên kết với Guest đã có |

Mọi owner route đều kiểm tra `Wedding.createdById` và `deletedAt = null`. Promote
tạo Guest, cập nhật Wish và invitation liên quan trong cùng transaction. Link cùng
Guest nhiều lần là idempotent; link sang Guest khác khi đã có liên kết trả `409`.

## Moderation

Status hợp lệ: `PENDING`, `APPROVED`, `REJECTED`, `SPAM`, `HIDDEN`. `isPinned` chỉ
có tác dụng trong danh sách approved/public và không tự động approve wish.

Không hard-delete wish trong MVP để giữ audit và tránh mất nội dung owner có thể cần
đối soát; dùng `REJECTED`, `SPAM` hoặc `HIDDEN` thay cho xóa.
