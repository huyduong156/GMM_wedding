# 0005 - Todo, sổ tiền mừng và Wedding Recap

Status: Accepted
Date: 2026-07-30

> ADR 0008 bổ sung nguyên tắc progressive disclosure và triển khai theo phase: Todo và sổ tiền mừng vẫn là tính năng trọng tâm nhưng không chặn onboarding/publish; Wedding Recap là publication surface trọng tâm.

## Context

Owner cần quản lý việc chuẩn bị trước lễ cưới, ghi nhận tiền/quà mừng riêng tư sau sự kiện và xuất bản một trang recap để chia sẻ. Ba nhu cầu cùng thuộc wedding nhưng có lifecycle, quyền và mức độ công khai khác nhau.

## Decision

### Wedding Todo List

- `WeddingTask` thuộc wedding, có title, description, due date, priority, status, assignee member, category, sort order và completed metadata.
- Checklist mẫu được version hóa bằng `TaskChecklistTemplate`/`TaskChecklistItem`; khi áp dụng sẽ sao chép thành task của wedding để user sửa độc lập.
- Owner/editor được quản lý task; member chỉ được gán khi còn active trong đúng wedding. Mutation dùng revision/ETag để chống lost update.

### Sổ tiền mừng

- `GiftLedgerEntry` thuộc wedding và có thể liên kết guest; lưu loại `money|gold|physicalGift`, số tiền theo minor unit + ISO currency, trọng lượng/loại vàng hoặc mô tả quà, cùng phương thức/ngày nhận, ghi chú và trạng thái mừng lại.
- Quyền đọc/ghi/xuất chỉ dành cho wedding owner trong MVP. Editor, guest manager, viewer, platform admin và public mặc định không có quyền truy cập nội dung.
- Không đưa ledger vào analytics, notification, search, public snapshot hoặc log. Guest bị xóa mềm không làm mất entry; entry giữ display-name snapshot tối thiểu.
- Đây là sổ ghi chép, không phải payment ledger: hệ thống không giữ tiền, đối soát ngân hàng hoặc suy diễn giao dịch từ QR/chuyển khoản.

### Wedding Recap

- `WeddingRecap` có draft/lifecycle/slug riêng. Nội dung tham chiếu media đã `ready`, lời cảm ơn và các `Wish` approved mà owner chủ động chọn.
- Publish tạo immutable `PublishedRecapSnapshot` không chứa PII; public renderer đọc snapshot theo recap slug với cache/ETag. Unpublish thu hồi public access nhưng giữ lịch sử.
- Recap có OG metadata và share URL riêng. Template recap dùng registry/version hiện có với `productType=recap`, không làm đổi template website cưới.

## Consequences

- Backend thêm boundary `tasks`, `gift-ledger`, `recaps`; dùng chung authorization/media/wishes.
- Endpoint ledger có owner-only policy và cross-role/cross-tenant test; cân nhắc step-up authentication trước export khi production.
- Todo template update không đổi task đã tạo. Recap draft không ảnh hưởng trang public cho tới lần publish kế tiếp.
- Xóa wedding thu hồi recap và xử lý task/ledger theo retention; export/delete tài khoản bao gồm ledger theo luồng bảo mật.
