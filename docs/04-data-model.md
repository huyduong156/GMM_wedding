# Mô hình dữ liệu

## Nguyên tắc

- PostgreSQL; UUID/ULID không tuần tự cho ID public.
- Lưu UTC, có `createdAt`, `updatedAt`; entity quan trọng xóa mềm bằng `deletedAt`.
- JSONB chỉ cho content/theme/manifest linh hoạt; identity, quyền, guest và RSVP được chuẩn hóa.
- Unique/check/foreign key và transaction đặt ở database, không chỉ UI.

## Entity chính

- `User`, `Account`, `Session`, `VerificationToken`.
- `Wedding`, `WeddingMember(role)`, `WeddingEvent`, `WeddingContent`, `WeddingTheme`.
- `Template`, immutable `TemplateVersion`, `PublishedWeddingSnapshot`.
- `MediaAsset`, `MediaVariant`.
- `GuestGroup`, `Guest`, `Invitation`, `RsvpResponse`, `RsvpEventSelection`, `RsvpCompanion`.
- `Wish`, `Notification`, `NotificationPreference`, `AuditLog`.
- Post-MVP: `Plan`, `Subscription`, `Entitlement`, `Payment`, `WebhookEvent`, `Coupon`.

```text
User --< WeddingMember >-- Wedding --< WeddingEvent
                               |-- Content/Theme
                               |--< PublishedSnapshot >-- TemplateVersion
                               |--< MediaAsset
                               |--< GuestGroup --< Guest --< Invitation -- RsvpResponse
                               `--< Wish
```

## Index/ràng buộc quan trọng

- Unique lowercase `User.email` và lowercase active `Wedding.slug`.
- Unique `(weddingId, userId)` cho member.
- `Invitation.tokenHash` unique; tuyệt đối không lưu token raw.
- Index guest theo `(weddingId, groupId)`; RSVP theo `(weddingId, attendance, submittedAt)`; wish theo moderation status.
- Unique `(weddingId, version)` cho published snapshot.
- Slug 3-64 ký tự, lowercase chữ/số/gạch nối, chặn reserved words.
- `partySize >= 0` và không vượt `maxPartySize` trừ owner override.
- Publish chỉ khi slug/template/schema/media đều hợp lệ.
- Revoke/rotate invitation làm token cũ vô hiệu ngay.
- Xóa wedding thu hồi public access ngay; hard delete theo retention job.
