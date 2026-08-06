# Backend testing strategy

## Mục tiêu

Test bảo vệ invariant, authorization, transaction và contract; không chạy theo coverage số học. Ưu tiên lỗi có thể làm lộ dữ liệu, mất dữ liệu hoặc tạo publication/RSVP sai.

Mỗi chức năng hoặc endpoint mới phải được tạo test đầy đủ trong cùng change. Tối thiểu phải có happy path, validation, authorization/tenant isolation, business invariant, error contract và persistence/concurrency phù hợp với rủi ro; không đánh dấu route là `Implemented` nếu test bắt buộc của nó chưa tồn tại và chưa chạy qua CI.

## Test layers

### Unit

- Domain policy, state transition, normalization, permission matrix và pure mapper.
- Không mock mọi internal function; test behavior qua public API của unit.

### Integration

- Application use case + repository với PostgreSQL thật.
- Constraint, transaction rollback, tenant scope, optimistic concurrency và migration compatibility.
- Redis/S3/provider dùng container/emulator/contract fake tại adapter boundary khi phù hợp.

### API contract

- Route auth, validation, status, error code, headers, pagination và OpenAPI conformance.
- Snapshot/golden chỉ cho stable schema; review diff có chủ đích.

### End-to-end backend journey

- Register/login -> create wedding -> publish.
- Invite token -> view -> RSVP retry/idempotency.
- Wish submit -> moderate -> public display.
- Media upload -> process -> publish eligibility.
- Cross-tenant denial và gift-ledger owner-only.

## Test data

- Factory theo module, default tối thiểu và override rõ.
- Không dùng PII thật.
- Mỗi test cô lập bằng transaction rollback, schema/database riêng hoặc cleanup deterministic.
- Clock/ID/random cố định khi assertion phụ thuộc.

## Migration tests

- Apply toàn bộ migration từ empty database.
- Upgrade từ production-like previous schema.
- Backfill idempotent/resumable.
- Schema drift check trong CI.

## Performance và resilience

- Load test burst RSVP/public read trước beta.
- Dataset đại diện cho guest/wish/media list và query plan.
- Test timeout/retry/idempotency của job/provider.
- Không chạy load test vào production hoặc provider thật thiếu phê duyệt.

## CI order

`lint -> typecheck -> unit -> integration -> OpenAPI/migration checks -> build -> image smoke`.

Flaky test là defect: quarantine có owner/expiry, không retry vô hạn để che lỗi.

