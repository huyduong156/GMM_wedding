# Backend source code structure

## Cấu trúc đề xuất

```text
backend/
  src/
    app/
      api/                       Next.js route handlers
      health/                    liveness/readiness
    modules/
      weddings/
        domain/
        application/
        infrastructure/
        interface/
        index.ts                 public module API
      guests/
      invitations/
      rsvps/
      wishes/
      templates/
      media/
      tasks/
      gift-ledger/
      recaps/
    platform/
      auth/                       actor/token/session primitives và adapters
      config/ database/ cache/ queue/ storage/
      logging/ telemetry/ email/ security/
    shared/
      kernel/ errors/ pagination/ result/ testing/
    jobs/
      processors/ registry.ts
    composition/
      container.ts
    tests/
      integration/ contract/ fixtures/
  prisma/
    schema.prisma
    migrations/
    seed.mjs
  openapi/
    openapi.yaml
  Dockerfile
  .dockerignore
  .env.example
```

## Quy tắc tổ chức

- Tạo module theo business capability, không theo technical bucket toàn cục như `controllers/`, `services/`, `repositories/`.
- Chỉ export qua `module/index.ts`; cấm deep import sang internals module khác.
- `shared/` phải nhỏ và không trở thành nơi chứa mọi helper. Logic có business vocabulary thuộc module.
- `platform/` chứa capability kỹ thuật dùng chung; không chứa business policy.
- Route file chỉ wiring, không trở thành service.
- Test unit colocate với source; integration/contract test đặt trong `src/tests/` khi cần composition thật.

## Naming

- File dùng `kebab-case.ts`; type/class `PascalCase`; function/variable `camelCase`.
- Use case đặt theo động từ nghiệp vụ: `publish-wedding.ts`, không dùng tên chung `wedding-service.ts`.
- Query và command tách khi behavior khác nhau, không bắt buộc áp dụng CQRS framework.
- DTO có suffix `Request`, `Response` hoặc tên operation; không expose Prisma type.

## Import boundary enforcement

- TypeScript path alias chỉ trỏ vào public module entrypoint.
- ESLint `no-restricted-imports` hoặc boundary rule chặn deep import/cycle.
- CI chạy dependency-cycle check khi source đủ lớn để công cụ mang lại giá trị.
