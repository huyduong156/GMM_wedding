# 0007 - Một bảng User, quyền ở UserRole

Status: Accepted
Date: 2026-08-04

## Context

Sản phẩm có hai authenticated surface: owner workspace `/studio/*` và platform administration `/gmm_admin/*`. Một người có thể bắt đầu là owner rồi được cấp trách nhiệm support/moderation; platform admin vẫn có thể sở hữu wedding cá nhân. Wedding role lại là quyền theo từng tenant và có lifecycle riêng.

Schema foundation hiện dùng một bảng `User` cho credential/session nhưng đặt một enum `platformRole` trực tiếp trên user. Cần chọn giữa tách `Admin`/`User`, giữ scalar role, hoặc dùng một identity chung với bảng role trước khi auth persistence được triển khai. Sản phẩm cũng có khái niệm rank/gói; đây không phải authorization và không được trộn với admin role.

## Decision

- `User` là canonical human identity cho mọi tài khoản đăng nhập. Password, external account, verification token và session luôn thuộc identity này; không tạo bảng credential/session thứ hai cho admin.
- Platform authorization dùng bảng `UserRole` riêng thay cho scalar `User.platformRole`. Một user có thể có nhiều role; mỗi row có role, người/lý do cấp quyền, thời điểm cấp, expiry và revocation để audit.
- Initial role vocabulary giữ nhỏ và code-owned: `ADMIN`, `SUPPORT`, `MODERATOR` khi feature tương ứng tồn tại. Khi sản phẩm thật sự cần custom permission, có thể thêm `Role`/`Permission` registry mà không đổi identity/session.
- Wedding authorization tiếp tục dùng `WeddingMember(weddingId, userId, role, status)`. Platform role không tự động cấp quyền đọc wedding, guest PII hoặc gift ledger.
- `PlatformAdminActor` dùng cùng `userId` và `sessionId`, cộng assurance (`base|stepUp`) sau khi application xác nhận active `UserRole`. Không dùng một `adminId` thuộc namespace identity khác.
- Admin UI/login có route và policy riêng nhưng có thể tái sử dụng credential verifier/session core. Admin session bắt buộc MFA/step-up theo production policy; URL riêng không phải authorization boundary.
- Platform role chỉ được cấp qua audited provisioning/admin use case hoặc bootstrap command được kiểm soát. Public registration không nhận role và luôn tạo identity không có platform assignment.
- Chỉ tạo `PlatformAdminProfile` 1:1 sau này nếu có metadata nghiệp vụ riêng như staff code hoặc support settings; bảng đó không sở hữu credential.
- Rank và billing tách khỏi authorization:
  - nếu mỗi user có một rank hiện tại, dùng `User.rankId -> Rank`; chỉ thêm `RankLog` khi cần lịch sử;
  - nếu “rank” thực chất là gói sản phẩm, dùng `Plan` + `Subscription`;
  - không suy ra admin permission từ rank, plan hoặc subscription.

## Alternatives considered

### Tách `Admin` và `User`

Ưu điểm là physical boundary dễ nhìn và có thể đặt policy khác ngay từ đầu. Loại vì tạo hai nguồn identity, trùng email/session/reset/MFA logic, khó chuyển một owner thành admin, phức tạp audit và foreign key actor. Physical isolation nếu cần sau này nên nằm ở service/database boundary, không phải duplicate credential model trong cùng monolith.

### Một `User.platformRole` enum

Đơn giản cho MVP nhưng mỗi user chỉ có một role, thiếu grant/revoke history, expiry và reason; update nhầm một cột có thể nâng quyền trực tiếp. Không phù hợp support/moderator/operations hoặc temporary access.

### Permission JSON trong user/session

Loại vì khó constraint/query/audit và permission trong session dễ stale. Permission phải được derive server-side từ assignment hiện hành.

## Consequences

- Auth migration phải thêm `UserRole`, backfill admin hiện có nếu có, chuyển read path rồi mới bỏ `User.platformRole` theo expand-contract.
- Actor context và policy dùng `userId`; audit log có thể truy ngược cùng một identity xuyên owner/admin surface.
- Mỗi platform request phải kiểm tra active assignment và assurance; không tin role trong cookie hoặc frontend payload.
- Index/constraint cần bảo vệ active assignment uniqueness và expiry/revocation. Grant/revoke là security event: rotate/revoke session khi policy yêu cầu và ghi audit.
- Hai UI vẫn có login/route riêng để áp policy và UX khác nhau, nhưng không kéo theo hai bảng tài khoản.
