# 0013 - Direct guest-slug personalized invitation flow
Status: Accepted
Date: 2026-09-02

## Context

MVP đang dùng `Invitation` như bảng trung gian cho public slug, token, RSVP và wish. Điều này làm flow khách cá nhân phụ thuộc vào một entity không đại diện cho danh sách khách, khiến URL riêng, danh tính khách và dữ liệu tương tác bị tách khỏi `Guest`. Sản phẩm vẫn đang trong giai đoạn development nên có thể reset dữ liệu cũ và không cần backward compatibility.

## Decision

- Bỏ hoàn toàn entity `Invitation`, các migration/data cũ và owner CRUD/token routes liên quan.
- `Guest.slug` là định danh public cá nhân, server-generated, ổn định, sinh từ Guest.name sau khi tạo và unique theo `(weddingId, slug)`.
- Personalized resolve dùng trực tiếp `Wedding.slug + Guest.slug`, chỉ hoạt động khi Wedding đã publish và Guest chưa soft-delete.
- `Guest.displayName ?? Guest.name` là tên hiển thị trong thiệp.
- RSVP cá nhân liên kết trực tiếp `RsvpResponse.guestId`; wish cá nhân liên kết trực tiếp `Wish.guestId`.
- URL chung không có guest slug, giữ `guestId = null` và yêu cầu người dùng nhập tên.
- Mọi owner read model, dashboard metric, filter, promote/link flow và public DTO không được join qua Invitation.

## Alternatives considered

- Giữ Invitation làm trung gian cho guest slug: loại vì dư entity, tăng join và không cần cho use case hiện tại.
- Giữ Invitation chỉ cho token backward compatibility: loại vì sản phẩm chưa lên production và user đã xác nhận có thể reset data.
- Gắn slug ở FE: loại vì slug cần unique, phải được normalize và kiểm soát server-side; slug được tạo từ tên khách với hậu tố số khi trùng.

## Consequences

- Có thể reset dữ liệu development và chạy migration mới, không cần expand-contract/backward compatibility cho data cũ.
- `RsvpResponse.invitationId` được loại bỏ; target model chỉ dùng `guestId?`.
- Public route path `/public/invitations/...` có thể giữ tên để tránh đổi contract FE ngay, nhưng implementation không còn đọc Invitation.
- Tên module/route/docs cần dùng “guest link” thay cho “invitation token”.
- Cần cập nhật OpenAPI, seed, tests và frontend data contract sau khi BE hoàn tất.