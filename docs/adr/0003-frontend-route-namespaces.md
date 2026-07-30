# ADR 0003: Frontend route namespaces

## Status

Accepted — 2026-07-30.

## Context

Owner routes previously used `/app/weddings/:weddingId/*`. The URL exposed an implementation identifier, repeated context already represented by the wedding switcher, and made the owner navigation unnecessarily long. Authentication and platform administration also need visual, permission and code boundaries distinct from the wedding workspace.

## Decision

- Use `/login` for authentication pages.
- Use `/studio/*` for the wedding currently selected in the owner workspace.
- Use `/admin/*` for platform administration.
- Keep route constants in `frontend/src/shared/config/routes.ts`.
- Redirect legacy `/app/weddings/:weddingId/*` paths to their corresponding studio route during migration.
- Keep wedding identity explicit in authenticated API requests/session context. Shorter presentation URLs do not weaken backend resource authorization.
- Keep independent `AppShell` and `AdminShell` components. Route pages live in separate auth/admin/owner slices.

## Consequences

URLs become shorter and product-facing code is easier to navigate. Deep links refer to the current wedding rather than encoding one wedding ID, so switching wedding context must be deliberate and persisted. Backend authorization remains mandatory for every resource; frontend route separation is not a security boundary.
