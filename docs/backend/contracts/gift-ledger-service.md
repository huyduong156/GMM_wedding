# Gift ledger service contract

## Phạm vi

Gift ledger là sổ ghi chép owner-only của một Wedding, không phải payment ledger. Hệ thống không giữ tiền, không đối soát ngân hàng và không quy đổi vàng/quà hiện vật thành tiền.

## Flow nhập liệu

Khi đang làm lễ, user có thể tạo entry nhanh chỉ với tên nhập tay, loại khoản mừng, dữ liệu tương ứng, hình thức nhận và ngày nhận. `guestId` là tùy chọn để không bắt user tìm Guest trong lúc thao tác liên tục.

Sau đó user có thể promote entry thành Guest mới, liên kết với Guest hiện có hoặc gỡ liên kết mà không xóa dữ liệu entry.

`guestDisplayNameSnapshot` luôn được giữ trong entry. Khi liên kết Guest, snapshot được cập nhật theo tên Guest tại thời điểm liên kết; khi gỡ/xóa Guest, entry không bị xóa.

## API

- `GET|POST /weddings/{weddingId}/gift-ledger`: list/filter hoặc tạo entry.
- `GET|PATCH|DELETE /weddings/{weddingId}/gift-ledger/{entryId}`: đọc/sửa/xóa mềm với `revision`. PATCH có thể nhận đồng thời `guestName` (snapshot tên) và `guestId` nullable; `null` biểu thị khách ẩn danh.
- `GET /weddings/{weddingId}/gift-ledger/summary`: tổng hợp tiền theo currency, vàng theo unit/type, quà hiện vật và trạng thái mừng lại.
- `GET /weddings/{weddingId}/gift-ledger/export`: CSV riêng tư.
- `POST .../{entryId}/promote-to-guest`, `link-guest`, `unlink-guest` cho lifecycle liên kết Guest.

Tiền dùng `amountMinor` + ISO currency và trả `amountMinor` dạng string để an toàn với BigInt. Vàng lưu decimal `goldWeight`, `goldUnit`, `goldType`; không cộng chung với tiền. Entry vật lý yêu cầu `giftDescription`.

## Ownership và vòng đời dữ liệu

- Chỉ Wedding owner được đọc, ghi, xóa mềm và export; platform admin không có endpoint đọc ledger thường ngày.
- Guest chỉ là liên kết tùy chọn. Soft-delete Guest không chạm ledger; nếu có hard-delete thì foreign key `guestId` dùng `ON DELETE SET NULL`, còn snapshot và thông tin khoản mừng vẫn giữ.
- Xóa entry là soft-delete. Không đưa ledger vào analytics, search, notification, public snapshot hoặc audit payload.
- Mutation update dùng `revision`; conflict trả `409`.
