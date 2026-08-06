# Database schema reference

File này là data dictionary của PostgreSQL/Prisma schema. `backend/prisma/schema.prisma` và migration đã review là implementation source of truth; tài liệu này giải thích mục đích, trường và invariant để phân tích nghiệp vụ. Khi thêm/xóa/đổi trường phải cập nhật file này trong cùng change.

## Quy ước chung

- ID dùng UUID; timestamp dùng `timestamptz(3)` và lưu UTC.
- `createdAt`, `updatedAt` là thời điểm tạo/cập nhật; `deletedAt` là soft-delete khi model có hỗ trợ.
- `revision` bắt đầu từ 1, tăng khi sửa aggregate để chống lost update.
- Email và slug được lưu lowercase. Slug dài 3–64 ký tự, chỉ gồm chữ thường, số và dấu gạch nối.
- JSON chỉ dùng cho content/config/payload có schema version; field cần lọc, join, quyền hoặc constraint phải là cột chuẩn hóa.
- Token phiên, invite và verification chỉ lưu hash; không lưu raw token.
- Không chỉnh schema trực tiếp bằng Adminer. Mọi thay đổi đi qua Prisma migration.

## Identity và authentication

### `User`

Tài khoản owner/cộng tác viên/platform admin.

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | UUID | Khóa chính |
| `email` | varchar(320), unique | Email lowercase dùng đăng nhập |
| `emailVerifiedAt` | timestamp? | Thời điểm xác minh email |
| `passwordHash` | varchar(255)? | Password hash; null với tài khoản không dùng password |
| `displayName` | varchar(120)? | Tên hiển thị |
| `avatarUrl` | varchar(2048)? | URL avatar |
| `locale` | varchar(16) | Locale, mặc định `vi-VN` |
| `timezone` | varchar(64) | IANA timezone |
| `status` | `UserStatus` | Pending, active, suspended hoặc deleted |
| `platformRole` | `PlatformRole` | Compatibility field hiện tại; ADR 0007 chuyển platform authorization sang `UserRole` bằng migration expand-contract |
| `lastLoginAt` | timestamp? | Lần đăng nhập cuối |
| `createdAt`, `updatedAt`, `deletedAt` | timestamp | Lifecycle và soft-delete |

### `Account`

Liên kết identity provider. Trường: `id`, `userId`, `provider`, `providerAccountId`, `type`, `accessToken?`, `refreshToken?`, `expiresAt?`, `tokenType?`, `scope?`, `idToken?`, `createdAt`, `updatedAt`. Cặp `(provider, providerAccountId)` unique. Provider token là secret, phải mã hóa/redact theo adapter trước production.

### `Session`

Phiên đăng nhập phía server. Trường: `id`, `userId`, `sessionHash` unique, `expiresAt`, `lastSeenAt`, `ipHash?`, `userAgent?`, `createdAt`, `revokedAt?`. Cookie chỉ chứa token ngẫu nhiên; database lưu hash để revoke/rotate.

### `VerificationToken`

Token một lần cho verify/reset/invite account. Trường: `id`, `identifier`, `purpose`, `tokenHash` unique, `expiresAt`, `usedAt?`, `createdAt`.

## Wedding aggregate

### `Wedding`

Tenant aggregate root. Trường: `id`, `createdById`, `name`, `slug?`, `status`, `visibility`, `accessPasswordHash?`, `timezone`, `locale`, `primaryDate?`, `revision`, `publishedAt?`, `archivedAt?`, `createdAt`, `updatedAt`, `deletedAt?`. Active slug unique không phân biệt hoa thường; soft-delete thu hồi public access.

Wedding base service hiện dùng `name` làm couple/workspace name và chỉ expose owner-only CRUD cho `createdById`. Tạo Wedding đồng thời tạo active owner membership trong transaction. Tên cô dâu/chú rể có cấu trúc và cover media sẽ được thêm cùng canonical content/onboarding contract thay vì vội lưu URL hoặc JSON không kiểm soát trong aggregate root.

### `WeddingMember`

Quan hệ user–wedding và quyền. Trường: `id`, `weddingId`, `userId`, `role` (`OWNER|EDITOR|GUEST_MANAGER|VIEWER`), `status`, `invitedAt?`, `joinedAt?`, `revokedAt?`, `createdAt`, `updatedAt`. Cặp `(weddingId, userId)` unique. Role không thay thế resource authorization.

### `WeddingEvent`

Lễ/tiệc thuộc wedding. Trường: `id`, `weddingId`, `name`, `eventType`, `startsAt`, `endsAt?`, `timezone`, `venueName?`, `addressLine?`, `mapUrl?`, `latitude?`, `longitude?`, `sortOrder`, `isPublic`, `revision`, timestamps và `deletedAt?`. `endsAt >= startsAt`; latitude/longitude nằm trong miền hợp lệ. `revision` tăng trên update/delete để chống lost update.

### `WeddingContent`

Canonical semantic content duy nhất của wedding. Trường: `id`, `weddingId` unique, `schemaVersion`, `content` JSON, `revision`, `createdAt`, `updatedAt`. Không lưu guest PII trong JSON này.

### `WeddingTheme`

Presentation và thứ tự section tách theo surface. Trường: `id`, `weddingId`, `surface`, `configVersion`, `themeConfig` JSON, `sectionConfig` JSON, `revision`, timestamps. `(weddingId, surface)` unique.

### `WeddingWebsite`

Lifecycle website cưới. Trường: `id`, `weddingId` unique, `templateVersionId?`, `slug?`, `isPublished`, `revision`, timestamps. Slug unique và template version được pin.

### `InvitationDesign`

Template selection riêng cho thiệp online. Trường: `id`, `weddingId` unique, `templateVersionId?`, `revision`, timestamps.

## Template và publication

### `Template`

Identity catalog ổn định. Trường: `id`, `key` unique, `name`, `productType`, `status`, `description?`, timestamps.

### `TemplateVersion`

Version renderer bất biến. Trường: `id`, `templateId`, `version`, `configHash`, `templateConfigVersion`, `contentSchemaVersion`, `rendererApiVersion`, `codeRevision`, `config` JSON, `releasedAt?`, `deprecatedAt?`, `createdAt`. `(templateId, version)` và `(templateId, configHash)` unique; version đã phát hành không update.

### `PublishedWeddingSnapshot`

Payload public bất biến của website/thiệp. Trường: `id`, `weddingId`, `templateVersionId`, `version`, `surface`, `slug`, `payload` JSON, `payloadHash`, `contentSchemaVersion`, `rendererApiVersion`, `publishedAt`, `unpublishedAt?`. `(weddingId, surface, version)` unique; chỉ một live slug/surface; payload không chứa PII khách.

## Media

### `MediaAsset`

Object upload gốc. Trường: `id`, `weddingId`, `uploadedById?`, `storageKey` unique, `originalName?`, `mimeType`, `sizeBytes`, `width?`, `height?`, `status`, `checksum?`, `altText?`, timestamps và `deletedAt?`. Chỉ status `READY` được publish.

### `MediaVariant`

Biến thể tối ưu. Trường: `id`, `mediaAssetId`, `variantKey`, `storageKey` unique, `mimeType`, `sizeBytes`, `width?`, `height?`, `createdAt`. `(mediaAssetId, variantKey)` unique.

## Guest, invitation, RSVP và wish

### `GuestCategory`

Danh mục cây tối đa ba cấp. Trường: `id`, `weddingId`, `parentId?`, `name`, `depth`, `sortOrder`, timestamps và `deletedAt?`. Root có `depth=1`; child có depth 2–3. Kiểm tra parent cùng wedding, depth liên tiếp và chống cycle nằm trong transaction/application service.

### `GuestGroup`

Nhóm khách phục vụ lọc/gửi lời mời. Trường: `id`, `weddingId`, `name`, `note?`, timestamps và `deletedAt?`.

### `Guest`

Hồ sơ khách riêng tư. Trường: `id`, `weddingId`, `categoryId?`, `groupId?`, `displayName`, `phone?`, `email?`, `note?`, `tableName?`, `maxPartySize`, `tags[]`, timestamps và `deletedAt?`. Contact/note/group không được đưa vào public snapshot.

### `Invitation`

Danh tính lời mời public. Trường: `id`, `weddingId`, `guestId?`, `label?`, `tokenHash` unique, `status`, `maxPartySize`, `expiresAt?`, `revokedAt?`, `lastViewedAt?`, timestamps. Token raw chỉ trả một lần khi tạo và không log.

### `RsvpResponse`

Một phản hồi hiện hành cho invitation. Trường: `id`, `weddingId`, `invitationId` unique, `attendance`, `partySize`, `mealPreference?`, `specialRequest?`, `message?`, `submittedAt`, `updatedAt`, `revision`. Service kiểm tra party size không vượt giới hạn invitation trừ owner override.

### `RsvpEventSelection`

Sự kiện khách chọn tham dự. Trường: `id`, `rsvpResponseId`, `weddingEventId`, `attending`. Cặp `(rsvpResponseId, weddingEventId)` unique; service phải chứng minh event và RSVP cùng wedding.

### `RsvpCompanion`

Người đi cùng. Trường: `id`, `rsvpResponseId`, `displayName`, `mealPreference?`, `sortOrder`.

### `Wish`

Lời chúc và moderation. Trường: `id`, `weddingId`, `invitationId?`, `guestId?`, `authorName`, `content`, `status`, `isPinned`, `submittedAt`, `moderatedAt?`, `deletedAt?`. Chỉ wish approved và được owner chọn mới vào recap/public payload.

## Planning và dữ liệu riêng tư

### `TaskChecklistTemplate` / `TaskChecklistItem`

Checklist mẫu bất biến theo `(key, version)`. Template gồm `id`, `key`, `version`, `name`, `status`, `locale`, `createdAt`. Item gồm `id`, `checklistTemplateId`, `title`, `description?`, `category?`, `priority`, `relativeDueDayOffset?`, `sortOrder`.

### `WeddingTask`

Task đã copy vào wedding. Trường: `id`, `weddingId`, `assigneeMemberId?`, `completedById?`, `sourceTemplateKey?`, `sourceTemplateVersion?`, `title`, `description?`, `dueAt?`, `priority`, `status`, `category?`, `sortOrder`, `completedAt?`, `revision`, timestamps và `deletedAt?`. Assignee phải là active member cùng wedding.

### `GiftLedgerEntry`

Sổ quà owner-only. Trường: `id`, `weddingId`, `guestId?`, `guestDisplayNameSnapshot`, `giftType`, `amountMinor?`, `currency?`, `goldWeight?`, `goldUnit?`, `goldType?`, `giftDescription?`, `receiveMethod`, `receivedAt`, `note?`, `reciprocityStatus`, `returnedAt?`, timestamps và `deletedAt?`. Money yêu cầu amount/currency; gold yêu cầu weight/unit/type; physical gift yêu cầu description. Không log, search, analytics hoặc public hóa bảng này.

## Wedding recap

### `WeddingRecap`

Một recap cho wedding. Trường: `id`, `weddingId` unique, `templateVersionId`, `slug?`, `status`, `title`, `thankYouMessage?`, `ogTitle?`, `ogDescription?`, `ogImageUrl?`, `revision`, `publishedAt?`, timestamps. Active slug unique.

### `RecapMediaItem`

Media được chọn: `id`, `recapId`, `mediaAssetId`, `caption?`, `sortOrder`. Cặp `(recapId, mediaAssetId)` unique; asset phải `READY` và cùng wedding.

### `RecapWishSelection`

Wish được chọn: `id`, `recapId`, `wishId`, `sortOrder`. Cặp `(recapId, wishId)` unique; wish phải approved và cùng wedding.

### `PublishedRecapSnapshot`

Snapshot recap bất biến: `id`, `recapId`, `templateVersionId`, `version`, `slug`, `payload` JSON, `payloadHash`, `publishedAt`, `unpublishedAt?`. `(recapId, version)` unique; live slug unique; payload bỏ guest/contact/moderation metadata.

## Notification, audit và reliability

### `NotificationPreference`

Trường: `id`, `userId`, `eventKey`, `channel`, `enabled`, timestamps. `(userId, eventKey, channel)` unique.

### `Notification`

Delivery intent: `id`, `userId`, `eventKey`, `channel`, `status`, `payload` JSON, `sentAt?`, `readAt?`, `failedAt?`, `createdAt`. Payload phải tối thiểu và không chứa token/ledger/private contact nếu không cần.

### `AuditLog`

Audit append-only: `id`, `actorUserId?`, `weddingId?`, `action`, `resourceType`, `resourceId?`, `requestId?`, `reason?`, `metadata?`, `occurredAt`. Không lưu secret, token raw hoặc nội dung gift ledger.

### `OutboxEvent`

Event sau commit: `id`, `aggregateType`, `aggregateId`, `eventType`, `eventVersion`, `payload`, `status`, `attempts`, `availableAt`, `lockedAt?`, `lockedBy?`, `processedAt?`, `lastError?`, `createdAt`.

### `IdempotencyRecord`

Chống mutation lặp: `id`, `scope`, `keyHash`, `requestHash`, `status`, `responseStatus?`, `responseBody?`, `resourceType?`, `resourceId?`, `expiresAt`, timestamps. `(scope, keyHash)` unique; chỉ lưu hash của idempotency key.

## Invariant cần application transaction

PostgreSQL bảo vệ type, FK, unique, range và các check cục bộ. Các invariant xuyên bảng sau bắt buộc được kiểm tra trong transaction/use case và có test:

- Resource/member/category/group/event/invitation/RSVP/recap item thuộc cùng wedding.
- Wedding luôn có ít nhất một active owner; không revoke owner cuối cùng.
- Guest category không cycle và child depth bằng parent + 1.
- RSVP party size không vượt invitation/guest limit nếu không có owner override.
- Template version đúng product type của surface/recap và đã released.
- Media recap/publish ở trạng thái ready; wish recap ở trạng thái approved.
- Snapshot/public payload không chứa guest PII, token hoặc gift ledger.
- Gift ledger authorize owner trước mọi repository read/write/export.

## Seed local

`backend/prisma/seed.mjs` tạo dữ liệu giả idempotent: một user, wedding, owner membership, event, canonical content, theme, template/version và website draft. Seed không có password thật, token raw hoặc PII thật.
