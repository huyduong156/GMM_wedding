# Deployment và runtime

## Build artifact

- Next.js `output: "standalone"`.
- Multi-stage Dockerfile; dependency install frozen từ lockfile.
- Runtime image tối giản, non-root, không chứa `.env`, test fixture, dev dependency hoặc secret.
- Image gắn immutable Git SHA/version và scan CVE trong CI.

## Runtime contract

- Container stateless; media dùng S3-compatible storage, state dùng PostgreSQL/Redis.
- Config validate lúc start và fail fast với message không lộ secret.
- Xử lý `SIGTERM`: stop nhận request mới, drain trong deadline, đóng DB/telemetry.
- Filesystem read-only khi khả thi; không mount Docker socket; drop capability không cần.
- Web và worker chạy process/image role riêng dù tái sử dụng cùng artifact/code.

## Environment

- Local, test, staging và production có database/bucket/credential riêng.
- `.env.example` chỉ chứa tên biến và giá trị giả an toàn.
- Secret inject qua platform secret manager/runtime environment.
- Feature flag server-side có owner, expiry và fallback.

## Deployment sequence

1. CI lint/typecheck/unit/integration/build/security scan.
2. Build immutable image và smoke test chính image đó.
3. Backup/readiness check khi migration rủi ro.
4. Chạy migration one-off theo expand-contract.
5. Deploy canary/rolling với health gate.
6. Theo dõi error/latency/business SLI.
7. Rollback app hoặc roll-forward migration theo runbook.

## CI/CD gates

- Lockfile/frozen install.
- OpenAPI lint và breaking-change check.
- Migration drift/destructive-change review.
- Secret scan, dependency audit, container scan.
- Cross-tenant/security integration tests.
- Health endpoint và image smoke test.

## Local integration

Root Compose orchestration dùng backend, PostgreSQL và Redis khi feature cần. Migration/seed chạy command riêng; application startup không tự mutate schema. Developer có thể chạy backend trực tiếp và dependency bằng container nếu contract môi trường giống CI.

