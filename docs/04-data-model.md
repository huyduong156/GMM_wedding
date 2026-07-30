# Mô hình dữ liệu

## Nguyên tắc

- PostgreSQL; UUID/ULID không tuần tự cho ID public.
- Lưu UTC, có `createdAt`, `updatedAt`; entity quan trọng xóa mềm bằng `deletedAt`.
- JSONB chỉ cho content/theme/template config linh hoạt; identity, quyền, guest và RSVP được chuẩn hóa.
- Unique/check/foreign key và transaction đặt ở database, không chỉ UI.

## Entity chính

- `User`, `Account`, `Session`, `VerificationToken`.
- `Wedding`, `WeddingMember(role)`, `WeddingEvent`, `WeddingContent`, `WeddingTheme`, `WeddingWebsite`, `InvitationDesign`.
- `Template`, immutable `TemplateVersion`, `PublishedWeddingSnapshot`.
- `MediaAsset`, `MediaVariant`.
- `GuestCategory`, `GuestGroup`, `Guest`, `Invitation`, `RsvpResponse`, `RsvpEventSelection`, `RsvpCompanion`.
- `Wish`, `Notification`, `NotificationPreference`, `AuditLog`.
- `WeddingTask`, `TaskChecklistTemplate`, `TaskChecklistItem`.
- `GiftLedgerEntry`, `WeddingRecap`, `RecapWishSelection`, `RecapMediaItem`, `PublishedRecapSnapshot`.
- Post-MVP: `Plan`, `Subscription`, `Entitlement`, `Payment`, `WebhookEvent`, `Coupon`.

```text
User --< WeddingMember >-- Wedding --< WeddingEvent
                               |-- Content/Theme
                               |--< PublishedSnapshot >-- TemplateVersion
                               |--< MediaAsset
                               |--< GuestCategory --< Guest
                               |--< GuestCategory --< Guest
                               |--< GuestCategory --< Guest
                               |--< GuestGroup --< Guest --< Invitation -- RsvpResponse
                               |--< WeddingTask
                               |--< GiftLedgerEntry >-- Guest?
                               |-- WeddingRecap --< PublishedRecapSnapshot
                               `--< Wish --< RecapWishSelection
```

## Index/ràng buộc quan trọng

- Unique lowercase `User.email` và lowercase active `Wedding.slug`.
- Unique `(weddingId, userId)` cho member.
- `Invitation.tokenHash` unique; tuyệt đối không lưu token raw.
- Index guest theo `(weddingId, groupId)`; RSVP theo `(weddingId, attendance, submittedAt)`; wish theo moderation status.
- `GuestCategory` self-reference qua `parentId`, thuộc đúng một wedding và có `depth` từ 1 đến 3. Parent phải cùng wedding, depth của child bằng parent + 1; không cho tạo chu kỳ hoặc cấp 4. Guest có thể gắn một category chính trong MVP.
- Unique `(weddingId, version)` cho published snapshot.
- Slug 3-64 ký tự, lowercase chữ/số/gạch nối, chặn reserved words.
- `partySize >= 0` và không vượt `maxPartySize` trừ owner override.
- Publish chỉ khi slug/template/schema/media đều hợp lệ.
- Unique `(templateId, version)` cho `TemplateVersion`; version đã phát hành không được ghi đè. Lưu `configHash`, `templateConfigVersion`, `contentSchemaVersion`, `rendererApiVersion` và code revision để sync/audit.
- `WeddingContent` lưu canonical content; `WeddingTheme`/design entity lưu section order, enabled state và presentation config. Thiệp online và website cưới không dùng chung một template selection duy nhất.
- Revoke/rotate invitation làm token cũ vô hiệu ngay.
- Xóa wedding thu hồi public access ngay; hard delete theo retention job.

### Task

- `WeddingTask`: `weddingId`, `title`, `description?`, `dueAt?`, `priority(low|medium|high|urgent)`, `status(todo|inProgress|done|cancelled)`, `assigneeMemberId?`, `category?`, `sortOrder`, `completedAt?`, `completedBy?`, `revision`.
- Assignee phải là active `WeddingMember` cùng wedding. Index `(weddingId, status, dueAt)` và `(weddingId, assigneeMemberId, status)`.
- `TaskChecklistTemplate` có version/status và item có relative due-day offset. Áp dụng template sẽ tạo task trong một transaction; source template/version chỉ dùng audit.

### Gift ledger

- `GiftLedgerEntry`: `weddingId`, `guestId?`, `guestDisplayNameSnapshot`, `giftType(money|gold|physicalGift)`, `amountMinor?`, `currency?`, `goldWeight?`, `goldUnit?`, `goldType?`, `giftDescription?`, `receiveMethod(cash|bankTransfer|physicalGift|other)`, `receivedAt`, `note?`, `reciprocityStatus(pending|returned|notApplicable)`, `returnedAt?`, timestamps và soft-delete.
- Money cần `amountMinor >= 0` và ISO currency; gold cần trọng lượng dương + unit/type; physical gift cần description. Không dùng floating point cho tiền, còn trọng lượng vàng dùng decimal có precision cố định.
- Index `(weddingId, guestId)` và `(weddingId, reciprocityStatus, receivedAt)`. Guest soft-delete/anonymize không cascade xóa ledger.

### Recap

- `WeddingRecap`: unique `weddingId`, unique active lowercase `slug`, `status(draft|published|archived)`, `templateVersionId`, `title`, `thankYouMessage`, OG fields và `revision`.
- `RecapMediaItem` chỉ tham chiếu `MediaAsset ready`; `RecapWishSelection` unique `(recapId, wishId)` và chỉ chọn wish approved.
- `PublishedRecapSnapshot` unique `(recapId, version)`, lưu payload/hash/template version bất biến, không chứa guest/contact metadata.
