# Backend development workflow

## Trước khi code

1. Đọc `docs/backend/README.md` và tài liệu concern/module liên quan.
2. Xác định đây là backend-only hay thay đổi cross-system contract.
3. Với backend-only, không sửa `frontend/`, `docs/frontend/` hoặc `design-system/`.
4. Chốt acceptance criteria, authorization matrix, data/migration impact và failure mode.
5. Quyết định có cần ADR hay chỉ update backend docs.

## Trình tự implementation

1. Viết/đổi API contract và schema validation.
2. Viết use case/policy cùng test negative/cross-tenant.
3. Thêm data migration/repository nếu cần.
4. Wire route/job adapter.
5. Thêm telemetry, audit và operational fallback.
6. Chạy lint/typecheck/test/build/image smoke phù hợp phạm vi.

Contract-first không có nghĩa viết OpenAPI khổng lồ trước discovery; chỉ khóa operation đang triển khai và review breaking change.

## Pull request checklist

- Scope/backend ownership rõ, không có file frontend.
- API/OpenAPI và docs backend đồng bộ.
- Migration backward-compatible hoặc rollout plan rõ.
- Authn/authz/tenant isolation được test.
- Idempotency/concurrency/transaction được xử lý khi cần.
- Log/metric/error không lộ secret/PII.
- Dependency/provider mới có lý do và rollback.
- Test command và kết quả được ghi.

## Shared docs và ADR

Chỉ sửa `docs/shared/` khi thay đổi contract FE–BE, end-to-end flow hoặc quyết định kiến trúc dài hạn. Diff shared phải tối thiểu để giảm conflict. ADR cần có Status, Context, Decision, Alternatives và Consequences; không sửa lịch sử ADR đã superseded theo cách làm mất quyết định cũ.

## Definition of done

Feature chưa done nếu chỉ có happy path. Cần contract, authorization, validation, persistence/transaction, error states, test, telemetry và migration/rollback notes tương ứng với rủi ro.

