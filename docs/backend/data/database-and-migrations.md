# Database và migration strategy

## Trạng thái triển khai

- Prisma schema MVP đã được tạo tại `backend/prisma/schema.prisma`.
- Migration đầu tiên là `20260804085209_init_mvp_schema`.
- Data dictionary nằm tại [database schema reference](./database-schema-reference.md).
- Seed local idempotent nằm tại `backend/prisma/seed.mjs`; không chứa password, token raw hoặc PII thật.

## PostgreSQL conventions

- ID nội bộ dùng UUID/ULID theo quyết định schema; public identifier không tuần tự.
- Timestamp lưu UTC bằng kiểu timezone-aware phù hợp; timezone sự kiện lưu riêng theo IANA identifier.
- Tiền dùng minor unit integer + ISO currency; decimal chỉ dùng khi domain thật sự cần precision như trọng lượng vàng.
- Enum ổn định có thể dùng database enum hoặc check constraint; enum hay đổi cần cân nhắc lookup/text + constraint.
- JSONB chỉ cho cấu trúc linh hoạt có schema/version; field cần query/join/constraint phải chuẩn hóa.

## Constraint-first

Invariant quan trọng phải có database defense khi biểu diễn được:

- Unique tenant/resource key.
- Foreign key và delete behavior rõ ràng.
- Check cho range/state.
- Partial unique index cho active slug/soft delete khi cần.
- Transaction cho multi-write invariant.

Validation application cải thiện UX nhưng không thay database constraint.

## Migration policy

- Migration đã merge/deploy không sửa lại; tạo migration mới.
- Production chỉ dùng reviewed migration, không `db push`.
- Migration chạy one-off trước/giữa rollout theo kế hoạch, không tự chạy trong mọi replica.
- Mỗi migration có đánh giá lock duration, table rewrite, data backfill, compatibility và rollback/roll-forward.

## Expand-contract rollout

1. **Expand:** thêm nullable column/table/index tương thích code cũ.
2. Deploy code dual-read/dual-write hoặc backfill-aware.
3. Backfill theo batch có checkpoint và metric.
4. Chuyển read path sang schema mới.
5. **Contract:** thêm not-null/constraint hoặc xóa schema cũ ở release sau.

Không deploy rename/drop cột cùng lúc với code bắt đầu dùng tên mới khi có rolling deployment.

## Index và query review

- Mỗi list/filter chính có query plan trên dataset đại diện trước beta.
- Composite index theo equality prefix rồi range/sort phù hợp query.
- Tránh index dư gây write amplification.
- Slow query log/telemetry dẫn quyết định tối ưu.
- Prisma query phức tạp có thể dùng SQL typed/reviewed khi ORM tạo plan kém; không che hiệu năng vì “ORM-only”.

## Seed và fixture

- Seed production chỉ cho reference/config data an toàn và idempotent.
- Demo/test seed không chứa PII thật và không tự chạy production.
- Test factory tạo dữ liệu theo tenant và cleanup transaction/schema riêng.

Chạy seed local sau migration:

```powershell
npm --prefix .\backend run db:seed
```

## Backup và recovery

- PostgreSQL backup + point-in-time recovery khi provider hỗ trợ.
- Restore drill định kỳ; backup chưa restore thử không được coi là recovery plan.
- Retention phù hợp privacy/delete policy và môi trường.
- RPO/RTO ban đầu theo security/operations docs và được siết trước paid launch.
